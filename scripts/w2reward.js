#!/usr/bin/env node

/**
 * w2reward.js —— 邮件奖励自动领取
 *
 * 扫描邮箱中带附件的系统邮件（活动奖励 / 故障补偿等），逐封领取附件。
 *
 * 流程: connect → [9001] 分页拉取邮件列表 → 过滤 attachmentFlag=1
 *      → [9002] 展示附件明细 → [9008] 逐封领取 → 汇总
 *
 * 用法:
 *   node scripts/w2reward.js              扫描并领取所有带附件的邮件
 *   node scripts/w2reward.js --id 1023247 只处理指定邮件
 *   node scripts/w2reward.js --dry        只扫描展示，不领取
 */

import config from '../lib/config.js';
import { W2Client, p } from '../lib/sdk.js';

const argv = process.argv.slice(2);
const arg = (n, d) => {
  const i = argv.indexOf('--' + n);
  return i >= 0 && i + 1 < argv.length ? argv[i + 1] : d;
};
const has = (n) => argv.includes('--' + n);

// ---------- 9001 邮件列表 schema（依据客户端 Mailinfo 定义 + 实测对齐） ----------
// 头部: u8 mailType 回显 + u32 pageCount + u32 pageNum + u32 条数 + 条目数组
// 条目: u64 mailId + str title + str sender + u64 createTime(毫秒) + u8 readed
//      + u32 color(RGBA) + u8 attachmentFlag（1=有附件，255=无）
const MAIL_LIST_SCHEMA = {
  skip: 1, // status 后 1 字节 mailType 回显
  fields: [
    ['page_count', 'u32'],
    ['page_num', 'u32'],
  ],
  list: true,
  item: [
    ['mail_id', 'u64'],
    ['title', 'string'],
    ['sender', 'string'],
    ['create_time', 'u64'],
    ['readed', 'u8'],
    ['color', 'u32'],
    ['attachment_flag', 'u8'],
  ],
};

// 附件条目名称/描述之后的 icon+amount 需按条目循环，schema 不支持嵌套循环，
// 从 raw 上按 decodeBySchema 消费完的偏移继续解析。这里改为整体手工解析：
function parseDetail(raw) {
  let off = 1; // mailType 回显
  const u32 = () => { const v = raw.readUInt32BE(off); off += 4; return v; };
  const u8 = () => raw[off++];
  const u64 = () => { const v = raw.readBigUInt64BE(off); off += 8; return v; };
  const str = () => { const L = u32(); const s = raw.subarray(off, off + L).toString('utf8'); off += L; return s; };
  const detail = {};
  detail.mail_receiver = str();
  detail.sender_player_id = u64();
  detail.sender_nickname = str();
  detail.create_time = u64();
  detail.mail_title = str();
  detail.mail_content = str();
  detail.attachment_flag = u8();
  const count = u8();
  const items = [];
  for (let i = 0; i < count; i++) {
    const name = str();
    const desc = str();
    const icon = u32();
    const amount = u32();
    items.push({ name, desc, icon, amount });
  }
  detail.attachment_count = count;
  detail.attachments = items;
  return detail;
}

function fmtTime(msBigint) {
  const ms = Number(msBigint || 0);
  if (!ms) return '';
  return new Date(ms).toLocaleString('zh-CN', { hour12: false });
}

(async function main() {
  const lp = config.loginParams();
  if (!config.host || !lp) {
    console.log('缺少配置：请把真实值写入 .env（W2_HOST 与 W2_LOGIN_*，模板见 .env.example）');
    process.exit(1);
  }

  const c = new W2Client({ host: config.host, port: config.port, loginParams: lp });

  try {
    await c.connect();
  } catch (e) {
    console.log('连接失败:', e.message);
    process.exit(1);
  }

  // [9001] 分页拉取邮件列表（mailType=0 主列表）
  const mails = [];
  let page = 1;
  const PAGE_SIZE = 20;
  for (;;) {
    const r = await c.call(9001, p.cat(p.byte(0), p.u32(page), p.byte(PAGE_SIZE)), MAIL_LIST_SCHEMA);
    if (!r.ok) {
      console.log('邮件列表查询失败:', r.message || ('status=' + r.status));
      break;
    }
    mails.push(...r.items);
    if (page >= r.page_count || !r.items.length) break;
    page += 1;
  }
  console.log(`邮箱共 ${mails.length} 封邮件`);

  // 过滤带附件的邮件
  const only = arg('id', '');
  const withAttach = only
    ? mails.filter((m) => String(m.mail_id) === only)
    : mails.filter((m) => m.attachment_flag === 1);

  if (!withAttach.length) {
    console.log(only ? `未找到邮件 ${only}` : '没有带附件的邮件，无需领取。');
    c.close();
    return;
  }

  // [9002] 拉详情展示附件明细
  console.log(`发现 ${withAttach.length} 封带附件的邮件:\n`);
  const candidates = [];
  for (const m of withAttach) {
    const r = await c.call(9002, p.cat(p.byte(0), p.u64(m.mail_id)));
    if (!r.ok) {
      console.log(`  ✗ ${m.title}（id=${m.mail_id}）: 详情获取失败${r.message ? '（' + r.message + '）' : ''}`);
      continue;
    }
    const detail = parseDetail(r.raw);
    if (!detail.attachments.length) {
      console.log(`  - ${m.title}（id=${m.mail_id}）: 详情显示无附件，跳过`);
      continue;
    }
    console.log(`  ★ ${detail.mail_title}（${fmtTime(detail.create_time)}）`);
    detail.attachments.forEach((a) => console.log(`      ${a.name} ×${a.amount}`));
    candidates.push({ mailId: m.mail_id, title: detail.mail_title, items: detail.attachments });
  }

  if (!candidates.length) {
    console.log('\n没有可领取的附件。');
    c.close();
    return;
  }

  if (has('dry')) {
    console.log('\n--dry 模式，仅扫描不领取。');
    c.close();
    return;
  }

  // [9008] 逐封领取
  console.log('\n开始领取...');
  let claimed = 0;
  let attachCount = 0;
  for (const cand of candidates) {
    const r = await c.call(9008, p.u64(cand.mailId));
    if (r.ok) {
      claimed += 1;
      attachCount += cand.items.length;
      const list = cand.items.map((a) => `${a.name}×${a.amount}`).join('、');
      console.log(`   ★ ${cand.title}: ${list}`);
    } else if (r.message && r.message.includes('重复')) {
      console.log(`   ${cand.title}: 已领取过`);
    } else if (r.message && r.message.includes('没有可供领取')) {
      console.log(`   ${cand.title}: 无可领附件`);
    } else {
      console.log(`   ${cand.title}: 领取失败${r.message ? '（' + r.message + '）' : ''}`);
    }
  }

  console.log('\n—— 结果 ——');
  console.log(`领取成功: ${claimed} 封邮件，共 ${attachCount} 项附件`);

  c.close();
})();
