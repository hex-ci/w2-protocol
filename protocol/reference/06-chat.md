# 聊天

> 16 个命令（cmd 6001 ~ 6016）。所有响应均以 1 字节 status 打头，成功值见各条目。

### `cmd=6001` — 获取聊天配置

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `welcome_message` | — |
| 2 | string | `record_upload_url` | — |
| 3 | string | `record_download_url` | — |

---

### `cmd=6002` — 按名称查玩家 ID

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `nickname` | 玩家昵称 |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `player_id` | 玩家 ID |

---

### `cmd=6003` — 收到普通聊天

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `status` | 结果状态 |
| 2 | u32 | `chat_channel` | 渠道名 |
| 3 | u64 | `chat_id` | 聊天消息 ID |
| 4 | u32 | `sender_player_type` | 类型枚举 |
| 5 | u64 | `player_id` | 玩家 ID |
| 6 | string | `nickname` | 玩家昵称 |
| 7 | u64 | `fame` | 声望值 |
| 8 | u8 | `rank` | 军衔等级 |
| 9 | u8 | `position` | 格位编号 |
| 10 | string | `player_title` | — |
| 11 | string | `alliance_title` | 军团 |
| 12 | u64 | `receiver_player_id` | 玩家 ID |
| 13 | string | `receiver_nickname` | 玩家昵称 |
| 14 | u32 | `avatar` | — |
| 15 | string | `alliance_name` | 军团名称 |
| 16 | u64 | `chat_time` | 聊天时间戳 |

---

### `cmd=6004` — 收到系统聊天

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `status` | 结果状态 |
| 2 | u32 | `chat_channel` | 渠道名 |
| 3 | u64 | `chat_id` | 聊天消息 ID |
| 4 | string | `chat_color` | — |
| 5 | u8 | `bold_font` | — |
| 6 | u64 | `chat_time` | 聊天时间戳 |

---

### `cmd=6005` — 发送世界频道消息

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `message` | — |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=6006` — 发送军团频道消息

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `message` | — |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=6007` — 发送私聊消息

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `player_id` | 玩家 ID |
| 2 | string | `message` | — |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=6008` — 发送世界频道语音

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `voice_file_path` | — |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=6009` — 发送私聊语音

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `player_id` | 玩家 ID |
| 2 | string | `voice_file_path` | — |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=6010` — 发送军团频道语音

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `voice_file_path` | — |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=6011` — 收到语音聊天

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `status` | 结果状态 |
| 2 | u32 | `chat_channel` | 渠道名 |
| 3 | u64 | `chat_id` | 聊天消息 ID |
| 4 | u32 | `sender_player_type` | 类型枚举 |
| 5 | u64 | `player_id` | 玩家 ID |
| 6 | string | `nickname` | 玩家昵称 |
| 7 | u64 | `fame` | 声望值 |
| 8 | u8 | `rank` | 军衔等级 |
| 9 | u8 | `position` | 格位编号 |
| 10 | string | `player_title` | — |
| 11 | string | `alliance_title` | 军团 |
| 12 | u64 | `receiver_player_id` | 玩家 ID |
| 13 | string | `receiver_nickname` | 玩家昵称 |
| 14 | u32 | `avatar` | — |
| 15 | string | `alliance_name` | 军团名称 |
| 16 | string | `voice_file_path` | — |
| 17 | u64 | `chat_time` | 聊天时间戳 |

---

### `cmd=6012` — 发送世界频道抓捕

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `flaund_id` | — |
| 2 | string | `message` | — |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=6013` — 发送军团频道抓捕

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `flaund_id` | — |
| 2 | string | `message` | — |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=6014` — 发送私聊抓捕

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `player_id` | 玩家 ID |
| 2 | string | `message` | — |
| 3 | u64 | `flaund_id` | — |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=6015` — 收到抓捕聊天

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `status` | 结果状态 |
| 2 | u32 | `chat_channel` | 渠道名 |
| 3 | u64 | `chat_id` | 聊天消息 ID |
| 4 | u32 | `sender_player_type` | 类型枚举 |
| 5 | u64 | `player_id` | 玩家 ID |
| 6 | string | `nickname` | 玩家昵称 |
| 7 | u64 | `fame` | 声望值 |
| 8 | u8 | `rank` | 军衔等级 |
| 9 | u8 | `position` | 格位编号 |
| 10 | string | `player_title` | — |
| 11 | string | `alliance_title` | 军团 |
| 12 | u64 | `receiver_player_id` | 玩家 ID |
| 13 | string | `receiver_nickname` | 玩家昵称 |
| 14 | u32 | `avatar` | — |
| 15 | string | `alliance_name` | 军团名称 |
| 16 | u64 | `flaund_id` | — |
| 17 | u64 | `chat_time` | 聊天时间戳 |

---

### `cmd=6016` — 拉取聊天记录

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `channel_type` | 渠道名 |
| 2 | u64 | `from_chat_id` | 聊天消息 ID |
| 3 | u8 | `earlier_load_mode` | — |
| 4 | u32 | `load_message_count` | 数量/计数 |

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
