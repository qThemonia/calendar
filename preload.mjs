import { contextBridge, ipcRenderer } from 'electron';

// Create an API object to expose to renderer
const velopackApi = {
    getVersion: () => ipcRenderer.invoke("velopack:get-version"),
    checkForUpdates: () => ipcRenderer.invoke("velopack:check-for-update"),
    downloadUpdates: (updateInfo) => ipcRenderer.invoke("velopack:download-update", updateInfo),
    applyUpdates: (updateInfo) => ipcRenderer.invoke("velopack:apply-update", updateInfo)
  };
  
  // Expose this API to the renderer process
  contextBridge.exposeInMainWorld("velopackApi", velopackApi);