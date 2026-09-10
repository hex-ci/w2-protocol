# W2 Protocol

某手游移动端客户端与其业务服务器之间的**私有 TCP 协议**逆向记录，附带解析工具与自动化脚本。

> 抓包样本取自 iOS 端；游戏服帧格式已在 iOS/Android 抓包间交叉核验。
> Node 18+；运行时依赖 `crypto-es`，开发校验使用 ESLint。
> 目前仅 iOS 选服链路可登录；Android 选服为 WebSocket，尚未实现。

> 本项目仅用于**网络协议分析与安全技术学习研究**，探讨二进制封包与长连接通信机制。
> 不包含外挂辅助、数值篡改、破解付费或对抗反作弊等非法内容，不分发任何受版权保护的游戏资产或代码。

开发者与 AI 协作指引见 **[AGENTS.md](AGENTS.md)**（目录详解、命令、代码约定、已知坑）。

## 快速开始

```bash
npm install
```

## 目录

```
scripts/    功能脚本
lib/        w2.js 协议解析库 · w2build.js 帧构造器 · sdk.js 会话 SDK · config.js 配置加载
protocol/   NOTES.md 协议全记录 · API.md 接口文档 · reference/ 全量参数表 · commands.json 命令字典
tools/      w2login.js 登录（SSO→选服→userId 全自动） · genapi.js 客户端基线生成器（默认读取 protocol/source/index.js，输出到 protocol/reference.generated/）
```

> 登录凭据与游戏服地址由登录命令写入 `.identity.local.json`（不入库）；`.env` 只放服务端不会下发的配置（见 `.env.example`）。

## 协议速查

业务主通道为一条 TCP 长连接（游戏服地址由选服服务器下发，登录后缓存）。完整细节见 [`protocol/NOTES.md`](protocol/NOTES.md)。

**客户端 → 服务器**（`WiST` 帧，参数 AES 加密）：

```
+0   4  magic "WiST"
+4   1  0x02
+5   4  u32 序号（连接内递增）
+9   16 md5 前 16 字节（输入 = 序号+sessionId+命令字+密文）
+25  4  u32 sessionId（随机数，同时是 AES 密钥种子）
+29  4  u32 长度 = 密文长 + 4
+33  4  u32 命令字
+37  …  AES-128-ECB 密文（key = sessionId 十进制左补零 16 位）
```

**服务器 → 客户端**（`WIST` 帧，明文）：

```
+0   4  magic "WIST"
+4   4  u32 sessionId（0xffffffff = 主动推送）
+8   4  u32 长度 = body 全长（body = 命令字(4B) + status(1B) + 数据）
+12  …  body：u32 命令字 + status + 响应字段
```

## 能力概览

协议骨架与**加密算法已完成字节级构造验证**，覆盖握手登录、心跳保活、邮件、任务/奖励、道具背包、城池资源、活动推送等。命令名称和推送编号见 [`protocol/commands.json`](protocol/commands.json)；字段级请求/响应结构见 [`protocol/reference/`](protocol/reference/README.md)。抓包遇到未收录的命令会自动标 `★NEW`。

## 扩展新操作

想让工具支持新动作：

1. `npm run watch -- --ip <IP> --tag <标签>` 开始抓包，客户端只做这一个操作
   （启动时自动做连接存活与 flow offload 自检）
2. 从 `captures/<日期>/*.jsonl` 找到该操作的 cmd，查 [reference/](protocol/reference/README.md) 确认参数字段
   （详见 NOTES §4/§11）
3. 按 NOTES §2/§3 或调用 `lib/w2build.js` 组帧发送
4. 验证：按该命令文档的成功 status 判断；完全无响应通常表示帧被静默丢弃，也可能是链路异常。

## 坑记录

- **单会话限制**：同一账号在业务长连接上**只能有一个会话**。脚本登录会把已在线的客户端挤下线
  （客户端提示断开/要求关闭）。因此：
  - 定时任务建议安排在不玩游戏的时间（如凌晨）
  - 一次脚本运行只建立一个连接、只踢一次
- **flow offload**：软路由开了流量卸载后抓不到长连接数据，需先关闭（抓完记得开回去）。
  `w2watch.js` 在线模式启动时会自动检测并提示。
- **设备端**：关「随机 MAC 地址」；**保持屏幕常亮**——锁屏后 App 被挂起、连接会断。
  `w2watch.js` 启动预检会发现无活动连接的情况。

## 许可

代码部分可自由使用（MIT）。请勿将本项目用于破坏他人游戏体验或商业牟利。
