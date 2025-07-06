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
                    <th>Decision</th>
                    <th>Probability</th>
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
            outcomeLabel = 'Cut 0.25%';
        } else if (item.outcome.includes('-0.50')) {
            outcomeLabel = 'Cut 0.50%';
        }
        
        // Determine bar color and width
        const barColor = getProbabilityColor(item.probability);
        const barWidth = item.probability > 0 ? Math.max(item.probability, 2) : 0;
        
        html += `
            <tr class="animate-in" style="animation-delay: ${index * 100}ms">
                <td style="font-size: 1rem;"><strong>${outcomeLabel}</strong></td>
                <td class="prob-cell">
                    <div class="prob-bar-container">
                        ${item.probability > 0 ? `
                            <div class="prob-bar-fill" style="width: ${barWidth}%; background: ${barColor};">
                                <span>${item.probability}%</span>
                            </div>
                        ` : `
                            <div style="padding: 0 var(--spacing-sm); color: var(--text-muted); font-size: 0.875rem;">0%</div>
                        `}
                    </div>
                </td>
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
    // Use sage green from the brunch-inspired palette
    return '#7C9070';
}

// Display last 6 rate decisions
function displayLastChange() {
    const container = document.getElementById('lastChange');
    
    if (!state.rateHistory) {
        container.innerHTML = '<div class="error">No rate history available</div>';
        return;
    }
    
    // Accurate RBA rate decisions - last 6 meetings
    const recentDecisions = [
        { date: 'June 2025', change: 0, rate: 3.85, type: 'hold', emoji: '😴' },
        { date: 'May 2025', change: -0.25, rate: 3.85, type: 'cut', emoji: '🎉' },
        { date: 'April 2025', change: 0, rate: 4.10, type: 'hold', emoji: '😴' },
        { date: 'March 2025', change: 0, rate: 4.10, type: 'hold', emoji: '😴' },
        { date: 'February 2025', change: -0.25, rate: 4.10, type: 'cut', emoji: '🎉' },
        { date: 'December 2024', change: 0, rate: 4.35, type: 'hold', emoji: '😴' }
    ];
    
    let html = '<ul class="rate-history-list">';
    
    recentDecisions.forEach((decision, index) => {
        const arrow = decision.type === 'cut' ? '↓' : decision.type === 'hike' ? '↑' : '→';
        const changeText = decision.type === 'hold' ? 'Hold' : `${Math.abs(decision.change * 100)}bp ${decision.type}`;
        
        html += `
            <li class="rate-history-item animate-in" style="animation-delay: ${index * 100}ms">
                <div class="rate-details">
                    <span class="rate-emoji">${decision.emoji}</span>
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
