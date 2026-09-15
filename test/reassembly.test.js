import assert from 'node:assert/strict';
import test from 'node:test';
import { TcpReassembler, W2FrameReassembler } from '../lib/w2.js';
import { buildFrame, p } from '../lib/w2build.js';

function packet(seq, payload, flags = 0) {
  return { proto: 'TCP', src: '192.0.2.1', sport: 1000, dst: '192.0.2.2', dport: 8083, seq, flags, payload };
}

test('TCP and protocol reassembly preserve split and out-of-order frames', () => {
  const frame = buildFrame(3, 100001, 10003, p.u32(5042));
  const tcp = new TcpReassembler();
  const first = tcp.push(packet(10, frame.subarray(0, 20)));
  const second = tcp.push(packet(30, frame.subarray(20)));
  assert.deepEqual(Buffer.concat([first, second]), frame);

  const ordered = new TcpReassembler();
  const syn = ordered.push(packet(9, Buffer.alloc(0), 0x02));
  const tail = ordered.push(packet(30, frame.subarray(20)));
  const head = ordered.push(packet(10, frame.subarray(0, 20)));
  assert.deepEqual(syn, Buffer.alloc(0));
  assert.deepEqual(tail, Buffer.alloc(0));
  assert.deepEqual(head, frame);

  const unseen = new TcpReassembler();
  const unseenTail = unseen.push(packet(30, frame.subarray(20)));
  const unseenHead = unseen.push(packet(10, frame.subarray(0, 20)));
  assert.deepEqual(unseenTail, Buffer.alloc(0));
  assert.deepEqual(unseenHead, frame);

  const splitter = new W2FrameReassembler('out');
  assert.equal(splitter.push(frame.subarray(0, 20)).length, 0);
  assert.equal(splitter.push(frame.subarray(20))[0].cmd, 10003);
});
