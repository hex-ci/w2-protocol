/**
 * scan.js —— 全域城池扫描编排（transport / ship 共用）
 *
 * 逐城切城后拉取资源、生产、加成、驻军、建筑与兵种规格，计算产需层指标；
 * 再统一查询出征位占用（19008）。字段解析在 proto.js，数值模型在 formula.js。
 *
 * 状态对象的字段（下游脚本依赖）：
 *   cityId/name/x/y、stock（储量）、cap（仓库容量）、P（实收/h）、D（满负荷需求/h）、floor（底仓线）、
 *   cost（侦察机单价）、Cin（满负荷产能 架/h）、plants、special（主产资源）、
 *   trucks/availTrucks、physOil（物理石油）、hqLevel、stationLevel（运输站等级，行军加成用）、
 *   slotsUsed/slotsCap/slotsFree
 */

import { p } from './sdk.js';
import {
  parseCityList, parse2003, parse2026, parse2018, parseBuildings49,
  parse3006, parse19009, parse19001, FIELD_PROTO, BUILDING_PROTO,
} from './proto.js';
import {
  RES_KEYS, SCOUT_ARMY_ID,
  prodRate, demandRate, baselineOf, surplusOf, deficitOf, expeditionSlots,
} from './formula.js';
import { fetchInFlight } from './expedition.js';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const jitter = () => sleep(300 + Math.floor(Math.random() * 400));

/**
 * 全城扫描（含 L1 产需层、行军加成与出征位）。
 * @param {object} c W2Client 实例（已登录）
 * @param {object} opts
 *   floorHours  底仓线小时数（默认 24）
 *   onCities    城池列表拉取后的回调 (cities)，用于拓扑检查等前置工作
 *   onCity      每城完成回调 (state_i, index, total)，用于进度展示
 *   onStage     阶段切换回调 (label)，调用方据此更新进度行
 * @returns {Promise<{cities, state, originCityId, bonus19001}>}
 *   bonus19001 = { landSpeedAdd, speedFactor }（行军实时加成，19001 下发）
 */
async function scanDomain(c, { floorHours = 24, onCities = null, onCity = null, onStage = null } = {}) {
  const stage = (label, meta) => { if (onStage) onStage(label, meta); };

  stage('读取账号信息…');
  const baseInfo = await c.call(1005, Buffer.alloc(0), {
    fields: [
      ['game_status', 'u32'],
      ['diamond_owned', 'u32'],
      ['active_city_id', 'u64'],
    ],
  });
  const originCityId = baseInfo.active_city_id?.toString();

  // 远征前置数据（19001）：行军速度加成 / 全局倍率，全程一次即可
  stage('读取行军加成…');
  let bonus19001 = { landSpeedAdd: 0, speedFactor: 1, capacityAdd: 0, officers: [] };
  try {
    const r19001 = await c.call(19001, p.byte(0));
    if (r19001.ok && r19001.raw) bonus19001 = parse19001(r19001.raw);
  } catch (e) { /* 加成读取失败用中性值：速度退化为基础口径，不阻断扫描 */ }

  stage('拉取城池列表…');
  const r2001 = await c.call(2001, Buffer.alloc(0));
  if (!r2001.ok || !r2001.raw) throw new Error('拉取城池列表失败');
  const cities = parseCityList(r2001.raw);
  if (onCities) onCities(cities);

  const state = [];
  // 每城 6~7 个请求 × 500ms 频控，是首屏延迟的主要来源：按城推进反馈
  // 总数经 onStage 的 meta 暴露；onCity 只在每城完成时触发（消费方会读 state 字段）
  stage('扫描城池', { total: cities.length });
  for (let i = 0; i < cities.length; i++) {
    const city = cities[i];
    await c.call(2002, p.u64(city.cityId));
    const res = parse2003((await c.call(2003, Buffer.alloc(0))).raw);
    const prod = parse2026((await c.call(2026, Buffer.alloc(0))).raw);
    const bonus = parse2018((await c.call(2018, Buffer.alloc(0))).raw);
    const trucks = (parse19009((await c.call(19009, Buffer.alloc(0))).raw)
      .find((a) => a.id === 3) || {}).count || 0;
    const militaryBuildings = parseBuildings49((await c.call(17001, Buffer.alloc(0))).raw, 1);
    const plants = militaryBuildings.filter((b) => b.proto === BUILDING_PROTO.ARMS_PLANT);
    const hqLevel = Math.max(0, ...militaryBuildings
      .filter((b) => b.proto === BUILDING_PROTO.HEADQUARTERS).map((b) => b.level));
    const stationLevel = Math.max(0, ...militaryBuildings
      .filter((b) => b.proto === BUILDING_PROTO.TRANSPORT_STATION).map((b) => b.level));
    const fields = parseBuildings49((await c.call(17002, Buffer.alloc(0))).raw, 4);

    // 侦察机规格（首个军工厂）：单价与单架耗时；无厂时用实测全域一致值兜底
    let scout = null;
    if (plants.length) {
      const spec = parse3006((await c.call(3006, p.u64(plants[0].bid))).raw);
      scout = spec.trainables[SCOUT_ARMY_ID] || null;
    }
    const cost = scout
      ? { food: scout.food, steel: scout.steel, mineral: scout.mineral, oil: scout.oil }
      : { food: 50, steel: 150, mineral: 50, oil: 100 };
    const scoutSec = scout ? scout.time / 1000 : 31;

    // 产需层：P 实收/h、D 满负荷需求/h、floor 底仓线（公式见 lib/formula.js 资源产需分区）
    const P = {};
    for (const r of RES_KEYS) {
      const basic = r === 'food' ? prod.foodOut : r === 'steel' ? prod.steelOut : r === 'mineral' ? prod.mineralOut : prod.oilOut;
      P[r] = prodRate(basic, bonus.nature + bonus.tech + bonus.officer);
    }
    const Cin = plants.length * 3600 / scoutSec;
    const D = {};
    for (const r of RES_KEYS) D[r] = demandRate(cost[r], Cin);
    const floor = {};
    for (const r of RES_KEYS) floor[r] = baselineOf(D[r], floorHours);

    // 主产判定：资源田占比 >= 50%
    const fieldCnt = { food: 0, steel: 0, mineral: 0, oil: 0 };
    for (const f of fields) {
      const key = FIELD_PROTO[f.proto];
      if (key) fieldCnt[key]++;
    }
    const fieldTotal = fields.filter((f) => FIELD_PROTO[f.proto]).length || 1;
    let special = null;
    for (const r of RES_KEYS) {
      if (fieldCnt[r] / fieldTotal >= 0.5) special = r;
    }

    const stock = {
      food: prod.foodA, steel: prod.steelA, mineral: prod.mineralA, oil: prod.oilA, gold: prod.goldA,
    };
    // 仓库容量：储量超容量即爆仓停产，超容外运需要它（2003 与 2026 实测一致，取 2003）
    const cap = {
      food: res.foodCap, steel: res.steelCap, mineral: res.mineralCap, oil: res.oilCap, gold: prod.goldCap,
    };

    const s = {
      ...city,
      stock, cap, prod06: prod, res, P, cost, scoutSec, Cin, D, floor, fieldCnt, special,
      plants,
      goldCap: prod.goldCap,
      trucks,
      availTrucks: trucks,
      physOil: stock.oil, // 物理石油：发车实扣，不随虚拟入账增减（在途油放不出车）
      hqLevel,
      stationLevel, // 运输站等级（出发城的等级决定行军加成）
    };
    state.push(s);
    if (onCity) onCity(s, i, cities.length);
  }

  stage('统计出征位占用…');
  await querySlots(c, state);
  return { cities, state, originCityId, bonus19001 };
}

/**
 * 出征位统计：每城同外部队数上限 = 司令部等级（实测标定）。
 * 在途列表查询走 lib/expedition.js（19008 分页 50/页），按出发城坐标统计占用。
 */
async function querySlots(c, state) {
  const inFlight = new Map(); // "x,y" -> count
  const list = await fetchInFlight(c);
  for (const x of list) {
    const key = `${x.startX},${x.startY}`;
    inFlight.set(key, (inFlight.get(key) || 0) + 1);
  }
  for (const s of state) {
    s.slotsUsed = inFlight.get(`${s.x},${s.y}`) || 0;
    s.slotsCap = expeditionSlots(s.hqLevel);
    s.slotsFree = Math.max(0, s.slotsCap - s.slotsUsed);
  }
}

/** 城池状态的富余/缺口（相对底仓线；(state, resKey) 便利形态，原语见 formula.js） */
const citySurplus = (s, r) => surplusOf(s.stock[r], s.floor[r]);
const cityDeficit = (s, r) => deficitOf(s.stock[r], s.floor[r]);

export { scanDomain, querySlots, citySurplus, cityDeficit, jitter };
