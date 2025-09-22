// Debug script for splash screen issues
// Run this to test the splash screen independently

const { app, BrowserWindow } = require('electron');
const path = require('path');

let splashWindow = null;
let mainWindow = null;

function createSplashWindow() {
  console.log('Creating splash window...');
  
  splashWindow = new BrowserWindow({
    width: 500,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'src/renderer/preload.js'),
      sandbox: false
    },
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    show: false,
    title: 'iPseudo IDE - Loading'
  });

  splashWindow.loadFile(path.join(__dirname, 'src/renderer/splash.html'));

  splashWindow.once('ready-to-show', () => {
    console.log('Splash window ready, showing...');
    splashWindow.show();
    splashWindow.center();
  });

  splashWindow.on('closed', () => {
    console.log('Splash window closed');
    splashWindow = null;
  });
}

function createMainWindow() {
  console.log('Creating main window...');
  
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'src/renderer/preload.js'),
      sandbox: false
    },
    show: false,
    title: 'iPseudo IDE'
  });

  mainWindow.loadFile(path.join(__dirname, 'src/renderer/index.html'));

  mainWindow.once('ready-to-show', () => {
    console.log('Main window ready, showing...');
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => {
    console.log('Main window closed');
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  console.log('App ready, creating splash window...');
  createSplashWindow();
  
  // Simulate splash completion after 3 seconds
  setTimeout(() => {
    console.log('Simulating splash completion...');
    if (splashWindow) {
      splashWindow.close();
    }
    createMainWindow();
  }, 3000);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createSplashWindow();
  }
});
