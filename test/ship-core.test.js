import assert from 'node:assert/strict';
import test from 'node:test';
import {
  totalOf, fuelBudget, shipPlan, maxTrucksFor, capFor, clampAmount,
  presetFill, presetSurplus, presetMax,
} from '../lib/ship-core.js';
import { distance, calcMarchSec, oilPerTruck, estOil, realMarchSpeed, realMarchSec } from '../lib/formula.js';

// 测试用城池桩：坐标距离 100 格 = sqrt(100^2+0)，便于手算断言
function city(over = {}) {
  return {
    cityId: over.cityId || '1', name: over.name || '城A', x: over.x || 0, y: over.y || 0,
    stock: { food: 100000, steel: 200000, mineral: 300000, oil: 50000, gold: 0, ...over.stock },
    floor: { food: 10000, steel: 20000, mineral: 30000, oil: 5000, gold: 0, ...over.floor },
    D: { food: 0, steel: 0, mineral: 0, oil: 100, ...over.D },
    availTrucks: over.availTrucks ?? 100,
    physOil: over.physOil ?? 50000,
    slotsCap: over.slotsCap ?? 10,
    slotsUsed: over.slotsUsed ?? 0,
    stationLevel: over.stationLevel ?? 0,
  };
}

test('march 模型与 transport 口径一致（手算核对）', () => {
  const d = distance({ x: 0, y: 0 }, { x: 100, y: 0 });
  assert.equal(d, 100);
  const T = calcMarchSec(d);
  assert.equal(T, Math.ceil(30 + (100 * 100000) / 1150)); // 8726
  const per = oilPerTruck(d);
  assert.ok(Math.abs(per - 0.01313 * Math.pow(T, 0.72)) < 1e-9);
  assert.equal(estOil(d, 10), Math.round(per * 10));
  assert.equal(estOil(d, 0), 0);
});

test('真实行军速度：19001 加成 + 出发城运输站（实测标定值核对）', () => {
  // 无加成：退化为基础移速
  assert.equal(realMarchSpeed({}), 1150);
  // 实测样本：land=+50%、站 L9、倍率 3 → 1+0.5+4.5=6 倍 → 20700（实测反推 20728）
  assert.equal(realMarchSpeed({ landSpeedAdd: 0.5, stationLevel: 9, speedFactor: 3 }), 1150 * 6 * 3);
  // 实测样本：站 L10 → 1+0.5+5=6.5 倍 → 22425（实测 22445）
  assert.equal(realMarchSpeed({ landSpeedAdd: 0.5, stationLevel: 10, speedFactor: 3 }), 22425);
  // 时间公式与实测对照：d=124.4、站 L10 → T≈584.8s（实测 584.2）；站 L9 → T≈631.0（实测 630.2）
  const t10 = realMarchSec(124.4, { landSpeedAdd: 0.5, stationLevel: 10, speedFactor: 3 });
  const t9 = realMarchSec(124.4, { landSpeedAdd: 0.5, stationLevel: 9, speedFactor: 3 });
  assert.ok(Math.abs(t10 - 584.2) < 2, `T(L10)=${t10}`);
  assert.ok(Math.abs(t9 - 630.2) < 2, `T(L9)=${t9}`);
  // 非法输入（速度 ≤ 0）退化为基础移速，不返回负数
  assert.equal(realMarchSpeed({ speedFactor: 0 }), 1150);
});

test('shipPlan 含 bonus 时 sec（油耗口径）不变、realSec 变快', () => {
  const srcPlain = city();               // 无运输站、无加成 → V=1150
  const srcBoost = city({ stationLevel: 9 }); // 站 L9 + 加成 → V=20700（18 倍）
  const dst = city({ cityId: '2', name: '城B', x: 100, y: 0 });
  const plain = shipPlan(srcPlain, dst, { food: 1200 }, 6);
  const boosted = shipPlan(srcBoost, dst, { food: 1200 }, 6, { landSpeedAdd: 0.5, speedFactor: 3 });
  assert.equal(boosted.sec, plain.sec);            // 油耗口径 T 不因加成而变
  assert.equal(boosted.oilCost, plain.oilCost);    // 油耗不变（实测交叉验证过）
  assert.ok(boosted.realSec < plain.realSec / 10, `${boosted.realSec} vs ${plain.realSec}`);
  assert.equal(boosted.realSec, realMarchSec(100, { landSpeedAdd: 0.5, stationLevel: 9, speedFactor: 3 }));
});

test('装载合计与油料预算', () => {
  assert.equal(totalOf({ food: 100, steel: 200 }), 300);
  assert.equal(totalOf({ food: -50 }), 0);
  const src = city({ physOil: 20000, D: { oil: 1000 } });
  // 6h 保留 = 6000，预算 = 14000
  assert.equal(fuelBudget(src, 6), 14000);
  assert.equal(fuelBudget(src, 0), 20000);
});

test('shipPlan 正常路径与四类阻塞', () => {
  const src = city();
  const dst = city({ cityId: '2', name: '城B', x: 100, y: 0 });
  // 1200 资源 = 1 车；油耗可支撑
  const ok = shipPlan(src, dst, { food: 1200 });
  assert.equal(ok.trucks, 1);
  assert.equal(ok.total, 1200);
  assert.equal(ok.oilCost, estOil(100, 1));
  assert.equal(ok.ok, true, ok.issues.join('; '));

  // 空装载
  assert.ok(shipPlan(src, dst, {}).issues.some((s) => s.includes('未装载')));
  // 超存量
  assert.ok(shipPlan(src, dst, { food: 999999 }).issues.some((s) => s.includes('超过源城存量')));
  // 卡车不足
  const few = city({ availTrucks: 1 });
  assert.ok(shipPlan(few, dst, { food: 5000 }).issues.some((s) => s.includes('卡车不足')));
  // 油料预算不足：油城保留 6000，派 100 车需油耗 > 预算
  const dry = city({ physOil: 6500, D: { oil: 1000 } });
  assert.ok(shipPlan(dry, dst, { food: 120000 }).issues.some((s) => s.includes('油料预算不足')));
  // 出征位满
  const busy = city({ slotsUsed: 10, slotsCap: 10 });
  assert.ok(shipPlan(busy, dst, { food: 1200 }).issues.some((s) => s.includes('出征位')));
});

test('maxTrucksFor 受油料预算约束', () => {
  const src = city({ physOil: 10000, D: { oil: 0 } }); // 预算 10000
  const d = 100;
  const per = oilPerTruck(d);
  // 预算允许 1107 辆，但车只有 100 → 取小
  assert.equal(maxTrucksFor(src, d, 6), Math.min(src.availTrucks, Math.floor(10000 / per)));
  // 车多、预算少时以预算为准
  const rich = city({ availTrucks: 100000, physOil: 10000, D: { oil: 0 } });
  assert.equal(maxTrucksFor(rich, d, 6), Math.floor(10000 / per));
});

test('capFor 取「库存 / 卡车载重 / 油料支撑」三者最小', () => {
  const src = city(); // 卡车 100、油 50000、粮 100000
  const dst = city({ x: 100, y: 0 });
  assert.equal(capFor(src, dst, 'food', {}), 100000); // 库存最小
  assert.equal(capFor(src, dst, 'steel', {}), 120000); // 100 车 × 1200 = 120000，钢 200000
  // 已有其它资源时，卡车载重被占用
  assert.equal(capFor(src, dst, 'steel', { food: 60000 }), 60000);
});

test('clampAmount 边界', () => {
  const src = city();
  const dst = city({ x: 100, y: 0 });
  assert.equal(clampAmount(src, dst, 'food', -5, {}), 0);
  assert.equal(clampAmount(src, dst, 'food', 123.7, {}), 124);
  assert.equal(clampAmount(src, dst, 'food', 1e9, {}), 100000); // 夹到库存
  assert.equal(clampAmount(src, dst, 'food', NaN, {}), 0);
});

test('预设键：f 补底仓 / s 全富余 / a 拉满', () => {
  const src = city(); // 粮 100000，底仓 10000 → 富余 90000
  const dst = city({ cityId: '2', x: 0, y: 0, stock: { food: 4000, steel: 0, mineral: 0, oil: 0, gold: 0 }, floor: { food: 34000, steel: 0, mineral: 0, oil: 0, gold: 0 } });
  // f: 目的城缺口 = 34000 - 4000 = 30000
  assert.equal(presetFill(src, dst, 'food', {}, 6), 30000);
  // s: 源城富余 = 90000
  assert.equal(presetSurplus(src, dst, 'food', {}, 6), 90000);
  // a: 拉满（油料预算：physOil 50000 - 0 保留 = 50000；per@0格=... 距离 0 时 per=0 → 不限制 → 卡车 100×1200）
  const max = presetMax(src, dst, 'food', {}, 6);
  assert.ok(max > 0 && max <= 100000);
  // 载入其它资源后 f 会被可装空间夹住
  assert.equal(presetFill(src, dst, 'food', { steel: 119000 }, 6), 1000);
});
