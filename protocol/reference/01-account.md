# 账号与玩家

> 34 个命令（cmd 1001 ~ 1050）

#### `cmd=1001` — player login 1001

- 常量: `Constant.PROT_PLAYER_LOGIN_1001`
- 成功判定: `status1=this.status()||2=this.status()`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.userId` |
| 2 | string | `this.username` |
| 3 | int | `this.clientVer` |
| 4 | string | `this.platform` |
| 5 | string | `this.channel` |
| 6 | string | `this.language` |
| 7 | string | `this.appKey` |
| 8 | string | `this.wst` |
| 9 | string | `this.installID` |
| 10 | byte | `this.stopLoginIfOnline` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `identity` |
| 2 | long | `pushThreshold` |
| 3 | byte | `age` |
| 4 | long | `onlineTime` |
| 5 | string | `realName` |

---

#### `cmd=1003` — broadcast player kicked off 1003

- 常量: `Constant.PROT_BROADCAST_PLAYER_KICKED_OFF_1003`
- 成功判定: `status!0`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `_status` |
| 2 | string | `_errorMessage` |
| 3 | string | `message` |

---

#### `cmd=1004` — p

- 常量: `Constant.PROT_P`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.userId` |
| 2 | string | `this.username` |
| 3 | int | `this.clientVer` |
| 4 | string | `this.platform` |
| 5 | string | `this.channel` |
| 6 | string | `this.language` |
| 7 | string | `this.appKey` |
| 8 | string | `this.initChannel` |
| 9 | string | `this.installID` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `age` |
| 2 | long | `onlineTime` |
| 3 | string | `realName` |

---

#### `cmd=1005` — player core info 1005

- 常量: `Constant.PROT_PLAYER_CORE_INFO_1005`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `gameStatus` |
| 2 | int | `diamondOwned` |
| 3 | long | `activeCityID` |
| 4 | int | `totalCityCount` |
| 5 | int | `totalPopulationCount` |
| 6 | int | `totalOfficerCount` |
| 7 | int | `newbieProtect` |
| 8 | string | `cityImg` |
| 9 | int | `nuclearCount` |
| 10 | int | `helpedCount` |
| 11 | int | `maxHelpCount` |
| 12 | int | `resBuildingCount` |
| 13 | int | `vip` |
| 14 | long | `diamondCharged` |

---

#### `cmd=1006` — player rename 1006

- 常量: `Constant.PROT_PLAYER_RENAME_1006`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | string | `this.newName` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `newName` |

---

#### `cmd=1007` — player active truce 1007

- 常量: `Constant.PROT_PLAYER_ACTIVE_TRUCE_1007`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.itemID` |
| 2 | int | `this.hours` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `timeString` |

---

#### `cmd=1008` — player flaund create 1008

- 常量: `Constant.PROT_PLAYER_FLAUND_CREATE_1008`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | byte | `this.flaundType` |
| 2 | long | `this.targetId` |
| 3 | string | `this.targetName` |
| 4 | int | `this.targetLevel` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `flauntId` |
| 2 | string | `targetName` |
| 3 | byte | `flaundType` |
| 4 | int | `targetLevel` |
| 5 | string | `battleFieldName` |
| 6 | int | `battleFieldX` |
| 7 | int | `battleFieldY` |

---

#### `cmd=1009` — player flaund query 1009

- 常量: `Constant.PROT_PLAYER_FLAUND_QUERY_1009`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.flaundId` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `flaundType` |
| 2 | string | `name` |
| 3 | string | `description` |
| 4 | int | `icon` |
| 5 | byte | `level` |
| 6 | string | `name` |
| 7 | int | `icon` |
| 8 | int | `position` |
| 9 | byte | `level` |
| 10 | int | `levelRequiredOnWear` |
| 11 | int | `military` |
| 12 | int | `knowledge` |
| 13 | int | `logistics` |
| 14 | int | `attack` |
| 15 | int | `defence` |
| 16 | int | `isBind` |
| 17 | string | `description` |
| 18 | byte | `curEndure` |
| 19 | byte | `maxEndure` |
| 20 | string | `suitDescription` |
| 21 | long | `officerId` |
| 22 | int | `prototypeId` |
| 23 | string | `officerName` |
| 24 | int | `icon` |
| 25 | int | `level` |
| 26 | int | `star` |
| 27 | int | `experience` |
| 28 | int | `experienceNextLevel` |
| 29 | int | `logisticsBase` |
| 30 | int | `militaryBase` |
| 31 | int | `knowledgeBase` |
| 32 | int | `faithful` |
| 33 | int | `salary` |
| 34 | int | `potential` |
| 35 | int | `attack` |
| 36 | int | `defence` |
| 37 | int | `leaderShip` |
| 38 | int | `skillId` |
| 39 | string | `icon` |
| 40 | string | `skillName` |
| 41 | int | `skillLevel` |
| 42 | string | `skillDescription` |
| 43 | long | `equipmentId` |
| 44 | string | `name` |
| 45 | int | `icon` |
| 46 | int | `position` |
| 47 | byte | `level` |
| 48 | int | `levelRequiredOnWear` |
| 49 | int | `military` |
| 50 | int | `knowledge` |
| 51 | int | `logistics` |
| 52 | int | `attack` |
| 53 | int | `defence` |
| 54 | int | `isBind` |
| 55 | string | `description` |
| 56 | byte | `curEndure` |
| 57 | byte | `maxEndure` |
| 58 | int | `goldRequiredOnRepair` |
| 59 | int | `promotionItemCount` |
| 60 | short | `logisticsAdd` |
| 61 | short | `militaryAdd` |
| 62 | short | `knowledgeAdd` |
| 63 | short | `attackAdd` |
| 64 | short | `defenceAdd` |
| 65 | short | `leaderShipAdd` |
| 66 | byte | `isOfficerTroop` |
| 67 | byte | `isSackable` |
| 68 | long | `reportId` |
| 69 | string | `url` |

---

#### `cmd=1012` — player set enemy 1012

- 常量: `Constant.PROT_PLAYER_SET_ENEMY_1012`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.playerId` |
| 2 | byte | `this.truceTag` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `truceTag` |
| 2 | string | `tipMsg` |

---

#### `cmd=1013` — player designation change 1013

- 常量: `Constant.PROT_PLAYER_DESIGNATION_CHANGE_1013`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | string | `this.designation` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `designation` |

---

#### `cmd=1014` — player avata list 1014

- 常量: `Constant.PROT_PLAYER_AVATA_LIST_1014`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `prototypeId` |
| 2 | int | `avata` |
| 3 | string | `avataName` |
| 4 | int | `itemID` |
| 5 | string | `name` |
| 6 | byte | `donotConsumeCimelia` |

---

#### `cmd=1015` — player status list 1015

- 常量: `Constant.PROT_PLAYER_STATUS_LIST_1015`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `statusId` |
| 2 | string | `statusName` |
| 3 | long | `expireTime` |

---

#### `cmd=1016` — player avata change 1016

- 常量: `Constant.PROT_PLAYER_AVATA_CHANGE_1016`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.prototypeId` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `avata` |

---

#### `cmd=1017` — player full detail 1017

- 常量: `Constant.PROT_PLAYER_FULL_DETAIL_1017`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `playerID` |
| 2 | string | `nickname` |
| 3 | int | `racial` |
| 4 | int | `gender` |
| 5 | int | `avatar` |
| 6 | int | `district` |
| 7 | string | `designation` |
| 8 | long | `fame` |
| 9 | long | `personalScore` |
| 10 | int | `rank` |
| 11 | int | `position` |
| 12 | long | `allianceId` |
| 13 | int | `badgeId` |
| 14 | string | `allianceName` |
| 15 | int | `alliancePosition` |
| 16 | string | `alliancePositionName` |
| 17 | int | `battleResult` |
| 18 | byte | `imgStatus` |
| 19 | string | `imgID` |
| 20 | int | `allianceDonationNulearCount` |
| 21 | long | `createTime` |
| 22 | string | `fightPromiss` |
| 23 | int | `motifyNameItemId` |
| 24 | int | `motifyNameIconId` |
| 25 | string | `motifyNameItemName` |
| 26 | string | `motifyNameItemDes` |
| 27 | int | `motifyNameItemCnt` |
| 28 | int | `changePlayerNameDiamondNeed` |
| 29 | int | `motifyFlagItemId` |
| 30 | int | `motifyFlagIconId` |
| 31 | string | `motifyFlagItemName` |
| 32 | string | `motifyFlagItemDes` |
| 33 | int | `motifyFlagItemCnt` |
| 34 | int | `changeDesignationDiamondNeed` |
| 35 | int | `vip` |
| 36 | byte | `guestPresentSwitch` |
| 37 | long | `influence` |
| 38 | byte | `curCountry` |

---

#### `cmd=1018` — player newbie guide sumbit 1018

- 常量: `Constant.PROT_PLAYER_NEWBIE_GUIDE_SUMBIT_1018`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | byte | `this.taskStep` |
| 2 | byte | `this.handlerStep` |

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---

#### `cmd=1020` — player blacklist names 1020

- 常量: `Constant.PROT_PLAYER_BLACKLIST_NAMES_1020`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `maxCount` |
| 2 | long | `playerID` |
| 3 | string | `nickname` |
| 4 | int | `avata` |
| 5 | string | `allianceName` |
| 6 | long | `createTime` |

---

#### `cmd=1021` — player blacklist add 1021

- 常量: `Constant.PROT_PLAYER_BLACKLIST_ADD_1021`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.playerId` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=1022` — player blacklist remove 1022

- 常量: `Constant.PROT_PLAYER_BLACKLIST_REMOVE_1022`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.playerIds.length` |
| … | 循环 | `for(var e` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=1023` — player guest present switch 1023

- 常量: `Constant.PROT_PLAYER_GUEST_PRESENT_SWITCH_1023`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | byte | `this.turn` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=1024` — player title list 1024

- 常量: `Constant.PROT_PLAYER_TITLE_LIST_1024`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `titleId` |
| 2 | string | `titleName` |
| 3 | string | `color` |
| 4 | int | `state` |
| 5 | byte | `timeType` |
| 6 | long | `expireTime` |
| 7 | long | `duration` |
| 8 | byte | `activeState` |
| 9 | string | `activeMessage` |
| 10 | string | `bonusMessage` |
| 11 | int | `groupId` |
| 12 | byte | `isShow` |
| 13 | int | `militaryAdd` |
| 14 | int | `logisticsAdd` |
| 15 | int | `knowledgeAdd` |
| 16 | int | `titleBonusType` |
| 17 | int | `titleBonusSubType` |
| 18 | byte | `titleBonusValueType` |
| 19 | int | `titleBonusValue` |

---

#### `cmd=1025` — player title active deactive 1025

- 常量: `Constant.PROT_PLAYER_TITLE_ACTIVE_DEACTIVE_1025`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.titleId` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=1026` — player random name 1026

- 常量: `Constant.PROT_PLAYER_RANDOM_NAME_1026`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `randomId` |
| 2 | string | `randomName` |
| 3 | long | `expireTime` |

---

#### `cmd=1032` — broadcast player status updated 1032

- 常量: `Constant.PROT_BROADCAST_PLAYER_STATUS_UPDATED_1032`
- 成功判定: `status!0`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `_status` |
| 2 | string | `_errorMessage` |

---

#### `cmd=1033` — player online check confirmed 1033

- 常量: `Constant.PROT_PLAYER_ONLINE_CHECK_CONFIRMED_1033`
- 成功判定: `status!0`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.showTime` |
| 2 | string | `this.sign` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `_status` |
| 2 | long | `currentTime` |
| 3 | long | `showTime` |
| 4 | string | `sign` |
| 5 | byte | `type` |
| 6 | int | `offsetY` |

---

#### `cmd=1034` — player online check validate code 1034

- 常量: `Constant.PROT_PLAYER_ONLINE_CHECK_VALIDATE_CODE_1034`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | string | `this.code` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `validateStatus` |

---

#### `cmd=1035` — player trigger payment available list 1035

- 常量: `Constant.PROT_PLAYER_TRIGGER_PAYMENT_AVAILABLE_LIST_1035`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | string | `RuntimeEnviroments.payChannelId` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `paymentSkuid` |
| 2 | string | `paymentName` |
| 3 | long | `paymentShowTime` |
| 4 | long | `paymentHideTime` |
| 5 | int | `chargeItemId` |
| 6 | int | `diamondAmount` |
| 7 | string | `chargePrice` |
| 8 | int | `chargeIcon` |
| 9 | int | `itemID` |
| 10 | string | `name` |
| 11 | string | `description` |
| 12 | int | `icon` |
| 13 | int | `amount` |

---

#### `cmd=1036` — player activity payment available list 1036

- 常量: `Constant.PROT_PLAYER_ACTIVITY_PAYMENT_AVAILABLE_LIST_1036`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | string | `RuntimeEnviroments.payChannelId` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `paymentActivityId` |
| 2 | string | `paymentActivityTitle` |
| 3 | string | `paymentId` |
| 4 | string | `paymentSkuid` |
| 5 | string | `paymentName` |
| 6 | int | `paymentActivityId` |
| 7 | long | `paymentHideTime` |
| 8 | int | `chargeItemId` |
| 9 | int | `diamondAmount` |
| 10 | string | `chargePrice` |
| 11 | int | `chargeIcon` |
| 12 | int | `itemID` |
| 13 | string | `name` |
| 14 | string | `description` |
| 15 | int | `icon` |
| 16 | int | `amount` |
| 17 | int | `buyTimes` |
| 18 | int | `buyMaxTimes` |

---

#### `cmd=1037` — player activity payment preorder 1037

- 常量: `Constant.PROT_PLAYER_ACTIVITY_PAYMENT_PREORDER_1037`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | string | `this.paymentId` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `preOrderId` |

---

#### `cmd=1038` — player country confirm 1038

- 常量: `Constant.PROT_PLAYER_COUNTRY_CONFIRM_1038`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.country` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `racial` |

---

#### `cmd=1040` — ios delete account 1040

- 常量: `Constant.PROT_IOS_DELETE_ACCOUNT_1040`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.itemIds.length` |
| … | 循环 | `for(var e` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `itemID` |
| 2 | string | `name` |
| 3 | string | `description` |
| 4 | int | `icon` |

---

#### `cmd=1041` — player title show or stop 1041

- 常量: `Constant.PROT_PLAYER_TITLE_SHOW_OR_STOP_1041`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.titleId` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=1042` — player title group list 1042

- 常量: `Constant.PROT_PLAYER_TITLE_GROUP_LIST_1042`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `groupId` |
| 2 | string | `groupName` |

---

#### `cmd=1043` — player syn citizen cert status 1043

- 常量: `Constant.PROT_PLAYER_SYN_CITIZEN_CERT_STATUS_1043`

**请求参数**: 无（类未定义 encode）

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---

#### `cmd=1050` — synchronize autotrain config 1050

- 常量: `Constant.PROT_SYNCHRONIZE_AUTOTRAIN_CONFIG_1050`

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

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `autoMultiply` |
| 2 | long | `trainOfficerId` |
| 3 | string | `trainOfficerName` |
| 4 | byte | `trainMode` |
| 5 | byte | `idlePopPercent` |
| 6 | byte | `timesAddPopAfterTrain` |
| 7 | string | `cityConfig` |
| 8 | long | `expireTime` |
| 9 | byte | `autoTrain` |

---
