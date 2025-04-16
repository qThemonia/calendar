const { app, BrowserWindow, ipcMain } = require('electron/main');
const { VelopackApp } = require('velopack');
const path = require('node:path');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('index.html');
};

VelopackApp.build();
ipcMain.handle("velopack:get-version", () => {
  try {
    const updateManager = new UpdateManager(updateUrl);
    return updateManager.getCurrentVersion();
  } catch (e) {
    return `Not Installed (${e})`;
  }
});

ipcMain.handle("velopack:check-for-update", async () => {
  const updateManager = new UpdateManager(updateUrl);
  return await updateManager.checkForUpdatesAsync();
});

ipcMain.handle("velopack:download-update", async (_, updateInfo) => {
  const updateManager = new UpdateManager(updateUrl);
  await updateManager.downloadUpdateAsync(updateInfo);
  return true;
});

ipcMain.handle("velopack:apply-update", async (_, updateInfo) => {
  const updateManager = new UpdateManager(updateUrl);
  await updateManager.waitExitThenApplyUpdate(updateInfo);
  app.quit();
  return true;
});

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
    app.quit()
  };
});