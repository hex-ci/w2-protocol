/**
 * table.js —— 宽度感知的终端表格排版
 *
 * 中英文混排时按显示宽度补齐（CJK/全角字符记 2 列），供各业务脚本统一使用，
 * 避免 padEnd/padStart 按字符数补空格导致含中文的行整行错位。
 *
 * 一次性表格用 renderTable；需要在行间插入其他输出（如逐行执行状态）时，
 * 先用 computeWidths 算列宽，再逐行 formatRow。
 */

function displayWidth(str) {
  let w = 0;
  for (let i = 0; i < str.length; i++) {
    const code = str.codePointAt(i);
    if (code > 0xffff) i++;
    if (
      (code >= 0x1100 && code <= 0x115f) ||
      (code >= 0x2e80 && code <= 0xa4cf && code !== 0x303f) ||
      (code >= 0xac00 && code <= 0xd7a3) ||
      (code >= 0xf900 && code <= 0xfaff) ||
      (code >= 0xfe10 && code <= 0xfe19) ||
      (code >= 0xfe30 && code <= 0xfe6f) ||
      (code >= 0xff00 && code <= 0xff60) ||
      (code >= 0xffe0 && code <= 0xffe6) ||
      (code >= 0x20000 && code <= 0x3fffd)
    ) {
      w += 2;
    } else {
      w += 1;
    }
  }
  return w;
}

function padCell(str, width, align = 'left') {
  const s = String(str);
  const gap = width - displayWidth(s);
  if (gap <= 0) return s;
  return align === 'right' ? ' '.repeat(gap) + s : s + ' '.repeat(gap);
}

// 列宽取「声明最小宽」与「表头/全部单元格实际宽」的最大值，任何数值都不会顶开表格
function computeWidths(columns, rows, footer = null) {
  const allRows = footer ? [...rows, footer] : rows;
  return columns.map((col, i) => {
    const cells = [col.header, ...allRows.map((r) => String(r[i] ?? ''))];
    return Math.max(col.width || 0, ...cells.map(displayWidth));
  });
}

function formatRow(cells, columns, widths) {
  return cells.map((cell, i) => padCell(cell, widths[i], columns[i].align || 'left')).join('  ');
}

function renderTable(columns, rows, footer = null) {
  const widths = computeWidths(columns, rows, footer);
  const line = (cells) => formatRow(cells, columns, widths);
  const header = line(columns.map((c) => c.header));
  const sep = '─'.repeat(displayWidth(header));
  const out = [header, sep];
  for (const row of rows) out.push(line(row));
  if (footer) {
    out.push(sep);
    out.push(line(footer));
  }
  out.push(sep);
  return out.join('\n');
}

export {
  displayWidth,
  padCell,
  computeWidths,
  formatRow,
  renderTable,
};
