#!/usr/bin/env node

/**
 * w2train.js —— 全域造兵
 *
 * 在所有城池（或 --city 指定城）的军工厂批量训练指定兵种（默认侦察机）。
 * 逐城切城 → 扫描军工厂 → 按当前城已验证资源算出各厂最大可造数 → 逐厂下单。
 *
 * 频控：SDK 自带 500ms 请求间隔，命令间再叠加随机抖动，模拟人工节奏。
 *
 * 用法:
 *   node scripts/w2train.js                     所有城造侦察机（资源允许的最大量）
 *   node scripts/w2train.js --army 10           指定兵种（armyId，见 3007 兵种表）
 *   node scripts/w2train.js --city <cityId>     只在指定城造
 *   node scripts/w2train.js --max 100           每厂最多造 100 架（不填=不限，仅受资源约束）
 *   node scripts/w2train.js --dry               只模拟计算，不下单
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../lib/config.js';
import { W2Client, p } from '../lib/sdk.js';
import { fmtNum as fmt, fmtDur as fmtDurMs } from '../lib/format.js';
import { parseCityList, parseBuildings49, parse3006, parse2003, parse2026 } from '../lib/proto.js';
import { trainResCap, trainPopCap, trainFinishMs, splitEvenly } from '../lib/formula.js';

const argv = process.argv.slice(2);
const arg = (n, d) => {
  const i = argv.indexOf('--' + n);
  return i >= 0 && i + 1 < argv.length ? argv[i + 1] : d;
};
const has = (n) => argv.includes('--' + n);

const isU32 = (value, allowZero = true) => {
  if (!/^\d+$/.test(value)) return false;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed <= 0xffffffff && (allowZero || parsed > 0);
};
const isU64 = (value) => /^\d+$/.test(value) && BigInt(value) <= 0xffffffffffffffffn;
const armyArg = arg('army', '9');
const maxArg = arg('max', '');
const cityArg = arg('city', '');
if (!isU32(armyArg, false)) throw new Error('--army 必须是正整数兵种 ID');
if (maxArg && !isU32(maxArg)) throw new Error('--max 必须是非负整数');
if (cityArg && !isU64(cityArg)) throw new Error('--city 必须是无符号 64 位城池 ID');
const ARMY_ID = Number(armyArg);
const MAX_PER_PLANT = maxArg ? Number(maxArg) : Infinity;
const ONLY_CITY = cityArg;
const DRY = has('dry');

// 频控抖动：每次写操作前随机等待，模拟人工
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const jitter = () => sleep(300 + Math.floor(Math.random() * 500));

// ---------- 解析器见 lib/proto.js（parseCityList / parseBuildings49 / parse3006 / parse2003 / parse2026） ----------

const fmtDur = (ms) => fmtDurMs(ms, true);

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
    console.log('连接失败:', e.message);
    process.exit(1);
  }

  const mustRaw = async (cmd, params) => {
    const r = await c.call(cmd, params);
    if (!r.ok) throw new Error(`cmd=${cmd} 请求失败${r.message ? `：${r.message}` : ''}`);
    if (!r.raw) throw new Error(`cmd=${cmd} 响应缺少原始数据`);
    return r.raw;
  };

  // 城池列表
  const cities = parseCityList(await mustRaw(2001, Buffer.alloc(0)));
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

  // 3007 兵种原型表分两段返回，取两段中的兵种名与人口占位（后者用于人口约束）
  let armyName = `兵种${ARMY_ID}`;
  let armyPopulation = 0; // 每单位训练占用人口（3007 population 字段）；0 = 未知
  const protoRaw = await mustRaw(3007, Buffer.alloc(0));
  {
    let off = 0;
    const u32 = () => { const v = protoRaw.readUInt32BE(off); off += 4; return v; };
    const str = () => { const L = u32(); const s = protoRaw.subarray(off, off + L).toString('utf8'); off += L; return s; };
    for (let group = 0; group < 2 && armyName === `兵种${ARMY_ID}`; group++) {
      const n = u32();
      for (let i = 0; i < n; i++) {
        u32(); const id = u32(); u32();
        const name = str();
        str();
        // 14 个属性 u32：hp、四种攻、防御、移速、攻速、射程、载重、人口、粮耗、油耗、积分
        const stats = Array.from({ length: 14 }, () => u32());
        if (id === ARMY_ID) {
          armyName = name;
          armyPopulation = stats[10];
          break;
        }
      }
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
    const plants = parseBuildings49((await c.call(17001, Buffer.alloc(0))).raw, 1)
      .filter((b) => b.proto === 14);
    if (!plants.length) {
      console.log(`○ ${city.name}: 无军工厂，跳过`);
      continue;
    }

    // 当前城资源（2003）与空闲人口（2026，人口约束的权威读数）
    const res = parse2003((await c.call(2003, Buffer.alloc(0))).raw);
    const popIdle = parse2026((await c.call(2026, Buffer.alloc(0))).raw).popIdle;
    const resBefore = { ...res };

    console.log(`━━ ${city.name} (${city.x},${city.y}) 军工厂×${plants.length}`);
    console.log(`   资源: 粮 ${fmt(res.food)} | 钢 ${fmt(res.steel)} | 矿 ${fmt(res.mineral)} | 油 ${fmt(res.oil)}`);
    console.log(`   空闲人口: ${fmt(popIdle)}${armyPopulation > 0 ? `（每单位训练占 ${armyPopulation}，人口最多支持 ${fmt(trainPopCap(popIdle, armyPopulation))} 架）` : ''}`);

    let cityTrain = 0;
    let cityFinish = 0;
    const plantReports = [];

    // 第一遍：收集各厂该兵种的规格（单价/耗时）
    const specs = [];
    for (const plant of plants) {
      await jitter();
      const info = parse3006((await c.call(3006, p.u64(plant.bid))).raw);
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
    // 总量 = min(各资源/单价, 空闲人口/每架人口)，每厂 base = floor(总量/N)，前 remainder 个厂各 +1
    // 人口约束：3001 下单即时占用空闲人口（每架 armyPopulation），超限时服务器拒绝
    const s0 = specs[0].spec;
    if (s0.nuclear > 0) {
      plantReports.push('   ○ 该兵种需要核资源；当前脚本未验证核资源余额字段，为避免超额下单而跳过');
      plantReports.forEach((s) => console.log(s));
      console.log('');
      continue;
    }
    const totalAffordable = trainResCap(res, { food: s0.food, mineral: s0.mineral, oil: s0.oil, steel: s0.steel });
    const totalByPop = trainPopCap(popIdle, armyPopulation);
    const targetTotal = Math.min(totalAffordable, totalByPop, MAX_PER_PLANT * specs.length);
    const allocations = splitEvenly(targetTotal, specs.length);

    if (targetTotal === 0) {
      const why = totalByPop === 0
        ? `受空闲人口限制（${fmt(popIdle)} < 每架 ${armyPopulation}）`
        : `资源不足 1 架（需 粮${s0.food} 矿${s0.mineral} 油${s0.oil} 钢${s0.steel}/架）`;
      plantReports.push(`   ○ ${why}`);
      plantReports.forEach((s) => console.log(s));
      console.log(`   余量: 粮 ${fmt(res.food)} | 钢 ${fmt(res.steel)} | 矿 ${fmt(res.mineral)} | 油 ${fmt(res.oil)}`);
      console.log('');
      continue;
    }

    // 人口预算：实际下单时逐笔扣减；服务器因人口拒绝时归零并跳过该城剩余订单
    let popRemain = totalByPop === Infinity ? Infinity : targetTotal;

    // 第二遍：逐厂下单
    for (let i = 0; i < specs.length; i++) {
      const { plant, spec } = specs[i];
      let amount = allocations[i];
      if (amount === 0) {
        plantReports.push(`   ○ 厂#${plant.bid.slice(-3)}(L${plant.level}): 平分后不足 1 架`);
        continue;
      }
      if (popRemain !== Infinity) {
        if (popRemain <= 0) {
          plantReports.push(`   ○ 厂#${plant.bid.slice(-3)}(L${plant.level}): 跳过（人口预算已用尽）`);
          continue;
        }
        amount = Math.min(amount, popRemain);
      }

      const finishMs = trainFinishMs(spec.time, amount);
      const finishAt = new Date(Date.now() + finishMs).toLocaleTimeString('zh-CN', { hour12: false });

      if (DRY) {
        plantReports.push(`   ▷ 厂#${plant.bid.slice(-3)}(L${plant.level}): 将造 ${fmt(amount)} 架，需 ${fmtDur(finishMs)}（约 ${finishAt} 完成）`);
        res.food -= spec.food * amount;
        res.steel -= spec.steel * amount;
        res.mineral -= spec.mineral * amount;
        res.oil -= spec.oil * amount;
        if (popRemain !== Infinity) popRemain -= amount;
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
          if (popRemain !== Infinity) popRemain -= amount;
          cityTrain += amount;
          cityFinish = Math.max(cityFinish, finishMs);
        } else {
          const popBlocked = /人口/.test(t.message || '');
          if (popBlocked && popRemain !== Infinity) popRemain = 0; // 服务器裁决为准，跳过该城剩余订单
          plantReports.push(`   ✗ 厂#${plant.bid.slice(-3)}(L${plant.level}): 下单失败${t.message ? '（' + t.message + '）' : ''}${popBlocked ? '（该城剩余订单已跳过）' : ''}`);
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
    report.push({ city: city.name, cityId: city.cityId, x: city.x, y: city.y, trained: cityTrain, before: resBefore, after: res });
  }

  console.log('—— 总报告 ——');
  console.log(`下单合计: ${fmt(totalTrain)} 架`);
  for (const r of report) {
    if (r.trained > 0) {
      console.log(`   ${r.city}: ${fmt(r.trained)} 架`);
    }
  }

  // 保存训练状态快照（.train_state.local.json）
  try {
    const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
    const stateFile = path.join(rootDir, '.train_state.local.json');
    const stateData = {
      timestamp: Date.now(),
      armyId: ARMY_ID,
      dry: DRY,
      totalTrained: totalTrain,
      cities: report.map((r) => ({
        cityId: r.cityId,
        name: r.city,
        x: r.x,
        y: r.y,
        trained: r.trained,
        after: r.after,
      })),
    };
    fs.writeFileSync(stateFile, JSON.stringify(stateData, null, 2) + '\n');
  } catch (e) {
    // 写入状态失败不影响主流程
  }

  // 切回操作前的当前城
  if (originCityId) {
    await jitter();
    const back = await c.call(2002, p.u64(originCityId));
    if (back.ok) console.log(`已切回操作前的城池（cityId=${originCityId}）`);
  }

  c.close();
})();
