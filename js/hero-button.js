// ================================================
// 🦸 HERO BUTTON MODULE - Smooth Scroll Handler
// ================================================
//
// 📋 MODULE PURPOSE:
// Handles hero section button interactions with smooth scrolling to
// target sections. Provides clean separation of concerns and reusable
// scroll functionality for CTA (Call-to-Action) buttons.
//
// 🎬 USER INTERACTION FLOW:
// 1. User clicks hero section CTA button
// 2. Button's data-scroll-to attribute read
// 3. Target section found by ID
// 4. Smooth scroll animation to target
// 5. Optional focus management for accessibility
//
// 🔗 DEPENDENCIES:
// - HTML: Hero buttons with [data-scroll-to] attribute
// - HTML: Target sections with matching IDs
// - Browser: scrollIntoView API (modern browsers)
//
// 📦 FEATURES:
// - Smooth scrolling to any section by ID
// - Multiple buttons support (via data attributes)
// - Keyboard navigation (Enter and Space keys)
// - Focus management for accessibility
// - Configurable scroll behavior
// - Error handling for missing targets
// - Memory leak prevention with cleanup
//
// 🎯 HTML STRUCTURE REQUIRED:
// <button class="hero__button" data-scroll-to="contacts">
//     Contact Us
// </button>
//
// <section id="contacts">
//     <!-- Target section content -->
// </section>
//
// ⚠️ IMPORTANT NOTES:
// - Initialized from script.js on DOMContentLoaded
// - Buttons must have data-scroll-to attribute
// - Target sections must have matching IDs
// - Call destroyHeroButton() before removing buttons

/* ===================================
   🔑 CONFIGURATION
   =================================== */

/**
 * Hero button configuration object
 * Customize scroll behavior and accessibility features
 *
 * @constant {Object}
 */
export const heroButtonConfig = {
    /**
     * Scroll animation behavior
     * @type {string}
     * @default 'smooth'
     * @options 'smooth' | 'auto'
     */
    scrollBehavior: 'smooth',

    /**
     * Vertical alignment of target section after scroll
     * @type {string}
     * @default 'start'
     * @options 'start' | 'center' | 'end' | 'nearest'
     */
    scrollBlock: 'start',

    /**
     * Whether to focus target section after scroll
     * Improves accessibility for keyboard navigation
     * @type {boolean}
     * @default false
     */
    focusTargetAfterScroll: false,

    /**
     * Approximate scroll duration (browser-controlled)
     * Informational only - actual duration varies by browser
     * @type {number}
     * @default 800
     */
    scrollDuration: 800,

    /**
     * Enable/disable console logging
     * Set to false in production for cleaner console
     * @type {boolean}
     * @default true
     */
    enableLogging: true,
};

/* ===================================
   🎯 SMOOTH SCROLL UTILITY
   =================================== */

/**
 * Smooth scroll to a target section by ID
 *
 * Reusable function that can be called from anywhere in the application.
 * Uses native scrollIntoView API with configurable options.
 *
 * Process:
 * 1. Find target section by ID
 * 2. Validate target exists
 * 3. Perform smooth scroll
 * 4. Optionally set focus for accessibility
 *
 * @param {string} targetId - ID of the target section (without #)
 * @param {Object} [options={}] - Scroll behavior options
 * @param {string} [options.behavior='smooth'] - 'smooth' or 'auto'
 * @param {string} [options.block='start'] - Vertical alignment
 * @param {boolean} [options.focusTarget=false] - Whether to focus target after scroll
 * @returns {boolean} True if scroll successful, false if target not found
 *
 * @example
 * // Basic usage - smooth scroll to contacts section
 * scrollToSection('contacts');
 *
 * @example
 * // Custom options - instant scroll to center
 * scrollToSection('about', {
 *     behavior: 'auto',
 *     block: 'center'
 * });
 *
 * @example
 * // With focus management for accessibility
 * scrollToSection('services', { focusTarget: true });
 *
 * @public
 */
export function scrollToSection(targetId, options = {}) {
    // Merge provided options with defaults
    const {
        behavior = heroButtonConfig.scrollBehavior,
        block = heroButtonConfig.scrollBlock,
        focusTarget = heroButtonConfig.focusTargetAfterScroll,
    } = options;

    // Find target section by ID
    const targetSection = document.getElementById(targetId);

    if (!targetSection) {
        if (heroButtonConfig.enableLogging) {
            console.warn(
                `⚠️ Hero Button: Target section #${targetId} not found`
            );
        }
        return false;
    }

    // Perform smooth scroll
    targetSection.scrollIntoView({
        behavior: behavior,
        block: block,
        inline: 'nearest',
    });

    // Optional: Set focus for accessibility
    if (focusTarget) {
        // Make section focusable temporarily
        targetSection.setAttribute('tabindex', '-1');
        targetSection.focus();

        // Remove tabindex after focus to restore normal tab order
        targetSection.addEventListener(
            'blur',
            function removeFocus() {
                targetSection.removeAttribute('tabindex');
                targetSection.removeEventListener('blur', removeFocus);
            },
            { once: true }
        );
    }

    if (heroButtonConfig.enableLogging) {
        console.log(`✅ Hero Button: Scrolled to #${targetId} section`);
    }

    return true;
}

/* ===================================
   🔘 HERO BUTTON INITIALIZATION
   =================================== */

/**
 * Initialize hero section button with smooth scroll functionality
 *
 * Finds all buttons with [data-scroll-to] attribute and attaches
 * click and keyboard event handlers. Supports multiple hero buttons
 * on the same page.
 *
 * Process:
 * 1. Find all hero buttons with data-scroll-to attribute
 * 2. Validate each button has valid target ID
 * 3. Attach click event listener
 * 4. Attach keyboard event listener (Enter, Space)
 * 5. Store handler references for cleanup
 *
 * @returns {boolean} True if at least one button initialized, false otherwise
 *
 * @example
 * // In script.js - Basic initialization
 * import { initializeHeroButton } from './hero-button.js';
 * document.addEventListener('DOMContentLoaded', initializeHeroButton);
 *
 * @example
 * // Manual initialization after dynamic content load
 * import { initializeHeroButton } from './hero-button.js';
 * loadDynamicContent().then(() => {
 *     initializeHeroButton();
 * });
 *
 * @public
 */
export function initializeHeroButton() {
    // Find all hero buttons with scroll target
    const heroButtons = document.querySelectorAll(
        '.hero__button[data-scroll-to]'
    );

    if (heroButtons.length === 0) {
        if (heroButtonConfig.enableLogging) {
            console.warn(
                '⚠️ Hero Button: No buttons with [data-scroll-to] attribute found'
            );
        }
        return false;
    }

    // Initialize each button
    heroButtons.forEach((button, index) => {
        const targetId = button.getAttribute('data-scroll-to');

        if (!targetId) {
            if (heroButtonConfig.enableLogging) {
                console.warn(
                    `⚠️ Hero Button ${
                        index + 1
                    }: Empty data-scroll-to attribute`
                );
            }
            return;
        }

        /**
         * Handle button click event
         * @param {Event} event - Click event object
         */
        const handleClick = (event) => {
            event.preventDefault(); // Prevent default link behavior

            // Use the utility function to scroll
            scrollToSection(targetId, {
                behavior: heroButtonConfig.scrollBehavior,
                block: heroButtonConfig.scrollBlock,
                focusTarget: heroButtonConfig.focusTargetAfterScroll,
            });
        };

        /**
         * Handle keyboard events (Enter and Space)
         * @param {KeyboardEvent} event - Keyboard event object
         */
        const handleKeydown = (event) => {
            // Check for Enter or Space key
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault(); // Prevent page scroll on Space
                handleClick(event);
            }
        };

        // Add event listeners
        button.addEventListener('click', handleClick);
        button.addEventListener('keydown', handleKeydown);

        // Store references for potential cleanup
        button._heroScrollHandler = handleClick;
        button._heroKeydownHandler = handleKeydown;

        if (heroButtonConfig.enableLogging) {
            console.log(
                `✅ Hero Button ${
                    index + 1
                }: Initialized (target: #${targetId})`
            );
        }
    });

    if (heroButtonConfig.enableLogging) {
        console.log(
            `✅ Hero Button: ${heroButtons.length} button(s) initialized`
        );
    }

    return true;
}

/* ===================================
   🧹 CLEANUP FUNCTION
   =================================== */

/**
 * Remove all hero button event listeners
 *
 * Cleans up event listeners to prevent memory leaks when hero section
 * is dynamically removed or before page navigation in SPAs.
 *
 * Process:
 * 1. Find all hero buttons
 * 2. Remove stored click handlers
 * 3. Remove stored keydown handlers
 * 4. Delete handler references
 *
 * @returns {boolean} True if cleanup successful, false if no buttons found
 *
 * @example
 * // In script.js - Cleanup before page unload
 * import { destroyHeroButton } from './hero-button.js';
 * window.addEventListener('beforeunload', destroyHeroButton);
 *
 * @example
 * // SPA route change cleanup
 * function navigateToNewPage() {
 *     destroyHeroButton();
 *     loadNewContent();
 *     initializeHeroButton(); // Re-initialize if needed
 * }
 *
 * @public
 */
export function destroyHeroButton() {
    const heroButtons = document.querySelectorAll(
        '.hero__button[data-scroll-to]'
    );

    if (heroButtons.length === 0) {
        if (heroButtonConfig.enableLogging) {
            console.warn('⚠️ Hero Button: No buttons to clean up');
        }
        return false;
    }

    heroButtons.forEach((button, index) => {
        // Remove event listeners if they exist
        if (button._heroScrollHandler) {
            button.removeEventListener('click', button._heroScrollHandler);
            delete button._heroScrollHandler;
        }

        if (button._heroKeydownHandler) {
            button.removeEventListener('keydown', button._heroKeydownHandler);
            delete button._heroKeydownHandler;
        }

        if (heroButtonConfig.enableLogging) {
            console.log(`🧹 Hero Button ${index + 1}: Cleaned up`);
        }
    });

    if (heroButtonConfig.enableLogging) {
        console.log(
            `🧹 Hero Button: ${heroButtons.length} button(s) cleaned up`
        );
    }

    return true;
}
