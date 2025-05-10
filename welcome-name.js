// welcome-name.js - Handle user name customization

export class WelcomeManager {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
      this.userName = localStorage.getItem('user-name') || '';
      this.maxNameLength = 12;
      this.isFirstVisit = !this.userName;
      this.render();
    }
  
    // Create welcome container
    createWelcomeContainer() {
      const welcomeContainer = document.createElement('div');
      welcomeContainer.id = 'welcome-container';
      welcomeContainer.className = 'welcome-container';
      
      // If user hasn't set a name yet
      if (this.isFirstVisit) {
        welcomeContainer.innerHTML = `
          <div class="welcome-prompt">
            What should I call you?
          </div>
        `;
        
        // Make the prompt clickable for first visit
        const promptElement = welcomeContainer.querySelector('.welcome-prompt');
        promptElement.addEventListener('click', () => {
          this.showNameInput();
        });
      } else {
        // User already has a name
        welcomeContainer.innerHTML = `
          <div class="welcome-message">
            <span class="welcome-text">Welcome, </span>
            <span class="user-name" id="user-name-display">${this.userName}</span>
          </div>
        `;
        
        // Make ONLY the name part clickable
        const nameElement = welcomeContainer.querySelector('.user-name');
        nameElement.addEventListener('click', (e) => {
          e.stopPropagation();
          this.showNameInput();
        });
      }
      
      return welcomeContainer;
    }
  
    // Show the name input field
    showNameInput() {
      // Get existing text content
      const welcomeContainer = document.getElementById('welcome-container');
      const welcomeMessageEl = welcomeContainer.querySelector('.welcome-message');
      const welcomePromptEl = welcomeContainer.querySelector('.welcome-prompt');
      
      if (this.isFirstVisit) {
        // First visit - replace the prompt
        welcomeContainer.innerHTML = '';
        
        // Create input element
        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.className = 'name-input';
        inputField.id = 'name-input';
        inputField.value = '';
        inputField.placeholder = 'Type your name';
        inputField.maxLength = this.maxNameLength;
        inputField.autocomplete = 'off';
        
        welcomeContainer.appendChild(inputField);
      } else {
        // Replace only the name part
        const nameElement = welcomeContainer.querySelector('.user-name');
        const nameRect = nameElement.getBoundingClientRect();
        
        // Create input in the exact position of the name
        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.className = 'name-input';
        inputField.id = 'name-input';
        inputField.value = this.userName;
        inputField.maxLength = this.maxNameLength;
        inputField.autocomplete = 'off';
        
        // Replace just the name element
        nameElement.replaceWith(inputField);
      }
      
      // Focus the input field
      const inputField = document.getElementById('name-input');
      inputField.focus();
      inputField.select();
      
      // Handle enter key
      inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.setUserName(inputField.value.trim());
        }
      });
      
      // Handle blur (clicking outside)
      inputField.addEventListener('blur', () => {
        this.setUserName(inputField.value.trim());
      });
    }
  
    // Set the user name and update display
    setUserName(name) {
      if (name) {
        this.userName = name;
        localStorage.setItem('user-name', name);
        this.isFirstVisit = false;
      }
      
      this.render();
    }
  
    // Render the welcome component
    render() {
      // Clear container
      this.container.innerHTML = '';
      
      // Create and add the welcome container
      const welcomeContainer = this.createWelcomeContainer();
      this.container.appendChild(welcomeContainer);
    }
  }