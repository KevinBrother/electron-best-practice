// 引入 ElectronAPI 类型
import type { ElectronAPI } from '@electron-toolkit/preload';

// 扩展 window 对象来包括 electronAPI
declare global {
  interface Window {
    electron: ElectronAPI;
    good: string;
  }

  namespace NodeJS {
    interface Process {
      test: string;
    }
  }
}
