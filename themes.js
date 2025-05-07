// themes.js - Define and manage themes for the application

// Define theme color palettes
export const themes = {
  default: {
    id: 'default',
    name: 'Amber',
    colors: {
      // Main colors
      primary: 'rgb(255, 158, 68)',
      primaryDark: 'rgb(168, 100, 35)',
      primaryDarker: 'rgb(133, 68, 12)',
      primaryLight: 'rgb(255, 210, 170)',
      primaryLighter: 'rgb(255, 235, 218)',
      primaryLightest: 'rgb(255, 245, 235)',
      
      // App background
      appBackground: 'rgb(254, 230, 209)',
      
      // Panel colors
      panelBackground: 'rgb(243, 210, 170)',
      panelBorder: 'rgb(193, 135, 64)',
      
      // Button colors
      buttonBackground: 'rgb(255, 153, 51)',
      buttonText: 'white',
      buttonHover: 'rgb(255, 128, 0)',
      buttonBorder: 'rgb(222, 184, 135)',
      
      // Event type colors
      eventTypeAppointment: '#ff8080',
      eventTypeDeadline: '#ff8dff',
      eventTypeMeeting: '#806dff',
      eventTypePersonal: '#6ea8ff',
      eventTypeTask: '#52ad52',
      eventTypeReminder: '#cfcf40',
      eventTypeOther: '#feb770',
      
      // Calendar colors
      calendarRed: '#ff8080',
      calendarPink: '#ff8dff',
      calendarPurple: '#806dff',
      calendarBlue: '#6ea8ff',
      calendarGreen: '#52ad52',
      calendarYellow: '#cfcf40',
      calendarOrange: '#feb770',
      
      // Status colors
      completed: '#60a040',
      missed: '#a04040',
      
      // Text colors
      textPrimary: 'rgb(133, 68, 12)',
      textSecondary: 'rgb(168, 100, 35)',
      textLight: 'white'
    }
  },
  
  blue: {
    id: 'blue',
    name: 'Sky Blue',
    colors: {
      // Main colors
      primary: 'rgb(65, 155, 225)',
      primaryDark: 'rgb(45, 105, 165)',
      primaryDarker: 'rgb(25, 85, 135)',
      primaryLight: 'rgb(125, 185, 240)',
      primaryLighter: 'rgb(173, 214, 255)',
      primaryLightest: 'rgb(208, 232, 255)',
      
      // App background
      appBackground: 'rgb(197, 227, 253)',
      
      // Panel colors
      panelBackground: 'rgb(178, 216, 255)',
      panelBorder: 'rgb(59, 119, 174)',
      
      // Button colors
      buttonBackground: 'rgb(65, 155, 225)',
      buttonText: 'white',
      buttonHover: 'rgb(45, 105, 165)',
      buttonBorder: 'rgb(45, 105, 165)',
      
      // Event type colors
      eventTypeAppointment: '#ff7070',
      eventTypeDeadline: '#ff70ff',
      eventTypeMeeting: '#7070ff',
      eventTypePersonal: '#70c8ff',
      eventTypeTask: '#70c870',
      eventTypeReminder: '#c8c870',
      eventTypeOther: '#c89670',
      
      // Calendar colors
      calendarRed: '#ff7070',
      calendarPink: '#ff70ff',
      calendarPurple: '#7070ff',
      calendarBlue: '#70c8ff',
      calendarGreen: '#70c870',
      calendarYellow: '#c8c870',
      calendarOrange: '#c89670',
      
      // Status colors
      completed: '#60a040',
      missed: '#a04040',
      
      // Text colors
      textPrimary: 'rgb(25, 85, 135)',
      textSecondary: 'rgb(45, 105, 165)',
      textLight: 'white'
    }
  },
  
  green: {
    id: 'green',
    name: 'Forest Green',
    colors: {
      // Main colors
      primary: 'rgb(75, 165, 75)',
      primaryDark: 'rgb(45, 125, 45)',
      primaryDarker: 'rgb(25, 95, 25)',
      primaryLight: 'rgb(165, 215, 165)',
      primaryLighter: 'rgb(215, 240, 215)',
      primaryLightest: 'rgb(235, 250, 235)',
      
      // App background
      appBackground: 'rgb(211, 255, 211)',
      
      // Panel colors
      panelBackground: 'rgb(181, 245, 181)',
      panelBorder: 'rgb(75, 165, 75)',
      
      // Button colors
      buttonBackground: 'rgb(75, 165, 75)',
      buttonText: 'white',
      buttonHover: 'rgb(45, 125, 45)',
      buttonBorder: 'rgb(45, 125, 45)',
      
      // Event type colors
      eventTypeAppointment: '#ff7070',
      eventTypeDeadline: '#ff80ff',
      eventTypeMeeting: '#8080ff',
      eventTypePersonal: '#70b0ff',
      eventTypeTask: '#60a060',
      eventTypeReminder: '#b0b060',
      eventTypeOther: '#d0a060',
      
      // Calendar colors
      calendarRed: '#ff7070',
      calendarPink: '#ff80ff',
      calendarPurple: '#8080ff',
      calendarBlue: '#70b0ff',
      calendarGreen: '#60a060',
      calendarYellow: '#b0b060',
      calendarOrange: '#d0a060',
      
      // Status colors
      completed: '#50a030',
      missed: '#a03030',
      
      // Text colors
      textPrimary: 'rgb(25, 95, 25)',
      textSecondary: 'rgb(45, 125, 45)',
      textLight: 'white'
    }
  },
  
  purple: {
    id: 'purple',
    name: 'Royal Purple',
    colors: {
      // Main colors
      primary: 'rgb(140, 100, 200)',
      primaryDark: 'rgb(100, 70, 160)',
      primaryDarker: 'rgb(80, 50, 130)',
      primaryLight: 'rgb(180, 160, 220)',
      primaryLighter: 'rgb(220, 210, 240)',
      primaryLightest: 'rgb(240, 235, 250)',
      
      // App background
      appBackground: 'rgb(236, 227, 255)',
      
      // Panel colors
      panelBackground: 'rgb(188, 174, 230)',
      panelBorder: 'rgb(140, 100, 200)',
      
      // Button colors
      buttonBackground: 'rgb(140, 100, 200)',
      buttonText: 'white',
      buttonHover: 'rgb(100, 70, 160)',
      buttonBorder: 'rgb(100, 70, 160)',
      
      // Event type colors
      eventTypeAppointment: '#ff7070',
      eventTypeDeadline: '#ff70d0',
      eventTypeMeeting: '#9070ff',
      eventTypePersonal: '#70a0ff',
      eventTypeTask: '#70c070',
      eventTypeReminder: '#d0d070',
      eventTypeOther: '#d09070',
      
      // Calendar colors
      calendarRed: '#ff7070',
      calendarPink: '#ff70d0',
      calendarPurple: '#9070ff',
      calendarBlue: '#70a0ff',
      calendarGreen: '#70c070',
      calendarYellow: '#d0d070',
      calendarOrange: '#d09070',
      
      // Status colors
      completed: '#60a040',
      missed: '#a04040',
      
      // Text colors
      textPrimary: 'rgb(80, 50, 130)',
      textSecondary: 'rgb(100, 70, 160)',
      textLight: 'white'
    }
  }
};

// Get active theme from local storage or default
export function getActiveTheme() {
  const savedTheme = localStorage.getItem('app-theme');
  return savedTheme && themes[savedTheme] ? themes[savedTheme] : themes.default;
}

// Apply theme to the document by setting CSS variables
export function applyTheme(themeId) {
  // Get the theme from the themes object
  const theme = themes[themeId] || themes.default;
  
  // Get the :root element to set CSS variables
  const root = document.documentElement;
  
  // Set each color as a CSS variable
  for (const [key, value] of Object.entries(theme.colors)) {
    // Convert camelCase to kebab-case for CSS variables
    const cssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    root.style.setProperty(`--${cssVarName}`, value);
  }
  
  // Update the app-theme data attribute on the body
  document.body.setAttribute('data-theme', theme.id);
  
  // Save the theme preference to local storage
  localStorage.setItem('app-theme', theme.id);
  
  // Return the applied theme
  return theme;
}

// Create and manage the theme selector modal
export function createThemeSelector() {
  // Create modal overlay if it doesn't exist
  let themeModalOverlay = document.getElementById('theme-modal-overlay');
  if (!themeModalOverlay) {
    themeModalOverlay = document.createElement('div');
    themeModalOverlay.id = 'theme-modal-overlay';
    themeModalOverlay.className = 'modal-overlay';
    document.body.appendChild(themeModalOverlay);
    
    // Close when clicking outside the modal
    themeModalOverlay.addEventListener('click', (e) => {
      if (e.target === themeModalOverlay) {
        closeThemeModal();
      }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && themeModalOverlay.classList.contains('active')) {
        closeThemeModal();
      }
    });
  }
  
  // Create modal content
  const themeModal = document.createElement('div');
  themeModal.className = 'theme-modal';
  
  // Modal header
  const modalHeader = document.createElement('div');
  modalHeader.className = 'modal-header';
  
  const modalTitle = document.createElement('h3');
  modalTitle.textContent = 'Choose Theme';
  
  const closeButton = document.createElement('button');
  closeButton.className = 'modal-close';
  closeButton.textContent = '×';
  closeButton.addEventListener('click', closeThemeModal);
  
  modalHeader.appendChild(modalTitle);
  modalHeader.appendChild(closeButton);
  
  // Theme options container
  const themeOptions = document.createElement('div');
  themeOptions.className = 'theme-options';
  
  // Get active theme
  const activeTheme = getActiveTheme();
  
  // Create a theme option for each theme
  for (const [id, theme] of Object.entries(themes)) {
    const themeOption = document.createElement('div');
    themeOption.className = `theme-option ${id === activeTheme.id ? 'active' : ''}`;
    themeOption.dataset.theme = id;
    
    // Create color preview
    const colorPreview = document.createElement('div');
    colorPreview.className = 'color-preview';
    colorPreview.style.backgroundColor = theme.colors.primary;
    colorPreview.style.borderColor = theme.colors.primaryDark;
    
    // Create theme name
    const themeName = document.createElement('div');
    themeName.className = 'theme-name';
    themeName.textContent = theme.name;
    
    // Add elements to theme option
    themeOption.appendChild(colorPreview);
    themeOption.appendChild(themeName);
    
    // Add click event
    themeOption.addEventListener('click', () => {
      // Apply the theme
      applyTheme(id);
      
      // Update active class
      document.querySelectorAll('.theme-option').forEach(option => {
        option.classList.remove('active');
      });
      themeOption.classList.add('active');
    });
    
    themeOptions.appendChild(themeOption);
  }
  
  // Build the modal
  themeModal.appendChild(modalHeader);
  themeModal.appendChild(themeOptions);
  
  // Add to overlay
  themeModalOverlay.innerHTML = '';
  themeModalOverlay.appendChild(themeModal);
  
  return themeModalOverlay;
}

// Show theme modal
export function showThemeModal() {
  const themeModalOverlay = createThemeSelector();
  themeModalOverlay.classList.add('active');
}

// Close theme modal
export function closeThemeModal() {
  const themeModalOverlay = document.getElementById('theme-modal-overlay');
  if (themeModalOverlay) {
    themeModalOverlay.classList.remove('active');
  }
}

// Create settings button
export function createSettingsButton() {
  const settingsButton = document.createElement('button');
  settingsButton.id = 'settings-button';
  settingsButton.className = 'settings-button';
  settingsButton.innerHTML = '<i class="fa-solid fa-gear"></i>';
  settingsButton.title = 'Settings';
  
  // Add click event to show theme modal
  settingsButton.addEventListener('click', showThemeModal);
  
  // Add the button to the document
  document.body.appendChild(settingsButton);
  
  return settingsButton;
}

// Initialize theme on page load
export function initTheme() {
  // Apply the active theme
  const activeTheme = getActiveTheme();
  applyTheme(activeTheme.id);
  
  // Create the settings button
  createSettingsButton();
}