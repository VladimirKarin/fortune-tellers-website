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

/* ================================================
   🔧 DEBUG UTILITIES - MOVE TO DEV FILE LATER
   ================================================
   
   📊 Console Testing Commands:
   Copy these to browser console for debugging
   
   ──────────────────────────────────────────────
   TEST SCROLL TO SECTION:
   ──────────────────────────────────────────────
   
   // Test scrolling to any section by ID
   function debugScrollTo(sectionId) {
       console.log(`🔧 Debug: Testing scroll to #${sectionId}`);
       const success = scrollToSection(sectionId, {
           behavior: 'smooth',
           block: 'start',
           focusTarget: true
       });
       
       if (success) {
           console.log('✅ Scroll completed successfully');
       } else {
           console.error('❌ Scroll failed - section not found');
       }
   }
   
   // Usage:
   debugScrollTo('contacts');
   debugScrollTo('about');
   debugScrollTo('services');
   
   ──────────────────────────────────────────────
   LIST ALL SCROLL TARGETS:
   ──────────────────────────────────────────────
   
   // Display all available hero button targets
   function debugListTargets() {
       const buttons = document.querySelectorAll('.hero__button[data-scroll-to]');
       
       console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
       console.log('🔧 HERO BUTTON TARGETS');
       console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
       console.log(`Found ${buttons.length} hero button(s)\n`);
       
       buttons.forEach((btn, i) => {
           const target = btn.getAttribute('data-scroll-to');
           const targetExists = document.getElementById(target);
           const status = targetExists ? '✅' : '❌';
           const buttonText = btn.textContent.trim();
           
           console.log(`Button ${i + 1}:`);
           console.log(`  Text: "${buttonText}"`);
           console.log(`  Target: #${target}`);
           console.log(`  Status: ${status} ${targetExists ? 'Found' : 'Missing'}`);
           console.log('');
       });
       
       console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
   }
   
   ──────────────────────────────────────────────
   TEST BUTTON FUNCTIONALITY:
   ──────────────────────────────────────────────
   
   // Simulate button click
   function testButtonClick(buttonIndex = 0) {
       const buttons = document.querySelectorAll('.hero__button[data-scroll-to]');
       const button = buttons[buttonIndex];
       
       if (!button) {
           console.error(`❌ Button ${buttonIndex} not found`);
           console.log(`Available buttons: 0-${buttons.length - 1}`);
           return;
       }
       
       console.log(`🧪 Testing button ${buttonIndex} click...`);
       const target = button.getAttribute('data-scroll-to');
       console.log(`Target: #${target}`);
       
       button.click();
       console.log('✅ Click event triggered');
   }
   
   // Usage:
   testButtonClick(0);  // Test first button
   testButtonClick(1);  // Test second button
   
   ──────────────────────────────────────────────
   TEST KEYBOARD NAVIGATION:
   ──────────────────────────────────────────────
   
   // Simulate keyboard events
   function testKeyboard(buttonIndex = 0, key = 'Enter') {
       const buttons = document.querySelectorAll('.hero__button[data-scroll-to]');
       const button = buttons[buttonIndex];
       
       if (!button) {
           console.error(`❌ Button ${buttonIndex} not found`);
           return;
       }
       
       console.log(`⌨️ Testing ${key} key on button ${buttonIndex}...`);
       
       const event = new KeyboardEvent('keydown', { 
           key: key,
           bubbles: true 
       });
       
       button.dispatchEvent(event);
       console.log('✅ Keyboard event triggered');
   }
   
   // Usage:
   testKeyboard(0, 'Enter');  // Test Enter key
   testKeyboard(0, ' ');      // Test Space key
   
   ──────────────────────────────────────────────
   TEST SCROLL OPTIONS:
   ──────────────────────────────────────────────
   
   // Test different scroll behaviors
   function testScrollBehavior(targetId) {
       console.log('🧪 Testing scroll behaviors:\n');
       
       // Test smooth scroll
       console.log('1️⃣ Testing smooth scroll...');
       scrollToSection(targetId, { behavior: 'smooth' });
       
       setTimeout(() => {
           // Test instant scroll
           console.log('2️⃣ Testing instant scroll...');
           scrollToSection(targetId, { behavior: 'auto' });
           
           setTimeout(() => {
               // Test with focus
               console.log('3️⃣ Testing scroll with focus...');
               scrollToSection(targetId, { 
                   behavior: 'smooth', 
                   focusTarget: true 
               });
           }, 1000);
       }, 2000);
   }
   
   // Usage:
   testScrollBehavior('contacts');
   
   ──────────────────────────────────────────────
   CHECK INITIALIZATION STATUS:
   ──────────────────────────────────────────────
   
   // Check if buttons are properly initialized
   function checkInitialization() {
       const buttons = document.querySelectorAll('.hero__button[data-scroll-to]');
       
       console.log('📦 Initialization Status:\n');
       
       buttons.forEach((btn, i) => {
           const hasClickHandler = !!btn._heroScrollHandler;
           const hasKeyHandler = !!btn._heroKeydownHandler;
           const target = btn.getAttribute('data-scroll-to');
           
           console.log(`Button ${i}:`);
           console.log(`  Target: #${target}`);
           console.log(`  Click handler: ${hasClickHandler ? '✅' : '❌'}`);
           console.log(`  Keyboard handler: ${hasKeyHandler ? '✅' : '❌'}`);
           console.log('');
       });
   }
   
   ──────────────────────────────────────────────
   TEST MULTIPLE BUTTONS:
   ──────────────────────────────────────────────
   
   // Test all buttons sequentially
   function testAllButtons() {
       const buttons = document.querySelectorAll('.hero__button[data-scroll-to]');
       
       console.log(`🧪 Testing ${buttons.length} buttons sequentially...\n`);
       
       buttons.forEach((btn, i) => {
           setTimeout(() => {
               const target = btn.getAttribute('data-scroll-to');
               console.log(`${i + 1}. Scrolling to #${target}...`);
               btn.click();
           }, i * 3000); // 3 second delay between each
       });
   }
   
   ──────────────────────────────────────────────
   VIEW CONFIGURATION:
   ──────────────────────────────────────────────
   
   // Display current configuration
   function viewConfig() {
       console.log('⚙️ Hero Button Configuration:');
       console.table(heroButtonConfig);
   }
   
   ──────────────────────────────────────────────
   MODIFY CONFIGURATION:
   ──────────────────────────────────────────────
   
   // Change configuration dynamically
   function setConfig(key, value) {
       if (key in heroButtonConfig) {
           const oldValue = heroButtonConfig[key];
           heroButtonConfig[key] = value;
           console.log(`✅ Config updated:`);
           console.log(`  ${key}: ${oldValue} → ${value}`);
       } else {
           console.error(`❌ Invalid config key: ${key}`);
           console.log('Available keys:', Object.keys(heroButtonConfig));
       }
   }
   
   // Usage:
   setConfig('scrollBehavior', 'auto');
   setConfig('focusTargetAfterScroll', true);
   setConfig('enableLogging', false);
   
   ──────────────────────────────────────────────
   FULL DIAGNOSTIC:
   ──────────────────────────────────────────────
   
   // Run complete diagnostic
   function fullHeroDiagnostic() {
       console.log('🔍 RUNNING FULL HERO BUTTON DIAGNOSTIC');
       console.log('═══════════════════════════════════════\n');
       
       debugListTargets();
       console.log('\n───────────────────────────────────────\n');
       
       checkInitialization();
       console.log('\n───────────────────────────────────────\n');
       
       viewConfig();
       
       console.log('\n═══════════════════════════════════════');
       console.log('✅ DIAGNOSTIC COMPLETE');
   }
   
   ──────────────────────────────────────────────
   USAGE:
   ──────────────────────────────────────────────
   
   Copy and paste in browser console:
   
   fullHeroDiagnostic()              // Complete diagnostic
   debugListTargets()                // List all targets
   debugScrollTo('contacts')         // Test scroll
   testButtonClick(0)                // Test button click
   testKeyboard(0, 'Enter')          // Test keyboard
   testScrollBehavior('contacts')    // Test behaviors
   checkInitialization()             // Check init status
   testAllButtons()                  // Test all buttons
   viewConfig()                      // View configuration
   setConfig('scrollBehavior', 'auto')  // Change config
   
*/

/* ================================================
   📝 TECHNICAL DOCUMENTATION
   ================================================
   
   ──────────────────────────────────────────────
   SCROLLINTOVIEW API:
   ──────────────────────────────────────────────
   
   Modern browser API for smooth scrolling to elements.
   
   Syntax:
   element.scrollIntoView(options)
   
   Options:
   - behavior: 'smooth' | 'auto'
     - 'smooth': Animated scroll
     - 'auto': Instant jump
   
   - block: 'start' | 'center' | 'end' | 'nearest'
     - 'start': Align top of element with viewport top
     - 'center': Center element in viewport
     - 'end': Align bottom of element with viewport bottom
     - 'nearest': Minimal scroll to make element visible
   
   - inline: 'start' | 'center' | 'end' | 'nearest'
     - Horizontal alignment (rarely used)
   
   Browser Support:
   ✅ Chrome 61+
   ✅ Firefox 36+
   ✅ Safari 14+
   ✅ Edge 79+
   ❌ IE (all versions)
   
   Fallback for old browsers:
   element.scrollIntoView(); // Basic scroll without animation
   
   ──────────────────────────────────────────────
   FOCUS MANAGEMENT STRATEGY:
   ──────────────────────────────────────────────
   
   Focus management improves accessibility for keyboard users:
   
   Process:
   1. Add tabindex="-1" to target section
      - Makes section focusable programmatically
      - Doesn't add to natural tab order
   
   2. Call focus() on target section
      - Moves keyboard focus to section
      - Screen readers announce section
   
   3. Listen for blur event (focus loss)
      - Remove tabindex when focus moves away
      - Restore natural tab order
      - Use { once: true } for automatic cleanup
   
   Benefits:
   ✅ Screen reader users hear section announcement
   ✅ Keyboard users can continue tabbing from target
   ✅ Natural tab order preserved
   ✅ No permanent DOM changes
   
   Trade-off:
   - Adds slight complexity
   - Can be disorienting if overused
   - Consider user feedback before enabling by default
   
   ──────────────────────────────────────────────
   EVENT HANDLER STORAGE:
   ──────────────────────────────────────────────
   
   Why store handler references on button elements?
   
   Problem:
   - Anonymous functions can't be removed later
   - addEventListener(click, () => {...})
   - removeEventListener won't work without function reference
   
   Solution:
   - Store named functions on element properties
   - button._heroScrollHandler = handleClick;
   - Later: removeEventListener(click, button._heroScrollHandler)
   
   Benefits:
   ✅ Enables proper cleanup
   ✅ Prevents memory leaks
   ✅ Required for SPA lifecycle management
   
   Note:
   - Underscore prefix (_) indicates "private" property
   - Not a built-in feature, just convention
   - Properties are public but signal internal use
   
   ──────────────────────────────────────────────
   KEYBOARD ACCESSIBILITY:
   ──────────────────────────────────────────────
   
   Supporting keyboard navigation:
   
   Standard keys for button activation:
   - Enter key: Primary button activation
   - Space key: Alternative button activation
   
   Why both?
   - Different user preferences
   - Some assistive tech uses one or the other
   - WCAG 2.1 requires both
   
   Implementation:
   if (event.key === 'Enter' || event.key === ' ') {
       event.preventDefault(); // Prevent space from scrolling page
       // Trigger action
   }
   
   Important: preventDefault() for Space
   - Space normally scrolls page down
   - We want it to activate button instead
   - Enter doesn't need preventDefault (no default scroll)
   
   ──────────────────────────────────────────────
   MEMORY LEAK PREVENTION:
   ──────────────────────────────────────────────
   
   Event listeners can cause memory leaks:
   
   Scenario:
   1. Add event listener to button
   2. Remove button from DOM
   3. Listener still in memory (not garbage collected)
   4. Button can't be freed (referenced by listener)
   
   Prevention:
   1. Store listener references
   2. Call removeEventListener before DOM removal
   3. Delete reference: delete button._handler
   
   When to cleanup:
   - Before page navigation (SPAs)
   - Before component unmount (React, Vue, etc.)
   - Before dynamic content replacement
   - On beforeunload event
   
   ──────────────────────────────────────────────
   CONFIGURATION PATTERN:
   ──────────────────────────────────────────────
   
   Exported configuration object benefits:
   
   1. Runtime modification:
      - Change behavior without reloading
      - Useful for A/B testing
      - Easy debugging
   
   2. Centralized settings:
      - All options in one place
      - Easy to document
      - Type hints via JSDoc
   
   3. External access:
      - Other modules can read config
      - Analytics can track settings
      - Admin panels can modify
   
   Example usage:
   import { heroButtonConfig } from './hero-button.js';
   heroButtonConfig.scrollBehavior = 'auto';
   heroButtonConfig.enableLogging = false;
   
   ──────────────────────────────────────────────
   BROWSER COMPATIBILITY:
   ──────────────────────────────────────────────
   
   ✅ scrollIntoView:      IE6+, All browsers (basic)
   ✅ scrollIntoView({...}): Chrome 61+, Firefox 36+, Safari 14+
   ✅ getAttribute:        All browsers
   ✅ querySelectorAll:    IE8+, All browsers
   ✅ addEventListener:    IE9+, All browsers
   ✅ Arrow functions:     IE: NO, Modern browsers: YES
   ✅ KeyboardEvent:       IE9+, All browsers
   
   For IE11 support:
   - Transpile arrow functions
   - Use basic scrollIntoView() without options
   - Polyfill smooth scroll behavior
   
   ──────────────────────────────────────────────
   FUTURE ENHANCEMENTS:
   ──────────────────────────────────────────────
   
   Potential improvements:
   
   1. Scroll offset support:
      - Account for fixed headers
      - Configurable offset value
      - Different offsets per target
   
   2. Scroll callbacks:
      - onScrollStart callback
      - onScrollEnd callback
      - Track analytics events
   
   3. Animation customization:
      - Custom easing functions
      - Variable scroll duration
      - CSS animation integration
   
   4. Multiple button types:
      - Support different button classes
      - Generic data-scroll implementation
      - Work with links (<a> tags)
   
   5. Progress indication:
      - Show scroll progress
      - Estimated time remaining
      - Visual feedback during scroll
   
   6. History API integration:
      - Update URL hash on scroll
      - Browser back/forward support
      - Deep linking to sections
   
*/
