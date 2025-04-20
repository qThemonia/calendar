import { fileURLToPath }       from 'url';
import { dirname, join }       from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import { electronReload } from 'electron-reload-esm';
import { VelopackApp }         from 'velopack';
import { passQuotes }          from './quotes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const electronPath = process.execPath;

electronReload(__dirname, {
  electron: electronPath
});

VelopackApp.build();

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    frame: true,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
    }
  });
  win.maximize();
  win.loadFile('index.html');
  win.setMenuBarVisibility(false);
  win.setAlwaysOnTop(true);
  win.show();
  win.setAlwaysOnTop(false);
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

//
// Velopack IPC handlers:
//
/* const updateUrl = update URL here */

ipcMain.handle('velopack:get-version', () => {
  try {
    const updateManager = new UpdateManager(updateUrl);
    return updateManager.getCurrentVersion();
  } catch (e) {
    return `Not Installed (${e})`;
  }
});

ipcMain.handle('velopack:check-for-update', async () => {
  const updateManager = new UpdateManager(updateUrl);
  return await updateManager.checkForUpdatesAsync();
});

ipcMain.handle('velopack:download-update', async (_event, updateInfo) => {
  const updateManager = new UpdateManager(updateUrl);
  await updateManager.downloadUpdateAsync(updateInfo);
  return true;
});

ipcMain.handle('velopack:apply-update', async (_event, updateInfo) => {
  const updateManager = new UpdateManager(updateUrl);
  await updateManager.waitExitThenApplyUpdate(updateInfo);
  app.quit();
  return true;
});