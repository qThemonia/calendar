// Updated renderer.js with event history support
import { passQuotes } from './quotes.js';
import { ChecklistManager } from './checklist.js';
import { CalendarManager } from './calendar.js';
import { EventManager } from './events.js';


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
function initDragAndDrop() {
  // This will be called after components are initialized
  // It simply ensures that any existing events become draggable
  
  document.querySelectorAll('.event-item').forEach(event => {
    if (!event.hasAttribute('draggable')) {
      event.setAttribute('draggable', true);
      
      event.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', event.dataset.id);
        event.classList.add('dragging');
      });
      
      event.addEventListener('dragend', () => {
        event.classList.remove('dragging');
      });
    }
  });
}

// Initialize components
document.addEventListener('DOMContentLoaded', () => {
  // Select and display a random quote
  selectQuote();
  
  // Initialize the calendar first (without event manager)
  const calendarManager = new CalendarManager('calendar-container');
  
  // Initialize the event manager with a reference to the calendar
  const eventManager = new EventManager('event-container', calendarManager);
  
  // Now connect the event manager to the calendar
  calendarManager.setEventManager(eventManager);
  
  // Initialize the checklist with a reference to the event manager
  const checklistManager = new ChecklistManager('checklist-container', eventManager);
  
  // Connect event manager to checklist for updates
  eventManager.checklistManager = checklistManager;
  setTimeout(initDragAndDrop, 1000);

  // Check for updates
  // Uncomment when ready to use auto-updates
  // updateApp().catch(console.error);
});