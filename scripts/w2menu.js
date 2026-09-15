#!/usr/bin/env node

/**
 * w2menu.js —— 交互式脚本引导菜单
 *
 * 列出全部业务脚本（中文名 + 用途），选中后把终端交给该脚本运行，退出后回到菜单。
 * 仅做启动编排，不接触协议与网络：子进程 stdio 继承。交接前必须卸载 Ink 界面、
 * 子进程退出后重新挂载——否则 Ink 占着 TTY（raw mode），子进程读不到按键。
 *
 * 菜单项的 dryable 为真时，可用 d 键统一附加 --dry（模拟运行，不发请求）。
 *
 * 用法:
 *   node scripts/w2menu.js            进入引导菜单
 *   node scripts/w2menu.js --list     只打印脚本清单（非 TTY / 脚本化场景）
 */

import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import config from '../lib/config.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// 脚本清单：分组 → 项。dryable = 支持 --dry；needsInput = 需在菜单内先收参数。
const GROUPS = [
  {
    title: '登录与凭据',
    items: [
      { key: 'login', label: '重新登录', script: 'w2login.js', desc: 'SSO 登录 + 选服，凭据写入 .identity.local.json' },
    ],
  },
  {
    title: '日常领取',
    items: [
      { key: 'signin', label: '每日任务领取', script: 'w2signin.js', desc: '按 .env 任务清单逐个领取，汇报钻石变化', dryable: true },
      { key: 'reward', label: '邮件奖励领取', script: 'w2reward.js', desc: '扫描带附件邮件并逐封领取', dryable: true },
      { key: 'activity', label: '活动奖励领取', script: 'w2activity.js', desc: '每日 + 月度活动的已达标档位，纯领取无消耗', dryable: true },
    ],
  },
  {
    title: '运营调度',
    items: [
      { key: 'train', label: '全域造兵', script: 'w2train.js', desc: '各城军工厂训练侦察机（资源与人口允许的最大量）', dryable: true },
      { key: 'transport', label: '资源智能调度', script: 'w2transport.js', desc: '补底仓线 + 超容归集两阶段自动运输', dryable: true },
      { key: 'ship', label: '定向运输', script: 'w2ship.js', desc: '交互式手动单笔调度（含超容外运视图）', dryable: true },
    ],
  },
  {
    title: '查看与诊断',
    items: [
      { key: 'status', label: '全域资产总览', script: 'w2status.js', desc: '各城资源 / 仓储 / 驻军 / 军工状态与诊断' },
      { key: 'watch', label: '协议嗅探', script: 'w2watch.js', desc: '拉起 tcpdump 实时抓包（设备 IP 取 .env）' },
      { key: 'probe', label: '发帧探测', script: 'w2probe.js', desc: '登录后依次发送十六进制帧看响应', needsInput: true, inputHint: '十六进制帧，多个用空格分隔' },
    ],
  },
];

/** 组装子进程参数：需参数的项把输入追加为位置参数，dryable 项追加 --dry。 */
function buildArgs(item, { dry = false, input = '' } = {}) {
  const args = [path.join(ROOT, 'scripts', item.script)];
  if (item.needsInput) {
    args.push(...String(input || '').trim().split(/\s+/).filter(Boolean));
  }
  if (dry && item.dryable) args.push('--dry');
  return args;
}

/** 菜单顶栏的登录态摘要（不展示服务器地址等身份信息）。 */
function loginState() {
  return { logged: !!config.loginParams() };
}

function printList() {
  for (const g of GROUPS) {
    console.log(`\n${g.title}`);
    for (const it of g.items) {
      const flag = [it.dryable && '支持 --dry', it.needsInput && '需参数'].filter(Boolean).join(' · ');
      console.log(`  ${it.label}  →  ${it.script}${flag ? `  [${flag}]` : ''}`);
      console.log(`      ${it.desc}`);
    }
  }
  console.log('');
}

// ---------- 入口 ----------
const argv = process.argv.slice(2);
if (argv.includes('--list')) {
  printList();
  process.exit(0);
}

// Ink 仅在真正进菜单时加载：--list 等非 TTY 场景不需要 React 运行时
const [React, { render, Box, Text, useInput, useApp }, htm, { TextInput }] = await Promise.all([
  import('react').then((m) => m.default),
  import('ink'),
  import('htm').then((m) => m.default),
  import('@inkjs/ui'),
]);

const html = htm.bind(React.createElement);

// 视觉序：分组标题与选项各占一行，光标在该序上步进
const ROWS = GROUPS.flatMap((g) => [
  { type: 'title', title: g.title },
  ...g.items.map((item) => ({ type: 'item', item })),
]);
const ITEM_IDX = ROWS.map((r, i) => (r.type === 'item' ? i : -1)).filter((i) => i >= 0);

// 交接编排在组件外：卸载 → spawn → 退出后重挂
let instance = null;
function mount() {
  instance = render(html`<${App} />`);
}
// 清屏：子进程输出留在终端历史上会与重挂的菜单错位
const clearScreen = () => process.stdout.write('\x1b[2J\x1b[H');

/**
 * 让出 stdin 给子进程。
 * Ink 的 useInput 会把 process.stdin 切到 flowing（resume）状态读取按键；unmount 只摘监听器，
 * 流本身仍是 flowing —— 父进程会继续把共享 pty 上的字节读走并丢弃，子进程一个按键都收不到。
 * 因此必须显式 pause（并等监听器摘完），spawn 出去的子进程才能读到输入。
 */
async function releaseStdin(timeoutMs = 1000) {
  process.stdin.pause();
  const t0 = Date.now();
  const count = () => process.stdin.listenerCount('data') + process.stdin.listenerCount('keypress');
  while (Date.now() - t0 < timeoutMs && count() > 0) {
    await new Promise((r) => setTimeout(r, 10));
  }
}

async function handoff(item, { dry, input }) {
  const args = buildArgs(item, { dry, input });
  instance.unmount(); // 关键：先还原 TTY，子进程才能读到按键
  await releaseStdin();
  clearScreen();
  const child = spawn(process.execPath, args, { stdio: 'inherit', cwd: ROOT });
  const done = (code) => {
    console.log(`\n──── ${item.label} 已退出（退出码 ${code}）────\n`);
    uiState.last = { label: item.label, code };
    mount(); // 菜单重挂在输出下方，子进程输出保留在上方可回滚查看
  };
  child.on('exit', done);
  child.on('error', (err) => {
    console.log(`\n──── ${item.label} 启动失败：${err.message} ────\n`);
    uiState.last = { label: item.label, code: -1 };
    mount();
  });
}

// 跨交接保留的 UI 状态（挂载时读入、变更时写回）
const uiState = { cursor: ITEM_IDX[0], dry: false, last: null };

function Row({ item, selected, dry }) {
  const tag = dry && item.dryable ? '  [--dry]' : '';
  return html`<${Text} inverse=${selected}>${selected ? '▸ ' : '  '}${item.label}${tag}<//>`;
}

function InputPanel({ item, onChange, onSubmit }) {
  return html`<${Box} flexDirection="column" marginTop=${1}>
    <${Text} color="yellow">「${item.label}」 ${item.inputHint}<//>
    <${Box}>
      <${Text} color="cyan">输入: <//>
      <${TextInput} placeholder="例: 0102ff" onChange=${onChange} onSubmit=${onSubmit} />
    <//>
    <${Text} dimColor>Enter 运行 · Esc 取消<//>
  <//>`;
}

function App() {
  const { exit } = useApp();
  const [cursor, setCursor] = React.useState(uiState.cursor);
  const [dry, setDry] = React.useState(uiState.dry);
  const [pending, setPending] = React.useState(null); // needsInput 的待输入项
  const [input, setInput] = React.useState('');
  const [msg, setMsg] = React.useState(null);
  const last = uiState.last;

  const move = (dir) => {
    const pos = ITEM_IDX.indexOf(cursor);
    const next = ITEM_IDX[Math.min(ITEM_IDX.length - 1, Math.max(0, pos + dir))];
    uiState.cursor = next;
    setCursor(next);
  };

  const submit = () => {
    const item = pending;
    const value = input.trim();
    if (!value) { setMsg(`「${item.label}」需要参数：${item.inputHint}`); return; }
    if (!/^[0-9a-fA-F\s]+$/.test(value)) { setMsg('输入含非十六进制字符，请检查（仅 0-9 a-f，多个用空格分隔）'); return; }
    setPending(null);
    setInput('');
    setMsg(null);
    handoff(item, { dry, input: value });
  };

  useInput((ch, key) => {
    // 输入态：只接管 Esc 取消，其余按键留给 TextInput（Ink 的 useInput 不阻断传播）
    if (pending) {
      if (key.escape) { setPending(null); setInput(''); setMsg(null); }
      return;
    }
    if (ch === 'q' || (key.ctrl && ch === 'c')) { exit(); return; }
    if (key.upArrow) move(-1);
    else if (key.downArrow) move(1);
    else if (ch === 'd') { uiState.dry = !uiState.dry; setDry(uiState.dry); setMsg(null); }
    else if (key.return) {
      const row = ROWS[cursor];
      if (!row || row.type !== 'item') return;
      const item = row.item;
      if (item.needsInput) { setPending(item); setInput(''); setMsg(null); }
      else handoff(item, { dry, input: '' });
    }
  });

  const st = loginState();
  const cur = ROWS[cursor]?.type === 'item' ? ROWS[cursor].item : null;

  return html`<${Box} flexDirection="column">
    <${Box} borderStyle="round" borderColor="cyan" paddingX=${1} flexDirection="column">
      <${Text} bold color="cyan">脚本引导菜单<//>
      <${Text}>
        <${Text} color=${st.logged ? 'green' : 'yellow'}>${st.logged ? '● 已登录' : '○ 未登录，请先选「重新登录」'}<//>
        <${Text} dimColor>  ·  <//>
        <${Text} color=${dry ? 'yellow' : 'gray'}>${dry ? '模拟模式' : '实跑模式'}<//>
      <//>
      ${ROWS.map((r, i) => (r.type === 'title'
        ? html`<${Text} key=${`t:${r.title}`} bold>${r.title}<//>`
        : html`<${Row} key=${r.item.key} item=${r.item} selected=${i === cursor} dry=${dry} />`))}
      <${Text} dimColor> <//>
      <${Box}>
        ${cur
          ? html`<${Text}><${Text} color="cyan">${cur.label}<//><${Text} dimColor>  ${cur.desc}<//><//>`
          : null}
      <//>
    <//>

    ${pending
      ? html`<${InputPanel} item=${pending} onChange=${setInput} onSubmit=${submit} />`
      : null}

    ${msg ? html`<${Box} marginTop=${1}><${Text} color="red">${msg}<//><//>` : null}

    ${last
      ? html`<${Box} marginTop=${1}><${Text} color=${last.code === 0 ? 'green' : 'red'}>上一项：${last.label}（退出码 ${last.code}）<//><//>`
      : null}

    <${Box} marginTop=${1}>
      <${Text} dimColor>↑↓ 选择 · Enter 运行 · d 切换模拟 · q 退出${pending ? ' · Esc 取消输入' : ''}<//>
    <//>
  <//>`;
}

mount();
