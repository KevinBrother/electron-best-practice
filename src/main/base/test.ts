import { BrowserWindow } from 'electron';
function test(mainWindow: BrowserWindow | null) {
  mainWindow?.webContents.send('message', 'text');
  console.log('test');
}

export { test };
