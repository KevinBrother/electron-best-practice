import { spawn } from 'child_process';
import { getAppRootPath } from './utils/index';
import path from 'path';

const renderServerPath = path.resolve(getAppRootPath(), 'scripts/render-server/server');

function startRenderServer() {
  const renderServer = spawn(renderServerPath);

  return new Promise((resolve, reject) => {
    renderServer.stdout.on('data', (data) => {
      resolve(data);
      console.log(`stdout: ${data}`);
    });

    renderServer.stderr.on('data', (data) => {
      reject(data);
      console.error(`stderr: ${data}`);
    });

    renderServer.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });
  });
}

export { startRenderServer };
