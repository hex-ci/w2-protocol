# 科技研发

> 6 个命令（cmd 4001 ~ 4008）

#### `cmd=4001` — technique researching info 4001

- 常量: `Constant.PROT_TECHNIQUE_RESEARCHING_INFO_4001`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `researchCenterCount` |
| 2 | byte | `currentCityTask` |
| 3 | long | `researchingId` |
| 4 | int | `techniqueId` |
| 5 | int | `level` |
| 6 | long | `totalTime` |
| 7 | long | `remainTime` |
| 8 | byte | `helped` |
| 9 | int | `techniqueId` |
| 10 | int | `level` |
| 11 | string | `currentLevelDescription` |
| 12 | string | `nextLevelDescription` |
| 13 | int | `effectiveLevel` |
| 14 | int | `isMaxLevel` |
| 15 | int | `foodRequired` |
| 16 | int | `mineralRequired` |
| 17 | int | `oilRequired` |
| 18 | int | `steelRequired` |
| 19 | int | `goldRequired` |
| 20 | int | `prototypeId` |
| 21 | int | `level` |
| 22 | int | `curLevel` |
| 23 | int | `techniqueId` |
| 24 | int | `level` |
| 25 | int | `curLevel` |
| 26 | int | `itemId` |
| 27 | int | `icon` |
| 28 | string | `name` |
| 29 | int | `amount` |
| 30 | int | `curAmount` |
| 31 | long | `time` |

---

#### `cmd=4002` — technique research 4002

- 常量: `Constant.PROT_TECHNIQUE_RESEARCH_4002`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.techniqueId` |
| 2 | int | `this.racial` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `currentCityTask` |
| 2 | long | `researchingId` |
| 3 | int | `techniqueId` |
| 4 | int | `level` |
| 5 | long | `totalTime` |
| 6 | long | `remainTime` |
| 7 | byte | `helped` |

---

#### `cmd=4003` — technique research abort 4003

- 常量: `Constant.PROT_TECHNIQUE_RESEARCH_ABORT_4003`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.researchingId` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=4005` — technique speedup research 4005

- 常量: `Constant.PROT_TECHNIQUE_SPEEDUP_RESEARCH_4005`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.itemId` |
| 2 | long | `this.researchingId` |
| 3 | int | `this.useCount` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=4006` — technique prototype list 4006

- 常量: `Constant.PROT_TECHNIQUE_PROTOTYPE_LIST_4006`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `prototypeId` |
| 2 | string | `name` |
| 3 | string | `des` |

---

#### `cmd=4008` — technique speedup free 4008

- 常量: `Constant.PROT_TECHNIQUE_SPEEDUP_FREE_4008`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.researchingId` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---
