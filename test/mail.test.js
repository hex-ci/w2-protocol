/**
 * 邮件（9001/9002）解析与可领性判定
 *
 * 语言点：attachment_flag 是**三态**（255 无附件 / 0 待领 / 1 已领），
 * 不是布尔——把它当布尔会让「可领」与「已领」互为反面，脚本会去扫已领的邮件。
 * 全部用例使用合成数据，不引用任何真实抓包。
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import { parse9001, parse9002, MAIL_FLAG } from '../lib/proto.js';
import { listIsClaimed, listHasNoAttachment, judgeDetail, verifyClaimed } from '../lib/mail.js';

// ---------- 合成构造器 ----------
const str = (s) => {
  const b = Buffer.from(s, 'utf8');
  const len = Buffer.alloc(4);
  len.writeUInt32BE(b.length);
  return Buffer.concat([len, b]);
};
const u32 = (v) => { const b = Buffer.alloc(4); b.writeUInt32BE(v); return b; };
const u64 = (v) => { const b = Buffer.alloc(8); b.writeBigUInt64BE(BigInt(v)); return b; };

const build9001 = ({ mailType = 0, pageCount = 1, pageNum = 1, items = [] }) => Buffer.concat([
  Buffer.from([mailType]),
  u32(pageCount), u32(pageNum), u32(items.length),
  ...items.map((m) => Buffer.concat([
    u64(m.mailId), str(m.title), str(m.sender), u64(m.createTime),
    Buffer.from([m.readed, (m.color >> 24) & 0xff, (m.color >> 16) & 0xff, (m.color >> 8) & 0xff, m.color & 0xff]),
    Buffer.from([m.attachmentFlag]),
  ])),
]);

const build9002 = ({ mailType = 0, title = '标题', flag = MAIL_FLAG.PENDING, attachments = [] }) => Buffer.concat([
  Buffer.from([mailType]),
  str('收件人'), u64(0), str('系统'), u64(1700000000000),
  str(title), str('<p>正文</p>'),
  Buffer.from([flag, attachments.length]),
  ...attachments.map((a) => Buffer.concat([str(a.name), str(a.description || ''), u32(a.icon || 1), u32(a.amount)])),
]);

// ---------- 9001 ----------
test('9001：列表解析且恰好平账（含中文标题）', () => {
  const raw = build9001({
    items: [
      { mailId: 100n, title: '声望榜活动奖励', sender: '系统', createTime: 1757577670000n, readed: 1, color: 0x00fff6b8, attachmentFlag: MAIL_FLAG.PENDING },
      { mailId: 101n, title: '通知', sender: '系统', createTime: 1757577671000n, readed: 1, color: 0x00000000, attachmentFlag: MAIL_FLAG.NONE },
    ],
  });
  const r = parse9001(raw);
  assert.equal(r.mailType, 0);
  assert.equal(r.list.length, 2);
  assert.equal(r.list[0].mailId, '100', 'mailId 按字符串比较');
  assert.equal(r.list[0].title, '声望榜活动奖励');
  assert.equal(r.list[0].attachmentFlag, MAIL_FLAG.PENDING);
  assert.equal(r.list[1].attachmentFlag, MAIL_FLAG.NONE, '255 保留原值，不做有符号转换');
});

test('9001：未平账必须报错而非静默返回', () => {
  const raw = Buffer.concat([build9001({ items: [] }), Buffer.from([0, 0])]);
  assert.throws(() => parse9001(raw), /未平账/);
});

// ---------- 9002 ----------
test('9002：附件条目解析且恰好平账', () => {
  const raw = build9002({
    title: '声望榜活动奖励',
    attachments: [
      { name: '资源包', description: '粮食', icon: 7, amount: 16 },
      { name: '能源包', description: '', icon: 8, amount: 35 },
    ],
  });
  const d = parse9002(raw);
  assert.equal(d.title, '声望榜活动奖励');
  assert.equal(d.attachments.length, 2);
  assert.equal(d.attachments[0].amount, 16);
  assert.equal(d.attachments[1].name, '能源包');
});

test('9002：无附件邮件（flag=-1）零条目平账', () => {
  const d = parse9002(build9002({ flag: MAIL_FLAG.NONE, attachments: [] }));
  assert.equal(d.attachmentFlag, MAIL_FLAG.NONE);
  assert.equal(d.attachments.length, 0);
});

// ---------- 可领性判定 ----------
test('判定：三态语义不可当布尔——可领(0)与已领(1)必须区分', () => {
  assert.equal(listIsClaimed(MAIL_FLAG.CLAIMED), true, '1=已领，跳过');
  assert.equal(listIsClaimed(MAIL_FLAG.PENDING), false, '0=待领，不能跳过');
  assert.equal(listIsClaimed(MAIL_FLAG.NONE), false, '255 由 listHasNoAttachment 处理');
  assert.equal(listHasNoAttachment(MAIL_FLAG.NONE), true);
  assert.equal(listHasNoAttachment(MAIL_FLAG.PENDING), false);
});

test('判定：未知标志取值不排除，交由详情内容决定（向前兼容）', () => {
  const unknown = 77;
  assert.equal(listIsClaimed(unknown), false, '未知取值绝不跳过');
  assert.equal(listHasNoAttachment(unknown), false, '未知取值必须查详情');
  const d = judgeDetail({ attachment_flag: unknown, attachments: [{ name: '新道具', amount: 1 }] });
  assert.equal(d.claimable, true, '服务端换标志语义也能吃到');
});

test('判定：条目不空即可领，即便标志显示已领（失败方向安全）', () => {
  const d = judgeDetail({ attachment_flag: MAIL_FLAG.CLAIMED, attachments: [{ name: 'x', amount: 2 }] });
  assert.equal(d.claimable, true);
  assert.equal(d.reason, 'attachments');
});

test('判定：标志说待领但服务端没下发条目 → 如实跳过', () => {
  const d = judgeDetail({ attachment_flag: MAIL_FLAG.PENDING, attachments: [] });
  assert.equal(d.claimable, false);
  assert.equal(d.reason, 'flag-pending-no-items');
});

test('判定：纯通知邮件零条目不领', () => {
  const d = judgeDetail({ attachment_flag: MAIL_FLAG.NONE, attachments: [] });
  assert.equal(d.claimable, false);
  assert.equal(d.reason, 'no-items');
});

test('判定：领取后标志迁移核对', () => {
  assert.equal(verifyClaimed(MAIL_FLAG.PENDING, MAIL_FLAG.CLAIMED), 'claimed');
  assert.equal(verifyClaimed(MAIL_FLAG.PENDING, MAIL_FLAG.PENDING), 'unchanged');
  assert.equal(verifyClaimed(MAIL_FLAG.PENDING, 9), 'unknown');
});
