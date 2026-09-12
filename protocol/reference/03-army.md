# 军队与训练

> 14 个命令（cmd 3001 ~ 3015）。所有响应均以 1 字节 status 打头，成功值见各条目。

### `cmd=3001` — 训练军队

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `building_id` | 建筑实例 ID |
| 2 | u32 | `army_id` | 兵种 ID |
| 3 | u32 | `amount` | 数量 |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

> 同厂可连续下多单并行排队。训练条件与单价查询见 cmd=3006；兵种原型 ID 对照：BuildingType 枚举
> 14=军工厂(ARMS_PLANT)、18=机场(AIRPORT)，训练空军兵种需城中机场。
>
> **训练受空闲人口硬约束（实测）**：下单**即时占用**空闲人口（每单位占 3007 的 `population` 值，如侦察机 1、卡车 2），
> 城内空闲人口不足时下单会被拒——用 2026 `population_idle`（+96，有符号）除以每单位人口
> 得「人口允许的最大训练量」，它是与资源并列的独立上限，规划训练量时必须取 min(资源允许, 人口允许)。
> 空闲人口随下单立即扣减：本批订单占满人口后，同批后续订单即被拒，需等人口条件变化后下次运行再发。

---

### `cmd=3002` — 解散军队

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `army_id` | 兵种 ID |
| 2 | u32 | `amount` | 数量 |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `army_id` | 兵种 ID |
| 2 | u32 | `amount` | 数量 |

---

### `cmd=3003` — 取消训练

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `building_id` | 建筑实例 ID |
| 2 | u64 | `training_id` | 训练队列 ID |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=3004` — 训练并自动分城

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `building_id` | 建筑实例 ID |
| 2 | u32 | `army_id` | 兵种 ID |
| 3 | u32 | `amount` | 数量 |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=3005` — 查询训练队列

> 实测修正：包含条件字段。先读 `u32 count`，每个条目先读 `u64 building_id`、`u32 building_position`、`u32 status`。
> 仅在 `status == 1` 时才跟后续队列 4 个字段（`training_id`、`army_id`、`remain_time`、`total_time`）；`status == 0` 表示该厂当前空闲无在产队列。

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `building_id` | 建筑实例 ID |
| 2 | u32 | `building_position` | 格位编号 |
| 3 | u32 | `status` | 生产状态（0=空闲, 1=在产） |
| 4 | u64 | `training_id` | 训练队列 ID（仅 `status=1` 时存在） |
| 5 | u32 | `army_id` | 兵种 ID（仅 `status=1` 时存在） |
| 6 | u64 | `remain_time` | 剩余毫秒数（仅 `status=1` 时存在） |
| 7 | u64 | `total_time` | 总耗时毫秒（仅 `status=1` 时存在） |

---

### `cmd=3006` — 查询兵营信息

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `building_id` | 建筑实例 ID |

**响应**（当前服务器实测布局）:

> 头部为 `u32 ignored + u32 queue_count`；随后是训练队列，再是 `u32 trainable_count` 与每个兵种规格。列表中的建筑/科技/道具条件由各自计数前缀控制。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `ignored` | 客户端读取但未使用 |
| 2 | u32 | `queue_count` | 训练队列条数 |
| 3 | u64 | `training_id` | 每条队列 |
| 4 | u32 | `army_id` | 每条队列 |
| 5 | u32 | `amount` | 每条队列 |
| 6 | u64 | `remain_time` | 每条队列 |
| 7 | u64 | `total_time` | 每条队列 |
| 8 | u8 | `allow_speedup` | 每条队列 |
| 9 | u32 | `trainable_count` | 可训练兵种条数 |
| 10 | u32 | `army_id` | 每个兵种规格 |
| 11 | u32 | `cur_amount` | 当前数量 |
| 12 | u32 | `food_required` | 单位粮食消耗 |
| 13 | u32 | `mineral_required` | 单位稀矿消耗 |
| 14 | u32 | `oil_required` | 单位石油消耗 |
| 15 | u32 | `steel_required` | 单位钢铁消耗 |
| 16 | u32 | `nuclear_required` | 单位核资源消耗 |
| 17 | u32 | `building_requirement_count` | 后续为 N×(prototype_id, level, cur_level) |
| 18 | u32 | `tech_requirement_count` | 后续为 N×(technique_id, level, cur_level) |
| 19 | u32 | `item_requirement_count` | 后续为 N×(item_id, name, amount, cur_amount) |
| 20 | u64 | `time` | 单位训练耗时 |
| 21 | u32 | `speedup_item_price` | 单价 |

> **实测补充（3006 尾字段结构）**：每个兵种规格依次为 `army_id, cur_amount, food/mineral/oil/steel/nuclear_required, 建筑条件, 科技条件, 道具条件, time(u64)`；
> **`speedup_item_price` 不是每条规格的字段**——所有规格读完后整包末尾只有 1 个 u32（客户端基线亦为循环外 `this.speedupItemPrice = e.readInt()`，语义=整包共用的加速道具价格）。
> 侦察机（armyId=9）实测单价：粮50 钢150 矿50 油100，单架训练耗时约 31s（随城/加成浮动，脚本应以 3006 实时返回为准，勿硬编码）。
> 造兵脚本硬编码单价会对「城内资源够不够造」产生数十倍误判——务必从 3006 实时读取。
> XXX城实测整包 1951B：规格区结束于 1947，尾部 u32 = 350（即 speedup_item_price）。

---

### `cmd=3007` — 查询兵种原型表

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 响应包含**连续两段**原型列表：每段先读 `u32 count`，再读下表的 N 个原型。客户端将两段分别保存为 `prototypes[0]`、`prototypes[1]`；`w2train.js` 两段都会扫描以取得兵种名。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `racial` | — |
| 2 | u32 | `army_id` | 兵种 ID |
| 3 | u32 | `army_type` | 类型枚举 |
| 4 | string | `army_name` | 名称 |
| 5 | string | `general_name` | 名称 |
| 6 | u32 | `hp` | — |
| 7 | u32 | `land_attack` | — |
| 8 | u32 | `air_attack` | — |
| 9 | u32 | `sea_attack` | — |
| 10 | u32 | `fort_attack` | — |
| 11 | u32 | `defence` | — |
| 12 | u32 | `move_speed` | — |
| 13 | u32 | `attack_speed` | — |
| 14 | u32 | `attack_range` | — |
| 15 | u32 | `load_weight` | 载重（3=卡车 1200、9=侦察机 5，实测） |
| 16 | u32 | `population` | 人口数 |
| 17 | u32 | `food_cost` | 训练耗粮 |
| 18 | u32 | `oil_cost` | 行军油耗/单位（3=卡车 15、9=侦察机 20，实测） |
| 19 | u32 | `power_score` | 积分 |

---

### `cmd=3008` — 查询伤兵列表

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | readDouble | `arg_for_gold_heal` | — |
| 2 | u64 | `die_remaining` | — |
| 3 | u32 | `army_id` | 兵种 ID |
| 4 | u32 | `amount` | 数量 |
| 5 | u32 | `heal_price_gold` | 单价 |

---

### `cmd=3010` — 查询逃跑军队

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 2 | u32 | `page_size` | 每页条数 |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `max_keep_hours` | 上限 |
| 2 | u32 | `escaped_list_item_count` | 数量/计数 |
| 3 | u32 | `page_count` | 总页数 |
| 4 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 5 | u64 | `remain_time_in_second` | 剩余毫秒数 |
| 6 | u64 | `escaped_id` | — |
| 7 | u32 | `army_id` | 兵种 ID |
| 8 | u32 | `amount` | 数量 |

---

### `cmd=3011` — 查询逃跑军队详情

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `escaped_id` | — |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `escaped_id` | — |
| 2 | u32 | `army_id` | 兵种 ID |
| 3 | u64 | `amount` | 数量 |
| 4 | string | `price` | 单价 |
| 5 | u32 | `diamond_owned` | 当前钻石数 |
| 6 | u32 | `gold_amount` | 黄金储量 |
| 7 | u32 | `queued_count` | 数量/计数 |
| 8 | u32 | `max_queue_count` | 数量/计数 |
| 9 | u32 | `gold_arg` | — |
| 10 | u32 | `diamond_arg` | — |
| 11 | u32 | `mul_arg` | — |
| 12 | u32 | `time_by_gold` | 时间戳（毫秒） |
| 13 | u32 | `time_by_diamond` | 时间戳（毫秒） |
| 14 | u8 | `hide_diamond_recall_button` | — |

---

### `cmd=3012` — 查询逃跑召回队列

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u32 | `max_queue_count` | 数量/计数 |
| 2 | u32 | `queued_count` | 数量/计数 |
| 3 | u32 | `army_id` | 兵种 ID |
| 4 | u32 | `amount` | 数量 |
| 5 | u64 | `remain_time_in_second` | 剩余毫秒数 |

---

### `cmd=3013` — 召回逃跑军队

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `escaped_id` | — |
| 2 | u8 | `recall_mode` | — |
| 3 | u32 | `price` | 单价 |
| 4 | u32 | `amount` | 数量 |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=3014` — 治疗伤兵

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `heal_mode` | — |
| 2 | u32 | `total_price` | 单价 |
| 3 | u32 | `armies.length` | — |
| 4 | 循环 | — | 按前导计数字段循环写入后续字段 |
| 5 | u32 | `i.army_id` | — |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=3015` — 训练加速

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `training_id` | 训练队列 ID |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。
