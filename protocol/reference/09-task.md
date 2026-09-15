# 任务与奖励

> 6 个命令（cmd 10001 ~ 10008）。所有响应均以 1 字节 status 打头，成功值见各条目。

### `cmd=10001` — 查询任务列表

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `task_type` | 任务分类 |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> `u8 task_type` 回显后读 `u32 count`，循环条目，最后读一项全局 `string notice`。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `task_type` | 回显请求参数 |
| 2 | u32 | `count` | 任务条数 |
| 3 | u32 | `task_id` | 每条任务 |
| 4 | string | `task_name` | 每条任务 |
| 5 | u8 | `completed` | 每条任务 |
| 6 | u8 | `readed` | 每条任务 |
| 7 | u32 | `pri` | 每条任务 |
| 8 | u8 | `main_task` | 每条任务 |
| 9 | string | `notice` | 全部条目之后的公告文案 |

---

### `cmd=10002` — 查询任务详情

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `task_id` | 任务 ID |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 固定前缀后有两段独立计数列表：`u32 action_count + N×action`、`u32 reward_count + N×reward`，末尾才是 `task_visible`。
> `scripts/w2signin.js` 为名称展示只读取前两个字段 `task_id + task_name`，是有意的前缀解析，并不代表完整响应。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `task_id` | 任务 ID |
| 2 | string | `task_name` | 任务名称 |
| 3 | string | `task_description` | 任务描述 |
| 4 | string | `task_guide` | 指引文案 |
| 5 | u32 | `action_count` | 后续动作条数 |
| 6 | string | `action_description` | 每条动作 |
| 7 | u8 | `action_completed` | 每条动作 |
| 8 | u32 | `reward_count` | 后续奖励条数 |
| 9 | string | `rc_name` | 每条奖励 |
| 10 | u32 | `rc_type` | 每条奖励 |
| 11 | string | `rc_image` | 每条奖励 |
| 12 | u32 | `rc_amount` | 每条奖励 |
| 13 | u8 | `is_type_consume` | 每条奖励 |
| 14 | u8 | `task_visible` | 尾字段 |

---

### `cmd=10003` — 领取任务奖励

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `task_id` | 任务 ID |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `rc_name` | 名称 |
| 2 | u32 | `rc_type` | 类型枚举 |
| 3 | string | `rc_image` | — |
| 4 | u32 | `rc_amount` | 数量 |
| 5 | u8 | `is_type_consume` | 类型枚举 |

---

### `cmd=10005` — 查询任务分类

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `task_type` | 任务分类 |
| 2 | string | `task_type_name` | 任务分类 |
| 3 | u32 | `unread` | — |
| 4 | u32 | `completed` | 是否已完成 |

---

### `cmd=10006` — 查询新手任务

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `4` | — |

**响应**（实测布局）:

> status 后 1 字节为 taskType 回显（=4），随后 `u32 计数` 循环条目（每条 `u32 task_id + str task_name + u8 completed + u8 readed`），尾随 `str notice`。与客户端一致。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `task_type` | 回显请求参数 |
| 2 | u32 | `count` | 任务条数 |
| 3 | u32 | `task_id` | 每条任务 |
| 4 | string | `task_name` | 每条任务 |
| 5 | u8 | `completed` | 每条任务 |
| 6 | u8 | `readed` | 每条任务 |
| 7 | string | `notice` | 公告文案 |

---

### `cmd=10008` — 查询主线任务状态

**请求参数**: 无

**响应**（当前服务器实测布局；与客户端不同：status 后 1 字节未用，计数为 u32）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `task_id` | 任务 ID；**-1（0xff）时本帧无后续字段** |
| 2 | string | `task_name` | 仅 `task_id != -1` 时存在 |
| 3 | u8 | `completed` | 仅 `task_id != -1` 时存在 |
