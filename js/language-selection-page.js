// ================================================
// 🌍 LANGUAGE SELECTOR - Initial Language Choice
// ================================================
//
// 📋 MODULE PURPOSE:
// Displays a landing page where users choose their preferred language
// (Russian or Lithuanian) before accessing the main site. Saves the
// choice to localStorage for automatic redirection on future visits.
//
// 🎬 USER FLOW:
// 1. User lands on language selection page
// 2. Check localStorage for previously saved language
// 3. If found → auto-redirect to that language
// 4. If not found → show language selection buttons
// 5. User clicks a language → save choice and navigate
//
// 🔗 DEPENDENCIES:
// - localStorage (browser storage API)
// - index.html (language selection page markup)
// - CSS for .star background animations
//
// 📦 FEATURES:
// - Animated star background for visual appeal
// - Persistent language preference via localStorage
// - Automatic redirection for returning users
// - Smooth transition animations
// - Fallback error handling if localStorage unavailable
//
// 🗂️ FILE STRUCTURE:
// /language-selection.html       (this page)
// /ru/index.html                 (Russian version)
// /lt/index.html                 (Lithuanian version)
//
// ⚠️ IMPORTANT NOTES:
// - This module is self-contained (no exports)
// - Runs only on language selection page
// - Does NOT run on main site pages

/* ===================================
   🔑 CONFIGURATION
   =================================== */

/**
 * localStorage key for storing language preference
 *
 * @constant {string}
 * @default 'fortuneTellerLanguage'
 */
const STORAGE_KEY = 'fortuneTellerLanguage';

/**
 * Valid language codes
 * Must match folder structure: /ru/ and /lt/
 *
 * @constant {Array<string>}
 */
const VALID_LANGUAGES = ['ru', 'lt'];

/**
 * Star animation configuration
 * Controls number of stars generated for background effect
 *
 * @constant {Object}
 */
const STAR_CONFIG = {
    COUNT: 50, // Number of stars to generate
    MIN_SIZE: 2, // Minimum star size in pixels
    MAX_SIZE: 4, // Maximum star size in pixels
    MAX_DELAY: 3, // Maximum animation delay in seconds
};

/**
 * Redirect delay after language selection
 * Brief pause for loading animation feedback
 *
 * @constant {number}
 * @default 500 (milliseconds)
 */
const REDIRECT_DELAY = 500;

/* ===================================
   ✨ BACKGROUND ANIMATION
   =================================== */

/**
 * Generate random stars for animated background
 *
 * Creates decorative star elements with randomized:
 * - Size (2-4px)
 * - Position (across entire viewport)
 * - Animation delay (0-3s)
 *
 * Stars are absolutely positioned and animated via CSS.
 *
 * @returns {void}
 *
 * @example
 * // Automatically called on page load
 * generateStars();
 *
 * @private
 */
function generateStars() {
    const starsContainer = document.getElementById('stars');

    // Validate container exists
    if (!starsContainer) {
        console.warn('⚠️ Stars container not found. Skipping star generation.');
        return;
    }

    // Generate each star
    for (let i = 0; i < STAR_CONFIG.COUNT; i++) {
        const star = document.createElement('div');
        star.className = 'star';

        // Random size between MIN_SIZE and MAX_SIZE
        const size =
            Math.random() * (STAR_CONFIG.MAX_SIZE - STAR_CONFIG.MIN_SIZE) +
            STAR_CONFIG.MIN_SIZE;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        // Random position across viewport
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;

        // Random animation delay for staggered effect
        star.style.animationDelay = `${Math.random() * STAR_CONFIG.MAX_DELAY}s`;

        starsContainer.appendChild(star);
    }

    console.log(`✨ Generated ${STAR_CONFIG.COUNT} stars`);
}

/* ===================================
   💾 LANGUAGE PREFERENCE MANAGEMENT
   =================================== */

/**
 * Check if user has previously selected a language
 * If yes, automatically redirect to that language version
 *
 * Uses localStorage to retrieve saved preference. If valid language
 * is found, redirects after a brief delay for smooth transition.
 *
 * @returns {boolean} True if redirecting, false if no saved language
 *
 * @example
 * // Check on page load
 * const isRedirecting = checkSavedLanguage();
 * if (!isRedirecting) {
 *     // Show language selection UI
 * }
 *
 * @private
 */
function checkSavedLanguage() {
    try {
        const savedLanguage = localStorage.getItem(STORAGE_KEY);

        // Validate saved language is in allowed list
        if (VALID_LANGUAGES.includes(savedLanguage)) {
            console.log('✅ Saved language found:', savedLanguage);
            console.log('🔄 Auto-redirecting...');

            // Brief delay for smooth transition
            setTimeout(() => {
                window.location.href = `./${savedLanguage}/index.html`;
            }, REDIRECT_DELAY);

            return true;
        }

        console.log('ℹ️ No saved language preference found');
        return false;
    } catch (error) {
        // localStorage might be unavailable (private browsing, disabled, etc.)
        console.warn('⚠️ localStorage not available:', error.message);
        return false;
    }
}

/**
 * Save user's language choice to localStorage
 *
 * Persists language preference for future visits. Handles errors
 * gracefully if localStorage is unavailable (e.g., private browsing).
 *
 * @param {string} language - Language code ('ru' or 'lt')
 * @returns {boolean} True if saved successfully, false on error
 *
 * @example
 * // Save language choice
 * const saved = saveLanguageChoice('ru');
 * if (saved) {
 *     console.log('Language preference saved');
 * }
 *
 * @private
 */
function saveLanguageChoice(language) {
    // Validate language code
    if (!VALID_LANGUAGES.includes(language)) {
        console.error('❌ Invalid language code:', language);
        return false;
    }

    try {
        localStorage.setItem(STORAGE_KEY, language);
        console.log('✅ Language saved:', language);
        return true;
    } catch (error) {
        // localStorage might be full or unavailable
        console.warn('⚠️ Could not save language:', error.message);
        return false;
    }
}

/* ===================================
   🎯 USER INTERACTION HANDLERS
   =================================== */

/**
 * Handle language button click event
 *
 * Process flow:
 * 1. Extract language code from button's data-lang attribute
 * 2. Add loading state visual feedback
 * 3. Save language choice to localStorage
 * 4. Navigate to selected language version
 *
 * Note: Navigation happens via the button's href attribute,
 * so the link works even if JavaScript fails (progressive enhancement).
 *
 * @param {Event} event - Click event object
 * @returns {void}
 *
 * @example
 * // Attached to language buttons automatically
 * <a href="./ru/index.html"
 *    class="language-btn"
 *    data-lang="ru"
 *    onclick="handleLanguageClick(event)">
 *    Русский
 * </a>
 *
 * @private
 */
function handleLanguageClick(event) {
    const button = event.currentTarget;
    const language = button.dataset.lang;

    // Validate language code exists
    if (!language) {
        console.error('❌ Button missing data-lang attribute');
        return;
    }

    // Add visual loading state
    button.classList.add('loading');

    // Save language preference
    saveLanguageChoice(language);

    console.log('🌍 Language selected:', language);
    console.log('➡️ Navigating to:', button.href);

    // Navigation happens automatically via href
    // No need to manually redirect
}

/* ===================================
   🚀 INITIALIZATION
   =================================== */

/**
 * Initialize language selection page
 *
 * Initialization sequence:
 * 1. Generate animated star background
 * 2. Check for saved language preference
 * 3. If saved language found → auto-redirect
 * 4. If not found → attach click handlers to buttons
 *
 * @returns {void}
 *
 * @private
 */
function init() {
    console.log('🚀 Initializing language selector...');

    // Generate background stars
    generateStars();

    // Check for saved language (will auto-redirect if found)
    const hasRedirected = checkSavedLanguage();

    if (!hasRedirected) {
        // No saved language - setup button handlers
        const buttons = document.querySelectorAll('.language-btn');

        if (buttons.length === 0) {
            console.error('❌ No language buttons found. Check HTML markup.');
            return;
        }

        // Attach click handlers to each button
        buttons.forEach((button) => {
            button.addEventListener('click', handleLanguageClick);
        });

        console.log(`✅ Language selector ready (${buttons.length} buttons)`);
    } else {
        console.log('⏭️ Redirecting to saved language...');
    }
}

/* ===================================
   🎬 AUTO-START
   =================================== */

/**
 * Start initialization when DOM is ready
 * Handles both loading and already-loaded states
 */
if (document.readyState === 'loading') {
    // DOM still loading - wait for DOMContentLoaded
    document.addEventListener('DOMContentLoaded', init);
} else {
    // DOM already loaded - initialize immediately
    init();
}
