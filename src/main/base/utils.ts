import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron';
import path from 'path';
import { openWindow } from '../workbench';
import { constants } from '@common/index';
import { isDev, getFileLog } from '../utils';

const log = getFileLog();

function logTime(str: string) {
  log.info(`${str} time: ${new Date().toISOString().split('T')[1].split('.')[0]}`);
}

let mainWindow: BrowserWindow | null;

const eventHandle = () => {
  ipcMain.handle('openWindow', async (_event, arg) => {
    const win = openWindow(arg);
    win?.webContents.openDevTools();
    return win ? 'success' : 'fail';
  });

  ipcMain.on(constants.CLOSE_INNER_WINDOW, (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    win?.close();
  });
};

const createWindow = () => {
  mainWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      sandbox: false,
      devTools: true,
      contextIsolation: false,
      allowRunningInsecureContent: true,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      preload: path.resolve(__dirname, '..', './preload/index.js')
    }
  });

  mainWindow.maximize();
  mainWindow.show();

  mainWindow.on('close', () => {
    app.quit();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    app.quit();
  });

  if (isDev()) {
    mainWindow.webContents.openDevTools();
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile('dist/renderer/index.html');
  }

  return mainWindow;
};

function lifeCycle({ appReady }: { appReady: () => void }) {
  const gotTheLock = app.requestSingleInstanceLock();

  if (process.defaultApp) {
    if (process.argv.length >= 2) {
      app.setAsDefaultProtocolClient('kss-ele', process.execPath, [path.resolve(process.argv[1])])
    }
  } else {
    app.setAsDefaultProtocolClient('kss-ele')
  }

  if (!gotTheLock) {
    app.quit();
  } else {
    // window 下处理 special protocol 协议
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      // Someone tried to run a second instance, we should focus our window.
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore()
        mainWindow.focus()
      }
  
      console.log(commandLine, workingDirectory)
    })

    // macos 下处理 special protocol 协议
    app.on('open-url', function (event, url) {
      event.preventDefault();
      shell.openExternal(url);
    })

    app.on('ready', () => {
      logTime('app ready');
      appReady();
    });

    app.on('window-all-closed', () => {
      logTime('window all closed');
      app.quit();
    });

    // Ensure the app quits when the dev command is terminated
    app.on('before-quit', () => {
      if (mainWindow) {
        logTime('before quit');
        mainWindow.close();
      }
    });

    app.on('quit', () => {
      // 自动更新 会触发 before-quit 事件，但不会触发 quit 事件，更新完成后，会触发 ready 事件
      logTime('quit');
    })

    // Listen for the 'SIGINT' signal to quit the app
    process.on('SIGINT', () => {
      logTime('SIGINT');
      app.quit();
    });

    app.on('activate', () => {
      logTime('activate');
      if (mainWindow === null) {
        createWindow();
      }
    });

    app.on('certificate-error', (event, _webContents, _url, _error, _certificate, callback) => {
      logTime('certificate-error');
      event.preventDefault();
      callback(true);
    });
  }
}

export { lifeCycle, eventHandle, createWindow };
