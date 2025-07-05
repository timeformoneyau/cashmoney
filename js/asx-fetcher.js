// Dynamic ASX RBA Rate Tracker fetcher

class ASXRateFetcher {
    constructor() {
        // Use your backend API endpoint
        this.apiEndpoint = '/api/rba-probabilities';
        // For GitHub Pages, you might use a service like this:
        // this.apiEndpoint = 'https://your-api-server.com/api/rba-probabilities';
        
        // Cache settings
        this.cacheKey = 'asx_rate_data';
        this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
        
        // Animation settings
        this.animationDuration = 1000;
    }
    
    async fetchProbabilities() {
        try {
            // Check cache first
            const cached = this.getCachedData();
            if (cached) {
                return cached;
            }
            
            // Fetch fresh data
            const response = await fetch(this.apiEndpoint);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            
            const data = await response.json();
            
            // Cache the data
            this.cacheData(data);
            
            return data;
        } catch (error) {
            console.error('Error fetching ASX data:', error);
            // Fall back to static data or last known good data
            return this.getFallbackData();
        }
    }
    
    getCachedData() {
        try {
            const cached = localStorage.getItem(this.cacheKey);
            if (!cached) return null;
            
            const { data, timestamp } = JSON.parse(cached);
            const age = Date.now() - timestamp;
            
            if (age < this.cacheExpiry) {
                return data;
            }
        } catch (e) {
            // Invalid cache
        }
        return null;
    }
    
    cacheData(data) {
        try {
            localStorage.setItem(this.cacheKey, JSON.stringify({
                data: data,
                timestamp: Date.now()
            }));
        } catch (e) {
            // Storage might be full
            console.warn('Failed to cache data:', e);
        }
    }
    
    getFallbackData() {
        // Use the current static data as fallback
        return window.dashboardState?.marketData || {
            nextMeeting: '2025-07-08',
            source: 'ASX RBA Rate Tracker (Offline)',
            lastUpdate: new Date().toISOString(),
            probabilities: [
                {
                    outcome: 'Hold (3.85%)',
                    rate: 3.85,
                    probability: 3,
                    impliedOdds: 33.33
                },
                {
                    outcome: '-0.25% (3.60%)',
                    rate: 3.60,
                    probability: 97,
                    impliedOdds: 1.03
                }
            ]
        };
    }
    
    displayProbabilities(data) {
        const container = document.getElementById('marketOdds');
        if (!container) return;
        
        // Build enhanced table with animations
        let html = `
            <table class="probability-table">
                <thead>
                    <tr>
                        <th>Outcome</th>
                        <th>Probability</th>
                        <th>Change</th>
                        <th>Decimal Odds</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        data.probabilities.forEach((item, index) => {
            const changeData = data.changes?.[item.outcome] || { change: 0, direction: 'unchanged' };
            const changeClass = changeData.direction;
            const changeSymbol = changeData.change > 0 ? '+' : '';
            
            html += `
                <tr class="probability-row" data-index="${index}">
                    <td>${item.outcome}</td>
                    <td class="probability-cell">
                        <span class="probability-value">${item.probability}%</span>
                        <div class="probability-bar">
                            <div class="probability-fill ${this.getProbabilityClass(item.probability)}" 
                                 style="width: 0%"
                                 data-target="${item.probability}">
                                <span class="bar-label">${item.probability}%</span>
                            </div>
                        </div>
                    </td>
                    <td class="change-cell ${changeClass}">
                        ${changeSymbol}${changeData.change}%
                        <span class="change-arrow">${this.getChangeArrow(changeData.direction)}</span>
                    </td>
                    <td class="odds-value">${item.impliedOdds.toFixed(2)}</td>
                </tr>
            `;
        });
        
        html += `
                </tbody>
            </table>
            <div class="market-meta">
                <div class="update-time">
                    <span class="live-indicator ${data.source.includes('Offline') ? 'offline' : 'online'}"></span>
                    Last updated: ${moment(data.lastUpdate).format('D MMM YYYY, h:mm A')}
                </div>
                <div class="next-update">
                    Next update in: <span id="updateCountdown">5:00</span>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        
        // Animate probability bars
        setTimeout(() => this.animateProbabilityBars(), 100);
        
        // Start update countdown
        this.startUpdateCountdown();
    }
    
    animateProbabilityBars() {
        const bars = document.querySelectorAll('.probability-fill');
        bars.forEach((bar, index) => {
            const target = parseFloat(bar.getAttribute('data-target'));
            setTimeout(() => {
                bar.style.transition = `width ${this.animationDuration}ms ease-out`;
                bar.style.width = `${target}%`;
            }, index * 100);
        });
    }
    
    getProbabilityClass(probability) {
        if (probability >= 80) return 'very-likely';
        if (probability >= 60) return 'likely';
        if (probability >= 40) return 'possible';
        if (probability >= 20) return 'unlikely';
        return 'very-unlikely';
    }
    
    getChangeArrow(direction) {
        const arrows = {
            'up': '↑',
            'down': '↓',
            'unchanged': '→'
        };
        return arrows[direction] || '→';
    }
    
    startUpdateCountdown() {
        let seconds = 300; // 5 minutes
        const countdownEl = document.getElementById('updateCountdown');
        
        const updateCountdown = () => {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            if (countdownEl) {
                countdownEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
            }
            
            seconds--;
            if (seconds < 0) {
                // Refresh data
                this.refreshData();
                seconds = 300;
            }
        };
        
        // Clear any existing interval
        if (window.updateCountdownInterval) {
            clearInterval(window.updateCountdownInterval);
        }
        
        window.updateCountdownInterval = setInterval(updateCountdown, 1000);
        updateCountdown(); // Run immediately
    }
    
    async refreshData() {
        const container = document.getElementById('marketOdds');
        if (container) {
            container.classList.add('updating');
        }
        
        const data = await this.fetchProbabilities();
        this.displayProbabilities(data);
        
        if (container) {
            container.classList.remove('updating');
        }
    }
}

// Initialize and integrate with main app
const asxFetcher = new ASXRateFetcher();

// Override the display function in main.js
window.displayMarketOdds = async function() {
    const data = await asxFetcher.fetchProbabilities();
    asxFetcher.displayProbabilities(data);
};

// Auto-refresh on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initial load after other scripts initialize
    setTimeout(() => {
        window.displayMarketOdds();
    }, 500);
});
