/**
 * proto.js —— 响应字段解析 + 帧构造的共享库
 *
 * 收敛各脚本重复的解析器（w2status / w2train / w2transport 各存一份副本时，
 * 字段偏移修正只改一处、其余脚本仍按旧假设解析，会静默错位）。
 * 字段偏移的实测依据见 protocol/reference/ 对应命令条目。
 *
 * 约定：解析器只读原始 Buffer，不做网络与格式化；返回值为纯数据。
 */

// 兵种原型名（3007 两段表未覆盖的固定名，含工事与空军）
const ARMY_NAMES = {
  1: '步兵', 2: '骑兵', 3: '卡车', 4: '装甲车',
  5: '轻坦', 6: '重坦', 7: '突击炮', 8: '火箭',
  9: '侦察机', 10: '歼击机', 11: '轰炸机',
  12: '驱逐舰', 13: '潜艇', 14: '战列舰', 15: '航母', 16: '特种兵',
  17: '碉堡', 18: '榴弹炮', 19: '反坦炮', 20: '防空炮', 21: '围墙',
  30: '高炮', 31: '导弹车', 32: '攻击机', 33: '截击机',
};

// 建筑原型：军工厂、司令部与运输站（17001/17002 通用）
const BUILDING_PROTO = { ARMS_PLANT: 14, HEADQUARTERS: 13, TRANSPORT_STATION: 20 };
// 资源田原型 → 资源键
const FIELD_PROTO = { 3: 'food', 4: 'steel', 5: 'oil', 6: 'mineral' };

/** 2001 城池列表 → [{ cityId, name, x, y }]（cityId 为字符串） */
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
    str();                                 // mayor
    u32(); u32(); u32(); u32();            // population, morale, coastal, hasCarrier
    str();                                 // imgID
    u8();                                  // isColonial
    u32(); u32(); u32();                   // mayorIcon, constructNum, helpNum
    if (joinWar === 1) u32();              // leagueScorePlunderable
    u32(); u32(); u32(); u8();             // trainingCount, officerCount, officerCountMax, 未知尾字节
    list.push({ cityId, name, x, y });
  }
  return list;
}

/** 2003 资源储量与容量：粮@4/8、钢@32/36、矿@52/56、油@72/76（服务器实测为 u32，非客户端定义的 u64） */
function parse2003(raw) {
  const u32 = (o) => raw.readUInt32BE(o);
  return {
    food: u32(4), foodCap: u32(8),
    steel: u32(32), steelCap: u32(36),
    mineral: u32(52), mineralCap: u32(56),
    oil: u32(72), oilCap: u32(76),
  };
}

/** 2026 生产信息（固定 100B）：储量/容量/基础产量(tick)/军粮/黄金/人口 */
function parse2026(raw) {
  const u32 = (o) => raw.readUInt32BE(o);
  const u64 = (o) => Number(raw.readBigUInt64BE(o));
  return {
    foodA: u64(0), foodCap: u32(8), foodOut: u32(12), foodUsed: u64(16),
    steelA: u64(20), steelCap: u32(28), steelOut: u32(32),
    mineralA: u64(36), mineralCap: u32(44), mineralOut: u32(48),
    oilA: u64(52), oilCap: u32(60), oilOut: u32(64),
    goldA: u32(68), goldCap: u32(72), goldBase: u32(76), goldOut: u32(84),
    popIdle: raw.readInt32BE(96), // 有符号：部队超编时服务端返回负数
  };
}

/** 2018 产量加成（%）：实测四资源块数值相同，取首块 nature/tech/officer */
function parse2018(raw) {
  const u32 = (o) => raw.readUInt32BE(o);
  return { nature: u32(12), tech: u32(16), officer: u32(24) };
}

/** 2027 政令状态：民心/民怨/黄金/人口（当前城） */
function parse2027(raw) {
  if (!raw || raw.length < 68) return null;
  return {
    morale: raw.readUInt32BE(0),
    grievance: raw.readUInt32BE(4),
    moraleTrend: raw.readInt32BE(8),
    gold: raw.readUInt32BE(12),
    goldCap: raw.readUInt32BE(16),
    taxRate: raw.readUInt32BE(20),
    popAmount: raw.readUInt32BE(40),
    popCap: raw.readUInt32BE(44),
    popWorking: raw.readUInt32BE(48),
    popIdle: raw.readInt32BE(52),
  };
}

/**
 * 17001/17002 建筑列表 → [{ bid, proto, level }]
 * 条目固定 49B。计数位置两命令不同：17001 是首字节 u8，17002 是 `u32 areaCount + u8 count`。
 * @param {Buffer} raw
 * @param {1|4} prefix 1=17001（u8 计数），4=17002（跳过 4B 再读 u8）
 */
function parseBuildings49(raw, prefix = 1) {
  let off = prefix === 4 ? 4 : 0;
  const count = raw[off++];
  const list = [];
  for (let i = 0; i < count; i++) {
    const bid = raw.readBigUInt64BE(off).toString(); off += 8;
    const proto = raw.readUInt32BE(off); off += 4;
    const level = raw.readUInt32BE(off); off += 4;
    off += 8;   // position, status
    off += 24;  // remainTime, finishTime, totalTime
    off += 1;   // helped
    list.push({ bid, proto, level });
  }
  return list;
}

/**
 * 3006 兵营信息 → { training:[队列], trainables:{ armyId: {cur,food,mineral,oil,steel,nuclear,time} } }
 * 结构依据客户端 Prot3006.decode：头部 1 个未使用 int + 队列段 + 可训练兵种段；
 * speedup_item_price 是整包唯一尾字段（不参与解析，各兵种规格之后只出现一次）。
 */
function parse3006(raw) {
  let off = 0;
  const u8 = () => raw[off++];
  const u32 = () => { const v = raw.readUInt32BE(off); off += 4; return v; };
  const u64 = () => { const v = raw.readBigUInt64BE(off); off += 8; return v; };
  const str = () => { const L = u32(); off += L; };
  off += 4; // 客户端 decode 里 readInt() 后未使用的字段
  const queueCount = u32();
  const training = [];
  for (let i = 0; i < queueCount; i++) {
    training.push({ trainingId: u64().toString(), armyId: u32(), amount: u32(), remain: Number(u64()) });
    u64(); u8(); // totalTime, allowSpeedup
  }
  const trainCount = u32();
  const trainables = {};
  for (let i = 0; i < trainCount; i++) {
    const armyId = u32();
    const cur = u32(), food = u32(), mineral = u32(), oil = u32(), steel = u32(), nuclear = u32();
    const bN = u32();
    for (let j = 0; j < bN; j++) { u32(); u32(); u32(); }
    const tN = u32();
    for (let j = 0; j < tN; j++) { u32(); u32(); u32(); }
    const iN = u32();
    for (let j = 0; j < iN; j++) { u32(); str(); u32(); u32(); }
    const time = Number(u64());
    trainables[armyId] = { cur, food, mineral, oil, steel, nuclear, time };
  }
  return { training, trainables };
}

/** 19009 当前城驻军 → [{ id, name, count }] */
function parse19009(raw) {
  if (!raw || raw.length < 4) return [];
  let o = 0;
  const n = raw.readUInt32BE(o); o += 4;
  const list = [];
  for (let i = 0; i < n; i++) {
    const id = raw.readUInt32BE(o); o += 4;
    const count = raw.readUInt32BE(o); o += 4;
    list.push({ id, name: ARMY_NAMES[id] || `兵种#${id}`, count });
  }
  return list;
}

/**
 * 3005 训练队列 → [{ armyId, name, remainMs }]
 * 条件读取：status=0（空闲厂）仅占 16 字节无后续字段；status=1 才跟训练字段，
 * 按固定长循环会整体错位。
 */
function parse3005(raw) {
  if (!raw || raw.length < 4) return [];
  let o = 0;
  const qCount = raw.readUInt32BE(o); o += 4;
  const queues = [];
  for (let i = 0; i < qCount; i++) {
    o += 8; // bid
    o += 4; // position
    const status = raw.readUInt32BE(o); o += 4;
    if (status === 1) {
      o += 8; // trainingId
      const armyId = raw.readUInt32BE(o); o += 4;
      const remainMs = Number(raw.readBigUInt64BE(o)); o += 8;
      o += 8; // totalTime
      queues.push({ armyId, name: ARMY_NAMES[armyId] || `兵种#${armyId}`, remainMs });
    }
  }
  return queues;
}

/** 19009 → 指定兵种存量（找不到返回 0） */
function countArmy(raw, armyId) {
  const hit = parse19009(raw).find((a) => a.id === armyId);
  return hit ? hit.count : 0;
}

/**
 * 19008 在途远征列表（分页 50/页）→ { curPage, totalPage, list }
 * 服务器实测响应到 battle_id 结束（客户端基线的 stuck_* 段属寻路特性追加，服务器不回）。
 */
function parse19008(raw) {
  let off = 0;
  const u32 = () => { const v = raw.readUInt32BE(off); off += 4; return v; };
  const u8r = () => raw[off++];
  const u64r = () => { const v = raw.readBigUInt64BE(off); off += 8; return v; };
  const strr = () => { const L = u32(); off += L; };
  const curPage = u32(), totalPage = u32();
  const n = u32();
  const list = [];
  for (let i = 0; i < n; i++) {
    const reportId = u64r();
    u8r(); u8r();                    // expeditionType, expeditionState
    strr(); const startX = u32(), startY = u32();
    u32(); strr(); strr();           // targetPlaceType, targetPlace, targetIcon
    u32(); u32();                    // targetX, targetY
    u64r(); const remainTime = u64r();
    u64r();                          // battleId
    list.push({ reportId, startX, startY, remainTime });
  }
  return { curPage, totalPage, list };
}

/**
 * 19001 远征前置数据 → 行军加成（客户端发起远征前先取，用于实时行军时间/容量计算）
 * 字段序依据客户端 Prot19001.decode（实测 83B 恰好平账）。
 */
function parse19001(raw) {
  let off = 0;
  const u16 = () => { const v = raw.readUInt16BE(off); off += 2; return v; };
  const u64r = () => { const v = raw.readBigUInt64BE(off); off += 8; return v; };
  const str = () => { const L = raw.readUInt32BE(off); off += 4; const s = raw.subarray(off, off + L).toString('utf8'); off += L; return s; };
  const dbl = () => { const v = raw.readDoubleBE(off); off += 8; return v; };
  const capacityAdd = u16();
  const landSpeedAdd = u16();
  const airSpeedAdd = u16();
  const allySpeedAdd = u16();
  const commandArtAdd = u16();
  const armyFlagAdd = u16();
  const commanderCount = raw[off++];
  const officers = [];
  for (let i = 0; i < commanderCount; i++) {
    officers.push({ officerId: u64r(), officerName: str(), addPercent: u16(), skillOilCost: str() });
  }
  const curServerTime = u64r();
  const consumeOil = str();
  const allianceTechCostOil = str();
  const speedFactor = dbl();                 // global_army_speed_add：倍率（实测 3 = 3 倍速）
  const dispatchCountAdd = raw.length - off >= 8 ? dbl() : 0;
  return {
    capacityAdd,
    landSpeedAdd: landSpeedAdd / 100,        // 客户端按百分比使用（实测 50 → +50%）
    airSpeedAdd: airSpeedAdd / 100,
    allySpeedAdd: allySpeedAdd / 100,
    commandArtAdd: commandArtAdd / 100,
    armyFlagAdd: armyFlagAdd / 100,
    officers,
    curServerTime,
    consumeOil,
    allianceTechCostOil,
    speedFactor,
    dispatchCountAdd,
  };
}

/**
 * 19003 运输帧（expeditionType=2，非寻路模式）明文 93B
 * carry 缺省为 0；资源量取整后写入（浮点渗入会抛 RangeError）。
 */
function buildTransport19003Payload({ trucks, tx, ty, carry = {}, key, expeditionType = 2, commanderId = -1n }) {
  const buf = Buffer.alloc(93);
  let o = 0;
  const res = (v) => BigInt(Math.round(Number(v) || 0));
  buf.writeUInt8(1, o++);                        // armyKindCount = 1
  buf.writeUInt8(3, o++);                        // armyId = 3 (卡车，唯一合法运输载具)
  buf.writeUInt32BE(trucks, o); o += 4;          // 车辆数
  buf.writeUInt32BE(tx, o); o += 4;              // 目标坐标
  buf.writeUInt32BE(ty, o); o += 4;
  buf.writeUInt8(expeditionType, o++);           // 2=TRANSPORT 4=DISPATCH
  buf.writeUInt8(0, o++);
  buf.writeBigInt64BE(commanderId, o); o += 8;   // 运输填 -1；派遣填军官 ID
  buf.writeUInt32BE(0, o); o += 4;
  for (const k of ['food', 'steel', 'oil', 'mineral', 'gold']) {
    buf.writeBigUInt64BE(res(carry[k]), o); o += 8;
  }
  buf.writeUInt32BE(0, o); o += 4;               // transportTimeInterval = 0（手动）
  buf.writeUInt32BE(0, o); o += 4;               // transportTotalNum = 0
  buf.writeInt32BE(-1, o); o += 4;               // assemblyId
  buf.writeInt32BE(-1, o); o += 4;               // allianceCapitalFort
  buf.writeUInt8(0, o++);                        // isBreakTruce = 0
  key.copy(buf, o, 0, 8);                        // 会话内最新 26022 调度 key
  return buf;
}

export {
  ARMY_NAMES,
  BUILDING_PROTO,
  FIELD_PROTO,
  parseCityList,
  parse2003,
  parse2026,
  parse2018,
  parse2027,
  parseBuildings49,
  parse3006,
  parse3005,
  parse19009,
  countArmy,
  parse19008,
  parse19001,
  buildTransport19003Payload,
};
