// Repayment Savings Calculator with Avocado Toast Conversion

const AVOCADO_TOAST_PRICE = 14; // Current price in AUD
const AVOCADO_INFLATION_RATE = 0.03; // 3% annual inflation
const LOAN_TERM_YEARS = 30;
const MONTHS_PER_YEAR = 12;

// Calculate monthly repayment using standard formula
function calculateMonthlyRepayment(principal, annualRate, years) {
    const monthlyRate = annualRate / 100 / MONTHS_PER_YEAR;
    const totalPayments = years * MONTHS_PER_YEAR;
    
    if (monthlyRate === 0) {
        return principal / totalPayments;
    }
    
    const monthlyPayment = principal * 
        (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
        (Math.pow(1 + monthlyRate, totalPayments) - 1);
    
    return monthlyPayment;
}

// Calculate total avocado toasts over 30 years with inflation
function calculateAvocadoToasts(monthlySaving, years) {
    let totalToasts = 0;
    let currentPrice = AVOCADO_TOAST_PRICE;
    
    for (let year = 0; year < years; year++) {
        const yearlyToasts = (monthlySaving * MONTHS_PER_YEAR) / currentPrice;
        totalToasts += yearlyToasts;
        currentPrice *= (1 + AVOCADO_INFLATION_RATE);
    }
    
    return Math.floor(totalToasts);
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Format number with commas
function formatNumber(num) {
    return new Intl.NumberFormat('en-AU').format(Math.floor(num));
}

// Calculate and display results
function calculateSavings() {
    const loanAmount = parseFloat(document.getElementById('loanAmount').value) || 0;
    const currentRate = parseFloat(document.getElementById('interestRate').value) || 0;
    
    if (loanAmount <= 0 || currentRate <= 0) {
        alert('Please enter valid loan amount and interest rate');
        return;
    }
    
    // Calculate repayments for different scenarios
    const scenarios = [
        { label: 'Current Rate', rate: currentRate, reduction: 0 },
        { label: '0.25% Cut', rate: currentRate - 0.25, reduction: 0.25 },
        { label: '0.50% Cut', rate: currentRate - 0.50, reduction: 0.50 }
    ];
    
    const results = scenarios.map(scenario => {
        const monthlyPayment = calculateMonthlyRepayment(loanAmount, scenario.rate, LOAN_TERM_YEARS);
        return {
            ...scenario,
            monthlyPayment: monthlyPayment
        };
    });
    
    // Calculate savings
    const currentPayment = results[0].monthlyPayment;
    results.forEach((result, index) => {
        result.monthlySaving = currentPayment - result.monthlyPayment;
        result.totalSaving = result.monthlySaving * LOAN_TERM_YEARS * MONTHS_PER_YEAR;
        result.monthlyAvocados = result.monthlySaving / AVOCADO_TOAST_PRICE;
        result.totalAvocados = calculateAvocadoToasts(result.monthlySaving, LOAN_TERM_YEARS);
    });
    
    // Display results
    displayResults(results, loanAmount);
}

// Display calculated results
function displayResults(results, loanAmount) {
    const container = document.getElementById('calculatorResults');
    
    let html = `
        <h3 style="font-size: 1.125rem; font-weight: 700; color: var(--text-heading); margin-bottom: var(--spacing-sm);">
            Loan Amount: ${formatCurrency(loanAmount)}
        </h3>
        <div class="results-grid">
    `;
    
    results.forEach((result, index) => {
        const isCurrentRate = index === 0;
        const cardClass = isCurrentRate ? 'current' : 'savings';
        
        html += `
            <div class="result-card ${cardClass}">
                <div class="rate-label">${result.label}</div>
                <div class="rate-value">${result.rate.toFixed(2)}%</div>
                <div class="repayment-amount">${formatCurrency(result.monthlyPayment)}</div>
                <div class="savings-detail">per month</div>
                
                ${!isCurrentRate ? `
                    <div class="savings-amount">Save ${formatCurrency(result.monthlySaving)}/month</div>
                    <div class="savings-detail">${formatCurrency(result.totalSaving)} over 30 years</div>
                    
                    <div class="avocado-section">
                        <div class="avocado-emoji">🥑</div>
                        <div class="avocado-text">
                            <span class="avocado-count">${result.monthlyAvocados.toFixed(1)}</span> extra smashed avo toasts per month
                        </div>
                        <div class="avocado-text" style="margin-top: 4px;">
                            Or <span class="avocado-count">${formatNumber(result.totalAvocados)}</span> over 30 years!
                        </div>
                    </div>
                ` : `
                    <div style="margin-top: var(--spacing-md); padding-top: var(--spacing-md); border-top: 1px solid var(--bg-border);">
                        <div class="savings-detail">Current repayment</div>
                    </div>
                `}
            </div>
        `;
    });
    
    html += `
        </div>
        
        <div class="total-savings-section">
            <div class="total-savings-title">Maximum Total Savings (0.50% cut)</div>
            <div class="total-savings-amount">${formatCurrency(results[2].totalSaving)}</div>
            <div class="total-avocados">
                That's ${formatNumber(results[2].totalAvocados)} avocado toasts over 30 years! 🥑
            </div>
        </div>
    `;
    
    container.innerHTML = html;
    
    // Animate the results
    const resultCards = container.querySelectorAll('.result-card');
    resultCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.3s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Initialize calculator
document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculateBtn');
    const loanAmountInput = document.getElementById('loanAmount');
    const interestRateInput = document.getElementById('interestRate');
    
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateSavings);
        
        // Allow Enter key to calculate
        [loanAmountInput, interestRateInput].forEach(input => {
            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        calculateSavings();
                    }
                });
            }
        });
        
        // Calculate on load with default values
        setTimeout(() => {
            calculateSavings();
        }, 500);
    }
});
