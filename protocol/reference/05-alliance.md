# 军团

> 50 个命令（cmd 5001 ~ 5062）

#### `cmd=5001` — alliance info 5001

- 常量: `Constant.PROT_ALLIANCE_INFO_5001`
- 成功判定: `status!0`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `isJoinAlliance` |
| 2 | int | `allianceId` |
| 3 | string | `allianceName` |
| 4 | string | `leaderName` |
| 5 | string | `founderName` |
| 6 | int | `memberCount` |
| 7 | int | `memberCountMax` |
| 8 | byte | `allianceWarState` |
| 9 | byte | `allianceWarJoinState` |
| 10 | long | `allianceWarNextStateTime` |
| 11 | long | `allianceScore` |
| 12 | int | `ranking` |
| 13 | long | `fame` |
| 14 | string | `allianceDescription` |
| 15 | string | `allianceAnnouncement` |
| 16 | string | `allianceName` |
| 17 | int | `ranking` |
| 18 | int | `memberCount` |
| 19 | int | `badgeId` |
| 20 | byte | `hasCapital` |
| 21 | int | `capitalLevel` |
| 22 | byte | `badgeEditable` |
| 23 | byte | `joinAllianceDirectly` |
| 24 | long | `goldRequired` |
| 25 | long | `fameRequired` |
| 26 | int | `allianceId` |
| 27 | int | `badgeId` |
| 28 | string | `allianceName` |
| 29 | int | `allianceId` |
| 30 | int | `badgeId` |
| 31 | string | `allianceName` |
| 32 | int | `ranking` |
| 33 | int | `memberCount` |
| 34 | long | `fame` |
| 35 | byte | `allianceWarState` |
| 36 | long | `allianceWarNextStateTime` |
| 37 | byte | `_status` |
| 38 | long | `allianceWarStartTime` |
| 39 | long | `allianceWarEndTime` |

---

#### `cmd=5002` — alliance create 5002

- 常量: `Constant.PROT_ALLIANCE_CREATE_5002`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | string | `this.allianceName` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=5003` — alliance invitation list 5003

- 常量: `Constant.PROT_ALLIANCE_INVITATION_LIST_5003`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `playerId` |
| 2 | string | `nickname` |
| 3 | int | `avata` |
| 4 | int | `ranking` |
| 5 | long | `fame` |
| 6 | string | `inviter` |
| 7 | long | `inviteTime` |

---

#### `cmd=5004` — alliance invitation invite 5004

- 常量: `Constant.PROT_ALLIANCE_INVITATION_INVITE_5004`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | string | `this.nickname` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=5005` — alliance invitation abort 5005

- 常量: `Constant.PROT_ALLIANCE_INVITATION_ABORT_5005`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.playerId` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=5006` — alliance invitation accept 5006

- 常量: `Constant.PROT_ALLIANCE_INVITATION_ACCEPT_5006`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.allianceId` |

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---

#### `cmd=5007` — alliance invitation reject 5007

- 常量: `Constant.PROT_ALLIANCE_INVITATION_REJECT_5007`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.allianceId` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=5008` — alliance list 5008

- 常量: `Constant.PROT_ALLIANCE_LIST_5008`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.pageSize` |
| 2 | int | `this.pageNum` |
| 3 | byte | `this.listType` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `listType` |
| 2 | int | `pageNum` |
| 3 | int | `pageCount` |
| 4 | int | `allianceId` |
| 5 | int | `ranking` |
| 6 | string | `allianceName` |
| 7 | string | `leaderName` |
| 8 | int | `memberCount` |
| 9 | long | `fame` |
| 10 | int | `badgeId` |
| 11 | byte | `joinAllianceDirectly` |

---

#### `cmd=5009` — alliance list filter by keyword 5009

- 常量: `Constant.PROT_ALLIANCE_LIST_FILTER_BY_KEYWORD_5009`
- 成功判定: `status1=this.status()||2=this.status()`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.pageSize` |
| 2 | string | `this.keyword` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `pageNum` |
| 2 | int | `pageCount` |
| 3 | int | `allianceId` |
| 4 | int | `ranking` |
| 5 | string | `allianceName` |
| 6 | string | `leaderName` |
| 7 | int | `memberCount` |
| 8 | long | `fame` |
| 9 | int | `badgeId` |
| 10 | byte | `joinAllianceDirectly` |
| 11 | byte | `resultCode` |
| 12 | int | `pageNum` |
| 13 | int | `pageCount` |
| 14 | byte | `eventType` |
| 15 | string | `eventMessage` |
| 16 | long | `eventTime` |
| 17 | string | `nickname` |
| 18 | int | `avata` |
| 19 | long | `playerId` |
| 20 | int | `ranking` |
| 21 | long | `fame` |
| 22 | byte | `cityCount` |
| 23 | long | `applyTime` |
| 24 | int | `pageNum` |
| 25 | int | `pageCount` |
| 26 | long | `allianceGiftId` |
| 27 | int | `rcType` |
| 28 | string | `from` |
| 29 | string | `rcImage` |
| 30 | string | `description` |
| 31 | byte | `status` |
| 32 | long | `remainTime` |
| 33 | int | `rcType` |
| 34 | string | `rcImage` |
| 35 | string | `rcName` |
| 36 | int | `rcAmount` |
| 37 | int | `channelType` |
| 38 | byte | `earlierLoadMode` |
| 39 | byte | `chatType` |
| 40 | int | `chatChannel` |
| 41 | long | `chatId` |
| 42 | int | `senderPlayerType` |
| 43 | long | `playerId` |
| 44 | string | `nickname` |
| 45 | long | `fame` |
| 46 | byte | `rank` |
| 47 | byte | `position` |
| 48 | string | `playerTitle` |
| 49 | string | `allianceTitle` |
| 50 | long | `receiverPlayerId` |
| 51 | string | `receiverNickname` |
| 52 | int | `avata` |
| 53 | string | `allianceName` |
| 54 | long | `chatTime` |
| 55 | int | `chatChannel` |
| 56 | long | `chatId` |
| 57 | int | `senderPlayerType` |
| 58 | long | `playerId` |
| 59 | string | `nickname` |
| 60 | long | `fame` |
| 61 | byte | `rank` |
| 62 | byte | `position` |
| 63 | string | `playerTitle` |
| 64 | string | `allianceTitle` |
| 65 | long | `receiverPlayerId` |
| 66 | string | `receiverNickname` |
| 67 | int | `avata` |
| 68 | string | `allianceName` |
| 69 | string | `voiceFilePath` |
| 70 | long | `chatTime` |
| 71 | int | `chatChannel` |
| 72 | long | `chatId` |
| 73 | int | `senderPlayerType` |
| 74 | long | `playerId` |
| 75 | string | `nickname` |
| 76 | long | `fame` |
| 77 | byte | `rank` |
| 78 | byte | `position` |
| 79 | string | `playerTitle` |
| 80 | string | `allianceTitle` |
| 81 | long | `receiverPlayerId` |
| 82 | string | `receiverNickname` |
| 83 | int | `avata` |
| 84 | string | `allianceName` |
| 85 | long | `flaundId` |
| 86 | long | `chatTime` |
| 87 | long | `chatId` |
| 88 | string | `chatColor` |
| 89 | byte | `boldFont` |
| 90 | long | `chatTime` |

---

#### `cmd=5011` — alliance send application 5011

- 常量: `Constant.PROT_ALLIANCE_SEND_APPLICATION_5011`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.allianceId` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=5012` — alliance revoke application 5012

- 常量: `Constant.PROT_ALLIANCE_REVOKE_APPLICATION_5012`
- 成功判定: `status1=this.status()||2=this.status()`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.allianceId` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `resultCode` |
| 2 | int | `pageNum` |
| 3 | int | `pageCount` |
| 4 | byte | `eventType` |
| 5 | string | `eventMessage` |
| 6 | long | `eventTime` |
| 7 | string | `nickname` |
| 8 | int | `avata` |
| 9 | long | `playerId` |
| 10 | int | `ranking` |
| 11 | long | `fame` |
| 12 | byte | `cityCount` |
| 13 | long | `applyTime` |
| 14 | int | `pageNum` |
| 15 | int | `pageCount` |
| 16 | long | `allianceGiftId` |
| 17 | int | `rcType` |
| 18 | string | `from` |
| 19 | string | `rcImage` |
| 20 | string | `description` |
| 21 | byte | `status` |
| 22 | long | `remainTime` |
| 23 | int | `rcType` |
| 24 | string | `rcImage` |
| 25 | string | `rcName` |
| 26 | int | `rcAmount` |
| 27 | int | `channelType` |
| 28 | byte | `earlierLoadMode` |
| 29 | byte | `chatType` |
| 30 | int | `chatChannel` |
| 31 | long | `chatId` |
| 32 | int | `senderPlayerType` |
| 33 | long | `playerId` |
| 34 | string | `nickname` |
| 35 | long | `fame` |
| 36 | byte | `rank` |
| 37 | byte | `position` |
| 38 | string | `playerTitle` |
| 39 | string | `allianceTitle` |
| 40 | long | `receiverPlayerId` |
| 41 | string | `receiverNickname` |
| 42 | int | `avata` |
| 43 | string | `allianceName` |
| 44 | long | `chatTime` |
| 45 | int | `chatChannel` |
| 46 | long | `chatId` |
| 47 | int | `senderPlayerType` |
| 48 | long | `playerId` |
| 49 | string | `nickname` |
| 50 | long | `fame` |
| 51 | byte | `rank` |
| 52 | byte | `position` |
| 53 | string | `playerTitle` |
| 54 | string | `allianceTitle` |
| 55 | long | `receiverPlayerId` |
| 56 | string | `receiverNickname` |
| 57 | int | `avata` |
| 58 | string | `allianceName` |
| 59 | string | `voiceFilePath` |
| 60 | long | `chatTime` |
| 61 | int | `chatChannel` |
| 62 | long | `chatId` |
| 63 | int | `senderPlayerType` |
| 64 | long | `playerId` |
| 65 | string | `nickname` |
| 66 | long | `fame` |
| 67 | byte | `rank` |
| 68 | byte | `position` |
| 69 | string | `playerTitle` |
| 70 | string | `allianceTitle` |
| 71 | long | `receiverPlayerId` |
| 72 | string | `receiverNickname` |
| 73 | int | `avata` |
| 74 | string | `allianceName` |
| 75 | long | `flaundId` |
| 76 | long | `chatTime` |
| 77 | long | `chatId` |
| 78 | string | `chatColor` |
| 79 | byte | `boldFont` |
| 80 | long | `chatTime` |

---

#### `cmd=5013` — alliance event list 5013

- 常量: `Constant.PROT_ALLIANCE_EVENT_LIST_5013`
- 成功判定: `status1=this.status()||2=this.status()`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.pageSize` |
| 2 | int | `this.pageNum` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `pageNum` |
| 2 | int | `pageCount` |
| 3 | byte | `eventType` |
| 4 | string | `eventMessage` |
| 5 | long | `eventTime` |
| 6 | string | `nickname` |
| 7 | int | `avata` |
| 8 | long | `playerId` |
| 9 | int | `ranking` |
| 10 | long | `fame` |
| 11 | byte | `cityCount` |
| 12 | long | `applyTime` |
| 13 | int | `pageNum` |
| 14 | int | `pageCount` |
| 15 | long | `allianceGiftId` |
| 16 | int | `rcType` |
| 17 | string | `from` |
| 18 | string | `rcImage` |
| 19 | string | `description` |
| 20 | byte | `status` |
| 21 | long | `remainTime` |
| 22 | int | `rcType` |
| 23 | string | `rcImage` |
| 24 | string | `rcName` |
| 25 | int | `rcAmount` |
| 26 | int | `channelType` |
| 27 | byte | `earlierLoadMode` |
| 28 | byte | `chatType` |
| 29 | int | `chatChannel` |
| 30 | long | `chatId` |
| 31 | int | `senderPlayerType` |
| 32 | long | `playerId` |
| 33 | string | `nickname` |
| 34 | long | `fame` |
| 35 | byte | `rank` |
| 36 | byte | `position` |
| 37 | string | `playerTitle` |
| 38 | string | `allianceTitle` |
| 39 | long | `receiverPlayerId` |
| 40 | string | `receiverNickname` |
| 41 | int | `avata` |
| 42 | string | `allianceName` |
| 43 | long | `chatTime` |
| 44 | int | `chatChannel` |
| 45 | long | `chatId` |
| 46 | int | `senderPlayerType` |
| 47 | long | `playerId` |
| 48 | string | `nickname` |
| 49 | long | `fame` |
| 50 | byte | `rank` |
| 51 | byte | `position` |
| 52 | string | `playerTitle` |
| 53 | string | `allianceTitle` |
| 54 | long | `receiverPlayerId` |
| 55 | string | `receiverNickname` |
| 56 | int | `avata` |
| 57 | string | `allianceName` |
| 58 | string | `voiceFilePath` |
| 59 | long | `chatTime` |
| 60 | int | `chatChannel` |
| 61 | long | `chatId` |
| 62 | int | `senderPlayerType` |
| 63 | long | `playerId` |
| 64 | string | `nickname` |
| 65 | long | `fame` |
| 66 | byte | `rank` |
| 67 | byte | `position` |
| 68 | string | `playerTitle` |
| 69 | string | `allianceTitle` |
| 70 | long | `receiverPlayerId` |
| 71 | string | `receiverNickname` |
| 72 | int | `avata` |
| 73 | string | `allianceName` |
| 74 | long | `flaundId` |
| 75 | long | `chatTime` |
| 76 | long | `chatId` |
| 77 | string | `chatColor` |
| 78 | byte | `boldFont` |
| 79 | long | `chatTime` |

---

#### `cmd=5014` — alliance battle log list 5014

- 常量: `Constant.PROT_ALLIANCE_BATTLE_LOG_LIST_5014`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.pageSize` |
| 2 | int | `this.pageNum` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `pageNum` |
| 2 | int | `pageCount` |
| 3 | long | `allianceBattleLogId` |
| 4 | byte | `type` |
| 5 | string | `detail` |
| 6 | string | `targetAllianceName` |
| 7 | long | `battleTime` |

---

#### `cmd=5015` — alliance member kick out 5015

- 常量: `Constant.PROT_ALLIANCE_MEMBER_KICK_OUT_5015`
- 成功判定: `status1=this.status()||2=this.status()`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | string | `this.nickname` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `nickname` |
| 2 | int | `avata` |
| 3 | long | `playerId` |
| 4 | int | `ranking` |
| 5 | long | `fame` |
| 6 | byte | `cityCount` |
| 7 | long | `applyTime` |
| 8 | int | `pageNum` |
| 9 | int | `pageCount` |
| 10 | long | `allianceGiftId` |
| 11 | int | `rcType` |
| 12 | string | `from` |
| 13 | string | `rcImage` |
| 14 | string | `description` |
| 15 | byte | `status` |
| 16 | long | `remainTime` |
| 17 | int | `rcType` |
| 18 | string | `rcImage` |
| 19 | string | `rcName` |
| 20 | int | `rcAmount` |
| 21 | int | `channelType` |
| 22 | byte | `earlierLoadMode` |
| 23 | byte | `chatType` |
| 24 | int | `chatChannel` |
| 25 | long | `chatId` |
| 26 | int | `senderPlayerType` |
| 27 | long | `playerId` |
| 28 | string | `nickname` |
| 29 | long | `fame` |
| 30 | byte | `rank` |
| 31 | byte | `position` |
| 32 | string | `playerTitle` |
| 33 | string | `allianceTitle` |
| 34 | long | `receiverPlayerId` |
| 35 | string | `receiverNickname` |
| 36 | int | `avata` |
| 37 | string | `allianceName` |
| 38 | long | `chatTime` |
| 39 | int | `chatChannel` |
| 40 | long | `chatId` |
| 41 | int | `senderPlayerType` |
| 42 | long | `playerId` |
| 43 | string | `nickname` |
| 44 | long | `fame` |
| 45 | byte | `rank` |
| 46 | byte | `position` |
| 47 | string | `playerTitle` |
| 48 | string | `allianceTitle` |
| 49 | long | `receiverPlayerId` |
| 50 | string | `receiverNickname` |
| 51 | int | `avata` |
| 52 | string | `allianceName` |
| 53 | string | `voiceFilePath` |
| 54 | long | `chatTime` |
| 55 | int | `chatChannel` |
| 56 | long | `chatId` |
| 57 | int | `senderPlayerType` |
| 58 | long | `playerId` |
| 59 | string | `nickname` |
| 60 | long | `fame` |
| 61 | byte | `rank` |
| 62 | byte | `position` |
| 63 | string | `playerTitle` |
| 64 | string | `allianceTitle` |
| 65 | long | `receiverPlayerId` |
| 66 | string | `receiverNickname` |
| 67 | int | `avata` |
| 68 | string | `allianceName` |
| 69 | long | `flaundId` |
| 70 | long | `chatTime` |
| 71 | long | `chatId` |
| 72 | string | `chatColor` |
| 73 | byte | `boldFont` |
| 74 | long | `chatTime` |

---

#### `cmd=5016` — alliance application list 5016

- 常量: `Constant.PROT_ALLIANCE_APPLICATION_LIST_5016`
- 成功判定: `status1=this.status()||2=this.status()`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `nickname` |
| 2 | int | `avata` |
| 3 | long | `playerId` |
| 4 | int | `ranking` |
| 5 | long | `fame` |
| 6 | byte | `cityCount` |
| 7 | long | `applyTime` |
| 8 | int | `pageNum` |
| 9 | int | `pageCount` |
| 10 | long | `allianceGiftId` |
| 11 | int | `rcType` |
| 12 | string | `from` |
| 13 | string | `rcImage` |
| 14 | string | `description` |
| 15 | byte | `status` |
| 16 | long | `remainTime` |
| 17 | int | `rcType` |
| 18 | string | `rcImage` |
| 19 | string | `rcName` |
| 20 | int | `rcAmount` |
| 21 | int | `channelType` |
| 22 | byte | `earlierLoadMode` |
| 23 | byte | `chatType` |
| 24 | int | `chatChannel` |
| 25 | long | `chatId` |
| 26 | int | `senderPlayerType` |
| 27 | long | `playerId` |
| 28 | string | `nickname` |
| 29 | long | `fame` |
| 30 | byte | `rank` |
| 31 | byte | `position` |
| 32 | string | `playerTitle` |
| 33 | string | `allianceTitle` |
| 34 | long | `receiverPlayerId` |
| 35 | string | `receiverNickname` |
| 36 | int | `avata` |
| 37 | string | `allianceName` |
| 38 | long | `chatTime` |
| 39 | int | `chatChannel` |
| 40 | long | `chatId` |
| 41 | int | `senderPlayerType` |
| 42 | long | `playerId` |
| 43 | string | `nickname` |
| 44 | long | `fame` |
| 45 | byte | `rank` |
| 46 | byte | `position` |
| 47 | string | `playerTitle` |
| 48 | string | `allianceTitle` |
| 49 | long | `receiverPlayerId` |
| 50 | string | `receiverNickname` |
| 51 | int | `avata` |
| 52 | string | `allianceName` |
| 53 | string | `voiceFilePath` |
| 54 | long | `chatTime` |
| 55 | int | `chatChannel` |
| 56 | long | `chatId` |
| 57 | int | `senderPlayerType` |
| 58 | long | `playerId` |
| 59 | string | `nickname` |
| 60 | long | `fame` |
| 61 | byte | `rank` |
| 62 | byte | `position` |
| 63 | string | `playerTitle` |
| 64 | string | `allianceTitle` |
| 65 | long | `receiverPlayerId` |
| 66 | string | `receiverNickname` |
| 67 | int | `avata` |
| 68 | string | `allianceName` |
| 69 | long | `flaundId` |
| 70 | long | `chatTime` |
| 71 | long | `chatId` |
| 72 | string | `chatColor` |
| 73 | byte | `boldFont` |
| 74 | long | `chatTime` |

---

#### `cmd=5017` — alliance application approve 5017

- 常量: `Constant.PROT_ALLIANCE_APPLICATION_APPROVE_5017`
- 成功判定: `status1=this.status()||2=this.status()`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.playerId` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `pageNum` |
| 2 | int | `pageCount` |
| 3 | long | `allianceGiftId` |
| 4 | int | `rcType` |
| 5 | string | `from` |
| 6 | string | `rcImage` |
| 7 | string | `description` |
| 8 | byte | `status` |
| 9 | long | `remainTime` |
| 10 | int | `rcType` |
| 11 | string | `rcImage` |
| 12 | string | `rcName` |
| 13 | int | `rcAmount` |
| 14 | int | `channelType` |
| 15 | byte | `earlierLoadMode` |
| 16 | byte | `chatType` |
| 17 | int | `chatChannel` |
| 18 | long | `chatId` |
| 19 | int | `senderPlayerType` |
| 20 | long | `playerId` |
| 21 | string | `nickname` |
| 22 | long | `fame` |
| 23 | byte | `rank` |
| 24 | byte | `position` |
| 25 | string | `playerTitle` |
| 26 | string | `allianceTitle` |
| 27 | long | `receiverPlayerId` |
| 28 | string | `receiverNickname` |
| 29 | int | `avata` |
| 30 | string | `allianceName` |
| 31 | long | `chatTime` |
| 32 | int | `chatChannel` |
| 33 | long | `chatId` |
| 34 | int | `senderPlayerType` |
| 35 | long | `playerId` |
| 36 | string | `nickname` |
| 37 | long | `fame` |
| 38 | byte | `rank` |
| 39 | byte | `position` |
| 40 | string | `playerTitle` |
| 41 | string | `allianceTitle` |
| 42 | long | `receiverPlayerId` |
| 43 | string | `receiverNickname` |
| 44 | int | `avata` |
| 45 | string | `allianceName` |
| 46 | string | `voiceFilePath` |
| 47 | long | `chatTime` |
| 48 | int | `chatChannel` |
| 49 | long | `chatId` |
| 50 | int | `senderPlayerType` |
| 51 | long | `playerId` |
| 52 | string | `nickname` |
| 53 | long | `fame` |
| 54 | byte | `rank` |
| 55 | byte | `position` |
| 56 | string | `playerTitle` |
| 57 | string | `allianceTitle` |
| 58 | long | `receiverPlayerId` |
| 59 | string | `receiverNickname` |
| 60 | int | `avata` |
| 61 | string | `allianceName` |
| 62 | long | `flaundId` |
| 63 | long | `chatTime` |
| 64 | long | `chatId` |
| 65 | string | `chatColor` |
| 66 | byte | `boldFont` |
| 67 | long | `chatTime` |

---

#### `cmd=5018` — alliance application reject 5018

- 常量: `Constant.PROT_ALLIANCE_APPLICATION_REJECT_5018`
- 成功判定: `status1=this.status()||2=this.status()`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.playerId` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `pageNum` |
| 2 | int | `pageCount` |
| 3 | long | `allianceGiftId` |
| 4 | int | `rcType` |
| 5 | string | `from` |
| 6 | string | `rcImage` |
| 7 | string | `description` |
| 8 | byte | `status` |
| 9 | long | `remainTime` |
| 10 | int | `rcType` |
| 11 | string | `rcImage` |
| 12 | string | `rcName` |
| 13 | int | `rcAmount` |
| 14 | int | `channelType` |
| 15 | byte | `earlierLoadMode` |
| 16 | byte | `chatType` |
| 17 | int | `chatChannel` |
| 18 | long | `chatId` |
| 19 | int | `senderPlayerType` |
| 20 | long | `playerId` |
| 21 | string | `nickname` |
| 22 | long | `fame` |
| 23 | byte | `rank` |
| 24 | byte | `position` |
| 25 | string | `playerTitle` |
| 26 | string | `allianceTitle` |
| 27 | long | `receiverPlayerId` |
| 28 | string | `receiverNickname` |
| 29 | int | `avata` |
| 30 | string | `allianceName` |
| 31 | long | `chatTime` |
| 32 | int | `chatChannel` |
| 33 | long | `chatId` |
| 34 | int | `senderPlayerType` |
| 35 | long | `playerId` |
| 36 | string | `nickname` |
| 37 | long | `fame` |
| 38 | byte | `rank` |
| 39 | byte | `position` |
| 40 | string | `playerTitle` |
| 41 | string | `allianceTitle` |
| 42 | long | `receiverPlayerId` |
| 43 | string | `receiverNickname` |
| 44 | int | `avata` |
| 45 | string | `allianceName` |
| 46 | string | `voiceFilePath` |
| 47 | long | `chatTime` |
| 48 | int | `chatChannel` |
| 49 | long | `chatId` |
| 50 | int | `senderPlayerType` |
| 51 | long | `playerId` |
| 52 | string | `nickname` |
| 53 | long | `fame` |
| 54 | byte | `rank` |
| 55 | byte | `position` |
| 56 | string | `playerTitle` |
| 57 | string | `allianceTitle` |
| 58 | long | `receiverPlayerId` |
| 59 | string | `receiverNickname` |
| 60 | int | `avata` |
| 61 | string | `allianceName` |
| 62 | long | `flaundId` |
| 63 | long | `chatTime` |
| 64 | long | `chatId` |
| 65 | string | `chatColor` |
| 66 | byte | `boldFont` |
| 67 | long | `chatTime` |

---

#### `cmd=5019` — alliance diplomacy add 5019

- 常量: `Constant.PROT_ALLIANCE_DIPLOMACY_ADD_5019`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | string | `this.allianceName` |
| 2 | byte | `this.relation` |

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---

#### `cmd=5020` — alliance diplomacy remove 5020

- 常量: `Constant.PROT_ALLIANCE_DIPLOMACY_REMOVE_5020`
- 成功判定: `status1=this.status()||2=this.status()`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.allianceId` |
| 2 | byte | `this.relation` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `pageNum` |
| 2 | int | `pageCount` |
| 3 | long | `allianceGiftId` |
| 4 | int | `rcType` |
| 5 | string | `from` |
| 6 | string | `rcImage` |
| 7 | string | `description` |
| 8 | byte | `status` |
| 9 | long | `remainTime` |
| 10 | int | `rcType` |
| 11 | string | `rcImage` |
| 12 | string | `rcName` |
| 13 | int | `rcAmount` |
| 14 | int | `channelType` |
| 15 | byte | `earlierLoadMode` |
| 16 | byte | `chatType` |
| 17 | int | `chatChannel` |
| 18 | long | `chatId` |
| 19 | int | `senderPlayerType` |
| 20 | long | `playerId` |
| 21 | string | `nickname` |
| 22 | long | `fame` |
| 23 | byte | `rank` |
| 24 | byte | `position` |
| 25 | string | `playerTitle` |
| 26 | string | `allianceTitle` |
| 27 | long | `receiverPlayerId` |
| 28 | string | `receiverNickname` |
| 29 | int | `avata` |
| 30 | string | `allianceName` |
| 31 | long | `chatTime` |
| 32 | int | `chatChannel` |
| 33 | long | `chatId` |
| 34 | int | `senderPlayerType` |
| 35 | long | `playerId` |
| 36 | string | `nickname` |
| 37 | long | `fame` |
| 38 | byte | `rank` |
| 39 | byte | `position` |
| 40 | string | `playerTitle` |
| 41 | string | `allianceTitle` |
| 42 | long | `receiverPlayerId` |
| 43 | string | `receiverNickname` |
| 44 | int | `avata` |
| 45 | string | `allianceName` |
| 46 | string | `voiceFilePath` |
| 47 | long | `chatTime` |
| 48 | int | `chatChannel` |
| 49 | long | `chatId` |
| 50 | int | `senderPlayerType` |
| 51 | long | `playerId` |
| 52 | string | `nickname` |
| 53 | long | `fame` |
| 54 | byte | `rank` |
| 55 | byte | `position` |
| 56 | string | `playerTitle` |
| 57 | string | `allianceTitle` |
| 58 | long | `receiverPlayerId` |
| 59 | string | `receiverNickname` |
| 60 | int | `avata` |
| 61 | string | `allianceName` |
| 62 | long | `flaundId` |
| 63 | long | `chatTime` |
| 64 | long | `chatId` |
| 65 | string | `chatColor` |
| 66 | byte | `boldFont` |
| 67 | long | `chatTime` |

---

#### `cmd=5021` — alliance transfer 5021

- 常量: `Constant.PROT_ALLIANCE_TRANSFER_5021`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | string | `this.nickname` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=5022` — alliance resign 5022

- 常量: `Constant.PROT_ALLIANCE_RESIGN_5022`
- 成功判定: `status1=this.status()||2=this.status()`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `pageNum` |
| 2 | int | `pageCount` |
| 3 | long | `allianceGiftId` |
| 4 | int | `rcType` |
| 5 | string | `from` |
| 6 | string | `rcImage` |
| 7 | string | `description` |
| 8 | byte | `status` |
| 9 | long | `remainTime` |
| 10 | int | `rcType` |
| 11 | string | `rcImage` |
| 12 | string | `rcName` |
| 13 | int | `rcAmount` |
| 14 | int | `channelType` |
| 15 | byte | `earlierLoadMode` |
| 16 | byte | `chatType` |
| 17 | int | `chatChannel` |
| 18 | long | `chatId` |
| 19 | int | `senderPlayerType` |
| 20 | long | `playerId` |
| 21 | string | `nickname` |
| 22 | long | `fame` |
| 23 | byte | `rank` |
| 24 | byte | `position` |
| 25 | string | `playerTitle` |
| 26 | string | `allianceTitle` |
| 27 | long | `receiverPlayerId` |
| 28 | string | `receiverNickname` |
| 29 | int | `avata` |
| 30 | string | `allianceName` |
| 31 | long | `chatTime` |
| 32 | int | `chatChannel` |
| 33 | long | `chatId` |
| 34 | int | `senderPlayerType` |
| 35 | long | `playerId` |
| 36 | string | `nickname` |
| 37 | long | `fame` |
| 38 | byte | `rank` |
| 39 | byte | `position` |
| 40 | string | `playerTitle` |
| 41 | string | `allianceTitle` |
| 42 | long | `receiverPlayerId` |
| 43 | string | `receiverNickname` |
| 44 | int | `avata` |
| 45 | string | `allianceName` |
| 46 | string | `voiceFilePath` |
| 47 | long | `chatTime` |
| 48 | int | `chatChannel` |
| 49 | long | `chatId` |
| 50 | int | `senderPlayerType` |
| 51 | long | `playerId` |
| 52 | string | `nickname` |
| 53 | long | `fame` |
| 54 | byte | `rank` |
| 55 | byte | `position` |
| 56 | string | `playerTitle` |
| 57 | string | `allianceTitle` |
| 58 | long | `receiverPlayerId` |
| 59 | string | `receiverNickname` |
| 60 | int | `avata` |
| 61 | string | `allianceName` |
| 62 | long | `flaundId` |
| 63 | long | `chatTime` |
| 64 | long | `chatId` |
| 65 | string | `chatColor` |
| 66 | byte | `boldFont` |
| 67 | long | `chatTime` |

---

#### `cmd=5023` — alliance quit 5023

- 常量: `Constant.PROT_ALLIANCE_QUIT_5023`
- 成功判定: `status1=this.status()||2=this.status()`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `pageNum` |
| 2 | int | `pageCount` |
| 3 | long | `allianceGiftId` |
| 4 | int | `rcType` |
| 5 | string | `from` |
| 6 | string | `rcImage` |
| 7 | string | `description` |
| 8 | byte | `status` |
| 9 | long | `remainTime` |
| 10 | int | `rcType` |
| 11 | string | `rcImage` |
| 12 | string | `rcName` |
| 13 | int | `rcAmount` |
| 14 | int | `channelType` |
| 15 | byte | `earlierLoadMode` |
| 16 | byte | `chatType` |
| 17 | int | `chatChannel` |
| 18 | long | `chatId` |
| 19 | int | `senderPlayerType` |
| 20 | long | `playerId` |
| 21 | string | `nickname` |
| 22 | long | `fame` |
| 23 | byte | `rank` |
| 24 | byte | `position` |
| 25 | string | `playerTitle` |
| 26 | string | `allianceTitle` |
| 27 | long | `receiverPlayerId` |
| 28 | string | `receiverNickname` |
| 29 | int | `avata` |
| 30 | string | `allianceName` |
| 31 | long | `chatTime` |
| 32 | int | `chatChannel` |
| 33 | long | `chatId` |
| 34 | int | `senderPlayerType` |
| 35 | long | `playerId` |
| 36 | string | `nickname` |
| 37 | long | `fame` |
| 38 | byte | `rank` |
| 39 | byte | `position` |
| 40 | string | `playerTitle` |
| 41 | string | `allianceTitle` |
| 42 | long | `receiverPlayerId` |
| 43 | string | `receiverNickname` |
| 44 | int | `avata` |
| 45 | string | `allianceName` |
| 46 | string | `voiceFilePath` |
| 47 | long | `chatTime` |
| 48 | int | `chatChannel` |
| 49 | long | `chatId` |
| 50 | int | `senderPlayerType` |
| 51 | long | `playerId` |
| 52 | string | `nickname` |
| 53 | long | `fame` |
| 54 | byte | `rank` |
| 55 | byte | `position` |
| 56 | string | `playerTitle` |
| 57 | string | `allianceTitle` |
| 58 | long | `receiverPlayerId` |
| 59 | string | `receiverNickname` |
| 60 | int | `avata` |
| 61 | string | `allianceName` |
| 62 | long | `flaundId` |
| 63 | long | `chatTime` |
| 64 | long | `chatId` |
| 65 | string | `chatColor` |
| 66 | byte | `boldFont` |
| 67 | long | `chatTime` |

---

#### `cmd=5024` — alliance stationed troop list 5024

- 常量: `Constant.PROT_ALLIANCE_STATIONED_TROOP_LIST_5024`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `stationSwitch` |
| 2 | long | `stationId` |
| 3 | string | `nickname` |
| 4 | int | `avata` |
| 5 | string | `fromCity` |
| 6 | int | `fromX` |
| 7 | int | `fromY` |
| 8 | long | `arriveTime` |
| 9 | long | `stayTime` |
| 10 | long | `returnRemainTime` |

---

#### `cmd=5025` — alliance stationed troop send back 5025

- 常量: `Constant.PROT_ALLIANCE_STATIONED_TROOP_SEND_BACK_5025`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.stationId` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=5026` — alliance stationed troop switch 5026

- 常量: `Constant.PROT_ALLIANCE_STATIONED_TROOP_SWITCH_5026`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | byte | `this.stationSwitch` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `stationSwitch` |

---

#### `cmd=5027` — alliance change position 5027

- 常量: `Constant.PROT_ALLIANCE_CHANGE_POSITION_5027`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.playerId` |
| 2 | byte | `this.alliancePosition` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=5030` — alliance badge info 5030

- 常量: `Constant.PROT_ALLIANCE_BADGE_INFO_5030`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `badgeChangeTimes` |
| 2 | int | `priceForChange` |
| 3 | byte | `type` |
| 4 | int | `badgeId` |
| 5 | string | `badgeURI` |

---

#### `cmd=5031` — alliance badge update 5031

- 常量: `Constant.PROT_ALLIANCE_BADGE_UPDATE_5031`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | byte | `this.type` |
| 2 | int | `this.badgeId` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=5032` — alliance member list 5032

- 常量: `Constant.PROT_ALLIANCE_MEMBER_LIST_5032`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `isJoinLeagueWar` |
| 2 | byte | `allowKickMember` |
| 3 | long | `playerId` |
| 4 | string | `nickname` |
| 5 | int | `avata` |
| 6 | byte | `alliancePosition` |
| 7 | string | `alliancePositionName` |
| 8 | int | `ranking` |
| 9 | byte | `rank` |
| 10 | long | `fame` |
| 11 | long | `influence` |
| 12 | byte | `cityCount` |
| 13 | long | `lastOnlineTime` |
| 14 | int | `personalScore` |
| 15 | int | `allianceDonationNulearCount` |

---

#### `cmd=5033` — alliance base info 5033

- 常量: `Constant.PROT_ALLIANCE_BASE_INFO_5033`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.allianceId` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `allianceName` |
| 2 | string | `leaderName` |
| 3 | string | `founderName` |
| 4 | int | `memberCount` |
| 5 | int | `memberCountMax` |
| 6 | int | `ranking` |
| 7 | long | `fame` |
| 8 | string | `allianceDescription` |
| 9 | int | `badgeId` |
| 10 | int | `hasCapital` |
| 11 | int | `capitalLevel` |
| 12 | byte | `joinAllianceDirectly` |
| 13 | long | `allianceScore` |

---

#### `cmd=5042` — alliance join directly option update 5042

- 常量: `Constant.PROT_ALLIANCE_JOIN_DIRECTLY_OPTION_UPDATE_5042`
- 成功判定: `status1=this.status()||2=this.status()`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | byte | `this.canJoinDirectly?1:0` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `pageNum` |
| 2 | int | `pageCount` |
| 3 | long | `allianceGiftId` |
| 4 | int | `rcType` |
| 5 | string | `from` |
| 6 | string | `rcImage` |
| 7 | string | `description` |
| 8 | byte | `status` |
| 9 | long | `remainTime` |
| 10 | int | `rcType` |
| 11 | string | `rcImage` |
| 12 | string | `rcName` |
| 13 | int | `rcAmount` |
| 14 | int | `channelType` |
| 15 | byte | `earlierLoadMode` |
| 16 | byte | `chatType` |
| 17 | int | `chatChannel` |
| 18 | long | `chatId` |
| 19 | int | `senderPlayerType` |
| 20 | long | `playerId` |
| 21 | string | `nickname` |
| 22 | long | `fame` |
| 23 | byte | `rank` |
| 24 | byte | `position` |
| 25 | string | `playerTitle` |
| 26 | string | `allianceTitle` |
| 27 | long | `receiverPlayerId` |
| 28 | string | `receiverNickname` |
| 29 | int | `avata` |
| 30 | string | `allianceName` |
| 31 | long | `chatTime` |
| 32 | int | `chatChannel` |
| 33 | long | `chatId` |
| 34 | int | `senderPlayerType` |
| 35 | long | `playerId` |
| 36 | string | `nickname` |
| 37 | long | `fame` |
| 38 | byte | `rank` |
| 39 | byte | `position` |
| 40 | string | `playerTitle` |
| 41 | string | `allianceTitle` |
| 42 | long | `receiverPlayerId` |
| 43 | string | `receiverNickname` |
| 44 | int | `avata` |
| 45 | string | `allianceName` |
| 46 | string | `voiceFilePath` |
| 47 | long | `chatTime` |
| 48 | int | `chatChannel` |
| 49 | long | `chatId` |
| 50 | int | `senderPlayerType` |
| 51 | long | `playerId` |
| 52 | string | `nickname` |
| 53 | long | `fame` |
| 54 | byte | `rank` |
| 55 | byte | `position` |
| 56 | string | `playerTitle` |
| 57 | string | `allianceTitle` |
| 58 | long | `receiverPlayerId` |
| 59 | string | `receiverNickname` |
| 60 | int | `avata` |
| 61 | string | `allianceName` |
| 62 | long | `flaundId` |
| 63 | long | `chatTime` |
| 64 | long | `chatId` |
| 65 | string | `chatColor` |
| 66 | byte | `boldFont` |
| 67 | long | `chatTime` |

---

#### `cmd=5043` — alliance join directly 5043

- 常量: `Constant.PROT_ALLIANCE_JOIN_DIRECTLY_5043`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.allianceId` |

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---

#### `cmd=5044` — alliance help list 5044

- 常量: `Constant.PROT_ALLIANCE_HELP_LIST_5044`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `avata` |
| 2 | string | `nickname` |
| 3 | byte | `helpType` |
| 4 | string | `helpMessage` |
| 5 | int | `helpLevel` |
| 6 | int | `helpedCount` |
| 7 | int | `helpedCountMax` |
| 8 | long | `helpId` |
| 9 | long | `playerId` |
| 10 | int | `avata` |
| 11 | string | `nickname` |
| 12 | byte | `helpType` |
| 13 | string | `helpMessage` |
| 14 | int | `helpLevel` |
| 15 | int | `helpedCount` |
| 16 | int | `helpedCountMax` |

---

#### `cmd=5045` — alliance help 5045

- 常量: `Constant.PROT_ALLIANCE_HELP_5045`
- 成功判定: `status1=this.status()||2=this.status()`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.helpId` |
| 2 | long | `this.playerId` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `pageNum` |
| 2 | int | `pageCount` |
| 3 | long | `allianceGiftId` |
| 4 | int | `rcType` |
| 5 | string | `from` |
| 6 | string | `rcImage` |
| 7 | string | `description` |
| 8 | byte | `status` |
| 9 | long | `remainTime` |
| 10 | int | `rcType` |
| 11 | string | `rcImage` |
| 12 | string | `rcName` |
| 13 | int | `rcAmount` |
| 14 | int | `channelType` |
| 15 | byte | `earlierLoadMode` |
| 16 | byte | `chatType` |
| 17 | int | `chatChannel` |
| 18 | long | `chatId` |
| 19 | int | `senderPlayerType` |
| 20 | long | `playerId` |
| 21 | string | `nickname` |
| 22 | long | `fame` |
| 23 | byte | `rank` |
| 24 | byte | `position` |
| 25 | string | `playerTitle` |
| 26 | string | `allianceTitle` |
| 27 | long | `receiverPlayerId` |
| 28 | string | `receiverNickname` |
| 29 | int | `avata` |
| 30 | string | `allianceName` |
| 31 | long | `chatTime` |
| 32 | int | `chatChannel` |
| 33 | long | `chatId` |
| 34 | int | `senderPlayerType` |
| 35 | long | `playerId` |
| 36 | string | `nickname` |
| 37 | long | `fame` |
| 38 | byte | `rank` |
| 39 | byte | `position` |
| 40 | string | `playerTitle` |
| 41 | string | `allianceTitle` |
| 42 | long | `receiverPlayerId` |
| 43 | string | `receiverNickname` |
| 44 | int | `avata` |
| 45 | string | `allianceName` |
| 46 | string | `voiceFilePath` |
| 47 | long | `chatTime` |
| 48 | int | `chatChannel` |
| 49 | long | `chatId` |
| 50 | int | `senderPlayerType` |
| 51 | long | `playerId` |
| 52 | string | `nickname` |
| 53 | long | `fame` |
| 54 | byte | `rank` |
| 55 | byte | `position` |
| 56 | string | `playerTitle` |
| 57 | string | `allianceTitle` |
| 58 | long | `receiverPlayerId` |
| 59 | string | `receiverNickname` |
| 60 | int | `avata` |
| 61 | string | `allianceName` |
| 62 | long | `flaundId` |
| 63 | long | `chatTime` |
| 64 | long | `chatId` |
| 65 | string | `chatColor` |
| 66 | byte | `boldFont` |
| 67 | long | `chatTime` |

---

#### `cmd=5046` — alliance help all 5046

- 常量: `Constant.PROT_ALLIANCE_HELP_ALL_5046`
- 成功判定: `status1=this.status()||2=this.status()`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `pageNum` |
| 2 | int | `pageCount` |
| 3 | long | `allianceGiftId` |
| 4 | int | `rcType` |
| 5 | string | `from` |
| 6 | string | `rcImage` |
| 7 | string | `description` |
| 8 | byte | `status` |
| 9 | long | `remainTime` |
| 10 | int | `rcType` |
| 11 | string | `rcImage` |
| 12 | string | `rcName` |
| 13 | int | `rcAmount` |
| 14 | int | `channelType` |
| 15 | byte | `earlierLoadMode` |
| 16 | byte | `chatType` |
| 17 | int | `chatChannel` |
| 18 | long | `chatId` |
| 19 | int | `senderPlayerType` |
| 20 | long | `playerId` |
| 21 | string | `nickname` |
| 22 | long | `fame` |
| 23 | byte | `rank` |
| 24 | byte | `position` |
| 25 | string | `playerTitle` |
| 26 | string | `allianceTitle` |
| 27 | long | `receiverPlayerId` |
| 28 | string | `receiverNickname` |
| 29 | int | `avata` |
| 30 | string | `allianceName` |
| 31 | long | `chatTime` |
| 32 | int | `chatChannel` |
| 33 | long | `chatId` |
| 34 | int | `senderPlayerType` |
| 35 | long | `playerId` |
| 36 | string | `nickname` |
| 37 | long | `fame` |
| 38 | byte | `rank` |
| 39 | byte | `position` |
| 40 | string | `playerTitle` |
| 41 | string | `allianceTitle` |
| 42 | long | `receiverPlayerId` |
| 43 | string | `receiverNickname` |
| 44 | int | `avata` |
| 45 | string | `allianceName` |
| 46 | string | `voiceFilePath` |
| 47 | long | `chatTime` |
| 48 | int | `chatChannel` |
| 49 | long | `chatId` |
| 50 | int | `senderPlayerType` |
| 51 | long | `playerId` |
| 52 | string | `nickname` |
| 53 | long | `fame` |
| 54 | byte | `rank` |
| 55 | byte | `position` |
| 56 | string | `playerTitle` |
| 57 | string | `allianceTitle` |
| 58 | long | `receiverPlayerId` |
| 59 | string | `receiverNickname` |
| 60 | int | `avata` |
| 61 | string | `allianceName` |
| 62 | long | `flaundId` |
| 63 | long | `chatTime` |
| 64 | long | `chatId` |
| 65 | string | `chatColor` |
| 66 | byte | `boldFont` |
| 67 | long | `chatTime` |

---

#### `cmd=5047` — alliance help request build 5047

- 常量: `Constant.PROT_ALLIANCE_HELP_REQUEST_BUILD_5047`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.buildingId` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=5048` — alliance help request research 5048

- 常量: `Constant.PROT_ALLIANCE_HELP_REQUEST_RESEARCH_5048`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.cityId` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---

#### `cmd=5050` — alliance war join switch 5050

- 常量: `Constant.PROT_ALLIANCE_WAR_JOIN_SWITCH_5050`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `allianceWarJoinState` |

---

#### `cmd=5051` — alliance gift list 5051

- 常量: `Constant.PROT_ALLIANCE_GIFT_LIST_5051`
- 成功判定: `status1=this.status()||2=this.status()`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.pageSize` |
| 2 | int | `this.pageNum` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `pageNum` |
| 2 | int | `pageCount` |
| 3 | long | `allianceGiftId` |
| 4 | int | `rcType` |
| 5 | string | `from` |
| 6 | string | `rcImage` |
| 7 | string | `description` |
| 8 | byte | `status` |
| 9 | long | `remainTime` |
| 10 | int | `rcType` |
| 11 | string | `rcImage` |
| 12 | string | `rcName` |
| 13 | int | `rcAmount` |
| 14 | int | `channelType` |
| 15 | byte | `earlierLoadMode` |
| 16 | byte | `chatType` |
| 17 | int | `chatChannel` |
| 18 | long | `chatId` |
| 19 | int | `senderPlayerType` |
| 20 | long | `playerId` |
| 21 | string | `nickname` |
| 22 | long | `fame` |
| 23 | byte | `rank` |
| 24 | byte | `position` |
| 25 | string | `playerTitle` |
| 26 | string | `allianceTitle` |
| 27 | long | `receiverPlayerId` |
| 28 | string | `receiverNickname` |
| 29 | int | `avata` |
| 30 | string | `allianceName` |
| 31 | long | `chatTime` |
| 32 | int | `chatChannel` |
| 33 | long | `chatId` |
| 34 | int | `senderPlayerType` |
| 35 | long | `playerId` |
| 36 | string | `nickname` |
| 37 | long | `fame` |
| 38 | byte | `rank` |
| 39 | byte | `position` |
| 40 | string | `playerTitle` |
| 41 | string | `allianceTitle` |
| 42 | long | `receiverPlayerId` |
| 43 | string | `receiverNickname` |
| 44 | int | `avata` |
| 45 | string | `allianceName` |
| 46 | string | `voiceFilePath` |
| 47 | long | `chatTime` |
| 48 | int | `chatChannel` |
| 49 | long | `chatId` |
| 50 | int | `senderPlayerType` |
| 51 | long | `playerId` |
| 52 | string | `nickname` |
| 53 | long | `fame` |
| 54 | byte | `rank` |
| 55 | byte | `position` |
| 56 | string | `playerTitle` |
| 57 | string | `allianceTitle` |
| 58 | long | `receiverPlayerId` |
| 59 | string | `receiverNickname` |
| 60 | int | `avata` |
| 61 | string | `allianceName` |
| 62 | long | `flaundId` |
| 63 | long | `chatTime` |
| 64 | long | `chatId` |
| 65 | string | `chatColor` |
| 66 | byte | `boldFont` |
| 67 | long | `chatTime` |

---

#### `cmd=5052` — alliance gift collect reward 5052

- 常量: `Constant.PROT_ALLIANCE_GIFT_COLLECT_REWARD_5052`
- 成功判定: `status1=this.status()||2=this.status()`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.allianceGiftId` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `rcType` |
| 2 | string | `rcImage` |
| 3 | string | `rcName` |
| 4 | int | `rcAmount` |
| 5 | int | `channelType` |
| 6 | byte | `earlierLoadMode` |
| 7 | byte | `chatType` |
| 8 | int | `chatChannel` |
| 9 | long | `chatId` |
| 10 | int | `senderPlayerType` |
| 11 | long | `playerId` |
| 12 | string | `nickname` |
| 13 | long | `fame` |
| 14 | byte | `rank` |
| 15 | byte | `position` |
| 16 | string | `playerTitle` |
| 17 | string | `allianceTitle` |
| 18 | long | `receiverPlayerId` |
| 19 | string | `receiverNickname` |
| 20 | int | `avata` |
| 21 | string | `allianceName` |
| 22 | long | `chatTime` |
| 23 | int | `chatChannel` |
| 24 | long | `chatId` |
| 25 | int | `senderPlayerType` |
| 26 | long | `playerId` |
| 27 | string | `nickname` |
| 28 | long | `fame` |
| 29 | byte | `rank` |
| 30 | byte | `position` |
| 31 | string | `playerTitle` |
| 32 | string | `allianceTitle` |
| 33 | long | `receiverPlayerId` |
| 34 | string | `receiverNickname` |
| 35 | int | `avata` |
| 36 | string | `allianceName` |
| 37 | string | `voiceFilePath` |
| 38 | long | `chatTime` |
| 39 | int | `chatChannel` |
| 40 | long | `chatId` |
| 41 | int | `senderPlayerType` |
| 42 | long | `playerId` |
| 43 | string | `nickname` |
| 44 | long | `fame` |
| 45 | byte | `rank` |
| 46 | byte | `position` |
| 47 | string | `playerTitle` |
| 48 | string | `allianceTitle` |
| 49 | long | `receiverPlayerId` |
| 50 | string | `receiverNickname` |
| 51 | int | `avata` |
| 52 | string | `allianceName` |
| 53 | long | `flaundId` |
| 54 | long | `chatTime` |
| 55 | long | `chatId` |
| 56 | string | `chatColor` |
| 57 | byte | `boldFont` |
| 58 | long | `chatTime` |

---

#### `cmd=5053` — alliance gift remove 5053

- 常量: `Constant.PROT_ALLIANCE_GIFT_REMOVE_5053`
- 成功判定: `status1=this.status()||2=this.status()`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.allianceGiftId` |

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

#### `cmd=5054` — alliance gift clear 5054

- 常量: `Constant.PROT_ALLIANCE_GIFT_CLEAR_5054`
- 成功判定: `status1=this.status()||2=this.status()`

**请求参数**: 无（类未定义 encode）

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

#### `cmd=5055` — alliance war config 5055

- 常量: `Constant.PROT_ALLIANCE_WAR_CONFIG_5055`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | byte | `this.type` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `toRanking` |
| 2 | string | `name` |
| 3 | string | `description` |
| 4 | int | `icon` |
| 5 | int | `amount` |
| 6 | byte | `leaderSpecial` |
| 7 | string | `name` |
| 8 | string | `description` |
| 9 | int | `icon` |
| 10 | int | `amount` |
| 11 | byte | `toRanking` |
| 12 | string | `name` |
| 13 | string | `description` |
| 14 | int | `icon` |
| 15 | int | `amount` |
| 16 | int | `sectionId` |
| 17 | string | `sectionName` |
| 18 | string | `name` |
| 19 | string | `description` |
| 20 | int | `icon` |
| 21 | int | `amount` |
| 22 | int | `progressValue` |
| 23 | int | `progressTarget` |
| 24 | byte | `collectStatus` |
| 25 | string | `ruleDescription` |

---

#### `cmd=5056` — alliance war personal score reward collect 5056

- 常量: `Constant.PROT_ALLIANCE_WAR_PERSONAL_SCORE_REWARD_COLLECT_5056`
- 成功判定: `status1=this.status()||2=this.status()`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.sectionId` |

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

#### `cmd=5057` — alliance cimelia list 5057

- 常量: `Constant.PROT_ALLIANCE_CIMELIA_LIST_5057`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `showType` |
| 2 | int | `itemID` |
| 3 | string | `name` |
| 4 | string | `description` |
| 5 | int | `icon` |
| 6 | int | `amount` |

---

#### `cmd=5058` — alliance cimelia distribute 5058

- 常量: `Constant.PROT_ALLIANCE_CIMELIA_DISTRIBUTE_5058`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.playerId` |
| 2 | int | `this.items.length` |
| … | 循环 | `for(var e` |
| 3 | int | `i.itemID` |

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---

#### `cmd=5059` — alliance random name 5059

- 常量: `Constant.PROT_ALLIANCE_RANDOM_NAME_5059`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `randomId` |
| 2 | string | `randomName` |
| 3 | long | `expireTime` |

---

#### `cmd=5060` — alliance mark 5060

- 常量: `Constant.PROT_ALLIANCE_MARK_5060`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.tileX` |
| 2 | int | `this.tileY` |
| 3 | string | `this.title` |
| 4 | string | `this.icon` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `armyId` |
| 2 | int | `amount` |

---

#### `cmd=5061` — alliance mark delete 5061

- 常量: `Constant.PROT_ALLIANCE_MARK_DELETE_5061`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.tileX` |
| 2 | int | `this.tileY` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `armyId` |
| 2 | int | `amount` |

---

#### `cmd=5062` — alliance map mark list 5062

- 常量: `Constant.PROT_ALLIANCE_MAP_MARK_LIST_5062`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `count` |
| 2 | int | `x` |
| 3 | int | `y` |
| 4 | string | `text` |
| 5 | string | `icon` |
| 6 | long | `time` |

---
