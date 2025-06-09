// 打包规范 https://wiki.datagrand.com/pages/viewpage.action?pageId=143754120
// 配置文档 https://www.electron.build/api/electron-builder

// @ts-check

const { beforeBuild, buildWeb, removeRedundantFiles } = require('./utils');
const { RPA_PACK_ARCH = '', RPA_PACK_PLATFORM = '', RPA_PACK_TARGET_FORMAT = '', RPA_PACK_FORCE_REBUILD = false } = process.env;

console.log(
  'Robot 接收到必须的环境变量为：RPA_PACK_ARCH：%s, RPA_PACK_PLATFORM：%s, RPA_PACK_TARGET_FORMAT：%s , RPA_PACK_FORCE_REBUILD: %s',
  RPA_PACK_ARCH,
  RPA_PACK_PLATFORM,
  RPA_PACK_TARGET_FORMAT,
  RPA_PACK_FORCE_REBUILD
);
// const { RPA_PACK_ARCH = 'x86', RPA_PACK_PLATFORM = 'windows', RPA_PACK_TARGET_FORMAT = 'nsis' } = process.env;

if (!RPA_PACK_ARCH) {
  console.error('请配置环境变量 RPA_PACK_ARCH');
  process.exit();
}

if (!RPA_PACK_PLATFORM) {
  console.error('请配置环境变量 RPA_PACK_PLATFORM');
  process.exit();
}

if (!RPA_PACK_TARGET_FORMAT) {
  console.error('请配置环境变量 RPA_PACK_TARGET_FORMAT');
  process.exit();
}

Promise.resolve()
  // .then(() => beforeBuild(RPA_PACK_FORCE_REBUILD))
  .then(() => buildWeb())
  .then(() => require('./platform/build-main').buildMain())
  .then((data) => {
    console.log(`[electron build filenames] ${data}`);
    return data;
  })
  // .then((releaseNames) => modifyBuildYaml(releaseNames))
  // .then(removeRedundantFiles)
  .then(() => {
    console.log('构建完成！！！✅');
  })
  .catch((error) => {
    console.error(`构建出错：${error}`);
    process.exit(1);
  });
