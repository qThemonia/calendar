import { passQuotes } from './quotes.js';
import { ChecklistManager } from './checklist.js';
import { CalendarManager } from './calendar.js';

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

// Initialize components
document.addEventListener('DOMContentLoaded', () => {
  // Select and display a random quote
  selectQuote();
  
  // Initialize the checklist
  const checklistManager = new ChecklistManager('checklist-container');
  
  // Initialize the calendar
  const calendarManager = new CalendarManager('calendar-container');
});