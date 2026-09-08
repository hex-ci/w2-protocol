# 地图与战报

> 50 个命令（cmd 15001 ~ 19018）。所有响应均以 1 字节 status 打头，成功值见各条目。

### `cmd=15001` — 查询地图格子信息

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `center_y)` | — |
| 2 | u32 | `ids.length` | — |
| 3 | 循环 | — | 按前导计数字段循环写入后续字段 |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `count` | 数量/计数 |

---

### `cmd=15002` — 查询单个地块详情

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `send_tile_x` | 地图 X 坐标 |
| 2 | u32 | `send_tile_y` | 地图 Y 坐标 |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=15003` — 收藏地块

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `x` | 地图 X 坐标 |
| 2 | u32 | `y` | 地图 Y 坐标 |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `message` | — |

---

### `cmd=15004` — 取消收藏地块

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `x` | 地图 X 坐标 |
| 2 | u32 | `y` | 地图 Y 坐标 |

**响应**（status 为 **1** 或 **2** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `type` | 类型枚举 |
| 2 | string | `message` | — |
| 3 | u32 | `type` | 类型枚举 |
| 4 | u32 | `field_type` | 类型枚举 |
| 5 | string | `city_icon` | 图标编号 |
| 6 | string | `city_name` | 城池名称 |
| 7 | string | `nuclear_icon` | 图标编号 |
| 8 | string | `nuclear_name` | 名称 |
| 9 | string | `alliance_name` | 军团名称 |
| 10 | string | `field_icon` | 图标编号 |
| 11 | string | `field_name` | 名称 |
| 12 | string | `stronghold_icon` | 图标编号 |
| 13 | string | `stronghold_name` | 名称 |
| 14 | u32 | `x` | 地图 X 坐标 |
| 15 | u32 | `y` | 地图 Y 坐标 |
| 16 | string | `remark` | — |
| 17 | u32 | `lines_count` | 数量/计数 |
| 18 | u64 | `expedition_id` | — |
| 19 | u32 | `start_x` | 地图 X 坐标 |
| 20 | u32 | `start_y` | 地图 Y 坐标 |
| 21 | u32 | `end_x` | 地图 X 坐标 |
| 22 | u32 | `end_y` | 地图 Y 坐标 |
| 23 | string | `mark` | — |
| 24 | string | `officer_name` | 名称 |
| 25 | u32 | `officer_icon` | 图标编号 |
| 26 | u32 | `officer_level` | 等级 |
| 27 | u64 | `player_id` | 玩家 ID |
| 28 | string | `player_name` | 玩家名称 |
| 29 | u32 | `avatar` | — |
| 30 | string | `player_name` | 玩家名称 |
| 31 | string | `alliance_name` | 军团名称 |
| 32 | string | `title` | — |
| 33 | string | `title_color` | — |
| 34 | u64 | `oneway_time` | 时间戳（毫秒） |
| 35 | u64 | `remaining_time` | 时间戳（毫秒） |
| 36 | u32 | `state` | — |
| 37 | u32 | `army_count` | 数量/计数 |
| 38 | u32 | `type` | 类型枚举 |
| 39 | u32 | `relationship` | — |
| 40 | u64 | `from_city_id` | 城池 ID |
| 41 | u64 | `target_expedition_id` | — |
| 42 | u32 | `x` | 地图 X 坐标 |
| 43 | u32 | `y` | 地图 Y 坐标 |
| 44 | u64 | `arrived_time` | 时间戳（毫秒） |
| 45 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 46 | u32 | `page_count` | 总页数 |
| 47 | u64 | `trade_id` | — |
| 48 | u8 | `trade_resource_type` | 类型枚举 |
| 49 | u32 | `trade_amount` | 数量 |
| 50 | string | `unit_price` | 单价 |
| 51 | u32 | `total_price` | 单价 |
| 52 | u64 | `trade_time` | 时间戳（毫秒） |
| 53 | u32 | `seller_avatar` | — |
| 54 | string | `seller_nickname` | 玩家昵称 |
| 55 | string | `seller_alliance_name` | 军团名称 |
| 56 | string | `confirm_message` | — |

---

### `cmd=15006` — 查询已占领地块

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `index` | — |
| 2 | u32 | `x` | 地图 X 坐标 |
| 3 | u32 | `y` | 地图 Y 坐标 |
| 4 | u8 | `type` | 类型枚举 |
| 5 | string | `name` | 名称 |
| 6 | string | `icon` | 图标编号 |
| 7 | u32 | `specail_icon` | 图标编号 |
| 8 | u32 | `level` | 等级 |
| 9 | u8 | `state` | — |
| 10 | u64 | `gather_time` | 时间戳（毫秒） |
| 11 | string | `icon` | 图标编号 |
| 12 | u8 | `state` | — |

---

### `cmd=15007` — 开始采集

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `owned_tile_id` | — |
| 2 | u64 | `troop_id` | — |

**响应**（status 为 **1** 或 **2** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `normal_amount` | 数量 |
| 2 | u32 | `addition_amount` | 数量 |
| 3 | u32 | `final_amount` | 数量 |
| 4 | u32 | `icon` | 图标编号 |
| 5 | string | `name` | 名称 |
| 6 | u32 | `chance` | 概率（万分比） |
| 7 | string | `other_icon` | 图标编号 |
| 8 | string | `name` | 名称 |
| 9 | u32 | `amount` | 数量 |
| 10 | u32 | `merchandise_id` | — |
| 11 | string | `name` | 名称 |
| 12 | u32 | `icon` | 图标编号 |
| 13 | u32 | `amount` | 数量 |
| 14 | u32 | `price` | 单价 |

---

### `cmd=15008` — 收获单块资源

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `owned_tile_id` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `gather_time` | 时间戳（毫秒） |
| 2 | string | `message` | — |

---

### `cmd=15009` — 放弃地块

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `owned_tile_id` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `message` | — |

---

### `cmd=15010` — 批量收获

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `1` | — |
| 2 | u32 | `tile_ids.length` | — |
| 3 | 循环 | — | 按前导计数字段循环写入后续字段 |

**响应**（status 为 **1** 或 **2** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `type` | 类型枚举 |
| 2 | string | `message` | — |
| 3 | u32 | `type` | 类型枚举 |
| 4 | u32 | `field_type` | 类型枚举 |
| 5 | string | `city_icon` | 图标编号 |
| 6 | string | `city_name` | 城池名称 |
| 7 | string | `nuclear_icon` | 图标编号 |
| 8 | string | `nuclear_name` | 名称 |
| 9 | string | `alliance_name` | 军团名称 |
| 10 | string | `field_icon` | 图标编号 |
| 11 | string | `field_name` | 名称 |
| 12 | string | `stronghold_icon` | 图标编号 |
| 13 | string | `stronghold_name` | 名称 |
| 14 | u32 | `x` | 地图 X 坐标 |
| 15 | u32 | `y` | 地图 Y 坐标 |
| 16 | string | `remark` | — |
| 17 | u32 | `lines_count` | 数量/计数 |
| 18 | u64 | `expedition_id` | — |
| 19 | u32 | `start_x` | 地图 X 坐标 |
| 20 | u32 | `start_y` | 地图 Y 坐标 |
| 21 | u32 | `end_x` | 地图 X 坐标 |
| 22 | u32 | `end_y` | 地图 Y 坐标 |
| 23 | string | `mark` | — |
| 24 | string | `officer_name` | 名称 |
| 25 | u32 | `officer_icon` | 图标编号 |
| 26 | u32 | `officer_level` | 等级 |
| 27 | u64 | `player_id` | 玩家 ID |
| 28 | string | `player_name` | 玩家名称 |
| 29 | u32 | `avatar` | — |
| 30 | string | `player_name` | 玩家名称 |
| 31 | string | `alliance_name` | 军团名称 |
| 32 | string | `title` | — |
| 33 | string | `title_color` | — |
| 34 | u64 | `oneway_time` | 时间戳（毫秒） |
| 35 | u64 | `remaining_time` | 时间戳（毫秒） |
| 36 | u32 | `state` | — |
| 37 | u32 | `army_count` | 数量/计数 |
| 38 | u32 | `type` | 类型枚举 |
| 39 | u32 | `relationship` | — |
| 40 | u64 | `from_city_id` | 城池 ID |
| 41 | u64 | `target_expedition_id` | — |
| 42 | u32 | `x` | 地图 X 坐标 |
| 43 | u32 | `y` | 地图 Y 坐标 |
| 44 | u64 | `arrived_time` | 时间戳（毫秒） |
| 45 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 46 | u32 | `page_count` | 总页数 |
| 47 | u64 | `trade_id` | — |
| 48 | u8 | `trade_resource_type` | 类型枚举 |
| 49 | u32 | `trade_amount` | 数量 |
| 50 | string | `unit_price` | 单价 |
| 51 | u32 | `total_price` | 单价 |
| 52 | u64 | `trade_time` | 时间戳（毫秒） |
| 53 | u32 | `seller_avatar` | — |
| 54 | string | `seller_nickname` | 玩家昵称 |
| 55 | string | `seller_alliance_name` | 军团名称 |
| 56 | string | `confirm_message` | — |

---

### `cmd=15013` — 查询地图区域列表

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `area_id` | — |
| 2 | u32 | `city_count` | 城池数量 |
| 3 | u32 | `fill_rate` | — |
| 4 | u32 | `random_move_diamond_price` | 单价 |
| 5 | u32 | `random_move_item_count` | 数量/计数 |

---

### `cmd=15014` — 查询已收藏地块

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `0` | — |

**响应**（status 为 **1** 或 **2** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `type` | 类型枚举 |
| 2 | u32 | `field_type` | 类型枚举 |
| 3 | string | `city_icon` | 图标编号 |
| 4 | string | `city_name` | 城池名称 |
| 5 | string | `nuclear_icon` | 图标编号 |
| 6 | string | `nuclear_name` | 名称 |
| 7 | string | `alliance_name` | 军团名称 |
| 8 | string | `field_icon` | 图标编号 |
| 9 | string | `field_name` | 名称 |
| 10 | string | `stronghold_icon` | 图标编号 |
| 11 | string | `stronghold_name` | 名称 |
| 12 | u32 | `x` | 地图 X 坐标 |
| 13 | u32 | `y` | 地图 Y 坐标 |
| 14 | string | `remark` | — |
| 15 | u32 | `lines_count` | 数量/计数 |
| 16 | u64 | `expedition_id` | — |
| 17 | u32 | `start_x` | 地图 X 坐标 |
| 18 | u32 | `start_y` | 地图 Y 坐标 |
| 19 | u32 | `end_x` | 地图 X 坐标 |
| 20 | u32 | `end_y` | 地图 Y 坐标 |
| 21 | string | `mark` | — |
| 22 | string | `officer_name` | 名称 |
| 23 | u32 | `officer_icon` | 图标编号 |
| 24 | u32 | `officer_level` | 等级 |
| 25 | u64 | `player_id` | 玩家 ID |
| 26 | string | `player_name` | 玩家名称 |
| 27 | u32 | `avatar` | — |
| 28 | string | `player_name` | 玩家名称 |
| 29 | string | `alliance_name` | 军团名称 |
| 30 | string | `title` | — |
| 31 | string | `title_color` | — |
| 32 | u64 | `oneway_time` | 时间戳（毫秒） |
| 33 | u64 | `remaining_time` | 时间戳（毫秒） |
| 34 | u32 | `state` | — |
| 35 | u32 | `army_count` | 数量/计数 |
| 36 | u32 | `type` | 类型枚举 |
| 37 | u32 | `relationship` | — |
| 38 | u64 | `from_city_id` | 城池 ID |
| 39 | u64 | `target_expedition_id` | — |
| 40 | u32 | `x` | 地图 X 坐标 |
| 41 | u32 | `y` | 地图 Y 坐标 |
| 42 | u64 | `arrived_time` | 时间戳（毫秒） |
| 43 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 44 | u32 | `page_count` | 总页数 |
| 45 | u64 | `trade_id` | — |
| 46 | u8 | `trade_resource_type` | 类型枚举 |
| 47 | u32 | `trade_amount` | 数量 |
| 48 | string | `unit_price` | 单价 |
| 49 | u32 | `total_price` | 单价 |
| 50 | u64 | `trade_time` | 时间戳（毫秒） |
| 51 | u32 | `seller_avatar` | — |
| 52 | string | `seller_nickname` | 玩家昵称 |
| 53 | string | `seller_alliance_name` | 军团名称 |
| 54 | string | `confirm_message` | — |

---

### `cmd=15015` — 查询部队行军线路

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `center_x` | 地图 X 坐标 |
| 2 | u32 | `center_y` | 地图 Y 坐标 |
| 3 | u32 | `radius` | — |
| 4 | u8 | `self_visible` | — |
| 5 | u8 | `members_visible` | — |
| 6 | u8 | `attack_visible` | — |
| 7 | u8 | `members_attack_visible` | — |

**响应**（status 为 **1** 或 **2** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `lines_count` | 数量/计数 |
| 2 | u64 | `expedition_id` | — |
| 3 | u32 | `start_x` | 地图 X 坐标 |
| 4 | u32 | `start_y` | 地图 Y 坐标 |
| 5 | u32 | `end_x` | 地图 X 坐标 |
| 6 | u32 | `end_y` | 地图 Y 坐标 |
| 7 | string | `mark` | — |
| 8 | string | `officer_name` | 名称 |
| 9 | u32 | `officer_icon` | 图标编号 |
| 10 | u32 | `officer_level` | 等级 |
| 11 | u64 | `player_id` | 玩家 ID |
| 12 | string | `player_name` | 玩家名称 |
| 13 | u32 | `avatar` | — |
| 14 | string | `player_name` | 玩家名称 |
| 15 | string | `alliance_name` | 军团名称 |
| 16 | string | `title` | — |
| 17 | string | `title_color` | — |
| 18 | u64 | `oneway_time` | 时间戳（毫秒） |
| 19 | u64 | `remaining_time` | 时间戳（毫秒） |
| 20 | u32 | `state` | — |
| 21 | u32 | `army_count` | 数量/计数 |
| 22 | u32 | `type` | 类型枚举 |
| 23 | u32 | `relationship` | — |
| 24 | u64 | `from_city_id` | 城池 ID |
| 25 | u64 | `target_expedition_id` | — |
| 26 | u32 | `x` | 地图 X 坐标 |
| 27 | u32 | `y` | 地图 Y 坐标 |
| 28 | u64 | `arrived_time` | 时间戳（毫秒） |
| 29 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 30 | u32 | `page_count` | 总页数 |
| 31 | u64 | `trade_id` | — |
| 32 | u8 | `trade_resource_type` | 类型枚举 |
| 33 | u32 | `trade_amount` | 数量 |
| 34 | string | `unit_price` | 单价 |
| 35 | u32 | `total_price` | 单价 |
| 36 | u64 | `trade_time` | 时间戳（毫秒） |
| 37 | u32 | `seller_avatar` | — |
| 38 | string | `seller_nickname` | 玩家昵称 |
| 39 | string | `seller_alliance_name` | 军团名称 |
| 40 | string | `confirm_message` | — |

---

### `cmd=15017` — 查询 NPC 产出

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `tile_id` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `production_count` | 数量/计数 |
| 2 | u32 | `item_id` | 道具 ID |
| 3 | u32 | `icon` | 图标编号 |
| 4 | string | `name` | 名称 |
| 5 | string | `description` | 描述文案 |
| 6 | u32 | `drop_rate` | — |
| 7 | u32 | `amount` | 数量 |

---

### `cmd=16001` — 查询交易行情

**请求参数**: 无

**响应**（status 为 **0** 或 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `auto_buy_food` | — |
| 2 | u64 | `trade_id` | — |
| 3 | u8 | `trade_state` | — |
| 4 | u8 | `restrict_flag` | — |
| 5 | u8 | `trade_resource_type` | 类型枚举 |
| 6 | u32 | `trade_amount` | 数量 |
| 7 | string | `unit_price` | 单价 |
| 8 | u32 | `total_price` | 单价 |
| 9 | u64 | `trade_time` | 时间戳（毫秒） |
| 10 | u64 | `remain_time` | 剩余毫秒数 |
| 11 | u64 | `building_id` | 建筑实例 ID |
| 12 | u32 | `prototype_id` | 建筑原型 ID |
| 13 | u32 | `level` | 等级 |
| 14 | u32 | `position` | 格位编号 |
| 15 | u32 | `building_status` | 结果状态 |
| 16 | u64 | `remain_time` | 剩余毫秒数 |
| 17 | u64 | `finishi_time` | 时间戳（毫秒） |
| 18 | u64 | `total_time` | 总耗时毫秒 |

---

### `cmd=16002` — 取消交易

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `trade_id` | — |

**响应**（status 为 **1** 或 **2** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 2 | u32 | `page_count` | 总页数 |
| 3 | u64 | `trade_id` | — |
| 4 | u8 | `trade_resource_type` | 类型枚举 |
| 5 | u32 | `trade_amount` | 数量 |
| 6 | string | `unit_price` | 单价 |
| 7 | u32 | `total_price` | 单价 |
| 8 | u64 | `trade_time` | 时间戳（毫秒） |
| 9 | u32 | `seller_avatar` | — |
| 10 | string | `seller_nickname` | 玩家昵称 |
| 11 | string | `seller_alliance_name` | 军团名称 |
| 12 | string | `confirm_message` | — |

---

### `cmd=16003` — 卖给系统

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `food_amount` | 粮食储量 |
| 2 | u32 | `steel_amount` | 钢铁储量 |
| 3 | u32 | `oil_amount` | 石油储量 |
| 4 | u32 | `mineral_amount` | 稀矿储量 |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=16004` — 从系统购买

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `food_amount` | 粮食储量 |
| 2 | u32 | `steel_amount` | 钢铁储量 |
| 3 | u32 | `oil_amount` | 石油储量 |
| 4 | u32 | `mineral_amount` | 稀矿储量 |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=16005` — 挂单卖给玩家

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `trade_resource_type` | 类型枚举 |
| 2 | u32 | `resource_amount` | 数量 |
| 3 | u32 | `total_price` | 单价 |
| 4 | u32 | `time_limit` | 时间戳（毫秒） |
| 5 | u8 | `restrict_flag` | — |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=16006` — 查询玩家挂单列表

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `trade_resource_type` | 类型枚举 |
| 2 | u8 | `restrict_flag` | — |
| 3 | string | `keyword_of_nickname` | 玩家昵称 |
| 4 | u32 | `page_size` | 每页条数 |
| 5 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |

**响应**（status 为 **1** 或 **2** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 2 | u32 | `page_count` | 总页数 |
| 3 | u64 | `trade_id` | — |
| 4 | u8 | `trade_resource_type` | 类型枚举 |
| 5 | u32 | `trade_amount` | 数量 |
| 6 | string | `unit_price` | 单价 |
| 7 | u32 | `total_price` | 单价 |
| 8 | u64 | `trade_time` | 时间戳（毫秒） |
| 9 | u32 | `seller_avatar` | — |
| 10 | string | `seller_nickname` | 玩家昵称 |
| 11 | string | `seller_alliance_name` | 军团名称 |
| 12 | string | `confirm_message` | — |

---

### `cmd=16007` — 从玩家购买

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `trade_id` | — |

**响应**（status 为 **1** 或 **2** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `confirm_message` | — |

---

### `cmd=16008` — 交易加速

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `trade_id` | — |
| 2 | u8 | `confirmed` | — |

**响应**（status 为 **1** 或 **2** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `confirm_message` | — |

---

### `cmd=17001` — 查询军事建筑

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `building_id` | 建筑实例 ID |
| 2 | u32 | `prototype_id` | 建筑原型 ID |
| 3 | u32 | `level` | 等级 |
| 4 | u32 | `position` | 格位编号 |
| 5 | u32 | `building_status` | 结果状态 |
| 6 | u64 | `remain_time` | 剩余毫秒数 |
| 7 | u64 | `finish_time` | 完成时间戳 |
| 8 | u64 | `total_time` | 总耗时毫秒 |
| 9 | u8 | `helped` | — |

---

### `cmd=17002` — 查询生产建筑

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `resource_building_area_count` | 数量/计数 |
| 2 | u64 | `building_id` | 建筑实例 ID |
| 3 | u32 | `prototype_id` | 建筑原型 ID |
| 4 | u32 | `level` | 等级 |
| 5 | u32 | `position` | 格位编号 |
| 6 | u32 | `building_status` | 结果状态 |
| 7 | u64 | `remain_time` | 剩余毫秒数 |
| 8 | u64 | `finish_time` | 完成时间戳 |
| 9 | u64 | `total_time` | 总耗时毫秒 |
| 10 | u8 | `helped` | — |

---

### `cmd=17003` — 新建建筑

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `building_prototype_id` | 建筑原型 ID |
| 2 | u32 | `position` | 格位编号 |

**响应**（status 为 **0** 或 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `building_id` | 建筑实例 ID |
| 2 | u32 | `prototype_id` | 建筑原型 ID |
| 3 | u32 | `level` | 等级 |
| 4 | u32 | `position` | 格位编号 |
| 5 | u32 | `building_status` | 结果状态 |
| 6 | u64 | `remain_time` | 剩余毫秒数 |
| 7 | u64 | `finishi_time` | 时间戳（毫秒） |
| 8 | u64 | `total_time` | 总耗时毫秒 |

---

### `cmd=17004` — 取消建筑操作

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `building_id` | 建筑实例 ID |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `prototype_id` | 建筑原型 ID |
| 2 | u32 | `position` | 格位编号 |

---

### `cmd=17005` — 拆除建筑

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `building_id` | 建筑实例 ID |

**响应**（status 为 **0** 或 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `building_id` | 建筑实例 ID |
| 2 | u32 | `prototype_id` | 建筑原型 ID |
| 3 | u32 | `level` | 等级 |
| 4 | u32 | `position` | 格位编号 |
| 5 | u32 | `building_status` | 结果状态 |
| 6 | u64 | `remain_time` | 剩余毫秒数 |
| 7 | u64 | `finishi_time` | 时间戳（毫秒） |
| 8 | u64 | `total_time` | 总耗时毫秒 |

---

### `cmd=17006` — 升级建筑

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `building_id` | 建筑实例 ID |

**响应**（status 为 **0** 或 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `building_id` | 建筑实例 ID |
| 2 | u32 | `prototype_id` | 建筑原型 ID |
| 3 | u32 | `level` | 等级 |
| 4 | u32 | `position` | 格位编号 |
| 5 | u32 | `building_status` | 结果状态 |
| 6 | u64 | `remain_time` | 剩余毫秒数 |
| 7 | u64 | `finishi_time` | 时间戳（毫秒） |
| 8 | u64 | `total_time` | 总耗时毫秒 |

---

### `cmd=17007` — 查询升降级信息

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `building_id` | 建筑实例 ID |
| 2 | u32 | `prototype_id` | 建筑原型 ID |
| 3 | u32 | `position` | 格位编号 |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `prototype_id` | 建筑原型 ID |
| 2 | u32 | `building_status` | 结果状态 |
| 3 | u64 | `remain_time` | 剩余毫秒数 |
| 4 | u64 | `finishi_time` | 时间戳（毫秒） |
| 5 | u32 | `position` | 格位编号 |
| 6 | string | `level_description` | 描述文案 |
| 7 | u8 | `allow_upgrade` | — |
| 8 | u32 | `steel_required` | — |
| 9 | u32 | `mineral_required` | — |
| 10 | u32 | `population_required` | 人口数 |
| 11 | u32 | `food_required` | — |
| 12 | u32 | `oil_required` | — |
| 13 | u32 | `rank_required` | 军衔等级 |
| 14 | u32 | `prototype_id` | 建筑原型 ID |
| 15 | u32 | `level` | 等级 |
| 16 | u32 | `cur_level` | 等级 |
| 17 | u32 | `technique_id` | 科技 ID |
| 18 | u32 | `level` | 等级 |
| 19 | u32 | `cur_level` | 等级 |
| 20 | u32 | `amount` | 数量 |
| 21 | u32 | `cur_amount` | 当前数量 |
| 22 | string | `name` | 名称 |
| 23 | u32 | `item_id` | 道具 ID |
| 24 | u32 | `icon` | 图标编号 |
| 25 | u8 | `instant_buy` | — |
| 26 | u32 | `price` | 单价 |
| 27 | string | `next_level_description` | 描述文案 |
| 28 | u64 | `upgrade_need_time` | 时间戳（毫秒） |
| 29 | u8 | `allow_downgrade` | — |
| 30 | u32 | `return_population` | 人口数 |
| 31 | u32 | `return_food` | — |
| 32 | u32 | `return_mineral` | — |
| 33 | u32 | `return_oil` | — |
| 34 | u32 | `return_steel` | — |
| 35 | u64 | `downgrade_need_time` | 时间戳（毫秒） |

---

### `cmd=17009` — 查询可建建筑

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `scene_type` | 类型枚举 |

**响应**（status 为 **0** 或 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `prototype_id` | 建筑原型 ID |
| 2 | u8 | `buildable` | — |
| 3 | u64 | `time` | 时间戳（毫秒） |
| 4 | u8 | `costal_city_required` | — |
| 5 | string | `level_description` | 描述文案 |
| 6 | string | `build_description` | 描述文案 |
| 7 | u32 | `steel_required` | — |
| 8 | u32 | `mineral_required` | — |
| 9 | u32 | `population_required` | 人口数 |
| 10 | u32 | `food_required` | — |
| 11 | u32 | `oil_required` | — |
| 12 | u32 | `rank_required` | 军衔等级 |
| 13 | u32 | `prototype_id` | 建筑原型 ID |
| 14 | u32 | `level` | 等级 |
| 15 | u32 | `cur_level` | 等级 |
| 16 | u32 | `technique_id` | 科技 ID |
| 17 | u32 | `level` | 等级 |
| 18 | u32 | `cur_level` | 等级 |
| 19 | u32 | `amount` | 数量 |
| 20 | u32 | `cur_amount` | 当前数量 |
| 21 | string | `name` | 名称 |
| 22 | u32 | `item_id` | 道具 ID |
| 23 | u32 | `icon` | 图标编号 |

---

### `cmd=17010` — 建筑加速

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `item_id` | 道具 ID |
| 2 | u64 | `building_id` | 建筑实例 ID |
| 3 | u32 | `use_count` | 数量/计数 |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=17011` — 查询建筑原型表

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `prototype_id` | 建筑原型 ID |
| 2 | string | `name` | 名称 |
| 3 | string | `des` | — |

---

### `cmd=17013` — 免费加速建筑

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `building_id` | 建筑实例 ID |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=19001` — 远征前置数据

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `is_pve_challenge` | 布尔标记（0/1） |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u16 | `capacity_addition_percent` | 容量上限 |
| 2 | u16 | `land_spped_addition_percent` | — |
| 3 | u16 | `air_speed_addition_percent` | — |
| 4 | u16 | `ally_speed_addition_percent` | — |
| 5 | u16 | `command_art_addition_percent` | — |
| 6 | u16 | `army_flag_addition_percent` | — |
| 7 | u8 | `commander_count` | 数量/计数 |
| 8 | u64 | `officer_id` | — |
| 9 | string | `officer_name` | 名称 |
| 10 | u16 | `add_percent` | — |
| 11 | string | `skill_oil_cost` | — |
| 12 | u64 | `cur_server_time` | 时间戳（毫秒） |
| 13 | string | `consume_oil` | — |
| 14 | string | `alliance_tech_cost_oil` | 军团 |
| 15 | readDouble | `global_army_speed_add` | — |
| 16 | readDouble | `country_mettle_dispatch_army_count_addition` | 数量/计数 |

---

### `cmd=19002` — 查询远征部队详情

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `send_expedition_id` | — |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=19003` — 执行远征

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `army_kind_count` | 数量/计数 |
| 2 | 循环 | — | 按前导计数字段循环写入后续字段 |
| 3 | u32 | `select_armies[e].count` | 数量 |
| 4 | u32 | `target_x` | 地图 X 坐标 |
| 5 | u32 | `target_y` | 地图 Y 坐标 |
| 6 | u8 | `expedition_type` | 类型枚举 |
| 7 | u8 | `0` | — |
| 8 | u64 | `commander_id` | — |
| 9 | u32 | `0` | — |
| 10 | u64 | `carry_food` | — |
| 11 | u64 | `carry_steel` | — |
| 12 | u64 | `carry_oil` | — |
| 13 | u64 | `carry_mineral` | — |
| 14 | u64 | `carry_gold` | — |
| 15 | u32 | `transport_time_interval` | 时间戳（毫秒） |
| 16 | u32 | `transport_total_num` | 数量 |
| 17 | u32 | `assembly_id` | — |
| 18 | u32 | `alliance_capital_fort` | 军团 |
| 19 | u8 | `is_break_truce` | 布尔标记（0/1） |
| 20 | u64 | `t.key` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `truce_tag` | — |
| 2 | string | `tip_msg` | — |

---

### `cmd=19004` — 召回远征部队

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `troop_id` | — |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=19005` — 查询远征自动运输

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `total_count` | 数量/计数 |
| 2 | u32 | `queue_count` | 数量/计数 |
| 3 | u64 | `id` | — |
| 4 | u32 | `type` | 类型枚举 |
| 5 | u32 | `status` | 结果状态 |
| 6 | u32 | `start_x` | 地图 X 坐标 |
| 7 | u32 | `start_y` | 地图 Y 坐标 |
| 8 | u32 | `end_x` | 地图 X 坐标 |
| 9 | u32 | `end_y` | 地图 Y 坐标 |
| 10 | string | `start_city_name` | 城池名称 |
| 11 | string | `end_city_name` | 城池名称 |
| 12 | string | `start_icon` | 图标编号 |
| 13 | string | `end_icon` | 图标编号 |
| 14 | u32 | `time_interval` | 时间戳（毫秒） |
| 15 | u32 | `total_num` | 数量 |
| 16 | u32 | `suc_num` | 数量 |

---

### `cmd=19006` — 取消自动运输

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `queue_count` | 数量/计数 |
| 2 | 循环 | — | 按前导计数字段循环写入后续字段 |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=19007` — 查询远征警报列表

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `per_page_size` | 每页条数 |
| 2 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `cur_page` | 当前值 |
| 2 | u32 | `total_page` | — |
| 3 | u64 | `report_id` | — |
| 4 | u8 | `visible_level` | 等级 |
| 5 | u8 | `expedition_type` | 类型枚举 |
| 6 | u8 | `expedition_state` | — |
| 7 | string | `commander_name` | 名称 |
| 8 | string | `start_place` | — |
| 9 | u32 | `start_x` | 地图 X 坐标 |
| 10 | u32 | `start_y` | 地图 Y 坐标 |
| 11 | u32 | `target_place_type` | 类型枚举 |
| 12 | string | `target_place` | — |
| 13 | string | `target_icon` | 图标编号 |
| 14 | u32 | `target_x` | 地图 X 坐标 |
| 15 | u32 | `target_y` | 地图 Y 坐标 |
| 16 | u64 | `arrive_time` | 时间戳（毫秒） |
| 17 | u64 | `remain_time` | 剩余毫秒数 |
| 18 | u64 | `battle_id` | — |
| 19 | u64 | `stuck_time` | 时间戳（毫秒） |
| 20 | u32 | `stuck_x` | 地图 X 坐标 |
| 21 | u32 | `stuck_y` | 地图 Y 坐标 |

---

### `cmd=19008` — 查询远征自身信息

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `per_page_size` | 每页条数 |
| 2 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 3 | u8 | `filter_state` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `cur_page` | 当前值 |
| 2 | u32 | `total_page` | — |
| 3 | u64 | `report_id` | — |
| 4 | u8 | `expedition_type` | 类型枚举 |
| 5 | u8 | `expedition_state` | — |
| 6 | string | `start_place` | — |
| 7 | u32 | `start_x` | 地图 X 坐标 |
| 8 | u32 | `start_y` | 地图 Y 坐标 |
| 9 | u32 | `target_place_type` | 类型枚举 |
| 10 | string | `target_place` | — |
| 11 | string | `target_icon` | 图标编号 |
| 12 | u32 | `target_x` | 地图 X 坐标 |
| 13 | u32 | `target_y` | 地图 Y 坐标 |
| 14 | u64 | `arrive_time` | 时间戳（毫秒） |
| 15 | u64 | `remain_time` | 剩余毫秒数 |
| 16 | u64 | `battle_id` | — |
| 17 | u64 | `stuck_time` | 时间戳（毫秒） |
| 18 | u32 | `stuck_x` | 地图 X 坐标 |
| 19 | u32 | `stuck_y` | 地图 Y 坐标 |

---

### `cmd=19009` — 查询当前城驻军

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `id` | — |
| 2 | u32 | `count` | 数量/计数 |

---

### `cmd=19010` — 过滤远征警报

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `per_page_size` | 每页条数 |
| 2 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 3 | u8 | `filter_type` | 类型枚举 |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `cur_page` | 当前值 |
| 2 | u32 | `total_page` | — |
| 3 | u64 | `report_id` | — |
| 4 | u8 | `visible_level` | 等级 |
| 5 | u8 | `expedition_type` | 类型枚举 |
| 6 | u8 | `expedition_state` | — |
| 7 | string | `commander_name` | 名称 |
| 8 | string | `start_place` | — |
| 9 | u32 | `start_x` | 地图 X 坐标 |
| 10 | u32 | `start_y` | 地图 Y 坐标 |
| 11 | u32 | `target_place_type` | 类型枚举 |
| 12 | string | `target_place` | — |
| 13 | u32 | `target_x` | 地图 X 坐标 |
| 14 | u32 | `target_y` | 地图 Y 坐标 |
| 15 | string | `target_icon` | 图标编号 |
| 16 | u64 | `arrive_time` | 时间戳（毫秒） |
| 17 | u64 | `remain_time` | 剩余毫秒数 |
| 18 | u64 | `battle_id` | — |

---

### `cmd=19011` — 查询伏击部队

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `expedition_id` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `army_typr_count` | 数量/计数 |
| 2 | u32 | `id` | — |
| 3 | u32 | `count` | 数量/计数 |

---

### `cmd=19012` — 执行伏击

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `army_kind_count` | 数量/计数 |
| 2 | 循环 | — | 按前导计数字段循环写入后续字段 |
| 3 | u32 | `select_armies[e].count` | 数量 |
| 4 | u64 | `commander_id` | — |
| 5 | u32 | `assembly_id` | — |
| 6 | u64 | `expedition_id` | — |
| 7 | u8 | `is_break_truce` | 布尔标记（0/1） |
| 8 | u64 | `t.key` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `truce_tag` | — |
| 2 | string | `tip_msg` | — |

---

### `cmd=19013` — 远征寻路

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `exp_type` | 类型枚举 |
| 2 | u32 | `sx` | — |
| 3 | u32 | `sy` | — |
| 4 | u32 | `dx` | — |
| 5 | u32 | `dy` | — |
| 6 | u8 | `path_type` | 类型枚举 |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=19014` — 远征重设目标

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `expedition_id` | — |
| 2 | u32 | `exp_type` | 类型枚举 |
| 3 | u32 | `dx` | — |
| 4 | u32 | `dy` | — |
| 5 | u32 | `path_length` | — |
| 6 | u8 | `confirmed?1:0` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `confirm_message` | — |

---

### `cmd=19015` — 查询我的远征列表

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `x` | 地图 X 坐标 |
| 2 | u32 | `y` | 地图 Y 坐标 |
| 3 | u64 | `arrived_time` | 时间戳（毫秒） |

---

### `cmd=19016` — 请求驻扎

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `expedition_id` | — |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=19017` — 战场指令

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `expedition_id` | — |
| 2 | u32 | `expedition_type` | 类型枚举 |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=19018` — 远征部队停止

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `troop_id` | — |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。
