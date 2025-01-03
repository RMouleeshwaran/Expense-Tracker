// Initialize data
let transactions = [];
let users = [];
let notifications = [];

// DOM Elements
const elements = {
    totalIncome: document.getElementById('totalIncome'),
    totalExpenses: document.getElementById('totalExpenses'),
    balance: document.getElementById('balance'),
    spendingChart: document.getElementById('spendingChart'),
    transactionForm: document.getElementById('transactionForm'),
    transactionList: document.getElementById('transactionList'),
    userForm: document.getElementById('userForm'),
    userList: document.getElementById('userList'),
    notificationList: document.getElementById('notificationList')
};

// Initialize Chart
let chart = null;
function initializeChart() {
    const ctx = elements.spendingChart.getContext('2d');
    const data = calculateTotals();
    
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Income', 'Expenses'],
            datasets: [{
                data: [data.income, data.expenses],
                backgroundColor: ['rgba(46, 204, 113, 0.6)', 'rgba(231, 76, 60, 0.6)'],
                borderColor: ['#2ecc71', '#e74c3c'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => `$${value}`
                    }
                }
            }
        }
    });
}

// Calculate totals
function calculateTotals() {
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    return {
        income,
        expenses,
        balance: income - expenses
    };
}

// Update summary
function updateSummary() {
    const totals = calculateTotals();
    elements.totalIncome.textContent = `$${totals.income.toLocaleString()}`;
    elements.totalExpenses.textContent = `$${totals.expenses.toLocaleString()}`;
    elements.balance.textContent = `$${totals.balance.toLocaleString()}`;
    
    if (chart) {
        chart.data.datasets[0].data = [totals.income, totals.expenses];
        chart.update();
    }
}

// Render transactions
function renderTransactions() {
    elements.transactionList.innerHTML = '';
    transactions.forEach(transaction => {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `
            <div class="details">
                <span>${transaction.description}</span>
                <span class="amount ${transaction.type}">
                    ${transaction.type === 'income' ? '+' : '-'}$${transaction.amount}
                </span>
            </div>
            <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">
                Delete
            </button>
        `;
        elements.transactionList.appendChild(div);
    });
}

// Add transaction
function addTransaction(e) {
    e.preventDefault();
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;
    
    const transaction = {
        id: Date.now(),
        description,
        amount,
        type
    };
    
    transactions.push(transaction);
    addNotification(`New ${type}: ${description} - $${amount}`);
    
    updateSummary();
    renderTransactions();
    e.target.reset();
}

// Delete transaction
function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateSummary();
    renderTransactions();
    addNotification('Transaction deleted');
}

// User management
function addUser(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    
    const user = {
        id: Date.now(),
        name,
        email
    };
    
    users.push(user);
    renderUsers();
    addNotification(`New user added: ${name}`);
    e.target.reset();
}

function renderUsers() {
    elements.userList.innerHTML = '';
    users.forEach(user => {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `
            <div class="details">
                <span>${user.name}</span>
                <small>${user.email}</small>
            </div>
            <button class="delete-btn" onclick="deleteUser(${user.id})">
                Delete
            </button>
        `;
        elements.userList.appendChild(div);
    });
}

function deleteUser(id) {
    users = users.filter(u => u.id !== id);
    renderUsers();
    addNotification('User deleted');
}

// Notifications
function addNotification(message) {
    const notification = {
        id: Date.now(),
        message,
        timestamp: new Date().toLocaleTimeString()
    };
    
    notifications.unshift(notification);
    if (notifications.length > 5) notifications.pop();
    renderNotifications();
}

function renderNotifications() {
    elements.notificationList.innerHTML = '';
    notifications.forEach(notification => {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `
            <div class="details">
                <span>${notification.message}</span>
                <small>${notification.timestamp}</small>
            </div>
        `;
        elements.notificationList.appendChild(div);
    });
}

// Event listeners
elements.transactionForm.addEventListener('submit', addTransaction);
elements.userForm.addEventListener('submit', addUser);

// Initialize dashboard
window.addEventListener('load', () => {
    initializeChart();
    updateSummary();
    renderTransactions();
    renderUsers();
    renderNotifications();
});