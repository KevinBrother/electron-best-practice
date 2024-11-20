import { ipcMain, BrowserWindow, dialog } from 'electron';
import { autoUpdater, UpdateInfo } from 'electron-updater';
import fs from 'fs';
import { getConfigPath, isDev, getFileLog } from '../../utils';

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

  // 允许降级
  autoUpdater.allowDowngrade = true;
  // 关闭自动下载
  autoUpdater.autoDownload = false;
  if (isDev()) {
    // 允许开发环境调试更新
    autoUpdater.forceDevUpdateConfig = true;
  }

  autoUpdater.on('error', (error) => {
    sendUpdateMessage(mainWindow, 'error', `${error}: ${JSON.stringify(error)}`);
  });
  autoUpdater.on('checking-for-update', () => {
    sendUpdateMessage(mainWindow, 'checking', message.checking);
  });
  autoUpdater.on('update-available', (info: UpdateInfo) => {
    sendUpdateMessage(mainWindow, 'updateAvailable', JSON.stringify(info));
    // 手动下载
    autoUpdater
      .downloadUpdate()
      .then((rst) => {
        log.info('---------------------downloadUpdate success---------------------', rst);
        sendUpdateMessage(mainWindow, 'downloadUpdate-success', JSON.stringify(rst));
      })
      .catch((err) => {
        log.error('------------downloadUpdate error------------', err);
        sendUpdateMessage(mainWindow, 'downloadUpdate-error', JSON.stringify(err));
      });
  });

  autoUpdater.on('update-not-available', (data) => {
    console.log('update-not-available', data);
    sendUpdateMessage(mainWindow, 'updateNotAvailable', message.updateNotAvailable);
  });

  autoUpdater.on('download-progress', (progressObj) => {
    let logMessage = 'Download speed: ' + progressObj.bytesPerSecond;
    logMessage = logMessage + ' - Downloaded ' + progressObj.percent + '%';
    logMessage = logMessage + ' (' + progressObj.transferred + '/' + progressObj.total + ')';

    sendUpdateMessage(mainWindow, 'downloadProgress', logMessage);
  });

  ipcMain.on('checkForUpdate', () => {
    // 每次检查更新时 读取 config/config.json的 updateUrl 字段
    const config = fs.readFileSync(getConfigPath('config.json'), 'utf8');
    const configObj = JSON.parse(config);
    console.log('configObj', configObj);

    autoUpdater.setFeedURL(configObj.updateUrl);

    // autoUpdater.setFeedURL({
    //   provider: 'generic',
    //   url: configObj.updateUrl,
    //   channel: 'latest-ba'
    // });

    autoUpdater
      .checkForUpdates()
      .then((rst) => {
        log.info('---------------------checkForUpdates success---------------------', rst);
        sendUpdateMessage(mainWindow, 'checkForUpdates-success', JSON.stringify(rst));
      })
      .catch((err) => {
        log.error('------------checkForUpdates error------------', err);
        sendUpdateMessage(mainWindow, 'checkForUpdates-error', JSON.stringify(err));
      });
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
}

function sendUpdateMessage(mainWindow: BrowserWindow | null, key: string, text: string) {
  mainWindow?.webContents.send('message', `${key}: ${text}`);
}

export { updateHandle };
