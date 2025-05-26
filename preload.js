const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (msg) => ipcRenderer.send('from-renderer', msg),
  onReply: (callback) => ipcRenderer.on('from-main', (event, msg) => callback(msg)),
});
