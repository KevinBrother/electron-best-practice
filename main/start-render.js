// 使用子进程启动 render server
const { spawn } = require("child_process");

function startRenderServer() {
  const renderServer = spawn("node", ["scripts/render-server/index.js"]);

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
