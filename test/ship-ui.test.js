import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { render as inkRender } from 'ink-testing-library';
import htm from 'htm';
import {
  LoadPanel, CostPanel, HeaderBar, RowLine, TableLegend, CITY_COLUMNS, cityCells,
} from '../lib/ship-ui.js';
import { shipPlan } from '../lib/ship-core.js';
import { computeWidths, displayWidth } from '../lib/table.js';

const html = htm.bind(React.createElement);
const tick = () => new Promise((r) => setTimeout(r, 80));
// 显式终端宽度：默认 80 列会把新增的「超容」列折行，掩盖对齐问题
// ink-testing-library 的 stdout.columns 是只读 getter（恒为 100），且 Ink 在 render() 期间
// 读取它决定折行——表格加宽后 100 列会折行、掩盖对齐问题。故在原型上覆盖为可配置宽度。
const COLS = 200;
let __cols = COLS;

// 覆盖 stdout.columns（原型级）：Ink 在 render() 期间读它决定折行，须在渲染前设好
{
  const probe = inkRender(null);
  const proto = Object.getPrototypeOf(probe.stdout);
  probe.unmount();
  Object.defineProperty(proto, 'columns', { configurable: true, get: () => __cols });
}

/** 按指定终端宽度渲染（默认 200 列，容纳加宽后的城池表） */
function renderAt(node, columns = COLS) {
  __cols = columns;
  return inkRender(node);
}

function city(over = {}) {
  return {
    cityId: over.cityId || '1', name: over.name || '城A', x: over.x || 0, y: over.y || 0,
    stock: { food: 100000, steel: 200000, mineral: 300000, oil: 50000, gold: 5000, ...over.stock },
    cap: { food: 200000, steel: 400000, mineral: 600000, oil: 100000, gold: 100000, ...over.cap },
    // 真实数据里 floor 只有 4 种资源（黄金无造兵需求，底仓线不存在）
    floor: { food: 10000, steel: 20000, mineral: 30000, oil: 5000, ...over.floor },
    D: { food: 0, steel: 0, mineral: 0, oil: 100, ...over.D },
    availTrucks: over.availTrucks ?? 100,
    physOil: over.physOil ?? 50000,
    slotsCap: over.slotsCap ?? 10,
    slotsUsed: over.slotsUsed ?? 0,
  };
}

test('LoadPanel 渲染五行资源与装载量', () => {
  const src = city();
  const dst = city({ cityId: '2', x: 100, y: 0 });
  const { lastFrame } = renderAt(html`
    <${LoadPanel} src=${src} dst=${dst} loads=${{ food: 24000 }} resIdx=${0} editBuf=${''} fuelHours=${6} />
  `);
  const frame = lastFrame();
  assert.match(frame, /装载清单/);
  for (const cn of ['粮', '钢', '矿', '油', '金']) assert.ok(frame.includes(cn), `缺少资源行 ${cn}`);
  assert.match(frame, /24,000/);
  assert.match(frame, /▸/); // 游标行
});

test('LoadPanel 编辑态显示输入缓冲', () => {
  const src = city();
  const dst = city({ cityId: '2', x: 100, y: 0 });
  const { lastFrame } = renderAt(html`
    <${LoadPanel} src=${src} dst=${dst} loads=${{}} resIdx=${1} editBuf=${'1234'} fuelHours=${6} />
  `);
  assert.match(lastFrame(), /输入: 1234/);
});

test('CostPanel 正常与阻塞两态', () => {
  const src = city();
  const dst = city({ cityId: '2', x: 100, y: 0 });
  const ok = renderAt(html`<${CostPanel} src=${src} dst=${dst} loads=${{ food: 1200 }} fuelHours=${6} />`);
  assert.match(ok.lastFrame(), /✓ 约束全部通过/);
  assert.match(ok.lastFrame(), /能效比/);

  const empty = renderAt(html`<${CostPanel} src=${src} dst=${dst} loads=${{}} fuelHours=${6} />`);
  assert.match(empty.lastFrame(), /✗ 未装载任何资源/);

  const busy = city({ slotsUsed: 10, slotsCap: 10 });
  const blocked = renderAt(html`<${CostPanel} src=${busy} dst=${dst} loads=${{ food: 1200 }} fuelHours=${6} />`);
  assert.match(blocked.lastFrame(), /✗ 出征位已满/);
});

test('HeaderBar 显示连接态与 DRY 标记', () => {
  const a = renderAt(html`<${HeaderBar} connected=${true} dry=${true} hubs=${'钢=城A'} />`);
  assert.match(a.lastFrame(), /已连接/);
  assert.match(a.lastFrame(), /DRY 模拟/);
  assert.match(a.lastFrame(), /中心仓: 钢=城A/);
  const b = renderAt(html`<${HeaderBar} connected=${false} dry=${false} hubs=${''} />`);
  assert.match(b.lastFrame(), /未连接/);
});

test('TableLegend 覆盖全部着色语义', () => {
  const { lastFrame } = renderAt(html`<${TableLegend} />`);
  const frame = lastFrame();
  assert.match(frame, /图例/);
  for (const kw of ['低于底仓线', '资源富余', '中心仓', '推荐目的城', '当前选中行', '出发城', '目的城']) {
    assert.ok(frame.includes(kw), `图例缺少「${kw}」`);
  }
});

test('城池行渲染列对齐（宽度感知）', () => {
  const s = city({ name: '短名' });
  const cells = cityCells(s, { hubOf: () => ['钢'], star: false, srcPick: '▸' });
  const widths = computeWidths(CITY_COLUMNS, [cells.map((c) => c.s)]);
  const { lastFrame } = renderAt(html`<${RowLine} cells=${cells} widths=${widths} inverse=${false} />`);
  const line = lastFrame();
  assert.match(line, /短名/);
  assert.match(line, /钢/);
  // 总宽 = 各列宽 + 列间隔（2×8），中文按 2 列宽
  const expected = widths.reduce((a, w, i) => a + w + (i < widths.length - 1 ? 2 : 0), 0);
  assert.equal(displayWidth(line.split('\n')[0]), expected);
});

test('资源格统一显示「储量/容量」', () => {
  const s = city();
  const cells = cityCells(s, { hubOf: () => null });
  // 粮 10 万 / 容 20 万、钢 20 万 / 容 40 万…
  assert.equal(cells[3].s, '10.0万 / 20.0万', `粮格应为 储/容（/ 两侧留空格），实际 ${cells[3].s}`);
  assert.equal(cells[4].s, '20.0万 / 40.0万', `钢格应为 储/容，实际 ${cells[4].s}`);
  assert.equal(cells[7].s, '5.0千 / 10.0万', `金格也应为 储/容，实际 ${cells[7].s}`);
});

test('资源格超容标洋红（格内显示 储/容 后仍准确定位超容行）', () => {
  // 粮库存 10 万 > 容量 6 万 → 超容
  const s = city({ cap: { food: 60000, steel: 400000, mineral: 600000, oil: 100000, gold: 0 } });
  const cells = cityCells(s, { hubOf: () => null });
  assert.equal(cells[3].s, '10.0万 / 6.0万');
  assert.equal(cells[3].color, 'magenta', '超容格应标洋红');
  assert.notEqual(cells[4].color, 'magenta', '未超容的钢格不应标洋红');
});

test('已选出发/目的城在表格最左侧常驻标记（起/止）', () => {
  const s = city({ name: '城甲' });
  // 出发城标记
  const asSrc = cityCells(s, { hubOf: () => null, role: 'src' });
  assert.match(asSrc[0].s, /◀ 城甲|◀城甲/, `出发城应带 ◀（背离名字=运出），实际 ${asSrc[0].s}`);
  // 目的城标记
  const asDst = cityCells(s, { hubOf: () => null, role: 'dst' });
  assert.match(asDst[0].s, /▶ 城甲|▶城甲/, `目的城应带 ▶（指向名字=进入），实际 ${asDst[0].s}`);
  // 无角色时该位留空（不误标）
  const none = cityCells(s, { hubOf: () => null });
  assert.ok(!/[▶◀]/.test(none[0].s), `未选定的城不应带箭头，实际 ${none[0].s}`);
});

test('光标与角色标记各占一位（互不覆盖）', () => {
  const s = city({ name: '城甲' });
  const cells = cityCells(s, { hubOf: () => null, role: 'src', srcPick: '▸' });
  assert.equal(cells[0].s, '▸◀ 城甲', '光标与出发城标记应同时显示');
});

test('角色标记优先于推荐符号（同一行不会同时出现起/★）', () => {
  const s = city({ name: '城甲' });
  const cells = cityCells(s, { hubOf: () => null, role: 'dst', star: true });
  assert.match(cells[0].s, /▶ 城甲/);
  assert.ok(!cells[0].s.includes('★'), '已是目的城时不再显示推荐星号');
});

test('shipPlan 与面板显示一致（卡车数/油耗）', async () => {
  const src = city();
  const dst = city({ cityId: '2', x: 100, y: 0 });
  const loads = { food: 120000 };
  const plan = shipPlan(src, dst, loads, 6);
  const { lastFrame } = renderAt(html`<${CostPanel} src=${src} dst=${dst} loads=${loads} fuelHours=${6} />`);
  await tick();
  const frame = lastFrame();
  assert.ok(frame.includes(String(plan.trucks)), `面板未显示卡车数 ${plan.trucks}`);
  assert.ok(frame.includes(plan.oilCost.toLocaleString('en-US')), `面板未显示油耗 ${plan.oilCost}`);
});
