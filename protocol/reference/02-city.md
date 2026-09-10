# 城池与资源

> 27 个命令（cmd 2001 ~ 2030）。所有响应均以 1 字节 status 打头，成功值见各条目。

### `cmd=2001` — 查询城池列表

**请求参数**: 无

**响应**（当前服务器实测布局）:

> `u8 is_join_league_war + u8 city_count` 后循环条目。该布局与客户端基线不同：没有 `have_researching_tech` 相关字段，条目尾部多 1 个未知字节。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `is_join_league_war` | 是否加入军团战 |
| 2 | u8 | `city_count` | 城池数量 |
| 3 | u64 | `city_id` | 城池 ID |
| 4 | string | `city_name` | 城池名称 |
| 5 | u32 | `x` | 地图 X 坐标 |
| 6 | u32 | `y` | 地图 Y 坐标 |
| 7 | string | `mayor` | 驻守市长名 |
| 8 | u32 | `population` | 人口数 |
| 9 | u32 | `morale` | 士气值 |
| 10 | u32 | `coastal` | — |
| 11 | u32 | `has_carrier` | — |
| 12 | string | `img_id` | 城池外观标识 |
| 13 | u8 | `is_colonial` | 是否殖民城 |
| 14 | u32 | `mayor_icon` | 市长图标 |
| 15 | u32 | `construct_num` | 建造队列数 |
| 16 | u32 | `help_num` | 互助数 |
| 17 | u32 | `league_score_plunderable` | 仅 `is_join_league_war=1` 时存在 |
| 18 | u32 | `training_count` | 训练队列数 |
| 19 | u32 | `officer_count` | 名将数 |
| 20 | u32 | `officer_count_max` | 名将上限 |
| 21 | u8 | `unknown_tail` | 未解尾字段 |

---

### `cmd=2002` — 切换主城

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `city_id` | 城池 ID |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `city_id` | 城池 ID |

---

### `cmd=2003` — 查询城内资源

**请求参数**: 无

**响应**（当前服务器实测布局；客户端定义的 long 版本仅作基线，不能直接用于造兵脚本）:

> 每种资源块为 24B；储量在块内 +0、容量 +4（2026-09-10 复核：粮/钢/矿/油四块容量确认，黄金/人口块未逐项验证）。
> 储量可超过容量（运输可超上限），超容量部分不再自然增长。

| 资源 | 偏移 | 类型 | 字段 |
|---|---:|---|---|
| 粮食 | +4 | u32 | `food_amount` |
| 粮食容量 | +8 | u32 | `food_capacity` |
| 钢铁 | +32 | u32 | `steel_amount` |
| 钢铁容量 | +36 | u32 | `steel_capacity` |
| 稀矿 | +52 | u32 | `mineral_amount` |
| 稀矿容量 | +56 | u32 | `mineral_capacity` |
| 石油 | +72 | u32 | `oil_amount` |
| 石油容量 | +76 | u32 | `oil_capacity` |

---

### `cmd=2004` — 迁城到指定坐标

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `type` | 类型枚举 |
| 2 | u32 | `new_x` | 地图 X 坐标 |
| 3 | u32 | `new_y` | 地图 Y 坐标 |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `new_x` | 地图 X 坐标 |
| 2 | u32 | `new_y` | 地图 Y 坐标 |

---

### `cmd=2006` — 查询城市外观列表

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 2 | u32 | `page_size` | 每页条数 |
| 3 | u64 | `city_id` | 城池 ID |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `page_count` | 总页数 |
| 2 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 3 | u32 | `city_avatar_id` | — |
| 4 | string | `image_id` | — |
| 5 | string | `city_avatar_name` | 名称 |
| 6 | u32 | `orignal_price` | 单价 |
| 7 | u8 | `promotion` | — |
| 8 | u32 | `promotion_price` | 单价 |
| 9 | u64 | `promotion_start_time` | 开始时间戳 |
| 10 | u64 | `promotion_end_time` | 结束时间戳 |
| 11 | u8 | `restriction` | — |
| 12 | u64 | `restriction_start_time` | 开始时间戳 |
| 13 | u64 | `restriction_endtime` | 时间戳（毫秒） |
| 14 | u8 | `purchase_able` | 布尔标记（0/1） |
| 15 | u8 | `already_purchased` | — |
| 16 | u8 | `current_actived` | — |
| 17 | u64 | `remain_or_duration_time` | 时间戳（毫秒） |

---

### `cmd=2007` — 购买城市外观

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `city_id` | 城池 ID |
| 2 | u32 | `city_avatar_id` | — |
| 3 | u8 | `price_mode` | 单价 |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=2008` — 查询城市外观信息

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `city_id` | 城池 ID |
| 2 | u32 | `city_avatar_id` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `city_avatar_id` | — |
| 2 | string | `image_id` | — |
| 3 | string | `city_avatar_name` | 名称 |
| 4 | u32 | `orignal_price` | 单价 |
| 5 | u8 | `already_purchased` | — |
| 6 | u8 | `current_actived` | — |
| 7 | u64 | `remain_or_duration_time` | 时间戳（毫秒） |
| 8 | u8 | `purchase_able` | 布尔标记（0/1） |
| 9 | u8 | `fame_condition_done` | 声望值 |
| 10 | u64 | `fame_required` | 声望值 |
| 11 | u8 | `attribute_condition_done` | — |
| 12 | u32 | `attribute_military_required` | — |
| 13 | u32 | `attribute_logistics_required` | — |
| 14 | u32 | `attribute_knowledge_required` | — |
| 15 | u8 | `restriction` | — |
| 16 | u64 | `restriction_start_time` | 开始时间戳 |
| 17 | u8 | `promotion` | — |
| 18 | u32 | `promotion_price` | 单价 |
| 19 | u64 | `promotion_start_time` | 开始时间戳 |
| 20 | u32 | `promotion_price` | 单价 |

---

### `cmd=2009` — 激活城市外观

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `use_type` | 类型枚举 |
| 2 | u64 | `city_id` | 城池 ID |
| 3 | u32 | `city_avatar_id` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `image_id` | — |

---

### `cmd=2010` — 设置防征服阵型

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `city_id` | 城池 ID |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `conquer_time` | 时间戳（毫秒） |
| 2 | u32 | `chongfeng_value` | — |
| 3 | u32 | `max_count` | 数量/计数 |
| 4 | u32 | `army_id` | 兵种 ID |
| 5 | string | `name` | 名称 |
| 6 | u32 | `owned_amount` | 数量 |
| 7 | u32 | `play_amount` | 数量 |
| 8 | u32 | `action_cmd` | — |

---

### `cmd=2012` — 保存城防设置

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `city_id` | 城池 ID |
| 2 | u32 | `type` | 类型枚举 |
| 3 | u32 | `send_army_list.length` | — |
| 4 | 循环 | — | 按前导计数字段循环写入后续字段 |
| 5 | u32 | `t.army_id` | — |
| 6 | u32 | `t.play_amount` | 数量 |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=2013` — 设置防掠夺阵型

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `city_id` | 城池 ID |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `conquer_time` | 时间戳（毫秒） |
| 2 | u32 | `chongfeng_value` | — |
| 3 | u32 | `max_count` | 数量/计数 |
| 4 | u32 | `army_id` | 兵种 ID |
| 5 | string | `name` | 名称 |
| 6 | u32 | `owned_amount` | 数量 |
| 7 | u32 | `play_amount` | 数量 |
| 8 | u32 | `action_cmd` | — |

---

### `cmd=2014` — 查询仓库配置

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `storage_count` | 数量/计数 |
| 2 | u32 | `storage_volume` | — |
| 3 | u8 | `food_percent` | — |
| 4 | u8 | `steel_percent` | — |
| 5 | u8 | `oil_percent` | — |
| 6 | u8 | `mineral_percent` | — |

---

### `cmd=2015` — 更新仓库保护配置

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `food_percent` | — |
| 2 | u8 | `steel_percent` | — |
| 3 | u8 | `oil_percent` | — |
| 4 | u8 | `mineral_percent` | — |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=2016` — 发布士气政令

**请求参数**: 无

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=2017` — 发布人口政令

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `item_id` | 道具 ID |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=2018` — 查询产量加成

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `production_capacity` | 容量上限 |
| 2 | u32 | `max_population` | 人口数 |
| 3 | u32 | `working_rate` | — |
| 4 | u32 | `nature_addition` | — |
| 5 | u32 | `technology_addition_percent` | — |
| 6 | u32 | `army_addition` | — |
| 7 | u32 | `officer_addition_percent` | — |
| 8 | u32 | `item_addition_percent` | 道具 |
| 9 | u32 | `title_addition_percent` | — |
| 10 | u32 | `country_mettle_addition_percent` | — |

---

### `cmd=2019` — 调整税率

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `new_tax_rate` | — |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=2020` — 免费发布士气/人口政令

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `type` | 类型枚举 |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=2021` — 城市改名

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `new_name` | 名称 |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `new_name` | 名称 |

---

### `cmd=2022` — 放弃城池

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `city_id` | 城池 ID |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=2023` — 野外筑城

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `tile_id` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `message` | — |
| 2 | u64 | `new_city_id` | 城池 ID |

---

### `cmd=2025` — 随机迁城

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `area_id` | — |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=2026` — 查询资源生产信息

> 实测修正：服务器下发 Body 全长固定 100 字节（大端序）。
> 粮食块 24B（含 8B 军粮消耗），钢铁/稀矿/石油块各 16B（8B 储量 + 4B 容量 + 4B 基础产量）。
> 黄金与人口字段固定在尾部，不受驻军种类影响。空闲人口在部队超编时会出现负数（按有符号 i32 读取）。

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 偏移 | 顺序 | 类型 | 字段 | 说明 |
|---:|---|---|---|---|
| +0 | 1 | u64 | `food_amount` | 粮食储量（高 4B 在 +0，低 4B 在 +4） |
| +8 | 2 | u32 | `food_capacity` | 粮食容量上限 |
| +12 | 3 | u32 | `food_basic_output` | 粮食基础产量 |
| +16 | 4 | u64 | `food_army_used` | 军队粮食消耗 |
| +20 | 5 | u64 | `steel_amount` | 钢铁储量（高 4B 在 +20，低 4B 在 +24） |
| +28 | 6 | u32 | `steel_capacity` | 钢铁容量上限 |
| +32 | 7 | u32 | `steel_basic_output` | 钢铁基础产量 |
| +36 | 8 | u64 | `mineral_amount` | 稀矿储量（高 4B 在 +36，低 4B 在 +40） |
| +44 | 9 | u32 | `mineral_capacity` | 稀矿容量上限 |
| +48 | 10 | u32 | `mineral_basic_output` | 稀矿基础产量 |
| +52 | 11 | u64 | `oil_amount` | 石油储量（高 4B 在 +52，低 4B 在 +56） |
| +60 | 12 | u32 | `oil_capacity` | 石油容量上限 |
| +64 | 13 | u32 | `oil_basic_output` | 产量基础产量 |
| +68 | 14 | u32 | `gold_amount` | 黄金储量 |
| +72 | 15 | u32 | `gold_capacity` | 黄金容量上限（特化城通常为 5500 万） |
| +76 | 16 | u32 | `gold_basic_output` | 黄金基础税收 |
| +80 | 17 | u32 | `gold_title_extra_add` | 黄金称号加成 |
| +84 | 18 | u32 | `gold_output` | 黄金净产量 |
| +88 | 19 | u32 | `population_amount` | 当前人口 |
| +92 | 20 | u32 | `population_capacity` | 人口上限 |
| +96 | 21 | i32 | `population_idle` | 空闲人口（负数表示部队超编） |

---

### `cmd=2027` — 查询政令状态

> 实测修正：Body 固定 68 字节 + 变长文案，布局与客户端基线一致。
> 返回当前城的民心、民怨、民心趋势、黄金与人口明细，需先 `2002` 切城再查询。
> 民怨非 0 时客户端以红色高亮显示；民心趋势为正表示持续回升。

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 偏移 | 顺序 | 类型 | 字段 | 说明 |
|---:|---|---|---|---|
| +0 | 1 | i32 | `morale` | 民心值 |
| +4 | 2 | i32 | `grievance` | 民怨值（>0 触发红色预警） |
| +8 | 3 | i32 | `morale_trend` | 民心趋势（正=回升） |
| +12 | 4 | i32 | `gold_amount` | 黄金储量 |
| +16 | 5 | i32 | `gold_capacity` | 黄金容量 |
| +20 | 6 | i32 | `tax_rate` | 当前税率（百分比） |
| +24 | 7 | i32 | `gold_basic_output` | 黄金基础产出 |
| +28 | 8 | i32 | `gold_title_extra_add` | 称号加成 |
| +32 | 9 | i32 | `gold_officer_used` | 名将俸禄消耗 |
| +36 | 10 | i32 | `gold_output` | 黄金净产出 |
| +40 | 11 | i32 | `population_amount` | 当前人口 |
| +44 | 12 | i32 | `population_capacity` | 人口上限 |
| +48 | 13 | i32 | `population_in_working` | 务工人口 |
| +52 | 14 | i32 | `population_idle` | 空闲人口 |
| +56 | 15 | i32 | `population_trend` | 人口趋势 |
| +60 | 16 | i32 | `remaining_time` | 政令剩余毫秒数 |
| +64 | 17 | i32 | `diamond_cost_to_appease` | 钻石安抚民怨开销 |
| — | 18 | string | `rule_description` | 描述文案 |

---

### `cmd=2028` — 城市随机起名

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `random_id` | — |
| 2 | string | `random_name` | 名称 |
| 3 | u64 | `expire_time` | 时间戳（毫秒） |

---

### `cmd=2029` — 提交布阵

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `formation_config` | — |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=2030` — 城市资源速览

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `formation_config` | — |
