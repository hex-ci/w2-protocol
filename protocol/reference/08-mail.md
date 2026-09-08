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

> 头部: `u8 mail_type`（回显）+ `u32 page_count` + `u32 page_num` + `u32 条数`，随后循环条目。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u64 | `mail_id` | 邮件 ID |
| 2 | string | `mail_title` | 邮件标题 |
| 3 | string | `mail_sender_or_receiver` | 发件人（系统邮件为「系统」） |
| 4 | u64 | `create_time` | 创建时间戳（**毫秒**） |
| 5 | u8 | `readed` | 是否已读 |
| 6 | u32 | `color` | 标题颜色（RGBA，如 0x00fff6b8） |
| 7 | u8 | `attachment_flag` | 附件标志：**1=有附件，255=无附件** |

---

### `cmd=9002` — 查询邮件详情

**请求参数**（按序拼接为 AES 明文）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | u8 | `mail_type` | 邮件分类 |
| 2 | u64 | `mail_id` | 邮件 ID |

**响应**（status 为 **1** 时成功；失败时仅 1 字节状态 + 错误文案字符串）:

> 头部: `u8 mail_type`（回显），随后固定字段，最后为附件列表（`u8 attachment_flag` + `u8 条数` + 条目循环）。

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `mail_receiver` | 收件人 |
| 2 | u64 | `sender_player_id` | 发件玩家 ID（系统邮件为 0） |
| 3 | string | `sender_nickname` | 发件人昵称 |
| 4 | u64 | `create_time` | 创建时间戳（毫秒） |
| 5 | string | `mail_title` | 邮件标题 |
| 6 | string | `mail_content` | 正文（HTML 片段） |
| 7 | u8 | `attachment_flag` | 是否有附件 |

附件条目（仅 attachment_flag=1 时存在，条数前置 1 字节）:

| 顺序 | 类型 | 字段 | 说明 |
|---|---|---|---|
| 1 | string | `name` | 道具名 |
| 2 | string | `description` | 道具描述 |
| 3 | u32 | `icon` | 图标编号 |
| 4 | u32 | `amount` | 数量 |

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
| 1 | u64 | `mail_id` | 邮件 ID（仅 ID，不带 mail_type） |

**响应**: 无业务数据（客户端仅刷新道具列表）。status 为 **1** 时成功。

失败文案（均 status=-1，可据此分支处理）:

| 场景 | 错误文案 |
|---|---|
| 附件已领过 | 请勿重复领取奖励！ |
| 邮件无附件 | 没有可供领取的奖励！ |
| 邮件已删除/不存在 | 您查看的邮件已经不存在 |
