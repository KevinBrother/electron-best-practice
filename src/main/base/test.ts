import { BrowserWindow } from 'electron';
import { callNativeModule } from '../native';
import { getFileLog } from '../utils';

const log = getFileLog();

async function test(mainWindow: BrowserWindow | null) {
  mainWindow?.webContents.send('message', 'text');

  // 测试 native 模块调用
  try {
    log.info('Testing native module...');
    const result = await callNativeModule();
    log.info(`Native module result: ${result}`);
    mainWindow?.webContents.send('message', `native-result: ${result}`);
  } catch (error) {
    log.error(`Native module test failed: ${error}`);
    mainWindow?.webContents.send('message', `native-error: ${error}`);
  }
}

export { test };
