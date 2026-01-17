/**
 * 🔮 Mystic Scroll Animations
 * Handles the revelation of elements as they enter the viewport.
 * Adds 'is-visible' class to elements with 'animate-on-scroll'.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Observer options: Trigger when 10% of the element is visible
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the class that triggers the CSS animation
                entry.target.classList.add('is-visible');
                
                // Optional: Stop observing once revealed (for one-time animation)
                observer.unobserve(entry.target); 
            }
        });
    };

    const observer = new IntersectionObserver(revealCallback, observerOptions);

    // Target elements to animate
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    // Also target specific premium elements automatically
    const premiumElements = document.querySelectorAll('.service-card, .footer-grid, .hero-content > *');

    [...animatedElements, ...premiumElements].forEach(el => {
        if (el) {
            el.classList.add('animate-on-scroll'); // Ensure class exists
            observer.observe(el);
        }
    });
});
