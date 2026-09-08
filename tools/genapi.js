'use strict';

// 从客户端协议定义全量提取各命令的请求/响应字段，按业务域分文件生成 API 参考手册
// 输出面向接口调用者：字段统一 snake_case + 中文说明，成功判定折算为具体 status 值
// 用法: W2_PROTO_SRC=<客户端协议定义文件> node tools/genapi.js

const fs = require('fs');
const path = require('path');

const SRC = process.env.W2_PROTO_SRC || process.argv[2] || '';
if (!SRC) {
  console.error('用法: W2_PROTO_SRC=<客户端协议定义文件> node tools/genapi.js');
  process.exit(1);
}
const OUT_DIR = path.join(__dirname, '..', 'protocol', 'reference');

// ---------- 1. 扫描所有协议类 ----------
const src = fs.readFileSync(SRC, 'utf8');
const classes = new Map();
// 形态 A: ProtNNNN=function(e){...}；形态 B: (Broadcast)ProtNNNN=(_dec...=function(e){...}
const reA = /Prot(\d+)=function\(/g;
const reB = /Prot(\d+)=\(_dec/g;
let m;
while ((m = reA.exec(src)) !== null) {
  if (!classes.has(m[1])) classes.set(m[1], m.index);
}
while ((m = reB.exec(src)) !== null) {
  if (!classes.has(m[1])) classes.set(m[1], m.index);
}

// ---------- 2. 业务域分段 ----------
const DOMAINS = [
  { id: '00-choice',    title: '选服与渠道登录（Choice 通道）', test: n => n < 1000 },
  { id: '01-account',   title: '账号与玩家',                   test: n => n >= 1000 && n < 2000 },
  { id: '02-city',      title: '城池与资源',                   test: n => n >= 2000 && n < 3000 },
  { id: '03-army',      title: '军队与训练',                   test: n => n >= 3000 && n < 4000 },
  { id: '04-tech',      title: '科技研发',                     test: n => n >= 4000 && n < 5000 },
  { id: '05-alliance',  title: '军团',                         test: n => n >= 5000 && n < 6000 },
  { id: '06-chat',      title: '聊天',                         test: n => n >= 6000 && n < 7000 },
  { id: '07-item',      title: '道具与背包',                   test: n => n >= 8000 && n < 9000 },
  { id: '08-mail',      title: '邮件',                         test: n => n >= 9000 && n < 10000 },
  { id: '09-task',      title: '任务与奖励',                   test: n => n >= 10000 && n < 11000 },
  { id: '10-officer',   title: '名将',                         test: n => n >= 11000 && n < 12000 },
  { id: '11-shop-pay',  title: '商城与支付',                   test: n => (n >= 7000 && n < 8000) || (n >= 12000 && n < 13000) },
  { id: '12-map',       title: '地图与战报',                   test: n => n >= 15000 && n < 20000 },
  { id: '13-activity',  title: '活动',                         test: n => n >= 22000 && n < 24000 },
  { id: '14-ranking',   title: '排行榜',                       test: n => n >= 24000 && n < 25000 },
  { id: '15-battle',    title: '战斗与演习',                   test: n => (n >= 20000 && n < 22000) || (n >= 25000 && n < 26000) || (n >= 29000 && n < 30000) },
  { id: '16-notice',    title: '公告与系统',                   test: n => n >= 13000 && n < 15000 },
  { id: '17-push',      title: '服务端推送（Broadcast）',      test: n => n >= 26000 && n < 27000 },
];

// ---------- 3. 类型与命名 ----------
const TYPE_MAP = {
  readByte: 'u8', readShort: 'u16', readInt: 'u32',
  readLong: 'u64', readString: 'string', readRawString: 'raw',
};
const WTYPE_MAP = {
  Byte: 'u8', Short: 'u16', Int: 'u32',
  Long: 'u64', String: 'string', RawString: 'raw', Bytes: 'bytes',
};

// 常见缩写与词缀归一
const ABBR = {
  id: 'id', ip: 'ip', url: 'url', cd: 'cd', npc: 'npc', vip: 'vip',
  uid: 'uid', icon: 'icon', exp: 'exp', ios: 'ios', uc: 'uc',
  avata: 'avatar', techno: 'tech', officer: 'officer',
};

// 变量名 → snake_case（处理 _ 前缀、连续大写、数字边界）
function toSnake(name) {
  let s = name.replace(/^_+/, '');
  // 插入下划线：小写→大写、大写串尾→大写后跟小写、字母→数字
  s = s.replace(/([a-z0-9])([A-Z])/g, '$1_$2')
       .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
       .replace(/([a-zA-Z])(\d)/g, '$1_$2');
  s = s.toLowerCase();
  // 已有下划线去重
  s = s.replace(/_+/g, '_').replace(/^_|_$/g, '');
  // 缩写纠正
  for (const [bad, good] of Object.entries(ABBR)) {
    if (bad === good) continue;
    const re = new RegExp(`(^|_)${bad}(_|$)`, 'g');
    s = s.replace(re, `$1${good}$2`);
  }
  return s;
}

// 字段语义中文注释表：snake_case 关键词 → 说明
// 按最长关键词优先匹配
const SEMANTIC = [
  ['diamond_owned', '当前钻石数'],
  ['diamond_charged', '累计充值钻石'],
  ['active_city_id', '当前主城 ID'],
  ['city_id', '城池 ID'],
  ['city_name', '城池名称'],
  ['city_count', '城池数量'],
  ['city_img', '城池外观标识'],
  ['building_id', '建筑实例 ID'],
  ['buildingid', '建筑实例 ID'],
  ['prototype_id', '建筑原型 ID'],
  ['prototypeid', '建筑原型 ID'],
  ['position', '格位编号'],
  ['level', '等级'],
  ['remain_time', '剩余毫秒数'],
  ['finish_time', '完成时间戳'],
  ['total_time', '总耗时毫秒'],
  ['task_id', '任务 ID'],
  ['task_name', '任务名称'],
  ['task_type', '任务分类'],
  ['completed', '是否已完成'],
  ['readed', '是否已读'],
  ['item_id', '道具 ID'],
  ['item_name', '道具名称'],
  ['item', '道具'],
  ['amount', '数量'],
  ['price', '单价'],
  ['chance', '概率（万分比）'],
  ['cur_amount', '当前数量'],
  ['army_id', '兵种 ID'],
  ['training_id', '训练队列 ID'],
  ['technique_id', '科技 ID'],
  ['researching_id', '研究队列 ID'],
  ['researching', '研究'],
  ['mail_id', '邮件 ID'],
  ['mail_title', '邮件标题'],
  ['mail_type', '邮件分类'],
  ['page_num', '页码（从 0 或 1 起，随接口）'],
  ['page_size', '每页条数'],
  ['page_count', '总页数'],
  ['player_id', '玩家 ID'],
  ['player_name', '玩家名称'],
  ['nickname', '玩家昵称'],
  ['user_id', '账号 ID'],
  ['username', '账号名'],
  ['alliance_id', '军团 ID'],
  ['alliance_name', '军团名称'],
  ['alliance', '军团'],
  ['server_id', '服务器编号'],
  ['server_name', '服务器名称'],
  ['server_host', '服务器地址'],
  ['client_ver', '客户端版本整数'],
  ['client_version', '客户端版本号'],
  ['channel', '渠道名'],
  ['language', '语言代码'],
  ['app_key', '客户端应用密钥'],
  ['install_id', '设备安装 ID'],
  ['rank', '军衔等级'],
  ['ranking', '名次'],
  ['score', '积分'],
  ['fame', '声望值'],
  ['influence', '影响力'],
  ['morale', '士气值'],
  ['population', '人口数'],
  ['mayor', '驻守市长名'],
  ['x', '地图 X 坐标'],
  ['y', '地图 Y 坐标'],
  ['food_amount', '粮食储量'],
  ['food_capacity', '粮食容量'],
  ['steel_amount', '钢铁储量'],
  ['steel_capacity', '钢铁容量'],
  ['oil_amount', '石油储量'],
  ['oil_capacity', '石油容量'],
  ['mineral_amount', '稀矿储量'],
  ['mineral_capacity', '稀矿容量'],
  ['gold_amount', '黄金储量'],
  ['gold_capacity', '黄金容量'],
  ['output', '产量'],
  ['capacity', '容量上限'],
  ['chat_id', '聊天消息 ID'],
  ['chat_message', '聊天内容'],
  ['chat_time', '聊天时间戳'],
  ['chat_type', '消息类型'],
  ['attachment_flag', '是否有附件'],
  ['create_time', '创建时间戳'],
  ['start_time', '开始时间戳'],
  ['end_time', '结束时间戳'],
  ['status', '结果状态'],
  ['error_message', '错误描述'],
  ['token', '推送/会话凭据'],
  ['notice', '公告文案'],
  ['description', '描述文案'],
  ['name', '名称'],
  ['type', '类型枚举'],
  ['count', '数量/计数'],
  ['time', '时间戳（毫秒）'],
  ['level', '等级'],
  ['icon', '图标编号'],
];

function explain(field) {
  const f = field.toLowerCase();
  // 精确/前缀关键词匹配，最长优先
  const sorted = [...SEMANTIC].sort((a, b) => b[0].length - a[0].length);
  for (const [key, zh] of sorted) {
    if (f === key || f.startsWith(key + '_') || f.endsWith('_' + key) || f.includes('_' + key + '_')) {
      return zh;
    }
  }
  // 布尔推断
  if (/^(is|has|can|need)_/.test(f) || /_able$/.test(f)) return '布尔标记（0/1）';
  if (/count$|_num$|num_$/.test(f)) return '数量';
  if (/time$|_at$/.test(f)) return '时间戳（毫秒）';
  if (/^max_/.test(f)) return '上限';
  if (/^cur_/.test(f)) return '当前值';
  return '';
}

// ---------- 4. encode/decode 解析 ----------
function parseEncode(code) {
  const fields = [];
  const stmts = code.split(/[,;]/).map(s => s.trim()).filter(Boolean);
  for (const st of stmts) {
    let mm;
    if ((mm = st.match(/^this\._data\.write(\w+)\((.+)\)$/))) {
      fields.push({ op: 'write', type: mm[1], arg: mm[2].trim() });
    } else if (/^for/.test(st)) {
      fields.push({ op: 'loop', raw: st.slice(0, 150) });
    } else if (st.startsWith('if')) {
      // if(...) 内的 write 调用逐个提取（常见: if(writeInt(a),writeInt(b),cond){...}）
      const inner = st.match(/this\._data\.write(\w+)\(([^)]*)\)/g);
      if (inner) {
        for (const w of inner) {
          const wm = w.match(/write(\w+)\(([^)]*)\)/);
          fields.push({ op: 'write', type: wm[1], arg: wm[2].trim() });
        }
      } else {
        fields.push({ op: 'cond', raw: st.slice(0, 180) });
      }
    } else if (st.length && !/^var\s/.test(st)) {
      fields.push({ op: 'expr', raw: st.slice(0, 150) });
    }
  }
  return fields;
}

function parseDecode(code) {
  const fields = [];
  const flat = code.replace(/\s+/g, ' ');
  const reAssign = /(?:\w+)\.(\w+)=e\.(read\w+)\(([^)]*)\)/g;
  let mm;
  while ((mm = reAssign.exec(flat)) !== null) {
    fields.push({ field: mm[1], type: mm[2], arg: mm[3].trim() });
  }
  return { fields, flat };
}

// ---------- 5. 成功判定折算 ----------
function successStatuses(succ) {
  if (!succ) return [1]; // 默认 status=1 成功
  const vals = [];
  const re = /(\d+)==this\.status\(\)|this\.status\(\)==(\d+)/g;
  let mm;
  while ((mm = re.exec(succ)) !== null) vals.push(Number(mm[1] || mm[2]));
  if (!vals.length && /1==/.test(succ)) vals.push(1);
  return vals.length ? vals.sort((a, b) => a - b) : [1];
}
function succText(succ) {
  const vals = successStatuses(succ);
  return 'status 为 ' + vals.map(v => `**${v}**`).join(' 或 ') + ' 时成功';
}

// ---------- 6. 条目渲染 ----------
function findClass(num) {
  // 两种定义形态：ProtNNNN=function(e){...} 与 装饰器形态 BroadcastProtNNNN=(_dec=ccclass(...)
  return classes.get(num) !== undefined
    ? { start: classes.get(num), seg: src.slice(classes.get(num), classes.get(num) + 16000) }
    : null;
}

function extract(num) {
  // 形态 A：ProtNNNN=function(e){function t(){...}
  const start0 = classes.get(num);
  const seg0 = src.slice(start0, start0 + 16000);
  const blockEnd0 = seg0.indexOf('_RF.pop()', seg0.indexOf('_RF.push('));
  const block0 = seg0.slice(0, blockEnd0 > 0 ? blockEnd0 : 3000);
  const hasBody = /protId=function/.test(block0) || /encode=function/.test(block0) || /decode=function/.test(block0);
  if (!hasBody) {
    // 形态 B：装饰器类（BroadcastProtNNNN=(_dec...=function(e){...}）
    const am = new RegExp('(Broadcast)?Prot' + num + '=\\(_dec').exec(src);
    if (am) {
      const seg = src.slice(am.index, am.index + 8000);
      const pid = seg.match(/protId=function\(\)\{return Constant\.([A-Z_0-9]+)/);
      const decM = seg.match(/decode=function\(e\)\{([\s\S]*?)\},i\.success=/s);
      return { num, pid: pid ? pid[1] : null, enc: '', dec: decM ? decM[1] : '', succ: null, deco: true };
    }
    // 空壳继承类：无 protId/encode/decode，无装饰器定义，服务端不单独寻址 → 跳过
    return { num, pid: null, enc: '', dec: '', succ: null, ghost: true };
  }
  const seg = seg0;
  const pid = seg.match(/protId=function\(\)\{return Constant\.([A-Z_0-9]+)/);
  const encM = seg.match(/encode=function\(\)\{([\s\S]*?)\},i\.(?:decode|success|protId|handle0)=/s);
  const decM = seg.match(/decode=function\(e\)\{([\s\S]*?)\},i\.(?:success|isBroadcast|handle0|abandonData)\b/s)
            || seg.match(/decode=function\(e\)\{([\s\S]*?)\},t\}/s);
  const succM = seg.match(/success=function\(\)\{return([^}]+)\}/);
  return { num, pid: pid ? pid[1] : null, enc: encM ? encM[1] : '', dec: decM ? decM[1] : '', succ: succM ? succM[1].trim() : null };
}

// 接口英文名 → 中文接口名（与 commands.json names 同源）
const NAME_ZH = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'protocol', 'commands.json'), 'utf8')).names;

function renderEntry(e) {
  const L = [];
  const isPush = /isBroadcast=function\(\)\{return!0\}/.test(e.dec) || Number(e.num) >= 26000;
  const zhName = NAME_ZH[e.num] || (e.pid ? e.pid.replace(/^PROT_/, '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : '未命名');
  L.push(`### \`cmd=${e.num}\` — ${zhName}${isPush ? '（服务端推送）' : ''}`);
  L.push('');
  if (e.captureOnly) {
    L.push('> 此命令在客户端协议定义中无对应类（iOS 客户端独有或版本差异），请求/响应结构以抓包实据为准，字段语义待解。');
    L.push('');
  }

  // 请求
  if (e.enc.trim()) {
    const fields = parseEncode(e.enc);
    const real = fields.filter(f => f.op === 'write' || f.op === 'loop' || f.op === 'cond');
    if (real.length) {
      L.push('**请求参数**（按序拼接为 AES 明文）:');
      L.push('');
      L.push('| 顺序 | 类型 | 字段 | 说明 |');
      L.push('|---|---|---|---|');
      let i = 0;
      for (const f of fields) {
        if (f.op === 'write') {
          const snake = toSnake(f.arg.replace(/^this\./, '').replace(/^this\._/, ''));
          L.push(`| ${++i} | ${WTYPE_MAP[f.type] || f.type} | \`${snake}\` | ${explain(snake) || '—'} |`);
        } else if (f.op === 'loop') {
          L.push(`| ${++i} | 循环 | — | 按前导计数字段循环写入后续字段 |`);
        } else if (f.op === 'cond') {
          L.push(`| ? | 条件 | — | 满足条件时写入：\`${f.raw}\` |`);
        }
      }
      L.push('');
    } else {
      L.push('**请求参数**: 无（明文 0 字节）');
      L.push('');
    }
  } else {
    L.push('**请求参数**: 无');
    L.push('');
  }

  // 响应
  const succLine = succText(e.succ);
  if (e.dec.trim()) {
    const { fields, flat } = parseDecode(e.dec);
    const isList = /new \w+info/i.test(flat) || /for\(var \w+=e\.readInt\(\)/.test(flat);
    if (fields.length) {
      L.push(`**响应**（${succLine}；失败时仅 1 字节状态 + 错误文案字符串）:`);
      L.push('');
      if (isList) {
        L.push('> 含列表：先读计数字段，再按下列顺序循环读取每个条目。');
        L.push('');
      }
      L.push('| 顺序 | 类型 | 字段 | 说明 |');
      L.push('|---|---|---|---|');
      fields.forEach((f, i) => {
        const snake = toSnake(f.field);
        L.push(`| ${i + 1} | ${TYPE_MAP[f.type] || f.type} | \`${snake}\` | ${explain(snake) || '—'} |`);
      });
      L.push('');
    } else {
      L.push(`**响应**: 无业务数据。${succLine}；失败时为状态字节 + 错误文案。`);
      L.push('');
    }
  } else {
    L.push(`**响应**: 无业务数据。${succLine}；失败时为状态字节 + 错误文案。`);
    L.push('');
  }
  return L.join('\n');
}

// ---------- 7. 分域输出 ----------
fs.mkdirSync(OUT_DIR, { recursive: true });
const entries = [...classes.keys()].sort((a, b) => Number(a) - Number(b)).map(extract).filter(e => !e.ghost);

const indexLines = ['# W2 接口参考手册 · 索引', '',
  '> 全量 ' + entries.length + ' 个命令，按业务域分文件。字段名为 snake_case 规范命名，附中文说明。', '',
  '> 如何组装请求、判断成功失败见 [API.md](../API.md)；帧格式与加密见 [NOTES.md](NOTES.md)。', '',
  '| 文件 | 业务域 | 命令数 | cmd 范围 |', '|---|---|---|---|'];

let totalRendered = 0;
for (const dom of DOMAINS) {
  const list = entries.filter(e => dom.test(Number(e.num)));
  // names 中已收录但 H5 无类定义的命令（iOS 抓包独有），补占位条目
  for (const [k, zh] of Object.entries(NAME_ZH)) {
    const n = Number(k);
    if (dom.test(n) && !entries.some(e => e.num === k) && !list.some(e => e.num === k)) {
      list.push({ num: k, pid: null, enc: '', dec: '', succ: null, captureOnly: true });
    }
  }
  list.sort((a, b) => Number(a.num) - Number(b.num));
  if (!list.length) continue;
  const file = path.join(OUT_DIR, dom.id + '.md');
  const rel = dom.id + '.md';
  const buf = [`# ${dom.title}`, '', `> ${list.length} 个命令（cmd ${list[0].num} ~ ${list[list.length - 1].num}）。所有响应均以 1 字节 status 打头，成功值见各条目。`, ''];
  const bodies = list.map(renderEntry);
  buf.push(bodies.join('\n---\n\n'));
  fs.writeFileSync(file, buf.join('\n'));
  indexLines.push(`| [${rel}](${rel}) | ${dom.title} | ${list.length} | ${list[0].num} ~ ${list[list.length - 1].num} |`);
  totalRendered += list.length;
}

// 未归组
const ungrouped = entries.filter(e => !DOMAINS.some(d => d.test(Number(e.num))));
if (ungrouped.length) {
  const file = path.join(OUT_DIR, '99-ungrouped.md');
  const buf = ['# 未归类命令', '', `> ${ungrouped.length} 个（未匹配到业务域）`, ''];
  buf.push(ungrouped.map(renderEntry).join('\n---\n\n'));
  fs.writeFileSync(file, buf.join('\n'));
  indexLines.push(`| [99-ungrouped.md](99-ungrouped.md) | 未归类 | ${ungrouped.length} | ${ungrouped.map(e => e.num).join(', ')} |`);
  totalRendered += ungrouped.length;
}

indexLines.push('', `> 共 ${totalRendered} 个命令（另有继承空壳类不计入）。`);
fs.writeFileSync(path.join(OUT_DIR, 'README.md'), indexLines.join('\n') + '\n');
console.log(`已生成 ${DOMAINS.filter(d => entries.some(e => d.test(Number(e.num)))).length + (ungrouped.length ? 1 : 0)} + 1(索引) 个文件，共 ${totalRendered} 个命令`);
const missingNames = entries.filter(e => !NAME_ZH[e.num]).length;
console.log(`手册条目: ${totalRendered}，names 字典: ${Object.keys(NAME_ZH).length}，差集: ${Math.abs(totalRendered - Object.keys(NAME_ZH).length)}`);
