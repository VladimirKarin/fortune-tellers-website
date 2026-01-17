// ================================================
// ⏰ COUNTDOWN CLOCK - Configurable Timer System
// ================================================
//
// 📋 MODULE PURPOSE:
// Displays a countdown timer to a configurable target date/time.
// Updates every second with days, hours, minutes, and seconds remaining.
// Handles expired state gracefully and includes accessibility features.
//
// 🎬 TIMER FLOW:
// 1. Read target date from HTML data attribute
// 2. Calculate time difference from current date
// 3. Update display every second
// 4. Handle expiration with visual feedback
// 5. Clean up on page unload to prevent memory leaks
//
// 🔗 DEPENDENCIES:
// - HTML: .countdown-section with data-target-date attribute
// - HTML: #days, #hours, #minutes, #seconds elements
// - CSS: .countdown-expired class for expired state styling
//
// 📦 FEATURES:
// - Configurable target date via HTML attribute
// - Automatic countdown updates (every 1 second)
// - Expired state handling with visual feedback
// - Screen reader accessibility (ARIA labels)
// - Memory leak prevention with cleanup functions
// - Comprehensive error handling and validation
//
// 🗓️ DATE FORMAT:
// Use ISO 8601 format in HTML: YYYY-MM-DDTHH:mm:ss
// Example: <section data-target-date="2025-12-31T23:59:59">
//
// ⚠️ IMPORTANT NOTES:
// - Initialized from script.js (not self-initializing)
// - Must call initializeCountdown() exactly once
// - Must call cleanupCountdown() on page unload
// - Target date read from HTML data-target-date attribute

/* ===================================
   🔑 CONFIGURATION
   =================================== */

/**
 * Default target date if data attribute is missing or invalid
 * Used as fallback to ensure countdown always has a valid date
 *
 * @constant {string}
 * @default '2025-11-30T00:00:00'
 */
const DEFAULT_TARGET_DATE = '2025-11-30T00:00:00';

/* ===================================
   📦 CACHED DOM ELEMENTS
   =================================== */

/**
 * Cached DOM elements for performance optimization
 * Queried once during initialization and reused throughout
 *
 * @type {Object|null}
 */
let cachedElements = null;

/**
 * Get and cache countdown DOM elements
 * Queries DOM once and stores references for reuse
 *
 * @returns {Object|null} Object containing countdown elements or null if not found
 * @returns {HTMLElement} return.days - Days display element
 * @returns {HTMLElement} return.hours - Hours display element
 * @returns {HTMLElement} return.minutes - Minutes display element
 * @returns {HTMLElement} return.seconds - Seconds display element
 * @returns {HTMLElement} return.section - Countdown section container
 *
 * @example
 * const elements = getCountdownElements();
 * if (elements) {
 *     elements.days.textContent = '10';
 * }
 *
 * @private
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
 *
 * Reads target date from .countdown-section element's data-target-date
 * attribute. Falls back to DEFAULT_TARGET_DATE if:
 * - Attribute is missing
 * - Attribute value is invalid
 * - Date parsing fails
 *
 * @returns {number} Target date timestamp in milliseconds
 *
 * @example
 * // HTML: <section class="countdown-section" data-target-date="2025-12-31T23:59:59">
 * const targetDate = getTargetDate();
 * console.log(new Date(targetDate)); // Dec 31, 2025 23:59:59
 *
 * @private
 */
function getTargetDate() {
    const elements = getCountdownElements();

    // Read target date from HTML data attribute
    const targetDateString = elements.section?.getAttribute('data-target-date');

    // Use provided date or fall back to default
    const dateString = targetDateString || DEFAULT_TARGET_DATE;

    // Parse date and convert to timestamp
    const targetDate = new Date(dateString).getTime();

    // Validate parsed date
    if (isNaN(targetDate)) {
        console.error(
            '❌ Invalid target date format in data-target-date attribute.',
            '\n📅 Expected format: YYYY-MM-DDTHH:mm:ss (ISO 8601)',
            '\n📝 Example: "2025-12-31T23:59:59"',
            '\n🔧 Falling back to default date:',
            DEFAULT_TARGET_DATE
        );
        return new Date(DEFAULT_TARGET_DATE).getTime();
    }

    return targetDate;
}

/* ===================================
   ⏱️ MAIN COUNTDOWN TIMER LOGIC
   =================================== */

/**
 * Main timer function - calculates and updates countdown display
 *
 * Called once immediately upon initialization, then every second via
 * setInterval. Calculates time remaining, updates display, and handles
 * expired state.
 *
 * Process:
 * 1. Validate DOM elements exist
 * 2. Get target date from configuration
 * 3. Calculate time difference
 * 4. If expired → show zeros and expired state
 * 5. If active → calculate time units and update display
 * 6. Update ARIA labels for accessibility
 *
 * @returns {void}
 *
 * @example
 * // Called automatically by initializeCountdown()
 * timer();
 *
 * @public
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

    // Update display
    updateDisplay(elements, timeUnits);

    // Update accessibility attributes
    updateAriaLabels(elements, timeUnits);
}

/* ===================================
   🧮 TIME CALCULATION UTILITIES
   =================================== */

/**
 * Calculate days, hours, minutes, seconds from milliseconds
 *
 * Converts millisecond time difference into human-readable units.
 * Uses integer division and modulo operations for accuracy.
 *
 * @param {number} timeDifference - Time difference in milliseconds
 * @returns {Object} Object containing calculated time units
 * @returns {number} return.days - Full days remaining
 * @returns {number} return.hours - Hours remaining (0-23)
 * @returns {number} return.minutes - Minutes remaining (0-59)
 * @returns {number} return.seconds - Seconds remaining (0-59)
 *
 * @example
 * const units = calculateTimeUnits(90061000); // 1 day, 1 hour, 1 minute, 1 second
 * // Returns: { days: 1, hours: 1, minutes: 1, seconds: 1 }
 *
 * @private
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
 *
 * Ensures consistent two-digit display format (e.g., "05" instead of "5").
 * Uses String.padStart() for clean implementation.
 *
 * @param {number} value - Time value to format (0-99)
 * @returns {string} Formatted time string with leading zero
 *
 * @example
 * formatTimeUnit(5);  // Returns: "05"
 * formatTimeUnit(23); // Returns: "23"
 *
 * @private
 */
function formatTimeUnit(value) {
    return value.toString().padStart(2, '0');
}

/* ===================================
   🖥️ DISPLAY UPDATE FUNCTIONS
   =================================== */

/**
 * Update countdown display with new values
 *
 * Updates all four countdown elements (days, hours, minutes, seconds)
 * with formatted time values. Uses formatTimeUnit() to ensure
 * consistent two-digit display.
 *
 * @param {Object} elements - Cached DOM elements
 * @param {Object} timeUnits - Calculated time units
 * @param {number} timeUnits.days - Days remaining
 * @param {number} timeUnits.hours - Hours remaining
 * @param {number} timeUnits.minutes - Minutes remaining
 * @param {number} timeUnits.seconds - Seconds remaining
 * @returns {void}
 *
 * @example
 * const elements = getCountdownElements();
 * const timeUnits = { days: 10, hours: 5, minutes: 30, seconds: 15 };
 * updateDisplay(elements, timeUnits);
 *
 * @private
 */
function updateDisplay(elements, timeUnits) {
    elements.days.textContent = formatTimeUnit(timeUnits.days);
    elements.hours.textContent = formatTimeUnit(timeUnits.hours);
    elements.minutes.textContent = formatTimeUnit(timeUnits.minutes);
    elements.seconds.textContent = formatTimeUnit(timeUnits.seconds);
}

/**
 * Handle countdown expiration - display zeros and add expired styling
 *
 * Called when countdown reaches zero. Updates display to show all zeros,
 * adds CSS class for visual feedback, updates accessibility labels,
 * and stops the timer to prevent unnecessary processing.
 *
 * @param {Object} elements - Cached DOM elements
 * @returns {void}
 *
 * @example
 * // Called automatically when timer reaches zero
 * handleExpiredCountdown(elements);
 *
 * @private
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
    updateAriaLabels(elements, { days: 0, hours: 0, minutes: 0, seconds: 0 });

    // Log expiration (helpful for debugging)
    console.log('⏰ Countdown expired!');

    // Stop the timer since countdown is complete
    cleanupCountdown();
}

/* ===================================
   ♿ ACCESSIBILITY FUNCTIONS
   =================================== */

import { getTranslation } from './i18n.js';

/* ===================================
   ♿ ACCESSIBILITY FUNCTIONS
   =================================== */

/**
 * Update ARIA labels for screen reader accessibility
 *
 * Provides descriptive labels for visually impaired users.
 * Updates each time unit with human-readable text indicating
 * remaining time.
 *
 * @param {Object} elements - Cached DOM elements
 * @param {Object} timeUnits - Current time unit values
 * @param {number} timeUnits.days - Days remaining
 * @param {number} timeUnits.hours - Hours remaining
 * @param {number} timeUnits.minutes - Minutes remaining
 * @param {number} timeUnits.seconds - Seconds remaining
 * @returns {void}
 *
 * @example
 * const elements = getCountdownElements();
 * const timeUnits = { days: 5, hours: 10, minutes: 30, seconds: 45 };
 * updateAriaLabels(elements, timeUnits);
 * // Sets aria-label="5 days remaining" on days element, etc.
 *
 * @private
 */
function updateAriaLabels(elements, timeUnits) {
    const remainingText = getTranslation('countdown.aria_remaining');
    const daysText = getTranslation('countdown.aria_days');
    const hoursText = getTranslation('countdown.aria_hours');
    const minutesText = getTranslation('countdown.aria_minutes');
    const secondsText = getTranslation('countdown.aria_seconds');

    if (elements.days) {
        elements.days.setAttribute(
            'aria-label',
            `${timeUnits.days} ${daysText} ${remainingText}`
        );
    }
    if (elements.hours) {
        elements.hours.setAttribute(
            'aria-label',
            `${timeUnits.hours} ${hoursText} ${remainingText}`
        );
    }
    if (elements.minutes) {
        elements.minutes.setAttribute(
            'aria-label',
            `${timeUnits.minutes} ${minutesText} ${remainingText}`
        );
    }
    if (elements.seconds) {
        elements.seconds.setAttribute(
            'aria-label',
            `${timeUnits.seconds} ${secondsText} ${remainingText}`
        );
    }
}

/* ===================================
   🚀 INITIALIZATION & CLEANUP
   =================================== */

/**
 * Initialize countdown with comprehensive error handling
 *
 * Sets up countdown timer system:
 * 1. Validates all required DOM elements exist
 * 2. Logs configuration (target date) once during init
 * 3. Calls timer() immediately for instant display
 * 4. Sets up 1-second interval for continuous updates
 * 5. Stores interval ID globally for cleanup
 *
 * @returns {number|boolean} Interval ID if successful, false if failed
 *
 * @example
 * // In script.js:
 * import { initializeCountdown } from './countdown-clock.js';
 * document.addEventListener('DOMContentLoaded', initializeCountdown);
 *
 * @public
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
            '\n<div id="days">00</div>',
            '\n<div id="hours">00</div>',
            '\n<div id="minutes">00</div>',
            '\n<div id="seconds">00</div>'
        );
        return false;
    }

    // Log configuration ONCE during initialization
    const section = document.querySelector('.countdown-section');
    const targetDateString = section?.getAttribute('data-target-date');
    if (targetDateString) {
        const targetDate = new Date(targetDateString);
        console.log(
            '✅ Countdown configured for:',
            targetDate.toLocaleString()
        );
    } else {
        console.log(
            '⚠️ No target date specified, using default:',
            DEFAULT_TARGET_DATE
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
 *
 * Called on page unload or when countdown expires to:
 * 1. Clear the setInterval timer
 * 2. Remove global interval reference
 * 3. Clear cached DOM elements
 *
 * Prevents memory leaks in single-page applications or when
 * countdown component is dynamically removed.
 *
 * @returns {void}
 *
 * @example
 * // In script.js:
 * import { cleanupCountdown } from './countdown-clock.js';
 * window.addEventListener('beforeunload', cleanupCountdown);
 *
 * @public
 */
export function cleanupCountdown() {
    if (typeof window !== 'undefined' && window.countdownInterval) {
        clearInterval(window.countdownInterval);
        window.countdownInterval = null;
        cachedElements = null; // Clear cached elements
        console.log('🧹 Countdown timer cleaned up');
    }
}
