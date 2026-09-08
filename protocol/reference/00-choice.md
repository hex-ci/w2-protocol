# 选服与渠道登录（Choice 通道）

> 14 个命令（cmd 1 ~ 30）

#### `cmd=1` — choice prot login 1

- 常量: `Constant.CHOICE_PROT_LOGIN_1`
- 成功判定: `status1=this.status()||2=this.status()||3=this.status()`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | string | `this._username` |
| 2 | string | `this._platform` |
| 3 | string | `this._channel` |
| 4 | string | `this._language` |
| 5 | byte | `this._is_self` |
| 6 | int | `this._server_id` |
| 7 | string | `this._device_info` |
| 8 | int | `this._client_tag` |
| 9 | string | `this._client_version` |
| 10 | byte | `this._confirm_to_abort_abandon` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `_userid` |
| 2 | int | `_server_id` |
| 3 | string | `_server_name` |
| 4 | string | `_server_host` |
| 5 | int | `_server_sort` |
| 6 | string | `_game_entry` |
| 7 | string | `_init_channel` |
| 8 | long | `_timevalue` |
| 9 | long | `_timeoffset` |
| 10 | string | `_confirm_message` |

---

#### `cmd=2` — choice prot server list 2

- 常量: `Constant.CHOICE_PROT_SERVER_LIST_2`
- 成功判定: `status1=this.status()||2=this.status()`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | string | `this._username` |
| 2 | string | `this._platform` |
| 3 | string | `this._channel` |
| 4 | string | `this._language` |
| 5 | string | `this._device_info` |
| 6 | int | `Constant.CLIENT_TAG` |
| 7 | string | `this._client_version` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `serverId` |
| 2 | string | `serverName` |
| 3 | string | `serverHost` |
| 4 | int | `pri` |
| 5 | string | `gameEntry` |
| 6 | byte | `_update_mode` |
| 7 | string | `_latest_version` |
| 8 | string | `_update_description` |
| 9 | string | `_update_url` |
| 10 | long | `serverTime` |
| 11 | long | `timeZoneOffsetToUTC` |
| 12 | int | `taskId` |
| 13 | string | `taskName` |
| 14 | byte | `completed` |
| 15 | byte | `identity` |
| 16 | long | `pushThreshold` |
| 17 | byte | `age` |
| 18 | long | `onlineTime` |
| 19 | string | `realName` |

---

#### `cmd=5` — choice prot check need update client 5

- 常量: `Constant.CHOICE_PROT_CHECK_NEED_UPDATE_CLIENT_5`
- 成功判定: `status1=this.status()||2=this.status()`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | string | `this._username` |
| 2 | string | `this._platform` |
| 3 | string | `this._channel` |
| 4 | string | `this._language` |
| 5 | string | `this._client_version` |
| 6 | string | `this._device_info` |
| 7 | string | `this._shieldVersionString` |
| 8 | int | `this._shieldVersionCode` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `_update_mode` |
| 2 | string | `_latest_version` |
| 3 | string | `_update_description` |
| 4 | string | `_update_url` |
| 5 | long | `serverTime` |
| 6 | long | `timeZoneOffsetToUTC` |
| 7 | int | `taskId` |
| 8 | string | `taskName` |
| 9 | byte | `completed` |
| 10 | byte | `identity` |
| 11 | long | `pushThreshold` |
| 12 | byte | `age` |
| 13 | long | `onlineTime` |
| 14 | string | `realName` |

---

#### `cmd=6` — server config 6

- 常量: `Constant.PROT_SERVER_CONFIG_6`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `resourceHost` |
| 2 | int | `tradeDownPrice` |
| 3 | int | `tradeUpPrice` |
| 4 | int | `campaignSwitch` |
| 5 | int | `vipSwitch` |
| 6 | int | `redeemSwitch` |
| 7 | int | `restrictShopSwitch` |
| 8 | int | `activitySwitch` |
| 9 | int | `hide3DiamondSpendSwitch` |
| 10 | int | `officerTroopSwitch` |
| 11 | string | `errorReportHost` |
| 12 | string | `serverVersion` |
| 13 | int | `mapType` |
| 14 | string | `errorReportHostIOS` |
| 15 | string | `serverKey` |
| 16 | int | `gmButtonSwitch` |
| 17 | int | `contactButtonSwitch` |
| 18 | byte | `allianceWarSwitch` |
| 19 | byte | `reportInsuranceSwitch` |
| 20 | byte | `lowFameAttackCostalSwitch` |
| 21 | byte | `minimizedDispatchInPercent` |
| 22 | byte | `userInputLimitFullSwitch` |
| 23 | byte | `userInputLimitLevel1Switch` |
| 24 | byte | `userInputLimitLevel2Switch` |
| 25 | byte | `userInputLimitLevel3Switch` |
| 26 | byte | `userInputLimitLevel4Switch` |
| 27 | byte | `sandboxServerSwitch` |
| 28 | int | `itemID` |
| 29 | string | `name` |
| 30 | string | `description` |
| 31 | int | `icon` |
| 32 | int | `amount` |
| 33 | long | `fameToUnlockMettleLevel1` |
| 34 | long | `fameToUnlockMettleLevel2` |
| 35 | long | `fameToUnlockMettleLevel3` |
| 36 | byte | `medalTransformType1` |
| 37 | int | `medalTransformItemId1` |
| 38 | string | `medalTransformItemName1` |
| 39 | byte | `medalTransformType2` |
| 40 | int | `medalTransformItemId2` |
| 41 | string | `medalTransformItemName2` |
| 42 | byte | `medalTransformType3` |
| 43 | int | `medalTransformItemId3` |
| 44 | string | `medalTransformItemName3` |
| 45 | byte | `userInputLimitLevel5Switch` |
| 46 | long | `chargeBonusFlashStartTime` |
| 47 | long | `chargeBonusFlashEndTime` |
| 48 | int | `accountAbandonReservedInDays` |
| 49 | int | `itemID` |
| 50 | int | `icon` |
| 51 | int | `maxTalentAddByCimelia` |
| 52 | byte | `disableAutoTrain` |
| 53 | string | `autoTrainInstruction` |
| 54 | int | `itemID` |
| 55 | int | `icon` |
| 56 | string | `name` |
| 57 | string | `description` |
| 58 | int | `amount` |
| 59 | int | `itemID` |
| 60 | int | `icon` |
| 61 | string | `name` |
| 62 | string | `description` |
| 63 | int | `amount` |
| 64 | int | `protocolVersion` |

---

#### `cmd=7` — server charge items 7

- 常量: `Constant.PROT_SERVER_CHARGE_ITEMS_7`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.payChannelIds.length` |
| … | 循环 | `for(var e` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `announcement` |
| 2 | int | `chargeId` |
| 3 | string | `skuid` |
| 4 | string | `functionId` |
| 5 | int | `outputDiamonds` |
| 6 | string | `name` |
| 7 | string | `price` |
| 8 | int | `icon` |
| 9 | string | `description` |
| 10 | string | `name` |
| 11 | int | `amount` |
| 12 | int | `icon` |
| 13 | long | `extraItemFinishTime` |
| 14 | byte | `hasAllianceGift` |
| 15 | string | `giftName` |
| 16 | int | `giftIcon` |

---

#### `cmd=11` — server charge items 11

- 常量: `Constant.PROT_SERVER_CHARGE_ITEMS_11`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.payChannelIds.length` |
| … | 循环 | `for(var e` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `announcement` |
| 2 | int | `chargeId` |
| 3 | string | `skuid` |
| 4 | string | `functionId` |
| 5 | int | `outputDiamonds` |
| 6 | string | `name` |
| 7 | string | `price` |
| 8 | int | `icon` |
| 9 | string | `description` |
| 10 | string | `name` |
| 11 | int | `amount` |
| 12 | int | `icon` |
| 13 | long | `extraItemFinishTime` |
| 14 | byte | `hasAllianceGift` |
| 15 | string | `giftName` |
| 16 | int | `giftIcon` |

---

#### `cmd=12` — push notifycation token 12

- 常量: `Constant.PROT_PUSH_NOTIFYCATION_TOKEN_12`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | string | `this.token` |
| 2 | byte | `this.deviceType` |

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---

#### `cmd=13` — push notifycation threshold 13

- 常量: `Constant.PROT_PUSH_NOTIFYCATION_THRESHOLD_13`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.armyCount` |

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---

#### `cmd=20` — prepared message config 20

- 常量: `Constant.PROT_PREPARED_MESSAGE_CONFIG_20`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `preparedMessageGroupId` |
| 2 | string | `title` |
| 3 | int | `priorityChatPublic` |
| 4 | int | `priorityChatAlliance` |
| 5 | int | `priorityChatPrivate` |
| 6 | int | `priorityAllianceMessage` |
| 7 | int | `priorityBattle` |
| 8 | long | `preparedMessageId` |
| 9 | int | `preparedMessageGroupId` |
| 10 | string | `message` |
| 11 | int | `priority` |

---

#### `cmd=21` — cimelia info config 21

- 常量: `Constant.PROT_CIMELIA_INFO_CONFIG_21`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | int | `this.itemIds.length` |
| … | 循环 | `for(var e` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | int | `itemID` |
| 2 | string | `name` |
| 3 | string | `description` |
| 4 | int | `icon` |

---

#### `cmd=25` — choice prot uc getuid 25

- 常量: `Constant.CHOICE_PROT_UC_GETUID_25`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | string | `this.sid` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `uid` |
| 2 | string | `creator` |

---

#### `cmd=26` — choice prot en huawei login sign verify 26

- 常量: `Constant.CHOICE_PROT_EN_HUAWEI_LOGIN_SIGN_VERIFY_26`
- 成功判定: `status1=this.status()||2=this.status()||3=this.status()`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | string | `this._playerId` |
| 2 | int | `this._level` |
| 3 | string | `this._sign` |
| 4 | string | `this._ts` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `_userid` |
| 2 | int | `_server_id` |
| 3 | string | `_server_name` |
| 4 | string | `_server_host` |
| 5 | int | `_server_sort` |
| 6 | string | `_game_entry` |
| 7 | string | `_init_channel` |
| 8 | long | `_timevalue` |
| 9 | long | `_timeoffset` |
| 10 | string | `_confirm_message` |

---

#### `cmd=27` — choice prot zh huawei login sign verify 27

- 常量: `Constant.CHOICE_PROT_ZH_HUAWEI_LOGIN_SIGN_VERIFY_27`
- 成功判定: `status1=this.status()||2=this.status()||3=this.status()`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | string | `this._playerId` |
| 2 | int | `this._level` |
| 3 | string | `this._sign` |
| 4 | string | `this._ts` |

**响应字段**（`status` 成功分支后按序读取）:

| # | 类型 | 字段 |
|---|---|---|
| 1 | long | `_userid` |
| 2 | int | `_server_id` |
| 3 | string | `_server_name` |
| 4 | string | `_server_host` |
| 5 | int | `_server_sort` |
| 6 | string | `_game_entry` |
| 7 | string | `_init_channel` |
| 8 | long | `_timevalue` |
| 9 | long | `_timeoffset` |
| 10 | string | `_confirm_message` |

---

#### `cmd=30` — choice prot guopan verify login token 30

- 常量: `Constant.CHOICE_PROT_GUOPAN_VERIFY_LOGIN_TOKEN_30`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | string | `this.game_uin` |
| 2 | string | `this.token` |

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---
