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
 *     skip: 1,                       // status 后跳过的字节（如回显参数）
 *     fields: [                      // 字段表，与 reference/ 文档一致
 *       ['task_id', 'u32'], ['task_name', 'string'],
 *     ],
 *     list: true,                    // 「计数 + 条目数组」结构
 *     item: [                        // list=true 时条目内字段
 *       ['task_id', 'u32'], ['task_name', 'string'],
 *     ],
 *     tail: [['notice', 'string']],  // 列表之后的尾字段
 *   });
 *
 *   // 方式三: 推送监听（26000 段，服务端主动下发）
 *   c.onPush(26044, (r) => console.log(r.fields));
 *
 *   await c.close();
 */

import net from 'net';
import config from './config.js';
import { buildFrame, parseFrame, p } from './w2build.js';

// iOS 客户端登录参数默认值
const DEFAULT_CLIENT_VER = 3036900;
const DEFAULT_PLATFORM = 'ios';
const DEFAULT_CHANNEL = 'wst_ios_zh_002';
const DEFAULT_LANGUAGE = 'zh';
const MAX_FRAME_BODY = 1048576;

function validPositiveU64(value) {
  if (typeof value === 'number' && !Number.isSafeInteger(value)) return null;
  try {
    const parsed = BigInt(value);
    return parsed > 0n && parsed <= 0xffffffffffffffffn ? parsed : null;
  } catch {
    return null;
  }
}

function validU32(value, fallback) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 && parsed <= 0xffffffff ? parsed : fallback;
}

// 统一出口：各层（SDK 登录帧 / SSO User-Agent）的版本值都从这里取，
// 保证 1001 的 clientVer 与 mlogin 的 User-Agent 版本号同源一致。
// 取值链与 config 一致：process.env > .env > 缺省值
function clientVer() {
  const env = validU32(process.env.W2_LOGIN_CLIENT_VER, null);
  if (env) return env;
  return validU32((config.fileEnv && config.fileEnv.W2_LOGIN_CLIENT_VER), DEFAULT_CLIENT_VER);
}

function clientUserAgent() {
  // iOS CFNetwork 栈 UA（版本号 = clientVer，与登录帧同源）
  return '%E4%BA%8C%E6%88%98%E9%A3%8E%E4%BA%91%20HD/' + clientVer() + ' CFNetwork/3860.700.1 Darwin/25.6.0';
}

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
 * @param {object} schema { skip, fields, list, item, tail, itemTail }
 *   itemTail: 每个条目末尾的固定字段（在条目字段后追加读取，如 game_entry 的 u8 flag）
 * @returns {{ data: object, rest: Buffer }}
 */
function decodeBySchema(buf, schema = {}) {
  const { skip = 0, fields = [], list = false, item = [], itemTail = [], tail = [] } = schema;
  let off = skip;
  const data = {};

  const readFields = (defs, target) => {
    for (const [name, type] of defs) {
      const rd = READERS[type];
      if (!rd) throw new Error(`未知字段类型: ${type}（字段 ${name}）`);
      if (off >= buf.length) throw new RangeError(`字段 ${name} 超出响应长度`);
      const { v, n } = rd(buf, off);
      if (!Number.isInteger(n) || n < 0 || off + n > buf.length) {
        throw new RangeError(`字段 ${name} 超出响应长度`);
      }
      target[name] = v;
      off += n;
    }
  };

  if (!list) {
    readFields(fields, data);
  } else {
    // 列表结构: [列表前字段] + u32 count + N×(条目字段 + itemTail) + [尾字段]
    readFields(fields, data);
    if (off + 4 > buf.length) throw new RangeError('列表计数字段超出响应长度');
    const count = buf.readUInt32BE(off);
    if (count > 100000) throw new RangeError(`列表计数过大: ${count}`);
    off += 4;
    const items = [];
    for (let i = 0; i < count; i++) {
      const one = {};
      readFields(item, one);
      readFields(itemTail, one);
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
   *   mode                'game'（默认，AES 加密帧）| 'choice'（选服服务器，明文帧 12B 头无加密）
   *   loginParams         登录凭据（{ userId, username, wst, installID, appKey }，
   *                       platform/channel/language/clientVer 缺省时用客户端常量默认值）
   *   clientType          客户端类型：ios（默认，sessionId 递增）| android（sessionId 全域随机）
   *   login               登录帧 hex 整帧重放（调试用，loginParams 缺省时的回退）
   *   timeout             单请求超时 ms，默认 10000
   *   interRequest        请求最小间隔 ms，默认 500（客户端频控同款）
   *   autoHello           connect() 时是否先发 cmd=6，默认 true（choice 模式忽略）
   */
  constructor(opts = {}) {
    this.host = opts.host;
    this.port = opts.port || 8083;
    this.mode = opts.mode === 'choice' ? 'choice' : 'game';
    this.loginFrameHex = opts.login || ''; // 整帧重放（调试用，正式凭据走 loginParams）
    this.timeout = opts.timeout || 10000;
    this.interRequest = opts.interRequest != null ? opts.interRequest : 500;
    this.autoHello = this.mode === 'game' && opts.autoHello !== false;
    this.loginParams = opts.loginParams || null; // 完整登录凭据（优先于 login 帧重放）

    this.sock = null;
    this.recvBuf = Buffer.alloc(0);
    this.no = 0;
    this.clientType = opts.clientType || this.loginParams?.clientType || 'ios';
    this._sidNext = 100001;
    this._pending = new Map();
    this._pushHandlers = new Map();
    this._lastSendAt = 0;
    this._sendChain = Promise.resolve();
    this.connected = false;
  }

  /** 建立连接并登录 */
  async connect() {
    if (!this.host) throw new Error('缺少 host');
    const socket = net.connect(this.port, this.host);
    this.sock = socket;
    this.recvBuf = Buffer.alloc(0);
    let settled = false;
    const isCurrent = () => this.sock === socket;
    socket.on('data', (chunk) => { if (isCurrent()) this._onData(chunk); });
    socket.on('error', (e) => { if (isCurrent()) this._finalize(new Error(`连接错误: ${e.message}`)); });
    socket.on('end', () => { if (isCurrent()) this._finalize(new Error('连接被服务器关闭')); });
    socket.on('close', () => { if (isCurrent()) this._finalize(new Error('连接已关闭')); });
    await new Promise((resolve, reject) => {
      const onConnect = () => {
        settled = true;
        cleanup();
        resolve();
      };
      const onError = (e) => {
        settled = true;
        cleanup();
        reject(e);
      };
      const cleanup = () => {
        socket.off('connect', onConnect);
        socket.off('error', onError);
      };
      socket.once('connect', onConnect);
      socket.once('error', onError);
    });
    if (!settled) throw new Error('连接未建立');
    this.connected = true;
    try {
      if (this.autoHello) await this.call(6, Buffer.alloc(0));
      await this._login();
      return this;
    } catch (e) {
      this.close();
      throw e;
    }
  }

  /**
   * 登录。优先级：
   *   1. opts.loginParams / 构造时 loginParams —— 用凭据字段完整构造 1001 帧（推荐，
   *      凭据经 tools/w2login.js 登录后持久化到 .identity.local.json，由 config.loginParams() 读取）
   *   2. login 帧整帧重放 —— 无 loginParams 时的回退路径
   * 两者都缺时抛错，业务连接不可跳过 1001 登录。
   */
  async _login(opts = {}) {
    if (this.mode === 'choice') return { mode: 'skipped' };
    const lp = opts.loginParams || this.loginParams;
    if (lp && lp.wst) {
      const userId = validPositiveU64(lp.userId);
      if (
        !userId || typeof lp.username !== 'string' || !lp.username
        || typeof lp.installID !== 'string' || !lp.installID
        || typeof lp.appKey !== 'string' || !lp.appKey
      ) {
        throw new Error('登录缓存不完整：需要有效 userId、username、wst、installID 与 appKey；请重新执行登录命令');
      }
      const params = p.cat(
        p.u64(userId),
        p.str(lp.username),
        p.u32(validU32(lp.clientVer, null) || clientVer()),
        p.str(lp.platform || DEFAULT_PLATFORM),
        p.str(lp.channel || DEFAULT_CHANNEL),
        p.str(lp.language || DEFAULT_LANGUAGE),
        p.str(lp.appKey),
        p.str(lp.wst),
        p.str(lp.installID),
        p.byte(0)
      );
      const r = await this._send(1001, params, { okStatuses: [1, 2] });
      if (!r.ok) throw new Error(`登录失败${r.message ? `：${r.message}` : `（status=${r.status}）`}`);
      return { mode: 'constructed', response: r };
    }
    if (this.loginFrameHex) {
      const frame = Buffer.from(this.loginFrameHex, 'hex');
      const parsed = parseFrame(frame);
      if (!parsed) throw new Error('登录重放帧格式无效');
      this.no = parsed.no;
      const resp = await this._request(parsed.cmd, parsed.sid, frame);
      const body = resp.subarray(12);
      const status = body.readInt8(4);
      if (![1, 2].includes(status)) throw new Error(`登录重放失败（status=${status}）`);
      return { mode: 'replay' };
    }
    throw new Error('缺少登录凭据');
  }

  /**
   * sessionId 分配，按 clientType 模拟对应客户端实现：
   *   ios     —— 从 100001 起递增分配（iOS 原生客户端行为）
   *   android —— parseInt(2147483647 * Math.random()) 全域随机（Android 客户端行为）
   */
  _nextSessionId() {
    if (this.clientType === 'android') {
      return parseInt(String(2147483647 * Math.random()));
    }
    return this._sidNext++;
  }

  /** 原始调用：params 为已编码 Buffer；无 schema 时返回原始响应段 */
  async call(cmd, params = Buffer.alloc(0), schema = null, opts = {}) {
    return this._send(cmd, params, { ...opts, schema });
  }

  async _send(cmd, params, opts = {}) {
    if (!this.connected) throw new Error('未连接（先 connect()）');
    if (!Buffer.isBuffer(params)) throw new TypeError('params 必须是 Buffer');
    await this._throttle();
    this.no += 1;
    const sid = this._nextSessionId();
    const frame = this.mode === 'choice'
      ? (() => {
          const f = Buffer.alloc(16 + params.length);
          f.write('WIST', 0, 'latin1');
          f.writeUInt32BE(sid, 4);
          f.writeUInt32BE(4 + params.length, 8);
          f.writeUInt32BE(cmd, 12);
          params.copy(f, 16);
          return f;
        })()
      : buildFrame(this.no, sid, cmd, params);

    const resp = await this._request(cmd, sid, frame);
    const body = resp.subarray(12);
    const status = body.readInt8(4);
    const payload = body.subarray(5);
    const okStatuses = opts.okStatuses || null;
    const ok = okStatuses ? okStatuses.includes(status) : status === 1;
    const base = { cmd, status, ok };

    if (!ok) {
      let message = '';
      try {
        const len = payload.readUInt32BE(0);
        if (len <= payload.length - 4) message = payload.subarray(4, 4 + len).toString('utf8');
      } catch (e) { /* 文案缺失 */ }
      return { ...base, message };
    }
    if (!opts.schema) return { ...base, raw: payload };

    try {
      const { data } = decodeBySchema(payload, opts.schema);
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
    this._finalize(new Error('连接已由客户端关闭'));
    if (this.sock && !this.sock.destroyed) this.sock.end();
  }

  // ---------- 内部 ----------
  async _throttle() {
    const reserve = async () => {
      const wait = this._lastSendAt + this.interRequest - Date.now();
      if (wait > 0) await sleep(wait);
      this._lastSendAt = Date.now();
    };
    const scheduled = this._sendChain.then(reserve, reserve);
    this._sendChain = scheduled.catch(() => {});
    await scheduled;
  }

  _finalize(reason) {
    if (!this.connected && !this._pending.size) return;
    this.connected = false;
    for (const pending of this._pending.values()) {
      clearTimeout(pending.timer);
      pending.reject(reason);
    }
    this._pending.clear();
  }

  _onData(chunk) {
    this.recvBuf = Buffer.concat([this.recvBuf, chunk]);
    for (;;) {
      if (this.recvBuf.length < 12) break;
      if (this.recvBuf.toString('latin1', 0, 4) !== 'WIST') {
        this.recvBuf = this.recvBuf.subarray(1);
        continue;
      }
      const length = this.recvBuf.readUInt32BE(8);
      if (length < 5 || length > MAX_FRAME_BODY) {
        this._finalize(new Error(`收到无效 WIST 帧长度: ${length}`));
        if (this.sock && !this.sock.destroyed) this.sock.destroy();
        return;
      }
      const total = 12 + length;
      if (this.recvBuf.length < total) break;
      const frame = this.recvBuf.subarray(0, total);
      this.recvBuf = this.recvBuf.subarray(total);

      const body = frame.subarray(12);
      const cmd = body.readUInt32BE(0);
      const sid = frame.readUInt32BE(4);
      if (sid === 0xffffffff) {
        const handlers = this._pushHandlers.get(cmd) || [];
        const payload = body.subarray(5);
        for (const fn of handlers) {
          try { fn({ cmd, raw: payload }); } catch (e) { /* 回调异常不阻断 */ }
        }
        continue;
      }
      const pending = this._pending.get(sid);
      if (pending && pending.cmd === cmd) {
        this._pending.delete(sid);
        clearTimeout(pending.timer);
        pending.resolve(frame);
      }
    }
  }

  _request(cmd, sid, frame) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this._pending.delete(sid);
        reject(new Error(`cmd=${cmd} 响应超时（${this.timeout}ms）—— 帧被静默丢弃或链路异常`));
      }, this.timeout);
      this._pending.set(sid, { cmd, resolve, reject, timer });
      this.sock.write(frame, (err) => {
        if (!err) return;
        clearTimeout(timer);
        this._pending.delete(sid);
        reject(err);
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
  clientVer,
  clientUserAgent,
  p,
  sleep,
};
