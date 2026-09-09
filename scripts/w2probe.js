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
import { framesIn, idNamePairs, cjkStrings, decodeBody } from '../lib/w2.js';
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

/** 从响应缓冲切出 WIST 帧并打印可读摘要 */
function showAll(buf) {
  let n = 0;
  while (buf.length >= 16 && buf.toString('latin1', 0, 4) === 'WIST') {
    const L = buf.readUInt32BE(8);
    if (buf.length < 12 + L) break;
    const frame = buf.subarray(0, 12 + L);
    buf = buf.subarray(12 + L);
    const f = framesIn(frame)[0];
    if (!f) continue;
    n++;
    // 入站 body: cmd(4B) + status(1B) + 数据
    const cmd = f.body.readUInt32BE(0);
    const status = f.body.length > 4 ? f.body.readInt8(4) : -1;
    const data = f.body.subarray(5);
    const pairs = idNamePairs(data);
    const texts = cjkStrings(data);
    const { fields } = decodeBody(data, 8);
    if (pairs.length) {
      console.log(`  cmd=${cmd} status=${status} len=${f.len}  任务:`);
      pairs.slice(0, 25).forEach((p) => console.log(`      ${String(p.id).padEnd(9)}${p.name}`));
    } else {
      console.log(`  cmd=${cmd} status=${status} len=${f.len}  ${fields.map((x) => (x.t === 'str' ? `"${x.v}"` : x.v)).join(', ').slice(0, 130)}`);
      if (texts.length) console.log(`      中文: ${texts.slice(0, 3).join(' | ').slice(0, 100)}`);
    }
  }
  return { rest: buf, count: n };
}

(async function main() {
  const lp = config.loginParams();
  const gs = config.gameServer();
  if (!gs || !lp) {
    console.log('尚未登录：先执行 node tools/w2login.js <邮箱或账号> <密码> 完成首次登录');
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
  let rawBuf = Buffer.alloc(0);
  c.sock.on('data', (d) => { rawBuf = Buffer.concat([rawBuf, d]); });
  // SDK 的 _onData 先注册会先消费，但它只 resolve pending（探测帧无 pending），
  // 不影响这里追加监听收到的原始字节

  for (let i = 0; i < hexes.length; i++) {
    console.log(`帧${i + 1}: ...${hexes[i].slice(-16)}`);
    c.sock.write(Buffer.from(hexes[i], 'hex'));
    await new Promise((r) => setTimeout(r, 2800));
    const { count } = showAll(rawBuf);
    if (!count) console.log('  （无可解析响应）');
    rawBuf = Buffer.alloc(0);
  }

  console.log('\n探测结束。');
  c.close();
})();
