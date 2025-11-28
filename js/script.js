import { initializeCountdown, cleanupCountdown } from './countdown-clock.js';
import { initializeMoonPhase } from './moon-phase.js';
import Carousel from './carousel.js';
import { renderCalendar, startAutoUpdate } from './calendar.js';
import { initNav, destroyNav } from './nav.js';

// ------------------------------------------------------------------
// MOBILE NAVIGATION FUNCTIONALITY
// ------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    initNav();
});

/* ================================================
   👤 ABOUT ME SECTION - ANIMATION CONTROLLER
   ================================================
   
   📋 FEATURES:
   - Scroll-triggered entrance animations using IntersectionObserver
   - Responsive animation directions based on screen layout
   - Debounced resize handling for performance
   - Memory leak prevention with proper cleanup
   - Staggered card entrance for visual interest
   
   🎬 ANIMATION FLOW:
   1. Cards start hidden (opacity: 0, translateY)
   2. When section enters viewport, IntersectionObserver triggers
   3. Cards receive direction classes based on screen width
   4. CSS handles the actual animation with transition delays
   
   🔗 CSS INTEGRATION:
   Works with animate-from-* classes in about-me-section-styles.css
*/

/* ===================================
   📱 RESPONSIVE BREAKPOINT CONSTANTS
   =================================== */

const BREAKPOINTS = {
    MOBILE: 599, // ≤599px: Single column layout
    TABLET: 991, // ≤991px: Two column layout with centered third card
    DESKTOP: Infinity, // >991px: Three column layout
};

/* ===================================
   ⏱️ ANIMATION TIMING CONSTANTS
   =================================== */

const ANIMATION_CONFIG = {
    // IntersectionObserver thresholds
    VISIBILITY_THRESHOLD: 0.3, // Trigger when 30% of section is visible
    ROOT_MARGIN: '-10% 0px -10% 0px', // Start trigger slightly before section enters viewport

    // Timing for staggered appearance
    BROWSER_DELAY: 100, // Small delay between card animations (ms)

    // Resize debouncing
    RESIZE_DEBOUNCE_DELAY: 250, // Wait 250ms after last resize before updating (ms)
};

/* ===================================
   🎬 ANIMATION DIRECTION CONFIGURATIONS
   =================================== */

/*
   🔄 TRANSLATED: Animation direction patterns for different screen sizes
   Original: "Мобильные устройства", "Планшеты", "Десктоп"
   
   Each layout defines which direction each card should animate from:
   - bottom-left: Slides in from lower left diagonal
   - bottom: Slides in from straight below
   - bottom-right: Slides in from lower right diagonal
*/
const ANIMATION_DIRECTIONS = {
    MOBILE: [
        'animate-from-bottom-left', // Card 1: From bottom-left
        'animate-from-bottom-right', // Card 2: From bottom-right
        'animate-from-bottom', // Card 3: From bottom (centered)
    ],
    TABLET: [
        'animate-from-bottom-left', // Card 1: From bottom-left (left column)
        'animate-from-bottom-right', // Card 2: From bottom-right (right column)
        'animate-from-bottom', // Card 3: From bottom (centered, spans both columns)
    ],
    DESKTOP: [
        'animate-from-bottom-left', // Card 1: From bottom-left (left column)
        'animate-from-bottom', // Card 2: From bottom (center column)
        'animate-from-bottom-right', // Card 3: From bottom-right (right column)
    ],
};

/* ===================================
   📦 ABOUT ME ANIMATION CLASS
   =================================== */

/**
 * Manages scroll-triggered entrance animations for About Me section cards
 *
 * @class AboutMeAnimation
 * @example
 * // Initialize animations when DOM is ready
 * const aboutMeAnimation = new AboutMeAnimation();
 *
 * // Manually trigger animation (optional)
 * aboutMeAnimation.triggerAnimation();
 *
 * // Reset animation state (optional)
 * aboutMeAnimation.resetAnimation();
 */
class AboutMeAnimation {
    /**
     * Initialize the animation system
     * Sets up IntersectionObserver and resize handler
     */
    constructor() {
        // Cache DOM elements
        this.aboutMeSection = document.querySelector('.about-me-section');
        this.aboutMeCards = document.querySelectorAll('.about-me-card');

        // Animation state tracking
        this.hasAnimated = false; // Prevents animation from triggering multiple times
        this.currentBreakpoint = null; // Tracks which breakpoint we're currently in
        this.resizeTimeout = null; // For debouncing resize events
        this.observer = null; // Store observer reference for cleanup

        // Validate required elements exist
        if (!this.aboutMeSection || this.aboutMeCards.length === 0) {
            console.warn(
                '⚠️ About Me section or cards not found. Animation disabled.'
            );
            return;
        }

        // Initialize animation system
        this.initializeAnimation();
        this.setupIntersectionObserver();
    }

    /**
     * Set up initial animation classes based on current screen size
     * @private
     */
    initializeAnimation() {
        // 🔄 TRANSLATED: Set initial animation direction classes
        // Original: "Устанавливаем начальные классы для направлений анимации"
        this.updateAnimationDirections();
        this.setupResizeHandler();
    }

    /**
     * Determine current breakpoint based on window width
     * @private
     * @returns {string} Current breakpoint name ('MOBILE', 'TABLET', or 'DESKTOP')
     */
    getCurrentBreakpoint() {
        const width = window.innerWidth;

        if (width <= BREAKPOINTS.MOBILE) return 'MOBILE';
        if (width <= BREAKPOINTS.TABLET) return 'TABLET';
        return 'DESKTOP';
    }

    /**
     * Update animation direction classes based on screen size
     * Only updates if breakpoint has actually changed
     * @private
     */
    updateAnimationDirections() {
        const newBreakpoint = this.getCurrentBreakpoint();

        // 🎯 OPTIMIZATION: Only update if breakpoint changed
        if (newBreakpoint === this.currentBreakpoint) {
            return; // No change needed
        }

        this.currentBreakpoint = newBreakpoint;

        // 🔄 TRANSLATED: Remove all existing direction classes
        // Original: "Сбрасываем все классы направлений"
        this.aboutMeCards.forEach((card) => {
            card.classList.remove(
                'animate-from-bottom-left',
                'animate-from-bottom',
                'animate-from-bottom-right'
            );
        });

        // Apply new direction classes based on breakpoint
        const directions = ANIMATION_DIRECTIONS[newBreakpoint];
        this.aboutMeCards.forEach((card, index) => {
            if (directions[index]) {
                card.classList.add(directions[index]);
            }
        });
    }

    /**
     * Set up debounced window resize handler
     * Prevents excessive updates during window resize
     * @private
     */
    setupResizeHandler() {
        // 🎯 OPTIMIZATION: Debounce resize events for performance
        const debouncedUpdate = () => {
            // Clear existing timeout
            if (this.resizeTimeout) {
                clearTimeout(this.resizeTimeout);
            }

            // Set new timeout
            this.resizeTimeout = setTimeout(() => {
                this.updateAnimationDirections();
            }, ANIMATION_CONFIG.RESIZE_DEBOUNCE_DELAY);
        };

        // 🔄 TRANSLATED: Update directions when window is resized
        // Original: "Обновляем направления при изменении размера окна"
        window.addEventListener('resize', debouncedUpdate);

        // Store reference for cleanup
        this.resizeHandler = debouncedUpdate;
    }

    /**
     * Set up IntersectionObserver to trigger animation on scroll
     * @private
     */
    setupIntersectionObserver() {
        const options = {
            root: null, // Use viewport as root
            rootMargin: ANIMATION_CONFIG.ROOT_MARGIN, // 🔄 TRANSLATED: "Триггер когда секция на 10% видна"
            threshold: ANIMATION_CONFIG.VISIBILITY_THRESHOLD, // 🔄 TRANSLATED: "Анимация запускается когда 30% секции видно"
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                // Trigger animation when section enters viewport (only once)
                if (entry.isIntersecting && !this.hasAnimated) {
                    this.animateCards();
                    this.hasAnimated = true;
                }
            });
        }, options);

        // Start observing the About Me section
        if (this.aboutMeSection) {
            this.observer.observe(this.aboutMeSection);
        }
    }

    /**
     * Trigger staggered entrance animation for all cards
     * Adds 'animate-in' class with progressive delays
     * @private
     */
    animateCards() {
        // 🔄 TRANSLATED: Trigger animation for all cards
        // Original: "Запускаем анимацию для всех карточек"

        this.aboutMeCards.forEach((card, index) => {
            // 🔄 TRANSLATED: Add animation class with delays set in CSS
            // Original: "Добавляем класс анимации с учетом задержек, установленных в CSS"

            // Small browser delay for smoother visual effect
            setTimeout(() => {
                card.classList.add('animate-in');
            }, index * ANIMATION_CONFIG.BROWSER_DELAY);
        });
    }

    /**
     * Manually trigger the entrance animation
     * Useful for testing or forcing animation after reset
     * @public
     */
    triggerAnimation() {
        // 🔄 TRANSLATED: Manual animation trigger method
        // Original: "Метод для ручного запуска анимации (если потребуется)"

        if (!this.hasAnimated) {
            this.animateCards();
            this.hasAnimated = true;
        }
    }

    /**
     * Reset animation state - allows animation to trigger again
     * Useful for testing or re-triggering animation
     * @public
     */
    resetAnimation() {
        // 🔄 TRANSLATED: Reset animation state method
        // Original: "Метод для сброса анимации (если потребуется)"

        this.hasAnimated = false;

        // Remove animate-in class from all cards
        this.aboutMeCards.forEach((card) => {
            card.classList.remove('animate-in');
        });
    }

    /**
     * Clean up event listeners and observers
     * Prevents memory leaks when component is destroyed
     * @public
     */
    destroy() {
        // Clear resize timeout
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }

        // Remove resize event listener
        if (this.resizeHandler) {
            window.removeEventListener('resize', this.resizeHandler);
        }

        // Disconnect IntersectionObserver
        if (this.observer) {
            this.observer.disconnect();
        }

        console.log('🧹 About Me animation controller cleaned up');
    }
}

/* ===================================
   🔧 DEBUG UTILITIES
   =================================== */

/*
📊 Test Animation System:
Copy these functions to browser console for debugging

// Check current animation state
function debugAboutMeAnimation() {
    const section = document.querySelector('.about-me-section');
    const cards = document.querySelectorAll('.about-me-card');
    
    console.log('📍 Current breakpoint:', window.innerWidth <= 599 ? 'MOBILE' : window.innerWidth <= 991 ? 'TABLET' : 'DESKTOP');
    console.log('🎬 Cards found:', cards.length);
    
    cards.forEach((card, i) => {
        const classes = card.className;
        const hasAnimated = card.classList.contains('animate-in');
        console.log(`Card ${i + 1}:`, {
            classes,
            animated: hasAnimated
        });
    });
}

// Force animation to trigger
function forceAboutMeAnimation() {
    document.querySelectorAll('.about-me-card').forEach((card, i) => {
        setTimeout(() => card.classList.add('animate-in'), i * 100);
    });
}

// Reset animation state
function resetAboutMeAnimation() {
    document.querySelectorAll('.about-me-card').forEach(card => {
        card.classList.remove('animate-in');
    });
}

debugAboutMeAnimation();
*/

// ------------------------------------------------------------------
// UNIFIED POPUP FUNCTIONALITY
// ------------------------------------------------------------------

class PopupManager {
    constructor() {
        this.createPopupElements();
        this.initializeEventListeners();
    }

    createPopupElements() {
        // Create main popup elements
        this.overlay = document.createElement('div');
        this.overlay.className = 'popup-overlay';

        this.content = document.createElement('div');
        this.content.className = 'popup-content';

        this.title = document.createElement('h2');
        this.title.className = 'popup-title';

        this.closeBtn = document.createElement('span');
        this.closeBtn.className = 'popup-close';
        this.closeBtn.innerHTML = '&times;';

        this.text = document.createElement('div');
        this.text.className = 'popup-text';

        // Assemble popup structure
        this.content.appendChild(this.closeBtn);
        this.content.appendChild(this.title);
        this.content.appendChild(this.text);
        this.overlay.appendChild(this.content);
        document.body.appendChild(this.overlay);
    }

    initializeEventListeners() {
        // Close button click
        this.closeBtn.addEventListener('click', () => this.close());

        // Click outside content
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.close();
        });

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (
                e.key === 'Escape' &&
                this.overlay.classList.contains('active')
            ) {
                this.close();
            }
        });

        // Service card buttons
        document
            .querySelectorAll('.services__card_button')
            .forEach((button) => {
                button.addEventListener('click', () => {
                    const card = button.closest('.services__card');
                    const paragraph = card.querySelector(
                        '.services__card__text'
                    );
                    const content = paragraph.textContent;
                    this.show('Service Details', content);
                });
            });

        // Gallery item buttons
        document.querySelectorAll('.gallery-item-button').forEach((button) => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const card = button.closest('.gallery-item');
                const title = card.querySelector(
                    '.gallery-item-title'
                ).textContent;
                const content =
                    card.querySelector('.gallery-item-text').innerHTML;
                this.show(title, content);
            });
        });
    }

    show(title, content) {
        this.title.textContent = title;
        this.text.innerHTML = content;
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            this.title.textContent = '';
            this.text.innerHTML = '';
        }, 300);
    }
}

// ------------------------------------------------------------------
// CAROUSEL FUNCTIONALITY
// ------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    new Carousel();
});

// ------------------------------------------------------------------
// INITIALIZATION
// ------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function () {
    const popupManager = new PopupManager();
    const carousel = new Carousel();

    // АНИМАЦИЯ: Инициализация анимации секции "Обо мне"
    const aboutMeAnimation = new AboutMeAnimation();
});

// ------------------------------------------------------------------
// COUNTDOWN CLOCK
// ------------------------------------------------------------------

// Initialize countdown when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    initializeCountdown();
});

// Cleanup when leaving the page
window.addEventListener('beforeunload', function () {
    cleanupCountdown();
});

// ------------------------------------------------------------------
// Moon Phase Section Logic
// ------------------------------------------------------------------

initializeMoonPhase();

// ------------------------------------------------------------------
// Calendar Section Logic with Auto-Update
// ------------------------------------------------------------------

// Initial Calendar render
renderCalendar();

//Start the calendar auto-update system
startAutoUpdate();
