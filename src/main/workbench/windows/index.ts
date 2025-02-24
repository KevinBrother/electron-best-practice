import { BrowserWindow, screen } from 'electron';
import path from 'path';
import { getRenderPath } from '../../utils';
import { TOpenConfig } from '@common/modal';

function openWindow(winConfig : TOpenConfig) {
  const { width, height, x, y } = screen.getPrimaryDisplay().bounds;
  const { width: _width, height: _height, x: _x, y: _y, filePath } = winConfig;

  const win = new BrowserWindow({
    width: _width || width,
    height: _height || height,
    x: _x || x,
    y: _y || y,
    webPreferences: {
      sandbox: false,
      devTools: true,
      contextIsolation: false,
      allowRunningInsecureContent: true,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      preload: path.resolve(__dirname, '../', './preload/index.js')
    },
    ...winConfig
  });

  win.loadFile(path.resolve(getRenderPath(), filePath || 'default/index.html'));

  return win;
}

export { openWindow };
