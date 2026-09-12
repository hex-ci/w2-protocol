#!/usr/bin/env node

/**
 * w2transport.js —— 全域资源智能调度（特化产需模型）
 *
 * 模型（三层）：
 * 1. 产需层：每城实时计算「实收产量 P = basic_output × (nature+tech+officer)/100」、
 *    「满负荷造兵需求 D = 工厂产能 × 侦察机单价」、「24h 底仓线 floor = D × 24」；
 * 2. 平衡层：缺口 = max(0, floor - 库存)，富余 = max(0, 库存 - floor)；
 * 3. 调度层：
 *    - 阶段1【保底补料，无条件优先】任何城低于 24h 底仓线的资源缺口，从最近富余城调入；
 *    - 阶段2【仓城堆积】阶段1 后仍富余的资源，向「非该资源主产城」的中心仓归集，
 *      突破容量上限持续堆积；仓城自己也按满负荷造兵，来料 ≫ 消耗，互不冲突；
 *    - 黄金无造兵需求，沿用旧「超容量 75% 归集」逻辑。
 *
 * 核心仓规则：仓必须是非该资源主产城（资源田占比 <50%），
 *   在合格候选中取「到各发货方加权距离（权重=富余速率）」最小者。
 *
 * 用法:
 *   node scripts/w2transport.js --dry              模拟计算并打印调度计划，不下单
 *   node scripts/w2transport.js                    执行实际运输调度
 *   node scripts/w2transport.js --profile          只打印全域产需账本与缺口/富余，不下单
 *   node scripts/w2transport.js --hours 24         训练底仓线小时数（默认 24）
 *   node scripts/w2transport.js --fuel-reserve 6   发车油料保留线小时数（默认 6）
 *   node scripts/w2transport.js --threshold 75     黄金超容阈值（默认 75）
 *   node scripts/w2transport.js --min-fill 12000   阶段1 最小发车量（低于此值攒下次再发）
 *   node scripts/w2transport.js --min-stack 120000 阶段2 最小发车量
 *   node scripts/w2transport.js --clean-route      忽略拓扑缓存，强制重算协作组
 *   node scripts/w2transport.js --hub-steel <城>   手工指定某资源中心仓（城名或 cityId）
 *   node scripts/w2transport.js --no-progress      关闭扫描期进度输出（也可用 W2_NO_PROGRESS=1）
 *
 * 关键约束：每城同时在外部队数 ≤ 该城司令部等级（出征位，实测标定）。
 * 每笔发车占 1 位，与车队规模无关，故按「同路合并 + 多资源混装」凑大批量发送。
 *
 * 中心仓推导结果会随拓扑缓存一并落盘，
 * 供其他脚本读取展示，保证跨脚本看到的仓选口径一致。
 */

import config from '../lib/config.js';
import { W2Client, p } from '../lib/sdk.js';
import { computeWidths, displayWidth, formatRow, renderTable } from '../lib/table.js';
import { fmtNum, fmtDur, fmtShort } from '../lib/format.js';
import { buildTransport19003Payload } from '../lib/proto.js';
import {
  RES_KEYS, RES_CN, TRUCK_LOAD, distance, oilPerTruck, estOil, realMarchSec,
  trucksFor, fuelBudgetOf, trucksByBudget,
} from '../lib/formula.js';
import { scanDomain, citySurplus, cityDeficit, jitter } from '../lib/scan.js';
import { DispatchKey } from '../lib/expedition.js';
import { createProgress } from '../lib/progress.js';
import { checkCachedTopology, computeClusters, writeTopologyCache } from '../lib/topology.js';

const argv = process.argv.slice(2);
const arg = (n, d) => {
  const i = argv.indexOf('--' + n);
  return i >= 0 && i + 1 < argv.length ? argv[i + 1] : d;
};
const has = (n) => argv.includes('--' + n);

const DRY = has('dry');
const PROFILE = has('profile');
const CLEAN_ROUTE = has('clean-route');
// 进度反馈模式：--no-progress / W2_NO_PROGRESS=1 时完全静默（供结构对比与日志采集）
const NO_PROGRESS = has('no-progress') || process.env.W2_NO_PROGRESS === '1';
const FLOOR_HOURS = Math.max(1, parseInt(arg('hours', '24'), 10) || 24);
// 发车油料保留线：城内石油里只留 N 小时的训练用量作底线，其余可用于发车。
// 不能用 FLOOR_HOURS（24h）——油是双用途资源，训练底仓线过高会锁死全部发车预算。
const FUEL_RESERVE_HOURS = Math.max(0, parseInt(arg('fuel-reserve', '6'), 10) || 6);
// 单笔发车的卡车上限：油耗模型实测标定范围是 2~8000 辆，超过未验证；
// 拆分为多笔同样能完成任务，代价只是多几次 19003 调用。
const MAX_TRUCKS_PER_DISPATCH = Math.max(1, parseInt(arg('max-trucks', '8000'), 10) || 8000);
const OVERFLOW_PCT = Math.min(95, Math.max(20, parseInt(arg('threshold', '75'), 10) || 75)) / 100;

// 常量定义（TRUCK_LOAD / RES_KEYS / RES_CN / 行军数值模型见 lib/formula.js）
// 最小发车量：出征位宝贵（每城上限=司令部等级），低于阈值的小批量攒到下次运行再发。
// 阶段1（保底）宽松些，阶段2（堆积）要求更大量以免碎片占位。
const MIN_FILL_AMOUNT = Math.max(TRUCK_LOAD, parseInt(arg('min-fill', '12000'), 10) || 12000);
const MIN_STACK_AMOUNT = Math.max(TRUCK_LOAD, parseInt(arg('min-stack', '120000'), 10) || 120000);
// 资源田 proto：3=粮田 4=钢田 5=油田 6=矿田（解析常量见 lib/proto.js 的 FIELD_PROTO）

// 命令行显式指定核心仓覆盖（cityId 或城名，缺省时自动推导）
const CLI_OVERRIDES = {
  steel: arg('hub-steel', ''),
  mineral: arg('hub-mineral', ''),
  oil: arg('hub-oil', ''),
  food: arg('hub-food', ''),
  gold: arg('hub-gold', ''),
};

// 工具函数
const fmt = fmtNum;

// ---------- 主流程 ----------

(async function main() {
  const lp = config.loginParams();
  const gs = config.gameServer();
  if (!gs || !lp) {
    console.log('尚未登录：请先运行 npm run login');
    process.exit(1);
  }

  const prog = createProgress({ mode: NO_PROGRESS ? 'off' : null });
  const c = new W2Client({ host: gs.host, port: gs.port, loginParams: lp });

  const dispatchKey = new DispatchKey().bind(c);

  prog.stage('连接服务器…');
  try {
    await c.connect();
  } catch (e) {
    prog.done();
    console.log('连接服务器失败:', e.message);
    process.exit(1);
  }

  // 等待 26022 调度 key（会话内约 1 分钟刷新，发帧须用最新值）
  prog.stage('等待调度 key…');
  await dispatchKey.waitFresh(2500);
  if (!dispatchKey.key) {
    prog.done();
    console.log('未接收到 26022 调度 key，无法组装远征帧');
    c.close();
    process.exit(1);
  }

  // 扫描全域（城池列表 → 逐城切城拉取 → 出征位统计由 lib/scan.js 统一编排）
  let cachedTopology = null;
  let cities = [];
  let state = [];
  let originCityId;
  let bonus19001 = null;
  try {
    ({ cities, state, originCityId, bonus19001 } = await scanDomain(c, {
      floorHours: FLOOR_HOURS,
      onCities: (cs) => { cachedTopology = checkCachedTopology(cs, { cleanRoute: CLEAN_ROUTE }); },
      onCity: (st, i, total) => prog.update(i + 1, total),
      onStage: (label, meta) => prog.stage(label, meta || {}),
    }));
  } catch (e) {
    prog.done();
    console.log(e.message);
    c.close();
    process.exit(1);
  }

  // 发车油料预算：物理石油 − N 小时训练保留量（保留线见 FUEL_RESERVE_HOURS）。
  // 以物理石油为准：服务器按城内实有石油校验，在途油未到城、不可用于发车。
  const cityFuelBudget = (s) => fuelBudgetOf(s.physOil, s.D.oil, FUEL_RESERVE_HOURS);

  // ---------- 拓扑与核心仓推导 ----------
  let clusters;
  let topoMsg;
  if (cachedTopology) {
    clusters = cachedTopology.clusters;
    topoMsg = '【拓扑就绪】命中空间指纹缓存，复用已有地缘协作组。';
  } else {
    clusters = computeClusters(cities);
    topoMsg = '【拓扑自愈】已重新计算地缘协作组。';
  }

  // 进度行活跃期间的业务输出统一延迟到 done() 之后打印，避免与进度行串行
  const deferred = [];

  // 核心仓：非该资源主产城 + 到「净产货城」加权距离最小（权重 = 稳态富余速率 P−D）
  // 黄金延续旧逻辑：容量最大且地缘中心（黄金无造兵需求、无主产概念）
  function resolveHub(resKey, override) {
    if (override) {
      const hit = state.find((s) => s.cityId === override || s.name === override);
      if (hit) return hit;
      deferred.push(`注意: 未找到指定仓 ${override}（资源 ${resKey}），改用自动推导`);
    }
    if (resKey === 'gold') {
      const maxCap = Math.max(...state.map((s) => s.goldCap || 0));
      if (maxCap <= 0) return null;
      const cands = state.filter((s) => (s.goldCap || 0) >= maxCap * 0.8);
      if (cands.length <= 1) return cands[0] || state[0];
      let best = null;
      for (const cand of cands) {
        let total = 0;
        for (const other of state) if (other.cityId !== cand.cityId) total += distance(cand, other);
        const avg = total / Math.max(1, state.length - 1);
        if (!best || avg < best.avg) best = { city: cand, avg };
      }
      return best.city;
    }
    const flowWeight = (s) => Math.max(0, s.P[resKey] - s.D[resKey]);
    const scored = state
      .filter((s) => s.special !== resKey) // 非主产城才有资格
      .map((cand) => {
        let score = 0;
        for (const src of state) {
          if (src.cityId === cand.cityId) continue;
          const w = flowWeight(src);
          if (w > 0) score += w * distance(cand, src);
        }
        return { city: cand, score };
      })
      .sort((a, b) => a.score - b.score);
    return scored[0]?.city || null;
  }

  const superHubs = {
    steel: resolveHub('steel', CLI_OVERRIDES.steel),
    mineral: resolveHub('mineral', CLI_OVERRIDES.mineral),
    oil: resolveHub('oil', CLI_OVERRIDES.oil),
    food: resolveHub('food', CLI_OVERRIDES.food),
    gold: resolveHub('gold', CLI_OVERRIDES.gold),
  };

  // 拓扑与中心仓落盘：供其他脚本读取展示（superHubs 存 cityId 便于跨脚本引用）
  writeTopologyCache({ cities, clusters, superHubs });

  prog.done('扫描全域并推导拓扑');
  for (const m of deferred) console.log(m);
  console.log(topoMsg);
  console.log(`全域共 ${cities.length} 座城池，划分 ${clusters.length} 个地缘协作组`);
  console.log(
    `中心仓: 粮=[${superHubs.food?.name || '-'}] 钢=[${superHubs.steel?.name || '-'}] ` +
    `矿=[${superHubs.mineral?.name || '-'}] 油=[${superHubs.oil?.name || '-'}] 金=[${superHubs.gold?.name || '-'}]`
  );

  // ---------- 产需账本 ----------

  const totalDeficit = {};
  const totalSurplus = {};
  for (const r of RES_KEYS) {
    totalDeficit[r] = state.reduce((a, s) => a + cityDeficit(s, r), 0);
    totalSurplus[r] = state.reduce((a, s) => a + citySurplus(s, r), 0);
  }

  if (PROFILE) {
    console.log(`\n—— 全域产需账本（底仓线 ${FLOOR_HOURS}h）——\n`);
    const columns = [
      { header: '城池', width: 10 },
      { header: '特化', width: 5 },
      { header: '厂', width: 3, align: 'right' },
      { header: '产能架/h', width: 8, align: 'right' },
      { header: '自持架/h', width: 8, align: 'right' },
      { header: '出征位', width: 9, align: 'right' },
      { header: '粮 产/需', width: 16, align: 'right' },
      { header: '钢 产/需', width: 16, align: 'right' },
      { header: '矿 产/需', width: 16, align: 'right' },
      { header: '油 产/需', width: 16, align: 'right' },
      { header: '缺口', width: 20 },
      { header: '富余', width: 20 },
    ];
    const rows = state.map((s) => {
      const U = Math.min(...RES_KEYS.map((r) => (s.cost[r] > 0 ? s.P[r] / s.cost[r] : Infinity)));
      const pair = (r) => `${fmtShort(s.P[r])}/${fmtShort(s.D[r])}`;
      const defs = RES_KEYS.filter((r) => cityDeficit(s, r) > 1).map((r) => `${RES_CN[r]}${fmtShort(cityDeficit(s, r))}`);
      const surs = RES_KEYS.filter((r) => citySurplus(s, r) > 1).map((r) => `${RES_CN[r]}${fmtShort(citySurplus(s, r))}`);
      const slotText = s.slotsCap === Infinity ? '—' : `${s.slotsUsed}/${s.slotsCap}`;
      return [
        s.name,
        s.special ? RES_CN[s.special] : '—',
        String(s.plants.length),
        s.Cin.toFixed(0),
        Number.isFinite(U) ? U.toFixed(0) : '∞',
        slotText,
        pair('food'), pair('steel'), pair('mineral'), pair('oil'),
        defs.join(' ') || '—', surs.join(' ') || '—',
      ];
    });
    console.log(renderTable(columns, rows));
    console.log(`\n全域缺口: ` + RES_KEYS.map((r) => `${RES_CN[r]}${fmtShort(totalDeficit[r])}`).join('  '));
    console.log(`全域富余: ` + RES_KEYS.map((r) => `${RES_CN[r]}${fmtShort(totalSurplus[r])}`).join('  '));
    if (originCityId) await c.call(2002, p.u64(originCityId));
    c.close();
    return;
  }

  // ---------- 调度规划 ----------
  const tasks = [];

  // 规划腿：同一 (出货城 → 目的城) 的多种资源合并为一笔发车（混装，实测服务器接受），
  // 以节省出征位——每城同时在外部队数上限 = 司令部等级（HQ 等级，实测标定）。
  // 一条路线可拆多笔（每笔 ≤ MAX_TRUCKS_PER_DISPATCH 辆），每笔各占 1 个出征位。
  // 约束：石油预算（物理）、可用卡车、单笔卡车上限、本城剩余出征位。
  const pending = new Map(); // `${srcId}->${dstId}` -> [ {phase, src, dst, distance, carry, trucks} ]
  function planLeg(src, dst, resKey, amount, phase) {
    const d = distance(src, dst);
    if (src.availTrucks <= 0) return 0;
    const key = `${src.cityId}->${dst.cityId}`;
    let list = pending.get(key);
    if (!list) { list = []; pending.set(key, list); }

    // 当前笔：未满则续装；已满/不存在则开新笔（需出征位）
    let p = list.length ? list[list.length - 1] : null;
    if (!p || p.trucks >= MAX_TRUCKS_PER_DISPATCH) {
      if (src.slotsFree <= 0) return 0; // 无出征位开新笔
      p = { phase, src, dst, distance: d, carry: {}, trucks: 0 };
      list.push(p);
      src.slotsFree -= 1;
    }

    const perTruckOil = oilPerTruck(d) + (resKey === 'oil' ? TRUCK_LOAD : 0);
    const budget = cityFuelBudget(src);
    if (budget <= 0) return 0;
    const truckRoom = MAX_TRUCKS_PER_DISPATCH - p.trucks;
    const affordable = trucksByBudget(budget, perTruckOil);
    const n = Math.min(trucksFor(amount), src.availTrucks, affordable, truckRoom);
    if (n <= 0) return 0;
    const carry = Math.min(Math.round(amount), n * TRUCK_LOAD);
    const trucks = trucksFor(carry);
    const fuel = Math.round(oilPerTruck(d) * trucks);
    src.stock.oil = Math.max(0, src.stock.oil - fuel - (resKey === 'oil' ? carry : 0));
    src.physOil = Math.max(0, src.physOil - fuel - (resKey === 'oil' ? carry : 0));
    src.availTrucks -= trucks;
    src.stock[resKey] -= carry;

    if (p.trucks === 0 && p.phase !== phase) p.phase = phase;
    else if (p.phase !== phase) p.phase = '阶段1:保底补料'; // 混合来源时按最高优先展示
    p.carry[resKey] = (p.carry[resKey] || 0) + carry;
    p.trucks += trucks;
    return carry;
  }
  const flushTasks = () => {
    for (const list of pending.values()) {
      for (const p of list) {
        const carry = {};
        let total = 0;
        for (const [k, v] of Object.entries(p.carry)) {
          if (v > 0) { carry[k] = Math.round(v); total += carry[k]; }
        }
        // 碎片过滤：出征位宝贵（每城上限=司令部等级），低于阈值的小批量留在城内攒着，
        // 下次运行时数量变大再发。阶段2（堆积）阈值更高，避免把槽位浪费在零头上。
        const min = p.phase.startsWith('阶段1') ? MIN_FILL_AMOUNT : MIN_STACK_AMOUNT;
        if (total < min) continue;
        tasks.push({ phase: p.phase, src: p.src, dst: p.dst, distance: p.distance, carry, trucks: p.trucks });
      }
    }
    pending.clear();
  };

  // ---------- 阶段1：保底补料（无条件优先） ----------
  // 任何城（含仓城）低于 24h 底仓线的资源缺口，从最近富余城调入。
  // 迭代多轮：每轮按本轮物理条件推进；发车实扣物理油料，在途油到货前不可用于发车，
  // 因此被油料卡住的链路须等油到货后下次运行继续。
  function stage1Round() {
    const deficient = state
      .map((s) => ({ city: s, need: RES_KEYS.reduce((a, r) => a + cityDeficit(s, r), 0) }))
      .filter((x) => x.need > 1)
      .sort((a, b) => b.need - a.need);

    let moved = 0;
    for (const { city } of deficient) {
      for (const r of RES_KEYS) {
        let need = cityDeficit(city, r);
        if (need <= 1) continue;

        // 候选发货方：按 (是否同组 ? 0 : 1, 距离) 升序
        const myCluster = clusters.find((cl) => cl.includes(city.cityId)) || [];
        const suppliers = state
          .filter((s) => s.cityId !== city.cityId && citySurplus(s, r) > 1 && s.availTrucks > 0)
          .map((s) => ({
            s,
            inCluster: myCluster.includes(s.cityId) ? 0 : 1,
            d: distance(s, city),
          }))
          .sort((a, b) => (a.inCluster - b.inCluster) || (a.d - b.d));

        for (const { s } of suppliers) {
          if (need <= 1) break;
          const avail = citySurplus(s, r);
          if (avail <= 1) continue;
          const give = Math.min(need, avail);
          const got = planLeg(s, city, r, give, '阶段1:保底补料');
          if (got > 0) {
            need -= got;
            moved += got;
            city.stock[r] += got; // 虚拟入账，避免重复补
          } else if (s.slotsFree <= 0) {
            continue; // 该供方无出征位，试下一个
          }
        }
      }
    }
    return moved;
  }

  for (let round = 0; round < 4; round++) {
    const moved = stage1Round();
    if (moved <= 0) break;
    // 已无任何缺口时提前退出
    const stillDeficient = state.some((s) => RES_KEYS.some((r) => cityDeficit(s, r) > 1));
    if (!stillDeficient) break;
  }

  // ---------- 阶段2：仓城堆积（阶段1 用剩下的富余） ----------
  // 主产城的富余（如钢城的钢）正是仓的主要来料；禁止的只是「同类主产城之间互运」，
  // 而仓本身已按规则选为「非本资源主产城」。
  const residualDeficit = {}; // 阶段1 后仍未补齐的缺口（供报告）
  for (const r of RES_KEYS) residualDeficit[r] = state.reduce((a, s) => a + cityDeficit(s, r), 0);
  for (const r of RES_KEYS) {
    const hub = superHubs[r];
    if (!hub) continue;
    for (const s of state) {
      if (s.cityId === hub.cityId) continue;
      const avail = citySurplus(s, r);
      if (avail <= 1) continue;
      planLeg(s, hub, r, avail, '阶段2:仓城堆积');
    }
  }

  // ---------- 黄金：沿用旧逻辑（超容量 75% 归集） ----------
  const goldHub = superHubs.gold;
  if (goldHub) {
    for (const s of state) {
      if (s.cityId === goldHub.cityId) continue;
      const cap = s.goldCap || 0;
      if (cap <= 0 || s.stock.gold <= cap * OVERFLOW_PCT) continue;
      const surplus = Math.round(s.stock.gold - cap * 0.4);
      if (surplus > 100000) {
        planLeg(s, goldHub, 'gold', surplus, '阶段金:超容归集');
      }
    }
  }

  // 收口：合并后的发车单转正式任务
  flushTasks();

  // ---------- 执行与报告 ----------
  if (tasks.length === 0) {
    console.log(`模式: ${DRY ? '【模拟运算 (DRY RUN)】' : '【正式执行下单】'} | 底仓线: ${FLOOR_HOURS}h`);
    console.log('全域资源状态平衡，暂无需要调度的运输任务。');
    if (originCityId) await c.call(2002, p.u64(originCityId));
    c.close();
    return;
  }

  const totalResourceMoved = tasks.reduce((a, t) => a + Object.values(t.carry).reduce((x, y) => x + y, 0), 0);
  const totalOilCost = tasks.reduce((a, t) => a + estOil(t.distance, t.trucks), 0);
  const totalTrucksUsed = tasks.reduce((a, t) => a + t.trucks, 0);
  const phase1 = tasks.filter((t) => t.phase.startsWith('阶段1')).length;

  // 出征位占用评估：每城已用 / 上限（仅统计本批任务占用的路线数）
  const slotUse = new Map();
  for (const t of tasks) {
    slotUse.set(t.src.cityId, (slotUse.get(t.src.cityId) || 0) + 1);
  }
  const slotBusy = state.filter((s) => s.slotsCap !== Infinity && s.slotsUsed >= s.slotsCap);

  console.log(`模式: ${DRY ? '【模拟运算 (DRY RUN)】' : '【正式执行下单】'} | 底仓线: ${FLOOR_HOURS}h | 黄金超容阈值: ${Math.round(OVERFLOW_PCT * 100)}%`);
  console.log(`\n生成 ${tasks.length} 笔调度任务（阶段1 保底补料 ${phase1} 笔 + 阶段2 仓城堆积 ${tasks.length - phase1} 笔）：\n`);

  const TASK_COLUMNS = [
    { header: '序号', width: 4 },
    { header: '阶段', width: 12 },
    { header: '路线', width: 24 },
    { header: '距离', width: 8, align: 'right' },
    { header: '单程时间', width: 8, align: 'right' },
    { header: '调运物资', width: 20 },
    { header: '卡车数', width: 10, align: 'right' },
    { header: '预估油耗', width: 10, align: 'right' },
  ];

  const rows = tasks.map((t, i) => {
    const items = Object.entries(t.carry).map(([k, v]) => `${RES_CN[k] || k} ${fmt(v)}`).join(', ');
    const oil = estOil(t.distance, t.trucks);
    return [
      `#${i + 1}`,
      t.phase,
      `${t.src.name} → ${t.dst.name}`,
      `${t.distance.toFixed(1)}格`,
      fmtDur(realMarchSec(t.distance, { landSpeedAdd: bonus19001?.landSpeedAdd || 0, stationLevel: t.src.stationLevel || 0, speedFactor: bonus19001?.speedFactor || 1 }) * 1000),
      items,
      `${fmt(t.trucks)}辆`,
      `${fmt(oil)}油`,
    ];
  });

  const widths = computeWidths(TASK_COLUMNS, rows);
  const headerLine = formatRow(TASK_COLUMNS.map((col) => col.header), TASK_COLUMNS, widths);
  const sep = '─'.repeat(displayWidth(headerLine));
  console.log(headerLine);
  console.log(sep);

  for (let i = 0; i < tasks.length; i++) {
    console.log(formatRow(rows[i], TASK_COLUMNS, widths));

    const t = tasks[i];
    if (!DRY) {
      // 该城出征位已满（执行中累计；与规划阶段的 slotsFree 记账区分开），跳过后续任务
      if (t.src.slotsCap !== Infinity && t.src.slotsUsed >= t.src.slotsCap) {
        console.log(`       ⏭ [跳过] 出征位已满（${t.src.slotsUsed}/${t.src.slotsCap}），等部队返程后下次运行`);
        continue;
      }
      await jitter();
      await c.call(2002, p.u64(t.src.cityId));
      const payload = buildTransport19003Payload({ trucks: t.trucks, tx: t.dst.x, ty: t.dst.y, carry: t.carry, key: dispatchKey.key });
      const resp = await c.call(19003, payload);
      if (resp.ok) {
        t.src.slotsUsed += 1;
        console.log(`       ★ [19003 成功] 发车完成`);
      } else if (/司令部/.test(resp.message || '')) {
        // 出征位上限：标记该城，后续任务跳过
        t.src.slotsUsed = t.src.slotsCap;
        console.log(`       ✗ [19003 失败] ${resp.message}（该城剩余任务自动跳过）`);
      } else {
        console.log(`       ✗ [19003 失败] ${resp.message || '未知错误'}`);
      }
    }
  }

  console.log(sep);
  console.log(`\n—— 调度总计 ——`);
  console.log(`调运总物资: ${fmt(totalResourceMoved)}`);
  console.log(`动用总卡车: ${fmt(totalTrucksUsed)} 辆`);
  console.log(`预计总耗油: ${fmt(totalOilCost)} 油（物资/油耗能效比: ${(totalResourceMoved / Math.max(1, totalOilCost)).toFixed(1)}:1）`);
  const residual = RES_KEYS.filter((r) => residualDeficit[r] > 1);
  if (residual.length) {
    console.log(`阶段1 未补齐缺口: ` + residual.map((r) => `${RES_CN[r]}${fmtShort(residualDeficit[r])}`).join('  ') + '（受出征位/运力/油料预算限制，下次运行继续）');
  } else {
    console.log('阶段1 全部缺口已补齐。');
  }
  if (slotBusy.length) {
    console.log(`出征位已满的城池（等待部队返程释放）: ` + slotBusy.map((s) => `${s.name}(${s.slotsUsed}/${s.slotsCap})`).join('  '));
  }

  if (originCityId) {
    await jitter();
    const back = await c.call(2002, p.u64(originCityId));
    if (back.ok) console.log(`\n已切回操作前的城池（cityId=${originCityId}）`);
  }

  c.close();
})();
