/**
 * army.js —— 兵种数据表加载与查询
 *
 * 数据源是 protocol/army.json（tools/genarmy.js 从 3006/3007 导出，入库可查）。
 * 为什么单独一个模块而不是塞进 formula.js：formula.js 定位是纯函数零依赖，
 * 读文件属于 I/O；这里只做「读表 + 查询」，计算仍回 formula.js。
 *
 * 口径要点（实测）：
 *   - cost（单价）全域一致，是单一真值，可直接用于资源上限/需求层计算；
 *   - 单件耗时**按城不同**（受城内加成影响，实测 16389~33844ms，差 2 倍），
 *     army.json 的 baseTimeMs/timeRangeMs 仅供参考，运行期必须逐城读 3006；
 *   - 3006 之外的兵种（3007 的 17~21：碉堡/榴弹炮/反坦克炮/防空炮/围墙）不可训练，表中不存在。
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SCOUT_ARMY_ID } from './formula.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TABLE_PATH = path.join(ROOT, 'protocol', 'army.json');

let cache = null;

/** 加载兵种数据表（首次读盘后缓存）；文件缺失或损坏时抛错并给出重生成提示 */
function loadArms() {
  if (cache) return cache;
  if (!fs.existsSync(TABLE_PATH)) {
    throw new Error(`兵种数据表缺失：${path.relative(ROOT, TABLE_PATH)}（运行 npm run genarmy 生成）`);
  }
  const data = JSON.parse(fs.readFileSync(TABLE_PATH, 'utf8'));
  if (!Array.isArray(data.arms) || !data.arms.length) {
    throw new Error('兵种数据表内容异常：arms 为空（运行 npm run genarmy 重新生成）');
  }
  cache = data.arms;
  return cache;
}

/** 按 ID 取兵种；找不到返回 null（调用方自行决定兜底或报错） */
function findArmy(armyId) {
  return loadArms().find((a) => a.id === armyId) || null;
}

/** 默认兵种（侦察机）的 ID 与规格 */
const DEFAULT_ARMY_ID = SCOUT_ARMY_ID;

/**
 * 校验兵种 ID：非法时抛错并列出可用兵种，用于脚本参数入口。
 * @returns {object} 兵种记录
 */
function requireArmy(armyId) {
  const arm = findArmy(armyId);
  if (!arm) {
    const ids = loadArms().map((a) => `${a.id}=${a.name}`).join('  ');
    throw new Error(`未知兵种 ID ${armyId}。可训练兵种：${ids}`);
  }
  return arm;
}

/** 兵种 ID → 显示名（取短名，去掉冒号后的型号后缀）；未知返回「兵种<id>」 */
function armyLabel(armyId) {
  const arm = findArmy(armyId);
  if (!arm) return `兵种${armyId}`;
  return String(arm.name).split(':')[0];
}

/**
 * 兵种量词（展示层常识，协议与数据表均不含此字段）：按 ID 精确维护。
 * 不按类别粗分——步兵与坦克同属陆军，量词却是「名」与「辆」两种。
 */
const ARMY_UNITS = {
  1: '名', 2: '名', 3: '辆', 4: '辆', 5: '辆', 6: '辆', 7: '门', 8: '门',
  9: '架', 10: '架', 11: '架',
  12: '艘', 13: '艘', 14: '艘', 15: '艘', 16: '名',
  30: '门', 31: '辆', 32: '架', 33: '架',
};

/** 兵种 ID → 计数单位（如侦察机「架」、卡车「辆」）；未知 ID 按名称关键词兜底，再兜底「个」 */
function armyUnit(armyId) {
  const unit = ARMY_UNITS[armyId];
  if (unit) return unit;
  const name = findArmy(armyId)?.name || '';
  if (/机/.test(name)) return '架';
  if (/[舰艇母]/.test(name)) return '艘';
  if (/[车坦卡]/.test(name)) return '辆';
  if (/炮/.test(name)) return '门';
  if (/兵/.test(name)) return '名';
  return '个';
}

export {
  DEFAULT_ARMY_ID,
  loadArms,
  findArmy,
  requireArmy,
  armyLabel,
  armyUnit,
  TABLE_PATH,
};
