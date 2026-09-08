#!/usr/bin/env node

'use strict';

/**
 * w2build.js —— 任意参数构造 WiST 请求帧（2026-09-08 破解加密后新增）
 *
 * 帧结构与算法见 protocol/NOTES.md §1/§2：
 *   md5 输入 = u32BE(序号) + u32BE(sessionId) + u32BE(cmd) + AES密文，取前 16 字节
 *   AES-128-ECB key = sessionId 十进制左补零 16 字符，PKCS7
 *
 * 用法（作为库）:
 *   const { buildFrame, aesKey, decryptPayload } = require('../lib/w2build.js');
 *   const frame = buildFrame(1, 88888, 10003, u32(5042));   // 领取 taskId=5042
 *
 * 用法（命令行，自测）:
 *   node lib/w2build.js                    # 跑自检：复刻 frames.local.json 的已知帧
 */

const crypto = require('crypto');

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
 * @param {Buffer} params    命令字之后的明文参数（编码见 NOTES §3）
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

// 便捷参数封装（对应 NOTES §3 的基础类型）
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

// ---------- 自检：复刻 frames.local.json 的已知帧（逐字节一致才算通过） ----------
function selfTest() {
  const fs = require('fs');
  const path = require('path');
  const framesPath = path.join(__dirname, '..', 'protocol', 'frames.local.json');
  if (!fs.existsSync(framesPath)) {
    console.log('(无 frames.local.json，跳过自检)');
    return;
  }
  const frames = JSON.parse(fs.readFileSync(framesPath, 'utf8'));

  // login 帧参数含凭据，不复刻内容，只校验解密-重加密闭环
  let fail = 0;
  const check = (name, expect, actual) => {
    const ok = expect.equals(actual);
    if (!ok) fail++;
    console.log(`  ${ok ? 'OK  ' : 'FAIL'} ${name}`);
  };

  // hello: cmd=6 空参数
  {
    const f = parseFrame(Buffer.from(frames.hello, 'hex'));
    const built = buildFrame(f.no, f.sid, f.cmd, Buffer.alloc(0));
    check('hello', f ? Buffer.from(frames.hello, 'hex') : Buffer.alloc(0), built);
  }
  // queryTasks: cmd=10001，参数 1 字节 taskType
  {
    const raw = Buffer.from(frames.queryTasks, 'hex');
    const f = parseFrame(raw);
    const params = aesDecrypt(f.cipher, f.sid);
    check('queryTasks', raw, buildFrame(f.no, f.sid, f.cmd, params));
  }
  // claims: cmd=10003，参数 u32 taskId
  for (const [id, hex] of Object.entries(frames.claims)) {
    const raw = Buffer.from(hex, 'hex');
    const f = parseFrame(raw);
    check(`claim ${id}`, raw, buildFrame(f.no, f.sid, f.cmd, p.u32(Number(id))));
  }
  console.log(fail ? `自检失败 ${fail} 项` : '自检全部通过');
}

if (require.main === module) selfTest();

module.exports = { aesKey, aesEncrypt, aesDecrypt, checksum, buildFrame, parseFrame, p };
