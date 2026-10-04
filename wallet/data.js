// Data structure to store our financial information
const financeData = {
    currentWeek: 1,
    weeks: {
        1: {
            dailyExpenses: {
                monday: 0,
                tuesday: 0,
                wednesday: 0,
                thursday: 0,
                friday: 0,
                saturday: 0,
                sunday: 0
            },
            weeklyBudget: 0,
            weeklyTotal: 0
        }
    },
    totals: {
        savings: 0,
        projectSavings: 0,
        totalAmount: 0
    },
    wallet: {
        wallet: { 200: 0, 100: 0, 50: 0, 20: 0, 10: 0, 5: 0, 2: 0, 1: 0, 0.5: 0 },
        home: { 200: 0, 100: 0, 50: 0, 20: 0, 10: 0, 5: 0, 2: 0, 1: 0, 0.5: 0 }
    },
    expenses: {},
    
     monthlyBudgets: {
        // Format: "YYYY-MM": amount
        "2025-12": 1111,  // December 2025
        "2026-01": 1600   // January 2026
    },
    home: {
            200: 0,
            100: 0,
            50: 0,
            20: 0,
            10: 0,
            5: 0,
            2: 0,
            1: 0,
            0.5: 0
        }
    
};

// Bill denominations
const billDenominations = [200, 100, 50, 20, 10, 5, 2, 1, 0.5];

// Save data to localStorage
function saveData() {
    localStorage.setItem('financeData', JSON.stringify(financeData));
}

// Load data from localStorage
function loadData() {
    const savedData = localStorage.getItem('financeData');
    if (savedData) {
        const parsed = JSON.parse(savedData);
        // Initialize monthlyBudgets if it doesn't exist
        if (!parsed.monthlyBudgets) {
            parsed.monthlyBudgets = {};
        }
        Object.assign(financeData, parsed);
    }
}

// Calculate total amount from wallet
function calculateWalletTotal(type = 'wallet') {
    return Object.entries(financeData.wallet[type]).reduce((total, [bill, count]) => {
        return total + (parseFloat(bill) * count);
    }, 0);
}

// Calculate total amount
function calculateTotalAmount() {
    const walletTotal = calculateWalletTotal('wallet');
    const homeTotal = calculateWalletTotal('home');
    return walletTotal + homeTotal;
}

// Initialize the app
function init() {
    loadData();
    updateUI();
}

// Update the UI based on current data
function updateUI() {
    // This will be implemented in app.js
    if (typeof updateCalendar === 'function') updateCalendar();
    if (typeof updateWalletTable === 'function') updateWalletTable();
    if (typeof updateSummary === 'function') updateSummary();
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);

