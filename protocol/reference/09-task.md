# 任务与奖励

> 6 个命令（cmd 10001 ~ 10008）

#### `cmd=10001` — task list 10001

- 常量: `Constant.PROT_TASK_LIST_10001`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | byte | `this.taskType` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `taskId` |
| 2 | string | `taskName` |
| 3 | byte | `completed` |
| 4 | byte | `readed` |
| 5 | int | `pri` |
| 6 | byte | `mainTask` |
| 7 | string | `notice` |

---

#### `cmd=10002` — task detail 10002

- 常量: `Constant.PROT_TASK_DETAIL_10002`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.taskId` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `taskId` |
| 2 | string | `taskName` |
| 3 | string | `taskGuide` |
| 4 | string | `actionDescription` |
| 5 | byte | `actionCompleted` |
| 6 | string | `rcName` |
| 7 | int | `rcType` |
| 8 | string | `rcImage` |
| 9 | int | `rcAmount` |
| 10 | byte | `isTypeConsume` |
| 11 | byte | `taskVisible` |

---

#### `cmd=10003` — task collect reward 10003

- 常量: `Constant.PROT_TASK_COLLECT_REWARD_10003`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.taskId` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `rcName` |
| 2 | int | `rcType` |
| 3 | string | `rcImage` |
| 4 | int | `rcAmount` |
| 5 | byte | `isTypeConsume` |

---

#### `cmd=10005` — task type list 10005

- 常量: `Constant.PROT_TASK_TYPE_LIST_10005`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `taskType` |
| 2 | string | `taskTypeName` |
| 3 | int | `unread` |
| 4 | int | `completed` |

---

#### `cmd=10006` — task rookie kind 10006

- 常量: `Constant.PROT_TASK_ROOKIE_KIND_10006`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | byte | `4` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `taskId` |
| 2 | string | `taskName` |
| 3 | byte | `completed` |
| 4 | byte | `readed` |
| 5 | string | `notice` |

---

#### `cmd=10008` — task main kind status 10008

- 常量: `Constant.PROT_TASK_MAIN_KIND_STATUS_10008`
- 成功判定: `status1=this.status()||2=this.status()`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `taskId` |
| 2 | string | `taskName` |
| 3 | byte | `completed` |
| 4 | byte | `identity` |
| 5 | long | `pushThreshold` |
| 6 | byte | `age` |
| 7 | long | `onlineTime` |
| 8 | string | `realName` |

---
