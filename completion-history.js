export class CompletionHistoryManager {
    constructor(checklistManager) {
      this.checklistManager = checklistManager;
      this.historyData = [];
      this.selectedTimeframe = '1w'; // Default timeframe
      
      // Load historical data
      this.loadHistoryData();
      
      // Setup history button
      this.createHistoryButton();
      this.createHistoryModal();
    }
    
    loadHistoryData() {
      // Load from localStorage if available
      const savedHistory = localStorage.getItem('checklist-history');
      if (savedHistory) {
        this.historyData = JSON.parse(savedHistory);
      }
      
      // Check if we need to record today's data
      this.recordTodaysStats();
    }
    
// Modified version of recordTodaysStats that preserves deleted tasks in history
recordTodaysStats() {
    try {
      // Get today's date and remove time component
      const today = new Date();
      const todayString = today.toDateString();
      
      // Check if we already recorded stats today
      let todayEntry = this.historyData.find(entry => 
        new Date(entry.date).toDateString() === todayString
      );
      
      // Get all tasks and completion status
      const currentTasks = this.checklistManager.items;
      const currentTaskIds = currentTasks.map(task => task.id);
      
      // Create task stats for today's entry, including preserving deleted tasks
      let taskStats = [];
      
      if (todayEntry) {
        // Get existing tasks from today's entry
        const existingTaskStats = todayEntry.taskStats || [];
        
        // Identify tasks that exist in history but are no longer in current list
        const deletedTasks = existingTaskStats.filter(task => 
          !currentTaskIds.includes(task.id) && !task.isDeleted
        );
        
        // Mark these tasks as deleted
        deletedTasks.forEach(task => {
          task.isDeleted = true;
        });
        
        // Keep all tasks from history (both deleted and non-deleted)
        // that aren't in the current list
        const retainedTasks = existingTaskStats.filter(task => 
          !currentTaskIds.includes(task.id)
        );
        
        // Add current tasks with updated completion status
        const currentTaskStats = currentTasks.map(task => {
          // Calculate days this task has been listed
          const createdDate = new Date(task.createdAt || today);
          const daysSinceCreation = Math.floor((today - createdDate) / (1000 * 60 * 60 * 24));
          
          return {
            id: task.id,
            text: task.text,
            completed: task.completed,
            createdAt: task.createdAt || today.toISOString(),
            daysListed: daysSinceCreation + 1, // Add 1 for today
            isDeleted: false
          };
        });
        
        // Combine retained and current tasks
        taskStats = [...retainedTasks, ...currentTaskStats];
      } else {
        // First entry for today, just use current tasks
        taskStats = currentTasks.map(task => {
          const createdDate = new Date(task.createdAt || today);
          const daysSinceCreation = Math.floor((today - createdDate) / (1000 * 60 * 60 * 24));
          
          return {
            id: task.id,
            text: task.text,
            completed: task.completed,
            createdAt: task.createdAt || today.toISOString(),
            daysListed: daysSinceCreation + 1,
            isDeleted: false
          };
        });
      }
      
      // Calculate totals including deleted tasks
      const totalTasks = taskStats.length;
      const completedTasks = taskStats.filter(task => task.completed).length;
      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      
      if (todayEntry) {
        // Update existing entry
        todayEntry.totalTasks = totalTasks;
        todayEntry.completedTasks = completedTasks;
        todayEntry.completionRate = completionRate;
        todayEntry.taskStats = taskStats;
      } else {
        // Create new entry
        const historyEntry = {
          date: today.toISOString(),
          totalTasks,
          completedTasks,
          completionRate,
          taskStats
        };
        
        // Add to history data
        this.historyData.push(historyEntry);
      }
      
      // Save to local storage
      this.saveHistoryData();
      
      console.log('Recorded today\'s completion stats:', completedTasks, 'out of', totalTasks);
    } catch (error) {
      console.error('Error recording today\'s stats:', error);
    }
  }

      updateTaskCompletion(taskId, isCompleted) {
        try {
          // Get today's entry
          const today = new Date();
          const todayString = today.toDateString();
          
          const todayEntry = this.historyData.find(entry => 
            new Date(entry.date).toDateString() === todayString
          );
          
          if (todayEntry) {
            // Update the task's completion status
            const taskStat = todayEntry.taskStats.find(task => task.id === taskId);
            if (taskStat) {
              taskStat.completed = isCompleted;
            }
            
            // Recalculate completion stats
            const completedTasks = todayEntry.taskStats.filter(task => task.completed).length;
            todayEntry.completedTasks = completedTasks;
            todayEntry.completionRate = todayEntry.taskStats.length > 0 
              ? Math.round((completedTasks / todayEntry.taskStats.length) * 100) 
              : 0;
            
            // Save the updated data
            this.saveHistoryData();
          } else {
            // If no entry exists for today, record full stats
            this.recordTodaysStats();
          }
        } catch (error) {
          console.error('Error updating task completion:', error);
        }
      }
    saveHistoryData() {
      // Limit history to last 365 days to prevent localStorage from growing too large
      const limitedHistory = this.historyData.slice(-365);
      localStorage.setItem('checklist-history', JSON.stringify(limitedHistory));
    }
    
    createHistoryButton() {
      // Create button at the bottom of checklist container
      const checklistContainer = this.checklistManager.container;
      
      // Check if button already exists
      let buttonContainer = checklistContainer.querySelector('.history-button-container');
      
      // Remove existing if any
      if (buttonContainer) {
        buttonContainer.remove();
      }
      
      // Create new button container
      buttonContainer = document.createElement('div');
      buttonContainer.className = 'history-button-container';
      
      const historyButton = document.createElement('button');
      historyButton.className = 'history-button';
      historyButton.textContent = 'View Completion History';
      historyButton.addEventListener('click', () => this.showHistoryModal());
      
      buttonContainer.appendChild(historyButton);
      checklistContainer.appendChild(buttonContainer);
    }
    
    createHistoryModal() {
      // Create modal overlay
      this.historyModalOverlay = document.createElement('div');
      this.historyModalOverlay.className = 'modal-overlay';
      document.body.appendChild(this.historyModalOverlay);
      
      // Create modal content
      const historyModal = document.createElement('div');
      historyModal.className = 'history-modal completion-history-modal';
      
      // Modal header
      const modalHeader = document.createElement('div');
      modalHeader.className = 'modal-header';
      
      const modalTitle = document.createElement('h3');
      modalTitle.textContent = 'Completion History';
      
      const closeButton = document.createElement('button');
      closeButton.className = 'modal-close';
      closeButton.textContent = '×';
      closeButton.addEventListener('click', () => this.closeHistoryModal());
      
      modalHeader.appendChild(modalTitle);
      modalHeader.appendChild(closeButton);
      
      // Timeframe selection
      const timeframeContainer = document.createElement('div');
      timeframeContainer.className = 'timeframe-selector';
      
      const timeframes = [
        { value: '1w', label: '1 Week' },
        { value: '2w', label: '2 Weeks' },
        { value: '1m', label: '1 Month' },
        { value: '3m', label: '3 Months' },
        { value: '6m', label: '6 Months' },
        { value: '1y', label: '1 Year' }
      ];
      
      timeframes.forEach(tf => {
        const timeframeButton = document.createElement('button');
        timeframeButton.className = `timeframe-btn ${tf.value === this.selectedTimeframe ? 'active' : ''}`;
        timeframeButton.dataset.timeframe = tf.value;
        timeframeButton.textContent = tf.label;
        timeframeButton.addEventListener('click', () => {
          // Update selected timeframe
          this.selectedTimeframe = tf.value;
          
          // Update active state
          document.querySelectorAll('.timeframe-btn').forEach(btn => {
            btn.classList.remove('active');
          });
          timeframeButton.classList.add('active');
          
          // Refresh stats display
          this.updateHistoryStats();
        });
        
        timeframeContainer.appendChild(timeframeButton);
      });
      
      // Stats container
      this.statsContainer = document.createElement('div');
      this.statsContainer.className = 'completion-stats-container';
      
      // Chart container
      this.chartContainer = document.createElement('div');
      this.chartContainer.className = 'completion-chart-container';
      this.chartContainer.id = 'completion-chart';
      
      // Task list container
      this.taskListContainer = document.createElement('div');
      this.taskListContainer.className = 'task-list-container';
      
      // Build the modal
      historyModal.appendChild(modalHeader);
      historyModal.appendChild(timeframeContainer);
      historyModal.appendChild(this.statsContainer);
      historyModal.appendChild(this.chartContainer);
      historyModal.appendChild(this.taskListContainer);
      
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
    
    showHistoryModal() {

      this.recordTodaysStats();
      // Update stats before showing
      this.updateHistoryStats();
      
      // Show modal
      this.historyModalOverlay.classList.add('active');
    }
    
    closeHistoryModal() {
      this.historyModalOverlay.classList.remove('active');
    }
    
    updateHistoryStats() {
      // Get filtered data based on selected timeframe
      const filteredData = this.getFilteredData();
      
      // Update stats tiles
      this.updateStatsTiles(filteredData);
      
      // Update chart
      this.renderCompletionChart(filteredData);
      
      // Update task list
      this.updateTaskList(filteredData);
    }
    recordTaskDeletion(taskId) {
        // Get today's entry
        const today = new Date();
        const todayString = today.toDateString();
        
        let todayEntry = this.historyData.find(entry => 
          new Date(entry.date).toDateString() === todayString
        );
        
        if (todayEntry) {
          // Find the task in today's stats
          const taskStat = todayEntry.taskStats.find(task => task.id === taskId);
          
          if (taskStat) {
            // Mark as deleted but keep it in the history
            taskStat.isDeleted = true;
            
            // Recalculate completion rate
            const completedTasks = todayEntry.taskStats.filter(task => task.completed).length;
            todayEntry.completedTasks = completedTasks;
            todayEntry.completionRate = todayEntry.taskStats.length > 0 
              ? Math.round((completedTasks / todayEntry.taskStats.length) * 100) 
              : 0;
            
            // Save the updated data
            this.saveHistoryData();
          }
        }
        
        // Ensure today's stats are recorded
        this.recordTodaysStats();
      }
    getFilteredData() {
      const now = new Date();
      let cutoffDate;
      
      // Calculate cutoff date based on selected timeframe
      switch (this.selectedTimeframe) {
        case '1w':
          cutoffDate = new Date(now);
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case '2w':
          cutoffDate = new Date(now);
          cutoffDate.setDate(now.getDate() - 14);
          break;
        case '1m':
          cutoffDate = new Date(now);
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case '3m':
          cutoffDate = new Date(now);
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        case '6m':
          cutoffDate = new Date(now);
          cutoffDate.setMonth(now.getMonth() - 6);
          break;
        case '1y':
          cutoffDate = new Date(now);
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          cutoffDate = new Date(now);
          cutoffDate.setDate(now.getDate() - 7);
      }
      
      // Filter history data
      return this.historyData.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= cutoffDate;
      });
    }
    calculateCurrentStreak() {
  // Sort history data by date (newest first)
  const sortedData = [...this.historyData].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < sortedData.length; i++) {
    const entry = sortedData[i];
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    
    // Check if this entry is from the expected date
    const expectedDate = new Date(currentDate);
    expectedDate.setDate(currentDate.getDate() - i);
    
    if (entryDate.getTime() !== expectedDate.getTime()) {
      // Break the streak if we miss a day
      break;
    }
    
    // Only count days with 100% completion rate and at least one task
    if (entry.completionRate === 100 && entry.totalTasks > 0) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

updateStatsTiles(filteredData) {
    // Clear container
    this.statsContainer.innerHTML = '';
    
    // Calculate overall stats
    const totalTasks = filteredData.reduce((sum, day) => sum + day.totalTasks, 0);
    const completedTasks = filteredData.reduce((sum, day) => sum + day.completedTasks, 0);
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Calculate daily average
    const daysCount = filteredData.length > 0 ? filteredData.length : 1;
    const avgTasksPerDay = Math.round((totalTasks / daysCount) * 10) / 10;
    
    // Calculate current streak
    const currentStreak = this.calculateCurrentStreak();
    
    // Create stats tiles
    const statsTiles = document.createElement('div');
    statsTiles.className = 'stats-tiles';
    
    // Completion rate tile
    const completionTile = document.createElement('div');
    completionTile.className = 'stats-tile';
    
    const completionLabel = document.createElement('div');
    completionLabel.className = 'tile-label';
    completionLabel.textContent = 'Completion Rate';
    
    const completionValue = document.createElement('div');
    completionValue.className = 'tile-value';
    completionValue.textContent = `${completionRate}%`;
    
    completionTile.appendChild(completionLabel);
    completionTile.appendChild(completionValue);
    
    // Tasks completed tile
    const tasksTile = document.createElement('div');
    tasksTile.className = 'stats-tile';
    
    const tasksLabel = document.createElement('div');
    tasksLabel.className = 'tile-label';
    tasksLabel.textContent = 'Tasks Completed';
    
    const tasksValue = document.createElement('div');
    tasksValue.className = 'tile-value';
    tasksValue.textContent = completedTasks;
    
    tasksTile.appendChild(tasksLabel);
    tasksTile.appendChild(tasksValue);
    
    // Total tasks tile
    const totalTile = document.createElement('div');
    totalTile.className = 'stats-tile';
    
    const totalLabel = document.createElement('div');
    totalLabel.className = 'tile-label';
    totalLabel.textContent = 'Total Tasks';
    
    const totalValue = document.createElement('div');
    totalValue.className = 'tile-value';
    totalValue.textContent = totalTasks;
    
    totalTile.appendChild(totalLabel);
    totalTile.appendChild(totalValue);
    
    // Daily average tile
    const avgTile = document.createElement('div');
    avgTile.className = 'stats-tile';
    
    const avgLabel = document.createElement('div');
    avgLabel.className = 'tile-label';
    avgLabel.textContent = 'Avg Tasks/Day';
    
    const avgValue = document.createElement('div');
    avgValue.className = 'tile-value';
    avgValue.textContent = avgTasksPerDay;
    
    avgTile.appendChild(avgLabel);
    avgTile.appendChild(avgValue);
    
    // NEW: Current streak tile
    const streakTile = document.createElement('div');
    streakTile.className = 'stats-tile';

    const streakLabel = document.createElement('div');
    streakLabel.className = 'tile-label';
    streakLabel.textContent = 'Current Streak';

    const streakValue = document.createElement('div');
    streakValue.className = 'tile-value streak-value';

    // Create the number part
    const streakNumber = document.createElement('span');
    streakNumber.textContent = currentStreak;
    streakNumber.className = 'streak-number';

    // Create the "d" suffix with smaller text
    const streakSuffix = document.createElement('span');
    streakSuffix.textContent = `day${currentStreak !== 1 ? 's' : ''}`;
    streakSuffix.className = 'streak-suffix';

    // Add both elements to the value
    streakValue.appendChild(streakNumber);
    streakValue.appendChild(streakSuffix);

    streakTile.appendChild(streakLabel);
    streakTile.appendChild(streakValue);

    
    // Add tiles to container
    statsTiles.appendChild(completionTile);
    statsTiles.appendChild(tasksTile);
    statsTiles.appendChild(totalTile);
    statsTiles.appendChild(avgTile);
    statsTiles.appendChild(streakTile);
    
    this.statsContainer.appendChild(statsTiles);
  }
    
    renderCompletionChart(filteredData) {
        // Clear chart container
        this.chartContainer.innerHTML = '';
        
        // Create canvas for chart
        const canvas = document.createElement('canvas');
        canvas.id = 'completion-rate-chart';
        canvas.width = 600;
        canvas.height = 350;
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        canvas.style.display = 'block';
        canvas.style.margin = '0 auto';
        canvas.style.backgroundColor = 'rgb(255, 245, 235)';
        canvas.style.borderRadius = '8px';
        canvas.style.border = '1px solid rgb(255, 158, 68)';
        
        this.chartContainer.appendChild(canvas);
        
        // Prepare data for chart
        const chartData = filteredData.map(entry => {
          const date = new Date(entry.date);
          return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            completionRate: entry.completionRate
          };
        });
        
        // Draw the chart
        this.drawCompletionChart(canvas, chartData);
      }
    
      drawCompletionChart(canvas, chartData) {
        try {
          // Clear any existing chart
          if (this.chart) {
            this.chart.destroy();
          }
          
          // If no data, show message
          if (chartData.length === 0) {
            const noDataMsg = document.createElement('div');
            noDataMsg.className = 'no-data-message';
            noDataMsg.textContent = 'No data available for the selected timeframe';
            canvas.parentNode.replaceChild(noDataMsg, canvas);
            return;
          }
      
          // Prepare data for Chart.js
          const labels = chartData.map(d => d.date);
          const data = chartData.map(d => d.completionRate);
          
          // Get the 2D context from the canvas
          const ctx = canvas.getContext('2d');
          
          // Create the chart with Chart.js
          this.chart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: labels,
              datasets: [{
                label: 'Completion Rate',
                data: data,
                backgroundColor: 'rgba(255, 158, 68, 0.2)',
                borderColor: 'rgb(255, 158, 68)',
                borderWidth: 2,
                pointBackgroundColor: 'rgb(255, 145, 40)',
                pointBorderColor: 'rgb(168, 100, 35)',
                pointRadius: 5,
                pointHoverRadius: 8,
                tension: 0.1,
                fill: true
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: 'top',
                  labels: {
                    color: 'rgb(133, 68, 12)',
                    font: {
                      weight: 'bold'
                    }
                  }
                },
                tooltip: {
                  backgroundColor: 'rgb(255, 235, 218)',
                  titleColor: 'rgb(133, 68, 12)',
                  bodyColor: 'rgb(133, 68, 12)',
                  borderColor: 'rgb(255, 158, 68)',
                  borderWidth: 1,
                  caretSize: 10,
                  cornerRadius: 6,
                  displayColors: false,
                  callbacks: {
                    label: function(context) {
                      return `Completion Rate: ${context.raw}%`;
                    }
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 105,
                  ticks: {
                    callback: function(value) {
                        // Only show percentage on values up to 100
                        return value <= 100 ? value + '%' : '';
                      },
                    color: 'rgb(133, 68, 12)',
                    font: {
                      weight: 'bold'
                    }
                  },
                  grid: {
                    color: 'rgba(168, 100, 35, 0.1)'
                  }
                },
                x: {
                  ticks: {
                    color: 'rgb(133, 68, 12)',
                    font: {
                      weight: 'bold'
                    }
                  },
                  grid: {
                    color: 'rgba(168, 100, 35, 0.1)'
                  }
                }
              }
            }
          });
        } catch (error) {
          console.error('Error creating chart:', error);
        }
      }
    
    updateTaskList(filteredData) {
      // Clear task list container
      this.taskListContainer.innerHTML = '';
      
      // Create task list header
      const listHeader = document.createElement('div');
      listHeader.className = 'task-list-header';
      listHeader.textContent = 'Task Performance';
      
      this.taskListContainer.appendChild(listHeader);
      
      // Create task table
      const taskTable = document.createElement('table');
      taskTable.className = 'task-history-table';
      
      // Create table header
      const tableHeader = document.createElement('thead');
      const headerRow = document.createElement('tr');
      
      const headers = ['Task', 'Days Listed', 'Completion Rate'];
      
      headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
      });
      
      tableHeader.appendChild(headerRow);
      taskTable.appendChild(tableHeader);
      
      // Create table body
      const tableBody = document.createElement('tbody');
      
      // Calculate task stats
      const taskStats = this.calculateTaskStats(filteredData);
      
      // If no tasks, show message
      if (taskStats.length === 0) {
        const noDataRow = document.createElement('tr');
        const noDataCell = document.createElement('td');
        noDataCell.colSpan = 3;
        noDataCell.textContent = 'No task data available for the selected timeframe';
        noDataCell.className = 'no-data-message';
        
        noDataRow.appendChild(noDataCell);
        tableBody.appendChild(noDataRow);
      } else {
        // Add task rows
        taskStats.forEach(task => {
          const taskRow = document.createElement('tr');
          
          const nameCell = document.createElement('td');
          nameCell.textContent = task.text;
          nameCell.className = 'task-name-cell';
          
          const daysCell = document.createElement('td');
          daysCell.textContent = task.daysListed;
          daysCell.className = 'task-days-cell';
          
          const rateCell = document.createElement('td');
          const rateBar = document.createElement('div');
          rateBar.className = 'completion-rate-bar';
          
          const rateProgress = document.createElement('div');
          rateProgress.className = 'rate-progress';
          rateProgress.style.width = `${task.completionRate}%`;
          
          const rateText = document.createElement('span');
          rateText.textContent = `${task.completionRate}%`;
          
          rateBar.appendChild(rateProgress);
          rateBar.appendChild(rateText);
          rateCell.appendChild(rateBar);
          
          taskRow.appendChild(nameCell);
          taskRow.appendChild(daysCell);
          taskRow.appendChild(rateCell);
          
          tableBody.appendChild(taskRow);
        });
      }
      
      taskTable.appendChild(tableBody);
      this.taskListContainer.appendChild(taskTable);
    }
    
    calculateTaskStats(filteredData) {
        // Create object to track tasks
        const taskMap = {};
        
        // Process all entries in filteredData
        filteredData.forEach(entry => {
          // Include all tasks, even deleted ones
          entry.taskStats.forEach(task => {
            if (!taskMap[task.id]) {
              taskMap[task.id] = {
                id: task.id,
                text: task.text,
                daysListed: 0,
                daysCompleted: 0,
                isDeleted: task.isDeleted || false,
                firstSeen: new Date(entry.date),
                lastSeen: new Date(entry.date)
              };
            }
            
            taskMap[task.id].daysListed++;
            
            if (task.completed) {
              taskMap[task.id].daysCompleted++;
            }
            
            // Update deleted status (if it was ever deleted, mark it as deleted)
            if (task.isDeleted) {
              taskMap[task.id].isDeleted = true;
            }
            
            // Update lastSeen date
            const entryDate = new Date(entry.date);
            if (entryDate > taskMap[task.id].lastSeen) {
              taskMap[task.id].lastSeen = entryDate;
            }
          });
        });
        
        // Convert to array and calculate completion rates
        const taskStats = Object.values(taskMap).map(task => {
          return {
            ...task,
            completionRate: task.daysListed > 0 
              ? Math.round((task.daysCompleted / task.daysListed) * 100) 
              : 0
          };
        });
        
        // Sort by completion rate (descending)
        return taskStats.sort((a, b) => b.completionRate - a.completionRate);
      }
  }