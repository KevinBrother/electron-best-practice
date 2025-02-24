import { constants } from '@common/index';
import { TOpenConfig } from '@common/modal';
import { EditorWindowID, OpenWindowID } from './constants';
const { ipcRenderer } = window.electron;

console.log(constants);

ipcRenderer.on('message', function (_event, text) {
  const container = document.getElementById('messages');
  const message = document.createElement('div');

  message.innerHTML = text;
  container?.appendChild(message);

  const hr = document.createElement('hr');
  container?.appendChild(hr);
});

ipcRenderer.on('download-progress', function (_event, text) {
  const container = document.getElementById('download-progress');
  const message = document.createElement('div');
  message.innerHTML = text;
  container?.appendChild(message);
});

document.getElementById('autoUpdate')?.addEventListener('click', function () {
  ipcRenderer.send('autoUpdate', (document.getElementById('autoUpdate') as HTMLInputElement)?.checked);
});

document.getElementById('update-now')?.addEventListener('click', function () {
  console.log('update-now clicked');
  ipcRenderer.invoke('updateNow').then((rst) => {
    console.log('updateNow： ', rst);
  });
});

document.getElementById('checkForUpdate')?.addEventListener('click', function () {
  ipcRenderer.send('checkForUpdate');
});

document.getElementById('openWindow')?.addEventListener('click', function () {
  console.log('openWindow');

  const winConfig = (document.getElementById('winConfig') as HTMLTextAreaElement)?.value;
  console.log('winConfig', winConfig);

  try {
    const config = JSON.parse(winConfig);
    config.filePath = 'windows/index.html';
    
    config.id = OpenWindowID;

    ipcRenderer.invoke('openWindow', config).then((rst) => {
      console.log('openWindow ', rst);
    }).catch((error) => {
      console.error('Error opening window:', error);
    });
  } catch (error) {
    console.error('Error parsing window config:', error);
  }
});

document.getElementById('openEditor')?.addEventListener('click', function () {
  console.log('openEditor');

  const defaultConfig: TOpenConfig = {
    id: EditorWindowID,
    width: 800,
    height: 600,
    x: 100,
    y: 100,
    frame: false,
    transparent: true,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    filePath: 'editor/index.html'
  };

  ipcRenderer.invoke('openWindow', defaultConfig).then((rst) => {
    console.log('openEditor ', rst);
  }).catch((error) => {
    console.error('Error opening editor:', error);
  });
});
