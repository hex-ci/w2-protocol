# 军团

> 50 个命令（cmd 5001 ~ 5062）。所有响应均以 1 字节 status 打头，成功值见各条目。

### `cmd=5001` — 查询军团信息

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `is_join_alliance` | 军团 |
| 2 | u32 | `alliance_id` | 军团 ID |
| 3 | string | `alliance_name` | 军团名称 |
| 4 | string | `leader_name` | 名称 |
| 5 | string | `founder_name` | 名称 |
| 6 | u32 | `member_count` | 数量/计数 |
| 7 | u32 | `member_count_max` | 数量/计数 |
| 8 | u8 | `alliance_war_state` | 军团 |
| 9 | u8 | `alliance_war_join_state` | 军团 |
| 10 | u64 | `alliance_war_next_state_time` | 军团 |
| 11 | u64 | `alliance_score` | 军团 |
| 12 | u32 | `ranking` | 名次 |
| 13 | u64 | `fame` | 声望值 |
| 14 | string | `alliance_description` | 描述文案 |
| 15 | string | `alliance_announcement` | 军团 |
| 16 | string | `alliance_name` | 军团名称 |
| 17 | u32 | `ranking` | 名次 |
| 18 | u32 | `member_count` | 数量/计数 |
| 19 | u32 | `badge_id` | — |
| 20 | u8 | `has_capital` | 布尔标记（0/1） |
| 21 | u32 | `capital_level` | 等级 |
| 22 | u8 | `badge_editable` | — |
| 23 | u8 | `join_alliance_directly` | 军团 |
| 24 | u64 | `gold_required` | — |
| 25 | u64 | `fame_required` | 声望值 |
| 26 | u32 | `alliance_id` | 军团 ID |
| 27 | u32 | `badge_id` | — |
| 28 | string | `alliance_name` | 军团名称 |
| 29 | u32 | `alliance_id` | 军团 ID |
| 30 | u32 | `badge_id` | — |
| 31 | string | `alliance_name` | 军团名称 |
| 32 | u32 | `ranking` | 名次 |
| 33 | u32 | `member_count` | 数量/计数 |
| 34 | u64 | `fame` | 声望值 |
| 35 | u8 | `alliance_war_state` | 军团 |
| 36 | u64 | `alliance_war_next_state_time` | 军团 |
| 37 | u8 | `status` | 结果状态 |
| 38 | u64 | `alliance_war_start_time` | 开始时间戳 |
| 39 | u64 | `alliance_war_end_time` | 军团 |

---

### `cmd=5002` — 创建军团

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `alliance_name` | 军团名称 |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=5003` — 查询收到的邀请

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `player_id` | 玩家 ID |
| 2 | string | `nickname` | 玩家昵称 |
| 3 | u32 | `avatar` | — |
| 4 | u32 | `ranking` | 名次 |
| 5 | u64 | `fame` | 声望值 |
| 6 | string | `inviter` | — |
| 7 | u64 | `invite_time` | 时间戳（毫秒） |

---

### `cmd=5004` — 邀请玩家入团

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `nickname` | 玩家昵称 |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=5005` — 取消邀请

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `player_id` | 玩家 ID |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=5006` — 接受邀请入团

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `alliance_id` | 军团 ID |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=5007` — 拒绝邀请

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `alliance_id` | 军团 ID |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=5008` — 查询军团列表

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `page_size` | 每页条数 |
| 2 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 3 | u8 | `list_type` | 类型枚举 |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `list_type` | 类型枚举 |
| 2 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 3 | u32 | `page_count` | 总页数 |
| 4 | u32 | `alliance_id` | 军团 ID |
| 5 | u32 | `ranking` | 名次 |
| 6 | string | `alliance_name` | 军团名称 |
| 7 | string | `leader_name` | 名称 |
| 8 | u32 | `member_count` | 数量/计数 |
| 9 | u64 | `fame` | 声望值 |
| 10 | u32 | `badge_id` | — |
| 11 | u8 | `join_alliance_directly` | 军团 |

---

### `cmd=5009` — 按关键字搜军团

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `page_size` | 每页条数 |
| 2 | string | `keyword` | — |

**响应**（status 为 **1** 或 **2** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 2 | u32 | `page_count` | 总页数 |
| 3 | u32 | `alliance_id` | 军团 ID |
| 4 | u32 | `ranking` | 名次 |
| 5 | string | `alliance_name` | 军团名称 |
| 6 | string | `leader_name` | 名称 |
| 7 | u32 | `member_count` | 数量/计数 |
| 8 | u64 | `fame` | 声望值 |
| 9 | u32 | `badge_id` | — |
| 10 | u8 | `join_alliance_directly` | 军团 |
| 11 | u8 | `result_code` | — |
| 12 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 13 | u32 | `page_count` | 总页数 |
| 14 | u8 | `event_type` | 类型枚举 |
| 15 | string | `event_message` | — |
| 16 | u64 | `event_time` | 时间戳（毫秒） |
| 17 | string | `nickname` | 玩家昵称 |
| 18 | u32 | `avatar` | — |
| 19 | u64 | `player_id` | 玩家 ID |
| 20 | u32 | `ranking` | 名次 |
| 21 | u64 | `fame` | 声望值 |
| 22 | u8 | `city_count` | 城池数量 |
| 23 | u64 | `apply_time` | 时间戳（毫秒） |
| 24 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 25 | u32 | `page_count` | 总页数 |
| 26 | u64 | `alliance_gift_id` | 军团 |
| 27 | u32 | `rc_type` | 类型枚举 |
| 28 | string | `from` | — |
| 29 | string | `rc_image` | — |
| 30 | string | `description` | 描述文案 |
| 31 | u8 | `status` | 结果状态 |
| 32 | u64 | `remain_time` | 剩余毫秒数 |
| 33 | u32 | `rc_type` | 类型枚举 |
| 34 | string | `rc_image` | — |
| 35 | string | `rc_name` | 名称 |
| 36 | u32 | `rc_amount` | 数量 |
| 37 | u32 | `channel_type` | 渠道名 |
| 38 | u8 | `earlier_load_mode` | — |
| 39 | u8 | `chat_type` | 消息类型 |
| 40 | u32 | `chat_channel` | 渠道名 |
| 41 | u64 | `chat_id` | 聊天消息 ID |
| 42 | u32 | `sender_player_type` | 类型枚举 |
| 43 | u64 | `player_id` | 玩家 ID |
| 44 | string | `nickname` | 玩家昵称 |
| 45 | u64 | `fame` | 声望值 |
| 46 | u8 | `rank` | 军衔等级 |
| 47 | u8 | `position` | 格位编号 |
| 48 | string | `player_title` | — |
| 49 | string | `alliance_title` | 军团 |
| 50 | u64 | `receiver_player_id` | 玩家 ID |
| 51 | string | `receiver_nickname` | 玩家昵称 |
| 52 | u32 | `avatar` | — |
| 53 | string | `alliance_name` | 军团名称 |
| 54 | u64 | `chat_time` | 聊天时间戳 |
| 55 | u32 | `chat_channel` | 渠道名 |
| 56 | u64 | `chat_id` | 聊天消息 ID |
| 57 | u32 | `sender_player_type` | 类型枚举 |
| 58 | u64 | `player_id` | 玩家 ID |
| 59 | string | `nickname` | 玩家昵称 |
| 60 | u64 | `fame` | 声望值 |
| 61 | u8 | `rank` | 军衔等级 |
| 62 | u8 | `position` | 格位编号 |
| 63 | string | `player_title` | — |
| 64 | string | `alliance_title` | 军团 |
| 65 | u64 | `receiver_player_id` | 玩家 ID |
| 66 | string | `receiver_nickname` | 玩家昵称 |
| 67 | u32 | `avatar` | — |
| 68 | string | `alliance_name` | 军团名称 |
| 69 | string | `voice_file_path` | — |
| 70 | u64 | `chat_time` | 聊天时间戳 |
| 71 | u32 | `chat_channel` | 渠道名 |
| 72 | u64 | `chat_id` | 聊天消息 ID |
| 73 | u32 | `sender_player_type` | 类型枚举 |
| 74 | u64 | `player_id` | 玩家 ID |
| 75 | string | `nickname` | 玩家昵称 |
| 76 | u64 | `fame` | 声望值 |
| 77 | u8 | `rank` | 军衔等级 |
| 78 | u8 | `position` | 格位编号 |
| 79 | string | `player_title` | — |
| 80 | string | `alliance_title` | 军团 |
| 81 | u64 | `receiver_player_id` | 玩家 ID |
| 82 | string | `receiver_nickname` | 玩家昵称 |
| 83 | u32 | `avatar` | — |
| 84 | string | `alliance_name` | 军团名称 |
| 85 | u64 | `flaund_id` | — |
| 86 | u64 | `chat_time` | 聊天时间戳 |
| 87 | u64 | `chat_id` | 聊天消息 ID |
| 88 | string | `chat_color` | — |
| 89 | u8 | `bold_font` | — |
| 90 | u64 | `chat_time` | 聊天时间戳 |

---

### `cmd=5011` — 发送入团申请

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `alliance_id` | 军团 ID |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=5012` — 撤回入团申请

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `alliance_id` | 军团 ID |

**响应**（status 为 **1** 或 **2** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `result_code` | — |
| 2 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 3 | u32 | `page_count` | 总页数 |
| 4 | u8 | `event_type` | 类型枚举 |
| 5 | string | `event_message` | — |
| 6 | u64 | `event_time` | 时间戳（毫秒） |
| 7 | string | `nickname` | 玩家昵称 |
| 8 | u32 | `avatar` | — |
| 9 | u64 | `player_id` | 玩家 ID |
| 10 | u32 | `ranking` | 名次 |
| 11 | u64 | `fame` | 声望值 |
| 12 | u8 | `city_count` | 城池数量 |
| 13 | u64 | `apply_time` | 时间戳（毫秒） |
| 14 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 15 | u32 | `page_count` | 总页数 |
| 16 | u64 | `alliance_gift_id` | 军团 |
| 17 | u32 | `rc_type` | 类型枚举 |
| 18 | string | `from` | — |
| 19 | string | `rc_image` | — |
| 20 | string | `description` | 描述文案 |
| 21 | u8 | `status` | 结果状态 |
| 22 | u64 | `remain_time` | 剩余毫秒数 |
| 23 | u32 | `rc_type` | 类型枚举 |
| 24 | string | `rc_image` | — |
| 25 | string | `rc_name` | 名称 |
| 26 | u32 | `rc_amount` | 数量 |
| 27 | u32 | `channel_type` | 渠道名 |
| 28 | u8 | `earlier_load_mode` | — |
| 29 | u8 | `chat_type` | 消息类型 |
| 30 | u32 | `chat_channel` | 渠道名 |
| 31 | u64 | `chat_id` | 聊天消息 ID |
| 32 | u32 | `sender_player_type` | 类型枚举 |
| 33 | u64 | `player_id` | 玩家 ID |
| 34 | string | `nickname` | 玩家昵称 |
| 35 | u64 | `fame` | 声望值 |
| 36 | u8 | `rank` | 军衔等级 |
| 37 | u8 | `position` | 格位编号 |
| 38 | string | `player_title` | — |
| 39 | string | `alliance_title` | 军团 |
| 40 | u64 | `receiver_player_id` | 玩家 ID |
| 41 | string | `receiver_nickname` | 玩家昵称 |
| 42 | u32 | `avatar` | — |
| 43 | string | `alliance_name` | 军团名称 |
| 44 | u64 | `chat_time` | 聊天时间戳 |
| 45 | u32 | `chat_channel` | 渠道名 |
| 46 | u64 | `chat_id` | 聊天消息 ID |
| 47 | u32 | `sender_player_type` | 类型枚举 |
| 48 | u64 | `player_id` | 玩家 ID |
| 49 | string | `nickname` | 玩家昵称 |
| 50 | u64 | `fame` | 声望值 |
| 51 | u8 | `rank` | 军衔等级 |
| 52 | u8 | `position` | 格位编号 |
| 53 | string | `player_title` | — |
| 54 | string | `alliance_title` | 军团 |
| 55 | u64 | `receiver_player_id` | 玩家 ID |
| 56 | string | `receiver_nickname` | 玩家昵称 |
| 57 | u32 | `avatar` | — |
| 58 | string | `alliance_name` | 军团名称 |
| 59 | string | `voice_file_path` | — |
| 60 | u64 | `chat_time` | 聊天时间戳 |
| 61 | u32 | `chat_channel` | 渠道名 |
| 62 | u64 | `chat_id` | 聊天消息 ID |
| 63 | u32 | `sender_player_type` | 类型枚举 |
| 64 | u64 | `player_id` | 玩家 ID |
| 65 | string | `nickname` | 玩家昵称 |
| 66 | u64 | `fame` | 声望值 |
| 67 | u8 | `rank` | 军衔等级 |
| 68 | u8 | `position` | 格位编号 |
| 69 | string | `player_title` | — |
| 70 | string | `alliance_title` | 军团 |
| 71 | u64 | `receiver_player_id` | 玩家 ID |
| 72 | string | `receiver_nickname` | 玩家昵称 |
| 73 | u32 | `avatar` | — |
| 74 | string | `alliance_name` | 军团名称 |
| 75 | u64 | `flaund_id` | — |
| 76 | u64 | `chat_time` | 聊天时间戳 |
| 77 | u64 | `chat_id` | 聊天消息 ID |
| 78 | string | `chat_color` | — |
| 79 | u8 | `bold_font` | — |
| 80 | u64 | `chat_time` | 聊天时间戳 |

---

### `cmd=5013` — 查询军团事件

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `page_size` | 每页条数 |
| 2 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |

**响应**（status 为 **1** 或 **2** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 2 | u32 | `page_count` | 总页数 |
| 3 | u8 | `event_type` | 类型枚举 |
| 4 | string | `event_message` | — |
| 5 | u64 | `event_time` | 时间戳（毫秒） |
| 6 | string | `nickname` | 玩家昵称 |
| 7 | u32 | `avatar` | — |
| 8 | u64 | `player_id` | 玩家 ID |
| 9 | u32 | `ranking` | 名次 |
| 10 | u64 | `fame` | 声望值 |
| 11 | u8 | `city_count` | 城池数量 |
| 12 | u64 | `apply_time` | 时间戳（毫秒） |
| 13 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 14 | u32 | `page_count` | 总页数 |
| 15 | u64 | `alliance_gift_id` | 军团 |
| 16 | u32 | `rc_type` | 类型枚举 |
| 17 | string | `from` | — |
| 18 | string | `rc_image` | — |
| 19 | string | `description` | 描述文案 |
| 20 | u8 | `status` | 结果状态 |
| 21 | u64 | `remain_time` | 剩余毫秒数 |
| 22 | u32 | `rc_type` | 类型枚举 |
| 23 | string | `rc_image` | — |
| 24 | string | `rc_name` | 名称 |
| 25 | u32 | `rc_amount` | 数量 |
| 26 | u32 | `channel_type` | 渠道名 |
| 27 | u8 | `earlier_load_mode` | — |
| 28 | u8 | `chat_type` | 消息类型 |
| 29 | u32 | `chat_channel` | 渠道名 |
| 30 | u64 | `chat_id` | 聊天消息 ID |
| 31 | u32 | `sender_player_type` | 类型枚举 |
| 32 | u64 | `player_id` | 玩家 ID |
| 33 | string | `nickname` | 玩家昵称 |
| 34 | u64 | `fame` | 声望值 |
| 35 | u8 | `rank` | 军衔等级 |
| 36 | u8 | `position` | 格位编号 |
| 37 | string | `player_title` | — |
| 38 | string | `alliance_title` | 军团 |
| 39 | u64 | `receiver_player_id` | 玩家 ID |
| 40 | string | `receiver_nickname` | 玩家昵称 |
| 41 | u32 | `avatar` | — |
| 42 | string | `alliance_name` | 军团名称 |
| 43 | u64 | `chat_time` | 聊天时间戳 |
| 44 | u32 | `chat_channel` | 渠道名 |
| 45 | u64 | `chat_id` | 聊天消息 ID |
| 46 | u32 | `sender_player_type` | 类型枚举 |
| 47 | u64 | `player_id` | 玩家 ID |
| 48 | string | `nickname` | 玩家昵称 |
| 49 | u64 | `fame` | 声望值 |
| 50 | u8 | `rank` | 军衔等级 |
| 51 | u8 | `position` | 格位编号 |
| 52 | string | `player_title` | — |
| 53 | string | `alliance_title` | 军团 |
| 54 | u64 | `receiver_player_id` | 玩家 ID |
| 55 | string | `receiver_nickname` | 玩家昵称 |
| 56 | u32 | `avatar` | — |
| 57 | string | `alliance_name` | 军团名称 |
| 58 | string | `voice_file_path` | — |
| 59 | u64 | `chat_time` | 聊天时间戳 |
| 60 | u32 | `chat_channel` | 渠道名 |
| 61 | u64 | `chat_id` | 聊天消息 ID |
| 62 | u32 | `sender_player_type` | 类型枚举 |
| 63 | u64 | `player_id` | 玩家 ID |
| 64 | string | `nickname` | 玩家昵称 |
| 65 | u64 | `fame` | 声望值 |
| 66 | u8 | `rank` | 军衔等级 |
| 67 | u8 | `position` | 格位编号 |
| 68 | string | `player_title` | — |
| 69 | string | `alliance_title` | 军团 |
| 70 | u64 | `receiver_player_id` | 玩家 ID |
| 71 | string | `receiver_nickname` | 玩家昵称 |
| 72 | u32 | `avatar` | — |
| 73 | string | `alliance_name` | 军团名称 |
| 74 | u64 | `flaund_id` | — |
| 75 | u64 | `chat_time` | 聊天时间戳 |
| 76 | u64 | `chat_id` | 聊天消息 ID |
| 77 | string | `chat_color` | — |
| 78 | u8 | `bold_font` | — |
| 79 | u64 | `chat_time` | 聊天时间戳 |

---

### `cmd=5014` — 查询军团战日志

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `page_size` | 每页条数 |
| 2 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 2 | u32 | `page_count` | 总页数 |
| 3 | u64 | `alliance_battle_log_id` | 军团 |
| 4 | u8 | `type` | 类型枚举 |
| 5 | string | `detail` | — |
| 6 | string | `target_alliance_name` | 军团名称 |
| 7 | u64 | `battle_time` | 时间戳（毫秒） |

---

### `cmd=5015` — 踢出成员

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `nickname` | 玩家昵称 |

**响应**（status 为 **1** 或 **2** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `nickname` | 玩家昵称 |
| 2 | u32 | `avatar` | — |
| 3 | u64 | `player_id` | 玩家 ID |
| 4 | u32 | `ranking` | 名次 |
| 5 | u64 | `fame` | 声望值 |
| 6 | u8 | `city_count` | 城池数量 |
| 7 | u64 | `apply_time` | 时间戳（毫秒） |
| 8 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 9 | u32 | `page_count` | 总页数 |
| 10 | u64 | `alliance_gift_id` | 军团 |
| 11 | u32 | `rc_type` | 类型枚举 |
| 12 | string | `from` | — |
| 13 | string | `rc_image` | — |
| 14 | string | `description` | 描述文案 |
| 15 | u8 | `status` | 结果状态 |
| 16 | u64 | `remain_time` | 剩余毫秒数 |
| 17 | u32 | `rc_type` | 类型枚举 |
| 18 | string | `rc_image` | — |
| 19 | string | `rc_name` | 名称 |
| 20 | u32 | `rc_amount` | 数量 |
| 21 | u32 | `channel_type` | 渠道名 |
| 22 | u8 | `earlier_load_mode` | — |
| 23 | u8 | `chat_type` | 消息类型 |
| 24 | u32 | `chat_channel` | 渠道名 |
| 25 | u64 | `chat_id` | 聊天消息 ID |
| 26 | u32 | `sender_player_type` | 类型枚举 |
| 27 | u64 | `player_id` | 玩家 ID |
| 28 | string | `nickname` | 玩家昵称 |
| 29 | u64 | `fame` | 声望值 |
| 30 | u8 | `rank` | 军衔等级 |
| 31 | u8 | `position` | 格位编号 |
| 32 | string | `player_title` | — |
| 33 | string | `alliance_title` | 军团 |
| 34 | u64 | `receiver_player_id` | 玩家 ID |
| 35 | string | `receiver_nickname` | 玩家昵称 |
| 36 | u32 | `avatar` | — |
| 37 | string | `alliance_name` | 军团名称 |
| 38 | u64 | `chat_time` | 聊天时间戳 |
| 39 | u32 | `chat_channel` | 渠道名 |
| 40 | u64 | `chat_id` | 聊天消息 ID |
| 41 | u32 | `sender_player_type` | 类型枚举 |
| 42 | u64 | `player_id` | 玩家 ID |
| 43 | string | `nickname` | 玩家昵称 |
| 44 | u64 | `fame` | 声望值 |
| 45 | u8 | `rank` | 军衔等级 |
| 46 | u8 | `position` | 格位编号 |
| 47 | string | `player_title` | — |
| 48 | string | `alliance_title` | 军团 |
| 49 | u64 | `receiver_player_id` | 玩家 ID |
| 50 | string | `receiver_nickname` | 玩家昵称 |
| 51 | u32 | `avatar` | — |
| 52 | string | `alliance_name` | 军团名称 |
| 53 | string | `voice_file_path` | — |
| 54 | u64 | `chat_time` | 聊天时间戳 |
| 55 | u32 | `chat_channel` | 渠道名 |
| 56 | u64 | `chat_id` | 聊天消息 ID |
| 57 | u32 | `sender_player_type` | 类型枚举 |
| 58 | u64 | `player_id` | 玩家 ID |
| 59 | string | `nickname` | 玩家昵称 |
| 60 | u64 | `fame` | 声望值 |
| 61 | u8 | `rank` | 军衔等级 |
| 62 | u8 | `position` | 格位编号 |
| 63 | string | `player_title` | — |
| 64 | string | `alliance_title` | 军团 |
| 65 | u64 | `receiver_player_id` | 玩家 ID |
| 66 | string | `receiver_nickname` | 玩家昵称 |
| 67 | u32 | `avatar` | — |
| 68 | string | `alliance_name` | 军团名称 |
| 69 | u64 | `flaund_id` | — |
| 70 | u64 | `chat_time` | 聊天时间戳 |
| 71 | u64 | `chat_id` | 聊天消息 ID |
| 72 | string | `chat_color` | — |
| 73 | u8 | `bold_font` | — |
| 74 | u64 | `chat_time` | 聊天时间戳 |

---

### `cmd=5016` — 查询入团申请列表

**请求参数**: 无

**响应**（status 为 **1** 或 **2** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `nickname` | 玩家昵称 |
| 2 | u32 | `avatar` | — |
| 3 | u64 | `player_id` | 玩家 ID |
| 4 | u32 | `ranking` | 名次 |
| 5 | u64 | `fame` | 声望值 |
| 6 | u8 | `city_count` | 城池数量 |
| 7 | u64 | `apply_time` | 时间戳（毫秒） |
| 8 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 9 | u32 | `page_count` | 总页数 |
| 10 | u64 | `alliance_gift_id` | 军团 |
| 11 | u32 | `rc_type` | 类型枚举 |
| 12 | string | `from` | — |
| 13 | string | `rc_image` | — |
| 14 | string | `description` | 描述文案 |
| 15 | u8 | `status` | 结果状态 |
| 16 | u64 | `remain_time` | 剩余毫秒数 |
| 17 | u32 | `rc_type` | 类型枚举 |
| 18 | string | `rc_image` | — |
| 19 | string | `rc_name` | 名称 |
| 20 | u32 | `rc_amount` | 数量 |
| 21 | u32 | `channel_type` | 渠道名 |
| 22 | u8 | `earlier_load_mode` | — |
| 23 | u8 | `chat_type` | 消息类型 |
| 24 | u32 | `chat_channel` | 渠道名 |
| 25 | u64 | `chat_id` | 聊天消息 ID |
| 26 | u32 | `sender_player_type` | 类型枚举 |
| 27 | u64 | `player_id` | 玩家 ID |
| 28 | string | `nickname` | 玩家昵称 |
| 29 | u64 | `fame` | 声望值 |
| 30 | u8 | `rank` | 军衔等级 |
| 31 | u8 | `position` | 格位编号 |
| 32 | string | `player_title` | — |
| 33 | string | `alliance_title` | 军团 |
| 34 | u64 | `receiver_player_id` | 玩家 ID |
| 35 | string | `receiver_nickname` | 玩家昵称 |
| 36 | u32 | `avatar` | — |
| 37 | string | `alliance_name` | 军团名称 |
| 38 | u64 | `chat_time` | 聊天时间戳 |
| 39 | u32 | `chat_channel` | 渠道名 |
| 40 | u64 | `chat_id` | 聊天消息 ID |
| 41 | u32 | `sender_player_type` | 类型枚举 |
| 42 | u64 | `player_id` | 玩家 ID |
| 43 | string | `nickname` | 玩家昵称 |
| 44 | u64 | `fame` | 声望值 |
| 45 | u8 | `rank` | 军衔等级 |
| 46 | u8 | `position` | 格位编号 |
| 47 | string | `player_title` | — |
| 48 | string | `alliance_title` | 军团 |
| 49 | u64 | `receiver_player_id` | 玩家 ID |
| 50 | string | `receiver_nickname` | 玩家昵称 |
| 51 | u32 | `avatar` | — |
| 52 | string | `alliance_name` | 军团名称 |
| 53 | string | `voice_file_path` | — |
| 54 | u64 | `chat_time` | 聊天时间戳 |
| 55 | u32 | `chat_channel` | 渠道名 |
| 56 | u64 | `chat_id` | 聊天消息 ID |
| 57 | u32 | `sender_player_type` | 类型枚举 |
| 58 | u64 | `player_id` | 玩家 ID |
| 59 | string | `nickname` | 玩家昵称 |
| 60 | u64 | `fame` | 声望值 |
| 61 | u8 | `rank` | 军衔等级 |
| 62 | u8 | `position` | 格位编号 |
| 63 | string | `player_title` | — |
| 64 | string | `alliance_title` | 军团 |
| 65 | u64 | `receiver_player_id` | 玩家 ID |
| 66 | string | `receiver_nickname` | 玩家昵称 |
| 67 | u32 | `avatar` | — |
| 68 | string | `alliance_name` | 军团名称 |
| 69 | u64 | `flaund_id` | — |
| 70 | u64 | `chat_time` | 聊天时间戳 |
| 71 | u64 | `chat_id` | 聊天消息 ID |
| 72 | string | `chat_color` | — |
| 73 | u8 | `bold_font` | — |
| 74 | u64 | `chat_time` | 聊天时间戳 |

---

### `cmd=5017` — 批准入团申请

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `player_id` | 玩家 ID |

**响应**（status 为 **1** 或 **2** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 2 | u32 | `page_count` | 总页数 |
| 3 | u64 | `alliance_gift_id` | 军团 |
| 4 | u32 | `rc_type` | 类型枚举 |
| 5 | string | `from` | — |
| 6 | string | `rc_image` | — |
| 7 | string | `description` | 描述文案 |
| 8 | u8 | `status` | 结果状态 |
| 9 | u64 | `remain_time` | 剩余毫秒数 |
| 10 | u32 | `rc_type` | 类型枚举 |
| 11 | string | `rc_image` | — |
| 12 | string | `rc_name` | 名称 |
| 13 | u32 | `rc_amount` | 数量 |
| 14 | u32 | `channel_type` | 渠道名 |
| 15 | u8 | `earlier_load_mode` | — |
| 16 | u8 | `chat_type` | 消息类型 |
| 17 | u32 | `chat_channel` | 渠道名 |
| 18 | u64 | `chat_id` | 聊天消息 ID |
| 19 | u32 | `sender_player_type` | 类型枚举 |
| 20 | u64 | `player_id` | 玩家 ID |
| 21 | string | `nickname` | 玩家昵称 |
| 22 | u64 | `fame` | 声望值 |
| 23 | u8 | `rank` | 军衔等级 |
| 24 | u8 | `position` | 格位编号 |
| 25 | string | `player_title` | — |
| 26 | string | `alliance_title` | 军团 |
| 27 | u64 | `receiver_player_id` | 玩家 ID |
| 28 | string | `receiver_nickname` | 玩家昵称 |
| 29 | u32 | `avatar` | — |
| 30 | string | `alliance_name` | 军团名称 |
| 31 | u64 | `chat_time` | 聊天时间戳 |
| 32 | u32 | `chat_channel` | 渠道名 |
| 33 | u64 | `chat_id` | 聊天消息 ID |
| 34 | u32 | `sender_player_type` | 类型枚举 |
| 35 | u64 | `player_id` | 玩家 ID |
| 36 | string | `nickname` | 玩家昵称 |
| 37 | u64 | `fame` | 声望值 |
| 38 | u8 | `rank` | 军衔等级 |
| 39 | u8 | `position` | 格位编号 |
| 40 | string | `player_title` | — |
| 41 | string | `alliance_title` | 军团 |
| 42 | u64 | `receiver_player_id` | 玩家 ID |
| 43 | string | `receiver_nickname` | 玩家昵称 |
| 44 | u32 | `avatar` | — |
| 45 | string | `alliance_name` | 军团名称 |
| 46 | string | `voice_file_path` | — |
| 47 | u64 | `chat_time` | 聊天时间戳 |
| 48 | u32 | `chat_channel` | 渠道名 |
| 49 | u64 | `chat_id` | 聊天消息 ID |
| 50 | u32 | `sender_player_type` | 类型枚举 |
| 51 | u64 | `player_id` | 玩家 ID |
| 52 | string | `nickname` | 玩家昵称 |
| 53 | u64 | `fame` | 声望值 |
| 54 | u8 | `rank` | 军衔等级 |
| 55 | u8 | `position` | 格位编号 |
| 56 | string | `player_title` | — |
| 57 | string | `alliance_title` | 军团 |
| 58 | u64 | `receiver_player_id` | 玩家 ID |
| 59 | string | `receiver_nickname` | 玩家昵称 |
| 60 | u32 | `avatar` | — |
| 61 | string | `alliance_name` | 军团名称 |
| 62 | u64 | `flaund_id` | — |
| 63 | u64 | `chat_time` | 聊天时间戳 |
| 64 | u64 | `chat_id` | 聊天消息 ID |
| 65 | string | `chat_color` | — |
| 66 | u8 | `bold_font` | — |
| 67 | u64 | `chat_time` | 聊天时间戳 |

---

### `cmd=5018` — 拒绝入团申请

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `player_id` | 玩家 ID |

**响应**（status 为 **1** 或 **2** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 2 | u32 | `page_count` | 总页数 |
| 3 | u64 | `alliance_gift_id` | 军团 |
| 4 | u32 | `rc_type` | 类型枚举 |
| 5 | string | `from` | — |
| 6 | string | `rc_image` | — |
| 7 | string | `description` | 描述文案 |
| 8 | u8 | `status` | 结果状态 |
| 9 | u64 | `remain_time` | 剩余毫秒数 |
| 10 | u32 | `rc_type` | 类型枚举 |
| 11 | string | `rc_image` | — |
| 12 | string | `rc_name` | 名称 |
| 13 | u32 | `rc_amount` | 数量 |
| 14 | u32 | `channel_type` | 渠道名 |
| 15 | u8 | `earlier_load_mode` | — |
| 16 | u8 | `chat_type` | 消息类型 |
| 17 | u32 | `chat_channel` | 渠道名 |
| 18 | u64 | `chat_id` | 聊天消息 ID |
| 19 | u32 | `sender_player_type` | 类型枚举 |
| 20 | u64 | `player_id` | 玩家 ID |
| 21 | string | `nickname` | 玩家昵称 |
| 22 | u64 | `fame` | 声望值 |
| 23 | u8 | `rank` | 军衔等级 |
| 24 | u8 | `position` | 格位编号 |
| 25 | string | `player_title` | — |
| 26 | string | `alliance_title` | 军团 |
| 27 | u64 | `receiver_player_id` | 玩家 ID |
| 28 | string | `receiver_nickname` | 玩家昵称 |
| 29 | u32 | `avatar` | — |
| 30 | string | `alliance_name` | 军团名称 |
| 31 | u64 | `chat_time` | 聊天时间戳 |
| 32 | u32 | `chat_channel` | 渠道名 |
| 33 | u64 | `chat_id` | 聊天消息 ID |
| 34 | u32 | `sender_player_type` | 类型枚举 |
| 35 | u64 | `player_id` | 玩家 ID |
| 36 | string | `nickname` | 玩家昵称 |
| 37 | u64 | `fame` | 声望值 |
| 38 | u8 | `rank` | 军衔等级 |
| 39 | u8 | `position` | 格位编号 |
| 40 | string | `player_title` | — |
| 41 | string | `alliance_title` | 军团 |
| 42 | u64 | `receiver_player_id` | 玩家 ID |
| 43 | string | `receiver_nickname` | 玩家昵称 |
| 44 | u32 | `avatar` | — |
| 45 | string | `alliance_name` | 军团名称 |
| 46 | string | `voice_file_path` | — |
| 47 | u64 | `chat_time` | 聊天时间戳 |
| 48 | u32 | `chat_channel` | 渠道名 |
| 49 | u64 | `chat_id` | 聊天消息 ID |
| 50 | u32 | `sender_player_type` | 类型枚举 |
| 51 | u64 | `player_id` | 玩家 ID |
| 52 | string | `nickname` | 玩家昵称 |
| 53 | u64 | `fame` | 声望值 |
| 54 | u8 | `rank` | 军衔等级 |
| 55 | u8 | `position` | 格位编号 |
| 56 | string | `player_title` | — |
| 57 | string | `alliance_title` | 军团 |
| 58 | u64 | `receiver_player_id` | 玩家 ID |
| 59 | string | `receiver_nickname` | 玩家昵称 |
| 60 | u32 | `avatar` | — |
| 61 | string | `alliance_name` | 军团名称 |
| 62 | u64 | `flaund_id` | — |
| 63 | u64 | `chat_time` | 聊天时间戳 |
| 64 | u64 | `chat_id` | 聊天消息 ID |
| 65 | string | `chat_color` | — |
| 66 | u8 | `bold_font` | — |
| 67 | u64 | `chat_time` | 聊天时间戳 |

---

### `cmd=5019` — 添加外交关系

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `alliance_name` | 军团名称 |
| 2 | u8 | `relation` | — |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=5020` — 删除外交关系

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `alliance_id` | 军团 ID |
| 2 | u8 | `relation` | — |

**响应**（status 为 **1** 或 **2** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 2 | u32 | `page_count` | 总页数 |
| 3 | u64 | `alliance_gift_id` | 军团 |
| 4 | u32 | `rc_type` | 类型枚举 |
| 5 | string | `from` | — |
| 6 | string | `rc_image` | — |
| 7 | string | `description` | 描述文案 |
| 8 | u8 | `status` | 结果状态 |
| 9 | u64 | `remain_time` | 剩余毫秒数 |
| 10 | u32 | `rc_type` | 类型枚举 |
| 11 | string | `rc_image` | — |
| 12 | string | `rc_name` | 名称 |
| 13 | u32 | `rc_amount` | 数量 |
| 14 | u32 | `channel_type` | 渠道名 |
| 15 | u8 | `earlier_load_mode` | — |
| 16 | u8 | `chat_type` | 消息类型 |
| 17 | u32 | `chat_channel` | 渠道名 |
| 18 | u64 | `chat_id` | 聊天消息 ID |
| 19 | u32 | `sender_player_type` | 类型枚举 |
| 20 | u64 | `player_id` | 玩家 ID |
| 21 | string | `nickname` | 玩家昵称 |
| 22 | u64 | `fame` | 声望值 |
| 23 | u8 | `rank` | 军衔等级 |
| 24 | u8 | `position` | 格位编号 |
| 25 | string | `player_title` | — |
| 26 | string | `alliance_title` | 军团 |
| 27 | u64 | `receiver_player_id` | 玩家 ID |
| 28 | string | `receiver_nickname` | 玩家昵称 |
| 29 | u32 | `avatar` | — |
| 30 | string | `alliance_name` | 军团名称 |
| 31 | u64 | `chat_time` | 聊天时间戳 |
| 32 | u32 | `chat_channel` | 渠道名 |
| 33 | u64 | `chat_id` | 聊天消息 ID |
| 34 | u32 | `sender_player_type` | 类型枚举 |
| 35 | u64 | `player_id` | 玩家 ID |
| 36 | string | `nickname` | 玩家昵称 |
| 37 | u64 | `fame` | 声望值 |
| 38 | u8 | `rank` | 军衔等级 |
| 39 | u8 | `position` | 格位编号 |
| 40 | string | `player_title` | — |
| 41 | string | `alliance_title` | 军团 |
| 42 | u64 | `receiver_player_id` | 玩家 ID |
| 43 | string | `receiver_nickname` | 玩家昵称 |
| 44 | u32 | `avatar` | — |
| 45 | string | `alliance_name` | 军团名称 |
| 46 | string | `voice_file_path` | — |
| 47 | u64 | `chat_time` | 聊天时间戳 |
| 48 | u32 | `chat_channel` | 渠道名 |
| 49 | u64 | `chat_id` | 聊天消息 ID |
| 50 | u32 | `sender_player_type` | 类型枚举 |
| 51 | u64 | `player_id` | 玩家 ID |
| 52 | string | `nickname` | 玩家昵称 |
| 53 | u64 | `fame` | 声望值 |
| 54 | u8 | `rank` | 军衔等级 |
| 55 | u8 | `position` | 格位编号 |
| 56 | string | `player_title` | — |
| 57 | string | `alliance_title` | 军团 |
| 58 | u64 | `receiver_player_id` | 玩家 ID |
| 59 | string | `receiver_nickname` | 玩家昵称 |
| 60 | u32 | `avatar` | — |
| 61 | string | `alliance_name` | 军团名称 |
| 62 | u64 | `flaund_id` | — |
| 63 | u64 | `chat_time` | 聊天时间戳 |
| 64 | u64 | `chat_id` | 聊天消息 ID |
| 65 | string | `chat_color` | — |
| 66 | u8 | `bold_font` | — |
| 67 | u64 | `chat_time` | 聊天时间戳 |

---

### `cmd=5021` — 转让团长

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `nickname` | 玩家昵称 |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=5022` — 军团辞职

**请求参数**: 无

**响应**（status 为 **1** 或 **2** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 2 | u32 | `page_count` | 总页数 |
| 3 | u64 | `alliance_gift_id` | 军团 |
| 4 | u32 | `rc_type` | 类型枚举 |
| 5 | string | `from` | — |
| 6 | string | `rc_image` | — |
| 7 | string | `description` | 描述文案 |
| 8 | u8 | `status` | 结果状态 |
| 9 | u64 | `remain_time` | 剩余毫秒数 |
| 10 | u32 | `rc_type` | 类型枚举 |
| 11 | string | `rc_image` | — |
| 12 | string | `rc_name` | 名称 |
| 13 | u32 | `rc_amount` | 数量 |
| 14 | u32 | `channel_type` | 渠道名 |
| 15 | u8 | `earlier_load_mode` | — |
| 16 | u8 | `chat_type` | 消息类型 |
| 17 | u32 | `chat_channel` | 渠道名 |
| 18 | u64 | `chat_id` | 聊天消息 ID |
| 19 | u32 | `sender_player_type` | 类型枚举 |
| 20 | u64 | `player_id` | 玩家 ID |
| 21 | string | `nickname` | 玩家昵称 |
| 22 | u64 | `fame` | 声望值 |
| 23 | u8 | `rank` | 军衔等级 |
| 24 | u8 | `position` | 格位编号 |
| 25 | string | `player_title` | — |
| 26 | string | `alliance_title` | 军团 |
| 27 | u64 | `receiver_player_id` | 玩家 ID |
| 28 | string | `receiver_nickname` | 玩家昵称 |
| 29 | u32 | `avatar` | — |
| 30 | string | `alliance_name` | 军团名称 |
| 31 | u64 | `chat_time` | 聊天时间戳 |
| 32 | u32 | `chat_channel` | 渠道名 |
| 33 | u64 | `chat_id` | 聊天消息 ID |
| 34 | u32 | `sender_player_type` | 类型枚举 |
| 35 | u64 | `player_id` | 玩家 ID |
| 36 | string | `nickname` | 玩家昵称 |
| 37 | u64 | `fame` | 声望值 |
| 38 | u8 | `rank` | 军衔等级 |
| 39 | u8 | `position` | 格位编号 |
| 40 | string | `player_title` | — |
| 41 | string | `alliance_title` | 军团 |
| 42 | u64 | `receiver_player_id` | 玩家 ID |
| 43 | string | `receiver_nickname` | 玩家昵称 |
| 44 | u32 | `avatar` | — |
| 45 | string | `alliance_name` | 军团名称 |
| 46 | string | `voice_file_path` | — |
| 47 | u64 | `chat_time` | 聊天时间戳 |
| 48 | u32 | `chat_channel` | 渠道名 |
| 49 | u64 | `chat_id` | 聊天消息 ID |
| 50 | u32 | `sender_player_type` | 类型枚举 |
| 51 | u64 | `player_id` | 玩家 ID |
| 52 | string | `nickname` | 玩家昵称 |
| 53 | u64 | `fame` | 声望值 |
| 54 | u8 | `rank` | 军衔等级 |
| 55 | u8 | `position` | 格位编号 |
| 56 | string | `player_title` | — |
| 57 | string | `alliance_title` | 军团 |
| 58 | u64 | `receiver_player_id` | 玩家 ID |
| 59 | string | `receiver_nickname` | 玩家昵称 |
| 60 | u32 | `avatar` | — |
| 61 | string | `alliance_name` | 军团名称 |
| 62 | u64 | `flaund_id` | — |
| 63 | u64 | `chat_time` | 聊天时间戳 |
| 64 | u64 | `chat_id` | 聊天消息 ID |
| 65 | string | `chat_color` | — |
| 66 | u8 | `bold_font` | — |
| 67 | u64 | `chat_time` | 聊天时间戳 |

---

### `cmd=5023` — 退出军团

**请求参数**: 无

**响应**（status 为 **1** 或 **2** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 2 | u32 | `page_count` | 总页数 |
| 3 | u64 | `alliance_gift_id` | 军团 |
| 4 | u32 | `rc_type` | 类型枚举 |
| 5 | string | `from` | — |
| 6 | string | `rc_image` | — |
| 7 | string | `description` | 描述文案 |
| 8 | u8 | `status` | 结果状态 |
| 9 | u64 | `remain_time` | 剩余毫秒数 |
| 10 | u32 | `rc_type` | 类型枚举 |
| 11 | string | `rc_image` | — |
| 12 | string | `rc_name` | 名称 |
| 13 | u32 | `rc_amount` | 数量 |
| 14 | u32 | `channel_type` | 渠道名 |
| 15 | u8 | `earlier_load_mode` | — |
| 16 | u8 | `chat_type` | 消息类型 |
| 17 | u32 | `chat_channel` | 渠道名 |
| 18 | u64 | `chat_id` | 聊天消息 ID |
| 19 | u32 | `sender_player_type` | 类型枚举 |
| 20 | u64 | `player_id` | 玩家 ID |
| 21 | string | `nickname` | 玩家昵称 |
| 22 | u64 | `fame` | 声望值 |
| 23 | u8 | `rank` | 军衔等级 |
| 24 | u8 | `position` | 格位编号 |
| 25 | string | `player_title` | — |
| 26 | string | `alliance_title` | 军团 |
| 27 | u64 | `receiver_player_id` | 玩家 ID |
| 28 | string | `receiver_nickname` | 玩家昵称 |
| 29 | u32 | `avatar` | — |
| 30 | string | `alliance_name` | 军团名称 |
| 31 | u64 | `chat_time` | 聊天时间戳 |
| 32 | u32 | `chat_channel` | 渠道名 |
| 33 | u64 | `chat_id` | 聊天消息 ID |
| 34 | u32 | `sender_player_type` | 类型枚举 |
| 35 | u64 | `player_id` | 玩家 ID |
| 36 | string | `nickname` | 玩家昵称 |
| 37 | u64 | `fame` | 声望值 |
| 38 | u8 | `rank` | 军衔等级 |
| 39 | u8 | `position` | 格位编号 |
| 40 | string | `player_title` | — |
| 41 | string | `alliance_title` | 军团 |
| 42 | u64 | `receiver_player_id` | 玩家 ID |
| 43 | string | `receiver_nickname` | 玩家昵称 |
| 44 | u32 | `avatar` | — |
| 45 | string | `alliance_name` | 军团名称 |
| 46 | string | `voice_file_path` | — |
| 47 | u64 | `chat_time` | 聊天时间戳 |
| 48 | u32 | `chat_channel` | 渠道名 |
| 49 | u64 | `chat_id` | 聊天消息 ID |
| 50 | u32 | `sender_player_type` | 类型枚举 |
| 51 | u64 | `player_id` | 玩家 ID |
| 52 | string | `nickname` | 玩家昵称 |
| 53 | u64 | `fame` | 声望值 |
| 54 | u8 | `rank` | 军衔等级 |
| 55 | u8 | `position` | 格位编号 |
| 56 | string | `player_title` | — |
| 57 | string | `alliance_title` | 军团 |
| 58 | u64 | `receiver_player_id` | 玩家 ID |
| 59 | string | `receiver_nickname` | 玩家昵称 |
| 60 | u32 | `avatar` | — |
| 61 | string | `alliance_name` | 军团名称 |
| 62 | u64 | `flaund_id` | — |
| 63 | u64 | `chat_time` | 聊天时间戳 |
| 64 | u64 | `chat_id` | 聊天消息 ID |
| 65 | string | `chat_color` | — |
| 66 | u8 | `bold_font` | — |
| 67 | u64 | `chat_time` | 聊天时间戳 |

---

### `cmd=5024` — 查询驻防部队

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `station_switch` | — |
| 2 | u64 | `station_id` | — |
| 3 | string | `nickname` | 玩家昵称 |
| 4 | u32 | `avatar` | — |
| 5 | string | `from_city` | — |
| 6 | u32 | `from_x` | 地图 X 坐标 |
| 7 | u32 | `from_y` | 地图 Y 坐标 |
| 8 | u64 | `arrive_time` | 时间戳（毫秒） |
| 9 | u64 | `stay_time` | 时间戳（毫秒） |
| 10 | u64 | `return_remain_time` | 剩余毫秒数 |

---

### `cmd=5025` — 驻防部队调回

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `station_id` | — |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=5026` — 驻防部队开关

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `station_switch` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `station_switch` | — |

---

### `cmd=5027` — 更改军团职位

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `player_id` | 玩家 ID |
| 2 | u8 | `alliance_position` | 格位编号 |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=5030` — 查询军团徽章

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `badge_change_times` | — |
| 2 | u32 | `price_for_change` | 单价 |
| 3 | u8 | `type` | 类型枚举 |
| 4 | u32 | `badge_id` | — |
| 5 | string | `badge_uri` | — |

---

### `cmd=5031` — 更新军团徽章

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `type` | 类型枚举 |
| 2 | u32 | `badge_id` | — |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=5032` — 查询军团成员

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `is_join_league_war` | 布尔标记（0/1） |
| 2 | u8 | `allow_kick_member` | — |
| 3 | u64 | `player_id` | 玩家 ID |
| 4 | string | `nickname` | 玩家昵称 |
| 5 | u32 | `avatar` | — |
| 6 | u8 | `alliance_position` | 格位编号 |
| 7 | string | `alliance_position_name` | 格位编号 |
| 8 | u32 | `ranking` | 名次 |
| 9 | u8 | `rank` | 军衔等级 |
| 10 | u64 | `fame` | 声望值 |
| 11 | u64 | `influence` | 影响力 |
| 12 | u8 | `city_count` | 城池数量 |
| 13 | u64 | `last_online_time` | 时间戳（毫秒） |
| 14 | u32 | `personal_score` | 积分 |
| 15 | u32 | `alliance_donation_nulear_count` | 军团 |

---

### `cmd=5033` — 查询军团基础信息

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `alliance_id` | 军团 ID |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `alliance_name` | 军团名称 |
| 2 | string | `leader_name` | 名称 |
| 3 | string | `founder_name` | 名称 |
| 4 | u32 | `member_count` | 数量/计数 |
| 5 | u32 | `member_count_max` | 数量/计数 |
| 6 | u32 | `ranking` | 名次 |
| 7 | u64 | `fame` | 声望值 |
| 8 | string | `alliance_description` | 描述文案 |
| 9 | u32 | `badge_id` | — |
| 10 | u32 | `has_capital` | 布尔标记（0/1） |
| 11 | u32 | `capital_level` | 等级 |
| 12 | u8 | `join_alliance_directly` | 军团 |
| 13 | u64 | `alliance_score` | 军团 |

---

### `cmd=5042` — 设置直接入团开关

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `can_join_directly?1:0` | 布尔标记（0/1） |

**响应**（status 为 **1** 或 **2** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 2 | u32 | `page_count` | 总页数 |
| 3 | u64 | `alliance_gift_id` | 军团 |
| 4 | u32 | `rc_type` | 类型枚举 |
| 5 | string | `from` | — |
| 6 | string | `rc_image` | — |
| 7 | string | `description` | 描述文案 |
| 8 | u8 | `status` | 结果状态 |
| 9 | u64 | `remain_time` | 剩余毫秒数 |
| 10 | u32 | `rc_type` | 类型枚举 |
| 11 | string | `rc_image` | — |
| 12 | string | `rc_name` | 名称 |
| 13 | u32 | `rc_amount` | 数量 |
| 14 | u32 | `channel_type` | 渠道名 |
| 15 | u8 | `earlier_load_mode` | — |
| 16 | u8 | `chat_type` | 消息类型 |
| 17 | u32 | `chat_channel` | 渠道名 |
| 18 | u64 | `chat_id` | 聊天消息 ID |
| 19 | u32 | `sender_player_type` | 类型枚举 |
| 20 | u64 | `player_id` | 玩家 ID |
| 21 | string | `nickname` | 玩家昵称 |
| 22 | u64 | `fame` | 声望值 |
| 23 | u8 | `rank` | 军衔等级 |
| 24 | u8 | `position` | 格位编号 |
| 25 | string | `player_title` | — |
| 26 | string | `alliance_title` | 军团 |
| 27 | u64 | `receiver_player_id` | 玩家 ID |
| 28 | string | `receiver_nickname` | 玩家昵称 |
| 29 | u32 | `avatar` | — |
| 30 | string | `alliance_name` | 军团名称 |
| 31 | u64 | `chat_time` | 聊天时间戳 |
| 32 | u32 | `chat_channel` | 渠道名 |
| 33 | u64 | `chat_id` | 聊天消息 ID |
| 34 | u32 | `sender_player_type` | 类型枚举 |
| 35 | u64 | `player_id` | 玩家 ID |
| 36 | string | `nickname` | 玩家昵称 |
| 37 | u64 | `fame` | 声望值 |
| 38 | u8 | `rank` | 军衔等级 |
| 39 | u8 | `position` | 格位编号 |
| 40 | string | `player_title` | — |
| 41 | string | `alliance_title` | 军团 |
| 42 | u64 | `receiver_player_id` | 玩家 ID |
| 43 | string | `receiver_nickname` | 玩家昵称 |
| 44 | u32 | `avatar` | — |
| 45 | string | `alliance_name` | 军团名称 |
| 46 | string | `voice_file_path` | — |
| 47 | u64 | `chat_time` | 聊天时间戳 |
| 48 | u32 | `chat_channel` | 渠道名 |
| 49 | u64 | `chat_id` | 聊天消息 ID |
| 50 | u32 | `sender_player_type` | 类型枚举 |
| 51 | u64 | `player_id` | 玩家 ID |
| 52 | string | `nickname` | 玩家昵称 |
| 53 | u64 | `fame` | 声望值 |
| 54 | u8 | `rank` | 军衔等级 |
| 55 | u8 | `position` | 格位编号 |
| 56 | string | `player_title` | — |
| 57 | string | `alliance_title` | 军团 |
| 58 | u64 | `receiver_player_id` | 玩家 ID |
| 59 | string | `receiver_nickname` | 玩家昵称 |
| 60 | u32 | `avatar` | — |
| 61 | string | `alliance_name` | 军团名称 |
| 62 | u64 | `flaund_id` | — |
| 63 | u64 | `chat_time` | 聊天时间戳 |
| 64 | u64 | `chat_id` | 聊天消息 ID |
| 65 | string | `chat_color` | — |
| 66 | u8 | `bold_font` | — |
| 67 | u64 | `chat_time` | 聊天时间戳 |

---

### `cmd=5043` — 直接入团

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `alliance_id` | 军团 ID |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=5044` — 查询互助列表

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `avatar` | — |
| 2 | string | `nickname` | 玩家昵称 |
| 3 | u8 | `help_type` | 类型枚举 |
| 4 | string | `help_message` | — |
| 5 | u32 | `help_level` | 等级 |
| 6 | u32 | `helped_count` | 数量/计数 |
| 7 | u32 | `helped_count_max` | 数量/计数 |
| 8 | u64 | `help_id` | — |
| 9 | u64 | `player_id` | 玩家 ID |
| 10 | u32 | `avatar` | — |
| 11 | string | `nickname` | 玩家昵称 |
| 12 | u8 | `help_type` | 类型枚举 |
| 13 | string | `help_message` | — |
| 14 | u32 | `help_level` | 等级 |
| 15 | u32 | `helped_count` | 数量/计数 |
| 16 | u32 | `helped_count_max` | 数量/计数 |

---

### `cmd=5045` — 请求互助

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `help_id` | — |
| 2 | u64 | `player_id` | 玩家 ID |

**响应**（status 为 **1** 或 **2** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 2 | u32 | `page_count` | 总页数 |
| 3 | u64 | `alliance_gift_id` | 军团 |
| 4 | u32 | `rc_type` | 类型枚举 |
| 5 | string | `from` | — |
| 6 | string | `rc_image` | — |
| 7 | string | `description` | 描述文案 |
| 8 | u8 | `status` | 结果状态 |
| 9 | u64 | `remain_time` | 剩余毫秒数 |
| 10 | u32 | `rc_type` | 类型枚举 |
| 11 | string | `rc_image` | — |
| 12 | string | `rc_name` | 名称 |
| 13 | u32 | `rc_amount` | 数量 |
| 14 | u32 | `channel_type` | 渠道名 |
| 15 | u8 | `earlier_load_mode` | — |
| 16 | u8 | `chat_type` | 消息类型 |
| 17 | u32 | `chat_channel` | 渠道名 |
| 18 | u64 | `chat_id` | 聊天消息 ID |
| 19 | u32 | `sender_player_type` | 类型枚举 |
| 20 | u64 | `player_id` | 玩家 ID |
| 21 | string | `nickname` | 玩家昵称 |
| 22 | u64 | `fame` | 声望值 |
| 23 | u8 | `rank` | 军衔等级 |
| 24 | u8 | `position` | 格位编号 |
| 25 | string | `player_title` | — |
| 26 | string | `alliance_title` | 军团 |
| 27 | u64 | `receiver_player_id` | 玩家 ID |
| 28 | string | `receiver_nickname` | 玩家昵称 |
| 29 | u32 | `avatar` | — |
| 30 | string | `alliance_name` | 军团名称 |
| 31 | u64 | `chat_time` | 聊天时间戳 |
| 32 | u32 | `chat_channel` | 渠道名 |
| 33 | u64 | `chat_id` | 聊天消息 ID |
| 34 | u32 | `sender_player_type` | 类型枚举 |
| 35 | u64 | `player_id` | 玩家 ID |
| 36 | string | `nickname` | 玩家昵称 |
| 37 | u64 | `fame` | 声望值 |
| 38 | u8 | `rank` | 军衔等级 |
| 39 | u8 | `position` | 格位编号 |
| 40 | string | `player_title` | — |
| 41 | string | `alliance_title` | 军团 |
| 42 | u64 | `receiver_player_id` | 玩家 ID |
| 43 | string | `receiver_nickname` | 玩家昵称 |
| 44 | u32 | `avatar` | — |
| 45 | string | `alliance_name` | 军团名称 |
| 46 | string | `voice_file_path` | — |
| 47 | u64 | `chat_time` | 聊天时间戳 |
| 48 | u32 | `chat_channel` | 渠道名 |
| 49 | u64 | `chat_id` | 聊天消息 ID |
| 50 | u32 | `sender_player_type` | 类型枚举 |
| 51 | u64 | `player_id` | 玩家 ID |
| 52 | string | `nickname` | 玩家昵称 |
| 53 | u64 | `fame` | 声望值 |
| 54 | u8 | `rank` | 军衔等级 |
| 55 | u8 | `position` | 格位编号 |
| 56 | string | `player_title` | — |
| 57 | string | `alliance_title` | 军团 |
| 58 | u64 | `receiver_player_id` | 玩家 ID |
| 59 | string | `receiver_nickname` | 玩家昵称 |
| 60 | u32 | `avatar` | — |
| 61 | string | `alliance_name` | 军团名称 |
| 62 | u64 | `flaund_id` | — |
| 63 | u64 | `chat_time` | 聊天时间戳 |
| 64 | u64 | `chat_id` | 聊天消息 ID |
| 65 | string | `chat_color` | — |
| 66 | u8 | `bold_font` | — |
| 67 | u64 | `chat_time` | 聊天时间戳 |

---

### `cmd=5046` — 一键求助

**请求参数**: 无

**响应**（status 为 **1** 或 **2** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 2 | u32 | `page_count` | 总页数 |
| 3 | u64 | `alliance_gift_id` | 军团 |
| 4 | u32 | `rc_type` | 类型枚举 |
| 5 | string | `from` | — |
| 6 | string | `rc_image` | — |
| 7 | string | `description` | 描述文案 |
| 8 | u8 | `status` | 结果状态 |
| 9 | u64 | `remain_time` | 剩余毫秒数 |
| 10 | u32 | `rc_type` | 类型枚举 |
| 11 | string | `rc_image` | — |
| 12 | string | `rc_name` | 名称 |
| 13 | u32 | `rc_amount` | 数量 |
| 14 | u32 | `channel_type` | 渠道名 |
| 15 | u8 | `earlier_load_mode` | — |
| 16 | u8 | `chat_type` | 消息类型 |
| 17 | u32 | `chat_channel` | 渠道名 |
| 18 | u64 | `chat_id` | 聊天消息 ID |
| 19 | u32 | `sender_player_type` | 类型枚举 |
| 20 | u64 | `player_id` | 玩家 ID |
| 21 | string | `nickname` | 玩家昵称 |
| 22 | u64 | `fame` | 声望值 |
| 23 | u8 | `rank` | 军衔等级 |
| 24 | u8 | `position` | 格位编号 |
| 25 | string | `player_title` | — |
| 26 | string | `alliance_title` | 军团 |
| 27 | u64 | `receiver_player_id` | 玩家 ID |
| 28 | string | `receiver_nickname` | 玩家昵称 |
| 29 | u32 | `avatar` | — |
| 30 | string | `alliance_name` | 军团名称 |
| 31 | u64 | `chat_time` | 聊天时间戳 |
| 32 | u32 | `chat_channel` | 渠道名 |
| 33 | u64 | `chat_id` | 聊天消息 ID |
| 34 | u32 | `sender_player_type` | 类型枚举 |
| 35 | u64 | `player_id` | 玩家 ID |
| 36 | string | `nickname` | 玩家昵称 |
| 37 | u64 | `fame` | 声望值 |
| 38 | u8 | `rank` | 军衔等级 |
| 39 | u8 | `position` | 格位编号 |
| 40 | string | `player_title` | — |
| 41 | string | `alliance_title` | 军团 |
| 42 | u64 | `receiver_player_id` | 玩家 ID |
| 43 | string | `receiver_nickname` | 玩家昵称 |
| 44 | u32 | `avatar` | — |
| 45 | string | `alliance_name` | 军团名称 |
| 46 | string | `voice_file_path` | — |
| 47 | u64 | `chat_time` | 聊天时间戳 |
| 48 | u32 | `chat_channel` | 渠道名 |
| 49 | u64 | `chat_id` | 聊天消息 ID |
| 50 | u32 | `sender_player_type` | 类型枚举 |
| 51 | u64 | `player_id` | 玩家 ID |
| 52 | string | `nickname` | 玩家昵称 |
| 53 | u64 | `fame` | 声望值 |
| 54 | u8 | `rank` | 军衔等级 |
| 55 | u8 | `position` | 格位编号 |
| 56 | string | `player_title` | — |
| 57 | string | `alliance_title` | 军团 |
| 58 | u64 | `receiver_player_id` | 玩家 ID |
| 59 | string | `receiver_nickname` | 玩家昵称 |
| 60 | u32 | `avatar` | — |
| 61 | string | `alliance_name` | 军团名称 |
| 62 | u64 | `flaund_id` | — |
| 63 | u64 | `chat_time` | 聊天时间戳 |
| 64 | u64 | `chat_id` | 聊天消息 ID |
| 65 | string | `chat_color` | — |
| 66 | u8 | `bold_font` | — |
| 67 | u64 | `chat_time` | 聊天时间戳 |

---

### `cmd=5047` — 建造互助请求

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `building_id` | 建筑实例 ID |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=5048` — 研究互助请求

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `city_id` | 城池 ID |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=5050` — 军团战参战开关

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `alliance_war_join_state` | 军团 |

---

### `cmd=5051` — 查询军团礼包

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `page_size` | 每页条数 |
| 2 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |

**响应**（status 为 **1** 或 **2** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 2 | u32 | `page_count` | 总页数 |
| 3 | u64 | `alliance_gift_id` | 军团 |
| 4 | u32 | `rc_type` | 类型枚举 |
| 5 | string | `from` | — |
| 6 | string | `rc_image` | — |
| 7 | string | `description` | 描述文案 |
| 8 | u8 | `status` | 结果状态 |
| 9 | u64 | `remain_time` | 剩余毫秒数 |
| 10 | u32 | `rc_type` | 类型枚举 |
| 11 | string | `rc_image` | — |
| 12 | string | `rc_name` | 名称 |
| 13 | u32 | `rc_amount` | 数量 |
| 14 | u32 | `channel_type` | 渠道名 |
| 15 | u8 | `earlier_load_mode` | — |
| 16 | u8 | `chat_type` | 消息类型 |
| 17 | u32 | `chat_channel` | 渠道名 |
| 18 | u64 | `chat_id` | 聊天消息 ID |
| 19 | u32 | `sender_player_type` | 类型枚举 |
| 20 | u64 | `player_id` | 玩家 ID |
| 21 | string | `nickname` | 玩家昵称 |
| 22 | u64 | `fame` | 声望值 |
| 23 | u8 | `rank` | 军衔等级 |
| 24 | u8 | `position` | 格位编号 |
| 25 | string | `player_title` | — |
| 26 | string | `alliance_title` | 军团 |
| 27 | u64 | `receiver_player_id` | 玩家 ID |
| 28 | string | `receiver_nickname` | 玩家昵称 |
| 29 | u32 | `avatar` | — |
| 30 | string | `alliance_name` | 军团名称 |
| 31 | u64 | `chat_time` | 聊天时间戳 |
| 32 | u32 | `chat_channel` | 渠道名 |
| 33 | u64 | `chat_id` | 聊天消息 ID |
| 34 | u32 | `sender_player_type` | 类型枚举 |
| 35 | u64 | `player_id` | 玩家 ID |
| 36 | string | `nickname` | 玩家昵称 |
| 37 | u64 | `fame` | 声望值 |
| 38 | u8 | `rank` | 军衔等级 |
| 39 | u8 | `position` | 格位编号 |
| 40 | string | `player_title` | — |
| 41 | string | `alliance_title` | 军团 |
| 42 | u64 | `receiver_player_id` | 玩家 ID |
| 43 | string | `receiver_nickname` | 玩家昵称 |
| 44 | u32 | `avatar` | — |
| 45 | string | `alliance_name` | 军团名称 |
| 46 | string | `voice_file_path` | — |
| 47 | u64 | `chat_time` | 聊天时间戳 |
| 48 | u32 | `chat_channel` | 渠道名 |
| 49 | u64 | `chat_id` | 聊天消息 ID |
| 50 | u32 | `sender_player_type` | 类型枚举 |
| 51 | u64 | `player_id` | 玩家 ID |
| 52 | string | `nickname` | 玩家昵称 |
| 53 | u64 | `fame` | 声望值 |
| 54 | u8 | `rank` | 军衔等级 |
| 55 | u8 | `position` | 格位编号 |
| 56 | string | `player_title` | — |
| 57 | string | `alliance_title` | 军团 |
| 58 | u64 | `receiver_player_id` | 玩家 ID |
| 59 | string | `receiver_nickname` | 玩家昵称 |
| 60 | u32 | `avatar` | — |
| 61 | string | `alliance_name` | 军团名称 |
| 62 | u64 | `flaund_id` | — |
| 63 | u64 | `chat_time` | 聊天时间戳 |
| 64 | u64 | `chat_id` | 聊天消息 ID |
| 65 | string | `chat_color` | — |
| 66 | u8 | `bold_font` | — |
| 67 | u64 | `chat_time` | 聊天时间戳 |

---

### `cmd=5052` — 领取军团礼包

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `alliance_gift_id` | 军团 |

**响应**（status 为 **1** 或 **2** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `rc_type` | 类型枚举 |
| 2 | string | `rc_image` | — |
| 3 | string | `rc_name` | 名称 |
| 4 | u32 | `rc_amount` | 数量 |
| 5 | u32 | `channel_type` | 渠道名 |
| 6 | u8 | `earlier_load_mode` | — |
| 7 | u8 | `chat_type` | 消息类型 |
| 8 | u32 | `chat_channel` | 渠道名 |
| 9 | u64 | `chat_id` | 聊天消息 ID |
| 10 | u32 | `sender_player_type` | 类型枚举 |
| 11 | u64 | `player_id` | 玩家 ID |
| 12 | string | `nickname` | 玩家昵称 |
| 13 | u64 | `fame` | 声望值 |
| 14 | u8 | `rank` | 军衔等级 |
| 15 | u8 | `position` | 格位编号 |
| 16 | string | `player_title` | — |
| 17 | string | `alliance_title` | 军团 |
| 18 | u64 | `receiver_player_id` | 玩家 ID |
| 19 | string | `receiver_nickname` | 玩家昵称 |
| 20 | u32 | `avatar` | — |
| 21 | string | `alliance_name` | 军团名称 |
| 22 | u64 | `chat_time` | 聊天时间戳 |
| 23 | u32 | `chat_channel` | 渠道名 |
| 24 | u64 | `chat_id` | 聊天消息 ID |
| 25 | u32 | `sender_player_type` | 类型枚举 |
| 26 | u64 | `player_id` | 玩家 ID |
| 27 | string | `nickname` | 玩家昵称 |
| 28 | u64 | `fame` | 声望值 |
| 29 | u8 | `rank` | 军衔等级 |
| 30 | u8 | `position` | 格位编号 |
| 31 | string | `player_title` | — |
| 32 | string | `alliance_title` | 军团 |
| 33 | u64 | `receiver_player_id` | 玩家 ID |
| 34 | string | `receiver_nickname` | 玩家昵称 |
| 35 | u32 | `avatar` | — |
| 36 | string | `alliance_name` | 军团名称 |
| 37 | string | `voice_file_path` | — |
| 38 | u64 | `chat_time` | 聊天时间戳 |
| 39 | u32 | `chat_channel` | 渠道名 |
| 40 | u64 | `chat_id` | 聊天消息 ID |
| 41 | u32 | `sender_player_type` | 类型枚举 |
| 42 | u64 | `player_id` | 玩家 ID |
| 43 | string | `nickname` | 玩家昵称 |
| 44 | u64 | `fame` | 声望值 |
| 45 | u8 | `rank` | 军衔等级 |
| 46 | u8 | `position` | 格位编号 |
| 47 | string | `player_title` | — |
| 48 | string | `alliance_title` | 军团 |
| 49 | u64 | `receiver_player_id` | 玩家 ID |
| 50 | string | `receiver_nickname` | 玩家昵称 |
| 51 | u32 | `avatar` | — |
| 52 | string | `alliance_name` | 军团名称 |
| 53 | u64 | `flaund_id` | — |
| 54 | u64 | `chat_time` | 聊天时间戳 |
| 55 | u64 | `chat_id` | 聊天消息 ID |
| 56 | string | `chat_color` | — |
| 57 | u8 | `bold_font` | — |
| 58 | u64 | `chat_time` | 聊天时间戳 |

---

### `cmd=5053` — 删除军团礼包

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `alliance_gift_id` | 军团 |

**响应**（status 为 **1** 或 **2** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `channel_type` | 渠道名 |
| 2 | u8 | `earlier_load_mode` | — |
| 3 | u8 | `chat_type` | 消息类型 |
| 4 | u32 | `chat_channel` | 渠道名 |
| 5 | u64 | `chat_id` | 聊天消息 ID |
| 6 | u32 | `sender_player_type` | 类型枚举 |
| 7 | u64 | `player_id` | 玩家 ID |
| 8 | string | `nickname` | 玩家昵称 |
| 9 | u64 | `fame` | 声望值 |
| 10 | u8 | `rank` | 军衔等级 |
| 11 | u8 | `position` | 格位编号 |
| 12 | string | `player_title` | — |
| 13 | string | `alliance_title` | 军团 |
| 14 | u64 | `receiver_player_id` | 玩家 ID |
| 15 | string | `receiver_nickname` | 玩家昵称 |
| 16 | u32 | `avatar` | — |
| 17 | string | `alliance_name` | 军团名称 |
| 18 | u64 | `chat_time` | 聊天时间戳 |
| 19 | u32 | `chat_channel` | 渠道名 |
| 20 | u64 | `chat_id` | 聊天消息 ID |
| 21 | u32 | `sender_player_type` | 类型枚举 |
| 22 | u64 | `player_id` | 玩家 ID |
| 23 | string | `nickname` | 玩家昵称 |
| 24 | u64 | `fame` | 声望值 |
| 25 | u8 | `rank` | 军衔等级 |
| 26 | u8 | `position` | 格位编号 |
| 27 | string | `player_title` | — |
| 28 | string | `alliance_title` | 军团 |
| 29 | u64 | `receiver_player_id` | 玩家 ID |
| 30 | string | `receiver_nickname` | 玩家昵称 |
| 31 | u32 | `avatar` | — |
| 32 | string | `alliance_name` | 军团名称 |
| 33 | string | `voice_file_path` | — |
| 34 | u64 | `chat_time` | 聊天时间戳 |
| 35 | u32 | `chat_channel` | 渠道名 |
| 36 | u64 | `chat_id` | 聊天消息 ID |
| 37 | u32 | `sender_player_type` | 类型枚举 |
| 38 | u64 | `player_id` | 玩家 ID |
| 39 | string | `nickname` | 玩家昵称 |
| 40 | u64 | `fame` | 声望值 |
| 41 | u8 | `rank` | 军衔等级 |
| 42 | u8 | `position` | 格位编号 |
| 43 | string | `player_title` | — |
| 44 | string | `alliance_title` | 军团 |
| 45 | u64 | `receiver_player_id` | 玩家 ID |
| 46 | string | `receiver_nickname` | 玩家昵称 |
| 47 | u32 | `avatar` | — |
| 48 | string | `alliance_name` | 军团名称 |
| 49 | u64 | `flaund_id` | — |
| 50 | u64 | `chat_time` | 聊天时间戳 |
| 51 | u64 | `chat_id` | 聊天消息 ID |
| 52 | string | `chat_color` | — |
| 53 | u8 | `bold_font` | — |
| 54 | u64 | `chat_time` | 聊天时间戳 |

---

### `cmd=5054` — 清空军团礼包

**请求参数**: 无

**响应**（status 为 **1** 或 **2** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `channel_type` | 渠道名 |
| 2 | u8 | `earlier_load_mode` | — |
| 3 | u8 | `chat_type` | 消息类型 |
| 4 | u32 | `chat_channel` | 渠道名 |
| 5 | u64 | `chat_id` | 聊天消息 ID |
| 6 | u32 | `sender_player_type` | 类型枚举 |
| 7 | u64 | `player_id` | 玩家 ID |
| 8 | string | `nickname` | 玩家昵称 |
| 9 | u64 | `fame` | 声望值 |
| 10 | u8 | `rank` | 军衔等级 |
| 11 | u8 | `position` | 格位编号 |
| 12 | string | `player_title` | — |
| 13 | string | `alliance_title` | 军团 |
| 14 | u64 | `receiver_player_id` | 玩家 ID |
| 15 | string | `receiver_nickname` | 玩家昵称 |
| 16 | u32 | `avatar` | — |
| 17 | string | `alliance_name` | 军团名称 |
| 18 | u64 | `chat_time` | 聊天时间戳 |
| 19 | u32 | `chat_channel` | 渠道名 |
| 20 | u64 | `chat_id` | 聊天消息 ID |
| 21 | u32 | `sender_player_type` | 类型枚举 |
| 22 | u64 | `player_id` | 玩家 ID |
| 23 | string | `nickname` | 玩家昵称 |
| 24 | u64 | `fame` | 声望值 |
| 25 | u8 | `rank` | 军衔等级 |
| 26 | u8 | `position` | 格位编号 |
| 27 | string | `player_title` | — |
| 28 | string | `alliance_title` | 军团 |
| 29 | u64 | `receiver_player_id` | 玩家 ID |
| 30 | string | `receiver_nickname` | 玩家昵称 |
| 31 | u32 | `avatar` | — |
| 32 | string | `alliance_name` | 军团名称 |
| 33 | string | `voice_file_path` | — |
| 34 | u64 | `chat_time` | 聊天时间戳 |
| 35 | u32 | `chat_channel` | 渠道名 |
| 36 | u64 | `chat_id` | 聊天消息 ID |
| 37 | u32 | `sender_player_type` | 类型枚举 |
| 38 | u64 | `player_id` | 玩家 ID |
| 39 | string | `nickname` | 玩家昵称 |
| 40 | u64 | `fame` | 声望值 |
| 41 | u8 | `rank` | 军衔等级 |
| 42 | u8 | `position` | 格位编号 |
| 43 | string | `player_title` | — |
| 44 | string | `alliance_title` | 军团 |
| 45 | u64 | `receiver_player_id` | 玩家 ID |
| 46 | string | `receiver_nickname` | 玩家昵称 |
| 47 | u32 | `avatar` | — |
| 48 | string | `alliance_name` | 军团名称 |
| 49 | u64 | `flaund_id` | — |
| 50 | u64 | `chat_time` | 聊天时间戳 |
| 51 | u64 | `chat_id` | 聊天消息 ID |
| 52 | string | `chat_color` | — |
| 53 | u8 | `bold_font` | — |
| 54 | u64 | `chat_time` | 聊天时间戳 |

---

### `cmd=5055` — 军团战配置

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `type` | 类型枚举 |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `to_ranking` | 名次 |
| 2 | string | `name` | 名称 |
| 3 | string | `description` | 描述文案 |
| 4 | u32 | `icon` | 图标编号 |
| 5 | u32 | `amount` | 数量 |
| 6 | u8 | `leader_special` | — |
| 7 | string | `name` | 名称 |
| 8 | string | `description` | 描述文案 |
| 9 | u32 | `icon` | 图标编号 |
| 10 | u32 | `amount` | 数量 |
| 11 | u8 | `to_ranking` | 名次 |
| 12 | string | `name` | 名称 |
| 13 | string | `description` | 描述文案 |
| 14 | u32 | `icon` | 图标编号 |
| 15 | u32 | `amount` | 数量 |
| 16 | u32 | `section_id` | — |
| 17 | string | `section_name` | 名称 |
| 18 | string | `name` | 名称 |
| 19 | string | `description` | 描述文案 |
| 20 | u32 | `icon` | 图标编号 |
| 21 | u32 | `amount` | 数量 |
| 22 | u32 | `progress_value` | — |
| 23 | u32 | `progress_target` | — |
| 24 | u8 | `collect_status` | 结果状态 |
| 25 | string | `rule_description` | 描述文案 |

---

### `cmd=5056` — 领取军团战个人积分奖励

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `section_id` | — |

**响应**（status 为 **1** 或 **2** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `channel_type` | 渠道名 |
| 2 | u8 | `earlier_load_mode` | — |
| 3 | u8 | `chat_type` | 消息类型 |
| 4 | u32 | `chat_channel` | 渠道名 |
| 5 | u64 | `chat_id` | 聊天消息 ID |
| 6 | u32 | `sender_player_type` | 类型枚举 |
| 7 | u64 | `player_id` | 玩家 ID |
| 8 | string | `nickname` | 玩家昵称 |
| 9 | u64 | `fame` | 声望值 |
| 10 | u8 | `rank` | 军衔等级 |
| 11 | u8 | `position` | 格位编号 |
| 12 | string | `player_title` | — |
| 13 | string | `alliance_title` | 军团 |
| 14 | u64 | `receiver_player_id` | 玩家 ID |
| 15 | string | `receiver_nickname` | 玩家昵称 |
| 16 | u32 | `avatar` | — |
| 17 | string | `alliance_name` | 军团名称 |
| 18 | u64 | `chat_time` | 聊天时间戳 |
| 19 | u32 | `chat_channel` | 渠道名 |
| 20 | u64 | `chat_id` | 聊天消息 ID |
| 21 | u32 | `sender_player_type` | 类型枚举 |
| 22 | u64 | `player_id` | 玩家 ID |
| 23 | string | `nickname` | 玩家昵称 |
| 24 | u64 | `fame` | 声望值 |
| 25 | u8 | `rank` | 军衔等级 |
| 26 | u8 | `position` | 格位编号 |
| 27 | string | `player_title` | — |
| 28 | string | `alliance_title` | 军团 |
| 29 | u64 | `receiver_player_id` | 玩家 ID |
| 30 | string | `receiver_nickname` | 玩家昵称 |
| 31 | u32 | `avatar` | — |
| 32 | string | `alliance_name` | 军团名称 |
| 33 | string | `voice_file_path` | — |
| 34 | u64 | `chat_time` | 聊天时间戳 |
| 35 | u32 | `chat_channel` | 渠道名 |
| 36 | u64 | `chat_id` | 聊天消息 ID |
| 37 | u32 | `sender_player_type` | 类型枚举 |
| 38 | u64 | `player_id` | 玩家 ID |
| 39 | string | `nickname` | 玩家昵称 |
| 40 | u64 | `fame` | 声望值 |
| 41 | u8 | `rank` | 军衔等级 |
| 42 | u8 | `position` | 格位编号 |
| 43 | string | `player_title` | — |
| 44 | string | `alliance_title` | 军团 |
| 45 | u64 | `receiver_player_id` | 玩家 ID |
| 46 | string | `receiver_nickname` | 玩家昵称 |
| 47 | u32 | `avatar` | — |
| 48 | string | `alliance_name` | 军团名称 |
| 49 | u64 | `flaund_id` | — |
| 50 | u64 | `chat_time` | 聊天时间戳 |
| 51 | u64 | `chat_id` | 聊天消息 ID |
| 52 | string | `chat_color` | — |
| 53 | u8 | `bold_font` | — |
| 54 | u64 | `chat_time` | 聊天时间戳 |

---

### `cmd=5057` — 查询军团道具

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `show_type` | 类型枚举 |
| 2 | u32 | `item_id` | 道具 ID |
| 3 | string | `name` | 名称 |
| 4 | string | `description` | 描述文案 |
| 5 | u32 | `icon` | 图标编号 |
| 6 | u32 | `amount` | 数量 |

---

### `cmd=5058` — 分配道具

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `player_id` | 玩家 ID |
| 2 | u32 | `items.length` | — |
| 3 | 循环 | — | 按前导计数字段循环写入后续字段 |
| 4 | u32 | `i.item_id` | — |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=5059` — 军团随机起名

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `random_id` | — |
| 2 | string | `random_name` | 名称 |
| 3 | u64 | `expire_time` | 时间戳（毫秒） |

---

### `cmd=5060` — 添加军团标记

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `tile_x` | 地图 X 坐标 |
| 2 | u32 | `tile_y` | 地图 Y 坐标 |
| 3 | string | `title` | — |
| 4 | string | `icon` | 图标编号 |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `army_id` | 兵种 ID |
| 2 | u32 | `amount` | 数量 |

---

### `cmd=5061` — 删除军团标记

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `tile_x` | 地图 X 坐标 |
| 2 | u32 | `tile_y` | 地图 Y 坐标 |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `army_id` | 兵种 ID |
| 2 | u32 | `amount` | 数量 |

---

### `cmd=5062` — 查询军团地图标记

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `count` | 数量/计数 |
| 2 | u32 | `x` | 地图 X 坐标 |
| 3 | u32 | `y` | 地图 Y 坐标 |
| 4 | string | `text` | — |
| 5 | string | `icon` | 图标编号 |
| 6 | u64 | `time` | 时间戳（毫秒） |
