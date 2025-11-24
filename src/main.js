const { app, BrowserWindow, nativeTheme, ipcMain, dialog } = require('electron');
const path = require('path');

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 720,
    minWidth: 900,
    minHeight: 600,
    title: 'MorseByte',
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#0f172a' : '#f8fafc',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
};

ipcMain.handle('save-file', async () => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'Save Conversion',
    buttonLabel: 'Save as .txt',
    defaultPath: 'conversion.txt',
    filters: [{ name: 'Text Files', extensions: ['txt'] }]
  });

  if (canceled) return null;
  return filePath;
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
