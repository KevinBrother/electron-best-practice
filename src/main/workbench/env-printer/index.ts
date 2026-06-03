import { spawn, ChildProcess } from 'child_process';
import path from 'path';
import { app } from 'electron';
import fs from 'fs';

let envPrinterProcess: ChildProcess | null = null;

/**
 * 获取 Go 子进程可执行文件路径
 * 开发环境：从 go-env-printer 目录获取
 * 生产环境：从 resources 目录获取
 */
function getEnvPrinterPath(): string {
  const platform = process.platform;
  const arch = process.arch;

  // 可执行文件名
  const exeName = platform === 'win32' ? 'env-printer.exe' : 'env-printer';

  // 开发环境
  if (!app.isPackaged) {
    const devPath = path.join(__dirname, 'go-env-printer', exeName);
    if (fs.existsSync(devPath)) {
      return devPath;
    }
    // 如果 Go 程序还没编译，返回源码路径（需要先编译）
    const srcPath = path.join(__dirname, 'go-env-printer');
    console.log(`[env-printer] Go executable not found at ${devPath}`);
    console.log(`[env-printer] Please build it first: cd ${srcPath} && go build -o ${exeName}`);
    return '';
  }

  // 生产环境 - 从 resources 目录获取
  const prodPath = path.join(process.resourcesPath, 'env-printer', exeName);
  if (fs.existsSync(prodPath)) {
    return prodPath;
  }

  console.error(`[env-printer] Executable not found at ${prodPath}`);
  return '';
}

/**
 * 启动 Go 子进程打印环境变量
 * @param log 可选的日志回调函数
 */
export function startEnvPrinter(log?: (message: string) => void): void {
  const logFn = log || ((msg: string) => console.log(msg));

  if (envPrinterProcess) {
    logFn('[env-printer] Process already running');
    return;
  }

  const exePath = getEnvPrinterPath();
  if (!exePath) {
    logFn('[env-printer] Failed to find executable, skipping...');
    return;
  }

  logFn(`[env-printer] Starting subprocess: ${exePath}`);

  // 启动子进程
  envPrinterProcess = spawn(exePath, [], {
    stdio: ['ignore', 'pipe', 'pipe'],
    // 继承父进程的环境变量
    env: process.env,
  });

  // 捕获标准输出
  envPrinterProcess.stdout?.on('data', (data: Buffer) => {
    const output = data.toString().trim();
    if (output) {
      logFn(`[env-printer stdout] ${output}`);
    }
  });

  // 捕获标准错误
  envPrinterProcess.stderr?.on('data', (data: Buffer) => {
    const output = data.toString().trim();
    if (output) {
      logFn(`[env-printer stderr] ${output}`);
    }
  });

  // 进程退出处理
  envPrinterProcess.on('close', (code: number | null) => {
    logFn(`[env-printer] Process exited with code ${code}`);
    envPrinterProcess = null;
  });

  // 进程错误处理
  envPrinterProcess.on('error', (err: Error) => {
    logFn(`[env-printer] Process error: ${err.message}`);
    envPrinterProcess = null;
  });

  logFn(`[env-printer] Subprocess started with PID: ${envPrinterProcess.pid}`);
}

/**
 * 停止 Go 子进程
 */
export function stopEnvPrinter(): void {
  if (envPrinterProcess) {
    console.log('[env-printer] Stopping subprocess...');
    envPrinterProcess.kill();
    envPrinterProcess = null;
  }
}

/**
 * 检查子进程是否正在运行
 */
export function isEnvPrinterRunning(): boolean {
  return envPrinterProcess !== null && !envPrinterProcess.killed;
}

export default {
  start: startEnvPrinter,
  stop: stopEnvPrinter,
  isRunning: isEnvPrinterRunning,
};