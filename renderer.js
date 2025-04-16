const information = document.getElementById('info');
information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`;

async function updateApp() {
    // Check for new version
    const updateInfo = await window.velopackApi.checkForUpdates();
    if (!updateInfo) {
      return; // No updates available
    }
    
    // Download new version
    await window.velopackApi.downloadUpdates(updateInfo);
    
    // Install new version and restart app
    await window.velopackApi.applyUpdates(updateInfo);
  }