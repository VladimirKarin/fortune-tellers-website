// ================================================
// 🧭 NAVIGATION MODULE - Mobile Menu Controller
// ================================================
//
// 📋 MODULE PURPOSE:
// Manages responsive mobile navigation menu with comprehensive accessibility
// features. Provides off-canvas slide-in panel with focus trap, scroll locking,
// and proper ARIA attribute management for screen readers.
//
// 🎬 USER INTERACTION FLOW:
// 1. User clicks hamburger menu button (mobile view)
// 2. Off-canvas menu slides in from side
// 3. Body scroll locked to prevent background scrolling
// 4. Focus trapped within menu for keyboard navigation
// 5. User navigates or closes menu (button, ESC key, or link click)
// 6. Menu slides out, scroll unlocked, focus restored
//
// 🔗 DEPENDENCIES:
// - HTML: .header container
// - HTML: .btn-mobile-nav toggle button
// - HTML: .nav-list navigation menu
// - CSS: .nav-open class for open state
// - CSS: .u-no-scroll utility class for body scroll lock
//
// 📦 FEATURES:
// - Off-canvas slide-in mobile menu
// - Focus trap for keyboard accessibility
// - Body scroll locking when menu open
// - ARIA attribute management
// - Automatic menu close on window resize (desktop view)
// - Auto-close when navigation link clicked
// - ESC key to close menu
// - Memory leak prevention with proper cleanup
//
// ♿ ACCESSIBILITY FEATURES:
// - aria-expanded on toggle button
// - aria-hidden on menu panel
// - Focus trap (Tab cycles within menu)
// - Focus restoration on close
// - Keyboard navigation (Tab, Shift+Tab, ESC)
// - Screen reader announcements
//
// ⚠️ IMPORTANT NOTES:
// - Initialized from script.js on DOMContentLoaded
// - Call destroyNav() before removing navigation from DOM
// - Desktop breakpoint: 991px (matches CSS)
// - Prevents double initialization automatically

/* ===================================
   📦 MODULE STATE MANAGEMENT
   =================================== */

/**
 * Internal state object
 * Tracks navigation elements, state, and event handlers
 *
 * @type {Object}
 * @private
 */
let state = {
    initialized: false, // Prevents double initialization
    headerEl: null, // .header element
    toggleBtn: null, // .btn-mobile-nav button
    navList: null, // .nav-list container
    previouslyFocused: null, // Element to restore focus to after closing
    onKeyDownHandler: null, // Stored keydown handler for cleanup
    _onToggle: null, // Stored toggle handler
    _onLinkClick: null, // Stored link click handler
    _onResize: null, // Stored resize handler
};

/* ===================================
   🎯 CONFIGURATION CONSTANTS
   =================================== */

/**
 * Focusable element selectors
 * Used for focus trap implementation
 *
 * @constant {string}
 */
const FOCUSABLE_SELECTORS =
    'a[href], button:not([disabled]), textarea, input[type="text"], ' +
    'input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])';

/**
 * Default desktop breakpoint
 * Menu auto-closes above this width
 *
 * @constant {number}
 * @default 991
 */
const DEFAULT_DESKTOP_BREAKPOINT = 991; // Matches CSS breakpoint

/* ===================================
   🔧 UTILITY FUNCTIONS
   =================================== */

/**
 * Get all focusable elements within a container
 *
 * Finds all interactive elements that can receive keyboard focus,
 * filtering out elements that are hidden or have zero dimensions.
 *
 * @param {HTMLElement} container - Container to search within
 * @returns {Array<HTMLElement>} Array of focusable elements
 *
 * @example
 * const focusable = getFocusableNodes(navList);
 * console.log('Found', focusable.length, 'focusable elements');
 *
 * @private
 */
function getFocusableNodes(container) {
    if (!container) return [];

    return Array.from(container.querySelectorAll(FOCUSABLE_SELECTORS)).filter(
        (el) =>
            el.offsetWidth > 0 ||
            el.offsetHeight > 0 ||
            el === document.activeElement
    );
}

/**
 * Check if all required elements exist
 *
 * @returns {boolean} True if all elements are present
 * @private
 */
function validateElements() {
    return !!(state.headerEl && state.toggleBtn && state.navList);
}

/**
 * Set default ARIA attributes if missing
 *
 * Ensures proper initial ARIA state for accessibility.
 * Sets aria-expanded="false" on toggle button and
 * aria-hidden="true" on navigation list.
 *
 * @returns {void}
 * @private
 */
function ensureAriaDefaults() {
    if (!state.toggleBtn.hasAttribute('aria-expanded')) {
        state.toggleBtn.setAttribute('aria-expanded', 'false');
    }
    if (!state.navList.hasAttribute('aria-hidden')) {
        state.navList.setAttribute('aria-hidden', 'true');
    }
}

/* ===================================
   🔒 SCROLL LOCKING FUNCTIONS
   =================================== */

/**
 * Lock body scroll when menu is open
 *
 * Prevents background scrolling on mobile devices when menu is active.
 * Adds utility class that sets overflow: hidden on html element.
 *
 * @returns {void}
 *
 * @example
 * lockBodyScroll(); // Prevents scrolling
 *
 * @private
 */
function lockBodyScroll() {
    document.documentElement.classList.add('u-no-scroll');
}

/**
 * Unlock body scroll when menu is closed
 *
 * Restores normal scrolling behavior by removing scroll lock class.
 *
 * @returns {void}
 *
 * @example
 * unlockBodyScroll(); // Restores scrolling
 *
 * @private
 */
function unlockBodyScroll() {
    document.documentElement.classList.remove('u-no-scroll');
}

/* ===================================
   🎭 MENU STATE MANAGEMENT
   =================================== */

/**
 * Open the mobile navigation menu
 *
 * Process:
 * 1. Store currently focused element for later restoration
 * 2. Add .nav-open class to trigger CSS animation
 * 3. Update ARIA attributes for screen readers
 * 4. Lock body scroll to prevent background scrolling
 * 5. Move focus to first focusable element in menu
 * 6. Set up keyboard event handler for focus trap and ESC key
 *
 * @returns {void}
 *
 * @example
 * openMenu(); // Opens mobile menu
 *
 * @private
 */
function openMenu() {
    if (!validateElements()) return;

    // Store currently focused element
    state.previouslyFocused = document.activeElement;

    // Update DOM classes and ARIA
    state.headerEl.classList.add('nav-open');
    state.toggleBtn.setAttribute('aria-expanded', 'true');
    state.navList.setAttribute('aria-hidden', 'false');

    // Lock body scroll
    lockBodyScroll();

    // Move focus to first focusable element in menu
    const nodes = getFocusableNodes(state.navList);
    if (nodes.length) {
        nodes[0].focus();
    } else {
        // No focusable elements, focus the list itself
        state.navList.setAttribute('tabindex', '-1');
        state.navList.focus();
    }

    // Set up keyboard event handler for focus trap and Escape key
    state.onKeyDownHandler = function (e) {
        // Close menu on Escape key
        if (e.key === 'Escape') {
            e.preventDefault();
            closeMenu();
            return;
        }

        // Trap Tab key within menu
        if (e.key === 'Tab') {
            const nodes = getFocusableNodes(state.navList);
            if (nodes.length === 0) {
                e.preventDefault();
                return;
            }

            const first = nodes[0];
            const last = nodes[nodes.length - 1];

            if (e.shiftKey) {
                // Shift+Tab: cycle backwards
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                // Tab: cycle forwards
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        }
    };

    document.addEventListener('keydown', state.onKeyDownHandler);

    console.log('✅ Mobile menu opened');
}

/**
 * Close the mobile navigation menu
 *
 * Process:
 * 1. Remove .nav-open class to trigger close animation
 * 2. Update ARIA attributes for screen readers
 * 3. Unlock body scroll
 * 4. Remove temporary tabindex if added
 * 5. Restore focus to previously focused element
 * 6. Remove keyboard event handler
 *
 * @returns {void}
 *
 * @example
 * closeMenu(); // Closes mobile menu
 *
 * @private
 */
function closeMenu() {
    if (!validateElements()) return;

    // Update DOM classes and ARIA
    state.headerEl.classList.remove('nav-open');
    state.toggleBtn.setAttribute('aria-expanded', 'false');
    state.navList.setAttribute('aria-hidden', 'true');

    // Unlock body scroll
    unlockBodyScroll();

    // Remove temporary tabindex if we added it
    if (state.navList.hasAttribute('tabindex')) {
        state.navList.removeAttribute('tabindex');
    }

    // Restore focus to previously focused element
    if (
        state.previouslyFocused &&
        typeof state.previouslyFocused.focus === 'function'
    ) {
        state.previouslyFocused.focus();
    } else {
        // Fallback to toggle button
        state.toggleBtn.focus();
    }

    // Remove keyboard event handler
    if (state.onKeyDownHandler) {
        document.removeEventListener('keydown', state.onKeyDownHandler);
        state.onKeyDownHandler = null;
    }

    console.log('✅ Mobile menu closed');
}

/**
 * Toggle menu open/closed state
 *
 * Checks current state via aria-expanded attribute and
 * calls appropriate open/close function.
 *
 * @returns {void}
 *
 * @example
 * toggleMenu(); // Opens if closed, closes if open
 *
 * @private
 */
function toggleMenu() {
    if (!state.toggleBtn) return;

    const isExpanded = state.toggleBtn.getAttribute('aria-expanded') === 'true';

    if (isExpanded) {
        closeMenu();
    } else {
        openMenu();
    }
}

/**
 * Close menu when navigation link is clicked
 *
 * Automatically closes menu after user clicks a navigation link,
 * allowing smooth transition to target section.
 *
 * @returns {void}
 * @private
 */
function onLinkClick() {
    if (state.headerEl && state.headerEl.classList.contains('nav-open')) {
        closeMenu();
    }
}

/* ===================================
   🚀 PUBLIC API - INITIALIZATION
   =================================== */

/**
 * Initialize navigation system
 *
 * Sets up event listeners, ARIA attributes, and responsive behavior.
 * Prevents double initialization and validates required elements exist.
 *
 * Process:
 * 1. Check if already initialized (prevent duplicates)
 * 2. Cache DOM element references
 * 3. Validate all required elements exist
 * 4. Set default ARIA attributes
 * 5. Attach toggle button click handler
 * 6. Attach navigation link click handlers
 * 7. Setup window resize handler
 * 8. Mark as initialized
 *
 * @param {Object} [options={}] - Configuration options
 * @param {number} [options.desktopBreakpoint=991] - Breakpoint above which menu auto-closes
 * @returns {boolean} True if initialized successfully, false if already initialized or elements missing
 *
 * @example
 * // Basic initialization
 * import { initNav } from './nav.js';
 * document.addEventListener('DOMContentLoaded', initNav);
 *
 * @example
 * // Custom breakpoint
 * initNav({ desktopBreakpoint: 1024 });
 *
 * @public
 */
export function initNav(options = {}) {
    // Prevent double initialization
    if (state.initialized) {
        console.warn('⚠️ Nav already initialized');
        return false;
    }

    // Cache DOM elements
    state.headerEl = document.querySelector('.header');
    state.toggleBtn = document.querySelector('.btn-mobile-nav');
    state.navList = document.querySelector('.nav-list');

    // Validate all elements exist
    if (!validateElements()) {
        console.warn(
            '⚠️ Nav initialization failed: missing header, toggle button, or nav list elements'
        );
        return false;
    }

    // Set default ARIA attributes
    ensureAriaDefaults();

    // Attach event handlers
    state._onToggle = toggleMenu;
    state.toggleBtn.addEventListener('click', state._onToggle);

    // Close menu when any link is clicked
    state._onLinkClick = onLinkClick;
    state.navList.querySelectorAll('a[href]').forEach((link) => {
        link.addEventListener('click', state._onLinkClick);
    });

    // Close menu on resize if window becomes desktop-sized
    const desktopBreakpoint =
        options.desktopBreakpoint || DEFAULT_DESKTOP_BREAKPOINT;
    state._onResize = () => {
        if (
            window.innerWidth > desktopBreakpoint &&
            state.headerEl.classList.contains('nav-open')
        ) {
            closeMenu();
        }
    };
    window.addEventListener('resize', state._onResize);

    // Mark as initialized
    state.initialized = true;

    console.log('✅ Navigation system initialized');
    return true;
}

/* ===================================
   🧹 PUBLIC API - CLEANUP
   =================================== */

/**
 * Clean up navigation system
 *
 * Removes all event listeners and resets state to prevent memory leaks.
 * Should be called before removing navigation from DOM or on page unload
 * in single-page applications.
 *
 * Process:
 * 1. Check if initialized
 * 2. Remove toggle button listener
 * 3. Remove all link click listeners
 * 4. Remove resize listener
 * 5. Ensure menu is closed
 * 6. Reset state object completely
 *
 * @returns {boolean} True if cleaned up successfully, false if not initialized
 *
 * @example
 * // Cleanup before component unmount
 * import { destroyNav } from './nav.js';
 * window.addEventListener('beforeunload', destroyNav);
 *
 * @example
 * // SPA navigation cleanup
 * function navigateAway() {
 *     destroyNav();
 *     loadNewPage();
 * }
 *
 * @public
 */
export function destroyNav() {
    if (!state.initialized) {
        console.warn('⚠️ Nav not initialized, nothing to destroy');
        return false;
    }

    // Remove toggle button listener
    if (state.toggleBtn && state._onToggle) {
        state.toggleBtn.removeEventListener('click', state._onToggle);
    }

    // Remove link click listeners
    if (state.navList && state._onLinkClick) {
        state.navList.querySelectorAll('a[href]').forEach((link) => {
            link.removeEventListener('click', state._onLinkClick);
        });
    }

    // Remove resize listener
    if (state._onResize) {
        window.removeEventListener('resize', state._onResize);
    }

    // Ensure menu is closed
    closeMenu();

    // Reset state object
    state = {
        initialized: false,
        headerEl: null,
        toggleBtn: null,
        navList: null,
        previouslyFocused: null,
        onKeyDownHandler: null,
        _onToggle: null,
        _onLinkClick: null,
        _onResize: null,
    };

    console.log('🧹 Navigation system destroyed');
    return true;
}

/* ================================================
   🔧 DEBUG UTILITIES - MOVE TO DEV FILE LATER
   ================================================
   
   📊 Console Testing Commands:
   Copy these to browser console for debugging
   
   ──────────────────────────────────────────────
   CHECK NAVIGATION STATE:
   ──────────────────────────────────────────────
   
   // View current navigation state
   function debugNavState() {
       const header = document.querySelector('.header');
       const isOpen = header?.classList.contains('nav-open');
       const ariaExpanded = document.querySelector('.btn-mobile-nav')?.getAttribute('aria-expanded');
       const hasScrollLock = document.documentElement.classList.contains('u-no-scroll');
       
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
   
   ──────────────────────────────────────────────
   MANUALLY CONTROL MENU:
   ──────────────────────────────────────────────
   
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
   
   ──────────────────────────────────────────────
   TEST FOCUS TRAP:
   ──────────────────────────────────────────────
   
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
   
   ──────────────────────────────────────────────
   TEST KEYBOARD NAVIGATION:
   ──────────────────────────────────────────────
   
   // Simulate ESC key press
   function testEscapeKey() {
       const event = new KeyboardEvent('keydown', { 
           key: 'Escape',
           bubbles: true 
       });
       
       document.dispatchEvent(event);
       console.log('⌨️ ESC key pressed');
   }
   
   // Simulate Tab key
   function testTabKey(shift = false) {
       const event = new KeyboardEvent('keydown', { 
           key: 'Tab',
           shiftKey: shift,
           bubbles: true 
       });
       
       document.dispatchEvent(event);
       console.log(`⌨️ ${shift ? 'Shift+' : ''}Tab key pressed`);
   }
   
   ──────────────────────────────────────────────
   TEST SCROLL LOCKING:
   ──────────────────────────────────────────────
   
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
   
   ──────────────────────────────────────────────
   TEST RESPONSIVE BEHAVIOR:
   ──────────────────────────────────────────────
   
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
   
   ──────────────────────────────────────────────
   CHECK ARIA ATTRIBUTES:
   ──────────────────────────────────────────────
   
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
   
   ──────────────────────────────────────────────
   TEST LINK CLICK BEHAVIOR:
   ──────────────────────────────────────────────
   
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
   
   ──────────────────────────────────────────────
   FULL DIAGNOSTIC:
   ──────────────────────────────────────────────
   
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
   
   ──────────────────────────────────────────────
   USAGE:
   ──────────────────────────────────────────────
   
   Copy and paste in browser console:
   
   fullNavDiagnostic()           // Complete diagnostic
   debugNavState()                // Check current state
   testToggleButton()             // Toggle menu
   testOpenMenu()                 // Open menu manually
   testCloseMenu()                // Close menu manually
   debugFocusableElements()       // List focusable items
   testFocusTrap()                // Test focus cycling
   testEscapeKey()                // Test ESC key
   testTabKey()                   // Test Tab key
   testTabKey(true)               // Test Shift+Tab
   debugScrollLock()              // Check scroll status
   testScrollLock()               // Test scroll lock
   testResize(1200)               // Simulate resize
   debugAriaAttributes()          // Check ARIA
   testLinkClick()                // Test link behavior
   
*/

/* ================================================
   📝 TECHNICAL DOCUMENTATION
   ================================================
   
   ──────────────────────────────────────────────
   FOCUS TRAP IMPLEMENTATION:
   ──────────────────────────────────────────────
   
   Focus trap keeps keyboard navigation within modal/menu:
   
   Algorithm:
   1. Get all focusable elements in menu
   2. Identify first and last focusable element
   3. On Tab press:
      - If on last element → move focus to first
   4. On Shift+Tab press:
      - If on first element → move focus to last
   
   Why trap focus?
   - Prevents tab-cycling outside menu
   - Users don't get lost in background content
   - Required by WCAG 2.1 (Level A)
   
   Implementation details:
   - Listen for 'keydown' (not 'keypress' or 'keyup')
   - Check e.shiftKey for Shift+Tab detection
   - Call e.preventDefault() to stop default tab behavior
   - Manually move focus with element.focus()
   
   Edge case handling:
   - If no focusable elements → focus menu container itself
   - Add tabindex="-1" temporarily to make container focusable
   - Remove tabindex on menu close
   
   ──────────────────────────────────────────────
   SCROLL LOCKING STRATEGY:
   ──────────────────────────────────────────────
   
   Why lock scroll?
   - Prevents jarring user experience on mobile
   - Background content shouldn't scroll when menu open
   - Maintains user's scroll position
   
   Implementation:
   - Add class to <html> element (not <body>)
   - CSS: html.u-no-scroll { overflow: hidden; }
   
   Why <html> instead of <body>?
   - More reliable across browsers
   - Body can still have scroll in some browsers
   - Html is the true viewport container
   
   Restoration:
   - Remove class when menu closes
   - Scroll position automatically restored by browser
   - No manual scroll calculation needed
   
   Mobile considerations:
   - iOS Safari: overflow: hidden sometimes ignored
   - Solution: position: fixed with calculated height
   - Or use third-party libraries like body-scroll-lock
   
   ──────────────────────────────────────────────
   ARIA ATTRIBUTE MANAGEMENT:
   ──────────────────────────────────────────────
   
   ARIA attributes for screen readers:
   
   aria-expanded (on toggle button):
   - "true": Menu is open
   - "false": Menu is closed
   - Screen readers announce state
   
   aria-hidden (on menu):
   - "true": Menu hidden from screen readers
   - "false": Menu visible to screen readers
   - Prevents accessing closed menu content
   
   aria-controls (optional):
   - Links button to menu it controls
   - Value should be menu's ID
   - Helps screen reader users understand relationship
   
   Why manage ARIA dynamically?
   - Static HTML doesn't reflect current state
   - Screen readers need live state updates
   - Improves navigation experience
   
   ──────────────────────────────────────────────
   MEMORY LEAK PREVENTION:
   ──────────────────────────────────────────────
   
   Event listeners can cause memory leaks:
   
   Problem:
   1. Add listener to DOM element
   2. Remove element from DOM
   3. Listener still in memory
   4. Element can't be garbage collected
   5. Memory usage grows over time
   
   Solution:
   1. Store listener references in state object
   2. Before element removal, call removeEventListener
   3. Pass exact same function reference
   4. Set references to null
   
   When to cleanup:
   - Before page navigation (SPAs)
   - Before component unmount (React, Vue, etc.)
   - On beforeunload event
   - When dynamically removing navigation
   
   Why store references?
   - Anonymous functions can't be removed
   - button.addEventListener('click', () => {})
    */
