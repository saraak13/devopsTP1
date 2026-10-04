// DOM Elements
const calendarEl = document.getElementById('calendar');
const walletTableEl = document.getElementById('wallet-table');
const prevWeekBtn = document.getElementById('prev-week');
const nextWeekBtn = document.getElementById('next-week');
const currentWeekEl = document.getElementById('current-week');
const totalAmountEl = document.getElementById('total-amount');
const savingsAmountEl = document.getElementById('savings-amount');
const projectAmountEl = document.getElementById('project-amount');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');
const currentMonthEl = document.getElementById('current-month');
const monthlyBudgetAmount = document.getElementById('monthly-budget-amount');
const editBudgetBtn = document.getElementById('edit-budget');

let currentViewDate = new Date();
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function initApp() {
    // Load data from localStorage
    const savedData = localStorage.getItem('financeData');
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (!parsedData.totals) {
            parsedData.totals = {
                savings: 0,
                projectSavings: 0,
                totalAmount: 0
            };
        }
        Object.assign(financeData, parsedData);
    } else {
        financeData.totals = financeData.totals || {
            savings: 0,
            projectSavings: 0,
            totalAmount: 0
        };
    }
    setupEventListeners();
    updateUI();
    updateCalendar();
}

function saveData() {
    localStorage.setItem('financeData', JSON.stringify(financeData));
}

function setupEventListeners() {
    // Month navigation
    prevMonthBtn.addEventListener('click', () => {
        currentViewDate.setMonth(currentViewDate.getMonth() - 1);
        updateCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentViewDate.setMonth(currentViewDate.getMonth() + 1);
        updateCalendar();
    });

    // Wallet inputs
    document.addEventListener('input', (e) => {
        if (e.target.classList.contains('bill-input')) {
            const bill = parseFloat(e.target.dataset.bill);
            const type = e.target.dataset.type;
            const value = parseInt(e.target.value) || 0;
            
            financeData.wallet[type][bill] = value;
            saveData();
            updateWalletTable();
        }
    });

    // Expense inputs
    document.addEventListener('input', (e) => {
        if (e.target.classList.contains('expense-input')) {
            const dateKey = e.target.dataset.date;
            const value = parseFloat(e.target.value) || 0;
            
            financeData.expenses[dateKey] = value;
            
            const dayAmount = e.target.previousElementSibling;
            if (dayAmount && dayAmount.classList.contains('day-amount')) {
                dayAmount.textContent = value ? `${value.toFixed(2)}` : '0.00';
            }
            
            saveData();
            updateSummary();
        }
    });

    // Savings and Project amount editing
    savingsAmountEl.addEventListener('blur', function() {
        const value = parseFloat(this.textContent) || 0;
        financeData.totals.savings = value;
        saveData();
        updateSummary();
    });

    projectAmountEl.addEventListener('blur', function() {
        const value = parseFloat(this.textContent) || 0;
        financeData.totals.projectSavings = value;
        saveData();
        updateSummary();
    });

    // Edit monthly budget
    editBudgetBtn.addEventListener('click', () => {
        const year = currentViewDate.getFullYear();
        const month = String(currentViewDate.getMonth() + 1).padStart(2, '0');
        const monthKey = `${year}-${month}`;
        
        const currentBudget = financeData.monthlyBudgets[monthKey] || 0;
        const newBudget = prompt('Enter monthly budget:', currentBudget);
        
        if (newBudget !== null) {
            const amount = parseFloat(newBudget) || 0;
            financeData.monthlyBudgets[monthKey] = amount;
            saveData();
            updateMonthlyBudget();
            updateSummary();
        }
    });
}

function updateUI() {
    updateWalletTable();
    updateSummary();
    updateMonthlyBudget();
}

function updateMonthlyBudget() {
    const year = currentViewDate.getFullYear();
    const month = String(currentViewDate.getMonth() + 1).padStart(2, '0');
    const monthKey = `${year}-${month}`;
    const budget = financeData.monthlyBudgets[monthKey] || 0;
    monthlyBudgetAmount.textContent = budget.toFixed(2);
}

function calculateWalletTotal(type) {
    return billDenominations.reduce((total, bill) => {
        return total + (bill * (financeData.wallet[type][bill] || 0));
    }, 0);
}

function updateWalletTable() {
    const tbody = walletTableEl.querySelector('tbody');
    if (!tbody) return;

    while (tbody.rows.length > 0) {
        tbody.deleteRow(0);
    }

    const walletRow = tbody.insertRow();
    const homeRow = tbody.insertRow();
    
    walletRow.insertCell().textContent = 'In Wallet';
    homeRow.insertCell().textContent = 'At Home';

    billDenominations.forEach(bill => {
        const walletCell = walletRow.insertCell();
        const walletInput = document.createElement('input');
        walletInput.type = 'number';
        walletInput.className = 'bill-input';
        walletInput.dataset.bill = bill;
        walletInput.dataset.type = 'wallet';
        walletInput.value = financeData.wallet.wallet[bill] || 0;
        walletInput.min = '0';
        walletCell.appendChild(walletInput);

        const homeCell = homeRow.insertCell();
        const homeInput = document.createElement('input');
        homeInput.type = 'number';
        homeInput.className = 'bill-input';
        homeInput.dataset.bill = bill;
        homeInput.dataset.type = 'home';
        homeInput.value = financeData.wallet.home[bill] || 0;
        homeInput.min = '0';
        homeCell.appendChild(homeInput);
    });

    const walletTotalCell = walletRow.insertCell();
    walletTotalCell.textContent = calculateWalletTotal('wallet').toFixed(2) + ' MAD';
    
    const homeTotalCell = homeRow.insertCell();
    homeTotalCell.textContent = calculateWalletTotal('home').toFixed(2) + ' MAD';
}

function updateSummary() {
    financeData.totals = financeData.totals || {
        savings: 0,
        projectSavings: 0,
        totalAmount: 0
    };

    const totalMonthlyBudgets = Object.values(financeData.monthlyBudgets || {}).reduce(
        (sum, budget) => sum + (parseFloat(budget) || 0), 
        0
    );

    const newTotal = (parseFloat(financeData.totals.savings) || 0) + 
                    (parseFloat(financeData.totals.projectSavings) || 0) + 
                    totalMonthlyBudgets;
    
    totalAmountEl.textContent = newTotal.toFixed(2);
    savingsAmountEl.textContent = (financeData.totals.savings || 0).toFixed(2);
    projectAmountEl.textContent = (financeData.totals.projectSavings || 0).toFixed(2);
    
    saveData();
}

function calculateWeeklyTotal(year, month, startDay, endDay) {
    let total = 0;
    for (let day = startDay; day <= endDay; day++) {
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        total += parseFloat(financeData.expenses[dateKey]) || 0;
    }
    return total;
}

function updateCalendar() {
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();
    const now = new Date();
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];
    currentMonthEl.textContent = `${monthNames[month]} ${year}`;
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    calendarEl.innerHTML = '';
    
    // Add day headers
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Total'];
    dayNames.forEach((day, index) => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'day-header';
        dayHeader.textContent = index === 7 ? '' : day;
        calendarEl.appendChild(dayHeader);
    });
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'day empty';
        calendarEl.appendChild(emptyDay);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(year, month, day);
        const dayOfWeek = currentDate.getDay();
        const dayName = days[dayOfWeek];
        const dayKey = dayName.toLowerCase();
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        const dayEl = document.createElement('div');
        dayEl.className = 'day';
        dayEl.style.gridColumn = (dayOfWeek + 1) + ' / span 1';
        
        const dayHeader = document.createElement('div');
        dayHeader.className = 'day-number';
        dayHeader.textContent = day;
        
        const expenseValue = financeData.expenses[dateKey] || 0;
        
        const dayAmount = document.createElement('div');
        dayAmount.className = 'day-amount';
        dayAmount.textContent = expenseValue ? `${expenseValue.toFixed(2)}` : '0.00';
        
        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'expense-input';
        input.dataset.day = dayKey;
        input.dataset.date = dateKey;
        input.value = expenseValue || '';
        input.placeholder = '0.00';
        input.step = '0.01';
        input.min = '0';
        
        dayEl.appendChild(dayHeader);
        dayEl.appendChild(dayAmount);
        dayEl.appendChild(input);
        
        if (currentDate.toDateString() === now.toDateString() && 
            currentViewDate.getMonth() === now.getMonth() && 
            currentViewDate.getFullYear() === now.getFullYear()) {
            dayEl.classList.add('today');
        }
        
        calendarEl.appendChild(dayEl);
    }
    
    // Add weekly totals
    const weekRows = Math.ceil((firstDayOfWeek + daysInMonth) / 7);
    for (let week = 0; week < weekRows; week++) {
        const weekStartDay = (week * 7) - firstDayOfWeek + 1;
        const weekEndDay = Math.min(weekStartDay + 6, daysInMonth);
        
        if (weekStartDay <= daysInMonth) {
            const weekTotal = calculateWeeklyTotal(year, month, Math.max(1, weekStartDay), weekEndDay);
            const weekTotalEl = document.createElement('div');
            weekTotalEl.className = 'week-total';
            weekTotalEl.textContent = weekTotal.toFixed(2);
            weekTotalEl.style.gridColumn = '8';
            weekTotalEl.style.gridRow = week + 2; // +1 for header row, +1 because grid is 1-based
            calendarEl.appendChild(weekTotalEl);
        }
    }

    updateMonthlyBudget();
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);