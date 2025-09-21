const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'renderer/preload.js')
    }
  });

  mainWindow.loadFile('src/renderer/index.html');
  
  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers
ipcMain.handle('dialog:openFile', async () => {
  const win = BrowserWindow.getFocusedWindow();
  const { canceled, filePaths } = await dialog.showOpenDialog(win, {
    properties: ['openFile'],
    filters: [
      { name: 'Text Files', extensions: ['txt', 'pseudo', 'js', 'py', 'java', 'cpp', 'c'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  
  if (canceled || !filePaths || filePaths.length === 0) return { canceled: true };
  const content = await fs.promises.readFile(filePaths[0], 'utf8');
  return { canceled: false, filePath: filePaths[0], content };
});

ipcMain.handle('dialog:saveFile', async (event, args) => {
  let { filePath, content } = args;
  const win = BrowserWindow.getFocusedWindow();
  
  if (!filePath) {
    const { canceled, filePath: fp } = await dialog.showSaveDialog(win, {
      defaultPath: 'untitled.pseudo',
      filters: [
        { name: 'Pseudocode Files', extensions: ['pseudo'] },
        { name: 'Text Files', extensions: ['txt'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });
    if (canceled) return { canceled: true };
    filePath = fp;
  }
  
  await fs.promises.writeFile(filePath, content, 'utf8');
  return { canceled: false, filePath };
});

ipcMain.handle('open-external', (event, url) => {
  return shell.openExternal(url);
});
