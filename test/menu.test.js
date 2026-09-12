import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = fs.readFileSync(path.join(ROOT, 'scripts/w2menu.js'), 'utf8');

// 从源码解析 GROUPS 登记表（脚本顶层会自执行 render，不能直接 import）
function parseGroups() {
  const start = SRC.indexOf('const GROUPS = [');
  const end = SRC.indexOf('\n];', start);
  return new Function(`${SRC.slice(start, end + 3)}; return GROUPS;`)();
}

test('登记表覆盖 scripts/ 下全部业务脚本（除菜单自身）', () => {
  const groups = parseGroups();
  const listed = new Set(groups.flatMap((g) => g.items.map((it) => it.script)));
  const onDisk = fs.readdirSync(path.join(ROOT, 'scripts'))
    .filter((f) => f.endsWith('.js') && f !== 'w2menu.js');
  for (const f of onDisk) {
    assert.ok(listed.has(f), `scripts/${f} 未登记进菜单`);
  }
  assert.equal(listed.size, onDisk.length, '登记表有指向不存在脚本的条目');
});

test('登记表字段完整：label/script/desc 必填，dryable/needsInput 可选', () => {
  const groups = parseGroups();
  for (const g of groups) {
    assert.ok(g.title, '分组缺 title');
    assert.ok(g.items.length > 0, `分组「${g.title}」无条目`);
    for (const it of g.items) {
      assert.ok(it.key && it.label && it.script && it.desc, `条目字段不全: ${JSON.stringify(it)}`);
      if (it.needsInput) assert.ok(it.inputHint, `${it.label} 标了 needsInput 却没有 inputHint`);
    }
  }
  // key 唯一（React key 用）
  const keys = groups.flatMap((g) => g.items.map((it) => it.key));
  assert.equal(new Set(keys).size, keys.length, 'key 有重复');
});

test('dryable 标记与脚本实际是否支持 --dry 一致', () => {
  const groups = parseGroups();
  for (const g of groups) {
    for (const it of g.items) {
      const src = fs.readFileSync(path.join(ROOT, 'scripts', it.script), 'utf8');
      // 两种写法都要认：has('dry') 与 argv.includes('--dry')
      const supportsDry = /has\('dry'\)|includes\('--dry'\)/.test(src);
      if (it.dryable) {
        assert.ok(supportsDry, `${it.script} 标了 dryable 但脚本不解析 --dry`);
      } else if (supportsDry) {
        assert.fail(`${it.script} 支持 --dry 但登记表漏标 dryable`);
      }
    }
  }
});
