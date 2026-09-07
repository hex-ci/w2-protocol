# W2 Protocol

某手游移动端客户端与其业务服务器之间的**私有 TCP 协议**逆向记录，附带解析工具与自动化脚本。

> 抓包样本取自 iOS 端；协议由服务端统一实现，格式与客户端平台无关，Android 端应同样适用（未实测）。
零依赖，Node 18+。

> 本项目仅用于**学习网络协议分析**，不含任何游戏素材、客户端代码或规避付费/反作弊的内容。
> 文中不出现产品名与厂商信息；服务器地址、设备 IP、账号凭据一律通过 `.env` 配置，不入库。

开发者与 AI 协作指引见 **[AGENTS.md](AGENTS.md)**（目录详解、命令、代码约定、已知坑）。

## 快速开始

```bash
cp .env.example .env      # 填入你自己的服务器地址 / 设备 IP
npm run signin            # 每日任务自动领取
npm run watch -- --ip <设备内网IP> --tag my-op   # 实时嗅探
node bin/w2watch.js --file captures/xxx.pcap    # 离线解析已有 pcap
```

## 目录

```
bin/        三个入口：w2watch 实时嗅探 · w2signin 每日领取 · w2probe 帧探测
lib/        w2.js 协议解析库 · config.js 配置加载（.env）
protocol/   commands.json 命令字典 · NOTES.md 协议笔记 · frames.example.json 帧模板
scripts/    capture.sh 路由器抓包（含 flow offload 自检）
captures/   抓包产物，已 gitignore
```

> 真实帧存 `protocol/frames.local.json`（不入库），模板见 `frames.example.json`。

## 协议速查

业务主通道为一个长连接 TCP 端口（默认 8083，见 `.env`）。

**客户端 → 服务器**（魔数 `WiST`，变长帧）：

```
+0   4  magic "WiST"
+4   1  0x02
+5   4  u32 序号（每帧 +1）
+9   16 nonce
+25  4  u32 fieldA（建连阶段为具体 ID，稳态恒 0xffffffff）
+29  4  u32 长度 L
+33  L  payload → 首 u32 = 命令字
        L=20  → [命令字][参数 16B]
        L=224 → [握手命令][加密凭据]
```

**服务器 → 客户端**（魔数 `WIST`）：

```
+0   4  magic "WIST"
+4   4  u32 fieldA（0xffffffff = 服务器主动推送）
+8   4  u32 长度
+12  ... body：4 字节长度前缀 UTF-8 字符串 + 裸 u32 整数混编
```

命令字大致按功能分段：1xxx 心跳 / 9xxx 邮件 / 10xxx 任务奖励 / 26xxx 推送。
完整字典见 `protocol/commands.json`。

## 能力概览

协议骨架已完整解析，覆盖握手登录、心跳保活、邮件、任务/奖励查询与领取、服务端推送等。

完整命令字典（含任务 ID 对照）在 [`protocol/commands.json`](protocol/commands.json)，
**那里是唯一数据源**——本文件不再重复列举，以免两边不同步。抓包时遇到未收录的命令会自动标 `★NEW`。

支撑自动化的两个关键机制：

- **登录凭据可重放**：握手包里的加密凭据能被服务器原样接受，无需破解即可建立会话。
- **操作帧可重放**：业务帧整帧复用长期有效，服务器不防重放（重复领取会被拒绝，但无副作用）。

## 扩展新操作

想让工具支持新动作（造兵、采集等），流程是固定的：

1. `node bin/w2watch.js --ip <IP> --tag <标签>` 开始抓包
2. 只做这一个操作，记下控制台冒出的 `★NEW` 命令
3. 从 `captures/<日期>/*.jsonl` 里取出该操作的完整帧（53 字节那类）
4. 把帧写进 `protocol/frames.local.json`，命令名补进 `commands.json`

**关键点**：帧末 16 字节是校验值，无法凭空构造——**只能原样重放**。
抓一次就能永久使用（服务器不防重放）。细节见 `protocol/NOTES.md`。

## 坑记录

- **flow offload**：软路由开了流量卸载后抓不到长连接数据，需先关闭（抓完记得开回去）。
- **设备端**：关「随机 MAC 地址」；**保持屏幕常亮**——锁屏后 App 被挂起、连接会断。
- **抓包跑满时长**：中途 Ctrl+C 只会拿到连接收尾包。

## 许可

代码部分可自由使用（MIT）。请勿将本项目用于破坏他人游戏体验或商业牟利。
