/* ================================================
   🔧 DEBUG UTILITIES - MOVE TO DEV FILE LATER
   ================================================ */

//   📊 Console Testing Commands:
//   Copy these to browser console for debugging

/* ──────────────────────────────────────────────
   GET CAROUSEL STATE:
   ────────────────────────────────────────────── */

// View current carousel state
function debugCarousel() {
    const activeCard = document.querySelector('.gallery-item-3');
    const activeIndex = activeCard
        ? activeCard.getAttribute('data-index')
        : 'none';
    const visibleCards = document.querySelectorAll(
        '.gallery-item[class*="gallery-item-"]'
    ).length;

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎠 CAROUSEL STATE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Active card index:', activeIndex);
    console.log('Visible cards:', visibleCards);
    console.log(
        'Total cards:',
        document.querySelectorAll('.gallery-item').length
    );

    // Check position classes
    document.querySelectorAll('.gallery-item').forEach((card, i) => {
        const classes = Array.from(card.classList).filter((c) =>
            c.startsWith('gallery-item-')
        );
        console.log(
            `Card ${i}:`,
            classes.length > 0 ? classes : 'No position class'
        );
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

/* ──────────────────────────────────────────────
   MANUAL NAVIGATION:
   ────────────────────────────────────────────── */

// Trigger next slide
function testNext() {
    const button = document.querySelector('.gallery-controls-next');
    if (button) {
        button.click();
        setTimeout(debugCarousel, 400);
    } else {
        console.error('❌ Next button not found');
    }
}

// Trigger previous slide
function testPrev() {
    const button = document.querySelector('.gallery-controls-previous');
    if (button) {
        button.click();
        setTimeout(debugCarousel, 400);
    } else {
        console.error('❌ Previous button not found');
    }
}

// Jump to specific slide
function testJumpTo(index) {
    const indicators = document.querySelectorAll('.gallery-indicator');
    const indicator = indicators[index];

    if (indicator) {
        indicator.click();
        setTimeout(debugCarousel, 400);
    } else {
        console.error('❌ Invalid index:', index);
        console.log('Available indices: 0 -', indicators.length - 1);
    }
}

/* ──────────────────────────────────────────────
   SIMULATE SWIPE:
   ────────────────────────────────────────────── */

// Simulate swipe gesture
function simulateSwipe(direction) {
    const container = document.querySelector('.gallery-container');
    if (!container) {
        console.error('❌ Carousel container not found');
        return;
    }

    const startX = direction === 'left' ? 200 : 50;
    const endX = direction === 'left' ? 50 : 200;

    const touchStart = new TouchEvent('touchstart', {
        changedTouches: [{ screenX: startX }],
    });

    const touchEnd = new TouchEvent('touchend', {
        changedTouches: [{ screenX: endX }],
    });

    container.dispatchEvent(touchStart);
    container.dispatchEvent(touchEnd);

    console.log('🧪 Simulated', direction, 'swipe');
    setTimeout(debugCarousel, 400);
}

// Usage:
simulateSwipe('left'); // Swipe left (next)
simulateSwipe('right'); // Swipe right (previous)

/* ──────────────────────────────────────────────
   CHECK INDICATORS:
   ────────────────────────────────────────────── */

// View indicator status
function debugIndicators() {
    const indicators = document.querySelectorAll('.gallery-indicator');

    console.log('📊 Indicator Status:');
    indicators.forEach((indicator, i) => {
        const index = indicator.getAttribute('data-index');
        const isActive = indicator.classList.contains('active');
        console.log(`  Indicator ${i}:`, {
            dataIndex: index,
            active: isActive ? '✅' : '❌',
        });
    });
}

/* ──────────────────────────────────────────────
   TEST KEYBOARD NAVIGATION:
   ────────────────────────────────────────────── */

// Simulate arrow key press
function testArrowKey(direction) {
    const key = direction === 'left' ? 'ArrowLeft' : 'ArrowRight';
    const event = new KeyboardEvent('keydown', { key });

    document.dispatchEvent(event);
    console.log('⌨️ Simulated', key, 'press');
    setTimeout(debugCarousel, 400);
}

// Usage:
testArrowKey('left'); // Simulate left arrow
testArrowKey('right'); // Simulate right arrow

/* ──────────────────────────────────────────────
   CHECK POSITION CLASSES:
   ────────────────────────────────────────────── */

// List all cards and their position classes
function debugPositionClasses() {
    const cards = document.querySelectorAll('.gallery-item');

    console.log('📦 Position Classes:');
    cards.forEach((card, i) => {
        const dataIndex = card.getAttribute('data-index');
        const positionClasses = Array.from(card.classList).filter((c) =>
            c.startsWith('gallery-item-')
        );
        const opacity = card.style.opacity;

        console.log(`Card ${i} (data-index: ${dataIndex}):`);
        console.log(
            '  Position:',
            positionClasses.length > 0 ? positionClasses.join(', ') : 'None'
        );
        console.log('  Opacity:', opacity || 'default');
    });
}

/* ──────────────────────────────────────────────
   TEST CIRCULAR NAVIGATION:
   ────────────────────────────────────────────── */

// Test wrapping behavior
function testWrapping() {
    const total = document.querySelectorAll('.gallery-item').length;

    console.log('🧪 Testing circular navigation...');
    console.log(`Total cards: ${total}\n`);

    // Navigate to end
    console.log('1️⃣ Navigating to last card...');
    for (let i = 0; i < total - 1; i++) {
        testNext();
    }

    setTimeout(() => {
        console.log('\n2️⃣ Pressing next (should wrap to first)...');
        testNext();

        setTimeout(() => {
            console.log('\n3️⃣ Pressing previous (should wrap to last)...');
            testPrev();
            testPrev();
        }, 1000);
    }, 1000);
}

/* ──────────────────────────────────────────────
   FULL DIAGNOSTIC:
   ────────────────────────────────────────────── */

// Run complete carousel diagnostic
function fullCarouselDiagnostic() {
    console.log('🔍 RUNNING FULL CAROUSEL DIAGNOSTIC');
    console.log('═══════════════════════════════════════\n');

    debugCarousel();
    console.log('\n───────────────────────────────────────\n');

    debugIndicators();
    console.log('\n───────────────────────────────────────\n');

    debugPositionClasses();

    console.log('\n═══════════════════════════════════════');
    console.log('✅ DIAGNOSTIC COMPLETE');
}

/* ──────────────────────────────────────────────
   USAGE:
   ────────────────────────────────────────────── */

//   Copy and paste in browser console:

fullCarouselDiagnostic(); // Complete diagnostic
debugCarousel(); // Current state
testNext(); // Navigate next
testPrev(); // Navigate previous
testJumpTo(2); // Jump to slide 2
simulateSwipe('left'); // Swipe left
simulateSwipe('right'); // Swipe right
debugIndicators(); // Check indicators
testArrowKey('left'); // Test keyboard
testArrowKey('right'); // Test keyboard
debugPositionClasses(); // Check classes
testWrapping(); // Test circular navigation
