import { constants } from '@common/index';
const { ipcRenderer } = window.electron;

console.log(constants);

ipcRenderer.on('message', function (_event, text) {
  console.log('renderer get message: ', text);
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

document.getElementById('update-now')?.addEventListener('click', function () {
  console.log('update-now clicked');
  ipcRenderer.invoke('updateNow').then((rst) => {
    console.log('updateNow： ', rst);
  });
});

document.getElementById('checkForUpdate')?.addEventListener('click', function () {
  console.log('checkForUpdate');
  ipcRenderer.send('checkForUpdate');
});

document.getElementById('openWindow')?.addEventListener('click', function () {
  console.log('openWindow');

  const winConfig = (document.getElementById('winConfig') as HTMLTextAreaElement)?.value;
  console.log('winConfig', winConfig);

  ipcRenderer.invoke('openWindow', winConfig).then((rst) => {
    console.log('openWindow ', rst);
  });
});
