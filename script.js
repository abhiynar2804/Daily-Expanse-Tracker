document.addEventListener('DOMContentLoaded', () => {
    const loginContainer = document.getElementById('login-container');
    const signupContainer = document.getElementById('signup-container');
    const trackerContainer = document.getElementById('tracker');
    const showSignupLink = document.getElementById('show-signup');
    const showLoginLink = document.getElementById('show-login');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');
    const filterCategory = document.getElementById('filter-category');
    const userSpan = document.getElementById('user');
    const updatedBal = document.getElementById('updatedBal');
    const updatedInc = document.getElementById('updatedInc');
    const updatedExp = document.getElementById('updatedExp');

    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    let editIndex = -1;

    showSignupLink.addEventListener('click', () => {
        loginContainer.style.display = 'none';
        signupContainer.style.display = 'block';
    });

    showLoginLink.addEventListener('click', () => {
        signupContainer.style.display = 'none';
        loginContainer.style.display = 'block';
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        // Perform login logic here
        userSpan.textContent = username;
        loginContainer.style.display = 'none';
        trackerContainer.style.display = 'block';
    });

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Perform signup logic here
        signupContainer.style.display = 'none';
        loginContainer.style.display = 'block';
    });

    expenseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('expense-name').value;
        const amount = parseFloat(document.getElementById('expense-amount').value);
        const category = document.getElementById('expense-category').value;
        const date = document.getElementById('expense-date').value;
        const type = document.getElementById('itemType').value;

        const expense = { name, amount, category, date, type };

        if (editIndex === -1) {
            expenses.push(expense);
        } else {
            expenses[editIndex] = expense;
            editIndex = -1;
        }

        updateExpenses();
        expenseForm.reset();
    });

    filterCategory.addEventListener('change', updateExpenses);

    function updateExpenses() {
        const filter = filterCategory.value;
        const filteredExpenses = filter === 'All' ? expenses : expenses.filter(exp => exp.category === filter);

        expenseList.innerHTML = '';
        let totalIncome = 0;
        let totalExpenses = 0;

        filteredExpenses.forEach((expense, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${expense.name}</td>
                <td>${expense.amount.toFixed(2)}</td>
                <td>${expense.category}</td>
                <td>${expense.date}</td>
                <td>${expense.type === '0' ? 'Expense' : 'Income'}</td>
                <td><button onclick="editExpense(${index})">Edit</button></td>
                <td><button onclick="deleteExpense(${index})">Delete</button></td>
            `;
            expenseList.appendChild(row);

            if (expense.type === '0') {
                totalExpenses += expense.amount;
            } else {
                totalIncome += expense.amount;
            }
        });

        updatedBal.textContent = (totalIncome - totalExpenses).toFixed(2);
        updatedInc.textContent = totalIncome.toFixed(2);
        updatedExp.textContent = totalExpenses.toFixed(2);

        // Save expenses to local storage
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }

    window.editExpense = function(index) {
        const expense = expenses[index];
        document.getElementById('expense-name').value = expense.name;
        document.getElementById('expense-amount').value = expense.amount;
        document.getElementById('expense-category').value = expense.category;
        document.getElementById('expense-date').value = expense.date;
        document.getElementById('itemType').value = expense.type;
        editIndex = index;
    };

    window.deleteExpense = function(index) {
        expenses.splice(index, 1);
        updateExpenses();
    };

    window.logout = function() {
        trackerContainer.style.display = 'none';
        loginContainer.style.display = 'block';
    };

    // Initial call to updateExpenses to load any saved expenses
    updateExpenses();
});
