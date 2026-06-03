import { createWindow, eventHandle, lifeCycle } from './utils';
import { updateHandle, startEnvPrinter } from '../workbench';
import { test } from './test';
import { getFileLog } from '../utils';

const fileLog = getFileLog();
fileLog.info('-----------------------Hello, log-----------------------');

lifeCycle({
  appReady: () => {
    const mainWindow = createWindow();
    eventHandle();
    updateHandle(mainWindow);
    test(mainWindow);

    // 启动 Go 子进程打印环境变量
    startEnvPrinter((message: string) => {
      fileLog.info(message);
    });
  }
});
