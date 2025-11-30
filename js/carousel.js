// ================================================
// 🎠 CAROUSEL MODULE - Interactive Gallery Carousel
// ================================================
//
// 📋 FEATURES:
// - 5-position carousel with smooth transitions
// - Touch/swipe support for mobile devices
// - Keyboard navigation (arrow keys)
// - Click indicators for direct navigation
// - Automatic position class management
// - Performance-optimized event listeners
//
// 🎬 CAROUSEL FLOW:
// 1. Initialize DOM elements and state
// 2. Setup event listeners (clicks, touch, keyboard)
// 3. Update gallery positions on navigation
// 4. Sync position indicators with active card
//
// 🔗 CSS INTEGRATION:
// Works with position classes in 06-services-section-styles.css
// ================================================

/* ===================================
   📱 CONFIGURATION CONSTANTS
   =================================== */

const CAROUSEL_CONFIG = {
    // Touch/swipe detection
    MIN_SWIPE_DISTANCE: 50, // Minimum pixels for swipe to register

    // Position classes applied to cards
    POSITION_CLASSES: [
        'gallery-item-1', // Far left
        'gallery-item-2', // Left-adjacent
        'gallery-item-3', // Center (featured)
        'gallery-item-4', // Right-adjacent
        'gallery-item-5', // Far right
    ],

    // Visible positions in carousel (5 total)
    VISIBLE_POSITIONS: 5,

    // Active indicator class
    ACTIVE_INDICATOR_CLASS: 'active',
};

/* ===================================
   📦 CAROUSEL CLASS
   =================================== */

/**
 * Manages interactive carousel gallery for services section
 *
 * @class Carousel
 * @example
 * // Initialize carousel when DOM is ready
 * const carousel = new Carousel();
 *
 * // Carousel automatically handles:
 * // - Previous/Next button clicks
 * // - Touch swipe gestures
 * // - Keyboard arrow key navigation
 * // - Indicator dot clicks
 */
class Carousel {
    /**
     * Initialize carousel and setup event listeners
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
     * @private
     * @returns {boolean} True if carousel can be initialized
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
     * Optimized with passive listeners for better scroll performance
     * @private
     */
    setupTouchEvents() {
        let touchStartX = 0; // Store initial touch X position
        let touchEndX = 0; // Store final touch X position

        // ⚡ OPTIMIZATION: Passive listener - browser can optimize scrolling
        this.galleryContainer.addEventListener(
            'touchstart',
            (e) => {
                touchStartX = e.changedTouches[0].screenX;
            },
            { passive: true }
        ); // Passive = won't call preventDefault()

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
     * @private
     * @param {number} startX - Touch start X coordinate
     * @param {number} endX - Touch end X coordinate
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

        // 🔧 DEBUG: Uncomment to log swipe distance
        // console.log('Swipe distance:', swipeDistance);
    }

    /**
     * Setup keyboard navigation (arrow keys)
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
     * This is the core method that repositions cards in the carousel
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

        // 🔧 DEBUG: Uncomment to log current position
        // console.log('Current center index:', this.currentIndex);
    }

    /**
     * Move to next slide (shift carousel right)
     * Circular navigation - wraps to beginning after last item
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
     * Circular navigation - wraps to end from beginning
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
     * Used by indicator dot clicks
     * @public
     * @param {number} index - Target slide index (0-based)
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
     * Highlights the dot corresponding to the centered card
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
     * Useful for external integrations
     * @public
     * @returns {number} Current center slide index (0-based)
     */
    getCurrentIndex() {
        return this.currentIndex;
    }

    /**
     * Get total number of slides
     * Useful for external integrations
     * @public
     * @returns {number} Total slide count
     */
    getTotalSlides() {
        return this.itemsArray.length;
    }

    /**
     * Clean up event listeners
     * Prevents memory leaks when carousel is destroyed
     * @public
     */
    destroy() {
        // Remove event listeners
        // Note: This is a simplified cleanup - in production, you'd store
        // listener references and remove them individually

        console.log('🧹 Carousel destroyed and cleaned up');
    }
}

/* ===================================
   📤 EXPORT
   =================================== */

// Export as default for ES6 module import
export default Carousel;

/* ===================================
   🔧 DEBUG UTILITIES
   =================================== */

/*
📊 Test Carousel Functionality:
Copy these functions to browser console for debugging

// Get current carousel state
function debugCarousel() {
    const activeCard = document.querySelector('.gallery-item-3');
    const activeIndex = activeCard ? activeCard.getAttribute('data-index') : 'none';
    const visibleCards = document.querySelectorAll('.gallery-item[class*="gallery-item-"]').length;
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎠 CAROUSEL STATE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Active card index:', activeIndex);
    console.log('Visible cards:', visibleCards);
    console.log('Total cards:', document.querySelectorAll('.gallery-item').length);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

// Manually trigger navigation
function testNext() {
    document.querySelector('.gallery-controls-next').click();
    setTimeout(debugCarousel, 400);
}

function testPrev() {
    document.querySelector('.gallery-controls-previous').click();
    setTimeout(debugCarousel, 400);
}

// Test swipe simulation
function simulateSwipe(direction) {
    const container = document.querySelector('.gallery-container');
    const startX = direction === 'left' ? 200 : 50;
    const endX = direction === 'left' ? 50 : 200;
    
    const touchStart = new TouchEvent('touchstart', {
        changedTouches: [{ screenX: startX }]
    });
    
    const touchEnd = new TouchEvent('touchend', {
        changedTouches: [{ screenX: endX }]
    });
    
    container.dispatchEvent(touchStart);
    container.dispatchEvent(touchEnd);
}

// Run initial debug
debugCarousel();

console.log('🎮 Carousel debug functions loaded!');
console.log('Try: testNext(), testPrev(), debugCarousel(), simulateSwipe("left")');
*/
