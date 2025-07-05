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
    
    let html = `
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
        html += `
            <tr>
                <td>${item.outcome}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-weight: 600; min-width: 40px;">${item.probability}%</span>
                        <div class="probability-bar" style="flex: 1;">
                            <div class="probability-fill" style="width: ${item.probability}%; background: ${getProbabilityColor(item.probability)};">
                            </div>
                        </div>
                    </div>
                </td>
                <td class="odds-value">${odds}</td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
        <div class="update-time">
            Last updated: ${moment(state.marketData.lastUpdate).format('D MMM YYYY, h:mm A')}
        </div>
    `;
    
    container.innerHTML = html;
}

// Helper function to get color based on probability
function getProbabilityColor(probability) {
    if (probability >= 80) return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    if (probability >= 60) return 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)';
    if (probability >= 40) return 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)';
    if (probability >= 20) return 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)';
    return 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)';
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
