#!/usr/bin/env node

/**
 * w2train.js —— 全域造兵
 *
 * 在所有城池（或 --city 指定城）的军工厂批量训练指定兵种（默认侦察机）。
 * 逐城切城 → 扫军工厂与各自队列 → 总额平分到队列未满的厂 → 逐厂下单 3001；
 * 整城队列满时改用 3004（服务端自行平摊到可用厂）。
 *
 * 队列：每厂上限 = 厂等级（实测 L9=9 / L10=10，见 formula.trainQueueCap），且**串行**，
 * 单笔即可吃满资源上限——故分散下单的目的是覆盖多厂并行，而非堆积队列条数。
 *
 * 频控：SDK 帧间隔自带随机抖动（500ms 起），命令间再叠加写前抖动。
 *
 * 用法:
 *   node scripts/w2train.js                     所有城造侦察机（资源允许的最大量）
 *   node scripts/w2train.js --army 10           指定兵种（armyId，见 3007 兵种表）
 *   node scripts/w2train.js --city <cityId>     只在指定城造
 *   node scripts/w2train.js --max 100           每厂最多造 100（不填=不限，仅受资源约束）
 *   node scripts/w2train.js --dry               只模拟计算，不下单
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../lib/config.js';
import { W2Client, p } from '../lib/sdk.js';
import { fmtNum as fmt, fmtDur as fmtDurMs } from '../lib/format.js';
import { parseCityList, parseBuildings49, parse3006, parse2003, parse2026 } from '../lib/proto.js';
import { trainResCap, trainPopCap, trainFinishMs, trainQueueCap, splitEvenly } from '../lib/formula.js';
import { DEFAULT_ARMY_ID, requireArmy, armyUnit } from '../lib/army.js';

const argv = process.argv.slice(2);
const arg = (n, d) => {
  const i = argv.indexOf('--' + n);
  return i >= 0 && i + 1 < argv.length ? argv[i + 1] : d;
};
const has = (n) => argv.includes('--' + n);

const isU32 = (value, allowZero = true) => {
  if (!/^\d+$/.test(value)) return false;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed <= 0xffffffff && (allowZero || parsed > 0);
};
const isU64 = (value) => /^\d+$/.test(value) && BigInt(value) <= 0xffffffffffffffffn;
const armyArg = arg('army', String(DEFAULT_ARMY_ID));
const maxArg = arg('max', '');
const cityArg = arg('city', '');
if (!isU32(armyArg, false)) throw new Error('--army 必须是正整数兵种 ID');
if (maxArg && !isU32(maxArg)) throw new Error('--max 必须是非负整数');
if (cityArg && !isU64(cityArg)) throw new Error('--city 必须是无符号 64 位城池 ID');
const ARMY_ID = Number(armyArg);
// 兵种合法性：数据表（protocol/army.json，由 3006/3007 导出）是权威清单
const ARMY = requireArmy(ARMY_ID);
// 计数单位随兵种变（侦察机「架」、卡车「辆」……），统一由数据表推导
const UNIT = armyUnit(ARMY_ID);
const MAX_PER_PLANT = maxArg ? Number(maxArg) : Infinity;
const ONLY_CITY = cityArg;
const DRY = has('dry');

// 频控抖动：每次写操作前随机等待
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const jitter = () => sleep(300 + Math.floor(Math.random() * 500));

// ---------- 解析器见 lib/proto.js（parseCityList / parseBuildings49 / parse3006 / parse2003 / parse2026） ----------

const fmtDur = (ms) => fmtDurMs(ms, true);

(async function main() {
  const lp = config.loginParams();
  const gs = config.gameServer();
  if (!gs || !lp) {
    console.log('尚未登录：请先运行 npm run login');
    process.exit(1);
  }

  const c = new W2Client({ host: gs.host, port: gs.port, loginParams: lp });
  try {
    await c.connect();
  } catch (e) {
    console.log('连接失败:', e.message);
    process.exit(1);
  }

  const mustRaw = async (cmd, params) => {
    const r = await c.call(cmd, params);
    if (!r.ok) throw new Error(`cmd=${cmd} 请求失败${r.message ? `：${r.message}` : ''}`);
    if (!r.raw) throw new Error(`cmd=${cmd} 响应缺少原始数据`);
    return r.raw;
  };

  // 城池列表
  const cities = parseCityList(await mustRaw(2001, Buffer.alloc(0)));
  const targets = ONLY_CITY ? cities.filter((x) => x.cityId === ONLY_CITY) : cities;
  if (!targets.length) {
    console.log('未找到目标城池');
    c.close();
    return;
  }
  console.log(`共 ${cities.length} 座城池，本次处理 ${targets.length} 座\n`);

  // 记录操作前的当前城，全部结束后切回（当前城 = 1005.activeCityId）；读取失败只放弃还原
  const base = await c.call(1005, Buffer.alloc(0), {
    fields: [
      ['game_status', 'u32'],
      ['diamond_owned', 'u32'],
      ['active_city_id', 'u64'],
    ],
  });
  const originCityId = base.active_city_id?.toString();

  // 兵种属性取自数据表（tools/genarmy.js 从 3006/3007 导出，与服务器下发一致）。
  // 运行期单价/耗时仍逐城实时读 3006（单价全域一致，但耗时受城内加成影响）。
  const armyPopulation = ARMY.population || 0;
  console.log(`兵种确认: ${ARMY.name}（人口占位 ${armyPopulation || '未知'}）\n`);

  const report = [];
  let totalTrain = 0;

  for (const city of targets) {
    await jitter();
    // 切城（切城后 17001/2003 均为该城数据）
    const sw = await c.call(2002, p.u64(city.cityId));
    if (!sw.ok) {
      console.log(`✗ ${city.name}: 切城失败`);
      continue;
    }

    // 读取阶段逐请求校验后解析：非成功响应无 raw，直接取用会崩。
    // 失败跳城而非中止——脚本无断点续跑，中途退出会让补跑对已下单的城重复下单。
    let plants;
    let res;
    let popIdle;
    try {
      // 军工厂（BuildingType.ARMS_PLANT = 14）
      plants = parseBuildings49(await mustRaw(17001, Buffer.alloc(0)), 1)
        .filter((b) => b.proto === 14);
      // 当前城资源（2003）与空闲人口（2026，人口约束的权威读数）
      res = parse2003(await mustRaw(2003, Buffer.alloc(0)));
      popIdle = parse2026(await mustRaw(2026, Buffer.alloc(0))).popIdle;
    } catch (e) {
      console.log(`✗ ${city.name}: 数据读取失败（${e.message}），跳过该城`);
      continue;
    }
    if (!plants.length) {
      console.log(`○ ${city.name}: 无军工厂，跳过`);
      continue;
    }
    const resBefore = { ...res };

    console.log(`━━ ${city.name} (${city.x},${city.y}) 军工厂×${plants.length}`);
    console.log(`   资源: 粮 ${fmt(res.food)} | 钢 ${fmt(res.steel)} | 矿 ${fmt(res.mineral)} | 油 ${fmt(res.oil)}`);
    console.log(`   空闲人口: ${fmt(popIdle)}${armyPopulation > 0 ? `（每单位训练占 ${armyPopulation}，人口最多支持 ${fmt(trainPopCap(popIdle, armyPopulation))} ${UNIT}）` : ''}`);

    let cityTrain = 0;
    let cityFinish = 0;
    const plantReports = [];

    // 第一遍：收集各厂该兵种的规格（单价/耗时）与当前队列深度；单厂读取失败只跳该厂
    const specs = [];
    for (const plant of plants) {
      await jitter();
      let info;
      try {
        info = parse3006(await mustRaw(3006, p.u64(plant.bid)));
      } catch (e) {
        plantReports.push(`   ○ 厂#${plant.bid.slice(-3)}(L${plant.level}): 规格读取失败，本厂跳过（${e.message}）`);
        continue;
      }
      const spec = info.trainables[ARMY_ID];
      const depth = (info.training || []).length;
      const cap = trainQueueCap(plant.level);
      if (spec) specs.push({ plant, spec, depth, cap, free: Math.max(0, cap - depth) });
      else plantReports.push(`   ○ 厂#${plant.bid.slice(-3)}(L${plant.level}): 不支持该兵种`);
    }
    if (!specs.length) {
      plantReports.forEach((s) => console.log(s));
      console.log('');
      continue;
    }

    // 分配策略：总量只分给「还有空槽」的厂，满槽厂跳过并把份额转给有空位的厂。
    // 队列是串行的（同厂第 2 笔在队首产完前不消耗时间，实测），且单笔可装下全城
    // 资源上限，故队列上限只约束笔数；这也就是「总额平摊到队列已满的厂会让份额白白失败」的原因。
    const s0 = specs[0].spec;
    if (s0.nuclear > 0) {
      plantReports.push('   ○ 该兵种需要核资源；当前脚本未验证核资源余额字段，为避免超额下单而跳过');
      plantReports.forEach((s) => console.log(s));
      console.log('');
      continue;
    }
    const open = specs.filter((x) => x.free > 0);
    const fullCount = specs.length - open.length;
    // 各可用厂的队列余量（每下单 1 笔扣 1；转移订单时据此选目标，防超出该厂上限）
    const queueLeft = new Map(open.map((x) => [x.plant.bid, x.free]));

    const totalAffordable = trainResCap(res, { food: s0.food, mineral: s0.mineral, oil: s0.oil, steel: s0.steel });
    const totalByPop = trainPopCap(popIdle, armyPopulation);
    // 每厂上限只对真正会下单的厂生效（满槽厂不下单，不该抬高总量）
    const effectivePlants = open.length || specs.length;
    const targetTotal = Math.min(totalAffordable, totalByPop, MAX_PER_PLANT * effectivePlants);

    if (targetTotal === 0) {
      const why = totalByPop === 0
        ? `受空闲人口限制（${fmt(popIdle)} < 每${UNIT} ${armyPopulation}）`
        : `资源不足 1 ${UNIT}（需 粮${s0.food} 矿${s0.mineral} 油${s0.oil} 钢${s0.steel}/${UNIT}）`;
      plantReports.push(`   ○ ${why}`);
      plantReports.forEach((s) => console.log(s));
      console.log(`   余量: 粮 ${fmt(res.food)} | 钢 ${fmt(res.steel)} | 矿 ${fmt(res.mineral)} | 油 ${fmt(res.oil)}`);
      console.log('');
      continue;
    }

    // 人口预算：实际下单时逐笔扣减；批量遇非队列原因被拒后停止该城剩余尝试
    let popRemain = totalByPop === Infinity ? Infinity : targetTotal;

    if (!open.length) {
      // 全城队列已满（产能吃满的城常见）：单笔 3001 必被拒，改用 3004 交服务端平摊
      // ——队列可能在两次请求之间释放，或服务端可接纳本地读数之外的情形。
      plantReports.push(`   ○ 该城 ${specs.length} 厂队列已满（上限 = 厂等级），改用 3004 按厂平摊`);
      // 服务端把总量平摊到各厂（实测），故完工时间按「平均份额 × 单件耗时」估算
      const share = Math.ceil(targetTotal / specs.length);
      const estFinish = trainFinishMs(s0.time, share);
      const estAt = new Date(Date.now() + estFinish).toLocaleTimeString('zh-CN', { hour12: false });
      if (DRY) {
        plantReports.push(`   ▷ 将发 3004: 锚点厂#${specs[0].plant.bid.slice(-3)} 数量 ${fmt(targetTotal)} ${UNIT}` +
          `（服务端平摊，每厂约 ${fmt(share)}，约 ${fmtDur(estFinish)} 完成）`);
        res.food -= s0.food * targetTotal;
        res.steel -= s0.steel * targetTotal;
        res.mineral -= s0.mineral * targetTotal;
        res.oil -= s0.oil * targetTotal;
        cityTrain += targetTotal;
        cityFinish = Math.max(cityFinish, estFinish);
      } else {
        await jitter();
        const t = await c.call(3004, p.cat(p.u64(specs[0].plant.bid), p.u32(ARMY_ID), p.u32(targetTotal)));
        if (t.ok) {
          plantReports.push(`   ★ 3004 受理 ${fmt(targetTotal)} ${UNIT}（服务端平摊，每厂约 ${fmt(share)}，约 ${fmtDur(estFinish)} 完成，约 ${estAt}）`);
          res.food -= s0.food * targetTotal;
          res.steel -= s0.steel * targetTotal;
          res.mineral -= s0.mineral * targetTotal;
          res.oil -= s0.oil * targetTotal;
          cityTrain += targetTotal;
          cityFinish = Math.max(cityFinish, estFinish);
        } else {
          plantReports.push(`   ○ 3004 未受理（${t.message || '无文案'}）——队列确实已满，等释放后下次运行再补`);
        }
      }
    } else {
      // 总额平分到有空槽的厂。每厂每轮只下一笔（占 1 槽），平摊而非堆积到少数厂，
      // 是因为各厂串行产队、同时开工的厂数决定全城产能。
      const allocations = splitEvenly(targetTotal, open.length);
      if (fullCount > 0) {
        plantReports.push(`   ○ ${fullCount} 个厂队列已满，份额已转给 ${open.length} 个可用厂（上限 = 厂等级）`);
      }

      // 第二遍：逐厂下单
      for (let i = 0; i < open.length; i++) {
        const { plant, spec, cap } = open[i];
        let amount = allocations[i];
        if (amount === 0) {
          plantReports.push(`   ○ 厂#${plant.bid.slice(-3)}(L${plant.level}): 平分后不足 1 ${UNIT}`);
          continue;
        }
        if (queueLeft.get(plant.bid) <= 0) {
          plantReports.push(`   ○ 厂#${plant.bid.slice(-3)}(L${plant.level}): 跳过（队列余量已被前序订单占用）`);
          continue;
        }
        if (popRemain !== Infinity) {
          if (popRemain <= 0) {
            plantReports.push(`   ○ 厂#${plant.bid.slice(-3)}(L${plant.level}): 跳过（人口预算已用尽）`);
            continue;
          }
          amount = Math.min(amount, popRemain);
        }

        const finishMs = trainFinishMs(spec.time, amount);
        const finishAt = new Date(Date.now() + finishMs).toLocaleTimeString('zh-CN', { hour12: false });

        if (DRY) {
          plantReports.push(`   ▷ 厂#${plant.bid.slice(-3)}(L${plant.level}): 将造 ${fmt(amount)} ${UNIT}，需 ${fmtDur(finishMs)}（约 ${finishAt} 完成）`);
          res.food -= spec.food * amount;
          res.steel -= spec.steel * amount;
          res.mineral -= spec.mineral * amount;
          res.oil -= spec.oil * amount;
          if (popRemain !== Infinity) popRemain -= amount;
          queueLeft.set(plant.bid, queueLeft.get(plant.bid) - 1);
          cityTrain += amount;
          cityFinish = Math.max(cityFinish, finishMs);
        } else {
          await jitter();
          const t = await c.call(3001, p.cat(p.u64(plant.bid), p.u32(ARMY_ID), p.u32(amount)));
          if (t.ok) {
            plantReports.push(`   ★ 厂#${plant.bid.slice(-3)}(L${plant.level}): 下单 ${fmt(amount)} ${UNIT}，${fmtDur(finishMs)}（约 ${finishAt} 完成）`);
            res.food -= spec.food * amount;
            res.steel -= spec.steel * amount;
            res.mineral -= spec.mineral * amount;
            res.oil -= spec.oil * amount;
            if (popRemain !== Infinity) popRemain -= amount;
            queueLeft.set(plant.bid, queueLeft.get(plant.bid) - 1);
            cityTrain += amount;
            cityFinish = Math.max(cityFinish, finishMs);
          } else {
            // 服务端对所有拒绝原因（队列满/资源/人口）返回同一状态码，故不判断文案：
            // 重读 3006 看该厂队列是否真满——满说明本地读数与下单之间存在竞态，份额转给
            // 同城还有空槽的厂；未满则视为资源/人口约束，本城剩余订单不再尝试。
            await jitter();
            // 拒单复核本身也可能失败：读不到队列深度时按「复核失败」处理，不把订单转厂
            let nowDepth;
            try {
              nowDepth = (parse3006(await mustRaw(3006, p.u64(plant.bid))).training || []).length;
            } catch (e) {
              plantReports.push(`   ✗ 厂#${plant.bid.slice(-3)}(L${plant.level}): 下单失败且队列复核失败（${e.message}），份额作废`);
              continue;
            }
            if (nowDepth >= cap) {
              queueLeft.set(plant.bid, 0);
              const target = open.find((x) => x.plant.bid !== plant.bid && queueLeft.get(x.plant.bid) > 0);
              if (target) {
                await jitter();
                const t2 = await c.call(3001, p.cat(p.u64(target.plant.bid), p.u32(ARMY_ID), p.u32(amount)));
                if (t2.ok) {
                  plantReports.push(`   ★ 厂#${target.plant.bid.slice(-3)}(L${target.plant.level}): 下单 ${fmt(amount)} ${UNIT}（原厂队列已满，份额已转移）`);
                  res.food -= spec.food * amount;
                  res.steel -= spec.steel * amount;
                  res.mineral -= spec.mineral * amount;
                  res.oil -= spec.oil * amount;
                  if (popRemain !== Infinity) popRemain -= amount;
                  queueLeft.set(target.plant.bid, queueLeft.get(target.plant.bid) - 1);
                  cityTrain += amount;
                  cityFinish = Math.max(cityFinish, finishMs);
                  continue;
                }
              }
              plantReports.push(`   ✗ 厂#${plant.bid.slice(-3)}(L${plant.level}): 下单失败（队列已满，同城无可转移的可用厂）`);
              continue;
            }
            if (popRemain !== Infinity) popRemain = 0;   // 非队列原因：本城停止尝试
            plantReports.push(`   ✗ 厂#${plant.bid.slice(-3)}(L${plant.level}): 下单失败${t.message ? '（' + t.message + '）' : ''}（本城剩余订单已跳过）`);
          }
        }
      }
    }

    plantReports.forEach((s) => console.log(s));
    // 操作后的资源余量（ dry 模式为模拟值 ）
    console.log(`   余量: 粮 ${fmt(res.food)} | 钢 ${fmt(res.steel)} | 矿 ${fmt(res.mineral)} | 油 ${fmt(res.oil)}`);
    if (cityTrain > 0) {
      console.log(`   小计: ${fmt(cityTrain)} ${UNIT} | 全部完成约 ${fmtDur(cityFinish)}后`);
    }
    console.log('');
    totalTrain += cityTrain;
    report.push({ city: city.name, cityId: city.cityId, x: city.x, y: city.y, trained: cityTrain, before: resBefore, after: res });
  }

  console.log('—— 总报告 ——');
  console.log(`下单合计: ${fmt(totalTrain)} ${UNIT}`);
  for (const r of report) {
    if (r.trained > 0) {
      console.log(`   ${r.city}: ${fmt(r.trained)} ${UNIT}`);
    }
  }

  // 保存训练状态快照（.train_state.local.json）
  try {
    const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
    const stateFile = path.join(rootDir, '.train_state.local.json');
    const stateData = {
      timestamp: Date.now(),
      armyId: ARMY_ID,
      dry: DRY,
      totalTrained: totalTrain,
      cities: report.map((r) => ({
        cityId: r.cityId,
        name: r.city,
        x: r.x,
        y: r.y,
        trained: r.trained,
        after: r.after,
      })),
    };
    fs.writeFileSync(stateFile, JSON.stringify(stateData, null, 2) + '\n');
  } catch (e) {
    // 写入状态失败不影响主流程
  }

  // 切回操作前的当前城
  if (originCityId) {
    await jitter();
    const back = await c.call(2002, p.u64(originCityId));
    if (back.ok) console.log(`已切回操作前的城池（cityId=${originCityId}）`);
  }

  c.close();
})();
