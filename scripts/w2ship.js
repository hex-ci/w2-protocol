#!/usr/bin/env node

/**
 * w2ship.js —— 定向运输 TUI（手动调度单笔运输）
 *
 * 交互流程：扫描全域 → 选出发城 → 选目的城（★ 推荐能把富余正好用上的城）
 *   → 逐资源调装载量（←→ 5% 微调 / 数字直输 / b 补底仓 y 全富余 m 拉满）
 *   → 确认屏（y 发车）→ 发车后本地联动扣减，可继续下一笔（v 复制上一笔）。
 *
 * 与 w2transport 同口径：距离/油耗模型见 lib/formula.js（实测拟合），
 * 发车油料预算 = 物理石油 − 6h 训练保留量；出征位 = 司令部等级（实测标定）。
 * 发车前实时复核（切城重拉资源/卡车/出征位），任一约束不过则拒绝发车。
 *
 * 用法:
 *   node scripts/w2ship.js            进入交互界面（真实发车）
 *   node scripts/w2ship.js --dry      界面照常操作，但不真正发车（模拟）
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { render, Box, Text, useInput, useApp } from 'ink';
import { Spinner } from '@inkjs/ui';
import htm from 'htm';
import config from '../lib/config.js';
import { W2Client, p } from '../lib/sdk.js';
import { computeWidths } from '../lib/table.js';
import { fmtNum } from '../lib/format.js';
import { RES_KEYS, RES_CN } from '../lib/formula.js';
import {
  parse2003, parse2026, countArmy, buildTransport19003Payload,
} from '../lib/proto.js';
import { scanDomain } from '../lib/scan.js';
import { DispatchKey, countSlotsAt } from '../lib/expedition.js';
import { readTopologyCache } from '../lib/topology.js';
import {
  RES_ALL, shipPlan, clampAmount, normalizeLoads, wrapIndex,
  presetFill, presetSurplus, presetMax, presetExcess,
  excessList, spaceAt,
} from '../lib/ship-core.js';
import {
  CITY_COLUMNS, cityCells, RowLine, TableHeader, TableLegend, BlockedLine, OvercapLine,
  HeaderBar, LoadPanel, CostPanel, HelpLine,
} from '../lib/ship-ui.js';

const html = htm.bind(React.createElement);

const argv = process.argv.slice(2);
const DRY = argv.includes('--dry');
const FUEL_HOURS = 6;

// ---------- 运行守卫 ----------

if (!process.stdin.isTTY || !process.stdout.isTTY) {
  console.log('w2ship 需要交互式终端（TTY）运行；请在终端中直接执行。');
  process.exit(1);
}

const lp = config.loginParams();
const gs = config.gameServer();
if (!gs || !lp) {
  console.log('尚未登录：请先运行 npm run login');
  process.exit(1);
}

// ---------- 运行时（连接 / 调度 key / 发车） ----------

const rt = {
  c: null,
  dispatchKey: new DispatchKey(),
  originCityId: null,
  bonus19001: null, // 19001 行军加成（scanDomain 返回；发车前刷新）
  lastShip: null, // { srcId, dstId, loads } 供「复制上一笔」
};

async function connectClient() {
  const c = new W2Client({ host: gs.host, port: gs.port, loginParams: lp });
  rt.dispatchKey.bind(c);
  await c.connect();
  rt.c = c;
  return c;
}

/**
 * 发车前实时复核 + 发送。复核使用服务器当前值（重拉资源/卡车/出征位），
 * 任一约束不过则拒绝（返回 issues），不会发出注定被拒的帧。
 */
async function preflightAndSend(src, dst, loads) {
  const c = rt.c;
  await c.call(2002, p.u64(src.cityId));
  const r2003 = await c.call(2003, Buffer.alloc(0));
  const r2026 = await c.call(2026, Buffer.alloc(0));
  const r19009 = await c.call(19009, Buffer.alloc(0));
  const freshStock = parse2003(r2003.raw);
  const prod = parse2026(r2026.raw);
  const trucks = countArmy(r19009.raw, 3);
  const slotsUsed = await countSlotsAt(c, src.x, src.y);

  const srcFresh = {
    ...src,
    stock: { ...src.stock, food: freshStock.food, steel: freshStock.steel, mineral: freshStock.mineral, oil: freshStock.oil, gold: prod.goldA },
    physOil: freshStock.oil,
    availTrucks: trucks,
    slotsUsed,
  };
  const plan = shipPlan(srcFresh, dst, loads, FUEL_HOURS);
  if (!plan.ok) return { ok: false, issues: plan.issues, srcFresh };

  // key 超过 90s 视为过期，等一次新推送（最多 3s）
  if (!rt.dispatchKey.has(90000)) await rt.dispatchKey.waitFresh(3000);
  if (!rt.dispatchKey.key) return { ok: false, issues: ['未收到 26022 调度 key，请稍后重试'], srcFresh };

  if (DRY) return { ok: true, dry: true, plan, srcFresh };

  const payload = buildTransport19003Payload({
    trucks: plan.trucks, tx: dst.x, ty: dst.y, carry: loads, key: rt.dispatchKey.key,
  });
  const resp = await c.call(19003, payload);
  if (!resp.ok) return { ok: false, issues: [resp.message || `服务器拒绝（status=${resp.status}）`], srcFresh };
  return { ok: true, plan, srcFresh };
}

// ---------- 主组件 ----------

function App() {
  const { exit } = useApp();
  const [phase, setPhase] = useState('scan');
  const [scanMsg, setScanMsg] = useState('连接服务器…');
  const [errMsg, setErrMsg] = useState('');
  const [cities, setCities] = useState([]);
  const [cursor, setCursor] = useState(0);
  const [src, setSrc] = useState(null);
  const [dst, setDst] = useState(null);
  const [loads, setLoads] = useState({});
  const [resIdx, setResIdx] = useState(0);
  const [editBuf, setEditBuf] = useState('');
  const [result, setResult] = useState(null); // { ok, dry, issues, moved }
  const mounted = useRef(true);
  useEffect(() => () => { mounted.current = false; }, []);

  const hubMap = useMemo(() => {
    const cache = readTopologyCache();
    const byCity = new Map();
    for (const [res, cid] of Object.entries(cache?.superHubs || {})) {
      if (!cid) continue;
      if (!byCity.has(String(cid))) byCity.set(String(cid), []);
      byCity.get(String(cid)).push(RES_CN[res]);
    }
    return byCity;
  }, [cities]);
  const hubOf = (cityId) => hubMap.get(String(cityId));
  // 顶栏中心仓一览用城名展示（扫描完成后可查）；未扫描时回退显示 cityId
  const hubLine = useMemo(() => {
    const cache = readTopologyCache();
    const out = [];
    const nameOf = (cid) => cities.find((s) => s.cityId === String(cid))?.name || cid;
    for (const [res, cid] of Object.entries(cache?.superHubs || {})) {
      if (cid) out.push(`${RES_CN[res]}=${nameOf(cid)}`);
    }
    return out.length ? out.join('  ') : '（未推导，运行 npm run transport 生成）';
  }, [cities]);

  const rescan = useCallback(async () => {
    setPhase('scan');
    setErrMsg('');
    try {
      if (!rt.c || !rt.c.connected) {
        setScanMsg('连接服务器…');
        await connectClient();
      }
      setScanMsg('等待调度 key…');
      await rt.dispatchKey.waitFresh(2500);
      const { state, originCityId, bonus19001 } = await scanDomain(rt.c, {
        floorHours: 24,
        onCity: (s, i, total) => { if (mounted.current) setScanMsg(`扫描城池 ${i + 1}/${total} ${s.name}`); },
      });
      if (!mounted.current) return;
      rt.originCityId = rt.originCityId || originCityId;
      rt.bonus19001 = bonus19001;
      setCities(state);
      setPhase('src');
    } catch (e) {
      if (!mounted.current) return;
      setErrMsg(e.message);
      setPhase('fatal');
    }
  }, []);

  useEffect(() => { rescan(); }, [rescan]);

  // 空闲保活：交互阶段每 45s 发一次 cmd=1（与真机抓包中客户端 ping 节奏一致）
  useEffect(() => {
    const idlePhases = ['src', 'dst', 'load', 'confirm', 'sent'];
    const t = setInterval(async () => {
      if (!rt.c || !rt.c.connected) return;
      if (!idlePhases.includes(phase)) return;
      try { await rt.c.call(1, Buffer.alloc(0)); } catch (e) { /* 连接检查交给下一次操作 */ }
    }, 45000);
    return () => clearInterval(t);
  }, [phase]);

  const applySent = useCallback((plan, srcFresh, srcCity) => {
    setCities((prev) => prev.map((s) => {
      if (s.cityId !== srcCity.cityId) return s;
      const stock = { ...srcFresh.stock };
      for (const r of RES_ALL) stock[r] = Math.max(0, (stock[r] || 0) - Math.max(0, loads[r] || 0));
      stock.oil = Math.max(0, stock.oil - plan.oilCost);
      return {
        ...s,
        stock,
        physOil: Math.max(0, srcFresh.physOil - plan.oilCost - Math.max(0, loads.oil || 0)),
        availTrucks: Math.max(0, srcFresh.availTrucks - plan.trucks),
        slotsUsed: srcFresh.slotsUsed + 1,
        slotsFree: Math.max(0, (s.slotsCap === Infinity ? Infinity : s.slotsCap - (srcFresh.slotsUsed + 1))),
      };
    }));
  }, [loads]);

  const doSend = useCallback(async () => {
    setPhase('sending');
    try {
      const r = await preflightAndSend(src, dst, loads);
      if (!mounted.current) return;
      if (r.ok) {
        rt.lastShip = { srcId: src.cityId, dstId: dst.cityId, loads: { ...loads } };
        applySent(r.plan, r.srcFresh, src);
        setResult({ ok: true, dry: r.dry, plan: r.plan });
        setPhase('sent');
      } else {
        setResult({ ok: false, issues: r.issues });
        setPhase('confirm');
      }
    } catch (e) {
      if (!mounted.current) return;
      setResult({ ok: false, issues: [e.message] });
      setPhase('confirm');
    }
  }, [src, dst, loads, applySent]);

  // ---------- 键盘 ----------

  useInput((input, key) => {
    if (key.ctrl && input === 'c') { exit(); return; }
    if (phase === 'scan' || phase === 'sending') return;

    if (phase === 'fatal') {
      if (input === 'q') exit();
      if (input === 'f') rescan();
      return;
    }
    if (input === 'q' && phase !== 'load') { exit(); return; }
    if (input === 'f' && (phase === 'src' || phase === 'dst')) { rescan(); return; }

    if (phase === 'src') {
      // 上下循环：末行继续向下回到首行；翻页不循环（跳首/末更符合预期）
      if (key.upArrow) setCursor((c) => wrapIndex(c, -1, cities.length));
      if (key.downArrow) setCursor((c) => wrapIndex(c, 1, cities.length));
      if (key.pageUp) setCursor((c) => Math.max(0, c - 10));
      if (key.pageDown) setCursor((c) => Math.min(cities.length - 1, c + 10));
      if (key.return && cities[cursor]) {
        setSrc(cities[cursor]);
        setDst(null);
        setLoads({});
        setResIdx(0);
        setResult(null);
        setPhase('dst');
      }
      if (input === 'v' && rt.lastShip) {
        const s = cities.find((x) => x.cityId === rt.lastShip.srcId);
        const d = cities.find((x) => x.cityId === rt.lastShip.dstId);
        if (s && d) {
          setSrc(s); setDst(d); setLoads(normalizeLoads(s, d, rt.lastShip.loads, FUEL_HOURS)); setResIdx(0); setPhase('load');
        }
      }
      return;
    }

    if (phase === 'dst') {
      if (key.upArrow) setCursor((c) => wrapIndex(c, -1, cities.length));
      if (key.downArrow) setCursor((c) => wrapIndex(c, 1, cities.length));
      if (key.escape) { setPhase('src'); return; }
      if (key.return && cities[cursor] && cities[cursor].cityId !== src.cityId) {
        setDst(cities[cursor]);
        setLoads({});
        setResIdx(0);
        setPhase('load');
      }
      return;
    }

    if (phase === 'load') {
      const r = RES_ALL[resIdx];
      if (key.upArrow) { setResIdx((i) => wrapIndex(i, -1, RES_ALL.length)); setEditBuf(''); return; }
      if (key.downArrow || key.tab) { setResIdx((i) => wrapIndex(i, 1, RES_ALL.length)); setEditBuf(''); return; }
      if (/^\d+$/.test(input)) { setEditBuf((b) => (b + input).slice(0, 12)); return; }
      if (key.backspace || key.delete) { setEditBuf((b) => b.slice(0, -1)); return; }
      if (key.leftArrow || key.rightArrow) {
        setEditBuf('');
        const step = Math.max(1, Math.round((src.stock[r] || 0) * 0.05));
        setLoads((prev) => {
          const cur = Math.max(0, prev[r] || 0);
          const next = key.leftArrow ? Math.max(0, cur - step) : cur + step;
          return { ...prev, [r]: clampAmount(src, dst, r, next, prev, FUEL_HOURS) };
        });
        return;
      }
      if (input === 'b') { setLoads((prev) => ({ ...prev, [r]: presetFill(src, dst, r, prev, FUEL_HOURS) })); return; }
      if (input === 'y') { setLoads((prev) => ({ ...prev, [r]: presetSurplus(src, dst, r, prev, FUEL_HOURS) })); return; }
      if (input === 'm') { setLoads((prev) => ({ ...prev, [r]: presetMax(src, dst, r, prev, FUEL_HOURS) })); return; }
      if (input === 'e') { setLoads((prev) => ({ ...prev, [r]: presetExcess(src, dst, r, prev, FUEL_HOURS) })); return; }
      if (input === 'x') { setLoads((prev) => ({ ...prev, [r]: 0 })); return; }
      if (key.escape) {
        if (editBuf) { setEditBuf(''); return; }
        setPhase('dst'); return;
      }
      if (key.return) {
        if (editBuf) {
          const v = parseInt(editBuf, 10);
          setLoads((prev) => ({ ...prev, [r]: clampAmount(src, dst, r, v, prev, FUEL_HOURS) }));
          setEditBuf('');
          return;
        }
        setResult(null);
        setPhase('confirm');
      }
      return;
    }

    if (phase === 'confirm') {
      if (input === 'y') { doSend(); return; }
      if (key.escape || input === 'n') { setPhase('load'); }
      return;
    }

    if (phase === 'sent') {
      if (input === 'v' && rt.lastShip) {
        const s = cities.find((x) => x.cityId === rt.lastShip.srcId);
        const d = cities.find((x) => x.cityId === rt.lastShip.dstId);
        if (s && d) { setSrc(s); setDst(d); setLoads(normalizeLoads(s, d, rt.lastShip.loads, FUEL_HOURS)); setResIdx(0); setPhase('load'); return; }
      }
      if (key.return || key.escape) {
        setSrc(null); setDst(null); setLoads({}); setResult(null);
        const idx = cities.findIndex((x) => x.cityId === (src?.cityId || ''));
        setCursor(idx >= 0 ? idx : 0);
        setPhase('src');
      }
      return;
    }
  });

  // ---------- 渲染 ----------

  const widths = useMemo(() => {
    const rows = cities.map((s) => cityCells(s, { hubOf, star: false, srcPick: ' ' }).map((c) => c.s));
    return computeWidths(CITY_COLUMNS, rows);
  }, [cities, hubMap]);


  if (phase === 'scan') {
    return html`
      <${Box} flexDirection="column">
        <${HeaderBar} connected=${!!rt.c?.connected} dry=${DRY} hubs=${hubLine} />
        <${Box} marginTop=${1}><${Spinner} /><${Text}> ${scanMsg}<//><//>
      <//>
    `;
  }

  if (phase === 'fatal') {
    return html`
      <${Box} flexDirection="column">
        <${HeaderBar} connected=${!!rt.c?.connected} dry=${DRY} hubs=${hubLine} />
        <${Box} marginTop=${1}><${Text} color="red">✗ ${errMsg}<//><//>
        <${Text} dimColor>f 重连重扫 · q 退出<//>
      <//>
    `;
  }

  // dst 模式下的双口径推荐：
  //   ★ 补料型 = Σ min(源城富余, 目的城底仓线缺口) 前 3 —— 救急补料
  //   ☆ 接收型 = 按源城超容资源的「容量余量」降序前 3 —— 超容外运（倒货只需对方装得下）
  const recos = new Set();
  const recvSet = new Set();
  if (phase === 'dst' && src) {
    const scored = cities
      .filter((s) => s.cityId !== src.cityId)
      .map((s) => {
        let score = 0;
        // 补料型只看有底仓线的 4 种资源：黄金无造兵需求、floor 不存在，不参与该口径
        for (const r of RES_KEYS) {
          const surplus = Math.max(0, src.stock[r] - src.floor[r]);
          const need = Math.max(0, s.floor[r] - s.stock[r]);
          score += Math.min(surplus, need);
        }
        return { cityId: s.cityId, score };
      })
      .filter((x) => x.score > 1)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    for (const x of scored) recos.add(x.cityId);

    // 接收型：按「能装下源城超容量」的合计排序取前 3（而非每项资源各取 3，避免标记过多）
    const recvScored = cities
      .filter((s) => s.cityId !== src.cityId)
      .map((s) => {
        let score = 0;
        for (const e of excessList(src)) {
          const space = spaceAt(s, e.res);
          if (space > 0) score += Math.min(e.excess, space === Infinity ? e.excess : space);
        }
        return { cityId: s.cityId, score };
      })
      .filter((x) => x.score > 1)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    for (const x of recvScored) recvSet.add(x.cityId);
  }

  const tableRows = cities.map((s, i) => ({
    city: s,
    cells: cityCells(s, {
      hubOf,
      star: phase === 'dst' && recos.has(s.cityId),
      recv: phase === 'dst' && recvSet.has(s.cityId),
      srcPick: (phase === 'src' || phase === 'dst') && i === cursor ? '▸' : ' ',
      // 已选定的出发/目的城常驻标记，回退重选时也能一眼定位
      role: src && s.cityId === src.cityId ? 'src' : (dst && s.cityId === dst.cityId ? 'dst' : null),
    }),
    cursor: (phase === 'src' || phase === 'dst') && i === cursor,
  }));

  // 装载/确认/发送阶段才显示装载与成本面板；选城阶段（src/dst）一律不显示——
  // Esc 返回上一级时 src/dst 会保留残余值，仅凭 src && dst 判断会泄漏出旧成本面板
  const inShipFlow = phase === 'load' || phase === 'confirm' || phase === 'sending' || phase === 'sent';

  return html`
    <${Box} flexDirection="column">
      <${HeaderBar} connected=${!!rt.c?.connected} dry=${DRY} hubs=${hubLine} />

      <${Box} flexDirection="column" marginTop=${1}>
        <${Text} bold>
          ${phase === 'src' ? '选择出发城' : phase === 'dst' ? `选择目的城（出发: ${src.name}）` : `${src.name} → ${dst.name}`}
        <//>
        <${TableHeader} widths=${widths} />
        ${tableRows.map((r) => html`<${RowLine} key=${r.city.cityId} cells=${r.cells} widths=${widths} inverse=${r.cursor} />`)}
        <${TableLegend} />
        <${BlockedLine} cities=${cities} fuelHours=${FUEL_HOURS} />
      <//>

      <${OvercapLine} cities=${cities} hubOf=${hubOf} />

      ${inShipFlow
        ? html`<${LoadPanel} src=${src} dst=${dst} loads=${loads} resIdx=${resIdx} editBuf=${editBuf} fuelHours=${FUEL_HOURS} />`
        : null}

      ${inShipFlow && src && dst ? html`<${CostPanel} src=${src} dst=${dst} loads=${loads} fuelHours=${FUEL_HOURS} bonus=${rt.bonus19001} />` : null}

      ${phase === 'confirm' && result && !result.ok
        ? html`<${Box} marginTop=${1} flexDirection="column">${result.issues.map((s, i) => html`<${Text} key=${i} color="red">✗ ${s}<//>`)}<//>`
        : null}

      ${phase === 'sent'
        ? html`<${Box} marginTop=${1} flexDirection="column">
            <${Text} color="green" bold>✓ ${result?.dry ? '[DRY] 模拟发车完成' : '发车完成'}：${fmtNum(result?.plan?.total || 0)} 资源，${fmtNum(result?.plan?.trucks || 0)} 辆卡车，油耗 ${fmtNum(result?.plan?.oilCost || 0)}<//>
            <${Text} dimColor>源城库存/卡车已本地扣减；目的地到货需行军时间，按 f 刷新可见到货结果。<//>
          <//>`
        : null}

      <${HelpLine} phase=${phase} />
    <//>
  `;
}

// ---------- 入口 ----------

const app = render(html`<${App} />`);
await app.waitUntilExit();

// 收尾：切回操作前的城池并关闭连接（失败不影响退出）
try {
  if (rt.c && rt.c.connected && rt.originCityId) {
    await rt.c.call(2002, p.u64(rt.originCityId));
  }
} catch (e) { /* 忽略 */ }
try { rt.c?.close(); } catch (e) { /* 忽略 */ }
