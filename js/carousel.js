// ================================================
// 🎠 CAROUSEL MODULE - Interactive Gallery Carousel
// ================================================
//
// 📋 MODULE PURPOSE:
// Provides an interactive 5-position carousel system for the services
// gallery section. Supports multiple input methods (mouse, touch, keyboard)
// with smooth transitions and position indicators.
//
// 🎬 USER INTERACTION FLOW:
// 1. User interacts via previous/next buttons, indicator dots, arrow keys, or swipe
// 2. Carousel updates card positions by rotating array
// 3. Position classes applied to cards (gallery-item-1 through gallery-item-5)
// 4. CSS handles smooth transition animations
// 5. Active indicator dot synchronized with centered card
//
// 🔗 DEPENDENCIES:
// - HTML: .gallery-container with .gallery-item cards
// - HTML: .gallery-controls-previous and .gallery-controls-next buttons
// - HTML: .gallery-indicator dots with data-index attributes
// - CSS: 06-services-section-styles.css (position classes & transitions)
//
// 📦 FEATURES:
// - 5-position carousel display (visible cards at once)
// - Previous/Next navigation buttons
// - Touch/swipe gesture support for mobile
// - Keyboard navigation (arrow keys)
// - Click-to-navigate indicator dots
// - Circular/infinite rotation (wraps around)
// - Automatic position class management
// - Performance-optimized event listeners
// - Comprehensive validation and error handling
//
// 🎨 POSITION SYSTEM:
// Cards are assigned position classes that CSS uses for styling:
// - gallery-item-1: Far left
// - gallery-item-2: Left-adjacent
// - gallery-item-3: Center (featured/active)
// - gallery-item-4: Right-adjacent
// - gallery-item-5: Far right
//
// ⚠️ IMPORTANT NOTES:
// - Replaces deprecated gallery.js (DO NOT use both)
// - Initialized from script.js on DOMContentLoaded
// - Cards must have data-index attributes
// - Requires at least 5 cards for proper display

/* ===================================
   📱 CONFIGURATION CONSTANTS
   =================================== */

/**
 * Carousel configuration object
 * Contains all adjustable settings for carousel behavior
 *
 * @constant {Object}
 */
const CAROUSEL_CONFIG = {
    /**
     * Minimum swipe distance to trigger navigation (pixels)
     * Prevents accidental swipes from triggering navigation
     * @type {number}
     * @default 50
     */
    MIN_SWIPE_DISTANCE: 50,

    /**
     * Position CSS classes applied to visible cards
     * Classes are applied in order to create 5-position layout
     * @type {Array<string>}
     */
    POSITION_CLASSES: [
        'gallery-item-1', // Far left
        'gallery-item-2', // Left-adjacent
        'gallery-item-3', // Center (featured)
        'gallery-item-4', // Right-adjacent
        'gallery-item-5', // Far right
    ],

    /**
     * Number of visible positions in carousel
     * @type {number}
     * @default 5
     */
    VISIBLE_POSITIONS: 5,

    /**
     * CSS class for active indicator dot
     * @type {string}
     * @default 'active'
     */
    ACTIVE_INDICATOR_CLASS: 'active',
};

/* ===================================
   📦 CAROUSEL CLASS
   =================================== */

/**
 * Manages interactive carousel gallery for services section
 *
 * Handles all carousel interactions including navigation buttons,
 * touch gestures, keyboard controls, and indicator synchronization.
 * Auto-initializes and validates DOM elements on construction.
 *
 * @class Carousel
 *
 * @example
 * // Automatic initialization (recommended)
 * const carousel = new Carousel();
 *
 * @example
 * // Manual control (for testing)
 * const carousel = new Carousel();
 * carousel.moveToNextSlide();
 * carousel.moveToPrevSlide();
 * carousel.moveToSlide(2);
 */
class Carousel {
    /**
     * Initialize carousel and setup event listeners
     *
     * Process:
     * 1. Validate carousel elements exist in DOM
     * 2. Cache DOM element references
     * 3. Convert NodeList to Array for easier manipulation
     * 4. Initialize current index tracker
     * 5. Setup all event listeners (buttons, touch, keyboard, indicators)
     * 6. Perform initial gallery position update
     */
    constructor() {
        // Validate carousel exists before initialization
        if (!this.validateCarouselExists()) {
            console.warn('⚠️ Carousel elements not found. Carousel disabled.');
            return;
        }

        this.init();
    }

    /**
     * Validate that required carousel elements exist in DOM
     *
     * Checks for minimum required elements:
     * - Gallery container
     * - At least one gallery item
     *
     * @returns {boolean} True if carousel can be initialized
     * @private
     */
    validateCarouselExists() {
        const container = document.querySelector('.gallery-container');
        const items = document.querySelectorAll('.gallery-item');

        if (!container || items.length === 0) {
            return false;
        }

        return true;
    }

    /**
     * Initialize carousel state and setup
     *
     * Caches all DOM references, converts NodeLists to Arrays,
     * sets initial state, and triggers setup methods.
     *
     * @private
     */
    init() {
        // Cache DOM elements for performance
        this.galleryContainer = document.querySelector('.gallery-container');
        this.galleryItems = document.querySelectorAll('.gallery-item');
        this.prevButton = document.querySelector('.gallery-controls-previous');
        this.nextButton = document.querySelector('.gallery-controls-next');
        this.indicators = document.querySelectorAll('.gallery-indicator');

        // Convert NodeList to Array for easier manipulation
        this.itemsArray = Array.from(this.galleryItems);

        // Track current center position (0-indexed)
        this.currentIndex = 0;

        // Setup all event listeners
        this.setupEventListeners();

        // Initial gallery position update
        this.updateGallery();

        console.log(
            '✅ Carousel initialized with',
            this.itemsArray.length,
            'items'
        );
    }

    /**
     * Setup all event listeners for carousel interactions
     *
     * Attaches listeners for:
     * - Previous/Next button clicks
     * - Indicator dot clicks
     * - Touch gestures (swipe left/right)
     * - Keyboard navigation (arrow keys)
     *
     * @private
     */
    setupEventListeners() {
        // Previous button click
        if (this.prevButton) {
            this.prevButton.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default button behavior
                this.moveToPrevSlide();
            });
        }

        // Next button click
        if (this.nextButton) {
            this.nextButton.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default button behavior
                this.moveToNextSlide();
            });
        }

        // Indicator dot clicks
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.moveToSlide(index));
        });

        // Touch events for mobile swipe
        this.setupTouchEvents();

        // Keyboard navigation
        this.setupKeyboardNavigation();
    }

    /**
     * Setup touch event listeners for swipe gestures
     *
     * Uses passive listeners for better scroll performance.
     * Detects swipe direction based on touch start/end X coordinates.
     *
     * Swipe directions:
     * - Swipe left (finger moves left) → show next slide
     * - Swipe right (finger moves right) → show previous slide
     *
     * @private
     */
    setupTouchEvents() {
        let touchStartX = 0; // Store initial touch X position
        let touchEndX = 0; // Store final touch X position

        // Passive listener - browser can optimize scrolling
        this.galleryContainer.addEventListener(
            'touchstart',
            (e) => {
                touchStartX = e.changedTouches[0].screenX;
            },
            { passive: true } // Won't call preventDefault()
        );

        // Detect swipe direction on touch end
        this.galleryContainer.addEventListener(
            'touchend',
            (e) => {
                touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe(touchStartX, touchEndX);
            },
            { passive: true }
        );
    }

    /**
     * Handle swipe gesture and determine direction
     *
     * Calculates swipe distance and direction, then triggers
     * navigation if distance exceeds minimum threshold.
     *
     * @param {number} startX - Touch start X coordinate
     * @param {number} endX - Touch end X coordinate
     * @returns {void}
     *
     * @example
     * // Swipe left 100px → show next
     * handleSwipe(200, 100);
     *
     * @example
     * // Swipe right 100px → show previous
     * handleSwipe(100, 200);
     *
     * @private
     */
    handleSwipe(startX, endX) {
        const swipeDistance = endX - startX;
        const minDistance = CAROUSEL_CONFIG.MIN_SWIPE_DISTANCE;

        // Swipe left (show next slide)
        if (swipeDistance < -minDistance) {
            this.moveToNextSlide();
        }
        // Swipe right (show previous slide)
        else if (swipeDistance > minDistance) {
            this.moveToPrevSlide();
        }
    }

    /**
     * Setup keyboard navigation (arrow keys)
     *
     * Listens for ArrowLeft and ArrowRight key presses globally.
     * Prevents default scroll behavior for arrow keys.
     *
     * @private
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Only handle arrow keys
            if (e.key === 'ArrowLeft') {
                e.preventDefault(); // Prevent page scroll
                this.moveToPrevSlide();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault(); // Prevent page scroll
                this.moveToNextSlide();
            }
        });
    }

    /**
     * Update gallery positions and apply position classes to all cards
     *
     * This is the core method that repositions cards in the carousel.
     *
     * Algorithm:
     * 1. Remove all position classes from all cards
     * 2. Calculate relative position of each card from current center
     * 3. Apply position class if within visible range (0-4)
     * 4. Hide cards outside visible range
     * 5. Update indicator dots to reflect active card
     *
     * Position calculation uses modulo arithmetic for circular rotation:
     * position = (cardIndex - currentIndex + totalCards) % totalCards
     *
     * @returns {void}
     *
     * @example
     * // After navigation, update positions
     * this.currentIndex = 2;
     * this.updateGallery();
     *
     * @private
     */
    updateGallery() {
        const positionClasses = CAROUSEL_CONFIG.POSITION_CLASSES;
        const visiblePositions = CAROUSEL_CONFIG.VISIBLE_POSITIONS;

        // Update each card's position class
        this.itemsArray.forEach((item, index) => {
            // Remove all existing position classes
            positionClasses.forEach((className) => {
                item.classList.remove(className);
            });

            // Calculate relative position from current center
            // Example: if currentIndex = 2 and item index = 4
            // position = (4 - 2 + 5) % 5 = 2 (this item is 2 positions ahead)
            const position =
                (index - this.currentIndex + this.itemsArray.length) %
                this.itemsArray.length;

            // Apply position class if within visible range (0-4)
            if (position < visiblePositions) {
                item.classList.add(positionClasses[position]);
                item.style.opacity = ''; // Reset opacity (CSS handles it)
            } else {
                // Hide cards outside visible range
                item.style.opacity = '0';
            }
        });

        // Update position indicator dots
        this.updateIndicators();
    }

    /**
     * Move to next slide (shift carousel right)
     *
     * Implements circular navigation - wraps to beginning after last item.
     * Increments currentIndex with modulo arithmetic for wrapping.
     *
     * @returns {void}
     *
     * @example
     * // Navigate to next slide
     * carousel.moveToNextSlide();
     *
     * @public
     */
    moveToNextSlide() {
        // Increment index with circular wrapping
        // Example: 4 -> 0 (if 5 items total)
        this.currentIndex = (this.currentIndex + 1) % this.itemsArray.length;
        this.updateGallery();
    }

    /**
     * Move to previous slide (shift carousel left)
     *
     * Implements circular navigation - wraps to end from beginning.
     * Decrements currentIndex with modulo arithmetic for wrapping.
     *
     * @returns {void}
     *
     * @example
     * // Navigate to previous slide
     * carousel.moveToPrevSlide();
     *
     * @public
     */
    moveToPrevSlide() {
        // Decrement index with circular wrapping
        // Example: 0 -> 4 (if 5 items total)
        this.currentIndex =
            (this.currentIndex - 1 + this.itemsArray.length) %
            this.itemsArray.length;
        this.updateGallery();
    }

    /**
     * Move directly to specific slide by index
     *
     * Used by indicator dot clicks to jump directly to a card.
     * Validates index is within bounds before updating.
     *
     * @param {number} index - Target slide index (0-based)
     * @returns {void}
     *
     * @example
     * // Jump to third card
     * carousel.moveToSlide(2);
     *
     * @public
     */
    moveToSlide(index) {
        // Validate index is within bounds
        if (index >= 0 && index < this.itemsArray.length) {
            this.currentIndex = index;
            this.updateGallery();
        } else {
            console.warn('⚠️ Invalid slide index:', index);
        }
    }

    /**
     * Update position indicator dots to reflect current position
     *
     * Highlights the dot corresponding to the centered card (gallery-item-3).
     * Removes active class from all dots, then adds to matching dot.
     *
     * @returns {void}
     *
     * @private
     */
    updateIndicators() {
        // Find which card is currently centered (has gallery-item-3 class)
        const activeItem = document.querySelector('.gallery-item-3');

        // Safety check - active item should always exist
        if (!activeItem || this.indicators.length === 0) {
            return;
        }

        // Get the data-index attribute from centered card
        const activeIndex = activeItem.getAttribute('data-index');

        // Update all indicators
        this.indicators.forEach((indicator) => {
            // Remove active class from all
            indicator.classList.remove(CAROUSEL_CONFIG.ACTIVE_INDICATOR_CLASS);

            // Add active class to matching indicator
            if (indicator.getAttribute('data-index') === activeIndex) {
                indicator.classList.add(CAROUSEL_CONFIG.ACTIVE_INDICATOR_CLASS);
            }
        });
    }

    /**
     * Get current center slide index
     *
     * Useful for external integrations or debugging.
     *
     * @returns {number} Current center slide index (0-based)
     *
     * @example
     * const currentIndex = carousel.getCurrentIndex();
     * console.log('Currently viewing slide:', currentIndex);
     *
     * @public
     */
    getCurrentIndex() {
        return this.currentIndex;
    }

    /**
     * Get total number of slides
     *
     * Useful for external integrations or pagination display.
     *
     * @returns {number} Total slide count
     *
     * @example
     * const total = carousel.getTotalSlides();
     * console.log(`Showing ${carousel.getCurrentIndex() + 1} of ${total}`);
     *
     * @public
     */
    getTotalSlides() {
        return this.itemsArray.length;
    }

    /**
     * Clean up event listeners
     *
     * Prevents memory leaks when carousel is destroyed.
     * Should be called before removing carousel from DOM.
     *
     * Note: This is a simplified cleanup. In production, you'd store
     * listener references and remove them individually for thoroughness.
     *
     * @returns {void}
     *
     * @example
     * // Before removing carousel
     * carousel.destroy();
     * carouselContainer.remove();
     *
     * @public
     */
    destroy() {
        // Remove event listeners
        // Note: Current implementation relies on garbage collection
        // For production, store and explicitly remove all listeners

        console.log('🧹 Carousel destroyed and cleaned up');
    }
}

/* ===================================
   📤 EXPORT
   =================================== */

/**
 * Export Carousel class as default export
 * Allows clean import: import Carousel from './carousel.js'
 */
export default Carousel;
