// Fixed splash screen test script
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let splashWindow = null;
let mainWindow = null;
let isSplashComplete = false;
let splashTimeout = null;

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
    if (splashWindow) {
      console.log('Splash window ready, showing...');
      splashWindow.show();
      splashWindow.center();
    }
  });

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
  }, 6000);
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

// Handle theme request
ipcMain.handle('get-theme', () => {
  console.log('Splash screen requested theme...');
  return 'dark'; // Default theme
});

app.whenReady().then(() => {
  console.log('App ready, creating splash window...');
  createSplashWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    // Reset state for new session
    isSplashComplete = false;
    splashWindow = null;
    mainWindow = null;
    
    // Clear any existing timeout
    if (splashTimeout) {
      clearTimeout(splashTimeout);
      splashTimeout = null;
    }
    
    createSplashWindow();
  }
});
