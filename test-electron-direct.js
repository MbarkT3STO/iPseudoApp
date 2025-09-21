// Try to access electron API directly
console.log('Process:', process.versions);
console.log('Electron version:', process.versions.electron);

// Check if we're running in electron
if (process.versions.electron) {
  console.log('Running in Electron!');
  // Try to access the app object directly
  try {
    const { app, BrowserWindow } = require('electron');
    console.log('App loaded:', app);
  } catch (e) {
    console.log('Error loading electron:', e.message);
  }
} else {
  console.log('Not running in Electron');
}
