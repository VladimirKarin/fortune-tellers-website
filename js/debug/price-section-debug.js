/* ================================================
   🔧 DEBUG UTILITIES - MOVE TO DEV FILE LATER
   ================================================ */

//   📊 Console Testing Commands:
//   Copy these to browser console for debugging

/* ──────────────────────────────────────────────
   TEST VISIBILITY:
   ────────────────────────────────────────────── */

// Run diagnostic tool
function testPrices() {
    const section = document.querySelector('.prices-grid');
    const button = document.querySelector('.prices__button');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💰 PRICES SECTION STATUS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Section exists:', !!section);
    console.log('Button exists:', !!button);

    if (section) {
        const styles = getComputedStyle(section);
        console.log('Section styles:', {
            display: styles.display,
            height: styles.height,
            opacity: styles.opacity,
            overflow: styles.overflow,
        });

        const priceCards = section.querySelectorAll('.prices-card');
        const explanationCards = section.querySelectorAll(
            '.prices-explanation-card'
        );

        console.log('Price cards found:', priceCards.length);
        console.log('Explanation cards found:', explanationCards.length);

        console.log('Section CSS classes:', section.className);
        console.log(
            'Cards with animation class:',
            section.querySelectorAll('.prices-card-animate-in').length
        );
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

/* ──────────────────────────────────────────────
   MANUAL CONTROL:
   ────────────────────────────────────────────── */

// Show prices manually
pricesSection.show();

// Hide prices manually
pricesSection.hide();

// Toggle prices
pricesSection.toggle();

/* ──────────────────────────────────────────────
   CHECK STATE:
   ────────────────────────────────────────────── */

// Check if visible
console.log('Is visible:', pricesSection.isVisible());

// Check if animating
console.log('Is animating:', pricesSection.isAnimating());

/* ──────────────────────────────────────────────
   VIEW CONFIGURATION:
   ────────────────────────────────────────────── */

// View animation config
console.table(pricesSection.config);

// View CSS classes
console.table(pricesSection.classes);

/* ──────────────────────────────────────────────
   TEST BUTTON CLICK:
   ────────────────────────────────────────────── */

// Simulate button click
function testButtonClick() {
    const button = document.querySelector('.prices__button');
    if (button) {
        button.click();
        console.log('✅ Button clicked');
    } else {
        console.error('❌ Button not found');
    }
}

/* ──────────────────────────────────────────────
   TEST KEYBOARD EVENTS:
   ────────────────────────────────────────────── */

// Test Enter key
function testEnterKey() {
    const button = document.querySelector('.prices__button');
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    button.dispatchEvent(event);
    console.log('⌨️ Enter key pressed');
}

// Test Space key
function testSpaceKey() {
    const button = document.querySelector('.prices__button');
    const event = new KeyboardEvent('keydown', { key: ' ' });
    button.dispatchEvent(event);
    console.log('⌨️ Space key pressed');
}

// Test Escape key
function testEscapeKey() {
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);
    console.log('⌨️ Escape key pressed');
}

/* ──────────────────────────────────────────────
   TEST ANIMATIONS:
   ────────────────────────────────────────────── */

// Test card animations
function testCardAnimations() {
    const cards = document.querySelectorAll(
        '.prices-card, .prices-explanation-card'
    );
    console.log('🎬 Testing card animations...');
    console.log('Total cards:', cards.length);

    cards.forEach((card, i) => {
        const hasAnimation = card.classList.contains('prices-card-animate-in');
        console.log(
            `Card ${i + 1}:`,
            hasAnimation ? '✅ Animated' : '❌ Not animated'
        );
    });
}

/* ──────────────────────────────────────────────
   FULL DIAGNOSTIC:
   ────────────────────────────────────────────── */

// Run complete diagnostic
function fullPricesDiagnostic() {
    console.log('🔍 RUNNING FULL PRICES DIAGNOSTIC');
    console.log('═══════════════════════════════════════\n');

    testPrices();
    console.log('\n───────────────────────────────────────\n');

    console.log('📊 State:');
    console.log('  Visible:', pricesSection.isVisible());
    console.log('  Animating:', pricesSection.isAnimating());
    console.log('\n───────────────────────────────────────\n');

    testCardAnimations();

    console.log('\n═══════════════════════════════════════');
    console.log('✅ DIAGNOSTIC COMPLETE');
}

/* ──────────────────────────────────────────────
   USAGE:
   ────────────────────────────────────────────── */

//   Copy and paste in browser console:

fullPricesDiagnostic(); // Complete diagnostic
testPrices(); // Check visibility
pricesSection.show(); // Show prices
pricesSection.hide(); // Hide prices
pricesSection.toggle(); // Toggle state
pricesSection.isVisible(); // Check visibility
pricesSection.isAnimating(); // Check animation
console.table(pricesSection.config); // View config
testButtonClick(); // Test button
testEnterKey(); // Test Enter
testSpaceKey(); // Test Space
testEscapeKey(); // Test Escape
testCardAnimations(); // Test animations
pricesSection.debug(); // Debug mode
