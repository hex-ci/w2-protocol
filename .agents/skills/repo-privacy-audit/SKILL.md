---
name: repo-privacy-audit
description: Use in w2-protocol before commits; scans for leaks.
version: 1.1.0
metadata:
  hermes:
    tags: [privacy, anonymization, pre-commit, audit]
    requires_tools: [terminal, read_file, patch]
    editorial_name: w2-protocol 提交前隐私审计
    editorial_description: 扫描入库文件中的身份/凭据/厂商/专名泄漏，自动分拣必改与已拍板保留项
---

# w2-protocol 提交前隐私审计

本仓库为公开仓库，入库内容（git 跟踪的代码、文档、注释、提交信息）有匿名化纪律，口径见仓库根 `AGENTS.md`。**每次改动入库文件后、汇报「完成」前，跑一遍本审计**。

## 何时跑（必做，不是可选）

- 任何会入库（git 跟踪）的代码、文档、注释、字典改动**完成前**；
- 用户提出「清理隐私/敏感信息」「检查能不能公开」时；
- 用户 commit 之前（代理不 commit，只交付已过审的工作树）。

## 快速执行

```bash
python3 .agents/skills/repo-privacy-audit/scripts/audit.py --root .
```

- 缺省自动加载同目录 `references/w2-extra.local.json`（项目词表）与 `references/w2-keep.local.json`（保留项过滤）；也可显式 `--extra` / `--keep` 指定。
- 退出码非 0 = 有疑似残留需处置。
- 词表文件缺失时脚本不报错、跳过对应类别——**项目特有残留会漏检，报告时必须注明「词表缺失」**。

## 三条铁律

1. **工作树干净 ≠ 历史干净。** `git log -S <token>` 能在旧提交里找到已从工作树清掉的内容。仓库为 public 时，工作树清理只是第一步——必须主动提醒用户还有历史暴露面（处理选项：转 private / 干净首提交新建仓库 / `git filter-repo` 重写；外部动作由用户执行）。
2. **边界 = 是否入库。** gitignore 的本地档（`captures/`、`.hermes/plans/`、`.identity.local.json`、`.env`、`*.local.json`）可以保留真实数据，不必清理、也不必因此提问；约束只针对 git 跟踪 + 待提交的文件。
3. **分拣，不要一刀切。** 残留分三类：必改 / 需用户拍板 / 已拍板保留。第三类最容易犯错——把拍板保留项当残留改掉，会直接破坏本地运行。

## 流程

### 1. 定范围

```bash
git ls-files                                  # tracked
git ls-files --others --exclude-standard      # 待提交的未跟踪
```

审计范围 = tracked ∪ untracked（非忽略）。**新写的文件最容易漏**（未跟踪）——`git grep` 只看 tracked，别拿它当唯一扫描器。

### 2. 值对照优先于正则（关键）

从本地真值档提取**具体值**做全树字面搜索，比猜正则可靠得多（命中即确凿）：

- `.identity.local.json` → userId / username / wst / installID / appKey / WTGT / gameHost / serverName
- `.env` → 渠道、版本、任务 ID、设备 IP
- 状态缓存（`.transport_route.local.json`、`.train_state.local.json`）→ 城池 ID 列表
- 已知坐标对 / 军官 ID / 资产数值（来自会话记忆或 `captures/`）

真实数据常藏在「示例」与「自检桩」里（曾实测：组帧自检用例混入真实 userId）——纯正则扫不到，只有值对照能抓。

### 3. 分类扫描

脚本内置类别：实测日期 / 产品名 URL 编码形态 / 厂商域名 / UA 指纹 / 凭据形态 / 可滥用措辞 / 邮箱 / 内网 IP / 手机号 / 个人路径。项目特有类别由 `w2-extra.local.json` 提供（真实城名与城 ID 段、军官名、坐标形态、活动专名、错误文案全句）。

### 4. 分拣与处置

- **必改**：真实标识（城名/城 ID/坐标/资产/玩家标识）、实测日期（可关联抓包目录与操作时间窗）、凭据值、示例/自检里的真实值、可滥用措辞。
- **需拍板**：厂商识别值、产品名、专名、错误文案——列清单交用户决策，不自己拍。
- **保留（勿动）**：已拍板项写进 `w2-keep.local.json` 由脚本过滤。当前保留类别：① `lib/config.js`、`lib/sdk.js`、`tools/w2login.js` 中厂商常量 / 渠道 / 版本的代码缺省值；② 脚本内匹配服务器下发文本的功能匹配串（活动名、错误子串等，删了功能就废）。**若 keep 词表缺失导致这些出现在残留清单——不要改动代码，补词表即可。**

### 5. 中性化写法

- 具体值 → 配置项引用（如 `W2_SSO_*` / `W2_LOGIN_*`），真值迁本地 `.env`；一次性迁移不留兼容层（不加「先读 env 再回退旧常量」的回退读取）。
- 指纹类（User-Agent）：**代码缺省放通用形态**；真机形态走本地 `.env` 模板，支持 `{clientVer}` 占位符保持与登录帧版本号同源。
- 服务器文案全句 → 描述性表述，保留可辨识特征即可。
- 文档替换后**回读上下文**——中文成句容易替换得不连贯（曾出现「超发返回（超限时提示升级司令部）。每笔运输…」这类残句）。

### 6. 验证（缺一不可）

```bash
npm run lint && npm run test          # 代码类改动
node lib/w2build.js                   # 组帧自检
npm run genapi -- --write             # 改了文档模板时复查生成器
```

再加：

- **重跑扫描**：目标类别零残留、保留项仍在原处；
- **真实链路**：能跑就跑一次登录或业务 `--dry`，证明没把运行必需的东西改坏；
- **指纹类比对**：改 UA 这类值后，与改动前的字符串做**逐字节比对**（本地行为完全一致才算安全）。

### 7. 汇报格式

1. 按类别列改动（文件 + 处数）；
2. 明确「按拍板保留了什么」——避免用户以为漏了；
3. 扫描前后对照数字；
4. 说明未提交（用户自己 commit）；
5. public 仓库有历史残留时单独提醒。

## 本地词表（不入库）

两个词表均为 `*.local.json`（gitignore），**换机器 / 新 clone 后需重建**：

- `references/w2-extra.local.json` —— 项目特有情表。重建方法：让 agent 扫描本地档（`captures/`、`.identity.local.json`、`.transport_route.local.json`）自动汇总真实城名 / 城 ID 段等，生成后**只留在本地**。
- `references/w2-keep.local.json` —— 已拍板保留项过滤。重建方法：按上文「保留（勿动）」的类别总结；新增拍板保留项时同步补进该文件，否则下次审计会把保留项报成残留（或被下一个 agent 误「修」）。

## 坑

- **部分 ripgrep 版本不支持 `-E` 参数**（被当成编码参数报 `unknown encoding`）——用默认正则语法，中文直接写。
- **扫描必须覆盖未跟踪文件与提交信息**（`git log --format=%B` 扫一遍）；历史里的旧提交改不了，只能重写历史。
- **别把拍板保留项改成脱敏占位**：文档侧清理与代码缺省保留是两回事，后者是用户决议。
- **功能匹配串保留原串**：脚本里匹配服务器下发文本的字符串是运行依赖，注释中性化即可。
