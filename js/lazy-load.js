/**
 * Enhanced Lazy Loading System
 * 
 * Adds smooth fade-in animation to lazy-loaded images
 * Uses Intersection Observer for better performance
 */

document.addEventListener('DOMContentLoaded', () => {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Add loading class when image is about to enter viewport
                img.classList.add('lazy-loading');
                
                // When image loads, add loaded class for fade-in
                img.addEventListener('load', () => {
                    img.classList.remove('lazy-loading');
                    img.classList.add('lazy-loaded');
                });
                
                // Stop observing this image
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px' // Start loading 50px before entering viewport
    });
    
    // Observe all lazy-loaded images
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
    });
});
