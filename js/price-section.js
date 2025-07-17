/**
 * Prices Section - Responsive & Accessible JavaScript
 * Handles toggle functionality with proper ARIA attributes and smooth animations
 */

const priceSection = document.querySelector('.prices-grid');
const priceSectionButton = document.querySelector('.prices__button');
let isVisible = false;
let isAnimating = false;

// Initialize ARIA attributes
function initializeAccessibility() {
    priceSectionButton.setAttribute('aria-expanded', 'false');
    priceSectionButton.setAttribute('aria-controls', 'prices-grid');
    priceSection.setAttribute('id', 'prices-grid');
    priceSection.setAttribute('aria-hidden', 'true');
    priceSection.setAttribute('role', 'region');
    priceSection.setAttribute('aria-label', 'Список цен на услуги');
}

// Show prices section
function showPrices() {
    if (isAnimating) return;
    isAnimating = true;

    // Update ARIA attributes
    priceSectionButton.setAttribute('aria-expanded', 'true');
    priceSection.setAttribute('aria-hidden', 'false');

    // Show section with smooth animation
    priceSection.classList.add('visible');

    // Calculate height based on content
    const fullHeight = priceSection.scrollHeight;
    priceSection.style.height = fullHeight + 'px';

    // Update button text
    priceSectionButton.textContent = 'Спрятать цены';

    // Set height to auto after transition for flexibility
    const handleTransitionEnd = () => {
        priceSection.style.height = 'auto';
        isAnimating = false;
        priceSection.removeEventListener('transitionend', handleTransitionEnd);

        // Focus management for accessibility
        if (document.activeElement === priceSectionButton) {
            // Optionally focus first price card for screen readers
            const firstCard = priceSection.querySelector('.prices-card');
            if (firstCard) {
                firstCard.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                });
            }
        }
    };

    priceSection.addEventListener('transitionend', handleTransitionEnd, {
        once: true,
    });
}

// Hide prices section
function hidePrices() {
    if (isAnimating) return;
    isAnimating = true;

    // Update ARIA attributes
    priceSectionButton.setAttribute('aria-expanded', 'false');
    priceSection.setAttribute('aria-hidden', 'true');

    // Get current height for smooth animation
    const currentHeight = priceSection.scrollHeight;
    priceSection.style.height = currentHeight + 'px';

    // Force reflow
    void priceSection.offsetHeight;

    // Start hiding animation
    priceSection.style.height = '0';
    priceSection.classList.remove('visible');

    // Update button text
    priceSectionButton.textContent = 'Показать цены';

    // Handle animation end
    const handleTransitionEnd = () => {
        isAnimating = false;
        priceSection.removeEventListener('transitionend', handleTransitionEnd);
    };

    priceSection.addEventListener('transitionend', handleTransitionEnd, {
        once: true,
    });
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
priceSectionButton.addEventListener('click', togglePrices);

// Handle keyboard navigation
priceSectionButton.addEventListener('keydown', (e) => {
    // Enter or Space key
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        togglePrices();
    }
});

// Handle escape key to close when open
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isVisible) {
        hidePrices();
        isVisible = false;
        priceSectionButton.focus(); // Return focus to button
    }
});

// Responsive height recalculation on window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    if (!isVisible || isAnimating) return;

    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Recalculate height if section is visible
        if (priceSection.style.height === 'auto') {
            const newHeight = priceSection.scrollHeight;
            priceSection.style.height = newHeight + 'px';

            // Set back to auto after brief delay
            setTimeout(() => {
                priceSection.style.height = 'auto';
            }, 100);
        }
    }, 150);
});

// Initialize accessibility features when DOM is ready
document.addEventListener('DOMContentLoaded', initializeAccessibility);

// Fallback initialization if script loads after DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAccessibility);
} else {
    initializeAccessibility();
}

// Export functions for potential testing or external use
window.pricesSection = {
    show: showPrices,
    hide: hidePrices,
    toggle: togglePrices,
    isVisible: () => isVisible,
    isAnimating: () => isAnimating,
};
