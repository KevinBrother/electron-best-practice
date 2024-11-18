import log from 'electron-log';
import { createWindow, eventHandle, lifeCycle } from './utils';
import { updateHandle } from '../workbench';
import { test } from './test';

log.info('-----------------------Hello, log-----------------------');

lifeCycle({
  appReady: () => {
    const mainWindow = createWindow();
    eventHandle();
    updateHandle(mainWindow);
    test(mainWindow);
  }
});
