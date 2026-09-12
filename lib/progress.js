/**
 * progress.js —— 长耗时任务的终端进度反馈（stdout 原地刷新）
 *
 * 为什么单独做：全域扫描受 SDK 500ms 频控约束（16 城 × 5~6 请求 ≈ 50s），
 * 期间若无输出，用户面对的是「卡死了还是在跑」的不确定性。进度反馈把
 * 「正在做什么、到哪一步、还要多久」持续暴露出来。
 *
 * 三种模式（构造时自动选择，也可显式指定）：
 *   live   —— stdout 是 TTY：spinner 逐帧 + 进度条，\r 原地刷新
 *   plain  —— 非 TTY（管道/重定向）：只在阶段切换与完成时各打一行，无动画无 \r，
 *             保证 `script | less`、日志采集、回归对比拿到的都是干净文本
 *   off    —— --no-progress / W2_NO_PROGRESS=1：完全不输出，供严格结构对比使用
 *
 * 用法：业务结果仍用 console.log 输出；打印前须 done()，否则表格会与进度行串行。
 *
 *   const prog = createProgress();
 *   prog.stage('连接服务器…');
 *   ...
 *   prog.stage('扫描城池', { total: 16 });
 *   prog.update(11);              // 每城完成后推进
 *   prog.done();                  // 清行并定格汇总（Q2：保留耗时提示）
 */

import { displayWidth } from './table.js';

const FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
const BAR_WIDTH = 18;
const MIN_WIDTH = 24; // 终端过窄时退化为纯文本，不画进度条

/** 秒表：毫秒 → 人类可读（<60s 用「12s」，否则「1分12秒」） */
function elapsed(ms) {
  const sec = Math.floor(ms / 1000);
  if (sec < 60) return `${sec}s`;
  return `${Math.floor(sec / 60)}分${String(sec % 60).padStart(2, '0')}秒`;
}

/** 按显示宽度截断（CJK 记 2 列），超宽不折行，保证 \r 原地刷新不被撑破 */
function clip(text, max) {
  if (displayWidth(text) <= max) return text;
  let out = '';
  for (const ch of text) {
    if (displayWidth(out + ch) > max - 1) break;
    out += ch;
  }
  return out + '…';
}

/**
 * @param {object} opts
 *   stream  输出流（默认 process.stdout）
 *   mode    'live' | 'plain' | 'off'，缺省按 stream.isTTY 判定
 * @returns {{stage, update, done, mode}}
 */
function createProgress({ stream = process.stdout, mode = null } = {}) {
  const resolved = mode || (stream.isTTY ? 'live' : 'plain');
  const startedAt = Date.now();
  const state = { label: '', done: 0, total: 0, since: startedAt, timer: null, frame: 0, active: false };

  const width = () => Math.max(MIN_WIDTH, stream.columns || 80);

  /** 组装当前一行：spinner + 阶段 + 进度条 + 计数 + 耗时 */
  function render() {
    const parts = [];
    parts.push(`${FRAMES[state.frame % FRAMES.length]} ${state.label}`);
    if (state.total > 1) {
      const ratio = Math.min(1, state.done / state.total);
      const filled = Math.round(BAR_WIDTH * ratio);
      // 终端过窄时省掉进度条，只留计数，避免折行破坏 \r
      if (width() >= MIN_WIDTH + BAR_WIDTH + 6) {
        parts.push(`${'█'.repeat(filled)}${'░'.repeat(BAR_WIDTH - filled)}`);
      }
      parts.push(`${state.done}/${state.total}`);
    }
    parts.push(`· ${elapsed(Date.now() - state.since)}`);
    return clip(parts.join(' '), width() - 1);
  }

  function paint() {
    // \x1b[K 清到行尾：新内容比旧内容短时不会留下残字
    stream.write(`\r\x1b[K${render()}`);
  }

  function stopTimer() {
    if (state.timer) { clearInterval(state.timer); state.timer = null; }
  }

  /** 进入新阶段：live 立刻重绘；plain 把上一阶段定格成一行 */
  function stage(label, { total = 0 } = {}) {
    if (resolved === 'off') return;
    if (resolved === 'plain') {
      if (state.active && state.label) stream.write(`  ${state.label}${summary()} ✓\n`);
      state.label = label;
      state.done = 0;
      state.total = total;
      state.since = Date.now();
      state.active = true;
      return;
    }
    state.label = label;
    state.done = 0;
    state.total = total;
    state.since = Date.now();
    state.active = true;
    state.frame = 0;
    paint();
    if (!state.timer) {
      state.timer = setInterval(() => { state.frame++; paint(); }, 90);
      // 动画不应成为进程存活的原因：忘记 done() 时也要能正常退出
      if (typeof state.timer.unref === 'function') state.timer.unref();
    }
  }

  /** 推进计数；total 可选，用于首城回调时补上总数 */
  function update(done, total = null) {
    if (resolved === 'off' || !state.active) return;
    if (total != null) state.total = total;
    state.done = done;
    if (resolved === 'live') paint();
  }

  function summary() {
    const bits = [];
    if (state.total > 1) bits.push(` ${state.done}/${state.total}`);
    bits.push(`（${elapsed(Date.now() - state.since)}）`);
    return bits.join('');
  }

  /**
   * 收尾：清掉进度行，定格一行完成提示（Q2：保留耗时，让用户知道等了多久）。
   * 耗时取「自 createProgress 起的总计」——阶段耗时在中途会误导（主要耗时在扫描，不在最后的推导）。
   * @param {string} label 完成提示文案，缺省用当前阶段名
   */
  function done(label = null) {
    if (resolved === 'off') return;
    stopTimer();
    if (!state.active) return;
    const text = label || state.label;
    if (resolved === 'live') stream.write(`\r\x1b[K`);
    stream.write(`✓ ${text}（${elapsed(Date.now() - startedAt)}）\n`);
    state.active = false;
  }

  return { stage, update, done, mode: resolved };
}

export { createProgress, elapsed };
