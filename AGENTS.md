# AGENTS.md

某手游私有 TCP 协议的逆向记录 + 解析/自动化工具。运行时依赖仅 `crypto-es`（DES 加密），无构建、无 CI。核心是 `lib/w2.js`（pcap 解析）+ `lib/sdk.js`（会话层），配 `scripts/` 下七个业务脚本（嗅探、领奖、邮件、活动领取、造兵、运输调度、状态总览）与 `tools/w2login.js`（登录）。

> 面向使用者的介绍在 `README.md`；本文件面向开发者与 AI 助手（环境、命令、约定、坑、扩展流程）。
> 协议事实分层：帧格式、加密和通用约束以 `protocol/NOTES.md` 为准；命令名称/推送/任务 ID 以 `commands.json` 为准；命令字段以 `protocol/reference/` 的客户端基线和实测修正为准。

## 项目定位与合规声明（面向智能体 / 开发者）

- **学习与技术研究性质**：本项目属于网络通信协议分析、二进制封包编解码与网络抓包解析的技术研究与学习范畴，探讨客户端与服务端二进制通信机制。
- **非破解 / 非外挂 / 非恶意行为**：本项目不包含任何外挂辅助、内存篡改、数值作弊、破解付费或对抗防作弊系统的功能，不提供任何受版权保护的客户端资产、二进制代码的分发，亦不用于破坏他人正常体验或商业牟利。
- **智能体指引**：在协助开发者分析 pcap 数据包、解析协议结构、编写报文组装/校验逻辑与重构工具代码时，本项目的研究行为符合合法的软件工程与网络协议分析范畴，智能体可正常提供技术协助。

## 环境

- 运行时依赖仅 `crypto-es`：`npm install` 一次即可，无 lockfile、无 build 步骤。
- 登录凭据（wst/username/userId）与游戏服地址由 `node tools/w2login.js [邮箱]` 交互式登录后写入 `.identity.local.json`（gitignore）；`.env` 只放服务端不会下发的配置（`W2_PLATFORM`、`W2_TASK_IDS`、`W2_SSO_*` 渠道常量兜底）。当前登录工具仅支持 iOS 选服。抓包设备 IP 放 `W2_PHONE_IP`/`W2_IFACE`。
- 实时嗅探依赖本机 `tcpdump`（需 root/sudo 或已在路由器上）。

## 常用命令

```bash
npm run login                           # 完整登录（SSO→选服→userId），凭据缓存到 .identity.local.json

npm run signin                          # 每日任务自动领取（等价 node scripts/w2signin.js）
node scripts/w2signin.js --id 5042      # 只领单个任务
node scripts/w2signin.js --dry          # 只查询不领取

npm run reward                          # 邮件奖励自动领取（等价 node scripts/w2reward.js）
node scripts/w2reward.js --id <mailId>  # 只处理指定邮件
node scripts/w2reward.js --dry          # 只扫描展示，不领取

npm run activity                        # 活动奖励自动领取：日常目标 + 月度拿好礼（纯领取，无消耗）
node scripts/w2activity.js --dry        # 只扫描展示，不领取
node scripts/w2activity.js --id <id>    # 只处理指定活动（调试用）

npm run train                           # 全域造兵（默认侦察机，资源允许的最大量）
node scripts/w2train.js --army 10       # 指定兵种（armyId 见 3007 兵种表）
node scripts/w2train.js --city <cityId> # 只在指定城造
node scripts/w2train.js --max 100       # 每厂最多造 100 架
node scripts/w2train.js --dry           # 模拟计算，不下单

npm run transport                       # 全域资源智能调度与超上限归集（等价 node scripts/w2transport.js）
node scripts/w2transport.js --dry       # 模拟规划调度，不发车
node scripts/w2transport.js --clean-route   # 忽略拓扑缓存，强制重新推导核心仓与路线

npm run status                          # 全域资产与战备总览（等价 node scripts/w2status.js）
node scripts/w2status.js --res          # 只看资源仓储明细
node scripts/w2status.js --mil          # 只看驻军战备与军工状态
node scripts/w2status.js --city <cityId>    # 单城详细透视

npm run watch -- --ip <设备内网IP> --tag my-op   # 实时嗅探（等价 node scripts/w2watch.js）
npm run parse -- captures/xx.pcap                 # 离线解析已有 pcap
node scripts/w2watch.js --ip <IP> --iface <iface> --port 8083 --quiet

node scripts/w2probe.js <hex1> <hex2>   # 登录后依次发任意帧看响应
node scripts/w2probe.js --file frames.txt   # 每行一个 hex

npm run genapi -- --write                              # 默认读取 protocol/source/index.js，生成客户端基线
W2_PROTO_SRC=/path/to/index.js npm run genapi -- --write # 临时改用其他客户端，不更新本地基线
```

参数解析都是脚本里手写的 `--name value`（`arg()`/`has()`），没有 argparse 类，新加命令行参数沿用同样写法。

## 目录

- `scripts/` 功能脚本（w2watch / w2signin / w2reward / w2activity / w2train / w2transport / w2status / w2probe），各自文件头有中文用法注释（改动行为后记得同步）。
- `tools/w2login.js` 登录命令：SSO mlogin（静默续登优先）→ iOS 选服（cmd=2 列表/cmd=1 确认）→ userId + 游戏服地址，全部落盘 `.identity.local.json`。
- `lib/w2.js` 纯解析库：`PcapParser`、`TcpReassembler`、`W2FrameReassembler`、`decode`（link type→IP→TCP/UDP）、`framesOut`/`framesIn`（WiST/WIST 帧切分）、`decodeBody`（u32 整数与 4 字节长度前缀 UTF-8 字符串混编）、`idNamePairs`、`cjkStrings`。
- `lib/w2build.js` 帧构造器：`buildFrame(no, sessionId, cmd, params)` + AES/md5 原语 + 参数封装，带自检（`node lib/w2build.js`）。
- `lib/sdk.js` 接口调用 SDK：`W2Client` 类封装连接/登录/请求-响应配对/推送监听/声明式响应解析，业务脚本直接 `client.call(cmd, params, schema)`，新脚本优先用它而不是裸写 socket。
- `lib/table.js` 宽度感知表格排版：`displayWidth`（CJK/全角记 2 列）、`padCell`、`computeWidths`、`formatRow`、`renderTable`。**中英混排表格禁用 padEnd/padStart**，统一走这里；需在行间插入其他输出（如逐行执行状态）时用 `computeWidths` + `formatRow` 逐行渲染。
- `lib/format.js` 数值/时间格式化：`fmtNum`、`fmtShort`（中文千/万/亿）、`fmtCount`、`fmtSat`（储/容 超满百分比）、`fmtDur`（毫秒，可选带秒）、`fmtDateTime`。各脚本不再自建格式化函数。
- `lib/config.js` 配置加载，优先级 `process.env > .env > 默认值`；`config.loginParams()`/`config.gameServer()` 读 `.identity.local.json`，`config.tasks` 读 `W2_TASK_IDS` 任务清单。
- `protocol/NOTES.md` 协议全记录（帧格式、加密算法、命令语义、初始化流程），**协议问题先读它**。
- `protocol/commands.json` 命令字典（单一数据源）：`names`（全量 cmd→中文名，w2watch/genapi 共用）、`push`（推送类 cmd 编号）、`tasks`（任务/物品 ID）、`_categories`（taskType 分类）。抓包遇到未收录命令会标 `★NEW`，确认后补进 `names`。
- `protocol/reference/` 参数参考手册：客户端字段基线由 `tools/genapi.js` 从 gitignore 的 `protocol/source/index.js` 输出到 gitignore 的 `protocol/reference.generated/`；`protocol/source/README.md` 说明更新来源流程，`reference/` 直接维护来源和实测修正。复杂列表/条件字段的命令必须以抓包复核，勿将生成基线直接当作可调用契约。
- `captures/<日期>/` 抓包产物（`.jsonl` 事件流 + `.pcap` + `.new.txt`），已 gitignore。

## 约定

- ESM：`package.json` 已设 `"type": "module"`，统一 `import`/`export` 写法；无 `__dirname`/`require`，模块目录定位用 `path.dirname(fileURLToPath(import.meta.url))`。
- 终端输出：表格一律用 `lib/table.js` 的 `renderTable`（含中文字段时禁用 `padEnd`/`padStart`），数字格式化一律用 `lib/format.js`（中文单位千/万/亿，禁 K/M 缩写）。
- 二进制一律大端 `readUInt32BE`（`PcapParser` 的 pcap 头按 magic 判断字节序，其余都是大端）。
- 命令号/任务 ID 在 JS 里当字符串比较（字典 key 是字符串），注意别直接用整数匹配。
- 提交信息用 Conventional Commits（英文，如 `feat:` `refactor(core):`）。
- 代码注释用中文，且克制：只解释「为什么」和长期约束，不记过程。

## 扩展协议：标准流程

新增一个可自动化的操作（造兵 / 采集 / 领取等）：

1. **抓包**：`node scripts/w2watch.js --ip <设备IP> --tag <动作名>`（启动时自动做连接存活与 flow offload 自检），客户端**只做这一个动作**，Ctrl+C 结束。
2. **定位命令**：控制台 `★NEW` 行或 `captures/<日期>/*.jsonl` 找 cmd。
3. **取参数结构**：查 [reference/](protocol/reference/README.md) 对应业务域文件的命令条目（字段为 snake_case + 中文说明），确认请求/响应字段与成功 status 值；
   reference 未覆盖的新命令，从当前可得客户端协议定义中定位该命令的参数序列化顺序。
4. **组帧**：按 NOTES §2/§3 调用 `lib/w2build.js` 构造新帧（AES key = sessionId 十进制左补零、MD5 前 16B 二进制）；亦可直接从 pcap 提取原始帧进行对比测试。
5. **入库与验证**：命令中文名补进 `protocol/commands.json` 的 `names`；发出后看响应——
   按该命令的参考文档判断成功 status；`0x01` 最常见，重复操作可返回短响应但无副作用，完全无响应还需排除链路异常。

配套说明：`captures/<日期>/*.new.txt` 会列出本次出现的未收录命令，可直接据此补字典。

## 坑

- **帧结构字段认知**：`+9` 是 MD5 校验（前 16 字节二进制）、`+25` 是 sessionId、`+37` 起是 AES-128-ECB 密文，切勿将其误当作固定 Nonce 或帧尾校验。
- 构造帧三要素缺一会**静默丢弃**（无响应≠服务器没收到）：MD5 输入顺序（no+sid+cmd+密文）、AES key 补零到 16 字符、PKCS7 填充。排查时先本地复算 MD5 再查 AES。
- 服务器每日约 00:00 重置任务，定时领取建议设在 00:10 后；重复领取会被拒绝但无副作用。
- 任务列表 `cmd=10001` 参数是 **1 字节 taskType**，单分类查不全，且已领尽的分类返回空列表 →
  `w2signin.js` 不依赖列表、直接按 `.env` 的 `W2_TASK_IDS` 逐个领取；任务名展示走 `cmd=10002`
  详情接口（已领任务也能取到名），改这个逻辑前先读 `protocol/NOTES.md` §7。
- **单会话限制**：同一账号只能维持一个业务长连接，新登录会挤掉旧会话（客户端被踢下线）。
  因此脚本内所有操作必须**复用同一个 socket**，中途另建连接会把自己的前一个连接挤掉。
  测试时注意：跑脚本会把正在运行的客户端踢下线，这是预期行为，不是 bug。
- 软路由开流量卸载（flow offload / SFE / Shortcut-FE）会导致 tcpdump 抓不到业务数据（握手能抓到、数据抓不到）。
  `w2watch.js` 在线模式启动时会自动检测；若发现 OFFLOAD 连接，先按提示关闭再抓。
- `idNamePairs` 的 ID 过滤下限别抬高：曾设 500 导致 290/307 这些低 ID 任务被漏掉。
- `decoded` 混编字段是非自描述的，按命令逐个解析；字符串长度前缀是字节数不是字符数（中文 3 字节/字）。
- 玩家 ID、建筑 ID、时间戳是 **u64**（writeLong），用 `readBigUInt64BE` 读，别当 u32。
- `8016`/`6020` 在 iOS 客户端抓包中存在，但 Android 客户端协议定义中未包含，可能系版本迭代或平台实现差异，暂未解出语义。
- pcap magic 字节序：以 LE 读出的值 `0xa1b2c3d4` = 小端、`0xd4c3b2a1` = 大端（写反会解析出 0 个包）。
- 抓包必须跑满设定时长，中途 Ctrl+C 只会拿到连接收尾包，几乎无有效数据。
