/**
 * w2.js —— 私有 TCP 协议解析库
 *
 * 协议格式（与 protocol/NOTES.md §2/§5 一致）
 *
 *  客户端 -> 服务器   魔数 "WiST"，变长帧
 *    +0   4  ASCII magic "WiST"
 *    +4   1  u8  协议版本 0x02
 *    +5   4  u32 序号 no（连接内递增）
 *    +9   16 md5 校验（输入 = no + sessionId + cmd + 密文，取前 16 字节）
 *    +25  4  u32 sessionId（随机数，同时是 AES 密钥种子）
 *    +29  4  u32 长度 L = 密文长 + 4
 *    +33  4  u32 命令字 cmd
 *    +37  …   AES-128-ECB 密文（业务参数加密块）
 *
 *  服务器 -> 客户端   魔数 "WIST"
 *    +0   4  ASCII magic "WIST"
 *    +4   4  u32 sessionId（回显；0xffffffff 表示服务器主动推送）
 *    +8   4  u32 长度 L = body 全长
 *    +12  …   body：u32 cmd + u8 status + 响应数据（明文）
 */

// ---------- pcap 流式解析 ----------
class PcapParser {
  constructor() {
    this.buf = Buffer.alloc(0);
    this.header = null;
    this.link = 1;
    this.nano = false;
  }

  _need(n) {
    return this.buf.length >= n;
  }

  push(chunk) {
    const out = [];
    this.buf = this.buf.length ? Buffer.concat([this.buf, chunk]) : chunk;
    for (;;) {
      if (!this.header) {
        if (!this._need(24)) break;
        // 文件字节序: d4c3b2a1=小端, a1b2c3d4=大端, 4d3cb2a1=小端纳秒, a1b23c4d=大端纳秒
        // 以 LE 读出后的值: 0xa1b2c3d4 / 0xd4c3b2a1 / 0xa1b23c4d / 0x4d3cb2a1
        const m = this.buf.readUInt32LE(0);
        let en;
        if (m === 0xa1b2c3d4) { en = '<'; this.nano = false; }
        else if (m === 0xd4c3b2a1) { en = '>'; this.nano = false; }
        else if (m === 0xa1b23c4d) { en = '<'; this.nano = true; }
        else if (m === 0x4d3cb2a1) { en = '>'; this.nano = true; }
        else break; // 未知 magic，等更多数据
        this.en = en;
        this.link = en === '<'
          ? this.buf.readUInt32LE(20)
          : this.buf.readUInt32BE(20);
        this.header = true;
        this.buf = this.buf.subarray(24);
        continue;
      }
      if (!this._need(16)) break;
      const h = this.buf;
      const sec = this.en === '<' ? h.readUInt32LE(0) : h.readUInt32BE(0);
      const frac = this.en === '<' ? h.readUInt32LE(4) : h.readUInt32BE(4);
      const incl = this.en === '<' ? h.readUInt32LE(8) : h.readUInt32BE(8);
      if (!this._need(16 + incl)) break;
      const ts = sec + frac / (this.nano ? 1e9 : 1e6);
      out.push({ ts, data: this.buf.subarray(16, 16 + incl) });
      this.buf = this.buf.subarray(16 + incl);
    }
    return out;
  }
}

class TcpReassembler {
  constructor() {
    this.flows = new Map();
    this.tick = 0;
  }

  push(packet) {
    if (packet.proto !== 'TCP') return packet.payload;
    const key = `${packet.src}:${packet.sport}>${packet.dst}:${packet.dport}`;
    let flow = this.flows.get(key);
    if (!flow) {
      flow = { next: null, pending: new Map(), used: 0, synced: false, packet: null };
      this.flows.set(key, flow);
    }
    flow.packet = packet;
    flow.used = ++this.tick;
    if (this.flows.size > 1024) this._prune();
    if (packet.flags & 0x02) {
      flow.pending.clear();
      flow.next = (packet.seq + 1) >>> 0;
      flow.synced = true;
    }
    if (!packet.payload.length) return flow.synced ? this._flush(flow, []) : Buffer.alloc(0);
    const seq = packet.flags & 0x02 ? (packet.seq + 1) >>> 0 : packet.seq;
    return this._pushFlow(flow, seq, packet.payload);
  }

  // 截断抓包没有 SYN 时，首段的真实起点未知。若数据从协议魔数开始可立即交付；
  // 否则先缓冲，等后续段到达后从较早序号开始连续重组，避免尾段先到导致头段被当重传丢弃。
  _primeUnseen(flow, seq, payload) {
    if (flow.pending.size < 128 && !flow.pending.has(seq)) flow.pending.set(seq, payload);
    if (flow.pending.size === 1 && (payload.subarray(0, 4).equals(Buffer.from('WiST')) || payload.subarray(0, 4).equals(Buffer.from('WIST')))) {
      flow.pending.delete(seq);
      flow.next = (seq + payload.length) >>> 0;
      flow.synced = true;
      return this._flush(flow, [payload]);
    }
    if (flow.pending.size === 1) return Buffer.alloc(0);
    const start = [...flow.pending.keys()].reduce((a, b) => ((a - b) >>> 0) < 0x80000000 ? b : a);
    flow.next = start;
    flow.synced = true;
    const first = flow.pending.get(start);
    flow.pending.delete(start);
    flow.next = (start + first.length) >>> 0;
    return this._flush(flow, [first]);
  }

  flush() {
    const out = [];
    for (const flow of this.flows.values()) {
      if (flow.synced || !flow.pending.size) continue;
      const start = [...flow.pending.keys()].reduce((a, b) => ((a - b) >>> 0) < 0x80000000 ? b : a);
      flow.next = start;
      flow.synced = true;
      out.push({ packet: flow.packet, payload: this._flush(flow, []) });
    }
    return out;
  }

  _pushFlow(flow, seq, payload) {
    if (!flow.synced) return this._primeUnseen(flow, seq, payload);
    if (seq === flow.next) {
      flow.next = (flow.next + payload.length) >>> 0;
      return this._flush(flow, [payload]);
    }
    const delta = (seq - flow.next) >>> 0;
    if (delta > 0x7fffffff) {
      const overlap = (flow.next - seq) >>> 0;
      if (overlap >= payload.length) return Buffer.alloc(0);
      const tail = payload.subarray(overlap);
      flow.next = (flow.next + tail.length) >>> 0;
      return this._flush(flow, [tail]);
    }
    if (flow.pending.size < 128 && !flow.pending.has(seq)) flow.pending.set(seq, payload);
    return Buffer.alloc(0);
  }

  _flush(flow, parts) {
    for (;;) {
      const next = flow.pending.get(flow.next);
      if (!next) break;
      flow.pending.delete(flow.next);
      parts.push(next);
      flow.next = (flow.next + next.length) >>> 0;
    }
    return parts.length === 1 ? parts[0] : Buffer.concat(parts);
  }

  _prune() {
    let oldestKey = null;
    let oldest = Infinity;
    for (const [key, flow] of this.flows) {
      if (flow.used < oldest) {
        oldest = flow.used;
        oldestKey = key;
      }
    }
    if (oldestKey) this.flows.delete(oldestKey);
  }
}

// ---------- 链路层 / IP / TCP ----------
function ipv4(b) {
  return `${b[0]}.${b[1]}.${b[2]}.${b[3]}`;
}

function decode(data, link) {
  let ip;
  if (link === 1) {           // Ethernet
    if (data.length < 14) return null;
    let et = data.readUInt16BE(12);
    let off = 14;
    while ((et === 0x8100 || et === 0x88a8 || et === 0x9100) && data.length >= off + 4) {
      et = data.readUInt16BE(off + 2);
      off += 4;
    }
    if (et !== 0x0800) return null;
    ip = data.subarray(off);
  } else if (link === 113) {                  // Linux cooked v1
    if (data.length < 16 || data.readUInt16BE(14) !== 0x0800) return null;
    ip = data.subarray(16);
  } else if (link === 276) {                  // Linux cooked v2
    if (data.length < 20 || data.readUInt16BE(0) !== 0x0800) return null;
    ip = data.subarray(20);
  } else if ([12, 14, 101, 228, 229].includes(link)) {
    ip = data;
  } else if (link === 0) {
    ip = data.subarray(4);
  } else {
    return null;
  }
  if (!ip || ip.length < 20 || (ip[0] >> 4) !== 4) return null;
  const ihl = (ip[0] & 0x0f) * 4;
  const total = ip.readUInt16BE(2);
  const proto = ip[9];
  const src = ipv4(ip.subarray(12, 16));
  const dst = ipv4(ip.subarray(16, 20));
  const body = total >= ihl && total <= ip.length ? ip.subarray(ihl, total) : ip.subarray(ihl);
  if (proto === 6 && body.length >= 20) {
    const sport = body.readUInt16BE(0);
    const dport = body.readUInt16BE(2);
    const doff = (body[12] >> 4) * 4;
    if (doff < 20 || doff > body.length) return null;
    return { src, sport, dst, dport, proto: 'TCP', payload: body.subarray(doff), seq: body.readUInt32BE(4), flags: body[13] };
  }
  if (proto === 17 && body.length >= 8) {
    const sport = body.readUInt16BE(0);
    const dport = body.readUInt16BE(2);
    const ul = body.readUInt16BE(4);
    return { src, sport, dst, dport, proto: 'UDP', payload: body.subarray(8, 8 <= ul && ul <= body.length ? ul : body.length), seq: 0, flags: 0 };
  }
  return null;
}

// ---------- WiST / WIST 帧 ----------
function framesOut(buf) {
  const res = [];
  let i = 0;
  while (i + 37 <= buf.length) {
    if (buf.toString('latin1', i, i + 4) !== 'WiST') {
      const j = buf.indexOf('WiST', i, 'latin1');
      if (j < 0) break;
      i = j;
      continue;
    }
    const no = buf.readUInt32BE(i + 5);
    const fieldA = buf.readUInt32BE(i + 25);
    const L = buf.readUInt32BE(i + 29);
    if (L < 20 || L > 65535) { i += 1; continue; }
    if (i + 33 + L > buf.length) break;
    const pay = buf.subarray(i + 33, i + 33 + L);
    const cmd = pay.length >= 4 ? pay.readUInt32BE(0) : null;
    const param = L === 20 && pay.length >= 20 ? pay.subarray(4, 20).toString('hex') : '';
    res.push({ off: i, no, fieldA, len: L, cmd, param, payload: pay, raw: buf.subarray(i, i + 33 + L) });
    i += 33 + L;
  }
  return res;
}

function framesIn(buf) {
  const res = [];
  let i = 0;
  while (i + 12 <= buf.length) {
    if (buf.toString('latin1', i, i + 4) !== 'WIST') {
      const j = buf.indexOf('WIST', i, 'latin1');
      if (j < 0) break;
      i = j;
      continue;
    }
    const fieldA = buf.readUInt32BE(i + 4);
    const L = buf.readUInt32BE(i + 8);
    if (L < 5 || L > 1048576) { i += 1; continue; }
    if (i + 12 + L > buf.length) break;
    res.push({ off: i, fieldA, len: L, body: buf.subarray(i + 12, i + 12 + L), raw: buf.subarray(i, i + 12 + L) });
    i += 12 + L;
  }
  return res;
}

class W2FrameReassembler {
  constructor(direction) {
    this.magic = direction === 'out' ? 'WiST' : 'WIST';
    this.split = direction === 'out' ? framesOut : framesIn;
    this.buf = Buffer.alloc(0);
  }

  push(chunk) {
    this.buf = this.buf.length ? Buffer.concat([this.buf, chunk]) : chunk;
    const frames = this.split(this.buf);
    if (frames.length) {
      const last = frames[frames.length - 1];
      this.buf = this.buf.subarray(last.off + last.raw.length);
      return frames;
    }
    const start = this.buf.indexOf(this.magic, 0, 'latin1');
    this.buf = start >= 0 ? this.buf.subarray(start) : this.buf.subarray(Math.max(0, this.buf.length - 3));
    return [];
  }
}

// ---------- body 解码：u32 整数 / 4字节长度前缀 UTF-8 字符串 ----------
function decodeBody(body, limit = 30) {
  const out = [];
  let i = 0;
  while (i + 4 <= body.length && out.length < limit) {
    const v = body.readUInt32BE(i);
    let str = null;
    if (v > 0 && v <= 256 && i + 4 + v <= body.length) {
      const s = body.subarray(i + 4, i + 4 + v).toString('utf8');
      if (s.length && !/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(s)) {
        try {
          // 确认是有效 UTF-8（无替换字符）
          if (!s.includes('\ufffd')) str = s;
        } catch (e) { /* ignore */ }
      }
    }
    if (str !== null) {
      out.push({ t: 'str', v: str });
      i += 4 + v;
    } else {
      out.push({ t: 'int', v });
      i += 4;
    }
  }
  return { fields: out, consumed: i };
}

function idNamePairs(body) {
  const pairs = [];
  let i = 0, last = null;
  while (i + 4 <= body.length) {
    const v = body.readUInt32BE(i);
    let str = null;
    if (v > 0 && v <= 128 && i + 4 + v <= body.length) {
      const s = body.subarray(i + 4, i + 4 + v).toString('utf8');
      if (s.length >= 1 && !/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(s) && !s.includes('\ufffd')) str = s;
    }
    if (str !== null) {
      if (last !== null && last > 20 && last < 6000000 && str.length >= 2 && str.length <= 24) {
        pairs.push({ id: last, name: str });
      }
      i += 4 + v;
      last = null;
    } else {
      last = v;
      i += 4;
    }
  }
  return pairs;
}

function cjkStrings(buf, minBytes = 6) {
  const res = [];
  const s = buf.toString('latin1');
  const re = /(?:[\xc2-\xdf][\x80-\xbf]|[\xe0-\xef][\x80-\xbf]{2}|[\xf0-\xf4][\x80-\xbf]{3})+/g;
  let m;
  while ((m = re.exec(s)) !== null) {
    const b = Buffer.from(m[0], 'latin1');
    if (b.length < minBytes) continue;
    const t = b.toString('utf8');
    if (!t.includes('\ufffd') && /[\u4e00-\u9fff]/.test(t)) res.push(t);
  }
  return res;
}

function hex(b, n = 64) {
  return b.subarray(0, n).toString('hex');
}

export {
  PcapParser,
  TcpReassembler,
  W2FrameReassembler,
  decode,
  framesOut,
  framesIn,
  decodeBody,
  idNamePairs,
  cjkStrings,
  hex,
};
