#!/usr/bin/env node

/**
 * w2login.js —— 模拟客户端完整登录
 *
 * 流程与客户端一致：
 *   1. SSO mlogin（账号密码，DES-ECB 加密）→ WST + wistoneId
 *   2. 连选服服务器：
 *      - 缓存有 serverId → 直接 cmd=1 确认
 *      - 无缓存或 --list → cmd=2 拉服务器列表 → 控制台列出 → 键盘选择 → cmd=1
 *   3. cmd=1 响应 → userId + server_host（游戏服地址，服务端下发）
 *   4. 全部落盘 .identity.local.json（wst/username/userId/serverId/serverName/
 *      gameHost/gamePort/WTGT/installID/appKey）
 *
 * 静默续登：缓存已有 WTGT 时优先用它免密码换新 WST，
 * 失败自动回退到账号密码登录。
 *
 * 用法:
 *   node tools/w2login.js                    # 静默续登（有 WTGT 缓存）或完整登录
 *   node tools/w2login.js <邮箱或账号> <密码>  # 完整登录
 *   node tools/w2login.js --list             # 强制列出服务器列表重选
 */

import http from 'http';
import crypto from 'crypto';
import readline from 'readline';
import { DES, Utf8, Latin1, ECB, Pkcs7, Hex } from 'crypto-es';
import config from '../lib/config.js';
import { W2Client, clientUserAgent } from '../lib/sdk.js';
import { p } from '../lib/w2build.js';

const CHOICE_HOST = config.sso.choiceHost;
const CHOICE_PORT = config.sso.choicePort;

const argv = process.argv.slice(2);
const forceList = argv.includes('--list');
const positional = argv.filter((a) => !a.startsWith('--'));
let account = positional[0] || '';
let password = positional[1] || '';

// ---------- 控制台交互 ----------
function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => { rl.close(); resolve(answer.trim()); });
  });
}

// ---------- SSO mlogin（表单见 protocol/API.md） ----------
function desEncrypt(text) {
  return DES.encrypt(Utf8.parse(text), Latin1.parse(config.sso.securityKey), { mode: ECB, padding: Pkcs7 })
    .ciphertext.toString(Hex).toUpperCase();
}

function desDecrypt(hex) {
  return DES.decrypt({ ciphertext: Hex.parse(hex) }, Latin1.parse(config.sso.securityKey), { mode: ECB, padding: Pkcs7 })
    .toString(Utf8);
}

function post(form, jsessionid) {
  return new Promise((resolve, reject) => {
    const u = new URL(config.sso.url + 'mlogin');
    const body = new URLSearchParams(form).toString();
    const req = http.request({
      hostname: u.hostname,
      path: u.pathname + (jsessionid ? ';jsessionid=' + jsessionid : ''),
      method: 'POST',
      headers: {
        // 请求头对齐 iOS 客户端 CFNetwork 栈
        'Host': u.host,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Connection': 'keep-alive',
        'Accept': '*/*',
        'User-Agent': clientUserAgent(),
        'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Length': Buffer.byteLength(body),
      },
    }, (res) => {
      let data = '';
      res.on('data', (c) => { data += c; });
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// mlogin 基础表单（login_type=0 空表单 / 覆盖后为提交表单）
function baseForm(overrides) {
  return {
    WID: '',
    source_area: config.sso.sourceArea,
    version: config.sso.version,
    UDID: '',
    MACID: '',
    WTGT: '',
    appid: desEncrypt(config.sso.appId),
    app_secret: config.sso.appSecret,
    login_type: 0,
    lang: config.sso.lang,
    platform: config.platform,
    device_model: '',
    cachetime: Date.now(),
    id_type: 0,
    ...config.sso.deviceFields, // 设备标识字段集按平台自动选择（iOS/Android 字段名不同）
    service: config.sso.url + 'mlogin',
    ...overrides,
  };
}

// 静默续登：拿缓存的 WTGT 换新 WST
// WID 是 username 的 DES 密文；服务器对无效请求返回 HTML 错误页（非 JSON），此处捕获并报清晰错误
async function silentLogin(wtgt) {
  let text;
  try {
    text = await post(baseForm({
      WID: desEncrypt(config.identity().username),
      WTGT: wtgt,
    }));
  } catch (e) {
    return null;
  }
  if (text.trimStart().startsWith('<')) return null; // HTML 错误页 = 请求被服务器拒绝
  let r;
  try { r = JSON.parse(text); } catch { return null; }
  return r.resultType === '1' ? r : null;
}

// 完整登录：账号密码
async function fullLogin() {
  const r1 = JSON.parse(await post(baseForm()));
  if (r1.resultType !== '0') throw new Error('SSO 第 1 步失败: resultType=' + r1.resultType + (r1.message ? '（' + r1.message + '）' : ''));
  const r2 = JSON.parse(await post(baseForm({
    login_type: 1,
    email: desEncrypt(account),
    password: desEncrypt(password),
    execution: r1.flowExecutionKey,
    l_t: r1.loginTicket,
    _eventId: 'loginSubmit',
  }), r1.sessionId));
  return r2.resultType === '1' ? r2 : null;
}

// ---------- 选服 ----------
// 拉服务器列表（cmd=2），返回 [{ serverId, serverName, serverHost, pri }]
async function fetchServerList(username) {
  const c = new W2Client({ host: CHOICE_HOST, port: CHOICE_PORT, mode: 'choice' });
  await c.connect();
  const r = await c.call(2, p.cat(
    p.str(username),
    p.str(config.platform),
    p.str(config.loginParams()?.channel || 'wst_ios_zh_002'),
    p.str(config.sso.choiceLang),
    p.str(config.sso.deviceInfo),
    p.u32(3),
    p.str(config.sso.gameVersion)
  ), {
    list: true,
    item: [
      ['serverId', 'u32'], ['serverName', 'string'], ['serverHost', 'string'], ['pri', 'u32'],
    ],
    itemTail: [['game_entry_flag', 'u8']],
  }, { okStatuses: [1] });
  c.close();
  return r;
}

// 选服登录（cmd=1）：返回声明式解析结果
async function choiceLogin(username, serverId) {
  const c = new W2Client({ host: CHOICE_HOST, port: CHOICE_PORT, mode: 'choice' });
  await c.connect();
  const r = await c.call(1, p.cat(
    p.str(username),
    p.str(config.platform),
    p.str(config.loginParams()?.channel || 'wst_ios_zh_002'),
    p.str(config.sso.choiceLang),
    p.byte(1),                        // is_self
    p.u32(serverId),
    p.str(config.sso.deviceInfo),
    p.u32(3),                         // client_tag
    p.str(config.sso.gameVersion),
    p.byte(0)                         // confirm_to_abort_abandon
  ), {
    fields: [
      ['userid', 'u64'], ['server_id', 'u32'], ['server_name', 'string'],
      ['server_host', 'string'], ['server_sort', 'u32'],
    ],
    tail: [['init_channel', 'string']],
  }, { okStatuses: [1, 2] });
  c.close();
  return r;
}

// ---------- main ----------
(async function main() {
  const identity = config.identity();

  // 第 1 步：SSO 登录（静默续登优先，失败回退账号密码）
  let sso = null;
  if (identity.WTGT) {
    console.log('检测到 WTGT 缓存，尝试静默续登…');
    sso = await silentLogin(identity.WTGT);
    if (sso) console.log('静默续登成功 ✓');
  }
  if (!sso && account && password) {
    console.log('SSO 账号密码登录…');
    sso = await fullLogin();
    if (!sso) {
      console.log('登录失败: 账号或密码错误');
      process.exit(1);
    }
    console.log('登录成功 ✓');
  }
  if (!sso) {
    console.log('缺少凭据：缓存 WTGT 已失效时请提供账号密码');
    console.log('用法: node tools/w2login.js <邮箱或账号> <密码>');
    process.exit(1);
  }

  const wst = sso.WST;
  const wtgt = sso.WTGT;
  const username = desDecrypt(sso.wistoneId);

  // 第 2 步：选服（缓存有 serverId 直接确认；无缓存/强制重选则列表交互）
  let serverId = identity.serverId;
  let serverName = identity.serverName;
  if (forceList || !serverId) {
    const list = await fetchServerList(username);
    const items = list.items || [];
    if (!items.length) {
      console.log('服务器列表为空');
      process.exit(1);
    }
    console.log('');
    console.log('可用服务器:');
    items.forEach((s, i) => {
      console.log(`  ${i + 1}. ${s.serverName}  (${s.serverHost})  pri=${s.pri}`);
    });
    const pick = parseInt(await ask('选择服务器编号 [1]: ') || '1', 10);
    const chosen = items[pick - 1];
    if (!chosen) {
      console.log('无效选择');
      process.exit(1);
    }
    serverId = chosen.serverId;
    serverName = chosen.serverName;
  }

  // 第 3 步：选服登录（换 userId + 游戏服地址）
  const r3 = await choiceLogin(username, serverId);
  if (!r3.ok) {
    console.log('选服失败: status=' + r3.status + (r3.message ? '（' + r3.message + '）' : ''));
    process.exit(1);
  }

  // 第 4 步：全部落盘
  // installID/appKey 是设备持久化指纹：
  // 首次登录无此值则生成并缓存，之后稳定复用——每次换新值会让服务端日志出现「每日换设备」的机器人特征
  if (!identity.installID) identity.installID = crypto.randomBytes(16).toString('hex').toUpperCase();
  if (!identity.appKey) identity.appKey = crypto.randomBytes(16).toString('hex');

  const host = String(r3.server_host).match(/^(.+):(\d+)$/);
  config.saveIdentity({
    ...identity,
    wst,
    WTGT: wtgt,
    username,
    userId: r3.userid.toString(),
    serverId,
    serverName: r3.server_name || serverName,
    gameHost: host ? host[1] : identity.gameHost,
    gamePort: host ? parseInt(host[2], 10) : identity.gamePort,
  });

  console.log('');
  console.log('已选服务器: ' + (r3.server_name || serverName) + '（' + r3.server_host + '）');
  console.log('userId: ' + r3.userid);
  console.log('');
  console.log('全部信息已缓存到 .identity.local.json');
  console.log('');
  console.log('下次登录只需: node tools/w2login.js（静默续登，免密码）');
})().catch((e) => {
  console.log('登录失败:', e.message);
  process.exit(1);
});
