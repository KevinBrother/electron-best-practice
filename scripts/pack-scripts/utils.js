// @ts-check
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const path = require('path');
const resolveRootPath = (filename) => path.resolve(__dirname, '../../', filename);
// const paths = [
//   '/Users/caojunjie/workspace/datagrand/robot/release/Data Grand robot 13.0.1.exe',
//   '/Users/caojunjie/workspace/datagrand/robot/release/Data Grand robot Setup 13.0.1.exe.blockmap',
//   '/Users/caojunjie/workspace/datagrand/robot/release/Data Grand robot Setup 13.0.1.exe',
//   '/Users/caojunjie/workspace/datagrand/robot/release/Data Grand robot Setup 13.0.1.appimage'
// ];

// 通过上面的suffix和paths过滤出paths的后缀属于suffix中的值，并只保留值的release/与后面的路径。注意DataGrandRobot Setup 13.0.1.exe.blockmap并不应该被取到，因为他的后缀是.blockmap。

function getExecPromise(command, successMsg = '') {
  console.info('command: ', command);
  return execPromise(command)
    .then(({ stdout }) => {
      console.log(`执行 ${command} 时日志： ${successMsg || stdout}`);
    })
    .catch((error) => {
      console.log(`执行 ${command} 时出错❌：${error}`);
      throw error;
    });
}

function buildRender() {
  return getExecPromise('yarn build');
}

module.exports = {
  beforeBuild(RPA_PACK_FORCE_REBUILD) {
    // 删除 release、dist、node_modules、重新安装依赖
    return getExecPromise(`rm -rf ${resolveRootPath('release')} ${resolveRootPath('dist')}`, '删除 release、dist 成功')
      .then(() => {
        if (RPA_PACK_FORCE_REBUILD) {
          return getExecPromise(`rm -rf ${resolveRootPath('node_modules')}`, '删除 node_modules 成功');
        }
      })
      .then(() => getExecPromise('yarn', '依赖安装成功')); // Ensure that yarn is executed after the deletions
  },

  buildWeb() {
    return Promise.all([buildRender()]);
  },

  removeRedundantFiles() {
    getExecPromise(`rm -rf ${resolveRootPath('release/win-unpacked')} ${resolveRootPath('release/linux-unpacked')}`, '删除成功');
  }
};
