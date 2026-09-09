# 公告与系统

> 15 个命令（cmd 13002 ~ 14020）。所有响应均以 1 字节 status 打头，成功值见各条目。

### `cmd=13002` — 查询公告列表

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `notice_id` | 公告文案 |
| 2 | u8 | `type` | 类型枚举 |
| 3 | string | `message` | — |
| 4 | u64 | `create_time` | 创建时间戳 |

---

### `cmd=14001` — 查询首府公告列表

**请求参数**: 无

**响应**（status 为 **1** 或 **2** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `message_id` | — |
| 2 | string | `message_title` | — |
| 3 | string | `author` | — |
| 4 | u32 | `priority` | — |
| 5 | u64 | `message_time` | 时间戳（毫秒） |
| 6 | u32 | `alliance_id` | 军团 ID |
| 7 | string | `alliance_name` | 军团名称 |
| 8 | u32 | `capital_x` | 地图 X 坐标 |
| 9 | u32 | `capital_y` | 地图 Y 坐标 |
| 10 | u32 | `position` | 格位编号 |
| 11 | u32 | `id` | — |
| 12 | string | `name` | 名称 |
| 13 | u32 | `capital_status` | 结果状态 |
| 14 | string | `info_1` | — |
| 15 | string | `info_1` | — |
| 16 | string | `info_2` | — |
| 17 | u32 | `diamond_required` | — |
| 18 | string | `info_1` | — |
| 19 | string | `info_2` | — |
| 20 | u32 | `diamond_required` | — |
| 21 | u64 | `remain_time` | 剩余毫秒数 |
| 22 | string | `info_1` | — |
| 23 | u32 | `position` | 格位编号 |
| 24 | u32 | `state` | — |
| 25 | u64 | `remain_time` | 剩余毫秒数 |
| 26 | u32 | `mine_id` | — |
| 27 | u32 | `prototype_id` | 建筑原型 ID |
| 28 | u32 | `production` | — |
| 29 | u32 | `total_time` | 总耗时毫秒 |
| 30 | string | `nuclear_description` | 描述文案 |
| 31 | u32 | `capital_state` | — |
| 32 | string | `state_description` | 描述文案 |
| 33 | u8 | `type` | 类型枚举 |
| 34 | string | `message` | — |
| 35 | u32 | `type` | 类型枚举 |
| 36 | u32 | `field_type` | 类型枚举 |
| 37 | string | `city_icon` | 图标编号 |
| 38 | string | `city_name` | 城池名称 |
| 39 | string | `nuclear_icon` | 图标编号 |
| 40 | string | `nuclear_name` | 名称 |
| 41 | string | `alliance_name` | 军团名称 |
| 42 | string | `field_icon` | 图标编号 |
| 43 | string | `field_name` | 名称 |
| 44 | string | `stronghold_icon` | 图标编号 |
| 45 | string | `stronghold_name` | 名称 |
| 46 | u32 | `x` | 地图 X 坐标 |
| 47 | u32 | `y` | 地图 Y 坐标 |
| 48 | string | `remark` | — |
| 49 | u32 | `lines_count` | 数量/计数 |
| 50 | u64 | `expedition_id` | — |
| 51 | u32 | `start_x` | 地图 X 坐标 |
| 52 | u32 | `start_y` | 地图 Y 坐标 |
| 53 | u32 | `end_x` | 地图 X 坐标 |
| 54 | u32 | `end_y` | 地图 Y 坐标 |
| 55 | string | `mark` | — |
| 56 | string | `officer_name` | 名称 |
| 57 | u32 | `officer_icon` | 图标编号 |
| 58 | u32 | `officer_level` | 等级 |
| 59 | u64 | `player_id` | 玩家 ID |
| 60 | string | `player_name` | 玩家名称 |
| 61 | u32 | `avatar` | — |
| 62 | string | `player_name` | 玩家名称 |
| 63 | string | `alliance_name` | 军团名称 |
| 64 | string | `title` | — |
| 65 | string | `title_color` | — |
| 66 | u64 | `oneway_time` | 时间戳（毫秒） |
| 67 | u64 | `remaining_time` | 时间戳（毫秒） |
| 68 | u32 | `state` | — |
| 69 | u32 | `army_count` | 数量/计数 |
| 70 | u32 | `type` | 类型枚举 |
| 71 | u32 | `relationship` | — |
| 72 | u64 | `from_city_id` | 城池 ID |
| 73 | u64 | `target_expedition_id` | — |
| 74 | u32 | `x` | 地图 X 坐标 |
| 75 | u32 | `y` | 地图 Y 坐标 |
| 76 | u64 | `arrived_time` | 时间戳（毫秒） |
| 77 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 78 | u32 | `page_count` | 总页数 |
| 79 | u64 | `trade_id` | — |
| 80 | u8 | `trade_resource_type` | 类型枚举 |
| 81 | u32 | `trade_amount` | 数量 |
| 82 | string | `unit_price` | 单价 |
| 83 | u32 | `total_price` | 单价 |
| 84 | u64 | `trade_time` | 时间戳（毫秒） |
| 85 | u32 | `seller_avatar` | — |
| 86 | string | `seller_nickname` | 玩家昵称 |
| 87 | string | `seller_alliance_name` | 军团名称 |
| 88 | string | `confirm_message` | 服务器要求确认的文案 |

---

### `cmd=14002` — 发布首府公告

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `title` | — |
| 2 | string | `content` | — |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=14003` — 删除首府公告

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `alliance_message_ids.length` | 军团 |
| 2 | 循环 | — | 按前导计数字段循环写入后续字段 |

**响应**（status 为 **1** 或 **2** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `alliance_id` | 军团 ID |
| 2 | string | `alliance_name` | 军团名称 |
| 3 | u32 | `capital_x` | 地图 X 坐标 |
| 4 | u32 | `capital_y` | 地图 Y 坐标 |
| 5 | u32 | `position` | 格位编号 |
| 6 | u32 | `id` | — |
| 7 | string | `name` | 名称 |
| 8 | u32 | `capital_status` | 结果状态 |
| 9 | string | `info_1` | — |
| 10 | string | `info_1` | — |
| 11 | string | `info_2` | — |
| 12 | u32 | `diamond_required` | — |
| 13 | string | `info_1` | — |
| 14 | string | `info_2` | — |
| 15 | u32 | `diamond_required` | — |
| 16 | u64 | `remain_time` | 剩余毫秒数 |
| 17 | string | `info_1` | — |
| 18 | u32 | `position` | 格位编号 |
| 19 | u32 | `state` | — |
| 20 | u64 | `remain_time` | 剩余毫秒数 |
| 21 | u32 | `mine_id` | — |
| 22 | u32 | `prototype_id` | 建筑原型 ID |
| 23 | u32 | `production` | — |
| 24 | u32 | `total_time` | 总耗时毫秒 |
| 25 | string | `nuclear_description` | 描述文案 |
| 26 | u32 | `capital_state` | — |
| 27 | string | `state_description` | 描述文案 |
| 28 | u8 | `type` | 类型枚举 |
| 29 | string | `message` | — |
| 30 | u32 | `type` | 类型枚举 |
| 31 | u32 | `field_type` | 类型枚举 |
| 32 | string | `city_icon` | 图标编号 |
| 33 | string | `city_name` | 城池名称 |
| 34 | string | `nuclear_icon` | 图标编号 |
| 35 | string | `nuclear_name` | 名称 |
| 36 | string | `alliance_name` | 军团名称 |
| 37 | string | `field_icon` | 图标编号 |
| 38 | string | `field_name` | 名称 |
| 39 | string | `stronghold_icon` | 图标编号 |
| 40 | string | `stronghold_name` | 名称 |
| 41 | u32 | `x` | 地图 X 坐标 |
| 42 | u32 | `y` | 地图 Y 坐标 |
| 43 | string | `remark` | — |
| 44 | u32 | `lines_count` | 数量/计数 |
| 45 | u64 | `expedition_id` | — |
| 46 | u32 | `start_x` | 地图 X 坐标 |
| 47 | u32 | `start_y` | 地图 Y 坐标 |
| 48 | u32 | `end_x` | 地图 X 坐标 |
| 49 | u32 | `end_y` | 地图 Y 坐标 |
| 50 | string | `mark` | — |
| 51 | string | `officer_name` | 名称 |
| 52 | u32 | `officer_icon` | 图标编号 |
| 53 | u32 | `officer_level` | 等级 |
| 54 | u64 | `player_id` | 玩家 ID |
| 55 | string | `player_name` | 玩家名称 |
| 56 | u32 | `avatar` | — |
| 57 | string | `player_name` | 玩家名称 |
| 58 | string | `alliance_name` | 军团名称 |
| 59 | string | `title` | — |
| 60 | string | `title_color` | — |
| 61 | u64 | `oneway_time` | 时间戳（毫秒） |
| 62 | u64 | `remaining_time` | 时间戳（毫秒） |
| 63 | u32 | `state` | — |
| 64 | u32 | `army_count` | 数量/计数 |
| 65 | u32 | `type` | 类型枚举 |
| 66 | u32 | `relationship` | — |
| 67 | u64 | `from_city_id` | 城池 ID |
| 68 | u64 | `target_expedition_id` | — |
| 69 | u32 | `x` | 地图 X 坐标 |
| 70 | u32 | `y` | 地图 Y 坐标 |
| 71 | u64 | `arrived_time` | 时间戳（毫秒） |
| 72 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 73 | u32 | `page_count` | 总页数 |
| 74 | u64 | `trade_id` | — |
| 75 | u8 | `trade_resource_type` | 类型枚举 |
| 76 | u32 | `trade_amount` | 数量 |
| 77 | string | `unit_price` | 单价 |
| 78 | u32 | `total_price` | 单价 |
| 79 | u64 | `trade_time` | 时间戳（毫秒） |
| 80 | u32 | `seller_avatar` | — |
| 81 | string | `seller_nickname` | 玩家昵称 |
| 82 | string | `seller_alliance_name` | 军团名称 |
| 83 | string | `confirm_message` | 服务器要求确认的文案 |

---

### `cmd=14004` — 查询首府公告详情

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `alliance_message_id` | 军团 |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `message_content` | — |

---

### `cmd=14005` — 置顶首府公告

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `alliance_message_id` | 军团 |

**响应**（status 为 **1** 或 **2** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `alliance_id` | 军团 ID |
| 2 | string | `alliance_name` | 军团名称 |
| 3 | u32 | `capital_x` | 地图 X 坐标 |
| 4 | u32 | `capital_y` | 地图 Y 坐标 |
| 5 | u32 | `position` | 格位编号 |
| 6 | u32 | `id` | — |
| 7 | string | `name` | 名称 |
| 8 | u32 | `capital_status` | 结果状态 |
| 9 | string | `info_1` | — |
| 10 | string | `info_1` | — |
| 11 | string | `info_2` | — |
| 12 | u32 | `diamond_required` | — |
| 13 | string | `info_1` | — |
| 14 | string | `info_2` | — |
| 15 | u32 | `diamond_required` | — |
| 16 | u64 | `remain_time` | 剩余毫秒数 |
| 17 | string | `info_1` | — |
| 18 | u32 | `position` | 格位编号 |
| 19 | u32 | `state` | — |
| 20 | u64 | `remain_time` | 剩余毫秒数 |
| 21 | u32 | `mine_id` | — |
| 22 | u32 | `prototype_id` | 建筑原型 ID |
| 23 | u32 | `production` | — |
| 24 | u32 | `total_time` | 总耗时毫秒 |
| 25 | string | `nuclear_description` | 描述文案 |
| 26 | u32 | `capital_state` | — |
| 27 | string | `state_description` | 描述文案 |
| 28 | u8 | `type` | 类型枚举 |
| 29 | string | `message` | — |
| 30 | u32 | `type` | 类型枚举 |
| 31 | u32 | `field_type` | 类型枚举 |
| 32 | string | `city_icon` | 图标编号 |
| 33 | string | `city_name` | 城池名称 |
| 34 | string | `nuclear_icon` | 图标编号 |
| 35 | string | `nuclear_name` | 名称 |
| 36 | string | `alliance_name` | 军团名称 |
| 37 | string | `field_icon` | 图标编号 |
| 38 | string | `field_name` | 名称 |
| 39 | string | `stronghold_icon` | 图标编号 |
| 40 | string | `stronghold_name` | 名称 |
| 41 | u32 | `x` | 地图 X 坐标 |
| 42 | u32 | `y` | 地图 Y 坐标 |
| 43 | string | `remark` | — |
| 44 | u32 | `lines_count` | 数量/计数 |
| 45 | u64 | `expedition_id` | — |
| 46 | u32 | `start_x` | 地图 X 坐标 |
| 47 | u32 | `start_y` | 地图 Y 坐标 |
| 48 | u32 | `end_x` | 地图 X 坐标 |
| 49 | u32 | `end_y` | 地图 Y 坐标 |
| 50 | string | `mark` | — |
| 51 | string | `officer_name` | 名称 |
| 52 | u32 | `officer_icon` | 图标编号 |
| 53 | u32 | `officer_level` | 等级 |
| 54 | u64 | `player_id` | 玩家 ID |
| 55 | string | `player_name` | 玩家名称 |
| 56 | u32 | `avatar` | — |
| 57 | string | `player_name` | 玩家名称 |
| 58 | string | `alliance_name` | 军团名称 |
| 59 | string | `title` | — |
| 60 | string | `title_color` | — |
| 61 | u64 | `oneway_time` | 时间戳（毫秒） |
| 62 | u64 | `remaining_time` | 时间戳（毫秒） |
| 63 | u32 | `state` | — |
| 64 | u32 | `army_count` | 数量/计数 |
| 65 | u32 | `type` | 类型枚举 |
| 66 | u32 | `relationship` | — |
| 67 | u64 | `from_city_id` | 城池 ID |
| 68 | u64 | `target_expedition_id` | — |
| 69 | u32 | `x` | 地图 X 坐标 |
| 70 | u32 | `y` | 地图 Y 坐标 |
| 71 | u64 | `arrived_time` | 时间戳（毫秒） |
| 72 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 73 | u32 | `page_count` | 总页数 |
| 74 | u64 | `trade_id` | — |
| 75 | u8 | `trade_resource_type` | 类型枚举 |
| 76 | u32 | `trade_amount` | 数量 |
| 77 | string | `unit_price` | 单价 |
| 78 | u32 | `total_price` | 单价 |
| 79 | u64 | `trade_time` | 时间戳（毫秒） |
| 80 | u32 | `seller_avatar` | — |
| 81 | string | `seller_nickname` | 玩家昵称 |
| 82 | string | `seller_alliance_name` | 军团名称 |
| 83 | string | `confirm_message` | 服务器要求确认的文案 |

---

### `cmd=14006` — 取消置顶

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `alliance_message_id` | 军团 |

**响应**（status 为 **1** 或 **2** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `alliance_id` | 军团 ID |
| 2 | string | `alliance_name` | 军团名称 |
| 3 | u32 | `capital_x` | 地图 X 坐标 |
| 4 | u32 | `capital_y` | 地图 Y 坐标 |
| 5 | u32 | `position` | 格位编号 |
| 6 | u32 | `id` | — |
| 7 | string | `name` | 名称 |
| 8 | u32 | `capital_status` | 结果状态 |
| 9 | string | `info_1` | — |
| 10 | string | `info_1` | — |
| 11 | string | `info_2` | — |
| 12 | u32 | `diamond_required` | — |
| 13 | string | `info_1` | — |
| 14 | string | `info_2` | — |
| 15 | u32 | `diamond_required` | — |
| 16 | u64 | `remain_time` | 剩余毫秒数 |
| 17 | string | `info_1` | — |
| 18 | u32 | `position` | 格位编号 |
| 19 | u32 | `state` | — |
| 20 | u64 | `remain_time` | 剩余毫秒数 |
| 21 | u32 | `mine_id` | — |
| 22 | u32 | `prototype_id` | 建筑原型 ID |
| 23 | u32 | `production` | — |
| 24 | u32 | `total_time` | 总耗时毫秒 |
| 25 | string | `nuclear_description` | 描述文案 |
| 26 | u32 | `capital_state` | — |
| 27 | string | `state_description` | 描述文案 |
| 28 | u8 | `type` | 类型枚举 |
| 29 | string | `message` | — |
| 30 | u32 | `type` | 类型枚举 |
| 31 | u32 | `field_type` | 类型枚举 |
| 32 | string | `city_icon` | 图标编号 |
| 33 | string | `city_name` | 城池名称 |
| 34 | string | `nuclear_icon` | 图标编号 |
| 35 | string | `nuclear_name` | 名称 |
| 36 | string | `alliance_name` | 军团名称 |
| 37 | string | `field_icon` | 图标编号 |
| 38 | string | `field_name` | 名称 |
| 39 | string | `stronghold_icon` | 图标编号 |
| 40 | string | `stronghold_name` | 名称 |
| 41 | u32 | `x` | 地图 X 坐标 |
| 42 | u32 | `y` | 地图 Y 坐标 |
| 43 | string | `remark` | — |
| 44 | u32 | `lines_count` | 数量/计数 |
| 45 | u64 | `expedition_id` | — |
| 46 | u32 | `start_x` | 地图 X 坐标 |
| 47 | u32 | `start_y` | 地图 Y 坐标 |
| 48 | u32 | `end_x` | 地图 X 坐标 |
| 49 | u32 | `end_y` | 地图 Y 坐标 |
| 50 | string | `mark` | — |
| 51 | string | `officer_name` | 名称 |
| 52 | u32 | `officer_icon` | 图标编号 |
| 53 | u32 | `officer_level` | 等级 |
| 54 | u64 | `player_id` | 玩家 ID |
| 55 | string | `player_name` | 玩家名称 |
| 56 | u32 | `avatar` | — |
| 57 | string | `player_name` | 玩家名称 |
| 58 | string | `alliance_name` | 军团名称 |
| 59 | string | `title` | — |
| 60 | string | `title_color` | — |
| 61 | u64 | `oneway_time` | 时间戳（毫秒） |
| 62 | u64 | `remaining_time` | 时间戳（毫秒） |
| 63 | u32 | `state` | — |
| 64 | u32 | `army_count` | 数量/计数 |
| 65 | u32 | `type` | 类型枚举 |
| 66 | u32 | `relationship` | — |
| 67 | u64 | `from_city_id` | 城池 ID |
| 68 | u64 | `target_expedition_id` | — |
| 69 | u32 | `x` | 地图 X 坐标 |
| 70 | u32 | `y` | 地图 Y 坐标 |
| 71 | u64 | `arrived_time` | 时间戳（毫秒） |
| 72 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 73 | u32 | `page_count` | 总页数 |
| 74 | u64 | `trade_id` | — |
| 75 | u8 | `trade_resource_type` | 类型枚举 |
| 76 | u32 | `trade_amount` | 数量 |
| 77 | string | `unit_price` | 单价 |
| 78 | u32 | `total_price` | 单价 |
| 79 | u64 | `trade_time` | 时间戳（毫秒） |
| 80 | u32 | `seller_avatar` | — |
| 81 | string | `seller_nickname` | 玩家昵称 |
| 82 | string | `seller_alliance_name` | 军团名称 |
| 83 | string | `confirm_message` | 服务器要求确认的文案 |

---

### `cmd=14007` — 建造首府

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `tile_id` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `messgae` | — |
| 2 | u32 | `alliance_id` | 军团 ID |

---

### `cmd=14008` — 首府校验

**请求参数**: 无

**响应**（status 为 **1** 或 **2** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `alliance_id` | 军团 ID |
| 2 | string | `alliance_name` | 军团名称 |
| 3 | u32 | `capital_x` | 地图 X 坐标 |
| 4 | u32 | `capital_y` | 地图 Y 坐标 |
| 5 | u32 | `position` | 格位编号 |
| 6 | u32 | `id` | — |
| 7 | string | `name` | 名称 |
| 8 | u32 | `capital_status` | 结果状态 |
| 9 | string | `info_1` | — |
| 10 | string | `info_1` | — |
| 11 | string | `info_2` | — |
| 12 | u32 | `diamond_required` | — |
| 13 | string | `info_1` | — |
| 14 | string | `info_2` | — |
| 15 | u32 | `diamond_required` | — |
| 16 | u64 | `remain_time` | 剩余毫秒数 |
| 17 | string | `info_1` | — |
| 18 | u32 | `position` | 格位编号 |
| 19 | u32 | `state` | — |
| 20 | u64 | `remain_time` | 剩余毫秒数 |
| 21 | u32 | `mine_id` | — |
| 22 | u32 | `prototype_id` | 建筑原型 ID |
| 23 | u32 | `production` | — |
| 24 | u32 | `total_time` | 总耗时毫秒 |
| 25 | string | `nuclear_description` | 描述文案 |
| 26 | u32 | `capital_state` | — |
| 27 | string | `state_description` | 描述文案 |
| 28 | u8 | `type` | 类型枚举 |
| 29 | string | `message` | — |
| 30 | u32 | `type` | 类型枚举 |
| 31 | u32 | `field_type` | 类型枚举 |
| 32 | string | `city_icon` | 图标编号 |
| 33 | string | `city_name` | 城池名称 |
| 34 | string | `nuclear_icon` | 图标编号 |
| 35 | string | `nuclear_name` | 名称 |
| 36 | string | `alliance_name` | 军团名称 |
| 37 | string | `field_icon` | 图标编号 |
| 38 | string | `field_name` | 名称 |
| 39 | string | `stronghold_icon` | 图标编号 |
| 40 | string | `stronghold_name` | 名称 |
| 41 | u32 | `x` | 地图 X 坐标 |
| 42 | u32 | `y` | 地图 Y 坐标 |
| 43 | string | `remark` | — |
| 44 | u32 | `lines_count` | 数量/计数 |
| 45 | u64 | `expedition_id` | — |
| 46 | u32 | `start_x` | 地图 X 坐标 |
| 47 | u32 | `start_y` | 地图 Y 坐标 |
| 48 | u32 | `end_x` | 地图 X 坐标 |
| 49 | u32 | `end_y` | 地图 Y 坐标 |
| 50 | string | `mark` | — |
| 51 | string | `officer_name` | 名称 |
| 52 | u32 | `officer_icon` | 图标编号 |
| 53 | u32 | `officer_level` | 等级 |
| 54 | u64 | `player_id` | 玩家 ID |
| 55 | string | `player_name` | 玩家名称 |
| 56 | u32 | `avatar` | — |
| 57 | string | `player_name` | 玩家名称 |
| 58 | string | `alliance_name` | 军团名称 |
| 59 | string | `title` | — |
| 60 | string | `title_color` | — |
| 61 | u64 | `oneway_time` | 时间戳（毫秒） |
| 62 | u64 | `remaining_time` | 时间戳（毫秒） |
| 63 | u32 | `state` | — |
| 64 | u32 | `army_count` | 数量/计数 |
| 65 | u32 | `type` | 类型枚举 |
| 66 | u32 | `relationship` | — |
| 67 | u64 | `from_city_id` | 城池 ID |
| 68 | u64 | `target_expedition_id` | — |
| 69 | u32 | `x` | 地图 X 坐标 |
| 70 | u32 | `y` | 地图 Y 坐标 |
| 71 | u64 | `arrived_time` | 时间戳（毫秒） |
| 72 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 73 | u32 | `page_count` | 总页数 |
| 74 | u64 | `trade_id` | — |
| 75 | u8 | `trade_resource_type` | 类型枚举 |
| 76 | u32 | `trade_amount` | 数量 |
| 77 | string | `unit_price` | 单价 |
| 78 | u32 | `total_price` | 单价 |
| 79 | u64 | `trade_time` | 时间戳（毫秒） |
| 80 | u32 | `seller_avatar` | — |
| 81 | string | `seller_nickname` | 玩家昵称 |
| 82 | string | `seller_alliance_name` | 军团名称 |
| 83 | string | `confirm_message` | 服务器要求确认的文案 |

---

### `cmd=14010` — 查询首府基础信息

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `alliance_id` | 军团 ID |

**响应**（status 为 **1** 或 **2** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `alliance_name` | 军团名称 |
| 2 | u32 | `capital_x` | 地图 X 坐标 |
| 3 | u32 | `capital_y` | 地图 Y 坐标 |
| 4 | u32 | `position` | 格位编号 |
| 5 | u32 | `id` | — |
| 6 | string | `name` | 名称 |
| 7 | u32 | `capital_status` | 结果状态 |
| 8 | string | `info_1` | — |
| 9 | string | `info_1` | — |
| 10 | string | `info_2` | — |
| 11 | u32 | `diamond_required` | — |
| 12 | string | `info_1` | — |
| 13 | string | `info_2` | — |
| 14 | u32 | `diamond_required` | — |
| 15 | u64 | `remain_time` | 剩余毫秒数 |
| 16 | string | `info_1` | — |
| 17 | u32 | `position` | 格位编号 |
| 18 | u32 | `state` | — |
| 19 | u64 | `remain_time` | 剩余毫秒数 |
| 20 | u32 | `mine_id` | — |
| 21 | u32 | `prototype_id` | 建筑原型 ID |
| 22 | u32 | `production` | — |
| 23 | u32 | `total_time` | 总耗时毫秒 |
| 24 | string | `nuclear_description` | 描述文案 |
| 25 | u32 | `capital_state` | — |
| 26 | string | `state_description` | 描述文案 |
| 27 | u8 | `type` | 类型枚举 |
| 28 | string | `message` | — |
| 29 | u32 | `type` | 类型枚举 |
| 30 | u32 | `field_type` | 类型枚举 |
| 31 | string | `city_icon` | 图标编号 |
| 32 | string | `city_name` | 城池名称 |
| 33 | string | `nuclear_icon` | 图标编号 |
| 34 | string | `nuclear_name` | 名称 |
| 35 | string | `alliance_name` | 军团名称 |
| 36 | string | `field_icon` | 图标编号 |
| 37 | string | `field_name` | 名称 |
| 38 | string | `stronghold_icon` | 图标编号 |
| 39 | string | `stronghold_name` | 名称 |
| 40 | u32 | `x` | 地图 X 坐标 |
| 41 | u32 | `y` | 地图 Y 坐标 |
| 42 | string | `remark` | — |
| 43 | u32 | `lines_count` | 数量/计数 |
| 44 | u64 | `expedition_id` | — |
| 45 | u32 | `start_x` | 地图 X 坐标 |
| 46 | u32 | `start_y` | 地图 Y 坐标 |
| 47 | u32 | `end_x` | 地图 X 坐标 |
| 48 | u32 | `end_y` | 地图 Y 坐标 |
| 49 | string | `mark` | — |
| 50 | string | `officer_name` | 名称 |
| 51 | u32 | `officer_icon` | 图标编号 |
| 52 | u32 | `officer_level` | 等级 |
| 53 | u64 | `player_id` | 玩家 ID |
| 54 | string | `player_name` | 玩家名称 |
| 55 | u32 | `avatar` | — |
| 56 | string | `player_name` | 玩家名称 |
| 57 | string | `alliance_name` | 军团名称 |
| 58 | string | `title` | — |
| 59 | string | `title_color` | — |
| 60 | u64 | `oneway_time` | 时间戳（毫秒） |
| 61 | u64 | `remaining_time` | 时间戳（毫秒） |
| 62 | u32 | `state` | — |
| 63 | u32 | `army_count` | 数量/计数 |
| 64 | u32 | `type` | 类型枚举 |
| 65 | u32 | `relationship` | — |
| 66 | u64 | `from_city_id` | 城池 ID |
| 67 | u64 | `target_expedition_id` | — |
| 68 | u32 | `x` | 地图 X 坐标 |
| 69 | u32 | `y` | 地图 Y 坐标 |
| 70 | u64 | `arrived_time` | 时间戳（毫秒） |
| 71 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 72 | u32 | `page_count` | 总页数 |
| 73 | u64 | `trade_id` | — |
| 74 | u8 | `trade_resource_type` | 类型枚举 |
| 75 | u32 | `trade_amount` | 数量 |
| 76 | string | `unit_price` | 单价 |
| 77 | u32 | `total_price` | 单价 |
| 78 | u64 | `trade_time` | 时间戳（毫秒） |
| 79 | u32 | `seller_avatar` | — |
| 80 | string | `seller_nickname` | 玩家昵称 |
| 81 | string | `seller_alliance_name` | 军团名称 |
| 82 | string | `confirm_message` | 服务器要求确认的文案 |

---

### `cmd=14011` — 查询核弹矿信息

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `alliance_id` | 军团 ID |

**响应**（status 为 **1** 或 **2** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `position` | 格位编号 |
| 2 | u32 | `state` | — |
| 3 | u64 | `remain_time` | 剩余毫秒数 |
| 4 | u32 | `mine_id` | — |
| 5 | u32 | `prototype_id` | 建筑原型 ID |
| 6 | u32 | `production` | — |
| 7 | u32 | `total_time` | 总耗时毫秒 |
| 8 | string | `nuclear_description` | 描述文案 |
| 9 | u32 | `capital_state` | — |
| 10 | string | `state_description` | 描述文案 |
| 11 | u8 | `type` | 类型枚举 |
| 12 | string | `message` | — |
| 13 | u32 | `type` | 类型枚举 |
| 14 | u32 | `field_type` | 类型枚举 |
| 15 | string | `city_icon` | 图标编号 |
| 16 | string | `city_name` | 城池名称 |
| 17 | string | `nuclear_icon` | 图标编号 |
| 18 | string | `nuclear_name` | 名称 |
| 19 | string | `alliance_name` | 军团名称 |
| 20 | string | `field_icon` | 图标编号 |
| 21 | string | `field_name` | 名称 |
| 22 | string | `stronghold_icon` | 图标编号 |
| 23 | string | `stronghold_name` | 名称 |
| 24 | u32 | `x` | 地图 X 坐标 |
| 25 | u32 | `y` | 地图 Y 坐标 |
| 26 | string | `remark` | — |
| 27 | u32 | `lines_count` | 数量/计数 |
| 28 | u64 | `expedition_id` | — |
| 29 | u32 | `start_x` | 地图 X 坐标 |
| 30 | u32 | `start_y` | 地图 Y 坐标 |
| 31 | u32 | `end_x` | 地图 X 坐标 |
| 32 | u32 | `end_y` | 地图 Y 坐标 |
| 33 | string | `mark` | — |
| 34 | string | `officer_name` | 名称 |
| 35 | u32 | `officer_icon` | 图标编号 |
| 36 | u32 | `officer_level` | 等级 |
| 37 | u64 | `player_id` | 玩家 ID |
| 38 | string | `player_name` | 玩家名称 |
| 39 | u32 | `avatar` | — |
| 40 | string | `player_name` | 玩家名称 |
| 41 | string | `alliance_name` | 军团名称 |
| 42 | string | `title` | — |
| 43 | string | `title_color` | — |
| 44 | u64 | `oneway_time` | 时间戳（毫秒） |
| 45 | u64 | `remaining_time` | 时间戳（毫秒） |
| 46 | u32 | `state` | — |
| 47 | u32 | `army_count` | 数量/计数 |
| 48 | u32 | `type` | 类型枚举 |
| 49 | u32 | `relationship` | — |
| 50 | u64 | `from_city_id` | 城池 ID |
| 51 | u64 | `target_expedition_id` | — |
| 52 | u32 | `x` | 地图 X 坐标 |
| 53 | u32 | `y` | 地图 Y 坐标 |
| 54 | u64 | `arrived_time` | 时间戳（毫秒） |
| 55 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 56 | u32 | `page_count` | 总页数 |
| 57 | u64 | `trade_id` | — |
| 58 | u8 | `trade_resource_type` | 类型枚举 |
| 59 | u32 | `trade_amount` | 数量 |
| 60 | string | `unit_price` | 单价 |
| 61 | u32 | `total_price` | 单价 |
| 62 | u64 | `trade_time` | 时间戳（毫秒） |
| 63 | u32 | `seller_avatar` | — |
| 64 | string | `seller_nickname` | 玩家昵称 |
| 65 | string | `seller_alliance_name` | 军团名称 |
| 66 | string | `confirm_message` | 服务器要求确认的文案 |

---

### `cmd=14013` — 查询首府补给信息

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `alliance_id` | 军团 ID |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `nuclear_amount` | 数量 |
| 2 | u64 | `nuclear_max_amount` | 数量 |
| 3 | u64 | `food_amount` | 粮食储量 |
| 4 | u64 | `food_max_amount` | 数量 |
| 5 | u64 | `steel_amount` | 钢铁储量 |
| 6 | u64 | `steel_max_amount` | 数量 |
| 7 | u64 | `oil_amount` | 石油储量 |
| 8 | u64 | `oil_max_amount` | 数量 |
| 9 | u64 | `mineral_amount` | 稀矿储量 |
| 10 | u64 | `mineral_max_amount` | 数量 |
| 11 | u64 | `officer_id` | — |
| 12 | string | `officer_name` | 名称 |
| 13 | u32 | `icon` | 图标编号 |
| 14 | u32 | `is_special_officer` | 布尔标记（0/1） |
| 15 | u32 | `level` | 等级 |
| 16 | u32 | `status` | 结果状态 |
| 17 | u32 | `star` | — |
| 18 | u32 | `military_without_item_and_troop` | 道具 |
| 19 | u32 | `knowledge_without_item_and_troop` | 道具 |
| 20 | u32 | `logistics_without_item_and_troop` | 道具 |
| 21 | u32 | `army_id` | 兵种 ID |
| 22 | u32 | `amount` | 数量 |
| 23 | u32 | `fortress_id` | — |
| 24 | string | `name` | 名称 |
| 25 | u8 | `state` | — |
| 26 | u32 | `defence` | — |
| 27 | u32 | `defence_max` | — |
| 28 | string | `officer_name` | 名称 |
| 29 | string | `garrision_officer_name` | 名称 |
| 30 | u32 | `army_id` | 兵种 ID |
| 31 | u32 | `amount` | 数量 |

---

### `cmd=14014` — 查询首府科技信息

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `nuclear_mine_count` | 数量/计数 |
| 2 | u32 | `capital_level` | 等级 |
| 3 | u32 | `nuclear_donated` | — |
| 4 | u32 | `capital_tech_id` | — |
| 5 | string | `name` | 名称 |
| 6 | u32 | `level` | 等级 |
| 7 | u32 | `is_max_level` | 等级 |
| 8 | u32 | `upgradeable` | — |
| 9 | string | `description` | 描述文案 |
| 10 | string | `level_description` | 描述文案 |
| 11 | string | `next_level_description` | 描述文案 |
| 12 | u32 | `saved_nuclear` | — |
| 13 | u32 | `upgrade_required_nuclear` | — |
| 14 | u32 | `upgrade_required_capital_level` | 等级 |

---

### `cmd=14015` — 升级首府科技

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `capital_tech_id` | — |
| 2 | u32 | `nuclear_donate_count` | 数量/计数 |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `message` | — |

---

### `cmd=14020` — 问题反馈

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `nuclear_amount` | 数量 |
| 2 | u64 | `food_amount` | 粮食储量 |
| 3 | u64 | `steel_amount` | 钢铁储量 |
| 4 | u64 | `oil_amount` | 石油储量 |
| 5 | u64 | `mineral_amount` | 稀矿储量 |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `message` | — |
