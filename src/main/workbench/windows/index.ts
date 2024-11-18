import { BrowserWindow, screen } from 'electron';
import path from 'path';

function openWindow(winConfig: string) {
  const { width, height, x, y } = screen.getPrimaryDisplay().bounds;

  let _winConfig: { width?: number; height?: number; x?: number; y?: number } = {};

  try {
    _winConfig = JSON.parse(winConfig);
  } catch (error) {
    console.error('winConfig 格式错误', error);
    return null;
  }

  const win = new BrowserWindow({
    width: _winConfig.width || width,
    height: _winConfig.height || height,
    x: _winConfig.x || x,
    y: _winConfig.y || y,
    webPreferences: {
      sandbox: false,
      devTools: true,
      contextIsolation: false,
      allowRunningInsecureContent: true,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      preload: path.resolve(__dirname, '../', './preload/index.js')
    },
    ..._winConfig
  });

  win.loadFile('dist/renderer/windows/index.html');
  return win;
}

export { openWindow };
