#!/usr/bin/env node

/**
 * w2signin.js —— 每日任务自动领取
 *
 * 基于 lib/sdk.js 的业务脚本示例：只关心业务，不接触底层帧/加密/配对。
 *
 * 流程: connect（内置 hello + 登录）→ 查询钻石 → [10001] 查询任务
 *      → [10003] 逐项领取 → 汇报钻石变化
 *
 * 用法:
 *   node scripts/w2signin.js              领取 .env W2_TASK_IDS 配置的每日任务
 *   node scripts/w2signin.js --id 5042    只领指定任务
 *   node scripts/w2signin.js --dry        只查询不领取
 */

import config from '../lib/config.js';
import { W2Client, p } from '../lib/sdk.js';

const argv = process.argv.slice(2);
const arg = (n, d) => {
  const i = argv.indexOf('--' + n);
  return i >= 0 && i + 1 < argv.length ? argv[i + 1] : d;
};
const has = (n) => argv.includes('--' + n);

const isPositiveU32 = (value) => /^[1-9]\d*$/.test(value) && Number(value) <= 0xffffffff;
const onlyArg = arg('id', '');
if (onlyArg && !isPositiveU32(onlyArg)) {
  console.log('--id 必须是正整数任务 ID');
  process.exit(1);
}
const invalidTask = config.tasks.find((id) => !isPositiveU32(id));
if (invalidTask) {
  console.log(`W2_TASK_IDS 含无效任务 ID: ${invalidTask}`);
  process.exit(1);
}

// 10002 任务详情 schema：已领取/未上架的任务服务端也返回名称，用于展示
const TASK_DETAIL_SCHEMA = {
  fields: [['task_id', 'u32'], ['task_name', 'string']],
};
async function taskName(c, id) {
  try {
    const r = await c.call(10002, p.u32(id), TASK_DETAIL_SCHEMA);
    if (r.ok && r.task_name) return r.task_name;
  } catch (e) { /* 查不到名字时兜底 */ }
  return `任务${id}`;
}

// ---------- 1005 玩家核心信息 schema（钻石数等，字段表见 reference/01-account.md） ----------
const PLAYER_CORE_SCHEMA = {
  fields: [
    ['game_status', 'u32'],
    ['diamond_owned', 'u32'],
    ['active_city_id', 'u64'],
    ['total_city_count', 'u32'],
    ['total_population_count', 'u32'],
    ['total_officer_count', 'u32'],
    ['newbie_protect', 'u32'],
    ['city_img', 'string'],
    ['nuclear_count', 'u32'],
    ['helped_count', 'u32'],
    ['max_help_count', 'u32'],
    ['res_building_count', 'u32'],
    ['vip', 'u32'],
    ['diamond_charged', 'u64'],
  ],
};

// ---------- 10001 响应 schema（字段表见 reference/09-task.md） ----------
const TASK_LIST_SCHEMA = {
  skip: 1,               // status 后 1 字节回显 taskType
  list: true,
  item: [
    ['task_id', 'u32'],
    ['task_name', 'string'],
    ['completed', 'u8'],
    ['readed', 'u8'],
    ['pri', 'u32'],
    ['main_task', 'u8'],
  ],
  tail: [['notice', 'string']],
};

// 10006 新手任务响应无稳定字段表，按客户端手工解析：
// status 后 1 字节 taskType 回显 + u32 计数 + 条目(task_id u32/name/completed/readed) + notice
function parseRookieList(raw) {
  let off = 0;
  off += 1;                                  // 客户端 decode 读取但未使用的 1 字节
  const u32 = () => { const v = raw.readUInt32BE(off); off += 4; return v; };
  const str = () => { const L = u32(); const s = raw.subarray(off, off + L).toString('utf8'); off += L; return s; };
  const count = u32();
  const tasks = [];
  for (let i = 0; i < count; i++) {
    const task_id = u32();
    tasks.push({ task_id, task_name: str(), completed: raw[off++], readed: raw[off++] });
  }
  return { tasks, notice: str() };
}

const CLAIM_SCHEMA = {
  list: true,
  item: [
    ['rc_name', 'string'],
    ['rc_type', 'u32'],
    ['rc_image', 'string'],
    ['rc_amount', 'u32'],
    ['is_type_consume', 'u8'],
  ],
};

(async function main() {
  const lp = config.loginParams();
  const gs = config.gameServer();
  if (!gs || !lp) {
    console.log('尚未登录：请先完成登录');
    process.exit(1);
  }

  const c = new W2Client({ host: gs.host, port: gs.port, loginParams: lp });
  c.onPush(26003, () => { /* 任务/活动提示推送，此处仅静默 */ });

  try {
    await c.connect();
  } catch (e) {
    console.log('连接失败:', e.message);
    process.exit(1);
  }

  // 领取前钻石数
  let before = null;
  try {
    const r = await c.call(1005, Buffer.alloc(0), PLAYER_CORE_SCHEMA);
    before = r.diamond_owned;
    console.log(`当前钻石: ${before}`);
  } catch (e) {
    console.log('钻石查询失败:', e.message, '（继续执行）');
  }

  const only = onlyArg;
  const todo = only ? [Number(only)] : config.tasks.map(Number);
  if (!todo.length) {
    console.log('\n没有配置每日任务（.env 里 W2_TASK_IDS 为空）');
    c.close();
    return;
  }

  // [10001] 查询「日常军事」分类，展示当前任务状态
  try {
    const r = await c.call(10001, p.byte(0), TASK_LIST_SCHEMA);
    if (r.ok && r.items && r.items.length) {
      console.log('\n今日任务:');
      r.items.slice(0, 20).forEach((t) => {
        const mark = t.completed === 1 ? '已完成' : '未完成';
        console.log(`   ${mark}  ${t.task_name}`);
      });
    }
    // 10006 新手任务按客户端手工解析展示（schema 缺省 → SDK 返回 raw）
    try {
      const rookie = await c.call(10006, p.byte(4));
      if (rookie.ok && rookie.raw && rookie.raw.length) {
        const parsed = parseRookieList(rookie.raw);
        if (parsed.tasks.length) {
          console.log('\n新手任务:');
          parsed.tasks.slice(0, 20).forEach((t) => {
            const mark = t.completed === 1 ? '已完成' : '未完成';
            console.log(`   ${mark}  ${t.task_name}`);
          });
        }
      }
    } catch (e) { /* 新手任务仅展示，失败不影响领取 */ }
  } catch (e) {
    console.log('任务列表查询失败:', e.message, '（不影响领取，继续）');
  }

  // 解析各任务的业务名（接口获取，失败兜底「任务<id>」）
  const nameOf = {};
  for (const id of todo) nameOf[id] = await taskName(c, id);

  if (has('dry')) {
    console.log(`\n--dry 模式，将要尝试领取: ${todo.map((i) => nameOf[i]).join('、')}`);
    c.close();
    return;
  }

  console.log(`\n开始领取: ${todo.map((i) => nameOf[i]).join('、')}`);
  let claimed = 0;
  for (const id of todo) {
    const name = nameOf[id];
    try {
      const r = await c.call(10003, p.u32(id), CLAIM_SCHEMA);
      if (r.ok && r.items && r.items.length) {
        claimed++;
        r.items.forEach((x) => console.log(`   ★ ${name}: ${x.rc_name} ×${x.rc_amount}`));
      } else if (r.ok) {
        console.log(`   ${name}: 今日已领取`);
      } else {
        console.log(`   ${name}: 无法领取${r.message ? '（' + r.message + '）' : ''}`);
      }
    } catch (e) {
      console.log(`   ${name}: 请求失败（${e.message}）`);
    }
  }

  // 领取后钻石数与变化
  let after = null;
  try {
    const r = await c.call(1005, Buffer.alloc(0), PLAYER_CORE_SCHEMA);
    after = r.diamond_owned;
  } catch (e) { /* 保持 null */ }

  console.log('\n—— 结果 ——');
  console.log(`领取成功: ${claimed} 项`);
  if (before != null && after != null) {
    const diff = after - before;
    console.log(`钻石: ${before} → ${after}（${diff >= 0 ? '+' : ''}${diff}）`);
  } else if (after != null) {
    console.log(`当前钻石: ${after}`);
  }

  c.close();
})();
