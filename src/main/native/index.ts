import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { getAppRootPath, getFileLog } from '../utils';
import AdmZip from 'adm-zip';

const log = getFileLog();

// 获取 native 模块路径
function getNativeResourcePath(): string {
  return path.join(getAppRootPath(), 'native');
}

// 获取解压后的目标路径（放在用户数据目录）
function getExtractedPath(): string {
  return path.join(os.tmpdir(), 'electron-best-practice', 'native');
}

// 获取当前平台的 zip 文件名
function getPlatformZipName(): string {
  const platform = process.platform;
  const arch = process.arch;
  
  if (platform === 'darwin') {
    return arch === 'arm64' ? 'darwin-arm64.zip' : 'darwin-x64.zip';
  } else if (platform === 'win32') {
    return 'windows-x64.zip';
  } else {
    return arch === 'arm64' ? 'linux-arm64.zip' : 'linux-x64.zip';
  }
}

// 获取可执行文件名
function getExecutableName(): string {
  return process.platform === 'win32' ? 'native-reader.exe' : 'native-reader';
}

// 解压 native 模块（如果尚未解压或需要更新）
function extractNativeModule(): string {
  const nativeResourcePath = getNativeResourcePath();
  const extractedPath = getExtractedPath();
  const zipName = getPlatformZipName();
  const zipPath = path.join(nativeResourcePath, zipName);
  
  // 检查 zip 文件是否存在
  if (!fs.existsSync(zipPath)) {
    throw new Error(`Native module zip not found: ${zipPath}`);
  }
  
  // 检查是否需要解压（简化逻辑：每次都检查）
  const platformDir = path.join(extractedPath, zipName.replace('.zip', ''));
  const executablePath = path.join(platformDir, getExecutableName());
  
  if (!fs.existsSync(executablePath)) {
    log.info(`Extracting native module from ${zipPath}...`);
    
    // 确保目标目录存在
    fs.mkdirSync(extractedPath, { recursive: true });
    
    // 解压
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(extractedPath, true);
    
    log.info(`Native module extracted to ${extractedPath}`);
  }
  
  return platformDir;
}

// 调用 native 模块并获取数据
export function callNativeModule(): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const platformDir = extractNativeModule();
      const executableName = getExecutableName();
      const executablePath = path.join(platformDir, executableName);
      
      // 确保可执行权限（Unix 系统）
      if (process.platform !== 'win32') {
        fs.chmodSync(executablePath, 0o755);
      }
      
      log.info(`Calling native module: ${executablePath}`);
      
      // 启动子进程
      const child = spawn(executablePath, [], {
        cwd: platformDir, // 设置工作目录，确保能找到 data.json
        env: process.env
      });
      
      let stdout = '';
      let stderr = '';
      
      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });
      
      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      
      child.on('error', (error) => {
        log.error(`Native module error: ${error.message}`);
        reject(error);
      });
      
      child.on('close', (code) => {
        if (code === 0) {
          log.info(`Native module returned: ${stdout}`);
          resolve(stdout.trim());
        } else {
          const error = new Error(`Native module exited with code ${code}: ${stderr}`);
          log.error(error.message);
          reject(error);
        }
      });
      
    } catch (error) {
      log.error(`Failed to call native module: ${error}`);
      reject(error);
    }
  });
}

// 清理解压的文件
export function cleanupNativeModule(): void {
  const extractedPath = getExtractedPath();
  if (fs.existsSync(extractedPath)) {
    fs.rmSync(extractedPath, { recursive: true, force: true });
    log.info(`Cleaned up native module at ${extractedPath}`);
  }
}
