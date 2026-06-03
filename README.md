# electron 常用功能模块

- [x] 主进程调试
- [x] 渲染进程调试
- [x] 自动更新
- [x] Go 子进程示例（环境变量打印）

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

## Go 子进程示例

在主进程启动时，启动 Go 编写的子进程打印所有环境变量，特别关注 `no_new_privs` 安全变量。

### 使用方法

```bash
# 1. 编译 Go 程序
cd src/main/workbench/env-printer/go-env-printer
go build -o env-printer main.go

# 2. 启动 Electron 应用
cd ../../../../../
yarn dev
```

详细说明见 [env-printer README](./src/main/workbench/env-printer/README.md)
