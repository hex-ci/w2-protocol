# 排行榜

> 12 个命令（cmd 24001 ~ 24017）。所有响应均以 1 字节 status 打头，成功值见各条目。

### `cmd=24001` — 排行榜信息

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 2 | u32 | `page_size` | 每页条数 |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `ranking_update_time` | 名次 |
| 2 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 3 | u32 | `page_count` | 总页数 |
| 4 | u64 | `player_id` | 玩家 ID |
| 5 | u32 | `ranking` | 名次 |
| 6 | u32 | `ranking_trend` | 名次 |
| 7 | string | `nickname` | 玩家昵称 |
| 8 | u32 | `avatar` | — |
| 9 | string | `alliance_name` | 军团名称 |
| 10 | u8 | `rank` | 军衔等级 |
| 11 | u64 | `fame` | 声望值 |
| 12 | u8 | `city_count` | 城池数量 |
| 13 | u32 | `total_population` | 人口数 |

---

### `cmd=24002` — 查询玩家排行

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `player_id` | 玩家 ID |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `head` | — |
| 2 | string | `name` | 名称 |
| 3 | u32 | `alliance_id` | 军团 ID |
| 4 | string | `alliance_name` | 军团名称 |
| 5 | u32 | `badge` | — |
| 6 | u8 | `alliance_position` | 格位编号 |
| 7 | u32 | `ranking` | 名次 |
| 8 | u64 | `fame` | 声望值 |
| 9 | u8 | `city_count` | 城池数量 |
| 10 | u32 | `population` | 人口数 |
| 11 | u8 | `rank` | 军衔等级 |
| 12 | u8 | `position` | 格位编号 |
| 13 | u32 | `exploit_ranking` | 名次 |
| 14 | u32 | `exploits` | — |
| 15 | string | `battle_ranking` | 名次 |
| 16 | u8 | `bind_type` | 类型枚举 |
| 17 | u64 | `sina_id` | — |
| 18 | u64 | `facebook_id` | — |
| 19 | u64 | `personal_score` | 积分 |
| 20 | u64 | `influence` | 影响力 |

---

### `cmd=24004` — 城池排行

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 2 | u32 | `page_size` | 每页条数 |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 2 | u32 | `page_count` | 总页数 |
| 3 | u32 | `ranking` | 名次 |
| 4 | string | `img_id` | — |
| 5 | string | `city_name` | 城池名称 |
| 6 | string | `nickname` | 玩家昵称 |
| 7 | string | `alliance_name` | 军团名称 |
| 8 | u32 | `x` | 地图 X 坐标 |
| 9 | u32 | `y` | 地图 Y 坐标 |
| 10 | u32 | `population` | 人口数 |

---

### `cmd=24006` — 名将排行

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 2 | u32 | `page_size` | 每页条数 |
| 3 | u8 | `order_type` | 类型枚举 |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 2 | u32 | `page_count` | 总页数 |
| 3 | u64 | `officer_id` | — |
| 4 | u32 | `icon` | 图标编号 |
| 5 | u32 | `ranking` | 名次 |
| 6 | string | `officer_name` | 名称 |
| 7 | u32 | `level` | 等级 |
| 8 | u32 | `logistics` | — |
| 9 | u32 | `military` | — |
| 10 | u32 | `knowledge` | — |
| 11 | u8 | `star` | — |
| 12 | u8 | `is_special_officer` | 布尔标记（0/1） |

---

### `cmd=24007` — 军团首府排行

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 2 | u32 | `page_size` | 每页条数 |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `my_alliance_ranking` | 军团 |
| 2 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 3 | u32 | `page_count` | 总页数 |
| 4 | u64 | `alliance_capital_id` | 军团 |
| 5 | u32 | `badge_id` | — |
| 6 | u32 | `ranking` | 名次 |
| 7 | string | `alliance_name` | 军团名称 |
| 8 | u32 | `alliance_capital_level` | 军团 |
| 9 | u32 | `alliance_capital_status` | 军团 |
| 10 | u32 | `alliance_id` | 军团 ID |

---

### `cmd=24008` — 军团排行

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 2 | u32 | `page_size` | 每页条数 |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 2 | u32 | `page_count` | 总页数 |
| 3 | u32 | `alliance_id` | 军团 ID |
| 4 | u32 | `badge_id` | — |
| 5 | u32 | `ranking` | 名次 |
| 6 | u32 | `ranking_trend` | 名次 |
| 7 | string | `alliance_name` | 军团名称 |
| 8 | string | `leader_name` | 名称 |
| 9 | u32 | `member_count` | 数量/计数 |
| 10 | u64 | `fame` | 声望值 |
| 11 | u8 | `alliance_war_join_state` | 军团 |
| 12 | u32 | `badge_id` | — |

---

### `cmd=24010` — 按名称搜索排行

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `ranking_type` | 名次 |
| 2 | string | `keyword` | — |
| 3 | u8 | `order_type` | 类型枚举 |
| 4 | u32 | `page_size` | 每页条数 |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `ranking_type` | 名次 |
| 2 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 3 | u32 | `page_count` | 总页数 |
| 4 | u64 | `player_id` | 玩家 ID |
| 5 | u32 | `ranking` | 名次 |
| 6 | u32 | `ranking_trend` | 名次 |
| 7 | string | `nickname` | 玩家昵称 |
| 8 | u32 | `avatar` | — |
| 9 | string | `alliance_name` | 军团名称 |
| 10 | u8 | `rank` | 军衔等级 |
| 11 | u64 | `fame` | 声望值 |
| 12 | u8 | `city_count` | 城池数量 |
| 13 | u32 | `total_population` | 人口数 |
| 14 | u32 | `alliance_id` | 军团 ID |
| 15 | u32 | `badge_id` | — |
| 16 | u32 | `ranking` | 名次 |
| 17 | u32 | `ranking_trend` | 名次 |
| 18 | string | `alliance_name` | 军团名称 |
| 19 | string | `leader_name` | 名称 |
| 20 | u32 | `member_count` | 数量/计数 |
| 21 | u64 | `fame` | 声望值 |
| 22 | u8 | `alliance_war_join_state` | 军团 |
| 23 | u32 | `badge_id` | — |
| 24 | u64 | `officer_id` | — |
| 25 | u32 | `icon` | 图标编号 |
| 26 | u32 | `ranking` | 名次 |
| 27 | string | `officer_name` | 名称 |
| 28 | u32 | `level` | 等级 |
| 29 | u32 | `logistics` | — |
| 30 | u32 | `military` | — |
| 31 | u32 | `knowledge` | — |
| 32 | u8 | `star` | — |
| 33 | u8 | `is_special_officer` | 布尔标记（0/1） |
| 34 | u32 | `ranking` | 名次 |
| 35 | string | `img_id` | — |
| 36 | string | `city_name` | 城池名称 |
| 37 | string | `nickname` | 玩家昵称 |
| 38 | string | `alliance_name` | 军团名称 |
| 39 | u32 | `x` | 地图 X 坐标 |
| 40 | u32 | `y` | 地图 Y 坐标 |
| 41 | u32 | `population` | 人口数 |
| 42 | u64 | `alliance_capital_id` | 军团 |
| 43 | u32 | `badge_id` | — |
| 44 | u32 | `ranking` | 名次 |
| 45 | string | `alliance_name` | 军团名称 |
| 46 | u32 | `alliance_capital_level` | 军团 |
| 47 | u32 | `alliance_capital_status` | 军团 |
| 48 | u32 | `alliance_id` | 军团 ID |
| 49 | u32 | `alliance_id` | 军团 ID |
| 50 | u32 | `badge_id` | — |
| 51 | u32 | `ranking` | 名次 |
| 52 | u32 | `ranking_trend` | 名次 |
| 53 | string | `alliance_name` | 军团名称 |
| 54 | string | `leader_name` | 名称 |
| 55 | u32 | `member_count` | 数量/计数 |
| 56 | u64 | `alliance_score` | 军团 |
| 57 | u64 | `player_id` | 玩家 ID |
| 58 | u32 | `ranking` | 名次 |
| 59 | string | `nickname` | 玩家昵称 |
| 60 | u32 | `avatar` | — |
| 61 | string | `alliance_name` | 军团名称 |
| 62 | u8 | `rank` | 军衔等级 |
| 63 | u64 | `personal_score` | 积分 |
| 64 | u64 | `player_id` | 玩家 ID |
| 65 | u32 | `ranking` | 名次 |
| 66 | u32 | `ranking_trend` | 名次 |
| 67 | string | `nickname` | 玩家昵称 |
| 68 | u32 | `avatar` | — |
| 69 | string | `alliance_name` | 军团名称 |
| 70 | u64 | `influence` | 影响力 |
| 71 | u32 | `alliance_id` | 军团 ID |
| 72 | u32 | `badge_id` | — |
| 73 | u32 | `ranking` | 名次 |
| 74 | u32 | `ranking_trend` | 名次 |
| 75 | string | `alliance_name` | 军团名称 |
| 76 | string | `leader_name` | 名称 |
| 77 | u32 | `member_count` | 数量/计数 |
| 78 | u64 | `influence` | 影响力 |

---

### `cmd=24011` — 查询自己名次

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `ranking_type` | 名次 |
| 2 | u32 | `page_size` | 每页条数 |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `ranking_type` | 名次 |
| 2 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 3 | u32 | `my_ranking` | 名次 |

---

### `cmd=24013` — 个人积分榜

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 2 | u32 | `page_size` | 每页条数 |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 2 | u32 | `page_count` | 总页数 |
| 3 | u64 | `player_id` | 玩家 ID |
| 4 | u32 | `ranking` | 名次 |
| 5 | string | `nickname` | 玩家昵称 |
| 6 | u32 | `avatar` | — |
| 7 | string | `alliance_name` | 军团名称 |
| 8 | u8 | `rank` | 军衔等级 |
| 9 | u64 | `personal_score` | 积分 |

---

### `cmd=24015` — 军团积分榜

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 2 | u32 | `page_size` | 每页条数 |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 2 | u32 | `page_count` | 总页数 |
| 3 | u32 | `alliance_id` | 军团 ID |
| 4 | u32 | `badge_id` | — |
| 5 | u32 | `ranking` | 名次 |
| 6 | u32 | `ranking_trend` | 名次 |
| 7 | string | `alliance_name` | 军团名称 |
| 8 | string | `leader_name` | 名称 |
| 9 | u32 | `member_count` | 数量/计数 |
| 10 | u64 | `alliance_score` | 军团 |

---

### `cmd=24016` — 影响力排行榜

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 2 | u32 | `page_size` | 每页条数 |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `ranking_update_time` | 名次 |
| 2 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 3 | u32 | `page_count` | 总页数 |
| 4 | u64 | `player_id` | 玩家 ID |
| 5 | u32 | `ranking` | 名次 |
| 6 | u32 | `ranking_trend` | 名次 |
| 7 | string | `nickname` | 玩家昵称 |
| 8 | u32 | `avatar` | — |
| 9 | string | `alliance_name` | 军团名称 |
| 10 | u64 | `influence` | 影响力 |

---

### `cmd=24017` — 军团影响力榜

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 2 | u32 | `page_size` | 每页条数 |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 2 | u32 | `page_count` | 总页数 |
| 3 | u32 | `alliance_id` | 军团 ID |
| 4 | u32 | `badge_id` | — |
| 5 | u32 | `ranking` | 名次 |
| 6 | u32 | `ranking_trend` | 名次 |
| 7 | string | `alliance_name` | 军团名称 |
| 8 | string | `leader_name` | 名称 |
| 9 | u32 | `member_count` | 数量/计数 |
| 10 | u64 | `influence` | 影响力 |
