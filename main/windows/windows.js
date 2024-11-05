const {
  app,
  BrowserWindow,
  desktopCapturer,
  ipcMain,
  session,
  screen,
} = require("electron");

let windows = {};

function openWindow(mainWindow, winConfig) {
  mainWindow.minimize();
  console.log("🚀 ~ openWindow ~ https://github.com:");
  const { width, height, x, y } = screen.getPrimaryDisplay().bounds;

  let _winConfig = {};

  try {
    _winConfig = JSON.parse(winConfig);
  } catch (error) {
    console.error("winConfig 格式错误", error);
    return null;
  }

  // Create the browser window.
  const win =new BrowserWindow({
    width: _winConfig.width || width,
    height: _winConfig.height || height,
    x: _winConfig.x || x,
    y: _winConfig.y || y,
    // frame: true,
    // transparent: true,
    // show: true,
    // width: 800,
    // height: 600,
    // autoHideMenuBar: true,
    // // 由于chrome在上面有遮罩窗口的情况下，优化性能不会建树，所以利用透明度解决
    // // 为了解决窗口遮挡chrome时，捕获器验证失败的问题
    // // opacity: 0.99999,
    // backgroundColor: "rgba(0, 0, 0, 0)", // 设置背景为透明
    webPreferences: {
      devTools: true,
      nodeIntegration: true,
      //   webSecurity: false,
      contextIsolation: false,
      //   spellcheck: false, // 不启用拼写检查器
      //   sandbox: false,
      //   frame: false,
      //   fullscreen: true,
      //   movable: false,
      //   resizable: false,
      //   enableLargerThanScreen: true,
      //   hasShadow: false,
    },
    ..._winConfig,
  });

  //   win.setAlwaysOnTop(true, "screen-saver");
  //   win.setVisibleOnAllWorkspaces(true);
  //   win.setFullScreenable(false);
  // win.hide();

  //   desktopCapturer.getSources({ types: ["screen"] }).then((sources) => {
  //     // Grant access to the first screen found.
  //     callback({ video: sources[0], audio: "loopback" });
  //   });

  // and load the index.html of the app.

  win.loadFile("render/windows/index.html");
  //   win.loadURL('https://github.com')

  // windows[win.id] = win;

  return win;
}

function captureSources() {
  return new Promise((resolve, reject) => {
    desktopCapturer.getSources({ types: ["screen"] }).then((sources) => {
      // Grant access to the first screen found.
      resolve(sources[0]);
    });
  });
}

module.exports = {
  openWindow,
  captureSources,
};
