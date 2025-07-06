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

// Display market odds with enhanced styling and sorting
function displayMarketOdds() {
    const container = document.getElementById('marketOdds');
    
    if (!state.marketData) {
        container.innerHTML = '<div class="error">No market data available</div>';
        return;
    }
    
    // Sort probabilities from most likely to least likely
    const sortedProbabilities = [...state.marketData.probabilities].sort((a, b) => b.probability - a.probability);
    
    let html = `
        <table>
            <thead>
                <tr>
                    <th>Scenario</th>
                    <th>Probability</th>
                    <th>Odds</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    sortedProbabilities.forEach((item, index) => {
        // Format outcome label
        let outcomeLabel = item.outcome;
        if (item.outcome.includes('Hold')) {
            outcomeLabel = `Hold (${item.rate}%)`;
        } else if (item.outcome.includes('-0.25')) {
            outcomeLabel = 'Reduce 0.25%';
        } else if (item.outcome.includes('-0.50')) {
            outcomeLabel = 'Reduce 0.50%';
        }
        
        // Calculate fractional odds
        const fractionalOdds = formatFractionalOdds(item.probability);
        
        // Determine bar color based on probability
        const barColor = getProbabilityColor(item.probability);
        
        html += `
            <tr class="animate-in" style="animation-delay: ${index * 100}ms">
                <td><strong>${outcomeLabel}</strong></td>
                <td class="prob-cell">
                    <div class="prob-bar-container">
                        <div class="prob-bar-fill" style="width: ${Math.max(item.probability, 15)}%; background: ${barColor};">
                            <span>${item.probability}%</span>
                        </div>
                    </div>
                </td>
                <td class="odds-value">${fractionalOdds}</td>
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

// Format odds as fractional
function formatFractionalOdds(probability) {
    if (probability === 0) return '—';
    
    const decimal = 100 / probability;
    
    if (decimal >= 2) {
        // For odds 2.0 or greater, show as "X to 1"
        const value = (decimal - 1).toFixed(1);
        return `${value} to 1`;
    } else {
        // For odds less than 2.0, show as "1 to X"
        const inverseValue = (1 / (decimal - 1)).toFixed(1);
        return `1 to ${inverseValue}`;
    }
}

// Helper function to get color based on probability
function getProbabilityColor(probability) {
    if (probability >= 80) return 'linear-gradient(90deg, #10b981, #059669)';
    if (probability >= 60) return 'linear-gradient(90deg, #3b82f6, #2563eb)';
    if (probability >= 40) return 'linear-gradient(90deg, #f59e0b, #d97706)';
    if (probability >= 20) return 'linear-gradient(90deg, #ef4444, #dc2626)';
    return 'linear-gradient(90deg, #94a3b8, #64748b)';
}

// Display last 5 rate changes
function displayLastChange() {
    const container = document.getElementById('lastChange');
    
    if (!state.rateHistory) {
        container.innerHTML = '<div class="error">No rate history available</div>';
        return;
    }
    
    // Mock data for last 5 rate decisions (in production, this would come from data)
    const recentDecisions = [
        { date: 'May 2025', change: -0.25, rate: 3.85, type: 'cut' },
        { date: 'April 2025', change: 0, rate: 4.10, type: 'hold' },
        { date: 'March 2025', change: 0, rate: 4.10, type: 'hold' },
        { date: 'February 2025', change: 0.25, rate: 4.10, type: 'hike' },
        { date: 'November 2024', change: 0.25, rate: 3.85, type: 'hike' }
    ];
    
    let html = '<ul class="rate-history-list">';
    
    recentDecisions.forEach((decision, index) => {
        const arrow = decision.type === 'cut' ? '↓' : decision.type === 'hike' ? '↑' : '→';
        const changeText = decision.type === 'hold' ? 'Hold' : `${Math.abs(decision.change * 100)}bp ${decision.type}`;
        
        html += `
            <li class="rate-history-item animate-in" style="animation-delay: ${index * 100}ms">
                <div class="rate-details">
                    <span class="rate-indicator ${decision.type}">${arrow}</span>
                    <span class="rate-change">${changeText}</span>
                    <span class="rate-date">— ${decision.date}</span>
                </div>
                <span class="rate-value">(${decision.rate.toFixed(2)}%)</span>
            </li>
        `;
    });
    
    html += '</ul>';
    container.innerHTML = html;
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
