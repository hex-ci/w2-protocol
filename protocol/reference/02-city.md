# 城池与资源

> 27 个命令（cmd 2001 ~ 2030）

#### `cmd=2001` — city list 2001

- 常量: `Constant.PROT_CITY_LIST_2001`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `isJoinLeagueWar` |
| 2 | byte | `cityCount` |
| 3 | long | `cityId` |
| 4 | string | `cityName` |
| 5 | int | `x` |
| 6 | int | `y` |
| 7 | string | `mayor` |
| 8 | int | `population` |
| 9 | int | `morale` |
| 10 | int | `coastal` |
| 11 | int | `hasCarrier` |
| 12 | string | `imgID` |
| 13 | byte | `isColonial` |
| 14 | int | `mayorIcon` |
| 15 | int | `constructNum` |
| 16 | byte | `haveResearchingTech` |
| 17 | int | `researchingTechId` |
| 18 | int | `researchingTechLevel` |
| 19 | int | `helpNum` |
| 20 | int | `leagueScorePlunderable` |
| 21 | int | `trainingCount` |
| 22 | int | `officerCount` |
| 23 | int | `officerCountMax` |
| 24 | int | `randomMoveChance` |

---

#### `cmd=2002` — city switch 2002

- 常量: `Constant.PROT_CITY_SWITCH_2002`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.cityId` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `cityId` |

---

#### `cmd=2003` — city base info 2003

- 常量: `Constant.PROT_CITY_BASE_INFO_2003`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `foodAmount` |
| 2 | long | `foodCapacity` |
| 3 | int | `foodOriginalOutput` |
| 4 | int | `foodBasicOutput` |
| 5 | long | `foodArmyUsed` |
| 6 | int | `foodCurrentOutput` |
| 7 | long | `steelAmount` |
| 8 | long | `steelCapacity` |
| 9 | int | `steelOutput` |
| 10 | int | `steelBasicOutput` |
| 11 | long | `mineralAmount` |
| 12 | long | `mineralCapacity` |
| 13 | int | `mineralOutput` |
| 14 | int | `mineralBasicOutput` |
| 15 | long | `oilAmount` |
| 16 | long | `oilCapacity` |
| 17 | int | `oilOutput` |
| 18 | int | `oilBasicOutput` |
| 19 | int | `armyFortCount` |
| 20 | int | `armyId` |
| 21 | int | `curAmount` |
| 22 | long | `goldAmount` |
| 23 | long | `goldCapacity` |
| 24 | int | `goldBasicOutput` |
| 25 | int | `goldOfficerUsed` |
| 26 | int | `goldOutput` |
| 27 | int | `populationAmount` |
| 28 | int | `populationCapacity` |
| 29 | int | `populationIdle` |
| 30 | int | `populationTrend` |

---

#### `cmd=2004` — city relocate with target 2004

- 常量: `Constant.PROT_CITY_RELOCATE_WITH_TARGET_2004`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | byte | `this.type` |
| 2 | int | `this.newX` |
| 3 | int | `this.newY` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `newX` |
| 2 | int | `newY` |

---

#### `cmd=2006` — city avata list 2006

- 常量: `Constant.PROT_CITY_AVATA_LIST_2006`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.pageNum` |
| 2 | int | `this.pageSize` |
| 3 | long | `this.cityId` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `pageCount` |
| 2 | int | `pageNum` |
| 3 | int | `cityAvataId` |
| 4 | string | `imageId` |
| 5 | string | `cityAvataName` |
| 6 | int | `orignalPrice` |
| 7 | byte | `promotion` |
| 8 | int | `promotionPrice` |
| 9 | long | `promotionStartTime` |
| 10 | long | `promotionEndTime` |
| 11 | byte | `restriction` |
| 12 | long | `restrictionStartTime` |
| 13 | long | `restrictionEndtime` |
| 14 | byte | `purchaseAble` |
| 15 | byte | `alreadyPurchased` |
| 16 | byte | `currentActived` |
| 17 | long | `remainOrDurationTime` |

---

#### `cmd=2007` — city avata purchase 2007

- 常量: `Constant.PROT_CITY_AVATA_PURCHASE_2007`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.cityId` |
| 2 | int | `this.cityAvataId` |
| 3 | byte | `this.priceMode` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=2008` — city avata info 2008

- 常量: `Constant.PROT_CITY_AVATA_INFO_2008`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.cityId` |
| 2 | int | `this.cityAvataId` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `cityAvataId` |
| 2 | string | `imageId` |
| 3 | string | `cityAvataName` |
| 4 | int | `orignalPrice` |
| 5 | byte | `alreadyPurchased` |
| 6 | byte | `currentActived` |
| 7 | long | `remainOrDurationTime` |
| 8 | byte | `purchaseAble` |
| 9 | byte | `fameConditionDone` |
| 10 | long | `fameRequired` |
| 11 | byte | `attributeConditionDone` |
| 12 | int | `attributeMilitaryRequired` |
| 13 | int | `attributeLogisticsRequired` |
| 14 | int | `attributeKnowledgeRequired` |
| 15 | byte | `restriction` |
| 16 | long | `restrictionStartTime` |
| 17 | byte | `promotion` |
| 18 | int | `promotionPrice` |
| 19 | long | `promotionStartTime` |
| 20 | int | `promotionPrice` |

---

#### `cmd=2009` — city avata active 2009

- 常量: `Constant.PROT_CITY_AVATA_ACTIVE_2009`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | byte | `this.useType` |
| 2 | long | `this.cityId` |
| 3 | int | `this.cityAvataId` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `imageId` |

---

#### `cmd=2010` — city defense setting anti conquer 2010

- 常量: `Constant.PROT_CITY_DEFENSE_SETTING_ANTI_CONQUER_2010`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.cityId` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `conquerTime` |
| 2 | int | `chongfengValue` |
| 3 | int | `maxCount` |
| 4 | int | `armyId` |
| 5 | string | `name` |
| 6 | int | `ownedAmount` |
| 7 | int | `playAmount` |
| 8 | int | `actionCmd` |

---

#### `cmd=2012` — city defense setting save 2012

- 常量: `Constant.PROT_CITY_DEFENSE_SETTING_SAVE_2012`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.cityId` |
| 2 | int | `this.type` |
| 3 | int | `this.sendArmyList.length` |
| … | 循环 | `for(var e=0` |
| 4 | int | `t.armyId` |
| 5 | int | `t.playAmount` |

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---

#### `cmd=2013` — city defense setting anti plunder 2013

- 常量: `Constant.PROT_CITY_DEFENSE_SETTING_ANTI_PLUNDER_2013`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.cityId` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `conquerTime` |
| 2 | int | `chongfengValue` |
| 3 | int | `maxCount` |
| 4 | int | `armyId` |
| 5 | string | `name` |
| 6 | int | `ownedAmount` |
| 7 | int | `playAmount` |
| 8 | int | `actionCmd` |

---

#### `cmd=2014` — city ware house configuration 2014

- 常量: `Constant.PROT_CITY_WARE_HOUSE_CONFIGURATION_2014`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `storageCount` |
| 2 | int | `storageVolume` |
| 3 | byte | `foodPercent` |
| 4 | byte | `steelPercent` |
| 5 | byte | `oilPercent` |
| 6 | byte | `mineralPercent` |

---

#### `cmd=2015` — city ware house update configuration 2015

- 常量: `Constant.PROT_CITY_WARE_HOUSE_UPDATE_CONFIGURATION_2015`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | byte | `this.foodPercent` |
| 2 | byte | `this.steelPercent` |
| 3 | byte | `this.oilPercent` |
| 4 | byte | `this.mineralPercent` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=2016` — city morale order1 2016

- 常量: `Constant.PROT_CITY_MORALE_ORDER1_2016`

**请求参数**: 无（类未定义 encode）

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=2017` — city population order1 2017

- 常量: `Constant.PROT_CITY_POPULATION_ORDER1_2017`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.itemId` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=2018` — city resource production rate 2018

- 常量: `Constant.PROT_CITY_RESOURCE_PRODUCTION_RATE_2018`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `productionCapacity` |
| 2 | int | `maxPopulation` |
| 3 | int | `workingRate` |
| 4 | int | `natureAddition` |
| 5 | int | `technologyAdditionPercent` |
| 6 | int | `armyAddition` |
| 7 | int | `officerAdditionPercent` |
| 8 | int | `itemAdditionPercent` |
| 9 | int | `titleAdditionPercent` |
| 10 | int | `countryMettleAdditionPercent` |

---

#### `cmd=2019` — city update tax rate 2019

- 常量: `Constant.PROT_CITY_UPDATE_TAX_RATE_2019`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | byte | `this.newTaxRate` |

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---

#### `cmd=2020` — city free order for morale or population 2020

- 常量: `Constant.PROT_CITY_FREE_ORDER_FOR_MORALE_OR_POPULATION_2020`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | byte | `this.type` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=2021` — city rename 2021

- 常量: `Constant.PROT_CITY_RENAME_2021`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | string | `this.newName` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `newName` |

---

#### `cmd=2022` — city abandon 2022

- 常量: `Constant.PROT_CITY_ABANDON_2022`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.cityId` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=2023` — city build 2023

- 常量: `Constant.PROT_CITY_BUILD_2023`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.tileId` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `message` |
| 2 | long | `newCityId` |

---

#### `cmd=2025` — city relocate randomly 2025

- 常量: `Constant.PROT_CITY_RELOCATE_RANDOMLY_2025`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.areaId` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=2026` — city resource production info 2026

- 常量: `Constant.PROT_CITY_RESOURCE_PRODUCTION_INFO_2026`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `foodAmount` |
| 2 | long | `foodCapacity` |
| 3 | int | `foodBasicOutput` |
| 4 | long | `foodArmyUsed` |
| 5 | long | `steelAmount` |
| 6 | long | `steelCapacity` |
| 7 | int | `steelBasicOutput` |
| 8 | long | `mineralAmount` |
| 9 | long | `mineralCapacity` |
| 10 | int | `mineralBasicOutput` |
| 11 | long | `oilAmount` |
| 12 | long | `oilCapacity` |
| 13 | int | `oilBasicOutput` |
| 14 | long | `goldAmount` |
| 15 | long | `goldCapacity` |
| 16 | int | `goldBasicOutput` |
| 17 | int | `goldTitleExtraAdd` |
| 18 | int | `goldOutput` |
| 19 | int | `populationAmount` |
| 20 | int | `populationCapacity` |
| 21 | int | `populationIdle` |

---

#### `cmd=2027` — city order status 2027

- 常量: `Constant.PROT_CITY_ORDER_STATUS_2027`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `morale` |
| 2 | int | `grievance` |
| 3 | int | `moraleTrend` |
| 4 | int | `goldAmount` |
| 5 | int | `goldCapacity` |
| 6 | int | `taxRate` |
| 7 | int | `goldBasicOutput` |
| 8 | int | `goldTitleExtraAdd` |
| 9 | int | `goldOfficerUsed` |
| 10 | int | `goldOutput` |
| 11 | int | `populationAmount` |
| 12 | int | `populationCapacity` |
| 13 | int | `populationInWorking` |
| 14 | int | `populationIdle` |
| 15 | int | `populationTrend` |
| 16 | int | `remainingTime` |
| 17 | int | `diamondCostToAppease` |
| 18 | string | `ruleDescription` |

---

#### `cmd=2028` — city random name 2028

- 常量: `Constant.PROT_CITY_RANDOM_NAME_2028`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `randomId` |
| 2 | string | `randomName` |
| 3 | long | `expireTime` |

---

#### `cmd=2029` — city formation submit 2029

- 常量: `Constant.PROT_CITY_FORMATION_SUBMIT_2029`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | string | `this.formationConfig` |

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---

#### `cmd=2030` — city download formation 2030

- 常量: `Constant.PROT_CITY_DOWNLOAD_FORMATION_2030`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `formationConfig` |

---
