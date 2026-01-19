// ================================================
// ✨ SCROLL ANIMATIONS MODULE - Viewport Reveal System
// ================================================
//
// 📋 MODULE PURPOSE:
// Provides scroll-triggered animations that reveal elements as they enter
// the viewport. Uses Intersection Observer API for performance-efficient
// detection of when elements become visible.
//
// 🎬 USER INTERACTION FLOW:
// 1. Page loads with elements initially invisible (CSS)
// 2. User scrolls down the page
// 3. When element enters viewport (15% visible)
// 4. Module adds 'is-visible' class to element
// 5. CSS transition/animation reveals the element
// 6. Observer stops watching (one-time reveal)
//
// 🔗 DEPENDENCIES:
// - Browser: IntersectionObserver API (modern browsers)
// - CSS: .is-visible class with animation/transition styles
// - CSS: .animate-on-scroll class marking animatable elements
//
// 📦 FEATURES:
// - Automatic element discovery and animation
// - Performance-optimized viewport detection
// - One-time animation (no re-trigger on scroll up)
// - Configurable visibility threshold
// - Auto-targets premium elements (service cards, footer, hero)
// - Zero configuration required
//
// 🎯 TARGETED ELEMENTS:
// - Elements with .animate-on-scroll class
// - All .service-card elements
// - All .footer-grid elements  
// - All direct children of .hero-content
//
// ⚠️ IMPORTANT NOTES:
// - Self-initializing on DOMContentLoaded
// - Threshold set to 15% for early animation start
// - Elements auto-unobserved after animation to save resources
// - No exports (standalone module)

/* ===================================
   🔑 CONFIGURATION
   =================================== */

/**
 * Intersection Observer threshold configuration
 * Determines how much of element must be visible to trigger animation
 * 
 * @constant {number}
 * @default 0.15
 * 
 * Values explained:
 * - 0.0 = Trigger immediately when any pixel is visible
 * - 0.15 = Trigger when 15% of element is visible (current)
 * - 0.5 = Trigger when 50% of element is visible
 * - 1.0 = Trigger only when entire element is visible
 */
const VISIBILITY_THRESHOLD = 0.15;

/* ===================================
   👁️ INTERSECTION OBSERVER SETUP
   =================================== */

/**
 * Initialize scroll animation system on DOM ready
 * 
 * Sets up Intersection Observer to watch for elements entering viewport
 * and applies animation classes when visibility threshold is met.
 * 
 * Process:
 * 1. Create observer with threshold configuration
 * 2. Find all elements to animate
 * 3. Start observing each element
 * 4. On intersection, add .is-visible class
 * 5. Stop observing element (one-time animation)
 * 
 * @listens DOMContentLoaded
 * @private
 */
document.addEventListener('DOMContentLoaded', () => {
    /**
     * Intersection Observer options
     * 
     * @type {Object}
     * @property {null} root - Use viewport as container
     * @property {string} rootMargin - No margin adjustment
     * @property {number} threshold - 15% visibility required
     */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: VISIBILITY_THRESHOLD
    };

    /**
     * Callback function executed when observed elements intersect viewport
     * 
     * Adds animation class to elements that enter viewport and stops
     * observing them to prevent re-animation and save resources.
     * 
     * @param {IntersectionObserverEntry[]} entries - Array of intersection changes
     * @param {IntersectionObserver} observer - Observer instance
     * @returns {void}
     * 
     * @callback IntersectionObserverCallback
     * @private
     */
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add class that triggers CSS animation
                entry.target.classList.add('is-visible');
                
                // Stop observing this element (one-time animation)
                // Improves performance by reducing number of observed elements
                observer.unobserve(entry.target); 
            }
        });
    };

    /**
     * Create Intersection Observer instance
     * Monitors elements for viewport intersection
     * 
     * @type {IntersectionObserver}
     */
    const observer = new IntersectionObserver(revealCallback, observerOptions);

    /**
     * Find all elements explicitly marked for animation
     * Elements with .animate-on-scroll class applied in HTML
     * 
     * @type {NodeList}
     */
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    /**
     * Find premium elements that should auto-animate
     * Service cards, footer grids, and hero content children
     * 
     * @type {NodeList}
     */
    const premiumElements = document.querySelectorAll('.service-card, .footer-grid, .hero-content > *');

    /**
     * Start observing all target elements
     * Combines manual and automatic animation targets
     */
    [...animatedElements, ...premiumElements].forEach(el => {
        if (el) {
            // Ensure class exists for CSS targeting
            el.classList.add('animate-on-scroll');
            
            // Start observing element
            observer.observe(el);
        }
    });
});
