# 科技研发

> 7 个命令（cmd 4001 ~ 4008）。所有响应均以 1 字节 status 打头，成功值见各条目。

### `cmd=4001` — 查询科技研究信息

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `research_center_count` | 数量/计数 |
| 2 | u8 | `current_city_task` | — |
| 3 | u64 | `researching_id` | 研究队列 ID |
| 4 | u32 | `technique_id` | 科技 ID |
| 5 | u32 | `level` | 等级 |
| 6 | u64 | `total_time` | 总耗时毫秒 |
| 7 | u64 | `remain_time` | 剩余毫秒数 |
| 8 | u8 | `helped` | — |
| 9 | u32 | `technique_id` | 科技 ID |
| 10 | u32 | `level` | 等级 |
| 11 | string | `current_level_description` | 描述文案 |
| 12 | string | `next_level_description` | 描述文案 |
| 13 | u32 | `effective_level` | 等级 |
| 14 | u32 | `is_max_level` | 等级 |
| 15 | u32 | `food_required` | — |
| 16 | u32 | `mineral_required` | — |
| 17 | u32 | `oil_required` | — |
| 18 | u32 | `steel_required` | — |
| 19 | u32 | `gold_required` | — |
| 20 | u32 | `prototype_id` | 建筑原型 ID |
| 21 | u32 | `level` | 等级 |
| 22 | u32 | `cur_level` | 等级 |
| 23 | u32 | `technique_id` | 科技 ID |
| 24 | u32 | `level` | 等级 |
| 25 | u32 | `cur_level` | 等级 |
| 26 | u32 | `item_id` | 道具 ID |
| 27 | u32 | `icon` | 图标编号 |
| 28 | string | `name` | 名称 |
| 29 | u32 | `amount` | 数量 |
| 30 | u32 | `cur_amount` | 当前数量 |
| 31 | u64 | `time` | 时间戳（毫秒） |

---

### `cmd=4002` — 开始研究科技

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `technique_id` | 科技 ID |
| 2 | u32 | `racial` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `current_city_task` | — |
| 2 | u64 | `researching_id` | 研究队列 ID |
| 3 | u32 | `technique_id` | 科技 ID |
| 4 | u32 | `level` | 等级 |
| 5 | u64 | `total_time` | 总耗时毫秒 |
| 6 | u64 | `remain_time` | 剩余毫秒数 |
| 7 | u8 | `helped` | — |

---

### `cmd=4003` — 取消研究

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `researching_id` | 研究队列 ID |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=4004` — 完成研究

> 此命令在客户端协议定义中无对应类（iOS 客户端独有或版本差异），请求/响应结构以抓包实据为准，字段语义待解。

**请求参数**: 无

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=4005` — 研究加速

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `item_id` | 道具 ID |
| 2 | u64 | `researching_id` | 研究队列 ID |
| 3 | u32 | `use_count` | 数量/计数 |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=4006` — 查询科技原型表

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `prototype_id` | 建筑原型 ID |
| 2 | string | `name` | 名称 |
| 3 | string | `des` | — |

---

### `cmd=4008` — 科技研究回调

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `researching_id` | 研究队列 ID |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。
