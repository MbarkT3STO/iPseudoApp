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

let splashWindow: BrowserWindow | null = null;
let mainWindow: BrowserWindow | null = null;
let isSplashComplete = false;
let splashTimeout: NodeJS.Timeout | null = null;

function createSplashWindow() {
  console.log('Creating splash window...');
  
  // Clean up any existing splash window
  if (splashWindow) {
    console.log('Cleaning up existing splash window...');
    splashWindow.close();
    splashWindow = null;
  }
  
  // Clear any existing timeout
  if (splashTimeout) {
    clearTimeout(splashTimeout);
    splashTimeout = null;
  }
  
  splashWindow = new BrowserWindow({
    width: 500,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../renderer/preload.js'),
      sandbox: false
    },
    // Splash screen specific settings
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    show: false, // Don't show until ready
    title: 'iPseudo IDE - Loading'
  });

  // Load the splash screen
  splashWindow.loadFile(path.join(__dirname, '../renderer/splash.html'));

  // Show splash window when ready
  splashWindow.once('ready-to-show', () => {
    if (splashWindow) {
      console.log('Splash window ready, showing...');
      splashWindow.show();
      splashWindow.center();
    }
  });

  // Handle splash window closed
  splashWindow.on('closed', () => {
    console.log('Splash window closed');
    splashWindow = null;
  });
  
  // Set up timeout fallback
  splashTimeout = setTimeout(() => {
    console.log('Splash screen timeout - forcing main window creation');
    if (!isSplashComplete && !mainWindow) {
      isSplashComplete = true;
      if (splashWindow) {
        splashWindow.close();
        splashWindow = null;
      }
      createMainWindow();
    }
  }, 6000); // 6 second timeout
}

function createMainWindow() {
  console.log('Creating main window...');
  
  mainWindow = new BrowserWindow({
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
    title: 'iPseudo IDE',
    // Show immediately since splash is done
    show: true
  });

  // Load the main app
  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  // Focus main window when ready
  mainWindow.once('ready-to-show', () => {
    if (mainWindow) {
      mainWindow.focus();
      console.log('Main window is ready and focused');
    }
  });

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // Handle main window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createWindow() {
  console.log('Creating window...');
  
  // Reset state for new session
  isSplashComplete = false;
  splashWindow = null;
  mainWindow = null;
  
  // Clear any existing timeout
  if (splashTimeout) {
    clearTimeout(splashTimeout);
    splashTimeout = null;
  }
  
  // Create splash window first
  createSplashWindow();
  
  // Main window will be created when splash completes
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      // Reset state for new session
      isSplashComplete = false;
      splashWindow = null;
      mainWindow = null;
      createWindow();
    } else if (splashWindow && !mainWindow) {
      // If only splash window exists, create main window
      createMainWindow();
    }
  });
});

// Handle splash screen completion
ipcMain.handle('splash-complete', () => {
  console.log('Splash screen completed - creating main window');
  
  if (isSplashComplete) {
    console.log('Splash already completed, ignoring duplicate request');
    return { success: true };
  }
  
  isSplashComplete = true;
  
  // Clear timeout
  if (splashTimeout) {
    clearTimeout(splashTimeout);
    splashTimeout = null;
  }
  
  // Close splash window
  if (splashWindow) {
    splashWindow.close();
    splashWindow = null;
  }
  
  // Now create the main window
  createMainWindow();
  
  return { success: true };
});

// Handle theme request from splash screen
ipcMain.handle('get-theme', () => {
  console.log('Splash screen requested theme...');
  
  // For now, just return system theme detection
  // The splash screen will handle localStorage reading itself
  const isDark = process.platform === 'darwin' ? 
    require('os').userInfo().homedir.includes('Dark') : false;
  
  const theme = isDark ? 'dark' : 'light';
  console.log('Returning system theme:', theme);
  return theme;
});

// Timeout is now handled in createSplashWindow function

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
