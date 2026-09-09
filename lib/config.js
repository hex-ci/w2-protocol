/**
 * config.js —— 配置加载
 * 优先级: process.env > .env > 默认值
 *
 * 凭据与服务器信息存 .identity.local.json：
 *   wst/username/userId/serverId/serverName/gameHost/gamePort/WTGT/installID/appKey
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

function parseEnv(file) {
  const out = {};
  if (!fs.existsSync(file)) return out;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    v = v.replace(/^['"]|['"]$/g, '');
    if (v) out[m[1]] = v;
  }
  return out;
}

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fileEnv = parseEnv(path.join(ROOT, '.env'));
function get(key, def) {
  if (process.env[key] != null && process.env[key] !== '') return process.env[key];
  if (fileEnv[key]) return fileEnv[key];
  return def;
}

// 身份缓存文件（.identity.local.json，gitignore）：
// 登录命令把服务端下发的凭据与服务器信息落盘于此，
// 业务脚本只读该文件即可运行
const IDENTITY_FILE = path.join(ROOT, '.identity.local.json');

function readIdentity() {
  if (!fs.existsSync(IDENTITY_FILE)) return {};
  try { return JSON.parse(fs.readFileSync(IDENTITY_FILE, 'utf8')); } catch { return {}; }
}

function writeIdentity(identity) {
  fs.writeFileSync(IDENTITY_FILE, JSON.stringify(identity, null, 2) + '\n');
}

// mlogin 表单的设备标识字段集按平台不同：iOS 4 字段 / Android 4 字段（其余平台字段全空）
const DEVICE_FIELDS = {
  ios: { device_id: '', open_udid: '', advertising_id: '', for_vendor_id: '' },
  android: { android_id: '', mac_address: '', imei: '', sim_serial_number: '' },
};

const PLATFORM = get('W2_PLATFORM', 'ios');

const config = {
  root: ROOT,
  identityFile: IDENTITY_FILE,
  /** parseEnv 解析出的 .env 键值（供无 config 依赖的模块读取 .env 覆盖值） */
  fileEnv,
  phoneIp: get('W2_PHONE_IP', ''),
  iface: get('W2_IFACE', ''),
  tasks: get('W2_TASK_IDS', '').split(',').map((s) => s.trim()).filter(Boolean),
  /**
   * 模拟哪个客户端平台（ios|android）。
   * 缺省 ios（当前渠道账号绑定 iOS 区）。
   */
  platform: PLATFORM,
  /**
   * SSO 端点与客户端内置常量：客户端按渠道分发配置，不同渠道可能不同。
   * 平台相关字段（deviceFields/lang）按 W2_PLATFORM 自动选择；
   * 其余缺省值为 iOS 渠道客户端真值，换渠道时在 .env 覆盖。
   */
  sso: {
    url: get('W2_SSO_URL', 'http://sso.wistone.com/wistoneSSO/'),
    appId: get('W2_SSO_APP_ID', '4939622735'),
    appSecret: get('W2_SSO_APP_SECRET', 'a4ab2ae6030541212ecb6773b505471d833b8c75e5756de0'),
    securityKey: get('W2_SSO_SECURITY_KEY', '2644894d08a9c3b784993006ea980cfd'),
    // mlogin 表单的设备标识字段集按平台不同：iOS 4 字段 / Android 4 字段（其余平台字段全空）
    deviceFields: DEVICE_FIELDS[PLATFORM] || DEVICE_FIELDS.ios,
    lang: get('W2_SSO_LANG', 'zh_CN'),
    sourceArea: get('W2_SSO_SOURCE_AREA', 'China'),
    version: get('W2_SSO_VERSION', '1.0.2'),
    choiceHost: get('W2_SSO_CHOICE_HOST', 'w2vcn_G.ios.wistone.com'),
    choicePort: parseInt(get('W2_SSO_CHOICE_PORT', '8081'), 10),
    choiceLang: get('W2_SSO_CHOICE_LANG', 'zh'),
    deviceInfo: get('W2_SSO_DEVICE_INFO', 'ipad'),
    gameVersion: get('W2_SSO_GAME_VERSION', '3.3.69'),
  },
};

// 身份缓存读写
config.identity = readIdentity;
config.saveIdentity = writeIdentity;

// 游戏服地址：身份缓存 gameHost/gamePort（登录命令选服后落盘）> null
config.gameServer = function gameServer() {
  const identity = readIdentity();
  if (identity.gameHost) return { host: identity.gameHost, port: identity.gamePort || 8083 };
  return null;
};

/**
 * 登录凭据组装：全部读身份缓存。
 * platform/clientType 统一由 config.platform 派生；channel/language/clientVer 从 .env 覆盖，
 * 缺省用 SDK 内置 iOS 真值。
 * @returns {object|null} 可直接传给 W2Client 的 loginParams；缓存无 wst 时 null
 */
config.loginParams = function loginParams() {
  const identity = readIdentity();
  if (!identity.wst) return null;
  return {
    userId: identity.userId || '',
    username: identity.username || '',
    wst: identity.wst,
    installID: identity.installID,
    appKey: identity.appKey,
    platform: config.platform,
    channel: get('W2_LOGIN_CHANNEL', ''),
    language: get('W2_LOGIN_LANGUAGE', ''),
    clientVer: get('W2_LOGIN_CLIENT_VER', ''),
    clientType: config.platform,
  };
};

export default config;
