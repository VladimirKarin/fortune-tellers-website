================================================
📝 TECHNICAL NOTES
================================================

──────────────────────────────────────────────
PROGRESSIVE ENHANCEMENT:
──────────────────────────────────────────────

This module is built with progressive enhancement:

1. Base functionality (works without JS):

    - Language buttons are <a> tags with href
    - Clicking navigates even if JS fails

2. Enhanced functionality (with JS):

    - Saves preference to localStorage
    - Auto-redirects returning users
    - Shows loading animation

3. Graceful degradation:
    - localStorage unavailable? Still works, just no persistence
    - JavaScript disabled? Links still navigate
    - Stars container missing? No stars, but page still functions

──────────────────────────────────────────────
BROWSER COMPATIBILITY:
──────────────────────────────────────────────

✅ localStorage: IE8+, All modern browsers
✅ querySelector: IE8+, All modern browsers
✅ addEventListener: IE9+, All modern browsers
✅ dataset: IE11+, All modern browsers
✅ Arrow functions: IE11: NO, Modern browsers: YES

For IE11 support, transpile with Babel or use function expressions.

──────────────────────────────────────────────
SECURITY CONSIDERATIONS:
──────────────────────────────────────────────

1. localStorage is domain-specific:

    - Only accessible from same origin
    - Not shared across subdomains by default
    - Secure from XSS if no user input is stored

2. Language validation:

    - Only 'ru' and 'lt' are accepted
    - Invalid values are rejected
    - Prevents injection attacks

3. Progressive enhancement:
    - Href-based navigation works without JS
    - No client-side routing vulnerabilities

──────────────────────────────────────────────
PERFORMANCE NOTES:
──────────────────────────────────────────────

-   Star generation: ~50 DOM operations (acceptable for landing page)
-   localStorage: Synchronous but very fast (~1ms)
-   Auto-redirect: 500ms delay for UX, not performance
-   No external dependencies: Fast initial load

──────────────────────────────────────────────
ACCESSIBILITY NOTES:
──────────────────────────────────────────────

Current implementation:
✅ Semantic HTML (<a> tags for navigation)
✅ Works with keyboard (Tab + Enter)
✅ Works with screen readers (meaningful link text)

Potential improvements:

-   Add aria-label to language buttons
-   Add lang attribute to buttons
-   Add role="navigation" to container
-   Announce auto-redirect to screen readers

──────────────────────────────────────────────
FUTURE ENHANCEMENTS:
──────────────────────────────────────────────

Possible improvements for future versions:

1. Add more languages:

    - Extend VALID_LANGUAGES array
    - Add corresponding folders
    - Update button HTML

2. Browser language detection:

    - Check navigator.language
    - Auto-select matching language
    - Still allow manual override

3. Cookie fallback:

    - Use cookies if localStorage unavailable
    - Longer persistence (localStorage can be cleared)
    - Server-side language detection support

4. URL parameter override:

    - ?lang=ru forces Russian
    - Useful for sharing specific language links
    - Override saved preference temporarily

5. Transition animations:
    - Fade out on selection
    - Slide animation between pages
    - Loading spinner while navigating
