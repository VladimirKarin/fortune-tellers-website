// Improved Countdown Clock with Error Handling and Performance Optimizations
export function timer() {
    const Days = document.getElementById('days');
    const Hours = document.getElementById('hours');
    const Minutes = document.getElementById('minutes');
    const Seconds = document.getElementById('seconds');

    // Enhanced error handling
    if (!Days || !Hours || !Minutes || !Seconds) {
        console.error('Countdown elements not found in the DOM');
        return;
    }

    const targetDate = new Date('November 30 2025 00:00:00').getTime();
    const currentDate = new Date().getTime();
    const timeDifference = targetDate - currentDate;

    // Handle expired countdown
    if (timeDifference <= 0) {
        Days.innerHTML = '00';
        Hours.innerHTML = '00';
        Minutes.innerHTML = '00';
        Seconds.innerHTML = '00';

        // Optional: Add expired state styling
        const countdownSection = document.querySelector('.countdown-section');
        if (countdownSection) {
            countdownSection.classList.add('countdown-expired');
        }

        return;
    }

    // Calculate time units
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
        (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
        (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    // Format and update display with improved formatting
    Days.innerHTML = formatTimeUnit(days);
    Hours.innerHTML = formatTimeUnit(hours);
    Minutes.innerHTML = formatTimeUnit(minutes);
    Seconds.innerHTML = formatTimeUnit(seconds);

    // Add accessibility attributes for screen readers
    updateAriaLabels(days, hours, minutes, seconds);
}

// Helper function to format time units
function formatTimeUnit(value) {
    return value < 10 ? '0' + value : value.toString();
}

// Enhanced accessibility support
function updateAriaLabels(days, hours, minutes, seconds) {
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (daysEl) daysEl.setAttribute('aria-label', `${days} days remaining`);
    if (hoursEl) hoursEl.setAttribute('aria-label', `${hours} hours remaining`);
    if (minutesEl)
        minutesEl.setAttribute('aria-label', `${minutes} minutes remaining`);
    if (secondsEl)
        secondsEl.setAttribute('aria-label', `${seconds} seconds remaining`);
}

// Enhanced initialization with better error handling
export function initializeCountdown() {
    // Check if countdown elements exist before starting
    const countdownElements = ['days', 'hours', 'minutes', 'seconds'];
    const missingElements = countdownElements.filter(
        (id) => !document.getElementById(id)
    );

    if (missingElements.length > 0) {
        console.warn('Missing countdown elements:', missingElements);
        return false;
    }

    // Initial call
    timer();

    // Set up interval with cleanup
    const intervalId = setInterval(timer, 1000);

    // Store interval ID for potential cleanup
    if (typeof window !== 'undefined') {
        window.countdownInterval = intervalId;
    }

    return intervalId;
}

// Cleanup function for page unload or component unmount
export function cleanupCountdown() {
    if (typeof window !== 'undefined' && window.countdownInterval) {
        clearInterval(window.countdownInterval);
        window.countdownInterval = null;
    }
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeCountdown);
    } else {
        initializeCountdown();
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', cleanupCountdown);
}
