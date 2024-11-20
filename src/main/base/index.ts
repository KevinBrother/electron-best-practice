import { createWindow, eventHandle, lifeCycle } from './utils';
import { updateHandle } from '../workbench';
import { test } from './test';
import { getFileLog } from '../utils';

getFileLog().info('-----------------------Hello, log-----------------------');

lifeCycle({
  appReady: () => {
    const mainWindow = createWindow();
    eventHandle();
    updateHandle(mainWindow);
    test(mainWindow);
  }
});
