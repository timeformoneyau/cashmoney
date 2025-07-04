// Chart.js configuration and creation for RBA rate history

let rateChart = null;

// Chart configuration
const chartConfig = {
    type: 'line',
    options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            intersect: false,
            mode: 'index'
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                titleColor: '#e2e8f0',
                bodyColor: '#cbd5e1',
                borderColor: '#334155',
                borderWidth: 1,
                padding: 12,
                displayColors: false,
                callbacks: {
                    label: function(context) {
                        return `Rate: ${context.parsed.y.toFixed(2)}%`;
                    },
                    title: function(tooltipItems) {
                        return moment(tooltipItems[0].label, 'YYYY-MM').format('MMMM YYYY');
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    color: '#334155',
                    drawBorder: false
                },
                ticks: {
                    color: '#94a3b8',
                    maxTicksLimit: 12,
                    callback: function(value, index) {
                        // Show every 6th month
                        if (index % 6 === 0) {
                            const date = this.getLabelForValue(value);
                            return moment(date, 'YYYY-MM').format('MMM YYYY');
                        }
                        return '';
                    }
                }
            },
            y: {
                grid: {
                    color: '#334155',
                    drawBorder: false
                },
                ticks: {
                    color: '#94a3b8',
                    callback: function(value) {
                        return value.toFixed(2) + '%';
                    }
                },
                suggestedMin: 0,
                suggestedMax: 5
            }
        }
    }
};

// Create or update the historical chart
function createHistoricalChart(rateHistory) {
    const ctx = document.getElementById('rateChart');
    if (!ctx) return;
    
    const chartContext = ctx.getContext('2d');
    
    // Hide loading message
    const chartStatus = document.getElementById('chartStatus');
    if (chartStatus) {
        chartStatus.style.display = 'none';
    }
    
    // Prepare data
    let dataPoints = [];
    
    if (rateHistory && rateHistory.historical) {
        dataPoints = rateHistory.historical.map(item => ({
            x: item.date,
            y: item.rate
        }));
    } else {
        // Fallback data if no data available
        dataPoints = generateFallbackData();
    }
    
    // Sort by date
    dataPoints.sort((a, b) => a.x.localeCompare(b.x));
    
    // Create chart data structure
    const chartData = {
        labels: dataPoints.map(d => d.x),
        datasets: [{
            label: 'Cash Rate (%)',
            data: dataPoints.map(d => d.y),
            borderColor: '#60a5fa',
            backgroundColor: 'rgba(96, 165, 250, 0.1)',
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: '#60a5fa',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2,
            tension: 0.1,
            fill: true
        }]
    };
    
    // Create or update chart
    if (rateChart) {
        rateChart.data = chartData;
        rateChart.update('none'); // Update without animation
    } else {
        rateChart = new Chart(chartContext, {
            ...chartConfig,
            data: chartData
        });
    }
}

// Generate fallback data for demo purposes
function generateFallbackData() {
    const endDate = moment();
    const startDate = moment().subtract(5, 'years');
    const dataPoints = [];
    
    // Historical RBA rates (simplified)
    const historicalRates = [
        { date: '2020-01', rate: 0.75 },
        { date: '2020-03', rate: 0.50 },
        { date: '2020-04', rate: 0.25 },
        { date: '2020-11', rate: 0.10 },
        { date: '2022-05', rate: 0.35 },
        { date: '2022-06', rate: 0.85 },
        { date: '2022-07', rate: 1.35 },
        { date: '2022-08', rate: 1.85 },
        { date: '2022-09', rate: 2.35 },
        { date: '2022-10', rate: 2.60 },
        { date: '2022-11', rate: 2.85 },
        { date: '2022-12', rate: 3.10 },
        { date: '2023-02', rate: 3.35 },
        { date: '2023-03', rate: 3.60 },
        { date: '2023-05', rate: 3.85 },
        { date: '2023-06', rate: 4.10 },
        { date: '2023-11', rate: 4.35 },
        { date: '2024-01', rate: 4.35 },
        { date: '2024-12', rate: 4.35 },
        { date: '2025-01', rate: 4.35 }
    ];
    
    // Fill in the gaps with interpolated data
    let currentDate = startDate.clone();
    let rateIndex = 0;
    
    while (currentDate.isBefore(endDate)) {
        const dateStr = currentDate.format('YYYY-MM');
        
        // Check if we have a specific rate for this month
        const specificRate = historicalRates.find(r => r.date === dateStr);
        
        if (specificRate) {
            dataPoints.push({
                x: dateStr,
                y: specificRate.rate
            });
            rateIndex = historicalRates.indexOf(specificRate);
        } else {
            // Interpolate or use last known rate
            const lastRate = rateIndex > 0 ? historicalRates[rateIndex].rate : 0.75;
            dataPoints.push({
                x: dateStr,
                y: lastRate
            });
        }
        
        currentDate.add(1, 'month');
    }
    
    return dataPoints;
}

// Destroy chart (for cleanup)
function destroyChart() {
    if (rateChart) {
        rateChart.destroy();
        rateChart = null;
    }
}

// Export functions
window.createHistoricalChart = createHistoricalChart;
window.destroyChart = destroyChart;
