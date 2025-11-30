/* ================================================
   🧭 NAVIGATION MODULE - Mobile Menu Controller
   ================================================
   
   📋 MODULE PURPOSE:
   Manages mobile navigation menu with accessibility features including:
   - Off-canvas slide-in panel
   - Focus trap for keyboard navigation
   - Body scroll locking when menu is open
   - ARIA attribute management
   - Proper cleanup for memory leak prevention
   
   🔗 USAGE:
   import { initNav, destroyNav } from './nav.js';
   
   // Initialize on DOM ready
   document.addEventListener('DOMContentLoaded', initNav);
   
   // Optional cleanup
   window.addEventListener('beforeunload', destroyNav);
   
   📦 EXPORTS:
   - initNav(options): Initialize navigation system
   - destroyNav(): Clean up event listeners and state
*/

/* ===================================
   📦 MODULE STATE MANAGEMENT
   =================================== */

/**
 * Internal state object
 * Tracks navigation elements, state, and event handlers
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
 * @constant
 */
const FOCUSABLE_SELECTORS =
    'a[href], button:not([disabled]), textarea, input[type="text"], ' +
    'input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])';

/**
 * Default desktop breakpoint
 * Menu auto-closes above this width
 * @constant
 */
const DEFAULT_DESKTOP_BREAKPOINT = 991; // Matches CSS breakpoint

/* ===================================
   🔧 UTILITY FUNCTIONS
   =================================== */

/**
 * Get all focusable elements within a container
 * @param {HTMLElement} container - Container to search within
 * @returns {Array<HTMLElement>} Array of focusable elements
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
 * @returns {boolean} True if all elements are present
 * @private
 */
function validateElements() {
    return !!(state.headerEl && state.toggleBtn && state.navList);
}

/**
 * Set default ARIA attributes if missing
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
 * Prevents background scrolling on mobile
 * @private
 */
function lockBodyScroll() {
    document.documentElement.classList.add('u-no-scroll');
}

/**
 * Unlock body scroll when menu is closed
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
 * - Adds .nav-open class for CSS animation
 * - Updates ARIA attributes
 * - Locks body scroll
 * - Sets up focus trap
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
 * - Removes .nav-open class
 * - Updates ARIA attributes
 * - Unlocks body scroll
 * - Restores focus to previous element
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
 * Allows user to navigate while menu automatically closes
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
 * Sets up event listeners, ARIA attributes, and responsive behavior
 *
 * @param {Object} options - Configuration options
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
 * Removes all event listeners and resets state
 * Prevents memory leaks when navigation is destroyed
 *
 * @returns {boolean} True if cleaned up successfully, false if not initialized
 *
 * @example
 * import { destroyNav } from './nav.js';
 * window.addEventListener('beforeunload', destroyNav);
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
🔧 DEBUG UTILITIES
Copy these functions to browser console for testing:
*/
/*
📊 Check Navigation State:
────────────────────────────────────────────────
function debugNavState() {
const header = document.querySelector('.header');
const isOpen = header?.classList.contains('nav-open');
const ariaExpanded = document.querySelector('.btn-mobile-nav')?.getAttribute('aria-expanded');
const hasScrollLock = document.documentElement.classList.contains('u-no-scroll');
console.log('📱 Navigation State:', {
    'Menu Open': isOpen,
    'ARIA Expanded': ariaExpanded,
    'Scroll Locked': hasScrollLock,
    'Window Width': window.innerWidth,
    'Mobile Breakpoint': window.innerWidth <= 991
});
}
debugNavState();
*/
/*
🎭 Manually Control Menu:
────────────────────────────────────────────────
// Open menu
document.querySelector('.header').classList.add('nav-open');
document.documentElement.classList.add('u-no-scroll');
// Close menu
document.querySelector('.header').classList.remove('nav-open');
document.documentElement.classList.remove('u-no-scroll');
// Toggle menu
document.querySelector('.btn-mobile-nav').click();
*/
/*
🔍 Test Focus Trap:
────────────────────────────────────────────────
// Open menu and try tabbing through links
// Focus should loop from last link back to first
// Shift+Tab should loop from first to last
// Escape key should close menu
*/
