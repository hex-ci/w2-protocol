/**
 * formula.js —— 全项目通用数值公式库（纯函数，零依赖）
 *
 * 各业务脚本的数值计算统一从这里取，脚本内不再内联——口径集中维护、便于复用与单测。
 * 分区：几何 / 行军远征 / 资源产需 / 训练 / 运输物流 / 远征配额。
 * 新增公式：加到对应分区，并在 test/formula.test.js 补断言。
 *
 * 实测口径来源：protocol/topics/transport.md、reference/02-city.md、reference/03-army.md。
 */

// ---------- 常量 ----------

const TRUCK_ARMY_ID = 3;
const SCOUT_ARMY_ID = 9;
const TRUCK_LOAD = 1200;          // 卡车单车载重
const TRUCK_SPEED = 1150;         // 卡车基础移速（3007 原型 moveSpeed）
const MARCH_MIN_TIME = 30;        // 行军最短基准秒数
const MARCH_ONE_TILE_DISTANCE = 100000;

const RES_KEYS = ['food', 'steel', 'mineral', 'oil'];
const RES_ALL = [...RES_KEYS, 'gold'];
const RES_CN = { food: '粮', steel: '钢', mineral: '矿', oil: '油', gold: '金' };

// 发车油料保留线默认小时数（油是双用途资源：训练料 + 发车燃料，须独立于训练底仓线）
const DEFAULT_FUEL_RESERVE_HOURS = 6;

// ---------- 几何 ----------

/** 两城欧氏距离（格） */
function distance(c1, c2) {
  const dx = c1.x - c2.x;
  const dy = c1.y - c2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// ---------- 行军/远征 ----------

/**
 * 油耗口径的行军秒数（基础速度，不含任何加成）。
 * 服务器扣油与实时速度加成无关——实测 3 笔交叉验证（含加成比基础快 ~18 倍，
 * 扣油仍与基础 T 的预测吻合）。油耗公式必须用它。
 */
function calcMarchSec(d, speed = TRUCK_SPEED) {
  return Math.ceil(MARCH_MIN_TIME + (d * MARCH_ONE_TILE_DISTANCE) / speed);
}

/**
 * 含加成的实时行军速度（客户端公式，实测标定）。
 *   V = 基础移速 × (1 + 陆地速度加成 + 0.5 × 运输站等级) × 全局倍率
 * - 运输站（proto=20）等级取**出发城**（同距离反向对照实测确权）；
 * - landSpeedAdd / speedFactor 来自 19001 远征前置数据（实测样本：+50%、×3）。
 * @param {object} b { baseSpeed=1150, landSpeedAdd=0, stationLevel=0, speedFactor=1 }
 */
function realMarchSpeed({ baseSpeed = TRUCK_SPEED, landSpeedAdd = 0, stationLevel = 0, speedFactor = 1 } = {}) {
  const v = baseSpeed * (1 + landSpeedAdd + 0.5 * stationLevel) * speedFactor;
  return v > 0 ? v : baseSpeed;
}

/**
 * 含加成的真实单程行军秒数（界面展示用）。
 * @param {number} d 距离（格）
 * @param {object} bonus { baseSpeed, landSpeedAdd, stationLevel, speedFactor }
 */
function realMarchSec(d, bonus = {}) {
  const v = realMarchSpeed(bonus);
  return Math.ceil(MARCH_MIN_TIME + (d * MARCH_ONE_TILE_DISTANCE) / v);
}

/** 单卡车单程油耗 ≈ 0.01313 × T^0.72（296 格、2~8000 车实测偏差 <2%）；T 为基础口径 */
function oilPerTruck(d) {
  if (d <= 0) return 0;
  return 0.01313 * Math.pow(calcMarchSec(d), 0.72);
}

/** 总油耗 = 单均 × 车数（对车数线性） */
function estOil(d, trucks) {
  if (trucks <= 0) return 0;
  return Math.round(oilPerTruck(d) * trucks);
}

// ---------- 资源产需 ----------

/** 实收产率（/h）= 基础产率（tick 刻度）× 加成百分比 ÷ 100 */
function prodRate(basicOutput, bonusPercent) {
  return basicOutput * bonusPercent / 100;
}

/** 满负荷需求（/h）= 单件耗料 × 每小时产能 */
function demandRate(unitCost, unitsPerHour) {
  return unitCost * unitsPerHour;
}

/** 底仓线 = 产率/需求率 × 小时数（取整，避免浮点渗入帧构造） */
function baselineOf(ratePerHour, hours) {
  return Math.round(ratePerHour * hours);
}

/** 相对底仓线的富余（高于线部分） */
function surplusOf(amount, floor) {
  return Math.max(0, amount - floor);
}

/** 相对底仓线的缺口（低于线部分） */
function deficitOf(amount, floor) {
  return Math.max(0, floor - amount);
}

/** 超出仓库容量的部分（储量过容量即爆仓停产，需外运释放产能） */
function excessOf(amount, capacity) {
  return capacity > 0 ? Math.max(0, amount - capacity) : 0;
}

/** 仓库容量余量（还能再收多少；容量未知时返回 Infinity，表示不做限制） */
function spaceLeftOf(amount, capacity) {
  if (!(capacity > 0)) return Infinity;
  return Math.max(0, capacity - amount);
}

// ---------- 训练 ----------

/**
 * 训练量的资源上限：各资源「库存 ÷ 单价」取最小（单价为 0 的资源不参与约束）。
 * @param {object} stock 库存 { food, steel, mineral, oil, ... }
 * @param {object} cost  单价 { food, steel, mineral, oil, ... }
 */
function trainResCap(stock, cost) {
  let cap = Infinity;
  for (const [k, c] of Object.entries(cost)) {
    if (!c) continue;
    cap = Math.min(cap, (stock[k] || 0) / c);
  }
  return cap === Infinity ? Infinity : Math.floor(Math.max(0, cap));
}

/** 训练量的人口上限 = floor(空闲人口 ÷ 每单位占人口)；人口参数未知（<=0）时不约束 */
function trainPopCap(popIdle, armyPopulation) {
  if (!(armyPopulation > 0)) return Infinity;
  return Math.max(0, Math.floor(popIdle / armyPopulation));
}

/** 训练完成毫秒 = 单件毫秒 × 数量 */
function trainFinishMs(unitMs, amount) {
  return unitMs * amount;
}

/**
 * 军工厂训练队列上限 = 厂等级（实测：L9 厂 9 条、L10 厂 10 条；超出上限的订单
 * 被服务端拒绝）。队列是**串行**的（同厂第 2 笔在队首产完前 remain 不递减），
 * 因此上限只限制「下单笔数」，不限制单笔数量——单笔可一次装下全城资源上限。
 * @param {number} level 厂等级
 */
function trainQueueCap(level) {
  return level > 0 ? level : 0;
}

/**
 * 满负荷产能（件/h）：各厂 3600 ÷ 该厂单件秒 之和。
 * 实测同城各厂单件耗时一致（受城内加成影响、全域按城不同），故通常等于 厂数 × 3600/单件秒；
 * 但仍按逐厂累加实现，厂间不一致时结果依然正确。
 * @param {number[]} plantTimesMs 各厂该兵种的单件毫秒
 */
function armyCin(plantTimesMs) {
  let cin = 0;
  for (const ms of plantTimesMs) {
    if (ms > 0) cin += 3600 / (ms / 1000);
  }
  return cin;
}

/**
 * 兵种满负荷需求向量（/h）：每资源 = 单价 × 产能。
 * 这是产需模型的 D 层——兵种一变，D 与底仓线同步变化（实测侦察机与重型坦克的粮需求差 7 倍）。
 * @param {object} cost 单价 { food, steel, mineral, oil }
 * @param {number} cin  产能（件/h，由 armyCin 得出）
 * @param {string[]} keys 资源键（缺省只算四种常规资源，核资源另计）
 */
function armyDemand(cost, cin, keys = RES_KEYS) {
  const out = {};
  for (const k of keys) out[k] = demandRate(cost[k] || 0, cin);
  return out;
}

/**
 * 兵种底仓线向量：需求 × 小时数，逐项取整（避免浮点渗入帧构造）。
 * @param {object} demand D 向量
 * @param {number} hours  底仓线小时数
 */
function armyFloor(demand, hours, keys = RES_KEYS) {
  const out = {};
  for (const k of keys) out[k] = baselineOf(demand[k] || 0, hours);
  return out;
}

/**
 * 可训练兵种规格查询：从兵种数据表（protocol/army.json）取。
 * 表由 tools/genarmy.js 从 3006/3007 导出，cost 全域一致。
 * @param {Array} arms 数据表 arms 数组
 * @param {number} armyId 兵种 ID（缺省侦察机 SCOUT_ARMY_ID）
 */
function armySpec(arms, armyId = SCOUT_ARMY_ID) {
  return arms.find((a) => a.id === armyId) || null;
}

/** 把 total 平均分配到 parts 份：前 remainder 份各 +1（用于多厂平分下单） */
function splitEvenly(total, parts) {
  if (!Number.isFinite(total)) return Array.from({ length: parts }, () => total);
  const base = Math.floor(total / parts);
  const remainder = total % parts;
  return Array.from({ length: parts }, (_, i) => base + (i < remainder ? 1 : 0));
}

// ---------- 运输物流 ----------

/** 运 amount 资源所需卡车数 = ceil(amount ÷ 单车载重) */
function trucksFor(amount) {
  return Math.ceil(amount / TRUCK_LOAD);
}

/** 车队的载重上限 = 车数 × 单车载重 */
function carryCapacity(trucks) {
  return trucks * TRUCK_LOAD;
}

/** 发车油料预算 = 物理石油 − 训练油保留（oilPerHour × reserveHours），不低于 0 */
function fuelBudgetOf(physOil, oilPerHour, reserveHours) {
  return Math.max(0, physOil - oilPerHour * reserveHours);
}

/** 给定油料预算下最多能派出的车数（perTruckOil = 每车分摊油耗；<=0 时不约束） */
function trucksByBudget(budget, perTruckOil) {
  if (!(perTruckOil > 0)) return Infinity;
  return Math.max(0, Math.floor(budget / perTruckOil));
}

// ---------- 远征配额 ----------

/** 每城同时在外部队数上限 = 司令部等级（等级未知时不拦截，交给服务器裁决） */
function expeditionSlots(hqLevel) {
  return hqLevel > 0 ? hqLevel : Infinity;
}

export {
  // 常量
  TRUCK_ARMY_ID,
  SCOUT_ARMY_ID,
  TRUCK_LOAD,
  TRUCK_SPEED,
  MARCH_MIN_TIME,
  MARCH_ONE_TILE_DISTANCE,
  RES_KEYS,
  RES_ALL,
  RES_CN,
  DEFAULT_FUEL_RESERVE_HOURS,
  // 几何
  distance,
  // 行军/远征
  calcMarchSec,
  realMarchSpeed,
  realMarchSec,
  oilPerTruck,
  estOil,
  // 资源产需
  prodRate,
  demandRate,
  baselineOf,
  surplusOf,
  deficitOf,
  excessOf,
  spaceLeftOf,
  // 训练
  trainResCap,
  trainPopCap,
  trainFinishMs,
  trainQueueCap,
  armyCin,
  armyDemand,
  armyFloor,
  armySpec,
  splitEvenly,
  // 运输物流
  trucksFor,
  carryCapacity,
  fuelBudgetOf,
  trucksByBudget,
  // 远征配额
  expeditionSlots,
};
