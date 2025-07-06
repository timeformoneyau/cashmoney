// Chart.js configuration and creation for RBA rate history

// Create or update the historical chart with enhanced styling
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
        dataPoints = generateFallbackData();
    }
    
    // Sort by date
    dataPoints.sort((a, b) => a.x.localeCompare(b.x));
    
    // Find July data points for special labeling
    const julyPoints = dataPoints.filter(point => point.x.includes('-07'));
    
    // Create gradient with enhanced colors
    const gradient = chartContext.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(124, 144, 112, 0.3)');
    gradient.addColorStop(0.5, 'rgba(139, 170, 98, 0.2)');
    gradient.addColorStop(1, 'rgba(139, 170, 98, 0.0)');
    
    // Chart configuration with enhanced styling
    const config = {
        type: 'line',
        data: {
            labels: dataPoints.map(d => d.x),
            datasets: [{
                label: 'Cash Rate (%)',
                data: dataPoints.map(d => d.y),
                borderColor: '#7C9070',
                backgroundColor: gradient,
                borderWidth: 3,
                pointRadius: 0,
                pointHoverRadius: 8,
                pointHoverBackgroundColor: '#7C9070',
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 3,
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                title: {
                    display: true,
                    text: 'RBA Cash Rate – Past 5 Years',
                    font: {
                        size: 16,
                        weight: '700',
                        family: 'Inter, sans-serif'
                    },
                    color: '#2C2C2C',
                    padding: {
                        top: 0,
                        bottom: 20
                    }
                },
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#2C2C2C',
                    bodyColor: '#4A4A4A',
                    borderColor: '#E8E3DD',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    cornerRadius: 6,
                    bodyFont: {
                        size: 14,
                        weight: '500'
                    },
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
                        color: 'rgba(229, 231, 235, 0.5)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#7A7A7A',
                        font: {
                            size: 11,
                            weight: '500'
                        },
                        maxTicksLimit: 12,
                        callback: function(value, index) {
                            const label = this.getLabelForValue(value);
                            const date = moment(label, 'YYYY-MM');
                            
                            // Show July labels
                            if (date.month() === 6) { // July is month 6 (0-indexed)
                                return date.format('MMM YYYY');
                            }
                            
                            // Show every 6th month
                            if (index % 6 === 0) {
                                return date.format('MMM YYYY');
                            }
                            return '';
                        }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(229, 231, 235, 0.5)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#7A7A7A',
                        font: {
                            size: 11,
                            weight: '500'
                        },
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
    
    // Add July annotations
    if (Chart.defaults.plugins.annotation) {
        config.options.plugins.annotation = {
            annotations: {}
        };
        
        julyPoints.forEach(point => {
            const date = moment(point.x, 'YYYY-MM');
            if (date.year() >= 2021) {
                config.options.plugins.annotation.annotations[`july${date.year()}`] = {
                    type: 'point',
                    xValue: point.x,
                    yValue: point.y,
                    backgroundColor: '#7C9070',
                    borderColor: '#fff',
                    borderWidth: 2,
                    radius: 5,
                    label: {
                        display: true,
                        content: `${point.y.toFixed(2)}%`,
                        position: 'top',
                        backgroundColor: '#7C9070',
                        color: '#fff',
                        font: {
                            size: 11,
                            weight: '600'
                        },
                        padding: 4,
                        borderRadius: 4,
                        yAdjust: -10
                    }
                };
            }
        });
    }
    
    // Destroy existing chart if it exists
    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
        existingChart.destroy();
    }
    
    // Create new chart
    new Chart(chartContext, config);
}

// Generate fallback data for demo purposes
function generateFallbackData() {
    // Accurate RBA historical rates
    const historicalRates = [
        // 2020
        { date: '2020-01', rate: 0.75 },
        { date: '2020-02', rate: 0.75 },
        { date: '2020-03', rate: 0.50 },
        { date: '2020-04', rate: 0.25 },
        { date: '2020-05', rate: 0.25 },
        { date: '2020-06', rate: 0.25 },
        { date: '2020-07', rate: 0.25 },
        { date: '2020-08', rate: 0.25 },
        { date: '2020-09', rate: 0.25 },
        { date: '2020-10', rate: 0.25 },
        { date: '2020-11', rate: 0.10 },
        { date: '2020-12', rate: 0.10 },
        // 2021 - all at 0.10%
        { date: '2021-01', rate: 0.10 },
        { date: '2021-02', rate: 0.10 },
        { date: '2021-03', rate: 0.10 },
        { date: '2021-04', rate: 0.10 },
        { date: '2021-05', rate: 0.10 },
        { date: '2021-06', rate: 0.10 },
        { date: '2021-07', rate: 0.10 },
        { date: '2021-08', rate: 0.10 },
        { date: '2021-09', rate: 0.10 },
        { date: '2021-10', rate: 0.10 },
        { date: '2021-11', rate: 0.10 },
        { date: '2021-12', rate: 0.10 },
        // 2022 - rates start rising
        { date: '2022-01', rate: 0.10 },
        { date: '2022-02', rate: 0.10 },
        { date: '2022-03', rate: 0.10 },
        { date: '2022-04', rate: 0.10 },
        { date: '2022-05', rate: 0.35 },
        { date: '2022-06', rate: 0.85 },
        { date: '2022-07', rate: 1.35 },
        { date: '2022-08', rate: 1.85 },
        { date: '2022-09', rate: 2.35 },
        { date: '2022-10', rate: 2.60 },
        { date: '2022-11', rate: 2.85 },
        { date: '2022-12', rate: 3.10 },
        // 2023 - continued rises
        { date: '2023-01', rate: 3.10 },
        { date: '2023-02', rate: 3.35 },
        { date: '2023-03', rate: 3.60 },
        { date: '2023-04', rate: 3.60 },
        { date: '2023-05', rate: 3.85 },
        { date: '2023-06', rate: 4.10 },
        { date: '2023-07', rate: 4.10 },
        { date: '2023-08', rate: 4.10 },
        { date: '2023-09', rate: 4.10 },
        { date: '2023-10', rate: 4.10 },
        { date: '2023-11', rate: 4.35 },
        { date: '2023-12', rate: 4.35 },
        // 2024 - stable then cuts
        { date: '2024-01', rate: 4.35 },
        { date: '2024-02', rate: 4.35 },
        { date: '2024-03', rate: 4.35 },
        { date: '2024-04', rate: 4.35 },
        { date: '2024-05', rate: 4.35 },
        { date: '2024-06', rate: 4.35 },
        { date: '2024-07', rate: 4.35 },
        { date: '2024-08', rate: 4.35 },
        { date: '2024-09', rate: 4.35 },
        { date: '2024-10', rate: 4.35 },
        { date: '2024-11', rate: 4.35 },
        { date: '2024-12', rate: 4.35 },
        // 2025 - cuts begin
        { date: '2025-01', rate: 4.35 },
        { date: '2025-02', rate: 4.10 },
        { date: '2025-03', rate: 4.10 },
        { date: '2025-04', rate: 4.10 },
        { date: '2025-05', rate: 3.85 },
        { date: '2025-06', rate: 3.85 },
        { date: '2025-07', rate: 3.85 }
    ];
    
    return historicalRates;
}

// Export functions
window.createHistoricalChart = createHistoricalChart;
