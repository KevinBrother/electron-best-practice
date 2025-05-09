import { ipcMain, BrowserWindow, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import { getFileLog } from '../../utils';

const log = getFileLog();
autoUpdater.logger = log;

function updateHandle(mainWindow: BrowserWindow | null) {
  const message = {
    error: '更新出错',
    checking: '正在检查更新',
    updateAvailable: '检测到新版本',
    downloadProgress: '下载中',
    updateNotAvailable: '无新版本'
  };

  autoUpdater.on('error', (error) => {
    sendUpdateMessage(mainWindow, 'error', `${error}: ${JSON.stringify(error)}`);
  });
  autoUpdater.on('checking-for-update', () => {
    sendUpdateMessage(mainWindow, 'checking', message.checking);
  });
  autoUpdater.on('update-available', (info) => {
    sendUpdateMessage(mainWindow, 'updateAvailable', JSON.stringify(info));
  });
  autoUpdater.on('update-not-available', (data) => {
    console.log('update-not-available', data);
    sendUpdateMessage(mainWindow, 'updateNotAvailable', message.updateNotAvailable);
  });

  autoUpdater.on('download-progress', (progressObj) => {
    sendUpdateMessage(mainWindow, 'downloadProgress', JSON.stringify(progressObj));
  });

  autoUpdater.on('download-progress', (progressObj) => {
    let logMessage = 'Download speed: ' + progressObj.bytesPerSecond;
    logMessage = logMessage + ' - Downloaded ' + progressObj.percent + '%';
    logMessage = logMessage + ' (' + progressObj.transferred + '/' + progressObj.total + ')';

    mainWindow?.webContents.send('download-progress', logMessage);
  });

  ipcMain.handle('updateNow', () => {
    log.info('开始更新');

    const buttons = ['Sure, get me a new version!', "Nah, I'm good, I can wait."];
    const options = {
      type: 'question',
      message: 'Hey, new version of app is downloaded! Do you want to restart it now and get the newest version?',
      cancelId: -1,
      buttons
    };

    dialog.showMessageBox(mainWindow!, options).then((response) => {
      console.log('response', response);
      if (response.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });

    return 'updateNow';
  });

  ipcMain.on('checkForUpdate', () => {
    autoUpdater
      .checkForUpdates()
      .then((rst) => {
        log.info('---------------------checkForUpdates success---------------------', rst);
        sendUpdateMessage(mainWindow, 'checkForUpdates-success', JSON.stringify(rst));
      })
      .catch((err) => {
        log.error('------------checkForUpdates error------------', err);
        sendUpdateMessage(mainWindow, 'checkForUpdates-error', message.error);
      });
  });
}

function sendUpdateMessage(mainWindow: BrowserWindow | null, key: string, text: string) {
  mainWindow?.webContents.send('message', `${key}: ${text}`);
}

export { updateHandle };
