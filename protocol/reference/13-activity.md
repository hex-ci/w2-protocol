# 活动

> 30 个命令（cmd 22001 ~ 23004）

#### `cmd=22001` — activity list 22001

- 常量: `Constant.PROT_ACTIVITY_LIST_22001`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `activityName` |
| 2 | int | `activityId` |
| 3 | string | `flag` |
| 4 | long | `startTime` |
| 5 | long | `endTime` |
| 6 | byte | `timeLimited` |
| 7 | long | `remainTime` |
| 8 | int | `activityType` |
| 9 | byte | `activitySubType` |
| 10 | int | `activityGroupId` |
| 11 | int | `redPointType` |
| 12 | long | `redPointUnimark` |
| 13 | int | `regDaysLimited` |

---

#### `cmd=22002` — activity description 22002

- 常量: `Constant.PROT_ACTIVITY_DESCRIPTION_22002`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.activityId` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `activityId` |
| 2 | int | `activityType` |

---

#### `cmd=22007` — activity charge or consume detail 22007

- 常量: `Constant.PROT_ACTIVITY_CHARGE_OR_CONSUME_DETAIL_22007`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.activityId` |

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---

#### `cmd=22008` — activity charge or consume collect reward 22008

- 常量: `Constant.PROT_ACTIVITY_CHARGE_OR_CONSUME_COLLECT_REWARD_22008`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.sectionId` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `rcType` |
| 2 | string | `rcImage` |
| 3 | string | `rcName` |
| 4 | int | `rcAmount` |

---

#### `cmd=22010` — activity 7days detail 22010

- 常量: `Constant.PROT_ACTIVITY_7DAYS_DETAIL_22010`

**请求参数**: 无（类未定义 encode）

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---

#### `cmd=22011` — activity 7days collect reward 22011

- 常量: `Constant.PROT_ACTIVITY_7DAYS_COLLECT_REWARD_22011`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | byte | `this.dayIndex` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=22012` — activity ndays detail 22012

- 常量: `Constant.PROT_ACTIVITY_NDAYS_DETAIL_22012`

**请求参数**: 无（类未定义 encode）

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---

#### `cmd=22013` — activity ndays collect reward 22013

- 常量: `Constant.PROT_ACTIVITY_NDAYS_COLLECT_REWARD_22013`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | byte | `this.dayIndex` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=22014` — activity exchange detail 22014

- 常量: `Constant.PROT_ACTIVITY_EXCHANGE_DETAIL_22014`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.activityId` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `exchangeId` |
| 2 | int | `itemID` |
| 3 | string | `name` |
| 4 | string | `description` |
| 5 | int | `icon` |
| 6 | int | `amount` |
| 7 | int | `curAmount` |
| 8 | int | `itemID` |
| 9 | string | `name` |
| 10 | string | `description` |
| 11 | int | `icon` |
| 12 | int | `amount` |
| 13 | int | `maxExchangeTimes` |
| 14 | int | `exchangedTimes` |
| 15 | int | `activityId` |
| 16 | byte | `rankingTo` |
| 17 | string | `name` |
| 18 | string | `description` |
| 19 | int | `icon` |
| 20 | int | `amount` |
| 21 | long | `playerID` |
| 22 | string | `nickName` |
| 23 | int | `avata` |
| 24 | string | `allianceName` |
| 25 | byte | `badgeType` |
| 26 | int | `badge` |
| 27 | int | `rank` |
| 28 | long | `rankingScore` |
| 29 | int | `activityId` |
| 30 | int | `sectionId` |
| 31 | string | `sectionName` |
| 32 | string | `rcName` |
| 33 | string | `extraDescription` |
| 34 | int | `rcAmount` |
| 35 | long | `progressValue` |
| 36 | long | `progressTarget` |
| 37 | byte | `collectStatus` |
| 38 | int | `activityId` |
| 39 | byte | `codeUsed` |
| 40 | string | `name` |
| 41 | string | `description` |
| 42 | int | `icon` |
| 43 | int | `amount` |
| 44 | string | `code` |
| 45 | string | `codeRequirement` |
| 46 | int | `invitedCount` |
| 47 | int | `maxInvitedCount` |
| 48 | int | `sectionId` |
| 49 | byte | `collectStatus` |
| 50 | string | `sectionName` |
| 51 | string | `rcName` |
| 52 | string | `extraDescription` |
| 53 | int | `rcAmount` |
| 54 | long | `progressValue` |
| 55 | long | `progressTarget` |
| 56 | byte | `codeUsed` |
| 57 | string | `code` |
| 58 | string | `codeRequirement` |
| 59 | int | `invitedCount` |
| 60 | int | `maxInvitedCount` |
| 61 | int | `sectionId` |
| 62 | byte | `collectStatus` |
| 63 | string | `sectionName` |
| 64 | long | `progressValue` |
| 65 | long | `progressTarget` |
| 66 | string | `rcName` |
| 67 | string | `extraDescription` |
| 68 | int | `rcAmount` |
| 69 | int | `sectionId` |
| 70 | string | `sectionName` |
| 71 | string | `rcName` |
| 72 | string | `extraDescription` |
| 73 | int | `rcAmount` |
| 74 | long | `progressValue` |
| 75 | long | `progressTarget` |
| 76 | int | `activityId` |
| 77 | byte | `rankingTo` |
| 78 | string | `name` |
| 79 | string | `description` |
| 80 | int | `icon` |
| 81 | int | `amount` |
| 82 | int | `allianceId` |
| 83 | string | `allianceName` |
| 84 | byte | `badgeType` |
| 85 | int | `badge` |
| 86 | long | `rankingScore` |
| 87 | int | `activityId` |
| 88 | string | `activityName` |
| 89 | int | `activityId` |
| 90 | string | `flag` |
| 91 | long | `startTime` |
| 92 | long | `endTime` |
| 93 | byte | `timeLimited` |
| 94 | long | `remainTime` |
| 95 | int | `activityType` |
| 96 | byte | `activitySubType` |
| 97 | int | `activityGroupId` |
| 98 | int | `redPointType` |
| 99 | long | `redPointUnimark` |
| 100 | int | `regDaysLimited` |

---

#### `cmd=22015` — activity exchange collect reward 22015

- 常量: `Constant.PROT_ACTIVITY_EXCHANGE_COLLECT_REWARD_22015`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.activityId` |
| 2 | int | `this.exchangeId` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=22016` — activity ranking detail 22016

- 常量: `Constant.PROT_ACTIVITY_RANKING_DETAIL_22016`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.activityId` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `rankingTo` |
| 2 | string | `name` |
| 3 | string | `description` |
| 4 | int | `icon` |
| 5 | int | `amount` |
| 6 | long | `playerID` |
| 7 | string | `nickName` |
| 8 | int | `avata` |
| 9 | string | `allianceName` |
| 10 | byte | `badgeType` |
| 11 | int | `badge` |
| 12 | int | `rank` |
| 13 | long | `rankingScore` |
| 14 | int | `activityId` |
| 15 | int | `sectionId` |
| 16 | string | `sectionName` |
| 17 | string | `rcName` |
| 18 | string | `extraDescription` |
| 19 | int | `rcAmount` |
| 20 | long | `progressValue` |
| 21 | long | `progressTarget` |
| 22 | byte | `collectStatus` |
| 23 | int | `activityId` |
| 24 | byte | `codeUsed` |
| 25 | string | `name` |
| 26 | string | `description` |
| 27 | int | `icon` |
| 28 | int | `amount` |
| 29 | string | `code` |
| 30 | string | `codeRequirement` |
| 31 | int | `invitedCount` |
| 32 | int | `maxInvitedCount` |
| 33 | int | `sectionId` |
| 34 | byte | `collectStatus` |
| 35 | string | `sectionName` |
| 36 | string | `rcName` |
| 37 | string | `extraDescription` |
| 38 | int | `rcAmount` |
| 39 | long | `progressValue` |
| 40 | long | `progressTarget` |
| 41 | byte | `codeUsed` |
| 42 | string | `code` |
| 43 | string | `codeRequirement` |
| 44 | int | `invitedCount` |
| 45 | int | `maxInvitedCount` |
| 46 | int | `sectionId` |
| 47 | byte | `collectStatus` |
| 48 | string | `sectionName` |
| 49 | long | `progressValue` |
| 50 | long | `progressTarget` |
| 51 | string | `rcName` |
| 52 | string | `extraDescription` |
| 53 | int | `rcAmount` |
| 54 | int | `sectionId` |
| 55 | string | `sectionName` |
| 56 | string | `rcName` |
| 57 | string | `extraDescription` |
| 58 | int | `rcAmount` |
| 59 | long | `progressValue` |
| 60 | long | `progressTarget` |
| 61 | int | `activityId` |
| 62 | byte | `rankingTo` |
| 63 | string | `name` |
| 64 | string | `description` |
| 65 | int | `icon` |
| 66 | int | `amount` |
| 67 | int | `allianceId` |
| 68 | string | `allianceName` |
| 69 | byte | `badgeType` |
| 70 | int | `badge` |
| 71 | long | `rankingScore` |
| 72 | int | `activityId` |
| 73 | string | `activityName` |
| 74 | int | `activityId` |
| 75 | string | `flag` |
| 76 | long | `startTime` |
| 77 | long | `endTime` |
| 78 | byte | `timeLimited` |
| 79 | long | `remainTime` |
| 80 | int | `activityType` |
| 81 | byte | `activitySubType` |
| 82 | int | `activityGroupId` |
| 83 | int | `redPointType` |
| 84 | long | `redPointUnimark` |
| 85 | int | `regDaysLimited` |

---

#### `cmd=22017` — activity landmark detail 22017

- 常量: `Constant.PROT_ACTIVITY_LANDMARK_DETAIL_22017`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.activityId` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `sectionId` |
| 2 | string | `sectionName` |
| 3 | string | `rcName` |
| 4 | string | `extraDescription` |
| 5 | int | `rcAmount` |
| 6 | long | `progressValue` |
| 7 | long | `progressTarget` |
| 8 | byte | `collectStatus` |
| 9 | int | `activityId` |
| 10 | byte | `codeUsed` |
| 11 | string | `name` |
| 12 | string | `description` |
| 13 | int | `icon` |
| 14 | int | `amount` |
| 15 | string | `code` |
| 16 | string | `codeRequirement` |
| 17 | int | `invitedCount` |
| 18 | int | `maxInvitedCount` |
| 19 | int | `sectionId` |
| 20 | byte | `collectStatus` |
| 21 | string | `sectionName` |
| 22 | string | `rcName` |
| 23 | string | `extraDescription` |
| 24 | int | `rcAmount` |
| 25 | long | `progressValue` |
| 26 | long | `progressTarget` |
| 27 | byte | `codeUsed` |
| 28 | string | `code` |
| 29 | string | `codeRequirement` |
| 30 | int | `invitedCount` |
| 31 | int | `maxInvitedCount` |
| 32 | int | `sectionId` |
| 33 | byte | `collectStatus` |
| 34 | string | `sectionName` |
| 35 | long | `progressValue` |
| 36 | long | `progressTarget` |
| 37 | string | `rcName` |
| 38 | string | `extraDescription` |
| 39 | int | `rcAmount` |
| 40 | int | `sectionId` |
| 41 | string | `sectionName` |
| 42 | string | `rcName` |
| 43 | string | `extraDescription` |
| 44 | int | `rcAmount` |
| 45 | long | `progressValue` |
| 46 | long | `progressTarget` |
| 47 | int | `activityId` |
| 48 | byte | `rankingTo` |
| 49 | string | `name` |
| 50 | string | `description` |
| 51 | int | `icon` |
| 52 | int | `amount` |
| 53 | int | `allianceId` |
| 54 | string | `allianceName` |
| 55 | byte | `badgeType` |
| 56 | int | `badge` |
| 57 | long | `rankingScore` |
| 58 | int | `activityId` |
| 59 | string | `activityName` |
| 60 | int | `activityId` |
| 61 | string | `flag` |
| 62 | long | `startTime` |
| 63 | long | `endTime` |
| 64 | byte | `timeLimited` |
| 65 | long | `remainTime` |
| 66 | int | `activityType` |
| 67 | byte | `activitySubType` |
| 68 | int | `activityGroupId` |
| 69 | int | `redPointType` |
| 70 | long | `redPointUnimark` |
| 71 | int | `regDaysLimited` |

---

#### `cmd=22018` — activity landmark collect reward 22018

- 常量: `Constant.PROT_ACTIVITY_LANDMARK_COLLECT_REWARD_22018`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.activityId` |
| 2 | int | `this.sectionId` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=22019` — activity rookie invite detail 22019

- 常量: `Constant.PROT_ACTIVITY_ROOKIE_INVITE_DETAIL_22019`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `codeUsed` |
| 2 | string | `name` |
| 3 | string | `description` |
| 4 | int | `icon` |
| 5 | int | `amount` |
| 6 | string | `code` |
| 7 | string | `codeRequirement` |
| 8 | int | `invitedCount` |
| 9 | int | `maxInvitedCount` |
| 10 | int | `sectionId` |
| 11 | byte | `collectStatus` |
| 12 | string | `sectionName` |
| 13 | string | `rcName` |
| 14 | string | `extraDescription` |
| 15 | int | `rcAmount` |
| 16 | long | `progressValue` |
| 17 | long | `progressTarget` |
| 18 | byte | `codeUsed` |
| 19 | string | `code` |
| 20 | string | `codeRequirement` |
| 21 | int | `invitedCount` |
| 22 | int | `maxInvitedCount` |
| 23 | int | `sectionId` |
| 24 | byte | `collectStatus` |
| 25 | string | `sectionName` |
| 26 | long | `progressValue` |
| 27 | long | `progressTarget` |
| 28 | string | `rcName` |
| 29 | string | `extraDescription` |
| 30 | int | `rcAmount` |
| 31 | int | `sectionId` |
| 32 | string | `sectionName` |
| 33 | string | `rcName` |
| 34 | string | `extraDescription` |
| 35 | int | `rcAmount` |
| 36 | long | `progressValue` |
| 37 | long | `progressTarget` |
| 38 | int | `activityId` |
| 39 | byte | `rankingTo` |
| 40 | string | `name` |
| 41 | string | `description` |
| 42 | int | `icon` |
| 43 | int | `amount` |
| 44 | int | `allianceId` |
| 45 | string | `allianceName` |
| 46 | byte | `badgeType` |
| 47 | int | `badge` |
| 48 | long | `rankingScore` |
| 49 | int | `activityId` |
| 50 | string | `activityName` |
| 51 | int | `activityId` |
| 52 | string | `flag` |
| 53 | long | `startTime` |
| 54 | long | `endTime` |
| 55 | byte | `timeLimited` |
| 56 | long | `remainTime` |
| 57 | int | `activityType` |
| 58 | byte | `activitySubType` |
| 59 | int | `activityGroupId` |
| 60 | int | `redPointType` |
| 61 | long | `redPointUnimark` |
| 62 | int | `regDaysLimited` |

---

#### `cmd=22020` — activity rookie invite use code 22020

- 常量: `Constant.PROT_ACTIVITY_ROOKIE_INVITE_USE_CODE_22020`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | string | `this.code` |

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---

#### `cmd=22021` — activity rookie invite get code 22021

- 常量: `Constant.PROT_ACTIVITY_ROOKIE_INVITE_GET_CODE_22021`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `code` |

---

#### `cmd=22022` — activity rookie invite collect reward 22022

- 常量: `Constant.PROT_ACTIVITY_ROOKIE_INVITE_COLLECT_REWARD_22022`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.sectionId` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=22023` — activity player recall detail 22023

- 常量: `Constant.PROT_ACTIVITY_PLAYER_RECALL_DETAIL_22023`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `codeUsed` |
| 2 | string | `code` |
| 3 | string | `codeRequirement` |
| 4 | int | `invitedCount` |
| 5 | int | `maxInvitedCount` |
| 6 | int | `sectionId` |
| 7 | byte | `collectStatus` |
| 8 | string | `sectionName` |
| 9 | long | `progressValue` |
| 10 | long | `progressTarget` |
| 11 | string | `rcName` |
| 12 | string | `extraDescription` |
| 13 | int | `rcAmount` |
| 14 | int | `sectionId` |
| 15 | string | `sectionName` |
| 16 | string | `rcName` |
| 17 | string | `extraDescription` |
| 18 | int | `rcAmount` |
| 19 | long | `progressValue` |
| 20 | long | `progressTarget` |
| 21 | int | `activityId` |
| 22 | byte | `rankingTo` |
| 23 | string | `name` |
| 24 | string | `description` |
| 25 | int | `icon` |
| 26 | int | `amount` |
| 27 | int | `allianceId` |
| 28 | string | `allianceName` |
| 29 | byte | `badgeType` |
| 30 | int | `badge` |
| 31 | long | `rankingScore` |
| 32 | int | `activityId` |
| 33 | string | `activityName` |
| 34 | int | `activityId` |
| 35 | string | `flag` |
| 36 | long | `startTime` |
| 37 | long | `endTime` |
| 38 | byte | `timeLimited` |
| 39 | long | `remainTime` |
| 40 | int | `activityType` |
| 41 | byte | `activitySubType` |
| 42 | int | `activityGroupId` |
| 43 | int | `redPointType` |
| 44 | long | `redPointUnimark` |
| 45 | int | `regDaysLimited` |

---

#### `cmd=22024` — activity player recall collect reward 22024

- 常量: `Constant.PROT_ACTIVITY_PLAYER_RECALL_COLLECT_REWARD_22024`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.sectionId` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=22025` — activity player recall use code 22025

- 常量: `Constant.PROT_ACTIVITY_PLAYER_RECALL_USE_CODE_22025`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | string | `this.code` |

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---

#### `cmd=22026` — activity player recall get code 22026

- 常量: `Constant.PROT_ACTIVITY_PLAYER_RECALL_GET_CODE_22026`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `code` |

---

#### `cmd=22027` — activity landmark alliance detail 22027

- 常量: `Constant.PROT_ACTIVITY_LANDMARK_ALLIANCE_DETAIL_22027`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.activityId` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `sectionId` |
| 2 | string | `sectionName` |
| 3 | string | `rcName` |
| 4 | string | `extraDescription` |
| 5 | int | `rcAmount` |
| 6 | long | `progressValue` |
| 7 | long | `progressTarget` |
| 8 | int | `activityId` |
| 9 | byte | `rankingTo` |
| 10 | string | `name` |
| 11 | string | `description` |
| 12 | int | `icon` |
| 13 | int | `amount` |
| 14 | int | `allianceId` |
| 15 | string | `allianceName` |
| 16 | byte | `badgeType` |
| 17 | int | `badge` |
| 18 | long | `rankingScore` |
| 19 | int | `activityId` |
| 20 | string | `activityName` |
| 21 | int | `activityId` |
| 22 | string | `flag` |
| 23 | long | `startTime` |
| 24 | long | `endTime` |
| 25 | byte | `timeLimited` |
| 26 | long | `remainTime` |
| 27 | int | `activityType` |
| 28 | byte | `activitySubType` |
| 29 | int | `activityGroupId` |
| 30 | int | `redPointType` |
| 31 | long | `redPointUnimark` |
| 32 | int | `regDaysLimited` |

---

#### `cmd=22028` — activity ranking alliance detail 22028

- 常量: `Constant.PROT_ACTIVITY_RANKING_ALLIANCE_DETAIL_22028`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.activityId` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `rankingTo` |
| 2 | string | `name` |
| 3 | string | `description` |
| 4 | int | `icon` |
| 5 | int | `amount` |
| 6 | int | `allianceId` |
| 7 | string | `allianceName` |
| 8 | byte | `badgeType` |
| 9 | int | `badge` |
| 10 | long | `rankingScore` |
| 11 | int | `activityId` |
| 12 | string | `activityName` |
| 13 | int | `activityId` |
| 14 | string | `flag` |
| 15 | long | `startTime` |
| 16 | long | `endTime` |
| 17 | byte | `timeLimited` |
| 18 | long | `remainTime` |
| 19 | int | `activityType` |
| 20 | byte | `activitySubType` |
| 21 | int | `activityGroupId` |
| 22 | int | `redPointType` |
| 23 | long | `redPointUnimark` |
| 24 | int | `regDaysLimited` |

---

#### `cmd=22029` — activity roulette detail 22029

- 常量: `Constant.PROT_ACTIVITY_ROULETTE_DETAIL_22029`

**请求参数**: 无（类未定义 encode）

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---

#### `cmd=22030` — activity roulette dice 22030

- 常量: `Constant.PROT_ACTIVITY_ROULETTE_DICE_22030`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | byte | `this.times` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `name` |
| 2 | string | `description` |
| 3 | int | `icon` |
| 4 | int | `amount` |

---

#### `cmd=22031` — activity group list 22031

- 常量: `Constant.PROT_ACTIVITY_GROUP_LIST_22031`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `activityGroupId` |
| 2 | string | `activityGroupName` |

---

#### `cmd=23001` — stratagem list 23001

- 常量: `Constant.PROT_STRATAGEM_LIST_23001`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.targetType` |
| 2 | int | `this.targetTileY)` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `signalFlareCount` |
| 2 | int | `stratagemId` |
| 3 | int | `needLevel` |
| 4 | string | `maxEffective` |
| 5 | string | `name` |
| 6 | string | `desc` |
| 7 | int | `needSignalFlare` |
| 8 | string | `detail` |
| 9 | string | `detailParam` |

---

#### `cmd=23002` — stratagem status 23002

- 常量: `Constant.PROT_STRATAGEM_STATUS_23002`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `stratagemStatusType` |
| 2 | int | `stratagemIcon` |
| 3 | string | `stratagemName` |
| 4 | readDouble | `effective` |
| 5 | long | `remainTime` |

---

#### `cmd=23003` — use troop stratagem 23003

- 常量: `Constant.PROT_USE_TROOP_STRATAGEM_23003`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.stratagemId` |
| 2 | long | `this.targetExpxeditionId` |
| 3 | long | `this.selectOfficer` |
| 4 | long | `e.key` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `remainTime` |
| 2 | string | `message` |

---

#### `cmd=23004` — use maptile stratagem 23004

- 常量: `Constant.PROT_USE_MAPTILE_STRATAGEM_23004`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.stratagemId` |
| 2 | int | `this.targetX` |
| 3 | int | `this.targetY` |
| 4 | long | `this.selectOfficer` |
| 5 | long | `e.key` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `remainTime` |
| 2 | string | `message` |

---
