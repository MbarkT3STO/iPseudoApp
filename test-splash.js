// Test script to verify splash screen functionality
const { app, BrowserWindow } = require('electron');
const path = require('path');

let splashWindow = null;
let mainWindow = null;

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 500,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false
    },
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    show: false,
    title: 'iPseudo IDE - Loading'
  });

  // Load the splash screen
  splashWindow.loadFile(path.join(__dirname, 'src/renderer/splash.html'));

  splashWindow.once('ready-to-show', () => {
    if (splashWindow) {
      splashWindow.show();
      splashWindow.center();
    }
  });

  splashWindow.on('closed', () => {
    splashWindow = null;
  });
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false
    },
    minWidth: 800,
    minHeight: 600,
    frame: process.platform === 'darwin',
    title: 'iPseudo IDE',
    show: false
  });

  mainWindow.loadFile(path.join(__dirname, 'src/renderer/index.html'));

  mainWindow.once('ready-to-show', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createSplashWindow();
  // Don't create main window yet - wait for splash to complete

  // Simulate splash completion after 4 seconds
  setTimeout(() => {
    if (splashWindow) {
      splashWindow.close();
    }
    // Now create main window
    createMainWindow();
  }, 4000);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createSplashWindow();
    createMainWindow();
  }
});
