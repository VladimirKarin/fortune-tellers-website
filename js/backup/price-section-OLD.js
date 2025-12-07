/**
 * ===================================================================
 * PRICES SECTION - ENHANCED VERSION WITH DEBUGGING & SMOOTH ANIMATIONS
 * ===================================================================
 *
 * Управляет показом/скрытием секции с ценами с плавной анимацией
 * Включает отладку, accessibility и гибкие настройки
 * ИСПРАВЛЕНО: Устранены конфликты CSS классов с другими компонентами
 */

// ===================================================================
// НАСТРОЙКИ АНИМАЦИИ (можно изменять для тонкой настройки)
// ===================================================================

const ANIMATION_CONFIG = {
    // НАСТРОЙКА: Основная скорость анимации высоты (мс)
    MAIN_DURATION: 600,

    // НАСТРОЙКА: Задержка перед началом анимации карточек (мс)
    CARDS_START_DELAY: 200,

    // НАСТРОЙКА: Интервал между анимацией карточек (мс)
    CARDS_INTERVAL: 100,

    // НАСТРОЙКА: Задержка перед установкой height: auto (мс)
    AUTO_HEIGHT_DELAY: 50,

    // НАСТРОЙКА: Timeout для обработки изменения размера окна (мс)
    RESIZE_DEBOUNCE: 150,
};

// ===================================================================
// УНИКАЛЬНЫЕ CSS КЛАССЫ (избегаем конфликтов с другими компонентами)
// ===================================================================

const CSS_CLASSES = {
    // Основные классы секции
    SECTION_VISIBLE: 'prices-section-visible',
    SECTION_DEBUG: 'prices-debug-mode',

    // Классы анимации карточек (УНИКАЛЬНЫЕ, избегаем конфликта с AboutMe)
    CARD_ANIMATE_IN: 'prices-card-animate-in',
    CARD_ANIMATE_OUT: 'prices-card-animate-out',

    // Селекторы карточек
    PRICE_CARD: '.prices-card',
    EXPLANATION_CARD: '.prices-explanation-card',
};

// ===================================================================
// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ И DOM ЭЛЕМЕНТЫ
// ===================================================================

const priceSection = document.querySelector('.prices-grid');
const priceSectionButton = document.querySelector('.prices__button');

// Состояние компонента
let isVisible = false;
let isAnimating = false;

// ===================================================================
// ОТЛАДОЧНЫЕ ФУНКЦИИ
// ===================================================================

/**
 * Централизованная функция отладки
 * НАСТРОЙКА: Можно отключить логи, изменив на false
 */
const DEBUG_ENABLED = true;

function debugLog(message, data = '') {
    if (DEBUG_ENABLED) {
        console.log(`[Prices Debug] ${message}`, data);
    }
}

/**
 * Функция для тестирования видимости элементов
 * Вызывается через window.testPrices() в консоли
 */
function testVisibility() {
    debugLog('=== TESTING VISIBILITY ===');
    debugLog('Section exists:', !!priceSection);
    debugLog('Button exists:', !!priceSectionButton);

    if (priceSection) {
        debugLog('Section styles:', {
            display: getComputedStyle(priceSection).display,
            height: getComputedStyle(priceSection).height,
            opacity: getComputedStyle(priceSection).opacity,
            overflow: getComputedStyle(priceSection).overflow,
        });

        // Проверяем карточки цен
        const priceCards = priceSection.querySelectorAll(
            CSS_CLASSES.PRICE_CARD
        );
        const explanationCards = priceSection.querySelectorAll(
            CSS_CLASSES.EXPLANATION_CARD
        );

        debugLog('Price cards found:', priceCards.length);
        debugLog('Explanation cards found:', explanationCards.length);

        if (priceCards.length > 0) {
            debugLog('First price card styles:', {
                display: getComputedStyle(priceCards[0]).display,
                opacity: getComputedStyle(priceCards[0]).opacity,
                transform: getComputedStyle(priceCards[0]).transform,
            });
        }

        // Проверяем текущие CSS классы
        debugLog('Section CSS classes:', priceSection.className);
        debugLog(
            'Cards with animation class:',
            priceSection.querySelectorAll(`.${CSS_CLASSES.CARD_ANIMATE_IN}`)
                .length
        );
    }
    debugLog('=== END TEST ===');
}

/**
 * Проверка конфликтов с другими компонентами
 */
function checkForConflicts() {
    debugLog('=== CHECKING FOR CONFLICTS ===');

    // Проверяем конфликт с AboutMe анимацией
    const aboutMeCards = document.querySelectorAll('.about-me-card.animate-in');
    if (aboutMeCards.length > 0) {
        debugLog(
            '⚠️ Found AboutMe cards with animate-in class:',
            aboutMeCards.length
        );
        debugLog('✅ Using unique class names to avoid conflicts');
    }

    // Проверяем глобальные объекты
    const globalConflicts = [];
    if (window.pricesSection) globalConflicts.push('pricesSection');
    if (window.testPrices) globalConflicts.push('testPrices');

    debugLog(
        'Global objects status:',
        globalConflicts.length > 0
            ? `Will override: ${globalConflicts.join(', ')}`
            : 'No conflicts'
    );

    debugLog('=== END CONFLICT CHECK ===');
}

// ===================================================================
// ACCESSIBILITY ИНИЦИАЛИЗАЦИЯ
// ===================================================================

/**
 * Настраивает ARIA атрибуты для доступности
 * Важно для screen readers и клавиатурной навигации
 */
function initializeAccessibility() {
    if (!priceSectionButton || !priceSection) {
        debugLog('ERROR: Critical elements not found!', {
            button: !!priceSectionButton,
            section: !!priceSection,
        });
        return false;
    }

    // Настройка кнопки
    priceSectionButton.setAttribute('aria-expanded', 'false');
    priceSectionButton.setAttribute('aria-controls', 'prices-grid');

    // Настройка секции
    priceSection.setAttribute('id', 'prices-grid');
    priceSection.setAttribute('aria-hidden', 'true');
    priceSection.setAttribute('role', 'region');
    priceSection.setAttribute('aria-label', 'Список цен на услуги');

    debugLog('✅ Accessibility initialized successfully');
    return true;
}

// ===================================================================
// АНИМАЦИЯ КАРТОЧЕК (с уникальными классами)
// ===================================================================

/**
 * Анимирует появление карточек цен
 * Использует уникальные CSS классы для избежания конфликтов
 */
function animateCardsIn() {
    const allCards = priceSection.querySelectorAll(
        `${CSS_CLASSES.PRICE_CARD}, ${CSS_CLASSES.EXPLANATION_CARD}`
    );

    debugLog('Found cards for animation:', allCards.length);

    if (allCards.length === 0) {
        debugLog('⚠️ No cards found - check CSS selectors');
        return;
    }

    // Анимируем каждую карточку с интервалом
    allCards.forEach((card, index) => {
        setTimeout(() => {
            // Убираем класс "выхода" если есть
            card.classList.remove(CSS_CLASSES.CARD_ANIMATE_OUT);
            // Добавляем уникальный класс анимации "входа"
            card.classList.add(CSS_CLASSES.CARD_ANIMATE_IN);

            debugLog(`Card ${index + 1} animated in`);
        }, index * ANIMATION_CONFIG.CARDS_INTERVAL);
    });
}

/**
 * Анимирует исчезновение карточек цен
 */
function animateCardsOut() {
    const allCards = priceSection.querySelectorAll(
        `${CSS_CLASSES.PRICE_CARD}, ${CSS_CLASSES.EXPLANATION_CARD}`
    );

    debugLog('Animating cards out:', allCards.length);

    allCards.forEach((card, index) => {
        // Убираем класс "входа"
        card.classList.remove(CSS_CLASSES.CARD_ANIMATE_IN);
        // Можно добавить класс "выхода" если нужна анимация исчезновения
        card.classList.add(CSS_CLASSES.CARD_ANIMATE_OUT);

        // Через короткое время убираем и класс выхода
        setTimeout(() => {
            card.classList.remove(CSS_CLASSES.CARD_ANIMATE_OUT);
        }, 200);
    });
}

// ===================================================================
// АНИМАЦИЯ ПОКАЗА СЕКЦИИ
// ===================================================================

/**
 * Показывает секцию цен с плавной анимацией
 * Упрощенная версия без сложных event listeners
 */
function showPrices() {
    // Проверка возможности выполнения анимации
    if (isAnimating || !priceSection || !priceSectionButton) {
        debugLog('Show animation cancelled', {
            isAnimating,
            hasSection: !!priceSection,
            hasButton: !!priceSectionButton,
        });
        return;
    }

    debugLog('🟢 Starting show animation');
    isAnimating = true;

    // ===================================================================
    // ОБНОВЛЕНИЕ ACCESSIBILITY АТРИБУТОВ
    // ===================================================================
    priceSectionButton.setAttribute('aria-expanded', 'true');
    priceSection.setAttribute('aria-hidden', 'false');

    // ===================================================================
    // ПОДГОТОВКА К АНИМАЦИИ
    // ===================================================================

    // Делаем элемент видимым для расчета высоты
    priceSection.style.display = 'grid';
    priceSection.style.height = 'auto';
    priceSection.style.opacity = '0';

    // Получаем реальную высоту контента
    const fullHeight = priceSection.scrollHeight;
    debugLog('Calculated section height:', fullHeight + 'px');

    // Устанавливаем начальные значения для анимации
    priceSection.style.height = '0';
    priceSection.style.opacity = '0';

    // Принудительный reflow для применения стилей
    void priceSection.offsetHeight;

    // Добавляем уникальный класс для CSS анимаций
    priceSection.classList.add(CSS_CLASSES.SECTION_VISIBLE);

    // ===================================================================
    // ЗАПУСК ОСНОВНОЙ АНИМАЦИИ ВЫСОТЫ
    // ===================================================================

    setTimeout(() => {
        priceSection.style.height = fullHeight + 'px';
        priceSection.style.opacity = '1';
        debugLog('Height animation started');
    }, ANIMATION_CONFIG.AUTO_HEIGHT_DELAY);

    // Обновляем текст кнопки
    priceSectionButton.textContent = 'Спрятать цены';

    // ===================================================================
    // АНИМАЦИЯ КАРТОЧЕК С ЗАДЕРЖКОЙ
    // ===================================================================

    setTimeout(() => {
        animateCardsIn();
    }, ANIMATION_CONFIG.CARDS_START_DELAY);

    // ===================================================================
    // ЗАВЕРШЕНИЕ АНИМАЦИИ
    // ===================================================================

    setTimeout(() => {
        // Устанавливаем auto для responsive поведения
        priceSection.style.height = 'auto';
        isAnimating = false;
        debugLog('✅ Show animation completed');

        // Focus management для accessibility
        handleFocusManagement();
    }, ANIMATION_CONFIG.MAIN_DURATION);
}

// ===================================================================
// АНИМАЦИЯ СКРЫТИЯ СЕКЦИИ
// ===================================================================

/**
 * Скрывает секцию цен с плавной анимацией
 */
function hidePrices() {
    // Проверка возможности выполнения анимации
    if (isAnimating || !priceSection || !priceSectionButton) {
        debugLog('Hide animation cancelled', {
            isAnimating,
            hasSection: !!priceSection,
            hasButton: !!priceSectionButton,
        });
        return;
    }

    debugLog('🔴 Starting hide animation');
    isAnimating = true;

    // ===================================================================
    // ОБНОВЛЕНИЕ ACCESSIBILITY АТРИБУТОВ
    // ===================================================================
    priceSectionButton.setAttribute('aria-expanded', 'false');
    priceSection.setAttribute('aria-hidden', 'true');

    // ===================================================================
    // АНИМАЦИЯ ИСЧЕЗНОВЕНИЯ КАРТОЧЕК
    // ===================================================================
    animateCardsOut();

    // ===================================================================
    // ПОДГОТОВКА К АНИМАЦИИ СКРЫТИЯ
    // ===================================================================

    // Получаем текущую высоту для плавного сворачивания
    const currentHeight = priceSection.scrollHeight;
    priceSection.style.height = currentHeight + 'px';

    // Принудительный reflow
    void priceSection.offsetHeight;

    // Убираем класс видимости
    priceSection.classList.remove(CSS_CLASSES.SECTION_VISIBLE);

    // ===================================================================
    // ЗАПУСК АНИМАЦИИ СВОРАЧИВАНИЯ
    // ===================================================================

    setTimeout(() => {
        priceSection.style.height = '0';
        priceSection.style.opacity = '0';
        debugLog('Collapse animation started');
    }, ANIMATION_CONFIG.AUTO_HEIGHT_DELAY);

    // Обновляем текст кнопки
    priceSectionButton.textContent = 'Показать цены';

    // ===================================================================
    // ЗАВЕРШЕНИЕ АНИМАЦИИ
    // ===================================================================

    setTimeout(() => {
        isAnimating = false;
        debugLog('✅ Hide animation completed');
    }, ANIMATION_CONFIG.MAIN_DURATION);
}

// ===================================================================
// УПРАВЛЕНИЕ ФОКУСОМ (ACCESSIBILITY)
// ===================================================================

/**
 * Управляет фокусом для улучшения accessibility
 */
function handleFocusManagement() {
    if (document.activeElement === priceSectionButton) {
        const firstCard = priceSection.querySelector(CSS_CLASSES.PRICE_CARD);
        if (firstCard) {
            firstCard.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
            debugLog('Focus scrolled to first card');
        }
    }
}

// ===================================================================
// ОСНОВНАЯ ФУНКЦИЯ ПЕРЕКЛЮЧЕНИЯ
// ===================================================================

/**
 * Переключает видимость секции цен
 * Главная функция, вызываемая при клике на кнопку
 */
function togglePrices() {
    if (isAnimating) {
        debugLog('⏸️ Toggle cancelled - animation in progress');
        return;
    }

    debugLog('🔄 Toggling prices section', { currentState: isVisible });

    if (!isVisible) {
        showPrices();
    } else {
        hidePrices();
    }

    // Обновляем состояние
    isVisible = !isVisible;
}

// ===================================================================
// ОБРАБОТЧИКИ СОБЫТИЙ
// ===================================================================

/**
 * Обработка клика по кнопке
 */
function handleButtonClick() {
    debugLog('👆 Button clicked');
    togglePrices();
}

/**
 * Обработка клавиатурной навигации
 * Enter и Space активируют переключение
 */
function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        debugLog('⌨️ Keyboard toggle activated', { key: e.key });
        togglePrices();
    }
}

/**
 * Обработка клавиши Escape для закрытия
 */
function handleEscapeKey(e) {
    if (e.key === 'Escape' && isVisible && priceSectionButton) {
        debugLog('⎋ Escape key pressed - closing prices');
        hidePrices();
        isVisible = false;
        priceSectionButton.focus(); // Возвращаем фокус на кнопку
    }
}

// ===================================================================
// ОБРАБОТКА ИЗМЕНЕНИЯ РАЗМЕРА ОКНА
// ===================================================================

/**
 * Обрабатывает изменение размера окна для responsive поведения
 * НАСТРОЙКА: Debounce timeout можно изменить в ANIMATION_CONFIG
 */
let resizeTimeout;
function handleResize() {
    if (!isVisible || isAnimating || !priceSection) return;

    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        debugLog('📐 Handling window resize');

        // Пересчитываем высоту только если секция открыта
        if (priceSection.style.height === 'auto') {
            // Временно скрываем для точного расчета
            priceSection.style.visibility = 'hidden';
            const newHeight = priceSection.scrollHeight;
            priceSection.style.visibility = 'visible';
            priceSection.style.height = newHeight + 'px';

            debugLog('Recalculated height:', newHeight + 'px');

            // Возвращаем auto после небольшой задержки
            setTimeout(() => {
                if (priceSection) {
                    priceSection.style.height = 'auto';
                }
            }, 100);
        }
    }, ANIMATION_CONFIG.RESIZE_DEBOUNCE);
}

// ===================================================================
// ИНИЦИАЛИЗАЦИЯ СОБЫТИЙ
// ===================================================================

/**
 * Инициализирует все обработчики событий
 * Удаляет существующие для предотвращения дублирования
 */
function initializeEvents() {
    if (!priceSectionButton) {
        debugLog('❌ Button not found - cannot initialize events');
        return false;
    }

    // Удаляем существующие listeners для предотвращения дублирования
    priceSectionButton.removeEventListener('click', handleButtonClick);
    priceSectionButton.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keydown', handleEscapeKey);
    window.removeEventListener('resize', handleResize);

    // Добавляем новые listeners
    priceSectionButton.addEventListener('click', handleButtonClick);
    priceSectionButton.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', handleEscapeKey);
    window.addEventListener('resize', handleResize);

    debugLog('✅ Event listeners initialized successfully');
    return true;
}

// ===================================================================
// ГЛАВНАЯ ФУНКЦИЯ ИНИЦИАЛИЗАЦИИ
// ===================================================================

/**
 * Главная функция инициализации компонента
 * Вызывается при загрузке DOM
 */
function initialize() {
    debugLog('🚀 Starting prices section initialization...');

    // Проверяем конфликты перед инициализацией
    checkForConflicts();

    const accessibilityOk = initializeAccessibility();
    const eventsOk = initializeEvents();

    if (accessibilityOk && eventsOk) {
        debugLog('✅ Prices section initialized successfully');
        debugLog('🎨 Using unique CSS classes:', CSS_CLASSES);

        // Добавляем глобальные функции для отладки
        if (typeof window !== 'undefined') {
            window.testPrices = testVisibility;
            debugLog('🔧 Debug functions available:');
            debugLog('  - testPrices() - диагностика элементов');
            debugLog('  - pricesSection.debug() - режим отладки');
            debugLog('  - pricesSection.config - настройки анимации');
        }
    } else {
        debugLog('❌ Initialization failed - some components missing');
    }
}

// ===================================================================
// DOM ГОТОВНОСТЬ И ЗАПУСК
// ===================================================================

/**
 * Проверка готовности DOM и инициализация
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}

/**
 * Fallback инициализация с задержкой
 * На случай если элементы загружаются асинхронно
 */
setTimeout(() => {
    if (!priceSectionButton || !priceSection) {
        debugLog('🔄 Fallback initialization triggered');
        initialize();
    }
}, 100);

// ===================================================================
// ЭКСПОРТ ДЛЯ ВНЕШНЕГО ИСПОЛЬЗОВАНИЯ И ОТЛАДКИ
// ===================================================================

/**
 * Глобальный объект для управления и отладки
 * Доступен через window.pricesSection
 * НЕ КОНФЛИКТУЕТ с другими компонентами благодаря уникальному имени
 */
if (typeof window !== 'undefined') {
    window.pricesSection = {
        // Основные методы управления
        show: showPrices,
        hide: hidePrices,
        toggle: togglePrices,

        // Геттеры состояния
        isVisible: () => isVisible,
        isAnimating: () => isAnimating,

        // Отладочные методы
        test: testVisibility,
        checkConflicts: checkForConflicts,
        debug: () => {
            // Переключает отладочные стили с уникальным классом
            priceSection?.classList.toggle(CSS_CLASSES.SECTION_DEBUG);
            debugLog('🐛 Debug mode toggled');
        },

        // Переинициализация (для разработки)
        reinitialize: initialize,

        // Доступ к конфигурации и классам
        config: ANIMATION_CONFIG,
        classes: CSS_CLASSES,

        // Информация о версии и совместимости
        version: '2.0.0',
        compatibility: {
            aboutMeConflict: false, // Устранен благодаря уникальным классам
            globalNamespace: 'pricesSection', // Уникальное имя в window
        },
    };

    debugLog('🌐 Global pricesSection object created');
    debugLog('📋 Available methods:', Object.keys(window.pricesSection));
}
