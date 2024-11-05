const { app, BrowserWindow, ipcMain, Notification } = require("electron");
const path = require("path");
const fs = require("fs");
const log = require("electron-log");
const { openWindow, captureSources } = require("./windows/windows");
// const { startRenderServer } = require("./start-render");
const { updateHandle } = require("./update");
log.info("-----------------------Hello, log-----------------------");

// 支持打开https的链接
app.on(
  "certificate-error",
  (event, webContents, url, error, certificate, callback) => {
    event.preventDefault();
    callback(true);
  }
);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
const createWindow = async () => {
  // 启动渲染进程
  // await startRenderServer();

  // Create the browser window.
  mainWindow = new BrowserWindow({
    show: false,
    /*fullscreen: true,
            minimizable: true,*/
    webPreferences: {
      devTools: true,
      // webSecurity: false,
      contextIsolation: false, // 在 web 中使用 Node.js 的 require 语法，以及  electron 的 remote 模块
      allowRunningInsecureContent: true,
      nodeIntegration: true, //是否完整的支持 node. 默认值为true
      nodeIntegrationInWorker: true, // 是否在Web工作器中启用了Node集成
      enableRemoteModule: true, // 使用remote模块
      // preload: path.resolve(app.getAppPath(), 'src/main/setting/preload.js')
      preload: path.resolve(__dirname, "..", "./bridge/preload.js"),
    },
  });

  // mainWindow = new BrowserWindow();

  // 默认最大化
  mainWindow.maximize();
  mainWindow.show();

  // 加载菜单选项
  exports.mainWindow = mainWindow;

  // console.log("-----------------------loadURL-----------------------",process)
  // and load the index.html of the app.

  /*let indexUrl = path.resolve(__dirname, '../', 'index.html')
        mainWindow.loadURL(indexUrl);*/

  // mainWindow.loadURL(`file://${__dirname}/index.html`);

  // mainWindow.loadURL('https://mars-tech.com.cn/admin',{"extraHeaders": "pragma: no-cache"});
  // mainWindow.loadURL('https://pre.mars-tech.com.cn/admin', {"extraHeaders": "pragma: no-cache"});
  // mainWindow.loadURL('http://192.168.1.13/admin/', { "extraHeaders": "pragma: no-cache"});
  // mainWindow.loadURL('https://localhost:80/admin',{"extraHeaders": "pragma: no-cache"});
  // mainWindow.loadURL('https://192.168.1.127:80/admin',{"extraHeaders": "pragma: no-cache"});
  // mainWindow.loadURL('https://localhost:80/admin', { "extraHeaders": "pragma: no-cache" });
  // mainWindow.loadURL('http://localhost:80/admin', { "extraHeaders": "pragma: no-cache" });

  mainWindow.loadFile("render/index.html");
  // mainWindow.loadURL("file:///Applications/electron-best-practice.app/Contents/Resources/app.asar/render/index.html");
  // mainWindow.loadURL("http://localhost:8080");
  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  /*mainWindow.webContents.on("did-frame-finish-load", () => {
            mainWindow.webContents.once("devtools-opened", () => {
               mainWindow.focus();
            });
        });*/
  if (process.env.isDevelopment) {
    mainWindow.webContents.openDevTools();
  }

  // 尝试更新
  // updateHandle(mainWindow);

  ipcMain.handle("openWindow", async (event, arg) => {
    console.log("openWindow", arg);
    const win = openWindow(mainWindow, arg);
    if (win) {
      return 'success'
    } else {
      return 'fail'
    }
  });

  ipcMain.handle("captureSources", async (event, arg) => {
    console.log("captureSources");
    return captureSources();
  });

  ipcMain.on('close-inner-window', (event, arg) => {
    console.log("close-inner-window");
    const win = BrowserWindow.fromWebContents(event.sender);
    win.close();
  });


  // Emitted when the window is closed.
  mainWindow.on("close", (e) => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.

    e.preventDefault(); /*阻止应用退出*/
    mainWindow.hide(); /*隐藏当前窗口*/
  });

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== 'darwin') {
  //   app.quit();
  // }
  app.quit();
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

/*const getNotification = require('./setting/notification').getNotification
setTimeout(getNotification, 1000)*/
