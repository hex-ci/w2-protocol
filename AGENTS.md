# AGENTS.md

某手游私有 TCP 协议的逆向记录 + 解析/自动化工具。零依赖，纯 Node 18+ 与 POSIX sh，无框架、无构建、无 CI。核心是 `lib/w2.js`（pcap/IP-TCP/WiST-WIST 帧/body 解码）配三个 bin 脚本（实时嗅探、每日领奖、帧探测）。协议逆向细节见 `protocol/NOTES.md`，命令字典见 `protocol/commands.json`。

> 面向使用者的介绍在 `README.md`；本文件面向开发者与 AI 助手（环境、命令、约定、坑、扩展流程）。

## 环境

- 无需 `npm install`：没有第三方依赖、没有 lockfile、没有 build 步骤。`node` 即可运行。
- 真实服务器地址、设备 IP、账号凭据放 `.env` 与 `protocol/frames.local.json`，两者均已被 gitignore，仓库只留 `.env.example` / `frames.example.json` 模板。格式见对应 example 文件。
- 实时嗅探依赖本机 `tcpdump`（需 root/sudo 或已在路由器上）。

## 常用命令

```bash
npm run signin                          # 每日任务自动领取（等价 node bin/w2signin.js）
node bin/w2signin.js --id 5042          # 只领单个任务
node bin/w2signin.js --dry              # 只查询不领取

npm run watch -- --ip <设备内网IP> --tag my-op   # 实时嗅探（等价 node bin/w2watch.js）
node bin/w2watch.js --file captures/xx.pcap       # 离线解析已有 pcap
node bin/w2watch.js --ip <IP> --iface <iface> --port 8083 --quiet

node bin/w2probe.js <hex1> <hex2>       # 登录后依次发任意帧看响应（未注册到 package.json bin）
node bin/w2probe.js --file frames.txt   # 每行一个 hex

scripts/capture.sh <设备IP> [iface] [秒]   # 在路由器/设备侧抓包（OpenWrt/Debian），自带 flow-offload 自检
```

参数解析都是脚本里手写的 `--name value`（`arg()`/`has()`），没有 argparse 类，新加命令行参数沿用同样写法。

## 目录

- `bin/` 三个可执行入口，各自文件头有大段中文用法注释（改动行为后记得同步）。
- `lib/w2.js` 纯解析库：`PcapParser`、`decode`（link type→IP→TCP/UDP）、`framesOut`/`framesIn`（WiST/WIST 帧切分）、`decodeBody`（u32 整数与 4 字节长度前缀 UTF-8 字符串混编）、`idNamePairs`、`cjkStrings`。
- `lib/config.js` 配置加载，优先级 `process.env > .env > 默认值`；`config.frames()` 优先读本地 `frames.local.json` 再回退 example。
- `protocol/commands.json` 命令字典，三段：`commands`（请求）、`push`（服务端推送）、`tasks`（任务/物品 ID）、`_categories`、`messages`。抓包遇到未收录命令会标 `★NEW`，确认后补进这里。
- `captures/<日期>/` 抓包产物（`.jsonl` 事件流 + `.pcap` + `.new.txt`），已 gitignore。

## 约定

- CommonJS：`'use strict'` 开头，`require`/`module.exports`，不引入 ES modules。
- 二进制一律大端 `readUInt32BE`（`PcapParser` 的 pcap 头按 magic 判断字节序，其余都是大端）。
- 命令号/任务 ID 在 JS 里当字符串比较（字典 key 是字符串），注意别直接用整数匹配。
- 提交信息用 Conventional Commits（英文，如 `feat:` `refactor(core):`）。
- 代码注释用中文，且克制：只解释「为什么」和长期约束，不记过程。

## 扩展协议：标准流程

新增一个可自动化的操作（造兵 / 采集 / 领取等）一律走这五步：

1. **抓包**：`node bin/w2watch.js --ip <设备IP> --tag <动作名>`，然后在客户端**只做这一个动作**，Ctrl+C 结束。
2. **定位命令**：看控制台的 `★NEW` 行，或翻 `captures/<日期>/*.jsonl` 找该时刻的 `cmd`。
3. **取完整帧**：帧末 16B 是校验值、无法构造，必须整帧复制。从 pcap 里按命令字抠 hex：

   ```js
   const { PcapParser, decode, framesOut } = require('./lib/w2.js');
   // 遍历 pcap，d.dport === 8083 的即客户端帧，framesOut(payload) 里按 cmd 过滤，取 f.raw.toString('hex')
   ```

4. **入库**：完整 hex 写进 `protocol/frames.local.json`（`claims` 或新增字段）；命令名补进 `protocol/commands.json`。
5. **验证**：重放该帧，看响应长度——`10003` 响应 `len>40` 表示成功，`len≈36` 表示"已领取过"，**没有响应**表示帧无效（参数不匹配会被静默丢弃）。

配套说明：`captures/<日期>/*.new.txt` 会列出本次出现的未收录命令，可直接据此补字典。

## 坑

- 领取帧有校验/签名（payload 末 16B），算法未破解——**只能整帧原样重放，不能凭空构造**；改序号/nonce/fieldA/参数任何一个字节都会被静默丢弃。新操作 = 抓一次包取帧，之后永久重放。
- 服务器每日约 00:00 重置任务，定时领取建议设在 00:10 后；重复领取会被拒绝但无副作用。
- 任务列表按 `cmd=10001` 的 16B 参数分「分类」，只查一个分类查不全 → `w2signin.js` 不依赖列表、直接尝试领取所有已收录任务，改这个逻辑前先读 `protocol/NOTES.md` 第 3/6 节。
- **单会话限制**：同一账号只能维持一个业务长连接，新登录会挤掉旧会话（客户端被踢下线）。
  因此脚本内所有操作必须**复用同一个 socket**，中途另建连接会把自己的前一个连接挤掉。
  测试时注意：跑脚本会把正在运行的客户端踢下线，这是预期行为，不是 bug。
- 软路由开流量卸载（flow offload / SFE / Shortcut-FE）会导致 tcpdump 抓不到业务数据（握手能抓到、数据抓不到），先关再抓。
- `idNamePairs` 的 ID 过滤下限别抬高：曾设 500 导致 290/307 这些低 ID 任务被漏掉。
- `decoded` 混编字段是非自描述的，按命令逐个解析；字符串长度前缀是字节数不是字符数（中文 3 字节/字）。
- pcap magic 字节序：以 LE 读出的值 `0xa1b2c3d4` = 小端、`0xd4c3b2a1` = 大端（写反会解析出 0 个包）。
- 抓包必须跑满设定时长，中途 Ctrl+C 只会拿到连接收尾包，几乎无有效数据。
- 设备端：关「随机/私有 MAC」、保持屏幕常亮（锁屏会挂起 App 并断开长连接）。
