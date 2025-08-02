/**
 * Prices Section - Responsive & Accessible JavaScript
 * Улучшенная плавная анимация без рывков
 */

const priceSection = document.querySelector('.prices-grid');
const priceSectionButton = document.querySelector('.prices__button');
let isVisible = false;
let isAnimating = false;

// Initialize ARIA attributes
function initializeAccessibility() {
    if (!priceSectionButton || !priceSection) return;

    priceSectionButton.setAttribute('aria-expanded', 'false');
    priceSectionButton.setAttribute('aria-controls', 'prices-grid');
    priceSection.setAttribute('id', 'prices-grid');
    priceSection.setAttribute('aria-hidden', 'true');
    priceSection.setAttribute('role', 'region');
    priceSection.setAttribute('aria-label', 'Список цен на услуги');
}

// Show prices section с улучшенной анимацией
function showPrices() {
    if (isAnimating || !priceSection || !priceSectionButton) return;
    isAnimating = true;

    // Update ARIA attributes
    priceSectionButton.setAttribute('aria-expanded', 'true');
    priceSection.setAttribute('aria-hidden', 'false');

    // Сначала делаем элемент видимым для расчета высоты
    priceSection.style.display = 'grid';
    priceSection.style.visibility = 'hidden';
    priceSection.style.height = 'auto';
    priceSection.style.opacity = '0';

    // Получаем реальную высоту контента
    const fullHeight = priceSection.scrollHeight;

    // Возвращаем в исходное состояние
    priceSection.style.height = '0';
    priceSection.style.visibility = 'visible';

    // Принудительный reflow
    void priceSection.offsetHeight;

    // Добавляем класс для анимации карточек
    priceSection.classList.add('visible');

    // Запускаем анимацию высоты
    requestAnimationFrame(() => {
        priceSection.style.height = fullHeight + 'px';
    });

    // Update button text
    priceSectionButton.textContent = 'Спрятать цены';

    // Обработка окончания анимации
    const handleTransitionEnd = (e) => {
        // Проверяем, что это именно наша анимация height
        if (e.target === priceSection && e.propertyName === 'height') {
            priceSection.style.height = 'auto';
            isAnimating = false;
            priceSection.removeEventListener(
                'transitionend',
                handleTransitionEnd
            );

            // Focus management for accessibility
            if (document.activeElement === priceSectionButton) {
                const firstCard = priceSection.querySelector('.prices-card');
                if (firstCard) {
                    firstCard.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                    });
                }
            }
        }
    };

    priceSection.addEventListener('transitionend', handleTransitionEnd);

    // Fallback timeout для случаев, когда transitionend не срабатывает
    setTimeout(() => {
        if (isAnimating) {
            priceSection.style.height = 'auto';
            isAnimating = false;
        }
    }, 1000); // 0.5s animation + buffer
}

// Hide prices section с улучшенной анимацией
function hidePrices() {
    if (isAnimating || !priceSection || !priceSectionButton) return;
    isAnimating = true;

    // Update ARIA attributes
    priceSectionButton.setAttribute('aria-expanded', 'false');
    priceSection.setAttribute('aria-hidden', 'true');

    // Получаем текущую высоту
    const currentHeight = priceSection.scrollHeight;
    priceSection.style.height = currentHeight + 'px';

    // Принудительный reflow
    void priceSection.offsetHeight;

    // Убираем класс для анимации карточек
    priceSection.classList.remove('visible');

    // Запускаем анимацию сворачивания
    requestAnimationFrame(() => {
        priceSection.style.height = '0';
    });

    // Update button text
    priceSectionButton.textContent = 'Показать цены';

    // Обработка окончания анимации
    const handleTransitionEnd = (e) => {
        if (e.target === priceSection && e.propertyName === 'height') {
            isAnimating = false;
            priceSection.removeEventListener(
                'transitionend',
                handleTransitionEnd
            );
        }
    };

    priceSection.addEventListener('transitionend', handleTransitionEnd);

    // Fallback timeout
    setTimeout(() => {
        if (isAnimating) {
            isAnimating = false;
        }
    }, 1000);
}

// Main toggle function
function togglePrices() {
    if (isAnimating) return;

    if (!isVisible) {
        showPrices();
    } else {
        hidePrices();
    }

    isVisible = !isVisible;
}

// Handle button clicks
function handleButtonClick() {
    togglePrices();
}

// Handle keyboard navigation
function handleKeyDown(e) {
    // Enter or Space key
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        togglePrices();
    }
}

// Handle escape key to close when open
function handleEscapeKey(e) {
    if (e.key === 'Escape' && isVisible && priceSectionButton) {
        hidePrices();
        isVisible = false;
        priceSectionButton.focus(); // Return focus to button
    }
}

// Улучшенная обработка изменения размера окна
let resizeTimeout;
function handleResize() {
    if (!isVisible || isAnimating || !priceSection) return;

    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (priceSection.style.height === 'auto') {
            // Временно скрываем для пересчета
            priceSection.style.visibility = 'hidden';
            const newHeight = priceSection.scrollHeight;
            priceSection.style.visibility = 'visible';
            priceSection.style.height = newHeight + 'px';

            setTimeout(() => {
                if (priceSection) {
                    priceSection.style.height = 'auto';
                }
            }, 100);
        }
    }, 150);
}

// Функция инициализации событий
function initializeEvents() {
    if (!priceSectionButton) return;

    // Remove existing event listeners to prevent duplicates
    priceSectionButton.removeEventListener('click', handleButtonClick);
    priceSectionButton.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keydown', handleEscapeKey);
    window.removeEventListener('resize', handleResize);

    // Add event listeners
    priceSectionButton.addEventListener('click', handleButtonClick);
    priceSectionButton.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', handleEscapeKey);
    window.addEventListener('resize', handleResize);
}

// Initialize everything when DOM is ready
function initialize() {
    initializeAccessibility();
    initializeEvents();
}

// DOM готовность check
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}

// Fallback initialization для случаев позднего загрузки скрипта
setTimeout(() => {
    if (!priceSectionButton || !priceSection) {
        initialize();
    }
}, 100);

// Export functions for potential testing or external use
if (typeof window !== 'undefined') {
    window.pricesSection = {
        show: showPrices,
        hide: hidePrices,
        toggle: togglePrices,
        isVisible: () => isVisible,
        isAnimating: () => isAnimating,
        initialize: initialize,
    };
}
