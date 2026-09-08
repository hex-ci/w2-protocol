# 名将

> 42 个命令（cmd 11001 ~ 11059）

#### `cmd=11001` — officers recruitable list 11001

- 常量: `Constant.PROT_OFFICERS_RECRUITABLE_LIST_11001`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `remainSlots` |
| 2 | string | `freeRefreshName` |
| 3 | int | `freeRefreshIcon` |
| 4 | string | `freeRefreshDescription` |
| 5 | int | `freeRefreshCount` |
| 6 | int | `freeRefreshCountMax` |
| 7 | long | `officerId` |
| 8 | string | `officerName` |
| 9 | int | `icon` |
| 10 | int | `level` |
| 11 | int | `star` |
| 12 | int | `logisticsBase` |
| 13 | int | `militaryBase` |
| 14 | int | `knowledgeBase` |
| 15 | int | `faithful` |
| 16 | int | `salary` |
| 17 | int | `goldRequired` |
| 18 | int | `isSpecialOfficer` |

---

#### `cmd=11002` — officers info 11002

- 常量: `Constant.PROT_OFFICERS_INFO_11002`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.officerId` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `officerId` |
| 2 | int | `prototypeId` |
| 3 | string | `officerName` |
| 4 | int | `icon` |
| 5 | int | `level` |
| 6 | int | `star` |
| 7 | int | `experience` |
| 8 | int | `experienceNextLevel` |
| 9 | int | `logisticsBase` |
| 10 | int | `militaryBase` |
| 11 | int | `knowledgeBase` |
| 12 | int | `faithful` |
| 13 | int | `salary` |
| 14 | int | `potential` |
| 15 | int | `attack` |
| 16 | int | `defence` |
| 17 | int | `leaderShip` |
| 18 | int | `skillId` |
| 19 | string | `icon` |
| 20 | string | `skillName` |
| 21 | int | `skillLevel` |
| 22 | string | `skillDescription` |
| 23 | long | `equipmentId` |
| 24 | string | `name` |
| 25 | int | `icon` |
| 26 | int | `position` |
| 27 | byte | `level` |
| 28 | int | `levelRequiredOnWear` |
| 29 | int | `military` |
| 30 | int | `knowledge` |
| 31 | int | `logistics` |
| 32 | int | `attack` |
| 33 | int | `defence` |
| 34 | int | `isBind` |
| 35 | string | `description` |
| 36 | byte | `curEndure` |
| 37 | byte | `maxEndure` |
| 38 | int | `goldRequiredOnRepair` |
| 39 | int | `promotionItemCount` |
| 40 | short | `logisticsAdd` |
| 41 | short | `militaryAdd` |
| 42 | short | `knowledgeAdd` |
| 43 | short | `attackAdd` |
| 44 | short | `defenceAdd` |
| 45 | short | `leaderShipAdd` |
| 46 | byte | `isOfficerTroop` |
| 47 | byte | `isSackable` |
| 48 | int | `itemId` |
| 49 | string | `itemName` |
| 50 | byte | `talentValue` |
| 51 | int | `talentAddByCimelia` |

---

#### `cmd=11003` — officers recruitable refresh free 11003

- 常量: `Constant.PROT_OFFICERS_RECRUITABLE_REFRESH_FREE_11003`

**请求参数**: 无（类未定义 encode）

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=11004` — officers recruit 11004

- 常量: `Constant.PROT_OFFICERS_RECRUIT_11004`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.officerId` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `officerId` |
| 2 | string | `officerName` |
| 3 | int | `icon` |
| 4 | int | `level` |
| 5 | int | `status` |

---

#### `cmd=11007` — officers upgrade 11007

- 常量: `Constant.PROT_OFFICERS_UPGRADE_11007`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.officerId` |
| 2 | byte | `this.autoUpgrade` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `officerId` |
| 2 | int | `level` |
| 3 | int | `experience` |
| 4 | int | `experienceNextLevel` |
| 5 | int | `potential` |
| 6 | int | `salary` |

---

#### `cmd=11008` — officers retrain 11008

- 常量: `Constant.PROT_OFFICERS_RETRAIN_11008`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.officerId` |
| 2 | byte | `this.confirmUsingDiamond` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `message` |

---

#### `cmd=11009` — officers apply potential 11009

- 常量: `Constant.PROT_OFFICERS_APPLY_POTENTIAL_11009`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.officerId` |
| 2 | int | `this.knowledgeAdd` |
| 3 | int | `this.militaryAdd` |
| 4 | int | `this.logisticsAdd` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=11010` — officers appoint mayor 11010

- 常量: `Constant.PROT_OFFICERS_APPOINT_MAYOR_11010`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.officerId` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=11011` — officers dismissal 11011

- 常量: `Constant.PROT_OFFICERS_DISMISSAL_11011`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.officerId` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=11012` — officers fire 11012

- 常量: `Constant.PROT_OFFICERS_FIRE_11012`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.officerId` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=11013` — officers captured release 11013

- 常量: `Constant.PROT_OFFICERS_CAPTURED_RELEASE_11013`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.officerId` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `officerId` |

---

#### `cmd=11014` — officers captured convince 11014

- 常量: `Constant.PROT_OFFICERS_CAPTURED_CONVINCE_11014`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.officerId` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `officerId` |
| 2 | byte | `officerStatus` |

---

#### `cmd=11015` — officers captured kill 11015

- 常量: `Constant.PROT_OFFICERS_CAPTURED_KILL_11015`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.officerId` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `officerId` |
| 2 | string | `officerSaid` |

---

#### `cmd=11018` — officers promotion 11018

- 常量: `Constant.PROT_OFFICERS_PROMOTION_11018`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.officerId` |
| 2 | byte | `this.confirmUsingDiamond` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `message` |
| 2 | long | `officerId` |
| 3 | string | `message` |

---

#### `cmd=11019` — officers eliminate skill 11019

- 常量: `Constant.PROT_OFFICERS_ELIMINATE_SKILL_11019`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.officerId` |
| 2 | int | `this.skillId` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=11020` — officers awardable items 11020

- 常量: `Constant.PROT_OFFICERS_AWARDABLE_ITEMS_11020`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.officerId` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `goldAward` |
| 2 | int | `itemID` |
| 3 | int | `icon` |
| 4 | string | `name` |
| 5 | string | `description` |
| 6 | int | `amount` |

---

#### `cmd=11021` — officers award gold 11021

- 常量: `Constant.PROT_OFFICERS_AWARD_GOLD_11021`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.officerId` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=11022` — officers wear equipment 11022

- 常量: `Constant.PROT_OFFICERS_WEAR_EQUIPMENT_11022`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.officerId` |
| 2 | long | `this.equipmentId` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=11023` — officers takeoff equipment 11023

- 常量: `Constant.PROT_OFFICERS_TAKEOFF_EQUIPMENT_11023`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.officerId` |
| 2 | long | `this.equipmentId` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=11024` — officers takeoff all equipments 11024

- 常量: `Constant.PROT_OFFICERS_TAKEOFF_ALL_EQUIPMENTS_11024`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.officerId` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=11027` — officers list in city 11027

- 常量: `Constant.PROT_OFFICERS_LIST_IN_CITY_11027`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `officerId` |
| 2 | string | `officerName` |
| 3 | int | `icon` |
| 4 | int | `level` |
| 5 | int | `star` |
| 6 | int | `logisticsBase` |
| 7 | int | `militaryBase` |
| 8 | int | `knowledgeBase` |
| 9 | int | `faithful` |
| 10 | int | `salary` |
| 11 | int | `status` |
| 12 | int | `attack` |
| 13 | int | `defence` |
| 14 | int | `prototypeId` |
| 15 | int | `leaderShip` |
| 16 | short | `logisticsAdd` |
| 17 | short | `militaryAdd` |
| 18 | short | `knowledgeAdd` |
| 19 | int | `skillOilAdd` |
| 20 | int | `logisticsItemAdd` |
| 21 | int | `militaryItemAdd` |
| 22 | int | `knowledgeItemAdd` |
| 23 | int | `logisticsWithoutItemAndTroop` |
| 24 | int | `militaryWithoutItemAndTroop` |
| 25 | int | `knowledgeWithoutItemAndTroop` |
| 26 | byte | `isOfficerTroop` |
| 27 | int | `officerTroopId` |
| 28 | byte | `isMainOfficer` |
| 29 | long | `mainOfficerId` |
| 30 | int | `leaderShipAdditionPercent` |
| 31 | int | `talentAddByCimelia` |

---

#### `cmd=11031` — officers recruit famous 11031

- 常量: `Constant.PROT_OFFICERS_RECRUIT_FAMOUS_11031`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.itemId` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=11032` — officers recruit normal 11032

- 常量: `Constant.PROT_OFFICERS_RECRUIT_NORMAL_11032`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.itemId` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `message` |

---

#### `cmd=11034` — officers study skill 11034

- 常量: `Constant.PROT_OFFICERS_STUDY_SKILL_11034`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.officerId` |
| 2 | int | `this.itemId` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `message` |

---

#### `cmd=11035` — officers add experience 11035

- 常量: `Constant.PROT_OFFICERS_ADD_EXPERIENCE_11035`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.itemId` |
| 2 | int | `this.amount` |
| 3 | long | `this.officerId` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=11036` — officers award item 11036

- 常量: `Constant.PROT_OFFICERS_AWARD_ITEM_11036`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.itemId` |
| 2 | long | `this.officerId` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=11038` — officers troop create 11038

- 常量: `Constant.PROT_OFFICERS_TROOP_CREATE_11038`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.leader` |
| 2 | int | `this.aides.length` |
| … | 循环 | `for(var e` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=11039` — officers arguments for officer troop calculate 11039

- 常量: `Constant.PROT_OFFICERS_ARGUMENTS_FOR_OFFICER_TROOP_CALCULATE_11039`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `militaryPercent` |
| 2 | int | `knowledgePercent` |
| 3 | int | `logisticsPercent` |
| 4 | int | `firstPercent` |
| 5 | int | `secondPercent` |
| 6 | int | `thirdPercent` |
| 7 | int | `militaryState` |
| 8 | int | `knowledgeState` |
| 9 | int | `logisticsState` |
| 10 | int | `militaryPri` |
| 11 | int | `knowledgePri` |
| 12 | int | `logisticsPri` |

---

#### `cmd=11040` — officers troop update 11040

- 常量: `Constant.PROT_OFFICERS_TROOP_UPDATE_11040`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.troopId` |
| 2 | long | `this.leader` |
| 3 | int | `this.aides.length` |
| … | 循环 | `for(var e` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=11041` — officers troop dismiss 11041

- 常量: `Constant.PROT_OFFICERS_TROOP_DISMISS_11041`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.troopId` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=11042` — officers status 11042

- 常量: `Constant.PROT_OFFICERS_STATUS_11042`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.officerId` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `attrType` |
| 2 | int | `percentValue` |
| 3 | string | `itemName` |
| 4 | long | `remainTime` |

---

#### `cmd=11043` — officers enhance 11043

- 常量: `Constant.PROT_OFFICERS_ENHANCE_11043`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.itemId` |
| 2 | long | `this.officerId` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=11044` — officers equipments wearable 11044

- 常量: `Constant.PROT_OFFICERS_EQUIPMENTS_WEARABLE_11044`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.equipmentPosition` |
| 2 | long | `this.officerId` |
| 3 | byte | `this.pageSize` |
| 4 | int | `this.pageNum` |
| 5 | string | `this.keyword` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `pageNum` |
| 2 | int | `pageCount` |
| 3 | long | `equipmentId` |
| 4 | string | `name` |
| 5 | int | `icon` |
| 6 | byte | `level` |
| 7 | int | `military` |
| 8 | int | `knowledge` |
| 9 | int | `logistics` |
| 10 | int | `attack` |
| 11 | int | `defence` |
| 12 | int | `levelRequiredOnWear` |
| 13 | byte | `isWeared` |
| 14 | byte | `isSuitEquipment` |

---

#### `cmd=11045` — officers troop skill prototype list 11045

- 常量: `Constant.PROT_OFFICERS_TROOP_SKILL_PROTOTYPE_LIST_11045`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `troopSkillId` |
| 2 | string | `icon` |
| 3 | string | `skillName` |
| 4 | int | `skillLevel` |
| 5 | string | `skillLevelDescription` |
| 6 | string | `skillLevelBonusDescription` |
| 7 | int | `logisticsAdd` |
| 8 | int | `militaryAdd` |
| 9 | int | `knowledgeAdd` |
| 10 | long | `prototypeId` |
| 11 | int | `icon` |
| 12 | string | `officerName` |
| 13 | int | `alreadyOwned` |

---

#### `cmd=11046` — officers commision defense 11046

- 常量: `Constant.PROT_OFFICERS_COMMISION_DEFENSE_11046`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.officerId` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `officerId` |

---

#### `cmd=11047` — officers retire defense 11047

- 常量: `Constant.PROT_OFFICERS_RETIRE_DEFENSE_11047`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.officerId` |

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---

#### `cmd=11048` — officers recruitable refresh by item 11048

- 常量: `Constant.PROT_OFFICERS_RECRUITABLE_REFRESH_BY_ITEM_11048`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.itemID` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=11049` — officers suits wearable 11049

- 常量: `Constant.PROT_OFFICERS_SUITS_WEARABLE_11049`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.officerId` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `suitId` |
| 2 | string | `name` |
| 3 | int | `levelRequiredOnWear` |

---

#### `cmd=11050` — officers wear suit 11050

- 常量: `Constant.PROT_OFFICERS_WEAR_SUIT_11050`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.officerId` |
| 2 | int | `this.suitId` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=11057` — officers level promotion info 11057

- 常量: `Constant.PROT_OFFICERS_LEVEL_PROMOTION_INFO_11057`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.officerId` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `officerId` |
| 2 | int | `promoteAvailable` |
| 3 | int | `levelFrom` |
| 4 | int | `levelTo` |
| 5 | int | `extraTalent` |
| 6 | string | `newName` |
| 7 | string | `detail` |
| 8 | int | `itemId` |
| 9 | string | `itemName` |
| 10 | int | `needCount` |
| 11 | int | `haveCount` |

---

#### `cmd=11058` — officers level promote 11058

- 常量: `Constant.PROT_OFFICERS_LEVEL_PROMOTE_11058`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.officerId` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `officerId` |
| 2 | string | `officerName` |
| 3 | int | `level` |
| 4 | int | `talent` |

---

#### `cmd=11059` — officers add potential 11059

- 常量: `Constant.PROT_OFFICERS_ADD_POTENTIAL_11059`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.itemId` |
| 2 | long | `this.officerId` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `officerId` |
| 2 | int | `talent` |
| 3 | int | `talentAddByCimelia` |

---
