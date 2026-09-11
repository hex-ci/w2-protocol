# 活动

> 32 个命令（cmd 22001 ~ 23004）。所有响应均以 1 字节 status 打头，成功值见各条目。

### `cmd=22001` — 查询活动列表

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

> 实测修正（真机抓包与 SDK 会话整段逐字节消费验证）：本服下发条目**不含** `start_time`/`end_time`——客户端基线中这两个字段为版本条件字段（仅 clientVer >= 3040100 时读取），照表第 4 项直接解析会从第 2 条起全面错位。
> 实测字段序：`string activity_name` + `u32 activity_id` + `string flag` + `u8 time_limited` + [`=1` 时 `u64 remain_time`] + `u32 activity_type` + [`=2` 时 `u8 activity_sub_type`] + `u32 activity_group_id` + `u32 red_point_type` + [`=2` 时 `u64 red_point_unimark`] + `u32 reg_days_limited`（22 条 1256B 逐字节消费 ✓）。
> `activity_sub_type` 按有符号字节解释（225 即 -31），客户端以其决定详情接口：-31/225=地标(22017)、-30/226=排行(22016)、-29/227=兑换(22014)、-25/231=充值(22007)。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `activity_name` | 名称 |
| 2 | u32 | `activity_id` | — |
| 3 | string | `flag` | — |
| 4 | u64 | `start_time` | 开始时间戳（仅 clientVer >= 3040100 时下发） |
| 5 | u64 | `end_time` | 结束时间戳（仅 clientVer >= 3040100 时下发） |
| 6 | u8 | `time_limited` | 布尔标记（0/1） |
| 7 | u64 | `remain_time` | 剩余毫秒数（仅 `time_limited=1` 时存在） |
| 8 | u32 | `activity_type` | 类型枚举 |
| 9 | u8 | `activity_sub_type` | 类型枚举（仅 `activity_type=2` 时存在，按有符号字节读） |
| 10 | u32 | `activity_group_id` | — |
| 11 | u32 | `red_point_type` | 类型枚举 |
| 12 | u64 | `red_point_unimark` | —（仅 `red_point_type=2` 时存在） |
| 13 | u32 | `reg_days_limited` | — |

---

### `cmd=22002` — 同步活动描述

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `activity_id` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `activity_id` | — |
| 2 | u32 | `activity_type` | 类型枚举 |

---

### `cmd=22006` — 查询活动状态

> 此命令在客户端协议定义中无对应类（iOS 客户端独有或版本差异），请求/响应结构以抓包实据为准，字段语义待解。

**请求参数**: 无

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=22007` — 查询充值活动详情

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `activity_id` | — |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=22008` — 领取充值/消费活动奖励

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `section_id` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `rc_type` | 类型枚举 |
| 2 | string | `rc_image` | — |
| 3 | string | `rc_name` | 名称 |
| 4 | u32 | `rc_amount` | 数量 |

---

### `cmd=22009` — 查询活动状态

> 此命令在客户端协议定义中无对应类（iOS 客户端独有或版本差异），请求/响应结构以抓包实据为准，字段语义待解。

**请求参数**: 无

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=22010` — 查询七日活动详情

**请求参数**: 无

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=22011` — 领取七日活动奖励

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `day_index` | — |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=22012` — 查询 N 日活动详情

**请求参数**: 无

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=22013` — 领取 N 日活动奖励

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `day_index` | — |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=22014` — 查询活动兑换详情

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `activity_id` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 实测修正（抓包逐字节消费验证，嵌套结构）：
> `string rich_content` + `u8 count` + count × 兑换条目 + `u32 activity_id`（尾部回显）。
> 兑换条目 = `u32 exchange_id` + `u8 consume_count` + consume_count × 消耗项 + 产出项 + `u32 max_exchange_times` + `u32 exchanged_times`；
> 消耗项 = `u32 item_id` + `string name` + `string description` + `u32 icon` + `u32 amount` + `u8 kind` + [`kind` 为 7/9 时 `u32 cur_amount`]（实测 kind=5 的实物类无此字段，客户端按背包自行判定数量）；
> 产出项 = `u32 item_id` + `string name` + `string description` + `u32 icon` + `u32 amount`。

---

### `cmd=22015` — 领取活动兑换奖励

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `activity_id` | — |
| 2 | u32 | `exchange_id` | — |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=22016` — 查询活动排行详情

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `activity_id` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 实测修正（抓包逐字节消费验证，嵌套结构）：
> `string rich_content` + `u8 set_count` + set_count × 奖励档位 + [`set_count > 0` 时 `u16 player_count` + player_count × 玩家条目 + `u32 activity_id`]。
> 奖励档位 = `u8 ranking_to` + `u8 item_count` + item_count × {`string name` + `string description` + `u32 icon` + `u32 amount`}（`ranking_from` 不上线，取上一档 `ranking_to` + 1，首档从 1 起）；
> 玩家条目 = `u64 player_id` + `string nick_name` + `u32 avatar` + `string alliance_name` + `u8 badge_type` + `u32 badge` + `u32 rank` + `u64 ranking_score`（名次按列表顺序 1..N 递推）。

---

### `cmd=22017` — 查询活动地标详情

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `activity_id` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 实测修正（真机抓包与 SDK 会话逐字节消费验证，嵌套结构）：
> `string rich_content` + `u8 section_count` + section_count × 进度段落 + [`section_count > 0` 时 `u32 activity_id` 尾部回显]。
> 进度段落 = `u32 section_id` + `string section_name` + `u8 reward_count` + reward_count × 奖励项 + `u64 progress_value` + `u64 progress_target` + `u8 collect_status`；
> 奖励项 = `string rc_name` + `string extra_description` + `u32 rc_image` + `u32 rc_amount`。
> 可领取条件（服务器校验）：`progress_value >= progress_target` 且 `collect_status == 0`，领取走 22018。
> `section_count = 0` 时无 progress 段落，尾部字节不定：实测活动不存在时服务器回显 4B 请求 ID（整段 9B），活动存在时无任何尾部字节；客户端在 count=0 时完全不读尾部，解析侧同样忽略剩余字节即可。

---

### `cmd=22018` — 领取地标活动奖励

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `activity_id` | — |
| 2 | u32 | `section_id` | — |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

> 实测（SDK 真机会话）：成功时无业务数据（响应体仅 4B 命令字 + 1B 状态）。失败文案三类：条件未达标「先决条件未满足，无法领取该奖励！」、重复领取「请勿重复领取奖励！」、`section_id` 不存在或为 0「非法参数！」——失败均无副作用，可安全按扫描结果批量尝试。

---

### `cmd=22019` — 查询新人邀请详情

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `code_used` | — |
| 2 | string | `name` | 名称 |
| 3 | string | `description` | 描述文案 |
| 4 | u32 | `icon` | 图标编号 |
| 5 | u32 | `amount` | 数量 |
| 6 | string | `code` | — |
| 7 | string | `code_requirement` | — |
| 8 | u32 | `invited_count` | 数量/计数 |
| 9 | u32 | `max_invited_count` | 数量/计数 |
| 10 | u32 | `section_id` | — |
| 11 | u8 | `collect_status` | 结果状态 |
| 12 | string | `section_name` | 名称 |
| 13 | string | `rc_name` | 名称 |
| 14 | string | `extra_description` | 描述文案 |
| 15 | u32 | `rc_amount` | 数量 |
| 16 | u64 | `progress_value` | — |
| 17 | u64 | `progress_target` | — |
| 18 | u8 | `code_used` | — |
| 19 | string | `code` | — |
| 20 | string | `code_requirement` | — |
| 21 | u32 | `invited_count` | 数量/计数 |
| 22 | u32 | `max_invited_count` | 数量/计数 |
| 23 | u32 | `section_id` | — |
| 24 | u8 | `collect_status` | 结果状态 |
| 25 | string | `section_name` | 名称 |
| 26 | u64 | `progress_value` | — |
| 27 | u64 | `progress_target` | — |
| 28 | string | `rc_name` | 名称 |
| 29 | string | `extra_description` | 描述文案 |
| 30 | u32 | `rc_amount` | 数量 |
| 31 | u32 | `section_id` | — |
| 32 | string | `section_name` | 名称 |
| 33 | string | `rc_name` | 名称 |
| 34 | string | `extra_description` | 描述文案 |
| 35 | u32 | `rc_amount` | 数量 |
| 36 | u64 | `progress_value` | — |
| 37 | u64 | `progress_target` | — |
| 38 | u32 | `activity_id` | — |
| 39 | u8 | `ranking_to` | 名次 |
| 40 | string | `name` | 名称 |
| 41 | string | `description` | 描述文案 |
| 42 | u32 | `icon` | 图标编号 |
| 43 | u32 | `amount` | 数量 |
| 44 | u32 | `alliance_id` | 军团 ID |
| 45 | string | `alliance_name` | 军团名称 |
| 46 | u8 | `badge_type` | 类型枚举 |
| 47 | u32 | `badge` | — |
| 48 | u64 | `ranking_score` | 名次 |
| 49 | u32 | `activity_id` | — |
| 50 | string | `activity_name` | 名称 |
| 51 | u32 | `activity_id` | — |
| 52 | string | `flag` | — |
| 53 | u64 | `start_time` | 开始时间戳 |
| 54 | u64 | `end_time` | 结束时间戳 |
| 55 | u8 | `time_limited` | 时间戳（毫秒） |
| 56 | u64 | `remain_time` | 剩余毫秒数 |
| 57 | u32 | `activity_type` | 类型枚举 |
| 58 | u8 | `activity_sub_type` | 类型枚举 |
| 59 | u32 | `activity_group_id` | — |
| 60 | u32 | `red_point_type` | 类型枚举 |
| 61 | u64 | `red_point_unimark` | — |
| 62 | u32 | `reg_days_limited` | — |

---

### `cmd=22020` — 使用新人邀请码

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `code` | — |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=22021` — 获取新人邀请码

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `code` | — |

---

### `cmd=22022` — 领取新人邀请奖励

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `section_id` | — |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=22023` — 查询玩家召回详情

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `code_used` | — |
| 2 | string | `code` | — |
| 3 | string | `code_requirement` | — |
| 4 | u32 | `invited_count` | 数量/计数 |
| 5 | u32 | `max_invited_count` | 数量/计数 |
| 6 | u32 | `section_id` | — |
| 7 | u8 | `collect_status` | 结果状态 |
| 8 | string | `section_name` | 名称 |
| 9 | u64 | `progress_value` | — |
| 10 | u64 | `progress_target` | — |
| 11 | string | `rc_name` | 名称 |
| 12 | string | `extra_description` | 描述文案 |
| 13 | u32 | `rc_amount` | 数量 |
| 14 | u32 | `section_id` | — |
| 15 | string | `section_name` | 名称 |
| 16 | string | `rc_name` | 名称 |
| 17 | string | `extra_description` | 描述文案 |
| 18 | u32 | `rc_amount` | 数量 |
| 19 | u64 | `progress_value` | — |
| 20 | u64 | `progress_target` | — |
| 21 | u32 | `activity_id` | — |
| 22 | u8 | `ranking_to` | 名次 |
| 23 | string | `name` | 名称 |
| 24 | string | `description` | 描述文案 |
| 25 | u32 | `icon` | 图标编号 |
| 26 | u32 | `amount` | 数量 |
| 27 | u32 | `alliance_id` | 军团 ID |
| 28 | string | `alliance_name` | 军团名称 |
| 29 | u8 | `badge_type` | 类型枚举 |
| 30 | u32 | `badge` | — |
| 31 | u64 | `ranking_score` | 名次 |
| 32 | u32 | `activity_id` | — |
| 33 | string | `activity_name` | 名称 |
| 34 | u32 | `activity_id` | — |
| 35 | string | `flag` | — |
| 36 | u64 | `start_time` | 开始时间戳 |
| 37 | u64 | `end_time` | 结束时间戳 |
| 38 | u8 | `time_limited` | 时间戳（毫秒） |
| 39 | u64 | `remain_time` | 剩余毫秒数 |
| 40 | u32 | `activity_type` | 类型枚举 |
| 41 | u8 | `activity_sub_type` | 类型枚举 |
| 42 | u32 | `activity_group_id` | — |
| 43 | u32 | `red_point_type` | 类型枚举 |
| 44 | u64 | `red_point_unimark` | — |
| 45 | u32 | `reg_days_limited` | — |

---

### `cmd=22024` — 领取玩家召回奖励

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `section_id` | — |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=22025` — 使用召回码

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `code` | — |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=22026` — 获取召回码

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `code` | — |

---

### `cmd=22027` — 查询军团地标活动

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `activity_id` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `section_id` | — |
| 2 | string | `section_name` | 名称 |
| 3 | string | `rc_name` | 名称 |
| 4 | string | `extra_description` | 描述文案 |
| 5 | u32 | `rc_amount` | 数量 |
| 6 | u64 | `progress_value` | — |
| 7 | u64 | `progress_target` | — |
| 8 | u32 | `activity_id` | — |
| 9 | u8 | `ranking_to` | 名次 |
| 10 | string | `name` | 名称 |
| 11 | string | `description` | 描述文案 |
| 12 | u32 | `icon` | 图标编号 |
| 13 | u32 | `amount` | 数量 |
| 14 | u32 | `alliance_id` | 军团 ID |
| 15 | string | `alliance_name` | 军团名称 |
| 16 | u8 | `badge_type` | 类型枚举 |
| 17 | u32 | `badge` | — |
| 18 | u64 | `ranking_score` | 名次 |
| 19 | u32 | `activity_id` | — |
| 20 | string | `activity_name` | 名称 |
| 21 | u32 | `activity_id` | — |
| 22 | string | `flag` | — |
| 23 | u64 | `start_time` | 开始时间戳 |
| 24 | u64 | `end_time` | 结束时间戳 |
| 25 | u8 | `time_limited` | 时间戳（毫秒） |
| 26 | u64 | `remain_time` | 剩余毫秒数 |
| 27 | u32 | `activity_type` | 类型枚举 |
| 28 | u8 | `activity_sub_type` | 类型枚举 |
| 29 | u32 | `activity_group_id` | — |
| 30 | u32 | `red_point_type` | 类型枚举 |
| 31 | u64 | `red_point_unimark` | — |
| 32 | u32 | `reg_days_limited` | — |

---

### `cmd=22028` — 查询军团排行活动

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `activity_id` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `ranking_to` | 名次 |
| 2 | string | `name` | 名称 |
| 3 | string | `description` | 描述文案 |
| 4 | u32 | `icon` | 图标编号 |
| 5 | u32 | `amount` | 数量 |
| 6 | u32 | `alliance_id` | 军团 ID |
| 7 | string | `alliance_name` | 军团名称 |
| 8 | u8 | `badge_type` | 类型枚举 |
| 9 | u32 | `badge` | — |
| 10 | u64 | `ranking_score` | 名次 |
| 11 | u32 | `activity_id` | — |
| 12 | string | `activity_name` | 名称 |
| 13 | u32 | `activity_id` | — |
| 14 | string | `flag` | — |
| 15 | u64 | `start_time` | 开始时间戳 |
| 16 | u64 | `end_time` | 结束时间戳 |
| 17 | u8 | `time_limited` | 时间戳（毫秒） |
| 18 | u64 | `remain_time` | 剩余毫秒数 |
| 19 | u32 | `activity_type` | 类型枚举 |
| 20 | u8 | `activity_sub_type` | 类型枚举 |
| 21 | u32 | `activity_group_id` | — |
| 22 | u32 | `red_point_type` | 类型枚举 |
| 23 | u64 | `red_point_unimark` | — |
| 24 | u32 | `reg_days_limited` | — |

---

### `cmd=22029` — 查询转盘活动详情

**请求参数**: 无

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=22030` — 转盘掷骰

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `times` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `name` | 名称 |
| 2 | string | `description` | 描述文案 |
| 3 | u32 | `icon` | 图标编号 |
| 4 | u32 | `amount` | 数量 |

---

### `cmd=22031` — 查询活动分组

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `activity_group_id` | — |
| 2 | string | `activity_group_name` | 名称 |

---

### `cmd=23001` — 组队活动信息

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `target_type` | 类型枚举 |
| 2 | u32 | `target_tile_y)` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `signal_flare_count` | 数量/计数 |
| 2 | u32 | `stratagem_id` | — |
| 3 | u32 | `need_level` | 等级 |
| 4 | string | `max_effective` | 上限 |
| 5 | string | `name` | 名称 |
| 6 | string | `desc` | — |
| 7 | u32 | `need_signal_flare` | 布尔标记（0/1） |
| 8 | string | `detail` | — |
| 9 | string | `detail_param` | — |

---

### `cmd=23002` — 组队活动成员

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `stratagem_status_type` | 结果状态 |
| 2 | u32 | `stratagem_icon` | 图标编号 |
| 3 | string | `stratagem_name` | 名称 |
| 4 | readDouble | `effective` | — |
| 5 | u64 | `remain_time` | 剩余毫秒数 |

---

### `cmd=23003` — 组队活动操作

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `stratagem_id` | — |
| 2 | u64 | `target_expxedition_id` | — |
| 3 | u64 | `select_officer` | — |
| 4 | u64 | `e.key` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `remain_time` | 剩余毫秒数 |
| 2 | string | `message` | — |

---

### `cmd=23004` — 组队活动状态

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `stratagem_id` | — |
| 2 | u32 | `target_x` | 地图 X 坐标 |
| 3 | u32 | `target_y` | 地图 Y 坐标 |
| 4 | u64 | `select_officer` | — |
| 5 | u64 | `e.key` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `remain_time` | 剩余毫秒数 |
| 2 | string | `message` | — |
