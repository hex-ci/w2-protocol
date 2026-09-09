#!/usr/bin/env node

/**
 * w2build.js —— 任意参数构造 WiST 请求帧
 *
 * 帧结构与算法见 protocol/NOTES.md §2/§3：
 *   md5 输入 = u32BE(序号) + u32BE(sessionId) + u32BE(cmd) + AES密文，取前 16 字节
 *   AES-128-ECB key = sessionId 十进制左补零 16 字符，PKCS7
 *
 * 用法（作为库）:
 *   import { buildFrame, aesKey, aesDecrypt } from '../lib/w2build.js';
 *   const frame = buildFrame(1, 88888, 10003, p.u32(5042));   // 领取 taskId=5042
 *
 * 用法（命令行，自测）:
 *   node lib/w2build.js                    # 跑自检：组帧→解密→重组闭环校验
 */

import crypto from 'crypto';
import { pathToFileURL } from 'url';

// sessionId → AES key：十进制字符串左补零到 16 字符
function aesKey(sessionId) {
  return Buffer.from(String(sessionId).padStart(16, '0'), 'latin1');
}

// AES-128-ECB + PKCS7 加密
function aesEncrypt(plain, sessionId) {
  const c = crypto.createCipheriv('aes-128-ecb', aesKey(sessionId), null);
  return Buffer.concat([c.update(plain), c.final()]);
}

// 解密密文（autoPadding 可关，用于分析未知结构）
function aesDecrypt(cipher, sessionId, autoPadding = true) {
  const d = crypto.createDecipheriv('aes-128-ecb', aesKey(sessionId), null);
  d.setAutoPadding(autoPadding);
  return Buffer.concat([d.update(cipher), autoPadding ? d.final() : Buffer.alloc(0)]);
}

// md5 校验字段：前 16 字节二进制
function checksum(no, sessionId, cmd, cipher) {
  const head = Buffer.alloc(12);
  head.writeUInt32BE(no, 0);
  head.writeUInt32BE(sessionId, 4);
  head.writeUInt32BE(cmd, 8);
  return crypto.createHash('md5').update(Buffer.concat([head, cipher])).digest().subarray(0, 16);
}

/**
 * 构造完整出站帧
 * @param {number} no        序号（连接内递增）
 * @param {number} sessionId 随机会话 ID（0 ~ 2^31-1），同时决定 AES key
 * @param {number} cmd       命令字
 * @param {Buffer} params    命令字之后的明文参数（编码见 NOTES §4）
 * @returns {Buffer} 完整帧
 */
function buildFrame(no, sessionId, cmd, params = Buffer.alloc(0)) {
  const cipher = aesEncrypt(params, sessionId);
  const md5 = checksum(no, sessionId, cmd, cipher);

  const frame = Buffer.alloc(37 + cipher.length);
  frame.write('WiST', 0, 'latin1');
  frame[4] = 2;
  frame.writeUInt32BE(no, 5);
  md5.copy(frame, 9);
  frame.writeUInt32BE(sessionId, 25);
  frame.writeUInt32BE(cipher.length + 4, 29);
  frame.writeUInt32BE(cmd, 33);
  cipher.copy(frame, 37);
  return frame;
}

// 便捷参数封装（对应 NOTES §4 的基础类型）
const p = {
  byte: (v) => { const b = Buffer.alloc(1); b[0] = v & 0xff; return b; },
  u32: (v) => { const b = Buffer.alloc(4); b.writeUInt32BE(v, 0); return b; },
  u64: (v) => { const b = Buffer.alloc(8); b.writeBigUInt64BE(BigInt(v), 0); return b; },
  str: (s) => {
    const body = Buffer.from(s, 'utf8');
    const b = Buffer.alloc(4 + body.length);
    b.writeUInt32BE(body.length, 0);
    body.copy(b, 4);
    return b;
  },
  cat: (...parts) => Buffer.concat(parts),
};

// 解析帧头（不解密），用于核对/调试
function parseFrame(raw) {
  if (raw.length < 37 || raw.toString('latin1', 0, 4) !== 'WiST') return null;
  return {
    no: raw.readUInt32BE(5),
    sid: raw.readUInt32BE(25),
    len: raw.readUInt32BE(29),
    cmd: raw.readUInt32BE(33),
    cipher: raw.subarray(37),
  };
}

// ---------- 自检：组帧 → 解密 → 重组 闭环校验（不依赖外部数据） ----------
function selfTest() {
  let fail = 0;
  const check = (name, expect, actual) => {
    const ok = expect.equals(actual);
    if (!ok) fail++;
    console.log(`  ${ok ? 'OK  ' : 'FAIL'} ${name}`);
  };

  // 各类型参数的编码-解码闭环
  const cases = [
    ['byte', p.byte(0x02), 1],
    ['u32', p.u32(5042), 4],
    ['u64', p.u64('7000000000001234'), 8],
    ['string', p.str('钻石奖励'), 4 + Buffer.byteLength('钻石奖励')],
    ['cat', p.cat(p.u64('63574'), p.str('ios'), p.str('zh')), 8 + 4 + 3 + 4 + 2],
  ];
  const sid = 884422;
  for (const [name, params] of cases) {
    const frame = buildFrame(1, sid, 9999, params);
    check(`roundtrip ${name}`, params, aesDecrypt(frame.subarray(37), sid));
  }
  // parseFrame 头部字段核对
  const f = buildFrame(7, sid, 10003, p.u32(5042));
  const parsed = parseFrame(f);
  check('parseFrame no', Buffer.from([0, 0, 0, 7]), (() => { const b = Buffer.alloc(4); b.writeUInt32BE(parsed.no, 0); return b; })());
  check('parseFrame cmd', Buffer.from([0, 0, 0x27, 0x13]), (() => { const b = Buffer.alloc(4); b.writeUInt32BE(parsed.cmd, 0); return b; })());

  console.log(fail ? `自检失败 ${fail} 项` : '自检全部通过');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  selfTest();
}

export {
  aesKey,
  aesEncrypt,
  aesDecrypt,
  checksum,
  buildFrame,
  parseFrame,
  p,
};
