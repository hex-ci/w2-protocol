# 战斗与演习

> 26 个命令（cmd 20002 ~ 29006）。所有响应均以 1 字节 status 打头，成功值见各条目。

### `cmd=20002` — 查询战报列表

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `page_size` | 每页条数 |
| 2 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 3 | u8 | `filte_by_coordinate` | — |
| 4 | u32 | `tile_y)` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `filte_by_coordinate` | — |
| 2 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 3 | u32 | `page_count` | 总页数 |
| 4 | u64 | `report_id` | — |
| 5 | u8 | `readed` | 是否已读 |
| 6 | u32 | `report_type` | 类型枚举 |
| 7 | string | `report_title` | — |
| 8 | string | `start_place` | — |
| 9 | u32 | `start_x` | 地图 X 坐标 |
| 10 | u32 | `start_y` | 地图 Y 坐标 |
| 11 | string | `target_place` | — |
| 12 | u32 | `target_x` | 地图 X 坐标 |
| 13 | u32 | `target_y` | 地图 Y 坐标 |
| 14 | u64 | `report_time` | 时间戳（毫秒） |
| 15 | string | `url` | — |
| 16 | u32 | `color` | — |
| 17 | u32 | `start_place_type` | 类型枚举 |
| 18 | string | `start_icon` | 图标编号 |
| 19 | u32 | `target_place_type` | 类型枚举 |
| 20 | string | `target_icon` | 图标编号 |

---

### `cmd=20003` — 删除战报

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `report_ids.length` | — |
| 2 | 循环 | — | 按前导计数字段循环写入后续字段 |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=20004` — 查询战报步骤详情

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `report_id` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `html_content` | — |

---

### `cmd=20006` — 按类型查询战报

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 2 | u32 | `page_size` | 每页条数 |
| 3 | u8 | `report_type` | 类型枚举 |
| 4 | u8 | `filte_by_coordinate` | — |
| 5 | u32 | `tile_y)` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `filte_by_coordinate` | — |
| 2 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 3 | u32 | `page_count` | 总页数 |
| 4 | u64 | `report_id` | — |
| 5 | u8 | `readed` | 是否已读 |
| 6 | u32 | `report_type` | 类型枚举 |
| 7 | string | `report_title` | — |
| 8 | string | `start_place` | — |
| 9 | u32 | `start_x` | 地图 X 坐标 |
| 10 | u32 | `start_y` | 地图 Y 坐标 |
| 11 | string | `target_place` | — |
| 12 | u32 | `target_x` | 地图 X 坐标 |
| 13 | u32 | `target_y` | 地图 Y 坐标 |
| 14 | u64 | `report_time` | 时间戳（毫秒） |
| 15 | string | `url` | — |
| 16 | u32 | `color` | — |
| 17 | u32 | `start_place_type` | 类型枚举 |
| 18 | string | `start_icon` | 图标编号 |
| 19 | u32 | `target_place_type` | 类型枚举 |
| 20 | string | `target_icon` | 图标编号 |

---

### `cmd=20011` — 查询战报详情

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `report_id` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `html_content` | — |
| 2 | string | `flaund_message` | — |
| 3 | u8 | `target_role_type` | 类型枚举 |
| 4 | u8 | `has_insurance` | 布尔标记（0/1） |
| 5 | u8 | `has_used_insurance` | 布尔标记（0/1） |
| 6 | u32 | `lost_troop_amount` | 数量 |

---

### `cmd=20012` — 推送：战斗开始通知

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `status` | 结果状态 |
| 2 | u8 | `type` | 类型枚举 |
| 3 | u64 | `battle_id` | — |
| 4 | string | `target_name` | 名称 |
| 5 | u32 | `x` | 地图 X 坐标 |
| 6 | u32 | `y` | 地图 Y 坐标 |
| 7 | u64 | `battle_id` | — |
| 8 | u8 | `battle_type` | 类型枚举 |
| 9 | u8 | `visible_name` | 名称 |
| 10 | string | `target_name` | 名称 |
| 11 | u32 | `x` | 地图 X 坐标 |
| 12 | u32 | `y` | 地图 Y 坐标 |

---

### `cmd=20013` — 查询战斗战报列表

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `per_page_size` | 每页条数 |
| 2 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 2 | u32 | `total_page` | — |
| 3 | u8 | `expedition_type` | 类型枚举 |
| 4 | u64 | `battle_id` | — |
| 5 | u8 | `side` | — |
| 6 | string | `enemy_player_name` | 玩家名称 |
| 7 | u8 | `target_type` | 类型枚举 |
| 8 | string | `target_name` | 名称 |
| 9 | u32 | `target_x` | 地图 X 坐标 |
| 10 | u32 | `target_y` | 地图 Y 坐标 |
| 11 | string | `target_icon` | 图标编号 |
| 12 | u32 | `cur_round` | 当前值 |
| 13 | u64 | `remain_time` | 剩余毫秒数 |

---

### `cmd=20014` — 查询战斗保险详情

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `report_id` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `item_id` | 道具 ID |
| 2 | u32 | `icon` | 图标编号 |
| 3 | string | `name` | 名称 |
| 4 | string | `description` | 描述文案 |
| 5 | u32 | `cur_amount` | 当前数量 |
| 6 | u32 | `effect_value` | — |

---

### `cmd=20015` — 使用战斗保险

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `item_id` | 道具 ID |
| 2 | u64 | `report_id` | — |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=21001` — 获取战斗数据

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `battle_id` | — |
| 2 | u8 | `is_blade_clash_battle` | 布尔标记（0/1） |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `battleground_max_range` | — |
| 2 | u32 | `side` | — |
| 3 | u32 | `battle_type` | 类型枚举 |
| 4 | u32 | `current_round` | — |
| 5 | string | `atk_role_name` | 名称 |
| 6 | u32 | `atk_front_line_position` | 格位编号 |
| 7 | u32 | `atk_racial` | — |
| 8 | string | `def_role_name` | 名称 |
| 9 | u32 | `def_racial` | — |
| 10 | u32 | `def_map_type` | 类型枚举 |
| 11 | u32 | `def_front_line_position` | 格位编号 |
| 12 | u32 | `round_remain_time` | 剩余毫秒数 |
| 13 | u32 | `atk_army_kind_count` | 数量/计数 |
| 14 | u32 | `army_id` | 兵种 ID |
| 15 | u32 | `amount` | 数量 |
| 16 | u32 | `position` | 格位编号 |
| 17 | u32 | `action` | — |
| 18 | u32 | `move_speed` | — |
| 19 | u32 | `range` | — |
| 20 | u32 | `def_army_kind_count` | 数量/计数 |
| 21 | u32 | `army_id` | 兵种 ID |
| 22 | u32 | `amount` | 数量 |
| 23 | u32 | `position` | 格位编号 |
| 24 | u32 | `action` | — |
| 25 | u32 | `move_speed` | — |
| 26 | u32 | `range` | — |
| 27 | u8 | `escaped` | — |

---

### `cmd=21002` — 发送部队行动指令

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `battle_id` | — |
| 2 | u32 | `send_army_id` | 兵种 ID |
| 3 | u32 | `send_action` | — |
| 4 | u32 | `send_army_id` | 兵种 ID |
| 5 | u8 | `is_blade_clash_battle` | 布尔标记（0/1） |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `response_side` | — |
| 2 | u32 | `response_army_id` | 兵种 ID |
| 3 | u32 | `response_action` | — |

---

### `cmd=21003` — 查询撤退消耗

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `battle_id` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `message` | — |

---

### `cmd=21004` — 撤退

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `battle_id` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `message` | — |

---

### `cmd=21005` — 发送战斗快捷消息

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `battle_id` | — |
| 2 | string | `send_msg` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `message` | — |

---

### `cmd=21006` — 创建演习战

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `simb_id` | — |
| 2 | u32 | `level` | 等级 |
| 3 | u8 | `armies.length` | — |
| 4 | 循环 | — | 按前导计数字段循环写入后续字段 |
| 5 | u8 | `i.army_id` | — |
| 6 | u32 | `i.amount)}this._data.write_long(this.officer_id` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `battle_id` | — |

---

### `cmd=21008` — 查询演习战状态

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `simb_id` | — |
| 2 | u64 | `start_time` | 开始时间戳 |
| 3 | u64 | `end_time` | 结束时间戳 |
| 4 | u32 | `level` | 等级 |
| 5 | u32 | `max_level` | 等级 |
| 6 | u32 | `bonus_count_selected` | 数量/计数 |
| 7 | u32 | `bonus_count_available` | 数量/计数 |
| 8 | u32 | `bonus_refresh_free_next_index` | — |
| 9 | u32 | `bonus_refresh_free_max_index` | — |
| 10 | u32 | `bonus_refresh_pay_next_index` | — |
| 11 | string | `bonus_using` | — |
| 12 | u8 | `army_id` | 兵种 ID |
| 13 | string | `bonus` | — |
| 14 | u64 | `battle_id` | — |

---

### `cmd=21009` — 演习战应用加成

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `index` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `bonus_using` | — |
| 2 | u8 | `army_id` | 兵种 ID |
| 3 | string | `bonus` | — |

---

### `cmd=21010` — 演习战刷新加成

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `confirm_diamond_usage` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `army_id` | 兵种 ID |
| 2 | string | `bonus` | — |
| 3 | u32 | `diamond_needed` | — |

---

### `cmd=21011` — 演习战奖励列表

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `simb_id` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `simb_id` | — |
| 2 | u32 | `extra_reward_1_days_before` | — |
| 3 | u32 | `extra_reward_2_days_before` | — |
| 4 | u32 | `level` | 等级 |
| 5 | string | `description` | 描述文案 |
| 6 | u32 | `item_id` | 道具 ID |
| 7 | string | `name` | 名称 |
| 8 | string | `description` | 描述文案 |
| 9 | u32 | `icon` | 图标编号 |
| 10 | u32 | `amount` | 数量 |
| 11 | u32 | `item_id` | 道具 ID |
| 12 | string | `name` | 名称 |
| 13 | string | `description` | 描述文案 |
| 14 | u32 | `icon` | 图标编号 |
| 15 | u32 | `amount` | 数量 |
| 16 | u32 | `item_id` | 道具 ID |
| 17 | string | `name` | 名称 |
| 18 | string | `description` | 描述文案 |
| 19 | u32 | `icon` | 图标编号 |
| 20 | u32 | `amount` | 数量 |

---

### `cmd=21012` — 演习战规则

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `rule_description` | 描述文案 |

---

### `cmd=29001` — 利刃之战报名（服务端推送）

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `p_1` | — |
| 2 | u64 | `p_2` | — |
| 3 | u64 | `p_3` | — |
| 4 | u64 | `p_4` | — |
| 5 | u64 | `p_5` | — |
| 6 | u64 | `p_6` | — |
| 7 | u64 | `p_7` | — |
| 8 | u64 | `p_8` | — |
| 9 | u64 | `p_9` | — |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=29002` — 利刃之战提交部队（服务端推送）

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `o_1` | — |
| 2 | u8 | `armies_1.length` | — |
| 3 | 循环 | — | 按前导计数字段循环写入后续字段 |
| 4 | u8 | `i.id` | — |
| 5 | u32 | `i.count)}this._data.write_long(this.o_2` | — |
| 6 | u8 | `armies_2.length` | — |
| 7 | 循环 | — | 按前导计数字段循环写入后续字段 |
| 8 | u8 | `r.id` | — |
| 9 | u32 | `r.count)}this._data.write_long(this.o_3` | — |
| 10 | u8 | `armies_3.length` | — |
| 11 | 循环 | — | 按前导计数字段循环写入后续字段 |
| 12 | u8 | `l.id` | — |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=29003` — 利刃之战部队列表（服务端推送）

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `joined_event` | — |
| 2 | u64 | `player_id` | 玩家 ID |
| 3 | string | `name` | 名称 |
| 4 | u32 | `avatar` | — |
| 5 | u32 | `racial` | — |
| 6 | u64 | `influence` | 影响力 |
| 7 | u8 | `troop_configured` | — |
| 8 | u64 | `main_officer_id` | — |
| 9 | u8 | `id` | — |
| 10 | u32 | `count` | 数量/计数 |

---

### `cmd=29004` — 利刃之战出战（服务端推送）

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
| 1 | string | `enemy_alliance_name` | 军团名称 |

---

### `cmd=29005` — 获取利刃之战战斗（服务端推送）

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `battle_id` | — |
| 2 | u8 | `battle_round` | — |

---

### `cmd=29006` — 利刃之战规则与奖励（服务端推送）

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `rules` | — |
| 2 | string | `name` | 名称 |
| 3 | string | `description` | 描述文案 |
| 4 | u32 | `icon` | 图标编号 |
| 5 | u32 | `amount` | 数量 |
| 6 | string | `name` | 名称 |
| 7 | string | `description` | 描述文案 |
| 8 | u32 | `icon` | 图标编号 |
| 9 | u32 | `amount` | 数量 |
| 10 | string | `name` | 名称 |
| 11 | string | `description` | 描述文案 |
| 12 | u32 | `icon` | 图标编号 |
| 13 | u32 | `amount` | 数量 |
| 14 | string | `name` | 名称 |
| 15 | string | `description` | 描述文案 |
| 16 | u32 | `icon` | 图标编号 |
| 17 | u32 | `amount` | 数量 |
