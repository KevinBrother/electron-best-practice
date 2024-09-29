// @ts-check
const { ipcMain } = require("electron");
// 注意这个autoUpdater不是electron中的autoUpdater
const { autoUpdater } = require("electron-updater");

// 更新服务器地址，比如"http://**.**.**.**:3002/download/"
// import {uploadUrl} from "../../renderer/config";
const log = require("electron-log");
log.transports.file.level = "info";
autoUpdater.logger = log;

// autoUpdater
//   .checkForUpdatesAndNotify()
//   .then((rst) => {
//     log.info(
//       "---------------------checkForUpdatesAndNotify success---------------------",
//       rst
//     );
//   })
//   .catch((err) => {
//     log.error("------------checkForUpdatesAndNotify error ------------", err);
//   });

// 检测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
function updateHandle(mainWindow) {
  let message = {
    error: "更新出错",
    checking: "正在检查更新",
    updateAvailable: "检测到新版本",
    downloadProgress: "下载中",
    updateNotAvailable: "无新版本",
  };

  // autoUpdater.setFeedURL(uploadUrl);
  autoUpdater.on("error", function (error) {
    sendUpdateMessage(mainWindow, message.error);
  });
  autoUpdater.on("checking-for-update", function () {
    sendUpdateMessage(mainWindow, message.checking);
  });
  autoUpdater.on("update-available", function (info) {
    sendUpdateMessage(mainWindow, info);
  });
  autoUpdater.on("update-not-available", function (info) {
    sendUpdateMessage(mainWindow, message.updateNotAvailable);
  });

  // 更新下载进度事件
  autoUpdater.on("download-progress", function (progressObj) {
    mainWindow.webContents.send("downloadProgress", progressObj);
  });

  autoUpdater.on(
    "update-downloaded",
     function (event,
      releaseNotes,
      releaseName,
      releaseDate,
      updateUrl,
      quitAndUpdate) {
      
      mainWindow.webContents.send("updateDownloaded");

      
    }
  );

  ipcMain.handle("updateNow", (e, arg) => {
    log.info(arguments);
    log.info("开始更新");
    //some code here to handle event
    autoUpdater.quitAndInstall();
    return 'updateNow';
  });

  ipcMain.on("checkForUpdate", () => {
    //执行自动更新检查
    autoUpdater
      .checkForUpdates()
      .then((rst) => {
        log.info(
          "---------------------checkForUpdates success---------------------",
          rst
        );
      })
      .catch((err) => {
        log.error("------------checkForUpdates error------------", err);
      });
  });
}

// 通过main进程发送事件给renderer进程，提示更新信息
function sendUpdateMessage(mainWindow, text) {
  mainWindow.webContents.send("message", text);
}

exports.updateHandle = updateHandle;

/* class Update {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.updateHandle(mainWindow);
  }

  on(key) {
    this[key]();
  }

  error() {
    sendUpdateMessage(this.mainWindow, "更新出错");
  }
}
 */
