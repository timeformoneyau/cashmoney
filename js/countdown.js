// Countdown timer functionality for RBA meetings

// Update countdown timer
function updateCountdown() {
    const now = moment.tz();
    const meetings = window.dashboardState?.meetings?.dates || [];
    
    let nextMeeting = null;
    
    // Find the next future meeting
    for (const dateStr of meetings) {
        const meetingDate = moment.tz(dateStr);
        if (meetingDate.isAfter(now)) {
            nextMeeting = meetingDate;
            break;
        }
    }
    
    // If no meetings in data, use fallback dates
    if (!nextMeeting && meetings.length === 0) {
        const fallbackDates = [
            '2025-02-18T14:30:00+11:00',
            '2025-04-01T14:30:00+11:00',
            '2025-05-20T14:30:00+10:00',
            '2025-07-01T14:30:00+10:00',
            '2025-08-19T14:30:00+10:00',
            '2025-09-30T14:30:00+10:00',
            '2025-11-18T14:30:00+11:00',
            '2025-12-16T14:30:00+11:00'
        ];
        
        for (const dateStr of fallbackDates) {
            const meetingDate = moment.tz(dateStr);
            if (meetingDate.isAfter(now)) {
                nextMeeting = meetingDate;
                break;
            }
        }
    }
    
    const timerElement = document.getElementById('timer');
    const countdownHeader = document.querySelector('.countdown h2');
    
    if (!nextMeeting) {
        timerElement.innerHTML = '<div class="error">No upcoming meetings scheduled</div>';
        return;
    }
    
    // Calculate time remaining
    const duration = moment.duration(nextMeeting.diff(now));
    const days = Math.floor(duration.asDays());
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();
    
    // Update timer display
    timerElement.innerHTML = `
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
    
    // Update meeting date display
    const timezone = nextMeeting.format('z');
    countdownHeader.innerHTML = `Next RBA Meeting: ${nextMeeting.format('D MMMM YYYY, h:mm A')} ${timezone}`;
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
    // Wait a moment for data to load, then start
    setTimeout(startCountdown, 100);
});

// Export for use in other modules
window.updateCountdown = updateCountdown;
window.startCountdown = startCountdown;
window.stopCountdown = stopCountdown;
