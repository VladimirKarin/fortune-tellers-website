================================================
📝 TECHNICAL DOCUMENTATION
================================================

──────────────────────────────────────────────
ASTRONOMICAL CALCULATIONS:
──────────────────────────────────────────────

Lunar Cycle: 29.53058867 days (synodic month)

This is the time between two new moons, and it's the basis
for all moon phase calculations in this module.

Phase Boundaries (days since new moon):

-   New Moon: 0.00 - 1.84
-   Waxing Crescent: 1.84 - 7.38
-   First Quarter: 7.38 - 9.23
-   Waxing Gibbous: 9.23 - 14.77
-   Full Moon: 14.77 - 16.61
-   Waning Gibbous: 16.61 - 22.15
-   Last Quarter: 22.15 - 23.99
-   Waning Crescent: 23.99 - 29.53

Illumination Formula:
illumination = ((1 - cos(2π × cycleDay / 29.53)) / 2) × 100

This uses the cosine function to approximate the visible
illuminated portion of the moon based on its phase angle.

──────────────────────────────────────────────
REFERENCE DATE ACCURACY:
──────────────────────────────────────────────

The local calculation uses December 1, 2024 as a known
new moon reference date. Accuracy degrades over time due to:

1. Lunar cycle isn't exactly 29.53 days (slight variation)
2. Accumulated rounding errors over many cycles
3. Gravitational perturbations not accounted for

Recommendation: Update reference date annually for best accuracy

──────────────────────────────────────────────
API VS LOCAL CALCULATION:
──────────────────────────────────────────────

WeatherAPI (Primary):
✅ Real-time accurate data
✅ Professional astronomical calculations
✅ Includes precise illumination percentage
❌ Requires internet connection
❌ API key needed
❌ Rate limited (free tier)

Local Calculation (Fallback):
✅ Works offline
✅ No API key required
✅ No rate limits
✅ Fast (instant calculation)
❌ Less accurate over time
❌ Simplified phase boundaries
❌ Approximate illumination only

──────────────────────────────────────────────
DOM TRAVERSAL STRATEGY:
──────────────────────────────────────────────

Parent-Based Approach:

1. Query all .moon-section\_\_card elements
2. Select specific cards by index (cards[0], cards[1], etc.)
3. Find .moon-section\_\_card-text within each card

Benefits:

-   Less fragile than document.querySelectorAll()[index]
-   Clear parent-child relationship
-   Easier to debug when elements are missing
-   Consistent with semantic HTML structure

──────────────────────────────────────────────
ERROR HANDLING STRATEGY:
──────────────────────────────────────────────

Layered fallback approach:

1. Try API fetch
   ↓ If fails
2. Show specific error based on failure type
   ↓ Then
3. Fall back to local calculation
   ↓ If that fails
4. Show generic error message

Error Types:

-   API_KEY_ERROR: Invalid or expired API key
-   API_ERROR: Network or server error
-   PHASE_ERROR: Unknown phase returned by API
-   CALC_ERROR: Local calculation failed

──────────────────────────────────────────────
LOADING STATE UX:
──────────────────────────────────────────────

Minimum loading time (500ms) prevents "flash of loading":

Without minimum:

-   Fast connection → 50ms load → jarring flash

With minimum:

-   Fast connection → 500ms load → smooth transition
-   Slow connection → actual time → user aware of waiting

Trade-off: Slightly delays fast connections, but provides
better overall UX consistency.

──────────────────────────────────────────────
NETWORK MONITORING:
──────────────────────────────────────────────

Listens for browser online/offline events:

-   online event: Fired when connection restored
-   offline event: Fired when connection lost

Limitations:

-   Only detects browser-level network changes
-   Doesn't detect API server availability
-   Doesn't detect slow connections

Enhancement ideas:

-   Periodic API health checks
-   Timeout-based detection
-   Connection quality indicators

──────────────────────────────────────────────
BROWSER COMPATIBILITY:
──────────────────────────────────────────────

✅ fetch API: Chrome 42+, Firefox 39+, Safari 10.1+
✅ async/await: Chrome 55+, Firefox 52+, Safari 10.1+
✅ classList: IE10+, All modern browsers
✅ querySelector: IE8+, All modern browsers
✅ addEventListener: IE9+, All modern browsers
✅ navigator.onLine: IE4+, All browsers

For older browser support, consider:

-   fetch polyfill (github.com/github/fetch)
-   Babel transpilation for async/await

──────────────────────────────────────────────
PERFORMANCE CONSIDERATIONS:
──────────────────────────────────────────────

Optimization strategies:

1. Cached DOM selectors (query once, reuse)
2. Minimal DOM manipulations (batch updates)
3. Debounced network events (no spam)
4. Lazy image loading (fade-in on load)
5. Local calculation fallback (no blocking)

Performance metrics:

-   DOM query: ~1ms (one-time)
-   Local calculation: <1ms
-   API fetch: 50-500ms (network dependent)
-   UI update: <5ms

──────────────────────────────────────────────
FUTURE ENHANCEMENTS:
──────────────────────────────────────────────

Potential improvements:

1. Add more languages (English, German, etc.)
2. Implement caching (reduce API calls)
3. Add moon rise/set times
4. Show lunar events (eclipses, supermoons)
5. Historical moon phase lookup
6. Moon phase calendar view
7. Push notifications for phase changes
8. Personalized ritual recommendations
9. Integration with weather data
10. Augmented reality moon viewer
