'use strict';

/**
 * config.js —— 配置加载（零依赖）
 * 优先级: process.env > .env > 默认值
 * 真实值放 .env（已 gitignore），.env.example 只是模板
 *
 * 登录凭据（W2_LOGIN_*）从旧登录帧解密提取一次后填入 .env，
 * 提取方法见 protocol/API.md「凭据提取」。
 */

const fs = require('fs');
const path = require('path');

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

const ROOT = path.resolve(__dirname, '..');
const fileEnv = parseEnv(path.join(ROOT, '.env'));
function get(key, def) {
  if (process.env[key] != null && process.env[key] !== '') return process.env[key];
  if (fileEnv[key]) return fileEnv[key];
  return def;
}

const config = {
  root: ROOT,
  host: get('W2_HOST', ''),
  port: parseInt(get('W2_PORT', '8083'), 10),
  phoneIp: get('W2_PHONE_IP', ''),
  iface: get('W2_IFACE', ''),
  tasks: get('W2_TASK_IDS', '').split(',').map((s) => s.trim()).filter(Boolean),
};

/**
 * 登录凭据（W2_LOGIN_* 环境变量组装）。
 * 只有 wst 是硬性必需（服务端校验的 SSO token），其余缺省时用安全默认值。
 * platform/channel/language/clientVer 缺省用 SDK 内置的 iOS 真机值，Android 区账号需显式配置。
 * clientType 决定 sessionId 分配策略：ios=从 100001 递增（iOS 客户端行为）；
 * android=0~2^31-1 全域随机（Android 客户端行为，parseInt(2147483647*Math.random())）。
 * @returns {object|null} 可直接传给 W2Client 的 loginParams；未配置时 null
 */
config.loginParams = function loginParams() {
  const wst = get('W2_LOGIN_WST', '');
  if (!wst) return null;
  return {
    userId: get('W2_LOGIN_USERID', ''),
    username: get('W2_LOGIN_USERNAME', ''),
    wst,
    installID: get('W2_LOGIN_INSTALLID', ''),
    appKey: get('W2_LOGIN_APPKEY', ''),
    platform: get('W2_LOGIN_PLATFORM', ''),
    channel: get('W2_LOGIN_CHANNEL', ''),
    language: get('W2_LOGIN_LANGUAGE', ''),
    clientVer: get('W2_LOGIN_CLIENT_VER', ''),
    clientType: get('W2_CLIENT_TYPE', 'ios'),
  };
};

module.exports = config;
