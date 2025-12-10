// ================================================
// 💰 PRICES SECTION - Enhanced Toggle Controller
// ================================================
//
// 📋 FEATURES:
// - Smooth expand/collapse animation with height calculation
// - Staggered card entrance animations
// - Keyboard navigation support (Enter, Space, ESC)
// - ARIA attributes for accessibility
// - Responsive height recalculation on window resize
// - Memory leak prevention with proper cleanup
// - Comprehensive debugging tools
//
// 🔗 CSS INTEGRATION:
// Works with 07-prices-section-styles.css
// Uses unique class names to avoid conflicts with other sections

/* ================================================
   📋 TABLE OF CONTENTS
   ================================================
   1. Configuration Constants
   2. CSS Class Names
   3. DOM Element References
   4. State Management
   5. Debug Utilities
   6. Accessibility Setup
   7. Animation Functions
   8. Show/Hide Logic
   9. Event Handlers
   10. Initialization
   11. Global API
*/

// ================================================
// 1️⃣ CONFIGURATION CONSTANTS
// ================================================

/**
 * Animation timing configuration
 * 🔄 TRANSLATED: "Настройки анимации"
 * Adjust these values to change animation behavior
 */
const ANIMATION_CONFIG = {
    // ⏱️ Main animation durations (milliseconds)
    MAIN_DURATION: 600, // Container expand/collapse speed
    CARDS_START_DELAY: 200, // Delay before cards start animating
    CARDS_INTERVAL: 100, // Delay between each card animation
    AUTO_HEIGHT_DELAY: 50, // Delay before setting height: auto

    // 🎯 Performance optimization
    RESIZE_DEBOUNCE: 150, // Debounce window resize events
};

// ================================================
// 2️⃣ CSS CLASS NAMES (Unique to avoid conflicts)
// ================================================

/**
 * CSS class constants
 * ✅ FIXED: Using unique class names to avoid conflicts with AboutMe section
 * All classes are prefixed with 'prices-' for namespace isolation
 */
const CSS_CLASSES = {
    // Section visibility state
    SECTION_VISIBLE: 'prices-section-visible', // Applied to .prices-grid when expanded

    // Card animation states
    CARD_ANIMATE_IN: 'prices-card-animate-in', // Applied to cards for entrance animation

    // Selectors for querying DOM
    PRICE_CARD: '.prices-card', // Individual price cards
    EXPLANATION_CARD: '.prices-explanation-card', // Special explanation card
};

// ================================================
// 3️⃣ DOM ELEMENT REFERENCES
// ================================================

/**
 * Cache DOM elements for better performance
 * Queried once during initialization
 */
const priceSection = document.querySelector('.prices-grid'); // Main grid container
const priceSectionButton = document.querySelector('.prices__button'); // Toggle button

// ================================================
// 4️⃣ STATE MANAGEMENT
// ================================================

/**
 * Component state tracking
 * 🔄 TRANSLATED: "Состояние компонента"
 */
let isVisible = false; // Track whether prices are currently shown
let isAnimating = false; // Prevent multiple simultaneous animations
let resizeTimeout = null; // Store resize debounce timeout

// ================================================
// 5️⃣ DEBUG UTILITIES
// ================================================

/**
 * Debug mode configuration
 * Set to false in production to disable console logs
 */
const DEBUG_ENABLED = true;

/**
 * Centralized debug logging
 * @param {string} message - Log message
 * @param {*} data - Optional data to log
 */
function debugLog(message, data = '') {
    if (DEBUG_ENABLED) {
        console.log(`[Prices Debug] ${message}`, data);
    }
}

/**
 * Test visibility of prices section elements
 * Call from browser console: testPrices()
 *
 * @public
 */
function testVisibility() {
    debugLog('=== TESTING VISIBILITY ===');
    debugLog('Section exists:', !!priceSection);
    debugLog('Button exists:', !!priceSectionButton);

    if (priceSection) {
        const styles = getComputedStyle(priceSection);
        debugLog('Section computed styles:', {
            display: styles.display,
            height: styles.height,
            opacity: styles.opacity,
            overflow: styles.overflow,
        });

        // Check cards
        const priceCards = priceSection.querySelectorAll(
            CSS_CLASSES.PRICE_CARD
        );
        const explanationCards = priceSection.querySelectorAll(
            CSS_CLASSES.EXPLANATION_CARD
        );

        debugLog('Price cards found:', priceCards.length);
        debugLog('Explanation cards found:', explanationCards.length);

        if (priceCards.length > 0) {
            const firstCardStyles = getComputedStyle(priceCards[0]);
            debugLog('First price card styles:', {
                display: firstCardStyles.display,
                opacity: firstCardStyles.opacity,
                transform: firstCardStyles.transform,
            });
        }

        // Check CSS classes
        debugLog('Section CSS classes:', priceSection.className);
        debugLog(
            'Cards with animation class:',
            priceSection.querySelectorAll(`.${CSS_CLASSES.CARD_ANIMATE_IN}`)
                .length
        );
    }
    debugLog('=== END TEST ===');
}

/**
 * Check for potential conflicts with other components
 * Helps identify naming collisions
 *
 * @public
 */
function checkForConflicts() {
    debugLog('=== CHECKING FOR CONFLICTS ===');

    // Check for AboutMe animation conflicts
    const aboutMeCards = document.querySelectorAll('.about-me-card.animate-in');
    if (aboutMeCards.length > 0) {
        debugLog(
            '⚠️ Found AboutMe cards with animate-in class:',
            aboutMeCards.length
        );
        debugLog('✅ Using unique class names to avoid conflicts');
    }

    // Check global namespace
    const globalConflicts = [];
    if (window.pricesSection) globalConflicts.push('pricesSection');
    if (window.testPrices) globalConflicts.push('testPrices');

    debugLog(
        'Global objects status:',
        globalConflicts.length > 0
            ? `Will override: ${globalConflicts.join(', ')}`
            : 'No conflicts'
    );

    debugLog('=== END CONFLICT CHECK ===');
}

// ================================================
// 6️⃣ ACCESSIBILITY SETUP
// ================================================

/**
 * Initialize ARIA attributes for screen readers
 * Sets up proper semantic relationships between button and content
 *
 * @returns {boolean} Success status
 * @private
 */
function initializeAccessibility() {
    if (!priceSectionButton || !priceSection) {
        debugLog('ERROR: Critical elements not found!', {
            button: !!priceSectionButton,
            section: !!priceSection,
        });
        return false;
    }

    // Button ARIA attributes
    priceSectionButton.setAttribute('aria-expanded', 'false'); // Initially collapsed
    priceSectionButton.setAttribute('aria-controls', 'prices-grid'); // Links to controlled section

    // Section ARIA attributes
    priceSection.setAttribute('id', 'prices-grid'); // Unique ID for aria-controls
    priceSection.setAttribute('aria-hidden', 'true'); // Initially hidden from screen readers
    priceSection.setAttribute('role', 'region'); // Define as content region
    priceSection.setAttribute('aria-label', 'Список цен на услуги'); // 🔤 TRANSLATED: "Price list for services"

    debugLog('✅ Accessibility initialized successfully');
    return true;
}

// ================================================
// 7️⃣ ANIMATION FUNCTIONS
// ================================================

/**
 * Animate cards entrance with staggered timing
 * Adds animation class to each card with progressive delays
 *
 * @private
 */
function animateCardsIn() {
    // Query all cards (both price cards and explanation card)
    const allCards = priceSection.querySelectorAll(
        `${CSS_CLASSES.PRICE_CARD}, ${CSS_CLASSES.EXPLANATION_CARD}`
    );

    debugLog('Found cards for animation:', allCards.length);

    if (allCards.length === 0) {
        debugLog('⚠️ No cards found - check CSS selectors');
        return;
    }

    // 🔄 TRANSLATED: "Анимируем каждую карточку с интервалом"
    // Animate each card with progressive delay
    allCards.forEach((card, index) => {
        setTimeout(() => {
            // Add unique animation class (won't conflict with AboutMe)
            card.classList.add(CSS_CLASSES.CARD_ANIMATE_IN);

            debugLog(`Card ${index + 1} animated in`);
        }, index * ANIMATION_CONFIG.CARDS_INTERVAL);
    });
}

/**
 * Remove animation classes from cards
 * Resets cards to initial state
 *
 * @private
 */
function animateCardsOut() {
    const allCards = priceSection.querySelectorAll(
        `${CSS_CLASSES.PRICE_CARD}, ${CSS_CLASSES.EXPLANATION_CARD}`
    );

    debugLog('Animating cards out:', allCards.length);

    allCards.forEach((card) => {
        // Remove animation class
        card.classList.remove(CSS_CLASSES.CARD_ANIMATE_IN);
    });
}

// ================================================
// 8️⃣ SHOW/HIDE LOGIC
// ================================================

/**
 * Show prices section with smooth animation
 * Handles height calculation and staggered card entrance
 *
 * @public
 */
function showPrices() {
    // Guard: Prevent animation if already animating or elements missing
    if (isAnimating || !priceSection || !priceSectionButton) {
        debugLog('Show animation cancelled', {
            isAnimating,
            hasSection: !!priceSection,
            hasButton: !!priceSectionButton,
        });
        return;
    }

    debugLog('🟢 Starting show animation');
    isAnimating = true;

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 1️⃣ UPDATE ACCESSIBILITY ATTRIBUTES
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    priceSectionButton.setAttribute('aria-expanded', 'true');
    priceSection.setAttribute('aria-hidden', 'false');

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 2️⃣ CALCULATE TARGET HEIGHT
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // Temporarily make visible to measure true height
    priceSection.style.display = 'grid';
    priceSection.style.height = 'auto';
    priceSection.style.opacity = '0'; // Keep invisible during measurement

    // Get natural height of content
    const fullHeight = priceSection.scrollHeight;
    debugLog('Calculated section height:', fullHeight + 'px');

    // Reset to collapsed state before animating
    priceSection.style.height = '0';
    priceSection.style.opacity = '0';

    // Force reflow to ensure transition will work
    void priceSection.offsetHeight;

    // Add visibility class for CSS transitions
    priceSection.classList.add(CSS_CLASSES.SECTION_VISIBLE);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 3️⃣ START HEIGHT ANIMATION
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    setTimeout(() => {
        priceSection.style.height = fullHeight + 'px';
        priceSection.style.opacity = '1';
        debugLog('Height animation started');
    }, ANIMATION_CONFIG.AUTO_HEIGHT_DELAY);

    // Update button text
    // 🔤 TRANSLATED: "Спрятать цены" = "Hide prices"
    priceSectionButton.textContent = 'Спрятать цены';

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 4️⃣ START CARD ANIMATIONS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    setTimeout(() => {
        animateCardsIn();
    }, ANIMATION_CONFIG.CARDS_START_DELAY);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 5️⃣ FINALIZE ANIMATION
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    setTimeout(() => {
        // Set height to auto for responsive behavior
        priceSection.style.height = 'auto';
        isAnimating = false;
        debugLog('✅ Show animation completed');

        // Focus management for accessibility
        handleFocusManagement();
    }, ANIMATION_CONFIG.MAIN_DURATION);
}

/**
 * Hide prices section with smooth animation
 * Collapses height to 0 and removes card animations
 *
 * @public
 */
function hidePrices() {
    // Guard: Prevent animation if already animating or elements missing
    if (isAnimating || !priceSection || !priceSectionButton) {
        debugLog('Hide animation cancelled', {
            isAnimating,
            hasSection: !!priceSection,
            hasButton: !!priceSectionButton,
        });
        return;
    }

    debugLog('🔴 Starting hide animation');
    isAnimating = true;

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 1️⃣ UPDATE ACCESSIBILITY ATTRIBUTES
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    priceSectionButton.setAttribute('aria-expanded', 'false');
    priceSection.setAttribute('aria-hidden', 'true');

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 2️⃣ REMOVE CARD ANIMATIONS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    animateCardsOut();

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 3️⃣ PREPARE FOR COLLAPSE ANIMATION
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // Get current height for smooth collapse
    const currentHeight = priceSection.scrollHeight;
    priceSection.style.height = currentHeight + 'px';

    // Force reflow
    void priceSection.offsetHeight;

    // Remove visibility class
    priceSection.classList.remove(CSS_CLASSES.SECTION_VISIBLE);

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 4️⃣ START COLLAPSE ANIMATION
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    setTimeout(() => {
        priceSection.style.height = '0';
        priceSection.style.opacity = '0';
        debugLog('Collapse animation started');
    }, ANIMATION_CONFIG.AUTO_HEIGHT_DELAY);

    // Update button text
    // 🔤 TRANSLATED: "Показать цены" = "Show prices"
    priceSectionButton.textContent = 'Показать цены';

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 5️⃣ FINALIZE ANIMATION
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    setTimeout(() => {
        isAnimating = false;
        debugLog('✅ Hide animation completed');
    }, ANIMATION_CONFIG.MAIN_DURATION);
}

/**
 * Toggle prices visibility
 * Main function called by button click
 *
 * @public
 */
function togglePrices() {
    if (isAnimating) {
        debugLog('⏸️ Toggle cancelled - animation in progress');
        return;
    }

    debugLog('🔄 Toggling prices section', { currentState: isVisible });

    if (!isVisible) {
        showPrices();
    } else {
        hidePrices();
    }

    // Update state
    isVisible = !isVisible;
}

// ================================================
// 9️⃣ EVENT HANDLERS
// ================================================

/**
 * Handle focus management for accessibility
 * Scrolls first card into view when section opens
 *
 * @private
 */
function handleFocusManagement() {
    if (document.activeElement === priceSectionButton) {
        const firstCard = priceSection.querySelector(CSS_CLASSES.PRICE_CARD);
        if (firstCard) {
            firstCard.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
            debugLog('Focus scrolled to first card');
        }
    }
}

/**
 * Handle button click event
 * @private
 */
function handleButtonClick() {
    debugLog('👆 Button clicked');
    togglePrices();
}

/**
 * Handle keyboard navigation
 * Enter and Space keys trigger toggle
 *
 * @param {KeyboardEvent} e - Keyboard event
 * @private
 */
function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        debugLog('⌨️ Keyboard toggle activated', { key: e.key });
        togglePrices();
    }
}

/**
 * Handle Escape key to close prices
 * @param {KeyboardEvent} e - Keyboard event
 * @private
 */
function handleEscapeKey(e) {
    if (e.key === 'Escape' && isVisible && priceSectionButton) {
        debugLog('⎋ Escape key pressed - closing prices');
        hidePrices();
        isVisible = false;
        priceSectionButton.focus(); // Return focus to button
    }
}

/**
 * Handle window resize with debouncing
 * Recalculates section height when window size changes
 *
 * @private
 */
function handleResize() {
    if (!isVisible || isAnimating || !priceSection) return;

    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        debugLog('📐 Handling window resize');

        // Recalculate height if section is open
        if (priceSection.style.height === 'auto') {
            // Temporarily hide for accurate measurement
            priceSection.style.visibility = 'hidden';
            const newHeight = priceSection.scrollHeight;
            priceSection.style.visibility = 'visible';
            priceSection.style.height = newHeight + 'px';

            debugLog('Recalculated height:', newHeight + 'px');

            // Return to auto after brief delay
            setTimeout(() => {
                if (priceSection) {
                    priceSection.style.height = 'auto';
                }
            }, 100);
        }
    }, ANIMATION_CONFIG.RESIZE_DEBOUNCE);
}

// ================================================
// 🔟 INITIALIZATION
// ================================================

/**
 * Initialize all event listeners
 * Removes existing listeners to prevent duplication
 *
 * @returns {boolean} Success status
 * @private
 */
function initializeEvents() {
    if (!priceSectionButton) {
        debugLog('❌ Button not found - cannot initialize events');
        return false;
    }

    // Remove existing listeners to prevent duplication
    priceSectionButton.removeEventListener('click', handleButtonClick);
    priceSectionButton.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keydown', handleEscapeKey);
    window.removeEventListener('resize', handleResize);

    // Add event listeners
    priceSectionButton.addEventListener('click', handleButtonClick);
    priceSectionButton.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', handleEscapeKey);
    window.addEventListener('resize', handleResize);

    debugLog('✅ Event listeners initialized successfully');
    return true;
}

/**
 * Main initialization function
 * Called when DOM is ready
 *
 * @public
 */
function initialize() {
    debugLog('🚀 Starting prices section initialization...');

    // Check for potential conflicts with other components
    checkForConflicts();

    // Initialize accessibility and events
    const accessibilityOk = initializeAccessibility();
    const eventsOk = initializeEvents();

    if (accessibilityOk && eventsOk) {
        debugLog('✅ Prices section initialized successfully');
        debugLog('🎨 Using unique CSS classes:', CSS_CLASSES);

        // Add global debug functions
        if (typeof window !== 'undefined') {
            window.testPrices = testVisibility;
            debugLog('🔧 Debug functions available:');
            debugLog('  - testPrices() - Diagnostic tool');
            debugLog('  - pricesSection.debug() - Debug mode toggle');
            debugLog('  - pricesSection.config - Animation settings');
        }
    } else {
        debugLog('❌ Initialization failed - some components missing');
    }
}

// ================================================
// 1️⃣1️⃣ GLOBAL API & EXPORTS
// ================================================

/**
 * Check DOM readiness and initialize
 * Handles both loading and loaded states
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    // DOM already loaded
    initialize();
}

/**
 * Fallback initialization with delay
 * In case elements are loaded asynchronously
 */
setTimeout(() => {
    if (!priceSectionButton || !priceSection) {
        debugLog('🔄 Fallback initialization triggered');
        initialize();
    }
}, 100);

/**
 * Global API object for external control and debugging
 * Available as window.pricesSection
 *
 * @public
 */
if (typeof window !== 'undefined') {
    window.pricesSection = {
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // PUBLIC METHODS
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        /**
         * Show prices section
         * @public
         */
        show: showPrices,

        /**
         * Hide prices section
         * @public
         */
        hide: hidePrices,

        /**
         * Toggle prices visibility
         * @public
         */
        toggle: togglePrices,

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // STATE GETTERS
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        /**
         * Check if prices are currently visible
         * @returns {boolean}
         * @public
         */
        isVisible: () => isVisible,

        /**
         * Check if animation is in progress
         * @returns {boolean}
         * @public
         */
        isAnimating: () => isAnimating,

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // DEBUG METHODS
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        /**
         * Run visibility diagnostics
         * @public
         */
        test: testVisibility,

        /**
         * Check for component conflicts
         * @public
         */
        checkConflicts: checkForConflicts,

        /**
         * Toggle debug visualization mode
         * Adds visual borders to elements
         * @public
         */
        debug: () => {
            if (priceSection) {
                // Toggle debug class for visual debugging
                priceSection.classList.toggle('debug-force-visible');
                debugLog('🐛 Debug mode toggled');
            }
        },

        /**
         * Re-initialize the component
         * Useful for development and hot-reloading
         * @public
         */
        reinitialize: initialize,

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // CONFIGURATION ACCESS
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        /**
         * Animation configuration object
         * @readonly
         * @public
         */
        config: ANIMATION_CONFIG,

        /**
         * CSS class names used by component
         * @readonly
         * @public
         */
        classes: CSS_CLASSES,

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // METADATA
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        /**
         * Component version
         * @readonly
         * @public
         */
        version: '3.0.0',

        /**
         * Compatibility information
         * @readonly
         * @public
         */
        compatibility: {
            aboutMeConflict: false, // Resolved with unique class names
            globalNamespace: 'pricesSection', // Unique namespace
            cssClassPrefix: 'prices-', // All classes prefixed
        },
    };

    debugLog('🌐 Global pricesSection object created');
    debugLog('📋 Available methods:', Object.keys(window.pricesSection));
}

/* ================================================
   🔧 DEVELOPER CONSOLE UTILITIES
   ================================================
   
   Copy these commands to browser console for testing:
   
   // Test visibility
   testPrices()
   
   // Control manually
   pricesSection.show()
   pricesSection.hide()
   pricesSection.toggle()
   
   // Check state
   pricesSection.isVisible()
   pricesSection.isAnimating()
   
   // Debug mode
   pricesSection.debug()
   
   // Check conflicts
   pricesSection.checkConflicts()
   
   // View configuration
   console.table(pricesSection.config)
   console.table(pricesSection.classes)
*/
