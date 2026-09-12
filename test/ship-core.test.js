import assert from 'node:assert/strict';
import test from 'node:test';
import {
  totalOf, fuelBudget, shipPlan, maxTrucksFor, capDetail, cityLimits, capFor, clampAmount, wrapIndex,
  presetFill, presetSurplus, presetMax, presetExcess,
  excessAt, excessList, spaceAt, receiverRanking,
} from '../lib/ship-core.js';
import { distance, calcMarchSec, oilPerTruck, estOil, realMarchSpeed, realMarchSec } from '../lib/formula.js';

// 测试用城池桩：坐标距离 100 格 = sqrt(100^2+0)，便于手算断言
function city(over = {}) {
  return {
    cityId: over.cityId || '1', name: over.name || '城A', x: over.x || 0, y: over.y || 0,
    stock: { food: 100000, steel: 200000, mineral: 300000, oil: 50000, gold: 0, ...over.stock },
    cap: { food: 200000, steel: 400000, mineral: 600000, oil: 100000, gold: 0, ...over.cap },
    // 真实数据里 floor 只有 4 种资源（黄金无造兵需求，底仓线不存在），桩须一致
    floor: { food: 10000, steel: 20000, mineral: 30000, oil: 5000, ...over.floor },
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

test('capDetail 指出上限的瓶颈来源（库存/卡车/油料）', () => {
  const dst = city({ x: 100, y: 0 });
  // 正常：库存最小
  const a = capDetail(city(), dst, 'food', {}, 6);
  assert.equal(a.cap, 100000);
  assert.equal(a.limiter, 'stock');
  // 卡车为 0（发车后典型）→ 上限 0 且瓶颈为卡车
  const b = capDetail(city({ availTrucks: 0 }), dst, 'food', {}, 6);
  assert.equal(b.cap, 0);
  assert.equal(b.limiter, 'trucks');
  assert.deepEqual(b.limits, { stock: 100000, trucks: 0, oil: 0 });
  // 油料预算为 0 → 上限 0 且瓶颈为油料
  const c = capDetail(city({ physOil: 100, D: { oil: 1000 } }), dst, 'food', {}, 6);
  assert.equal(c.cap, 0);
  assert.equal(c.limiter, 'oil');
  // 上限非 0 但被油料压住（预算够跑有限车数；库存与卡车都更充裕）
  const d = capDetail(city({ physOil: 10000, D: { oil: 0 }, availTrucks: 100000, stock: { food: 5000000, steel: 0, mineral: 0, oil: 0, gold: 0 } }), dst, 'food', {}, 6);
  assert.ok(d.cap > 0 && d.cap < 5000000, `cap=${d.cap}`);
  assert.equal(d.limiter, 'oil');
  // capFor 与 capDetail 口径一致
  assert.equal(capFor(city(), dst, 'food', {}, 6), a.cap);
});

test('cityLimits 城级阻塞判定（位 → 车 → 油 → 货）', () => {
  const dst = city({ x: 100, y: 0 });
  assert.equal(cityLimits(city(), dst, 6).blocker, null);
  assert.equal(cityLimits(city({ slotsUsed: 10, slotsCap: 10 }), dst, 6).blocker, 'slots');
  assert.equal(cityLimits(city({ availTrucks: 0 }), dst, 6).blocker, 'trucks');
  // 油料预算为 0（物理油不够 6h 训练保留）
  assert.equal(cityLimits(city({ physOil: 100, D: { oil: 1000 } }), dst, 6).blocker, 'oil');
  // 无资源
  assert.equal(cityLimits(city({ stock: { food: 0, steel: 0, mineral: 0, oil: 0, gold: 0 } }), dst, 6).blocker, 'stock');
  // 不依赖目的城：dst 为 null 也能判定城级阻塞
  assert.equal(cityLimits(city({ availTrucks: 0 }), null, 6).blocker, 'trucks');
  assert.equal(cityLimits(city(), null, 6).blocker, null);
  // numbers 供 UI 展示
  const n = cityLimits(city({ physOil: 100, D: { oil: 1000 } }), dst, 6).numbers;
  assert.equal(n.reserve, 6000);
  assert.equal(n.budget, 0);
});

test('presetExcess 装入超容部分（区别于 presetSurplus 的底仓线口径）', () => {
  // 粮 100000，容量 60000 → 超容 40000；底仓线 10000 → 富余 90000
  const src = city({ cap: { food: 60000, steel: 0, mineral: 0, oil: 0, gold: 0 } });
  const dst = city({ cityId: '2', x: 100, y: 0 });
  assert.equal(presetExcess(src, dst, 'food', {}, 6), 40000);
  assert.equal(presetSurplus(src, dst, 'food', {}, 6), 90000); // 口径不同
  // 未超容时为 0
  const none = city({ cap: { food: 200000, steel: 0, mineral: 0, oil: 0, gold: 0 } });
  assert.equal(presetExcess(none, dst, 'food', {}, 6), 0);
  // 超出可装上限时被夹紧（卡车 100 辆 → 载重 12 万 > 4 万，此处不夹）
  const tight = city({ availTrucks: 1, cap: { food: 60000, steel: 0, mineral: 0, oil: 0, gold: 0 } });
  assert.equal(presetExcess(tight, dst, 'food', {}, 6), 1200);
});

test('excessAt / excessList / spaceAt：超容与容量余量', () => {
  const c = city({ stock: { food: 100000, steel: 200000, mineral: 50000, oil: 50000, gold: 0 },
                   cap: { food: 60000, steel: 400000, mineral: 30000, oil: 100000, gold: 0 } });
  assert.equal(excessAt(c, 'food'), 40000);
  assert.equal(excessAt(c, 'steel'), 0);
  assert.equal(excessAt(c, 'mineral'), 20000);
  const list = excessList(c);
  assert.equal(list.length, 2);
  assert.equal(list[0].res, 'food');            // 按超出量降序
  assert.equal(list[0].excess, 40000);
  assert.equal(spaceAt(c, 'steel'), 200000);
  assert.equal(spaceAt(c, 'food'), 0);
  assert.equal(spaceAt(c, 'gold'), Infinity);   // 容量 0 = 不限
});

test('receiverRanking 按容量余量推荐接收城', () => {
  const src = city({ cityId: '1' });
  const big = city({ cityId: '2', name: '大仓', stock: { food: 0, steel: 0, mineral: 0, oil: 0, gold: 0 },
                     cap: { food: 900000, steel: 0, mineral: 0, oil: 0, gold: 0 } });
  const small = city({ cityId: '3', name: '小仓', stock: { food: 0, steel: 0, mineral: 0, oil: 0, gold: 0 },
                       cap: { food: 100000, steel: 0, mineral: 0, oil: 0, gold: 0 } });
  const full = city({ cityId: '4', name: '满仓', stock: { food: 500000, steel: 0, mineral: 0, oil: 0, gold: 0 },
                      cap: { food: 500000, steel: 0, mineral: 0, oil: 0, gold: 0 } });
  const ranked = receiverRanking([src, big, small, full], src, 'food');
  assert.deepEqual(ranked.map((x) => x.city.cityId), ['2', '3']);  // 满仓余量 0，排除
  assert.equal(ranked[0].space, 900000);
});

test('黄金无底仓线：补底仓/全富余对其不生效（防「底仓线缺失被当成 0」）', () => {
  // 黄金储量充足、容量更大（未超容）
  const src = city({ stock: { gold: 4000000 }, cap: { gold: 55000000 } });
  const dst = city({ cityId: '2', x: 100, y: 0 });
  // 若把缺失的 floor.gold 兜成 0，会把整城黄金判为「富余」一次性运走
  assert.equal(presetSurplus(src, dst, 'gold', {}, 6), 0, 'y 全富余不应把黄金全运走');
  assert.equal(presetFill(src, dst, 'gold', {}, 6), 0, 'b 补底仓对黄金无意义');
  // 超容口径才是黄金的正确外运方式
  const over = city({ stock: { gold: 60000000 }, cap: { gold: 55000000 }, availTrucks: 100000 });
  assert.equal(presetExcess(over, dst, 'gold', {}, 6), 5000000, 'e 超容应运出超出容量的部分');
});

test('excessList 含黄金，且按超出量降序', () => {
  const c = city({
    stock: { gold: 60000000, food: 300000 },
    cap: { gold: 55000000, food: 200000 },
  });
  const list = excessList(c);
  const gold = list.find((x) => x.res === 'gold');
  assert.ok(gold, 'excessList 应包含黄金');
  assert.equal(gold.excess, 5000000);
});

test('cityLimits 的「无资源」判定含黄金', () => {
  const onlyGold = city({
    stock: { food: 0, steel: 0, mineral: 0, oil: 0, gold: 5000000 },
    cap: { gold: 55000000 },
  });
  // 只有黄金也应可发车（旧实现只看 RES_KEYS 会误判为无资源）
  assert.notEqual(cityLimits(onlyGold, null, 6).blocker, 'stock');
});

test('wrapIndex：列表选择循环（末行向下回首行，首行向上跳末行）', () => {
  const L = 16;
  // 中间步进
  assert.equal(wrapIndex(5, 1, L), 6);
  assert.equal(wrapIndex(5, -1, L), 4);
  // 边界环绕
  assert.equal(wrapIndex(L - 1, 1, L), 0, '末行向下应回到首行');
  assert.equal(wrapIndex(0, -1, L), L - 1, '首行向上应跳到末行');
  // 装载清单只有 5 行资源，同样适用
  assert.equal(wrapIndex(4, 1, 5), 0);
  assert.equal(wrapIndex(0, -1, 5), 4);
  // 单元素列表：来回都停在 0
  assert.equal(wrapIndex(0, 1, 1), 0);
  assert.equal(wrapIndex(0, -1, 1), 0);
  // 空列表不得产出 NaN
  assert.equal(wrapIndex(0, 1, 0), 0);
  assert.equal(wrapIndex(3, -1, 0), 0);
  // 跨多步也自洽（翻页类场景）
  assert.equal(wrapIndex(1, -5, 5), 1);
  assert.equal(wrapIndex(3, 7, 5), 0);
});
