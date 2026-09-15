#!/usr/bin/env node

/**
 * genarmy.js —— 从游戏导出兵种数据表（protocol/army.json）
 *
 * 数据来源（两处互补，均为服务器下发）：
 *   3006（军工厂信息）→ 造价 food/steel/mineral/oil/nuclear、单件耗时 time、是否可训练
 *   3007（兵种原型表）→ 名称、人口占位、移速、载重、油耗基准
 *
 * 为什么这样分工：3006 是「该厂能造这个兵种、要多少料、要多久」的权威来源
 * （实测 20 个可训练兵种单价全域一致，是单一真值）；3007 是原型静态属性。
 * 3007 中 17~21（碉堡/榴弹炮/反坦克炮/防空炮/围墙）不在 3006 内 → 不可训练，不入表。
 *
 * 单件耗时按城不同（受城内加成影响，实测 16389~33844ms），
 * 故表中 baseTimeMs 只作参考基准；运行期一律按城实时读 3006。
 *
 * 用法:
 *   node tools/genarmy.js            只打印解析结果（预览，不写文件）
 *   node tools/genarmy.js --write    写入 protocol/army.json
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import config from '../lib/config.js';
import { W2Client, p } from '../lib/sdk.js';
import { parse3006, parseCityList, parseBuildings49, BUILDING_PROTO } from '../lib/proto.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'protocol', 'army.json');
const WRITE = process.argv.includes('--write');

const RES_KEYS = ['food', 'steel', 'mineral', 'oil'];

/** 3007 两段原型表原始解析（两阵营各 25 条，仅取用 id 匹配的第一段字段） */
function parse3007Protos(raw) {
  let off = 0;
  const u32 = () => { const v = raw.readUInt32BE(off); off += 4; return v; };
  const str = () => { const L = u32(); const s = raw.subarray(off, off + L).toString('utf8'); off += L; return s; };
  const out = new Map();
  for (let group = 0; group < 2; group++) {
    const n = u32();
    for (let i = 0; i < n; i++) {
      u32();                 // 未知
      const id = u32();
      u32();                 // 未知
      const name = str();
      str();                 // 描述
      const st = Array.from({ length: 14 }, () => u32());
      // 属性序：hp、四种攻击、防御、移速、攻速、射程、载重、人口、粮耗、油耗、积分
      if (!out.has(id)) out.set(id, { name, speed: st[6], load: st[9], population: st[10] });
    }
  }
  return out;
}

const lp = config.loginParams();
const gs = config.gameServer();
if (!gs || !lp) {
  console.error('尚未登录：请先运行 npm run login');
  process.exit(1);
}

const c = new W2Client({ host: gs.host, port: gs.port, loginParams: lp });
await c.connect();
const originCityId = (await c.call(1005, Buffer.alloc(0), {
  fields: [['game_status', 'u32'], ['diamond_owned', 'u32'], ['active_city_id', 'u64']],
})).active_city_id?.toString();

// 3007 原型（名称 / 人口 / 移速 / 载重）
await c.call(2002, p.u64((await c.call(2001, Buffer.alloc(0)).then((r) => parseCityList(r.raw)))[0].cityId));
const protos = parse3007Protos((await c.call(3007, Buffer.alloc(0))).raw);

// 3006 造价与耗时：遍历所有军工厂，记录每个兵种出现的规格；
// 同时校验单价一致性（跨城跨厂等级），不一致就在表里标记，交人工核对。
const cities = parseCityList((await c.call(2001, Buffer.alloc(0))).raw);
const specs = new Map();   // armyId -> { variants:Set, sample }
const timeSamples = new Map(); // armyId -> { min, max, cityCount }
for (const city of cities) {
  await c.call(2002, p.u64(city.cityId));
  const buildings = parseBuildings49((await c.call(17001, Buffer.alloc(0))).raw, 1);
  const plants = buildings.filter((b) => b.proto === BUILDING_PROTO.ARMS_PLANT);
  const citySeen = new Set();
  for (const plant of plants) {
    const info = parse3006((await c.call(3006, p.u64(plant.bid))).raw);
    for (const [idStr, t] of Object.entries(info.trainables)) {
      const id = Number(idStr);
      const cost = Object.fromEntries(RES_KEYS.map((k) => [k, t[k] || 0]));
      if (t.nuclear) cost.nuclear = t.nuclear;
      const json = JSON.stringify(cost);
      if (!specs.has(id)) specs.set(id, { variants: new Set(), sample: { cost, time: t.time } });
      specs.get(id).variants.add(json);
      if (!citySeen.has(id)) {
        citySeen.add(id);
        const cur = timeSamples.get(id) || { min: Infinity, max: 0, cityCount: 0 };
        cur.min = Math.min(cur.min, t.time);
        cur.max = Math.max(cur.max, t.time);
        cur.cityCount++;
        timeSamples.set(id, cur);
      }
    }
  }
}

if (originCityId) await c.call(2002, p.u64(originCityId));
c.close();

// 组装（按 armyId 升序）
const arms = [];
const inconsistent = [];
for (const id of [...specs.keys()].sort((a, b) => a - b)) {
  const { variants, sample } = specs.get(id);
  if (variants.size > 1) inconsistent.push({ id, variants: [...variants] });
  const proto = protos.get(id) || {};
  const ts = timeSamples.get(id) || {};
  arms.push({
    id,
    name: proto.name || `兵种${id}`,
    cost: sample.cost,
    population: proto.population ?? 0,
    speed: proto.speed ?? 0,
    load: proto.load ?? 0,
    // 参考基准（全域中位口径取首个样本 cityCount）；运行期按城实时读 3006，勿当固定值用
    baseTimeMs: sample.time,
    timeRangeMs: ts.min != null && ts.max ? [ts.min, ts.max] : undefined,
  });
}

if (inconsistent.length) {
  console.error('✗ 发现单价不一致的兵种（需人工核对，暂不写入）：');
  for (const x of inconsistent) console.error(`  兵种 ${x.id}: ${x.variants.join(' | ')}`);
  process.exit(2);
}

console.log(`可训练兵种 ${arms.length} 个（3006 口径）`);
console.log('id  名称            粮   钢   矿   油   核  人口  移速  载重  基准ms    耗时区间');
for (const a of arms) {
  const c0 = a.cost;
  const range = a.timeRangeMs ? `${a.timeRangeMs[0]}~${a.timeRangeMs[1]}` : '—';
  console.log(`${String(a.id).padStart(3)} ${a.name.padEnd(16)} ${String(c0.food).padStart(4)} ${String(c0.steel).padStart(4)} ${String(c0.mineral).padStart(4)} ${String(c0.oil).padStart(4)} ${String(c0.nuclear || 0).padStart(3)} ${String(a.population).padStart(5)} ${String(a.speed).padStart(5)} ${String(a.load).padStart(5)} ${String(a.baseTimeMs).padStart(8)}  ${range}`);
}

if (!WRITE) {
  console.log('\n（预览模式：加 --write 写入 protocol/army.json）');
  process.exit(0);
}

const payload = {
  _comment: '兵种数据表（tools/genarmy.js 从 3006/3007 导出）。cost 为单价、全域一致；'
    + 'baseTimeMs 与 timeRangeMs 仅作参考——单件耗时受城内加成影响（实测按城不同），'
    + '运行期一律逐城实时读 3006。population 用于训练人口上限约束，speed/load 用于行军与运载计算。',
  arms,
};
fs.writeFileSync(OUT, JSON.stringify(payload, null, 2) + '\n');
console.log(`\n✓ 已写入 ${path.relative(ROOT, OUT)}`);
