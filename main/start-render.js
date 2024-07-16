// 使用子进程启动 render server
const { spawn } = require("child_process");
const { getAppRootPath } = require("../utils/index");
const path = require("path");

const renderServerPath = path.resolve(
  getAppRootPath(),
  "scripts/render-server/index.js"
);

function startRenderServer() {
  const renderServer = spawn("node", [renderServerPath]);

  return new Promise((resolve, reject) => {
    renderServer.stdout.on("data", (data) => {
      resolve(data);
      console.log(`stdout: ${data}`);
    });

    renderServer.stderr.on("data", (data) => {
      reject(data);
      console.error(`stderr: ${data}`);
    });

    renderServer.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
    });
  });
}

module.exports = {
  startRenderServer,
};
