#!/usr/bin/env node
'use strict';
/**
 * w2probe.js —— 探测工具：登录后可连续发送任意帧，看服务器返回什么
 *
 * 用法:
 *   node bin/w2probe.js <hex1> [hex2] [hex3] ...    依次发送（共用一次登录）
 *   node bin/w2probe.js --file frames.txt           每行一个 hex
 *
 * 用来摸清：不同参数对应哪个分类、响应里有哪些任务 ID/名称。
 */
const net = require('net');
const fs = require('fs');
const config = require('../lib/config.js');
const { framesIn, idNamePairs, cjkStrings, decodeBody } = require('../lib/w2.js');

const argv = process.argv.slice(2);
let hexes = [];
if (argv[0] === '--file') {
  hexes = fs.readFileSync(argv[1], 'utf8').split(/\r?\n/).map((s) => s.trim()).filter((s) => s && !s.startsWith('#'));
} else {
  hexes = argv.filter((s) => /^[0-9a-fA-F]+$/.test(s));
}
if (!hexes.length) {
  console.log('用法: node bin/w2probe.js <hex...>  |  --file frames.txt');
  process.exit(1);
}

const frames = config.frames();

function sendSeq(sock, list, delays) {
  return new Promise((resolve) => {
    let buf = Buffer.alloc(0);
    const onData = (d) => { buf = Buffer.concat([buf, d]); };
    sock.on('data', onData);
    let t = 0;
    list.forEach((h, i) => {
      t += delays[i] || 0;
      setTimeout(() => sock.write(Buffer.from(h, 'hex')), t);
    });
    t += delays[list.length] || 2500;
    setTimeout(() => { sock.removeListener('data', onData); resolve(buf); }, t);
  });
}

function show(buf, label) {
  console.log(`\n--- ${label} ---`);
  if (!buf.length) { console.log('  (无响应)'); return; }
  for (const f of framesIn(buf)) {
    const cmd = f.body.length >= 4 ? f.body.readUInt32BE(0) : null;
    const pairs = idNamePairs(f.body);
    const texts = cjkStrings(f.body);
    const { fields } = decodeBody(f.body.subarray(4), 8);
    if (pairs.length) {
      console.log(`  cmd=${cmd} len=${f.len}  任务:`);
      pairs.slice(0, 25).forEach((p) => console.log(`      ${String(p.id).padEnd(9)}${p.name}`));
    } else {
      console.log(`  cmd=${cmd} len=${f.len}  ${fields.map((x) => (x.t === 'str' ? `"${x.v}"` : x.v)).join(', ').slice(0, 130)}`);
      if (texts.length) console.log(`      中文: ${texts.slice(0, 3).join(' | ').slice(0, 100)}`);
    }
  }
}

(async function main() {
  const sock = net.connect(frames.port, frames.host);
  sock.on('error', (e) => { console.log('连接失败:', e.message); process.exit(1); });
  await sendSeq(sock, [frames.hello, frames.login], [1000, 2500]);
  console.log('已登录，开始探测...');
  for (let i = 0; i < hexes.length; i++) {
    const r = await sendSeq(sock, [hexes[i]], [0, 2800]);
    show(r, `帧${i + 1}: ...${hexes[i].slice(-16)}`);
  }
  console.log('\n探测结束。');
  sock.end();
})();
