import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getTopologyFingerprint } from '../lib/topology.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TRANSPORT_SRC = fs.readFileSync(path.join(ROOT, 'scripts/w2transport.js'), 'utf8');

test('空间指纹：只由 cityId 与坐标决定（城址不变则指纹不变）', () => {
  const cities = [
    { cityId: '2', x: 100, y: 200, name: '城B' },
    { cityId: '1', x: 10, y: 20, name: '城A' },
  ];
  const fp = getTopologyFingerprint(cities);
  // 按 cityId 排序，保证稳定序列化
  assert.deepEqual(Object.keys(fp), ['1', '2']);
  assert.deepEqual(fp['1'], [10, 20]);

  // 城池顺序、名称、其它属性变化不影响指纹
  const reordered = [
    { cityId: '1', x: 10, y: 20, name: '改名了', P: 999 },
    { cityId: '2', x: 100, y: 200, name: '城B', stock: {} },
  ];
  assert.deepEqual(getTopologyFingerprint(reordered), fp, '非坐标字段变化不应影响指纹');

  // 坐标变化必须改变指纹（迁城才该失效重算）
  const moved = [
    { cityId: '1', x: 11, y: 20 },
    { cityId: '2', x: 100, y: 200 },
  ];
  assert.notDeepEqual(getTopologyFingerprint(moved), fp, '迁城必须改变指纹');

  // 增减城也必须改变指纹
  assert.notDeepEqual(getTopologyFingerprint([...cities, { cityId: '3', x: 0, y: 0 }]), fp);
});

test('中心仓冻结：脚本里缓存优先于重算，且提供显式重算开关', () => {
  // 冻结的核心行为：指纹命中且缓存有该资源仓 → 直接复用（不进入评分重算）
  assert.match(TRANSPORT_SRC, /RECOMPUTE_HUBS/, '应有 --recompute-hubs 显式重算开关');
  assert.match(TRANSPORT_SRC, /cachedTopology\?\.superHubs/, '应读取缓存的 superHubs 做复用判断');
  assert.match(TRANSPORT_SRC, /中心仓冻结/, '复用时应输出说明，让用户知道是复用而非重算');
  assert.match(TRANSPORT_SRC, /中心仓重算/, '重算时应输出说明');

  // 复用分支必须出现在评分计算（sort）之前——否则等于没冻结
  const freezeAt = TRANSPORT_SRC.indexOf('cachedTopology?.superHubs');
  const scoreAt = TRANSPORT_SRC.indexOf('const flowWeight');
  assert.ok(freezeAt > 0 && scoreAt > 0 && freezeAt < scoreAt, '复用判断必须早于评分计算');
});
