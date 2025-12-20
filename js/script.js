// ================================================
// 🎯 MAIN APPLICATION ORCHESTRATOR
// ================================================
//
// 📋 MODULE PURPOSE:
// Central initialization and coordination point for all application components.
// Handles module imports, event delegation, and ensures proper initialization
// order for all interactive features.
//
// 🎬 INITIALIZATION FLOW:
// 1. Import all feature modules
// 2. Define static data (SERVICE_DATA)
// 3. Initialize components on DOMContentLoaded
// 4. Setup cleanup handlers on beforeunload
//
// 🔗 DEPENDENCIES:
// - ./moon-phase.js (self-initializing)
// - ./price-section.js (self-initializing)
// - ./countdown-clock.js
// - ./carousel.js
// - ./calendar.js
// - ./nav.js
// - ./hero-button.js
//
// 📦 MAIN COMPONENTS:
// - SERVICE_DATA: Static service descriptions for popups
// - PopupManager: Modal system for service details
// - AboutMeAnimation: Scroll-triggered card animations
//
// ⚠️ IMPORTANT NOTES:
// - Each module should only be initialized ONCE
// - Moon phase and price section self-initialize (don't call manually)
// - Countdown cleanup prevents memory leaks on page unload

// ================================================
// 📦 MODULE IMPORTS
// ================================================

// Self-initializing modules (no manual init needed)
import './moon-phase.js'; // 🌙 Auto-initializes on DOMContentLoaded
import './price-section.js'; // 💰 Auto-initializes on DOMContentLoaded

// Modules requiring manual initialization
import { initializeCountdown, cleanupCountdown } from './countdown-clock.js';
import Carousel from './carousel.js';
import { renderCalendar, startAutoUpdate } from './calendar.js';
import { initNav, destroyNav } from './nav.js';
import { initializeHeroButton, destroyHeroButton } from './hero-button.js';

// ================================================
// 🎴 SERVICE DATA - POPUP CONTENT
// ================================================
//
// 📋 PURPOSE:
// Static service descriptions displayed in popup modals when users click
// "Learn More" buttons on service carousel cards.
//
// 🔄 MIGRATED FROM: HTML popup divs (improved maintainability)
//
// 📝 STRUCTURE:
// Each service ID maps to:
// - title: Service name (Russian)
// - content: Full HTML description with formatting
//
// 🔧 MAINTENANCE:
// To add new service:
// 1. Add new entry with next ID number
// 2. Update data-popup attribute in HTML carousel card
// 3. Ensure PopupManager buttons have matching data-popup value

/**
 * Service descriptions for popup modals
 * Maps service IDs to display content
 *
 * @constant {Object.<string, {title: string, content: string}>}
 *
 * @example
 * // Access service data
 * const service = SERVICE_DATA['1'];
 * console.log(service.title); // "Гадание на картах"
 */
const SERVICE_DATA = {
    1: {
        title: 'Гадание на картах',
        content: `
            <p>Гадание на картах - это древнее искусство предсказания будущего и анализа настоящего через символы и образы карт. В своей практике я использую как обычные игральные карты, так и специальные гадальные колоды.</p>
            <p>С помощью карт можно получить ответы на волнующие вопросы о:</p>
            <ul>
                <li>Личных отношениях и любви</li>
                <li>Карьере и профессиональном развитии</li>
                <li>Финансовом положении и материальном благополучии</li>
                <li>Жизненном пути и предназначении</li>
            </ul>
            <p>Каждый расклад индивидуален и учитывает вашу конкретную ситуацию. Я тщательно интерпретирую символы карт и их взаимосвязь, чтобы дать вам наиболее точное и полезное предсказание.</p>
            <p>Сеанс гадания на картах поможет вам увидеть скрытые аспекты ситуации, получить совет для принятия решений и узнать о возможных перспективах развития событий.</p>
        `,
    },
    2: {
        title: 'Таро расклад',
        content: `
            <p>Карты Таро - это мощный инструмент для глубокого анализа жизненных ситуаций и самопознания. В отличие от обычных карт, система Таро имеет богатую символику и многослойные значения, что позволяет проводить детальный анализ прошлого, настоящего и возможного будущего.</p>
            <p>В своей практике я использую различные расклады Таро:</p>
            <ul>
                <li><strong>Кельтский крест</strong> - классический расклад для глубокого анализа конкретной ситуации</li>
                <li><strong>Расклад на отношения</strong> - для анализа любовных и партнерских отношений</li>
                <li><strong>Карта дня</strong> - для получения совета на текущий день</li>
                <li><strong>Расклад "Путь"</strong> - для понимания вашего жизненного пути и предназначения</li>
            </ul>
            <p>Сеанс гадания на Таро поможет вам получить глубокое понимание происходящих процессов, раскрыть скрытые мотивы, увидеть потенциальные препятствия и найти возможные пути их преодоления.</p>
            <p>Каждый расклад сопровождается подробным объяснением значения карт и их взаимосвязей в контексте вашей конкретной ситуации.</p>
        `,
    },
    3: {
        title: 'Ритуалы и заговоры',
        content: `
            <p>Ритуалы и заговоры - это древние практики, направленные на привлечение желаемых изменений в жизни или защиту от нежелательных влияний. Они основаны на работе с энергиями природы и силой слова.</p>
            <p>Я провожу различные виды ритуалов:</p>
            <ul>
                <li><strong>Любовные ритуалы</strong> - для привлечения любви, улучшения отношений, укрепления чувств</li>
                <li><strong>Денежные обряды</strong> - для привлечения финансового благополучия, новых источников дохода</li>
                <li><strong>Очистительные ритуалы</strong> - для освобождения от негативных энергий, очищения жилища</li>
                <li><strong>Защитные заговоры</strong> - для создания энергетической защиты от внешних воздействий</li>
            </ul>
            <p>Каждый ритуал подбирается индивидуально, с учетом вашей конкретной ситуации и потребностей. Для достижения наилучшего результата важно соблюдать все рекомендации и выполнять необходимые действия в течение указанного времени.</p>
            <p>Помните, что ритуалы и заговоры - это помощь и направление энергии, но они работают в гармонии с вашими собственными усилиями и намерениями.</p>
        `,
    },
    4: {
        title: 'Восковая отливка',
        content: `
            <p>Восковая отливка - это древний славянский метод диагностики и снятия негативных воздействий. Процедура заключается в выливании расплавленного воска в холодную воду над человеком или его фотографией.</p>
            <p>Застывший воск принимает формы, которые имеют диагностическое значение и показывают:</p>
            <ul>
                <li>Наличие сглаза, порчи, проклятия или других негативных воздействий</li>
                <li>Энергетические блоки и проблемные зоны</li>
                <li>Источники и причины негативных влияний</li>
                <li>Состояние энергетического поля человека</li>
            </ul>
            <p>Процедура восковой отливки не только диагностирует проблему, но и одновременно снимает негативное воздействие, перенося его с человека на воск. Отлитые формы затем нейтрализуются специальным образом.</p>
            <p>Для полного очищения обычно требуется от 1 до 9 сеансов, в зависимости от силы и длительности негативного воздействия. После процедуры даются рекомендации по энергетической защите и восстановлению.</p>
        `,
    },
    5: {
        title: 'Обереги и амулеты',
        content: `
            <p>Обереги и амулеты - это предметы, заряженные особой энергией для защиты, привлечения удачи и благополучия. Я создаю индивидуальные обереги, учитывая ваши потребности, особенности энергетики и конкретные цели.</p>
            <p>Виды оберегов, которые я изготавливаю:</p>
            <ul>
                <li><strong>Защитные амулеты</strong> - охраняют от негативных энергий и воздействий</li>
                <li><strong>Любовные талисманы</strong> - привлекают любовь, гармонизируют отношения</li>
                <li><strong>Денежные обереги</strong> - способствуют финансовому благополучию</li>
                <li><strong>Здоровье и жизненные силы</strong> - укрепляют энергетику и защищают здоровье</li>
                <li><strong>Путевые амулеты</strong> - обеспечивают защиту в пути и при переездах</li>
            </ul>
            <p>Каждый оберег создается в определенное время, с использованием специальных материалов и ритуалов активации. К амулету прилагаются инструкции по правильному использованию и периодической подзарядке.</p>
            <p>Важно помнить, что оберег - это личный предмет, который настраивается на энергетику конкретного человека и не должен передаваться другим людям.</p>
        `,
    },
};

/* ===================================
   🧭 MOBILE NAVIGATION
   =================================== */

/**
 * Initialize mobile navigation menu system
 * Handles off-canvas menu, focus trap, and scroll locking
 *
 * @see nav.js for detailed implementation
 * @private
 */
document.addEventListener('DOMContentLoaded', () => {
    initNav();
    console.log('✅ Mobile navigation initialized');
});

/* ===================================
   🦸 HERO BUTTON - SMOOTH SCROLL
   =================================== */

/**
 * Initialize hero section CTA button
 * Provides smooth scrolling to target sections
 *
 * @see hero-button.js for scroll implementation
 * @private
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeHeroButton();
    console.log('✅ Hero button initialized');
});

/**
 * Cleanup hero button listeners on page unload
 * Prevents memory leaks
 *
 * @private
 */
window.addEventListener('beforeunload', () => {
    destroyHeroButton();
});

/* ===================================
   👤 ABOUT ME SECTION - SCROLL ANIMATIONS
   =================================== */

//  ───────────────────────────────────────────────
//  📱 RESPONSIVE BREAKPOINTS
//  ───────────────────────────────────────────────

/**
 * Breakpoint configuration for responsive animation directions
 * Defines at which screen widths the layout changes
 *
 * @constant {Object}
 */
const BREAKPOINTS = {
    MOBILE: 599, // ≤599px: Single column layout
    TABLET: 991, // ≤991px: Two column layout
    DESKTOP: Infinity, // >991px: Three column layout
};

//  ───────────────────────────────────────────────
//  ⏱️ ANIMATION TIMING
//  ───────────────────────────────────────────────

/**
 * Animation timing configuration
 * Controls IntersectionObserver thresholds and delays
 *
 * @constant {Object}
 */
const ANIMATION_CONFIG = {
    // IntersectionObserver thresholds
    VISIBILITY_THRESHOLD: 0.3, // Trigger at 30% visibility
    ROOT_MARGIN: '-10% 0px -10% 0px', // Start trigger slightly before entering viewport

    // Timing for staggered card entrance
    BROWSER_DELAY: 100, // Delay between each card animation (ms)

    // Resize debouncing
    RESIZE_DEBOUNCE_DELAY: 250, // Wait after last resize event (ms)
};

//  ───────────────────────────────────────────────
//  🎬 ANIMATION DIRECTION PATTERNS
//  ───────────────────────────────────────────────

/**
 * Animation direction configurations for different screen sizes
 * Defines which direction each card should slide in from
 *
 * @constant {Object.<string, Array<string>>}
 *
 * @example
 * // Mobile: alternating diagonal + centered bottom
 * ['animate-from-bottom-left', 'animate-from-bottom-right', 'animate-from-bottom']
 */
const ANIMATION_DIRECTIONS = {
    MOBILE: [
        'animate-from-bottom-left', // Card 1: Diagonal from lower-left
        'animate-from-bottom-right', // Card 2: Diagonal from lower-right
        'animate-from-bottom', // Card 3: Straight up (centered)
    ],
    TABLET: [
        'animate-from-bottom-left', // Card 1: Left column
        'animate-from-bottom-right', // Card 2: Right column
        'animate-from-bottom', // Card 3: Centered (spans both columns)
    ],
    DESKTOP: [
        'animate-from-bottom-left', // Card 1: Left column
        'animate-from-bottom', // Card 2: Center column
        'animate-from-bottom-right', // Card 3: Right column
    ],
};

//  ───────────────────────────────────────────────
//  📦 ABOUT ME ANIMATION CLASS
//  ───────────────────────────────────────────────

/**
 * Manages scroll-triggered entrance animations for About Me section
 *
 * Uses IntersectionObserver to detect when section enters viewport,
 * then triggers staggered card entrance animations with direction
 * classes that adapt to current screen size.
 *
 * @class AboutMeAnimation
 *
 * @example
 * // Automatic initialization on DOM ready
 * const aboutMeAnimation = new AboutMeAnimation();
 *
 * @example
 * // Manual control (for testing)
 * aboutMeAnimation.triggerAnimation(); // Force animate
 * aboutMeAnimation.resetAnimation();   // Reset to initial state
 */
class AboutMeAnimation {
    /**
     * Initialize animation system
     * Caches DOM elements, sets up observer, and configures resize handler
     */
    constructor() {
        // Cache DOM elements for performance
        this.aboutMeSection = document.querySelector('.about-me-section');
        this.aboutMeCards = document.querySelectorAll('.about-me-card');

        // Animation state tracking
        this.hasAnimated = false; // Prevents re-triggering animation
        this.currentBreakpoint = null; // Tracks current responsive layout
        this.resizeTimeout = null; // Debounce timer for resize events
        this.observer = null; // IntersectionObserver instance

        // Validate required DOM elements exist
        if (!this.aboutMeSection || this.aboutMeCards.length === 0) {
            console.warn(
                '⚠️ About Me section or cards not found. Animation disabled.'
            );
            return;
        }

        // Initialize animation system
        this.initializeAnimation();
        this.setupIntersectionObserver();

        console.log('✅ About Me animation initialized');
    }

    /**
     * Set up initial animation classes and resize handler
     * @private
     */
    initializeAnimation() {
        this.updateAnimationDirections();
        this.setupResizeHandler();
    }

    /**
     * Determine current responsive breakpoint based on window width
     *
     * @returns {string} Current breakpoint name ('MOBILE', 'TABLET', or 'DESKTOP')
     * @private
     */
    getCurrentBreakpoint() {
        const width = window.innerWidth;

        if (width <= BREAKPOINTS.MOBILE) return 'MOBILE';
        if (width <= BREAKPOINTS.TABLET) return 'TABLET';
        return 'DESKTOP';
    }

    /**
     * Update animation direction classes based on current screen size
     * Only updates if breakpoint has actually changed (performance optimization)
     *
     * @private
     */
    updateAnimationDirections() {
        const newBreakpoint = this.getCurrentBreakpoint();

        // Skip update if breakpoint hasn't changed
        if (newBreakpoint === this.currentBreakpoint) {
            return;
        }

        this.currentBreakpoint = newBreakpoint;

        // Remove all existing direction classes
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
     * Prevents excessive updates during active resize
     *
     * @private
     */
    setupResizeHandler() {
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

        window.addEventListener('resize', debouncedUpdate);

        // Store reference for cleanup
        this.resizeHandler = debouncedUpdate;
    }

    /**
     * Set up IntersectionObserver to trigger animation when section enters viewport
     *
     * @private
     */
    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: ANIMATION_CONFIG.ROOT_MARGIN,
            threshold: ANIMATION_CONFIG.VISIBILITY_THRESHOLD,
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
     *
     * @private
     */
    animateCards() {
        this.aboutMeCards.forEach((card, index) => {
            // Small browser delay creates smooth staggered effect
            setTimeout(() => {
                card.classList.add('animate-in');
            }, index * ANIMATION_CONFIG.BROWSER_DELAY);
        });
    }

    /**
     * Manually trigger the entrance animation
     * Useful for testing or forcing animation after reset
     *
     * @public
     */
    triggerAnimation() {
        if (!this.hasAnimated) {
            this.animateCards();
            this.hasAnimated = true;
        }
    }

    /**
     * Reset animation state - allows animation to trigger again
     * Useful for testing or development
     *
     * @public
     */
    resetAnimation() {
        this.hasAnimated = false;

        // Remove animate-in class from all cards
        this.aboutMeCards.forEach((card) => {
            card.classList.remove('animate-in');
        });
    }

    /**
     * Clean up event listeners and observers
     * Prevents memory leaks when component is destroyed
     *
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

        console.log('🧹 About Me animation cleaned up');
    }
}

/* ===================================
   🎭 POPUP MANAGER - SERVICE DETAILS MODAL
   =================================== */

/**
 * Manages popup modal system for displaying service details
 *
 * Creates and controls a modal overlay that displays detailed service
 * information from SERVICE_DATA when user clicks "Learn More" buttons
 * on carousel service cards.
 *
 * @class PopupManager
 *
 * @example
 * // Automatic initialization
 * const popupManager = new PopupManager();
 *
 * @example
 * // Manual control (if needed)
 * popupManager.show('Title', '<p>Content</p>');
 * popupManager.close();
 */
class PopupManager {
    /**
     * Initialize popup system
     * Creates DOM structure and sets up event listeners
     */
    constructor() {
        this.createPopupElements();
        this.initializeEventListeners();
        console.log('✅ Popup manager initialized');
    }

    /**
     * Create popup DOM structure and append to body
     *
     * Structure:
     * - overlay (backdrop)
     *   - content (card)
     *     - closeBtn (×)
     *     - title (h2)
     *     - text (div with HTML content)
     *
     * @private
     */
    createPopupElements() {
        // Create overlay backdrop
        this.overlay = document.createElement('div');
        this.overlay.className = 'popup-overlay';

        // Create content card
        this.content = document.createElement('div');
        this.content.className = 'popup-content';

        // Create title element
        this.title = document.createElement('h2');
        this.title.className = 'popup-title';

        // Create close button
        this.closeBtn = document.createElement('span');
        this.closeBtn.className = 'popup-close';
        this.closeBtn.innerHTML = '&times;';
        this.closeBtn.setAttribute('aria-label', 'Закрыть окно');

        // Create text container
        this.text = document.createElement('div');
        this.text.className = 'popup-text';

        // Assemble popup structure
        this.content.appendChild(this.closeBtn);
        this.content.appendChild(this.title);
        this.content.appendChild(this.text);
        this.overlay.appendChild(this.content);
        document.body.appendChild(this.overlay);
    }

    /**
     * Setup event listeners for popup interactions
     * Handles: close button, outside clicks, ESC key, and "Learn More" buttons
     *
     * @private
     */
    initializeEventListeners() {
        // Close button click
        this.closeBtn.addEventListener('click', () => this.close());

        // Click outside content area
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.close();
        });

        // ESC key press
        document.addEventListener('keydown', (e) => {
            if (
                e.key === 'Escape' &&
                this.overlay.classList.contains('active')
            ) {
                this.close();
            }
        });

        // Gallery item "Learn More" buttons
        document.querySelectorAll('.gallery-item-button').forEach((button) => {
            button.addEventListener('click', (e) => {
                e.preventDefault();

                // Extract service ID from data-popup attribute
                const serviceId = button
                    .getAttribute('data-popup')
                    ?.replace('popup-', '');

                if (serviceId && SERVICE_DATA[serviceId]) {
                    const service = SERVICE_DATA[serviceId];
                    this.show(service.title, service.content);
                } else {
                    console.warn(
                        '⚠️ Service data not found for ID:',
                        serviceId
                    );
                }
            });
        });
    }

    /**
     * Display popup with title and HTML content
     *
     * @param {string} title - Popup title text
     * @param {string} content - HTML content for popup body
     *
     * @example
     * popupManager.show('Гадание на картах', '<p>Description here</p>');
     *
     * @public
     */
    show(title, content) {
        this.title.textContent = title;
        this.text.innerHTML = content;
        this.overlay.classList.add('active');

        // Prevent background scroll while popup is open
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close popup and reset content
     * Restores body scroll and clears content after animation completes
     *
     * @public
     */
    close() {
        this.overlay.classList.remove('active');

        // Restore scroll
        document.body.style.overflow = '';

        // Clear content after CSS transition completes (300ms)
        setTimeout(() => {
            this.title.textContent = '';
            this.text.innerHTML = '';
        }, 300);
    }
}

/* ===================================
   ⏰ COUNTDOWN CLOCK
   =================================== */

/**
 * Initialize countdown timer
 *
 * ⚠️ IMPORTANT: This is the ONLY place countdown should be initialized
 * Multiple initializations will cause duplicate timers and memory leaks
 *
 * @see countdown-clock.js for timer implementation
 * @private
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeCountdown();
    console.log('✅ Countdown timer initialized');
});

/**
 * Cleanup countdown on page unload
 * Prevents memory leaks by clearing interval timers
 *
 * @private
 */
window.addEventListener('beforeunload', () => {
    cleanupCountdown();
});

/* ===================================
   📅 CALENDAR SECTION
   =================================== */

/**
 * Render calendar for current month
 * Displays interactive monthly view with travel dates highlighted
 *
 * @see calendar.js for rendering logic
 * @private
 */
renderCalendar();

/**
 * Start calendar auto-update system
 * Calendar automatically refreshes every 6 hours to stay current
 *
 * @see calendar.js for update mechanism
 * @private
 */
startAutoUpdate();

console.log('✅ Calendar initialized with auto-update');

/* ===================================
   🎯 UNIFIED COMPONENT INITIALIZATION
   =================================== */

/**
 * Initialize all remaining components on DOM ready
 *
 * This centralized initialization point ensures:
 * - Proper initialization order
 * - No duplicate initializations
 * - Clean error handling
 *
 * @private
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing application components...');

    // Initialize popup system for service details
    const popupManager = new PopupManager();

    // Initialize carousel
    const carousel = new Carousel();

    // Initialize About Me section animations
    const aboutMeAnimation = new AboutMeAnimation();

    console.log('✅ All components initialized successfully');
});

/* ================================================
   🔧 DEBUG UTILITIES - MOVE TO DEV FILE LATER
   ================================================
   
   📊 Console Testing Commands:
   Copy these to browser console for debugging
   
   ──────────────────────────────────────────────
   TEST ABOUT ME ANIMATIONS:
   ──────────────────────────────────────────────
   
   // Check current animation state
   function debugAboutMeAnimation() {
       const section = document.querySelector('.about-me-section');
       const cards = document.querySelectorAll('.about-me-card');
       
       const width = window.innerWidth;
       const breakpoint = width <= 599 ? 'MOBILE' : 
                         width <= 991 ? 'TABLET' : 'DESKTOP';
       
       console.log('📍 Current breakpoint:', breakpoint, `(${width}px)`);
       console.log('🎬 Cards found:', cards.length);
       
       cards.forEach((card, i) => {
           const classes = Array.from(card.classList);
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
       console.log('✅ Animation forced');
   }
   
   // Reset animation state
   function resetAboutMeAnimation() {
       document.querySelectorAll('.about-me-card').forEach(card => {
           card.classList.remove('animate-in');
       });
       console.log('✅ Animation reset');
   }
   
   ──────────────────────────────────────────────
   TEST POPUP SYSTEM:
   ──────────────────────────────────────────────
   
   // Test popup with sample data
   function testPopup() {
       // This requires popupManager to be stored globally or accessible
       // For now, trigger via button click simulation
       const buttons = document.querySelectorAll('.gallery-item-button');
       if (buttons.length > 0) {
           buttons[0].click();
           console.log('✅ Popup opened for first service');
       } else {
           console.warn('⚠️ No gallery buttons found');
       }
   }
   
   // Test popup with specific service ID
   function testPopupById(serviceId) {
       const buttons = document.querySelectorAll('[data-popup="popup-' + serviceId + '"]');
       if (buttons.length > 0) {
           buttons[0].click();
           console.log('✅ Popup opened for service:', serviceId);
       } else {
           console.warn('⚠️ No button found for service ID:', serviceId);
       }
   }
   
   // Close popup
   function closePopup() {
       const overlay = document.querySelector('.popup-overlay');
       if (overlay && overlay.classList.contains('active')) {
           overlay.classList.remove('active');
           document.body.style.overflow = '';
           console.log('✅ Popup closed');
       }
   }
   
   ──────────────────────────────────────────────
   TEST CAROUSEL:
   ──────────────────────────────────────────────
   
   // Check carousel state
   function debugCarousel() {
       const carousel = document.querySelector('.carousel-container');
       const slides = document.querySelectorAll('.carousel-slide');
       const activeSlide = document.querySelector('.carousel-slide.active');
       
       console.log('🎠 Carousel Debug:');
       console.log('Total slides:', slides.length);
       console.log('Active slide index:', Array.from(slides).indexOf(activeSlide));
       console.log('Active slide:', activeSlide);
   }
   
   // Navigate to specific slide
   function goToSlide(index) {
       const slides = document.querySelectorAll('.carousel-slide');
       if (index < 0 || index >= slides.length) {
           console.warn('⚠️ Invalid slide index:', index);
           return;
       }
       
       slides.forEach((slide, i) => {
           if (i === index) {
               slide.classList.add('active');
           } else {
               slide.classList.remove('active');
           }
       });
       console.log('✅ Navigated to slide:', index);
   }
   
   // Next slide
   function nextSlide() {
       const slides = document.querySelectorAll('.carousel-slide');
       const activeSlide = document.querySelector('.carousel-slide.active');
       const currentIndex = Array.from(slides).indexOf(activeSlide);
       const nextIndex = (currentIndex + 1) % slides.length;
       goToSlide(nextIndex);
   }
   
   // Previous slide
   function prevSlide() {
       const slides = document.querySelectorAll('.carousel-slide');
       const activeSlide = document.querySelector('.carousel-slide.active');
       const currentIndex = Array.from(slides).indexOf(activeSlide);
       const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
       goToSlide(prevIndex);
   }
   
   ──────────────────────────────────────────────
   TEST COUNTDOWN TIMER:
   ──────────────────────────────────────────────
   
   // Check countdown state
   function debugCountdown() {
       const countdownDisplay = document.querySelector('[data-countdown]');
       if (countdownDisplay) {
           console.log('⏱️ Countdown Display:');
           console.log('HTML:', countdownDisplay.innerHTML);
           console.log('Data attribute:', countdownDisplay.getAttribute('data-countdown'));
       } else {
           console.warn('⚠️ Countdown display not found');
       }
   }
   
   ──────────────────────────────────────────────
   TEST CALENDAR:
   ──────────────────────────────────────────────
   
   // Check calendar state
   function debugCalendar() {
       const calendar = document.querySelector('.calendar-grid');
       const days = document.querySelectorAll('.calendar-day');
       const highlightedDays = document.querySelectorAll('.calendar-day.highlighted');
       
       console.log('📅 Calendar Debug:');
       console.log('Calendar grid found:', !!calendar);
       console.log('Total days:', days.length);
       console.log('Highlighted travel dates:', highlightedDays.length);
       console.log('Travel dates:', Array.from(highlightedDays).map(d => d.textContent));
   }
   
   ──────────────────────────────────────────────
   TEST NAVIGATION:
   ──────────────────────────────────────────────
   
   // Check navigation state
   function debugNav() {
       const navMenu = document.querySelector('.mobile-nav-menu');
       const isOpen = navMenu?.classList.contains('open');
       
       console.log('🧭 Navigation Debug:');
       console.log('Nav menu found:', !!navMenu);
       console.log('Menu is open:', isOpen);
       console.log('Nav menu element:', navMenu);
   }
   
   // Toggle navigation menu
   function toggleNav() {
       const menuBtn = document.querySelector('.mobile-nav-toggle');
       if (menuBtn) {
           menuBtn.click();
           console.log('✅ Nav menu toggled');
       } else {
           console.warn('⚠️ Nav toggle button not found');
       }
   }
   
   ──────────────────────────────────────────────
   COMPREHENSIVE SYSTEM CHECK:
   ──────────────────────────────────────────────
   
   // Run all debug checks
   function systemCheck() {
       console.log('🔍 SYSTEM CHECK - ' + new Date().toLocaleTimeString());
       console.log('═'.repeat(50));
       
       console.group('📱 Viewport');
       console.log('Width:', window.innerWidth + 'px');
       console.log('Height:', window.innerHeight + 'px');
       console.log('Device Pixel Ratio:', window.devicePixelRatio);
       console.groupEnd();
       
       console.group('🧭 Navigation');
       debugNav();
       console.groupEnd();
       
       console.group('🎠 Carousel');
       debugCarousel();
       console.groupEnd();
       
       console.group('📅 Calendar');
       debugCalendar();
       console.groupEnd();
       
       console.group('⏱️ Countdown');
       debugCountdown();
       console.groupEnd();
       
       console.group('👤 About Me Animation');
       debugAboutMeAnimation();
       console.groupEnd();
       
       console.log('═'.repeat(50));
       console.log('✅ System check complete');
   }
   
   ──────────────────────────────────────────────
   USEFUL KEYBOARD SHORTCUTS (in console):
   ──────────────────────────────────────────────
   
   systemCheck()                     // Full system diagnostics
   debugAboutMeAnimation()           // Check about me cards
   forceAboutMeAnimation()           // Manually trigger animation
   resetAboutMeAnimation()           // Reset animation state
   testPopup()                       // Test first popup
   testPopupById(2)                  // Test specific popup
   closePopup()                      // Close current popup
   debugCarousel()                   // Check carousel state
   nextSlide()                       // Go to next slide
   prevSlide()                       // Go to previous slide
   goToSlide(0)                      // Go to specific slide
   debugCountdown()                  // Check countdown timer
   debugCalendar()                   // Check calendar
   debugNav()                        // Check navigation
   toggleNav()                       // Toggle mobile menu
   
*/
