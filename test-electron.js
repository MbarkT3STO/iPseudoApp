const { app, BrowserWindow } = require('electron');

console.log('Electron app:', app);
console.log('App whenReady:', typeof app.whenReady);

app.whenReady().then(() => {
  console.log('App is ready!');
  const win = new BrowserWindow({ width: 800, height: 600 });
  win.loadFile('index.html');
});
