# W2 接口参考手册 · 索引

> 全量 419 个命令，按业务域分文件。字段名为 snake_case 规范命名，附中文说明。

> 如何组装请求、判断成功失败见 [API.md](../API.md)；帧格式与加密见 [NOTES.md](../NOTES.md)。
>
> 本手册以客户端字段基线和已复核抓包共同维护。默认基线位于本地 gitignore 文件 `protocol/source/index.js`，由 `npm run genapi -- --write` 输出到 `protocol/reference.generated/`；手册不会被生成器改写。带“实测”标记的条目优先；无该标记的复杂列表、条件字段应在自动化前用抓包复核。

| 文件 | 业务域 | 命令数 | cmd 范围 |
|---|---|---|---|
| [00-choice.md](00-choice.md) | 选服与基础服务 | 14 | 1 ~ 30 |
| [01-account.md](01-account.md) | 账号与玩家 | 36 | 1001 ~ 1050 |
| [02-city.md](02-city.md) | 城池与资源 | 27 | 2001 ~ 2030 |
| [03-army.md](03-army.md) | 军队与训练 | 14 | 3001 ~ 3015 |
| [04-tech.md](04-tech.md) | 科技研发 | 7 | 4001 ~ 4008 |
| [05-alliance.md](05-alliance.md) | 军团 | 50 | 5001 ~ 5062 |
| [06-chat.md](06-chat.md) | 聊天 | 17 | 6001 ~ 6020 |
| [07-item.md](07-item.md) | 道具与背包 | 10 | 8001 ~ 8023 |
| [08-mail.md](08-mail.md) | 邮件 | 7 | 9001 ~ 9008 |
| [09-task.md](09-task.md) | 任务与奖励 | 6 | 10001 ~ 10008 |
| [10-officer.md](10-officer.md) | 名将 | 42 | 11001 ~ 11059 |
| [11-shop-pay.md](11-shop-pay.md) | 商城与支付 | 23 | 7001 ~ 12048 |
| [12-map.md](12-map.md) | 地图与战报 | 50 | 15001 ~ 19018 |
| [13-activity.md](13-activity.md) | 活动 | 32 | 22001 ~ 23004 |
| [14-ranking.md](14-ranking.md) | 排行榜 | 12 | 24001 ~ 24017 |
| [15-battle.md](15-battle.md) | 战斗与演习 | 26 | 20002 ~ 29006 |
| [16-notice.md](16-notice.md) | 公告与系统 | 15 | 13002 ~ 14020 |
| [17-push.md](17-push.md) | 服务端推送 | 31 | 26001 ~ 26049 |

> 共 419 个命令（另有继承空壳类不计入）。
