# 商城与支付

> 23 个命令（cmd 7001 ~ 12048）

#### `cmd=7001` — shop buy item 7001

- 常量: `Constant.PROT_SHOP_BUY_ITEM_7001`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.merchandiseId` |
| 2 | int | `this.buyCount` |
| 3 | int | `-1` |
| 4 | byte | `this.buyType` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `diamondOrItemRemainig` |
| 2 | int | `ticketItemId` |

---

#### `cmd=7003` — shop redeem code use 7003

- 常量: `Constant.PROT_SHOP_REDEEM_CODE_USE_7003`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | string | `this.redeemCode` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `rcType` |
| 2 | string | `rcImage` |
| 3 | string | `rcName` |
| 4 | int | `rcAmount` |

---

#### `cmd=7004` — shop items normal 7004

- 常量: `Constant.PROT_SHOP_ITEMS_NORMAL_7004`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.type` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `type` |
| 2 | int | `diamondOwned` |
| 3 | byte | `specicalTypeFlag` |
| 4 | byte | `sellTag` |
| 5 | int | `merchandiseId` |
| 6 | int | `itemID` |
| 7 | byte | `endTimeFlag` |
| 8 | long | `itemEndTime` |
| 9 | string | `name` |
| 10 | string | `description` |
| 11 | int | `icon` |
| 12 | byte | `level` |
| 13 | int | `amount` |
| 14 | int | `ticketItemId` |
| 15 | int | `price` |
| 16 | int | `originalPrice` |
| 17 | int | `pri` |
| 18 | int | `suitEquipmentId` |
| 19 | string | `suitEquipmentDescription` |
| 20 | byte | `limitMode` |
| 21 | int | `buyRemainCount` |
| 22 | int | `buyItemsLeft` |
| 23 | string | `notice` |

---

#### `cmd=7007` — shop restrict detail 7007

- 常量: `Constant.PROT_SHOP_RESTRICT_DETAIL_7007`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.limitMode` |
| 2 | int | `this.merchandiseId` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `limitMode` |
| 2 | int | `itemID` |
| 3 | string | `name` |
| 4 | string | `description` |
| 5 | int | `icon` |
| 6 | int | `price` |
| 7 | long | `refreshRemainTime` |
| 8 | int | `buyRemainCount` |
| 9 | int | `buyItemsLeft` |

---

#### `cmd=7008` — shop buy restrict item 7008

- 常量: `Constant.PROT_SHOP_BUY_RESTRICT_ITEM_7008`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.limitMode` |
| 2 | int | `this.merchandiseId` |
| 3 | int | `this.buyCount` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `diamondOrItemRemainig` |
| 2 | int | `ticketItemId` |

---

#### `cmd=7009` — shop type list 7009

- 常量: `Constant.PROT_SHOP_TYPE_LIST_7009`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `type` |
| 2 | string | `name` |

---

#### `cmd=7010` — shop items for simulation battle 7010

- 常量: `Constant.PROT_SHOP_ITEMS_FOR_SIMULATION_BATTLE_7010`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.type` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `type` |
| 2 | int | `diamondOwned` |
| 3 | int | `itemID` |
| 4 | int | `amount` |
| 5 | byte | `specicalTypeFlag` |
| 6 | byte | `sellTag` |
| 7 | int | `merchandiseId` |
| 8 | int | `itemID` |
| 9 | byte | `endTimeFlag` |
| 10 | long | `itemEndTime` |
| 11 | string | `name` |
| 12 | string | `description` |
| 13 | int | `icon` |
| 14 | byte | `level` |
| 15 | int | `amount` |
| 16 | int | `ticketItemId` |
| 17 | int | `price` |
| 18 | int | `originalPrice` |
| 19 | int | `pri` |
| 20 | int | `suitEquipmentId` |
| 21 | string | `suitEquipmentDescription` |
| 22 | byte | `limitMode` |
| 23 | int | `buyRemainCount` |
| 24 | int | `buyItemsLeft` |
| 25 | string | `notice` |

---

#### `cmd=12001` — equipment list 12001

- 常量: `Constant.PROT_EQUIPMENT_LIST_12001`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.pageNum` |
| 2 | int | `this.pageSize` |
| 3 | string | `this.keyword` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `diamondOwned` |
| 2 | int | `pageNum` |
| 3 | int | `pageCount` |
| 4 | int | `totalCount` |
| 5 | long | `equipmentId` |
| 6 | int | `curAmount` |
| 7 | string | `name` |
| 8 | string | `description` |
| 9 | string | `useDescription` |
| 10 | byte | `position` |
| 11 | byte | `curEndure` |
| 12 | byte | `maxEndure` |
| 13 | byte | `isBind` |
| 14 | string | `bindedOfficer` |
| 15 | int | `icon` |
| 16 | byte | `level` |
| 17 | int | `recycleCount` |
| 18 | string | `recycleName` |
| 19 | byte | `isProtected` |
| 20 | string | `notice` |

---

#### `cmd=12002` — medal slots expand 12002

- 常量: `Constant.PROT_MEDAL_SLOTS_EXPAND_12002`
- 成功判定: `status1=this.status()||2=this.status()`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.officerId` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `diamondOwned` |
| 2 | int | `pageNum` |
| 3 | int | `pageCount` |
| 4 | int | `totalCount` |
| 5 | long | `medalId` |
| 6 | int | `curAmount` |
| 7 | string | `name` |
| 8 | string | `description` |
| 9 | string | `useDescription` |
| 10 | int | `icon` |
| 11 | byte | `level` |
| 12 | int | `recycleCount` |
| 13 | string | `recycleName` |
| 14 | string | `disassembleDescription` |
| 15 | byte | `color` |
| 16 | byte | `isProtected` |
| 17 | string | `notice` |
| 18 | long | `messageId` |
| 19 | string | `messageTitle` |
| 20 | string | `author` |
| 21 | int | `priority` |
| 22 | long | `messageTime` |
| 23 | int | `allianceId` |
| 24 | string | `allianceName` |
| 25 | int | `capitalX` |
| 26 | int | `capitalY` |
| 27 | int | `position` |
| 28 | int | `id` |
| 29 | string | `name` |
| 30 | int | `capitalStatus` |
| 31 | string | `info1` |
| 32 | string | `info1` |
| 33 | string | `info2` |
| 34 | int | `diamondRequired` |
| 35 | string | `info1` |
| 36 | string | `info2` |
| 37 | int | `diamondRequired` |
| 38 | long | `remainTime` |
| 39 | string | `info1` |
| 40 | int | `position` |
| 41 | int | `state` |
| 42 | long | `remainTime` |
| 43 | int | `mineId` |
| 44 | int | `prototypeID` |
| 45 | int | `production` |
| 46 | int | `totalTime` |
| 47 | string | `nuclearDescription` |
| 48 | int | `capitalState` |
| 49 | string | `stateDescription` |
| 50 | byte | `type` |
| 51 | string | `message` |
| 52 | int | `type` |
| 53 | int | `fieldType` |
| 54 | string | `cityIcon` |
| 55 | string | `cityName` |
| 56 | string | `nuclearIcon` |
| 57 | string | `nuclearName` |
| 58 | string | `allianceName` |
| 59 | string | `fieldIcon` |
| 60 | string | `fieldName` |
| 61 | string | `strongholdIcon` |
| 62 | string | `strongholdName` |
| 63 | int | `x` |
| 64 | int | `y` |
| 65 | string | `remark` |
| 66 | int | `linesCount` |
| 67 | long | `expeditionId` |
| 68 | int | `startX` |
| 69 | int | `startY` |
| 70 | int | `endX` |
| 71 | int | `endY` |
| 72 | string | `mark` |
| 73 | string | `officerName` |
| 74 | int | `officerIcon` |
| 75 | int | `officerLevel` |
| 76 | long | `playerId` |
| 77 | string | `playerName` |
| 78 | int | `avata` |
| 79 | string | `playerName` |
| 80 | string | `allianceName` |
| 81 | string | `title` |
| 82 | string | `titleColor` |
| 83 | long | `onewayTime` |
| 84 | long | `remainingTime` |
| 85 | int | `state` |
| 86 | int | `armyCount` |
| 87 | int | `type` |
| 88 | int | `relationship` |
| 89 | long | `fromCityId` |
| 90 | long | `targetExpeditionId` |
| 91 | int | `x` |
| 92 | int | `y` |
| 93 | long | `arrivedTime` |
| 94 | int | `pageNum` |
| 95 | int | `pageCount` |
| 96 | long | `tradeId` |
| 97 | byte | `tradeResourceType` |
| 98 | int | `tradeAmount` |
| 99 | string | `unitPrice` |
| 100 | int | `totalPrice` |
| 101 | long | `tradeTime` |
| 102 | int | `sellerAvata` |
| 103 | string | `sellerNickname` |
| 104 | string | `sellerAllianceName` |
| 105 | string | `confirmMessage` |

---

#### `cmd=12003` — medal wear 12003

- 常量: `Constant.PROT_MEDAL_WEAR_12003`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.officerId` |
| 2 | long | `this.medalId` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=12004` — medal takeoff 12004

- 常量: `Constant.PROT_MEDAL_TAKEOFF_12004`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.officerId` |
| 2 | long | `this.medalId` |
| 3 | int | `this.actionType` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=12005` — medal list 12005

- 常量: `Constant.PROT_MEDAL_LIST_12005`
- 成功判定: `status1=this.status()||2=this.status()`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.pageNum` |
| 2 | int | `this.pageSize` |
| 3 | byte | `this.enableFilter` |
| 4 | int | `this.filterArmyType` |
| 5 | int | `this.filterFunctionType` |
| 6 | byte | `this.filterOrderType)` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `diamondOwned` |
| 2 | int | `pageNum` |
| 3 | int | `pageCount` |
| 4 | int | `totalCount` |
| 5 | long | `medalId` |
| 6 | int | `curAmount` |
| 7 | string | `name` |
| 8 | string | `description` |
| 9 | string | `useDescription` |
| 10 | int | `icon` |
| 11 | byte | `level` |
| 12 | int | `recycleCount` |
| 13 | string | `recycleName` |
| 14 | string | `disassembleDescription` |
| 15 | byte | `color` |
| 16 | byte | `isProtected` |
| 17 | string | `notice` |
| 18 | long | `messageId` |
| 19 | string | `messageTitle` |
| 20 | string | `author` |
| 21 | int | `priority` |
| 22 | long | `messageTime` |
| 23 | int | `allianceId` |
| 24 | string | `allianceName` |
| 25 | int | `capitalX` |
| 26 | int | `capitalY` |
| 27 | int | `position` |
| 28 | int | `id` |
| 29 | string | `name` |
| 30 | int | `capitalStatus` |
| 31 | string | `info1` |
| 32 | string | `info1` |
| 33 | string | `info2` |
| 34 | int | `diamondRequired` |
| 35 | string | `info1` |
| 36 | string | `info2` |
| 37 | int | `diamondRequired` |
| 38 | long | `remainTime` |
| 39 | string | `info1` |
| 40 | int | `position` |
| 41 | int | `state` |
| 42 | long | `remainTime` |
| 43 | int | `mineId` |
| 44 | int | `prototypeID` |
| 45 | int | `production` |
| 46 | int | `totalTime` |
| 47 | string | `nuclearDescription` |
| 48 | int | `capitalState` |
| 49 | string | `stateDescription` |
| 50 | byte | `type` |
| 51 | string | `message` |
| 52 | int | `type` |
| 53 | int | `fieldType` |
| 54 | string | `cityIcon` |
| 55 | string | `cityName` |
| 56 | string | `nuclearIcon` |
| 57 | string | `nuclearName` |
| 58 | string | `allianceName` |
| 59 | string | `fieldIcon` |
| 60 | string | `fieldName` |
| 61 | string | `strongholdIcon` |
| 62 | string | `strongholdName` |
| 63 | int | `x` |
| 64 | int | `y` |
| 65 | string | `remark` |
| 66 | int | `linesCount` |
| 67 | long | `expeditionId` |
| 68 | int | `startX` |
| 69 | int | `startY` |
| 70 | int | `endX` |
| 71 | int | `endY` |
| 72 | string | `mark` |
| 73 | string | `officerName` |
| 74 | int | `officerIcon` |
| 75 | int | `officerLevel` |
| 76 | long | `playerId` |
| 77 | string | `playerName` |
| 78 | int | `avata` |
| 79 | string | `playerName` |
| 80 | string | `allianceName` |
| 81 | string | `title` |
| 82 | string | `titleColor` |
| 83 | long | `onewayTime` |
| 84 | long | `remainingTime` |
| 85 | int | `state` |
| 86 | int | `armyCount` |
| 87 | int | `type` |
| 88 | int | `relationship` |
| 89 | long | `fromCityId` |
| 90 | long | `targetExpeditionId` |
| 91 | int | `x` |
| 92 | int | `y` |
| 93 | long | `arrivedTime` |
| 94 | int | `pageNum` |
| 95 | int | `pageCount` |
| 96 | long | `tradeId` |
| 97 | byte | `tradeResourceType` |
| 98 | int | `tradeAmount` |
| 99 | string | `unitPrice` |
| 100 | int | `totalPrice` |
| 101 | long | `tradeTime` |
| 102 | int | `sellerAvata` |
| 103 | string | `sellerNickname` |
| 104 | string | `sellerAllianceName` |
| 105 | string | `confirmMessage` |

---

#### `cmd=12006` — medal callback 12006

- 常量: `Constant.PROT_MEDAL_CALLBACK_12006`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.ids.length` |
| … | 循环 | `for(var e` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `name` |
| 2 | int | `icon` |
| 3 | int | `amount` |

---

#### `cmd=12007` — medal upgrade info 12007

- 常量: `Constant.PROT_MEDAL_UPGRADE_INFO_12007`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.medalId` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `upgradeInfoCurrent` |
| 2 | string | `upgradeInfoAfter` |
| 3 | string | `cimeliaCost` |
| 4 | string | `cimeliaOwned` |

---

#### `cmd=12008` — medal upgrade 12008

- 常量: `Constant.PROT_MEDAL_UPGRADE_12008`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.medalId` |

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---

#### `cmd=12009` — medal disassemble 12009

- 常量: `Constant.PROT_MEDAL_DISASSEMBLE_12009`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.ids.length` |
| … | 循环 | `for(var e` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `itemID` |
| 2 | string | `name` |
| 3 | string | `description` |
| 4 | int | `icon` |
| 5 | int | `amount` |

---

#### `cmd=12010` — medal wash info 12010

- 常量: `Constant.PROT_MEDAL_WASH_INFO_12010`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.medalId` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `name` |
| 2 | string | `washInfo` |
| 3 | string | `washDescription` |
| 4 | int | `toolAmount` |
| 5 | byte | `color` |
| 6 | string | `toolName` |
| 7 | byte | `washValueType` |

---

#### `cmd=12011` — medal wash 12011

- 常量: `Constant.PROT_MEDAL_WASH_12011`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.medalId` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `washTypeChange` |
| 2 | string | `washValueChange` |
| 3 | string | `washInfoCurrent` |

---

#### `cmd=12012` — medal list query 12012

- 常量: `Constant.PROT_MEDAL_LIST_QUERY_12012`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | byte | `this.queryType` |
| 2 | long | `this.officerId` |
| 3 | byte | `this.pageSize` |
| 4 | int | `this.pageNum` |
| 5 | int | `this.armyType` |
| 6 | int | `this.functionType` |
| 7 | byte | `this.order)` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `slotTotal` |
| 2 | int | `slotUsing` |
| 3 | long | `medalId` |
| 4 | string | `name` |
| 5 | int | `slotRequired` |
| 6 | string | `effectName` |
| 7 | string | `effectDescription` |
| 8 | long | `icon` |
| 9 | byte | `level` |
| 10 | byte | `color` |
| 11 | string | `slotExpandMessage` |
| 12 | int | `pageCount` |
| 13 | int | `pageNum` |

---

#### `cmd=12045` — equipment callback 12045

- 常量: `Constant.PROT_EQUIPMENT_CALLBACK_12045`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.ids.length` |
| … | 循环 | `for(var e` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `name` |
| 2 | int | `icon` |
| 3 | int | `amount` |

---

#### `cmd=12046` — medal wash type convert 12046

- 常量: `Constant.PROT_MEDAL_WASH_TYPE_CONVERT_12046`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | byte | `this.targetType` |
| 2 | long | `this.medalId` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `washTypeChange` |
| 2 | byte | `washValueType` |

---

#### `cmd=12047` — medal lock and unlock 12047

- 常量: `Constant.PROT_MEDAL_LOCK_AND_UNLOCK_12047`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | byte | `this.action` |
| 2 | byte | `this.medalIds.length` |
| … | 循环 | `for(var e` |

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---

#### `cmd=12048` — equipment lock and unlock 12048

- 常量: `Constant.PROT_EQUIPMENT_LOCK_AND_UNLOCK_12048`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | byte | `this.action` |
| 2 | byte | `this.equipIds.length` |
| … | 循环 | `for(var e` |

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---
