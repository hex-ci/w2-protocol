#!/usr/bin/env node

/**
 * w2reward.js —— 邮件奖励自动领取
 *
 * 扫描邮箱各分类，逐封查详情，凡「附件条目非空」即领取——不按邮件标题/发件人/分类白名单过滤，
 * 服务端新增的奖励邮件类型自动纳入（新玩法上新奖励无需改脚本）。
 *
 * 流程: connect → [9001] 分页拉取各分类列表 → [9002] 逐封详情取附件条目
 *      → [9008] 逐个领取 → 回读详情核对 → 汇总
 *
 * 可领性判据（见 lib/mail.js）：列表标志只用于排除「已领」，最终以详情条目非空为准——
 * 标志取值语义若被服务端改动，失败方向是多发一次只读请求，不会漏领。
 *
 * 用法:
 *   node scripts/w2reward.js                扫描并领取所有可领附件（全部分类）
 *   node scripts/w2reward.js --id <mailId>  只处理指定邮件
 *   node scripts/w2reward.js --type 0       只扫描指定邮件分类（0 收件箱 / 1 系统 / 2 发件箱）
 *   node scripts/w2reward.js --dry          只扫描展示，不领取
 */

import config from '../lib/config.js';
import { W2Client, p } from '../lib/sdk.js';
import { parse9001, parse9002, MAIL_TYPE } from '../lib/proto.js';
import { listIsClaimed, listHasNoAttachment, judgeDetail, verifyClaimed } from '../lib/mail.js';
import { fmtDateTime as fmtTime } from '../lib/format.js';

const argv = process.argv.slice(2);
const arg = (n, d) => {
  const i = argv.indexOf('--' + n);
  return i >= 0 && i + 1 < argv.length ? argv[i + 1] : d;
};
const has = (n) => argv.includes('--' + n);
const onlyArg = arg('id', '');
const typeArg = arg('type', '');
if (onlyArg && (!/^\d+$/.test(onlyArg) || BigInt(onlyArg) === 0n || BigInt(onlyArg) > 0xffffffffffffffffn)) {
  console.log('--id 必须是正的无符号 64 位邮件 ID');
  process.exit(1);
}
if (typeArg && !/^\d+$/.test(typeArg)) {
  console.log('--type 必须是数字（0 收件箱 / 1 系统 / 2 发件箱）');
  process.exit(1);
}

const PAGE_SIZE = 20;
const TYPE_LABEL = { [MAIL_TYPE.INBOX]: '收件箱', [MAIL_TYPE.SYSTEM]: '系统', [MAIL_TYPE.OUTBOX]: '发件箱' };

/** 分页拉取某分类全部邮件（按服务器回报的 pageCount 收敛，翻到空页也停） */
async function fetchMails(c, mailType) {
  const out = [];
  let page = 1;
  for (;;) {
    const r = await c.call(9001, p.cat(p.byte(mailType), p.u32(page), p.byte(PAGE_SIZE)));
    if (!r.ok) {
      if (page === 1 && mailType !== MAIL_TYPE.INBOX) {
        // 分类可能不被本服启用；无邮件比「拉取失败」更贴近实际，静默跳过
        break;
      }
      console.log(`${TYPE_LABEL[mailType] || '分类' + mailType} 邮件列表查询失败: ${r.message || ('status=' + r.status)}`);
      break;
    }
    let pageData;
    try {
      pageData = parse9001(r.raw);
    } catch (e) {
      console.log(`${TYPE_LABEL[mailType] || '分类' + mailType} 第 ${page} 页解析失败: ${e.message}`);
      break;
    }
    out.push(...pageData.list);
    if (page >= pageData.pageCount || !pageData.list.length) break;
    page += 1;
  }
  return out;
}

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

  // 扫描范围：收件箱 + 系统分类（发件箱是本账号发出的邮件，不会有附件）。
  // --id 指定单封时无从得知其分类，同样扫这两类再按 ID 命中。
  // 实测本服两类返回同一批邮件（服务端不按分类隔离），故下拉后按 mailId 去重。
  const types = typeArg !== ''
    ? [Number(typeArg)]
    : [MAIL_TYPE.INBOX, MAIL_TYPE.SYSTEM];

  const mails = [];
  for (const mt of types) {
    const got = await fetchMails(c, mt);
    for (const m of got) mails.push({ ...m, mailType: mt });
  }
  const uniq = new Map();
  for (const m of mails) if (!uniq.has(m.mailId)) uniq.set(m.mailId, m);
  const all = [...uniq.values()];
  console.log(`邮箱共 ${all.length} 封邮件`);

  // 第一层：列表标志排除。已知「已领」与「无附件」直接跳过，未知取值保留待查详情
  const only = onlyArg;
  const targets = only
    ? all.filter((m) => m.mailId === only)
    : all.filter((m) => !listIsClaimed(m.attachmentFlag) && !listHasNoAttachment(m.attachmentFlag));

  if (!targets.length) {
    console.log(only ? `未找到邮件 ${only}` : '没有待核查的邮件。');
    c.close();
    return;
  }

  // 第二、三层：逐封查详情，以「附件条目非空」为准（标志取值仅作说明，不作否决）
  const candidates = [];
  for (const m of targets) {
    const r = await c.call(9002, p.cat(p.byte(m.mailType), p.u64(m.mailId)));
    if (!r.ok) {
      console.log(`  ✗ ${m.title}: 详情获取失败（${r.message || 'status=' + r.status}）`);
      continue;
    }
    let detail;
    try {
      detail = parse9002(r.raw);
    } catch (e) {
      console.log(`  ✗ ${m.title}: 详情解析失败（${e.message}）`);
      continue;
    }
    const { claimable, reason } = judgeDetail(detail);
    if (!claimable) {
      if (reason === 'flag-pending-no-items') {
        // 标志说可领但服务端没下发条目：如实报告，不猜测
        console.log(`  ? ${m.title}（id=${m.mailId}）: 标志标记为待领取，但详情未下发附件条目，跳过`);
      }
      continue;
    }
    console.log(`  ★ ${detail.title}（${TYPE_LABEL[m.mailType] || m.mailType} · ${fmtTime(detail.createTime)}）`);
    detail.attachments.forEach((a) => console.log(`      ${a.name} ×${a.amount}`));
    candidates.push({ mailId: m.mailId, mailType: m.mailType, title: detail.title, items: detail.attachments, detail });
  }

  if (!candidates.length) {
    console.log('\n没有可领取的附件。');
    c.close();
    return;
  }

  console.log(`\n待领取 ${candidates.length} 封，共 ${candidates.reduce((n, x) => n + x.items.length, 0)} 项附件。`);
  if (has('dry')) {
    console.log('--dry 模式，仅扫描不领取。');
    c.close();
    return;
  }

  // [9008] 逐个领取（逐封核对：回读详情确认标志已迁移，把结果说准）
  console.log('\n开始领取...');
  let claimed = 0;
  let attachCount = 0;
  let uncertain = 0;
  for (const cand of candidates) {
    const r = await c.call(9008, p.u64(cand.mailId));
    if (!r.ok) {
      // 服务端对各类失败（已领过 / 无可领附件）返回同一状态码，故回读详情判定而非比对文案
      const re = await c.call(9002, p.cat(p.byte(cand.mailType), p.u64(cand.mailId)));
      let note = '未领取';
      if (re.ok) {
        try {
          const after = parse9002(re.raw);
          const state = verifyClaimed(cand.detail.attachmentFlag, after.attachmentFlag);
          if (state === 'claimed') note = '未领取（标志显示已在此之前领取）';
          else if (after.attachments.length) note = `未领取（附件仍在，status=${r.status}）`;
        } catch (e) { /* 复核失败则保守陈述 */ }
      }
      console.log(`   ${cand.title}: ${note}`);
      continue;
    }
    claimed += 1;
    attachCount += cand.items.length;
    const list = cand.items.map((a) => `${a.name}×${a.amount}`).join('、');
    console.log(`   ★ ${cand.title}: ${list}`);
    // 服务端已确认成功；回读仅用于记录标志是否同步迁移，不影响领取事实
    const re = await c.call(9002, p.cat(p.byte(cand.mailType), p.u64(cand.mailId)));
    if (re.ok) {
      try {
        const state = verifyClaimed(cand.detail.attachmentFlag, parse9002(re.raw).attachmentFlag);
        if (state === 'unchanged') {
          uncertain += 1;
          console.log(`     ↳ 提示：详情标志未同步更新，附件条目仍在——请稍后复查`);
        }
      } catch (e) { /* 回读失败不影响已成功的领取 */ }
    }
  }

  console.log('\n—— 结果 ——');
  console.log(`领取成功: ${claimed} 封邮件，共 ${attachCount} 项附件`);
  if (uncertain > 0) console.log(`其中 ${uncertain} 封详情标志未同步，建议稍后复查`);

  c.close();
})();
