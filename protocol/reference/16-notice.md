# 公告与系统

> 15 个命令（cmd 13002 ~ 14020）

#### `cmd=13002` — notice list 13002

- 常量: `Constant.PROT_NOTICE_LIST_13002`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `noticeId` |
| 2 | byte | `type` |
| 3 | string | `message` |
| 4 | long | `createTime` |

---

#### `cmd=14001` — capital message list 14001

- 常量: `Constant.PROT_CAPITAL_MESSAGE_LIST_14001`
- 成功判定: `status1=this.status()||2=this.status()`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `messageId` |
| 2 | string | `messageTitle` |
| 3 | string | `author` |
| 4 | int | `priority` |
| 5 | long | `messageTime` |
| 6 | int | `allianceId` |
| 7 | string | `allianceName` |
| 8 | int | `capitalX` |
| 9 | int | `capitalY` |
| 10 | int | `position` |
| 11 | int | `id` |
| 12 | string | `name` |
| 13 | int | `capitalStatus` |
| 14 | string | `info1` |
| 15 | string | `info1` |
| 16 | string | `info2` |
| 17 | int | `diamondRequired` |
| 18 | string | `info1` |
| 19 | string | `info2` |
| 20 | int | `diamondRequired` |
| 21 | long | `remainTime` |
| 22 | string | `info1` |
| 23 | int | `position` |
| 24 | int | `state` |
| 25 | long | `remainTime` |
| 26 | int | `mineId` |
| 27 | int | `prototypeID` |
| 28 | int | `production` |
| 29 | int | `totalTime` |
| 30 | string | `nuclearDescription` |
| 31 | int | `capitalState` |
| 32 | string | `stateDescription` |
| 33 | byte | `type` |
| 34 | string | `message` |
| 35 | int | `type` |
| 36 | int | `fieldType` |
| 37 | string | `cityIcon` |
| 38 | string | `cityName` |
| 39 | string | `nuclearIcon` |
| 40 | string | `nuclearName` |
| 41 | string | `allianceName` |
| 42 | string | `fieldIcon` |
| 43 | string | `fieldName` |
| 44 | string | `strongholdIcon` |
| 45 | string | `strongholdName` |
| 46 | int | `x` |
| 47 | int | `y` |
| 48 | string | `remark` |
| 49 | int | `linesCount` |
| 50 | long | `expeditionId` |
| 51 | int | `startX` |
| 52 | int | `startY` |
| 53 | int | `endX` |
| 54 | int | `endY` |
| 55 | string | `mark` |
| 56 | string | `officerName` |
| 57 | int | `officerIcon` |
| 58 | int | `officerLevel` |
| 59 | long | `playerId` |
| 60 | string | `playerName` |
| 61 | int | `avata` |
| 62 | string | `playerName` |
| 63 | string | `allianceName` |
| 64 | string | `title` |
| 65 | string | `titleColor` |
| 66 | long | `onewayTime` |
| 67 | long | `remainingTime` |
| 68 | int | `state` |
| 69 | int | `armyCount` |
| 70 | int | `type` |
| 71 | int | `relationship` |
| 72 | long | `fromCityId` |
| 73 | long | `targetExpeditionId` |
| 74 | int | `x` |
| 75 | int | `y` |
| 76 | long | `arrivedTime` |
| 77 | int | `pageNum` |
| 78 | int | `pageCount` |
| 79 | long | `tradeId` |
| 80 | byte | `tradeResourceType` |
| 81 | int | `tradeAmount` |
| 82 | string | `unitPrice` |
| 83 | int | `totalPrice` |
| 84 | long | `tradeTime` |
| 85 | int | `sellerAvata` |
| 86 | string | `sellerNickname` |
| 87 | string | `sellerAllianceName` |
| 88 | string | `confirmMessage` |

---

#### `cmd=14002` — capital message publish 14002

- 常量: `Constant.PROT_CAPITAL_MESSAGE_PUBLISH_14002`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | string | `this.title` |
| 2 | string | `this.content` |

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---

#### `cmd=14003` — capital message delete 14003

- 常量: `Constant.PROT_CAPITAL_MESSAGE_DELETE_14003`
- 成功判定: `status1=this.status()||2=this.status()`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.allianceMessageIds.length` |
| … | 循环 | `for(var e` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `allianceId` |
| 2 | string | `allianceName` |
| 3 | int | `capitalX` |
| 4 | int | `capitalY` |
| 5 | int | `position` |
| 6 | int | `id` |
| 7 | string | `name` |
| 8 | int | `capitalStatus` |
| 9 | string | `info1` |
| 10 | string | `info1` |
| 11 | string | `info2` |
| 12 | int | `diamondRequired` |
| 13 | string | `info1` |
| 14 | string | `info2` |
| 15 | int | `diamondRequired` |
| 16 | long | `remainTime` |
| 17 | string | `info1` |
| 18 | int | `position` |
| 19 | int | `state` |
| 20 | long | `remainTime` |
| 21 | int | `mineId` |
| 22 | int | `prototypeID` |
| 23 | int | `production` |
| 24 | int | `totalTime` |
| 25 | string | `nuclearDescription` |
| 26 | int | `capitalState` |
| 27 | string | `stateDescription` |
| 28 | byte | `type` |
| 29 | string | `message` |
| 30 | int | `type` |
| 31 | int | `fieldType` |
| 32 | string | `cityIcon` |
| 33 | string | `cityName` |
| 34 | string | `nuclearIcon` |
| 35 | string | `nuclearName` |
| 36 | string | `allianceName` |
| 37 | string | `fieldIcon` |
| 38 | string | `fieldName` |
| 39 | string | `strongholdIcon` |
| 40 | string | `strongholdName` |
| 41 | int | `x` |
| 42 | int | `y` |
| 43 | string | `remark` |
| 44 | int | `linesCount` |
| 45 | long | `expeditionId` |
| 46 | int | `startX` |
| 47 | int | `startY` |
| 48 | int | `endX` |
| 49 | int | `endY` |
| 50 | string | `mark` |
| 51 | string | `officerName` |
| 52 | int | `officerIcon` |
| 53 | int | `officerLevel` |
| 54 | long | `playerId` |
| 55 | string | `playerName` |
| 56 | int | `avata` |
| 57 | string | `playerName` |
| 58 | string | `allianceName` |
| 59 | string | `title` |
| 60 | string | `titleColor` |
| 61 | long | `onewayTime` |
| 62 | long | `remainingTime` |
| 63 | int | `state` |
| 64 | int | `armyCount` |
| 65 | int | `type` |
| 66 | int | `relationship` |
| 67 | long | `fromCityId` |
| 68 | long | `targetExpeditionId` |
| 69 | int | `x` |
| 70 | int | `y` |
| 71 | long | `arrivedTime` |
| 72 | int | `pageNum` |
| 73 | int | `pageCount` |
| 74 | long | `tradeId` |
| 75 | byte | `tradeResourceType` |
| 76 | int | `tradeAmount` |
| 77 | string | `unitPrice` |
| 78 | int | `totalPrice` |
| 79 | long | `tradeTime` |
| 80 | int | `sellerAvata` |
| 81 | string | `sellerNickname` |
| 82 | string | `sellerAllianceName` |
| 83 | string | `confirmMessage` |

---

#### `cmd=14004` — capital message detail 14004

- 常量: `Constant.PROT_CAPITAL_MESSAGE_DETAIL_14004`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.allianceMessageId` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `messageContent` |

---

#### `cmd=14005` — capital message lock top 14005

- 常量: `Constant.PROT_CAPITAL_MESSAGE_LOCK_TOP_14005`
- 成功判定: `status1=this.status()||2=this.status()`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.allianceMessageId` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `allianceId` |
| 2 | string | `allianceName` |
| 3 | int | `capitalX` |
| 4 | int | `capitalY` |
| 5 | int | `position` |
| 6 | int | `id` |
| 7 | string | `name` |
| 8 | int | `capitalStatus` |
| 9 | string | `info1` |
| 10 | string | `info1` |
| 11 | string | `info2` |
| 12 | int | `diamondRequired` |
| 13 | string | `info1` |
| 14 | string | `info2` |
| 15 | int | `diamondRequired` |
| 16 | long | `remainTime` |
| 17 | string | `info1` |
| 18 | int | `position` |
| 19 | int | `state` |
| 20 | long | `remainTime` |
| 21 | int | `mineId` |
| 22 | int | `prototypeID` |
| 23 | int | `production` |
| 24 | int | `totalTime` |
| 25 | string | `nuclearDescription` |
| 26 | int | `capitalState` |
| 27 | string | `stateDescription` |
| 28 | byte | `type` |
| 29 | string | `message` |
| 30 | int | `type` |
| 31 | int | `fieldType` |
| 32 | string | `cityIcon` |
| 33 | string | `cityName` |
| 34 | string | `nuclearIcon` |
| 35 | string | `nuclearName` |
| 36 | string | `allianceName` |
| 37 | string | `fieldIcon` |
| 38 | string | `fieldName` |
| 39 | string | `strongholdIcon` |
| 40 | string | `strongholdName` |
| 41 | int | `x` |
| 42 | int | `y` |
| 43 | string | `remark` |
| 44 | int | `linesCount` |
| 45 | long | `expeditionId` |
| 46 | int | `startX` |
| 47 | int | `startY` |
| 48 | int | `endX` |
| 49 | int | `endY` |
| 50 | string | `mark` |
| 51 | string | `officerName` |
| 52 | int | `officerIcon` |
| 53 | int | `officerLevel` |
| 54 | long | `playerId` |
| 55 | string | `playerName` |
| 56 | int | `avata` |
| 57 | string | `playerName` |
| 58 | string | `allianceName` |
| 59 | string | `title` |
| 60 | string | `titleColor` |
| 61 | long | `onewayTime` |
| 62 | long | `remainingTime` |
| 63 | int | `state` |
| 64 | int | `armyCount` |
| 65 | int | `type` |
| 66 | int | `relationship` |
| 67 | long | `fromCityId` |
| 68 | long | `targetExpeditionId` |
| 69 | int | `x` |
| 70 | int | `y` |
| 71 | long | `arrivedTime` |
| 72 | int | `pageNum` |
| 73 | int | `pageCount` |
| 74 | long | `tradeId` |
| 75 | byte | `tradeResourceType` |
| 76 | int | `tradeAmount` |
| 77 | string | `unitPrice` |
| 78 | int | `totalPrice` |
| 79 | long | `tradeTime` |
| 80 | int | `sellerAvata` |
| 81 | string | `sellerNickname` |
| 82 | string | `sellerAllianceName` |
| 83 | string | `confirmMessage` |

---

#### `cmd=14006` — capital message unlock top 14006

- 常量: `Constant.PROT_CAPITAL_MESSAGE_UNLOCK_TOP_14006`
- 成功判定: `status1=this.status()||2=this.status()`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.allianceMessageId` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `allianceId` |
| 2 | string | `allianceName` |
| 3 | int | `capitalX` |
| 4 | int | `capitalY` |
| 5 | int | `position` |
| 6 | int | `id` |
| 7 | string | `name` |
| 8 | int | `capitalStatus` |
| 9 | string | `info1` |
| 10 | string | `info1` |
| 11 | string | `info2` |
| 12 | int | `diamondRequired` |
| 13 | string | `info1` |
| 14 | string | `info2` |
| 15 | int | `diamondRequired` |
| 16 | long | `remainTime` |
| 17 | string | `info1` |
| 18 | int | `position` |
| 19 | int | `state` |
| 20 | long | `remainTime` |
| 21 | int | `mineId` |
| 22 | int | `prototypeID` |
| 23 | int | `production` |
| 24 | int | `totalTime` |
| 25 | string | `nuclearDescription` |
| 26 | int | `capitalState` |
| 27 | string | `stateDescription` |
| 28 | byte | `type` |
| 29 | string | `message` |
| 30 | int | `type` |
| 31 | int | `fieldType` |
| 32 | string | `cityIcon` |
| 33 | string | `cityName` |
| 34 | string | `nuclearIcon` |
| 35 | string | `nuclearName` |
| 36 | string | `allianceName` |
| 37 | string | `fieldIcon` |
| 38 | string | `fieldName` |
| 39 | string | `strongholdIcon` |
| 40 | string | `strongholdName` |
| 41 | int | `x` |
| 42 | int | `y` |
| 43 | string | `remark` |
| 44 | int | `linesCount` |
| 45 | long | `expeditionId` |
| 46 | int | `startX` |
| 47 | int | `startY` |
| 48 | int | `endX` |
| 49 | int | `endY` |
| 50 | string | `mark` |
| 51 | string | `officerName` |
| 52 | int | `officerIcon` |
| 53 | int | `officerLevel` |
| 54 | long | `playerId` |
| 55 | string | `playerName` |
| 56 | int | `avata` |
| 57 | string | `playerName` |
| 58 | string | `allianceName` |
| 59 | string | `title` |
| 60 | string | `titleColor` |
| 61 | long | `onewayTime` |
| 62 | long | `remainingTime` |
| 63 | int | `state` |
| 64 | int | `armyCount` |
| 65 | int | `type` |
| 66 | int | `relationship` |
| 67 | long | `fromCityId` |
| 68 | long | `targetExpeditionId` |
| 69 | int | `x` |
| 70 | int | `y` |
| 71 | long | `arrivedTime` |
| 72 | int | `pageNum` |
| 73 | int | `pageCount` |
| 74 | long | `tradeId` |
| 75 | byte | `tradeResourceType` |
| 76 | int | `tradeAmount` |
| 77 | string | `unitPrice` |
| 78 | int | `totalPrice` |
| 79 | long | `tradeTime` |
| 80 | int | `sellerAvata` |
| 81 | string | `sellerNickname` |
| 82 | string | `sellerAllianceName` |
| 83 | string | `confirmMessage` |

---

#### `cmd=14007` — capital build 14007

- 常量: `Constant.PROT_CAPITAL_BUILD_14007`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.tileId` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `messgae` |
| 2 | int | `allianceId` |

---

#### `cmd=14008` — capital check 14008

- 常量: `Constant.PROT_CAPITAL_CHECK_14008`
- 成功判定: `status1=this.status()||2=this.status()`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `allianceId` |
| 2 | string | `allianceName` |
| 3 | int | `capitalX` |
| 4 | int | `capitalY` |
| 5 | int | `position` |
| 6 | int | `id` |
| 7 | string | `name` |
| 8 | int | `capitalStatus` |
| 9 | string | `info1` |
| 10 | string | `info1` |
| 11 | string | `info2` |
| 12 | int | `diamondRequired` |
| 13 | string | `info1` |
| 14 | string | `info2` |
| 15 | int | `diamondRequired` |
| 16 | long | `remainTime` |
| 17 | string | `info1` |
| 18 | int | `position` |
| 19 | int | `state` |
| 20 | long | `remainTime` |
| 21 | int | `mineId` |
| 22 | int | `prototypeID` |
| 23 | int | `production` |
| 24 | int | `totalTime` |
| 25 | string | `nuclearDescription` |
| 26 | int | `capitalState` |
| 27 | string | `stateDescription` |
| 28 | byte | `type` |
| 29 | string | `message` |
| 30 | int | `type` |
| 31 | int | `fieldType` |
| 32 | string | `cityIcon` |
| 33 | string | `cityName` |
| 34 | string | `nuclearIcon` |
| 35 | string | `nuclearName` |
| 36 | string | `allianceName` |
| 37 | string | `fieldIcon` |
| 38 | string | `fieldName` |
| 39 | string | `strongholdIcon` |
| 40 | string | `strongholdName` |
| 41 | int | `x` |
| 42 | int | `y` |
| 43 | string | `remark` |
| 44 | int | `linesCount` |
| 45 | long | `expeditionId` |
| 46 | int | `startX` |
| 47 | int | `startY` |
| 48 | int | `endX` |
| 49 | int | `endY` |
| 50 | string | `mark` |
| 51 | string | `officerName` |
| 52 | int | `officerIcon` |
| 53 | int | `officerLevel` |
| 54 | long | `playerId` |
| 55 | string | `playerName` |
| 56 | int | `avata` |
| 57 | string | `playerName` |
| 58 | string | `allianceName` |
| 59 | string | `title` |
| 60 | string | `titleColor` |
| 61 | long | `onewayTime` |
| 62 | long | `remainingTime` |
| 63 | int | `state` |
| 64 | int | `armyCount` |
| 65 | int | `type` |
| 66 | int | `relationship` |
| 67 | long | `fromCityId` |
| 68 | long | `targetExpeditionId` |
| 69 | int | `x` |
| 70 | int | `y` |
| 71 | long | `arrivedTime` |
| 72 | int | `pageNum` |
| 73 | int | `pageCount` |
| 74 | long | `tradeId` |
| 75 | byte | `tradeResourceType` |
| 76 | int | `tradeAmount` |
| 77 | string | `unitPrice` |
| 78 | int | `totalPrice` |
| 79 | long | `tradeTime` |
| 80 | int | `sellerAvata` |
| 81 | string | `sellerNickname` |
| 82 | string | `sellerAllianceName` |
| 83 | string | `confirmMessage` |

---

#### `cmd=14010` — capital base info 14010

- 常量: `Constant.PROT_CAPITAL_BASE_INFO_14010`
- 成功判定: `status1=this.status()||2=this.status()`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.allianceId` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `allianceName` |
| 2 | int | `capitalX` |
| 3 | int | `capitalY` |
| 4 | int | `position` |
| 5 | int | `id` |
| 6 | string | `name` |
| 7 | int | `capitalStatus` |
| 8 | string | `info1` |
| 9 | string | `info1` |
| 10 | string | `info2` |
| 11 | int | `diamondRequired` |
| 12 | string | `info1` |
| 13 | string | `info2` |
| 14 | int | `diamondRequired` |
| 15 | long | `remainTime` |
| 16 | string | `info1` |
| 17 | int | `position` |
| 18 | int | `state` |
| 19 | long | `remainTime` |
| 20 | int | `mineId` |
| 21 | int | `prototypeID` |
| 22 | int | `production` |
| 23 | int | `totalTime` |
| 24 | string | `nuclearDescription` |
| 25 | int | `capitalState` |
| 26 | string | `stateDescription` |
| 27 | byte | `type` |
| 28 | string | `message` |
| 29 | int | `type` |
| 30 | int | `fieldType` |
| 31 | string | `cityIcon` |
| 32 | string | `cityName` |
| 33 | string | `nuclearIcon` |
| 34 | string | `nuclearName` |
| 35 | string | `allianceName` |
| 36 | string | `fieldIcon` |
| 37 | string | `fieldName` |
| 38 | string | `strongholdIcon` |
| 39 | string | `strongholdName` |
| 40 | int | `x` |
| 41 | int | `y` |
| 42 | string | `remark` |
| 43 | int | `linesCount` |
| 44 | long | `expeditionId` |
| 45 | int | `startX` |
| 46 | int | `startY` |
| 47 | int | `endX` |
| 48 | int | `endY` |
| 49 | string | `mark` |
| 50 | string | `officerName` |
| 51 | int | `officerIcon` |
| 52 | int | `officerLevel` |
| 53 | long | `playerId` |
| 54 | string | `playerName` |
| 55 | int | `avata` |
| 56 | string | `playerName` |
| 57 | string | `allianceName` |
| 58 | string | `title` |
| 59 | string | `titleColor` |
| 60 | long | `onewayTime` |
| 61 | long | `remainingTime` |
| 62 | int | `state` |
| 63 | int | `armyCount` |
| 64 | int | `type` |
| 65 | int | `relationship` |
| 66 | long | `fromCityId` |
| 67 | long | `targetExpeditionId` |
| 68 | int | `x` |
| 69 | int | `y` |
| 70 | long | `arrivedTime` |
| 71 | int | `pageNum` |
| 72 | int | `pageCount` |
| 73 | long | `tradeId` |
| 74 | byte | `tradeResourceType` |
| 75 | int | `tradeAmount` |
| 76 | string | `unitPrice` |
| 77 | int | `totalPrice` |
| 78 | long | `tradeTime` |
| 79 | int | `sellerAvata` |
| 80 | string | `sellerNickname` |
| 81 | string | `sellerAllianceName` |
| 82 | string | `confirmMessage` |

---

#### `cmd=14011` — capital nuclear mine info 14011

- 常量: `Constant.PROT_CAPITAL_NUCLEAR_MINE_INFO_14011`
- 成功判定: `status1=this.status()||2=this.status()`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.allianceId` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `position` |
| 2 | int | `state` |
| 3 | long | `remainTime` |
| 4 | int | `mineId` |
| 5 | int | `prototypeID` |
| 6 | int | `production` |
| 7 | int | `totalTime` |
| 8 | string | `nuclearDescription` |
| 9 | int | `capitalState` |
| 10 | string | `stateDescription` |
| 11 | byte | `type` |
| 12 | string | `message` |
| 13 | int | `type` |
| 14 | int | `fieldType` |
| 15 | string | `cityIcon` |
| 16 | string | `cityName` |
| 17 | string | `nuclearIcon` |
| 18 | string | `nuclearName` |
| 19 | string | `allianceName` |
| 20 | string | `fieldIcon` |
| 21 | string | `fieldName` |
| 22 | string | `strongholdIcon` |
| 23 | string | `strongholdName` |
| 24 | int | `x` |
| 25 | int | `y` |
| 26 | string | `remark` |
| 27 | int | `linesCount` |
| 28 | long | `expeditionId` |
| 29 | int | `startX` |
| 30 | int | `startY` |
| 31 | int | `endX` |
| 32 | int | `endY` |
| 33 | string | `mark` |
| 34 | string | `officerName` |
| 35 | int | `officerIcon` |
| 36 | int | `officerLevel` |
| 37 | long | `playerId` |
| 38 | string | `playerName` |
| 39 | int | `avata` |
| 40 | string | `playerName` |
| 41 | string | `allianceName` |
| 42 | string | `title` |
| 43 | string | `titleColor` |
| 44 | long | `onewayTime` |
| 45 | long | `remainingTime` |
| 46 | int | `state` |
| 47 | int | `armyCount` |
| 48 | int | `type` |
| 49 | int | `relationship` |
| 50 | long | `fromCityId` |
| 51 | long | `targetExpeditionId` |
| 52 | int | `x` |
| 53 | int | `y` |
| 54 | long | `arrivedTime` |
| 55 | int | `pageNum` |
| 56 | int | `pageCount` |
| 57 | long | `tradeId` |
| 58 | byte | `tradeResourceType` |
| 59 | int | `tradeAmount` |
| 60 | string | `unitPrice` |
| 61 | int | `totalPrice` |
| 62 | long | `tradeTime` |
| 63 | int | `sellerAvata` |
| 64 | string | `sellerNickname` |
| 65 | string | `sellerAllianceName` |
| 66 | string | `confirmMessage` |

---

#### `cmd=14013` — capital supply info 14013

- 常量: `Constant.PROT_CAPITAL_SUPPLY_INFO_14013`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.allianceId` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `nuclearAmount` |
| 2 | long | `nuclearMaxAmount` |
| 3 | long | `foodAmount` |
| 4 | long | `foodMaxAmount` |
| 5 | long | `steelAmount` |
| 6 | long | `steelMaxAmount` |
| 7 | long | `oilAmount` |
| 8 | long | `oilMaxAmount` |
| 9 | long | `mineralAmount` |
| 10 | long | `mineralMaxAmount` |
| 11 | long | `officerId` |
| 12 | string | `officerName` |
| 13 | int | `icon` |
| 14 | int | `isSpecialOfficer` |
| 15 | int | `level` |
| 16 | int | `status` |
| 17 | int | `star` |
| 18 | int | `militaryWithoutItemAndTroop` |
| 19 | int | `knowledgeWithoutItemAndTroop` |
| 20 | int | `logisticsWithoutItemAndTroop` |
| 21 | int | `armyId` |
| 22 | int | `amount` |
| 23 | int | `fortressId` |
| 24 | string | `name` |
| 25 | byte | `state` |
| 26 | int | `defence` |
| 27 | int | `defenceMax` |
| 28 | string | `officerName` |
| 29 | string | `garrisionOfficerName` |
| 30 | int | `armyId` |
| 31 | int | `amount` |

---

#### `cmd=14014` — capital technique research info 14014

- 常量: `Constant.PROT_CAPITAL_TECHNIQUE_RESEARCH_INFO_14014`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `nuclearMineCount` |
| 2 | int | `capitalLevel` |
| 3 | int | `nuclearDonated` |
| 4 | int | `capitalTechId` |
| 5 | string | `name` |
| 6 | int | `level` |
| 7 | int | `isMaxLevel` |
| 8 | int | `upgradeable` |
| 9 | string | `description` |
| 10 | string | `levelDescription` |
| 11 | string | `nextLevelDescription` |
| 12 | int | `savedNuclear` |
| 13 | int | `upgradeRequiredNuclear` |
| 14 | int | `upgradeRequiredCapitalLevel` |

---

#### `cmd=14015` — capital technique upgrade 14015

- 常量: `Constant.PROT_CAPITAL_TECHNIQUE_UPGRADE_14015`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.capitalTechId` |
| 2 | int | `this.nuclearDonateCount` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `message` |

---

#### `cmd=14020` — capital donate resources 14020

- 常量: `Constant.PROT_CAPITAL_DONATE_RESOURCES_14020`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.nuclearAmount` |
| 2 | long | `this.foodAmount` |
| 3 | long | `this.steelAmount` |
| 4 | long | `this.oilAmount` |
| 5 | long | `this.mineralAmount` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `message` |

---
