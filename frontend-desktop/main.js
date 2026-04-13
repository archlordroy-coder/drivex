const { app, BrowserWindow, Tray, Menu, nativeImage } = require('electron');
const path = require('path');

let mainWindow;
let tray;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // En dev, on charge le serveur Vite
  const startUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, 'dist/index.html')}`;

  mainWindow.loadURL(startUrl);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createTray() {
  const icon = nativeImage.createEmpty(); // Remplacer par une icône réelle
  tray = new Tray(icon);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Ouvrir DriveX', click: () => mainWindow.show() },
    { label: 'Synchroniser maintenant', click: () => console.log('Syncing...') },
    { type: 'separator' },
    { label: 'Quitter', click: () => app.quit() },
  ]);
  tray.setToolTip('DriveX - Synchronisation active');
  tray.setContextMenu(contextMenu);
}

app.whenReady().then(() => {
  createWindow();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
