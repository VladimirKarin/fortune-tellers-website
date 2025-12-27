/* ================================================
   🔧 DEBUG UTILITIES - MOVE TO DEV FILE LATER
   ================================================ */

//   📊 Console Testing Commands:
//   Copy these to browser console for debugging

/* ──────────────────────────────────────────────
   CHECK DOM ELEMENTS:
   ────────────────────────────────────────────── */

// Verify all DOM elements are found correctly
function debugMoonDOM() {
    const dom = new MoonPhaseDOM();
    console.log('📦 DOM Element Status:');
    console.log('  Layout:', dom.layout ? '✅' : '❌');
    console.log('  Image:', dom.image ? '✅' : '❌');
    console.log('  Phase name:', dom.phaseName?.textContent || '❌');
    console.log('  Countdown:', dom.countdown?.textContent || '❌');
    console.log('  Rituals:', dom.rituals?.textContent || '❌');
    console.log('  Is Ready:', dom.isReady() ? '✅' : '❌');
}

/* ──────────────────────────────────────────────
   TEST API FETCH:
   ────────────────────────────────────────────── */

// Manually trigger API fetch
async function testMoonAPI() {
    console.log('🧪 Testing API fetch...');
    await fetchMoonPhase();
}

/* ──────────────────────────────────────────────
   TEST LOCAL CALCULATION:
   ────────────────────────────────────────────── */

// Manually trigger local calculation
function testLocalCalculation() {
    console.log('🧪 Testing local calculation...');
    getLocalMoonPhase();
}

/* ──────────────────────────────────────────────
   FORCE SHOW SPECIFIC PHASE:
   ────────────────────────────────────────────── */

// Display any phase manually
function testShowPhase(phaseKey) {
    const validPhases = ['newMoon', 'waxingMoon', 'fullMoon', 'waningMoon'];

    if (!validPhases.includes(phaseKey)) {
        console.error('❌ Invalid phase. Use:', validPhases.join(', '));
        return;
    }

    console.log('🧪 Testing phase:', phaseKey);
    const moonData = moonPhaseInformation[phaseKey];
    updateMoonUI(moonData);
    calculateNextPhaseCountdown();
}

// Usage:
testShowPhase('fullMoon'); // Show full moon
testShowPhase('newMoon'); // Show new moon
testShowPhase('waxingMoon'); // Show waxing moon
testShowPhase('waningMoon'); // Show waning moon

/* ──────────────────────────────────────────────
   TEST ERROR DISPLAY:
   ────────────────────────────────────────────── */

// Show test error message
function testErrorDisplay() {
    console.log('🧪 Testing error display...');
    showMoonError('This is a test error message');
}

/* ──────────────────────────────────────────────
   TEST LOADING STATE:
   ────────────────────────────────────────────── */

// Test loading spinner
async function testLoadingState() {
    console.log('🧪 Testing loading state...');
    await setLoadingState(true);
    console.log('⏳ Loading shown...');

    await new Promise((resolve) => setTimeout(resolve, 2000));

    await setLoadingState(false);
    console.log('✅ Loading hidden');
}

/* ──────────────────────────────────────────────
   TEST COUNTDOWN CALCULATION:
   ────────────────────────────────────────────── */

// Test countdown with specific cycle position
function testCountdown(cycleDay = null) {
    console.log('🧪 Testing countdown calculation...');
    if (cycleDay !== null) {
        console.log('📊 Using cycle day:', cycleDay);
    } else {
        console.log('📊 Using current date');
    }
    calculateNextPhaseCountdown(cycleDay);
}

// Usage:
testCountdown(); // Use current date
testCountdown(0); // New moon
testCountdown(7.5); // First quarter
testCountdown(14.77); // Full moon
testCountdown(22); // Last quarter

/* ──────────────────────────────────────────────
   TEST ILLUMINATION CALCULATION:
   ────────────────────────────────────────────── */

// Calculate illumination for different cycle days
function testIllumination() {
    console.log('🧪 Testing illumination calculation:');
    console.log(
        '  New Moon (0 days):',
        calculateIllumination(0).toFixed(1) + '%'
    );
    console.log(
        '  First Quarter (7.4 days):',
        calculateIllumination(7.4).toFixed(1) + '%'
    );
    console.log(
        '  Full Moon (14.8 days):',
        calculateIllumination(14.8).toFixed(1) + '%'
    );
    console.log(
        '  Last Quarter (22.2 days):',
        calculateIllumination(22.2).toFixed(1) + '%'
    );
}

/* ──────────────────────────────────────────────
   NETWORK STATUS:
   ────────────────────────────────────────────── */

// Check current network status
function checkNetworkStatus() {
    console.log(
        '📡 Network Status:',
        navigator.onLine ? '✅ Online' : '❌ Offline'
    );
}

/* ──────────────────────────────────────────────
   VIEW PHASE DATA:
   ────────────────────────────────────────────── */

// Display all available moon phase data
function listAllPhases() {
    console.log('🌙 Available Moon Phases:');
    Object.keys(moonPhaseInformation).forEach((key) => {
        const phase = moonPhaseInformation[key];
        console.log(`\n${key}:`);
        console.log('  Russian:', phase.moonPhaseNameRussian);
        console.log('  Lithuanian:', phase.moonPhaseNameLithuanian);
        console.log('  Rituals:', phase.moonPhaseRitualsRussian.join(', '));
    });
}

/* ──────────────────────────────────────────────
   SIMULATE API FAILURE:
   ────────────────────────────────────────────── */

// Force API failure to test fallback
function simulateAPIFailure() {
    console.log('🧪 Simulating API failure...');
    console.log('⚠️ Forcing offline mode...');

    // Temporarily go offline
    const originalOnLine = navigator.onLine;
    Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: false,
    });

    initializeMoonPhase();

    // Restore after 3 seconds
    setTimeout(() => {
        Object.defineProperty(navigator, 'onLine', {
            writable: true,
            value: originalOnLine,
        });
        console.log('✅ Network status restored');
    }, 3000);
}

/* ──────────────────────────────────────────────
   FULL DIAGNOSTIC:
   ────────────────────────────────────────────── */

// Run complete diagnostic check
function fullMoonDiagnostic() {
    console.log('🔍 RUNNING FULL MOON PHASE DIAGNOSTIC');
    console.log('═══════════════════════════════════════\n');

    debugMoonDOM();
    console.log('\n───────────────────────────────────────\n');

    checkNetworkStatus();
    console.log('\n───────────────────────────────────────\n');

    console.log('📊 Current Display:');
    if (moonDOM && moonDOM.isReady()) {
        console.log('  Phase:', moonDOM.phaseName.textContent);
        console.log('  Countdown:', moonDOM.countdown.textContent);
        console.log('  Rituals:', moonDOM.rituals.textContent);
    } else {
        console.log('  ❌ DOM not ready');
    }
    console.log('\n───────────────────────────────────────\n');

    testIllumination();

    console.log('\n═══════════════════════════════════════');
    console.log('✅ DIAGNOSTIC COMPLETE');
}

/* ──────────────────────────────────────────────
   QUICK TESTS:
   ──────────────────────────────────────────────*/

// All-in-one test function
function quickTest() {
    console.log('⚡ QUICK TEST SUITE');
    console.log('═══════════════════════════════════════\n');

    console.log('1️⃣ DOM Check:');
    debugMoonDOM();

    console.log('\n2️⃣ Network:');
    checkNetworkStatus();

    console.log('\n3️⃣ Testing New Moon:');
    testShowPhase('newMoon');

    console.log('\n4️⃣ Testing Countdown:');
    testCountdown();

    console.log('\n═══════════════════════════════════════');
    console.log('✅ QUICK TEST COMPLETE');
}

/* ──────────────────────────────────────────────
   USAGE:
   ────────────────────────────────────────────── */

//   Copy and paste in browser console:

fullMoonDiagnostic(); // Complete diagnostic
quickTest(); // Quick test suite
debugMoonDOM(); // Check DOM elements
testMoonAPI(); // Test API fetch
testLocalCalculation(); // Test local calculation
testShowPhase('fullMoon'); // Show specific phase
testErrorDisplay(); // Test error message
testLoadingState(); // Test loading spinner
testCountdown(); // Test countdown
testIllumination(); // Test illumination calc
checkNetworkStatus(); // Check network
listAllPhases(); // List all phase data
simulateAPIFailure(); // Force offline mode
