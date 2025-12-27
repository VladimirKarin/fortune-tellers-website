/* ================================================
   🔧 DEBUG UTILITIES - MOVE TO DEV FILE LATER
   ================================================ */

//   📊 Console Testing Commands:
//   Copy these to browser console for debugging

/* ──────────────────────────────────────────────
   CHECK NAVIGATION STATE:
   ────────────────────────────────────────────── */

// View current navigation state
function debugNavState() {
    const header = document.querySelector('.header');
    const isOpen = header?.classList.contains('nav-open');
    const ariaExpanded = document
        .querySelector('.btn-mobile-nav')
        ?.getAttribute('aria-expanded');
    const hasScrollLock =
        document.documentElement.classList.contains('u-no-scroll');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📱 NAVIGATION STATE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Menu Open:', isOpen ? '✅ Yes' : '❌ No');
    console.log('ARIA Expanded:', ariaExpanded);
    console.log('Scroll Locked:', hasScrollLock ? '✅ Yes' : '❌ No');
    console.log('Window Width:', window.innerWidth + 'px');
    console.log('Mobile View:', window.innerWidth <= 991 ? '✅ Yes' : '❌ No');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

/* ──────────────────────────────────────────────
   MANUALLY CONTROL MENU:
   ────────────────────────────────────────────── */

// Open menu manually
function testOpenMenu() {
    const header = document.querySelector('.header');
    header.classList.add('nav-open');
    document.documentElement.classList.add('u-no-scroll');
    console.log('✅ Menu opened manually');
}

// Close menu manually
function testCloseMenu() {
    const header = document.querySelector('.header');
    header.classList.remove('nav-open');
    document.documentElement.classList.remove('u-no-scroll');
    console.log('✅ Menu closed manually');
}

// Toggle menu via button
function testToggleButton() {
    const button = document.querySelector('.btn-mobile-nav');
    if (button) {
        button.click();
        console.log('✅ Toggle button clicked');
    } else {
        console.error('❌ Toggle button not found');
    }
}

/* ──────────────────────────────────────────────
   TEST FOCUS TRAP:
   ────────────────────────────────────────────── */

// List all focusable elements in menu
function debugFocusableElements() {
    const navList = document.querySelector('.nav-list');
    if (!navList) {
        console.error('❌ Nav list not found');
        return;
    }

    const focusable = Array.from(
        navList.querySelectorAll(
            'a[href], button:not([disabled]), textarea, input[type="text"], ' +
                'input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
        )
    );

    console.log('🎯 Focusable Elements:', focusable.length);
    focusable.forEach((el, i) => {
        console.log(`  ${i + 1}. ${el.tagName}`, el.textContent.trim());
    });
}

// Test Tab key cycling
function testFocusTrap() {
    console.log('🧪 Testing focus trap...');
    console.log('1. Open menu');
    console.log('2. Try tabbing through links');
    console.log('3. Focus should loop from last link back to first');
    console.log('4. Shift+Tab should loop from first to last');
    console.log('5. ESC key should close menu');

    testOpenMenu();
}

/* ──────────────────────────────────────────────
   TEST KEYBOARD NAVIGATION:
   ────────────────────────────────────────────── */

// Simulate ESC key press
function testEscapeKey() {
    const event = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
    });

    document.dispatchEvent(event);
    console.log('⌨️ ESC key pressed');
}

// Simulate Tab key
function testTabKey(shift = false) {
    const event = new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: shift,
        bubbles: true,
    });

    document.dispatchEvent(event);
    console.log(`⌨️ ${shift ? 'Shift+' : ''}Tab key pressed`);
}

/* ──────────────────────────────────────────────
   TEST SCROLL LOCKING:
   ────────────────────────────────────────────── */

// Check scroll lock status
function debugScrollLock() {
    const hasLock = document.documentElement.classList.contains('u-no-scroll');
    const scrollY = window.scrollY;

    console.log('🔒 Scroll Lock Status:');
    console.log('  Locked:', hasLock ? '✅ Yes' : '❌ No');
    console.log('  Current scroll position:', scrollY + 'px');

    if (hasLock) {
        console.log('  ℹ️  Scrolling is disabled');
    } else {
        console.log('  ℹ️  Scrolling is enabled');
    }
}

// Test scroll lock manually
function testScrollLock() {
    console.log('🧪 Testing scroll lock...');
    document.documentElement.classList.add('u-no-scroll');
    console.log('✅ Scroll locked - try scrolling page');

    setTimeout(() => {
        document.documentElement.classList.remove('u-no-scroll');
        console.log('✅ Scroll unlocked - scrolling restored');
    }, 3000);
}

/* ──────────────────────────────────────────────
   TEST RESPONSIVE BEHAVIOR:
   ────────────────────────────────────────────── */

// Simulate window resize
function testResize(width) {
    console.log(`🧪 Simulating resize to ${width}px...`);
    console.log('Note: Actually resize browser window to test fully');
    console.log('Desktop breakpoint: 991px');

    if (width > 991) {
        console.log('✅ Above breakpoint - menu should close');
    } else {
        console.log('ℹ️  Below breakpoint - menu can stay open');
    }
}

/* ──────────────────────────────────────────────
   CHECK ARIA ATTRIBUTES:
   ────────────────────────────────────────────── */

// Display all ARIA attributes
function debugAriaAttributes() {
    const button = document.querySelector('.btn-mobile-nav');
    const navList = document.querySelector('.nav-list');

    console.log('♿ ARIA Attributes:');
    console.log('  Toggle button:');
    console.log('    aria-expanded:', button?.getAttribute('aria-expanded'));
    console.log('    aria-controls:', button?.getAttribute('aria-controls'));
    console.log('  Nav list:');
    console.log('    aria-hidden:', navList?.getAttribute('aria-hidden'));
    console.log('    role:', navList?.getAttribute('role'));
    console.log('    aria-label:', navList?.getAttribute('aria-label'));
}

/* ──────────────────────────────────────────────
   TEST LINK CLICK BEHAVIOR:
   ────────────────────────────────────────────── */

// Simulate navigation link click
function testLinkClick() {
    const links = document.querySelectorAll('.nav-list a[href]');
    if (links.length === 0) {
        console.error('❌ No navigation links found');
        return;
    }

    console.log('🧪 Testing link click...');
    console.log('1. Opening menu...');
    testOpenMenu();

    setTimeout(() => {
        console.log('2. Clicking first link...');
        links[0].click();
        console.log('3. Menu should auto-close');
    }, 1000);
}

/* ──────────────────────────────────────────────
   FULL DIAGNOSTIC:
   ────────────────────────────────────────────── */

// Run complete diagnostic
function fullNavDiagnostic() {
    console.log('🔍 RUNNING FULL NAVIGATION DIAGNOSTIC');
    console.log('═══════════════════════════════════════\n');

    debugNavState();
    console.log('\n───────────────────────────────────────\n');

    debugFocusableElements();
    console.log('\n───────────────────────────────────────\n');

    debugScrollLock();
    console.log('\n───────────────────────────────────────\n');

    debugAriaAttributes();

    console.log('\n═══════════════════════════════════════');
    console.log('✅ DIAGNOSTIC COMPLETE');
}

/* ──────────────────────────────────────────────
   USAGE:
   ────────────────────────────────────────────── */

//   Copy and paste in browser console:

fullNavDiagnostic(); // Complete diagnostic
debugNavState(); // Check current state
testToggleButton(); // Toggle menu
testOpenMenu(); // Open menu manually
testCloseMenu(); // Close menu manually
debugFocusableElements(); // List focusable items
testFocusTrap(); // Test focus cycling
testEscapeKey(); // Test ESC key
testTabKey(); // Test Tab key
testTabKey(true); // Test Shift+Tab
debugScrollLock(); // Check scroll status
testScrollLock(); // Test scroll lock
testResize(1200); // Simulate resize
debugAriaAttributes(); // Check ARIA
testLinkClick(); // Test link behavior
