/* ================================================
   🔧 DEBUG UTILITIES - MOVE TO DEV FILE LATER
   ================================================ */

//   📊 Console Testing Commands:
//   Copy these to browser console for debugging

/* ──────────────────────────────────────────────
   CHECK CURRENT COUNTDOWN STATUS:
   ────────────────────────────────────────────── */

// View all countdown information
function debugCountdown() {
    const section = document.querySelector('.countdown-section');
    const targetDate = section?.getAttribute('data-target-date');

    const elements = {
        days: document.getElementById('days')?.textContent,
        hours: document.getElementById('hours')?.textContent,
        minutes: document.getElementById('minutes')?.textContent,
        seconds: document.getElementById('seconds')?.textContent,
    };

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⏰ COUNTDOWN STATUS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎯 Target Date:', targetDate || 'Not set');
    console.log('📅 Target Parsed:', targetDate ? new Date(targetDate) : 'N/A');
    console.log('⏱️ Current Display:', elements);

    if (targetDate) {
        const target = new Date(targetDate).getTime();
        const now = Date.now();
        const diff = target - now;
        const isExpired = diff <= 0;

        console.log(
            '🕐 Time Until:',
            isExpired ? 'EXPIRED' : `${Math.floor(diff / 1000)} seconds`
        );
        console.log('📊 Status:', isExpired ? '❌ Expired' : '✅ Active');

        if (!isExpired) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
                (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            console.log(
                '📋 Breakdown:',
                `${days}d ${hours}h ${minutes}m ${seconds}s`
            );
        }
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

/* ──────────────────────────────────────────────
   MANUALLY TRIGGER COUNTDOWN UPDATE:
   ────────────────────────────────────────────── */

// Force immediate update of countdown display
function forceCountdownUpdate() {
    console.log('🔄 Forcing countdown update...');
    timer();
    console.log('✅ Update complete');
}

/* ──────────────────────────────────────────────
   TEST EXPIRED STATE:
   ────────────────────────────────────────────── */

// Set target date to past and reload to see expired state
function testExpiredState() {
    const section = document.querySelector('.countdown-section');
    if (!section) {
        console.error('❌ Countdown section not found');
        return;
    }

    console.log('🧪 Setting target date to past...');
    section.setAttribute('data-target-date', '2020-01-01T00:00:00');
    console.log('🔄 Reload page to see expired state');
    console.log('💡 Or run: forceCountdownUpdate()');
}

/* ──────────────────────────────────────────────
   CHANGE TARGET DATE DYNAMICALLY:
   ────────────────────────────────────────────── */

// Update target date without page reload
function setCountdownDate(dateString) {
    const section = document.querySelector('.countdown-section');
    if (!section) {
        console.error('❌ Countdown section not found');
        return;
    }

    // Validate date format
    const testDate = new Date(dateString);
    if (isNaN(testDate.getTime())) {
        console.error('❌ Invalid date format');
        console.log('📝 Use: YYYY-MM-DDTHH:mm:ss');
        console.log('📝 Example: "2026-01-01T00:00:00"');
        return;
    }

    section.setAttribute('data-target-date', dateString);
    console.log('✅ Target date updated to:', dateString);
    console.log('📅 New target:', testDate.toLocaleString());
    console.log('🔄 Updating display...');

    // Clear cache to force re-read of target date
    cachedElements = null;

    // Force update
    timer();
}

// Usage examples:
setCountdownDate('2026-01-01T00:00:00'); // New Year 2026
setCountdownDate('2025-12-31T23:59:59'); // New Year's Eve 2025
setCountdownDate('2025-06-15T12:00:00'); // Specific date and time

/* ──────────────────────────────────────────────
   TEST TIME CALCULATION:
   ────────────────────────────────────────────── */

// Test calculateTimeUnits with specific millisecond values
function testTimeCalculation() {
    console.log('🧪 Testing time calculation:');

    const tests = [
        { ms: 1000, label: '1 second' },
        { ms: 60000, label: '1 minute' },
        { ms: 3600000, label: '1 hour' },
        { ms: 86400000, label: '1 day' },
        { ms: 90061000, label: '1d 1h 1m 1s' },
        { ms: 259200000, label: '3 days' },
    ];

    tests.forEach((test) => {
        const units = calculateTimeUnits(test.ms);
        console.log(`\n${test.label}:`);
        console.log(`  Days: ${units.days}`);
        console.log(`  Hours: ${units.hours}`);
        console.log(`  Minutes: ${units.minutes}`);
        console.log(`  Seconds: ${units.seconds}`);
    });
}

/* ──────────────────────────────────────────────
   TEST FORMATTING:
   ────────────────────────────────────────────── */

// Test formatTimeUnit function
function testFormatting() {
    console.log('🧪 Testing time formatting:');

    const tests = [0, 1, 5, 9, 10, 23, 59, 99];

    tests.forEach((num) => {
        const formatted = formatTimeUnit(num);
        console.log(`  ${num} → "${formatted}"`);
    });
}

/* ──────────────────────────────────────────────
   CHECK DOM ELEMENTS:
   ────────────────────────────────────────────── */

// Verify all required DOM elements exist
function checkCountdownDOM() {
    const required = ['days', 'hours', 'minutes', 'seconds'];
    const section = document.querySelector('.countdown-section');

    console.log('📦 DOM Element Check:');
    console.log('  Section:', section ? '✅ Found' : '❌ Missing');

    required.forEach((id) => {
        const element = document.getElementById(id);
        const status = element ? '✅' : '❌';
        const text = element ? element.textContent : 'N/A';
        console.log(`  #${id}:`, status, `(value: "${text}")`);
    });
}

/* ──────────────────────────────────────────────
   SIMULATE COUNTDOWN:
   ────────────────────────────────────────────── */

// Simulate countdown with custom time
function simulateCountdown(days, hours, minutes, seconds) {
    const elements = getCountdownElements();
    if (!elements || !elements.days) {
        console.error('❌ Countdown elements not found');
        return;
    }

    console.log(
        '🎬 Simulating countdown:',
        `${days}d ${hours}h ${minutes}m ${seconds}s`
    );

    const timeUnits = { days, hours, minutes, seconds };
    updateDisplay(elements, timeUnits);
    updateAriaLabels(elements, timeUnits);

    console.log('✅ Display updated');
}

// Usage:
simulateCountdown(10, 5, 30, 45); // 10d 5h 30m 45s
simulateCountdown(0, 0, 0, 10); // 10 seconds
simulateCountdown(365, 0, 0, 0); // 1 year

/* ──────────────────────────────────────────────
   FULL DIAGNOSTIC:
   ────────────────────────────────────────────── */

// Run complete diagnostic
function fullCountdownDiagnostic() {
    console.log('🔍 RUNNING FULL COUNTDOWN DIAGNOSTIC');
    console.log('═══════════════════════════════════════\n');

    checkCountdownDOM();
    console.log('\n───────────────────────────────────────\n');

    debugCountdown();
    console.log('\n───────────────────────────────────────\n');

    console.log('🧪 Testing calculations:');
    testTimeCalculation();
    console.log('\n───────────────────────────────────────\n');

    console.log('🧪 Testing formatting:');
    testFormatting();

    console.log('\n═══════════════════════════════════════');
    console.log('✅ DIAGNOSTIC COMPLETE');
}

/* ──────────────────────────────────────────────
   USAGE:
   ────────────────────────────────────────────── */

//   Copy and paste in browser console:

fullCountdownDiagnostic(); // Complete diagnostic
debugCountdown(); // Check current status
forceCountdownUpdate(); // Force update
testExpiredState(); // Test expired state
setCountdownDate('2026-01-01T00:00:00'); // Change target
testTimeCalculation(); // Test calculations
testFormatting(); // Test formatting
checkCountdownDOM(); // Check DOM elements
simulateCountdown(10, 5, 30, 45); // Simulate display
