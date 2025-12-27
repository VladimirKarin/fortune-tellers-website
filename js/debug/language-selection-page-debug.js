/* ================================================
   🔧 DEBUG UTILITIES - MOVE TO DEV FILE LATER
   ================================================ */

//   📊 Console Testing Commands:
//   Copy these to browser console for debugging

/* ──────────────────────────────────────────────
   CHECK SAVED LANGUAGE:
   ────────────────────────────────────────────── */

// View current saved language
function debugSavedLanguage() {
    const saved = localStorage.getItem('fortuneTellerLanguage');
    console.log('💾 Saved language:', saved || 'None');
}

/* ──────────────────────────────────────────────
   MANUALLY SET LANGUAGE:
   ────────────────────────────────────────────── */

// Set language preference manually
function setLanguage(lang) {
    if (!['ru', 'lt'].includes(lang)) {
        console.error('❌ Invalid language. Use "ru" or "lt"');
        return;
    }
    localStorage.setItem('fortuneTellerLanguage', lang);
    console.log('✅ Language set to:', lang);
    console.log('🔄 Reload page to see auto-redirect');
}

// Usage:
setLanguage('ru'); // Set to Russian
setLanguage('lt'); // Set to Lithuanian

/* ──────────────────────────────────────────────
   CLEAR SAVED LANGUAGE:
   ────────────────────────────────────────────── */

// Remove saved language preference
function clearLanguage() {
    localStorage.removeItem('fortuneTellerLanguage');
    console.log('✅ Language preference cleared');
    console.log('🔄 Reload page to see selection screen');
}

/* ──────────────────────────────────────────────
   TEST AUTO-REDIRECT:
   ────────────────────────────────────────────── */

// Test the auto-redirect functionality
function testAutoRedirect(lang) {
    setLanguage(lang);
    console.log('🔄 Reloading page in 2 seconds...');
    setTimeout(() => location.reload(), 2000);
}

// Usage:
testAutoRedirect('ru'); // Test Russian redirect
testAutoRedirect('lt'); // Test Lithuanian redirect

/* ──────────────────────────────────────────────
   VIEW ALL LOCALSTORAGE:
   ────────────────────────────────────────────── */

// See all items in localStorage
function debugLocalStorage() {
    console.log('📦 All localStorage items:');
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        console.log(`  ${key}:`, value);
    }
}

/* ──────────────────────────────────────────────
   TEST BUTTON FUNCTIONALITY:
   ────────────────────────────────────────────── */

// Simulate button click without actually navigating
function testButtonClick(lang) {
    console.log('🧪 Testing button click for:', lang);

    const button = document.querySelector(`[data-lang="${lang}"]`);
    if (!button) {
        console.error('❌ Button not found for language:', lang);
        return;
    }

    // Save language (like the real click handler does)
    localStorage.setItem('fortuneTellerLanguage', lang);
    console.log('✅ Language saved:', lang);

    // Don't actually navigate (for testing)
    console.log('🚫 Navigation blocked for testing');
    console.log('📍 Would navigate to:', button.href);
}

/* ──────────────────────────────────────────────
   CHECK STAR GENERATION:
   ────────────────────────────────────────────── */

// Count stars in the background
function debugStars() {
    const stars = document.querySelectorAll('.star');
    console.log('⭐ Stars generated:', stars.length);

    if (stars.length > 0) {
        const firstStar = stars[0];
        console.log('📏 First star styles:', {
            width: firstStar.style.width,
            height: firstStar.style.height,
            left: firstStar.style.left,
            top: firstStar.style.top,
            delay: firstStar.style.animationDelay,
        });
    }
}

/* ──────────────────────────────────────────────
   FULL DIAGNOSTIC:
   ────────────────────────────────────────────── */

// Run all diagnostic checks
function fullDiagnostic() {
    console.log('🔍 RUNNING FULL DIAGNOSTIC');
    console.log('═══════════════════════════════════════\n');

    debugSavedLanguage();
    console.log('');

    debugStars();
    console.log('');

    const buttons = document.querySelectorAll('.language-btn');
    console.log('🔘 Language buttons:', buttons.length);
    buttons.forEach((btn, i) => {
        console.log(`  Button ${i + 1}:`, {
            lang: btn.dataset.lang,
            href: btn.href,
            text: btn.textContent.trim(),
        });
    });
    console.log('');

    console.log(
        '📦 localStorage available:',
        typeof localStorage !== 'undefined'
    );

    console.log('\n═══════════════════════════════════════');
    console.log('✅ DIAGNOSTIC COMPLETE');
}

/* ──────────────────────────────────────────────
   USAGE:
   ────────────────────────────────────────────── */

//   Copy and paste in browser console:

fullDiagnostic(); // Run all checks
debugSavedLanguage(); // Check saved preference
setLanguage('ru'); // Set Russian
setLanguage('lt'); // Set Lithuanian
clearLanguage(); // Clear preference
testAutoRedirect('ru'); // Test auto-redirect
debugStars(); // Check star generation
testButtonClick('ru'); // Test button without navigating
debugLocalStorage(); // View all localStorage
