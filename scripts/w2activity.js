#!/usr/bin/env node

/**
 * w2activity.js —— 活动奖励自动领取
 *
 * 领取目标活动（由 W2_ACTIVITY_TYPE/SUBTYPE/GROUP 三个协议字段筛选，见本地 .env）
 * 中所有已达标未领取的档位奖励（22001 定位 → 22017 查进度 → 22018 逐档领取），不消耗任何道具。
 *
 * 链式依赖：活动的进度可能是另一类活动的奖励道具（如每日类发凭证、月度类消耗凭证）——
 * 脚本按「多轮重扫直到无新领取」处理，因此不依赖命中活动之间的先后顺序，
 * 也不需要靠活动名区分它们。
 *
 * 用法:
 *   node scripts/w2activity.js              扫描并领取全部可领档位
 *   node scripts/w2activity.js --dry        只扫描展示，不领取
 *   node scripts/w2activity.js --id <id>    只处理指定活动（调试用）
 */

import config from '../lib/config.js';
import { W2Client, p } from '../lib/sdk.js';
import { renderTable } from '../lib/table.js';

const argv = process.argv.slice(2);
const arg = (n, d) => {
  const i = argv.indexOf('--' + n);
  return i >= 0 && i + 1 < argv.length ? argv[i + 1] : d;
};
const has = (n) => argv.includes('--' + n);

const dry = has('dry');
const onlyArg = arg('id', '');
if (onlyArg && !/^[1-9]\d*$/.test(onlyArg)) {
  console.log('--id 必须是正整数活动 ID');
  process.exit(1);
}

// ---------- 22001 活动列表（实测修正版字段序，见 reference/13-activity.md） ----------
// 本服条目不含 start_time/end_time（客户端版本条件字段，clientVer < 3040100 不下发）
function parseActivityList(raw) {
  let off = 0;
  const u32 = () => { const v = raw.readUInt32BE(off); off += 4; return v; };
  const u64 = () => { const v = raw.readBigUInt64BE(off); off += 8; return v; };
  const u8 = () => raw[off++];
  const str = () => { const n = u32(); const s = raw.subarray(off, off + n).toString('utf8'); off += n; return s; };

  const count = u32();
  const list = [];
  for (let i = 0; i < count; i++) {
    const a = {};
    a.name = str();
    a.id = u32();
    a.flag = str();
    a.timeLimited = u8();
    if (a.timeLimited === 1) a.remainTime = u64();
    a.activityType = u32();
    if (a.activityType === 2) a.activitySubType = raw[off++]; // 有符号字节：225 即 -31 地标
    a.groupId = u32();
    a.redPointType = u32();
    if (a.redPointType === 2) a.redPointUnimark = u64();
    a.regDaysLimited = u32();
    list.push(a);
  }
  if (off !== raw.length) throw new Error(`活动列表解析未完整消费（${off}/${raw.length}）`);
  return list;
}

// ---------- 22017 地标活动进度详情（嵌套结构，见 reference/13-activity.md） ----------
// rich_content + u8 档位数 + N×(sectionId, name, u8 奖励数 + N×奖励, u64 进度, u64 目标, u8 已领)
function parseLandmark(raw) {
  let off = 0;
  const u32 = () => { const v = raw.readUInt32BE(off); off += 4; return v; };
  const u64 = () => { const v = raw.readBigUInt64BE(off); off += 8; return v; };
  const u8 = () => raw[off++];
  const str = () => { const n = u32(); const s = raw.subarray(off, off + n).toString('utf8'); off += n; return s; };

  const richContent = str();
  const count = u8();
  const sections = [];
  for (let i = 0; i < count; i++) {
    const s = {};
    s.sectionId = u32();
    s.sectionName = str();
    s.rewards = [];
    const rcCount = u8();
    for (let j = 0; j < rcCount; j++) {
      s.rewards.push({ name: str(), desc: str(), icon: u32(), amount: u32() });
    }
    s.progressValue = u64();
    s.progressTarget = u64();
    s.collectStatus = u8();
    sections.push(s);
  }
  // count=0 时尾部字节不定（活动不存在回显 4B 请求 ID），客户端与解析侧均忽略；
  // count>0 时应完整消费到 activity_id 回显
  let activityId = null;
  if (count > 0) {
    activityId = u32();
    if (off !== raw.length) throw new Error(`地标活动解析未完整消费（${off}/${raw.length}）`);
  }
  return { richContent, activityId, sections };
}

// 可领取判定（与服务器一致）：已达标且未领取
const isClaimable = (s) => s.progressValue >= s.progressTarget && s.collectStatus === 0;
const isPending = (s) => s.collectStatus === 0 && s.progressValue < s.progressTarget;

// 目标活动定位：按协议字段筛选（type/subType/groupId，真值见本地 .env）。
// 不用活动名——名称随版本/月份变，ID 稳定；且同一选择器可能命中多个活动（如每日子活动+
// 月度活动），脚本对命中集合整体处理，不依赖它们之间的顺序（见主流程的多轮收敛）。
// subType 仅 activityType=2 的条目才有，其余一律不匹配。
const isTarget = (a) => a.activityType === config.activity.type
  && a.activitySubType === config.activity.subType
  && a.groupId === config.activity.groupId;

(async function main() {
  const lp = config.loginParams();
  const gs = config.gameServer();
  if (!gs || !lp) {
    console.log('尚未登录：请先运行 npm run login');
    process.exit(1);
  }
  try {
    config.assertActivityConfigured();
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }

  const c = new W2Client({ host: gs.host, port: gs.port, loginParams: lp });
  try {
    await c.connect();
  } catch (e) {
    console.log('连接失败:', e.message);
    process.exit(1);
  }
  console.log('已登录\n');

  // [22001] 定位目标活动
  let activities = [];
  try {
    const r = await c.call(22001, Buffer.alloc(0));
    if (!r.ok) throw new Error(`status=${r.status}${r.message ? '：' + r.message : ''}`);
    activities = parseActivityList(r.raw);
  } catch (e) {
    console.log('活动列表查询失败:', e.message);
    c.close();
    process.exit(1);
  }

  const targets = activities.filter((a) => {
    if (onlyArg) return a.id === Number(onlyArg);
    return isTarget(a) && (a.timeLimited !== 1 || Number(a.remainTime) > 0);
  });
  if (!targets.length) {
    console.log(onlyArg ? `未找到活动 ${onlyArg}` : '未找到可处理的活动');
    c.close();
    return;
  }
  // 命中集合可能包含链式依赖的多个活动（如某类的进度是另一类发的道具），
  // 而它们的协议字段可能完全相同、无法判定先后——故按「多轮收敛」处理：
  // 每轮扫全部目标领取，直到整轮无新领取为止，顺序不再是正确性前提。
  console.log(`发现 ${targets.length} 个待处理活动\n`);

  const summary = new Map(targets.map((a) => [a.id, { name: a.name, claimed: 0, claimable: 0, scanned: 0, leftover: 0, error: '' }]));
  const MAX_ROUNDS = 5;

  // 每轮重查全部目标并领取，直到整轮无新领取；dry 只跑一轮（展示用）
  for (let round = 1; round <= MAX_ROUNDS; round++) {
    let claimedThisRound = 0;
    if (!dry && round > 1) console.log(`—— 第 ${round} 轮（领取后复扫）——\n`);
    for (const act of targets) {
      // [22017] 查进度
      let detail;
      try {
        const r = await c.call(22017, p.u32(act.id));
        if (!r.ok) throw new Error(`status=${r.status}${r.message ? '：' + r.message : ''}`);
        detail = parseLandmark(r.raw);
      } catch (e) {
        console.log(`【${act.name}】进度查询失败: ${e.message}\n`);
        summary.get(act.id).error = e.message;
        continue;
      }

      const s = summary.get(act.id);
      const already = detail.sections.filter((x) => x.collectStatus !== 0).length;
      const claimable = detail.sections.filter(isClaimable);
      s.scanned = detail.sections.length;
      s.claimable = Math.max(s.claimable, claimable.length);
      s.leftover = claimable.length;   // 末轮仍未领走的档位数（每轮覆盖，收尾据此提示）
      console.log(`【${act.name}】已领 ${already}/${detail.sections.length}`);

      if (!claimable.length) {
        console.log(round > 1 ? '  本轮无可领档位' : '  本次领取: 无（没有已达标待领取的档位）');
      } else {
        console.log(dry ? '  将领取（模拟）:' : (round > 1 ? '  本轮领取:' : '  本次领取:'));
      }

      for (const sec of claimable) {
        const reward = sec.rewards.map((x) => `${x.name} ×${x.amount}`).join('、');
        if (dry) {
          console.log(`    ◆ ${sec.sectionName} → ${reward}`);
          continue;
        }
        const r = await c.call(22018, p.cat(p.u32(act.id), p.u32(sec.sectionId)));
        if (r.ok) {
          claimedThisRound++;
          s.claimed++;
          s.leftover = Math.max(0, s.leftover - 1);
          console.log(`    ★ ${sec.sectionName} → ${reward}`);
        } else {
          console.log(`    ✗ ${sec.sectionName}: 领取失败${r.message ? '（' + r.message + '）' : ''}`);
        }
      }
      console.log('');

      // 未完成档位表格（双倍卡要求已含在档位名里，不再重复标注；仅首轮或本轮有领取时展示）
      const pending = detail.sections.filter(isPending);
      if (pending.length && (round === 1 || claimable.length)) {
        console.log('  未完成:');
        const rows = pending.map((x) => [x.sectionName, `${x.progressValue} / ${x.progressTarget}`]);
        const table = renderTable(
          [{ header: '档位', width: 0 }, { header: '进度 / 目标', width: 11, align: 'right' }],
          rows
        );
        console.log(table.split('\n').map((l) => '    ' + l).join('\n'));
        console.log('');
      }
    }
    if (dry || claimedThisRound === 0) break;
  }

  // 收尾复核：末轮仍可领的档位（多为本轮新发道具解锁，或领取失败），提示再跑一次
  if (!dry) {
    const leftover = [...summary.values()].reduce((n, s) => n + (s.leftover || 0), 0);
    if (leftover > 0) {
      console.log(`⚠ 仍有 ${leftover} 个档位可领（可能受新发道具解锁或领取失败），建议再运行一次\n`);
    }
  }

  console.log('—— 汇总 ——');
  console.log(renderTable(
    [{ header: '活动', width: 0 }, { header: '结果', width: 0 }],
    [...summary.values()].map((s) => [s.name, s.error ? '查询失败' : (dry ? `可领 ${s.claimable} 项` : `领取 ${s.claimed} 项`)])
  ));
  if (dry) console.log('（--dry 模拟，未实际领取）');
  console.log(`共处理 ${summary.size} 个活动`);

  c.close();
})();
