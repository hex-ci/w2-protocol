import assert from 'node:assert/strict';
import test from 'node:test';
import { createProgress } from '../lib/progress.js';
import { displayWidth } from '../lib/table.js';

/** 收集写入的假 stream：可指定 isTTY / columns，用于覆盖三种模式 */
function fakeStream({ isTTY = false, columns = 80 } = {}) {
  const chunks = [];
  return {
    isTTY, columns,
    write: (s) => { chunks.push(s); return true; },
    text: () => chunks.join(''),
    chunks,
  };
}

test('off 模式：完全不输出（--no-progress / W2_NO_PROGRESS=1 的静默保证）', () => {
  const st = fakeStream({ isTTY: true });
  const p = createProgress({ stream: st, mode: 'off' });
  p.stage('扫描城池', { total: 16 });
  p.update(8);
  p.done('扫描完成');
  assert.equal(st.text(), '', 'off 模式必须零输出');
});

test('plain 模式（非 TTY）：无控制字符，阶段各占一行', () => {
  const st = fakeStream({ isTTY: false });
  const p = createProgress({ stream: st });
  assert.equal(p.mode, 'plain');

  p.stage('连接服务器…');
  p.stage('扫描城池', { total: 16 });
  p.update(16);
  p.done('扫描完成');

  const out = st.text();
  assert.ok(!out.includes('\r'), 'plain 模式不得含 \\r（否则重定向文件里会出现回退符）');
  assert.ok(!out.includes('\x1b['), 'plain 模式不得含 ANSI 转义');
  const lines = out.split('\n').filter(Boolean);
  assert.ok(lines.some((l) => l.includes('连接服务器')), '上一阶段应定格成一行');
  assert.ok(lines.some((l) => l.includes('扫描完成')), '完成行应输出');
});

test('live 模式（TTY）：原地刷新用 \\r，完成后清行', () => {
  const st = fakeStream({ isTTY: true, columns: 100 });
  const p = createProgress({ stream: st });
  assert.equal(p.mode, 'live');

  p.stage('扫描城池', { total: 16 });
  p.update(4);
  p.update(16);
  p.done('扫描完成');

  const out = st.text();
  assert.ok(out.includes('\r'), 'live 模式用 \\r 原地刷新');
  assert.ok(out.includes('\x1b[K'), 'live 模式清到行尾，避免残字');
  assert.ok(out.trimEnd().endsWith('）'), '完成行以耗时收尾（Q2：保留耗时提示）');
});

test('done 前不得残留进度行（业务输出会与进度串行）', () => {
  const st = fakeStream({ isTTY: true, columns: 100 });
  const p = createProgress({ stream: st });
  p.stage('扫描城池', { total: 16 });
  p.done('扫描完成');
  p.stage('下一阶段');
  p.done('下一阶段完成');
  const out = st.text();
  assert.ok(out.includes('✓ 扫描完成'), 'done 定格完成行');
  // 每个完成的阶段都必须以换行结束，业务输出才能落在独立整行
  const doneLines = out.split('\n').filter((l) => l.includes('✓'));
  assert.equal(doneLines.length, 2, '两个阶段各定格一行');
});

test('忘记 done() 不会吊住进程（timer unref）', async () => {
  const st = fakeStream({ isTTY: true, columns: 100 });
  const p = createProgress({ stream: st });
  p.stage('扫描城池', { total: 16 });
  p.update(4);
  // 故意不 done()：定时器不应阻止事件循环清空
  await new Promise((r) => setTimeout(r, 250));
  assert.ok(st.text().includes('扫描城池'));
  p.done('清理');
});

test('超窄终端：不画进度条，且不折行（\\r 原地刷新才不被撑破）', () => {
  const st = fakeStream({ isTTY: true, columns: 20 });
  const p = createProgress({ stream: st });
  p.stage('扫描城池', { total: 16 });
  p.update(8);
  p.done('扫描完成');
  // 每个写出的片段（去控制字符后）都应 ≤ 终端宽度
  for (const c of st.chunks) {
    for (const seg of c.split('\n')) {
      const clean = seg.replace(/\x1b\[K/g, '').replace(/^\r/, '');
      assert.ok(displayWidth(clean) <= 20, `片段超出终端宽度: ${JSON.stringify(clean)}`);
    }
  }
});

test('update 可补总数：首城回调时 total 由回调传入', () => {
  const st = fakeStream({ isTTY: true, columns: 100 });
  const p = createProgress({ stream: st });
  p.stage('扫描城池');      // 未给 total
  p.update(1, 16);          // 首次回调补上
  const out = st.text();
  assert.ok(out.includes('1/16'), '应显示补上的总数');
});
