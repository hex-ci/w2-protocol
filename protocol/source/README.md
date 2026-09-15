# 客户端协议定义基线

此目录只保留本地从 APK 资源提取的协议定义，不提交到 Git。

## 当前约定

- 生成器默认读取 `protocol/source/index.js`。
- 默认生成命令：

  ```bash
  npm run genapi -- --write
  ```

- 生成结果只写入 gitignore 的 `protocol/reference.generated/`，不会覆盖人工维护的 `protocol/reference/`。

## 更新基线

1. 从新版 APK 资源中提取 `index.*.js`。
2. 覆盖本地 `protocol/source/index.js`。
3. 执行 `npm run genapi -- --write`，将 generated 内容与当前手册对比。
4. 仅将已由新版客户端或抓包证实的字段差异人工合入 `protocol/reference/`；复杂列表、条件字段及服务端差异必须抓包复核。

临时比对其他文件可使用：

```bash
W2_PROTO_SRC=/path/to/index.js npm run genapi -- --write
```

该命令不会修改 `protocol/source/index.js`。

不要把 APK、完整客户端、含账号/会话信息的文件或抓包产物提交到仓库。
