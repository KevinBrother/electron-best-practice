const { ipcRenderer } = window.electron;

import { constants } from '@common/constants';

console.log(constants);

// 关闭
document.getElementById('closeWindow')?.addEventListener('click', () => {
  ipcRenderer.send(constants.CLOSE_INNER_WINDOW);
});
