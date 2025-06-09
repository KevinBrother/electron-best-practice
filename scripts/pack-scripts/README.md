# 测试步骤

1. 只想测试 electron-builder 的打包结果，可以直接运行下面三个命令。

``` bash
node scripts/pack-scripts/test/linux-test.js
node scripts/pack-scripts/test/mac-test.js
node scripts/pack-scripts/test/win-test.js
```

2. 若想完整的测试打包，需要先设置环境变量，再运行

``` bash
# windows 环境
# export RPA_PACK_ARCH=arm64 RPA_PACK_PLATFORM=windows  RPA_PACK_TARGET_FORMAT=nsis
export RPA_PACK_ARCH=x64 RPA_PACK_PLATFORM=windows  RPA_PACK_TARGET_FORMAT=portable,nsis

# mac 环境
# export RPA_PACK_ARCH=arm64 RPA_PACK_PLATFORM=darwin  RPA_PACK_TARGET_FORMAT=dmg

# linux 环境 
export RPA_PACK_ARCH=arm64 RPA_PACK_PLATFORM=linux  RPA_PACK_TARGET_FORMAT=AppImage
# export RPA_PACK_ARCH=x64 RPA_PACK_PLATFORM=linux  RPA_PACK_TARGET_FORMAT=deb

node scripts/pack-scripts/index.js 
```
