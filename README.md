# W2 Protocol

某手游移动端客户端与其业务服务器之间的**私有 TCP 协议**逆向记录，附带解析工具与自动化脚本。

> 抓包样本取自 iOS 端；协议由服务端统一实现，格式与客户端平台无关，Android 端应同样适用（未实测）。
零依赖，Node 18+。

> 本项目仅用于**学习网络协议分析**，不含任何游戏素材、客户端代码或规避付费/反作弊的内容。
> 文中不出现产品名与厂商信息；服务器地址、设备 IP、账号凭据一律通过 `.env` 配置，不入库。

## 快速开始

```bash
cp .env.example .env      # 填入你自己的服务器地址 / 设备 IP
npm run signin            # 每日任务自动领取
npm run watch -- --ip <设备内网IP> --tag my-op   # 实时嗅探
node bin/w2watch.js --file captures/xxx.pcap    # 离线解析
```

## 目录

```
bin/w2watch.js     实时嗅探器（拉起 tcpdump，边抓边解析，控制台实时反馈）
bin/w2signin.js    每日任务自动领取
lib/w2.js          协议解析库（pcap 流 / IP-TCP / 帧解析 / body 解码）
lib/config.js      配置加载（.env）
protocol/commands.json       命令字典（持续完善）
protocol/frames.example.json 可重放帧模板  ← 真实值放 frames.local.json，不入库
protocol/NOTES.md            字段规律笔记
captures/<日期>/   .jsonl 事件流 + .pcap + .new.txt（已 gitignore）
scripts/capture.sh 路由器抓包脚本（含 flow offload 自检）
```

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

## 已知命令

| 命令 | 含义 |
|---|---|
| 6 | 握手 hello |
| 1001 | 登录（加密凭据，**可原样重放**） |
| 1 / 1005 / 2026 | 心跳三连（每 50s） |
| 9001 / 9002 | 邮件列表 / 详情 |
| 10001 | 查询任务·奖励列表 |
| 10003 | 领取奖励（参数 16B 随任务 ID 变化） |
| 26044 | [推送] 会话 ID |

## 工作流（持续完善协议）

1. 想分析某个操作 → `node bin/w2watch.js --ip <IP> --tag <标签>`
2. 只做这一个操作，看控制台冒出的 `★NEW` 命令
3. Ctrl+C 结束，把 `captures/<日期>/*.new.txt` 拿去分析
4. 确认后补进 `protocol/commands.json`，下次就显示中文名了

## 坑记录

- **flow offload**：软路由开了流量卸载后 tcpdump 抓不到长连接数据。
  关闭 `firewall.@defaults[0].flow_offloading` 与 `flow_offloading_hw`，抓完记得开回去。
- **设备端通用**：关「随机/私有 MAC 地址」（否则按 MAC 过滤会失效）；**保持屏幕常亮**，锁屏后 App 被系统挂起、长连接会断。
- **iOS 额外**：关「无线局域网助理」（Wi-Fi 信号弱时可能切蜂窝，流量就不走路由器了）。
- **Android 额外**：开发者选项里关「移动数据始终活跃」；把游戏加入电池优化白名单，否则切后台被杀。
- **抓包要跑满时长**，中途 Ctrl+C 只会拿到连接收尾包。
- pcap magic 的字节序判断：以 LE 读出的值 `0xa1b2c3d4` = 小端、`0xd4c3b2a1` = 大端。

## 许可

代码部分可自由使用。请勿将本项目用于破坏他人游戏体验或商业牟利。
