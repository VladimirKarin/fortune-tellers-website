/* ================================================
   🔧 DEBUG UTILITIES - MOVE TO DEV FILE LATER
   ================================================ */

//   📊 Console Testing Commands:
//   Copy these to browser console for debugging

/* ──────────────────────────────────────────────
   TEST ABOUT ME ANIMATIONS:
   ────────────────────────────────────────────── */

// Check current animation state
function debugAboutMeAnimation() {
    const section = document.querySelector('.about-me-section');
    const cards = document.querySelectorAll('.about-me-card');

    const width = window.innerWidth;
    const breakpoint =
        width <= 599 ? 'MOBILE' : width <= 991 ? 'TABLET' : 'DESKTOP';

    console.log('📍 Current breakpoint:', breakpoint, `(${width}px)`);
    console.log('🎬 Cards found:', cards.length);

    cards.forEach((card, i) => {
        const classes = Array.from(card.classList);
        const hasAnimated = card.classList.contains('animate-in');
        console.log(`Card ${i + 1}:`, {
            classes,
            animated: hasAnimated,
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
    document.querySelectorAll('.about-me-card').forEach((card) => {
        card.classList.remove('animate-in');
    });
    console.log('✅ Animation reset');
}

/* ──────────────────────────────────────────────
   TEST POPUP SYSTEM:
   ────────────────────────────────────────────── */

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
    const buttons = document.querySelectorAll(
        '[data-popup="popup-' + serviceId + '"]'
    );
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

/* ──────────────────────────────────────────────
   TEST CAROUSEL:
   ────────────────────────────────────────────── */

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

/* ──────────────────────────────────────────────
   TEST COUNTDOWN TIMER:
   ────────────────────────────────────────────── */

// Check countdown state
function debugCountdown() {
    const countdownDisplay = document.querySelector('[data-countdown]');
    if (countdownDisplay) {
        console.log('⏱️ Countdown Display:');
        console.log('HTML:', countdownDisplay.innerHTML);
        console.log(
            'Data attribute:',
            countdownDisplay.getAttribute('data-countdown')
        );
    } else {
        console.warn('⚠️ Countdown display not found');
    }
}

/* ──────────────────────────────────────────────
   TEST CALENDAR:
   ────────────────────────────────────────────── */

// Check calendar state
function debugCalendar() {
    const calendar = document.querySelector('.calendar-grid');
    const days = document.querySelectorAll('.calendar-day');
    const highlightedDays = document.querySelectorAll(
        '.calendar-day.highlighted'
    );

    console.log('📅 Calendar Debug:');
    console.log('Calendar grid found:', !!calendar);
    console.log('Total days:', days.length);
    console.log('Highlighted travel dates:', highlightedDays.length);
    console.log(
        'Travel dates:',
        Array.from(highlightedDays).map((d) => d.textContent)
    );
}

/* ──────────────────────────────────────────────
   TEST NAVIGATION:
   ────────────────────────────────────────────── */

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

/* ──────────────────────────────────────────────
   COMPREHENSIVE SYSTEM CHECK:
   ────────────────────────────────────────────── */

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

/* ──────────────────────────────────────────────
   USEFUL KEYBOARD SHORTCUTS (in console):
   ────────────────────────────────────────────── */

systemCheck(); // Full system diagnostics
debugAboutMeAnimation(); // Check about me cards
forceAboutMeAnimation(); // Manually trigger animation
resetAboutMeAnimation(); // Reset animation state
testPopup(); // Test first popup
testPopupById(2); // Test specific popup
closePopup(); // Close current popup
debugCarousel(); // Check carousel state
nextSlide(); // Go to next slide
prevSlide(); // Go to previous slide
goToSlide(0); // Go to specific slide
debugCountdown(); // Check countdown timer
debugCalendar(); // Check calendar
debugNav(); // Check navigation
toggleNav(); // Toggle mobile menu
