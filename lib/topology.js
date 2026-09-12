/**
 * topology.js —— 地缘协作组 + 中心仓缓存的共享逻辑
 *
 * 拓扑（协作组）与中心仓推导属无人值守机制：空间指纹（城池坐标集合）变更即失效重算。
 * 中心仓推导结果随缓存落盘（superHubs: 资源 → cityId），供 status / ship 等脚本读取展示，
 * 保证跨脚本看到同一口径的仓选结果。
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { distance } from './formula.js';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const ROUTE_CACHE_FILE = path.join(ROOT, '.transport_route.local.json');

/** 空间指纹：{ cityId: [x, y] }（按 cityId 排序，保证稳定序列化） */
function getTopologyFingerprint(cities) {
  const fp = {};
  for (const c of [...cities].sort((a, b) => (BigInt(a.cityId) > BigInt(b.cityId) ? 1 : -1))) {
    fp[c.cityId] = [c.x, c.y];
  }
  return fp;
}

/** 读取拓扑缓存（缺失/损坏返回 null） */
function readTopologyCache() {
  try {
    if (!fs.existsSync(ROUTE_CACHE_FILE)) return null;
    return JSON.parse(fs.readFileSync(ROUTE_CACHE_FILE, 'utf8'));
  } catch (e) {
    return null;
  }
}

/**
 * 校验缓存与当前城池空间指纹是否一致。
 * @returns 命中返回缓存对象，否则返回 null（调用方应重算）
 */
function checkCachedTopology(cities, { cleanRoute = false, log = console.log } = {}) {
  if (cleanRoute) return null;
  const cached = readTopologyCache();
  if (!cached) return null;
  const currentFp = getTopologyFingerprint(cities);
  const fpMatch = Object.keys(currentFp).length === Object.keys(cached.fingerprint || {}).length &&
    Object.entries(currentFp).every(([cid, [x, y]]) => {
      const cachedPos = cached.fingerprint[cid];
      return cachedPos && cachedPos[0] === x && cachedPos[1] === y;
    });
  if (fpMatch && cached.clusters && cached.version === 2) {
    return cached;
  }
  if (fpMatch && cached.clusters) {
    log('检测到拓扑规则升级（v2 特化模型），重新计算协作组...');
  } else {
    log('检测到城池空间指纹发生变化（存在迁城/增减城），需重新推导协作拓扑...');
  }
  return null;
}

/** 地缘协作组：按距离 <= 75 格自适应分群 */
function computeClusters(cities) {
  const visited = new Set();
  const clusters = [];
  for (const c of cities) {
    if (visited.has(c.cityId)) continue;
    const cluster = [c];
    visited.add(c.cityId);
    for (const other of cities) {
      if (!visited.has(other.cityId)) {
        if (cluster.some((m) => distance(other, m) < 75)) {
          cluster.push(other);
          visited.add(other.cityId);
        }
      }
    }
    clusters.push(cluster.map((m) => m.cityId));
  }
  return clusters;
}

/** 落盘拓扑 + 中心仓（superHubs 存 cityId 字符串；失败不上抛，不影响主流程） */
function writeTopologyCache({ cities, clusters, superHubs }) {
  try {
    const topology = {
      version: 2,
      fingerprint: getTopologyFingerprint(cities),
      clusters,
      superHubs: Object.fromEntries(
        Object.entries(superHubs).map(([k, v]) => [k, v ? v.cityId : null])
      ),
      computedAt: Date.now(),
    };
    fs.writeFileSync(ROUTE_CACHE_FILE, JSON.stringify(topology, null, 2) + '\n');
    return true;
  } catch (e) {
    return false;
  }
}

export {
  ROUTE_CACHE_FILE,
  getTopologyFingerprint,
  readTopologyCache,
  checkCachedTopology,
  computeClusters,
  writeTopologyCache,
};
