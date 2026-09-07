#!/usr/bin/env node

'use strict';

/**
 * w2watch.js —— 实时协议嗅探器（某手游私有 TCP 协议）
 *
 * 启动后会拉起 tcpdump，边抓边解析，控制台实时打印每个操作，
 * 同时把结构化事件写入 JSONL 文件（供后续分析/补齐字典）。
 *
 * 用法:
 *   node bin/w2watch.js --ip <设备内网IP>                 # 自动探测接口
 *   node bin/w2watch.js --ip <设备内网IP> --iface <接口>
 *   node bin/w2watch.js --ip <设备内网IP> --tag zao-bing  # 给本次抓取打标签
 *   node bin/w2watch.js --ip <设备内网IP> --port 8083 --quiet
 *   node bin/w2watch.js --file capture.pcap                # 离线解析已有 pcap
 *
 * 输出:
 *   控制台  实时摘要（NEW 表示字典里没有的命令）
 *   captures/<日期>/<时间>_<tag>.jsonl   事件流
 *   captures/<日期>/<时间>_<tag>.pcap    原始包
 *   captures/<日期>/<时间>_<tag>.new.txt 本次发现的新命令（直接发给分析者）
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const {
  PcapParser, decode, framesOut, framesIn, decodeBody, idNamePairs, cjkStrings, hex,
} = require('../lib/w2.js');
const config = require('../lib/config.js');

// ---------- 参数 ----------
const argv = process.argv.slice(2);
function arg(name, def) {
  const i = argv.indexOf('--' + name);
  return i >= 0 && i + 1 < argv.length ? argv[i + 1] : def;
}
const has = (n) => argv.includes('--' + n);

const IP = arg('ip', '') || config.phoneIp;
const IFACE = arg('iface', '') || config.iface;
const PORT = parseInt(arg('port', String(config.port)), 10);
const TAG = arg('tag', 'op');
const FILE = arg('file', '');
const QUIET = has('quiet');
const ROOT = path.resolve(__dirname, '..');

if (!IP && !FILE) {
  console.log('需要 --ip <设备内网IP>  或  --file <pcap>');
  process.exit(1);
}

// ---------- 字典 ----------
const dictPath = path.join(ROOT, 'protocol', 'commands.json');
let dict = { commands: {}, push: {}, tasks: {} };
try {
  dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));
} catch (e) {
  console.log('警告: 读不到命令字典', dictPath);
}
const nameOf = (cmd) => (dict.commands && dict.commands[String(cmd)]) || (dict.push && dict.push[String(cmd)]) || '';

// ---------- 输出目录 ----------
const now = new Date();
const pad = (n) => String(n).padStart(2, '0');
const day = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
const hms = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
const dir = path.join(ROOT, 'captures', day);
fs.mkdirSync(dir, { recursive: true });
const stem = `${hms}_${TAG}`;
const jsonlPath = path.join(dir, stem + '.jsonl');
const newPath = path.join(dir, stem + '.new.txt');
const pcapPath = path.join(dir, stem + '.pcap');

const jf = fs.createWriteStream(jsonlPath, { flags: 'a' });
const newCmds = new Map();
let pcapFd = null;

function log(line) { if (!QUIET) console.log(line); }
function emit(ev) { jf.write(JSON.stringify(ev) + '\n'); }

// ---------- 核心解析 ----------
const parser = new PcapParser();
let t0 = null;
let phone = IP;
const seenOut = new Set();   // 请求去重（按 序号+命令）
const seenIn = new Set();

function handlePacket(ts, data) {
  const d = decode(data, parser.link);
  if (!d) return;
  if (PORT && d.sport !== PORT && d.dport !== PORT) return;
  if (t0 === null) t0 = ts;
  const rel = +(ts - t0).toFixed(3);
  const pl = d.payload;
  if (!pl || pl.length === 0) return;

  if (d.src === phone || (!IP && d.dport === PORT)) {
    // 客户端 -> 服务器
    for (const f of framesOut(pl)) {
      const key = `${f.no}:${f.cmd}`;
      if (seenOut.has(key)) continue;
      seenOut.add(key);
      const nm = nameOf(f.cmd);
      const isNew = !nm;
      const ev = {
        t: rel, dir: 'out', no: f.no, cmd: f.cmd, name: nm || 'UNKNOWN',
        fieldA: '0x' + f.fieldA.toString(16).padStart(8, '0'),
        len: f.len, param: f.param,
        raw: f.len !== 20 ? hex(f.payload, 128) : '',
        new: isNew,
      };
      emit(ev);
      if (isNew) newCmds.set(f.cmd, (newCmds.get(f.cmd) || 0) + 1);
      if (!isNew || !QUIET) {
        log(`  [+${String(rel).padStart(7)}s] #${String(f.no).padEnd(3)} 请求 cmd=${String(f.cmd).padEnd(6)} ${isNew ? '★NEW' : '    '} ${nm}${f.param ? '  ' + f.param.slice(0, 16) : ''}`);
      }
    }
  } else {
    // 服务器 -> 客户端
    for (const f of framesIn(pl)) {
      const body = f.body;
      const cmd = body.length >= 4 ? body.readUInt32BE(0) : null;
      const { fields } = decodeBody(body.subarray(4), 14);
      const texts = cjkStrings(body);
      const pairs = idNamePairs(body);
      const key = `${f.fieldA}:${cmd}:${f.len}`;
      if (seenIn.has(key)) continue;
      seenIn.add(key);
      const nm = nameOf(cmd);
      const ev = {
        t: rel, dir: 'in', cmd, name: nm || '', fieldA: '0x' + f.fieldA.toString(16).padStart(8, '0'),
        len: f.len, fields: fields.slice(0, 14).map((x) => (x.t === 'str' ? x.v : x.v)),
        texts: texts.slice(0, 6), pairs, new: !nm,
      };
      emit(ev);
      if (!nm) newCmds.set(cmd, (newCmds.get(cmd) || 0) + 1);
      const brief = [];
      if (pairs.length) brief.push(pairs.slice(0, 3).map((p) => `${p.id}=${p.name}`).join(', '));
      else if (texts.length) brief.push(texts[0].slice(0, 40));
      else brief.push(fields.slice(0, 6).map((x) => (x.t === 'str' ? `"${x.v}"` : x.v)).join(','));
      if (!QUIET) {
        log(`  [+${String(rel).padStart(7)}s] 响应 cmd=${String(cmd).padEnd(6)} len=${String(f.len).padEnd(5)} ${nm ? '' : '★NEW '}${brief.join(' ').slice(0, 110)}`);
      }
    }
  }
}

function finish(code) {
  jf.end();
  if (pcapFd !== null) { try { fs.closeSync(pcapFd); } catch (e) { /* ignore */ } }
  let msg = '';
  if (newCmds.size) {
    const lines = [`# 本次新发现的命令  ${day} ${stem}`, '# 格式: 命令号  出现次数'];
    for (const [c, n] of [...newCmds.entries()].sort((a, b) => a[0] - b[0])) {
      lines.push(`${c}\t${n}`);
    }
    fs.writeFileSync(newPath, lines.join('\n') + '\n');
    msg = `\n★ 新命令 ${newCmds.size} 个，已写入 ${path.relative(ROOT, newPath)}（发给分析者补字典）`;
  }
  console.log(`\n完成。事件: ${path.relative(ROOT, jsonlPath)}` + (FILE ? '' : `\n原始包: ${path.relative(ROOT, pcapPath)}`) + msg);
  process.exit(code || 0);
}

// ---------- 离线模式 ----------
if (FILE) {
  const data = fs.readFileSync(FILE);
  let n = 0;
  for (const p of parser.push(data)) { handlePacket(p.ts, p.data); n++; }
  console.log(`(离线解析 ${n} 个包)`);
  finish(0);
} else {
  // ---------- 在线模式 ----------
  const iface = IFACE || '(自动)';
  const filter = IP ? `host ${IP} and tcp port ${PORT}` : `tcp port ${PORT}`;
  const args = ['-nn', '-s', '0', '-U', '--immediate-mode', '-w', '-'];
  if (IFACE) args.unshift('-i', IFACE);
  args.push(filter);

  console.log('='.repeat(72));
  console.log(`实时嗅探   IP=${IP || '(自动)'} 接口=${iface} 端口=${PORT}`);
  console.log(`过滤: ${filter}`);
  console.log(`输出: ${path.relative(ROOT, jsonlPath)}`);
  console.log('操作游戏吧，每个动作都会实时显示。Ctrl+C 结束。');
  console.log('='.repeat(72));

  const td = spawn('tcpdump', args, { stdio: ['ignore', 'pipe', 'pipe'] });
  let started = false;
  td.stdout.on('data', (chunk) => {
    if (!started) { started = true; pcapFd = fs.openSync(pcapPath, 'w'); }
    if (pcapFd !== null) fs.writeSync(pcapFd, chunk);
    for (const p of parser.push(chunk)) handlePacket(p.ts, p.data);
  });
  td.stderr.on('data', (b) => {
    const s = b.toString();
    if (/error|failed|unknown/i.test(s)) console.error('tcpdump:', s.trim());
  });
  td.on('exit', (code) => finish(code));
  process.on('SIGINT', () => { try { td.kill('SIGINT'); } catch (e) { finish(0); } });
}
