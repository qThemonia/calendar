// help-tour.js - Interactive tour guide for the app

// Define tour steps with target elements and descriptions
const tourSteps = [
    {
      target: '#checklist-container',
      title: 'Daily Checklist',
      content: 'This is your Daily Checklist where you can manage tasks for today. Add new tasks, mark them as complete, and organize your daily workflow. Tasks reset at midnight each day, helping you stay focused on what needs to be done today.',
      position: 'right'
    },
    {
      target: '#calendar-container',
      title: 'Calendar View',
      content: 'This calendar helps you visualize your schedule. Colored days indicate events. Click on any day to see its events. You can navigate between months using the arrows. The calendar automatically highlights the current day and selected day.',
      position: 'bottom'
    },
    {
      target: '#event-container',
      title: 'Events Panel',
      content: 'This panel shows events for the selected date. You can add new events, mark them as complete, and edit existing ones. Events can be scheduled for future dates and will appear in your calendar. You can also drag events to reschedule them. Events will also appear in the Daily Checklist when it\'s time for them to be worked on! Cool, right?',
      position: 'left'
    },
    {
      target: '#history-button-container',
      title: 'Event History',
      content: 'Click this button to view your past events. The Event History shows all completed and missed events, helping you track your progress over time.',
      position: 'top'
    },
    {
      target: '.history-button-container', 
      title: 'Completion History',
      content: 'View your task completion statistics over time. See your daily completion rate, streaks, and performance trends to help you stay motivated and improve your productivity.',
      position: 'top'
    },
    {
        target: '#quote-container',
        title: 'Quotes',
        content: 'Each time you open the app, you\'ll see a random quote here that I found meaningful or inspiring, ~100 of them that I picked from the loading screens of the games "Space Engineers" and "X4: Foundations." Feel free to contact to suggest new ones :)',
        position: 'bottom'
      },
    {
      target: '#settings-button',
      title: 'Theme Settings',
      content: 'Click this gear icon to change the app\'s color theme. Choose from several color schemes to personalize your experience.',
      position: 'left'
    },
    {
        target: '#welcome-name-container',
        title: 'Personalize Your Calendar',
        content: 'You can set a name here to tell Timely how to address you.',
        position: 'bottom'
    },
    {
        target: '#help-button',
        title: 'Help Button',
        content: 'Click this help icon anytime to replay this tour and learn about the app\'s features. To start, try setting your name by clicking on the personalization area above!',
        position: 'left'
    }
  ];
  
  // Create and manage the tour
  export class AppTour {
    constructor() {
      this.currentStep = 0;
      this.overlay = null;
      this.highlighter = null;
      this.tooltip = null;
      this.isActive = false;
    }
  
    // Start the tour
    start() {
      // Don't start if already active
      if (this.isActive) return;
      
      this.isActive = true;
      this.currentStep = 0;
      this.createTourElements();
      this.showStep(0);
    }
  
    // Create the overlay, highlighter, and tooltip elements
    createTourElements() {
      // Create main overlay
      this.overlay = document.createElement('div');
      this.overlay.className = 'tour-overlay';
      document.body.appendChild(this.overlay);
  
      // Create spotlight highlighter
      this.highlighter = document.createElement('div');
      this.highlighter.className = 'tour-highlighter';
      document.body.appendChild(this.highlighter);
  
      // Create tooltip
      this.tooltip = document.createElement('div');
      this.tooltip.className = 'tour-tooltip';
      
      // Add navigation buttons to tooltip
      const buttonsContainer = document.createElement('div');
      buttonsContainer.className = 'tour-buttons';
      
      const prevButton = document.createElement('button');
      prevButton.className = 'tour-btn tour-prev';
      prevButton.textContent = 'Previous';
      prevButton.addEventListener('click', () => this.prevStep());
      
      const nextButton = document.createElement('button');
      nextButton.className = 'tour-btn tour-next';
      nextButton.textContent = 'Next';
      nextButton.addEventListener('click', () => this.nextStep());
      
      const skipButton = document.createElement('button');
      skipButton.className = 'tour-btn tour-skip';
      skipButton.textContent = 'Skip Tour';
      skipButton.addEventListener('click', () => this.end());
      
      buttonsContainer.appendChild(prevButton);
      buttonsContainer.appendChild(nextButton);
      buttonsContainer.appendChild(skipButton);
      this.tooltip.appendChild(buttonsContainer);
      
      document.body.appendChild(this.tooltip);
      
      // Add keyboard navigation
      document.addEventListener('keydown', this.handleKeyboard.bind(this));
      
      // Add click outside to close (but not on the tooltip or highlighter)
      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) {
          this.end();
        }
      });
    }
  
    // Handle keyboard navigation
    handleKeyboard(e) {
      if (!this.isActive) return;
      
      if (e.key === 'Escape') {
        this.end();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        this.nextStep();
      } else if (e.key === 'ArrowLeft') {
        this.prevStep();
      }
    }
  
    // Show a specific step
    showStep(stepIndex) {
      if (stepIndex < 0 || stepIndex >= tourSteps.length) {
        this.end();
        return;
      }
      
      this.currentStep = stepIndex;
      const step = tourSteps[stepIndex];
      const target = document.querySelector(step.target);
      
      if (!target) {
        console.error(`Target element not found: ${step.target}`);
        this.nextStep(); // Skip to next step if target not found
        return;
      }
      
      // Position the highlighter around the target
      const targetRect = target.getBoundingClientRect();
      this.highlighter.style.top = `${targetRect.top - 10}px`;
      this.highlighter.style.left = `${targetRect.left - 10}px`;
      this.highlighter.style.width = `${targetRect.width + 20}px`;
      this.highlighter.style.height = `${targetRect.height + 20}px`;
      
      // Update tooltip content
      this.tooltip.innerHTML = `
        <h3 class="tour-title">${step.title}</h3>
        <p class="tour-content">${step.content}</p>
        <div class="tour-progress">${stepIndex + 1}/${tourSteps.length}</div>
        <div class="tour-buttons">
          <button class="tour-btn tour-prev" ${stepIndex === 0 ? 'disabled' : ''}>Previous</button>
          <button class="tour-btn tour-next">${stepIndex === tourSteps.length - 1 ? 'Finish' : 'Next'}</button>
          <button class="tour-btn tour-skip">Skip Tour</button>
        </div>
      `;
      
      // Position the tooltip
      this.positionTooltip(targetRect, step.position);
      
      // Add event listeners to buttons
      this.tooltip.querySelector('.tour-prev').addEventListener('click', () => this.prevStep());
      this.tooltip.querySelector('.tour-next').addEventListener('click', () => this.nextStep());
      this.tooltip.querySelector('.tour-skip').addEventListener('click', () => this.end());
      
      // Show elements with animation
      this.overlay.style.opacity = '1';
      this.highlighter.style.opacity = '1';
      this.tooltip.style.opacity = '1';
    }
  
    // Position the tooltip based on the target's position and the specified position
    positionTooltip(targetRect, position) {
      const tooltipRect = this.tooltip.getBoundingClientRect();
      const padding = 20;
      
      switch (position) {
        case 'top':
          this.tooltip.style.top = `${targetRect.top - tooltipRect.height - padding}px`;
          this.tooltip.style.left = `${targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2)}px`;
          break;
        case 'bottom':
          this.tooltip.style.top = `${targetRect.bottom + padding}px`;
          this.tooltip.style.left = `${targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2)}px`;
          break;
        case 'left':
          this.tooltip.style.top = `${targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2)}px`;
          this.tooltip.style.left = `${targetRect.left - tooltipRect.width - padding}px`;
          break;
        case 'right':
          this.tooltip.style.top = `${targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2)}px`;
          this.tooltip.style.left = `${targetRect.right + padding}px`;
          break;
        default:
          // Default to bottom
          this.tooltip.style.top = `${targetRect.bottom + padding}px`;
          this.tooltip.style.left = `${targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2)}px`;
      }
      
      // Ensure tooltip stays within viewport
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Check left boundary
      if (parseFloat(this.tooltip.style.left) < padding) {
        this.tooltip.style.left = `${padding}px`;
      }
      
      // Check right boundary
      if (parseFloat(this.tooltip.style.left) + tooltipRect.width > viewportWidth - padding) {
        this.tooltip.style.left = `${viewportWidth - tooltipRect.width - padding}px`;
      }
      
      // Check top boundary
      if (parseFloat(this.tooltip.style.top) < padding) {
        this.tooltip.style.top = `${padding}px`;
      }
      
      // Check bottom boundary
      if (parseFloat(this.tooltip.style.top) + tooltipRect.height > viewportHeight - padding) {
        this.tooltip.style.top = `${viewportHeight - tooltipRect.height - padding}px`;
      }
    }
  
    // Go to the next step
    nextStep() {
      if (this.currentStep === tourSteps.length - 1) {
        this.end();
      } else {
        this.showStep(this.currentStep + 1);
      }
    }
  
    // Go to the previous step
    prevStep() {
      if (this.currentStep > 0) {
        this.showStep(this.currentStep - 1);
      }
    }
  
    // End the tour
    end() {
      this.isActive = false;
      
      // Fade out elements
      if (this.overlay) this.overlay.style.opacity = '0';
      if (this.highlighter) this.highlighter.style.opacity = '0';
      if (this.tooltip) this.tooltip.style.opacity = '0';
      
      // Remove elements after animation completes
      setTimeout(() => {
        if (this.overlay) {
          document.body.removeChild(this.overlay);
          this.overlay = null;
        }
        if (this.highlighter) {
          document.body.removeChild(this.highlighter);
          this.highlighter = null;
        }
        if (this.tooltip) {
          document.body.removeChild(this.tooltip);
          this.tooltip = null;
        }
      }, 500); // Match transition duration
      
      // Remove keyboard listener
      document.removeEventListener('keydown', this.handleKeyboard);
    }
  }
  
  // Create and export the help button function
  export function createHelpButton() {
    // Create the tour instance
    const appTour = new AppTour();
    
    // Create help button
    const helpButton = document.createElement('button');
    helpButton.id = 'help-button';
    helpButton.className = 'help-button';
    helpButton.innerHTML = '<i class="fa-solid fa-circle-question"></i>';
    helpButton.title = 'Help & Tour';
    
    // Add click event to start tour
    helpButton.addEventListener('click', () => appTour.start());
    
    // Add the button to the document (position it above settings button)
    document.body.appendChild(helpButton);
    
    return {
      helpButton,
      appTour
    };
  }