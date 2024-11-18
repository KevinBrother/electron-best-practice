import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { openWindow } from '../workbench';
import { constants } from '@common/index';

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
  // 默认打开 devTools
  mainWindow.webContents.openDevTools();

  mainWindow.maximize();
  mainWindow.show();

  mainWindow.on('close', () => {
    app.quit();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    app.quit();
  });

  console.log('process.env.NODE_ENV', process.env.NODE_ENV);

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile('dist/renderer/index.html');
  }

  return mainWindow;
};

function lifeCycle({ appReady }: { appReady: () => void }) {
  const gotTheLock = app.requestSingleInstanceLock();

  if (!gotTheLock) {
    app.quit();
  } else {
    app.on('ready', () => {
      appReady();
    });

    app.on('window-all-closed', () => {
      app.quit();
    });

    // Ensure the app quits when the dev command is terminated
    app.on('before-quit', () => {
      if (mainWindow) {
        mainWindow.close();
      }
    });

    // Listen for the 'SIGINT' signal to quit the app
    process.on('SIGINT', () => {
      app.quit();
    });

    app.on('activate', () => {
      if (mainWindow === null) {
        createWindow();
      }
    });

    app.on('certificate-error', (event, _webContents, _url, _error, _certificate, callback) => {
      event.preventDefault();
      callback(true);
    });
  }
}

export { lifeCycle, eventHandle, createWindow };
