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
import { RES_ALL, shipPlan, capDetail, cityLimits, excessList, excessAt } from './ship-core.js';

const html = htm.bind(React.createElement);

// 发车受阻的人话说明（limiter/blocker → 短标签 + 细说），UI 用它回答「为什么装不进」
const LIMITER_CN = {
  stock: '本城无存货',
  trucks: '无可用卡车',
  oil: '油料预算不足',
};
const BLOCKER_HINT = {
  slots: (n) => `出征位已满（${n.slotsUsed}/${n.slotsCap}），等部队返程后释放`,
  trucks: () => '卡车全部在外（可用 0 辆），等返程后恢复',
  oil: (n) => `油料预算不足：物理油 ${fmtNum(n.physOil)}，须先留 ${fmtNum(n.reserve)}（${n.fuelHours}h 训练用料），可发 0 辆`,
  stock: () => '本城无任何资源可运',
};

// ---------- 城池表 ----------

const CITY_COLUMNS = [
  { header: '城池名称', width: 12 },
  { header: '中心仓', width: 6 },
  { header: '坐标', width: 9 },
  { header: '粮食 储/容', width: 15, align: 'right' },
  { header: '钢铁 储/容', width: 15, align: 'right' },
  { header: '稀矿 储/容', width: 15, align: 'right' },
  { header: '石油 储/容', width: 15, align: 'right' },
  { header: '黄金 储/容', width: 15, align: 'right' },
  { header: '卡车', width: 7, align: 'right' },
  { header: '出征位', width: 6, align: 'right' },
];

/**
 * 城池表一行 → 单元格段（文本 + 颜色：低于底仓线红、富余绿、超容洋红）。
 * 资源格统一为「储量/容量」（容量是判断「运走多少才不爆仓」的依据）。
 * 前导标记定宽 3 列：光标 ▸ + 角色/推荐（◀ 出发城 / ▶ 目的城 / ★ ☆ 推荐）+ 空格。
 * 箭头语义以「紧贴名字」为准：指向名字＝进入，背离名字＝运出。
 * 全部用宽度 1 的符号，任意组合都不会让整行错位。
 */
function cityCells(s, { hubOf, star, recv, srcPick, role = null }) {
  const hub = hubOf(s.cityId);
  const resCell = (r) => {
    const v = s.stock[r];
    // 着色优先级：超容（爆仓停产，需外运）> 低于底仓线 > 富余。
    // 中心仓对该资源属归属囤积（设计预期）→ 不标超容色，避免误导为「要运走」
    const isHubRes = !!hub && hub.includes(RES_CN[r]);
    const over = !isHubRes && excessAt(s, r) > 0;
    // 黄金无造兵需求、不参与造兵配给（见 transport 的黄金口径）→ 底仓线不存在，
    // 红/绿这两个「相对底仓线」的语义对它无意义，只保留超容洋红。
    const hasFloor = (s.floor || {})[r] != null;
    const deficit = hasFloor && v < s.floor[r];
    const surplus = hasFloor && v > s.floor[r] * 1.5;
    return {
      s: `${fmtShort(v)} / ${fmtShort(s.cap[r])}`,
      color: over ? 'magenta' : (deficit ? 'red' : (surplus ? 'green' : undefined)),
    };
  };
  // 标记位：第 1 位光标，第 2 位角色/推荐。出发城与目的城优先于推荐符号
  //（推荐结果本身不含已选城，两者不会争同一行）。
  // 箭头贴着名字读：指向名字（▶）＝货运进来（目的城），背离名字（◀）＝货运出去（出发城）
  const roleMark = role === 'src' ? '◀' : role === 'dst' ? '▶' : star ? '★' : recv ? '☆' : ' ';
  return [
    { s: `${srcPick === '▸' ? '▸' : ' '}${roleMark} ${s.name}` },
    { s: hub ? hub.join('') : '—', color: hub ? 'yellow' : undefined },
    { s: `(${s.x},${s.y})` },
    resCell('food'), resCell('steel'), resCell('mineral'), resCell('oil'), resCell('gold'),
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

/**
 * 城池表颜色图例（说明各列着色语义；dim 展示不干扰主数据）。
 * 分两行排布：单行过长时 Ink 会按宽度折行、把词切断（曾致「资源富余」被拆开）。
 */
function TableLegend() {
  return html`
    <${Box} marginTop=${1} flexDirection="column">
      <${Box}>
        <${Text} dimColor>图例  <//>
        <${Text} color="red">红<//><${Text} dimColor>=低于底仓线/出征位已满  <//>
        <${Text} color="green">绿<//><${Text} dimColor>=资源富余  <//>
        <${Text} color="yellow">黄<//><${Text} dimColor>=中心仓  <//>
        <${Text} color="magenta">洋红<//><${Text} dimColor>=资源超容（爆仓停产）  <//>
        <${Text} inverse>反色<//><${Text} dimColor>=当前选中行<//>
      <//>
      <${Box}>
        <${Text} dimColor>          <//>
        <${Text}>◀<//><${Text} dimColor>=出发城（运出）  <//>
        <${Text}>▶<//><${Text} dimColor>=目的城（进入）<//>
        <${Text}>★<//><${Text} dimColor>=推荐目的城（补料型）  <//>
        <${Text}>☆<//><${Text} dimColor>=推荐目的城（能装下超容）<//>
      <//>
    <//>
  `;
}

/**
 * 暂不可发车的城一览。选城阶段就给出，免得选中后进装载页才发现上限全 0。
 * 只做城级判定（与目的城无关）：出征位满 / 无卡车 / 油料预算为 0 / 无资源。
 */
const BLOCKER_LABEL = { slots: '出征位满', trucks: '无卡车', oil: '油料预算不足', stock: '无资源' };

/**
 * 全域超容汇总（常驻一行，不罗列明细——明细看城池表的洋红格，或按 s 切容量视图）。
 * 中心仓对**归属**资源的囤积是设计预期（transport 阶段2 有意堆积），不计入待外运。
 */
function OvercapLine({ cities, hubOf }) {
  let total = 0;
  let cityCount = 0;
  for (const city of cities) {
    const hubs = (hubOf && hubOf(city.cityId)) || [];
    const pending = excessList(city).filter((e) => !hubs.includes(RES_CN[e.res]));
    if (!pending.length) continue;
    cityCount++;
    total += pending.reduce((a, e) => a + e.excess, 0);
  }
  if (!cityCount) return html`<${Box}><${Text} dimColor>✓ 无超容城池<//><//>`;
  return html`
    <${Box}>
      <${Text} color="magenta">⚠ 超容 ${cityCount} 城（合计 ${fmtShort(total)}）<//>
      <${Text} dimColor>  洋红格=爆仓停产<//>
    <//>
  `;
}

function BlockedLine({ cities, fuelHours }) {
  const blocked = [];
  for (const s of cities) {
    const { blocker } = cityLimits(s, null, fuelHours);
    if (blocker) blocked.push(`${s.name}（${BLOCKER_LABEL[blocker]}）`);
  }
  if (!blocked.length) return null;
  return html`
    <${Box} marginTop=${1}>
      <${Text} color="yellow">⚠ 暂不可发车  <//>
      <${Text} dimColor>${blocked.join('  ')}<//>
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
  const city = cityLimits(src, dst, fuelHours);
  return html`
    <${Box} flexDirection="column" marginTop=${1}>
      <${Text} bold>装载清单（${src.name} → ${dst.name}）<//>
      ${city.blocker
        ? html`<${Text} color="red">  ✗ 本城当前无法发车：${BLOCKER_HINT[city.blocker](city.numbers)}<//>`
        : null}
      ${RES_ALL.map((r, i) => {
        const amount = Math.max(0, loads[r] || 0);
        const stock = src.stock[r] || 0;
        const { cap, limiter, limits } = capDetail(src, dst, r, loads, fuelHours);
        const resCap = (src.cap || {})[r] || 0;
        const excess = excessAt(src, r);
        const pct = stock > 0 ? Math.min(100, Math.round((amount / stock) * 100)) : 0;
        const filled = Math.round((pct / 100) * BAR);
        const deficit = Math.max(0, (dst.floor[r] || 0) - (dst.stock[r] || 0));
        const cursor = i === resIdx;
        // 上限为 0 时点明原因（库存/卡车/油料），并给可读量级
        const why = cap <= 0 ? `  ← ${LIMITER_CN[limiter]}` : '';
        const limHint = cap > 0 && limiter !== 'stock'
          ? `  受限于${LIMITER_CN[limiter]}（${fmtShort(limits[limiter])}）`
          : '';
        return html`
          <${Box} key=${r}>
            <${Text} inverse=${cursor}>${cursor ? '▸' : ' '} ${RES_CN[r]} <//>
            <${Text} color=${amount > 0 ? 'cyan' : 'gray'}>${'█'.repeat(filled)}${'░'.repeat(BAR - filled)}<//>
            <${Text}>  ${String(pct).padStart(3)}%  ${padNum(fmtNum(amount), 12)}<//>
            <${Text} dimColor>  上限 ${fmtShort(cap)}<//>
            ${excess > 0
              ? html`<${Text} color="magenta">  超出 ${fmtShort(excess)}<//><${Text} dimColor>/容${fmtShort(resCap)}<//>`
              : null}
            ${why ? html`<${Text} color="yellow">${why}<//>` : html`<${Text} dimColor>  目的缺 ${deficit > 0 ? fmtShort(deficit) : '—'}<//>`}
            ${limHint ? html`<${Text} dimColor>${limHint}<//>` : null}
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
    dst: '↑↓ 选目的城（★补料 ☆能装下）· Enter 确认 · Esc 返回 · f 刷新 · q 退出',
    load: '↑↓/Tab 切资源 · ←→ ±5% · 数字直输 · e 超容 · b 补底仓 · y 全富余 · m 拉满 · x 清空 · Enter 预览 · Esc 返回',
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
  BlockedLine,
  BLOCKER_LABEL,
  OvercapLine,
  HeaderBar,
  LoadPanel,
  CostPanel,
  HelpLine,
  padNum,
};
