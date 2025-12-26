// ================================================
// 📅 CALENDAR MODULE - Business Interactive Travel Schedule
// ================================================
//
// 📋 MODULE PURPOSE:
// Displays an interactive monthly calendar showing dates when the fortune
// teller is traveling to other cities. Features automatic date updates,
// responsive layout adaptation, and visual highlighting of special days.
//
// 🎬 USER INTERACTION FLOW:
// 1. Calendar loads showing current month automatically
// 2. User can navigate months using prev/next buttons
// 3. Current day highlighted in calendar
// 4. Travel dates visually marked with city names
// 5. Calendar auto-updates every 6 hours to stay current
// 6. Returns to current month when page becomes visible again
//
// 🔗 DEPENDENCIES:
// - HTML: .calendar-weekdays container for day names
// - HTML: .calendar-days container for date cells
// - HTML: .calendar-button--previous and .calendar-button--next buttons
// - HTML: .month-name and .month-year display elements
// - CSS: 09-calendar-section-styles.css for styling
//
// 📦 FEATURES:
// - Auto-updates every 6 hours to stay current
// - Highlights current day, weekends, and travel dates
// - Displays consistent 6-week view (42 days total)
// - Russian language support for months/weekdays
// - Keyboard and screen reader accessible (ARIA attributes)
// - Previous/next month navigation
// - Automatic return to current month on page visibility change
// - Memory leak prevention with cleanup functions
//
// 🎨 VISUAL INDICATORS:
// - .calendar-day--today: Current date
// - .calendar-day--weekend: Saturday or Sunday
// - .calendar-day--travel: Falls within travel date range
// - .calendar-day--other-month: Belongs to previous/next month
//
// ⚠️ IMPORTANT NOTES:
// - Initialized from script.js (call renderCalendar() and startAutoUpdate())
// - Travel dates configured in tripDates object
// - Auto-update interval: 6 hours (configurable)
// - Always shows 6 weeks (42 days) for consistent height

/* ===================================
   🌐 CONFIGURATION & STATE
   =================================== */

/**
 * Auto-update interval in milliseconds
 * Calendar automatically refreshes to stay current with the date
 *
 * @constant {number}
 * @default 21600000 (6 hours)
 *
 * 🔧 Adjustment guide:
 * - 1 hour = 60 * 60 * 1000 = 3,600,000ms
 * - 6 hours = 6 * 60 * 60 * 1000 = 21,600,000ms
 * - 12 hours = 12 * 60 * 60 * 1000 = 43,200,000ms
 */
const UPDATE_INTERVAL = 6 * 60 * 60 * 1000;

/**
 * Travel schedule configuration
 * Defines when and where the fortune teller will be traveling
 *
 * @constant {Object}
 * @property {string} cityRussian - Destination city name in Russian
 * @property {string} start - Start date in ISO format (YYYY-MM-DD)
 * @property {string} end - End date in ISO format (YYYY-MM-DD)
 *
 * 📝 Note: Dates are inclusive (both start and end dates are highlighted)
 * 🔧 TODO: Consider moving to external configuration or fetching from API
 */
const tripDates = {
    cityRussian: 'Вильнюс', // Vilnius in Russian
    start: '2025-12-16',
    end: '2025-12-26',
};

/**
 * Current date information object
 * Stores comprehensive details about today's date
 *
 * @type {Object|null}
 */
let todayDateInfo = null;

/**
 * Currently viewed year in calendar
 * User can navigate to different years using next/prev buttons
 *
 * @type {number|null}
 */
let viewedYear = null;

/**
 * Currently viewed month in calendar (1-12)
 * User can navigate to different months using next/prev buttons
 *
 * @type {number|null}
 */
let viewedMonth = null;

/**
 * Auto-update interval reference
 * Used to clear interval when stopping auto-updates
 *
 * @type {number|null}
 */
let autoUpdateInterval = null;

/* ===================================
   📅 DATE UTILITY FUNCTIONS
   =================================== */

/**
 * Get comprehensive information about the current date
 *
 * Returns detailed information about today's date including:
 * - Current Date object
 * - ISO formatted date string
 * - Year, month, day components
 * - Day of week (0-6, where 0 = Sunday)
 * - Weekday name in Russian
 * - Weekend status
 *
 * @returns {Object} Complete date information object
 * @returns {Date} return.currentDate - JavaScript Date object for now
 * @returns {string} return.currentDateISO - ISO date string (YYYY-MM-DD) in UTC
 * @returns {number} return.year - Full year (e.g., 2025)
 * @returns {number} return.month - Month number (1-12, not 0-11)
 * @returns {number} return.dayOfTheWeek - Day of week (0-6, 0 = Sunday)
 * @returns {number} return.dayOfTheMonth - Day of month (1-31)
 * @returns {string} return.weekdayName - Full weekday name in Russian
 * @returns {boolean} return.isWeekend - True if Saturday or Sunday
 *
 * @example
 * const dateInfo = getCurrentDate();
 * console.log(dateInfo.weekdayName); // "понедельник" (Monday)
 * console.log(dateInfo.isWeekend); // false
 * console.log(dateInfo.currentDateISO); // "2025-12-11"
 *
 * @public
 */
export function getCurrentDate() {
    const currentDate = new Date();
    const currentDateISO = currentDate.toISOString().split('T')[0];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Convert 0-11 to 1-12
    const dayOfTheWeek = currentDate.getDay(); // 0 = Sunday, 6 = Saturday
    const dayOfTheMonth = currentDate.getDate();
    const weekdayName = currentDate.toLocaleDateString('ru-RU', {
        weekday: 'long',
    });

    return {
        currentDate,
        currentDateISO,
        year,
        month,
        dayOfTheWeek,
        dayOfTheMonth,
        weekdayName,
        isWeekend: isWeekend(dayOfTheWeek),
    };
}

/**
 * Check if a day of week is a weekend
 *
 * @param {number} dayOfWeek - Day of week (0-6, where 0 = Sunday)
 * @returns {boolean} True if Saturday (6) or Sunday (0)
 *
 * @example
 * isWeekend(0) // true (Sunday)
 * isWeekend(6) // true (Saturday)
 * isWeekend(1) // false (Monday)
 *
 * @private
 */
function isWeekend(dayOfWeek) {
    return dayOfWeek === 6 || dayOfWeek === 0;
}

/**
 * Check if a given date is today
 *
 * Compares the provided date with the current date stored in todayDateInfo.
 * Uses local date comparison (not UTC) to match user's timezone.
 *
 * @param {Date} day - Date object to check
 * @returns {boolean} True if the date is today
 *
 * @example
 * isToday(new Date()) // true
 * isToday(new Date('2025-12-11')) // depends on current date
 *
 * @private
 */
function isToday(day) {
    // Compare local dates rather than UTC to match user's timezone
    return (
        day.getFullYear() === todayDateInfo.year &&
        day.getMonth() + 1 === todayDateInfo.month &&
        day.getDate() === todayDateInfo.dayOfTheMonth
    );
}

/**
 * Check if a given date falls within the travel schedule
 *
 * Compares date against the configured travel date range in tripDates.
 * Dates are inclusive (both start and end dates return true).
 *
 * @param {Date} day - Date object to check
 * @returns {boolean} True if date is within travel period
 *
 * @example
 * // With tripDates = { start: '2025-12-18', end: '2025-12-24' }
 * isTrip(new Date('2025-12-18')) // true (start date)
 * isTrip(new Date('2025-12-20')) // true (during trip)
 * isTrip(new Date('2025-12-24')) // true (end date)
 * isTrip(new Date('2025-12-25')) // false (after trip)
 *
 * @private
 */
function isTrip(day) {
    const formatted = formatDateISO(day);
    return formatted >= tripDates.start && formatted <= tripDates.end;
}

/**
 * Check if a date belongs to the currently viewed month
 *
 * Used to identify dates from adjacent months in the 6-week calendar view.
 * These dates are displayed but visually dimmed.
 *
 * @param {Date} day - Date object to check
 * @param {number} year - Year being viewed
 * @param {number} month - Month being viewed (1-12)
 * @returns {boolean} True if date belongs to the viewed month
 *
 * @example
 * isViewedMonth(new Date('2025-12-15'), 2025, 12) // true
 * isViewedMonth(new Date('2025-11-30'), 2025, 12) // false (previous month)
 *
 * @private
 */
function isViewedMonth(day, year, month) {
    return day.getMonth() === month - 1 && day.getFullYear() === year;
}

/**
 * Format a Date object to ISO date string (YYYY-MM-DD)
 *
 * Extracts just the date portion from the full ISO string.
 * Time and timezone information is discarded.
 *
 * @param {Date} date - Date object to format
 * @returns {string} ISO formatted date string (YYYY-MM-DD)
 *
 * @example
 * formatDateISO(new Date('2025-12-11T14:30:00'))
 * // Returns: "2025-12-11"
 *
 * @private
 */
function formatDateISO(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Check if calendar needs updating due to date change
 *
 * Compares current system date with the date stored in todayDateInfo.
 * Returns true if month or year has changed since last update.
 *
 * @returns {boolean} True if current date differs from stored date
 *
 * @example
 * // If todayDateInfo shows December 2025 but now it's January 2026
 * shouldUpdateCalendar() // true
 *
 * @private
 */
function shouldUpdateCalendar() {
    const newInfo = getCurrentDate();
    return (
        newInfo.month !== todayDateInfo.month ||
        newInfo.year !== todayDateInfo.year
    );
}

/* ===================================
   🔄 AUTO-UPDATE SYSTEM
   =================================== */

/**
 * Update calendar to current month if date has changed
 *
 * Checks if the current date differs from the stored date.
 * If changed, updates the stored date and re-renders the calendar
 * to show the current month.
 *
 * This is called periodically by the auto-update system and also
 * when the page becomes visible again after being hidden.
 *
 * @returns {void}
 * @private
 */
function updateToCurrentMonth() {
    if (shouldUpdateCalendar()) {
        todayDateInfo = getCurrentDate();
        viewedYear = todayDateInfo.year;
        viewedMonth = todayDateInfo.month;
        renderCalendar();
    }
}

/**
 * Start the automatic update system
 *
 * Sets up a periodic interval that checks if the calendar needs updating
 * every UPDATE_INTERVAL milliseconds (default: 6 hours).
 *
 * Clears any existing interval before starting to prevent duplicates.
 * The interval continues until stopAutoUpdate() is called or page unloads.
 *
 * @returns {void}
 *
 * @example
 * startAutoUpdate(); // Calendar will auto-update every 6 hours
 *
 * @public
 */
export function startAutoUpdate() {
    // Clear existing interval if any (prevents duplicates)
    if (autoUpdateInterval) {
        clearInterval(autoUpdateInterval);
    }

    // Start new interval
    autoUpdateInterval = setInterval(updateToCurrentMonth, UPDATE_INTERVAL);
}

/**
 * Stop the automatic update system
 *
 * Clears the periodic update interval, halting all automatic updates.
 * Calendar will no longer automatically refresh until startAutoUpdate()
 * is called again.
 *
 * @returns {void}
 *
 * @example
 * stopAutoUpdate(); // Stop auto-updates (e.g., when component unmounts)
 *
 * @public
 */
export function stopAutoUpdate() {
    if (autoUpdateInterval) {
        clearInterval(autoUpdateInterval);
        autoUpdateInterval = null;
    }
}

/**
 * Manually trigger calendar update to current month
 *
 * Forces an immediate check and update, bypassing the normal interval.
 * Useful for testing or triggering updates on demand.
 *
 * @returns {void}
 *
 * @example
 * forceUpdateCalendar(); // Immediately update to current month
 *
 * @public
 */
export function forceUpdateCalendar() {
    updateToCurrentMonth();
}

/* ===================================
   🌍 LOCALIZATION DATA
   =================================== */

/**
 * Month names in Russian
 * Used for calendar header display
 *
 * @constant {Object}
 * @private
 */
const months = {
    russian: [
        'Январь', // January
        'Февраль', // February
        'Март', // March
        'Апрель', // April
        'Май', // May
        'Июнь', // June
        'Июль', // July
        'Август', // August
        'Сентябрь', // September
        'Октябрь', // October
        'Ноябрь', // November
        'Декабрь', // December
    ],
};

/**
 * Weekday names in Russian
 * Used for weekday header row
 * Starts with Monday (European convention)
 *
 * @constant {Object}
 * @private
 */
const weekdays = {
    russian: [
        'Понедельник', // Monday
        'Вторник', // Tuesday
        'Среда', // Wednesday
        'Четверг', // Thursday
        'Пятница', // Friday
        'Суббота', // Saturday
        'Воскресенье', // Sunday
    ],
};

/* ===================================
   🎨 CALENDAR RENDERING
   =================================== */

/**
 * Render the complete calendar for the currently viewed month
 *
 * This is the main rendering function that builds the entire calendar UI:
 * 1. Clears existing content
 * 2. Renders weekday headers (Mon-Sun)
 * 3. Calculates and renders 42 day cells (6 weeks)
 * 4. Applies appropriate CSS classes based on day states
 * 5. Updates month/year header text
 *
 * The calendar always shows 6 weeks (42 days) for consistent height,
 * including days from adjacent months when needed.
 *
 * 🎯 Day States Applied:
 * - calendar-day--today: Current date
 * - calendar-day--weekend: Saturday or Sunday
 * - calendar-day--travel: Falls within travel date range
 * - calendar-day--other-month: Belongs to previous/next month
 *
 * ♿ Accessibility Features:
 * - role="gridcell" for screen readers
 * - tabindex="0" for keyboard navigation
 * - aria-selected for important dates
 * - aria-live region automatically updates
 *
 * @returns {void}
 *
 * @example
 * // Render calendar for current viewed month
 * renderCalendar();
 *
 * @example
 * // After changing viewedMonth/viewedYear
 * viewedMonth = 12;
 * viewedYear = 2025;
 * renderCalendar(); // Shows December 2025
 *
 * @public
 */
export function renderCalendar() {
    // Cache DOM elements for better performance
    const weekContainer = document.querySelector('.calendar-weekdays');
    const dayContainer = document.querySelector('.calendar-days');

    // Clear existing content
    weekContainer.innerHTML = '';
    dayContainer.innerHTML = '';

    // Render weekday headers
    weekdays.russian.forEach((weekday) => {
        const element = document.createElement('div');
        element.className = 'calendar-weekday';
        element.textContent = weekday;
        weekContainer.appendChild(element);
    });

    // Calculate 6-week calendar grid
    // Calculate the starting offset for the first day of the month
    // JavaScript's getDay() returns 0 for Sunday, but we want Monday-first
    // layout, so we adjust: Sunday (0) becomes 6, Monday (1) becomes 0, etc.
    const firstDayOfMonth = new Date(viewedYear, viewedMonth - 1, 1);
    const firstDayWeekday = firstDayOfMonth.getDay();
    const startIndex = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1;

    // Get total days in the current month
    const daysInMonth = new Date(viewedYear, viewedMonth, 0).getDate();

    // Array to hold all dates to display (6 weeks = 42 days)
    const days = [];

    // Add previous month's trailing days
    for (let i = startIndex - 1; i >= 0; i--) {
        days.push(new Date(viewedYear, viewedMonth - 1, -i));
    }

    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(viewedYear, viewedMonth - 1, i));
    }

    // Add next month's leading days to complete 6 weeks
    // Why 42? Standard calendar shows 6 rows of 7 days
    // This ensures consistent calendar height regardless of month
    const fillCount = 42 - days.length;
    for (let i = 1; i <= fillCount; i++) {
        days.push(new Date(viewedYear, viewedMonth, i));
    }

    // Render day cells
    days.forEach((date) => {
        const formatted = formatDateISO(date);
        const isTodayFlag = isToday(date);
        const isTripFlag = isTrip(date);

        // Create cell element
        const cell = document.createElement('div');
        cell.className = 'calendar-day';

        // Accessibility attributes
        cell.setAttribute('role', 'gridcell');
        cell.setAttribute('tabindex', '0'); // Keyboard navigable
        cell.setAttribute(
            'aria-selected',
            (isTodayFlag || isTripFlag).toString()
        );

        // Apply state-based CSS classes
        if (isWeekend(date.getDay())) {
            cell.classList.add('calendar-day--weekend');
        }
        if (isTodayFlag) {
            cell.classList.add('calendar-day--today');
        }
        if (isTripFlag) {
            cell.classList.add('calendar-day--travel');
        }
        if (!isViewedMonth(date, viewedYear, viewedMonth)) {
            cell.classList.add('calendar-day--other-month');
        }

        // Create day number element
        const numberElement = document.createElement('div');
        numberElement.className = 'calendar-day__number';
        numberElement.textContent = date.getDate();
        cell.appendChild(numberElement);

        // Add city label for travel days
        if (isTripFlag) {
            const cityElement = document.createElement('div');
            cityElement.className = 'calendar-day__city';
            cityElement.textContent = tripDates.cityRussian;
            cell.appendChild(cityElement);
        }

        // Add cell to container
        dayContainer.appendChild(cell);
    });

    // Update header text
    document.querySelector('.month-name').textContent =
        months.russian[viewedMonth - 1];
    document.querySelector('.month-year').textContent = viewedYear;
}

/* ===================================
   🎮 USER INTERACTION HANDLERS
   =================================== */

/**
 * Navigate to a different month
 *
 * Changes the viewed month by the specified direction and re-renders.
 * Handles year transitions automatically.
 *
 * @param {number} direction - 1 for next month, -1 for previous month
 * @returns {void}
 * @private
 */
function changeMonth(direction) {
    viewedMonth += direction;

    // Handle year boundaries
    if (viewedMonth < 1) {
        viewedMonth = 12;
        viewedYear--;
    } else if (viewedMonth > 12) {
        viewedMonth = 1;
        viewedYear++;
    }

    renderCalendar();
}

/**
 * Previous month button event listener
 * Navigates backward one month when clicked
 */
const prevButton = document.querySelector('.calendar-button--previous');
prevButton.addEventListener('click', () => changeMonth(-1));

/**
 * Next month button event listener
 * Navigates forward one month when clicked
 */
const nextButton = document.querySelector('.calendar-button--next');
nextButton.addEventListener('click', () => changeMonth(1));

/**
 * Page visibility change handler
 * Update calendar when page becomes visible again
 *
 * If user switches away from the page and comes back later,
 * this ensures the calendar shows the current month.
 *
 * Small delay (1 second) allows browser to complete tab switch
 * before triggering the update.
 */
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        setTimeout(updateToCurrentMonth, 1000);
    }
});

/* ===================================
   🚀 INITIALIZATION
   =================================== */

/**
 * Initialize calendar state and render
 * This runs immediately when the module loads
 */
todayDateInfo = getCurrentDate();
viewedYear = todayDateInfo.year;
viewedMonth = todayDateInfo.month;

// Initial render
renderCalendar();

// Start auto-update system
startAutoUpdate();

console.log('✅ Calendar module initialized');

/* ================================================
   🔧 DEBUG UTILITIES - MOVE TO DEV FILE LATER
   ================================================
   
   📊 Console Testing Commands:
   Copy these to browser console for debugging
   
   ──────────────────────────────────────────────
   CHECK CURRENT STATE:
   ──────────────────────────────────────────────
   
   // Get current calendar state
   function debugCalendar() {
       console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
       console.log('📅 CALENDAR STATE');
       console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
       console.log('Today:', todayDateInfo);
       console.log('Viewed Month:', viewedMonth);
       console.log('Viewed Year:', viewedYear);
       console.log('Auto-update active:', autoUpdateInterval !== null);
       console.log('Trip dates:', tripDates);
       console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
   }
   
   ──────────────────────────────────────────────
   NAVIGATE MONTHS:
   ──────────────────────────────────────────────
   
   // Go to specific month
   function goToMonth(year, month) {
       viewedYear = year;
       viewedMonth = month;
       renderCalendar();
       console.log(`✅ Navigated to ${month}/${year}`);
   }
   
   // Usage:
   goToMonth(2026, 1);   // January 2026
   goToMonth(2025, 12);  // December 2025
   
   ──────────────────────────────────────────────
   TEST DATE FUNCTIONS:
   ──────────────────────────────────────────────
   
   // Test if a date is special
   function testDate(dateString) {
       const date = new Date(dateString);
       console.log(`🧪 Testing date: ${dateString}`);
       console.log({
           isToday: isToday(date),
           isTrip: isTrip(date),
           isWeekend: isWeekend(date.getDay()),
           formatted: formatDateISO(date)
       });
   }
   
   // Usage:
   testDate('2025-12-20');  // Test a specific date
   testDate('2025-12-25');  // Test another date
   
   ──────────────────────────────────────────────
   FORCE UPDATE:
   ──────────────────────────────────────────────
   
   // Force calendar to update to current month
   function forceUpdate() {
       forceUpdateCalendar();
       console.log('✅ Calendar force-updated to current month');
   }
   
   ──────────────────────────────────────────────
   CONTROL AUTO-UPDATE:
   ──────────────────────────────────────────────
   
   // Stop auto-updates
   function stopUpdates() {
       stopAutoUpdate();
       console.log('🛑 Auto-update stopped');
   }
   
   // Start auto-updates
   function startUpdates() {
       startAutoUpdate();
       console.log('▶️ Auto-update started');
   }
   
   ──────────────────────────────────────────────
   CHECK CALENDAR CELLS:
   ──────────────────────────────────────────────
   
   // List all rendered days and their states
   function debugCells() {
       const cells = document.querySelectorAll('.calendar-day');
       console.log(`📊 Calendar has ${cells.length} cells (should be 42)\n`);
       
       let todayCount = 0;
       let weekendCount = 0;
       let travelCount = 0;
       
       cells.forEach(cell => {
           if (cell.classList.contains('calendar-day--today')) todayCount++;
           if (cell.classList.contains('calendar-day--weekend')) weekendCount++;
           if (cell.classList.contains('calendar-day--travel')) travelCount++;
       });
       
       console.log('Today cells:', todayCount);
       console.log('Weekend cells:', weekendCount);
       console.log('Travel cells:', travelCount);
   }
   
   ──────────────────────────────────────────────
   TEST NAVIGATION BUTTONS:
   ──────────────────────────────────────────────
   
   // Test previous button
   function testPrevious() {
       const button = document.querySelector('.calendar-button--previous');
       button.click();
       console.log('⬅️ Previous month');
   }
   
   // Test next button
   function testNext() {
       const button = document.querySelector('.calendar-button--next');
       button.click();
       console.log('➡️ Next month');
   }
   
   ──────────────────────────────────────────────
   MODIFY TRIP DATES:
   ──────────────────────────────────────────────
   
   // Change travel dates
   function setTripDates(city, start, end) {
       tripDates.cityRussian = city;
       tripDates.start = start;
       tripDates.end = end;
       renderCalendar();
       console.log('✅ Trip dates updated:', tripDates);
   }
   
   // Usage:
   setTripDates('Москва', '2025-12-20', '2025-12-25');
   
   ──────────────────────────────────────────────
   FULL DIAGNOSTIC:
   ──────────────────────────────────────────────
   
   // Run complete diagnostic
   function fullCalendarDiagnostic() {
       console.log('🔍 RUNNING FULL CALENDAR DIAGNOSTIC');
       console.log('═══════════════════════════════════════\n');
       
       debugCalendar();
       console.log('\n───────────────────────────────────────\n');
       
       debugCells();
       console.log('\n───────────────────────────────────────\n');
       
       console.log('📍 Current date info:');
       console.log(getCurrentDate());
       
       console.log('\n═══════════════════════════════════════');
       console.log('✅ DIAGNOSTIC COMPLETE');
   }
   
   ──────────────────────────────────────────────
   USAGE:
   ──────────────────────────────────────────────
   
   Copy and paste in browser console:
   
   fullCalendarDiagnostic()         // Complete diagnostic
   debugCalendar()                   // Check state
   goToMonth(2026, 1)                // Navigate to month
   testDate('2025-12-20')            // Test date
   forceUpdate()                     // Force update
   stopUpdates()                     // Stop auto-update
   startUpdates()                    // Start auto-update
   debugCells()                      // Check cells
   testPrevious()                    // Test prev button
   testNext()                        // Test next button
   setTripDates('Москва', '2025-12-20', '2025-12-25')  // Change trip
   
*/

/* ================================================
   📝 TECHNICAL DOCUMENTATION
   ================================================
   
   ──────────────────────────────────────────────
   6-WEEK CALENDAR ALGORITHM:
   ──────────────────────────────────────────────
   
   Why always show*/
