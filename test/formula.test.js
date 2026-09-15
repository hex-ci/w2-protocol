import assert from 'node:assert/strict';
import test from 'node:test';
import {
  distance, calcMarchSec, realMarchSpeed, realMarchSec, oilPerTruck, estOil,
  prodRate, demandRate, baselineOf, surplusOf, deficitOf, excessOf, spaceLeftOf,
  trainResCap, trainPopCap, trainFinishMs, trainQueueCap, splitEvenly,
  armyCin, armyDemand, armyFloor, armySpec,
  trucksFor, carryCapacity, fuelBudgetOf, trucksByBudget,
  expeditionSlots,
  RES_ALL, TRUCK_LOAD,
} from '../lib/formula.js';

test('几何：欧氏距离', () => {
  assert.equal(distance({ x: 0, y: 0 }, { x: 3, y: 4 }), 5);
  assert.equal(distance({ x: 10, y: 10 }, { x: 10, y: 10 }), 0);
});

test('行军：油耗口径 T（基础速度）', () => {
  assert.equal(calcMarchSec(0), 30);
  assert.equal(calcMarchSec(100), Math.ceil(30 + (100 * 100000) / 1150));
  // 可传自定义速度（侦察机 5000）
  assert.equal(calcMarchSec(100, 5000), Math.ceil(30 + (100 * 100000) / 5000));
});

test('行军：真实速度（19001 加成 + 出发城运输站）', () => {
  assert.equal(realMarchSpeed({}), 1150);
  assert.equal(realMarchSpeed({ landSpeedAdd: 0.5, stationLevel: 9, speedFactor: 3 }), 20700);
  assert.equal(realMarchSpeed({ landSpeedAdd: 0.5, stationLevel: 10, speedFactor: 3 }), 22425);
  assert.equal(realMarchSpeed({ speedFactor: 0 }), 1150); // 非法退化
  // 实测对照 d=124.4
  assert.ok(Math.abs(realMarchSec(124.4, { landSpeedAdd: 0.5, stationLevel: 9, speedFactor: 3 }) - 630.2) < 2);
});

test('行军：油耗', () => {
  assert.equal(estOil(0, 10), 0);
  assert.equal(estOil(100, 0), 0);
  assert.equal(oilPerTruck(100), 0.01313 * Math.pow(calcMarchSec(100), 0.72));
  assert.equal(estOil(100, 5), Math.round(oilPerTruck(100) * 5));
});

test('产需：产率/需求/底仓线', () => {
  assert.equal(prodRate(100, 150), 150);        // basic × 150% = 150/h
  assert.equal(demandRate(150, 100), 15000);    // 单价 × 产能
  assert.equal(baselineOf(1000, 24), 24000);
  assert.equal(baselineOf(33.333, 3), 100);     // 取整
});

test('产需：富余/缺口', () => {
  assert.equal(surplusOf(100, 30), 70);
  assert.equal(surplusOf(20, 30), 0);
  assert.equal(deficitOf(20, 30), 10);
  assert.equal(deficitOf(100, 30), 0);
});

test('训练：资源/人口上限与平分', () => {
  const cap = trainResCap({ food: 1000, steel: 500, mineral: 0, oil: 100 }, { food: 10, steel: 10, mineral: 0, oil: 50 });
  assert.equal(cap, 2); // min(1000/10=100, 500/10=50, 100/50=2)
  assert.equal(trainResCap({ food: 1000 }, {}), Infinity);   // 无成本项
  assert.equal(trainResCap({ food: 0 }, { food: 10 }), 0);
  assert.equal(trainPopCap(100, 1), 100);
  assert.equal(trainPopCap(100, 2), 50);
  assert.equal(trainPopCap(100, 0), Infinity); // 未知人口不约束
  assert.equal(trainPopCap(-5, 2), 0);         // 超编为负
  assert.equal(trainFinishMs(31000, 100), 3100000);
  assert.deepEqual(splitEvenly(10, 3), [4, 3, 3]);
  assert.deepEqual(splitEvenly(9, 3), [3, 3, 3]);
  assert.deepEqual(splitEvenly(2, 3), [1, 1, 0]);
});

test('训练：军工厂队列上限 = 厂等级（实测 L9=9 / L10=10）', () => {
  assert.equal(trainQueueCap(9), 9);
  assert.equal(trainQueueCap(10), 10);
  assert.equal(trainQueueCap(0), 0, '等级未知不臆造上限');
  assert.equal(trainQueueCap(-1), 0);
});

test('物流：车数/载重/油料预算', () => {
  assert.equal(trucksFor(0), 0);
  assert.equal(trucksFor(1), 1);
  assert.equal(trucksFor(TRUCK_LOAD), 1);
  assert.equal(trucksFor(TRUCK_LOAD + 1), 2);
  assert.equal(carryCapacity(3), 3 * TRUCK_LOAD);
  assert.equal(fuelBudgetOf(10000, 100, 6), 9400);
  assert.equal(fuelBudgetOf(500, 100, 6), 0);      // 不低于 0
  assert.equal(trucksByBudget(1000, 10), 100);
  assert.equal(trucksByBudget(1000, 0), Infinity); // 不约束
  assert.equal(trucksByBudget(0, 10), 0);
});

test('配额：出征位', () => {
  assert.equal(expeditionSlots(9), 9);
  assert.equal(expeditionSlots(0), Infinity);
  assert.equal(expeditionSlots(null), Infinity);
});

test('常量：RES_ALL 含黄金且顺序稳定（帧构造依赖）', () => {
  assert.deepEqual(RES_ALL, ['food', 'steel', 'mineral', 'oil', 'gold']);
});

test('excessOf / spaceLeftOf：超容量与容量余量', () => {
  assert.equal(excessOf(150, 100), 50);
  assert.equal(excessOf(80, 100), 0);
  assert.equal(excessOf(100, 100), 0);
  assert.equal(excessOf(150, 0), 0);          // 容量未知/为 0 时不计超容
  assert.equal(spaceLeftOf(30, 100), 70);
  assert.equal(spaceLeftOf(120, 100), 0);
  assert.equal(spaceLeftOf(30, 0), Infinity); // 容量未知视为不限
});

test('armyCin：满负荷产能 = Σ 厂(3600 ÷ 单件秒)', () => {
  // 单厂 30s → 120 件/h
  assert.equal(armyCin([30000]), 120);
  // 8 厂同耗时（实测同城各厂一致）
  assert.equal(armyCin(Array(8).fill(30000)), 960);
  // 厂间不一致时逐厂累加（实现按累加，结果正确）
  assert.ok(Math.abs(armyCin([30000, 60000]) - (120 + 60)) < 1e-9);
  // 非法耗时（0/负数）不计入，避免除零得到 Infinity
  assert.equal(armyCin([0, -1]), 0);
  assert.equal(armyCin([]), 0);
});

test('armyDemand：需求层 D = 单价 × 产能（兵种一变 D 全变）', () => {
  const scout = { food: 50, steel: 150, mineral: 50, oil: 100 };
  const heavy = { food: 500, steel: 1200, mineral: 400, oil: 600 };
  const cin = 1000;
  const dScout = armyDemand(scout, cin);
  const dHeavy = armyDemand(heavy, cin);
  assert.equal(dScout.food, 50000);
  assert.equal(dScout.oil, 100000);
  // 重坦粮需求是侦察机的 10 倍（单价 500/50）
  assert.equal(dHeavy.food / dScout.food, 10);
  // D 与 Cin 成正比
  assert.equal(armyDemand(scout, 2000).food, dScout.food * 2);
  // 单价为 0 的资源不产生需求
  assert.equal(armyDemand({ food: 0 }, cin).food, 0);
});

test('armyFloor：底仓线 = D × 小时数（逐项取整）', () => {
  const demand = { food: 58370.4, steel: 175109.1, mineral: 58370.4, oil: 116739.8 };
  const f24 = armyFloor(demand, 24);
  assert.equal(f24.food, Math.round(58370.4 * 24));
  assert.equal(f24.oil, Math.round(116739.8 * 24));
  // 线性：12h 恰为 24h 的一半（取整后允许 ±1）
  const f12 = armyFloor(demand, 12);
  assert.ok(Math.abs(f12.food * 2 - f24.food) <= 1);
  // 整数结果（不渗浮点，供帧构造使用）
  for (const v of Object.values(f24)) assert.ok(Number.isInteger(v));
});

test('armySpec：从数据表取兵种规格（含缺省侦察机与未知 ID）', () => {
  const arms = [
    { id: 9, name: '侦察机:蚊式', cost: { food: 50, steel: 150, mineral: 50, oil: 100 }, population: 1 },
    { id: 3, name: '卡车:GMC', cost: { food: 50, steel: 250, mineral: 10, oil: 50 }, population: 2 },
  ];
  assert.equal(armySpec(arms).id, 9, '缺省应取侦察机');
  assert.equal(armySpec(arms, 3).name, '卡车:GMC');
  assert.equal(armySpec(arms, 999), null, '未知 ID 返回 null');
});

test('公式一致性：同一份库存下兵种决定训练量上限（资源口径）', () => {
  const stock = { food: 1e7, steel: 1e7, mineral: 1e7, oil: 1e7 };
  const scout = { food: 50, steel: 150, mineral: 50, oil: 100 };
  const heavy = { food: 500, steel: 1200, mineral: 400, oil: 600 };
  // 训练量上限走 trainResCap（已存在，兵种无关公式）
  assert.equal(trainResCap(stock, scout), 66666);        // min(1e7/50=200000, /150=66666, /50, /100)
  assert.equal(trainResCap(stock, heavy), 8333);          // min(20000, 8333, 25000, 16666)
  // 人口上限随兵种人口占位变化
  assert.equal(trainPopCap(100000, 1), 100000);           // 侦察机
  assert.equal(trainPopCap(100000, 40), 2500);            // 战列舰
});
