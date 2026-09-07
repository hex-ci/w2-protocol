'use strict';
/**
 * config.js —— 配置加载（零依赖）
 * 优先级: process.env > .env > 默认值
 * 真实值放 .env（已 gitignore），.env.example 只是模板
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
  if (process.env[key]) return process.env[key];
  if (fileEnv[key]) return fileEnv[key];
  return def;
}

const config = {
  root: ROOT,
  host: get('W2_HOST', ''),
  port: parseInt(get('W2_PORT', '8083'), 10),
  phoneIp: get('W2_PHONE_IP', ''),
  iface: get('W2_IFACE', ''),
  tasks: {
    diamond: parseInt(get('W2_TASK_DIAMOND', '5042'), 10),
    subsidy: parseInt(get('W2_TASK_SUBSIDY', '307'), 10),
  },
};

/** 读取可重放帧：优先 protocol/frames.local.json（gitignore），回退 example */
config.frames = function frames() {
  const local = path.join(ROOT, 'protocol', 'frames.local.json');
  const example = path.join(ROOT, 'protocol', 'frames.example.json');
  const f = fs.existsSync(local) ? local : example;
  return JSON.parse(fs.readFileSync(f, 'utf8'));
};

module.exports = config;
