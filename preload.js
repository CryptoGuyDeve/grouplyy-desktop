const { contextBridge } = require('electron');

// If you ever want to expose APIs to your frontend
contextBridge.exposeInMainWorld('electronAPI', {
  ping: () => 'pong'
});
