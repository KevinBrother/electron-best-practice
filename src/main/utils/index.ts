import { app } from 'electron';
import os from 'os';
import path from 'path';
import log from 'electron-log';

export function getFileLog() {
  log.transports.file.level = 'info';

  // 自定义日志存储路径
  log.transports.file.resolvePath = () => {
    return path.join(getConfigPath('logs'), 'app.log'); // 这里将日志存储在项目的 "logs" 文件夹下
  };

  return log;
}

export function getAppRootPath(): string {
  if (process.env.NODE_ENV === 'development') {
    return path.resolve(__dirname, '..', '..');
  }
  return path.resolve(app.getAppPath(), '..');
}

export function getConfigPath(configName: string): string {
  // return path.resolve(os.homedir(), '.kss-ele', 'config', configName);
  return path.resolve(getAppRootPath(), 'config', configName);
}

export function getPlatform(): string {
  return process.platform;
}

export function isWindows(): boolean {
  return process.platform === 'win32';
}

export function isMac(): boolean {
  return process.platform === 'darwin';
}

export function isLinux(): boolean {
  console.log('process.platform', process.platform);
  return !isWindows() && !isMac();
}

export function isDev(): boolean {
  console.log('process.env.NODE_ENV', process.env.NODE_ENV);
  return process.env.NODE_ENV === 'development';
}
