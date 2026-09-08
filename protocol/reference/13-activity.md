# 活动

> 30 个命令（cmd 22001 ~ 23004）。所有响应均以 1 字节 status 打头，成功值见各条目。

### `cmd=22001` — 查询活动列表

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `activity_name` | 名称 |
| 2 | u32 | `activity_id` | — |
| 3 | string | `flag` | — |
| 4 | u64 | `start_time` | 开始时间戳 |
| 5 | u64 | `end_time` | 结束时间戳 |
| 6 | u8 | `time_limited` | 时间戳（毫秒） |
| 7 | u64 | `remain_time` | 剩余毫秒数 |
| 8 | u32 | `activity_type` | 类型枚举 |
| 9 | u8 | `activity_sub_type` | 类型枚举 |
| 10 | u32 | `activity_group_id` | — |
| 11 | u32 | `red_point_type` | 类型枚举 |
| 12 | u64 | `red_point_unimark` | — |
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

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `exchange_id` | — |
| 2 | u32 | `item_id` | 道具 ID |
| 3 | string | `name` | 名称 |
| 4 | string | `description` | 描述文案 |
| 5 | u32 | `icon` | 图标编号 |
| 6 | u32 | `amount` | 数量 |
| 7 | u32 | `cur_amount` | 当前数量 |
| 8 | u32 | `item_id` | 道具 ID |
| 9 | string | `name` | 名称 |
| 10 | string | `description` | 描述文案 |
| 11 | u32 | `icon` | 图标编号 |
| 12 | u32 | `amount` | 数量 |
| 13 | u32 | `max_exchange_times` | 上限 |
| 14 | u32 | `exchanged_times` | — |
| 15 | u32 | `activity_id` | — |
| 16 | u8 | `ranking_to` | 名次 |
| 17 | string | `name` | 名称 |
| 18 | string | `description` | 描述文案 |
| 19 | u32 | `icon` | 图标编号 |
| 20 | u32 | `amount` | 数量 |
| 21 | u64 | `player_id` | 玩家 ID |
| 22 | string | `nick_name` | 名称 |
| 23 | u32 | `avatar` | — |
| 24 | string | `alliance_name` | 军团名称 |
| 25 | u8 | `badge_type` | 类型枚举 |
| 26 | u32 | `badge` | — |
| 27 | u32 | `rank` | 军衔等级 |
| 28 | u64 | `ranking_score` | 名次 |
| 29 | u32 | `activity_id` | — |
| 30 | u32 | `section_id` | — |
| 31 | string | `section_name` | 名称 |
| 32 | string | `rc_name` | 名称 |
| 33 | string | `extra_description` | 描述文案 |
| 34 | u32 | `rc_amount` | 数量 |
| 35 | u64 | `progress_value` | — |
| 36 | u64 | `progress_target` | — |
| 37 | u8 | `collect_status` | 结果状态 |
| 38 | u32 | `activity_id` | — |
| 39 | u8 | `code_used` | — |
| 40 | string | `name` | 名称 |
| 41 | string | `description` | 描述文案 |
| 42 | u32 | `icon` | 图标编号 |
| 43 | u32 | `amount` | 数量 |
| 44 | string | `code` | — |
| 45 | string | `code_requirement` | — |
| 46 | u32 | `invited_count` | 数量/计数 |
| 47 | u32 | `max_invited_count` | 数量/计数 |
| 48 | u32 | `section_id` | — |
| 49 | u8 | `collect_status` | 结果状态 |
| 50 | string | `section_name` | 名称 |
| 51 | string | `rc_name` | 名称 |
| 52 | string | `extra_description` | 描述文案 |
| 53 | u32 | `rc_amount` | 数量 |
| 54 | u64 | `progress_value` | — |
| 55 | u64 | `progress_target` | — |
| 56 | u8 | `code_used` | — |
| 57 | string | `code` | — |
| 58 | string | `code_requirement` | — |
| 59 | u32 | `invited_count` | 数量/计数 |
| 60 | u32 | `max_invited_count` | 数量/计数 |
| 61 | u32 | `section_id` | — |
| 62 | u8 | `collect_status` | 结果状态 |
| 63 | string | `section_name` | 名称 |
| 64 | u64 | `progress_value` | — |
| 65 | u64 | `progress_target` | — |
| 66 | string | `rc_name` | 名称 |
| 67 | string | `extra_description` | 描述文案 |
| 68 | u32 | `rc_amount` | 数量 |
| 69 | u32 | `section_id` | — |
| 70 | string | `section_name` | 名称 |
| 71 | string | `rc_name` | 名称 |
| 72 | string | `extra_description` | 描述文案 |
| 73 | u32 | `rc_amount` | 数量 |
| 74 | u64 | `progress_value` | — |
| 75 | u64 | `progress_target` | — |
| 76 | u32 | `activity_id` | — |
| 77 | u8 | `ranking_to` | 名次 |
| 78 | string | `name` | 名称 |
| 79 | string | `description` | 描述文案 |
| 80 | u32 | `icon` | 图标编号 |
| 81 | u32 | `amount` | 数量 |
| 82 | u32 | `alliance_id` | 军团 ID |
| 83 | string | `alliance_name` | 军团名称 |
| 84 | u8 | `badge_type` | 类型枚举 |
| 85 | u32 | `badge` | — |
| 86 | u64 | `ranking_score` | 名次 |
| 87 | u32 | `activity_id` | — |
| 88 | string | `activity_name` | 名称 |
| 89 | u32 | `activity_id` | — |
| 90 | string | `flag` | — |
| 91 | u64 | `start_time` | 开始时间戳 |
| 92 | u64 | `end_time` | 结束时间戳 |
| 93 | u8 | `time_limited` | 时间戳（毫秒） |
| 94 | u64 | `remain_time` | 剩余毫秒数 |
| 95 | u32 | `activity_type` | 类型枚举 |
| 96 | u8 | `activity_sub_type` | 类型枚举 |
| 97 | u32 | `activity_group_id` | — |
| 98 | u32 | `red_point_type` | 类型枚举 |
| 99 | u64 | `red_point_unimark` | — |
| 100 | u32 | `reg_days_limited` | — |

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

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `ranking_to` | 名次 |
| 2 | string | `name` | 名称 |
| 3 | string | `description` | 描述文案 |
| 4 | u32 | `icon` | 图标编号 |
| 5 | u32 | `amount` | 数量 |
| 6 | u64 | `player_id` | 玩家 ID |
| 7 | string | `nick_name` | 名称 |
| 8 | u32 | `avatar` | — |
| 9 | string | `alliance_name` | 军团名称 |
| 10 | u8 | `badge_type` | 类型枚举 |
| 11 | u32 | `badge` | — |
| 12 | u32 | `rank` | 军衔等级 |
| 13 | u64 | `ranking_score` | 名次 |
| 14 | u32 | `activity_id` | — |
| 15 | u32 | `section_id` | — |
| 16 | string | `section_name` | 名称 |
| 17 | string | `rc_name` | 名称 |
| 18 | string | `extra_description` | 描述文案 |
| 19 | u32 | `rc_amount` | 数量 |
| 20 | u64 | `progress_value` | — |
| 21 | u64 | `progress_target` | — |
| 22 | u8 | `collect_status` | 结果状态 |
| 23 | u32 | `activity_id` | — |
| 24 | u8 | `code_used` | — |
| 25 | string | `name` | 名称 |
| 26 | string | `description` | 描述文案 |
| 27 | u32 | `icon` | 图标编号 |
| 28 | u32 | `amount` | 数量 |
| 29 | string | `code` | — |
| 30 | string | `code_requirement` | — |
| 31 | u32 | `invited_count` | 数量/计数 |
| 32 | u32 | `max_invited_count` | 数量/计数 |
| 33 | u32 | `section_id` | — |
| 34 | u8 | `collect_status` | 结果状态 |
| 35 | string | `section_name` | 名称 |
| 36 | string | `rc_name` | 名称 |
| 37 | string | `extra_description` | 描述文案 |
| 38 | u32 | `rc_amount` | 数量 |
| 39 | u64 | `progress_value` | — |
| 40 | u64 | `progress_target` | — |
| 41 | u8 | `code_used` | — |
| 42 | string | `code` | — |
| 43 | string | `code_requirement` | — |
| 44 | u32 | `invited_count` | 数量/计数 |
| 45 | u32 | `max_invited_count` | 数量/计数 |
| 46 | u32 | `section_id` | — |
| 47 | u8 | `collect_status` | 结果状态 |
| 48 | string | `section_name` | 名称 |
| 49 | u64 | `progress_value` | — |
| 50 | u64 | `progress_target` | — |
| 51 | string | `rc_name` | 名称 |
| 52 | string | `extra_description` | 描述文案 |
| 53 | u32 | `rc_amount` | 数量 |
| 54 | u32 | `section_id` | — |
| 55 | string | `section_name` | 名称 |
| 56 | string | `rc_name` | 名称 |
| 57 | string | `extra_description` | 描述文案 |
| 58 | u32 | `rc_amount` | 数量 |
| 59 | u64 | `progress_value` | — |
| 60 | u64 | `progress_target` | — |
| 61 | u32 | `activity_id` | — |
| 62 | u8 | `ranking_to` | 名次 |
| 63 | string | `name` | 名称 |
| 64 | string | `description` | 描述文案 |
| 65 | u32 | `icon` | 图标编号 |
| 66 | u32 | `amount` | 数量 |
| 67 | u32 | `alliance_id` | 军团 ID |
| 68 | string | `alliance_name` | 军团名称 |
| 69 | u8 | `badge_type` | 类型枚举 |
| 70 | u32 | `badge` | — |
| 71 | u64 | `ranking_score` | 名次 |
| 72 | u32 | `activity_id` | — |
| 73 | string | `activity_name` | 名称 |
| 74 | u32 | `activity_id` | — |
| 75 | string | `flag` | — |
| 76 | u64 | `start_time` | 开始时间戳 |
| 77 | u64 | `end_time` | 结束时间戳 |
| 78 | u8 | `time_limited` | 时间戳（毫秒） |
| 79 | u64 | `remain_time` | 剩余毫秒数 |
| 80 | u32 | `activity_type` | 类型枚举 |
| 81 | u8 | `activity_sub_type` | 类型枚举 |
| 82 | u32 | `activity_group_id` | — |
| 83 | u32 | `red_point_type` | 类型枚举 |
| 84 | u64 | `red_point_unimark` | — |
| 85 | u32 | `reg_days_limited` | — |

---

### `cmd=22017` — 查询活动地标详情

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
| 8 | u8 | `collect_status` | 结果状态 |
| 9 | u32 | `activity_id` | — |
| 10 | u8 | `code_used` | — |
| 11 | string | `name` | 名称 |
| 12 | string | `description` | 描述文案 |
| 13 | u32 | `icon` | 图标编号 |
| 14 | u32 | `amount` | 数量 |
| 15 | string | `code` | — |
| 16 | string | `code_requirement` | — |
| 17 | u32 | `invited_count` | 数量/计数 |
| 18 | u32 | `max_invited_count` | 数量/计数 |
| 19 | u32 | `section_id` | — |
| 20 | u8 | `collect_status` | 结果状态 |
| 21 | string | `section_name` | 名称 |
| 22 | string | `rc_name` | 名称 |
| 23 | string | `extra_description` | 描述文案 |
| 24 | u32 | `rc_amount` | 数量 |
| 25 | u64 | `progress_value` | — |
| 26 | u64 | `progress_target` | — |
| 27 | u8 | `code_used` | — |
| 28 | string | `code` | — |
| 29 | string | `code_requirement` | — |
| 30 | u32 | `invited_count` | 数量/计数 |
| 31 | u32 | `max_invited_count` | 数量/计数 |
| 32 | u32 | `section_id` | — |
| 33 | u8 | `collect_status` | 结果状态 |
| 34 | string | `section_name` | 名称 |
| 35 | u64 | `progress_value` | — |
| 36 | u64 | `progress_target` | — |
| 37 | string | `rc_name` | 名称 |
| 38 | string | `extra_description` | 描述文案 |
| 39 | u32 | `rc_amount` | 数量 |
| 40 | u32 | `section_id` | — |
| 41 | string | `section_name` | 名称 |
| 42 | string | `rc_name` | 名称 |
| 43 | string | `extra_description` | 描述文案 |
| 44 | u32 | `rc_amount` | 数量 |
| 45 | u64 | `progress_value` | — |
| 46 | u64 | `progress_target` | — |
| 47 | u32 | `activity_id` | — |
| 48 | u8 | `ranking_to` | 名次 |
| 49 | string | `name` | 名称 |
| 50 | string | `description` | 描述文案 |
| 51 | u32 | `icon` | 图标编号 |
| 52 | u32 | `amount` | 数量 |
| 53 | u32 | `alliance_id` | 军团 ID |
| 54 | string | `alliance_name` | 军团名称 |
| 55 | u8 | `badge_type` | 类型枚举 |
| 56 | u32 | `badge` | — |
| 57 | u64 | `ranking_score` | 名次 |
| 58 | u32 | `activity_id` | — |
| 59 | string | `activity_name` | 名称 |
| 60 | u32 | `activity_id` | — |
| 61 | string | `flag` | — |
| 62 | u64 | `start_time` | 开始时间戳 |
| 63 | u64 | `end_time` | 结束时间戳 |
| 64 | u8 | `time_limited` | 时间戳（毫秒） |
| 65 | u64 | `remain_time` | 剩余毫秒数 |
| 66 | u32 | `activity_type` | 类型枚举 |
| 67 | u8 | `activity_sub_type` | 类型枚举 |
| 68 | u32 | `activity_group_id` | — |
| 69 | u32 | `red_point_type` | 类型枚举 |
| 70 | u64 | `red_point_unimark` | — |
| 71 | u32 | `reg_days_limited` | — |

---

### `cmd=22018` — 领取地标活动奖励

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `activity_id` | — |
| 2 | u32 | `section_id` | — |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

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
