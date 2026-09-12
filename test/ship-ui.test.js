import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { render } from 'ink-testing-library';
import htm from 'htm';
import {
  LoadPanel, CostPanel, HeaderBar, RowLine, TableLegend, CITY_COLUMNS, cityCells,
} from '../lib/ship-ui.js';
import { shipPlan } from '../lib/ship-core.js';
import { computeWidths, displayWidth } from '../lib/table.js';

const html = htm.bind(React.createElement);
const tick = () => new Promise((r) => setTimeout(r, 80));
// 显式终端宽度：默认 80 列会把新增的「超容」列折行，掩盖对齐问题
const COLS = 140;

function city(over = {}) {
  return {
    cityId: over.cityId || '1', name: over.name || '城A', x: over.x || 0, y: over.y || 0,
    stock: { food: 100000, steel: 200000, mineral: 300000, oil: 50000, gold: 0, ...over.stock },
    cap: { food: 200000, steel: 400000, mineral: 600000, oil: 100000, gold: 0, ...over.cap },
    floor: { food: 10000, steel: 20000, mineral: 30000, oil: 5000, gold: 0, ...over.floor },
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
  const { lastFrame } = render(html`
    <${LoadPanel} src=${src} dst=${dst} loads=${{ food: 24000 }} resIdx=${0} editBuf=${''} fuelHours=${6} />
  `, { columns: COLS });
  const frame = lastFrame();
  assert.match(frame, /装载清单/);
  for (const cn of ['粮', '钢', '矿', '油', '金']) assert.ok(frame.includes(cn), `缺少资源行 ${cn}`);
  assert.match(frame, /24,000/);
  assert.match(frame, /▸/); // 游标行
});

test('LoadPanel 编辑态显示输入缓冲', () => {
  const src = city();
  const dst = city({ cityId: '2', x: 100, y: 0 });
  const { lastFrame } = render(html`
    <${LoadPanel} src=${src} dst=${dst} loads=${{}} resIdx=${1} editBuf=${'1234'} fuelHours=${6} />
  `, { columns: COLS });
  assert.match(lastFrame(), /输入: 1234/);
});

test('CostPanel 正常与阻塞两态', () => {
  const src = city();
  const dst = city({ cityId: '2', x: 100, y: 0 });
  const ok = render(html`<${CostPanel} src=${src} dst=${dst} loads=${{ food: 1200 }} fuelHours=${6} />`, { columns: COLS });
  assert.match(ok.lastFrame(), /✓ 约束全部通过/);
  assert.match(ok.lastFrame(), /能效比/);

  const empty = render(html`<${CostPanel} src=${src} dst=${dst} loads=${{}} fuelHours=${6} />`, { columns: COLS });
  assert.match(empty.lastFrame(), /✗ 未装载任何资源/);

  const busy = city({ slotsUsed: 10, slotsCap: 10 });
  const blocked = render(html`<${CostPanel} src=${busy} dst=${dst} loads=${{ food: 1200 }} fuelHours=${6} />`, { columns: COLS });
  assert.match(blocked.lastFrame(), /✗ 出征位已满/);
});

test('HeaderBar 显示连接态与 DRY 标记', () => {
  const a = render(html`<${HeaderBar} connected=${true} dry=${true} hubs=${'钢=城A'} />`, { columns: COLS });
  assert.match(a.lastFrame(), /已连接/);
  assert.match(a.lastFrame(), /DRY 模拟/);
  assert.match(a.lastFrame(), /中心仓: 钢=城A/);
  const b = render(html`<${HeaderBar} connected=${false} dry=${false} hubs=${''} />`, { columns: COLS });
  assert.match(b.lastFrame(), /未连接/);
});

test('TableLegend 覆盖全部着色语义', () => {
  const { lastFrame } = render(html`<${TableLegend} />`, { columns: COLS });
  const frame = lastFrame();
  assert.match(frame, /图例/);
  for (const kw of ['低于底仓线', '资源富余', '中心仓', '推荐目的城', '当前选中行']) {
    assert.ok(frame.includes(kw), `图例缺少「${kw}」`);
  }
});

test('城池行渲染列对齐（宽度感知）', () => {
  const s = city({ name: '短名' });
  const cells = cityCells(s, { hubOf: () => ['钢'], star: false, srcPick: '▸' });
  const widths = computeWidths(CITY_COLUMNS, [cells.map((c) => c.s)]);
  const { lastFrame } = render(html`<${RowLine} cells=${cells} widths=${widths} inverse=${false} />`, { columns: COLS });
  const line = lastFrame();
  assert.match(line, /短名/);
  assert.match(line, /钢/);
  // 总宽 = 各列宽 + 列间隔（2×8），中文按 2 列宽
  const expected = widths.reduce((a, w, i) => a + w + (i < widths.length - 1 ? 2 : 0), 0);
  assert.equal(displayWidth(line.split('\n')[0]), expected);
});

test('shipPlan 与面板显示一致（卡车数/油耗）', async () => {
  const src = city();
  const dst = city({ cityId: '2', x: 100, y: 0 });
  const loads = { food: 120000 };
  const plan = shipPlan(src, dst, loads, 6);
  const { lastFrame } = render(html`<${CostPanel} src=${src} dst=${dst} loads=${loads} fuelHours=${6} />`, { columns: COLS });
  await tick();
  const frame = lastFrame();
  assert.ok(frame.includes(String(plan.trucks)), `面板未显示卡车数 ${plan.trucks}`);
  assert.ok(frame.includes(plan.oilCost.toLocaleString('en-US')), `面板未显示油耗 ${plan.oilCost}`);
});
