/* ================================================
   🦸 HERO BUTTON MODULE - Smooth Scroll Handler
   ================================================
   
   📋 MODULE PURPOSE:
   Handles hero section button interactions with smooth scrolling
   to target sections. Provides clean separation of concerns and
   reusable scroll functionality.
   
   🔗 USAGE:
   import { initializeHeroButton } from './hero-button.js';
   initializeHeroButton();
   
   📦 EXPORTS:
   - initializeHeroButton(): Main initialization function
   - scrollToSection(): Reusable smooth scroll utility
*/

/* ===================================
   🎯 SMOOTH SCROLL UTILITY
   =================================== */

/**
 * Smooth scroll to a target section by ID
 * Reusable function that can be called from anywhere
 *
 * @param {string} targetId - ID of the target section (without #)
 * @param {Object} options - Scroll behavior options
 * @param {string} options.behavior - 'smooth' or 'auto' (default: 'smooth')
 * @param {string} options.block - Vertical alignment (default: 'start')
 * @param {boolean} options.focusTarget - Whether to focus target after scroll (default: false)
 * @returns {boolean} Success status
 *
 * @example
 * scrollToSection('contacts'); // Smooth scroll to #contacts
 * scrollToSection('about', { behavior: 'auto' }); // Instant scroll
 */
export function scrollToSection(targetId, options = {}) {
    // Default options
    const {
        behavior = 'smooth',
        block = 'start',
        focusTarget = false,
    } = options;

    // Find target section
    const targetSection = document.getElementById(targetId);

    if (!targetSection) {
        console.warn(`⚠️ Hero Button: Target section #${targetId} not found`);
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

    console.log(`✅ Hero Button: Scrolled to #${targetId} section`);
    return true;
}

/* ===================================
   🔘 HERO BUTTON INITIALIZATION
   =================================== */

/**
 * Initialize hero section button with smooth scroll functionality
 * Finds all buttons with [data-scroll-to] attribute and adds click handlers
 *
 * @returns {boolean} Success status
 *
 * @example
 * // In script.js:
 * import { initializeHeroButton } from './hero-button.js';
 * document.addEventListener('DOMContentLoaded', initializeHeroButton);
 */
export function initializeHeroButton() {
    // Find all hero buttons with scroll target
    const heroButtons = document.querySelectorAll(
        '.hero__button[data-scroll-to]'
    );

    if (heroButtons.length === 0) {
        console.warn(
            '⚠️ Hero Button: No buttons with [data-scroll-to] attribute found'
        );
        return false;
    }

    // Initialize each button
    heroButtons.forEach((button, index) => {
        const targetId = button.getAttribute('data-scroll-to');

        if (!targetId) {
            console.warn(
                `⚠️ Hero Button ${index + 1}: Empty data-scroll-to attribute`
            );
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
                behavior: 'smooth',
                block: 'start',
                focusTarget: false, // Set to true if you want to focus target section
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

        console.log(
            `✅ Hero Button ${index + 1}: Initialized (target: #${targetId})`
        );
    });

    console.log(`✅ Hero Button: ${heroButtons.length} button(s) initialized`);
    return true;
}

/* ===================================
   🧹 CLEANUP FUNCTION
   =================================== */

/**
 * Remove all hero button event listeners
 * Useful for SPAs or when dynamically removing hero section
 *
 * @returns {boolean} Success status
 *
 * @example
 * import { destroyHeroButton } from './hero-button.js';
 * destroyHeroButton(); // Clean up before component unmount
 */
export function destroyHeroButton() {
    const heroButtons = document.querySelectorAll(
        '.hero__button[data-scroll-to]'
    );

    if (heroButtons.length === 0) {
        console.warn('⚠️ Hero Button: No buttons to clean up');
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

        console.log(`🧹 Hero Button ${index + 1}: Cleaned up`);
    });

    console.log(`🧹 Hero Button: ${heroButtons.length} button(s) cleaned up`);
    return true;
}

/* ===================================
   🎨 CONFIGURATION OBJECT (OPTIONAL)
   =================================== */

/**
 * Hero button configuration object
 * Export this if you want to make behavior configurable
 */
export const heroButtonConfig = {
    // Scroll behavior
    scrollBehavior: 'smooth', // 'smooth' or 'auto'
    scrollBlock: 'start', // 'start', 'center', 'end', 'nearest'

    // Accessibility
    focusTargetAfterScroll: false, // Whether to focus target section

    // Animation timing
    scrollDuration: 800, // Approximate scroll duration (ms) - browser controlled

    // Debugging
    enableLogging: true, // Enable/disable console logging
};

/* ===================================
   🔧 DEBUG UTILITIES
   =================================== */

/**
 * Debug helper: Test scroll to any section
 * @param {string} sectionId - Target section ID
 */
export function debugScrollTo(sectionId) {
    console.log(`🔧 Debug: Testing scroll to #${sectionId}`);
    return scrollToSection(sectionId, {
        behavior: 'smooth',
        block: 'start',
        focusTarget: true,
    });
}

/**
 * Debug helper: List all available scroll targets
 */
export function debugListTargets() {
    const buttons = document.querySelectorAll('.hero__button[data-scroll-to]');
    console.log('🔧 Debug: Available hero button targets:');
    buttons.forEach((btn, i) => {
        const target = btn.getAttribute('data-scroll-to');
        const exists = document.getElementById(target) ? '✅' : '❌';
        console.log(`  ${i + 1}. ${exists} #${target}`);
    });
}

/* ================================================
   📊 USAGE EXAMPLES & TESTING
   ================================================

// Basic usage in script.js:
import { initializeHeroButton } from './hero-button.js';
document.addEventListener('DOMContentLoaded', initializeHeroButton);

// Advanced usage with cleanup:
import { initializeHeroButton, destroyHeroButton } from './hero-button.js';

// Initialize
document.addEventListener('DOMContentLoaded', initializeHeroButton);

// Cleanup before page unload (optional)
window.addEventListener('beforeunload', destroyHeroButton);

// Manual scroll from anywhere:
import { scrollToSection } from './hero-button.js';
scrollToSection('contacts'); // Scroll to contacts section

// Debug utilities:
import { debugScrollTo, debugListTargets } from './hero-button.js';
debugListTargets(); // See all available targets
debugScrollTo('about'); // Test scroll to about section

================================================ */

/*
🔧 CONSOLE TESTING COMMANDS
─────────────────────────────────────────────────

// Test scroll functionality:
import('./hero-button.js').then(module => {
    module.scrollToSection('contacts');
});

// List all targets:
import('./hero-button.js').then(module => {
    module.debugListTargets();
});

// Test specific section:
import('./hero-button.js').then(module => {
    module.debugScrollTo('about');
});

// Manual cleanup:
import('./hero-button.js').then(module => {
    module.destroyHeroButton();
});
*/
