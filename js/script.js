// ================================================
// 📦 MODULE IMPORTS
// ================================================
import './moon-phase.js';
import { initializeCountdown, cleanupCountdown } from './countdown-clock.js';
import Carousel from './carousel.js';
import { renderCalendar, startAutoUpdate } from './calendar.js';
import { initNav, destroyNav } from './nav.js';
import { initializeHeroButton, destroyHeroButton } from './hero-button.js';

// ================================================
// 🎴 SERVICE DATA - Popup Content
// ================================================
//
// 📋 Service descriptions for popup modals
// Each service has detailed information displayed when "Learn More" is clicked
// This data was migrated from HTML popup divs for better maintainability

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

// ------------------------------------------------------------------
// MOBILE NAVIGATION FUNCTIONALITY
// ------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    initNav();
});

// ------------------------------------------------------------------
// 🦸 HERO BUTTON FUNCTIONALITY
// ------------------------------------------------------------------

// Initialize hero button smooth scroll
document.addEventListener('DOMContentLoaded', () => {
    initializeHeroButton();
});

// Optional: Cleanup on page unload
window.addEventListener('beforeunload', () => {
    destroyHeroButton();
});

//   ================================================
//    👤 ABOUT ME SECTION - ANIMATION CONTROLLER
//   ================================================
/*  
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

//   ===================================
//    📱 RESPONSIVE BREAKPOINT CONSTANTS
//   ===================================

const BREAKPOINTS = {
    MOBILE: 599, // ≤599px: Single column layout
    TABLET: 991, // ≤991px: Two column layout with centered third card
    DESKTOP: Infinity, // >991px: Three column layout
};

//   ===================================
//    ⏱️ ANIMATION TIMING CONSTANTS
//   ===================================

const ANIMATION_CONFIG = {
    // IntersectionObserver thresholds
    VISIBILITY_THRESHOLD: 0.3, // Trigger when 30% of section is visible
    ROOT_MARGIN: '-10% 0px -10% 0px', // Start trigger slightly before section enters viewport

    // Timing for staggered appearance
    BROWSER_DELAY: 100, // Small delay between card animations (ms)

    // Resize debouncing
    RESIZE_DEBOUNCE_DELAY: 250, // Wait 250ms after last resize before updating (ms)
};

//  ===================================
//   🎬 ANIMATION DIRECTION CONFIGURATIONS
//  ===================================

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

//  ===================================
//   📦 ABOUT ME ANIMATION CLASS
//  ====================================

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

//   ===================================
//    🔧 DEBUG UTILITIES
//   ===================================

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

// ================================================
// 🎭 POPUP MANAGER - SERVICE DETAILS MODAL
// ================================================
//
// 📋 FEATURES:
// - Dynamically creates popup overlay and content
// - Displays detailed service information from SERVICE_DATA
// - Handles close events (button, outside click, ESC key)
// - Prevents body scroll when popup is open
//
// 🔗 INTEGRATION:
// Works with gallery-item-button clicks from carousel

/**
 * Manages popup modal for displaying service details
 * @class PopupManager
 */
class PopupManager {
    constructor() {
        this.createPopupElements();
        this.initializeEventListeners();
        console.log('✅ PopupManager initialized');
    }

    /**
     * Create popup DOM structure and append to body
     * @private
     */
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
        this.closeBtn.setAttribute('aria-label', 'Закрыть окно');

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

                // Get service ID from button's data attribute
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
     * Display popup with title and content
     * @public
     * @param {string} title - Popup title
     * @param {string} content - HTML content for popup body
     */
    show(title, content) {
        this.title.textContent = title;
        this.text.innerHTML = content;
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scroll

        // 🔧 DEBUG: Uncomment to log popup openings
        // console.log('📖 Popup opened:', title);
    }

    /**
     * Close popup and reset content
     * @public
     */
    close() {
        this.overlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll

        // Clear content after animation completes
        setTimeout(() => {
            this.title.textContent = '';
            this.text.innerHTML = '';
        }, 300); // Match CSS transition duration

        // 🔧 DEBUG: Uncomment to log popup closings
        // console.log('📕 Popup closed');
    }
}

// ================================================
// 🎯 UNIFIED INITIALIZATION
// ================================================
//
// All component initialization happens here in a single DOMContentLoaded event
// This prevents duplicate initializations and keeps code organized

document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 Initializing application components...');

    // Initialize popup system for service details
    const popupManager = new PopupManager();

    // Initialize carousel (SINGLE INITIALIZATION)
    const carousel = new Carousel();

    // Initialize About Me section animations
    const aboutMeAnimation = new AboutMeAnimation();

    console.log('✅ All components initialized successfully');
});

// ------------------------------------------------------------------
// ⏰ COUNTDOWN CLOCK - SINGLE INITIALIZATION POINT
// ------------------------------------------------------------------

/**
 * Initialize countdown timer
 * This is the ONLY place countdown should be initialized
 */
document.addEventListener('DOMContentLoaded', function () {
    console.log('🎯 Initializing countdown from script.js');
    initializeCountdown();
});

/**
 * Cleanup countdown on page unload
 * Prevents memory leaks
 */
window.addEventListener('beforeunload', function () {
    console.log('🧹 Cleaning up countdown');
    cleanupCountdown();
});

/*
## 🔍 VERIFICATION STEPS

After making these changes:

### **1. Clear Cache & Reload**
- Press `Ctrl + Shift + R` (Windows/Linux)
- Press `Cmd + Shift + R` (Mac)
- Or manually clear cache in DevTools

### **2. Check Console**
You should now see:
```
✅ Countdown configured for: [date]
✅ Countdown timer initialized successfully
*/

// ================================================
// 🌙 MOON PHASE SECTION
// ================================================
//
// ✅ FIXED: Removed duplicate initialization
// Moon phase now self-initializes via moon-phase.js
//
// 📋 OLD CODE (REMOVED):
// import { initializeMoonPhase } from './moon-phase.js';
// initializeMoonPhase();
//
// 📋 NEW BEHAVIOR:
// - moon-phase.js has its own DOMContentLoaded listener
// - Automatically initializes when loaded
// - No manual initialization needed here
//
// 🔗 DEPENDENCIES:
// - moon-phase.js (self-initializing module)
// - 08-moon-information-section-styles.css
// - index.html (moon section markup)
//
// 🎯 BENEFITS:
// - No duplicate initialization
// - Cleaner separation of concerns
// - Moon module is fully self-contained
//
// 🔧 DEBUG:
// To verify moon phase is loading correctly, check console for:
// "🚀 Initializing Moon Phase Module..."
// "✅ Moon Phase Module initialized"

// ------------------------------------------------------------------
// Calendar Section Logic with Auto-Update
// ------------------------------------------------------------------

// Initial Calendar render
renderCalendar();

//Start the calendar auto-update system
startAutoUpdate();
