#!/usr/bin/env node

/**
 * w2status.js —— 全域城池资产与战备状态总览
 *
 * 实时扫描全域城池的资源储量、仓储饱和度、驻军编成与军工厂运转状态，
 * 提供结构化高密度的终端仪表盘与智能诊断。
 *
 * 用法:
 *   node scripts/w2status.js               展示完整总览（宏观看板+资源仓储+军队军工+智能诊断）
 *   node scripts/w2status.js --res         只看各城资源与仓储明细
 *   node scripts/w2status.js --mil         只看驻军战备与军工厂状态
 *   node scripts/w2status.js --city <id>   单城详细透视（全量驻军清单与建筑状态）
 */

import config from '../lib/config.js';
import { W2Client, p } from '../lib/sdk.js';

const argv = process.argv.slice(2);
const arg = (n, d) => {
  const i = argv.indexOf('--' + n);
  return i >= 0 && i + 1 < argv.length ? argv[i + 1] : d;
};
const has = (n) => argv.includes('--' + n);

const SHOW_RES = has('res');
const SHOW_MIL = has('mil');
const ONLY_CITY = arg('city', '');
const SHOW_ALL = !SHOW_RES && !SHOW_MIL;

// 兵种分类定义
const ARMY_NAMES = {
  1: '步兵', 2: '骑兵', 3: '卡车', 4: '装甲车',
  5: '轻坦', 6: '重坦', 7: '突击炮', 8: '火箭',
  9: '侦察机', 10: '歼击机', 11: '轰炸机',
  12: '驱逐舰', 13: '潜艇', 14: '战列舰', 15: '航母', 16: '特种兵',
  17: '碉堡', 18: '榴弹炮', 19: '反坦炮', 20: '防空炮', 21: '围墙',
  30: '高炮', 31: '导弹车', 32: '攻击机', 33: '截击机',
};

// 格式化函数
const fmtNum = (n) => Math.round(Number(n) || 0).toLocaleString('en-US');
const fmtDur = (ms) => {
  const s = Math.ceil(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h}时${m}分` : `${m}分`;
};

// 资源短格式化：例如 16.0M, 450k
function fmtShort(n) {
  const v = Number(n) || 0;
  if (v >= 100000000) return `${(v / 100000000).toFixed(2)}亿`;
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `${(v / 1000).toFixed(0)}k`;
  return String(v);
}

// 饱和度标记
function fmtSat(amount, cap) {
  if (cap <= 0) return `${fmtShort(amount)}/--`;
  const ratio = amount / cap;
  const pct = Math.round(ratio * 100);
  let tag = `(${String(pct).padStart(2)}%)`;
  if (ratio > 1.0) tag = '[超]';
  else if (ratio >= 0.98) tag = '[满]';
  return `${fmtShort(amount)}/${fmtShort(cap)} ${tag}`;
}

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
    const mayor = str();
    const population = u32();
    u32(); u32(); u32(); // morale, coastal, hasCarrier
    str(); // imgID
    u8();  // isColonial
    u32(); // mayorIcon
    const constructNum = u32();
    u32(); // helpNum
    if (joinWar === 1) u32();
    const trainingCount = u32();
    u32(); u32(); u8(); // officerCount, officerCountMax, tail
    list.push({ cityId, name, x, y, mayor, population, constructNum, trainingCount });
  }
  return list;
}

function parseResources(raw2003, raw2026) {
  const u32 = (o) => raw2003.readUInt32BE(o);
  const res = {
    food: u32(4), foodCap: u32(8),
    steel: u32(32), steelCap: u32(36),
    mineral: u32(52), mineralCap: u32(56),
    oil: u32(72), oilCap: u32(76),
    gold: 0, goldCap: 0,
    popIdle: 0,
  };
  if (raw2026 && raw2026.length >= 76) {
    res.gold = raw2026.readUInt32BE(68);
    res.goldCap = raw2026.readUInt32BE(72);
    if (raw2026.length >= 88) {
      res.popIdle = raw2026.readUInt32BE(84);
    }
  }
  return res;
}

function parseArmies(raw) {
  if (!raw || raw.length < 4) return [];
  let o = 0;
  const n = raw.readUInt32BE(o); o += 4;
  const list = [];
  for (let i = 0; i < n; i++) {
    const aid = raw.readUInt32BE(o); o += 4;
    const count = raw.readUInt32BE(o); o += 4;
    list.push({ id: aid, name: ARMY_NAMES[aid] || `兵种#${aid}`, count });
  }
  return list;
}

function parseMilitaryPlants(raw) {
  if (!raw || raw.length < 1) return [];
  let o = 0;
  const count = raw[o++];
  const plants = [];
  for (let i = 0; i < count; i++) {
    const bid = raw.readBigUInt64BE(o).toString(); o += 8;
    const proto = raw.readUInt32BE(o); o += 4;
    const level = raw.readUInt32BE(o); o += 4;
    o += 8;  // position, status
    o += 24; // remainTime, finishTime, totalTime
    o += 1;  // helped
    if (proto === 14) { // 军工厂原型 ID 为 14
      plants.push({ bid, level });
    }
  }
  return plants;
}

function parseTrainingQueues(raw) {
  if (!raw || raw.length < 4) return [];
  let o = 0;
  const qCount = raw.readUInt32BE(o); o += 4;
  const queues = [];
  for (let i = 0; i < qCount; i++) {
    o += 8; // bid
    o += 4; // pos
    const status = raw.readUInt32BE(o); o += 4;
    if (status === 1) {
      o += 8; // trainingId
      const armyId = raw.readUInt32BE(o); o += 4;
      const remainMs = Number(raw.readBigUInt64BE(o)); o += 8;
      o += 8; // totalMs
      queues.push({ armyId, name: ARMY_NAMES[armyId] || `兵种#${armyId}`, remainMs });
    }
  }
  return queues;
}

(async function main() {
  const lp = config.loginParams();
  const gs = config.gameServer();
  if (!gs || !lp) {
    console.log('尚未登录：请先完成登录');
    process.exit(1);
  }

  const c = new W2Client({ host: gs.host, port: gs.port, loginParams: lp });
  try {
    await c.connect();
  } catch (e) {
    console.log('连接服务器失败:', e.message);
    process.exit(1);
  }

  // 1. 获取玩家基础核心资产 (1005)
  const base = await c.call(1005, Buffer.alloc(0), {
    fields: [
      ['game_status', 'u32'],
      ['diamond_owned', 'u32'],
      ['active_city_id', 'u64'],
    ],
  });
  const originCityId = base.active_city_id?.toString();

  // 2. 获取城池列表 (2001)
  const r2001 = await c.call(2001, Buffer.alloc(0));
  if (!r2001.ok || !r2001.raw) {
    console.log('拉取城池列表失败');
    c.close();
    process.exit(1);
  }
  const allCities = parseCityList(r2001.raw);
  const targetCities = ONLY_CITY ? allCities.filter((x) => x.cityId === ONLY_CITY) : allCities;

  if (targetCities.length === 0) {
    console.log(`未找到指定城池 ID: ${ONLY_CITY}`);
    c.close();
    process.exit(1);
  }

  // 3. 逐城遍历拉取详细数据
  const cityData = [];
  let empirePlantsTotal = 0;
  let empirePlantsActive = 0;

  for (const city of targetCities) {
    await c.call(2002, p.u64(city.cityId));
    const r2003 = await c.call(2003, Buffer.alloc(0));
    const r2026 = await c.call(2026, Buffer.alloc(0));
    const r19009 = await c.call(19009, Buffer.alloc(0));
    const r17001 = await c.call(17001, Buffer.alloc(0));

    const res = parseResources(r2003.raw, r2026.raw);
    const armies = parseArmies(r19009.raw);
    const plants = parseMilitaryPlants(r17001.raw);

    // 检查军工厂当前运转状态 (3005)
    let activeQueues = [];
    if (plants.length > 0) {
      const r3005 = await c.call(3005, Buffer.alloc(0));
      if (r3005.raw) {
        activeQueues = parseTrainingQueues(r3005.raw);
      }
    }

    empirePlantsTotal += plants.length;
    empirePlantsActive += activeQueues.length;

    // 驻军快速检索
    const truckCount = armies.find((a) => a.id === 3)?.count || 0;
    const scoutCount = armies.find((a) => a.id === 9)?.count || 0;
    const fighterCount = armies.filter((a) => [10, 11, 32, 33].includes(a.id)).reduce((s, a) => s + a.count, 0);
    const armorCount = armies.filter((a) => [4, 5, 6, 7, 8, 31].includes(a.id)).reduce((s, a) => s + a.count, 0);
    const fortCount = armies.filter((a) => [17, 18, 19, 20, 21, 30].includes(a.id)).reduce((s, a) => s + a.count, 0);

    cityData.push({
      ...city,
      res,
      armies,
      plants,
      activeQueues,
      truckCount,
      scoutCount,
      fighterCount,
      armorCount,
      fortCount,
    });
  }

  // 切回原城池
  if (originCityId) {
    await c.call(2002, p.u64(originCityId));
  }
  c.close();

  // ---------- 汇总统计 ----------
  const totalFood = cityData.reduce((s, c) => s + c.res.food, 0);
  const totalSteel = cityData.reduce((s, c) => s + c.res.steel, 0);
  const totalMineral = cityData.reduce((s, c) => s + c.res.mineral, 0);
  const totalOil = cityData.reduce((s, c) => s + c.res.oil, 0);
  const totalGold = cityData.reduce((s, c) => s + c.res.gold, 0);

  const totalTrucks = cityData.reduce((s, c) => s + c.truckCount, 0);
  const totalScouts = cityData.reduce((s, c) => s + c.scoutCount, 0);
  const totalFighters = cityData.reduce((s, c) => s + c.fighterCount, 0);
  const totalArmors = cityData.reduce((s, c) => s + c.armorCount, 0);

  // 4. 控制台渲染输出

  // ──────── 板块一：宏观资产看板 ────────
  if (SHOW_ALL) {
    console.log(`\n${'═'.repeat(96)}`);
    console.log(`  全域城池资产与战备总览`);
    console.log(`  城池总数: ${allCities.length} 座    当前钻石: ${fmtNum(base.diamond_owned)} 钻    军工产能: ${empirePlantsActive}/${empirePlantsTotal} 厂运转中`);
    console.log(`  全域物资: 粮 ${fmtShort(totalFood)} | 钢 ${fmtShort(totalSteel)} | 矿 ${fmtShort(totalMineral)} | 油 ${fmtShort(totalOil)} | 金 ${fmtShort(totalGold)}`);
    console.log(`  全域主力: 卡车 ${fmtNum(totalTrucks)} 辆 | 侦察机 ${fmtNum(totalScouts)} 架 | 战机 ${fmtNum(totalFighters)} 架 | 装甲装具 ${fmtNum(totalArmors)} 单位`);
    console.log(`${'═'.repeat(96)}`);
  }

  // ──────── 板块二：资源与仓储明细表 ────────
  if (SHOW_ALL || SHOW_RES) {
    console.log(`\n【各城池资源与仓储饱和度】`);
    console.log(`城池名称       坐标       粮食 (储/容)      钢铁 (储/容)      稀矿 (储/容)      石油 (储/容)      黄金 (储/容)     空闲人口`);
    console.log(`${'─'.repeat(106)}`);
    for (const d of cityData) {
      const posStr = `(${d.x},${d.y})`;
      console.log(
        `${d.name.padEnd(10)} ` +
        `${posStr.padEnd(10)} ` +
        `${fmtSat(d.res.food, d.res.foodCap).padEnd(17)} ` +
        `${fmtSat(d.res.steel, d.res.steelCap).padEnd(17)} ` +
        `${fmtSat(d.res.mineral, d.res.mineralCap).padEnd(17)} ` +
        `${fmtSat(d.res.oil, d.res.oilCap).padEnd(17)} ` +
        `${fmtSat(d.res.gold, d.res.goldCap).padEnd(16)} ` +
        `${fmtNum(d.res.popIdle).padStart(7)}`
      );
    }
    console.log(`${'─'.repeat(106)}`);
    console.log(
      `${'全域总计'.padEnd(21)} ` +
      `${fmtShort(totalFood).padEnd(17)} ` +
      `${fmtShort(totalSteel).padEnd(17)} ` +
      `${fmtShort(totalMineral).padEnd(17)} ` +
      `${fmtShort(totalOil).padEnd(17)} ` +
      `${fmtShort(totalGold).padEnd(16)}`
    );
  }

  // ──────── 板块三：驻军战备与军工厂状态表 ────────
  if (SHOW_ALL || SHOW_MIL) {
    console.log(`\n【各城池驻军与军工厂战备】`);
    console.log(`城池名称       坐标       卡车 (运力)     侦察机 (空侦)   主力战机   装甲集群   防御工事   军工厂 (运转/总数)  当前队列与耗时`);
    console.log(`${'─'.repeat(108)}`);
    for (const d of cityData) {
      const posStr = `(${d.x},${d.y})`;
      const plantRatio = `${d.activeQueues.length}/${d.plants.length}`;
      let queueDesc = '空闲中';
      if (d.activeQueues.length > 0) {
        const q0 = d.activeQueues[0];
        const maxRemain = Math.max(...d.activeQueues.map((q) => q.remainMs));
        queueDesc = `${q0.name} (${fmtDur(maxRemain)}后)`;
      }

      console.log(
        `${d.name.padEnd(10)} ` +
        `${posStr.padEnd(10)} ` +
        `${(fmtNum(d.truckCount) + ' 辆').padStart(13)} ` +
        `${(fmtNum(d.scoutCount) + ' 架').padStart(13)} ` +
        `${(fmtNum(d.fighterCount) + ' 架').padStart(10)} ` +
        `${(fmtNum(d.armorCount) + ' 辆').padStart(10)} ` +
        `${(fmtNum(d.fortCount) + ' 座').padStart(10)} ` +
        `${plantRatio.padStart(16)}  ` +
        `${queueDesc}`
      );
    }
    console.log(`${'─'.repeat(108)}`);
    console.log(
      `${'全域合计'.padEnd(21)} ` +
      `${(fmtNum(totalTrucks) + ' 辆').padStart(13)} ` +
      `${(fmtNum(totalScouts) + ' 架').padStart(13)} ` +
      `${(fmtNum(totalFighters) + ' 架').padStart(10)} ` +
      `${(fmtNum(totalArmors) + ' 辆').padStart(10)}`
    );
  }

  // ──────── 板块四：智能诊断与行动建议 ────────
  if (SHOW_ALL) {
    console.log(`\n【智能诊断与行动建议】`);

    // 1. 检查爆仓停产城池
    const cappedList = [];
    for (const d of cityData) {
      const caps = [];
      if (d.res.foodCap > 0 && d.res.food >= d.res.foodCap * 0.98) caps.push('粮');
      if (d.res.steelCap > 0 && d.res.steel >= d.res.steelCap * 0.98) caps.push('钢');
      if (d.res.mineralCap > 0 && d.res.mineral >= d.res.mineralCap * 0.98) caps.push('矿');
      if (d.res.oilCap > 0 && d.res.oil >= d.res.oilCap * 0.98) caps.push('油');
      if (d.res.goldCap > 0 && d.res.gold >= d.res.goldCap * 0.98) caps.push('金');
      if (caps.length > 0) {
        cappedList.push(`${d.name}[${caps.join('/')}]`);
      }
    }

    if (cappedList.length > 0) {
      console.log(`  ⚠ 仓储爆仓停产预警 (${cappedList.length} 座城): 自然产出停止中`);
      console.log(`    城池: ${cappedList.slice(0, 8).join(', ')}${cappedList.length > 8 ? ` 等 ${cappedList.length} 城` : ''}`);
      console.log(`    → 建议执行: npm run transport（执行全域资源超上限归集，释放自然产能）`);
    } else {
      console.log(`  ✓ 仓储状态健康: 未发现满仓停产城池，各城均处于自然增长中。`);
    }

    // 2. 检查军工厂空闲
    const idlePlants = cityData.filter((d) => d.plants.length > 0 && d.activeQueues.length === 0);
    if (idlePlants.length > 0) {
      console.log(`\n  ⚠ 军工厂空闲预警 (${idlePlants.length} 座城):`);
      console.log(`    城池: ${idlePlants.map((d) => `${d.name}(${d.plants.length}厂空闲)`).join(', ')}`);
      console.log(`    → 建议执行: npm run train（全域批量下单造侦察机）`);
    } else {
      console.log(`\n  ✓ 军工运转饱和: 全域已建军工厂均在满负荷运转中。`);
    }

    console.log(`\n${'═'.repeat(96)}\n`);
  }
})();
