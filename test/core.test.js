import assert from 'node:assert/strict';
import net from 'node:net';
import test from 'node:test';
import { cjkStrings, decode, framesIn, framesOut } from '../lib/w2.js';
import { aesDecrypt, buildFrame, p } from '../lib/w2build.js';
import { W2Client } from '../lib/sdk.js';

function wist(sid, cmd, status, payload = Buffer.alloc(0)) {
  const body = Buffer.concat([Buffer.alloc(4), Buffer.from([status]), payload]);
  body.writeUInt32BE(cmd, 0);
  const frame = Buffer.alloc(12 + body.length);
  frame.write('WIST', 0, 'latin1');
  frame.writeUInt32BE(sid, 4);
  frame.writeUInt32BE(body.length, 8);
  body.copy(frame, 12);
  return frame;
}

function parseChoiceRequests(chunk) {
  const requests = [];
  for (let off = 0; off + 16 <= chunk.length;) {
    const len = chunk.readUInt32BE(off + 8);
    if (off + 12 + len > chunk.length) break;
    requests.push({ sid: chunk.readUInt32BE(off + 4), cmd: chunk.readUInt32BE(off + 12) });
    off += 12 + len;
  }
  return requests;
}

async function listen(handler, options = {}) {
  const server = net.createServer(options, handler);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  return server;
}

async function close(server) {
  await new Promise((resolve) => server.close(resolve));
}

test('frame builder validates inputs and roundtrips AES payload', () => {
  const params = p.cat(p.u64('7000000000001234'), p.str('中文'), p.u32(42));
  const frame = buildFrame(7, 884422, 10003, params);
  assert.deepEqual(aesDecrypt(frame.subarray(37), 884422), params);
  assert.throws(() => p.byte(256), /0 ~ 255/);
  assert.throws(() => p.u32(Number.NaN), /整数/);
  assert.throws(() => p.u64('-1'), /无符号/);
  assert.throws(() => p.u64(Number.MAX_SAFE_INTEGER + 1), /安全整数/);
});

test('offline splitters wait for full declared frames', () => {
  const out = buildFrame(1, 100001, 6);
  assert.equal(framesOut(out.subarray(0, 40)).length, 0);
  assert.equal(framesOut(out).length, 1);
  const inbound = wist(100001, 6, 1);
  assert.equal(framesIn(inbound.subarray(0, 14)).length, 0);
  assert.equal(framesIn(inbound).length, 1);
});

test('SLL2 and Chinese string extraction decode correctly', () => {
  const ip = Buffer.alloc(28);
  ip[0] = 0x45;
  ip.writeUInt16BE(28, 2);
  ip[8] = 64;
  ip[9] = 17;
  ip.set([192, 0, 2, 1], 12);
  ip.set([192, 0, 2, 2], 16);
  ip.writeUInt16BE(1000, 20);
  ip.writeUInt16BE(2000, 22);
  ip.writeUInt16BE(8, 24);
  const sll2 = Buffer.alloc(20 + ip.length);
  sll2.writeUInt16BE(0x0800, 0);
  ip.copy(sll2, 20);
  assert.equal(decode(sll2, 276)?.proto, 'UDP');
  assert.deepEqual(cjkStrings(Buffer.from('中文测试', 'utf8')), ['中文测试']);
});

test('SDK rejects failed login instead of opening an unauthenticated session', async () => {
  const server = await listen((socket) => socket.on('data', (chunk) => {
    const sid = chunk.readUInt32BE(25);
    const cmd = chunk.readUInt32BE(33);
    socket.write(wist(sid, cmd, 0xff));
  }));
  const client = new W2Client({
    host: '127.0.0.1',
    port: server.address().port,
    autoHello: false,
    timeout: 500,
    loginParams: {
      userId: '123', username: 'test', wst: 'test', installID: 'install', appKey: 'app',
    },
  });
  await assert.rejects(client.connect(), /登录失败/);
  client.close();
  await close(server);
});

test('SDK pairs concurrent same-command responses by session ID', async () => {
  const server = await listen((socket) => {
    const requests = [];
    socket.on('data', (chunk) => {
      requests.push(...parseChoiceRequests(chunk));
      if (requests.length === 2) {
        socket.write(wist(requests[1].sid, requests[1].cmd, 1, Buffer.from('second')));
        socket.write(wist(requests[0].sid, requests[0].cmd, 1, Buffer.from('first')));
      }
    });
  });
  const client = new W2Client({ host: '127.0.0.1', port: server.address().port, mode: 'choice', interRequest: 0 });
  await client.connect();
  const [first, second] = await Promise.all([client.call(77), client.call(77)]);
  assert.equal(first.raw.toString(), 'first');
  assert.equal(second.raw.toString(), 'second');
  client.close();
  await close(server);
});

test('SDK parses choice schema and accepts documented status variants', async () => {
  const server = await listen((socket) => socket.on('data', (chunk) => {
    const { sid, cmd } = parseChoiceRequests(chunk)[0];
    const payload = Buffer.alloc(4);
    payload.writeUInt32BE(42);
    socket.write(wist(sid, cmd, 2, payload));
  }));
  const client = new W2Client({ host: '127.0.0.1', port: server.address().port, mode: 'choice', interRequest: 0 });
  await client.connect();
  const strict = await client.call(5);
  assert.equal(strict.ok, false);
  const parsed = await client.call(5, Buffer.alloc(0), { fields: [['answer', 'u32']] }, { okStatuses: [1, 2] });
  assert.equal(parsed.ok, true);
  assert.equal(parsed.answer, 42);
  client.close();
  await close(server);
});

test('SDK ignores late events from a closed prior socket after reconnect', async () => {
  let connections = 0;
  const server = await listen((socket) => {
    connections++;
    if (connections === 1) {
      socket.on('end', () => setTimeout(() => socket.destroy(), 20));
      return;
    }
    socket.on('data', (chunk) => {
      const { sid, cmd } = parseChoiceRequests(chunk)[0];
      setTimeout(() => socket.write(wist(sid, cmd, 1, Buffer.from('ok'))), 50);
    });
    socket.on('end', () => socket.end());
  }, { allowHalfOpen: true });
  const client = new W2Client({ host: '127.0.0.1', port: server.address().port, mode: 'choice', interRequest: 0, timeout: 500 });
  await client.connect();
  client.close();
  await client.connect();
  const result = await client.call(77);
  assert.equal(result.raw.toString(), 'ok');
  client.close();
  await close(server);
});

test('SDK rejects a pending request when a peer closes cleanly', async () => {
  const server = await listen((socket) => socket.on('data', () => socket.end()));
  const client = new W2Client({ host: '127.0.0.1', port: server.address().port, mode: 'choice', timeout: 5000 });
  await client.connect();
  await assert.rejects(client.call(77), /连接被服务器关闭|连接已关闭/);
  await close(server);
});
