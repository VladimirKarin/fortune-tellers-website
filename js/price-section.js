// ================================================
// 💰 PRICES SECTION - Enhanced Toggle Controller
// ================================================
//
// 📋 MODULE PURPOSE:
// Manages expandable/collapsible prices section with smooth animations
// and staggered card entrance effects. Provides show/hide functionality
// with proper height calculation and accessibility features.
//
// 🎬 USER INTERACTION FLOW:
// 1. User clicks "Show prices" button
// 2. Section smoothly expands with height animation
// 3. Price cards enter with staggered timing
// 4. Button text changes to "Hide prices"
// 5. User clicks again to collapse section
// 6. Cards fade out, section collapses
//
// 🔗 DEPENDENCIES:
// - HTML: .prices-grid container
// - HTML: .prices__button toggle button
// - HTML: .prices-card individual price cards
// - CSS: 07-prices-section-styles.css
// - CSS: .prices-section-visible for expanded state
// - CSS: .prices-card-animate-in for card animations
//
// 📦 FEATURES:
// - Smooth expand/collapse animations with height calculation
// - Staggered card entrance animations
// - Keyboard navigation support (Enter, Space, ESC keys)
// - ARIA attributes for accessibility
// - Responsive height recalculation on window resize
// - Prevents animation interruption (isAnimating flag)
// - Memory leak prevention with proper cleanup
// - Unique class names to avoid conflicts with other sections
//
// 🎨 ANIMATION SEQUENCE:
// Expand: Height 0→auto (600ms) → Cards fade in staggered (100ms each)
// Collapse: Cards fade out → Height auto→0 (600ms)
//
// ⚠️ IMPORTANT NOTES:
// - Self-initializing on DOMContentLoaded (no manual init needed)
// - Uses unique class prefix 'prices-' to avoid conflicts
// - Different from about-me section (separate animation system)
// - Window resize recalculates height if section is open

/* ===================================
   ⏱️ CONFIGURATION CONSTANTS
   =================================== */

/**
 * Animation timing configuration
 * Adjust these values to change animation behavior
 *
 * @constant {Object}
 */
const ANIMATION_CONFIG = {
    /**
     * Main container expand/collapse duration
     * @type {number}
     * @default 600
     */
    MAIN_DURATION: 600, // milliseconds

    /**
     * Delay before cards start animating after container expands
     * @type {number}
     * @default 200
     */
    CARDS_START_DELAY: 200, // milliseconds

    /**
     * Interval between each card animation
     * @type {number}
     * @default 100
     */
    CARDS_INTERVAL: 100, // milliseconds

    /**
     * Delay before setting height to 'auto' for responsive behavior
     * @type {number}
     * @default 50
     */
    AUTO_HEIGHT_DELAY: 50, // milliseconds

    /**
     * Window resize debounce delay
     * @type {number}
     * @default 150
     */
    RESIZE_DEBOUNCE: 150, // milliseconds
};

/* ===================================
   🎨 CSS CLASS NAMES
   =================================== */

/**
 * CSS class constants
 * Using unique 'prices-' prefix to avoid conflicts with other sections
 *
 * @constant {Object}
 */
const CSS_CLASSES = {
    /**
     * Applied to .prices-grid when expanded
     * @type {string}
     */
    SECTION_VISIBLE: 'prices-section-visible',

    /**
     * Applied to cards for entrance animation
     * @type {string}
     */
    CARD_ANIMATE_IN: 'prices-card-animate-in',

    /**
     * Selector for individual price cards
     * @type {string}
     */
    PRICE_CARD: '.prices-card',

    /**
     * Selector for explanation card
     * @type {string}
     */
    EXPLANATION_CARD: '.prices-explanation-card',
};

/* ===================================
   📦 DOM ELEMENT REFERENCES
   =================================== */

/**
 * Cached DOM element references
 * @type {HTMLElement|null}
 */
const priceSection = document.querySelector('.prices-grid');
const priceSectionButton = document.querySelector('.prices__button');

/* ===================================
   🎯 STATE MANAGEMENT
   =================================== */

/**
 * Component state tracking
 * @type {Object}
 */
let state = {
    /**
     * Whether prices are currently visible
     * @type {boolean}
     */
    isVisible: false,

    /**
     * Whether animation is currently in progress
     * @type {boolean}
     */
    isAnimating: false,

    /**
     * Resize debounce timeout reference
     * @type {number|null}
     */
    resizeTimeout: null,
};

/* ===================================
   🔧 DEBUG UTILITIES
   =================================== */

/**
 * Debug mode configuration
 * Set to false in production to disable console logs
 *
 * @constant {boolean}
 * @default false
 */
const DEBUG_ENABLED = false;

/**
 * Centralized debug logging
 * Only logs when DEBUG_ENABLED is true
 *
 * @param {string} message - Log message
 * @param {*} [data=''] - Optional data to log
 * @returns {void}
 *
 * @private
 */
function debugLog(message, data = '') {
    if (DEBUG_ENABLED) {
        console.log(`[Prices Debug] ${message}`, data);
    }
}

/* ===================================
   ♿ ACCESSIBILITY SETUP
   =================================== */

/**
 * Initialize ARIA attributes for screen readers
 *
 * Sets up proper semantic relationships between button and content.
 * Ensures screen readers can understand and announce the expandable section.
 *
 * @returns {boolean} Success status
 *
 * @example
 * const success = initializeAccessibility();
 * if (success) console.log('ARIA attributes set');
 *
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
    priceSection.setAttribute('aria-label', 'Список цен на услуги'); // Russian: "Price list for services"

    debugLog('✅ Accessibility initialized successfully');
    return true;
}

/* ===================================
   🎬 ANIMATION FUNCTIONS
   =================================== */

/**
 * Animate cards entrance with staggered timing
 *
 * Adds animation class to each card with progressive delays.
 * Creates a cascading entrance effect for visual interest.
 *
 * @returns {void}
 *
 * @example
 * animateCardsIn(); // Cards fade in one by one
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
 * Resets cards to initial state for next animation
 *
 * @returns {void}
 *
 * @example
 * animateCardsOut(); // Remove animation classes
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

/* ===================================
   📐 HEIGHT CALCULATION
   =================================== */

/**
 * Calculate natural height of prices section
 *
 * Temporarily displays section to measure its natural height,
 * then returns it to initial state.
 *
 * @returns {number} Height in pixels
 *
 * @example
 * const height = calculateSectionHeight();
 * console.log('Section height:', height + 'px');
 *
 * @private
 */
function calculateSectionHeight() {
    // Temporarily make visible to measure true height
    priceSection.style.display = 'grid';
    priceSection.style.height = 'auto';
    priceSection.style.opacity = '0'; // Keep invisible during measurement

    // Get natural height of content
    const fullHeight = priceSection.scrollHeight;
    debugLog('Calculated section height:', fullHeight + 'px');

    // Reset to collapsed state
    priceSection.style.height = '0';
    priceSection.style.opacity = '0';

    return fullHeight;
}

/* ===================================
   🎨 SHOW/HIDE LOGIC
   =================================== */

/**
 * Show prices section with smooth animation
 *
 * Handles complete show sequence:
 * 1. Calculate target height
 * 2. Update ARIA attributes
 * 3. Start height expansion animation
 * 4. Trigger staggered card entrance
 * 5. Set height to 'auto' for responsive behavior
 * 6. Manage focus for accessibility
 *
 * @returns {void}
 *
 * @example
 * showPrices(); // Expand prices section
 *
 * @public
 */
function showPrices() {
    // Guard: Prevent animation if already animating or elements missing
    if (state.isAnimating || !priceSection || !priceSectionButton) {
        debugLog('Show animation cancelled', {
            isAnimating: state.isAnimating,
            hasSection: !!priceSection,
            hasButton: !!priceSectionButton,
        });
        return;
    }

    debugLog('🟢 Starting show animation');
    state.isAnimating = true;

    // Update ARIA attributes
    priceSectionButton.setAttribute('aria-expanded', 'true');
    priceSection.setAttribute('aria-hidden', 'false');

    // Calculate target height
    const fullHeight = calculateSectionHeight();

    // Force reflow to ensure transition will work
    void priceSection.offsetHeight;

    // Add visibility class for CSS transitions
    priceSection.classList.add(CSS_CLASSES.SECTION_VISIBLE);

    // Start height animation
    setTimeout(() => {
        priceSection.style.height = fullHeight + 'px';
        priceSection.style.opacity = '1';
        debugLog('Height animation started');
    }, ANIMATION_CONFIG.AUTO_HEIGHT_DELAY);

    // Update button text (Russian: "Hide prices")
    priceSectionButton.textContent = 'Спрятать цены';

    // Start card animations
    setTimeout(() => {
        animateCardsIn();
    }, ANIMATION_CONFIG.CARDS_START_DELAY);

    // Finalize animation
    setTimeout(() => {
        // Set height to auto for responsive behavior
        priceSection.style.height = 'auto';
        state.isAnimating = false;
        debugLog('✅ Show animation completed');

        // Focus management for accessibility
        handleFocusManagement();
    }, ANIMATION_CONFIG.MAIN_DURATION);
}

/**
 * Hide prices section with smooth animation
 *
 * Handles complete hide sequence:
 * 1. Update ARIA attributes
 * 2. Remove card animations
 * 3. Calculate current height
 * 4. Start height collapse animation
 * 5. Reset all styles
 *
 * @returns {void}
 *
 * @example
 * hidePrices(); // Collapse prices section
 *
 * @public
 */
function hidePrices() {
    // Guard: Prevent animation if already animating or elements missing
    if (state.isAnimating || !priceSection || !priceSectionButton) {
        debugLog('Hide animation cancelled', {
            isAnimating: state.isAnimating,
            hasSection: !!priceSection,
            hasButton: !!priceSectionButton,
        });
        return;
    }

    debugLog('🔴 Starting hide animation');
    state.isAnimating = true;

    // Update ARIA attributes
    priceSectionButton.setAttribute('aria-expanded', 'false');
    priceSection.setAttribute('aria-hidden', 'true');

    // Remove card animations
    animateCardsOut();

    // Get current height for smooth collapse
    const currentHeight = priceSection.scrollHeight;
    priceSection.style.height = currentHeight + 'px';

    // Force reflow
    void priceSection.offsetHeight;

    // Remove visibility class
    priceSection.classList.remove(CSS_CLASSES.SECTION_VISIBLE);

    // Start collapse animation
    setTimeout(() => {
        priceSection.style.height = '0';
        priceSection.style.opacity = '0';
        debugLog('Collapse animation started');
    }, ANIMATION_CONFIG.AUTO_HEIGHT_DELAY);

    // Update button text (Russian: "Show prices")
    priceSectionButton.textContent = 'Показать цены';

    // Finalize animation
    setTimeout(() => {
        state.isAnimating = false;
        debugLog('✅ Hide animation completed');
    }, ANIMATION_CONFIG.MAIN_DURATION);
}

/**
 * Toggle prices visibility
 * Main function called by button click
 *
 * @returns {void}
 *
 * @example
 * togglePrices(); // Opens if closed, closes if open
 *
 * @public
 */
function togglePrices() {
    if (state.isAnimating) {
        debugLog('⏸️ Toggle cancelled - animation in progress');
        return;
    }

    debugLog('🔄 Toggling prices section', { currentState: state.isVisible });

    if (!state.isVisible) {
        showPrices();
    } else {
        hidePrices();
    }

    // Update state
    state.isVisible = !state.isVisible;
}

/* ===================================
   🎯 EVENT HANDLERS
   =================================== */

/**
 * Handle focus management for accessibility
 *
 * Scrolls first card into view when section opens and
 * button was the active element.
 *
 * @returns {void}
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
 *
 * @returns {void}
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
 * @returns {void}
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
 *
 * @param {KeyboardEvent} e - Keyboard event
 * @returns {void}
 * @private
 */
function handleEscapeKey(e) {
    if (e.key === 'Escape' && state.isVisible && priceSectionButton) {
        debugLog('⎋ Escape key pressed - closing prices');
        hidePrices();
        state.isVisible = false;
        priceSectionButton.focus(); // Return focus to button
    }
}

/**
 * Handle window resize with debouncing
 *
 * Recalculates section height when window size changes to ensure
 * proper display of expanded section.
 *
 * @returns {void}
 * @private
 */
function handleResize() {
    if (!state.isVisible || state.isAnimating || !priceSection) return;

    clearTimeout(state.resizeTimeout);
    state.resizeTimeout = setTimeout(() => {
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

/* ===================================
   🚀 INITIALIZATION
   =================================== */

/**
 * Initialize all event listeners
 *
 * Removes existing listeners to prevent duplication,
 * then attaches all necessary event handlers.
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
 * @returns {void}
 * @public
 */
function initialize() {
    debugLog('🚀 Starting prices section initialization...');

    // Initialize accessibility and events
    const accessibilityOk = initializeAccessibility();
    const eventsOk = initializeEvents();

    if (accessibilityOk && eventsOk) {
        debugLog('✅ Prices section initialized successfully');
        debugLog('🎨 Using unique CSS classes:', CSS_CLASSES);
    } else {
        debugLog('❌ Initialization failed - some components missing');
    }
}

/* ===================================
   🎬 AUTO-START
   =================================== */

/**
 * Check DOM readiness and initialize
 * Handles both loading and already-loaded states
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

/* ===================================
   🌐 GLOBAL API & EXPORTS
   =================================== */

/**
 * Global API object for external control and debugging
 * Available as window.pricesSection
 *
 * @public
 */
if (typeof window !== 'undefined') {
    window.pricesSection = {
        // Public methods
        show: showPrices,
        hide: hidePrices,
        toggle: togglePrices,

        // State getters
        isVisible: () => state.isVisible,
        isAnimating: () => state.isAnimating,

        // Configuration access
        config: ANIMATION_CONFIG,
        classes: CSS_CLASSES,

        // Debug method
        debug: () => {
            if (priceSection) {
                priceSection.classList.toggle('debug-force-visible');
                debugLog('🐛 Debug mode toggled');
            }
        },

        // Re-initialize method
        reinitialize: initialize,

        // Metadata
        version: '3.0.0',
        compatibility: {
            aboutMeConflict: false, // Resolved with unique class names
            globalNamespace: 'pricesSection',
            cssClassPrefix: 'prices-',
        },
    };

    debugLog('🌐 Global pricesSection object created');
    debugLog('📋 Available methods:', Object.keys(window.pricesSection));
}

/* ================================================
   🔧 DEBUG UTILITIES - MOVE TO DEV FILE LATER
   ================================================
   
   📊 Console Testing Commands:
   Copy these to browser console for debugging
   
   ──────────────────────────────────────────────
   TEST VISIBILITY:
   ──────────────────────────────────────────────
   
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
           const explanationCards = section.querySelectorAll('.prices-explanation-card');
           
           console.log('Price cards found:', priceCards.length);
           console.log('Explanation cards found:', explanationCards.length);
           
           console.log('Section CSS classes:', section.className);
           console.log('Cards with animation class:',
               section.querySelectorAll('.prices-card-animate-in').length
           );
       }
       console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
   }
   
   ──────────────────────────────────────────────
   MANUAL CONTROL:
   ──────────────────────────────────────────────
   
   // Show prices manually
   pricesSection.show();
   
   // Hide prices manually
   pricesSection.hide();
   
   // Toggle prices
   pricesSection.toggle();
   
   ──────────────────────────────────────────────
   CHECK STATE:
   ──────────────────────────────────────────────
   
   // Check if visible
   console.log('Is visible:', pricesSection.isVisible());
   
   // Check if animating
   console.log('Is animating:', pricesSection.isAnimating());
   
   ──────────────────────────────────────────────
   VIEW CONFIGURATION:
   ──────────────────────────────────────────────
   
   // View animation config
   console.table(pricesSection.config);
   
   // View CSS classes
   console.table(pricesSection.classes);
   
   ──────────────────────────────────────────────
   TEST BUTTON CLICK:
   ──────────────────────────────────────────────
   
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
   
   ──────────────────────────────────────────────
   TEST KEYBOARD EVENTS:
   ──────────────────────────────────────────────
   
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
   
   ──────────────────────────────────────────────
   TEST ANIMATIONS:
   ──────────────────────────────────────────────
   
   // Test card animations
   function testCardAnimations() {
       const cards = document.querySelectorAll('.prices-card, .prices-explanation-card');
       console.log('🎬 Testing card animations...');
       console.log('Total cards:', cards.length);
       
       cards.forEach((card, i) => {
           const hasAnimation = card.classList.contains('prices-card-animate-in');
           console.log(`Card ${i + 1}:`, hasAnimation ? '✅ Animated' : '❌ Not animated');
       });
   }
   
   ──────────────────────────────────────────────
   FULL DIAGNOSTIC:
   ──────────────────────────────────────────────
   
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
   
   ──────────────────────────────────────────────
   USAGE:
   ──────────────────────────────────────────────
   
   Copy and paste in browser console:
   
   fullPricesDiagnostic()         // Complete diagnostic
   testPrices()                    // Check visibility
   pricesSection.show()            // Show prices
   pricesSection.hide()            // Hide prices
   pricesSection.toggle()          // Toggle state
   pricesSection.isVisible()       // Check visibility
   pricesSection.isAnimating()     // Check animation
   console.table(pricesSection.config)  // View config
   testButtonClick()               // Test button
   testEnterKey()                  // Test Enter
   testSpaceKey()                  // Test Space
   testEscapeKey()                 // Test Escape
   testCardAnimations()            // Test animations
   pricesSection.debug()           // Debug mode
   
*/

/* ================================================
   📝 TECHNICAL DOCUMENTATION
   ================================================
   
   ──────────────────────────────────────────────
   HEIGHT ANIMATION STRATEGY:
   ──────────────────────────────────────────────
   
   Challenge:
   - CSS transition: height from 0 to 'auto' doesn't work
   - Need specific pixel value for smooth animation
   
   Solution:
   1. Calculate natural height (scrollHeight)
   2. Set height: 0 initially
   3. Force reflow (void element.offsetHeight)
   4. Animate to calculated pixel value
   5. After animation, set height: 'auto' for responsiveness
   
   Why height: 'auto' at end?
   - Allows content to grow if window resizes
   - Maintains responsiveness
   - No fixed height constraints
   
   Why force reflow?
   - Ensures browser processes height: 0 before transition
   - Without it, browser may batch both changes
   - No animation would occur
   
   ──────────────────────────────────────────────
   STAGGERED ANIMATION TIMING:
   ──────────────────────────────────────────────
   
   Timing breakdown:
   1. Container starts expanding (0ms)
   2. Cards wait for container (200ms delay)
   3. Cards animate one by one (100ms interval)
   4. Container finishes expanding (600ms total)
   
   Formula for card N:
   startTime = CARDS_START_DELAY + (N × CARDS_INTERVAL)
   
   Example with 5 cards:
   - Card 1: 200ms
   - Card 2: 300ms
   - Card 3: 400ms
   - Card 4: 500ms
   - Card 5: 600ms
   
   Why staggered?
   - More visually interesting
   - Draws eye through content*/

