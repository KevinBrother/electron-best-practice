# electron 常用功能模块

- [x] 主进程调试
- [x] 渲染进程调试
- [x] 自动更新

## 问题

- 使用 pnpm dev 模式ok，但是build 后在 mac上运行提示
```Error: Cannot find module 'builder-util-runtime```
 [使用 yarn 替换 pnpm](https://stackoverflow.com/questions/75563355/electron-app-with-electron-updater-built-with-npm-run-make-does-not-work)

## refactor

[x] main function separate
[x] typescript
[x] eslint

## feature

[x] auto update 功能
    - 修改 [electron-win-builder.json]('./electron-win-builder.json')
    - 手动安装更新
    ``` json
        "nsis": {
            "oneClick": false,
            "allowToChangeInstallationDirectory": true
        }
    ```
    - 自动安装更新
    ``` json
        "nsis": {
            "oneClick": true
        }
    ```

    - 测试方法，修改 package.json 的 version，后运行 `yarn build:win`, 打包出不同版本的安装包，再运行 `yarn update-server`, 启动更新服务（构建出包后，dev 环境也可测试更新）
