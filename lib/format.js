/**
 * format.js —— 终端数值与时间格式化
 *
 * 表格与文本行共用的格式化函数：数字宽度有界、单位一律中文（千/万/亿），
 * 时间输入统一毫秒。
 */

const fmtNum = (n) => Math.round(Number(n) || 0).toLocaleString('en-US');

// 紧凑格式：表格专用，宽度有界，中文单位
function fmtShort(n) {
  const num = Number(n) || 0;
  const sign = num < 0 ? '-' : '';
  const v = Math.abs(num);
  if (v >= 1e8) {
    const yi = v / 1e8;
    return `${sign}${(yi >= 100 ? yi.toFixed(1) : yi.toFixed(2))}亿`;
  }
  if (v >= 1e4) {
    const wan = v / 1e4;
    return `${sign}${(wan >= 100 ? wan.toFixed(0) : wan.toFixed(1))}万`;
  }
  if (v >= 1e3) return `${sign}${(v / 1e3).toFixed(1)}千`;
  return sign + String(v);
}

// 计数格式：兵力与人口（万以下保留精确值，便于逐点核对）
const fmtCount = (n) => (Math.abs(Number(n) || 0) >= 10000 ? fmtShort(n) : fmtNum(n));

// 储/容饱和度：超 / 满 / 百分比
function fmtSat(amount, cap) {
  if (!cap || cap <= 0) return `${fmtShort(amount)} / --`;
  const ratio = amount / cap;
  if (ratio > 1.005) return `${fmtShort(amount)} / ${fmtShort(cap)} 超`;
  if (ratio >= 0.98) return `${fmtShort(amount)} / ${fmtShort(cap)} 满`;
  return `${fmtShort(amount)} / ${fmtShort(cap)} ${Math.round(ratio * 100)}%`;
}

// 时长：毫秒 → 「X时Y分」/「Y分」；withSeconds=true 时不足 1 小时带秒（造兵进度等精细场景）
function fmtDur(ms, withSeconds = false) {
  const s = Math.ceil(Number(ms) / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}时${m}分`;
  return withSeconds ? (m > 0 ? `${m}分${s % 60}秒` : `${s}秒`) : `${m}分`;
}

// 时间戳（毫秒）→ 本地日期时间串；0/空值返回空字符串
function fmtDateTime(ms) {
  const v = Number(ms || 0);
  if (!v) return '';
  return new Date(v).toLocaleString('zh-CN', { hour12: false });
}

export {
  fmtNum,
  fmtShort,
  fmtCount,
  fmtSat,
  fmtDur,
  fmtDateTime,
};
