// calendar.js
export class CalendarManager {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
      this.eventManager = null;
      this.currentDate = new Date();
      this.currentMonth = this.currentDate.getMonth();
      this.currentYear = this.currentDate.getFullYear();
      this.selectedDay = this.currentDate.getDate();
      
      // Create a full date object to track the selected date across months
      this.selectedDate = new Date(this.currentYear, this.currentMonth, this.selectedDay);
      
      // Bind methods to preserve 'this' context
      this.navigateMonth = this.navigateMonth.bind(this);
      
      this.render();
      this.setupEventListeners();
    }
    setEventManager(eventManager) {
      this.eventManager = eventManager;
      this.render(); // Re-render to show event indicators
      this.createHistoryButton();
    }
    createHistoryButton() {
      this.historyButtonContainer = document.getElementById('history-button-container');
      // Clear the container first
      this.historyButtonContainer.innerHTML = '';
      
      // Create the history button
      const historyButton = document.createElement('button');
      historyButton.className = 'history-button';
      historyButton.textContent = 'View Event History';
      historyButton.addEventListener('click', () => {
        if (this.eventManager) {
          this.eventManager.showEventHistory();
        }
      });
      
      this.historyButtonContainer.appendChild(historyButton);
    }
    setupEventListeners() {
      // Find buttons by class within our specific container
      const prevButton = this.container.querySelector('.prev-month-btn');
      const nextButton = this.container.querySelector('.next-month-btn');
      
      // Remove existing event listeners to prevent duplicates
      if (prevButton) {
        const newPrevButton = prevButton.cloneNode(true);
        prevButton.parentNode.replaceChild(newPrevButton, prevButton);
        newPrevButton.addEventListener('click', () => {
          this.navigateMonth(-1);
        });
      }
      
      if (nextButton) {
        const newNextButton = nextButton.cloneNode(true);
        nextButton.parentNode.replaceChild(newNextButton, nextButton);
        newNextButton.addEventListener('click', () => {
          this.navigateMonth(1);
        });
      }
    }
    
    navigateMonth(direction) {
      this.currentMonth += direction;
      
      if (this.currentMonth > 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else if (this.currentMonth < 0) {
        this.currentMonth = 11;
        this.currentYear--;
      }
      
      if (this.selectedDate) {
        if (this.selectedDate.getMonth() === this.currentMonth && 
            this.selectedDate.getFullYear() === this.currentYear) {
          this.selectedDay = this.selectedDate.getDate();
        } else {
          this.selectedDay = 0;
        }
      }
      
      this.render();
    }
    
    getDaysInMonth(year, month) {
      return new Date(year, month + 1, 0).getDate();
    }
    
    getFirstDayOfMonth(year, month) {
      return new Date(year, month, 1).getDay();
    }
    
    getMonthName(month) {
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      return monthNames[month];
    }
    
    isCurrentDay(day) {
      const today = new Date();
      return day === today.getDate() && 
             this.currentMonth === today.getMonth() && 
             this.currentYear === today.getFullYear();
    }
    
    // Allow day selection within the current month view
    isSelectedDay(day) {
      // Only highlight selected days within the current month view
      // Don't highlight any days from previous/next months
      return day === this.selectedDay && 
             this.currentMonth === this.currentMonth && 
             this.currentYear === this.currentYear;
    }
    
    selectDay(day) {
      this.selectedDay = day;
      
      // Update the full selected date object when a day is selected
      this.selectedDate = new Date(this.currentYear, this.currentMonth, day);
      
      this.render();
      
      // Log the full selected date for debugging
      console.log(`Selected date: ${this.selectedDate.toDateString()}`);
      
      // This is where you would trigger an event or callback
      // that could be used to display tasks for this date in the rightmost panel
    }
    
    // Method to get the full selected date
    getSelectedDate() {
      return this.selectedDate;
    }
    
    // Method to handle selecting days from previous/next months
    selectOutsideMonthDay(day, isPrevMonth) {
      if (isPrevMonth) {
        // Calculate previous month and year
        let prevMonth = this.currentMonth - 1;
        let prevYear = this.currentYear;
        
        if (prevMonth < 0) {
          prevMonth = 11;
          prevYear--;
        }
        
        // Update the selected date
        this.selectedDate = new Date(prevYear, prevMonth, day);
        
        // Navigate to previous month
        this.navigateMonth(-1);
      } else {
        // Calculate next month and year
        let nextMonth = this.currentMonth + 1;
        let nextYear = this.currentYear;
        
        if (nextMonth > 11) {
          nextMonth = 0;
          nextYear++;
        }
        
        // Update the selected date
        this.selectedDate = new Date(nextYear, nextMonth, day);
        
        // Navigate to next month
        this.navigateMonth(1);
      }
    }

    getEventsForDay(year, month, day) {
      // If we don't have a reference to the event manager, return empty array
      if (!this.eventManager) return [];
      
      // Create target date at midnight for correct comparison
      const targetDate = new Date(year, month, day);
      targetDate.setHours(0, 0, 0, 0);
      
      return this.eventManager.events.filter(event => {
        // Create a new date object from the event's due date
        const eventDate = new Date(event.dueDate);
        
        // Set to midnight for comparison
        eventDate.setHours(0, 0, 0, 0);
        
        // Compare dates using time value for accuracy
        return eventDate.getTime() === targetDate.getTime();
      });
    }

    getCalendarColor(eventTypeColor) {
      // Map event colors to calendar colors using CSS variables
      const colorMap = {
        'var(--event-type-appointment)': 'var(--calendar-red)',
        'var(--event-type-deadline)': 'var(--calendar-pink)',
        'var(--event-type-meeting)': 'var(--calendar-purple)',
        'var(--event-type-personal)': 'var(--calendar-blue)',
        'var(--event-type-task)': 'var(--calendar-green)',
        'var(--event-type-reminder)': 'var(--calendar-yellow)',
        'var(--event-type-other)': 'var(--calendar-orange)'
      };
      
      return colorMap[eventTypeColor] || eventTypeColor;
    }

    render() {
      // Clear container
      this.container.innerHTML = '';
      
      // Create header with navigation
      const header = document.createElement('div');
      header.className = 'calendar-header';
      
      const prevButton = document.createElement('button');
      prevButton.className = 'nav-button prev-month-btn'; // Added specific class
      prevButton.innerHTML = '&laquo;';
      
      const title = document.createElement('h2');
      title.textContent = `${this.getMonthName(this.currentMonth)} ${this.currentYear}`;
      
      const nextButton = document.createElement('button');
      nextButton.className = 'nav-button next-month-btn'; // Added specific class
      nextButton.innerHTML = '&raquo;';
      
      header.appendChild(prevButton);
      header.appendChild(title);
      header.appendChild(nextButton);
      
      this.container.appendChild(header);
      
      // Create days of week header
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const weekdaysRow = document.createElement('div');
      weekdaysRow.className = 'weekdays';
      
      daysOfWeek.forEach(day => {
        const dayElem = document.createElement('div');
        dayElem.className = 'weekday';
        dayElem.textContent = day;
        weekdaysRow.appendChild(dayElem);
      });
      
      this.container.appendChild(weekdaysRow);
      
      // Create calendar grid
      const calendarGrid = document.createElement('div');
      calendarGrid.className = 'calendar-grid';
      
      // Calculate days and offset
      const daysInMonth = this.getDaysInMonth(this.currentYear, this.currentMonth);
      const firstDayOfMonth = this.getFirstDayOfMonth(this.currentYear, this.currentMonth);
      
      // Previous month days
      const prevMonthDays = this.getDaysInMonth(
        this.currentMonth === 0 ? this.currentYear - 1 : this.currentYear,
        this.currentMonth === 0 ? 11 : this.currentMonth - 1
      );
      
      // Add previous month days
      for (let i = 0; i < firstDayOfMonth; i++) {
        const dayElem = document.createElement('div');
        dayElem.className = 'day-ring prev-month';
        
        const prevMonthDay = prevMonthDays - firstDayOfMonth + i + 1;
        
        const dayNumber = document.createElement('span');
        dayNumber.textContent = prevMonthDay;
        dayElem.appendChild(dayNumber);
        
        // Make previous month days selectable
        dayElem.addEventListener('click', () => {
          this.selectOutsideMonthDay(prevMonthDay, true);
        });
        
        calendarGrid.appendChild(dayElem);
      }
      
      // Add current month days
      for (let day = 1; day <= daysInMonth; day++) {
        const dayElem = document.createElement('div');
        dayElem.className = 'day-ring';
        
        if (this.isCurrentDay(day)) {
          dayElem.classList.add('current-day');
        }
        
        // Add selected day highlight back
        if (this.isSelectedDay(day)) {
          dayElem.classList.add('selected-day');
        }
        
        // Check if this day has events
        const events = this.getEventsForDay(this.currentYear, this.currentMonth, day);
      
        if (events.length > 0) {
          const eventTypes = events.map(event => event.type);

          // Apply the appropriate coloring based on number of unique event types
          if (eventTypes.length === 1) {
            const eventType = this.eventManager.getEventTypeInfo(eventTypes[0]);
            // Get the mapped bolder color
            const calendarColor = this.getCalendarColor(eventType.color);
            dayElem.style.backgroundColor = calendarColor;
          } 
          // For multiple event types
          else if (eventTypes.length > 1) {
            const sliceSize = 360 / eventTypes.length;
            let gradientString = '';
            
            eventTypes.forEach((type, index) => {
              const eventType = this.eventManager.getEventTypeInfo(type);
              // Get the mapped bolder color
              const calendarColor = this.getCalendarColor(eventType.color);
              
              const startAngle = index * sliceSize;
              const endAngle = (index + 1) * sliceSize;
              
              gradientString += `${calendarColor} ${startAngle}deg, `;
              gradientString += `${calendarColor} ${endAngle}deg${index < eventTypes.length - 1 ? ', ' : ''}`;
            });
            
            dayElem.style.background = `conic-gradient(${gradientString})`;
            dayElem.style.backgroundSize = "105% 105%";
            dayElem.style.backgroundPosition = "center";
          }
          
          // Add a class to indicate this day has events
          dayElem.classList.add('has-events');
        }
        
        const dayNumber = document.createElement('span');
        dayNumber.textContent = day;
        dayElem.appendChild(dayNumber);
        
        // Add click event
        dayElem.addEventListener('click', () => {
          this.selectDay(day);
        });
        
        calendarGrid.appendChild(dayElem);
      }
      
      // Calculate how many next month days to show
      const totalCells = Math.ceil((daysInMonth + firstDayOfMonth) / 7) * 7;
      const nextMonthDays = totalCells - daysInMonth - firstDayOfMonth;
      
      // Add next month days
      for (let day = 1; day <= nextMonthDays; day++) {
        const dayElem = document.createElement('div');
        dayElem.className = 'day-ring next-month';
        
        const dayNumber = document.createElement('span');
        dayNumber.textContent = day;
        dayElem.appendChild(dayNumber);
        
        // Make next month days selectable
        dayElem.addEventListener('click', () => {
          this.selectOutsideMonthDay(day, false);
        });
        
        calendarGrid.appendChild(dayElem);
      }
      
      this.container.appendChild(calendarGrid);
      
      if (this.eventManager) {
        this.createHistoryButton();
      }

      // Call setupEventListeners at the end of render
      this.setupEventListeners();
    }
  }