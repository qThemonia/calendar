import { passQuotes } from './quotes.js';

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

function selectQuote(){
  let quoteString = passQuotes();
  document.getElementById("displayed-quote").innerHTML = quoteString;
}

selectQuote();