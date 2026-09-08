# 地图与战报

> 53 个命令（cmd 15001 ~ 19018）

#### `cmd=15001` — map tiles info 15001

- 常量: `Constant.PROT_MAP_TILES_INFO_15001`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.centerY)` |
| 2 | int | `this.ids.length` |
| … | 循环 | `for(var e=0` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `count` |

---

#### `cmd=15002` — map tile info 15002

- 常量: `Constant.PROT_MAP_TILE_INFO_15002`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.sendTileX` |
| 2 | int | `this.sendTileY` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=15003` — map tile add collect 15003

- 常量: `Constant.PROT_MAP_TILE_ADD_COLLECT_15003`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.x` |
| 2 | int | `this.y` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `message` |

---

#### `cmd=15004` — map tile delere collect 15004

- 常量: `Constant.PROT_MAP_TILE_DELERE_COLLECT_15004`
- 成功判定: `status1=this.status()||2=this.status()`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.x` |
| 2 | int | `this.y` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `type` |
| 2 | string | `message` |
| 3 | int | `type` |
| 4 | int | `fieldType` |
| 5 | string | `cityIcon` |
| 6 | string | `cityName` |
| 7 | string | `nuclearIcon` |
| 8 | string | `nuclearName` |
| 9 | string | `allianceName` |
| 10 | string | `fieldIcon` |
| 11 | string | `fieldName` |
| 12 | string | `strongholdIcon` |
| 13 | string | `strongholdName` |
| 14 | int | `x` |
| 15 | int | `y` |
| 16 | string | `remark` |
| 17 | int | `linesCount` |
| 18 | long | `expeditionId` |
| 19 | int | `startX` |
| 20 | int | `startY` |
| 21 | int | `endX` |
| 22 | int | `endY` |
| 23 | string | `mark` |
| 24 | string | `officerName` |
| 25 | int | `officerIcon` |
| 26 | int | `officerLevel` |
| 27 | long | `playerId` |
| 28 | string | `playerName` |
| 29 | int | `avata` |
| 30 | string | `playerName` |
| 31 | string | `allianceName` |
| 32 | string | `title` |
| 33 | string | `titleColor` |
| 34 | long | `onewayTime` |
| 35 | long | `remainingTime` |
| 36 | int | `state` |
| 37 | int | `armyCount` |
| 38 | int | `type` |
| 39 | int | `relationship` |
| 40 | long | `fromCityId` |
| 41 | long | `targetExpeditionId` |
| 42 | int | `x` |
| 43 | int | `y` |
| 44 | long | `arrivedTime` |
| 45 | int | `pageNum` |
| 46 | int | `pageCount` |
| 47 | long | `tradeId` |
| 48 | byte | `tradeResourceType` |
| 49 | int | `tradeAmount` |
| 50 | string | `unitPrice` |
| 51 | int | `totalPrice` |
| 52 | long | `tradeTime` |
| 53 | int | `sellerAvata` |
| 54 | string | `sellerNickname` |
| 55 | string | `sellerAllianceName` |
| 56 | string | `confirmMessage` |

---

#### `cmd=15006` — owned map tiles 15006

- 常量: `Constant.PROT_OWNED_MAP_TILES_15006`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `index` |
| 2 | int | `x` |
| 3 | int | `y` |
| 4 | byte | `type` |
| 5 | string | `name` |
| 6 | string | `icon` |
| 7 | int | `specailIcon` |
| 8 | int | `level` |
| 9 | byte | `state` |
| 10 | long | `gatherTime` |
| 11 | string | `icon` |
| 12 | byte | `state` |

---

#### `cmd=15007` — start gather 15007

- 常量: `Constant.PROT_START_GATHER_15007`
- 成功判定: `status1=this.status()||2=this.status()`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.ownedTileId` |
| 2 | long | `this.troopId` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `normalAmount` |
| 2 | int | `additionAmount` |
| 3 | int | `finalAmount` |
| 4 | int | `icon` |
| 5 | string | `name` |
| 6 | int | `chance` |
| 7 | string | `_otherIcon` |
| 8 | string | `name` |
| 9 | int | `amount` |
| 10 | int | `merchandiseId` |
| 11 | string | `name` |
| 12 | int | `icon` |
| 13 | int | `amount` |
| 14 | int | `price` |

---

#### `cmd=15008` — single harvest 15008

- 常量: `Constant.PROT_SINGLE_HARVEST_15008`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.ownedTileId` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `gatherTime` |
| 2 | string | `message` |

---

#### `cmd=15009` — discard map tile 15009

- 常量: `Constant.PROT_DISCARD_MAP_TILE_15009`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.ownedTileId` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `message` |

---

#### `cmd=15010` — batch harvest 15010

- 常量: `Constant.PROT_BATCH_HARVEST_15010`
- 成功判定: `status1=this.status()||2=this.status()`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | byte | `1` |
| 2 | int | `this.tileIds.length` |
| … | 循环 | `for(var e=0` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `type` |
| 2 | string | `message` |
| 3 | int | `type` |
| 4 | int | `fieldType` |
| 5 | string | `cityIcon` |
| 6 | string | `cityName` |
| 7 | string | `nuclearIcon` |
| 8 | string | `nuclearName` |
| 9 | string | `allianceName` |
| 10 | string | `fieldIcon` |
| 11 | string | `fieldName` |
| 12 | string | `strongholdIcon` |
| 13 | string | `strongholdName` |
| 14 | int | `x` |
| 15 | int | `y` |
| 16 | string | `remark` |
| 17 | int | `linesCount` |
| 18 | long | `expeditionId` |
| 19 | int | `startX` |
| 20 | int | `startY` |
| 21 | int | `endX` |
| 22 | int | `endY` |
| 23 | string | `mark` |
| 24 | string | `officerName` |
| 25 | int | `officerIcon` |
| 26 | int | `officerLevel` |
| 27 | long | `playerId` |
| 28 | string | `playerName` |
| 29 | int | `avata` |
| 30 | string | `playerName` |
| 31 | string | `allianceName` |
| 32 | string | `title` |
| 33 | string | `titleColor` |
| 34 | long | `onewayTime` |
| 35 | long | `remainingTime` |
| 36 | int | `state` |
| 37 | int | `armyCount` |
| 38 | int | `type` |
| 39 | int | `relationship` |
| 40 | long | `fromCityId` |
| 41 | long | `targetExpeditionId` |
| 42 | int | `x` |
| 43 | int | `y` |
| 44 | long | `arrivedTime` |
| 45 | int | `pageNum` |
| 46 | int | `pageCount` |
| 47 | long | `tradeId` |
| 48 | byte | `tradeResourceType` |
| 49 | int | `tradeAmount` |
| 50 | string | `unitPrice` |
| 51 | int | `totalPrice` |
| 52 | long | `tradeTime` |
| 53 | int | `sellerAvata` |
| 54 | string | `sellerNickname` |
| 55 | string | `sellerAllianceName` |
| 56 | string | `confirmMessage` |

---

#### `cmd=15011` — broadcast alliance mark update 26012

- 常量: `Constant.PROT_BROADCAST_ALLIANCE_MARK_UPDATE_26012`
- 成功判定: `status!0`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `_status` |
| 2 | int | `tileX` |
| 3 | int | `tileY` |
| 4 | string | `title` |
| 5 | string | `icon` |
| 6 | long | `time` |

---

#### `cmd=15013` — map area list 15013

- 常量: `Constant.PROT_MAP_AREA_LIST_15013`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `areaId` |
| 2 | int | `cityCount` |
| 3 | int | `fillRate` |
| 4 | int | `randomMoveDiamondPrice` |
| 5 | int | `randomMoveItemCount` |

---

#### `cmd=15014` — map tile collected 15014

- 常量: `Constant.PROT_MAP_TILE_COLLECTED_15014`
- 成功判定: `status1=this.status()||2=this.status()`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `0` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `type` |
| 2 | int | `fieldType` |
| 3 | string | `cityIcon` |
| 4 | string | `cityName` |
| 5 | string | `nuclearIcon` |
| 6 | string | `nuclearName` |
| 7 | string | `allianceName` |
| 8 | string | `fieldIcon` |
| 9 | string | `fieldName` |
| 10 | string | `strongholdIcon` |
| 11 | string | `strongholdName` |
| 12 | int | `x` |
| 13 | int | `y` |
| 14 | string | `remark` |
| 15 | int | `linesCount` |
| 16 | long | `expeditionId` |
| 17 | int | `startX` |
| 18 | int | `startY` |
| 19 | int | `endX` |
| 20 | int | `endY` |
| 21 | string | `mark` |
| 22 | string | `officerName` |
| 23 | int | `officerIcon` |
| 24 | int | `officerLevel` |
| 25 | long | `playerId` |
| 26 | string | `playerName` |
| 27 | int | `avata` |
| 28 | string | `playerName` |
| 29 | string | `allianceName` |
| 30 | string | `title` |
| 31 | string | `titleColor` |
| 32 | long | `onewayTime` |
| 33 | long | `remainingTime` |
| 34 | int | `state` |
| 35 | int | `armyCount` |
| 36 | int | `type` |
| 37 | int | `relationship` |
| 38 | long | `fromCityId` |
| 39 | long | `targetExpeditionId` |
| 40 | int | `x` |
| 41 | int | `y` |
| 42 | long | `arrivedTime` |
| 43 | int | `pageNum` |
| 44 | int | `pageCount` |
| 45 | long | `tradeId` |
| 46 | byte | `tradeResourceType` |
| 47 | int | `tradeAmount` |
| 48 | string | `unitPrice` |
| 49 | int | `totalPrice` |
| 50 | long | `tradeTime` |
| 51 | int | `sellerAvata` |
| 52 | string | `sellerNickname` |
| 53 | string | `sellerAllianceName` |
| 54 | string | `confirmMessage` |

---

#### `cmd=15015` — troop lines info 15015

- 常量: `Constant.PROT_TROOP_LINES_INFO_15015`
- 成功判定: `status1=this.status()||2=this.status()`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.centerX` |
| 2 | int | `this.centerY` |
| 3 | int | `this.radius` |
| 4 | byte | `this.selfVisible` |
| 5 | byte | `this.membersVisible` |
| 6 | byte | `this.attackVisible` |
| 7 | byte | `this.membersAttackVisible` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `linesCount` |
| 2 | long | `expeditionId` |
| 3 | int | `startX` |
| 4 | int | `startY` |
| 5 | int | `endX` |
| 6 | int | `endY` |
| 7 | string | `mark` |
| 8 | string | `officerName` |
| 9 | int | `officerIcon` |
| 10 | int | `officerLevel` |
| 11 | long | `playerId` |
| 12 | string | `playerName` |
| 13 | int | `avata` |
| 14 | string | `playerName` |
| 15 | string | `allianceName` |
| 16 | string | `title` |
| 17 | string | `titleColor` |
| 18 | long | `onewayTime` |
| 19 | long | `remainingTime` |
| 20 | int | `state` |
| 21 | int | `armyCount` |
| 22 | int | `type` |
| 23 | int | `relationship` |
| 24 | long | `fromCityId` |
| 25 | long | `targetExpeditionId` |
| 26 | int | `x` |
| 27 | int | `y` |
| 28 | long | `arrivedTime` |
| 29 | int | `pageNum` |
| 30 | int | `pageCount` |
| 31 | long | `tradeId` |
| 32 | byte | `tradeResourceType` |
| 33 | int | `tradeAmount` |
| 34 | string | `unitPrice` |
| 35 | int | `totalPrice` |
| 36 | long | `tradeTime` |
| 37 | int | `sellerAvata` |
| 38 | string | `sellerNickname` |
| 39 | string | `sellerAllianceName` |
| 40 | string | `confirmMessage` |

---

#### `cmd=15016` — broadcast alliance mark update 26012

- 常量: `Constant.PROT_BROADCAST_ALLIANCE_MARK_UPDATE_26012`
- 成功判定: `status!0`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `_status` |
| 2 | int | `tileX` |
| 3 | int | `tileY` |
| 4 | string | `title` |
| 5 | string | `icon` |
| 6 | long | `time` |

---

#### `cmd=15017` — npc productions 15017

- 常量: `Constant.PROT_NPC_PRODUCTIONS_15017`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.tileId` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `productionCount` |
| 2 | int | `itemID` |
| 3 | int | `icon` |
| 4 | string | `name` |
| 5 | string | `description` |
| 6 | int | `dropRate` |
| 7 | int | `amount` |

---

#### `cmd=15018` — broadcast alliance mark update 26012

- 常量: `Constant.PROT_BROADCAST_ALLIANCE_MARK_UPDATE_26012`
- 成功判定: `status!0`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `_status` |
| 2 | int | `tileX` |
| 3 | int | `tileY` |
| 4 | string | `title` |
| 5 | string | `icon` |
| 6 | long | `time` |

---

#### `cmd=16001` — trade info 16001

- 常量: `Constant.PROT_TRADE_INFO_16001`
- 成功判定: `status0=this.status()||1=this.status()`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `autoBuyFood` |
| 2 | long | `tradeId` |
| 3 | byte | `tradeState` |
| 4 | byte | `restrictFlag` |
| 5 | byte | `tradeResourceType` |
| 6 | int | `tradeAmount` |
| 7 | string | `unitPrice` |
| 8 | int | `totalPrice` |
| 9 | long | `tradeTime` |
| 10 | long | `remainTime` |
| 11 | long | `buildingID` |
| 12 | int | `prototypeID` |
| 13 | int | `level` |
| 14 | int | `position` |
| 15 | int | `buildingStatus` |
| 16 | long | `remainTime` |
| 17 | long | `finishiTime` |
| 18 | long | `totalTime` |

---

#### `cmd=16002` — trade cancel 16002

- 常量: `Constant.PROT_TRADE_CANCEL_16002`
- 成功判定: `status1=this.status()||2=this.status()`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.tradeId` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `pageNum` |
| 2 | int | `pageCount` |
| 3 | long | `tradeId` |
| 4 | byte | `tradeResourceType` |
| 5 | int | `tradeAmount` |
| 6 | string | `unitPrice` |
| 7 | int | `totalPrice` |
| 8 | long | `tradeTime` |
| 9 | int | `sellerAvata` |
| 10 | string | `sellerNickname` |
| 11 | string | `sellerAllianceName` |
| 12 | string | `confirmMessage` |

---

#### `cmd=16003` — trade sell to system 16003

- 常量: `Constant.PROT_TRADE_SELL_TO_SYSTEM_16003`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.foodAmount` |
| 2 | int | `this.steelAmount` |
| 3 | int | `this.oilAmount` |
| 4 | int | `this.mineralAmount` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=16004` — trade buy from system 16004

- 常量: `Constant.PROT_TRADE_BUY_FROM_SYSTEM_16004`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.foodAmount` |
| 2 | int | `this.steelAmount` |
| 3 | int | `this.oilAmount` |
| 4 | int | `this.mineralAmount` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=16005` — trade sell to player 16005

- 常量: `Constant.PROT_TRADE_SELL_TO_PLAYER_16005`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | byte | `this.tradeResourceType` |
| 2 | int | `this.resourceAmount` |
| 3 | int | `this.totalPrice` |
| 4 | int | `this.timeLimit` |
| 5 | byte | `this.restrictFlag` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=16006` — trade available list 16006

- 常量: `Constant.PROT_TRADE_AVAILABLE_LIST_16006`
- 成功判定: `status1=this.status()||2=this.status()`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | byte | `this.tradeResourceType` |
| 2 | byte | `this.restrictFlag` |
| 3 | string | `this.keywordOfNickname` |
| 4 | int | `this.pageSize` |
| 5 | int | `this.pageNum` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `pageNum` |
| 2 | int | `pageCount` |
| 3 | long | `tradeId` |
| 4 | byte | `tradeResourceType` |
| 5 | int | `tradeAmount` |
| 6 | string | `unitPrice` |
| 7 | int | `totalPrice` |
| 8 | long | `tradeTime` |
| 9 | int | `sellerAvata` |
| 10 | string | `sellerNickname` |
| 11 | string | `sellerAllianceName` |
| 12 | string | `confirmMessage` |

---

#### `cmd=16007` — trade buy from player 16007

- 常量: `Constant.PROT_TRADE_BUY_FROM_PLAYER_16007`
- 成功判定: `status1=this.status()||2=this.status()`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.tradeId` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `confirmMessage` |

---

#### `cmd=16008` — trade speedup 16008

- 常量: `Constant.PROT_TRADE_SPEEDUP_16008`
- 成功判定: `status1=this.status()||2=this.status()`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.tradeId` |
| 2 | byte | `this.confirmed` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `confirmMessage` |

---

#### `cmd=17001` — building military building list 17001

- 常量: `Constant.PROT_BUILDING_MILITARY_BUILDING_LIST_17001`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `buildingID` |
| 2 | int | `prototypeID` |
| 3 | int | `level` |
| 4 | int | `position` |
| 5 | int | `buildingStatus` |
| 6 | long | `remainTime` |
| 7 | long | `finishTime` |
| 8 | long | `totalTime` |
| 9 | byte | `helped` |

---

#### `cmd=17002` — building production building list 17002

- 常量: `Constant.PROT_BUILDING_PRODUCTION_BUILDING_LIST_17002`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `resourceBuildingAreaCount` |
| 2 | long | `buildingID` |
| 3 | int | `prototypeID` |
| 4 | int | `level` |
| 5 | int | `position` |
| 6 | int | `buildingStatus` |
| 7 | long | `remainTime` |
| 8 | long | `finishTime` |
| 9 | long | `totalTime` |
| 10 | byte | `helped` |

---

#### `cmd=17003` — building construction 17003

- 常量: `Constant.PROT_BUILDING_CONSTRUCTION_17003`
- 成功判定: `status1=this.status()||0=this.status()`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.buildingPrototypeId` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `buildingID` |
| 2 | int | `prototypeID` |
| 3 | int | `level` |
| 4 | int | `position` |
| 5 | int | `buildingStatus` |
| 6 | long | `remainTime` |
| 7 | long | `finishiTime` |
| 8 | long | `totalTime` |

---

#### `cmd=17004` — building cancel operation 17004

- 常量: `Constant.PROT_BUILDING_CANCEL_OPERATION_17004`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.buildingID` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `prototypeID` |
| 2 | int | `position` |

---

#### `cmd=17005` — building destruction 17005

- 常量: `Constant.PROT_BUILDING_DESTRUCTION_17005`
- 成功判定: `status0=this.status()||1=this.status()`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.buildingID` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `buildingID` |
| 2 | int | `prototypeID` |
| 3 | int | `level` |
| 4 | int | `position` |
| 5 | int | `buildingStatus` |
| 6 | long | `remainTime` |
| 7 | long | `finishiTime` |
| 8 | long | `totalTime` |

---

#### `cmd=17006` — building upgrade 17006

- 常量: `Constant.PROT_BUILDING_UPGRADE_17006`
- 成功判定: `status0=this.status()||1=this.status()`

**请求参数**: 无（空参命令，AES 明文 0 字节，密文恒为 16B 填充块）

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `buildingID` |
| 2 | int | `prototypeID` |
| 3 | int | `level` |
| 4 | int | `position` |
| 5 | int | `buildingStatus` |
| 6 | long | `remainTime` |
| 7 | long | `finishiTime` |
| 8 | long | `totalTime` |

---

#### `cmd=17007` — building upgrade downgrade info 17007

- 常量: `Constant.PROT_BUILDING_UPGRADE_DOWNGRADE_INFO_17007`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.buildingId` |
| 2 | int | `this.prototypeID` |
| 3 | int | `this.position` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `prototypeId` |
| 2 | int | `buildingStatus` |
| 3 | long | `remainTime` |
| 4 | long | `finishiTime` |
| 5 | int | `position` |
| 6 | string | `levelDescription` |
| 7 | byte | `allowUpgrade` |
| 8 | int | `steelRequired` |
| 9 | int | `mineralRequired` |
| 10 | int | `populationRequired` |
| 11 | int | `foodRequired` |
| 12 | int | `oilRequired` |
| 13 | int | `rankRequired` |
| 14 | int | `prototypeId` |
| 15 | int | `level` |
| 16 | int | `curLevel` |
| 17 | int | `techniqueId` |
| 18 | int | `level` |
| 19 | int | `curLevel` |
| 20 | int | `amount` |
| 21 | int | `curAmount` |
| 22 | string | `name` |
| 23 | int | `itemId` |
| 24 | int | `icon` |
| 25 | byte | `instantBuy` |
| 26 | int | `price` |
| 27 | string | `nextLevelDescription` |
| 28 | long | `upgradeNeedTime` |
| 29 | byte | `allowDowngrade` |
| 30 | int | `returnPopulation` |
| 31 | int | `returnFood` |
| 32 | int | `returnMineral` |
| 33 | int | `returnOil` |
| 34 | int | `returnSteel` |
| 35 | long | `downgradeNeedTime` |

---

#### `cmd=17009` — building buildable list 17009

- 常量: `Constant.PROT_BUILDING_BUILDABLE_LIST_17009`
- 成功判定: `status1=this.status()||0=this.status()`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.sceneType` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `prototypeId` |
| 2 | byte | `buildable` |
| 3 | long | `time` |
| 4 | byte | `costalCityRequired` |
| 5 | string | `levelDescription` |
| 6 | string | `buildDescription` |
| 7 | int | `steelRequired` |
| 8 | int | `mineralRequired` |
| 9 | int | `populationRequired` |
| 10 | int | `foodRequired` |
| 11 | int | `oilRequired` |
| 12 | int | `rankRequired` |
| 13 | int | `prototypeId` |
| 14 | int | `level` |
| 15 | int | `curLevel` |
| 16 | int | `techniqueId` |
| 17 | int | `level` |
| 18 | int | `curLevel` |
| 19 | int | `amount` |
| 20 | int | `curAmount` |
| 21 | string | `name` |
| 22 | int | `itemId` |
| 23 | int | `icon` |

---

#### `cmd=17010` — building speedup building 17010

- 常量: `Constant.PROT_BUILDING_SPEEDUP_BUILDING_17010`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.itemId` |
| 2 | long | `this.buildingId` |
| 3 | int | `this.useCount` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=17011` — building prototype list 17011

- 常量: `Constant.PROT_BUILDING_PROTOTYPE_LIST_17011`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `prototypeId` |
| 2 | string | `name` |
| 3 | string | `des` |

---

#### `cmd=17013` — building speedup free 17013

- 常量: `Constant.PROT_BUILDING_SPEEDUP_FREE_17013`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.buildingId` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=19001` — expedition pre data 19001

- 常量: `Constant.PROT_EXPEDITION_PRE_DATA_19001`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | byte | `this.isPveChallenge` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | short | `capacityAdditionPercent` |
| 2 | short | `landSppedAdditionPercent` |
| 3 | short | `airSpeedAdditionPercent` |
| 4 | short | `allySpeedAdditionPercent` |
| 5 | short | `commandArtAdditionPercent` |
| 6 | short | `armyFlagAdditionPercent` |
| 7 | byte | `commanderCount` |
| 8 | long | `officerId` |
| 9 | string | `officerName` |
| 10 | short | `addPercent` |
| 11 | string | `skillOilCost` |
| 12 | long | `curServerTime` |
| 13 | string | `consumeOil` |
| 14 | string | `allianceTechCostOil` |
| 15 | readDouble | `globalArmySpeedAdd` |
| 16 | readDouble | `countryMettleDispatchArmyCountAddition` |

---

#### `cmd=19002` — expedition troop detail 19002

- 常量: `Constant.PROT_EXPEDITION_TROOP_DETAIL_19002`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.sendExpeditionId` |

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---

#### `cmd=19003` — expedition excute 19003

- 常量: `Constant.PROT_EXPEDITION_EXCUTE_19003`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | byte | `this.armyKindCount` |
| … | 循环 | `for(var e=0` |
| 2 | int | `this.selectArmies[e].count` |
| 3 | int | `this.targetX` |
| 4 | int | `this.targetY` |
| 5 | byte | `this.expeditionType` |
| 6 | byte | `0` |
| 7 | long | `this.commanderId` |
| 8 | int | `0` |
| 9 | long | `this.carryFood` |
| 10 | long | `this.carrySteel` |
| 11 | long | `this.carryOil` |
| 12 | long | `this.carryMineral` |
| 13 | long | `this.carryGold` |
| 14 | int | `this.transportTimeInterval` |
| 15 | int | `this.transportTotalNum` |
| 16 | int | `this.assemblyId` |
| 17 | int | `this.allianceCapitalFort` |
| 18 | byte | `this.isBreakTruce` |
| 19 | long | `t.key` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `truceTag` |
| 2 | string | `tipMsg` |

---

#### `cmd=19004` — expedition troop recall 19004

- 常量: `Constant.PROT_EXPEDITION_TROOP_RECALL_19004`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.troopId` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=19005` — expedition auto transport info 19005

- 常量: `Constant.PROT_EXPEDITION_AUTO_TRANSPORT_INFO_19005`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `totalCount` |
| 2 | int | `queueCount` |
| 3 | long | `id` |
| 4 | int | `type` |
| 5 | int | `status` |
| 6 | int | `startX` |
| 7 | int | `startY` |
| 8 | int | `endX` |
| 9 | int | `endY` |
| 10 | string | `startCityName` |
| 11 | string | `endCityName` |
| 12 | string | `startIcon` |
| 13 | string | `endIcon` |
| 14 | int | `timeInterval` |
| 15 | int | `totalNum` |
| 16 | int | `sucNum` |

---

#### `cmd=19006` — expedition cancel auto transport 19006

- 常量: `Constant.PROT_EXPEDITION_CANCEL_AUTO_TRANSPORT_19006`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.queueCount` |
| … | 循环 | `for(var e=0` |

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---

#### `cmd=19007` — expedition warning list 19007

- 常量: `Constant.PROT_EXPEDITION_WARNING_LIST_19007`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.perPageSize` |
| 2 | int | `this.pageNum` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `curPage` |
| 2 | int | `totalPage` |
| 3 | long | `reportId` |
| 4 | byte | `visibleLevel` |
| 5 | byte | `expeditionType` |
| 6 | byte | `expeditionState` |
| 7 | string | `commanderName` |
| 8 | string | `startPlace` |
| 9 | int | `startX` |
| 10 | int | `startY` |
| 11 | int | `targetPlaceType` |
| 12 | string | `targetPlace` |
| 13 | string | `targetIcon` |
| 14 | int | `targetX` |
| 15 | int | `targetY` |
| 16 | long | `arriveTime` |
| 17 | long | `remainTime` |
| 18 | long | `battleId` |
| 19 | long | `stuckTime` |
| 20 | int | `stuckX` |
| 21 | int | `stuckY` |

---

#### `cmd=19008` — expedition self 19008

- 常量: `Constant.PROT_EXPEDITION_SELF_19008`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.perPageSize` |
| 2 | int | `this.pageNum` |
| 3 | byte | `this.filterState` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `curPage` |
| 2 | int | `totalPage` |
| 3 | long | `reportId` |
| 4 | byte | `expeditionType` |
| 5 | byte | `expeditionState` |
| 6 | string | `startPlace` |
| 7 | int | `startX` |
| 8 | int | `startY` |
| 9 | int | `targetPlaceType` |
| 10 | string | `targetPlace` |
| 11 | string | `targetIcon` |
| 12 | int | `targetX` |
| 13 | int | `targetY` |
| 14 | long | `arriveTime` |
| 15 | long | `remainTime` |
| 16 | long | `battleId` |
| 17 | long | `stuckTime` |
| 18 | int | `stuckX` |
| 19 | int | `stuckY` |

---

#### `cmd=19009` — expedition current city armies 19009

- 常量: `Constant.PROT_EXPEDITION_CURRENT_CITY_ARMIES_19009`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `id` |
| 2 | int | `count` |

---

#### `cmd=19010` — expedition warning list filter 19010

- 常量: `Constant.PROT_EXPEDITION_WARNING_LIST_FILTER_19010`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.perPageSize` |
| 2 | int | `this.pageNum` |
| 3 | byte | `this.filterType` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `curPage` |
| 2 | int | `totalPage` |
| 3 | long | `reportId` |
| 4 | byte | `visibleLevel` |
| 5 | byte | `expeditionType` |
| 6 | byte | `expeditionState` |
| 7 | string | `commanderName` |
| 8 | string | `startPlace` |
| 9 | int | `startX` |
| 10 | int | `startY` |
| 11 | int | `targetPlaceType` |
| 12 | string | `targetPlace` |
| 13 | int | `targetX` |
| 14 | int | `targetY` |
| 15 | string | `targetIcon` |
| 16 | long | `arriveTime` |
| 17 | long | `remainTime` |
| 18 | long | `battleId` |

---

#### `cmd=19011` — expedition ambush armies 19011

- 常量: `Constant.PROT_EXPEDITION_AMBUSH_ARMIES_19011`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.expeditionId` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `armyTyprCount` |
| 2 | int | `id` |
| 3 | int | `count` |

---

#### `cmd=19012` — expedition ambush excute 19012

- 常量: `Constant.PROT_EXPEDITION_AMBUSH_EXCUTE_19012`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | byte | `this.armyKindCount` |
| … | 循环 | `for(var e=0` |
| 2 | int | `this.selectArmies[e].count` |
| 3 | long | `this.commanderId` |
| 4 | int | `this.assemblyId` |
| 5 | long | `this.expeditionId` |
| 6 | byte | `this.isBreakTruce` |
| 7 | long | `t.key` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `truceTag` |
| 2 | string | `tipMsg` |

---

#### `cmd=19013` — expedition seek path 19013

- 常量: `Constant.PROT_EXPEDITION_SEEK_PATH_19013`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | byte | `this.expType` |
| 2 | int | `this.sx` |
| 3 | int | `this.sy` |
| 4 | int | `this.dx` |
| 5 | int | `this.dy` |
| 6 | byte | `this.pathType` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=19014` — expedition retarget 19014

- 常量: `Constant.PROT_EXPEDITION_RETARGET_19014`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.expeditionId` |
| 2 | int | `this.expType` |
| 3 | int | `this.dx` |
| 4 | int | `this.dy` |
| 5 | int | `this.pathLength` |
| 6 | byte | `this.confirmed?1:0` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `confirmMessage` |

---

#### `cmd=19015` — expedition my expedition list 19015

- 常量: `Constant.PROT_EXPEDITION_MY_EXPEDITION_LIST_19015`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `x` |
| 2 | int | `y` |
| 3 | long | `arrivedTime` |

---

#### `cmd=19016` — expedition request garrison 19016

- 常量: `Constant.PROT_EXPEDITION_REQUEST_GARRISON_19016`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.expeditionId` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=19017` — expedition request execute command on field 19017

- 常量: `Constant.PROT_EXPEDITION_REQUEST_EXECUTE_COMMAND_ON_FIELD_19017`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.expeditionId` |
| 2 | int | `this.expeditionType` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=19018` — expedition troop stop 19018

- 常量: `Constant.PROT_EXPEDITION_TROOP_STOP_19018`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.troopId` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---
