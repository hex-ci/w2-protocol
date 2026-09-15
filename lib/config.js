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
  try { fs.chmodSync(IDENTITY_FILE, 0o600); } catch { /* 保留只读缓存的可读性 */ }
  try {
    return JSON.parse(fs.readFileSync(IDENTITY_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function validPort(value, fallback) {
  const port = Number(value);
  return Number.isInteger(port) && port > 0 && port <= 65535 ? port : fallback;
}

/** 非负整数配置项；空串/非法 → null（由启动期校验报缺失） */
function toIntOrNull(value) {
  return /^\d+$/.test(String(value).trim()) ? Number(value) : null;
}

function writeIdentity(identity) {
  const tmp = `${IDENTITY_FILE}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(identity, null, 2) + '\n', { mode: 0o600 });
  fs.renameSync(tmp, IDENTITY_FILE);
  fs.chmodSync(IDENTITY_FILE, 0o600);
}

// mlogin 表单的设备标识字段集按平台不同：iOS 4 字段 / Android 4 字段（其余平台字段全空）
const DEVICE_FIELDS = {
  ios: { device_id: '', open_udid: '', advertising_id: '', for_vendor_id: '' },
  android: { android_id: '', mac_address: '', imei: '', sim_serial_number: '' },
};

const PLATFORM = get('W2_PLATFORM', 'ios');
if (!['ios', 'android'].includes(PLATFORM)) {
  throw new Error('W2_PLATFORM 只能是 ios 或 android');
}

const config = {
  root: ROOT,
  identityFile: IDENTITY_FILE,
  /** parseEnv 解析出的 .env 键值（供无 config 依赖的模块读取 .env 覆盖值） */
  fileEnv,
  phoneIp: get('W2_PHONE_IP', ''),
  iface: get('W2_IFACE', ''),
  tasks: get('W2_TASK_IDS', '').split(',').map((s) => s.trim()).filter(Boolean),
  /**
   * 活动定位（w2activity）：按协议字段筛选目标活动（activityType/activitySubType/groupId）。
   * 用 ID 而非活动名——名称随版本/月份变，ID 稳定。真值放本地 .env，仓库不留字面量。
   */
  activity: {
    type: toIntOrNull(get('W2_ACTIVITY_TYPE', '')),
    subType: toIntOrNull(get('W2_ACTIVITY_SUBTYPE', '')),
    groupId: toIntOrNull(get('W2_ACTIVITY_GROUP', '')),
  },
  /**
   * 模拟哪个客户端平台（ios|android）。
   * 缺省 ios（当前渠道账号绑定 iOS 区）。
   */
  platform: PLATFORM,
  /**
   * SSO 端点与客户端常量：客户端按渠道分发配置，端点/密钥/渠道随发布方而变，
   * **没有通用缺省值**——真值全部来自本地 .env 的 W2_SSO_*（.env 不入库）。
   * 未配置时 config 仍可加载，但 w2login 启动即由 assertSsoConfigured() 拦下并报缺失键。
   * 平台相关字段（deviceFields/lang）按 W2_PLATFORM 自动选择。
   */
  sso: {
    url: get('W2_SSO_URL', ''),
    appId: get('W2_SSO_APP_ID', ''),
    appSecret: get('W2_SSO_APP_SECRET', ''),
    securityKey: get('W2_SSO_SECURITY_KEY', ''),
    // mlogin 表单的设备标识字段集按平台不同：iOS 4 字段 / Android 4 字段（其余平台字段全空）
    deviceFields: DEVICE_FIELDS[PLATFORM] || DEVICE_FIELDS.ios,
    lang: get('W2_SSO_LANG', 'zh_CN'),
    sourceArea: get('W2_SSO_SOURCE_AREA', 'China'),
    version: get('W2_SSO_VERSION', '1.0.0'),
    choiceHost: get('W2_SSO_CHOICE_HOST', ''),
    choicePort: validPort(get('W2_SSO_CHOICE_PORT', '8081'), 8081),
    choiceLang: get('W2_SSO_CHOICE_LANG', 'zh'),
    deviceInfo: get('W2_SSO_DEVICE_INFO', 'ipad'),
    gameVersion: get('W2_SSO_GAME_VERSION', ''),
    // SSO 响应里承载账号标识的字段名（服务端下发）。名称本身含厂商词根，
    // 故不留代码缺省——真值放本地 .env，仓库里不出现该字符串。
    userIdField: get('W2_SSO_USERID_FIELD', ''),
  },
};

/**
 * SSO 配置完整性校验：端点/密钥/字段名全来自本地 .env（无代码缺省）。
 * 缺项时给出可操作的报错——不然会以「连接失败」这类模糊错误收场。
 */
// 配置项 → .env 键名（驼峰转下划线对 userIdField 这类缩写不适用，显式映射避免报错键名与
// 实际 .env 键不一致——用户照报错去配会配错）
const SSO_ENV_KEYS = {
  url: 'W2_SSO_URL',
  appId: 'W2_SSO_APP_ID',
  appSecret: 'W2_SSO_APP_SECRET',
  securityKey: 'W2_SSO_SECURITY_KEY',
  userIdField: 'W2_SSO_USERID_FIELD',
};
config.assertSsoConfigured = function assertSsoConfigured() {
  const missing = Object.keys(SSO_ENV_KEYS).filter((k) => !config.sso[k]);
  if (missing.length) {
    throw new Error(
      `SSO 配置缺失（${missing.map((k) => SSO_ENV_KEYS[k]).join(', ')}）——`
      + '请在本地 .env 补齐；键名与取值说明见 .env.example'
    );
  }
};

/**
 * 活动定位配置完整性校验（w2activity 启动期调用）。
 * 三个筛选字段（type/subType/groupId）无代码缺省，真值放本地 .env。
 */
config.assertActivityConfigured = function assertActivityConfigured() {
  const keys = {
    type: 'W2_ACTIVITY_TYPE',
    subType: 'W2_ACTIVITY_SUBTYPE',
    groupId: 'W2_ACTIVITY_GROUP',
  };
  const missing = Object.keys(keys).filter((k) => config.activity[k] === null);
  if (missing.length) {
    throw new Error(
      `活动定位配置缺失（${missing.map((k) => keys[k]).join(', ')}）——`
      + '请在本地 .env 补齐；键名与取值说明见 .env.example'
    );
  }
};

// 身份缓存读写
config.identity = readIdentity;
config.saveIdentity = writeIdentity;

// 游戏服地址：身份缓存 gameHost/gamePort（登录命令选服后落盘）> null
// 8083 是游戏服长连接的协议常量（各服统一、wire 可见，非厂商标识），故保留为缺省。
config.gameServer = function gameServer() {
  const identity = readIdentity();
  if (identity.gameHost) return { host: identity.gameHost, port: validPort(identity.gamePort, 8083) };
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
  if (
    !identity.wst || !identity.username || !identity.installID || !identity.appKey
    || !/^[1-9]\d*$/.test(String(identity.userId || ''))
  ) return null;
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
