import { ipcMain, BrowserWindow } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

log.transports.file.level = 'info';
autoUpdater.logger = log;

function updateHandle(mainWindow: BrowserWindow | null) {
  const message = {
    error: '更新出错',
    checking: '正在检查更新',
    updateAvailable: '检测到新版本',
    downloadProgress: '下载中',
    updateNotAvailable: '无新版本'
  };

  autoUpdater.on('error', () => {
    sendUpdateMessage(mainWindow, message.error);
  });
  autoUpdater.on('checking-for-update', () => {
    sendUpdateMessage(mainWindow, message.checking);
  });
  autoUpdater.on('update-available', (info) => {
    sendUpdateMessage(mainWindow, info);
  });
  autoUpdater.on('update-not-available', () => {
    sendUpdateMessage(mainWindow, message.updateNotAvailable);
  });

  autoUpdater.on('download-progress', (progressObj) => {
    mainWindow?.webContents.send('downloadProgress', progressObj);
  });

  autoUpdater.on('update-downloaded', () => {
    mainWindow?.webContents.send('updateDownloaded');
  });

  ipcMain.handle('updateNow', () => {
    log.info('开始更新');
    autoUpdater.quitAndInstall();
    return 'updateNow';
  });

  ipcMain.on('checkForUpdate', () => {
    autoUpdater
      .checkForUpdates()
      .then((rst) => {
        log.info('---------------------checkForUpdates success---------------------', rst);
      })
      .catch((err) => {
        log.error('------------checkForUpdates error------------', err);
      });
  });
}

function sendUpdateMessage(mainWindow: BrowserWindow | null, text: string) {
  mainWindow?.webContents.send('message', text);
}

export { updateHandle };
