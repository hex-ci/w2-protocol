#!/usr/bin/env node

/**
 * w2status.js —— 全域城池资产与战备状态总览
 *
 * 实时扫描全域城池的资源储量、仓储饱和度、民心民怨、驻军编成与军工厂运转状态，
 * 提供宽度感知的终端仪表盘与智能诊断。
 *
 * 说明: 城池「中心仓」标识来自 w2transport 的推导缓存，
 *       未运行过 transport 时该列显示「—」，缓存缺失不影响其余功能。
 *
 * 用法:
 *   node scripts/w2status.js               展示完整总览（宏观看板+资源仓储+军队军工+智能诊断）
 *   node scripts/w2status.js --res         只看各城资源与仓储明细
 *   node scripts/w2status.js --mil         只看驻军战备与军工厂状态
 *   node scripts/w2status.js --city <id>   单城详细透视（资源、民心、全量驻军与军工队列）
 */

import config from '../lib/config.js';
import { W2Client, p } from '../lib/sdk.js';
import { renderTable } from '../lib/table.js';
import { fmtNum, fmtShort, fmtCount, fmtSat, fmtDur } from '../lib/format.js';
import { RES_CN } from '../lib/formula.js';
import { readTopologyCache } from '../lib/topology.js';
import {
  parseCityList, parse2003, parse2027, parse19009, parseBuildings49, parse3005,
} from '../lib/proto.js';

// 中心仓缓存：w2transport 每次运行时把推导结果（superHubs: 资源→cityId）写入缓存文件

function loadHubs() {
  const byCity = new Map(); // cityId -> [资源中文名]
  const cached = readTopologyCache();
  if (!cached) return byCity;
  const hubs = cached.superHubs || {};
  for (const [res, cityId] of Object.entries(hubs)) {
    if (!cityId) continue;
    if (!byCity.has(String(cityId))) byCity.set(String(cityId), []);
    byCity.get(String(cityId)).push(RES_CN[res] || res);
  }
  return byCity;
}

const HUBS_BY_CITY = loadHubs();

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

// 兵种分类定义、协议解析器见 lib/proto.js（ARMY_NAMES / parseCityList / parse2003 / parse2027 / parse19009 / parseBuildings49 / parse3005）

// ---------- 表格列定义 ----------

const RES_COLUMNS = [
  { header: '城池名称', width: 12 },
  { header: '中心仓', width: 8 },
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
    console.log('尚未登录：请先运行 npm run login');
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

    const res = parse2003(r2003.raw);
    const status = parse2027(r2027.raw);
    const armies = parse19009(r19009.raw);
    const plants = parseBuildings49(r17001.raw, 1).filter((b) => b.proto === 14).map((b) => ({ bid: b.bid, level: b.level }));

    let activeQueues = [];
    if (plants.length > 0) {
      const r3005 = await c.call(3005, Buffer.alloc(0));
      if (r3005.raw) activeQueues = parse3005(r3005.raw);
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
    if (HUBS_BY_CITY.size > 0) {
      console.log(`  （中心仓一览: ${[...HUBS_BY_CITY.entries()].map(([cid, res]) => {
        const c = allCities.find((x) => x.cityId === cid);
        return `${c ? c.name : cid}=${res.join('')}`;
      }).join('  ')}）`);
    }
    const rows = cityData.map((d) => [
      d.name,
      HUBS_BY_CITY.has(d.cityId) ? HUBS_BY_CITY.get(d.cityId).join('') : '—',
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
    const hubTag = HUBS_BY_CITY.has(d.cityId) ? `  【中心仓: ${HUBS_BY_CITY.get(d.cityId).join('、')}】` : '';
    console.log(`\n【单城详细透视】 ${d.name}  坐标(${d.x},${d.y})${hubTag}`);
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

    // 中心仓对归属资源的超容囤积属设计预期（阶段2 持续堆积），不计入爆仓预警
    const cappedList = [];
    const hubCappedList = [];
    for (const d of cityData) {
      const hubRes = HUBS_BY_CITY.get(d.cityId) || [];
      const caps = [];
      const hubCaps = [];
      const check = (name, val, cap) => {
        if (cap > 0 && val >= cap * 0.98) (hubRes.includes(name) ? hubCaps : caps).push(name);
      };
      check('粮', d.res.food, d.res.foodCap);
      check('钢', d.res.steel, d.res.steelCap);
      check('矿', d.res.mineral, d.res.mineralCap);
      check('油', d.res.oil, d.res.oilCap);
      if (d.status) check('金', d.status.gold, d.status.goldCap);
      if (caps.length > 0) cappedList.push(`${d.name}[${caps.join('/')}]`);
      if (hubCaps.length > 0) hubCappedList.push(`${d.name}[${hubCaps.join('/')}]`);
    }

    if (cappedList.length > 0) {
      console.log(`  ⚠ 仓储爆仓停产预警 (${cappedList.length} 座城): 自然产出停止中`);
      console.log(`    城池: ${cappedList.slice(0, 8).join(', ')}${cappedList.length > 8 ? ` 等 ${cappedList.length} 城` : ''}`);
      console.log(`    → 建议执行: npm run transport（执行全域资源超上限归集，释放自然产能）`);
    } else if (hubCappedList.length === 0) {
      console.log(`  ✓ 仓储状态健康: 未发现满仓停产城池，各城均处于自然增长中。`);
    }
    if (hubCappedList.length > 0) {
      console.log(`  ℹ 中心仓超容囤积 (${hubCappedList.length} 座城，设计预期): ${hubCappedList.join(', ')}`);
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
