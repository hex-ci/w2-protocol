#!/usr/bin/env node

'use strict';

/**
 * w2signin.js —— 每日任务自动领取
 *
 * 流程: 连接 → hello → 重放登录包 → 查询任务列表 → 对 frames.local.json 里收录的
 *       每个任务，凡出现在可领列表中的，逐个发领取帧
 *
 * 用法:
 *   node scripts/w2signin.js              领取所有已收录且当前可领的任务
 *   node scripts/w2signin.js --id 5042    只领指定任务
 *   node scripts/w2signin.js --dry        只查询不领取
 */

const net = require('net');
const fs = require('fs');
const path = require('path');
const config = require('../lib/config.js');
const { framesIn, idNamePairs, cjkStrings } = require('../lib/w2.js');

const ROOT = config.root;
const argv = process.argv.slice(2);
const arg = (n, d) => {
  const i = argv.indexOf('--' + n);
  return i >= 0 && i + 1 < argv.length ? argv[i + 1] : d;
};
const has = (n) => argv.includes('--' + n);

const frames = config.frames();
const dict = JSON.parse(fs.readFileSync(path.join(ROOT, 'protocol', 'commands.json'), 'utf8'));
const taskName = (id) => (dict.tasks && dict.tasks[String(id)]) || '';

function sendSeq(sock, hexList, delays) {
  return new Promise((resolve) => {
    let buf = Buffer.alloc(0);
    const onData = (d) => { buf = Buffer.concat([buf, d]); };
    sock.on('data', onData);
    let t = 0;
    hexList.forEach((h, i) => {
      t += delays[i] || 0;
      setTimeout(() => { try { sock.write(Buffer.from(h, 'hex')); } catch (e) { /* ignore */ } }, t);
    });
    t += delays[hexList.length] || 2500;
    setTimeout(() => { sock.removeListener('data', onData); resolve(buf); }, t);
  });
}

function parseTasks(buf) {
  const out = [];
  for (const f of framesIn(buf)) {
    if (f.body.length >= 4 && f.body.readUInt32BE(0) === 10001) {
      for (const p of idNamePairs(f.body)) out.push(p);
    }
  }
  return out;
}

function reportClaims(buf) {
  const lines = [];
  for (const f of framesIn(buf)) {
    const cmd = f.body.length >= 4 ? f.body.readUInt32BE(0) : null;
    if (cmd === 10003) {
      const t = cjkStrings(f.body);
      // 成功时响应含物品/数量列表，较长；重复领取则是一句提示，很短
      const ok = f.len > 40;
      lines.push(`cmd=10003 len=${f.len}  → ${ok ? '★ 领取成功' : '已领取过 / 无法领取'}` +
        (t.length ? '  提示: ' + t.join(' / ') : ''));
    } else if (cmd === 26003) {
      const t = cjkStrings(f.body);
      lines.push(`cmd=26003 len=${f.len}${t.length ? '  提示: ' + t.join(' / ') : ''}`);
    }
  }
  return lines.length ? lines : [`(无明确响应，收到 ${buf.length} 字节)`];
}

(async function main() {
  if (!frames.host || !frames.login) {
    console.log('缺少配置：请把真实值写入 .env 与 protocol/frames.local.json');
    process.exit(1);
  }
  console.log(`目标 ${frames.host}:${frames.port}`);
  // 单会话限制：本连接建立后，已在线的客户端会被服务端挤下线
  console.log('注意: 会建立独立会话，已在线的客户端可能被挤下线。');

  const sock = net.connect(frames.port, frames.host);
  sock.on('error', (e) => { console.log('连接失败:', e.message); process.exit(1); });

  const buf = await sendSeq(sock, [frames.hello, frames.login, frames.queryTasks], [1000, 1500, 2500]);
  const tasks = parseTasks(buf);
  if (tasks.length) {
    console.log('当前可领任务:');
    tasks.slice(0, 20).forEach((t) => console.log(`   ${String(t.id).padEnd(9)}${t.name}`));
  } else {
    console.log('(未解析到任务列表)');
  }

  // 注意：服务器返回的可领列表并不完整（"日常军事"这类分类查不到），
  // 因此不依赖列表判断，直接尝试领取所有已收录任务。
  // 重复领取无副作用——服务器会返回"已领取过该任务奖励"并拒绝。
  const known = Object.keys(frames.claims || {});
  const only = arg('id', '');
  const todo = only ? [only] : known;

  if (!todo.length) {
    console.log('\n没有已收录的领取帧（frames.local.json 里 claims 为空）');
    sock.end();
    return;
  }
  if (has('--dry')) {
    console.log(`\n--dry 模式，将要尝试: ${todo.join(', ')}`);
    sock.end();
    return;
  }

  console.log(`\n准备领取: ${todo.map((i) => `${i} ${taskName(i)}`).join('  |  ')}`);
  for (const id of todo) {
    const rb = await sendSeq(sock, [frames.claims[id]], [0, 2600]);
    console.log(`\n[${id} ${taskName(id)}]`);
    reportClaims(rb).forEach((l) => console.log('   ' + l));
  }
  console.log('\n完成。');
  sock.end();
})();
