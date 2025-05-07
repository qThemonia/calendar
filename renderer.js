// Updated renderer.js with event history support
import { passQuotes } from './quotes.js';
import { ChecklistManager } from './checklist.js';
import { CalendarManager } from './calendar.js';
import { EventManager } from './events.js';
import { initTheme } from './themes.js';

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

// Centralized midnight trigger function with auto-refresh
function setupMidnightTrigger() {
  // Schedule initial update at next midnight
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const timeUntilMidnight = tomorrow.getTime() - now.getTime();
  
  console.log(`Setting up midnight trigger. Next update in ${Math.round(timeUntilMidnight / 1000 / 60)} minutes`);
  
  // Set timeout for first midnight
  setTimeout(() => {
    console.log('Midnight update triggered!');
    
    // Trigger all component updates
    triggerMidnightUpdates();
    
    // Set up daily interval for future updates
    // Using 24 hours minus 1 second to avoid potential drift
    setInterval(triggerMidnightUpdates, 24 * 60 * 60 * 1000 - 1000);
  }, timeUntilMidnight);
}

// Function to trigger all component updates
function triggerMidnightUpdates() {
  // Get references to all managers
  const checklistManager = window.appManagers?.checklistManager;
  const eventManager = window.appManagers?.eventManager;
  const calendarManager = window.appManagers?.calendarManager;
  
  console.log('Performing midnight updates for all components...');
  
  // Update checklist (reset completed items)
  if (checklistManager) {
    console.log('Updating checklist...');
    checklistManager.checkForNewDay();
    // Re-render the checklist
    checklistManager.render();
  }
  
  // Clean up past events
  if (eventManager) {
    console.log('Cleaning up events...');
    eventManager.cleanupPastEvents();
    // Re-render the events
    eventManager.render();
  }
  
  // Update calendar (highlight current day)
  if (calendarManager) {
    console.log('Updating calendar...');
    calendarManager.render();
  }
  
  // Update completion history
  if (checklistManager?.completionHistoryManager) {
    console.log('Recording completion history stats...');
    checklistManager.completionHistoryManager.recordTodaysStats();
  }
  
  // Force a global update of all UI components
  refreshAllComponents();
  
  console.log('All midnight updates completed!');
}

// New function to force refresh all components
function refreshAllComponents() {
  const checklistManager = window.appManagers?.checklistManager;
  const eventManager = window.appManagers?.eventManager;
  const calendarManager = window.appManagers?.calendarManager;
  
  // Re-render all components
  if (checklistManager) {
    checklistManager.render();
  }
  
  if (eventManager) {
    eventManager.render();
  }
  
  if (calendarManager) {
    calendarManager.render();
  }
  
  // Select a new quote for the day
  selectQuote();
  
  console.log('All components refreshed!');
}

// Initialize components
document.addEventListener('DOMContentLoaded', () => {

  // Initialize the theme system
  initTheme();

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

  // Set up a single centralized midnight trigger
  setupMidnightTrigger();

  // Check for updates
  // Uncomment when ready to use auto-updates
  // updateApp().catch(console.error);
});