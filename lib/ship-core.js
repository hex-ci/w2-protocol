/**
 * ship-core.js —— 定向运输的纯计算（TUI 渲染层之外）
 *
 * 与 w2transport 同口径：距离/耗时/油耗模型来自 lib/formula.js（实测拟合），
 * 发车油料预算 = 物理石油 − 6h 训练保留量（与 transport 的 FUEL_RESERVE_HOURS 一致）。
 * 只做计算与约束校验，无网络/渲染依赖，可直接单测。
 */

import {
  TRUCK_LOAD, RES_ALL, RES_CN, DEFAULT_FUEL_RESERVE_HOURS,
  distance, calcMarchSec, oilPerTruck, estOil, realMarchSec,
  trucksFor, trucksByBudget, fuelBudgetOf,
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
 * 单资源可装载上限：库存、卡车剩余载重、油料可支撑车数三者取小。
 * 仅约束「当前资源」，与其它资源的相互作用由 shipPlan 的 issues 呈现。
 */
function capFor(src, dst, res, loads, fuelHours = DEFAULT_FUEL_HOURS) {
  const d = distance(src, dst);
  const otherTotal = totalOf(loads) - Math.max(0, loads[res] || 0);
  const truckCap = src.availTrucks * TRUCK_LOAD - otherTotal;
  const oilTrucks = maxTrucksFor(src, d, fuelHours);
  const oilCap = oilTrucks * TRUCK_LOAD - otherTotal;
  const stock = src.stock[res] || 0;
  return Math.max(0, Math.floor(Math.min(stock, truckCap, oilCap)));
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

const PRESETS = { fill: presetFill, surplus: presetSurplus, max: presetMax };

export {
  RES_ALL,
  DEFAULT_FUEL_HOURS,
  totalOf,
  fuelBudget,
  shipPlan,
  maxTrucksFor,
  capFor,
  clampAmount,
  normalizeLoads,
  presetFill,
  presetSurplus,
  presetMax,
  PRESETS,
};
