# 道具与背包

> 9 个命令（cmd 8001 ~ 8023）

#### `cmd=8001` — cimelia chest open 8001

- 常量: `Constant.PROT_CIMELIA_CHEST_OPEN_8001`
- 成功判定: `status1=this.status()||2=this.status()`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| ? | 条件 | `if(this._data.writeInt(this.itemID)` |
| 1 | int | `this.amount` |
| … | 循环 | `for(var e=0` |

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

#### `cmd=8003` — cimelia callback 8003

- 常量: `Constant.PROT_CIMELIA_CALLBACK_8003`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.itemID` |
| 2 | int | `this.amount` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `name` |
| 2 | int | `icon` |
| 3 | int | `amount` |

---

#### `cmd=8005` — cimelia list 8005

- 常量: `Constant.PROT_CIMELIA_LIST_8005`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `diamondOwned` |
| 2 | byte | `showType` |
| 3 | byte | `functionType` |
| 4 | int | `itemID` |
| 5 | byte | `boxType` |
| 6 | int | `merchandiseId` |
| 7 | int | `price` |
| 8 | int | `itemID` |
| 9 | int | `icon` |
| 10 | string | `name` |
| 11 | int | `chance` |
| 12 | int | `maxSelected` |
| 13 | int | `itemID` |
| 14 | int | `icon` |
| 15 | string | `name` |
| 16 | int | `amount` |
| 17 | int | `curAmount` |
| 18 | string | `name` |
| 19 | string | `description` |
| 20 | string | `useDescription` |
| 21 | int | `icon` |
| 22 | byte | `level` |
| 23 | int | `recycleCount` |
| 24 | string | `recycleName` |
| 25 | byte | `useType` |
| 26 | string | `notice` |

---

#### `cmd=8007` — cimelia function cimelia list 8007

- 常量: `Constant.PROT_CIMELIA_FUNCTION_CIMELIA_LIST_8007`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.functionTargetType` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `itemID` |
| 2 | int | `icon` |
| 3 | string | `name` |
| 4 | string | `description` |
| 5 | int | `curAmount` |
| 6 | int | `merchandiseId` |
| 7 | int | `effectValue` |
| 8 | byte | `limitedOnBuy` |
| 9 | int | `maxCountOnBuy` |
| 10 | int | `price` |
| 11 | int | `diamondOwned` |

---

#### `cmd=8018` — cimelia the assembly 8018

- 常量: `Constant.PROT_CIMELIA_THE_ASSEMBLY_8018`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `itemNum` |
| 2 | int | `id` |
| 3 | int | `imageId` |
| 4 | string | `name` |
| 5 | string | `description` |
| 6 | int | `number` |
| 7 | int | `price` |
| 8 | int | `commodityId` |
| 9 | int | `effect` |
| 10 | int | `oilEffect` |
| 11 | int | `diamondCount` |

---

#### `cmd=8020` — cimelia boost list 8020

- 常量: `Constant.PROT_CIMELIA_BOOST_LIST_8020`

**请求参数**: 无（类未定义 encode）

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---

#### `cmd=8021` — cimelia boost active 8021

- 常量: `Constant.PROT_CIMELIA_BOOST_ACTIVE_8021`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.itemID` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `message` |

---

#### `cmd=8022` — cimelia truce status 8022

- 常量: `Constant.PROT_CIMELIA_TRUCE_STATUS_8022`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `finishTime` |
| 2 | long | `coolTime` |

---

#### `cmd=8023` — cimelia use atomic 8023

- 常量: `Constant.PROT_CIMELIA_USE_ATOMIC_8023`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.itemId` |
| 2 | int | `this.x` |
| 3 | int | `this.y` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---
