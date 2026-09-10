# 选服与基础服务

> 14 个命令（cmd 1 ~ 30）。所有响应均以 1 字节 status 打头，成功值见各条目。

> `cmd=1`、`2`、`5`、`25`、`26`、`27`、`30` 是**选服（choice）服务器**命令，使用明文 WIST payload；本文件其余条目是**游戏服基础服务**命令，使用加密 WiST 帧。两套命名空间都有 cmd=1：选服=选服登录，游戏服=获取服务器时间。

**服务器部署按平台隔离**：

| 平台 | 选服地址 | 协议形态 |
|---|---|---|
| iOS | `w2vcn_G.ios.wistone.com:8081` | 裸 TCP，明文 WIST 帧 |
| Android | `w2v-g-add-choice.wistone.com:8087` | WebSocket（8087 端口裸 TCP 不响应） |

服务端校验 platform/channel 与所选服务器匹配：iOS 选服服收到 android 渠道参数返回 `status=-1「没有可用的服务器！」`；跨服连地址则静默丢弃。客户端的地址来自内置 + 渠道配置（loginData 的 `choice_hosts`）覆盖。

### `cmd=1` — 选服登录（客户端用它换 userId + 游戏服地址）

**请求参数**（按序拼接为明文 payload）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `username` | 账号名 |
| 2 | string | `platform` | — |
| 3 | string | `channel` | 渠道名 |
| 4 | string | `language` | 语言代码 |
| 5 | u8 | `is_self` | 布尔标记（0/1） |
| 6 | u32 | `server_id` | 服务器编号 |
| 7 | string | `device_info` | — |
| 8 | u32 | `client_tag` | — |
| 9 | string | `client_version` | 客户端版本号 |
| 10 | u8 | `confirm_to_abort_abandon` | 确认放弃标记（0/1） |

**响应**（status 为 **1** 或 **2** 时成功；**3**=需二次确认，仅含 confirm_message；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `userid` | 账号在该服的游戏 userId |
| 2 | u32 | `server_id` | 服务器编号 |
| 3 | string | `server_name` | 服务器名称 |
| 4 | string | `server_host` | 游戏服地址（ip:port） |
| 5 | u32 | `server_sort` | 服务器排序值 |
| 6 | u8 | `game_entry_flag` | 条件字段标志，值为 1 时读取下一项 |
| 7 | string | `game_entry` | 仅 `game_entry_flag=1` 时存在 |
| 8 | string | `init_channel` | 渠道名回显 |
| 9 | u64 | `timevalue` | 服务器当前毫秒时间戳 |
| 10 | u64 | `timeoffset` | 客户端-服务器毫秒时差 |

> `game_entry_flag` 仅在 `CLIENT_TAG>=3` 时由客户端读取。

---

### `cmd=2` — 获取服务器列表

**请求参数**（按序拼接为明文 payload）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `username` | 账号名 |
| 2 | string | `platform` | — |
| 3 | string | `channel` | 渠道名 |
| 4 | string | `language` | 语言代码 |
| 5 | string | `device_info` | — |
| 6 | u32 | `constant.client_tag` | — |
| 7 | string | `client_version` | 客户端版本号 |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 先读 `u32 count`，再循环读取下列条目；`game_entry_flag` 仅在 `CLIENT_TAG>=3` 时存在，值为 1 才后接 `game_entry`。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `server_id` | 服务器编号 |
| 2 | string | `server_name` | 服务器名称 |
| 3 | string | `server_host` | 游戏服地址（ip:port） |
| 4 | u32 | `pri` | 排序/优先级 |
| 5 | u8 | `game_entry_flag` | 条件字段标志 |
| 6 | string | `game_entry` | 仅 `game_entry_flag=1` 时存在 |

---

### `cmd=5` — 检查客户端更新

**请求参数**（按序拼接为明文 payload）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `username` | 账号名 |
| 2 | string | `platform` | — |
| 3 | string | `channel` | 渠道名 |
| 4 | string | `language` | 语言代码 |
| 5 | string | `client_version` | 客户端版本号 |
| 6 | string | `device_info` | — |
| 7 | string | `shield_version_string` | — |
| 8 | u32 | `shield_version_code` | — |

**响应**（status 为 **1** 或 **2** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `update_mode` | — |
| 2 | string | `latest_version` | — |
| 3 | string | `update_description` | 描述文案 |
| 4 | string | `update_url` | — |
| 5 | u64 | `server_time` | 时间戳（毫秒） |
| 6 | u64 | `time_zone_offset_to_utc` | 时间戳（毫秒） |
| 7 | u32 | `task_id` | 任务 ID |
| 8 | string | `task_name` | 任务名称 |
| 9 | u8 | `completed` | 是否已完成 |
| 10 | u8 | `identity` | — |
| 11 | u64 | `push_threshold` | — |
| 12 | u8 | `age` | — |
| 13 | u64 | `online_time` | 时间戳（毫秒） |
| 14 | string | `real_name` | 名称 |

---

### `cmd=6` — 获取服务器配置

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `resource_host` | — |
| 2 | u32 | `trade_down_price` | 单价 |
| 3 | u32 | `trade_up_price` | 单价 |
| 4 | u32 | `campaign_switch` | — |
| 5 | u32 | `vip_switch` | — |
| 6 | u32 | `redeem_switch` | — |
| 7 | u32 | `restrict_shop_switch` | — |
| 8 | u32 | `activity_switch` | — |
| 9 | u32 | `hide_3_diamond_spend_switch` | — |
| 10 | u32 | `officer_troop_switch` | — |
| 11 | string | `error_report_host` | — |
| 12 | string | `server_version` | — |
| 13 | u32 | `map_type` | 类型枚举 |
| 14 | string | `error_report_host_ios` | — |
| 15 | string | `server_key` | — |
| 16 | u32 | `gm_button_switch` | — |
| 17 | u32 | `contact_button_switch` | — |
| 18 | u8 | `alliance_war_switch` | 军团 |
| 19 | u8 | `report_insurance_switch` | — |
| 20 | u8 | `low_fame_attack_costal_switch` | 声望值 |
| 21 | u8 | `minimized_dispatch_in_percent` | — |
| 22 | u8 | `user_input_limit_full_switch` | — |
| 23 | u8 | `user_input_limit_level_1_switch` | 等级 |
| 24 | u8 | `user_input_limit_level_2_switch` | 等级 |
| 25 | u8 | `user_input_limit_level_3_switch` | 等级 |
| 26 | u8 | `user_input_limit_level_4_switch` | 等级 |
| 27 | u8 | `sandbox_server_switch` | — |
| 28 | u32 | `item_id` | 道具 ID |
| 29 | string | `name` | 名称 |
| 30 | string | `description` | 描述文案 |
| 31 | u32 | `icon` | 图标编号 |
| 32 | u32 | `amount` | 数量 |
| 33 | u64 | `fame_to_unlock_mettle_level_1` | 等级 |
| 34 | u64 | `fame_to_unlock_mettle_level_2` | 等级 |
| 35 | u64 | `fame_to_unlock_mettle_level_3` | 等级 |
| 36 | u8 | `medal_transform_type_1` | 类型枚举 |
| 37 | u32 | `medal_transform_item_id_1` | 道具 ID |
| 38 | string | `medal_transform_item_name_1` | 道具名称 |
| 39 | u8 | `medal_transform_type_2` | 类型枚举 |
| 40 | u32 | `medal_transform_item_id_2` | 道具 ID |
| 41 | string | `medal_transform_item_name_2` | 道具名称 |
| 42 | u8 | `medal_transform_type_3` | 类型枚举 |
| 43 | u32 | `medal_transform_item_id_3` | 道具 ID |
| 44 | string | `medal_transform_item_name_3` | 道具名称 |
| 45 | u8 | `user_input_limit_level_5_switch` | 等级 |
| 46 | u64 | `charge_bonus_flash_start_time` | 开始时间戳 |
| 47 | u64 | `charge_bonus_flash_end_time` | 结束时间戳 |
| 48 | u32 | `account_abandon_reserved_in_days` | — |
| 49 | u32 | `item_id` | 道具 ID |
| 50 | u32 | `icon` | 图标编号 |
| 51 | u32 | `max_talent_add_by_cimelia` | 上限 |
| 52 | u8 | `disable_auto_train` | — |
| 53 | string | `auto_train_instruction` | — |
| 54 | u32 | `item_id` | 道具 ID |
| 55 | u32 | `icon` | 图标编号 |
| 56 | string | `name` | 名称 |
| 57 | string | `description` | 描述文案 |
| 58 | u32 | `amount` | 数量 |
| 59 | u32 | `item_id` | 道具 ID |
| 60 | u32 | `icon` | 图标编号 |
| 61 | string | `name` | 名称 |
| 62 | string | `description` | 描述文案 |
| 63 | u32 | `amount` | 数量 |
| 64 | u32 | `protocol_version` | — |

---

### `cmd=7` — 获取充值商品（旧）

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `pay_channel_ids.length` | 渠道名 |
| 2 | 循环 | — | 按前导计数字段循环写入后续字段 |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `announcement` | — |
| 2 | u32 | `charge_id` | — |
| 3 | string | `skuid` | — |
| 4 | string | `function_id` | — |
| 5 | u32 | `output_diamonds` | 产量 |
| 6 | string | `name` | 名称 |
| 7 | string | `price` | 单价 |
| 8 | u32 | `icon` | 图标编号 |
| 9 | string | `description` | 描述文案 |
| 10 | string | `name` | 名称 |
| 11 | u32 | `amount` | 数量 |
| 12 | u32 | `icon` | 图标编号 |
| 13 | u64 | `extra_item_finish_time` | 完成时间戳 |
| 14 | u8 | `has_alliance_gift` | 军团 |
| 15 | string | `gift_name` | 名称 |
| 16 | u32 | `gift_icon` | 图标编号 |

---

### `cmd=11` — 获取充值商品

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `pay_channel_ids.length` | 渠道名 |
| 2 | 循环 | — | 按前导计数字段循环写入后续字段 |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `announcement` | — |
| 2 | u32 | `charge_id` | — |
| 3 | string | `skuid` | — |
| 4 | string | `function_id` | — |
| 5 | u32 | `output_diamonds` | 产量 |
| 6 | string | `name` | 名称 |
| 7 | string | `price` | 单价 |
| 8 | u32 | `icon` | 图标编号 |
| 9 | string | `description` | 描述文案 |
| 10 | string | `name` | 名称 |
| 11 | u32 | `amount` | 数量 |
| 12 | u32 | `icon` | 图标编号 |
| 13 | u64 | `extra_item_finish_time` | 完成时间戳 |
| 14 | u8 | `has_alliance_gift` | 军团 |
| 15 | string | `gift_name` | 名称 |
| 16 | u32 | `gift_icon` | 图标编号 |

---

### `cmd=12` — 注册推送 Token

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `token` | 推送/会话凭据 |
| 2 | u8 | `device_type` | 类型枚举 |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=13` — 设置推送阈值

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `army_count` | 数量/计数 |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=20` — 获取快捷用语

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `prepared_message_group_id` | — |
| 2 | string | `title` | — |
| 3 | u32 | `priority_chat_public` | — |
| 4 | u32 | `priority_chat_alliance` | 军团 |
| 5 | u32 | `priority_chat_private` | — |
| 6 | u32 | `priority_alliance_message` | 军团 |
| 7 | u32 | `priority_battle` | — |
| 8 | u64 | `prepared_message_id` | — |
| 9 | u32 | `prepared_message_group_id` | — |
| 10 | string | `message` | — |
| 11 | u32 | `priority` | — |

---

### `cmd=21` — 获取道具配置

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `item_ids.length` | 道具 |
| 2 | 循环 | — | 按前导计数字段循环写入后续字段 |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `item_id` | 道具 ID |
| 2 | string | `name` | 名称 |
| 3 | string | `description` | 描述文案 |
| 4 | u32 | `icon` | 图标编号 |

---

### `cmd=25` — 获取渠道 UID

**请求参数**（按序拼接为明文 payload）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `sid` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `uid` | — |
| 2 | string | `creator` | — |

---

### `cmd=26` — 华为海外登录验证

**请求参数**（按序拼接为明文 payload）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `player_id` | 玩家 ID |
| 2 | u32 | `level` | 等级 |
| 3 | string | `sign` | — |
| 4 | string | `ts` | — |

**响应**（由该协议类仅定义为空 `decode()`，业务字段待抓包确认）: 无业务数据。

---

### `cmd=27` — 华为国内登录验证

**请求参数**（按序拼接为明文 payload）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `player_id` | 玩家 ID |
| 2 | u32 | `level` | 等级 |
| 3 | string | `sign` | — |
| 4 | string | `ts` | — |

**响应**（由该协议类仅定义为空 `decode()`，业务字段待抓包确认）: 无业务数据。

---

### `cmd=30` — 果盘登录验证

**请求参数**（按序拼接为明文 payload）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `game_uin` | — |
| 2 | string | `token` | 推送/会话凭据 |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。
