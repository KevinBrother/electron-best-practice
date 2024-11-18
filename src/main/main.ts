import { app, BrowserWindow, ipcMain, Notification, protocol } from 'electron';
import path from 'path';
import fs from 'fs';
import log from 'electron-log';
import { openWindow, captureSources } from './windows/windows';
import { updateHandle } from './update';
import { constants } from '@common/constants';

console.log(constants.CLOSE_INNER_WINDOW, constants.HANDLE_CAPTURE_SOURCES);

log.info('-----------------------Hello, log-----------------------');

app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  event.preventDefault();
  callback(true);
});
let mainWindow: BrowserWindow | null;

const createWindow = async () => {
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

  ipcMain.handle('openWindow', async (event, arg) => {
    const win = openWindow(mainWindow, arg);
    win?.webContents.openDevTools();
    return win ? 'success' : 'fail';
  });

  ipcMain.handle('handle_capture_sources', async () => {
    return captureSources();
  });

  ipcMain.on('close-inner-window', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    win?.close();
  });

  mainWindow.on('close', () => {
    app.quit();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    app.quit();
  });

  // mainWindow.loadURL("http://localhost:5173");
  mainWindow.loadFile('dist/renderer/index.html');

  console.log(process.env.isDevelopment);

  if (process.env.isDevelopment) {
    mainWindow.webContents.openDevTools();
  }
};

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('ready', createWindow);

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
}
