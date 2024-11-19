import { app } from 'electron';
import path from 'path';

function getAppRootPath(): string {
  if (process.env.NODE_ENV === 'development') {
    return path.resolve(__dirname, '..', '..');
  }
  return path.resolve(app.getAppPath(), '..');
}

function getConfigPath(configName: string): string {
  return path.join(getAppRootPath(), 'config', configName);
}

function getPlatform(): string {
  return process.platform;
}

function isWindows(): boolean {
  return process.platform === 'win32';
}

function isMac(): boolean {
  return process.platform === 'darwin';
}

function isLinux(): boolean {
  console.log('process.platform', process.platform);
  return !isWindows() && !isMac();
}

function isDev(): boolean {
  console.log('process.env.NODE_ENV', process.env.NODE_ENV);
  return process.env.NODE_ENV === 'development';
}

export { getAppRootPath, getConfigPath, getPlatform, isWindows, isMac, isLinux, isDev };
