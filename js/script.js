// ================================================
// 🎯 MAIN APPLICATION ORCHESTRATOR
// ================================================
//
// 📋 MODULE PURPOSE:
// Central initialization and coordination point for all application components.
// Handles module imports, event delegation, and ensures proper initialization
// order for all interactive features.
//
// 🎬 INITIALIZATION FLOW:
// 1. Import all feature modules
// 2. Define static data (SERVICE_DATA)
// 3. Initialize components on DOMContentLoaded
// 4. Setup cleanup handlers on beforeunload
//
// 🔗 DEPENDENCIES:
// - ./moon-phase.js (self-initializing)
// - ./price-section.js (self-initializing)
// - ./countdown-clock.js
// - ./carousel.js
// - ./calendar.js
// - ./nav.js
// - ./hero-button.js
//
// 📦 MAIN COMPONENTS:
// - SERVICE_DATA: Static service descriptions for popups
// - PopupManager: Modal system for service details
// - AboutMeAnimation: Scroll-triggered card animations
//
// ⚠️ IMPORTANT NOTES:
// - Each module should only be initialized ONCE
// - Moon phase and price section self-initialize (don't call manually)
// - Countdown cleanup prevents memory leaks on page unload

// ================================================
// 📦 MODULE IMPORTS
// ================================================

// Self-initializing modules (no manual init needed)
import './moon-phase.js'; // 🌙 Auto-initializes on DOMContentLoaded
import './price-section.js'; // 💰 Auto-initializes on DOMContentLoaded
import './animations.js'; // ✨ Auto-initializes scroll animations

// Modules requiring manual initialization
import { initializeCountdown, cleanupCountdown } from './countdown-clock.js';
import Carousel from './carousel.js';
import { renderCalendar, startAutoUpdate } from './calendar.js';
import { initNav, destroyNav } from './nav.js';
import { initializeHeroButton, destroyHeroButton } from './hero-button.js';
import { getTranslation } from './i18n.js';

// ================================================
// 🎴 SERVICE DATA - HANDLED BY i18n MODULE
// ================================================

/* ===================================
   🧭 MOBILE NAVIGATION
   =================================== */

/**
 * Initialize mobile navigation menu system
 * Handles off-canvas menu, focus trap, and scroll locking
 *
 * @see nav.js for detailed implementation
 * @private
 */
document.addEventListener('DOMContentLoaded', () => {
    initNav();
    console.log('✅ Mobile navigation initialized');
});

/* ===================================
   🦸 HERO BUTTON - SMOOTH SCROLL
   =================================== */

/**
 * Initialize hero section CTA button
 * Provides smooth scrolling to target sections
 *
 * @see hero-button.js for scroll implementation
 * @private
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeHeroButton();
    console.log('✅ Hero button initialized');
});

/**
 * Cleanup hero button listeners on page unload
 * Prevents memory leaks
 *
 * @private
 */
window.addEventListener('beforeunload', () => {
    destroyHeroButton();
});

/* ===================================
   👤 ABOUT ME SECTION - SCROLL ANIMATIONS
   =================================== */

//  ───────────────────────────────────────────────
//  📱 RESPONSIVE BREAKPOINTS
//  ───────────────────────────────────────────────

/**
 * Breakpoint configuration for responsive animation directions
 * Defines at which screen widths the layout changes
 *
 * @constant {Object}
 */
const BREAKPOINTS = {
    MOBILE: 599, // ≤599px: Single column layout
    TABLET: 991, // ≤991px: Two column layout
    DESKTOP: Infinity, // >991px: Three column layout
};

//  ───────────────────────────────────────────────
//  ⏱️ ANIMATION TIMING
//  ───────────────────────────────────────────────

/**
 * Animation timing configuration
 * Controls IntersectionObserver thresholds and delays
 *
 * @constant {Object}
 */
const ANIMATION_CONFIG = {
    // IntersectionObserver thresholds
    VISIBILITY_THRESHOLD: 0.3, // Trigger at 30% visibility
    ROOT_MARGIN: '-10% 0px -10% 0px', // Start trigger slightly before entering viewport

    // Timing for staggered card entrance
    BROWSER_DELAY: 100, // Delay between each card animation (ms)

    // Resize debouncing
    RESIZE_DEBOUNCE_DELAY: 250, // Wait after last resize event (ms)
};

//  ───────────────────────────────────────────────
//  🎬 ANIMATION DIRECTION PATTERNS
//  ───────────────────────────────────────────────

/**
 * Animation direction configurations for different screen sizes
 * Defines which direction each card should slide in from
 *
 * @constant {Object.<string, Array<string>>}
 *
 * @example
 * // Mobile: alternating diagonal + centered bottom
 * ['animate-from-bottom-left', 'animate-from-bottom-right', 'animate-from-bottom']
 */
const ANIMATION_DIRECTIONS = {
    MOBILE: [
        'animate-from-bottom-left', // Card 1: Diagonal from lower-left
        'animate-from-bottom-right', // Card 2: Diagonal from lower-right
        'animate-from-bottom', // Card 3: Straight up (centered)
    ],
    TABLET: [
        'animate-from-bottom-left', // Card 1: Left column
        'animate-from-bottom-right', // Card 2: Right column
        'animate-from-bottom', // Card 3: Centered (spans both columns)
    ],
    DESKTOP: [
        'animate-from-bottom-left', // Card 1: Left column
        'animate-from-bottom', // Card 2: Center column
        'animate-from-bottom-right', // Card 3: Right column
    ],
};

//  ───────────────────────────────────────────────
//  📦 ABOUT ME ANIMATION CLASS
//  ───────────────────────────────────────────────

/**
 * Manages scroll-triggered entrance animations for About Me section
 *
 * Uses IntersectionObserver to detect when section enters viewport,
 * then triggers staggered card entrance animations with direction
 * classes that adapt to current screen size.
 *
 * @class AboutMeAnimation
 *
 * @example
 * // Automatic initialization on DOM ready
 * const aboutMeAnimation = new AboutMeAnimation();
 *
 * @example
 * // Manual control (for testing)
 * aboutMeAnimation.triggerAnimation(); // Force animate
 * aboutMeAnimation.resetAnimation();   // Reset to initial state
 */
class AboutMeAnimation {
    /**
     * Initialize animation system
     * Caches DOM elements, sets up observer, and configures resize handler
     */
    constructor() {
        // Cache DOM elements for performance
        this.aboutMeSection = document.querySelector('.about-me-section');
        this.aboutMeCards = document.querySelectorAll('.about-me-card');

        // Animation state tracking
        this.hasAnimated = false; // Prevents re-triggering animation
        this.currentBreakpoint = null; // Tracks current responsive layout
        this.resizeTimeout = null; // Debounce timer for resize events
        this.observer = null; // IntersectionObserver instance

        // Validate required DOM elements exist
        if (!this.aboutMeSection || this.aboutMeCards.length === 0) {
            console.warn(
                '⚠️ About Me section or cards not found. Animation disabled.'
            );
            return;
        }

        // Initialize animation system
        this.initializeAnimation();
        this.setupIntersectionObserver();

        console.log('✅ About Me animation initialized');
    }

    /**
     * Set up initial animation classes and resize handler
     * @private
     */
    initializeAnimation() {
        this.updateAnimationDirections();
        this.setupResizeHandler();
    }

    /**
     * Determine current responsive breakpoint based on window width
     *
     * @returns {string} Current breakpoint name ('MOBILE', 'TABLET', or 'DESKTOP')
     * @private
     */
    getCurrentBreakpoint() {
        const width = window.innerWidth;

        if (width <= BREAKPOINTS.MOBILE) return 'MOBILE';
        if (width <= BREAKPOINTS.TABLET) return 'TABLET';
        return 'DESKTOP';
    }

    /**
     * Update animation direction classes based on current screen size
     * Only updates if breakpoint has actually changed (performance optimization)
     *
     * @private
     */
    updateAnimationDirections() {
        const newBreakpoint = this.getCurrentBreakpoint();

        // Skip update if breakpoint hasn't changed
        if (newBreakpoint === this.currentBreakpoint) {
            return;
        }

        this.currentBreakpoint = newBreakpoint;

        // Remove all existing direction classes
        this.aboutMeCards.forEach((card) => {
            card.classList.remove(
                'animate-from-bottom-left',
                'animate-from-bottom',
                'animate-from-bottom-right'
            );
        });

        // Apply new direction classes based on breakpoint
        const directions = ANIMATION_DIRECTIONS[newBreakpoint];
        this.aboutMeCards.forEach((card, index) => {
            if (directions[index]) {
                card.classList.add(directions[index]);
            }
        });
    }

    /**
     * Set up debounced window resize handler
     * Prevents excessive updates during active resize
     *
     * @private
     */
    setupResizeHandler() {
        const debouncedUpdate = () => {
            // Clear existing timeout
            if (this.resizeTimeout) {
                clearTimeout(this.resizeTimeout);
            }

            // Set new timeout
            this.resizeTimeout = setTimeout(() => {
                this.updateAnimationDirections();
            }, ANIMATION_CONFIG.RESIZE_DEBOUNCE_DELAY);
        };

        window.addEventListener('resize', debouncedUpdate);

        // Store reference for cleanup
        this.resizeHandler = debouncedUpdate;
    }

    /**
     * Set up IntersectionObserver to trigger animation when section enters viewport
     *
     * @private
     */
    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: ANIMATION_CONFIG.ROOT_MARGIN,
            threshold: ANIMATION_CONFIG.VISIBILITY_THRESHOLD,
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                // Trigger animation when section enters viewport (only once)
                if (entry.isIntersecting && !this.hasAnimated) {
                    this.animateCards();
                    this.hasAnimated = true;
                }
            });
        }, options);

        // Start observing the About Me section
        if (this.aboutMeSection) {
            this.observer.observe(this.aboutMeSection);
        }
    }

    /**
     * Trigger staggered entrance animation for all cards
     * Adds 'animate-in' class with progressive delays
     *
     * @private
     */
    animateCards() {
        this.aboutMeCards.forEach((card, index) => {
            // Small browser delay creates smooth staggered effect
            setTimeout(() => {
                card.classList.add('animate-in');
            }, index * ANIMATION_CONFIG.BROWSER_DELAY);
        });
    }

    /**
     * Manually trigger the entrance animation
     * Useful for testing or forcing animation after reset
     *
     * @public
     */
    triggerAnimation() {
        if (!this.hasAnimated) {
            this.animateCards();
            this.hasAnimated = true;
        }
    }

    /**
     * Reset animation state - allows animation to trigger again
     * Useful for testing or development
     *
     * @public
     */
    resetAnimation() {
        this.hasAnimated = false;

        // Remove animate-in class from all cards
        this.aboutMeCards.forEach((card) => {
            card.classList.remove('animate-in');
        });
    }

    /**
     * Clean up event listeners and observers
     * Prevents memory leaks when component is destroyed
     *
     * @public
     */
    destroy() {
        // Clear resize timeout
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }

        // Remove resize event listener
        if (this.resizeHandler) {
            window.removeEventListener('resize', this.resizeHandler);
        }

        // Disconnect IntersectionObserver
        if (this.observer) {
            this.observer.disconnect();
        }

        console.log('🧹 About Me animation cleaned up');
    }
}

/* ===================================
   🎭 POPUP MANAGER - SERVICE DETAILS MODAL
   =================================== */

/**
 * Manages popup modal system for displaying service details
 *
 * Creates and controls a modal overlay that displays detailed service
 * information from SERVICE_DATA when user clicks "Learn More" buttons
 * on carousel service cards.
 *
 * @class PopupManager
 *
 * @example
 * // Automatic initialization
 * const popupManager = new PopupManager();
 *
 * @example
 * // Manual control (if needed)
 * popupManager.show('Title', '<p>Content</p>');
 * popupManager.close();
 */
class PopupManager {
    /**
     * Initialize popup system
     * Creates DOM structure and sets up event listeners
     */
    constructor() {
        this.createPopupElements();
        this.initializeEventListeners();
        console.log('✅ Popup manager initialized');
    }

    /**
     * Create popup DOM structure and append to body
     *
     * Structure:
     * - overlay (backdrop)
     *   - content (card)
     *     - closeBtn (×)
     *     - title (h2)
     *     - text (div with HTML content)
     *
     * @private
     */
    createPopupElements() {
        // Create overlay backdrop
        this.overlay = document.createElement('div');
        this.overlay.className = 'popup-overlay';

        // Create content card
        this.content = document.createElement('div');
        this.content.className = 'popup-content';

        // Create title element
        this.title = document.createElement('h2');
        this.title.className = 'popup-title';

        // Create close button
        this.closeBtn = document.createElement('span');
        this.closeBtn.className = 'popup-close';
        this.closeBtn.innerHTML = '&times;';
        this.closeBtn.setAttribute('aria-label', 'Закрыть окно');

        // Create text container
        this.text = document.createElement('div');
        this.text.className = 'popup-text';

        // Assemble popup structure
        this.content.appendChild(this.closeBtn);
        this.content.appendChild(this.title);
        this.content.appendChild(this.text);
        this.overlay.appendChild(this.content);
        document.body.appendChild(this.overlay);
    }

    /**
     * Setup event listeners for popup interactions
     * Handles: close button, outside clicks, ESC key, and "Learn More" buttons
     *
     * @private
     */
    initializeEventListeners() {
        // Close button click
        this.closeBtn.addEventListener('click', () => this.close());

        // Click outside content area
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.close();
        });

        // ESC key press
        document.addEventListener('keydown', (e) => {
            if (
                e.key === 'Escape' &&
                this.overlay.classList.contains('active')
            ) {
                this.close();
            }
        });

        this.currentServiceId = null;

        // Update popup content when language changes
        window.addEventListener('languageChanged', () => this.updateContent());

        // Gallery item "Learn More" buttons
        document.querySelectorAll('.gallery-item-button').forEach((button) => {
            button.addEventListener('click', (e) => {
                e.preventDefault();

                // Extract service ID from data-popup attribute
                const serviceId = button
                    .getAttribute('data-popup')
                    ?.replace('popup-', '');

                if (serviceId) {
                    this.currentServiceId = serviceId;
                    this.updateContent();
                    this.overlay.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });
    }

    /**
     * Update popup content based on current service ID and language
     */
    updateContent() {
        if (!this.currentServiceId) return;

        const title = getTranslation(`popups.${this.currentServiceId}.title`);
        const content = getTranslation(`popups.${this.currentServiceId}.content`);

        this.title.textContent = title;
        this.text.innerHTML = content;
    }

    /**
     * Display popup with title and HTML content
     *
     * @param {string} title - Popup title text
     * @param {string} content - HTML content for popup body
     *
     * @example
     * popupManager.show('Гадание на картах', '<p>Description here</p>');
     *
     * @public
     */
    show(title, content) {
        this.title.textContent = title;
        this.text.innerHTML = content;
        this.overlay.classList.add('active');

        // Prevent background scroll while popup is open
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close popup and reset content
     * Restores body scroll and clears content after animation completes
     *
     * @public
     */
    close() {
        this.overlay.classList.remove('active');

        // Restore scroll
        document.body.style.overflow = '';

        // Clear content after CSS transition completes (300ms)
        setTimeout(() => {
            this.title.textContent = '';
            this.text.innerHTML = '';
            this.currentServiceId = null;
        }, 300);
    }
}

/* ===================================
   ⏰ COUNTDOWN CLOCK
   =================================== */

/**
 * Initialize countdown timer
 *
 * ⚠️ IMPORTANT: This is the ONLY place countdown should be initialized
 * Multiple initializations will cause duplicate timers and memory leaks
 *
 * @see countdown-clock.js for timer implementation
 * @private
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeCountdown();
    console.log('✅ Countdown timer initialized');
});

/**
 * Cleanup countdown on page unload
 * Prevents memory leaks by clearing interval timers
 *
 * @private
 */
window.addEventListener('beforeunload', () => {
    cleanupCountdown();
});

/* ===================================
   📅 CALENDAR SECTION
   =================================== */

/**
 * Render calendar for current month
 * Displays interactive monthly view with travel dates highlighted
 *
 * @see calendar.js for rendering logic
 * @private
 */
renderCalendar();

/**
 * Start calendar auto-update system
 * Calendar automatically refreshes every 6 hours to stay current
 *
 * @see calendar.js for update mechanism
 * @private
 */
startAutoUpdate();

console.log('✅ Calendar initialized with auto-update');

/* ===================================
   🎯 UNIFIED COMPONENT INITIALIZATION
   =================================== */

/**
 * Initialize all remaining components on DOM ready
 *
 * This centralized initialization point ensures:
 * - Proper initialization order
 * - No duplicate initializations
 * - Clean error handling
 *
 * @private
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing application components...');

    // Initialize popup system for service details
    const popupManager = new PopupManager();

    // Initialize carousel
    const carousel = new Carousel();

    // Initialize About Me section animations
    const aboutMeAnimation = new AboutMeAnimation();

    console.log('✅ All components initialized successfully');
});
