'use strict';

// 从客户端协议定义全量提取各命令的请求/响应字段，按业务域分文件生成 API 参考手册
// 用法: node tools/genapi.js [协议定义文件路径]（缺省读环境变量 W2_PROTO_SRC）

const fs = require('fs');
const path = require('path');

const SRC = process.env.W2_PROTO_SRC || process.argv[2] || '';
if (!SRC) {
  console.error('用法: W2_PROTO_SRC=<客户端协议定义文件> node tools/genapi.js');
  process.exit(1);
}
const OUT_DIR = path.join(__dirname, '..', 'protocol', 'reference');

// ---------- 1. 扫描所有 Prot 类 ----------
const src = fs.readFileSync(SRC, 'utf8');
const classes = new Map();
const re = /Prot(\d+)=function\(/g;
let m;
while ((m = re.exec(src)) !== null) {
  const num = m[1];
  if (!classes.has(num)) classes.set(num, m.index);
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
  { id: '13-activity',  title: '活动',                         test: n => (n >= 22000 && n < 24000) },
  { id: '14-ranking',   title: '排行榜',                       test: n => n >= 24000 && n < 25000 },
  { id: '15-battle',    title: '战斗与演习',                   test: n => (n >= 20000 && n < 22000) || (n >= 25000 && n < 26000) || (n >= 29000 && n < 30000) },
  { id: '16-notice',    title: '公告与系统',                   test: n => n >= 13000 && n < 15000 },
  { id: '17-push',      title: '服务端推送（Broadcast）',      test: n => n >= 26000 && n < 27000 },
];

// ---------- 3. 代码翻译 ----------
const TYPE_MAP = {
  readByte: 'byte', readShort: 'short', readInt: 'int',
  readLong: 'long', readString: 'string', readRawString: 'raw',
};
const WTYPE_MAP = {
  Byte: 'byte', Short: 'short', Int: 'int',
  Long: 'long', String: 'string', RawString: 'raw', Bytes: 'bytes',
};

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
      fields.push({ op: 'cond', raw: st.slice(0, 180) });
    } else if (st.length && !/^var\s/.test(st)) {
      fields.push({ op: 'expr', raw: st.slice(0, 150) });
    }
  }
  return fields;
}

function parseDecode(code) {
  const fields = [];
  const flat = code.replace(/\s+/g, ' ');
  // 匹配所有 obj.field=e.readXxx() 形式（this./t./循环变量 i 等前缀一律接受）
  const reAssign = /(?:\w+)\.(\w+)=e\.(read\w+)\(([^)]*)\)/g;
  let mm;
  while ((mm = reAssign.exec(flat)) !== null) {
    fields.push({ field: mm[1], type: mm[2], arg: mm[3].trim() });
  }
  return { fields, flat };
}

// 检测 decode 中的内联对象结构（数组元素字段）
function inlineStructs(flat) {
  const out = [];
  const re = /\{(\w+):[^{}]{0,40},(\w+):[^{}]{0,40}/g;
  let mm;
  while ((mm = re.exec(flat)) !== null) {
    out.push(mm[1]);
  }
  return [...new Set(out)].slice(0, 12);
}

// ---------- 4. 提取每个类 ----------
function extract(num) {
  const start = classes.get(num);
  const seg = src.slice(start, start + 16000);
  const pid = seg.match(/protId=function\(\)\{return Constant\.([A-Z_0-9]+)/);
  const encM = seg.match(/encode=function\(\)\{([\s\S]*?)\},i\.decode=/s)
            || seg.match(/encode=function\(\)\{([\s\S]*?)\},i\.protId=/s);
  const decM = seg.match(/decode=function\(e\)\{([\s\S]*?)\},i\.(?:success|isBroadcast|handle0|abandonData)\b/s)
            || seg.match(/decode=function\(e\)\{([\s\S]*?)\},t\}/s);
  const reqM = seg.match(/request(\w+)\(([^)]*)\)\s*\{(?:this\.|void 0)/);
  const succM = seg.match(/success=function\(\)\{return([^}]+)\}/);
  return { num, pid: pid ? pid[1] : null, enc: encM ? encM[1] : '', dec: decM ? decM[1] : '', req: reqM, succ: succM ? succM[1].trim() : null };
}

function renderEntry(e) {
  const L = [];
  const name = e.pid ? e.pid.replace(/^PROT_/, '').replace(/_/g, ' ').toLowerCase() : '未命名';
  const isPush = e.dec.includes('isBroadcast=function(){return!0}') || Number(e.num) >= 26000;
  L.push(`#### \`cmd=${e.num}\` — ${name}${isPush ? ' ｜ 推送' : ''}`);
  L.push('');
  if (e.pid) L.push(`- 常量: \`Constant.${e.pid}\``);
  if (e.req) L.push(`- 客户端触发: \`request${e.req[1]}(${e.req[2]})\``);
  if (e.succ && e.succ !== '1==this.status()') L.push(`- 成功判定: \`status${e.succ.replace(/==/g, '=')}\``);
  L.push('');

  // encode
  if (e.enc.trim()) {
    const fields = parseEncode(e.enc);
    const real = fields.filter(f => f.op === 'write' || f.op === 'loop' || f.op === 'cond');
    if (real.length) {
      L.push('**请求参数**（按序列化顺序）:');
      L.push('');
      L.push('| # | 类型 | 字段 / 表达式 |');
      L.push('|---|---|---|');
      let i = 0;
      for (const f of fields) {
        if (f.op === 'write') L.push(`| ${++i} | ${WTYPE_MAP[f.type] || f.type} | \`${f.arg}\` |`);
        else if (f.op === 'loop') L.push(`| … | 循环 | \`${f.raw}\` |`);
        else if (f.op === 'cond') L.push(`| ? | 条件 | \`${f.raw}\` |`);
      }
      L.push('');
    } else {
      L.push('**请求参数**: 无（空参命令，AES 明文 0 字节，密文恒为 16B 填充块）');
      L.push('');
    }
  } else {
    L.push('**请求参数**: 无（类未定义 encode）');
    L.push('');
  }

  // decode
  if (e.dec.trim()) {
    const { fields, flat } = parseDecode(e.dec);
    if (fields.length) {
      // 检测是否在数组循环内（出现 new XxxInfo 类实例化即视为列表条目）
      const isList = /new \w+info/i.test(flat) || /for\(var \w+=e\.readInt\(\)/.test(flat);
      L.push(isPush ? '**推送数据**（按序读取）:' : '**响应字段**（`status` 成功分支后按序读取）:');
      L.push('');
      if (isList) L.push('> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：');
      if (isList) L.push('');
      L.push('| # | 类型 | 字段 |');
      L.push('|---|---|---|');
      fields.forEach((f, i) => {
        L.push(`| ${i + 1} | ${TYPE_MAP[f.type] || f.type}${f.arg ? `（${f.arg}）` : ''} | \`${f.field}\` |`);
      });
      L.push('');
    } else {
      L.push('**响应字段**: 空（仅 `status` 字节，纯操作命令）');
      L.push('');
    }
  } else {
    L.push('**响应字段**: 空（类未定义 decode，仅 `status` 字节）');
    L.push('');
  }
  return L.join('\n');
}

// ---------- 5. 分域输出 ----------
fs.mkdirSync(OUT_DIR, { recursive: true });
const entries = [...classes.keys()].sort((a, b) => Number(a) - Number(b)).map(extract);

const indexLines = ['# W2 接口参考手册 · 索引', '', '> 全量 ' + entries.length + ' 个命令，按业务域分文件。字段名与客户端协议定义一一对应。', '',
  '> 编码规则、status 语义、会话约束、调用示例见 [API.md](../API.md)；帧格式与加密见 [NOTES.md](NOTES.md)。', '',
  '| 文件 | 业务域 | 命令数 | cmd 范围 |', '|---|---|---|---|'];

let totalRendered = 0;
for (const dom of DOMAINS) {
  const list = entries.filter(e => dom.test(Number(e.num)));
  if (!list.length) continue;
  const file = path.join(OUT_DIR, dom.id + '.md');
  const rel = dom.id + '.md';
  const buf = [`# ${dom.title}`, '', `> ${list.length} 个命令（cmd ${list[0].num} ~ ${list[list.length - 1].num}）`, ''];
  for (const e of list) {
    buf.push(renderEntry(e));
    buf.push('---');
    buf.push('');
  }
  fs.writeFileSync(file, buf.join('\n'));
  indexLines.push(`| [${rel}](${rel}) | ${dom.title} | ${list.length} | ${list[0].num} ~ ${list[list.length - 1].num} |`);
  totalRendered += list.length;
}

// 未归组
const ungrouped = entries.filter(e => !DOMAINS.some(d => d.test(Number(e.num))));
if (ungrouped.length) {
  const file = path.join(OUT_DIR, '99-ungrouped.md');
  const buf = ['# 未归类命令', '', `> ${ungrouped.length} 个（提取器未匹配到业务域，多为新段位或特殊协议）`, ''];
  for (const e of ungrouped) { buf.push(renderEntry(e)); buf.push('---'); buf.push(''); }
  fs.writeFileSync(file, buf.join('\n'));
  indexLines.push(`| [99-ungrouped.md](99-ungrouped.md) | 未归类 | ${ungrouped.length} | ${ungrouped.map(e => e.num).join(', ')} |`);
  totalRendered += ungrouped.length;
}

indexLines.push('', `> 共 ${totalRendered} 个命令，与客户端协议定义总数一致。`);
fs.writeFileSync(path.join(OUT_DIR, 'README.md'), indexLines.join('\n') + '\n');
console.log(`已生成 ${DOMAINS.filter(d => entries.some(e => d.test(Number(e.num)))).length + (ungrouped.length ? 1 : 0)} + 1(索引) 个文件，共 ${totalRendered} 个命令`);
