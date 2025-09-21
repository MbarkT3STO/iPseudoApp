import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

// Type definitions for better TypeScript support
interface SaveDialogOptions {
  title?: string;
  defaultPath?: string;
  filters?: Array<{ name: string; extensions: string[] }>;
}

interface OpenDialogOptions {
  title?: string;
  defaultPath?: string;
  filters?: Array<{ name: string; extensions: string[] }>;
  properties?: string[];
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../renderer/preload.js'),
      sandbox: false
    },
    // Set minimum dimensions
    minWidth: 800,
    minHeight: 600,
    // Use native window frame on macOS
    frame: process.platform === 'darwin',
    // Set window title
    title: 'iPseudo IDE'
  });

  // Load the index.html file
  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

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

// IPC handlers for file operations and pseudocode execution will go here

// Add message box handler
ipcMain.handle('show-message-box', async (event: any, options: any) => {
  const win = BrowserWindow.getFocusedWindow();
  const result = await dialog.showMessageBox(win!, options);
  return result;
});

ipcMain.handle('dialog:openFile', async () => {
  const win = BrowserWindow.getFocusedWindow();
  const { canceled, filePaths } = await dialog.showOpenDialog(win!, {
    properties: ['openFile'],
    filters: [{ name: 'Pseudocode', extensions: ['pseudo', 'txt'] }, { name: 'All Files', extensions: ['*'] }]
  });
  if (canceled || !filePaths || filePaths.length === 0) return { canceled: true };
  const content = await fs.promises.readFile(filePaths[0], 'utf8');
  return { canceled: false, filePath: filePaths[0], content };
});

ipcMain.handle('dialog:saveFile', async (_evt: any, args: { filePath?: string; content: string }) => {
  let { filePath, content } = args;
  const win = BrowserWindow.getFocusedWindow();
  if (!filePath) {
    const { canceled, filePath: fp } = await dialog.showSaveDialog(win!, {
      defaultPath: 'untitled.pseudo',
      filters: [{ name: 'Pseudocode', extensions: ['pseudo', 'txt'] }]
    });
    if (canceled || !fp) return { canceled: true };
    filePath = fp;
  }
  await fs.promises.writeFile(filePath, content, 'utf8');
  return { canceled: false, filePath };
});

ipcMain.handle('show-open-dialog', async (event: any, options: any) => {
  const { canceled, filePaths } = await dialog.showOpenDialog(options);
  return { canceled, filePaths };
});

// Add openExternal handler
ipcMain.handle('open-external', (event: any, url: string) => {
  return shell.openExternal(url);
});
