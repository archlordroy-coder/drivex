const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  sendSync: () => ipcRenderer.send('sync-trigger'),
});
