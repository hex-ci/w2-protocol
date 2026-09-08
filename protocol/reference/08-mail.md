# 邮件

> 7 个命令（cmd 9001 ~ 9008）。所有响应均以 1 字节 status 打头，成功值见各条目。

### `cmd=9001` — 查询邮件列表

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `mail_type` | 邮件分类 |
| 2 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 3 | u8 | `page_size` | 每页条数 |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `mail_type` | 邮件分类 |
| 2 | u32 | `page_count` | 总页数 |
| 3 | u32 | `page_num` | 页码（从 0 或 1 起，随接口） |
| 4 | u64 | `mail_id` | 邮件 ID |
| 5 | string | `mail_title` | 邮件标题 |
| 6 | string | `mail_sender_or_receiver` | — |
| 7 | u64 | `create_time` | 创建时间戳 |
| 8 | u8 | `readed` | 是否已读 |
| 9 | u32 | `color` | — |
| 10 | u8 | `attachment_flag` | 是否有附件 |

---

### `cmd=9002` — 查询邮件详情

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `mail_type` | 邮件分类 |
| 2 | u64 | `mail_id` | 邮件 ID |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `mail_type` | 邮件分类 |
| 2 | string | `mail_receiver` | — |
| 3 | u64 | `sender_player_id` | 玩家 ID |
| 4 | string | `sender_nickname` | 玩家昵称 |
| 5 | u64 | `create_time` | 创建时间戳 |
| 6 | string | `mail_title` | 邮件标题 |
| 7 | string | `mail_content` | — |
| 8 | u8 | `attachment_flag` | 是否有附件 |
| 9 | string | `name` | 名称 |
| 10 | string | `description` | 描述文案 |
| 11 | u32 | `icon` | 图标编号 |
| 12 | u32 | `amount` | 数量 |

---

### `cmd=9003` — 删除邮件

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `mail_type` | 邮件分类 |
| 2 | u32 | `mail_ids.length` | — |
| 3 | 循环 | — | 按前导计数字段循环写入后续字段 |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=9004` — 发送邮件

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `receiver` | — |
| 2 | u8 | `alliance_mail` | 军团 |
| 3 | string | `subject` | — |
| 4 | string | `content` | — |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=9006` — 获取客服反馈配置

**请求参数**: 无

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 含列表：先读计数字段，再按下列顺序循环读取每个条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `receiver_name` | 名称 |

---

### `cmd=9007` — 提交客服反馈

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `receiver_name` | 名称 |
| 2 | string | `title` | — |
| 3 | string | `content` | — |
| 4 | string | `happen_time` | 时间戳（毫秒） |
| 5 | u32 | `x` | 地图 X 坐标 |
| 6 | u32 | `y` | 地图 Y 坐标 |
| 7 | string | `android_id` | — |
| 8 | string | `model` | — |
| 9 | string | `sdk_version` | — |
| 10 | string | `os_version` | — |
| 11 | string | `resolution` | — |
| 12 | string | `client_version` | 客户端版本号 |
| 13 | string | `network_info` | — |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。

---

### `cmd=9008` — 领取邮件附件

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `mail_id` | 邮件 ID |

**响应**: 无业务数据。status 为 **1** 时成功；失败时为状态字节 + 错误文案。
