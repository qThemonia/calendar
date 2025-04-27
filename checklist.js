// checklist.js
export class ChecklistManager {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
      this.items = [];
      this.selectedColor = 'orange'; // Default color
      this.loadItems();
      this.createModal();
      this.render();
    }
  
    loadItems() {
      // Load from localStorage if available
      const savedItems = localStorage.getItem('checklist-items');
      if (savedItems) {
        this.items = JSON.parse(savedItems);
      }
    }
  
    saveItems() {
      localStorage.setItem('checklist-items', JSON.stringify(this.items));
    }
  
    createModal() {
      // Create modal overlay
      this.modalOverlay = document.createElement('div');
      this.modalOverlay.className = 'modal-overlay';
      document.body.appendChild(this.modalOverlay);
  
      // Create modal content
      const taskModal = document.createElement('div');
      taskModal.className = 'task-modal';
      
      // Modal header
      const modalHeader = document.createElement('div');
      modalHeader.className = 'modal-header';
      const modalTitle = document.createElement('h3');
      modalTitle.textContent = 'Create New Task';
      
      const closeButton = document.createElement('button');
      closeButton.className = 'modal-close';
      closeButton.textContent = '×';
      closeButton.addEventListener('click', () => this.closeModal());
      
      modalHeader.appendChild(modalTitle);
      modalHeader.appendChild(closeButton);
      
      // Modal body / form
      const modalForm = document.createElement('form');
      modalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.submitTaskForm();
      });
      
      // Task title input
      const titleGroup = document.createElement('div');
      titleGroup.className = 'form-group';
      
      const titleLabel = document.createElement('label');
      titleLabel.textContent = 'Task Title';
      titleLabel.setAttribute('for', 'task-title');
      
      this.taskTitleInput = document.createElement('input');
      this.taskTitleInput.type = 'text';
      this.taskTitleInput.id = 'task-title';
      this.taskTitleInput.placeholder = 'Enter task title';
      this.taskTitleInput.required = true;
      
      titleGroup.appendChild(titleLabel);
      titleGroup.appendChild(this.taskTitleInput);
      
      // Task notes input
      const notesGroup = document.createElement('div');
      notesGroup.className = 'form-group';
      
      const notesLabel = document.createElement('label');
      notesLabel.textContent = 'Notes (Optional)';
      notesLabel.setAttribute('for', 'task-notes');
      
      this.taskNotesInput = document.createElement('textarea');
      this.taskNotesInput.id = 'task-notes';
      this.taskNotesInput.placeholder = 'Add any notes or details about this task';
      
      notesGroup.appendChild(notesLabel);
      notesGroup.appendChild(this.taskNotesInput);
      
      // Color selection
      const colorGroup = document.createElement('div');
      colorGroup.className = 'form-group';
      
      const colorLabel = document.createElement('label');
      colorLabel.textContent = 'Priority Color';
      
      const colorOptions = document.createElement('div');
      colorOptions.className = 'color-options';
      
      const colors = [
        { name: 'red', label: 'High Priority' },
        { name: 'orange', label: 'Medium Priority' },
        { name: 'yellow', label: 'Low Priority' },
        { name: 'green', label: 'In Progress' },
        { name: 'blue', label: 'Planning' },
        { name: 'purple', label: 'Creative' },
        { name: 'pink', label: 'Personal' }
      ];
      
      colors.forEach(color => {
        const colorOption = document.createElement('div');
        colorOption.className = `color-option color-${color.name} ${color.name === this.selectedColor ? 'selected' : ''}`;
        colorOption.title = color.label;
        colorOption.dataset.color = color.name;
        
        colorOption.addEventListener('click', () => {
          // Remove selected class from all options
          document.querySelectorAll('.color-option').forEach(opt => {
            opt.classList.remove('selected');
          });
          
          // Add selected class to clicked option
          colorOption.classList.add('selected');
          this.selectedColor = color.name;
        });
        
        colorOptions.appendChild(colorOption);
      });
      
      colorGroup.appendChild(colorLabel);
      colorGroup.appendChild(colorOptions);
      
      // Modal footer / actions
      const modalActions = document.createElement('div');
      modalActions.className = 'modal-actions';
      
      const cancelButton = document.createElement('button');
      cancelButton.textContent = 'Cancel';
      cancelButton.className = 'btn-cancel';
      cancelButton.type = 'button';
      cancelButton.addEventListener('click', () => this.closeModal());
      
      const addButton = document.createElement('button');
      addButton.textContent = 'Add Task';
      addButton.className = 'btn-add';
      addButton.type = 'submit';
      
      modalActions.appendChild(cancelButton);
      modalActions.appendChild(addButton);
      
      // Build the form
      modalForm.appendChild(titleGroup);
      modalForm.appendChild(notesGroup);
      modalForm.appendChild(colorGroup);
      modalForm.appendChild(modalActions);
      
      // Build the modal
      taskModal.appendChild(modalHeader);
      taskModal.appendChild(modalForm);
      
      this.modalOverlay.appendChild(taskModal);
      
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
    
    openModal() {
      this.modalOverlay.classList.add('active');
      this.taskTitleInput.focus();
    }
    
    closeModal() {
      this.modalOverlay.classList.remove('active');
      this.taskTitleInput.value = '';
      this.taskNotesInput.value = '';
      
      // Reset color selection to default
      document.querySelectorAll('.color-option').forEach(opt => {
        opt.classList.remove('selected');
        if (opt.dataset.color === 'orange') {
          opt.classList.add('selected');
        }
      });
      this.selectedColor = 'orange';
    }
    
    submitTaskForm() {
      const title = this.taskTitleInput.value.trim();
      const notes = this.taskNotesInput.value.trim();
      
      if (title) {
        this.addItem(title, notes, this.selectedColor);
        this.closeModal();
      }
    }
  
    addItem(text, notes = '', color = 'orange') {
      const newItem = {
        id: Date.now().toString(),
        text: text,
        notes: notes,
        color: color,
        completed: false,
        createdAt: new Date().toISOString()
      };
      
      this.items.push(newItem);
      this.saveItems();
      this.render();
    }
  
    toggleItemCompletion(id) {
      const item = this.items.find(item => item.id === id);
      if (item) {
        item.completed = !item.completed;
        
        // If completed, move to bottom
        if (item.completed) {
          const itemIndex = this.items.findIndex(item => item.id === id);
          const completedItem = this.items.splice(itemIndex, 1)[0];
          this.items.push(completedItem);
        }
        
        this.saveItems();
        this.render();
      }
    }
  
    deleteItem(id) {
      this.items = this.items.filter(item => item.id !== id);
      this.saveItems();
      this.render();
    }
  
    render() {
      // Clear container
      this.container.innerHTML = '';
      
      // Create header with add button
      const header = document.createElement('div');
      header.className = 'checklist-header';
      
      const title = document.createElement('h2');
      title.textContent = 'Daily Checklist';
      
      const addButton = document.createElement('button');
      addButton.textContent = '+ New Task';
      addButton.className = 'add-button';
      addButton.addEventListener('click', () => this.openModal());
      
      header.appendChild(title);
      header.appendChild(addButton);
      this.container.appendChild(header);
      
      // Create list container
      const listContainer = document.createElement('div');
      listContainer.className = 'checklist-items';
      
      // Add items to list
      this.items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = `checklist-item color-${item.color || 'orange'} ${item.completed ? 'completed' : ''}`;
        itemElement.dataset.id = item.id;
        
        // Create custom checkbox
        const checkboxContainer = document.createElement('label');
        checkboxContainer.className = 'custom-checkbox';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = item.completed;
        checkbox.addEventListener('change', () => {
          this.toggleItemCompletion(item.id);
        });
        
        const checkboxDisplay = document.createElement('span');
        checkboxDisplay.className = 'checkbox-display';
        
        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(checkboxDisplay);
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'item-content';
        
        const text = document.createElement('span');
        text.textContent = item.text;
        text.className = 'item-text';
        
        contentDiv.appendChild(text);
        
        // Add notes if they exist
        if (item.notes) {
          const notes = document.createElement('span');
          notes.textContent = item.notes;
          notes.className = 'item-note';
          contentDiv.appendChild(notes);
        }
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '×';
        deleteButton.className = 'delete-button';
        deleteButton.addEventListener('click', (e) => {
          e.stopPropagation();
          this.deleteItem(item.id);
        });
        
        itemElement.appendChild(checkboxContainer);
        itemElement.appendChild(contentDiv);
        itemElement.appendChild(deleteButton);
        
        // Add click event to toggle completion
        itemElement.addEventListener('click', (e) => {
          if (e.target !== checkbox && e.target !== deleteButton) {
            this.toggleItemCompletion(item.id);
          }
        });
        
        listContainer.appendChild(itemElement);
      });
      
      this.container.appendChild(listContainer);
    }
  }