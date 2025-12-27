/* ================================================
   🔧 DEBUG UTILITIES - MOVE TO DEV FILE LATER
   ================================================ */

//   📊 Console Testing Commands:
//   Copy these to browser console for debugging

/* ──────────────────────────────────────────────
   TEST SCROLL TO SECTION:
   ────────────────────────────────────────────── */

// Test scrolling to any section by ID
function debugScrollTo(sectionId) {
    console.log(`🔧 Debug: Testing scroll to #${sectionId}`);
    const success = scrollToSection(sectionId, {
        behavior: 'smooth',
        block: 'start',
        focusTarget: true,
    });

    if (success) {
        console.log('✅ Scroll completed successfully');
    } else {
        console.error('❌ Scroll failed - section not found');
    }
}

// Usage:
debugScrollTo('contacts');
debugScrollTo('about');
debugScrollTo('services');

/* ──────────────────────────────────────────────
   LIST ALL SCROLL TARGETS:
   ────────────────────────────────────────────── */

// Display all available hero button targets
function debugListTargets() {
    const buttons = document.querySelectorAll('.hero__button[data-scroll-to]');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔧 HERO BUTTON TARGETS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Found ${buttons.length} hero button(s)\n`);

    buttons.forEach((btn, i) => {
        const target = btn.getAttribute('data-scroll-to');
        const targetExists = document.getElementById(target);
        const status = targetExists ? '✅' : '❌';
        const buttonText = btn.textContent.trim();

        console.log(`Button ${i + 1}:`);
        console.log(`  Text: "${buttonText}"`);
        console.log(`  Target: #${target}`);
        console.log(
            `  Status: ${status} ${targetExists ? 'Found' : 'Missing'}`
        );
        console.log('');
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

/* ──────────────────────────────────────────────
   TEST BUTTON FUNCTIONALITY:
   ────────────────────────────────────────────── */

// Simulate button click
function testButtonClick(buttonIndex = 0) {
    const buttons = document.querySelectorAll('.hero__button[data-scroll-to]');
    const button = buttons[buttonIndex];

    if (!button) {
        console.error(`❌ Button ${buttonIndex} not found`);
        console.log(`Available buttons: 0-${buttons.length - 1}`);
        return;
    }

    console.log(`🧪 Testing button ${buttonIndex} click...`);
    const target = button.getAttribute('data-scroll-to');
    console.log(`Target: #${target}`);

    button.click();
    console.log('✅ Click event triggered');
}

// Usage:
testButtonClick(0); // Test first button
testButtonClick(1); // Test second button

/* ──────────────────────────────────────────────
   TEST KEYBOARD NAVIGATION:
   ────────────────────────────────────────────── */

// Simulate keyboard events
function testKeyboard(buttonIndex = 0, key = 'Enter') {
    const buttons = document.querySelectorAll('.hero__button[data-scroll-to]');
    const button = buttons[buttonIndex];

    if (!button) {
        console.error(`❌ Button ${buttonIndex} not found`);
        return;
    }

    console.log(`⌨️ Testing ${key} key on button ${buttonIndex}...`);

    const event = new KeyboardEvent('keydown', {
        key: key,
        bubbles: true,
    });

    button.dispatchEvent(event);
    console.log('✅ Keyboard event triggered');
}

// Usage:
testKeyboard(0, 'Enter'); // Test Enter key
testKeyboard(0, ' '); // Test Space key

/* ──────────────────────────────────────────────
   TEST SCROLL OPTIONS:
   ────────────────────────────────────────────── */

// Test different scroll behaviors
function testScrollBehavior(targetId) {
    console.log('🧪 Testing scroll behaviors:\n');

    // Test smooth scroll
    console.log('1️⃣ Testing smooth scroll...');
    scrollToSection(targetId, { behavior: 'smooth' });

    setTimeout(() => {
        // Test instant scroll
        console.log('2️⃣ Testing instant scroll...');
        scrollToSection(targetId, { behavior: 'auto' });

        setTimeout(() => {
            // Test with focus
            console.log('3️⃣ Testing scroll with focus...');
            scrollToSection(targetId, {
                behavior: 'smooth',
                focusTarget: true,
            });
        }, 1000);
    }, 2000);
}

// Usage:
testScrollBehavior('contacts');

/* ──────────────────────────────────────────────
   CHECK INITIALIZATION STATUS:
   ────────────────────────────────────────────── */

// Check if buttons are properly initialized
function checkInitialization() {
    const buttons = document.querySelectorAll('.hero__button[data-scroll-to]');

    console.log('📦 Initialization Status:\n');

    buttons.forEach((btn, i) => {
        const hasClickHandler = !!btn._heroScrollHandler;
        const hasKeyHandler = !!btn._heroKeydownHandler;
        const target = btn.getAttribute('data-scroll-to');

        console.log(`Button ${i}:`);
        console.log(`  Target: #${target}`);
        console.log(`  Click handler: ${hasClickHandler ? '✅' : '❌'}`);
        console.log(`  Keyboard handler: ${hasKeyHandler ? '✅' : '❌'}`);
        console.log('');
    });
}

/* ──────────────────────────────────────────────
   TEST MULTIPLE BUTTONS:
   ────────────────────────────────────────────── */

// Test all buttons sequentially
function testAllButtons() {
    const buttons = document.querySelectorAll('.hero__button[data-scroll-to]');

    console.log(`🧪 Testing ${buttons.length} buttons sequentially...\n`);

    buttons.forEach((btn, i) => {
        setTimeout(() => {
            const target = btn.getAttribute('data-scroll-to');
            console.log(`${i + 1}. Scrolling to #${target}...`);
            btn.click();
        }, i * 3000); // 3 second delay between each
    });
}

/* ──────────────────────────────────────────────
   VIEW CONFIGURATION:
   ────────────────────────────────────────────── */

// Display current configuration
function viewConfig() {
    console.log('⚙️ Hero Button Configuration:');
    console.table(heroButtonConfig);
}

/* ──────────────────────────────────────────────
   MODIFY CONFIGURATION:
   ────────────────────────────────────────────── */

// Change configuration dynamically
function setConfig(key, value) {
    if (key in heroButtonConfig) {
        const oldValue = heroButtonConfig[key];
        heroButtonConfig[key] = value;
        console.log(`✅ Config updated:`);
        console.log(`  ${key}: ${oldValue} → ${value}`);
    } else {
        console.error(`❌ Invalid config key: ${key}`);
        console.log('Available keys:', Object.keys(heroButtonConfig));
    }
}

// Usage:
setConfig('scrollBehavior', 'auto');
setConfig('focusTargetAfterScroll', true);
setConfig('enableLogging', false);

/* ──────────────────────────────────────────────
   FULL DIAGNOSTIC:
   ────────────────────────────────────────────── */

// Run complete diagnostic
function fullHeroDiagnostic() {
    console.log('🔍 RUNNING FULL HERO BUTTON DIAGNOSTIC');
    console.log('═══════════════════════════════════════\n');

    debugListTargets();
    console.log('\n───────────────────────────────────────\n');

    checkInitialization();
    console.log('\n───────────────────────────────────────\n');

    viewConfig();

    console.log('\n═══════════════════════════════════════');
    console.log('✅ DIAGNOSTIC COMPLETE');
}

/* ──────────────────────────────────────────────
   USAGE:
   ──────────────────────────────────────────────*/

//   Copy and paste in browser console:

fullHeroDiagnostic(); // Complete diagnostic
debugListTargets(); // List all targets
debugScrollTo('contacts'); // Test scroll
testButtonClick(0); // Test button click
testKeyboard(0, 'Enter'); // Test keyboard
testScrollBehavior('contacts'); // Test behaviors
checkInitialization(); // Check init status
testAllButtons(); // Test all buttons
viewConfig(); // View configuration
setConfig('scrollBehavior', 'auto'); // Change config
