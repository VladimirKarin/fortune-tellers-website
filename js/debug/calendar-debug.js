/* ================================================
   🔧 DEBUG UTILITIES - MOVE TO DEV FILE LATER
   ================================================
   
   📊 Console Testing Commands:
   Copy these to browser console for debugging
   
   ──────────────────────────────────────────────
   CHECK CURRENT STATE:
   ────────────────────────────────────────────── */

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

/* ──────────────────────────────────────────────
   NAVIGATE MONTHS:
   ────────────────────────────────────────────── */

// Go to specific month
function goToMonth(year, month) {
    viewedYear = year;
    viewedMonth = month;
    renderCalendar();
    console.log(`✅ Navigated to ${month}/${year}`);
}

// Usage:
goToMonth(2026, 1); // January 2026
goToMonth(2025, 12); // December 2025

/* ──────────────────────────────────────────────
   TEST DATE FUNCTIONS:
   ────────────────────────────────────────────── */

// Test if a date is special
function testDate(dateString) {
    const date = new Date(dateString);
    console.log(`🧪 Testing date: ${dateString}`);
    console.log({
        isToday: isToday(date),
        isTrip: isTrip(date),
        isWeekend: isWeekend(date.getDay()),
        formatted: formatDateISO(date),
    });
}

// Usage:
testDate('2025-12-20'); // Test a specific date
testDate('2025-12-25'); // Test another date

/* ──────────────────────────────────────────────
   FORCE UPDATE:
   ────────────────────────────────────────────── */

// Force calendar to update to current month
function forceUpdate() {
    forceUpdateCalendar();
    console.log('✅ Calendar force-updated to current month');
}

/* ──────────────────────────────────────────────
   CONTROL AUTO-UPDATE:
   ────────────────────────────────────────────── */

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

/* ──────────────────────────────────────────────
   CHECK CALENDAR CELLS:
   ────────────────────────────────────────────── */

// List all rendered days and their states
function debugCells() {
    const cells = document.querySelectorAll('.calendar-day');
    console.log(`📊 Calendar has ${cells.length} cells (should be 42)\n`);

    let todayCount = 0;
    let weekendCount = 0;
    let travelCount = 0;

    cells.forEach((cell) => {
        if (cell.classList.contains('calendar-day--today')) todayCount++;
        if (cell.classList.contains('calendar-day--weekend')) weekendCount++;
        if (cell.classList.contains('calendar-day--travel')) travelCount++;
    });

    console.log('Today cells:', todayCount);
    console.log('Weekend cells:', weekendCount);
    console.log('Travel cells:', travelCount);
}

/* ──────────────────────────────────────────────
   TEST NAVIGATION BUTTONS:
   ────────────────────────────────────────────── */

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

/* ──────────────────────────────────────────────
   MODIFY TRIP DATES:
   ────────────────────────────────────────────── */

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

/* ──────────────────────────────────────────────
   FULL DIAGNOSTIC:
   ────────────────────────────────────────────── */

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

/* ──────────────────────────────────────────────
   USAGE:
   ────────────────────────────────────────────── */

//   Copy and paste in browser console:

fullCalendarDiagnostic(); // Complete diagnostic
debugCalendar(); // Check state
goToMonth(2026, 1); // Navigate to month
testDate('2025-12-20'); // Test date
forceUpdate(); // Force update
stopUpdates(); // Stop auto-update
startUpdates(); // Start auto-update
debugCells(); // Check cells
testPrevious(); // Test prev button
testNext(); // Test next button
setTripDates('Москва', '2025-12-20', '2025-12-25'); // Change trip
