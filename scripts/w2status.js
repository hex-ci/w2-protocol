#!/usr/bin/env node

/**
 * w2status.js —— 全域城池资产与战备状态总览
 *
 * 实时扫描全域城池的资源储量、仓储饱和度、民心民怨、驻军编成与军工厂运转状态，
 * 提供宽度感知的终端仪表盘与智能诊断。
 *
 * 用法:
 *   node scripts/w2status.js               展示完整总览（宏观看板+资源仓储+军队军工+智能诊断）
 *   node scripts/w2status.js --res         只看各城资源与仓储明细
 *   node scripts/w2status.js --mil         只看驻军战备与军工厂状态
 *   node scripts/w2status.js --city <id>   单城详细透视（资源、民心、全量驻军与军工队列）
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
const SHOW_ALL = !SHOW_RES && !SHOW_MIL && !ONLY_CITY;

// 兵种分类定义
const ARMY_NAMES = {
  1: '步兵', 2: '骑兵', 3: '卡车', 4: '装甲车',
  5: '轻坦', 6: '重坦', 7: '突击炮', 8: '火箭',
  9: '侦察机', 10: '歼击机', 11: '轰炸机',
  12: '驱逐舰', 13: '潜艇', 14: '战列舰', 15: '航母', 16: '特种兵',
  17: '碉堡', 18: '榴弹炮', 19: '反坦炮', 20: '防空炮', 21: '围墙',
  30: '高炮', 31: '导弹车', 32: '攻击机', 33: '截击机',
};

// ---------- 宽度感知排版 ----------

function displayWidth(str) {
  let w = 0;
  for (let i = 0; i < str.length; i++) {
    const code = str.codePointAt(i);
    if (code > 0xffff) i++;
    if (
      (code >= 0x1100 && code <= 0x115f) ||
      (code >= 0x2e80 && code <= 0xa4cf && code !== 0x303f) ||
      (code >= 0xac00 && code <= 0xd7a3) ||
      (code >= 0xf900 && code <= 0xfaff) ||
      (code >= 0xfe10 && code <= 0xfe19) ||
      (code >= 0xfe30 && code <= 0xfe6f) ||
      (code >= 0xff00 && code <= 0xff60) ||
      (code >= 0xffe0 && code <= 0xffe6) ||
      (code >= 0x20000 && code <= 0x3fffd)
    ) {
      w += 2;
    } else {
      w += 1;
    }
  }
  return w;
}

function padCell(str, width, align = 'left') {
  const s = String(str);
  const gap = width - displayWidth(s);
  if (gap <= 0) return s;
  return align === 'right' ? ' '.repeat(gap) + s : s + ' '.repeat(gap);
}

function renderTable(columns, rows, footer = null) {
  // 列宽取「声明最小宽」与「表头/全部单元格实际宽」的最大值，任何数值都不会顶开表格
  const allRows = footer ? [...rows, footer] : rows;
  const widths = columns.map((col, i) => {
    const cells = [col.header, ...allRows.map((r) => String(r[i] ?? ''))];
    return Math.max(col.width || 0, ...cells.map(displayWidth));
  });
  const line = (cells) => cells.map((cell, i) => padCell(cell, widths[i], columns[i].align || 'left')).join('  ');
  const header = line(columns.map((c) => c.header));
  const sep = '─'.repeat(displayWidth(header));
  const out = [header, sep];
  for (const row of rows) out.push(line(row));
  if (footer) {
    out.push(sep);
    out.push(line(footer));
  }
  out.push(sep);
  return out.join('\n');
}

// ---------- 数值格式化 ----------

const fmtNum = (n) => Math.round(Number(n) || 0).toLocaleString('en-US');
const fmtDur = (ms) => {
  const s = Math.ceil(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h}时${m}分` : `${m}分`;
};

// 紧凑格式：表格专用，宽度有界，中文单位
function fmtShort(n) {
  const num = Number(n) || 0;
  const sign = num < 0 ? '-' : '';
  const v = Math.abs(num);
  if (v >= 1e8) {
    const yi = v / 1e8;
    return `${sign}${(yi >= 100 ? yi.toFixed(1) : yi.toFixed(2))}亿`;
  }
  if (v >= 1e4) {
    const wan = v / 1e4;
    return `${sign}${(wan >= 100 ? wan.toFixed(0) : wan.toFixed(1))}万`;
  }
  if (v >= 1e3) return `${sign}${(v / 1e3).toFixed(1)}千`;
  return sign + String(v);
}

// 计数格式：兵力与人口（万以下保留精确值，便于逐点核对）
const fmtCount = (n) => (Math.abs(Number(n) || 0) >= 10000 ? fmtShort(n) : fmtNum(n));

// 储/容饱和度：超 / 满 / 百分比
function fmtSat(amount, cap) {
  if (!cap || cap <= 0) return `${fmtShort(amount)} / --`;
  const ratio = amount / cap;
  if (ratio > 1.005) return `${fmtShort(amount)} / ${fmtShort(cap)} 超`;
  if (ratio >= 0.98) return `${fmtShort(amount)} / ${fmtShort(cap)} 满`;
  return `${fmtShort(amount)} / ${fmtShort(cap)} ${Math.round(ratio * 100)}%`;
}

// ---------- 协议解析 ----------

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
    str(); // mayor
    u32(); // population
    u32(); // morale
    u32(); u32(); // coastal, hasCarrier
    str(); // imgID
    u8();  // isColonial
    u32(); // mayorIcon
    u32(); // constructNum
    u32(); // helpNum
    if (joinWar === 1) u32();
    u32(); u32(); u32(); u8(); // trainingCount, officerCount, officerCountMax, tail
    list.push({ cityId, name, x, y });
  }
  return list;
}

/** 2003 城内资源：food@4/8, steel@32/36, mineral@52/56, oil@72/76 */
function parseResources(raw2003) {
  const u32 = (o) => raw2003.readUInt32BE(o);
  return {
    food: u32(4), foodCap: u32(8),
    steel: u32(32), steelCap: u32(36),
    mineral: u32(52), mineralCap: u32(56),
    oil: u32(72), oilCap: u32(76),
  };
}

/** 2027 政令状态：民心/民怨/黄金/人口（当前城） */
function parseCityStatus(raw2027) {
  if (!raw2027 || raw2027.length < 68) return null;
  return {
    morale: raw2027.readUInt32BE(0),
    grievance: raw2027.readUInt32BE(4),
    moraleTrend: raw2027.readInt32BE(8),
    gold: raw2027.readUInt32BE(12),
    goldCap: raw2027.readUInt32BE(16),
    taxRate: raw2027.readUInt32BE(20),
    popAmount: raw2027.readUInt32BE(40),
    popCap: raw2027.readUInt32BE(44),
    popWorking: raw2027.readUInt32BE(48),
    popIdle: raw2027.readInt32BE(52),
  };
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

// ---------- 表格列定义 ----------

const RES_COLUMNS = [
  { header: '城池名称', width: 12 },
  { header: '坐标', width: 10 },
  { header: '民心/民怨', width: 11, align: 'right' },
  { header: '粮食 (储/容)', width: 15, align: 'right' },
  { header: '钢铁 (储/容)', width: 15, align: 'right' },
  { header: '稀矿 (储/容)', width: 15, align: 'right' },
  { header: '石油 (储/容)', width: 15, align: 'right' },
  { header: '黄金 (储/容)', width: 15, align: 'right' },
  { header: '空闲人口', width: 10, align: 'right' },
];

const MIL_COLUMNS = [
  { header: '城池名称', width: 12 },
  { header: '坐标', width: 10 },
  { header: '卡车', width: 12, align: 'right' },
  { header: '侦察机', width: 10, align: 'right' },
  { header: '战机', width: 10, align: 'right' },
  { header: '装甲', width: 10, align: 'right' },
  { header: '工事', width: 8, align: 'right' },
  { header: '军工运转', width: 8, align: 'right' },
  { header: '当前队列', width: 22 },
];

// ---------- 主流程 ----------

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

  // 1. 玩家基础核心资产 (1005)
  const base = await c.call(1005, Buffer.alloc(0), {
    fields: [
      ['game_status', 'u32'],
      ['diamond_owned', 'u32'],
      ['active_city_id', 'u64'],
    ],
  });
  const originCityId = base.active_city_id?.toString();

  // 2. 城池列表 (2001)
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

  // 3. 逐城扫描
  const cityData = [];
  let empirePlantsTotal = 0;
  let empirePlantsActive = 0;

  for (const city of targetCities) {
    await c.call(2002, p.u64(city.cityId));
    const r2003 = await c.call(2003, Buffer.alloc(0));
    const r2027 = await c.call(2027, Buffer.alloc(0));
    const r19009 = await c.call(19009, Buffer.alloc(0));
    const r17001 = await c.call(17001, Buffer.alloc(0));

    const res = parseResources(r2003.raw);
    const status = parseCityStatus(r2027.raw);
    const armies = parseArmies(r19009.raw);
    const plants = parseMilitaryPlants(r17001.raw);

    let activeQueues = [];
    if (plants.length > 0) {
      const r3005 = await c.call(3005, Buffer.alloc(0));
      if (r3005.raw) activeQueues = parseTrainingQueues(r3005.raw);
    }

    empirePlantsTotal += plants.length;
    empirePlantsActive += activeQueues.length;

    const sumBy = (ids) => armies.filter((a) => ids.includes(a.id)).reduce((s, a) => s + a.count, 0);

    cityData.push({
      ...city,
      res,
      status,
      armies,
      plants,
      activeQueues,
      truckCount: armies.find((a) => a.id === 3)?.count || 0,
      scoutCount: armies.find((a) => a.id === 9)?.count || 0,
      fighterCount: sumBy([10, 11, 32, 33]),
      armorCount: sumBy([4, 5, 6, 7, 8, 31]),
      fortCount: sumBy([17, 18, 19, 20, 21, 30]),
    });
  }

  // 切回原城池
  if (originCityId) await c.call(2002, p.u64(originCityId));
  c.close();

  // ---------- 汇总 ----------
  const sum = (fn) => cityData.reduce((s, d) => s + fn(d), 0);
  const totalFood = sum((d) => d.res.food);
  const totalFoodCap = sum((d) => d.res.foodCap);
  const totalSteel = sum((d) => d.res.steel);
  const totalSteelCap = sum((d) => d.res.steelCap);
  const totalMineral = sum((d) => d.res.mineral);
  const totalMineralCap = sum((d) => d.res.mineralCap);
  const totalOil = sum((d) => d.res.oil);
  const totalOilCap = sum((d) => d.res.oilCap);
  const totalGold = sum((d) => d.status?.gold || 0);
  const totalGoldCap = sum((d) => d.status?.goldCap || 0);
  const totalPopIdle = sum((d) => d.status?.popIdle || 0);

  const totalTrucks = sum((d) => d.truckCount);
  const totalScouts = sum((d) => d.scoutCount);
  const totalFighters = sum((d) => d.fighterCount);
  const totalArmors = sum((d) => d.armorCount);
  const totalForts = sum((d) => d.fortCount);

  const moraleCity = cityData.filter((d) => d.status);
  const minMorale = moraleCity.length ? Math.min(...moraleCity.map((d) => d.status.morale)) : null;
  const maxGrievance = moraleCity.length ? Math.max(...moraleCity.map((d) => d.status.grievance)) : null;
  const grievanceCities = moraleCity.filter((d) => d.status.grievance > 0).length;

  // ──────── 板块一：宏观资产看板 ────────
  if (SHOW_ALL) {
    console.log(`\n${'═'.repeat(96)}`);
    console.log(`  全域城池资产与战备总览`);
    console.log(`  城池总数: ${allCities.length} 座    当前钻石: ${fmtNum(base.diamond_owned)} 钻    军工产能: ${empirePlantsActive}/${empirePlantsTotal} 厂运转中`);
    console.log(`  全域物资: 粮 ${fmtShort(totalFood)} | 钢 ${fmtShort(totalSteel)} | 矿 ${fmtShort(totalMineral)} | 油 ${fmtShort(totalOil)} | 金 ${fmtShort(totalGold)}`);
    console.log(`  全域主力: 卡车 ${fmtShort(totalTrucks)} 辆 | 侦察机 ${fmtShort(totalScouts)} 架 | 战机 ${fmtShort(totalFighters)} 架 | 装甲装具 ${fmtShort(totalArmors)} 单位`);
    if (minMorale !== null) {
      console.log(`  民心概况: 最低民心 ${minMorale} | 有民怨城池 ${grievanceCities} 座（最高 ${maxGrievance}）`);
    }
    console.log(`${'═'.repeat(96)}`);
  }

  // ──────── 板块二：资源与仓储明细 ────────
  if (SHOW_ALL || SHOW_RES) {
    console.log(`\n【各城池资源、民心与仓储饱和度】`);
    const rows = cityData.map((d) => [
      d.name,
      `(${d.x},${d.y})`,
      d.status ? `${d.status.morale} / ${d.status.grievance}` : '--',
      fmtSat(d.res.food, d.res.foodCap),
      fmtSat(d.res.steel, d.res.steelCap),
      fmtSat(d.res.mineral, d.res.mineralCap),
      fmtSat(d.res.oil, d.res.oilCap),
      d.status ? fmtSat(d.status.gold, d.status.goldCap) : '--',
      d.status ? fmtCount(d.status.popIdle) : '--',
    ]);
    const footer = [
      '全域总计',
      '',
      '',
      fmtSat(totalFood, totalFoodCap),
      fmtSat(totalSteel, totalSteelCap),
      fmtSat(totalMineral, totalMineralCap),
      fmtSat(totalOil, totalOilCap),
      fmtSat(totalGold, totalGoldCap),
      fmtCount(totalPopIdle),
    ];
    console.log(renderTable(RES_COLUMNS, rows, footer));
  }

  // ──────── 板块三：驻军战备与军工厂 ────────
  if (SHOW_ALL || SHOW_MIL) {
    console.log(`\n【各城池驻军与军工厂战备】`);
    const rows = cityData.map((d) => {
      let queueDesc = '无军工';
      if (d.plants.length > 0) {
        if (d.activeQueues.length > 0) {
          const maxRemain = Math.max(...d.activeQueues.map((q) => q.remainMs));
          queueDesc = `${d.activeQueues[0].name} ×${d.activeQueues.length}厂 (${fmtDur(maxRemain)})`;
        } else {
          queueDesc = '空闲中';
        }
      }
      return [
        d.name,
        `(${d.x},${d.y})`,
        `${fmtCount(d.truckCount)} 辆`,
        `${fmtCount(d.scoutCount)} 架`,
        `${fmtCount(d.fighterCount)} 架`,
        `${fmtCount(d.armorCount)} 辆`,
        `${fmtCount(d.fortCount)} 座`,
        d.plants.length > 0 ? `${d.activeQueues.length}/${d.plants.length}` : '--',
        queueDesc,
      ];
    });
    const footer = [
      '全域合计',
      '',
      `${fmtCount(totalTrucks)} 辆`,
      `${fmtCount(totalScouts)} 架`,
      `${fmtCount(totalFighters)} 架`,
      `${fmtCount(totalArmors)} 辆`,
      `${fmtCount(totalForts)} 座`,
      `${empirePlantsActive}/${empirePlantsTotal}`,
      '',
    ];
    console.log(renderTable(MIL_COLUMNS, rows, footer));
  }

  // ──────── 单城详细透视 ────────
  if (ONLY_CITY) {
    const d = cityData[0];
    console.log(`\n【单城详细透视】 ${d.name}  坐标(${d.x},${d.y})`);
    console.log('─'.repeat(60));
    if (d.status) {
      const trend = d.status.moraleTrend > 0 ? `↑${d.status.moraleTrend}` : (d.status.moraleTrend < 0 ? `↓${Math.abs(d.status.moraleTrend)}` : '持平');
      console.log(`  民心/民怨: ${d.status.morale} / ${d.status.grievance}（趋势 ${trend}）    税率: ${d.status.taxRate}%`);
      console.log(`  人口: ${fmtNum(d.status.popAmount)} / ${fmtNum(d.status.popCap)}（务工 ${fmtNum(d.status.popWorking)}，空闲 ${fmtNum(d.status.popIdle)}）`);
      console.log(`  黄金: ${fmtSat(d.status.gold, d.status.goldCap)}`);
    }
    console.log(`  资源: 粮 ${fmtSat(d.res.food, d.res.foodCap)} | 钢 ${fmtSat(d.res.steel, d.res.steelCap)} | 矿 ${fmtSat(d.res.mineral, d.res.mineralCap)} | 油 ${fmtSat(d.res.oil, d.res.oilCap)}`);
    console.log(`  驻军明细: ${d.armies.length ? d.armies.map((a) => `${a.name} ${fmtNum(a.count)}`).join(' | ') : '（无部队）'}`);
    console.log(`  军工厂: ${d.plants.length ? `${d.activeQueues.length}/${d.plants.length} 运转中` : '未建军工厂'}`);
    for (const q of d.activeQueues) {
      console.log(`    ▷ ${q.name} 队列，剩余 ${fmtDur(q.remainMs)}`);
    }
    console.log('─'.repeat(60));
  }

  // ──────── 板块四：智能诊断 ────────
  if (SHOW_ALL) {
    console.log(`\n【智能诊断与行动建议】`);

    const cappedList = [];
    for (const d of cityData) {
      const caps = [];
      if (d.res.foodCap > 0 && d.res.food >= d.res.foodCap * 0.98) caps.push('粮');
      if (d.res.steelCap > 0 && d.res.steel >= d.res.steelCap * 0.98) caps.push('钢');
      if (d.res.mineralCap > 0 && d.res.mineral >= d.res.mineralCap * 0.98) caps.push('矿');
      if (d.res.oilCap > 0 && d.res.oil >= d.res.oilCap * 0.98) caps.push('油');
      if (d.status && d.status.goldCap > 0 && d.status.gold >= d.status.goldCap * 0.98) caps.push('金');
      if (caps.length > 0) cappedList.push(`${d.name}[${caps.join('/')}]`);
    }

    if (cappedList.length > 0) {
      console.log(`  ⚠ 仓储爆仓停产预警 (${cappedList.length} 座城): 自然产出停止中`);
      console.log(`    城池: ${cappedList.slice(0, 8).join(', ')}${cappedList.length > 8 ? ` 等 ${cappedList.length} 城` : ''}`);
      console.log(`    → 建议执行: npm run transport（执行全域资源超上限归集，释放自然产能）`);
    } else {
      console.log(`  ✓ 仓储状态健康: 未发现满仓停产城池，各城均处于自然增长中。`);
    }

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
