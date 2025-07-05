// Countdown timer functionality for RBA meetings

// Cache DOM elements
let timerElement = null;
let countdownHeader = null;
let hasInitialized = false;

// Update countdown timer
function updateCountdown() {
    // Get DOM elements only once
    if (!hasInitialized) {
        timerElement = document.getElementById('timer');
        countdownHeader = document.querySelector('.countdown h2');
        hasInitialized = true;
        
        if (!timerElement) return; // Exit if elements not ready
    }
    
    const now = moment.tz('Australia/Sydney');
    
    // Hardcoded meeting dates for reliability
    const meetingDates = [
        '2025-07-08T14:30:00+10:00',
        '2025-08-12T14:30:00+10:00',
        '2025-09-30T14:30:00+10:00',
        '2025-11-18T14:30:00+11:00',
        '2025-12-16T14:30:00+11:00',
        '2026-02-17T14:30:00+11:00',
        '2026-03-31T14:30:00+11:00',
        '2026-05-19T14:30:00+10:00'
    ];
    
    let nextMeeting = null;
    
    // Find the next future meeting
    for (const dateStr of meetingDates) {
        const meetingDate = moment.tz(dateStr, 'Australia/Sydney');
        if (meetingDate.isAfter(now)) {
            nextMeeting = meetingDate;
            break;
        }
    }
    
    if (!nextMeeting) {
        if (timerElement) {
            timerElement.innerHTML = `
                <div class="time-unit">
                    <div class="time-value">--</div>
                    <div class="time-label">No meetings scheduled</div>
                </div>
            `;
        }
        return;
    }
    
    // Calculate time remaining
    const duration = moment.duration(nextMeeting.diff(now));
    
    if (duration.asSeconds() <= 0) {
        // Meeting has passed, find next one
        setTimeout(updateCountdown, 1000);
        return;
    }
    
    const days = Math.floor(duration.asDays());
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();
    
    // Update timer display
    const newContent = `
        <div class="time-unit">
            <div class="time-value">${days}</div>
            <div class="time-label">Days</div>
        </div>
        <div class="time-unit">
            <div class="time-value">${hours.toString().padStart(2, '0')}</div>
            <div class="time-label">Hours</div>
        </div>
        <div class="time-unit">
            <div class="time-value">${minutes.toString().padStart(2, '0')}</div>
            <div class="time-label">Minutes</div>
        </div>
        <div class="time-unit">
            <div class="time-value">${seconds.toString().padStart(2, '0')}</div>
            <div class="time-label">Seconds</div>
        </div>
    `;
    
    if (timerElement) {
        timerElement.innerHTML = newContent;
    }
    
    // Update meeting date display
    const timezone = nextMeeting.format('z');
    const headerText = `Next RBA Meeting: ${nextMeeting.format('D MMMM YYYY, h:mm A')} ${timezone}`;
    
    if (countdownHeader) {
        countdownHeader.innerHTML = headerText;
    }
}

// Start countdown timer
let countdownInterval;

function startCountdown() {
    // Clear any existing interval
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    // Update immediately
    updateCountdown();
    
    // Update every second
    countdownInterval = setInterval(updateCountdown, 1000);
}

// Stop countdown (for cleanup)
function stopCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
}

// Auto-start on page load
document.addEventListener('DOMContentLoaded', () => {
    startCountdown();
});

// Export for use in other modules
window.updateCountdown = updateCountdown;
window.startCountdown = startCountdown;
window.stopCountdown = stopCountdown;
