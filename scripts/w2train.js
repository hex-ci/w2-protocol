#!/usr/bin/env node

'use strict';

/**
 * w2train.js —— 全域造兵
 *
 * 在所有城池（或 --city 指定城）的军工厂批量训练指定兵种（默认侦察机）。
 * 逐城切城 → 扫描军工厂 → 按当前城资源算出各厂最大可造数 → 逐厂下单。
 *
 * 频控：SDK 自带 500ms 请求间隔，命令间再叠加随机抖动，模拟人工节奏。
 *
 * 用法:
 *   node scripts/w2train.js                     所有城造侦察机（资源允许的最大量）
 *   node scripts/w2train.js --army 10           指定兵种（armyId，见 3007 兵种表）
 *   node scripts/w2train.js --city 103636       只在指定城造
 *   node scripts/w2train.js --max 100           每厂最多造 100 架（不填=不限，仅受资源约束）
 *   node scripts/w2train.js --dry               只模拟计算，不下单
 */

const config = require('../lib/config.js');
const { W2Client, p } = require('../lib/sdk.js');

const argv = process.argv.slice(2);
const arg = (n, d) => {
  const i = argv.indexOf('--' + n);
  return i >= 0 && i + 1 < argv.length ? argv[i + 1] : d;
};
const has = (n) => argv.includes('--' + n);

const ARMY_ID = parseInt(arg('army', '9'), 10);      // 9 = 侦察机:蚊式
const MAX_PER_PLANT = arg('max', '') ? parseInt(arg('max', ''), 10) : Infinity;
const ONLY_CITY = arg('city', '');
const DRY = has('dry');

// 频控抖动：每次写操作前随机等待，模拟人工
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const jitter = () => sleep(300 + Math.floor(Math.random() * 500));

// ---------- 解析器 ----------

/** 2001 城池列表 → [{ cityId, name, x, y }]（结构依据客户端 Cityinfo 定义） */
function parseCityList(raw) {
  let off = 0;
  const u8 = () => raw[off++];
  const u32 = () => { const v = raw.readUInt32BE(off); off += 4; return v; };
  const u64 = () => { const v = raw.readBigUInt64BE(off); off += 8; return v; };
  const str = () => { const L = u32(); const s = raw.subarray(off, off + L).toString('utf8'); off += L; return s; };
  const joinWar = u8();
  const count = u8();
  const cities = [];
  for (let i = 0; i < count; i++) {
    const cityId = u64(), name = str(), x = u32(), y = u32(), mayor = str();
    u32(); u32(); u32(); u32();       // population, morale, coastal, hasCarrier
    str();                            // imgID
    u8(); u32(); u32();               // isColonial, mayorIcon, constructNum
    const haveTech = u8();
    if (haveTech === 1) { u32(); u32(); }
    u32();                            // helpNum
    if (joinWar === 1) u32();         // leagueScorePlunderable
    u32(); u32(); u32();              // trainingCount, officerCount, officerCountMax
    cities.push({ cityId: cityId.toString(), name, x, y });
  }
  return cities;
}

/** 17001 军事建筑列表（当前城）→ [{ bid, proto, level }] */
function parseMilitaryBuildings(raw) {
  let off = 0;
  const u8 = () => raw[off++];
  const u32 = () => { const v = raw.readUInt32BE(off); off += 4; return v; };
  const u64 = () => { const v = raw.readBigUInt64BE(off); off += 8; return v; };
  const count = u8();
  const list = [];
  for (let i = 0; i < count; i++) {
    const bid = u64(), proto = u32(), level = u32(), pos = u32(), status = u32();
    u64(); u64(); u64(); u8();        // remainTime, finishTime, totalTime, helped
    list.push({ bid: bid.toString(), proto, level });
  }
  return list;
}

/**
 * 3006 兵营信息 → { training: [队列], trainables: {armyId: {cur, food, mineral, oil, steel, time}} }
 * 结构依据客户端 Prot3006.decode：头部 1 个被丢弃的 int + 两段列表 + speedupPrice
 */
function parsePlantInfo(raw) {
  let off = 0;
  const u8 = () => raw[off++];
  const u32 = () => { const v = raw.readUInt32BE(off); off += 4; return v; };
  const u64 = () => { const v = raw.readBigUInt64BE(off); off += 8; return v; };
  const str = () => { const L = u32(); const s = raw.subarray(off, off + L).toString('utf8'); off += L; return s; };
  off += 4;                           // 客户端 decode 里 readInt() 后未使用的字段
  const queueCount = u32();
  const training = [];
  for (let i = 0; i < queueCount; i++) {
    training.push({ trainingId: u64().toString(), armyId: u32(), amount: u32(), remain: Number(u64()) });
    u64(); u8();                      // totalTime, allowSpeedup
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

/**
 * 2003 当前城资源。服务器实现中储量字段为 u32：
 *   food@4, steel@32, mineral@52, oil@72（各资源块 24B，amount 在块内 +0，容量 +4）
 * 偏移经切城 diff 实测验证，勿按客户端 readLong 定义照搬。
 */
function parseResources(raw) {
  const u32 = (o) => raw.readUInt32BE(o);
  return {
    food: u32(4),
    steel: u32(32),
    mineral: u32(52),
    oil: u32(72),
  };
}

const fmt = (n) => Number(n).toLocaleString('en-US');
const fmtDur = (ms) => {
  const s = Math.ceil(ms / 1000);
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = s % 60;
  return h > 0 ? `${h}时${m}分` : (m > 0 ? `${m}分${ss}秒` : `${ss}秒`);
};

(async function main() {
  const lp = config.loginParams();
  if (!config.host || !lp) {
    console.log('缺少配置：请把真实值写入 .env（W2_HOST 与 W2_LOGIN_*，模板见 .env.example）');
    process.exit(1);
  }
  console.log(`目标 ${config.host}:${config.port}`);
  console.log('注意: 会建立独立会话，已在线的客户端可能被挤下线。');

  const c = new W2Client({ host: config.host, port: config.port, loginParams: lp });
  try {
    await c.connect();
  } catch (e) {
    console.log('连接失败:', e.message);
    process.exit(1);
  }

  // 城池列表
  const cities = parseCityList((await c.call(2001, Buffer.alloc(0))).raw);
  const targets = ONLY_CITY ? cities.filter((x) => x.cityId === ONLY_CITY) : cities;
  if (!targets.length) {
    console.log('未找到目标城池');
    c.close();
    return;
  }
  console.log(`共 ${cities.length} 座城池，本次处理 ${targets.length} 座\n`);

  // 记录操作前的当前城，全部结束后切回（当前城 = 1005.activeCityId）
  const originCityId = (await c.call(1005, Buffer.alloc(0), {
    fields: [
      ['game_status', 'u32'],
      ['diamond_owned', 'u32'],
      ['active_city_id', 'u64'],
    ],
  })).active_city_id.toString();

  // 3007 兵种原型表：取兵种名用于报告
  let armyName = `兵种${ARMY_ID}`;
  const protoRaw = (await c.call(3007, Buffer.alloc(0))).raw;
  {
    let off = 0;
    const u32 = () => { const v = protoRaw.readUInt32BE(off); off += 4; return v; };
    const str = () => { const L = u32(); const s = protoRaw.subarray(off, off + L).toString('utf8'); off += L; return s; };
    const n = u32();
    for (let i = 0; i < n; i++) {
      u32(); const id = u32(); u32();
      const name = str();
      str();
      off += 4 * 14;
      if (id === ARMY_ID) { armyName = name; break; }
    }
  }
  console.log(`兵种确认: ${armyName}\n`);

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

    // 军工厂（BuildingType.ARMS_PLANT = 14）
    const plants = parseMilitaryBuildings((await c.call(17001, Buffer.alloc(0))).raw)
      .filter((b) => b.proto === 14);
    if (!plants.length) {
      console.log(`○ ${city.name}: 无军工厂，跳过`);
      continue;
    }

    // 当前城资源
    const res = parseResources((await c.call(2003, Buffer.alloc(0))).raw);
    const resBefore = { ...res };

    console.log(`━━ ${city.name} (${city.x},${city.y}) 军工厂×${plants.length}`);
    console.log(`   资源: 粮 ${fmt(res.food)} | 钢 ${fmt(res.steel)} | 矿 ${fmt(res.mineral)} | 油 ${fmt(res.oil)}`);

    let cityTrain = 0;
    let cityFinish = 0;
    const plantReports = [];

    // 第一遍：收集各厂该兵种的规格（单价/耗时）
    const specs = [];
    for (const plant of plants) {
      await jitter();
      const info = parsePlantInfo((await c.call(3006, p.u64(plant.bid))).raw);
      const spec = info.trainables[ARMY_ID];
      if (spec) specs.push({ plant, spec });
      else plantReports.push(`   ○ 厂#${plant.bid.slice(-3)}(L${plant.level}): 不支持该兵种`);
    }
    if (!specs.length) {
      plantReports.forEach((s) => console.log(s));
      console.log('');
      continue;
    }

    // 平分策略：总可造数按厂均分，资源是一次性总账（同城同兵种单价一致）
    // 总量 = min(各资源/单价)，每厂 base = floor(总量/N)，前 remainder 个厂各 +1
    const s0 = specs[0].spec;
    const totalAffordable = Math.floor(Math.min(
      s0.food ? res.food / s0.food : Infinity,
      s0.mineral ? res.mineral / s0.mineral : Infinity,
      s0.oil ? res.oil / s0.oil : Infinity,
      s0.steel ? res.steel / s0.steel : Infinity
    ));
    const perPlant = Math.min(
      Math.floor(totalAffordable / specs.length),
      MAX_PER_PLANT
    );
    const remainder = Math.min(
      MAX_PER_PLANT === Infinity ? totalAffordable % specs.length : 0,
      totalAffordable - perPlant * specs.length,
      specs.length
    );

    if (totalAffordable === 0) {
      plantReports.push(`   ○ 资源不足 1 架（需 粮${s0.food} 矿${s0.mineral} 油${s0.oil} 钢${s0.steel}/架）`);
      plantReports.forEach((s) => console.log(s));
      console.log(`   余量: 粮 ${fmt(res.food)} | 钢 ${fmt(res.steel)} | 矿 ${fmt(res.mineral)} | 油 ${fmt(res.oil)}`);
      console.log('');
      continue;
    }

    // 第二遍：逐厂下单
    for (let i = 0; i < specs.length; i++) {
      const { plant, spec } = specs[i];
      const amount = perPlant + (i < remainder ? 1 : 0);
      if (amount === 0) {
        plantReports.push(`   ○ 厂#${plant.bid.slice(-3)}(L${plant.level}): 平分后不足 1 架`);
        continue;
      }

      const finishMs = spec.time * amount;
      const finishAt = new Date(Date.now() + finishMs).toLocaleTimeString('zh-CN', { hour12: false });

      if (DRY) {
        plantReports.push(`   ▷ 厂#${plant.bid.slice(-3)}(L${plant.level}): 将造 ${fmt(amount)} 架，需 ${fmtDur(finishMs)}（约 ${finishAt} 完成）`);
        res.food -= spec.food * amount;
        res.steel -= spec.steel * amount;
        res.mineral -= spec.mineral * amount;
        res.oil -= spec.oil * amount;
        cityTrain += amount;
        cityFinish = Math.max(cityFinish, finishMs);
      } else {
        await jitter();
        const t = await c.call(3001, p.cat(p.u64(plant.bid), p.u32(ARMY_ID), p.u32(amount)));
        if (t.ok) {
          plantReports.push(`   ★ 厂#${plant.bid.slice(-3)}(L${plant.level}): 下单 ${fmt(amount)} 架，${fmtDur(finishMs)}（约 ${finishAt} 完成）`);
          res.food -= spec.food * amount;
          res.steel -= spec.steel * amount;
          res.mineral -= spec.mineral * amount;
          res.oil -= spec.oil * amount;
          cityTrain += amount;
          cityFinish = Math.max(cityFinish, finishMs);
        } else {
          plantReports.push(`   ✗ 厂#${plant.bid.slice(-3)}(L${plant.level}): 下单失败${t.message ? '（' + t.message + '）' : ''}`);
        }
      }
    }

    plantReports.forEach((s) => console.log(s));
    // 操作后的资源余量（ dry 模式为模拟值 ）
    console.log(`   余量: 粮 ${fmt(res.food)} | 钢 ${fmt(res.steel)} | 矿 ${fmt(res.mineral)} | 油 ${fmt(res.oil)}`);
    if (cityTrain > 0) {
      console.log(`   小计: ${fmt(cityTrain)} 架 | 全部完成约 ${fmtDur(cityFinish)}后`);
    }
    console.log('');
    totalTrain += cityTrain;
    report.push({ city: city.name, trained: cityTrain, before: resBefore, after: res });
  }

  console.log('—— 总报告 ——');
  console.log(`下单合计: ${fmt(totalTrain)} 架`);
  for (const r of report) {
    if (r.trained > 0) {
      console.log(`   ${r.city}: ${fmt(r.trained)} 架`);
    }
  }

  // 切回操作前的当前城
  if (originCityId) {
    await jitter();
    const back = await c.call(2002, p.u64(originCityId));
    if (back.ok) console.log(`已切回操作前的城池（cityId=${originCityId}）`);
  }

  c.close();
})();
