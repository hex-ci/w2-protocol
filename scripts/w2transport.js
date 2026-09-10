#!/usr/bin/env node

/**
 * w2transport.js —— 全域资源智能调度与超上限积累
 *
 * 混合模式：
 * 1. 地缘就近互补：组内邻城互通短缺材料，保障各城军工厂可造侦察机；
 * 2. 专库定向超上限：各特化城池生产出的过剩长板，源源不断输往对应容量最大的专属超级仓，
 *    突破上限持续堆积；
 * 3. 拓扑指纹自愈：首次计算地缘拓扑存入 .transport_route.local.json，
 *    迁城/增减城池自动使缓存失效并就地重算；
 * 4. 联动造兵状态：优先读取 .train_state.local.json，亦可独立拉取实时数据。
 *
 * 用法:
 *   node scripts/w2transport.js --dry              模拟计算并打印调度计划，不下单
 *   node scripts/w2transport.js                    执行实际运输调度
 *   node scripts/w2transport.js --reserve 100      各城自留 100 架侦察机材料（默认 50）
 *   node scripts/w2transport.js --threshold 75     超过容量 75% 的部分触发外运（默认 75）
 *   node scripts/w2transport.js --clean-route      忽略拓扑缓存，强制重新规划路线
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../lib/config.js';
import { W2Client, p } from '../lib/sdk.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.dirname(__dirname);

const argv = process.argv.slice(2);
const arg = (n, d) => {
  const i = argv.indexOf('--' + n);
  return i >= 0 && i + 1 < argv.length ? argv[i + 1] : d;
};
const has = (n) => argv.includes('--' + n);

const DRY = has('dry');
const CLEAN_ROUTE = has('clean-route');
const RESERVE_SCOUT = Math.max(0, parseInt(arg('reserve', '50'), 10) || 50);
const OVERFLOW_PCT = Math.min(95, Math.max(20, parseInt(arg('threshold', '75'), 10) || 75)) / 100;

// 常量定义
const TRUCK_ARMY_ID = 3;
const TRUCK_LOAD = 1200;
const TRUCK_SPEED = 1150;
const MARCH_MIN_TIME = 30;
const MARCH_ONE_TILE_DISTANCE = 100000;

// 单架侦察机消耗标准
const SCOUT_COST = {
  food: 0,
  steel: 3500,
  mineral: 2000,
  oil: 6000,
};

// 命令行显式指定五大专项超级仓覆盖（可选，缺省时自动智能推导）
const CLI_OVERRIDES = {
  steel: arg('hub-steel', ''),
  mineral: arg('hub-mineral', ''),
  oil: arg('hub-oil', ''),
  food: arg('hub-food', ''),
  gold: arg('hub-gold', ''),
};

// 工具函数
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const jitter = () => sleep(300 + Math.floor(Math.random() * 400));
const fmt = (n) => Math.round(Number(n) || 0).toLocaleString('en-US');

function dist(c1, c2) {
  const dx = c1.x - c2.x;
  const dy = c1.y - c2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function calcMarchSec(d) {
  return Math.ceil(MARCH_MIN_TIME + (d * MARCH_ONE_TILE_DISTANCE) / TRUCK_SPEED);
}

function fmtDur(sec) {
  const s = Math.ceil(sec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h}时${m}分` : `${m}分`;
}

// 油耗实测模型（296 格、2~8000 车实测偏差 <2%）：单程总耗油 ≈ 0.01313 × T^0.72 × 车数，对车数线性
function oilPerTruck(d) {
  if (d <= 0) return 0;
  return 0.01313 * Math.pow(calcMarchSec(d), 0.72);
}

function estOil(d, trucks) {
  if (trucks <= 0) return 0;
  return Math.round(oilPerTruck(d) * trucks);
}

// ---------- 拓扑路由与指纹管理 ----------

const ROUTE_CACHE_FILE = path.join(ROOT, '.transport_route.local.json');

function getTopologyFingerprint(cities) {
  const fp = {};
  for (const c of [...cities].sort((a, b) => (BigInt(a.cityId) > BigInt(b.cityId) ? 1 : -1))) {
    fp[c.cityId] = [c.x, c.y];
  }
  return fp;
}

function checkCachedTopology(cities) {
  if (CLEAN_ROUTE || !fs.existsSync(ROUTE_CACHE_FILE)) return null;
  const currentFp = getTopologyFingerprint(cities);
  try {
    const cached = JSON.parse(fs.readFileSync(ROUTE_CACHE_FILE, 'utf8'));
    const fpMatch = Object.keys(currentFp).length === Object.keys(cached.fingerprint || {}).length &&
      Object.entries(currentFp).every(([cid, [x, y]]) => {
        const cachedPos = cached.fingerprint[cid];
        return cachedPos && cachedPos[0] === x && cachedPos[1] === y;
      });
    if (fpMatch && cached.clusters && cached.superHubs) {
      return cached;
    }
    console.log('检测到城池空间指纹发生变化（存在迁城/增减城），需重新推导核心仓与物流拓扑...');
  } catch (e) {
    console.log('拓扑缓存损坏，重新推导...');
  }
  return null;
}

function computeClusters(cities) {
  // 按照地缘距离（<= 75 格）进行自适应分群
  const visited = new Set();
  const clusters = [];

  for (const c of cities) {
    if (visited.has(c.cityId)) continue;
    const cluster = [c];
    visited.add(c.cityId);
    for (const other of cities) {
      if (!visited.has(other.cityId)) {
        if (cluster.some((m) => dist(other, m) < 75)) {
          cluster.push(other);
          visited.add(other.cityId);
        }
      }
    }
    clusters.push(cluster.map((m) => m.cityId));
  }
  return clusters;
}

// 综合「基础容量 + 地缘中心度」智能推导最佳专属核心仓
function selectOptimalSuperHub(stateList, capKey, overrideId) {
  if (overrideId && stateList.some((s) => s.cityId === overrideId)) {
    return overrideId;
  }
  const maxCap = Math.max(...stateList.map((s) => s.res[capKey] || 0));
  if (maxCap <= 0) return stateList[0]?.cityId;

  // 1. 筛选出容量达最高容量 80% 以上的高容量候选城
  const candidates = stateList.filter((s) => (s.res[capKey] || 0) >= maxCap * 0.8);
  if (candidates.length === 1) return candidates[0].cityId;

  // 2. 在高容量城中，选择全域平均行军距离最短（地缘中心度最高）的城
  let bestCity = candidates[0];
  let minAvgDist = Infinity;
  for (const cand of candidates) {
    let totalDist = 0;
    for (const other of stateList) {
      if (other.cityId !== cand.cityId) {
        totalDist += dist(cand, other);
      }
    }
    const avgDist = totalDist / Math.max(1, stateList.length - 1);
    if (avgDist < minAvgDist) {
      minAvgDist = avgDist;
      bestCity = cand;
    }
  }
  return bestCity.cityId;
}

function resolveAllSuperHubs(stateList, overrides = {}) {
  return {
    steel: selectOptimalSuperHub(stateList, 'steelCap', overrides.steel),
    mineral: selectOptimalSuperHub(stateList, 'mineralCap', overrides.mineral),
    oil: selectOptimalSuperHub(stateList, 'oilCap', overrides.oil),
    food: selectOptimalSuperHub(stateList, 'foodCap', overrides.food),
    gold: selectOptimalSuperHub(stateList, 'goldCap', overrides.gold),
  };
}

// ---------- 帧解析与构造 ----------

function parseCityList(raw) {
  let off = 0;
  const u8 = () => raw[off++];
  const u32 = () => { const v = raw.readUInt32BE(off); off += 4; return v; };
  const u64 = () => { const v = raw.readBigUInt64BE(off); off += 8; return v; };
  const str = () => { const L = u32(); const s = raw.subarray(off, off + L).toString('utf8'); off += L; return s; };
  const joinWar = u8();
  const count = u8();
  const list = [];
  for (let i = 0; i < count; i++) {
    const cityId = u64().toString(), name = str(), x = u32(), y = u32();
    str(); u32(); u32(); u32(); u32(); str(); u8(); u32(); u32(); u32();
    if (joinWar === 1) u32();
    u32(); u32(); u32(); u8();
    list.push({ cityId, name, x, y });
  }
  return list;
}

function parseResources(raw2003, raw2026) {
  const u32 = (o) => raw2003.readUInt32BE(o);
  const res = {
    food: u32(4),
    foodCap: u32(8),
    steel: u32(32),
    steelCap: u32(36),
    mineral: u32(52),
    mineralCap: u32(56),
    oil: u32(72),
    oilCap: u32(76),
    gold: 0,
    goldCap: 0,
  };
  if (raw2026 && raw2026.length >= 76) {
    res.gold = raw2026.readUInt32BE(68);
    res.goldCap = raw2026.readUInt32BE(72);
  }
  return res;
}

function parseTrucks(raw) {
  if (!raw || raw.length < 4) return 0;
  let o = 0;
  const n = raw.readUInt32BE(o); o += 4;
  for (let i = 0; i < n; i++) {
    const aid = raw.readUInt32BE(o); o += 4;
    const ac = raw.readUInt32BE(o); o += 4;
    if (aid === TRUCK_ARMY_ID) return ac;
  }
  return 0;
}

function buildTransport19003Payload(trucks, tx, ty, carry, key26022) {
  const buf = Buffer.alloc(93);
  let o = 0;
  buf.writeUInt8(1, o++);                     // armyKindCount = 1
  buf.writeUInt8(TRUCK_ARMY_ID, o++);         // armyId = 3 (卡车)
  buf.writeUInt32BE(trucks, o); o += 4;       // count
  buf.writeUInt32BE(tx, o); o += 4;           // targetX
  buf.writeUInt32BE(ty, o); o += 4;           // targetY
  buf.writeUInt8(2, o++);                     // expeditionType = 2 (TRANSPORT)
  buf.writeUInt8(0, o++);                     // 0
  buf.writeBigInt64BE(-1n, o); o += 8;        // commanderId = -1
  buf.writeUInt32BE(0, o); o += 4;            // 0
  buf.writeBigUInt64BE(BigInt(carry.food || 0), o); o += 8;
  buf.writeBigUInt64BE(BigInt(carry.steel || 0), o); o += 8;
  buf.writeBigUInt64BE(BigInt(carry.oil || 0), o); o += 8;
  buf.writeBigUInt64BE(BigInt(carry.mineral || 0), o); o += 8;
  buf.writeBigUInt64BE(BigInt(carry.gold || 0), o); o += 8;
  buf.writeUInt32BE(0, o); o += 4;            // transportTimeInterval = 0
  buf.writeUInt32BE(0, o); o += 4;            // transportTotalNum = 0
  buf.writeInt32BE(-1, o); o += 4;            // assemblyId = -1
  buf.writeInt32BE(-1, o); o += 4;            // allianceCapitalFort = -1
  buf.writeUInt8(0, o++);                     // isBreakTruce = 0
  key26022.copy(buf, o, 0, 8);                // 最新 26022 推送 key
  return buf;
}

// ---------- 主流程 ----------

(async function main() {
  const lp = config.loginParams();
  const gs = config.gameServer();
  if (!gs || !lp) {
    console.log('尚未登录：请先完成登录');
    process.exit(1);
  }

  const c = new W2Client({ host: gs.host, port: gs.port, loginParams: lp });

  let push26022Key = null;
  c.onPush(26022, ({ raw }) => {
    push26022Key = raw;
  });

  try {
    await c.connect();
  } catch (e) {
    console.log('连接服务器失败:', e.message);
    process.exit(1);
  }

  // 等待 26022 调度 key
  let waitCount = 0;
  while (!push26022Key && waitCount < 15) {
    await sleep(150);
    waitCount++;
  }
  if (!push26022Key) {
    console.log('未接收到 26022 调度 key，无法组装远征帧');
    c.close();
    process.exit(1);
  }

  // 记住操作前的当前城
  const baseInfo = await c.call(1005, Buffer.alloc(0), {
    fields: [
      ['game_status', 'u32'],
      ['diamond_owned', 'u32'],
      ['active_city_id', 'u64'],
    ],
  });
  const originCityId = baseInfo.active_city_id?.toString();

  // 拉取全城列表与地缘拓扑
  const r2001 = await c.call(2001, Buffer.alloc(0));
  if (!r2001.ok || !r2001.raw) {
    console.log('拉取城池列表失败');
    c.close();
    process.exit(1);
  }
  const cities = parseCityList(r2001.raw);
  const cachedTopology = checkCachedTopology(cities);

  // 逐城扫描当前资源与驻军卡车
  const state = [];
  for (const city of cities) {
    await c.call(2002, p.u64(city.cityId));
    const resRaw = (await c.call(2003, Buffer.alloc(0))).raw;
    const res2026Raw = (await c.call(2026, Buffer.alloc(0))).raw;
    const res = parseResources(resRaw, res2026Raw);
    const truckRaw = (await c.call(19009, Buffer.alloc(0))).raw;
    const trucks = parseTrucks(truckRaw);

    state.push({
      ...city,
      res,
      trucks,
      availTrucks: trucks, // 动态扣减
      fuelBudget: res.oil, // 发车油量以扫描时实际存量为准（在途到货不计入）
    });
  }
  const stateMap = new Map(state.map((s) => [s.cityId, s]));

  // 确定最终拓扑与五大专属核心仓（自愈与动态计算）
  let topology;
  if (cachedTopology) {
    topology = cachedTopology;
    if (CLI_OVERRIDES.steel) topology.superHubs.steel = CLI_OVERRIDES.steel;
    if (CLI_OVERRIDES.mineral) topology.superHubs.mineral = CLI_OVERRIDES.mineral;
    if (CLI_OVERRIDES.oil) topology.superHubs.oil = CLI_OVERRIDES.oil;
    if (CLI_OVERRIDES.food) topology.superHubs.food = CLI_OVERRIDES.food;
    if (CLI_OVERRIDES.gold) topology.superHubs.gold = CLI_OVERRIDES.gold;
    console.log('【拓扑就绪】命中空间指纹缓存，复用已有核心仓与协作路线。');
  } else {
    const clusters = computeClusters(cities);
    const superHubs = resolveAllSuperHubs(state, CLI_OVERRIDES);
    topology = {
      fingerprint: getTopologyFingerprint(cities),
      clusters,
      superHubs,
    };
    fs.writeFileSync(ROUTE_CACHE_FILE, JSON.stringify(topology, null, 2) + '\n');
    console.log(`【拓扑自愈】已完成全域核心仓智能推导并落盘缓存: ${path.relative(ROOT, ROUTE_CACHE_FILE)}`);
  }

  console.log(`\n全域共 ${cities.length} 座城池，划分 ${topology.clusters.length} 个地缘协作组`);
  console.log(
    `当前专属核心仓: 粮=[${stateMap.get(topology.superHubs.food)?.name || topology.superHubs.food}] ` +
    `钢=[${stateMap.get(topology.superHubs.steel)?.name || topology.superHubs.steel}] ` +
    `矿=[${stateMap.get(topology.superHubs.mineral)?.name || topology.superHubs.mineral}] ` +
    `油=[${stateMap.get(topology.superHubs.oil)?.name || topology.superHubs.oil}] ` +
    `金=[${stateMap.get(topology.superHubs.gold)?.name || topology.superHubs.gold}]`
  );
  console.log(`模式: ${DRY ? '【模拟运算 (DRY RUN)】' : '【正式执行下单】'} | 侦察机自留底限: ${RESERVE_SCOUT} 架 | 溢出阈值: ${Math.round(OVERFLOW_PCT * 100)}%\n`);

  // ---------- 调度规划运算 ----------
  const tasks = [];

  // 发车即扣：油耗（及作为货物的石油）从该城可用油量预算中扣除
  function spendFuel(city, d, trucks, cargoOil = 0) {
    const fuel = Math.round(oilPerTruck(d) * trucks);
    city.res.oil = Math.max(0, city.res.oil - fuel - cargoOil);
    city.fuelBudget = Math.max(0, city.fuelBudget - fuel - cargoOil);
  }

  // 按本地石油上限约束运输规模：server 端按线性油耗校验，超出城内石油会以「城内资源不足」拒绝
  function capDispatch(city, dest, surplus, resKey) {
    if (!dest || surplus <= 0 || city.availTrucks <= 0) return null;
    const d = dist(city, dest);
    const per = oilPerTruck(d) + (resKey === 'oil' ? TRUCK_LOAD : 0); // 石油货物本身也占用城内石油
    const affordable = Math.floor(city.fuelBudget / per);
    const n = Math.min(Math.ceil(surplus / TRUCK_LOAD), city.availTrucks, affordable);
    return n > 0 ? { n, d } : null;
  }

  // 阶段 1：组内地缘造机互助配给
  // 各城军工厂需要储备 RESERVE_SCOUT 架侦察机材料
  const reqSteel = RESERVE_SCOUT * SCOUT_COST.steel;
  const reqMineral = RESERVE_SCOUT * SCOUT_COST.mineral;
  const reqOil = RESERVE_SCOUT * SCOUT_COST.oil;

  for (const clusterIds of topology.clusters) {
    const clusterCities = clusterIds.map((id) => stateMap.get(id)).filter(Boolean);
    if (clusterCities.length < 2) continue;

    // 检查组内哪些城缺钢/缺矿/缺油
    for (const city of clusterCities) {
      // 缺钢补充
      if (city.res.steel < reqSteel) {
        const need = reqSteel - city.res.steel;
        // 在同组找有巨量钢储备的特化城
        const supplier = clusterCities.find(
          (s) => s.cityId !== city.cityId && s.res.steel > reqSteel * 3 && s.availTrucks > 0
        );
        if (supplier) {
          const give = Math.min(need, supplier.res.steel - reqSteel * 2);
          const plan = capDispatch(supplier, city, give, 'steel');
          if (plan) {
            const trUse = plan.n;
            const actualGive = Math.min(give, trUse * TRUCK_LOAD);
            tasks.push({
              phase: '阶段1:造机配给',
              src: supplier,
              dst: city,
              carry: { steel: actualGive },
              trucks: trUse,
              dist: plan.d,
            });
            supplier.res.steel -= actualGive;
            spendFuel(supplier, plan.d, trUse);
            supplier.availTrucks -= trUse;
            city.res.steel += actualGive;
          }
        }
      }

      // 缺矿补充
      if (city.res.mineral < reqMineral) {
        const need = reqMineral - city.res.mineral;
        const supplier = clusterCities.find(
          (s) => s.cityId !== city.cityId && s.res.mineral > reqMineral * 3 && s.availTrucks > 0
        );
        if (supplier) {
          const give = Math.min(need, supplier.res.mineral - reqMineral * 2);
          const plan = capDispatch(supplier, city, give, 'mineral');
          if (plan) {
            const trUse = plan.n;
            const actualGive = Math.min(give, trUse * TRUCK_LOAD);
            tasks.push({
              phase: '阶段1:造机配给',
              src: supplier,
              dst: city,
              carry: { mineral: actualGive },
              trucks: trUse,
              dist: plan.d,
            });
            supplier.res.mineral -= actualGive;
            spendFuel(supplier, plan.d, trUse);
            supplier.availTrucks -= trUse;
            city.res.mineral += actualGive;
          }
        }
      }

      // 缺油补充
      if (city.res.oil < reqOil) {
        const need = reqOil - city.res.oil;
        const supplier = clusterCities.find(
          (s) => s.cityId !== city.cityId && s.res.oil > reqOil * 3 && s.availTrucks > 0
        );
        if (supplier) {
          const give = Math.min(need, supplier.res.oil - reqOil * 2);
          const plan = capDispatch(supplier, city, give, 'oil');
          if (plan) {
            const trUse = plan.n;
            const actualGive = Math.min(give, trUse * TRUCK_LOAD);
            tasks.push({
              phase: '阶段1:造机配给',
              src: supplier,
              dst: city,
              carry: { oil: actualGive },
              trucks: trUse,
              dist: plan.d,
            });
            spendFuel(supplier, plan.d, trUse, actualGive);
            supplier.availTrucks -= trUse;
            city.res.oil += actualGive;
          }
        }
      }
    }
  }

  // 阶段 2：专库超上限积累
  // 各城特化长板溢出（> OVERFLOW_PCT 上限），定向调往对应超级专属仓突破上限
  const hubSteel = stateMap.get(topology.superHubs.steel);
  const hubMineral = stateMap.get(topology.superHubs.mineral);
  const hubOil = stateMap.get(topology.superHubs.oil);
  const hubFood = stateMap.get(topology.superHubs.food);
  const hubGold = stateMap.get(topology.superHubs.gold);

  for (const city of state) {
    if (city.availTrucks <= 0) continue;

    // 1. 粮食溢出 → 运往粮食超级仓
    if (city.cityId !== topology.superHubs.food && city.res.food > city.res.foodCap * OVERFLOW_PCT) {
      const surplus = city.res.food - Math.round(city.res.foodCap * 0.4);
      if (surplus > 10000) {
        const plan = capDispatch(city, hubFood, surplus, 'food');
        if (plan) {
          const trUse = plan.n;
          const actualFood = Math.min(surplus, trUse * TRUCK_LOAD);
          tasks.push({
            phase: '阶段2:超限归集',
            src: city,
            dst: hubFood,
            carry: { food: actualFood },
            trucks: trUse,
            dist: plan.d,
          });
          city.res.food -= actualFood;
          spendFuel(city, plan.d, trUse);
          city.availTrucks -= trUse;
        }
      }
    }

    // 2. 钢铁溢出 → 运往钢铁超级仓
    if (city.cityId !== topology.superHubs.steel && city.availTrucks > 0 && city.res.steel > city.res.steelCap * OVERFLOW_PCT) {
      const surplus = city.res.steel - Math.max(reqSteel, Math.round(city.res.steelCap * 0.4));
      if (surplus > 10000) {
        const plan = capDispatch(city, hubSteel, surplus, 'steel');
        if (plan) {
          const trUse = plan.n;
          const actualSteel = Math.min(surplus, trUse * TRUCK_LOAD);
          tasks.push({
            phase: '阶段2:超限归集',
            src: city,
            dst: hubSteel,
            carry: { steel: actualSteel },
            trucks: trUse,
            dist: plan.d,
          });
          city.res.steel -= actualSteel;
          spendFuel(city, plan.d, trUse);
          city.availTrucks -= trUse;
        }
      }
    }

    // 3. 稀矿溢出 → 运往稀矿超级仓
    if (city.cityId !== topology.superHubs.mineral && city.availTrucks > 0 && city.res.mineral > city.res.mineralCap * OVERFLOW_PCT) {
      const surplus = city.res.mineral - Math.max(reqMineral, Math.round(city.res.mineralCap * 0.4));
      if (surplus > 10000) {
        const plan = capDispatch(city, hubMineral, surplus, 'mineral');
        if (plan) {
          const trUse = plan.n;
          const actualMineral = Math.min(surplus, trUse * TRUCK_LOAD);
          tasks.push({
            phase: '阶段2:超限归集',
            src: city,
            dst: hubMineral,
            carry: { mineral: actualMineral },
            trucks: trUse,
            dist: plan.d,
          });
          city.res.mineral -= actualMineral;
          spendFuel(city, plan.d, trUse);
          city.availTrucks -= trUse;
        }
      }
    }

    // 4. 石油溢出 → 运往石油超级仓
    if (city.cityId !== topology.superHubs.oil && city.availTrucks > 0 && city.res.oil > city.res.oilCap * OVERFLOW_PCT) {
      const surplus = city.res.oil - Math.max(reqOil * 2, Math.round(city.res.oilCap * 0.4));
      if (surplus > 20000) {
        const plan = capDispatch(city, hubOil, surplus, 'oil');
        if (plan) {
          const trUse = plan.n;
          const actualOil = Math.min(surplus, trUse * TRUCK_LOAD);
          tasks.push({
            phase: '阶段2:超限归集',
            src: city,
            dst: hubOil,
            carry: { oil: actualOil },
            trucks: trUse,
            dist: plan.d,
          });
          spendFuel(city, plan.d, trUse, actualOil);
          city.availTrucks -= trUse;
        }
      }
    }

    // 5. 黄金溢出 → 运往黄金超级仓
    if (city.cityId !== topology.superHubs.gold && city.availTrucks > 0 && city.res.gold > city.res.goldCap * OVERFLOW_PCT) {
      const surplus = city.res.gold - Math.round(city.res.goldCap * 0.4);
      if (surplus > 100000) {
        const plan = capDispatch(city, hubGold, surplus, 'gold');
        if (plan) {
          const trUse = plan.n;
          const actualGold = Math.min(surplus, trUse * TRUCK_LOAD);
          tasks.push({
            phase: '阶段2:超限归集',
            src: city,
            dst: hubGold,
            carry: { gold: actualGold },
            trucks: trUse,
            dist: plan.d,
          });
          city.res.gold -= actualGold;
          spendFuel(city, plan.d, trUse);
          city.availTrucks -= trUse;
        }
      }
    }
  }

  // ---------- 执行与报告 ----------

  if (tasks.length === 0) {
    console.log('全域资源状态平衡，暂无需要调度的运输任务。');
    if (originCityId) await c.call(2002, p.u64(originCityId));
    c.close();
    return;
  }

  console.log(`生成 ${tasks.length} 笔调度任务（阶段一造机互补 + 阶段二专库超上限）：\n`);
  console.log(`  序号  阶段         路线                     距离     单程时间   调运物资             卡车数     预估油耗`);
  console.log(`  ${'─'.repeat(88)}`);

  let totalResourceMoved = 0;
  let totalOilCost = 0;
  let totalTrucksUsed = 0;

  for (let i = 0; i < tasks.length; i++) {
    const t = tasks[i];
    const items = Object.entries(t.carry).map(([k, v]) => {
      const nameMap = { food: '粮', steel: '钢', mineral: '矿', oil: '油', gold: '金' };
      totalResourceMoved += v;
      return `${nameMap[k] || k} ${fmt(v)}`;
    }).join(', ');

    const oil = estOil(t.dist, t.trucks);
    totalOilCost += oil;
    totalTrucksUsed += t.trucks;

    const routeStr = `${t.src.name} → ${t.dst.name}`;
    console.log(
      `  #${String(i + 1).padEnd(3)} ` +
      `${t.phase.padEnd(10)} ` +
      `${routeStr.padEnd(24)} ` +
      `${t.dist.toFixed(1).padStart(5)}格  ` +
      `${fmtDur(calcMarchSec(t.dist)).padStart(6)}   ` +
      `${items.padEnd(20)} ` +
      `${fmt(t.trucks).padStart(7)}辆   ` +
      `${fmt(oil).padStart(6)}油`
    );

    if (!DRY) {
      // 切换到出发城发车
      await jitter();
      await c.call(2002, p.u64(t.src.cityId));

      const payload = buildTransport19003Payload(
        t.trucks,
        t.dst.x,
        t.dst.y,
        t.carry,
        push26022Key
      );
      const resp = await c.call(19003, payload);
      if (resp.ok) {
        console.log(`       ★ [19003 成功] 发车完成`);
      } else {
        console.log(`       ✗ [19003 失败] ${resp.message || '未知错误'}`);
      }
    }
  }

  console.log(`  ${'─'.repeat(88)}`);
  console.log(`\n—— 调度总计 ——`);
  console.log(`调运总物资: ${fmt(totalResourceMoved)}`);
  console.log(`动用总卡车: ${fmt(totalTrucksUsed)} 辆（占全域 ${((totalTrucksUsed / 2072289) * 100).toFixed(2)}%）`);
  console.log(`预计总耗油: ${fmt(totalOilCost)} 油（物资/油耗能效比: ${(totalResourceMoved / Math.max(1, totalOilCost)).toFixed(1)}:1）`);

  // 切回操作前的当前城
  if (originCityId) {
    await jitter();
    const back = await c.call(2002, p.u64(originCityId));
    if (back.ok) console.log(`\n已切回操作前的城池（cityId=${originCityId}）`);
  }

  c.close();
})();
