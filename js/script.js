import { timer } from './countdown-clock.js';

// ------------------------------------------------------------------
// MOBILE NAVIGATION FUNCTIONALITY
// ------------------------------------------------------------------

// Toggle mobile navigation menu visibility
const toggleMobileNav = () => {
    const headerElement = document.querySelector('header');
    headerElement.classList.toggle('nav-open');
};

// Add click event to the mobile navigation button
const navigationButtonElement = document.querySelector('.btn-mobile-nav');
navigationButtonElement.addEventListener('click', toggleMobileNav);

// Show/hide mobile navigation and toggle between open/close icons
document
    .querySelector('.btn-mobile-nav')
    .addEventListener('click', function () {
        const nav = document.querySelector('.main-nav');
        const openIcon = document.querySelector(
            ".icon-mobile-nav[name='color-wand']"
        );
        const closeIcon = document.querySelector(
            ".icon-mobile-nav[name='close']"
        );

        if (nav.style.display === 'block') {
            nav.style.display = 'none';
            openIcon.style.display = 'block';
            closeIcon.style.display = 'none';
        } else {
            nav.style.display = 'block';
            openIcon.style.display = 'none';
            closeIcon.style.display = 'block';
        }
    });

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

class Carousel {
    constructor() {
        this.init();
    }

    init() {
        this.galleryContainer = document.querySelector('.gallery-container');
        this.galleryItems = document.querySelectorAll('.gallery-item');
        this.prevButton = document.querySelector('.gallery-controls-previous');
        this.nextButton = document.querySelector('.gallery-controls-next');
        this.indicators = document.querySelectorAll('.gallery-indicator');

        this.itemsArray = Array.from(this.galleryItems);
        this.currentIndex = 0;

        this.setupEventListeners();
        this.updateGallery();
    }

    setupEventListeners() {
        if (this.prevButton) {
            this.prevButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.moveToPrevSlide();
            });
        }

        if (this.nextButton) {
            this.nextButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.moveToNextSlide();
            });
        }

        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.moveToSlide(index));
        });

        // Touch events
        let touchStartX = 0;
        this.galleryContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        this.galleryContainer.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const minSwipeDistance = 50;

            if (touchEndX < touchStartX - minSwipeDistance) {
                this.moveToNextSlide();
            } else if (touchEndX > touchStartX + minSwipeDistance) {
                this.moveToPrevSlide();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.moveToPrevSlide();
            } else if (e.key === 'ArrowRight') {
                this.moveToNextSlide();
            }
        });
    }

    updateGallery() {
        this.itemsArray.forEach((item, index) => {
            item.classList.remove(
                'gallery-item-1',
                'gallery-item-2',
                'gallery-item-3',
                'gallery-item-4',
                'gallery-item-5'
            );

            let position =
                (index - this.currentIndex + this.itemsArray.length) %
                this.itemsArray.length;

            if (position < 5) {
                item.classList.add(`gallery-item-${position + 1}`);
                item.style.opacity = '';
            } else {
                item.style.opacity = '0';
            }
        });

        this.updateIndicators();
    }

    moveToNextSlide() {
        // Fix: Changed from subtract to add for next slide
        this.currentIndex = (this.currentIndex + 1) % this.itemsArray.length;
        this.updateGallery();
    }

    moveToPrevSlide() {
        // Fix: Changed from add to subtract for previous slide
        this.currentIndex =
            (this.currentIndex - 1 + this.itemsArray.length) %
            this.itemsArray.length;
        this.updateGallery();
    }

    moveToSlide(index) {
        this.currentIndex = index;
        this.updateGallery();
    }

    updateIndicators() {
        const activeItem = document.querySelector('.gallery-item-3');

        if (activeItem && this.indicators.length > 0) {
            const activeIndex = activeItem.getAttribute('data-index');

            this.indicators.forEach((indicator) => {
                indicator.classList.remove('active');
                if (indicator.getAttribute('data-index') === activeIndex) {
                    indicator.classList.add('active');
                }
            });
        }
    }
}

// ------------------------------------------------------------------
// INITIALIZATION
// ------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function () {
    const popupManager = new PopupManager();
    const carousel = new Carousel();
});

// ------------------------------------------------------------------
// Countdown clock
// ------------------------------------------------------------------

window.onload = function () {
    timer();
    setInterval(timer, 1000);
};

// ------------------------------------------------------------------
// Price Section Logic
// ------------------------------------------------------------------

const priceSection = document.querySelector('.prices-grid');
const priceSectionButton = document.querySelector('.prices__button');
let isVisible = false;

priceSectionButton.addEventListener('click', () => {
    if (!isVisible) {
        //Showing section
        priceSection.classList.add('visible');
        const fullHeight = priceSection.scrollHeight;
        priceSection.style.height = fullHeight + 'px';

        // Clear height after transition to let content be flexible
        priceSection.addEventListener('transitioned', function removeHeight() {
            priceSection.style.height = auto;
            priceSection.removeEventListener('transitioned', removeHeight);
        });

        //Changing button name
        priceSectionButton.textContent = 'Спрятать цены';
    } else {
        //Hiding section
        const currentHeight = priceSection.scrollHeight;
        //Setting currentHeight to start transition
        priceSection.style.height = currentHeight + 'px';

        //Force flow
        void priceSection.offsetHeight;
        priceSection.style.height = '0';
        priceSection.classList.remove('visible');

        priceSectionButton.textContent = 'Показать цены';
    }
    isVisible = !isVisible;
});

// ------------------------------------------------------------------
// Moon Phase Section Logic
// ------------------------------------------------------------------

// ------------------ Moon Phase Localized Data ------------------

const moonPhaseInformation = {
    newMoon: {
        moonPhaseNameRussian: 'Новолуние',
        moonPhaseNameLithuanian: 'Jaunatis',
        moonPhaseImage:
            './img/moon-information-pictures/moon-phase-1-new-moon.png',
        moonPhaseRitualsRussian: ['Первый', 'Второй', 'Третий'],
        moonPhaseRitualsLithuanian: ['Pirmas', 'Antras', 'Trecias'],
    },

    waxingMoon: {
        moonPhaseNameRussian: 'Растущая луна',
        moonPhaseNameLithuanian: 'Augantis mėnulis',
        moonPhaseImage:
            './img/moon-information-pictures/moon-phase-2-waxing-moon.png',
        moonPhaseRitualsRussian: ['Четвёртый', 'Пятый', 'Шестой'],
        moonPhaseRitualsLithuanian: ['Ketvirtas', 'Penktas', 'Šestas'],
    },

    fullMoon: {
        moonPhaseNameRussian: 'Полная луна',
        moonPhaseNameLithuanian: 'Pilnatis',
        moonPhaseImage:
            './img/moon-information-pictures/moon-phase-3-full-moon.png',
        moonPhaseRitualsRussian: ['Седьмой', 'Восьмой', 'Девятый'],
        moonPhaseRitualsLithuanian: ['Septintas', 'Aštuntas', 'Devyntas'],
    },

    waningMoon: {
        moonPhaseNameRussian: 'Убывающая луна',
        moonPhaseNameLithuanian: 'Delčia',
        moonPhaseImage:
            './img/moon-information-pictures/moon-phase-4-waning-moon.png',
        moonPhaseRitualsRussian: ['Десятый', 'Одиннадцатый', 'Двенадцатый'],
        moonPhaseRitualsLithuanian: ['Dešimtas', 'Vienuoliktas', 'Dviliktas'],
    },
};

// ------------------ Phase Key Mapping ------------------

const phaseKeyMap = {
    'New Moon': 'newMoon',
    'Waxing Crescent': 'waxingMoon',
    'First Quarter': 'waxingMoon',
    'Waxing Gibbous': 'waxingMoon',
    'Full Moon': 'fullMoon',
    'Waning Gibbous': 'waningMoon',
    'Last Quarter': 'waningMoon',
    'Waning Crescent': 'waningMoon',
};

// ------------------ Fetch and Display Moon Data ------------------

async function fetchMoonPhase() {
    const apiKey =
        process.env.WEATHER_API_KEY || '5ab4e849d02243d4884135415252205';
    const location = 'Klaipeda';
    const date = new Date().toISOString().split('T')[0];
    const url = `https://api.weatherapi.com/v1/astronomy.json?key=${apiKey}&q=${location}&dt=${date}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(
                `API request failed with status ${response.status}`
            );
        }

        const data = await response.json();
        const moonPhase = data.astronomy.astro.moon_phase;
        const moonIllumination = data.astronomy.astro.moon_illumination;

        console.log(`🌙 Moon Phase: ${moonPhase}`);
        console.log(`💡 Illumination: ${moonIllumination}%`);

        const internalKey = phaseKeyMap[moonPhase];
        if (!internalKey) {
            console.error(`❌ Unknown moon phase: "${moonPhase}"`);
            return;
        }

        const moonData = moonPhaseInformation[internalKey];
        updateMoonUI(moonData); // 💡 You can define this to update the DOM
    } catch (error) {
        console.error('Error fetching moon phase data:', error);
        const errorMessageElement = document.querySelector('.moon-phase-error');
        if (errorMessageElement) {
            errorMessageElement.textContent =
                'Unable to fetch moon phase data. Please try again later.';
            errorMessageElement.style.display = 'block';
        }
    }
}

// ------------------ Run on Page Load ------------------

fetchMoonPhase();
