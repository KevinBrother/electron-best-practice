// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const {ipcRenderer} = require('electron');

ipcRenderer.on('message', function(event, text) {
  var container = document.getElementById('messages');
  var message = document.createElement('div');
  message.innerHTML = text;
  container.appendChild(message);
})

ipcRenderer.on('download-progress', function(event, text) {
  var container = document.getElementById('download-progress');
  var message = document.createElement('div');
  message.innerHTML = text;
  container.appendChild(message);
})

