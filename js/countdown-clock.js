/* ================================================
   ⏰ COUNTDOWN CLOCK - Configurable & Optimized
   ================================================
   
   📋 FEATURES:
   - Configurable target date via HTML data attribute
   - Automatic countdown updates every second
   - Expired state handling with visual feedback
   - Screen reader accessibility support
   - Memory leak prevention with cleanup functions
   - Comprehensive error handling
   
   🔗 HTML INTEGRATION:
   Add data-target-date to your countdown section:
   <section class="countdown-section" data-target-date="2025-11-30T00:00:00">
   
   📅 DATE FORMAT:
   Use ISO 8601 format: YYYY-MM-DDTHH:mm:ss
   Example: "2025-12-31T23:59:59" for New Year's Eve
*/

/* ===================================
   📦 CACHED DOM ELEMENTS
   =================================== */

// Cache DOM elements to avoid repeated queries (performance optimization)
let cachedElements = null;

/**
 * Get and cache countdown DOM elements
 * @returns {Object|null} Object containing days, hours, minutes, seconds elements
 */
function getCountdownElements() {
    // Return cached elements if already queried
    if (cachedElements) return cachedElements;

    // Query all elements once and cache them
    cachedElements = {
        days: document.getElementById('days'),
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds'),
        section: document.querySelector('.countdown-section'),
    };

    return cachedElements;
}

/* ===================================
   🎯 TARGET DATE CONFIGURATION
   =================================== */

/**
 * Get target date from HTML data attribute or use default
 * @returns {number} Target date timestamp in milliseconds
 */
function getTargetDate() {
    const elements = getCountdownElements();

    // 🎯 Read target date from HTML data attribute
    const targetDateString = elements.section?.getAttribute('data-target-date');

    // Fallback to default date if attribute is missing
    const defaultDate = '2025-11-30T00:00:00';
    const dateString = targetDateString || defaultDate;

    // Parse date and validate
    const targetDate = new Date(dateString).getTime();

    // Validate the parsed date
    if (isNaN(targetDate)) {
        console.error(
            '❌ Invalid target date format in data-target-date attribute.',
            '\n📅 Expected format: YYYY-MM-DDTHH:mm:ss (ISO 8601)',
            '\n📝 Example: "2025-12-31T23:59:59"',
            '\n🔧 Falling back to default date:',
            defaultDate
        );
        return new Date(defaultDate).getTime();
    }

    // 🔥 REMOVED: Logging moved to initializeCountdown() to prevent spam
    return targetDate;
}

/* ===================================
   ⏱️ MAIN COUNTDOWN TIMER LOGIC
   =================================== */

/**
 * Main timer function - calculates and updates countdown display
 * Called once immediately, then every second via setInterval
 */
export function timer() {
    const elements = getCountdownElements();

    // Enhanced error handling - validate all required elements exist
    if (
        !elements.days ||
        !elements.hours ||
        !elements.minutes ||
        !elements.seconds
    ) {
        console.error('❌ Countdown elements not found in the DOM');
        console.error(
            '🔍 Required elements: #days, #hours, #minutes, #seconds'
        );
        return;
    }

    // Get target date (from HTML attribute or default)
    const targetDate = getTargetDate();
    const currentDate = new Date().getTime();
    const timeDifference = targetDate - currentDate;

    // Handle expired countdown
    if (timeDifference <= 0) {
        handleExpiredCountdown(elements);
        return;
    }

    // Calculate time units
    const timeUnits = calculateTimeUnits(timeDifference);

    // Format and update display
    updateDisplay(elements, timeUnits);

    // Update accessibility attributes for screen readers
    updateAriaLabels(elements, timeUnits);
}

/* ===================================
   🧮 TIME CALCULATION UTILITIES
   =================================== */

/**
 * Calculate days, hours, minutes, seconds from milliseconds
 * @param {number} timeDifference - Time difference in milliseconds
 * @returns {Object} Object containing days, hours, minutes, seconds
 */
function calculateTimeUnits(timeDifference) {
    return {
        days: Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
            (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((timeDifference % (1000 * 60)) / 1000),
    };
}

/**
 * Format time unit with leading zero if needed
 * @param {number} value - Time value to format
 * @returns {string} Formatted time string (e.g., "05" or "23")
 */
function formatTimeUnit(value) {
    // 🎯 OPTIMIZED: Use padStart for cleaner code
    return value.toString().padStart(2, '0');
}

/* ===================================
   🖥️ DISPLAY UPDATE FUNCTIONS
   =================================== */

/**
 * Update countdown display with new values
 * @param {Object} elements - Cached DOM elements
 * @param {Object} timeUnits - Calculated time units (days, hours, minutes, seconds)
 */
function updateDisplay(elements, timeUnits) {
    elements.days.textContent = formatTimeUnit(timeUnits.days);
    elements.hours.textContent = formatTimeUnit(timeUnits.hours);
    elements.minutes.textContent = formatTimeUnit(timeUnits.minutes);
    elements.seconds.textContent = formatTimeUnit(timeUnits.seconds);
}

/**
 * Handle countdown expiration - display zeros and add expired styling
 * @param {Object} elements - Cached DOM elements
 */
function handleExpiredCountdown(elements) {
    // Set all displays to "00"
    elements.days.textContent = '00';
    elements.hours.textContent = '00';
    elements.minutes.textContent = '00';
    elements.seconds.textContent = '00';

    // Add expired state styling (CSS handles visual changes)
    if (elements.section) {
        elements.section.classList.add('countdown-expired');
    }

    // Update ARIA labels for screen readers
    updateAriaLabels(elements, {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    // Log expiration (helpful for debugging)
    console.log('⏰ Countdown expired!');

    // Stop the timer since countdown is complete
    cleanupCountdown();
}

/* ===================================
   ♿ ACCESSIBILITY FUNCTIONS
   =================================== */

/**
 * Update ARIA labels for screen reader accessibility
 * @param {Object} elements - Cached DOM elements
 * @param {Object} timeUnits - Current time unit values
 */
function updateAriaLabels(elements, timeUnits) {
    // 🎯 OPTIMIZED: Reuse cached elements instead of re-querying DOM
    if (elements.days) {
        elements.days.setAttribute(
            'aria-label',
            `${timeUnits.days} days remaining`
        );
    }
    if (elements.hours) {
        elements.hours.setAttribute(
            'aria-label',
            `${timeUnits.hours} hours remaining`
        );
    }
    if (elements.minutes) {
        elements.minutes.setAttribute(
            'aria-label',
            `${timeUnits.minutes} minutes remaining`
        );
    }
    if (elements.seconds) {
        elements.seconds.setAttribute(
            'aria-label',
            `${timeUnits.seconds} seconds remaining`
        );
    }
}

/* ===================================
   🚀 INITIALIZATION & CLEANUP
   =================================== */

/**
 * Initialize countdown with comprehensive error handling
 * @returns {number|boolean} Interval ID if successful, false if failed
 */
export function initializeCountdown() {
    // Check if countdown elements exist before starting
    const countdownElements = ['days', 'hours', 'minutes', 'seconds'];
    const missingElements = countdownElements.filter(
        (id) => !document.getElementById(id)
    );

    // Warn about missing elements and abort initialization
    if (missingElements.length > 0) {
        console.warn(
            '⚠️ Missing countdown elements:',
            missingElements.join(', '),
            '\n🔍 Required HTML structure:',
            '\n<h3 id="days">00</h3>',
            '\n<h3 id="hours">00</h3>',
            '\n<h3 id="minutes">00</h3>',
            '\n<h3 id="seconds">00</h3>'
        );
        return false;
    }

    // 🆕 NEW: Log configuration ONCE during initialization
    const section = document.querySelector('.countdown-section');
    const targetDateString = section?.getAttribute('data-target-date');
    if (targetDateString) {
        const targetDate = new Date(targetDateString);
        console.log(
            '✅ Countdown configured for:',
            targetDate.toLocaleString()
        );
    }

    // Initial call to display countdown immediately
    timer();

    // Set up interval to update every second
    const intervalId = setInterval(timer, 1000);

    // Store interval ID globally for cleanup
    if (typeof window !== 'undefined') {
        window.countdownInterval = intervalId;
    }

    console.log('✅ Countdown timer initialized successfully');
    return intervalId;
}

/**
 * Cleanup function - stops timer and prevents memory leaks
 * Called on page unload or when countdown expires
 */
export function cleanupCountdown() {
    if (typeof window !== 'undefined' && window.countdownInterval) {
        clearInterval(window.countdownInterval);
        window.countdownInterval = null;
        cachedElements = null; // Clear cached elements
        console.log('🧹 Countdown timer cleaned up');
    }
}

/* ===================================
   🎬 MODULE INITIALIZATION NOTES
   =================================== */

/*
   ⚠️ INITIALIZATION REMINDER:
   This module does NOT auto-initialize to prevent duplicate instances.
   
   ✅ CORRECT USAGE:
   Import and initialize in script.js:
   
   import { initializeCountdown, cleanupCountdown } from './countdown-clock.js';
   
   document.addEventListener('DOMContentLoaded', initializeCountdown);
   window.addEventListener('beforeunload', cleanupCountdown);
   
   ❌ DO NOT:
   - Initialize multiple times
   - Import without calling initializeCountdown()
   - Call initializeCountdown() more than once
*/

/* ================================================
   🔧 DEBUG UTILITIES
   ================================================
   
   Copy these functions to browser console for debugging:
*/

/*
📊 Check Current Countdown Status:
────────────────────────────────────────────────
function debugCountdown() {
    const section = document.querySelector('.countdown-section');
    const targetDate = section?.getAttribute('data-target-date');
    const elements = {
        days: document.getElementById('days')?.textContent,
        hours: document.getElementById('hours')?.textContent,
        minutes: document.getElementById('minutes')?.textContent,
        seconds: document.getElementById('seconds')?.textContent
    };
    
    console.log('🎯 Target Date:', targetDate);
    console.log('⏰ Current Display:', elements);
    console.log('📅 Target Parsed:', new Date(targetDate));
    console.log('🕐 Time Until:', new Date(targetDate).getTime() - Date.now(), 'ms');
}

debugCountdown();
*/

/*
🔄 Manually Trigger Countdown Update:
────────────────────────────────────────────────
import { timer } from './countdown-clock.js';
timer();
*/

/*
🧪 Test Expired State:
────────────────────────────────────────────────
function testExpiredState() {
    const section = document.querySelector('.countdown-section');
    section.setAttribute('data-target-date', '2020-01-01T00:00:00');
    location.reload(); // Reload to see expired state
}

testExpiredState();
*/

/*
📝 Change Target Date Dynamically:
────────────────────────────────────────────────
function setCountdownDate(dateString) {
    const section = document.querySelector('.countdown-section');
    section.setAttribute('data-target-date', dateString);
    console.log('✅ Target date updated to:', dateString);
    console.log('🔄 Reload page to apply changes');
}

// Example usage:
setCountdownDate('2026-01-01T00:00:00'); // New Year 2026
*/
