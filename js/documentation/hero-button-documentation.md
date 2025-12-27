================================================
📝 TECHNICAL DOCUMENTATION
================================================

──────────────────────────────────────────────
SCROLLINTOVIEW API:
──────────────────────────────────────────────

Modern browser API for smooth scrolling to elements.

Syntax:
element.scrollIntoView(options)

Options:

-   behavior: 'smooth' | 'auto'

    -   'smooth': Animated scroll
    -   'auto': Instant jump

-   block: 'start' | 'center' | 'end' | 'nearest'

    -   'start': Align top of element with viewport top
    -   'center': Center element in viewport
    -   'end': Align bottom of element with viewport bottom
    -   'nearest': Minimal scroll to make element visible

-   inline: 'start' | 'center' | 'end' | 'nearest'
    -   Horizontal alignment (rarely used)

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

-   Adds slight complexity
-   Can be disorienting if overused
-   Consider user feedback before enabling by default

──────────────────────────────────────────────
EVENT HANDLER STORAGE:
──────────────────────────────────────────────

Why store handler references on button elements?

Problem:

-   Anonymous functions can't be removed later
-   addEventListener(click, () => {...})
-   removeEventListener won't work without function reference

Solution:

-   Store named functions on element properties
-   button.\_heroScrollHandler = handleClick;
-   Later: removeEventListener(click, button.\_heroScrollHandler)

Benefits:
✅ Enables proper cleanup
✅ Prevents memory leaks
✅ Required for SPA lifecycle management

Note:

-   Underscore prefix (\_) indicates "private" property
-   Not a built-in feature, just convention
-   Properties are public but signal internal use

──────────────────────────────────────────────
KEYBOARD ACCESSIBILITY:
──────────────────────────────────────────────

Supporting keyboard navigation:

Standard keys for button activation:

-   Enter key: Primary button activation
-   Space key: Alternative button activation

Why both?

-   Different user preferences
-   Some assistive tech uses one or the other
-   WCAG 2.1 requires both

Implementation:
if (event.key === 'Enter' || event.key === ' ') {
event.preventDefault(); // Prevent space from scrolling page
// Trigger action
}

Important: preventDefault() for Space

-   Space normally scrolls page down
-   We want it to activate button instead
-   Enter doesn't need preventDefault (no default scroll)

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
3. Delete reference: delete button.\_handler

When to cleanup:

-   Before page navigation (SPAs)
-   Before component unmount (React, Vue, etc.)
-   Before dynamic content replacement
-   On beforeunload event

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

✅ scrollIntoView: IE6+, All browsers (basic)
✅ scrollIntoView({...}): Chrome 61+, Firefox 36+, Safari 14+
✅ getAttribute: All browsers
✅ querySelectorAll: IE8+, All browsers
✅ addEventListener: IE9+, All browsers
✅ Arrow functions: IE: NO, Modern browsers: YES
✅ KeyboardEvent: IE9+, All browsers

For IE11 support:

-   Transpile arrow functions
-   Use basic scrollIntoView() without options
-   Polyfill smooth scroll behavior

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
