/**
 * expedition.js —— 远征公共设施（26022 调度 key 跟踪 + 19008 在途查询）
 *
 * transport 与 ship 共用：调度 key 的时效管理（会话内 ~1 分钟刷新，过期拒帧）
 * 与在途部队统计（出征位占用的唯一权威来源）。
 */

import { p } from './sdk.js';
import { parse19008 } from './proto.js';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** 26022 调度 key 跟踪器：key 会话内约 1 分钟刷新，发车前须用最新值 */
class DispatchKey {
  constructor() {
    this.key = null;
    this.at = 0;
    this._waiters = [];
  }

  /** 绑定到 W2Client（自动监听 26022 推送） */
  bind(c) {
    c.onPush(26022, ({ raw }) => {
      this.key = raw;
      this.at = Date.now();
      const ws = this._waiters.splice(0);
      for (const w of ws) w();
    });
    return this;
  }

  /** 是否已有 key（可传 maxAgeMs 判断新鲜度） */
  has(maxAgeMs = Infinity) {
    return !!this.key && Date.now() - this.at <= maxAgeMs;
  }

  /** 等待一次新 key 推送（最长 ms 超时），返回是否等到 */
  async waitFresh(ms) {
    const seen = this.at;
    const t0 = Date.now();
    while (Date.now() - t0 < ms) {
      if (this.at > seen) return true;
      await sleep(120);
    }
    return this.at > seen;
  }
}

/**
 * 19008 全量在途列表（自动翻页，上限 30 页防御）。
 * @returns {Promise<Array<{reportId, startX, startY, remainTime}>>}
 */
async function fetchInFlight(c) {
  const all = [];
  let page = 1, totalPage = 1;
  while (page <= totalPage && page <= 30) {
    const r = await c.call(19008, p.cat(p.u32(50), p.u32(page), p.byte(0)));
    if (!r.ok || !r.raw) break;
    const d = parse19008(r.raw);
    totalPage = d.totalPage;
    all.push(...d.list);
    page++;
  }
  return all;
}

/** 统计指定坐标城的在途部队数（出征位占用） */
async function countSlotsAt(c, x, y) {
  const list = await fetchInFlight(c);
  return list.filter((e) => e.startX === x && e.startY === y).length;
}

export { DispatchKey, fetchInFlight, countSlotsAt };
