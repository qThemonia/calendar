// Updated EventManager class
export class EventManager {
  constructor(containerId, calendarManager) {
    this.container = document.getElementById(containerId);
    this.calendarManager = calendarManager;
    this.checklistManager = null;
    this.events = [];
    this.eventHistory = [];
    this.selectedEvent = null;
    this.eventTypes = [
      { id: 'appointment', name: 'Appointment', color: 'var(--event-type-appointment)' },
      { id: 'deadline', name: 'Deadline', color: 'var(--event-type-deadline)' },
      { id: 'meeting', name: 'Meeting', color: 'var(--event-type-meeting)' },
      { id: 'personal', name: 'Personal', color: 'var(--event-type-personal)' },
      { id: 'task', name: 'Task', color: 'var(--event-type-task)' },
      { id: 'reminder', name: 'Reminder', color: 'var(--event-type-reminder)' },
      { id: 'other', name: 'Other', color: 'var(--event-type-other)' }
    ];
    
    // Bind methods
    this.render = this.render.bind(this);
    this.createEventModal = this.createEventModal.bind(this);
    this.loadEvents = this.loadEvents.bind(this);
    this.saveEvents = this.saveEvents.bind(this);
    this.getUpcomingEvents = this.getUpcomingEvents.bind(this);
    this.getPreparationEvents = this.getPreparationEvents.bind(this);
    this.cleanupPastEvents = this.cleanupPastEvents.bind(this);
    this.saveEventHistory = this.saveEventHistory.bind(this);
    this.loadEventHistory = this.loadEventHistory.bind(this);
    this.showEventHistory = this.showEventHistory.bind(this);
    
    // Initialize
    this.loadEvents();
    this.loadEventHistory();
    this.cleanupPastEvents();
    this.createEventModal();
    this.createHistoryModal();
    
    // Subscribe to calendar selection changes
    if (this.calendarManager) {
      // Update the original onDateSelected method
      const originalSelectDay = this.calendarManager.selectDay;
      this.calendarManager.selectDay = (day) => {
        originalSelectDay.call(this.calendarManager, day);
        this.render();
      };
      
      // Also update for outside month selection
      const originalSelectOutsideMonthDay = this.calendarManager.selectOutsideMonthDay;
      this.calendarManager.selectOutsideMonthDay = (day, isPrevMonth) => {
        originalSelectOutsideMonthDay.call(this.calendarManager, day, isPrevMonth);
        this.render();
      };
    }
    
    // Listen for event-completion-changed events
    document.addEventListener('event-completion-changed', () => {
      // Trigger a re-render of any components that need to show this event
      if (this.checklistManager) {
        this.checklistManager.render();
      }
    });
    
    // Setup daily cleanup of past events
    this.setupDailyCleanup();
    
    this.render();
  }
  
  // Add method for daily cleanup
  setupDailyCleanup() {
    // Clean up past events now
    this.cleanupPastEvents();
    
    // Calculate time until next midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeUntilMidnight = tomorrow - now;
    
    // Set a timeout to run at midnight, then set interval for daily
    setTimeout(() => {
      this.cleanupPastEvents();
      // Set up daily interval (24 hours)
      setInterval(this.cleanupPastEvents, 24 * 60 * 60 * 1000);
    }, timeUntilMidnight);
  }
  
  // Add method to clean up past events
  cleanupPastEvents() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const originalLength = this.events.length;
    const expiredEvents = [];
    
    // Filter out expired events
    this.events = this.events.filter(event => {
      const eventDate = new Date(event.dueDate);
      eventDate.setHours(0, 0, 0, 0);
      
      // Keep events that are today or in the future
      const shouldKeep = eventDate >= today;
      
      // If the event is in the past, add it to expired events
      if (!shouldKeep) {
        expiredEvents.push({
          ...event,
          expiredAt: new Date().toISOString() // Add timestamp when it was moved to history
        });
      }
      
      return shouldKeep;
    });
    
    // Add expired events to history
    if (expiredEvents.length > 0) {
      this.eventHistory = [...expiredEvents, ...this.eventHistory];
      this.saveEventHistory();
      console.log(`Moved ${expiredEvents.length} expired events to history`);
    }
    
    if (this.events.length < originalLength) {
      console.log(`Removed ${originalLength - this.events.length} past events`);
      this.saveEvents();
    }
  }
  
  loadEvents() {
    const savedEvents = localStorage.getItem('event-items');
    if (savedEvents) {
      try {
        this.events = JSON.parse(savedEvents);
        
        // Convert string dates back to Date objects
        this.events.forEach(event => {
          event.dueDate = new Date(event.dueDate);
        });
      } catch (e) {
        console.error('Error loading events', e);
        this.events = [];
      }
    }
  }
  
  saveEvents() {
    localStorage.setItem('event-items', JSON.stringify(this.events));
  }

  loadEventHistory() {
    const savedHistory = localStorage.getItem('event-history');
    if (savedHistory) {
      try {
        this.eventHistory = JSON.parse(savedHistory);
        
        // Convert string dates back to Date objects
        this.eventHistory.forEach(event => {
          event.dueDate = new Date(event.dueDate);
          if (event.expiredAt) {
            event.expiredAt = new Date(event.expiredAt);
          }
        });
      } catch (e) {
        console.error('Error loading event history', e);
        this.eventHistory = [];
      }
    }
  }
  
  // New method to save event history
  saveEventHistory() {
    // Limit history to 100 most recent events to prevent localStorage from growing too large
    const limitedHistory = this.eventHistory.slice(0, 100);
    localStorage.setItem('event-history', JSON.stringify(limitedHistory));
  }
  
  createEventModal() {
    // Create modal overlay
    this.modalOverlay = document.createElement('div');
    this.modalOverlay.className = 'modal-overlay';
    document.body.appendChild(this.modalOverlay);
    
    // Create modal content
    const eventModal = document.createElement('div');
    eventModal.className = 'event-modal';
    
    // Modal header
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    
    const modalTitle = document.createElement('h3');
    modalTitle.textContent = 'Create New Event';
    modalTitle.id = 'event-modal-title';
    
    const closeButton = document.createElement('button');
    closeButton.className = 'modal-close';
    closeButton.textContent = '×';
    closeButton.addEventListener('click', () => this.closeModal());
    
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeButton);
    
    // Modal body / form
    const modalForm = document.createElement('form');
    modalForm.id = 'event-form';
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.submitEventForm();
    });
    
    // Event name input
    const nameGroup = document.createElement('div');
    nameGroup.className = 'form-group';
    
    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Event Title';
    nameLabel.setAttribute('for', 'event-title');
    
    this.eventTitleInput = document.createElement('input');
    this.eventTitleInput.type = 'text';
    this.eventTitleInput.id = 'event-title';
    this.eventTitleInput.placeholder = 'Enter event title';
    this.eventTitleInput.required = true;
    
    nameGroup.appendChild(nameLabel);
    nameGroup.appendChild(this.eventTitleInput);
    
    // Event type selection
    const typeGroup = document.createElement('div');
    typeGroup.className = 'form-group';
    
    const typeLabel = document.createElement('label');
    typeLabel.textContent = 'Event Type';
    typeLabel.setAttribute('for', 'event-type');
    
    this.eventTypeSelect = document.createElement('select');
    this.eventTypeSelect.id = 'event-type';
    this.eventTypeSelect.required = true;
    
    // Add options for event types
    this.eventTypes.forEach(type => {
      const option = document.createElement('option');
      option.value = type.id;
      option.textContent = type.name;
      option.style.backgroundColor = type.color;
      this.eventTypeSelect.appendChild(option);
    });
    
    typeGroup.appendChild(typeLabel);
    typeGroup.appendChild(this.eventTypeSelect);
    
    // Due date input
    const dateGroup = document.createElement('div');
    dateGroup.className = 'form-group';
    
    const dateLabel = document.createElement('label');
    dateLabel.textContent = 'Due Date';
    dateLabel.setAttribute('for', 'event-date');
    
    this.eventDateInput = document.createElement('input');
    this.eventDateInput.type = 'date';
    this.eventDateInput.id = 'event-date';
    this.eventDateInput.required = true;
    
    // Set default value to current selected date in calendar
    if (this.calendarManager && this.calendarManager.getSelectedDate()) {
      const selectedDate = this.calendarManager.getSelectedDate();
      const formattedDate = this.formatDateForInput(selectedDate);
      this.eventDateInput.value = formattedDate;
    } else {
      // Default to today's date
      const today = new Date();
      const formattedDate = this.formatDateForInput(today);
      this.eventDateInput.value = formattedDate;
    }
    
    dateGroup.appendChild(dateLabel);
    dateGroup.appendChild(this.eventDateInput);
    
    // Days of Notice input with info tooltip
    const noticeGroup = document.createElement('div');
    noticeGroup.className = 'form-group';
    noticeGroup.classList.add('notice-group');
    const detailsRow = document.createElement('div');
    detailsRow.className = 'form-row';

    // Add all three groups to the row
    detailsRow.appendChild(typeGroup);
    detailsRow.appendChild(dateGroup);
    detailsRow.appendChild(noticeGroup);

    const noticeLabel = document.createElement('label');
    noticeLabel.textContent = 'Days of Notice';
    noticeLabel.setAttribute('for', 'event-notice-days');
    
    // Create container for input and tooltip
    const noticeInputContainer = document.createElement('div');
    noticeInputContainer.className = 'notice-input-container';
    
    this.eventNoticeDaysInput = document.createElement('input');
    this.eventNoticeDaysInput.type = 'number';
    this.eventNoticeDaysInput.id = 'event-notice-days';
    this.eventNoticeDaysInput.min = '0';
    this.eventNoticeDaysInput.max = '60';
    this.eventNoticeDaysInput.value = '0';
    this.eventNoticeDaysInput.required = true;
    
    // Create info tooltip
    const infoTooltip = document.createElement('div');
    infoTooltip.className = 'info-tooltip';
    
    const infoIcon = document.createElement('div');
    infoIcon.className = 'info-icon';
    infoIcon.textContent = 'i';
    
    const tooltipText = document.createElement('span');
    tooltipText.className = 'tooltip-text';
    tooltipText.textContent = 'Number of days before the due date that you want to be notified. Events within the notice period will appear in your Daily Checklist.';
    
    infoTooltip.appendChild(infoIcon);
    infoTooltip.appendChild(tooltipText);
    
    noticeInputContainer.appendChild(this.eventNoticeDaysInput);
    noticeInputContainer.appendChild(infoTooltip);
    
    noticeGroup.appendChild(noticeLabel);
    noticeGroup.appendChild(noticeInputContainer);
    
    // Description textarea
    const descGroup = document.createElement('div');
    descGroup.className = 'form-group';
    
    const descLabel = document.createElement('label');
    descLabel.textContent = 'Description';
    descLabel.setAttribute('for', 'event-description');
    
    this.eventDescInput = document.createElement('textarea');
    this.eventDescInput.id = 'event-description';
    this.eventDescInput.placeholder = 'Enter event details';
    
    descGroup.appendChild(descLabel);
    descGroup.appendChild(this.eventDescInput);
    
    // Modal footer / actions
    const modalActions = document.createElement('div');
    modalActions.className = 'modal-actions';
    
    // Delete button (hidden for new events)
    this.deleteEventButton = document.createElement('button');
    this.deleteEventButton.textContent = 'Delete Event';
    this.deleteEventButton.className = 'btn-delete';
    this.deleteEventButton.type = 'button';
    this.deleteEventButton.style.display = 'none';
    this.deleteEventButton.addEventListener('click', () => this.deleteSelectedEvent());
    
    // Cancel button
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.className = 'btn-cancel';
    cancelButton.type = 'button';
    cancelButton.addEventListener('click', () => this.closeModal());
    
    // Submit button
    const addButton = document.createElement('button');
    addButton.textContent = 'Add Event';
    addButton.id = 'event-submit-btn';
    addButton.className = 'btn-add';
    addButton.type = 'submit';
    
    modalActions.appendChild(this.deleteEventButton);
    modalActions.appendChild(cancelButton);
    modalActions.appendChild(addButton);
    
    // Build the form
    modalForm.appendChild(nameGroup);
    modalForm.appendChild(detailsRow);
    modalForm.appendChild(descGroup);
    modalForm.appendChild(modalActions);
    
    // Build the modal
    eventModal.appendChild(modalHeader);
    eventModal.appendChild(modalForm);
    
    this.modalOverlay.appendChild(eventModal);
    
    // Close modal when clicking outside
    this.modalOverlay.addEventListener('click', (e) => {
      if (e.target === this.modalOverlay) {
        this.closeModal();
      }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modalOverlay.classList.contains('active')) {
        this.closeModal();
      }
    });
  }
  // Create event history modal
createHistoryModal() {
  // Create modal overlay
  this.historyModalOverlay = document.createElement('div');
  this.historyModalOverlay.className = 'modal-overlay';
  document.body.appendChild(this.historyModalOverlay);
  
  // Create modal content
  const historyModal = document.createElement('div');
  historyModal.className = 'event-modal history-modal';
  
  // Modal header
  const modalHeader = document.createElement('div');
  modalHeader.className = 'modal-header';
  
  const modalTitle = document.createElement('h3');
  modalTitle.textContent = 'Event History';
  
  const closeButton = document.createElement('button');
  closeButton.className = 'modal-close';
  closeButton.textContent = '×';
  closeButton.addEventListener('click', () => this.closeHistoryModal());
  
  modalHeader.appendChild(modalTitle);
  modalHeader.appendChild(closeButton);
  
  // Modal body
  this.historyContainer = document.createElement('div');
  this.historyContainer.className = 'history-container';
  
  // Build the modal
  historyModal.appendChild(modalHeader);
  historyModal.appendChild(this.historyContainer);
  
  this.historyModalOverlay.appendChild(historyModal);
  
  // Close modal when clicking outside
  this.historyModalOverlay.addEventListener('click', (e) => {
    if (e.target === this.historyModalOverlay) {
      this.closeHistoryModal();
    }
  });
  
  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && this.historyModalOverlay.classList.contains('active')) {
      this.closeHistoryModal();
    }
  });
}

// Show event history modal
showEventHistory() {
  // Clear the container
  this.historyContainer.innerHTML = '';
  
  // Group events by month
  const groupedEvents = this.groupEventsByMonth(this.eventHistory);
  
  // If no events, show a message
  if (this.eventHistory.length === 0) {
    const noEventsMsg = document.createElement('div');
    noEventsMsg.className = 'no-events-message';
    noEventsMsg.textContent = 'No event history available';
    this.historyContainer.appendChild(noEventsMsg);
  } else {
    // Create a list for each month
    for (const [monthKey, events] of Object.entries(groupedEvents)) {
      const monthHeader = document.createElement('div');
      monthHeader.className = 'history-month-header';
      monthHeader.textContent = monthKey;
      this.historyContainer.appendChild(monthHeader);
      
      const eventsList = document.createElement('div');
      eventsList.className = 'history-events-list';
      
      events.forEach(event => {
        const eventItem = this.createHistoryEventItem(event);
        eventsList.appendChild(eventItem);
      });
      
      this.historyContainer.appendChild(eventsList);
    }
  }
  
  // Show modal
  this.historyModalOverlay.classList.add('active');
}

// Group events by month for better organization
groupEventsByMonth(events) {
  const grouped = {};
  
  events.forEach(event => {
    const date = new Date(event.dueDate);
    const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    if (!grouped[monthYear]) {
      grouped[monthYear] = [];
    }
    
    grouped[monthYear].push(event);
  });
  
  // Sort events within each month by date
  for (const month in grouped) {
    grouped[month].sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
  }
  
  return grouped;
}

// Create an event item for the history list
createHistoryEventItem(event) {
  const eventItem = document.createElement('div');
  eventItem.className = 'history-event-item';
  
  // Get event type info for color and name
  const typeInfo = this.getEventTypeInfo(event.type);
  
  // Set the event type color
  eventItem.style.borderLeftColor = typeInfo.color;
  
  // Create event content wrapper
  const contentDiv = document.createElement('div');
  contentDiv.className = 'history-event-content';
  
  // Event title
  const title = document.createElement('div');
  title.className = 'history-event-title';
  title.textContent = event.title;
  
  // Event details
  const details = document.createElement('div');
  details.className = 'history-event-details';
  
  const typeSpan = document.createElement('span');
  typeSpan.className = 'event-type';
  typeSpan.textContent = typeInfo.name;
  typeSpan.style.backgroundColor = typeInfo.color;
  
  const dateInfo = document.createElement('span');
  dateInfo.className = 'history-event-date';
  dateInfo.textContent = this.formatDate(event.dueDate);
  
  // Completion status
  const statusSpan = document.createElement('span');
  statusSpan.className = `history-event-status ${event.completed ? 'completed' : 'missed'}`;
  statusSpan.textContent = event.completed ? 'Completed' : 'Missed';
  
  details.appendChild(typeSpan);
  details.appendChild(dateInfo);
  details.appendChild(statusSpan);
  
  contentDiv.appendChild(title);
  contentDiv.appendChild(details);
  
  // Add elements to event item
  eventItem.appendChild(contentDiv);
  
  return eventItem;
}

// Close history modal
closeHistoryModal() {
  this.historyModalOverlay.classList.remove('active');
}

  formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  openModal(editEventId = null, callback = null) {
    // Store the callback
    this.modalCallback = callback;
    
    // Reset form
    document.getElementById('event-form').reset();
    
    const modalTitle = document.getElementById('event-modal-title');
    const submitBtn = document.getElementById('event-submit-btn');
    
    if (editEventId) {
      // Edit existing event
      modalTitle.textContent = 'Edit Event';
      submitBtn.textContent = 'Update Event';
      this.selectedEvent = this.events.find(event => event.id === editEventId);
      
      if (this.selectedEvent) {
        // Fill the form with event data
        this.eventTitleInput.value = this.selectedEvent.title;
        this.eventTypeSelect.value = this.selectedEvent.type;
        this.eventDateInput.value = this.formatDateForInput(this.selectedEvent.dueDate);
        this.eventNoticeDaysInput.value = this.selectedEvent.noticeDays || this.selectedEvent.prepDays || 0;
        this.eventDescInput.value = this.selectedEvent.description || '';
        
        // Show delete button
        this.deleteEventButton.style.display = 'block';
      }
    } else {
      // New event
      modalTitle.textContent = 'Create New Event';
      submitBtn.textContent = 'Add Event';
      this.selectedEvent = null;
      
      // Hide delete button
      this.deleteEventButton.style.display = 'none';
      
      // Set date to currently selected date in calendar
      if (this.calendarManager && this.calendarManager.getSelectedDate()) {
        const selectedDate = this.calendarManager.getSelectedDate();
        const formattedDate = this.formatDateForInput(selectedDate);
        this.eventDateInput.value = formattedDate;
      }
    }
    
    this.modalOverlay.classList.add('active');
    this.eventTitleInput.focus();
    
    this.deleteEventButton.addEventListener('click', () => this.deleteSelectedEvent(this.modalCallback));
    // Update the form submission
    const modalForm = document.getElementById('event-form');
    modalForm.onsubmit = (e) => {
      e.preventDefault();
      this.submitEventForm(this.modalCallback);
    };
  }
  
  closeModal() {
    this.modalOverlay.classList.remove('active');
    this.selectedEvent = null;
  }
  
  submitEventForm(callback) {
    const title = this.eventTitleInput.value.trim();
    const type = this.eventTypeSelect.value;
    
    // Fix for date offset issue - parse the date properly
    const dateInput = this.eventDateInput.value; // Format: YYYY-MM-DD
    
    // Create date without timezone offset issues
    // Split the date string and create a date using local timezone at noon
    const [year, month, day] = dateInput.split('-').map(num => parseInt(num, 10));
    const dueDate = new Date(year, month - 1, day, 12, 0, 0); // Set to noon to avoid any timezone issues
    
    const noticeDays = parseInt(this.eventNoticeDaysInput.value, 10);
    const description = this.eventDescInput.value.trim();
    
    if (title && type && !isNaN(dueDate.getTime())) {
      // Add duplicate check only for new events (not when editing)
      if (!this.selectedEvent) {
        // Check for duplicate events with same title on same date
        const hasDuplicate = this.events.some(event => {
          const eventDate = new Date(event.dueDate);
          return (
            eventDate.getFullYear() === dueDate.getFullYear() &&
            eventDate.getMonth() === dueDate.getMonth() &&
            eventDate.getDate() === dueDate.getDate() &&
            event.title === title
          );
        });
        
        if (hasDuplicate) {
          console.log('Duplicate event detected - not adding');
          this.closeModal();
          return; // Don't proceed with adding
        }
      }
      
      if (this.selectedEvent) {
        // Update existing event
        this.selectedEvent.title = title;
        this.selectedEvent.type = type;
        this.selectedEvent.dueDate = dueDate;
        this.selectedEvent.noticeDays = noticeDays;
        this.selectedEvent.description = description;
      } else {
        // Create new event
        const newEvent = {
          id: Date.now().toString(),
          title: title,
          type: type,
          dueDate: dueDate,
          noticeDays: noticeDays,
          description: description,
          completed: false,
          createdAt: new Date().toISOString()
        };
        
        this.events.push(newEvent);
      }
      
      this.saveEvents();
      this.closeModal();
      this.render();
      this.checklistManager.render();
      this.calendarManager.render();
  
      // Call the callback if provided
      if (typeof callback === 'function') {
        callback();
      }
    }
  }
  
  deleteSelectedEvent(callback) {
    if (this.selectedEvent) {
      this.events = this.events.filter(event => event.id !== this.selectedEvent.id);
      this.saveEvents();
      this.closeModal();
      this.render();
      this.checklistManager.render();
      this.calendarManager.render();
      
      // Call the callback if provided
      if (typeof callback === 'function') {
        callback();
      }
    }
  }
  
  getEventTypeInfo(typeId) {
    return this.eventTypes.find(type => type.id === typeId) || this.eventTypes[6]; // Default to 'Other'
  }
  cleanupPastEvents() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const originalLength = this.events.length;
    
    this.events = this.events.filter(event => {
      const eventDate = new Date(event.dueDate);
      eventDate.setHours(0, 0, 0, 0);
      
      return eventDate >= today || !event.completed;
    });
    
    if (this.events.length < originalLength) {
      console.log(`Removed ${originalLength - this.events.length} past completed events`);
      this.saveEvents();
    }
  }
  
  toggleEventCompletion(id) {
    const event = this.events.find(event => event.id === id);
    if (event) {
      event.completed = !event.completed;
      this.saveEvents();
      this.render();
      
      // Update the checklist as well if we have a reference to it
      // Since we don't have a direct reference, we need to dispatch a custom event
      document.dispatchEvent(new CustomEvent('event-completion-changed', {
        detail: { eventId: id, isCompleted: event.completed }
      }));
    }
  }
  
  getUpcomingEvents(selectedDate) {
    // If no date is provided, use today
    const targetDate = selectedDate || new Date();
    
    // Compare only year, month, day
    return this.events.filter(event => {
      const dueDate = new Date(event.dueDate);
      return dueDate.getFullYear() === targetDate.getFullYear() && 
             dueDate.getMonth() === targetDate.getMonth() && 
             dueDate.getDate() === targetDate.getDate();
    }).sort((a, b) => a.dueDate - b.dueDate);
  }
  
  getPreparationEvents() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return this.events.filter(event => {
      if (event.completed) return false;
      
      const dueDate = new Date(event.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      
      // Use noticeDays if available, fallback to prepDays for backward compatibility
      const noticeDays = event.noticeDays !== undefined ? event.noticeDays : (event.prepDays || 0);
      
      // Calculate days until due date
      const timeDiff = dueDate.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      // Include the event if days until due date is less than or equal to notice days
      // AND the due date is still in the future (or today)
      return daysDiff <= noticeDays && daysDiff >= 0;
    }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }
  
  formatDate(date) {
    // Format the date for display
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }
  
  getDaysUntil(targetDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);
    
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    return `In ${diffDays} days`;
  }
  
  render() {
    // Clear container
    this.container.innerHTML = '';
    
    // Create header
    const header = document.createElement('div');
    header.className = 'event-header';
    
    const title = document.createElement('h2');
    
    // Show events for the selected date
    let selectedDate = null;
    if (this.calendarManager) {
      selectedDate = this.calendarManager.getSelectedDate();
      if (selectedDate) {
        title.textContent = `Events for ${this.formatDate(selectedDate)}`;
      } else {
        title.textContent = 'Today\'s Events';
        selectedDate = new Date(); // Default to today
      }
    } else {
      title.textContent = 'Today\'s Events';
      selectedDate = new Date(); // Default to today
    }
    
    const addButton = document.createElement('button');
    addButton.textContent = '+ New Event';
    addButton.className = 'add-button';
    addButton.addEventListener('click', () => this.openModal());
    
    header.appendChild(title);
    header.appendChild(addButton);
    this.container.appendChild(header);
    
    // Get upcoming events for the selected date
    const upcomingEvents = this.getUpcomingEvents(selectedDate);
    
    // If no events, show a message
    if (upcomingEvents.length === 0) {
      const noEventsMsg = document.createElement('div');
      noEventsMsg.className = 'no-events-message';
      const formattedDate = this.formatDate(selectedDate);
      noEventsMsg.textContent = `No events scheduled for ${formattedDate}`;
      this.container.appendChild(noEventsMsg);
    } else {
      // Create events list
      const eventsList = document.createElement('div');
      eventsList.className = 'events-list';
      
      upcomingEvents.forEach(event => {
        const eventItem = this.createEventItem(event);
        eventsList.appendChild(eventItem);
      });
      
      this.container.appendChild(eventsList);
    }
  }
  
  createEventItem(event, isPrepEvent = false) {
    const eventItem = document.createElement('div');
    eventItem.className = `event-item ${event.completed ? 'completed' : ''}`;
    eventItem.dataset.id = event.id;
    
    // Get event type info for color and name
    const typeInfo = this.getEventTypeInfo(event.type);
    
    // Set the event type color
    eventItem.style.borderLeftColor = typeInfo.color;
    
    // Create event content wrapper
    const contentDiv = document.createElement('div');
    contentDiv.className = 'event-content';
    
    // Event title
    const title = document.createElement('div');
    title.className = 'event-title';
    title.textContent = event.title;
    
    // Event details
    const details = document.createElement('div');
    details.className = 'event-details';
    
    const typeSpan = document.createElement('span');
    typeSpan.className = 'event-type';
    typeSpan.textContent = typeInfo.name;
    typeSpan.style.backgroundColor = typeInfo.color;
    
    const dateInfo = document.createElement('span');
    dateInfo.className = 'event-date-info';
    
    if (isPrepEvent) {
      // For prep events, show the due date and days until due
      dateInfo.textContent = `Due: ${this.formatDate(event.dueDate)} (${this.getDaysUntil(event.dueDate)})`;
    } else {
      dateInfo.textContent = this.formatDate(event.dueDate);
    }
    
    details.appendChild(typeSpan);
    details.appendChild(dateInfo);
    
    // Add description if available
    if (event.description) {
      const desc = document.createElement('div');
      desc.className = 'event-description';
      desc.textContent = event.description;
      contentDiv.appendChild(title);
      contentDiv.appendChild(details);
      contentDiv.appendChild(desc);
    } else {
      contentDiv.appendChild(title);
      contentDiv.appendChild(details);
    }
    
    // Create action buttons
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'event-actions';
    
    // Complete/uncomplete button
    const completeButton = document.createElement('button');
    completeButton.className = 'event-action-btn complete-btn';
    completeButton.innerHTML = event.completed ? '↩' : '✓';
    completeButton.title = event.completed ? 'Mark as incomplete' : 'Mark as complete';
    completeButton.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleEventCompletion(event.id);
    });
    
    // Edit button
    const editButton = document.createElement('button');
    editButton.className = 'event-action-btn edit-btn';
    editButton.innerHTML = '✎';
    editButton.title = 'Edit event';
    editButton.addEventListener('click', (e) => {
      e.stopPropagation();
      this.openModal(event.id);
    });
    
    actionsDiv.appendChild(completeButton);
    actionsDiv.appendChild(editButton);
    
    // Add elements to event item
    eventItem.appendChild(contentDiv);
    eventItem.appendChild(actionsDiv);
    
    // Add click event to toggle completion
    eventItem.addEventListener('click', () => {
      this.openModal(event.id);
    });
    
    return eventItem;
  }
}