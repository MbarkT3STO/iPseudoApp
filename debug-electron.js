console.log('Debugging electron import...');

try {
  const electron = require('electron');
  console.log('Electron module:', electron);
  console.log('Type:', typeof electron);
  console.log('Keys:', Object.keys(electron));
} catch (e) {
  console.log('Error requiring electron:', e.message);
}

try {
  const { app } = require('electron');
  console.log('App from destructuring:', app);
  console.log('App type:', typeof app);
} catch (e) {
  console.log('Error destructuring electron:', e.message);
}
