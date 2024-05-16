const { ipcMain } = require('electron');
// 注意这个autoUpdater不是electron中的autoUpdater
const { autoUpdater } = require('electron-updater');
// 更新服务器地址，比如"http://**.**.**.**:3002/download/"
// import {uploadUrl} from "../../renderer/config";
const log = require('electron-log');
log.transports.file.level = 'debug';
autoUpdater.logger = log;

autoUpdater
  .checkForUpdatesAndNotify()
  .then((rst) => {
    log.info(
      '---------------------checkForUpdatesAndNotify---------------------',
      rst
    );
  })
  .catch((err) => {
    log.error('------------checkForUpdatesAndNotify------------', err);
  });

// 检测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
function updateHandle(mainWindow) {
  let message = {
    error: '检查更新出错',
    checking: '正在检查更新……',
    updateAva: '检测到新版本，正在下载……',
    updateNotAva: '现在使用的就是最新版本，不用更新'
  };
  const os = require('os');

  // autoUpdater.setFeedURL(uploadUrl);
  autoUpdater.on('error', function (error) {
    sendUpdateMessage(mainWindow, message.error);
  });
  autoUpdater.on('checking-for-update', function () {
    sendUpdateMessage(mainWindow, message.checking);
  });
  autoUpdater.on('update-available', function (info) {
    sendUpdateMessage(mainWindow, message.updateAva);
  });
  autoUpdater.on('update-not-available', function (info) {
    sendUpdateMessage(mainWindow, message.updateNotAva);
  });

  // 更新下载进度事件
  autoUpdater.on('download-progress', function (progressObj) {
    log.info(
      '-------------------------mainWindow-------------------------',
      mainWindow
    );
    mainWindow.webContents.send('downloadProgress', progressObj);
  });
  autoUpdater.on(
    'update-downloaded',
    function (
      event,
      releaseNotes,
      releaseName,
      releaseDate,
      updateUrl,
      quitAndUpdate
    ) {
      ipcMain.on('isUpdateNow', (e, arg) => {
        console.log(arguments);
        console.log('开始更新');
        //some code here to handle event
        autoUpdater.quitAndInstall();
      });

      mainWindow.webContents.send('isUpdateNow');
    }
  );

  ipcMain.on('checkForUpdate', () => {
    //执行自动更新检查
    autoUpdater
      .checkForUpdates()
      .then((rst) => {
        log.info(
          '---------------------checkForUpdates success---------------------',
          rst
        );
      })
      .catch((err) => {
        log.error('------------checkForUpdates error------------', err);
      });
  });
}

// 通过main进程发送事件给renderer进程，提示更新信息
function sendUpdateMessage(mainWindow, text) {
  mainWindow.webContents.send('message', text);
}

exports.updateHandle = updateHandle;
