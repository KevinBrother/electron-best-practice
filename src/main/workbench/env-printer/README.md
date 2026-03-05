# Go 子进程环境变量打印器

## 功能

- 在 Electron 主进程启动时，启动一个 Go 编写的子进程
- 子进程打印所有环境变量，特别关注 `no_new_privs` 相关变量
- 用于调试和安全研究

## 编译 Go 程序

```bash
cd src/main/workbench/env-printer/go-env-printer

# macOS/Linux
go build -o env-printer main.go

# Windows
go build -o env-printer.exe main.go

# 或者使用 Go Mod（推荐）
go mod init env-printer
go build
```

## 目录结构

```
env-printer/
├── index.ts              # TypeScript 模块，管理子进程生命周期
├── go-env-printer/       # Go 子进程源码
│   └── main.go           # Go 程序入口
└── README.md             # 本文档
```

## 使用方法

在主进程启动时自动调用：

```typescript
import { startEnvPrinter } from '../workbench';

lifeCycle({
  appReady: () => {
    // 启动 Go 子进程
    startEnvPrinter((message: string) => {
      console.log(message);
    });
  }
});
```

## 输出示例

```
[env-printer] Starting subprocess: /path/to/env-printer
[env-printer] Subprocess started with PID: 12345
[env-printer stdout] === Go Subprocess: Environment Variables ===
[env-printer stdout] PID: 12345
[env-printer stdout] PPID: 12344
[env-printer stdout]
[env-printer stdout] === Special Variables (no_new_privs) ===
[env-printer stdout]   NO_NEW_PRIVS = (not set)
[env-printer stdout]   no_new_privs = (not set)
[env-printer stdout]   No_New_Privs = (not set)
[env-printer stdout]
[env-printer stdout] === All Environment Variables ===
[env-printer stdout]   HOME = /Users/example
[env-printer stdout]   PATH = /usr/local/bin:/usr/bin:/bin
[env-printer stdout]   ...
[env-printer stdout] === Environment Variables Count ===
[env-printer stdout] Total: 50 variables
[env-printer] Process exited with code 0
```

## 关于 no_new_privs

`no_new_privs` 是 Linux 内核的一个安全特性：

- 设置后，进程及其子进程无法获得新的权限
- 常用于沙箱和容器化环境
- Electron 应用在某些安全模式下可能会设置此变量

### 检查方法

在 Linux 上，可以通过以下方式检查：

```bash
# 查看进程的 no_new_privs 状态
cat /proc/<pid>/status | grep NoNewPrivs

# 或者使用 prctl
prctl --get-no-new-privs <pid>
```

## 生产环境部署

在打包时，需要将 Go 可执行文件包含在 resources 目录：

1. 编译 Go 程序
2. 将可执行文件放到 `resources/env-printer/` 目录
3. 在 `electron.vite.config.ts` 或打包配置中添加资源复制规则

```json
// electron-builder 配置示例
{
  "extraResources": [
    {
      "from": "resources/env-printer",
      "to": "env-printer"
    }
  ]
}
```