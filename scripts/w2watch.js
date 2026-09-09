#!/usr/bin/env node

/**
 * w2watch.js —— 实时协议嗅探器
 *
 * 启动后会拉起 tcpdump，边抓边解析，控制台实时打印每个操作，
 * 同时把结构化事件写入 JSONL 文件（供后续分析/补齐字典）。
 *
 * 用法:
 *   node scripts/w2watch.js --ip <设备内网IP>                 # 自动探测接口
 *   node scripts/w2watch.js --ip <设备内网IP> --iface <接口>
 *   node scripts/w2watch.js --ip <设备内网IP> --tag zao-bing  # 给本次抓取打标签
 *   node scripts/w2watch.js --ip <设备内网IP> --port 8083 --quiet
 *   node scripts/w2watch.js --file capture.pcap                # 离线解析已有 pcap
 *
 * 输出:
 *   控制台  实时摘要（NEW 表示字典里没有的命令）
 *   captures/<日期>/<时间>_<tag>.jsonl   事件流
 *   captures/<日期>/<时间>_<tag>.pcap    原始包
 *   captures/<日期>/<时间>_<tag>.new.txt 本次发现的新命令（直接发给分析者）
 */

import { spawn, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  PcapParser,
  decode,
  framesOut,
  framesIn,
  decodeBody,
  idNamePairs,
  cjkStrings,
  hex,
} from '../lib/w2.js';
import config from '../lib/config.js';

// ---------- 参数 ----------
const argv = process.argv.slice(2);
function arg(name, def) {
  const i = argv.indexOf('--' + name);
  return i >= 0 && i + 1 < argv.length ? argv[i + 1] : def;
}
const has = (n) => argv.includes('--' + n);

const IP = arg('ip', '') || config.phoneIp;
const IFACE = arg('iface', '') || config.iface;
// 游戏服 TCP 端口为常量 8083（各服均为 :8083，见 reference/00-choice.md 服务器列表）
const PORT = parseInt(arg('port', '8083'), 10);
const TAG = arg('tag', 'op');
const FILE = arg('file', '');
const QUIET = has('quiet');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

if (!IP && !FILE) {
  console.log('需要 --ip <设备内网IP>  或  --file <pcap>');
  process.exit(1);
}

// ---------- 字典 ----------
const dictPath = path.join(ROOT, 'protocol', 'commands.json');
let dict = { names: {}, push: [], tasks: {} };
try {
  dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));
} catch (e) {
  console.log('警告: 读不到命令字典', dictPath);
}
const nameOf = (cmd) => dict.names[String(cmd)] || '';

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

// ---------- 环境自检（在线模式专用：连接存活 + flow offload，抓包成败的两大关键检查） ----------
// conntrack 文件路径（OpenWrt / Debian 兼容）
function conntrackFile() {
  for (const p of ['/proc/net/nf_conntrack', '/proc/net/ip_conntrack']) {
    try { fs.accessSync(p, fs.constants.R_OK); return p; } catch (e) { /* next */ }
  }
  return null;
}

// 检查目标设备的 8083 业务连接是否存活（设备锁屏/切后台会断连，抓不到数据的头号原因）
function checkConnection(ctFile) {
  if (!ctFile || !IP) return;
  const ct = fs.readFileSync(ctFile, 'utf8');
  const established = ct.split('\n').filter((l) => l.includes(IP) && l.includes('ESTABLISHED'));
  console.log(`连接预检: ${IP} 活动 TCP 连接 ${established.length} 条`);
  if (!established.length) {
    console.log('  !! 没有活动连接 —— 游戏大概率不在前台或已锁屏');
    console.log('  !! 确认: 游戏停在主界面 / 屏幕常亮，再重跑');
    return;
  }
  console.log(established.some((l) => l.includes(`dport=${PORT}`))
    ? `  OK: ${PORT} 业务连接存在，可以开抓`
    : `  !! 没有 ${PORT} 业务连接，游戏可能还没进入主界面`);
}

// 检查流量卸载：被 offload 的连接绕过 netfilter，tcpdump 只能抓到握手包，业务数据全丢
function checkOffload(ctFile) {
  const ctFile2 = ctFile;
  if (ctFile2) {
    const ct = fs.readFileSync(ctFile2, 'utf8');
    const offloadLines = ct.split('\n').filter((l) => l.includes('OFFLOAD'));
    if (offloadLines.length) {
      console.log(`!! 发现 ${offloadLines.length} 条 [OFFLOAD] 连接 —— 被流量卸载的连接不走 netfilter，业务数据抓不到`);
      console.log('!! 关闭后再抓:');
      console.log('     uci set firewall.@defaults[0].flow_offloading=0');
      console.log('     uci set firewall.@defaults[0].flow_offloading_hw=0');
      console.log('     uci commit firewall && service firewall restart');
      console.log('     (硬件卸载 / SFE / Shortcut-FE 需另关，见 README)');
    } else {
      console.log('flow offload 自检: 未发现卸载连接 ✓');
    }
  }
  // 内核模块层面的卸载（即使当前无连接也提示）
  try {
    const lsmod = execSync('lsmod 2>/dev/null', { encoding: 'utf8' });
    const mods = lsmod.split('\n').filter((l) => /offload|shortcut|sfe|fastnat|hw_nat/i.test(l)).map((l) => l.split(/\s+/)[0]);
    if (mods.length) console.log('  卸载相关内核模块:', mods.join(', '), '（若抓不到业务数据，优先排查）');
  } catch (e) { /* 无 lsmod，忽略 */ }
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
  // 环境自检：连接存活 + flow offload（抓包失败的两大元凶）
  const ctFile = conntrackFile();
  checkConnection(ctFile);
  checkOffload(ctFile);

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
