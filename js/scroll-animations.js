/**
 * Unified Scroll Animation System
 * 
 * Extends scroll-triggered animations to all card-based sections
 * for consistent premium feel across the entire site
 */

/**
 * Observe cards and trigger animations when they enter viewport
 */
const observeCards = () => {
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: '-50px' // Start slightly before entering viewport
    });
    
    // Card selectors for all sections
    const cardSelectors = [
        '.about-me-card',
        '.prices-card',
        '.gallery-item'
    ];
    
    // Observe all cards
    cardSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(card => {
            cardObserver.observe(card);
        });
    });
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', observeCards);

// Re-observe if prices section becomes visible (dynamic content)
document.addEventListener('pricesVisible', observeCards);
