import './env';
import { contextBridge } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector: string, text: string) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ['chrome', 'node', 'electron', 'app'] as const) {
    replaceText(`${type}-version`, process.versions[type] ?? `none-${type}-version`);
  }

  replaceText('appName', process.versions['name'] ?? 'kssbox');
});

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI;
}

process.test = 'test';
