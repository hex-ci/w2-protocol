# W2 游戏通信接口 API 文档

> 依据客户端协议定义与真实抓包逆向总结的游戏服务端接口规范。
> 目的：学习长连接二进制游戏接口的通用设计——寻址、编码、会话、错误处理与典型业务流。
> 传输细节（帧格式、加密）见 [`protocol/NOTES.md`](NOTES.md)；本文件聚焦**接口层**的输入输出规范。
> 所有示例值均为中性合成数据，不含任何真实账号信息。

---

## 1. 接口模型总览

游戏接口与常规 HTTP API 的本质区别：**没有 URL、没有方法动词、没有独立报文头**。
一切请求都是一条二进制帧，一切接口都由一个整数 `cmd`（命令字）寻址：

| 概念 | HTTP API | 本协议 |
|---|---|---|
| 接口寻址 | `METHOD /path` | `u32 cmd` |
| 请求体 | JSON / form | AES 密文内的参数序列 |
| 响应体 | JSON | 明文参数序列（TLV 混编） |
| 状态码 | HTTP status + code 字段 | 1 字节 `status` 前缀 |
| 连接模型 | 一请求一连接 | 单条长连接全双工复用 |
| 接口清单 | OpenAPI 文档 | 客户端内置协议定义 |

接口按方向分三类：

1. **Request/Response（请求-响应）**：客户端发 `cmd` 帧，服务端回同 `cmd` 帧。绝大多数接口属于此类。
2. **Server Push（服务端推送）**：`cmd ∈ 26001~26999`，sessionId 固定为 `0xffffffff`，客户端无请求也会收到。
3. **Heartbeat（心跳）**：低频维持连接的查询帧（如 `cmd=1` 服务器时间）。

### 1.1 文档结构

| 文件 | 内容 | 查什么 |
|---|---|---|
| [API.md](API.md)（本文件） | 调用规范、会话流程、代表性接口详解、示例代码 | 「这个协议怎么调」 |
| [reference/](reference/README.md) | **全量 407 个命令**逐条参数表（自动生成） | 「cmd=XXXX 收发什么字段」 |
| [NOTES.md](NOTES.md) | 帧格式、加密算法、抓包防错 | 「字节怎么编解码」 |
| [commands.json](commands.json) | cmd → 中文名字典（工具加载用） | 「这个 cmd 叫什么」 |

---

## 2. 通用调用约定

### 2.1 请求封装（所有接口一致）

```
请求帧 = WiST 头(37B) + AES(cmd 的业务参数)
```

调用方需要提供四个输入：

| 参数 | 类型 | 说明 |
|---|---|---|
| `no` | u32 | 连接内单调递增序号，从 1 开始 |
| `sessionId` | u32 | 随机数 0~2³¹-1；**每帧可独立生成**，服务端用它推导 AES 密钥解密 |
| `cmd` | u32 | 接口编号（见 §5 接口目录） |
| `params` | bytes | 按该接口参数表序列化的明文（空参命令传 0 字节） |

### 2.2 响应解封装

```
响应帧 = WIST 头(12B) + body
body   = u32 cmd + u8 status + 响应数据（仅 status 表示成功时存在）
```

`status` 语义（从客户端协议响应处理逻辑与各命令的成功判定归纳）：

| status | 含义 | 后续数据 |
|---|---|---|
| `0x01` | 成功（标准） | 接口定义的响应字段 |
| `0x00` | 成功（部分接口如建筑操作视为成功） | 同上 |
| `0x02` / `0x03` | 特殊成功分支（如登录的「确认顶号」流程） | 接口自定义 |
| 其他（负值，int8） | 失败 | `str errorMessage`（人类可读错误文案），**没有数字错误码** |

> 失败响应无统一错误码表，只有服务端下发的本地化错误文案字符串；客户端按 `status<0` 统一走错误分支。
> 实测已知的负值语义：`-2` = 未登录连接上发业务请求；`-10` = 同一连接重复登录。其余负值含义随命令而定。

### 2.3 数据类型编码（大端序）

| 类型 | 大小 | 编码 | 对应 JS 方法 |
|---|---|---|---|
| `byte` | 1B | 无符号 8 位整数 | `writeByte` |
| `short` | 2B | 无符号 16 位整数 | `writeShort` |
| `int` | 4B | 无符号 32 位整数 | `writeInt` |
| `long` | 8B | 无符号 64 位整数（**ID/时间戳一律用它**） | `writeLong` |
| `string` | 4B+N | u32 字节长度前缀 + UTF-8 字节 | `writeString` |
| 数组 | 4B+N×elem | `int count` 前缀 + 逐元素 | `for(i=count;i-->0;)` |

**两条铁律**：
1. 字符串长度前缀是**字节数**，中文每字 3 字节；
2. 玩家 ID、城池 ID、建筑 ID、时间戳均为 **8 字节 long**，按 4 字节读会错位。

---

## 3. 会话生命周期

```
TCP connect
  │
  ├─► [6]    hello          获取服务器配置（资源 CDN、开关、版本）
  ├─► [1001] login          提交凭据 wst，建立会话
  │◄─  推送 [26044]         会话 accessToken（UUID）
  │◄─  推送 [26022/26023]   功能调度 key
  │
  ├─►  业务查询/操作（任意顺序、可并发错峰发送）
  │    …
  └─►  断开（无优雅关闭帧，直接 TCP 挥手）
```

**会话规则**：
- 登录帧 `1001` 里的 `wst` token 是唯一凭据，长期有效，可脱离客户端独立建会话。
- **单账号单会话**：新会话登录成功瞬间，服务端主动断开同账号旧连接（推送 `1003` 被踢下线）。
- 断线后重连必须重走 `6 → 1001` 完整握手；服务端无会话恢复机制。
- 服务端**不校验序号连续性**，但客户端按 500ms/命令做发送频控。

---

## 4. 核心接口详解

以下选取覆盖各类参数形态的代表性接口。标注 ✦ 的为写操作。

### 4.1 会话与账号

#### `cmd=6` — 服务器配置
- **请求**：无参数（明文 0 字节）。
- **响应**：`str resourceHost` + `int tradeDownPrice` + `int tradeUpPrice` + 一组功能开关 int + `str serverVersion` + `str serverKey` + 快捷消息列表等 30+ 字段。

#### `cmd=1001` — 登录 ✦
- **请求**（明文 211B 量级）：

| 字段 | 类型 | 说明 |
|---|---|---|
| userId | long | 数字账号 ID |
| username | string | 账号 UUID |
| clientVer | int | 客户端版本整数 |
| platform | string | `"ios"` / `"android"` |
| channel | string | 渠道名 |
| language | string | `"zh"` |
| appKey | string | 32 位客户端内置常量 |
| wst | string | ★ 登录凭据（SSO 换取，52~64 字符） |
| installID | string | 32 位设备安装 ID |

- **响应**：`byte status`；成功后 `byte identity` + `long pushThreshold` + `byte age` + `long onlineTime` + `str realName`。
- **错误**：凭据失效时 status 为失败值 + 错误文案。
- **示例**（构造，`lib/w2build.js`）：

```js
import { buildFrame, p } from './lib/w2build.js';

const params = p.cat(
  p.u64(10001),                 // userId
  p.str('0f0e1d2c-3b4a-5968-7700-112233445566'),
  p.u32(3036900),               // clientVer（示例值）
  p.str('ios'),
  p.str('wst_zh_001'),
  p.str('zh'),
  p.str('APPKEY_0000000000000000000000000000'),
  p.str('ST-demoToken-1001-sso.example'),   // wst 凭据
  p.str('INSTALLID00000000000000000000000000')
);
const frame = buildFrame(1, 88888, 1001, params);
socket.write(frame);
```

- **凭据获取**：登录命令 `tools/w2login.js`（或 `npm run login`）模拟客户端完整流程：SSO mlogin（账号密码）→ 选服服务器 → userId + 游戏服地址，全部凭据自动落盘 `.identity.local.json`。SSO 两步 `mlogin`（① 空表单取 `flowExecutionKey`/`loginTicket`；② `email`/`password` DES-ECB 加密 + `_eventId=loginSubmit`）换取 `WST`。SSO 端点与 DES 密钥、appid/app_secret 等常量经 `.env` 的 `W2_SSO_*` 配置。
- **获取 userId**：userId 不在 SSO 响应中，它由选服协议（cmd=1）响应返回（`u64 _userid`），客户端本地缓存后每次登录复用。`tools/w2login.js` 已自动完成此步骤。注意 userId 必须与 wst 匹配——实测 userId 填 0/错值 + 有效 wst 会触发风控（返回「非法操作行为封停」文案）。userId 是账号终身属性。

#### `cmd=1005` — 玩家核心信息
- **请求**：无参数。
- **响应**：

| 字段 | 类型 | 说明 |
|---|---|---|
| gameStatus | int | 账号状态 |
| diamondOwned | int | **当前钻石数** |
| activeCityID | long | 当前主城 ID |
| totalCityCount | int | 城池总数 |
| totalPopulationCount | int | 总人口 |
| totalOfficerCount | int | 统帅数 |
| newbieProtect | int | 新手保护剩余 |
| cityImg | string | 主城形象 |
| nuclearCount / helpedCount / maxHelpCount / resBuildingCount | int | 各类计数 |
| vip | int | VIP 等级 |
| diamondCharged | long | 累计充值钻石 |

### 4.2 城池与资源

#### `cmd=2001` — 城池列表
- **请求**：无参数。
- **响应**：`byte isJoinLeagueWar` + `byte cityCount`，随后每城：

```
long cityId, string cityName, int x, int y,
string mayor, int population, int morale,
int coastal, int hasCarrier, string imgID,
byte isColonial, int mayorIcon, int constructNum,
byte haveResearchingTech (+ int techId + int techLevel 若为1),
int helpNum, int trainingCount, int officerCount, int officerCountMax
```

#### `cmd=2003` — 城内资源总览
- **请求**：无参数。
- **响应**：四资源各 6 字段（`long 储量, long 容量, int 基础产量, int 原始产量, long 军队占用, int 当前产量`）+ `int armyFortCount` + 各军 `int armyId + int curAmount` + 黄金 5 字段 + 人口 4 字段。

### 4.3 建筑系统（写操作范例）

| cmd | 接口 | 请求参数 | 响应要点 |
|---|---|---|---|
| `17003` ✦ | 新建建筑 | `int prototypeId` + `int position` | 成功时回读完整建筑实例：`long buildingID, int prototypeID, int level, int position, int buildingStatus, long remainTime, long finishTime, long totalTime` |
| `17006` ✦ | 升级建筑 | `long buildingID` | 空（成功即入队，靠推送/列表刷新状态） |
| `17004` ✦ | 取消当前操作 | `long buildingID` | 空 |
| `17005` ✦ | 拆除建筑 | `long buildingID` | 空 |
| `17009` | 可建建筑说明 | `int sceneType` | 建筑文案列表 |

> **写操作响应的通用形态**：要么回读创建出的完整实体，要么空响应。
> 空响应 ≠ 无响应——仍有一条 `status=0x01` 的帧回来；**完全无帧 = 校验失败被静默丢弃**。

#### 示例：新建一座建筑

```js
// 请求: int prototypeId=11(农田), int position=3
const frame = buildFrame(2, 88888, 17003, p.cat(p.u32(11), p.u32(3)));

// 成功响应 body 解析（伪代码）:
// status(1B)=0x01
// buildingID = readLong()   → 7000000000001234
// prototypeID = readInt()   → 11
// level = readInt()         → 1
// position = readInt()      → 3
// buildingStatus = readInt()→ 1 (建造中)
// remainTime = readLong()   → 300000 (ms)
```

### 4.4 军队系统

| cmd | 接口 | 请求参数 |
|---|---|---|
| `3001` ✦ | 训练军队 | `long buildingId` + `int armyId` + `int amount` |
| `3002` ✦ | 解散军队 | `int armyId` + `int amount` |
| `3003` ✦ | 取消训练 | `long buildingID` + `long trainingId` |
| `3004` ✦ | 训练并自动分城 | `long buildingId` + `int armyId` + `int amount` |
| `3014` ✦ | 治疗伤兵 | `byte healMode` + `int totalPrice` + `int count` × (`int armyId` + `int amount`) |
| `3005` | 训练队列查询 | `long buildingId` |

#### 示例：训练 100 名步兵

```js
// buildingId=7000000000001234(兵营), armyId=1(步兵), amount=100
const frame = buildFrame(3, 88888, 3001,
  p.cat(p.u64('7000000000001234'), p.u32(1), p.u32(100)));
// 响应: status=0x01，无附加字段；资源变化经 2003/2026 查询或推送感知
```

### 4.5 科技系统

#### `cmd=4002` — 开始研究 ✦
- **请求**：`int techniqueId` + `int racial`（兵种系）。
- **响应**：空；研究进度经 `4001` 查询。
- **`4001` 响应**：`int researchCenterCount` + 研究队列（`byte cityTask + long researchingId + int techniqueId + int level + long totalTime + long remainTime + byte helped`）+ 全科技表（等级、升级消耗五资源、前置建筑/科技/道具条件）。

### 4.6 任务与奖励

| cmd | 接口 | 请求参数 | 响应要点 |
|---|---|---|---|
| `10001` | 任务列表 | `byte taskType`（分类枚举） | 任务条目数组：`int taskId + string name + byte completed + byte readed + int pri + byte mainTask`，尾随 `str notice` |
| `10003` ✦ | 领取奖励 | `u32 taskId` | 发放物品数组：`string rcName + int rcType + string rcImage + int rcAmount + byte isTypeConsume` |
| `10005` | 任务分类 | 无 | `int type + string typeName + int unread + int completed` |

#### 示例：领取每日任务奖励（taskId=5042 钻石奖励）

```js
const frame = buildFrame(4, 88888, 10003, p.u32(5042));

// 成功响应 body:
// status(1B)=0x01
// count = readInt() → 1
//   rcName  = readString() → "钻石"
//   rcType  = readInt()    → 3 (资源类型枚举)
//   rcImage = readString() → "image/item/diamond.png"
//   rcAmount= readInt()    → 10
//   isTypeConsume = readByte() → 0
```

### 4.7 背包与道具

#### `cmd=8005` — 背包总表
- **请求**：无参数。
- **响应**：`int diamondOwned` + 道具数组，每项：

```
byte showType, byte functionType, int itemID, byte boxType,
[boxType=1: int merchandiseId + int price + 抽奖池子项…]
[boxType=5: int maxSelected + 自选子项…]
int curAmount, string name, string description, string useDescription,
int icon, byte level, int recycleCount, string recycleName, byte useType
```

#### `cmd=8001` — 开宝箱 ✦
- **请求**：`int itemID` + `int amount`（+ 可选自选数组 `int count + int[] selected`）。
- **响应**：`byte status`；成功时 `byte mode`，普通模式回 `int normalAmount + int additionAmount + int finalAmount` + 奖品列表（`int icon + string name + int chance`）。

### 4.8 邮件系统

| cmd | 接口 | 请求参数 |
|---|---|---|
| `9001` | 邮件列表 | `byte mailType` + `int pageNum` + `byte pageSize` |
| `9002` | 邮件详情 | `long mailId` |
| `9003` ✦ | 删除邮件 | `byte mailType` + `int count` + `long[] mailIds` |

- `9001` 响应：`byte mailType + int pageCount + int pageNum` + 条目数组（`long mailId + string title + string sender + long createTime + byte readed + int color + byte attachmentFlag`）。

### 4.9 排行榜

#### `cmd=24013` — 个人积分榜
- **请求**：`int pageNum` + `int pageSize`。
- **响应**：`int pageNum + int pageCount` + 条目数组：`long playerId + int ranking + string nickname + int avata + string allianceName + byte rank + long personalScore`。
- 同族接口：`24011` 自己名次、`24015` 军团积分榜、`24016/24017` 影响力榜——**分页参数与响应骨架完全同构**，仅条目字段随榜单类型变化。这是典型的一致性设计。

### 4.10 推送（服务端主动）

| cmd | 触发时机 | 数据 |
|---|---|---|
| `1003` | 账号被顶号 | 空（客户端弹窗回登录） |
| `26003` | 任务领取提示 / 活动上线 | 文本 + 末尾十进制 ID 串 |
| `26022` / `26023` | 功能解锁 | `long key` |
| `26044` | 会话建立 | `string accessToken`（UUID） |
| `26047` | 系统 toast | 消息文本 |

推送帧特征：sessionId = `0xffffffff`，与请求无配对关系，客户端按 cmd 分发给监听器。

---

## 5. 接口目录速查

完整字典（含推送、任务 ID）见 [`protocol/commands.json`](commands.json)。按业务域归组：

| 业务域 | cmd 段 | 代表接口 | 参考手册 |
|---|---|---|---|
| 基础服务 | 1~99 | 6 配置、11 充值项、12 推送注册 | [00-choice](reference/00-choice.md) |
| 账号会话 | 1001~1999 | 1001 登录、1005 核心信息、1006 改名、1030 好友 | [01-account](reference/01-account.md) |
| 城池资源 | 2001~2999 | 2001 城列表、2003/2026 资源、2018 产量加成 | [02-city](reference/02-city.md) |
| 军队 | 3001~3999 | 3001 训练、3002 解散、3014 治疗 | [03-army](reference/03-army.md) |
| 科技 | 4001~4999 | 4001 研究 info、4002 开始研究 | [04-tech](reference/04-tech.md) |
| 军团 | 5001~5999 | 5001 信息、5008 列表、5013 事件 | [05-alliance](reference/05-alliance.md) |
| 聊天 | 6001~6999 | 6001 配置、6016 消息 | [06-chat](reference/06-chat.md) |
| 商城 | 7001~7999 | 7003 兑换码 | [11-shop-pay](reference/11-shop-pay.md) |
| 背包道具 | 8001~8999 | 8001 开箱、8005 背包、8020 加速 | [07-item](reference/07-item.md) |
| 邮件 | 9001~9999 | 9001 列表、9002 详情、9003 删除 | [08-mail](reference/08-mail.md) |
| 任务奖励 | 10001~10999 | 10001 列表、10003 领取 | [09-task](reference/09-task.md) |
| 名将 | 11001~11999 | 11001 招募、11002 详情 | [10-officer](reference/10-officer.md) |
| 支付 | 12001~12999 | 12001/12005 支付相关 | [11-shop-pay](reference/11-shop-pay.md) |
| 公告系统 | 13002~14999 | 13002 公告、14020 反馈 | [16-notice](reference/16-notice.md) |
| 地图 | 15001~19999 | 15006 地块、19005 远征 | [12-map](reference/12-map.md) |
| 演习战 | 20002~21999 | 20002 战报、21008 演习 | [15-battle](reference/15-battle.md) |
| 活动 | 22001~23999 | 22001 列表、22007 充值活动、23001 组队活动 | [13-activity](reference/13-activity.md) |
| 排行 | 24001~24999 | 24011/24013/24016 | [14-ranking](reference/14-ranking.md) |
| 推送 | 26001~26999 | 见 §4.10 | [17-push](reference/17-push.md) |
| 战场玩法 | 29001~29999 | 29003 利刃之战 | [15-battle](reference/15-battle.md) |

---

## 6. 错误处理与重试策略

基于协议行为的工程建议：

1. **静默丢弃是常态**：md5/AES/参数长度任何一处不合法，服务端直接丢帧，**不回任何错误**。
   客户端做法是「发出即挂起，靠 `pendingCache` 超时兜底」——自研调用方应对每条请求设 5~10s 超时。
2. **业务失败看 status**：失败响应只有错误文案字符串，无可编程错误码。
   自动化逻辑建议按「status≠成功 → 查询类接口刷新状态 → 决定重试或放弃」处理。
3. **幂等性**：服务端不防重放。领取类接口重复调用返回「已领取」短响应，无副作用；但建造/训练类重复调用会真实重复下单，**写操作不幂等**，重试前必须先查询确认。
4. **频控**：客户端 500ms/命令去重；服务端对超频未实测出惩罚，但保守起见同类操作间隔 ≥1s。
5. **断线重连**：无会话恢复，重连后序号可重置，所有缓存态（任务列表、背包）需重新拉取。

---

## 7. 调试工具链与 SDK

**推荐业务脚本统一走 SDK**（`lib/sdk.js`），底层传输、加密、请求-响应配对全部封装：

```js
import { W2Client, p } from '../lib/sdk.js';

const c = new W2Client({ host, port, loginParams });  // loginParams 来自 config.loginParams()
await c.connect();                                   // hello + 登录
const r = await c.call(10001, p.byte(0), {           // schema 照抄 reference/ 字段表
  skip: 1, list: true,
  item: [['task_id','u32'], ['task_name','string'], ['completed','u8']],
});
if (r.ok) r.items.forEach(t => console.log(t.task_id, t.task_name));
c.onPush(26044, (push) => { /* 服务端推送 */ });
await c.close();
```

- `loginParams` 优先走凭据构造登录；`login`（整帧 hex 重放）仅作调试回退

- `c.call(cmd, params, schema?, opts?)`：`schema` 声明响应字段表（`fields`/`list`/`item`/`tail`/`skip`），自动解析成对象；`opts.okStatuses` 指定成功 status 集合（默认 `>0`，建筑类传 `[0, 1]`）
- 失败响应统一返回 `{ ok: false, status, message }`，`message` 为服务端错误文案
- 内置 10s 超时、500ms 请求间隔（对齐客户端频控）、单会话单连接
- 推送：`c.onPush(cmd, fn)`，收到 `26000` 段帧时触发回调

| 工具 | 用途 |
|---|---|
| `lib/sdk.js` | ★ 业务脚本首选：`W2Client` 标准化接口调用 |
| `scripts/w2watch.js` | 实时/离线嗅探，pcap → 可读事件流（jsonl） |
| `scripts/w2probe.js` | 登录后按序发送 hex 帧，观察响应 |
| `lib/w2build.js` | 程序化组帧（`buildFrame(no, sid, cmd, params)`），SDK 底层依赖 |
| `lib/w2.js` | 帧切分、body 混编解码、字符串提取 |
| `protocol/commands.json` | cmd → 语义字典（SDK 无关，工具加载用） |
| `tools/genapi.js` | 从客户端协议定义重新生成 `reference/` 全量参数表（客户端更新后重跑） |

推荐调试顺序：`w2watch` 抓真实操作 → 从 jsonl 定位 cmd → 查 [reference/](reference/README.md) 对应条目确认字段 → SDK `c.call()` 直接收发 → 异常时用 `w2probe` 发裸帧对照。

---

## 8. 附：接口设计风格总结（学习要点）

从这套协议可提炼的通用游戏接口设计范式：

1. **命令字即接口**：一个 int 寻址 + 一份两端共享的字段定义就是完整 API 契约。
2. **响应前置 status**：所有响应 1 字节状态打头，失败时只有文案没有码——简单但牺牲了程序化错误处理。
3. **变长实体用 count 前缀数组**：`int N + N×struct` 模式贯穿所有列表接口。
4. **ID 统一 64 位**：规避页游时代 32 位 ID 溢出的历史坑。
5. **字符串长度前缀按字节**：UTF-8 多字节字符下长度≠字符数，这是最常见的解析 bug 源。
6. **查询与推送双通道**：主动拉（`*INFO`/`*LIST` 类）+ 事件推（`26000` 段）结合，客户端本地缓存 `ProtCompleted` 实例做状态机。
7. **写操作响应极简**：只回 status 或回创建实体，详细状态靠随后的查询接口刷新——「命令-事件」分离风格。
8. **接口按业务域分段编号**：万位级分段让 cmd 本身自带路由语义，便于排查与字典化管理。
