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

const Days = document.getElementById('days');
const Hours = document.getElementById('hours');
const Minutes = document.getElementById('minutes');
const Seconds = document.getElementById('seconds');

const targetDate = new Date('May 31 2025 00:00:00').getTime();
console.log(targetDate);

function timer() {
    const currentDate = new Date().getTime();
    const timeDifference = targetDate - currentDate; //miliseconds

    const days = Math.floor(timeDifference / 1000 / 60 / 60 / 24);
    const hours = Math.floor(timeDifference / 1000 / 60 / 60) % 24;
    const minutes = Math.floor(timeDifference / 1000 / 60) % 60;
    const seconds = Math.floor(timeDifference / 1000) % 60;

    Days.innerHTML = days;
    Hours.innerHTML = hours;
    Minutes.innerHTML = minutes;
    Seconds.innerHTML = seconds;

    if (timeDifference < 0) {
        Days.innerHTML = '00';
        Hours.innerHTML = '00';
        Minutes.innerHTML = '00';
        Seconds.innerHTML = '00';
    }
}

setInterval(timer, 1000);
