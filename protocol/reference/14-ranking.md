# 排行榜

> 12 个命令（cmd 24001 ~ 24017）

#### `cmd=24001` — ranking player 24001

- 常量: `Constant.PROT_RANKING_PLAYER_24001`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.pageNum` |
| 2 | int | `this.pageSize` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `rankingUpdateTime` |
| 2 | int | `pageNum` |
| 3 | int | `pageCount` |
| 4 | long | `playerId` |
| 5 | int | `ranking` |
| 6 | int | `rankingTrend` |
| 7 | string | `nickname` |
| 8 | int | `avata` |
| 9 | string | `allianceName` |
| 10 | byte | `rank` |
| 11 | long | `fame` |
| 12 | byte | `cityCount` |
| 13 | int | `totalPopulation` |

---

#### `cmd=24002` — ranking player info 24002

- 常量: `Constant.PROT_RANKING_PLAYER_INFO_24002`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.playerId` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `head` |
| 2 | string | `name` |
| 3 | int | `allianceId` |
| 4 | string | `allianceName` |
| 5 | int | `badge` |
| 6 | byte | `alliancePosition` |
| 7 | int | `ranking` |
| 8 | long | `fame` |
| 9 | byte | `cityCount` |
| 10 | int | `population` |
| 11 | byte | `rank` |
| 12 | byte | `position` |
| 13 | int | `exploitRanking` |
| 14 | int | `exploits` |
| 15 | string | `battleRanking` |
| 16 | byte | `bindType` |
| 17 | long | `sinaId` |
| 18 | long | `facebookId` |
| 19 | long | `personalScore` |
| 20 | long | `influence` |

---

#### `cmd=24004` — ranking city 24004

- 常量: `Constant.PROT_RANKING_CITY_24004`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.pageNum` |
| 2 | int | `this.pageSize` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `pageNum` |
| 2 | int | `pageCount` |
| 3 | int | `ranking` |
| 4 | string | `imgID` |
| 5 | string | `cityName` |
| 6 | string | `nickname` |
| 7 | string | `allianceName` |
| 8 | int | `x` |
| 9 | int | `y` |
| 10 | int | `population` |

---

#### `cmd=24006` — ranking officer 24006

- 常量: `Constant.PROT_RANKING_OFFICER_24006`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.pageNum` |
| 2 | int | `this.pageSize` |
| 3 | byte | `this.orderType` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `pageNum` |
| 2 | int | `pageCount` |
| 3 | long | `officerId` |
| 4 | int | `icon` |
| 5 | int | `ranking` |
| 6 | string | `officerName` |
| 7 | int | `level` |
| 8 | int | `logistics` |
| 9 | int | `military` |
| 10 | int | `knowledge` |
| 11 | byte | `star` |
| 12 | byte | `isSpecialOfficer` |

---

#### `cmd=24007` — ranking alliance capital 24007

- 常量: `Constant.PROT_RANKING_ALLIANCE_CAPITAL_24007`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.pageNum` |
| 2 | int | `this.pageSize` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `myAllianceRanking` |
| 2 | int | `pageNum` |
| 3 | int | `pageCount` |
| 4 | long | `allianceCapitalId` |
| 5 | int | `badgeId` |
| 6 | int | `ranking` |
| 7 | string | `allianceName` |
| 8 | int | `allianceCapitalLevel` |
| 9 | int | `allianceCapitalStatus` |
| 10 | int | `allianceId` |

---

#### `cmd=24008` — ranking alliance 24008

- 常量: `Constant.PROT_RANKING_ALLIANCE_24008`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.pageNum` |
| 2 | int | `this.pageSize` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `pageNum` |
| 2 | int | `pageCount` |
| 3 | int | `allianceId` |
| 4 | int | `badgeId` |
| 5 | int | `ranking` |
| 6 | int | `rankingTrend` |
| 7 | string | `allianceName` |
| 8 | string | `leaderName` |
| 9 | int | `memberCount` |
| 10 | long | `fame` |
| 11 | byte | `allianceWarJoinState` |
| 12 | int | `badgeId` |

---

#### `cmd=24010` — ranking search by name 24010

- 常量: `Constant.PROT_RANKING_SEARCH_BY_NAME_24010`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | byte | `this.rankingType` |
| 2 | string | `this.keyword` |
| 3 | byte | `this.orderType` |
| 4 | int | `this.pageSize` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `rankingType` |
| 2 | int | `pageNum` |
| 3 | int | `pageCount` |
| 4 | long | `playerId` |
| 5 | int | `ranking` |
| 6 | int | `rankingTrend` |
| 7 | string | `nickname` |
| 8 | int | `avata` |
| 9 | string | `allianceName` |
| 10 | byte | `rank` |
| 11 | long | `fame` |
| 12 | byte | `cityCount` |
| 13 | int | `totalPopulation` |
| 14 | int | `allianceId` |
| 15 | int | `badgeId` |
| 16 | int | `ranking` |
| 17 | int | `rankingTrend` |
| 18 | string | `allianceName` |
| 19 | string | `leaderName` |
| 20 | int | `memberCount` |
| 21 | long | `fame` |
| 22 | byte | `allianceWarJoinState` |
| 23 | int | `badgeId` |
| 24 | long | `officerId` |
| 25 | int | `icon` |
| 26 | int | `ranking` |
| 27 | string | `officerName` |
| 28 | int | `level` |
| 29 | int | `logistics` |
| 30 | int | `military` |
| 31 | int | `knowledge` |
| 32 | byte | `star` |
| 33 | byte | `isSpecialOfficer` |
| 34 | int | `ranking` |
| 35 | string | `imgID` |
| 36 | string | `cityName` |
| 37 | string | `nickname` |
| 38 | string | `allianceName` |
| 39 | int | `x` |
| 40 | int | `y` |
| 41 | int | `population` |
| 42 | long | `allianceCapitalId` |
| 43 | int | `badgeId` |
| 44 | int | `ranking` |
| 45 | string | `allianceName` |
| 46 | int | `allianceCapitalLevel` |
| 47 | int | `allianceCapitalStatus` |
| 48 | int | `allianceId` |
| 49 | int | `allianceId` |
| 50 | int | `badgeId` |
| 51 | int | `ranking` |
| 52 | int | `rankingTrend` |
| 53 | string | `allianceName` |
| 54 | string | `leaderName` |
| 55 | int | `memberCount` |
| 56 | long | `allianceScore` |
| 57 | long | `playerId` |
| 58 | int | `ranking` |
| 59 | string | `nickname` |
| 60 | int | `avata` |
| 61 | string | `allianceName` |
| 62 | byte | `rank` |
| 63 | long | `personalScore` |
| 64 | long | `playerId` |
| 65 | int | `ranking` |
| 66 | int | `rankingTrend` |
| 67 | string | `nickname` |
| 68 | int | `avata` |
| 69 | string | `allianceName` |
| 70 | long | `influence` |
| 71 | int | `allianceId` |
| 72 | int | `badgeId` |
| 73 | int | `ranking` |
| 74 | int | `rankingTrend` |
| 75 | string | `allianceName` |
| 76 | string | `leaderName` |
| 77 | int | `memberCount` |
| 78 | long | `influence` |

---

#### `cmd=24011` — ranking self 24011

- 常量: `Constant.PROT_RANKING_SELF_24011`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | byte | `this.rankingType` |
| 2 | int | `this.pageSize` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `rankingType` |
| 2 | int | `pageNum` |
| 3 | int | `myRanking` |

---

#### `cmd=24013` — ranking personal score 24013

- 常量: `Constant.PROT_RANKING_PERSONAL_SCORE_24013`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.pageNum` |
| 2 | int | `this.pageSize` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `pageNum` |
| 2 | int | `pageCount` |
| 3 | long | `playerId` |
| 4 | int | `ranking` |
| 5 | string | `nickname` |
| 6 | int | `avata` |
| 7 | string | `allianceName` |
| 8 | byte | `rank` |
| 9 | long | `personalScore` |

---

#### `cmd=24015` — ranking alliance score 24015

- 常量: `Constant.PROT_RANKING_ALLIANCE_SCORE_24015`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.pageNum` |
| 2 | int | `this.pageSize` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `pageNum` |
| 2 | int | `pageCount` |
| 3 | int | `allianceId` |
| 4 | int | `badgeId` |
| 5 | int | `ranking` |
| 6 | int | `rankingTrend` |
| 7 | string | `allianceName` |
| 8 | string | `leaderName` |
| 9 | int | `memberCount` |
| 10 | long | `allianceScore` |

---

#### `cmd=24016` — ranking influence 24016

- 常量: `Constant.PROT_RANKING_INFLUENCE_24016`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.pageNum` |
| 2 | int | `this.pageSize` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `rankingUpdateTime` |
| 2 | int | `pageNum` |
| 3 | int | `pageCount` |
| 4 | long | `playerId` |
| 5 | int | `ranking` |
| 6 | int | `rankingTrend` |
| 7 | string | `nickname` |
| 8 | int | `avata` |
| 9 | string | `allianceName` |
| 10 | long | `influence` |

---

#### `cmd=24017` — ranking alliance influence 24017

- 常量: `Constant.PROT_RANKING_ALLIANCE_INFLUENCE_24017`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.pageNum` |
| 2 | int | `this.pageSize` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `pageNum` |
| 2 | int | `pageCount` |
| 3 | int | `allianceId` |
| 4 | int | `badgeId` |
| 5 | int | `ranking` |
| 6 | int | `rankingTrend` |
| 7 | string | `allianceName` |
| 8 | string | `leaderName` |
| 9 | int | `memberCount` |
| 10 | long | `influence` |

---
