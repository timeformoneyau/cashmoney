/* RBA Market Odds Dashboard - Professional Financial Design */

/* Import modern fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

:root {
    /* Brunch-inspired Color Palette */
    /* Backgrounds */
    --bg-main: #FAF9F7;        /* Latte cream */
    --bg-card: #FFFFFF;        /* Pure white */
    --bg-border: #E8E3DD;      /* Light beige */
    
    /* Primary Accent (Sage Green) */
    --accent-primary: #7C9070;  /* Sage green */
    --accent-deep: #5A6B52;     /* Deep sage */
    
    /* Secondary Accent (Avocado) */
    --accent-green: #8BAA62;    /* Avocado green */
    --accent-green-dark: #6B8A4A;
    
    /* Tertiary (Soft Orange) */
    --accent-orange: #E89B5C;   /* Soft orange */
    --accent-beige: #D4C5B9;   /* Latte beige */
    
    /* Text Colors */
    --text-heading: #2C2C2C;    /* Charcoal */
    --text-body: #4A4A4A;       /* Dark gray */
    --text-muted: #7A7A7A;      /* Light gray */
    
    /* Probability Bars */
    --bar-fill: #7C9070;
    --bar-hover: #5A6B52;
    --bar-label: #FFFFFF;
    
    /* Rate Move Colors with Emojis */
    --rate-cut: #8BAA62;        /* Green for cuts */
    --rate-hold: #D4C5B9;       /* Beige for holds */
    --rate-hike: #E89B5C;       /* Orange for hikes */
    
    /* Shadows for 3D effect */
    --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.08);
    --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.12);
    --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.15);
    --shadow-3d: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
    --shadow-3d-hover: 0 6px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1);
    
    /* Spacing */
    --spacing-xs: 0.5rem;
    --spacing-sm: 1rem;
    --spacing-md: 1.5rem;
    --spacing-lg: 2rem;
    --spacing-xl: 3rem;
    
    /* Border radius */
    --radius-sm: 0.375rem;
    --radius-md: 0.5rem;
    --radius-lg: 0.75rem;
    
    /* Transitions */
    --transition: all 0.2s ease;
}

/* Reset and base styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    background-color: var(--bg-main);    /* Use the soft white variable */
    color: var(--text-body);             /* Use the text color variable */
    line-height: 1.6;
    min-height: 100vh;
}

/* Container */
.container {
    max-width: 1000px;
    margin: 0 auto;
    padding: var(--spacing-lg);
}

/* Header */
header {
    background-color: var(--bg-card);
    padding: var(--spacing-xl) var(--spacing-lg);
    margin-bottom: var(--spacing-lg);
    border-bottom: 1px solid var(--bg-border);
    box-shadow: var(--shadow-sm);
}

h1 {
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--text-heading);
    margin-bottom: var(--spacing-xs);
    letter-spacing: -0.025em;
    line-height: 1.2;
}

.subtitle {
    color: var(--text-muted);
    font-size: 1.125rem;
    font-weight: 400;
}

/* Grid system */
.grid {
    display: grid;
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-lg);
}

.grid-2 {
    grid-template-columns: 1fr;
}

@media (min-width: 768px) {
    .grid-2 {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* Card component */
.card {
    background-color: var(--bg-card);
    border-radius: var(--radius-md);
    padding: var(--spacing-lg);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--bg-border);
    transition: var(--transition);
}

.card:hover {
    box-shadow: var(--shadow-md);
}

.card h2 {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-heading);
    margin-bottom: var(--spacing-md);
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}

/* Icon styles */
.icon {
    width: 24px;
    height: 24px;
    background-color: var(--accent-primary);
    border-radius: var(--radius-sm);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: white;
}

/* Countdown timer */
.countdown {
    background: linear-gradient(135deg, var(--accent-primary), var(--accent-green));
    color: white;
    padding: var(--spacing-xl);
    border-radius: var(--radius-lg);
    margin-bottom: var(--spacing-lg);
    text-align: center;
    box-shadow: var(--shadow-lg);
}

.countdown h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: var(--spacing-lg);
    color: white;
    opacity: 0.95;
    font-style: italic;
}

.time-units {
    display: flex;
    justify-content: center;
    gap: var(--spacing-md);
    flex-wrap: wrap;
}

.time-unit {
    background-color: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    padding: var(--spacing-md) var(--spacing-lg);
    border-radius: var(--radius-md);
    min-width: 90px;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.time-value {
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 1;
    display: block;
    margin-bottom: var(--spacing-xs);
}

.time-label {
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    opacity: 0.9;
}

/* Table styles */
table {
    width: 100%;
    border-collapse: collapse;
    margin-top: var(--spacing-sm);
}

th {
    text-align: left;
    padding: var(--spacing-sm);
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 2px solid var(--bg-border);
}

td {
    padding: var(--spacing-sm);
    border-bottom: 1px solid var(--bg-border);
}

tr:last-child td {
    border-bottom: none;
}

/* Probability bars */
.prob-bar-container {
    width: 100%;
    height: 32px;
    background-color: #F3F4F6;
    border-radius: var(--radius-sm);
    overflow: hidden;
    margin-top: var(--spacing-xs);
    position: relative;
}

.prob-bar-fill {
    height: 100%;
    background-color: var(--bar-fill);
    display: flex;
    align-items: center;
    padding: 0 var(--spacing-sm);
    transition: var(--transition);
    position: relative;
}

.prob-bar-fill:hover {
    background-color: var(--bar-hover);
}

.prob-bar-fill span {
    color: var(--bar-label);
    font-size: 0.875rem;
    font-weight: 600;
    position: absolute;
    left: var(--spacing-sm);
}

/* Odds value */
.odds-value {
    font-weight: 600;
    color: var(--accent-primary);
    font-size: 1rem;
}

/* Rate history list */
.rate-history-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.rate-history-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-sm) 0;
    border-bottom: 1px solid var(--bg-border);
    transition: var(--transition);
}

.rate-history-item:last-child {
    border-bottom: none;
}

.rate-history-item:hover {
    background-color: var(--bg-main);
    margin: 0 calc(-1 * var(--spacing-sm));
    padding-left: var(--spacing-sm);
    padding-right: var(--spacing-sm);
    border-radius: var(--radius-sm);
}

.rate-emoji {
    font-size: 1.5rem;
    margin-right: var(--spacing-sm);
    vertical-align: middle;
}

.rate-indicator {
    font-size: 1.25rem;
    margin-right: var(--spacing-sm);
    font-weight: 700;
}

.rate-indicator.cut {
    color: var(--rate-cut);
}

.rate-indicator.hike {
    color: var(--rate-hike);
}

.rate-indicator.hold {
    color: var(--rate-hold);
}

.rate-details {
    flex: 1;
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    font-size: 1rem;
}

.rate-change {
    font-weight: 600;
    color: var(--text-heading);
    font-size: 1rem;
}

.rate-date {
    color: var(--text-muted);
    font-size: 0.875rem;
}

.rate-value {
    font-weight: 700;
    color: var(--accent-primary);
    font-size: 1rem;
}

/* Chart container */
.chart-container {
    position: relative;
    height: 400px;
    margin-top: var(--spacing-md);
    padding: var(--spacing-md);
    background-color: var(--bg-main);
    border-radius: var(--radius-md);
    border: 1px solid var(--bg-border);
}

/* Footer */
footer {
    text-align: center;
    padding: var(--spacing-xl) var(--spacing-lg);
    margin-top: var(--spacing-xl);
    color: var(--text-muted);
    font-size: 0.875rem;
    border-top: 1px solid var(--bg-border);
}

footer a {
    color: var(--accent-primary);
    text-decoration: none;
    font-weight: 600;
    transition: var(--transition);
}

footer a:hover {
    color: var(--accent-deep);
    text-decoration: underline;
}

/* Loading and error states */
.loading {
    text-align: center;
    padding: var(--spacing-lg);
    color: var(--text-muted);
}

.error {
    background-color: #FEF2F2;
    border: 1px solid #FCA5A5;
    color: #DC2626;
    padding: var(--spacing-sm);
    border-radius: var(--radius-sm);
    margin-top: var(--spacing-sm);
    font-size: 0.875rem;
}

/* Update time */
.update-time {
    font-size: 0.875rem;
    color: var(--text-muted);
    margin-top: var(--spacing-md);
    text-align: right;
}

/* Animations */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-in {
    animation: fadeIn 0.3s ease-out forwards;
}

/* Utility classes */
.text-center {
    text-align: center;
}

.font-bold {
    font-weight: 700;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    h1 {
        font-size: 2rem;
    }
    
    .container {
        padding: var(--spacing-md);
    }
    
    .card {
        padding: var(--spacing-md);
    }
    
    .time-units {
        gap: var(--spacing-sm);
    }
    
    .time-unit {
        min-width: 75px;
        padding: var(--spacing-sm);
    }
    
    .time-value {
        font-size: 2rem;
    }
    
    .rate-history-item {
        font-size: 0.875rem;
    }
    
    .calculator-inputs {
        flex-direction: column;
    }
    
    .results-grid {
        grid-template-columns: 1fr;
    }
}

/* Calculator Styles */
.calculator-card {
    margin-top: var(--spacing-lg);
}

.calculator-subtitle {
    color: var(--text-muted);
    margin-bottom: var(--spacing-lg);
    font-size: 0.95rem;
}

.calculator-inputs {
    display: flex;
    gap: var(--spacing-md);
    align-items: flex-end;
    margin-bottom: var(--spacing-lg);
    flex-wrap: wrap;
}

.input-group {
    flex: 1;
    min-width: 200px;
}

.input-group label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-muted);
    margin-bottom: var(--spacing-xs);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.input-group input {
    width: 100%;
    padding: var(--spacing-sm);
    border: 2px solid var(--bg-border);
    border-radius: var(--radius-md);
    font-size: 1rem;
    font-weight: 500;
    color: var(--text-heading);
    background-color: var(--bg-main);
    transition: var(--transition);
}

.input-group input:focus {
    outline: none;
    border-color: var(--accent-primary);
    background-color: var(--bg-card);
}

.calculate-btn {
    padding: var(--spacing-sm) var(--spacing-lg);
    background: linear-gradient(180deg, var(--accent-primary) 0%, var(--accent-deep) 100%);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    min-width: 150px;
    box-shadow: 0 4px 0 var(--accent-deep), var(--shadow-3d);
    transform: translateY(0);
    position: relative;
}

.calculate-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 0 var(--accent-deep), var(--shadow-3d-hover);
}

.calculate-btn:active {
    transform: translateY(2px);
    box-shadow: 0 2px 0 var(--accent-deep), 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Calculator Results */
.calculator-results {
    margin-top: var(--spacing-xl);
}

.results-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-md);
    margin-top: var(--spacing-lg);
}

.result-card {
    background-color: var(--bg-main);
    border-radius: var(--radius-md);
    padding: var(--spacing-lg);
    text-align: center;
    border: 2px solid var(--bg-border);
    transition: var(--transition);
}

.result-card.current {
    border-color: var(--text-muted);
}

.result-card.savings {
    border-color: var(--accent-green);
    background-color: #F0FDF4;
}

.result-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.rate-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: var(--spacing-xs);
}

.rate-value {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--text-heading);
    margin-bottom: var(--spacing-sm);
}

.repayment-amount {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--accent-primary);
    margin-bottom: var(--spacing-sm);
}

.savings-amount {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--accent-green);
    margin-bottom: var(--spacing-xs);
}

.savings-detail {
    font-size: 0.875rem;
    color: var(--text-muted);
    margin-bottom: var(--spacing-xs);
}

.avocado-section {
    background-color: #FEF3C7;
    border-radius: var(--radius-sm);
    padding: var(--spacing-sm);
    margin-top: var(--spacing-sm);
    border: 1px solid #FDE68A;
}

.avocado-emoji {
    font-size: 1.5rem;
    margin-bottom: var(--spacing-xs);
}

.avocado-text {
    font-size: 0.875rem;
    color: #92400E;
    font-weight: 500;
    line-height: 1.4;
}

.avocado-count {
    font-weight: 700;
    color: #78350F;
    font-size: 1rem;
}

.total-savings-section {
    background-color: var(--bg-main);
    border-radius: var(--radius-md);
    padding: var(--spacing-lg);
    margin-top: var(--spacing-lg);
    text-align: center;
    border: 2px solid var(--accent-green);
}

.total-savings-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-heading);
    margin-bottom: var(--spacing-sm);
}

.total-savings-amount {
    font-size: 2rem;
    font-weight: 700;
    color: var(--accent-green);
    margin-bottom: var(--spacing-sm);
}

.total-avocados {
    font-size: 1rem;
    color: var(--text-muted);
}

/* Avocado Graph Styles */
.avocado-graph-section {
    background-color: var(--bg-main);
    border-radius: var(--radius-md);
    padding: var(--spacing-lg);
    margin-top: var(--spacing-lg);
    border: 2px solid var(--accent-green);
}

.avocado-graph {
    text-align: center;
    margin: var(--spacing-lg) 0;
}

.avocado-icons {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-md);
}

.avocado-icon {
    font-size: 2.5rem;
    display: inline-block;
    animation: bounceIn 0.5s ease-out;
}

.avocado-partial {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--accent-green);
    display: inline-flex;
    align-items: center;
    margin-left: var(--spacing-sm);
}

.avocado-total {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--accent-green);
}

@keyframes bounceIn {
    0% {
        opacity: 0;
        transform: scale(0.3);
    }
    50% {
        transform: scale(1.1);
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
}
