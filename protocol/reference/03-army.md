# 军队与训练

> 14 个命令（cmd 3001 ~ 3015）

#### `cmd=3001` — army train 3001

- 常量: `Constant.PROT_ARMY_TRAIN_3001`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.buildingId` |
| 2 | int | `this.armyId` |
| 3 | int | `this.amount` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=3002` — army dismiss 3002

- 常量: `Constant.PROT_ARMY_DISMISS_3002`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.armyId` |
| 2 | int | `this.amount` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `armyId` |
| 2 | int | `amount` |

---

#### `cmd=3003` — army train abort 3003

- 常量: `Constant.PROT_ARMY_TRAIN_ABORT_3003`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.buildingID` |
| 2 | long | `this.trainingId` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=3004` — army train auto split 3004

- 常量: `Constant.PROT_ARMY_TRAIN_AUTO_SPLIT_3004`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.buildingId` |
| 2 | int | `this.armyId` |
| 3 | int | `this.amount` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=3005` — army training info 3005

- 常量: `Constant.PROT_ARMY_TRAINING_INFO_3005`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `buildingID` |
| 2 | int | `buildingPosition` |
| 3 | long | `trainingId` |
| 4 | int | `armyId` |
| 5 | long | `remainTime` |
| 6 | long | `totalTime` |

---

#### `cmd=3006` — army plant info 3006

- 常量: `Constant.PROT_ARMY_PLANT_INFO_3006`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.buildingId` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `trainingId` |
| 2 | int | `armyId` |
| 3 | int | `amount` |
| 4 | long | `remainTime` |
| 5 | long | `totalTime` |
| 6 | byte | `allowSpeedup` |
| 7 | int | `armyId` |
| 8 | int | `curAmount` |
| 9 | int | `foodRequired` |
| 10 | int | `mineralRequired` |
| 11 | int | `oilRequired` |
| 12 | int | `steelRequired` |
| 13 | int | `nuclearRequired` |
| 14 | int | `prototypeId` |
| 15 | int | `level` |
| 16 | int | `curLevel` |
| 17 | int | `techniqueId` |
| 18 | int | `level` |
| 19 | int | `curLevel` |
| 20 | int | `itemId` |
| 21 | string | `name` |
| 22 | int | `amount` |
| 23 | int | `curAmount` |
| 24 | long | `time` |
| 25 | int | `speedupItemPrice` |

---

#### `cmd=3007` — army prototype list 3007

- 常量: `Constant.PROT_ARMY_PROTOTYPE_LIST_3007`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `racial` |
| 2 | int | `armyId` |
| 3 | int | `armyType` |
| 4 | string | `armyName` |
| 5 | string | `generalName` |
| 6 | int | `hp` |
| 7 | int | `landAttack` |
| 8 | int | `airAttack` |
| 9 | int | `seaAttack` |
| 10 | int | `fortAttack` |
| 11 | int | `defence` |
| 12 | int | `moveSpeed` |
| 13 | int | `attackSpeed` |
| 14 | int | `attackRange` |
| 15 | int | `loadWeight` |
| 16 | int | `population` |
| 17 | int | `foodCost` |
| 18 | int | `oilCost` |
| 19 | int | `powerScore` |

---

#### `cmd=3008` — army wounded list 3008

- 常量: `Constant.PROT_ARMY_WOUNDED_LIST_3008`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | readDouble | `argForGoldHeal` |
| 2 | long | `dieRemaining` |
| 3 | int | `armyId` |
| 4 | int | `amount` |
| 5 | int | `healPriceGold` |

---

#### `cmd=3010` — army escaped list 3010

- 常量: `Constant.PROT_ARMY_ESCAPED_LIST_3010`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.pageNum` |
| 2 | int | `this.pageSize` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `maxKeepHours` |
| 2 | int | `escapedListItemCount` |
| 3 | int | `pageCount` |
| 4 | int | `pageNum` |
| 5 | long | `remainTimeInSecond` |
| 6 | long | `escapedId` |
| 7 | int | `armyId` |
| 8 | int | `amount` |

---

#### `cmd=3011` — army escaped detail 3011

- 常量: `Constant.PROT_ARMY_ESCAPED_DETAIL_3011`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.escapedId` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `escapedId` |
| 2 | int | `armyId` |
| 3 | long | `amount` |
| 4 | string | `price` |
| 5 | int | `diamondOwned` |
| 6 | int | `goldAmount` |
| 7 | int | `queuedCount` |
| 8 | int | `maxQueueCount` |
| 9 | int | `goldArg` |
| 10 | int | `diamondArg` |
| 11 | int | `mulArg` |
| 12 | int | `timeByGold` |
| 13 | int | `timeByDiamond` |
| 14 | byte | `hideDiamondRecallButton` |

---

#### `cmd=3012` — army escaped recall queue 3012

- 常量: `Constant.PROT_ARMY_ESCAPED_RECALL_QUEUE_3012`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `maxQueueCount` |
| 2 | int | `queuedCount` |
| 3 | int | `armyId` |
| 4 | int | `amount` |
| 5 | long | `remainTimeInSecond` |

---

#### `cmd=3013` — army recall escaped 3013

- 常量: `Constant.PROT_ARMY_RECALL_ESCAPED_3013`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.escapedId` |
| 2 | byte | `this.recallMode` |
| 3 | int | `this.price` |
| 4 | int | `this.amount` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=3014` — army heal wounded 3014

- 常量: `Constant.PROT_ARMY_HEAL_WOUNDED_3014`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | byte | `this.healMode` |
| 2 | int | `this.totalPrice` |
| 3 | int | `this.armies.length` |
| … | 循环 | `for(var e` |
| 4 | int | `i.armyId` |

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---

#### `cmd=3015` — army train speedup 3015

- 常量: `Constant.PROT_ARMY_TRAIN_SPEEDUP_3015`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.trainingId` |

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---
