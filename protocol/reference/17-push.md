# 服务端推送（Broadcast）

> 23 个命令（cmd 26001 ~ 26027）

#### `cmd=26001` — broadcast flashlight 26001 ｜ 推送

- 常量: `Constant.PROT_BROADCAST_FLASHLIGHT_26001`
- 成功判定: `status!0`

**请求参数**: 无（类未定义 encode）

**推送数据**（按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `_status` |
| 2 | int | `type` |
| 3 | byte | `level` |

---

#### `cmd=26002` — broadcast force switch city 26002 ｜ 推送

- 常量: `Constant.PROT_BROADCAST_FORCE_SWITCH_CITY_26002`
- 成功判定: `status!0`

**请求参数**: 无（类未定义 encode）

**推送数据**（按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `_status` |
| 2 | long | `cityId` |
| 3 | string | `message` |

---

#### `cmd=26003` — broadcast track action 26003 ｜ 推送

- 常量: `Constant.PROT_BROADCAST_TRACK_ACTION_26003`
- 成功判定: `status!0`

**请求参数**: 无（类未定义 encode）

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---

#### `cmd=26004` — broadcast alliance help requested by someone 26004 ｜ 推送

- 常量: `Constant.PROT_BROADCAST_ALLIANCE_HELP_REQUESTED_BY_SOMEONE_26004`
- 成功判定: `status!0`

**请求参数**: 无（类未定义 encode）

**推送数据**（按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `flashState` |

---

#### `cmd=26005` — broadcast alliance help received 26005 ｜ 推送

- 常量: `Constant.PROT_BROADCAST_ALLIANCE_HELP_RECEIVED_26005`
- 成功判定: `status!0`

**请求参数**: 无（类未定义 encode）

**推送数据**（按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `_status` |

---

#### `cmd=26006` — broadcast alliance leave 26006 ｜ 推送

- 常量: `Constant.PROT_BROADCAST_ALLIANCE_LEAVE_26006`
- 成功判定: `status!0`

**请求参数**: 无（类未定义 encode）

**推送数据**（按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `_status` |

---

#### `cmd=26007` — broadcast battle occurs 26007 ｜ 推送

- 常量: `Constant.PROT_BROADCAST_BATTLE_OCCURS_26007`
- 成功判定: `status!0`

**请求参数**: 无（类未定义 encode）

**推送数据**（按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `_status` |
| 2 | long | `expeditionId` |
| 3 | int | `expeditionType` |
| 4 | int | `tileId` |
| 5 | int | `tileX` |
| 6 | int | `tileY` |
| 7 | byte | `quickBattle` |

---

#### `cmd=26008` — broadcast battle result 26008 ｜ 推送

- 常量: `Constant.PROT_BROADCAST_BATTLE_RESULT_26008`
- 成功判定: `status!0`

**请求参数**: 无（类未定义 encode）

**推送数据**（按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `_status` |
| 2 | int | `battleResult` |
| 3 | long | `expeditionId` |
| 4 | int | `expeditionType` |
| 5 | int | `tileId` |
| 6 | int | `tileX` |
| 7 | int | `tileY` |
| 8 | byte | `tileKind` |
| 9 | byte | `targetType` |

---

#### `cmd=26009` — broadcast alliance war preparing 26009 ｜ 推送

- 常量: `Constant.PROT_BROADCAST_ALLIANCE_WAR_PREPARING_26009`
- 成功判定: `status!0`

**请求参数**: 无（类未定义 encode）

**推送数据**（按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `_status` |
| 2 | long | `allianceWarStartTime` |
| 3 | long | `allianceWarEndTime` |

---

#### `cmd=26010` — broadcast battle message 26010 ｜ 推送

- 常量: `Constant.PROT_BROADCAST_BATTLE_MESSAGE_26010`
- 成功判定: `status!0`

**请求参数**: 无（类未定义 encode）

**推送数据**（按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `_status` |
| 2 | string | `message` |

---

#### `cmd=26011` — broadcast battle message 26011 ｜ 推送

- 常量: `Constant.PROT_BROADCAST_BATTLE_MESSAGE_26011`
- 成功判定: `status!0`

**请求参数**: 无（类未定义 encode）

**推送数据**（按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `_status` |
| 2 | string | `message` |

---

#### `cmd=26012` — broadcast alliance mark update 26012 ｜ 推送

- 常量: `Constant.PROT_BROADCAST_ALLIANCE_MARK_UPDATE_26012`
- 成功判定: `status!0`

**请求参数**: 无（类未定义 encode）

**推送数据**（按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `_status` |
| 2 | int | `tileX` |
| 3 | int | `tileY` |
| 4 | string | `title` |
| 5 | string | `icon` |
| 6 | long | `time` |

---

#### `cmd=26013` — broadcast alliance mark delete 26013 ｜ 推送

- 常量: `Constant.PROT_BROADCAST_ALLIANCE_MARK_DELETE_26013`
- 成功判定: `status!0`

**请求参数**: 无（类未定义 encode）

**推送数据**（按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `_status` |
| 2 | int | `tileX` |
| 3 | int | `tileY` |

---

#### `cmd=26014` — broadcast alliance join 26014 ｜ 推送

- 常量: `Constant.PROT_BROADCAST_ALLIANCE_JOIN_26014`
- 成功判定: `status!0`

**请求参数**: 无（类未定义 encode）

**推送数据**（按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `_status` |
| 2 | int | `allianceId` |

---

#### `cmd=26015` — broadcast online check 26015 ｜ 推送

- 常量: `Constant.PROT_BROADCAST_ONLINE_CHECK_26015`

**请求参数**: 无（类未定义 encode）

**推送数据**（按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `_status` |
| 2 | long | `currentTime` |
| 3 | long | `showTime` |
| 4 | string | `sign` |

---

#### `cmd=26016` — broadcast trigger payment update 26016 ｜ 推送

- 常量: `Constant.PROT_BROADCAST_TRIGGER_PAYMENT_UPDATE_26016`

**请求参数**: 无（类未定义 encode）

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=26019` — broadcast activity update 26019 ｜ 推送

- 常量: `Constant.PROT_BROADCAST_ACTIVITY_UPDATE_26019`
- 成功判定: `status!0`

**请求参数**: 无（类未定义 encode）

**推送数据**（按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `_status` |

---

#### `cmd=26022` — broadcast key for dispatch 26022 ｜ 推送

- 常量: `Constant.PROT_BROADCAST_KEY_FOR_DISPATCH_26022`
- 成功判定: `status!0`

**请求参数**: 无（类未定义 encode）

**推送数据**（按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `_status` |
| 2 | long | `key` |

---

#### `cmd=26023` — broadcast key for strategem 26023 ｜ 推送

- 常量: `Constant.PROT_BROADCAST_KEY_FOR_STRATEGEM_26023`
- 成功判定: `status!0`

**请求参数**: 无（类未定义 encode）

**推送数据**（按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `_status` |
| 2 | long | `key` |

---

#### `cmd=26024` — broadcast wounded update 26024 ｜ 推送

- 常量: `Constant.PROT_BROADCAST_WOUNDED_UPDATE_26024`
- 成功判定: `status!0`

**请求参数**: 无（类未定义 encode）

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---

#### `cmd=26025` — broadcast escaped update 26025 ｜ 推送

- 常量: `Constant.PROT_BROADCAST_ESCAPED_UPDATE_26025`
- 成功判定: `status!0`

**请求参数**: 无（类未定义 encode）

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---

#### `cmd=26026` — broadcast simulation battle created 26026 ｜ 推送

- 常量: `Constant.PROT_BROADCAST_SIMULATION_BATTLE_CREATED_26026`
- 成功判定: `status!0`

**请求参数**: 无（类未定义 encode）

**推送数据**（按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `_status` |
| 2 | long | `simulationBattleId` |

---

#### `cmd=26027` — broadcast simulation battle field destroied 26027 ｜ 推送

- 常量: `Constant.PROT_BROADCAST_SIMULATION_BATTLE_FIELD_DESTROIED_26027`
- 成功判定: `status!0`

**请求参数**: 无（类未定义 encode）

**推送数据**（按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `_status` |
| 2 | int | `battleResult` |

---
