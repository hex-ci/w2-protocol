/**
 * proto 解析回归：3005 训练队列的真实结构
 *
 * 该解析器曾把「该厂队列条数」误当 status 标志（0=空闲/1=在产），深度为 0 的厂
 * 会把后续条目整体错位，且因响应恰好以「空厂在末尾」的形态出现而长期不报错。
 * 下面的构造数据覆盖 3 种形态：多条/单条/空厂，且都在平账意义上可验证。
 */
import test from 'node:test';
import assert from 'node:assert';
import { parse3005 } from '../lib/proto.js';

/** 按实测结构手工拼一段 3005 响应：u32 厂数 + N×(u64 bid + u32 pos + u32 条数 + 条数×28B) */
function build3005(plants) {
  const chunks = [];
  const u32 = (v) => { const b = Buffer.alloc(4); b.writeUInt32BE(v); chunks.push(b); };
  const u64 = (v) => { const b = Buffer.alloc(8); b.writeBigUInt64BE(BigInt(v)); chunks.push(b); };
  u32(plants.length);
  for (const p of plants) {
    u64(p.bid);
    u32(p.pos);
    u32(p.queue.length);
    for (const q of p.queue) {
      u64(q.tid);
      u32(q.armyId);
      u64(q.remainMs);
      u64(q.totalMs);
    }
  }
  return Buffer.concat(chunks);
}

test('3005：每厂队首一条，空厂不产出条目', () => {
  const raw = build3005([
    { bid: 100, pos: 1, queue: [
      { tid: 9001, armyId: 9, remainMs: 60000, totalMs: 120000 },
    ] },
    { bid: 200, pos: 2, queue: [{ tid: 9100, armyId: 3, remainMs: 30000, totalMs: 60000 }] },
    { bid: 300, pos: 3, queue: [] },   // 空厂：不应产出条目
  ]);
  const out = parse3005(raw);
  assert.equal(out.length, 2, '只返回在产的厂');
  assert.deepEqual(out.map((q) => q.armyId), [9, 3]);
  assert.deepEqual(out.map((q) => q.remainMs), [60000, 30000]);
  assert.equal(out[0].name, '侦察机');
});

test('3005：条数 >1 时按计数消费全部条目（服务端改行为不错位）', () => {
  const raw = build3005([
    { bid: 1, pos: 1, queue: [
      { tid: 1, armyId: 9, remainMs: 10, totalMs: 20 },
      { tid: 2, armyId: 9, remainMs: 30, totalMs: 40 },
    ] },
    { bid: 2, pos: 2, queue: [{ tid: 3, armyId: 3, remainMs: 50, totalMs: 60 }] },
  ]);
  const out = parse3005(raw);
  assert.equal(out.length, 2, '即便首厂回 2 条，也只为该厂产出 1 条（队首）');
  assert.equal(out[0].armyId, 9);
  assert.equal(out[0].depth, 2, 'depth 反映该厂本次下发的条数');
  assert.equal(out[1].armyId, 3, '第二条厂未被错位影响');
  assert.equal(out[1].remainMs, 50);
});

test('3005：空厂前置也不错位（计数=0 必须跳过 0 字节）', () => {
  const raw = build3005([
    { bid: 1, pos: 1, queue: [] },
    { bid: 2, pos: 2, queue: [{ tid: 7, armyId: 3, remainMs: 111, totalMs: 222 }] },
    { bid: 3, pos: 3, queue: [] },
    { bid: 4, pos: 4, queue: [{ tid: 8, armyId: 9, remainMs: 333, totalMs: 444 }] },
  ]);
  const out = parse3005(raw);
  assert.deepEqual(out.map((q) => q.armyId), [3, 9]);
  assert.deepEqual(out.map((q) => q.remainMs), [111, 333]);
});

test('3005：全空 / 空缓冲返回空数组', () => {
  assert.deepEqual(parse3005(build3005([{ bid: 1, pos: 1, queue: [] }])), []);
  assert.deepEqual(parse3005(Buffer.alloc(0)), []);
  assert.deepEqual(parse3005(null), []);
});

test('3005：8 厂各 1 条时逐条可读（回归：曾把条数字段当状态标志）', () => {
  // 结构与实测响应一致：4B 厂数 + 8×(16B 厂头 + 28B 队首)；实测该形态 372B
  const plants = Array.from({ length: 8 }, (_, i) => ({
    bid: 7000 + i, pos: 17 + i, queue: [{ tid: 5000 + i, armyId: 9, remainMs: 3000000 + i, totalMs: 4000000 }],
  }));
  const raw = build3005(plants);
  assert.equal(raw.length, 4 + 8 * (16 + 28), '字节数 = 4 + 8×44');
  const out = parse3005(raw);
  assert.equal(out.length, 8);
  assert.ok(out.every((q) => q.armyId === 9 && q.depth === 1));
  assert.equal(out[0].remainMs, 3000000, '队首剩余毫秒逐厂可读');
  assert.equal(out[7].remainMs, 3000007);
});
