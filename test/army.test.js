import assert from 'node:assert/strict';
import test from 'node:test';
import { armyUnit, armyLabel, findArmy, loadArms } from '../lib/army.js';

test('armyUnit：量词随兵种变，覆盖数据表全部可训练兵种', () => {
  // 报过的问题：量词写死「架」，造卡车也叫「架」
  assert.equal(armyUnit(3), '辆', '卡车应是「辆」');
  assert.equal(armyUnit(9), '架', '侦察机应是「架」');
  assert.equal(armyUnit(15), '艘', '航母应是「艘」');
  assert.equal(armyUnit(8), '门', '火箭炮应是「门」');
  assert.equal(armyUnit(16), '名', '特种兵应是「名」');
  assert.equal(armyUnit(30), '门', '高炮应是「门」');
  assert.equal(armyUnit(5), '辆', '轻型坦克应是「辆」');
  assert.equal(armyUnit(13), '艘', '潜艇应是「艘」');
  assert.equal(armyUnit(33), '架', '截击机应是「架」');
});

test('armyUnit：数据表里的每个可训练兵种都有量词，不落兜底分支', () => {
  const arms = loadArms();
  assert.ok(arms.length > 0, '数据表应非空');
  for (const a of arms) {
    const unit = armyUnit(a.id);
    // 兜底「个」说明映射漏了该兵种，需补进 ARMY_UNITS
    assert.notEqual(unit, '个', `兵种 ${a.id}(${a.name}) 缺少量词映射`);
    assert.ok(['名', '辆', '门', '架', '艘'].includes(unit), `兵种 ${a.id} 量词异常: ${unit}`);
  }
});

test('armyUnit：未知 ID 按名称关键词兜底，再兜底「个」', () => {
  assert.equal(armyUnit(999), '个', '表外未知兵种给中性量词');
  assert.equal(armyUnit('x'), '个');
});

test('armyLabel：取短名且未知 ID 有兜底', () => {
  assert.equal(armyLabel(3), '卡车');
  assert.equal(armyLabel(9), '侦察机');
  assert.equal(armyLabel(999), '兵种999');
  assert.equal(findArmy(3).name, '卡车:GMC', '原始名保留型号后缀');
});
