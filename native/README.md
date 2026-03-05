# Native Module

这是一个跨平台的 native 模块示例，演示如何在 Electron 中调用 Go 编写的可执行文件。

## 结构

```
native/
├── main.go          # Go 源码
├── data.json        # 数据文件
├── build.sh         # 编译脚本
└── dist/            # 编译输出（各平台的 zip 包）
    ├── darwin-arm64.zip
    ├── darwin-x64.zip
    ├── windows-x64.zip
    ├── linux-x64.zip
    └── linux-arm64.zip
```

## 使用方法

### 1. 编译 Go 程序

```bash
# 编译所有平台
cd native
./build.sh all

# 或只编译特定平台
./build.sh darwin   # macOS
./build.sh windows  # Windows
./build.sh linux    # Linux
```

### 2. 打包 Electron 应用

```bash
yarn build:mac    # macOS
yarn build:win    # Windows
yarn build:linux  # Linux
```

### 3. 在 Electron 中调用

```typescript
import { callNativeModule } from './main/native';

const data = await callNativeModule();
console.log(data); // {"name":"electron-best-practice","version":"1.0.0","message":"Hello from native module"}
```

## 工作原理

1. **打包时**：Go 二进制文件 + data.json 打包成 zip，放入 extraResources
2. **运行时**：Electron 首次调用时解压 zip 到临时目录
3. **调用**：启动 Go 子进程，捕获 stdout 输出
4. **跨平台**：根据 process.platform 和 process.arch 自动选择对应的 zip

## 注意事项

- 需要安装 Go 环境（1.16+）
- 首次运行前需要安装依赖：`yarn install`
