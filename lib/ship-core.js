/**
 * ship-core.js —— 定向运输的纯计算（TUI 渲染层之外）
 *
 * 与 w2transport 同口径：距离/耗时/油耗模型来自 lib/formula.js（实测拟合），
 * 发车油料预算 = 物理石油 − 6h 训练保留量（与 transport 的 FUEL_RESERVE_HOURS 一致）。
 * 只做计算与约束校验，无网络/渲染依赖，可直接单测。
 */

import {
  TRUCK_LOAD, RES_KEYS, RES_ALL, RES_CN, DEFAULT_FUEL_RESERVE_HOURS,
  distance, calcMarchSec, oilPerTruck, estOil, realMarchSec,
  trucksFor, trucksByBudget, fuelBudgetOf, excessOf, spaceLeftOf,
} from './formula.js';

const DEFAULT_FUEL_HOURS = DEFAULT_FUEL_RESERVE_HOURS;

/** 装载清单合计 */
function totalOf(loads) {
  return RES_ALL.reduce((a, r) => a + (Math.max(0, loads[r] || 0)), 0);
}

/** 发车油料预算：物理石油 − N 小时训练保留量（原语见 formula.js 运输物流分区） */
function fuelBudget(src, hours = DEFAULT_FUEL_HOURS) {
  return fuelBudgetOf(src.physOil, src.D.oil, hours);
}

/**
 * 一笔运输的完整评估。
 * @param {object} bonus 19001 行军加成 { landSpeedAdd, speedFactor }（缺省 = 无加成，退化为基础口径）
 * @returns { d, sec, realSec, trucks, oilCost, total, issues[], ok }
 *   sec     = 油耗口径 T（基础速度，服务器按它扣油）
 *   realSec = 真实行军时间（含 19001 加成 + 出发城运输站等级），界面展示用
 *   issues 为空 = 全部约束通过；非空为阻止发车的原因列表（渲染层标红）。
 */
function shipPlan(src, dst, loads, fuelHours = DEFAULT_FUEL_HOURS, bonus = null) {
  const d = distance(src, dst);
  const total = totalOf(loads);
  const trucks = trucksFor(total);
  const oilCost = estOil(d, trucks);
  const issues = [];

  if (total <= 0) issues.push('未装载任何资源');
  for (const r of RES_ALL) {
    const v = Math.max(0, loads[r] || 0);
    if (v > (src.stock[r] || 0)) issues.push(`${RES_CN[r]}装载超过源城存量`);
  }
  if (trucks > src.availTrucks) issues.push(`卡车不足（需 ${trucks} 辆，可用 ${src.availTrucks}）`);
  const need = oilCost + Math.max(0, loads.oil || 0);
  const budget = fuelBudget(src, fuelHours);
  if (need > budget) issues.push(`油料预算不足（需 ${Math.round(need)}，可用 ${Math.floor(budget)}）`);
  if (src.slotsCap !== Infinity && src.slotsUsed >= src.slotsCap) {
    issues.push(`出征位已满（${src.slotsUsed}/${src.slotsCap}），等部队返程`);
  }
  const realSec = realMarchSec(d, {
    landSpeedAdd: bonus?.landSpeedAdd || 0,
    stationLevel: src.stationLevel || 0,
    speedFactor: bonus?.speedFactor || 1,
  });
  return { d, sec: calcMarchSec(d), realSec, trucks, oilCost, total, issues, ok: issues.length === 0 };
}

/** 油料预算约束下可派出的最大车数（extraOil = 其它资源的装载油耗预留，实际用不上时传 0） */
function maxTrucksFor(src, d, fuelHours = DEFAULT_FUEL_HOURS, extraOil = 0) {
  const per = oilPerTruck(d);
  if (per <= 0) return src.availTrucks;
  const budget = Math.max(0, fuelBudget(src, fuelHours) - extraOil);
  return Math.max(0, Math.min(src.availTrucks, trucksByBudget(budget, per)));
}

/**
 * 单资源可装上限的完整解释：cap + 瓶颈来源 + 三项软限。
 * UI 用它回答「为什么装不进 / 为什么只能装这么多」——
 * capFor 只给数值，看不出是被库存、卡车还是油料预算卡住。
 * @returns {{ cap:number, limiter:'stock'|'trucks'|'oil', limits:{stock,trucks,oil}, oilTrucks:number }}
 *   limiter = 三者中最小项；cap = 0 时 limiter 即「装不进的原因」。
 */
function capDetail(src, dst, res, loads, fuelHours = DEFAULT_FUEL_HOURS) {
  const d = distance(src, dst);
  const otherTotal = totalOf(loads) - Math.max(0, loads[res] || 0);
  const oilTrucks = maxTrucksFor(src, d, fuelHours);
  const limits = {
    stock: Math.max(0, src.stock[res] || 0),
    trucks: Math.max(0, src.availTrucks * TRUCK_LOAD - otherTotal),
    oil: Math.max(0, oilTrucks * TRUCK_LOAD - otherTotal),
  };
  const cap = Math.max(0, Math.floor(Math.min(limits.stock, limits.trucks, limits.oil)));
  // 卡车优先级高于油料：无车时两项同为 0，报「卡车」比报「油料」更贴近实况
  let limiter = 'stock';
  if (limits.trucks < limits.stock) limiter = 'trucks';
  if (limits.oil < limits[limiter]) limiter = 'oil';
  return { cap, limiter, limits, oilTrucks };
}

/**
 * 单资源可装载上限：库存、卡车剩余载重、油料可支撑车数三者取小。
 * 仅约束「当前资源」，与其它资源的相互作用由 shipPlan 的 issues 呈现。
 */
function capFor(src, dst, res, loads, fuelHours = DEFAULT_FUEL_HOURS) {
  return capDetail(src, dst, res, loads, fuelHours).cap;
}

/** 把装载量夹到合法范围（>=0 且不超过 capFor） */
function clampAmount(src, dst, res, amount, loads, fuelHours = DEFAULT_FUEL_HOURS) {
  const cap = capFor(src, dst, res, loads, fuelHours);
  const v = Number.isFinite(amount) ? Math.max(0, Math.round(amount)) : 0;
  return Math.min(v, cap);
}

/** 整单夹紧：逐资源按「已接受装载 + 当前城况」重算，用于复制上一笔等预填场景 */
function normalizeLoads(src, dst, loads, fuelHours = DEFAULT_FUEL_HOURS) {
  const out = {};
  for (const r of RES_ALL) {
    const want = Math.max(0, loads[r] || 0);
    if (want <= 0) continue;
    out[r] = clampAmount(src, dst, r, want, out, fuelHours);
  }
  return out;
}

/**
 * 城池级发车限制汇总：回答「这城为什么发不出车 / 还能发多少」。
 * 与 capDetail 的区别：这里是城级视角（出行位/卡车/油料三条硬闸），
 * 用于在 UI 上把「上限全 0」翻译成人话。blocks 非空 = 当前一发不出。
 * @returns {{ blocker:'slots'|'trucks'|'oil'|'stock'|null, numbers:{...} }}
 */
function cityLimits(src, dst, fuelHours = DEFAULT_FUEL_HOURS) {
  const d = dst ? distance(src, dst) : 0;
  const reserve = Math.round((src.D?.oil || 0) * fuelHours);
  const budget = Math.floor(fuelBudget(src, fuelHours));
  const truckCap = src.availTrucks * TRUCK_LOAD;
  const oilTrucks = maxTrucksFor(src, d, fuelHours);
  const oilCap = oilTrucks * TRUCK_LOAD;
  const numbers = {
    physOil: src.physOil || 0, reserve, budget,
    trucks: src.availTrucks || 0, oilTrucks,
    truckCap, oilCap,
    slotsUsed: src.slotsUsed || 0,
    slotsCap: src.slotsCap,
    fuelHours,
  };
  // 阻塞优先级：位 → 车 → 油 → 货（与服务器拒绝顺序一致，先报最根本的）
  // 前三条为城级判定（不依赖目的城）：出征位、可用卡车、油料预算是否已为 0
  let blocker = null;
  if (src.slotsCap !== Infinity && src.slotsUsed >= src.slotsCap) blocker = 'slots';
  else if ((src.availTrucks || 0) <= 0) blocker = 'trucks';
  else if (budget <= 0) blocker = 'oil';       // 预算为 0：任何距离都发不出
  else if (oilTrucks <= 0) blocker = 'oil';    // 距离相关：预算够但不够跑这一趟
  else if (!RES_KEYS.some((r) => (src.stock[r] || 0) > 0)) blocker = 'stock';
  return { blocker, numbers };
}

// ---------- 预设键 ----------

/** f 补满目的城底仓线：目的城相对底仓线的缺口（夹在可装范围内） */
function presetFill(src, dst, res, loads, fuelHours) {
  const need = Math.max(0, (dst.floor[res] || 0) - (dst.stock[res] || 0));
  return clampAmount(src, dst, res, need, loads, fuelHours);
}

/** s 运出全部富余：源城高于底仓线的部分 */
function presetSurplus(src, dst, res, loads, fuelHours) {
  const surplus = Math.max(0, (src.stock[res] || 0) - (src.floor[res] || 0));
  return clampAmount(src, dst, res, surplus, loads, fuelHours);
}

/** a 拉满车队：油料/卡车预算允许的最大载量 */
function presetMax(src, dst, res, loads, fuelHours) {
  const d = distance(src, dst);
  const otherTotal = totalOf(loads) - Math.max(0, loads[res] || 0);
  const trucks = maxTrucksFor(src, d, fuelHours);
  return clampAmount(src, dst, res, trucks * TRUCK_LOAD - otherTotal, loads, fuelHours);
}

/**
 * e 运出超容部分：源城超出仓库容量的量（夹在可装范围内）。
 * 与 presetSurplus 的区别：那是「库存 − 底仓线」（造兵保底线），这是「库存 − 容量」（服务器硬上限），
 * 两者数量级常差很多，超容外运必须用后者。
 */
function presetExcess(src, dst, res, loads, fuelHours) {
  const excess = excessOf(src.stock[res] || 0, (src.cap || {})[res] || 0);
  return clampAmount(src, dst, res, excess, loads, fuelHours);
}

/** 城池该资源的超容量（0 = 未超容） */
function excessAt(city, res) {
  return excessOf(city.stock?.[res] || 0, (city.cap || {})[res] || 0);
}

/** 城池超容资源清单 [{res, excess, amount, cap}]，按超出量降序 */
function excessList(city) {
  const out = [];
  for (const r of RES_ALL) {
    const excess = excessAt(city, r);
    if (excess > 0) out.push({ res: r, excess, amount: city.stock[r] || 0, cap: (city.cap || {})[r] || 0 });
  }
  return out.sort((a, b) => b.excess - a.excess);
}

/** 该城能否接收 res（容量余量 > 0）及余量大小；容量未知时视为不限（Infinity） */
function spaceAt(city, res) {
  return spaceLeftOf(city.stock?.[res] || 0, (city.cap || {})[res] || 0);
}

/**
 * 超容外运的目的城推荐：按「能装下多少」排序（容量余量降序）。
 * 与补料推荐（按目的城底仓线缺口）语义不同——超容外运是倒货，只需对方装得下。
 * @returns [{city, space}] 前 limit 个；space 为容量余量
 */
function receiverRanking(cities, src, res, limit = 3) {
  return cities
    .filter((s) => s.cityId !== src.cityId)
    .map((s) => ({ city: s, space: spaceAt(s, res) }))
    .filter((x) => x.space > 0)
    .sort((a, b) => b.space - a.space)
    .slice(0, limit);
}

const PRESETS = { fill: presetFill, surplus: presetSurplus, max: presetMax, excess: presetExcess };

export {
  RES_ALL,
  DEFAULT_FUEL_HOURS,
  totalOf,
  fuelBudget,
  shipPlan,
  maxTrucksFor,
  capDetail,
  cityLimits,
  capFor,
  clampAmount,
  normalizeLoads,
  presetFill,
  presetSurplus,
  presetMax,
  presetExcess,
  excessAt,
  excessList,
  spaceAt,
  receiverRanking,
  PRESETS,
};
