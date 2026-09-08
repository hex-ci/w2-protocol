# 商城与支付

> 23 个命令（cmd 7001 ~ 12048）。所有响应均以 1 字节 status 打头，成功值见各条目。

### `cmd=7001` — 商城购买道具

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `merchandise_id` | — |
| 2 | u32 | `buy_count` | 数量/计数 |
| 3 | u32 | `-1` | — |
| 4 | u8 | `buy_type` | 类型枚举 |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `diamond_or_item_remainig` | 道具 |
| 2 | u32 | `ticket_item_id` | 道具 ID |

---

### `cmd=7003` — 使用兑换码

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `redeem_code` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `rc_type` | 类型枚举 |
| 2 | string | `rc_image` | — |
| 3 | string | `rc_name` | 名称 |
| 4 | u32 | `rc_amount` | 数量 |

---

### `cmd=7004` — 查询普通商城商品

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `type` | 类型枚举 |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `type` | 类型枚举 |
| 2 | u32 | `diamond_owned` | 当前钻石数 |
| 3 | u8 | `specical_type_flag` | 类型枚举 |
| 4 | u8 | `sell_tag` | — |
| 5 | u32 | `merchandise_id` | — |
| 6 | u32 | `item_id` | 道具 ID |
| 7 | u8 | `end_time_flag` | 结束时间戳 |
| 8 | u64 | `item_end_time` | 结束时间戳 |
| 9 | string | `name` | 名称 |
| 10 | string | `description` | 描述文案 |
| 11 | u32 | `icon` | 图标编号 |
| 12 | u8 | `level` | 等级 |
| 13 | u32 | `amount` | 数量 |
| 14 | u32 | `ticket_item_id` | 道具 ID |
| 15 | u32 | `price` | 单价 |
| 16 | u32 | `original_price` | 单价 |
| 17 | u32 | `pri` | — |
| 18 | u32 | `suit_equipment_id` | — |
| 19 | string | `suit_equipment_description` | 描述文案 |
| 20 | u8 | `limit_mode` | — |
| 21 | u32 | `buy_remain_count` | 数量/计数 |
| 22 | u32 | `buy_items_left` | — |
| 23 | string | `notice` | 公告文案 |

---

### `cmd=7007` — 查询限购详情

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `limit_mode` | — |
| 2 | u32 | `merchandise_id` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `limit_mode` | — |
| 2 | u32 | `item_id` | 道具 ID |
| 3 | string | `name` | 名称 |
| 4 | string | `description` | 描述文案 |
| 5 | u32 | `icon` | 图标编号 |
| 6 | u32 | `price` | 单价 |
| 7 | u64 | `refresh_remain_time` | 剩余毫秒数 |
| 8 | u32 | `buy_remain_count` | 数量/计数 |
| 9 | u32 | `buy_items_left` | — |

---

### `cmd=7008` — 购买限购商品

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `limit_mode` | — |
| 2 | u32 | `merchandise_id` | — |
| 3 | u32 | `buy_count` | 数量/计数 |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `diamond_or_item_remainig` | 道具 |
| 2 | u32 | `ticket_item_id` | 道具 ID |

---

### `cmd=7009` — 查询商城分类

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `type` | 类型枚举 |
| 2 | string | `name` | 名称 |

---

### `cmd=7010` — 演习战商城商品

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `type` | 类型枚举 |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `type` | 类型枚举 |
| 2 | u32 | `diamond_owned` | 当前钻石数 |
| 3 | u32 | `item_id` | 道具 ID |
| 4 | u32 | `amount` | 数量 |
| 5 | u8 | `specical_type_flag` | 类型枚举 |
| 6 | u8 | `sell_tag` | — |
| 7 | u32 | `merchandise_id` | — |
| 8 | u32 | `item_id` | 道具 ID |
| 9 | u8 | `end_time_flag` | 结束时间戳 |
| 10 | u64 | `item_end_time` | 结束时间戳 |
| 11 | string | `name` | 名称 |
| 12 | string | `description` | 描述文案 |
| 13 | u32 | `icon` | 图标编号 |
| 14 | u8 | `level` | 等级 |
| 15 | u32 | `amount` | 数量 |
| 16 | u32 | `ticket_item_id` | 道具 ID |
| 17 | u32 | `price` | 单价 |
| 18 | u32 | `original_price` | 单价 |
| 19 | u32 | `pri` | — |
| 20 | u32 | `suit_equipment_id` | — |
| 21 | string | `suit_equipment_description` | 描述文案 |
| 22 | u8 | `limit_mode` | — |
| 23 | u32 | `buy_remain_count` | 数量/计数 |
| 24 | u32 | `buy_items_left` | — |
| 25 | string | `notice` | 公告文案 |

---

### `cmd=12001` — 支付商品信息

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 2 | u32 | `page_size` | 每页条数 |
| 3 | string | `keyword` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `diamond_owned` | 当前钻石数 |
| 2 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 3 | u32 | `page_count` | 总页数 |
| 4 | u32 | `total_count` | 数量/计数 |
| 5 | u64 | `equipment_id` | — |
| 6 | u32 | `cur_amount` | 当前数量 |
| 7 | string | `name` | 名称 |
| 8 | string | `description` | 描述文案 |
| 9 | string | `use_description` | 描述文案 |
| 10 | u8 | `position` | 格位编号 |
| 11 | u8 | `cur_endure` | 当前值 |
| 12 | u8 | `max_endure` | 上限 |
| 13 | u8 | `is_bind` | 布尔标记（0/1） |
| 14 | string | `binded_officer` | — |
| 15 | u32 | `icon` | 图标编号 |
| 16 | u8 | `level` | 等级 |
| 17 | u32 | `recycle_count` | 数量/计数 |
| 18 | string | `recycle_name` | 名称 |
| 19 | u8 | `is_protected` | 布尔标记（0/1） |
| 20 | string | `notice` | 公告文案 |

---

### `cmd=12002` — 扩展勋章槽位

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `officer_id` | — |

**响应**（status 为 **1** 或 **2** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `diamond_owned` | 当前钻石数 |
| 2 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 3 | u32 | `page_count` | 总页数 |
| 4 | u32 | `total_count` | 数量/计数 |
| 5 | u64 | `medal_id` | — |
| 6 | u32 | `cur_amount` | 当前数量 |
| 7 | string | `name` | 名称 |
| 8 | string | `description` | 描述文案 |
| 9 | string | `use_description` | 描述文案 |
| 10 | u32 | `icon` | 图标编号 |
| 11 | u8 | `level` | 等级 |
| 12 | u32 | `recycle_count` | 数量/计数 |
| 13 | string | `recycle_name` | 名称 |
| 14 | string | `disassemble_description` | 描述文案 |
| 15 | u8 | `color` | — |
| 16 | u8 | `is_protected` | 布尔标记（0/1） |
| 17 | string | `notice` | 公告文案 |
| 18 | u64 | `message_id` | — |
| 19 | string | `message_title` | — |
| 20 | string | `author` | — |
| 21 | u32 | `priority` | — |
| 22 | u64 | `message_time` | 时间戳（毫秒） |
| 23 | u32 | `alliance_id` | 军团 ID |
| 24 | string | `alliance_name` | 军团名称 |
| 25 | u32 | `capital_x` | 地图 X 坐标 |
| 26 | u32 | `capital_y` | 地图 Y 坐标 |
| 27 | u32 | `position` | 格位编号 |
| 28 | u32 | `id` | — |
| 29 | string | `name` | 名称 |
| 30 | u32 | `capital_status` | 结果状态 |
| 31 | string | `info_1` | — |
| 32 | string | `info_1` | — |
| 33 | string | `info_2` | — |
| 34 | u32 | `diamond_required` | — |
| 35 | string | `info_1` | — |
| 36 | string | `info_2` | — |
| 37 | u32 | `diamond_required` | — |
| 38 | u64 | `remain_time` | 剩余毫秒数 |
| 39 | string | `info_1` | — |
| 40 | u32 | `position` | 格位编号 |
| 41 | u32 | `state` | — |
| 42 | u64 | `remain_time` | 剩余毫秒数 |
| 43 | u32 | `mine_id` | — |
| 44 | u32 | `prototype_id` | 建筑原型 ID |
| 45 | u32 | `production` | — |
| 46 | u32 | `total_time` | 总耗时毫秒 |
| 47 | string | `nuclear_description` | 描述文案 |
| 48 | u32 | `capital_state` | — |
| 49 | string | `state_description` | 描述文案 |
| 50 | u8 | `type` | 类型枚举 |
| 51 | string | `message` | — |
| 52 | u32 | `type` | 类型枚举 |
| 53 | u32 | `field_type` | 类型枚举 |
| 54 | string | `city_icon` | 图标编号 |
| 55 | string | `city_name` | 城池名称 |
| 56 | string | `nuclear_icon` | 图标编号 |
| 57 | string | `nuclear_name` | 名称 |
| 58 | string | `alliance_name` | 军团名称 |
| 59 | string | `field_icon` | 图标编号 |
| 60 | string | `field_name` | 名称 |
| 61 | string | `stronghold_icon` | 图标编号 |
| 62 | string | `stronghold_name` | 名称 |
| 63 | u32 | `x` | 地图 X 坐标 |
| 64 | u32 | `y` | 地图 Y 坐标 |
| 65 | string | `remark` | — |
| 66 | u32 | `lines_count` | 数量/计数 |
| 67 | u64 | `expedition_id` | — |
| 68 | u32 | `start_x` | 地图 X 坐标 |
| 69 | u32 | `start_y` | 地图 Y 坐标 |
| 70 | u32 | `end_x` | 地图 X 坐标 |
| 71 | u32 | `end_y` | 地图 Y 坐标 |
| 72 | string | `mark` | — |
| 73 | string | `officer_name` | 名称 |
| 74 | u32 | `officer_icon` | 图标编号 |
| 75 | u32 | `officer_level` | 等级 |
| 76 | u64 | `player_id` | 玩家 ID |
| 77 | string | `player_name` | 玩家名称 |
| 78 | u32 | `avatar` | — |
| 79 | string | `player_name` | 玩家名称 |
| 80 | string | `alliance_name` | 军团名称 |
| 81 | string | `title` | — |
| 82 | string | `title_color` | — |
| 83 | u64 | `oneway_time` | 时间戳（毫秒） |
| 84 | u64 | `remaining_time` | 时间戳（毫秒） |
| 85 | u32 | `state` | — |
| 86 | u32 | `army_count` | 数量/计数 |
| 87 | u32 | `type` | 类型枚举 |
| 88 | u32 | `relationship` | — |
| 89 | u64 | `from_city_id` | 城池 ID |
| 90 | u64 | `target_expedition_id` | — |
| 91 | u32 | `x` | 地图 X 坐标 |
| 92 | u32 | `y` | 地图 Y 坐标 |
| 93 | u64 | `arrived_time` | 时间戳（毫秒） |
| 94 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 95 | u32 | `page_count` | 总页数 |
| 96 | u64 | `trade_id` | — |
| 97 | u8 | `trade_resource_type` | 类型枚举 |
| 98 | u32 | `trade_amount` | 数量 |
| 99 | string | `unit_price` | 单价 |
| 100 | u32 | `total_price` | 单价 |
| 101 | u64 | `trade_time` | 时间戳（毫秒） |
| 102 | u32 | `seller_avatar` | — |
| 103 | string | `seller_nickname` | 玩家昵称 |
| 104 | string | `seller_alliance_name` | 军团名称 |
| 105 | string | `confirm_message` | — |

---

### `cmd=12003` — 佩戴勋章

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `officer_id` | — |
| 2 | u64 | `medal_id` | — |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=12004` — 卸下勋章

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `officer_id` | — |
| 2 | u64 | `medal_id` | — |
| 3 | u32 | `action_type` | 类型枚举 |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=12005` — 支付商品列表

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 2 | u32 | `page_size` | 每页条数 |
| 3 | u8 | `enable_filter` | — |
| 4 | u32 | `filter_army_type` | 类型枚举 |
| 5 | u32 | `filter_function_type` | 类型枚举 |
| 6 | u8 | `filter_order_type)` | — |

**响应**（status 为 **1** 或 **2** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `diamond_owned` | 当前钻石数 |
| 2 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 3 | u32 | `page_count` | 总页数 |
| 4 | u32 | `total_count` | 数量/计数 |
| 5 | u64 | `medal_id` | — |
| 6 | u32 | `cur_amount` | 当前数量 |
| 7 | string | `name` | 名称 |
| 8 | string | `description` | 描述文案 |
| 9 | string | `use_description` | 描述文案 |
| 10 | u32 | `icon` | 图标编号 |
| 11 | u8 | `level` | 等级 |
| 12 | u32 | `recycle_count` | 数量/计数 |
| 13 | string | `recycle_name` | 名称 |
| 14 | string | `disassemble_description` | 描述文案 |
| 15 | u8 | `color` | — |
| 16 | u8 | `is_protected` | 布尔标记（0/1） |
| 17 | string | `notice` | 公告文案 |
| 18 | u64 | `message_id` | — |
| 19 | string | `message_title` | — |
| 20 | string | `author` | — |
| 21 | u32 | `priority` | — |
| 22 | u64 | `message_time` | 时间戳（毫秒） |
| 23 | u32 | `alliance_id` | 军团 ID |
| 24 | string | `alliance_name` | 军团名称 |
| 25 | u32 | `capital_x` | 地图 X 坐标 |
| 26 | u32 | `capital_y` | 地图 Y 坐标 |
| 27 | u32 | `position` | 格位编号 |
| 28 | u32 | `id` | — |
| 29 | string | `name` | 名称 |
| 30 | u32 | `capital_status` | 结果状态 |
| 31 | string | `info_1` | — |
| 32 | string | `info_1` | — |
| 33 | string | `info_2` | — |
| 34 | u32 | `diamond_required` | — |
| 35 | string | `info_1` | — |
| 36 | string | `info_2` | — |
| 37 | u32 | `diamond_required` | — |
| 38 | u64 | `remain_time` | 剩余毫秒数 |
| 39 | string | `info_1` | — |
| 40 | u32 | `position` | 格位编号 |
| 41 | u32 | `state` | — |
| 42 | u64 | `remain_time` | 剩余毫秒数 |
| 43 | u32 | `mine_id` | — |
| 44 | u32 | `prototype_id` | 建筑原型 ID |
| 45 | u32 | `production` | — |
| 46 | u32 | `total_time` | 总耗时毫秒 |
| 47 | string | `nuclear_description` | 描述文案 |
| 48 | u32 | `capital_state` | — |
| 49 | string | `state_description` | 描述文案 |
| 50 | u8 | `type` | 类型枚举 |
| 51 | string | `message` | — |
| 52 | u32 | `type` | 类型枚举 |
| 53 | u32 | `field_type` | 类型枚举 |
| 54 | string | `city_icon` | 图标编号 |
| 55 | string | `city_name` | 城池名称 |
| 56 | string | `nuclear_icon` | 图标编号 |
| 57 | string | `nuclear_name` | 名称 |
| 58 | string | `alliance_name` | 军团名称 |
| 59 | string | `field_icon` | 图标编号 |
| 60 | string | `field_name` | 名称 |
| 61 | string | `stronghold_icon` | 图标编号 |
| 62 | string | `stronghold_name` | 名称 |
| 63 | u32 | `x` | 地图 X 坐标 |
| 64 | u32 | `y` | 地图 Y 坐标 |
| 65 | string | `remark` | — |
| 66 | u32 | `lines_count` | 数量/计数 |
| 67 | u64 | `expedition_id` | — |
| 68 | u32 | `start_x` | 地图 X 坐标 |
| 69 | u32 | `start_y` | 地图 Y 坐标 |
| 70 | u32 | `end_x` | 地图 X 坐标 |
| 71 | u32 | `end_y` | 地图 Y 坐标 |
| 72 | string | `mark` | — |
| 73 | string | `officer_name` | 名称 |
| 74 | u32 | `officer_icon` | 图标编号 |
| 75 | u32 | `officer_level` | 等级 |
| 76 | u64 | `player_id` | 玩家 ID |
| 77 | string | `player_name` | 玩家名称 |
| 78 | u32 | `avatar` | — |
| 79 | string | `player_name` | 玩家名称 |
| 80 | string | `alliance_name` | 军团名称 |
| 81 | string | `title` | — |
| 82 | string | `title_color` | — |
| 83 | u64 | `oneway_time` | 时间戳（毫秒） |
| 84 | u64 | `remaining_time` | 时间戳（毫秒） |
| 85 | u32 | `state` | — |
| 86 | u32 | `army_count` | 数量/计数 |
| 87 | u32 | `type` | 类型枚举 |
| 88 | u32 | `relationship` | — |
| 89 | u64 | `from_city_id` | 城池 ID |
| 90 | u64 | `target_expedition_id` | — |
| 91 | u32 | `x` | 地图 X 坐标 |
| 92 | u32 | `y` | 地图 Y 坐标 |
| 93 | u64 | `arrived_time` | 时间戳（毫秒） |
| 94 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 95 | u32 | `page_count` | 总页数 |
| 96 | u64 | `trade_id` | — |
| 97 | u8 | `trade_resource_type` | 类型枚举 |
| 98 | u32 | `trade_amount` | 数量 |
| 99 | string | `unit_price` | 单价 |
| 100 | u32 | `total_price` | 单价 |
| 101 | u64 | `trade_time` | 时间戳（毫秒） |
| 102 | u32 | `seller_avatar` | — |
| 103 | string | `seller_nickname` | 玩家昵称 |
| 104 | string | `seller_alliance_name` | 军团名称 |
| 105 | string | `confirm_message` | — |

---

### `cmd=12006` — 勋章操作回调

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `ids.length` | — |
| 2 | 循环 | — | 按前导计数字段循环写入后续字段 |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `name` | 名称 |
| 2 | u32 | `icon` | 图标编号 |
| 3 | u32 | `amount` | 数量 |

---

### `cmd=12007` — 查询勋章升级信息

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `medal_id` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `upgrade_info_current` | — |
| 2 | string | `upgrade_info_after` | — |
| 3 | string | `cimelia_cost` | — |
| 4 | string | `cimelia_owned` | — |

---

### `cmd=12008` — 升级勋章

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `medal_id` | — |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=12009` — 分解勋章

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `ids.length` | — |
| 2 | 循环 | — | 按前导计数字段循环写入后续字段 |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `item_id` | 道具 ID |
| 2 | string | `name` | 名称 |
| 3 | string | `description` | 描述文案 |
| 4 | u32 | `icon` | 图标编号 |
| 5 | u32 | `amount` | 数量 |

---

### `cmd=12010` — 查询勋章洗练信息

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `medal_id` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `name` | 名称 |
| 2 | string | `wash_info` | — |
| 3 | string | `wash_description` | 描述文案 |
| 4 | u32 | `tool_amount` | 数量 |
| 5 | u8 | `color` | — |
| 6 | string | `tool_name` | 名称 |
| 7 | u8 | `wash_value_type` | 类型枚举 |

---

### `cmd=12011` — 洗练勋章

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `medal_id` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `wash_type_change` | 类型枚举 |
| 2 | string | `wash_value_change` | — |
| 3 | string | `wash_info_current` | — |

---

### `cmd=12012` — 查询勋章列表

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `query_type` | 类型枚举 |
| 2 | u64 | `officer_id` | — |
| 3 | u8 | `page_size` | 每页条数 |
| 4 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 5 | u32 | `army_type` | 类型枚举 |
| 6 | u32 | `function_type` | 类型枚举 |
| 7 | u8 | `order)` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `slot_total` | — |
| 2 | u32 | `slot_using` | — |
| 3 | u64 | `medal_id` | — |
| 4 | string | `name` | 名称 |
| 5 | u32 | `slot_required` | — |
| 6 | string | `effect_name` | 名称 |
| 7 | string | `effect_description` | 描述文案 |
| 8 | u64 | `icon` | 图标编号 |
| 9 | u8 | `level` | 等级 |
| 10 | u8 | `color` | — |
| 11 | string | `slot_expand_message` | — |
| 12 | u32 | `page_count` | 总页数 |
| 13 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |

---

### `cmd=12045` — 装备操作回调

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `ids.length` | — |
| 2 | 循环 | — | 按前导计数字段循环写入后续字段 |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `name` | 名称 |
| 2 | u32 | `icon` | 图标编号 |
| 3 | u32 | `amount` | 数量 |

---

### `cmd=12046` — 勋章洗练类型转换

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `target_type` | 类型枚举 |
| 2 | u64 | `medal_id` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `wash_type_change` | 类型枚举 |
| 2 | u8 | `wash_value_type` | 类型枚举 |

---

### `cmd=12047` — 勋章锁定/解锁

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `action` | — |
| 2 | u8 | `medal_ids.length` | — |
| 3 | 循环 | — | 按前导计数字段循环写入后续字段 |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=12048` — 支付回调

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `action` | — |
| 2 | u8 | `equip_ids.length` | — |
| 3 | 循环 | — | 按前导计数字段循环写入后续字段 |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。
