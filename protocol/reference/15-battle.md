# 战斗与演习

> 26 个命令（cmd 20002 ~ 29006）

#### `cmd=20002` — report list 20002

- 常量: `Constant.PROT_REPORT_LIST_20002`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | byte | `this.pageSize` |
| 2 | int | `this.pageNum` |
| 3 | byte | `this.filteByCoordinate` |
| 4 | int | `this.tileY)` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `filteByCoordinate` |
| 2 | int | `pageNum` |
| 3 | int | `pageCount` |
| 4 | long | `reportId` |
| 5 | byte | `readed` |
| 6 | int | `reportType` |
| 7 | string | `reportTitle` |
| 8 | string | `startPlace` |
| 9 | int | `startX` |
| 10 | int | `startY` |
| 11 | string | `targetPlace` |
| 12 | int | `targetX` |
| 13 | int | `targetY` |
| 14 | long | `reportTime` |
| 15 | string | `url` |
| 16 | int | `color` |
| 17 | int | `startPlaceType` |
| 18 | string | `startIcon` |
| 19 | int | `targetPlaceType` |
| 20 | string | `targetIcon` |

---

#### `cmd=20003` — report delete 20003

- 常量: `Constant.PROT_REPORT_DELETE_20003`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.reportIds.length` |
| … | 循环 | `for(var e` |

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---

#### `cmd=20004` — report step detail 20004

- 常量: `Constant.PROT_REPORT_STEP_DETAIL_20004`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.reportId` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `htmlContent` |

---

#### `cmd=20006` — report list by type 20006

- 常量: `Constant.PROT_REPORT_LIST_BY_TYPE_20006`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.pageNum` |
| 2 | int | `this.pageSize` |
| 3 | byte | `this.reportType` |
| 4 | byte | `this.filteByCoordinate` |
| 5 | int | `this.tileY)` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `filteByCoordinate` |
| 2 | int | `pageNum` |
| 3 | int | `pageCount` |
| 4 | long | `reportId` |
| 5 | byte | `readed` |
| 6 | int | `reportType` |
| 7 | string | `reportTitle` |
| 8 | string | `startPlace` |
| 9 | int | `startX` |
| 10 | int | `startY` |
| 11 | string | `targetPlace` |
| 12 | int | `targetX` |
| 13 | int | `targetY` |
| 14 | long | `reportTime` |
| 15 | string | `url` |
| 16 | int | `color` |
| 17 | int | `startPlaceType` |
| 18 | string | `startIcon` |
| 19 | int | `targetPlaceType` |
| 20 | string | `targetIcon` |

---

#### `cmd=20011` — report detail 20011

- 常量: `Constant.PROT_REPORT_DETAIL_20011`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.reportId` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `htmlContent` |
| 2 | string | `flaundMessage` |
| 3 | byte | `targetRoleType` |
| 4 | byte | `hasInsurance` |
| 5 | byte | `hasUsedInsurance` |
| 6 | int | `lostTroopAmount` |

---

#### `cmd=20012` — broadcast battle start notify 20012

- 常量: `Constant.PROT_BROADCAST_BATTLE_START_NOTIFY_20012`
- 成功判定: `status!0`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `_status` |
| 2 | byte | `type` |
| 3 | long | `battleID` |
| 4 | string | `targetName` |
| 5 | int | `x` |
| 6 | int | `y` |
| 7 | long | `battleID` |
| 8 | byte | `battleType` |
| 9 | byte | `visibleName` |
| 10 | string | `targetName` |
| 11 | int | `x` |
| 12 | int | `y` |

---

#### `cmd=20013` — report battle list 20013

- 常量: `Constant.PROT_REPORT_BATTLE_LIST_20013`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.perPageSize` |
| 2 | int | `this.pageNum` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `pageNum` |
| 2 | int | `totalPage` |
| 3 | byte | `expeditionType` |
| 4 | long | `battleId` |
| 5 | byte | `side` |
| 6 | string | `enemyPlayerName` |
| 7 | byte | `targetType` |
| 8 | string | `targetName` |
| 9 | int | `targetX` |
| 10 | int | `targetY` |
| 11 | string | `targetIcon` |
| 12 | int | `curRound` |
| 13 | long | `remainTime` |

---

#### `cmd=20014` — report battle insurance detail 20014

- 常量: `Constant.PROT_REPORT_BATTLE_INSURANCE_DETAIL_20014`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.reportId` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `itemID` |
| 2 | int | `icon` |
| 3 | string | `name` |
| 4 | string | `description` |
| 5 | int | `curAmount` |
| 6 | int | `effectValue` |

---

#### `cmd=20015` — report battle use insurance 20015

- 常量: `Constant.PROT_REPORT_BATTLE_USE_INSURANCE_20015`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.itemId` |
| 2 | long | `this.reportId` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=21001` — battle get battle data 21001

- 常量: `Constant.PROT_BATTLE_GET_BATTLE_DATA_21001`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.battleId` |
| 2 | byte | `this.isBladeClashBattle` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `battlegroundMaxRange` |
| 2 | int | `side` |
| 3 | int | `battleType` |
| 4 | int | `currentRound` |
| 5 | string | `atkRoleName` |
| 6 | int | `atkFrontLinePosition` |
| 7 | int | `atkRacial` |
| 8 | string | `defRoleName` |
| 9 | int | `defRacial` |
| 10 | int | `defMapType` |
| 11 | int | `defFrontLinePosition` |
| 12 | int | `roundRemainTime` |
| 13 | int | `atkArmyKindCount` |
| 14 | int | `armyId` |
| 15 | int | `amount` |
| 16 | int | `position` |
| 17 | int | `action` |
| 18 | int | `moveSpeed` |
| 19 | int | `range` |
| 20 | int | `defArmyKindCount` |
| 21 | int | `armyId` |
| 22 | int | `amount` |
| 23 | int | `position` |
| 24 | int | `action` |
| 25 | int | `moveSpeed` |
| 26 | int | `range` |
| 27 | byte | `escaped` |

---

#### `cmd=21002` — battle send army action 21002

- 常量: `Constant.PROT_BATTLE_SEND_ARMY_ACTION_21002`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.battleId` |
| 2 | int | `this.sendArmyId` |
| 3 | int | `this.sendAction` |
| 4 | int | `this.sendArmyId` |
| 5 | byte | `this.isBladeClashBattle` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `responseSide` |
| 2 | int | `responseArmyId` |
| 3 | int | `responseAction` |

---

#### `cmd=21003` — battle get retreat cost 21003

- 常量: `Constant.PROT_BATTLE_GET_RETREAT_COST_21003`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.battleId` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `message` |

---

#### `cmd=21004` — battle retreat 21004

- 常量: `Constant.PROT_BATTLE_RETREAT_21004`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.battleId` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `message` |

---

#### `cmd=21005` — battle send quick msg 21005

- 常量: `Constant.PROT_BATTLE_SEND_QUICK_MSG_21005`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.battleId` |
| 2 | string | `this.sendMsg` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `message` |

---

#### `cmd=21006` — battle create simulation battle 21006

- 常量: `Constant.PROT_BATTLE_CREATE_SIMULATION_BATTLE_21006`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.simbId` |
| 2 | int | `this.level` |
| 3 | byte | `this.armies.length` |
| … | 循环 | `for(var e` |
| 4 | byte | `i.armyId` |
| 5 | int | `i.amount)}this._data.writeLong(this.officerId` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `battleId` |

---

#### `cmd=21008` — battle simulation battle status 21008

- 常量: `Constant.PROT_BATTLE_SIMULATION_BATTLE_STATUS_21008`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `simbId` |
| 2 | long | `startTime` |
| 3 | long | `endTime` |
| 4 | int | `level` |
| 5 | int | `maxLevel` |
| 6 | int | `bonusCountSelected` |
| 7 | int | `bonusCountAvailable` |
| 8 | int | `bonusRefreshFreeNextIndex` |
| 9 | int | `bonusRefreshFreeMaxIndex` |
| 10 | int | `bonusRefreshPayNextIndex` |
| 11 | string | `bonusUsing` |
| 12 | byte | `armyId` |
| 13 | string | `bonus` |
| 14 | long | `battleId` |

---

#### `cmd=21009` — battle simulation battle apply bonus 21009

- 常量: `Constant.PROT_BATTLE_SIMULATION_BATTLE_APPLY_BONUS_21009`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | byte | `this.index` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `bonusUsing` |
| 2 | byte | `armyId` |
| 3 | string | `bonus` |

---

#### `cmd=21010` — battle simulation battle refresh bonus 21010

- 常量: `Constant.PROT_BATTLE_SIMULATION_BATTLE_REFRESH_BONUS_21010`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.confirmDiamondUsage` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `armyId` |
| 2 | string | `bonus` |
| 3 | int | `diamondNeeded` |

---

#### `cmd=21011` — battle simulation battle rewards list 21011

- 常量: `Constant.PROT_BATTLE_SIMULATION_BATTLE_REWARDS_LIST_21011`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.simbId` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `simbId` |
| 2 | int | `extraReward1DaysBefore` |
| 3 | int | `extraReward2DaysBefore` |
| 4 | int | `level` |
| 5 | string | `description` |
| 6 | int | `itemID` |
| 7 | string | `name` |
| 8 | string | `description` |
| 9 | int | `icon` |
| 10 | int | `amount` |
| 11 | int | `itemID` |
| 12 | string | `name` |
| 13 | string | `description` |
| 14 | int | `icon` |
| 15 | int | `amount` |
| 16 | int | `itemID` |
| 17 | string | `name` |
| 18 | string | `description` |
| 19 | int | `icon` |
| 20 | int | `amount` |

---

#### `cmd=21012` — battle simulation battle rules 21012

- 常量: `Constant.PROT_BATTLE_SIMULATION_BATTLE_RULES_21012`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `ruleDescription` |

---

#### `cmd=29001` — blade clash submit entry list 29001 ｜ 推送

- 常量: `Constant.PROT_BLADE_CLASH_SUBMIT_ENTRY_LIST_29001`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.p1` |
| 2 | long | `this.p2` |
| 3 | long | `this.p3` |
| 4 | long | `this.p4` |
| 5 | long | `this.p5` |
| 6 | long | `this.p6` |
| 7 | long | `this.p7` |
| 8 | long | `this.p8` |
| 9 | long | `this.p9` |

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---

#### `cmd=29002` — blade clash submit troop 29002 ｜ 推送

- 常量: `Constant.PROT_BLADE_CLASH_SUBMIT_TROOP_29002`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.o1` |
| 2 | byte | `this.armies1.length` |
| … | 循环 | `for(var e` |
| 3 | byte | `i.id` |
| 4 | int | `i.count)}this._data.writeLong(this.o2` |
| 5 | byte | `this.armies2.length` |
| … | 循环 | `for(var n` |
| 6 | byte | `r.id` |
| 7 | int | `r.count)}this._data.writeLong(this.o3` |
| 8 | byte | `this.armies3.length` |
| … | 循环 | `for(var o` |
| 9 | byte | `l.id` |

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---

#### `cmd=29003` — blade clash troop list 29003 ｜ 推送

- 常量: `Constant.PROT_BLADE_CLASH_TROOP_LIST_29003`

**请求参数**: 无（类未定义 encode）

**推送数据**（按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `joinedEvent` |
| 2 | long | `playerId` |
| 3 | string | `name` |
| 4 | int | `avatar` |
| 5 | int | `racial` |
| 6 | long | `influence` |
| 7 | byte | `troopConfigured` |
| 8 | long | `mainOfficerId` |
| 9 | byte | `id` |
| 10 | int | `count` |

---

#### `cmd=29004` — blade clash match 29004 ｜ 推送

- 常量: `Constant.PROT_BLADE_CLASH_MATCH_29004`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | byte | `this.update` |
| 2 | long | `this.trainOfficerId` |
| 3 | byte | `this.trainMode` |
| 4 | byte | `this.idlePopPercent` |
| 5 | byte | `this.timesAddPopAfterTrain` |
| 6 | string | `this.cityConfig` |
| 7 | byte | `this.autoTrain)` |

**推送数据**（按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `enemyAllianceName` |

---

#### `cmd=29005` — blade clash get battle 29005 ｜ 推送

- 常量: `Constant.PROT_BLADE_CLASH_GET_BATTLE_29005`

**请求参数**: 无（类未定义 encode）

**推送数据**（按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `battleId` |
| 2 | byte | `battleRound` |

---

#### `cmd=29006` — blade clash rules and rewards 29006 ｜ 推送

- 常量: `Constant.PROT_BLADE_CLASH_RULES_AND_REWARDS_29006`

**请求参数**: 无（类未定义 encode）

**推送数据**（按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `rules` |
| 2 | string | `name` |
| 3 | string | `description` |
| 4 | int | `icon` |
| 5 | int | `amount` |
| 6 | string | `name` |
| 7 | string | `description` |
| 8 | int | `icon` |
| 9 | int | `amount` |
| 10 | string | `name` |
| 11 | string | `description` |
| 12 | int | `icon` |
| 13 | int | `amount` |
| 14 | string | `name` |
| 15 | string | `description` |
| 16 | int | `icon` |
| 17 | int | `amount` |

---
