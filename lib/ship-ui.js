/**
 * ship-ui.js —— 定向运输 TUI 的展示组件（Ink + htm）
 *
 * 纯展示层：props 进、渲染出，无网络/无状态。主脚本（scripts/w2ship.js）
 * 负责状态与交互编排；本模块可被测试直接渲染（ink-testing-library）。
 * 宽度感知对齐统一走 lib/table.js（含中文字段时禁用裸 padEnd）。
 */

import React from 'react';
import { Box, Text } from 'ink';
import htm from 'htm';
import { padCell } from './table.js';
import { fmtShort, fmtNum, fmtDur } from './format.js';
import { RES_CN, TRUCK_LOAD } from './formula.js';
import { RES_ALL, shipPlan, capFor } from './ship-core.js';

const html = htm.bind(React.createElement);

// ---------- 城池表 ----------

const CITY_COLUMNS = [
  { header: '城池名称', width: 12 },
  { header: '中心仓', width: 6 },
  { header: '坐标', width: 9 },
  { header: '粮食', width: 7, align: 'right' },
  { header: '钢铁', width: 7, align: 'right' },
  { header: '稀矿', width: 7, align: 'right' },
  { header: '石油', width: 7, align: 'right' },
  { header: '卡车', width: 7, align: 'right' },
  { header: '出征位', width: 6, align: 'right' },
];

/** 城池表一行 → 单元格段（文本 + 颜色：低于底仓线红、富余绿） */
function cityCells(s, { hubOf, star, srcPick }) {
  const hub = hubOf(s.cityId);
  const resCell = (r) => {
    const v = s.stock[r];
    const deficit = v < s.floor[r];
    const surplus = v > s.floor[r] * 1.5;
    return { s: fmtShort(v), color: deficit ? 'red' : (surplus ? 'green' : undefined) };
  };
  return [
    { s: `${star ? '★' : (srcPick || ' ')}${s.name}` },
    { s: hub ? hub.join('') : '—', color: hub ? 'yellow' : undefined },
    { s: `(${s.x},${s.y})` },
    resCell('food'), resCell('steel'), resCell('mineral'), resCell('oil'),
    { s: fmtShort(s.availTrucks) },
    {
      s: s.slotsCap === Infinity ? '—' : `${s.slotsUsed}/${s.slotsCap}`,
      color: (s.slotsCap !== Infinity && s.slotsUsed >= s.slotsCap) ? 'red' : undefined,
    },
  ];
}

/** 渲染一行（宽度感知对齐 + 单元格着色；cursor 行整体反色） */
function RowLine({ cells, widths, inverse, columns = CITY_COLUMNS }) {
  return html`
    <${Text} inverse=${inverse}>
      ${cells.map((c, i) => html`<${Text} key=${i} color=${inverse ? undefined : c.color}>${padCell(c.s, widths[i], columns[i].align || 'left')}${i < cells.length - 1 ? '  ' : ''}<//>`)}
    <//>
  `;
}

function TableHeader({ widths, columns = CITY_COLUMNS }) {
  const line = columns.map((c) => ({ s: c.header }));
  const sepLen = widths.reduce((a, w, i) => a + w + (i < widths.length - 1 ? 2 : 0), 0);
  return html`
    <${Box} flexDirection="column">
      <${RowLine} cells=${line} widths=${widths} inverse=${false} columns=${columns} />
      <${Text} dimColor>${'─'.repeat(sepLen)}<//>
    <//>
  `;
}

/** 城池表颜色图例（说明各列着色语义；dim 展示不干扰主数据） */
function TableLegend() {
  return html`
    <${Box} marginTop=${1}>
      <${Text} dimColor>图例  <//>
      <${Text} color="red">红<//><${Text} dimColor>=低于底仓线/出征位已满  <//>
      <${Text} color="green">绿<//><${Text} dimColor>=资源富余  <//>
      <${Text} color="yellow">黄<//><${Text} dimColor>=中心仓  <//>
      <${Text}>★<//><${Text} dimColor>=推荐目的城  <//>
      <${Text} inverse>反色<//><${Text} dimColor>=当前选中行<//>
    <//>
  `;
}

// ---------- 顶栏 ----------

function HeaderBar({ connected, dry, hubs }) {
  return html`
    <${Box} flexDirection="column">
      <${Text} bold color="cyan">
        定向运输 ${dry ? html`<${Text} color="yellow">[DRY 模拟，不实际发车]<//>` : ''}
        ${' '}<${Text} color=${connected ? 'green' : 'red'}>${connected ? '● 已连接' : '○ 未连接'}<//>
      <//>
      ${hubs ? html`<${Text} dimColor>中心仓: ${hubs}<//>` : null}
    <//>
  `;
}

// ---------- 装载面板 ----------

function padNum(s, w) {
  const gap = w - String(s).length;
  return gap > 0 ? ' '.repeat(gap) + s : s;
}

function LoadPanel({ src, dst, loads, resIdx, editBuf, fuelHours }) {
  const BAR = 14;
  return html`
    <${Box} flexDirection="column" marginTop=${1}>
      <${Text} bold>装载清单（${src.name} → ${dst.name}）<//>
      ${RES_ALL.map((r, i) => {
        const amount = Math.max(0, loads[r] || 0);
        const stock = src.stock[r] || 0;
        const cap = capFor(src, dst, r, loads, fuelHours);
        const pct = stock > 0 ? Math.min(100, Math.round((amount / stock) * 100)) : 0;
        const filled = Math.round((pct / 100) * BAR);
        const deficit = Math.max(0, (dst.floor[r] || 0) - (dst.stock[r] || 0));
        const cursor = i === resIdx;
        return html`
          <${Box} key=${r}>
            <${Text} inverse=${cursor}>${cursor ? '▸' : ' '} ${RES_CN[r]} <//>
            <${Text} color=${amount > 0 ? 'cyan' : 'gray'}>${'█'.repeat(filled)}${'░'.repeat(BAR - filled)}<//>
            <${Text}>  ${String(pct).padStart(3)}%  ${padNum(fmtNum(amount), 12)}<//>
            <${Text} dimColor>  上限 ${fmtShort(cap)}  目的缺 ${deficit > 0 ? fmtShort(deficit) : '—'}<//>
            ${cursor && editBuf ? html`<${Text} color="magenta">  输入: ${editBuf}▌<//>` : null}
          <//>
        `;
      })}
    <//>
  `;
}

// ---------- 成本效率面板 ----------

function CostPanel({ src, dst, loads, fuelHours, bonus }) {
  if (!dst) return null;
  const plan = shipPlan(src, dst, loads, fuelHours, bonus);
  const round = fmtDur(plan.realSec * 1000 * 2);
  const ratio = plan.oilCost > 0 ? (plan.total / plan.oilCost).toFixed(1) : '∞';
  return html`
    <${Box} flexDirection="column" marginTop=${1}>
      <${Text} bold>成本效率<//>
      <${Box}>
        <${Text}>  目的地 ${dst.name} (${dst.x},${dst.y})   距离 ${plan.d.toFixed(1)} 格   单程 ${fmtDur(plan.realSec * 1000)}   往返 ${round}<//>
      <//>
      <${Box}>
        <${Text}>  卡车 ${fmtNum(plan.trucks)} 辆（载重 ${TRUCK_LOAD}/车）   油耗 ${fmtNum(plan.oilCost)}   能效比 ${ratio}:1   合计 ${fmtNum(plan.total)} 资源<//>
      <//>
      <${Box} flexDirection="column">
        ${plan.issues.length === 0
          ? html`<${Text} color="green">  ✓ 约束全部通过（石油 / 卡车 / 出征位）<//>`
          : plan.issues.map((s, i) => html`<${Text} key=${i} color="red">  ✗ ${s}<//>`)}
      <//>
    <//>
  `;
}

// ---------- 状态栏 ----------

function HelpLine({ phase }) {
  const map = {
    src: '↑↓ 选出发城 · Enter 确认 · f 刷新 · q 退出',
    dst: '↑↓ 选目的城（★=推荐）· Enter 确认 · Esc 返回 · f 刷新 · q 退出',
    load: '↑↓/Tab 切资源 · ←→ ±5% · 数字直输 · b 补底仓 · y 全富余 · m 拉满 · x 清空 · Enter 预览 · Esc 返回',
    confirm: 'y 发车 · Esc 返回修改',
    sending: '发送中…',
    sent: 'Enter 继续下一笔 · v 复制上一笔 · Esc 返回',
  };
  return html`<${Box} marginTop=${1}><${Text} dimColor>${map[phase] || ''}<//><//>`;
}

export {
  CITY_COLUMNS,
  cityCells,
  RowLine,
  TableHeader,
  TableLegend,
  HeaderBar,
  LoadPanel,
  CostPanel,
  HelpLine,
  padNum,
};
