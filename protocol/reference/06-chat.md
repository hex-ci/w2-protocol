# 聊天

> 16 个命令（cmd 6001 ~ 6016）

#### `cmd=6001` — chat config 6001

- 常量: `Constant.PROT_CHAT_CONFIG_6001`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `welcomeMessage` |
| 2 | string | `recordUploadURL` |
| 3 | string | `recordDownloadURL` |

---

#### `cmd=6002` — chat query playerid 6002

- 常量: `Constant.PROT_CHAT_QUERY_PLAYERID_6002`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | string | `this.nickname` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `playerId` |

---

#### `cmd=6003` — broadcast chat message received normal 6003

- 常量: `Constant.PROT_BROADCAST_CHAT_MESSAGE_RECEIVED_NORMAL_6003`
- 成功判定: `status!0`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `_status` |
| 2 | int | `chatChannel` |
| 3 | long | `chatId` |
| 4 | int | `senderPlayerType` |
| 5 | long | `playerId` |
| 6 | string | `nickname` |
| 7 | long | `fame` |
| 8 | byte | `rank` |
| 9 | byte | `position` |
| 10 | string | `playerTitle` |
| 11 | string | `allianceTitle` |
| 12 | long | `receiverPlayerId` |
| 13 | string | `receiverNickname` |
| 14 | int | `avata` |
| 15 | string | `allianceName` |
| 16 | long | `chatTime` |

---

#### `cmd=6004` — broadcast chat message received system 6004

- 常量: `Constant.PROT_BROADCAST_CHAT_MESSAGE_RECEIVED_SYSTEM_6004`
- 成功判定: `status!0`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `_status` |
| 2 | int | `chatChannel` |
| 3 | long | `chatId` |
| 4 | string | `chatColor` |
| 5 | byte | `boldFont` |
| 6 | long | `chatTime` |

---

#### `cmd=6005` — chat send message to public 6005

- 常量: `Constant.PROT_CHAT_SEND_MESSAGE_TO_PUBLIC_6005`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | string | `this.message` |

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---

#### `cmd=6006` — chat send message to alliance 6006

- 常量: `Constant.PROT_CHAT_SEND_MESSAGE_TO_ALLIANCE_6006`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | string | `this.message` |

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---

#### `cmd=6007` — chat send message to private 6007

- 常量: `Constant.PROT_CHAT_SEND_MESSAGE_TO_PRIVATE_6007`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.playerId` |
| 2 | string | `this.message` |

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---

#### `cmd=6008` — chat send voice to public 6008

- 常量: `Constant.PROT_CHAT_SEND_VOICE_TO_PUBLIC_6008`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | string | `this.voiceFilePath` |

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---

#### `cmd=6009` — chat send voice to private 6009

- 常量: `Constant.PROT_CHAT_SEND_VOICE_TO_PRIVATE_6009`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.playerId` |
| 2 | string | `this.voiceFilePath` |

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---

#### `cmd=6010` — chat send voice to alliance 6010

- 常量: `Constant.PROT_CHAT_SEND_VOICE_TO_ALLIANCE_6010`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | string | `this.voiceFilePath` |

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---

#### `cmd=6011` — broadcast chat message received voice 6011

- 常量: `Constant.PROT_BROADCAST_CHAT_MESSAGE_RECEIVED_VOICE_6011`
- 成功判定: `status!0`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `_status` |
| 2 | int | `chatChannel` |
| 3 | long | `chatId` |
| 4 | int | `senderPlayerType` |
| 5 | long | `playerId` |
| 6 | string | `nickname` |
| 7 | long | `fame` |
| 8 | byte | `rank` |
| 9 | byte | `position` |
| 10 | string | `playerTitle` |
| 11 | string | `allianceTitle` |
| 12 | long | `receiverPlayerId` |
| 13 | string | `receiverNickname` |
| 14 | int | `avata` |
| 15 | string | `allianceName` |
| 16 | string | `voiceFilePath` |
| 17 | long | `chatTime` |

---

#### `cmd=6012` — chat send flaund to public 6012

- 常量: `Constant.PROT_CHAT_SEND_FLAUND_TO_PUBLIC_6012`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.flaundId` |
| 2 | string | `this.message` |

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---

#### `cmd=6013` — chat send flaund to alliance 6013

- 常量: `Constant.PROT_CHAT_SEND_FLAUND_TO_ALLIANCE_6013`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.flaundId` |
| 2 | string | `this.message` |

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---

#### `cmd=6014` — chat send flaund to private 6014

- 常量: `Constant.PROT_CHAT_SEND_FLAUND_TO_PRIVATE_6014`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.playerId` |
| 2 | string | `this.message` |
| 3 | long | `this.flaundId` |

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---

#### `cmd=6015` — broadcast chat message received flaund 6015

- 常量: `Constant.PROT_BROADCAST_CHAT_MESSAGE_RECEIVED_FLAUND_6015`
- 成功判定: `status!0`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `_status` |
| 2 | int | `chatChannel` |
| 3 | long | `chatId` |
| 4 | int | `senderPlayerType` |
| 5 | long | `playerId` |
| 6 | string | `nickname` |
| 7 | long | `fame` |
| 8 | byte | `rank` |
| 9 | byte | `position` |
| 10 | string | `playerTitle` |
| 11 | string | `allianceTitle` |
| 12 | long | `receiverPlayerId` |
| 13 | string | `receiverNickname` |
| 14 | int | `avata` |
| 15 | string | `allianceName` |
| 16 | long | `flaundId` |
| 17 | long | `chatTime` |

---

#### `cmd=6016` — chat list 6016

- 常量: `Constant.PROT_CHAT_LIST_6016`
- 成功判定: `status1=this.status()||2=this.status()`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.channelType` |
| 2 | long | `this.fromChatId` |
| 3 | byte | `this.earlierLoadMode` |
| 4 | int | `this.loadMessageCount` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `channelType` |
| 2 | byte | `earlierLoadMode` |
| 3 | byte | `chatType` |
| 4 | int | `chatChannel` |
| 5 | long | `chatId` |
| 6 | int | `senderPlayerType` |
| 7 | long | `playerId` |
| 8 | string | `nickname` |
| 9 | long | `fame` |
| 10 | byte | `rank` |
| 11 | byte | `position` |
| 12 | string | `playerTitle` |
| 13 | string | `allianceTitle` |
| 14 | long | `receiverPlayerId` |
| 15 | string | `receiverNickname` |
| 16 | int | `avata` |
| 17 | string | `allianceName` |
| 18 | long | `chatTime` |
| 19 | int | `chatChannel` |
| 20 | long | `chatId` |
| 21 | int | `senderPlayerType` |
| 22 | long | `playerId` |
| 23 | string | `nickname` |
| 24 | long | `fame` |
| 25 | byte | `rank` |
| 26 | byte | `position` |
| 27 | string | `playerTitle` |
| 28 | string | `allianceTitle` |
| 29 | long | `receiverPlayerId` |
| 30 | string | `receiverNickname` |
| 31 | int | `avata` |
| 32 | string | `allianceName` |
| 33 | string | `voiceFilePath` |
| 34 | long | `chatTime` |
| 35 | int | `chatChannel` |
| 36 | long | `chatId` |
| 37 | int | `senderPlayerType` |
| 38 | long | `playerId` |
| 39 | string | `nickname` |
| 40 | long | `fame` |
| 41 | byte | `rank` |
| 42 | byte | `position` |
| 43 | string | `playerTitle` |
| 44 | string | `allianceTitle` |
| 45 | long | `receiverPlayerId` |
| 46 | string | `receiverNickname` |
| 47 | int | `avata` |
| 48 | string | `allianceName` |
| 49 | long | `flaundId` |
| 50 | long | `chatTime` |
| 51 | long | `chatId` |
| 52 | string | `chatColor` |
| 53 | byte | `boldFont` |
| 54 | long | `chatTime` |

---
