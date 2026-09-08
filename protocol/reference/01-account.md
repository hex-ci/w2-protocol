# 账号与玩家

> 34 个命令（cmd 1001 ~ 1050）。所有响应均以 1 字节 status 打头，成功值见各条目。

### `cmd=1001` — 账号登录

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `user_id` | 账号 ID |
| 2 | string | `username` | 账号名 |
| 3 | u32 | `client_ver` | 客户端版本整数 |
| 4 | string | `platform` | — |
| 5 | string | `channel` | 渠道名 |
| 6 | string | `language` | 语言代码 |
| 7 | string | `app_key` | 客户端应用密钥 |
| 8 | string | `wst` | — |
| 9 | string | `install_id` | 设备安装 ID |
| 10 | u8 | `stop_login_if_online` | — |

**响应**（status 为 **1** 或 **2** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `identity` | — |
| 2 | u64 | `push_threshold` | — |
| 3 | u8 | `age` | — |
| 4 | u64 | `online_time` | 时间戳（毫秒） |
| 5 | string | `real_name` | 名称 |

---

### `cmd=1003` — 被顶下线通知

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `status` | 结果状态 |
| 2 | string | `error_message` | 错误描述 |
| 3 | string | `message` | — |

---

### `cmd=1004` — 续登

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `user_id` | 账号 ID |
| 2 | string | `username` | 账号名 |
| 3 | u32 | `client_ver` | 客户端版本整数 |
| 4 | string | `platform` | — |
| 5 | string | `channel` | 渠道名 |
| 6 | string | `language` | 语言代码 |
| 7 | string | `app_key` | 客户端应用密钥 |
| 8 | string | `init_channel` | 渠道名 |
| 9 | string | `install_id` | 设备安装 ID |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `age` | — |
| 2 | u64 | `online_time` | 时间戳（毫秒） |
| 3 | string | `real_name` | 名称 |

---

### `cmd=1005` — 查询玩家核心信息

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `game_status` | 结果状态 |
| 2 | u32 | `diamond_owned` | 当前钻石数 |
| 3 | u64 | `active_city_id` | 当前主城 ID |
| 4 | u32 | `total_city_count` | 城池数量 |
| 5 | u32 | `total_population_count` | 人口数 |
| 6 | u32 | `total_officer_count` | 数量/计数 |
| 7 | u32 | `newbie_protect` | — |
| 8 | string | `city_img` | 城池外观标识 |
| 9 | u32 | `nuclear_count` | 数量/计数 |
| 10 | u32 | `helped_count` | 数量/计数 |
| 11 | u32 | `max_help_count` | 数量/计数 |
| 12 | u32 | `res_building_count` | 数量/计数 |
| 13 | u32 | `vip` | — |
| 14 | u64 | `diamond_charged` | 累计充值钻石 |

---

### `cmd=1006` — 玩家改名

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `new_name` | 名称 |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `new_name` | 名称 |

---

### `cmd=1007` — 激活停战

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `item_id` | 道具 ID |
| 2 | u32 | `hours` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `time_string` | 时间戳（毫秒） |

---

### `cmd=1008` — 创建抓捕

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `flaund_type` | 类型枚举 |
| 2 | u64 | `target_id` | — |
| 3 | string | `target_name` | 名称 |
| 4 | u32 | `target_level` | 等级 |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `flaunt_id` | — |
| 2 | string | `target_name` | 名称 |
| 3 | u8 | `flaund_type` | 类型枚举 |
| 4 | u32 | `target_level` | 等级 |
| 5 | string | `battle_field_name` | 名称 |
| 6 | u32 | `battle_field_x` | 地图 X 坐标 |
| 7 | u32 | `battle_field_y` | 地图 Y 坐标 |

---

### `cmd=1009` — 查询抓捕详情

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `flaund_id` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `flaund_type` | 类型枚举 |
| 2 | string | `name` | 名称 |
| 3 | string | `description` | 描述文案 |
| 4 | u32 | `icon` | 图标编号 |
| 5 | u8 | `level` | 等级 |
| 6 | string | `name` | 名称 |
| 7 | u32 | `icon` | 图标编号 |
| 8 | u32 | `position` | 格位编号 |
| 9 | u8 | `level` | 等级 |
| 10 | u32 | `level_required_on_wear` | 等级 |
| 11 | u32 | `military` | — |
| 12 | u32 | `knowledge` | — |
| 13 | u32 | `logistics` | — |
| 14 | u32 | `attack` | — |
| 15 | u32 | `defence` | — |
| 16 | u32 | `is_bind` | 布尔标记（0/1） |
| 17 | string | `description` | 描述文案 |
| 18 | u8 | `cur_endure` | 当前值 |
| 19 | u8 | `max_endure` | 上限 |
| 20 | string | `suit_description` | 描述文案 |
| 21 | u64 | `officer_id` | — |
| 22 | u32 | `prototype_id` | 建筑原型 ID |
| 23 | string | `officer_name` | 名称 |
| 24 | u32 | `icon` | 图标编号 |
| 25 | u32 | `level` | 等级 |
| 26 | u32 | `star` | — |
| 27 | u32 | `experience` | — |
| 28 | u32 | `experience_next_level` | 等级 |
| 29 | u32 | `logistics_base` | — |
| 30 | u32 | `military_base` | — |
| 31 | u32 | `knowledge_base` | — |
| 32 | u32 | `faithful` | — |
| 33 | u32 | `salary` | — |
| 34 | u32 | `potential` | — |
| 35 | u32 | `attack` | — |
| 36 | u32 | `defence` | — |
| 37 | u32 | `leader_ship` | — |
| 38 | u32 | `skill_id` | — |
| 39 | string | `icon` | 图标编号 |
| 40 | string | `skill_name` | 名称 |
| 41 | u32 | `skill_level` | 等级 |
| 42 | string | `skill_description` | 描述文案 |
| 43 | u64 | `equipment_id` | — |
| 44 | string | `name` | 名称 |
| 45 | u32 | `icon` | 图标编号 |
| 46 | u32 | `position` | 格位编号 |
| 47 | u8 | `level` | 等级 |
| 48 | u32 | `level_required_on_wear` | 等级 |
| 49 | u32 | `military` | — |
| 50 | u32 | `knowledge` | — |
| 51 | u32 | `logistics` | — |
| 52 | u32 | `attack` | — |
| 53 | u32 | `defence` | — |
| 54 | u32 | `is_bind` | 布尔标记（0/1） |
| 55 | string | `description` | 描述文案 |
| 56 | u8 | `cur_endure` | 当前值 |
| 57 | u8 | `max_endure` | 上限 |
| 58 | u32 | `gold_required_on_repair` | — |
| 59 | u32 | `promotion_item_count` | 数量/计数 |
| 60 | u16 | `logistics_add` | — |
| 61 | u16 | `military_add` | — |
| 62 | u16 | `knowledge_add` | — |
| 63 | u16 | `attack_add` | — |
| 64 | u16 | `defence_add` | — |
| 65 | u16 | `leader_ship_add` | — |
| 66 | u8 | `is_officer_troop` | 布尔标记（0/1） |
| 67 | u8 | `is_sackable` | 布尔标记（0/1） |
| 68 | u64 | `report_id` | — |
| 69 | string | `url` | — |

---

### `cmd=1012` — 设置仇人

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `player_id` | 玩家 ID |
| 2 | u8 | `truce_tag` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `truce_tag` | — |
| 2 | string | `tip_msg` | — |

---

### `cmd=1013` — 更改称号

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `designation` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `designation` | — |

---

### `cmd=1014` — 获取头像列表

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `prototype_id` | 建筑原型 ID |
| 2 | u32 | `avatar` | — |
| 3 | string | `avatar_name` | 名称 |
| 4 | u32 | `item_id` | 道具 ID |
| 5 | string | `name` | 名称 |
| 6 | u8 | `donot_consume_cimelia` | — |

---

### `cmd=1015` — 查询玩家状态列表

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `status_id` | 结果状态 |
| 2 | string | `status_name` | 结果状态 |
| 3 | u64 | `expire_time` | 时间戳（毫秒） |

---

### `cmd=1016` — 更换头像

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `prototype_id` | 建筑原型 ID |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `avatar` | — |

---

### `cmd=1017` — 查询玩家完整详情

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `player_id` | 玩家 ID |
| 2 | string | `nickname` | 玩家昵称 |
| 3 | u32 | `racial` | — |
| 4 | u32 | `gender` | — |
| 5 | u32 | `avatar` | — |
| 6 | u32 | `district` | — |
| 7 | string | `designation` | — |
| 8 | u64 | `fame` | 声望值 |
| 9 | u64 | `personal_score` | 积分 |
| 10 | u32 | `rank` | 军衔等级 |
| 11 | u32 | `position` | 格位编号 |
| 12 | u64 | `alliance_id` | 军团 ID |
| 13 | u32 | `badge_id` | — |
| 14 | string | `alliance_name` | 军团名称 |
| 15 | u32 | `alliance_position` | 格位编号 |
| 16 | string | `alliance_position_name` | 格位编号 |
| 17 | u32 | `battle_result` | — |
| 18 | u8 | `img_status` | 结果状态 |
| 19 | string | `img_id` | — |
| 20 | u32 | `alliance_donation_nulear_count` | 军团 |
| 21 | u64 | `create_time` | 创建时间戳 |
| 22 | string | `fight_promiss` | — |
| 23 | u32 | `motify_name_item_id` | 道具 ID |
| 24 | u32 | `motify_name_icon_id` | 名称 |
| 25 | string | `motify_name_item_name` | 道具名称 |
| 26 | string | `motify_name_item_des` | 道具 |
| 27 | u32 | `motify_name_item_cnt` | 道具 |
| 28 | u32 | `change_player_name_diamond_need` | 玩家名称 |
| 29 | u32 | `motify_flag_item_id` | 道具 ID |
| 30 | u32 | `motify_flag_icon_id` | 图标编号 |
| 31 | string | `motify_flag_item_name` | 道具名称 |
| 32 | string | `motify_flag_item_des` | 道具 |
| 33 | u32 | `motify_flag_item_cnt` | 道具 |
| 34 | u32 | `change_designation_diamond_need` | — |
| 35 | u32 | `vip` | — |
| 36 | u8 | `guest_present_switch` | — |
| 37 | u64 | `influence` | 影响力 |
| 38 | u8 | `cur_country` | 当前值 |

---

### `cmd=1018` — 提交新手引导进度

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `task_step` | — |
| 2 | u8 | `handler_step` | — |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=1020` — 查询黑名单

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `max_count` | 数量/计数 |
| 2 | u64 | `player_id` | 玩家 ID |
| 3 | string | `nickname` | 玩家昵称 |
| 4 | u32 | `avatar` | — |
| 5 | string | `alliance_name` | 军团名称 |
| 6 | u64 | `create_time` | 创建时间戳 |

---

### `cmd=1021` — 加入黑名单

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `player_id` | 玩家 ID |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=1022` — 移出黑名单

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `player_ids.length` | — |
| 2 | 循环 | — | 按前导计数字段循环写入后续字段 |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=1023` — 设置访客展示开关

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `turn` | — |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=1024` — 查询称号列表

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `title_id` | — |
| 2 | string | `title_name` | 名称 |
| 3 | string | `color` | — |
| 4 | u32 | `state` | — |
| 5 | u8 | `time_type` | 类型枚举 |
| 6 | u64 | `expire_time` | 时间戳（毫秒） |
| 7 | u64 | `duration` | — |
| 8 | u8 | `active_state` | — |
| 9 | string | `active_message` | — |
| 10 | string | `bonus_message` | — |
| 11 | u32 | `group_id` | — |
| 12 | u8 | `is_show` | 布尔标记（0/1） |
| 13 | u32 | `military_add` | — |
| 14 | u32 | `logistics_add` | — |
| 15 | u32 | `knowledge_add` | — |
| 16 | u32 | `title_bonus_type` | 类型枚举 |
| 17 | u32 | `title_bonus_sub_type` | 类型枚举 |
| 18 | u8 | `title_bonus_value_type` | 类型枚举 |
| 19 | u32 | `title_bonus_value` | — |

---

### `cmd=1025` — 佩戴/卸下称号

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `title_id` | — |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=1026` — 随机起名

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `random_id` | — |
| 2 | string | `random_name` | 名称 |
| 3 | u64 | `expire_time` | 时间戳（毫秒） |

---

### `cmd=1032` — 玩家状态更新推送

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `status` | 结果状态 |
| 2 | string | `error_message` | 错误描述 |

---

### `cmd=1033` — 在线校验确认

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `show_time` | 时间戳（毫秒） |
| 2 | string | `sign` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `status` | 结果状态 |
| 2 | u64 | `current_time` | 时间戳（毫秒） |
| 3 | u64 | `show_time` | 时间戳（毫秒） |
| 4 | string | `sign` | — |
| 5 | u8 | `type` | 类型枚举 |
| 6 | u32 | `offset_y` | 地图 Y 坐标 |

---

### `cmd=1034` — 在线校验验证码

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `code` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `validate_status` | 结果状态 |

---

### `cmd=1035` — 触发支付可用列表

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `runtime_enviroments.pay_channel_id` | 渠道名 |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `payment_skuid` | — |
| 2 | string | `payment_name` | 名称 |
| 3 | u64 | `payment_show_time` | 时间戳（毫秒） |
| 4 | u64 | `payment_hide_time` | 时间戳（毫秒） |
| 5 | u32 | `charge_item_id` | 道具 ID |
| 6 | u32 | `diamond_amount` | 数量 |
| 7 | string | `charge_price` | 单价 |
| 8 | u32 | `charge_icon` | 图标编号 |
| 9 | u32 | `item_id` | 道具 ID |
| 10 | string | `name` | 名称 |
| 11 | string | `description` | 描述文案 |
| 12 | u32 | `icon` | 图标编号 |
| 13 | u32 | `amount` | 数量 |

---

### `cmd=1036` — 活动支付可用列表

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `runtime_enviroments.pay_channel_id` | 渠道名 |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `payment_activity_id` | — |
| 2 | string | `payment_activity_title` | — |
| 3 | string | `payment_id` | — |
| 4 | string | `payment_skuid` | — |
| 5 | string | `payment_name` | 名称 |
| 6 | u32 | `payment_activity_id` | — |
| 7 | u64 | `payment_hide_time` | 时间戳（毫秒） |
| 8 | u32 | `charge_item_id` | 道具 ID |
| 9 | u32 | `diamond_amount` | 数量 |
| 10 | string | `charge_price` | 单价 |
| 11 | u32 | `charge_icon` | 图标编号 |
| 12 | u32 | `item_id` | 道具 ID |
| 13 | string | `name` | 名称 |
| 14 | string | `description` | 描述文案 |
| 15 | u32 | `icon` | 图标编号 |
| 16 | u32 | `amount` | 数量 |
| 17 | u32 | `buy_times` | — |
| 18 | u32 | `buy_max_times` | — |

---

### `cmd=1037` — 活动支付预下单

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `payment_id` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `pre_order_id` | — |

---

### `cmd=1038` — 确认国家阵营

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `country` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `racial` | — |

---

### `cmd=1040` — 注销账号（iOS）

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

### `cmd=1041` — 称号展示开关

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `title_id` | — |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=1042` — 查询称号分组

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `group_id` | — |
| 2 | string | `group_name` | 名称 |

---

### `cmd=1043` — 同步市民证状态

**请求参数**: 无

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=1050` — 玩家信息

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `update` | — |
| 2 | u64 | `train_officer_id` | — |
| 3 | u8 | `train_mode` | — |
| 4 | u8 | `idle_pop_percent` | — |
| 5 | u8 | `times_add_pop_after_train` | — |
| 6 | string | `city_config` | — |
| 7 | u8 | `auto_train)` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `auto_multiply` | — |
| 2 | u64 | `train_officer_id` | — |
| 3 | string | `train_officer_name` | 名称 |
| 4 | u8 | `train_mode` | — |
| 5 | u8 | `idle_pop_percent` | — |
| 6 | u8 | `times_add_pop_after_train` | — |
| 7 | string | `city_config` | — |
| 8 | u64 | `expire_time` | 时间戳（毫秒） |
| 9 | u8 | `auto_train` | — |
