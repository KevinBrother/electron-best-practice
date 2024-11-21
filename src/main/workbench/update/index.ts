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
  });

  function manualDownloadHandle() {
    
    return new Promise((resolve) => {
      autoUpdater.downloadUpdate().then((rst) => {
        log.info('---------------------manualDownloadHandle---------------------');
        sendUpdateMessage(mainWindow, 'downloadProgress', JSON.stringify(rst));
        resolve(rst);
      });
    });
  }

  autoUpdater.on('update-not-available', () => {
    sendUpdateMessage(mainWindow, 'updateNotAvailable', message.updateNotAvailable);
  });

  autoUpdater.on('download-progress', (progressObj) => {
    let logMessage = 'Download speed: ' + progressObj.bytesPerSecond;
    logMessage = logMessage + ' - Downloaded ' + progressObj.percent + '%';
    logMessage = logMessage + ' (' + progressObj.transferred + '/' + progressObj.total + ')';

    sendUpdateMessage(mainWindow, 'downloadProgress', logMessage);
  });

  ipcMain.on('autoUpdate', (_, checked) => {
    console.log('autoUpdate', checked);
    if (checked) {
      Promise.resolve()
        .then(() => {
          return checkForUpdate(mainWindow);
        })
        .then(() => {
          return manualDownloadHandle();
        })
        .then(() => {
          console.log('开始更新');
          autoUpdater.quitAndInstall();
        });
    }
  });

  ipcMain.on('checkForUpdate', () => {
    Promise.resolve()
      .then(() => {
        return checkForUpdate(mainWindow);
      })
      .then(() => {
        return manualDownloadHandle(); // manualDownloadHandle can be called here
      });
  });

  ipcMain.handle('updateNow', () => {
    log.info('开始更新');

    const buttons = ['启动', '取消'];
    const options = {
      type: 'question',
      message: '新版本已经下载好啦，开始更新吗？',
      cancelId: -1,
      buttons
    };

    dialog.showMessageBox(mainWindow!, options).then((response) => {
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

function checkForUpdate(mainWindow: BrowserWindow | null) {
  // 每次检查更新时 读取 config/config.json的 updateUrl 字段
  const config = fs.readFileSync(getConfigPath('config.json'), 'utf8');
  const configObj = JSON.parse(config);
  log.info('--------------------- configObj ---------------------', configObj);

  autoUpdater.setFeedURL(configObj.updateUrl);

  return autoUpdater
    .checkForUpdates()
    .then((rst) => {
      sendUpdateMessage(mainWindow, 'checkForUpdates-success', JSON.stringify(rst));
      log.info('---------------------checkForUpdates success---------------------');
      return rst;
    })
    .catch((err) => {
      log.error('------------checkForUpdates error------------', err);
      sendUpdateMessage(mainWindow, 'checkForUpdates-error', JSON.stringify(err));
    });
}

export { updateHandle };
