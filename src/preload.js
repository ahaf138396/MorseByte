const { contextBridge, ipcRenderer, clipboard } = require('electron');
const fs = require('fs');

contextBridge.exposeInMainWorld('morseApi', {
  copy: (text) => clipboard.writeText(text || ''),
  paste: () => clipboard.readText(),
  saveText: async (content) => {
    const filePath = await ipcRenderer.invoke('save-file');
    if (!filePath) return null;
    fs.writeFileSync(filePath, content || '', 'utf8');
    return filePath;
  },
  platform: process.platform
});
