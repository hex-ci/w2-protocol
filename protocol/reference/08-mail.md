# 邮件

> 7 个命令（cmd 9001 ~ 9008）

#### `cmd=9001` — mail list 9001

- 常量: `Constant.PROT_MAIL_LIST_9001`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | byte | `this.mailType` |
| 2 | int | `this.pageNum` |
| 3 | byte | `this.pageSize` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `mailType` |
| 2 | int | `pageCount` |
| 3 | int | `pageNum` |
| 4 | long | `mailId` |
| 5 | string | `mailTitle` |
| 6 | string | `mailSenderOrReceiver` |
| 7 | long | `createTime` |
| 8 | byte | `readed` |
| 9 | int | `color` |
| 10 | byte | `attachmentFlag` |

---

#### `cmd=9002` — mail detail 9002

- 常量: `Constant.PROT_MAIL_DETAIL_9002`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | byte | `this.mailType` |
| 2 | long | `this.mailId` |

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | byte | `mailType` |
| 2 | string | `mailReceiver` |
| 3 | long | `senderPlayerId` |
| 4 | string | `senderNickname` |
| 5 | long | `createTime` |
| 6 | string | `mailTitle` |
| 7 | string | `mailContent` |
| 8 | byte | `attachmentFlag` |
| 9 | string | `name` |
| 10 | string | `description` |
| 11 | int | `icon` |
| 12 | int | `amount` |

---

#### `cmd=9003` — mail delete 9003

- 常量: `Constant.PROT_MAIL_DELETE_9003`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | byte | `this.mailType` |
| 2 | int | `this.mailIds.length` |
| … | 循环 | `for(var e` |

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---

#### `cmd=9004` — mail send 9004

- 常量: `Constant.PROT_MAIL_SEND_9004`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | string | `this.receiver` |
| 2 | byte | `this.allianceMail` |
| 3 | string | `this.subject` |
| 4 | string | `this.content` |

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---

#### `cmd=9006` — mail feedback configuration 9006

- 常量: `Constant.PROT_MAIL_FEEDBACK_CONFIGURATION_9006`

**请求参数**: 无（类未定义 encode）

**响应字段**（`status` 成功分支后按序读取）:

> 含列表循环，下列字段为「计数 + 条目数组」结构，条目字段按序排列：

| # | 类型 | 字段 |
|---|---|---|
| 1 | string | `receiverName` |

---

#### `cmd=9007` — mail feedback 9007

- 常量: `Constant.PROT_MAIL_FEEDBACK_9007`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | string | `this.receiverName` |
| 2 | string | `this.title` |
| 3 | string | `this.content` |
| 4 | string | `this.happenTime` |
| 5 | int | `this.x` |
| 6 | int | `this.y` |
| 7 | string | `this.androidID` |
| 8 | string | `this.model` |
| 9 | string | `this.SDKVersion` |
| 10 | string | `this.OSVersion` |
| 11 | string | `this.resolution` |
| 12 | string | `this.clientVersion` |
| 13 | string | `this.networkInfo` |

**响应字段**: 空（类未定义 decode，仅 `status` 字节）

---

#### `cmd=9008` — mail save attachment rewards 9008

- 常量: `Constant.PROT_MAIL_SAVE_ATTACHMENT_REWARDS_9008`

**请求参数**（按序列化顺序）:

| # | 类型 | 字段 / 表达式 |
|---|---|---|
| 1 | long | `this.mailId` |

**响应字段**: 空（仅 `status` 字节，纯操作命令）

---
