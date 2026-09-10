#!/usr/bin/env node

/**
 * w2probe.js —— 探测工具：登录后可连续发送任意帧，看服务器返回什么
 *
 * 用法:
 *   node scripts/w2probe.js <hex1> [hex2] [hex3] ...    依次发送（共用一次登录）
 *   node scripts/w2probe.js --file frames.txt           每行一个 hex
 *
 * 用来摸清：不同参数对应哪个分类、响应里有哪些任务 ID/名称。
 */

import fs from 'fs';
import config from '../lib/config.js';
import {
  W2FrameReassembler,
  idNamePairs,
  cjkStrings,
  decodeBody,
} from '../lib/w2.js';
import { parseFrame } from '../lib/w2build.js';
import { W2Client } from '../lib/sdk.js';

const argv = process.argv.slice(2);
let hexes = [];
if (argv[0] === '--file') {
  hexes = fs.readFileSync(argv[1], 'utf8').split(/\r?\n/).map((s) => s.trim()).filter((s) => s && !s.startsWith('#'));
} else {
  hexes = argv.filter((s) => /^[0-9a-fA-F]+$/.test(s));
}
if (!hexes.length) {
  console.log('用法: node scripts/w2probe.js <hex...>  |  --file frames.txt');
  process.exit(1);
}
for (const frame of hexes) {
  if (frame.length % 2 !== 0 || Buffer.from(frame, 'hex').toString('hex') !== frame.toLowerCase()) {
    console.log('存在非十六进制或奇数长度的帧参数，请检查');
    process.exit(1);
  }
}

/** 打印已完整重组的 WIST 帧 */
function showAll(frames, expectedSid) {
  let n = 0;
  const expected = [];
  const unrelated = [];
  for (const f of frames) {
    (f.fieldA === expectedSid ? expected : unrelated).push(f);
  }
  for (const f of [...expected, ...unrelated]) {
    n++;
    const cmd = f.body.readUInt32BE(0);
    const status = f.body.readInt8(4);
    const data = f.body.subarray(5);
    const prefix = f.fieldA === expectedSid ? '  ' : `  [sid=${f.fieldA}] `;
    const pairs = idNamePairs(data);
    const texts = cjkStrings(data);
    const { fields } = decodeBody(data, 8);
    if (pairs.length) {
      console.log(`${prefix}cmd=${cmd} status=${status} len=${f.len}  任务:`);
      pairs.slice(0, 25).forEach((p) => console.log(`      ${String(p.id).padEnd(9)}${p.name}`));
    } else {
      console.log(`${prefix}cmd=${cmd} status=${status} len=${f.len}  ${fields.map((x) => (x.t === 'str' ? `"${x.v}"` : x.v)).join(', ').slice(0, 130)}`);
      if (texts.length) console.log(`      中文: ${texts.slice(0, 3).join(' | ').slice(0, 100)}`);
    }
  }
  return n;
}

(async function main() {
  const lp = config.loginParams();
  const gs = config.gameServer();
  if (!gs || !lp) {
    console.log('尚未登录：请先完成首次登录');
    process.exit(1);
  }

  const c = new W2Client({ host: gs.host, port: gs.port, loginParams: lp });
  try {
    await c.connect();
  } catch (e) {
    console.log('连接失败:', e.message);
    process.exit(1);
  }
  console.log('已登录，开始探测...');

  // 探测的是未知结构的响应，绕开 SDK 的 schema 解析：
  // SDK _onData 会把响应吃掉，这里直接在 socket 上挂原始监听收集
  const responses = [];
  const splitter = new W2FrameReassembler('in');
  c.sock.on('data', (d) => { responses.push(...splitter.push(d)); });
  // SDK 的 _onData 先注册会先消费，但它只 resolve pending（探测帧无 pending），
  // 不影响这里追加监听收到的原始字节

  for (let i = 0; i < hexes.length; i++) {
    const frame = Buffer.from(hexes[i], 'hex');
    const parsed = parseFrame(frame);
    if (!parsed) {
      console.log(`帧${i + 1}: 格式无效，跳过`);
      continue;
    }
    console.log(`帧${i + 1}: ...${hexes[i].slice(-16)}`);
    c.sock.write(frame);
    await new Promise((r) => setTimeout(r, 2800));
    // 每帧等待窗口结束后只消费已经完整的响应；splitter 内未完成尾段保留到下一窗口。
    const count = showAll(responses.splice(0), parsed.sid);
    if (!count) console.log('  （无可解析响应）');
  }

  console.log('\n探测结束。');
  c.close();
})();
