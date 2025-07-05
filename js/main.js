// Main application logic for RBA Market Odds Dashboard

// Configuration
const CONFIG = {
    refreshInterval: 300000, // 5 minutes
    dataPath: './data/',
    timezone: 'Australia/Sydney'
};

// State management
const state = {
    marketData: null,
    rateHistory: null,
    meetings: null,
    lastUpdate: null
};

// Initialize moment timezone
moment.tz.setDefault(CONFIG.timezone);

// Data loading functions
async function loadData() {
    try {
        showLoadingState();
        
        // Load all data files
        const [marketData, rateHistory, meetings] = await Promise.all([
            fetch(`${CONFIG.dataPath}market-odds.json`).then(r => r.json()),
            fetch(`${CONFIG.dataPath}rate-history.json`).then(r => r.json()),
            fetch(`${CONFIG.dataPath}meetings.json`).then(r => r.json())
        ]);
        
        // Update state
        state.marketData = marketData;
        state.rateHistory = rateHistory;
        state.meetings = meetings;
        state.lastUpdate = new Date();
        
        // Update UI
        updateDashboard();
        hideLoadingState();
        
    } catch (error) {
        console.error('Error loading data:', error);
        showError('Failed to load data. Please refresh the page.');
    }
}

// Display market odds
function displayMarketOdds() {
    const container = document.getElementById('marketOdds');
    
    if (!state.marketData) {
        container.innerHTML = '<div class="error">No market data available</div>';
        return;
    }
    
    // Add inline styles for probability bars
    let html = `
        <style>
            .prob-bar-container {
                width: 100%;
                height: 24px;
                background: #334155;
                border-radius: 12px;
                overflow: hidden;
                margin-top: 8px;
            }
            .prob-bar-fill {
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 0.85rem;
                font-weight: 500;
                transition: width 0.5s ease;
            }
            .prob-cell {
                min-width: 250px;
            }
        </style>
        <table>
            <thead>
                <tr>
                    <th>Outcome</th>
                    <th>Probability</th>
                    <th>Decimal Odds</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    state.marketData.probabilities.forEach(item => {
        const odds = item.probability > 0 ? (100 / item.probability).toFixed(2) : '-';
        const barColor = getProbabilityColor(item.probability);
        
        html += `
            <tr>
                <td>${item.outcome}</td>
                <td class="prob-cell">
                    <div style="font-weight: 600; font-size: 1.1rem; margin-bottom: 4px;">${item.probability}%</div>
                    <div class="prob-bar-container">
                        <div class="prob-bar-fill" style="width: ${item.probability}%; background: ${barColor};">
                            ${item.probability}%
                        </div>
                    </div>
                </td>
                <td class="odds-value" style="font-size: 1.2rem; font-weight: 700; color: #60a5fa;">${odds}</td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
        <div class="update-time" style="margin-top: 16px; text-align: right; color: #94a3b8; font-size: 0.9rem;">
            Last updated: ${moment(state.marketData.lastUpdate).format('D MMM YYYY, h:mm A')}
        </div>
    `;
    
    container.innerHTML = html;
}

// Helper function to get color based on probability
function getProbabilityColor(probability) {
    if (probability >= 80) return 'linear-gradient(90deg, #10b981, #059669)';
    if (probability >= 60) return 'linear-gradient(90deg, #60a5fa, #3b82f6)';
    if (probability >= 40) return 'linear-gradient(90deg, #fbbf24, #f59e0b)';
    if (probability >= 20) return 'linear-gradient(90deg, #f87171, #ef4444)';
    return 'linear-gradient(90deg, #94a3b8, #64748b)';
}

// Display last rate change
function displayLastChange() {
    const container = document.getElementById('lastChange');
    
    if (!state.rateHistory || !state.rateHistory.lastChange) {
        container.innerHTML = '<div class="error">No rate history available</div>';
        return;
    }
    
    const change = state.rateHistory.lastChange;
    const changeAmount = change.newRate - change.previousRate;
    const isPositive = changeAmount > 0;
    const basisPoints = Math.abs(changeAmount * 100).toFixed(0);
    
    container.innerHTML = `
        <div class="last-change">
            <div>
                <div style="font-size: 0.9rem; color: #94a3b8; margin-bottom: 4px;">
                    ${moment(change.date).format('D MMMM YYYY')}
                </div>
                <div style="color: #e2e8f0;">
                    ${change.previousRate.toFixed(2)}% → ${change.newRate.toFixed(2)}%
                </div>
            </div>
            <div class="change-amount ${isPositive ? 'positive' : 'negative'}">
                ${isPositive ? '+' : '-'}${basisPoints}bps
            </div>
        </div>
    `;
}

// Update entire dashboard
function updateDashboard() {
    displayMarketOdds();
    displayLastChange();
    updateCountdown();
    if (window.createHistoricalChart) {
        window.createHistoricalChart(state.rateHistory);
    }
}

// Loading states
function showLoadingState() {
    document.querySelectorAll('.card').forEach(card => {
        card.classList.add('updating');
    });
}

function hideLoadingState() {
    document.querySelectorAll('.card').forEach(card => {
        card.classList.remove('updating');
    });
}

// Error handling
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '20px';
    errorDiv.style.right = '20px';
    errorDiv.style.zIndex = '1000';
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Auto-refresh functionality
function startAutoRefresh() {
    setInterval(() => {
        console.log('Auto-refreshing data...');
        loadData();
    }, CONFIG.refreshInterval);
}

// Export functions for use in other modules
window.dashboardState = state;
window.loadDashboardData = loadData;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    startAutoRefresh();
});
