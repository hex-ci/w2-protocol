/**
 * sdk.js —— W2 协议标准化调用 SDK
 *
 * 目标：业务脚本只关心「发什么命令、传什么参数、拿到什么数据」，
 *      不需要理解 TCP 长连接、帧序号、sessionId、AES 加密、请求-响应配对等底层细节。
 *
 * 分层（自底向上）:
 *   lib/w2.js       帧切分 / body 解码原语
 *   lib/w2build.js  出站帧构造 + AES/MD5 原语
 *   lib/sdk.js      本文件：会话管理 + 请求-响应配对 + 声明式响应解析
 *   scripts/*       业务脚本
 *
 * 典型用法:
 *   import { W2Client } from './sdk.js';
 *   const c = new W2Client({ host, port });
 *   await c.connect();                       // TCP + hello(6) + 登录(1001)
 *
 *   // 方式一: 原始调用 —— 参数为已编码 Buffer，响应返回原始 body
 *   const r = await c.call(10001, Buffer.from([0]));
 *
 *   // 方式二: 声明式调用 —— 参数用 p.* 封装，响应按 schema 自动解析成对象
 *   const r = await c.call(10001, p.byte(0), {
 *     schema: {
 *       skip: 1,                       // status 后跳过的字节（如回显参数）
 *       fields: [                      // 字段表，与 reference/ 文档一致
 *         ['task_id', 'u32'], ['task_name', 'string'],
 *       ],
 *       list: true,                    // 「计数 + 条目数组」结构
 *       item: [                        // list=true 时条目内字段
 *         ['task_id', 'u32'], ['task_name', 'string'],
 *       ],
 *       tail: [['notice', 'string']],  // 列表之后的尾字段
 *     },
 *   });
 *
 *   // 方式三: 推送监听（26000 段，服务端主动下发）
 *   c.onPush(26044, (r) => console.log(r.fields));
 *
 *   await c.close();
 */

import net from 'net';
import { buildFrame, p } from './w2build.js';

// 客户端版本整数默认值
const DEFAULT_CLIENT_VER = 3036900;
// iOS 客户端登录参数默认值
const DEFAULT_PLATFORM = 'ios';
const DEFAULT_CHANNEL = 'wst_ios_zh_002';
const DEFAULT_LANGUAGE = 'zh';

// ---------- 声明式响应解码器 ----------
// 类型编码（大端）：u8/u16/u32/u64/string(4B 长度前缀+UTF-8)/raw
const READERS = {
  u8: (b, o) => ({ v: b[o], n: 1 }),
  u16: (b, o) => ({ v: b.readUInt16BE(o), n: 2 }),
  u32: (b, o) => ({ v: b.readUInt32BE(o), n: 4 }),
  u64: (b, o) => ({ v: b.readBigUInt64BE(o), n: 8 }),
  string: (b, o) => {
    const len = b.readUInt32BE(o);
    return { v: b.subarray(o + 4, o + 4 + len).toString('utf8'), n: 4 + len };
  },
  raw: (b, o) => ({ v: b.subarray(o), n: b.length - o }),
};

/**
 * 按字段表解码一段响应
 * @param {Buffer} buf    status 之后的响应数据（不含 cmd/status）
 * @param {object} schema { skip, fields, list, item, tail }
 * @returns {{ data: object, rest: Buffer }}
 */
function decodeBySchema(buf, schema = {}) {
  const { skip = 0, fields = [], list = false, item = [], tail = [] } = schema;
  let off = skip;
  const data = {};

  const readFields = (defs, target) => {
    for (const [name, type] of defs) {
      const rd = READERS[type];
      if (!rd) throw new Error(`未知字段类型: ${type}（字段 ${name}）`);
      const { v, n } = rd(buf, off);
      target[name] = v;
      off += n;
    }
  };

  if (!list) {
    readFields(fields, data);
  } else {
    // 列表结构: [列表前字段] + u32 count + N×条目 + [尾字段]
    readFields(fields, data);
    const count = buf.readUInt32BE(off);
    off += 4;
    const items = [];
    for (let i = 0; i < count; i++) {
      const one = {};
      readFields(item, one);
      items.push(one);
    }
    data[data._listKey || 'items'] = items;
    readFields(tail, data);
  }
  return { data, rest: buf.subarray(off) };
}

// ---------- 会话客户端 ----------
class W2Client {
  /**
   * @param {object} opts
   *   host, port          服务器地址（必填）
   *   loginParams         登录凭据（{ userId, username, wst, installID, appKey }，
   *                       platform/channel/language/clientVer 缺省时用客户端常量默认值）
   *   clientType          客户端类型：ios（默认，sessionId 递增）| android（sessionId 全域随机）
   *   login               登录帧 hex 整帧重放（调试用，loginParams 缺省时的回退）
   *   timeout             单请求超时 ms，默认 10000
   *   interRequest        请求最小间隔 ms，默认 500（客户端频控同款）
   *   autoHello           connect() 时是否先发 cmd=6，默认 true
   */
  constructor(opts = {}) {
    this.host = opts.host;
    this.port = opts.port || 8083;
    this.loginFrameHex = opts.login || ''; // 整帧重放（调试用，正式凭据走 loginParams）
    this.timeout = opts.timeout || 10000;
    this.interRequest = opts.interRequest != null ? opts.interRequest : 500;
    this.autoHello = opts.autoHello !== false;
    this.loginParams = opts.loginParams || null; // 完整登录凭据（优先于 login 帧重放）

    this.sock = null;
    this.recvBuf = Buffer.alloc(0);
    this.no = 0;
    this.clientType = opts.clientType || 'ios'; // ios=sessionId 递增；android=全域随机
    this._sidNext = 100001;      // ios 模式：sessionId 从 100001 起递增分配
    this._pending = [];          // { cmd, resolve, reject, timer }
    this._pushHandlers = new Map(); // cmd → [fn]
    this._lastSendAt = 0;
    this.connected = false;
  }

  /** 建立连接并登录 */
  async connect() {
    if (!this.host) throw new Error('缺少 host');
    this.sock = net.connect(this.port, this.host);
    this.sock.on('data', (chunk) => this._onData(chunk));
    await new Promise((resolve, reject) => {
      this.sock.once('connect', resolve);
      this.sock.once('error', reject);
    });
    this.sock.on('error', (e) => {
      // 连接级错误：让所有 pending 立刻失败
      this.connected = false;
      for (const p of this._pending.splice(0)) {
        clearTimeout(p.timer);
        p.reject(new Error(`连接错误: ${e.message}`));
      }
    });
    this.connected = true;

    if (this.autoHello) {
      await this.call(6, Buffer.alloc(0)); // 服务器配置 hello（空参）
    }
    await this._login();
    return this;
  }

  /**
   * 登录。优先级：
   *   1. opts.loginParams / 构造时 loginParams —— 用凭据字段完整构造 1001 帧（推荐，
   *      凭据可从旧登录帧解密提取一次后持久化到 .env（W2_LOGIN_*）
   *   2. login 帧整帧重放 —— 无 loginParams 时的回退路径
   * 两者都缺则跳过登录（由调用方自行处理，如仅探测不登录的场景）。
   */
  async _login(opts = {}) {
    const lp = opts.loginParams || this.loginParams;
    if (lp && lp.wst) {
      // 完整登录：按 NOTES §8 的 1001 明文结构逐字段构造
      // platform/channel/language/clientVer 缺省用 iOS 真机值
      const params = p.cat(
        p.u64(lp.userId || 0),
        p.str(lp.username || ''),
        p.u32(lp.clientVer || DEFAULT_CLIENT_VER),
        p.str(lp.platform || DEFAULT_PLATFORM),
        p.str(lp.channel || DEFAULT_CHANNEL),
        p.str(lp.language || DEFAULT_LANGUAGE),
        p.str(lp.appKey || ''),
        p.str(lp.wst),
        p.str(lp.installID || '')
      );
      this.no += 1;
      const sid = this._nextSessionId();
      this.sock.write(buildFrame(this.no, sid, 1001, params));
      await sleep(1200);
      return { mode: 'constructed' };
    }
    if (this.loginFrameHex) {
      // 登录帧整帧重放：wst 为长期凭据，与客户端手动登录等效
      this.no = 1; // 登录帧自带其原始序号；重放后从其序号+1 继续递增，服务端不校验连续性
      this.sock.write(Buffer.from(this.loginFrameHex, 'hex'));
      await sleep(1200);
      return { mode: 'replay' };
    }
    return { mode: 'skipped' };
  }

  /**
   * sessionId 分配，按 clientType 模拟对应客户端实现：
   *   ios     —— 从 100001 起递增分配（iOS 原生客户端行为）
   *   android —— parseInt(2147483647 * Math.random()) 全域随机（Android H5 客户端行为）
   */
  _nextSessionId() {
    if (this.clientType === 'android') {
      return parseInt(String(2147483647 * Math.random()));
    }
    return this._sidNext++;
  }

  /** 原始调用：params 为已编码 Buffer；无 schema 时返回原始响应段 */
  async call(cmd, params = Buffer.alloc(0), schema = null, opts = {}) {
    if (!this.connected) throw new Error('未连接（先 connect()）');
    await this._throttle();
    this.no += 1;
    const sid = this._nextSessionId();
    const frame = buildFrame(this.no, sid, cmd, params);

    const resp = await this._request(cmd, frame);
    // resp: WIST 头(12B) + body(cmd 4B + status 1B + 数据)
    const body = resp.subarray(12);
    const status = body.length > 4 ? body.readInt8(4) : -1;
    const payload = body.subarray(5);
    const okStatuses = opts.okStatuses || null; // null = status>0 即成功
    const ok = okStatuses ? okStatuses.includes(status) : status > 0;
    const base = { cmd, status, ok };

    const failBranch = status <= 0 && !(okStatuses && okStatuses.includes(status));
    if (failBranch) {
      // 失败：status 后是 string errorMessage
      let message = '';
      try {
        const len = payload.readUInt32BE(0);
        message = payload.subarray(4, 4 + len).toString('utf8');
      } catch (e) { /* 文案缺失 */ }
      return { ...base, message };
    }
    if (!schema) return { ...base, raw: payload };

    try {
      const { data } = decodeBySchema(payload, schema);
      return { ...base, ...data };
    } catch (e) {
      return { ...base, parseError: e.message, raw: payload };
    }
  }

  /** 监听服务端推送（26000 段） */
  onPush(cmd, fn) {
    if (!this._pushHandlers.has(cmd)) this._pushHandlers.set(cmd, []);
    this._pushHandlers.get(cmd).push(fn);
    return this;
  }

  /** 优雅关闭 */
  close() {
    this.connected = false;
    if (this.sock) this.sock.end();
  }

  // ---------- 内部 ----------
  async _throttle() {
    const wait = this._lastSendAt + this.interRequest - Date.now();
    if (wait > 0) await sleep(wait);
    this._lastSendAt = Date.now();
  }

  _onData(chunk) {
    this.recvBuf = Buffer.concat([this.recvBuf, chunk]);
    for (;;) {
      if (this.recvBuf.length < 16) break; // 最小帧: 12B 头 + 4B cmd
      if (this.recvBuf.toString('latin1', 0, 4) !== 'WIST') {
        this.recvBuf = this.recvBuf.subarray(1); // 丢字节重同步
        continue;
      }
      const L = this.recvBuf.readUInt32BE(8);
      const total = 12 + L;
      if (this.recvBuf.length < total) break;
      const frame = this.recvBuf.subarray(0, total);
      this.recvBuf = this.recvBuf.subarray(total);

      const body = frame.subarray(12);
      const cmd = body.readUInt32BE(0);
      const isPush = frame.readUInt32BE(4) === 0xffffffff;

      if (isPush) {
        const handlers = this._pushHandlers.get(cmd) || [];
        const payload = body.subarray(5);
        for (const fn of handlers) {
          try { fn({ cmd, raw: payload }); } catch (e) { /* 回调异常不阻断 */ }
        }
        continue;
      }
      const w = this._pending.find((x) => x.cmd === cmd);
      if (w) {
        this._pending.splice(this._pending.indexOf(w), 1);
        clearTimeout(w.timer);
        w.resolve(frame);
      }
      // 无 pending 的响应：客户端发起前的迟到推送/重复响应，忽略
    }
  }

  _request(cmd, frame) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        const i = this._pending.findIndex((x) => x.cmd === cmd);
        if (i >= 0) this._pending.splice(i, 1);
        reject(new Error(`cmd=${cmd} 响应超时（${this.timeout}ms）—— 帧被静默丢弃或链路异常`));
      }, this.timeout);
      this._pending.push({ cmd, resolve, reject, timer });
      this.sock.write(frame, (err) => {
        if (err) {
          clearTimeout(timer);
          const i = this._pending.findIndex((x) => x.cmd === cmd);
          if (i >= 0) this._pending.splice(i, 1);
          reject(err);
        }
      });
    });
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export {
  W2Client,
  decodeBySchema,
  p,
  sleep,
};
