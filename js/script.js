import { initializeCountdown, cleanupCountdown } from './countdown-clock.js';
import { initializeMoonPhase } from './moon-phase.js';
import Carousel from './carousel.js';
import { renderCalendar, startAutoUpdate } from './calendar.js';

// ------------------------------------------------------------------
// MOBILE NAVIGATION FUNCTIONALITY
// ------------------------------------------------------------------

const headerElement = document.querySelector('.header');
const navigationButtonElement = document.querySelector('.btn-mobile-nav');
const navList = document.querySelector('.nav-list');

navigationButtonElement.addEventListener('click', () => {
    // toggle aria-expanded
    const isExpanded =
        navigationButtonElement.getAttribute('aria-expanded') === 'true';
    navigationButtonElement.setAttribute('aria-expanded', String(!isExpanded));

    // toggle class
    headerElement.classList.toggle('nav-open');
});

navList.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
        if (headerElement.classList.contains('nav-open')) {
            headerElement.classList.remove('nav-open');
            navigationButtonElement.setAttribute('aria-expanded', 'false');
        }
    });
});

// ------------------------------------------------------------------
// ABOUT ME SECTION ANIMATION FUNCTIONALITY
// ------------------------------------------------------------------

class AboutMeAnimation {
    constructor() {
        this.aboutMeSection = document.querySelector('.about-me-section');
        this.aboutMeCards = document.querySelectorAll('.about-me-card');
        this.hasAnimated = false;

        this.initializeAnimation();
        this.setupIntersectionObserver();
    }

    initializeAnimation() {
        // Устанавливаем начальные классы для направлений анимации
        this.setAnimationDirections();
    }

    setAnimationDirections() {
        // Определяем разрешение экрана и устанавливаем соответствующие классы
        const updateDirections = () => {
            // Сбрасываем все классы направлений
            this.aboutMeCards.forEach((card) => {
                card.classList.remove(
                    'animate-from-bottom-left',
                    'animate-from-bottom',
                    'animate-from-bottom-right'
                );
            });

            const screenWidth = window.innerWidth;

            if (screenWidth <= 599) {
                // Мобильные устройства: блоки в столбик (1 колонка)
                // Первый - снизу слева, второй - снизу справа, третий - снизу
                this.aboutMeCards[0]?.classList.add('animate-from-bottom-left');
                this.aboutMeCards[1]?.classList.add(
                    'animate-from-bottom-right'
                );
                this.aboutMeCards[2]?.classList.add('animate-from-bottom');
            } else if (screenWidth <= 991) {
                // Планшеты: 2 блока на одной линии, третий на другой
                // Первый - снизу слева, второй - снизу справа, третий - снизу
                this.aboutMeCards[0]?.classList.add('animate-from-bottom-left');
                this.aboutMeCards[1]?.classList.add(
                    'animate-from-bottom-right'
                );
                this.aboutMeCards[2]?.classList.add('animate-from-bottom');
            } else {
                // Десктоп: все блоки в одной линии (3 колонки)
                // Первый - снизу слева, второй - снизу, третий - снизу справа
                this.aboutMeCards[0]?.classList.add('animate-from-bottom-left');
                this.aboutMeCards[1]?.classList.add('animate-from-bottom');
                this.aboutMeCards[2]?.classList.add(
                    'animate-from-bottom-right'
                );
            }
        };

        // Устанавливаем направления при инициализации
        updateDirections();

        // Обновляем направления при изменении размера окна
        window.addEventListener('resize', updateDirections);
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '-10% 0px -10% 0px', // Триггер когда секция на 10% видна
            threshold: 0.3, // Анимация запускается когда 30% секции видно
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !this.hasAnimated) {
                    this.animateCards();
                    this.hasAnimated = true;
                }
            });
        }, options);

        if (this.aboutMeSection) {
            observer.observe(this.aboutMeSection);
        }
    }

    animateCards() {
        // Запускаем анимацию для всех карточек
        this.aboutMeCards.forEach((card, index) => {
            // Добавляем класс анимации с учетом задержек, установленных в CSS
            setTimeout(() => {
                card.classList.add('animate-in');
            }, index * 100); // Небольшая дополнительная задержка для браузера
        });
    }

    // Метод для ручного запуска анимации (если потребуется)
    triggerAnimation() {
        if (!this.hasAnimated) {
            this.animateCards();
            this.hasAnimated = true;
        }
    }

    // Метод для сброса анимации (если потребуется)
    resetAnimation() {
        this.hasAnimated = false;
        this.aboutMeCards.forEach((card) => {
            card.classList.remove('animate-in');
        });
    }
}

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

document.addEventListener('DOMContentLoaded', () => {
    new Carousel();
});

// ------------------------------------------------------------------
// INITIALIZATION
// ------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function () {
    const popupManager = new PopupManager();
    const carousel = new Carousel();

    // АНИМАЦИЯ: Инициализация анимации секции "Обо мне"
    const aboutMeAnimation = new AboutMeAnimation();
});

// ------------------------------------------------------------------
// COUNTDOWN CLOCK
// ------------------------------------------------------------------

// Initialize countdown when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    initializeCountdown();
});

// Cleanup when leaving the page
window.addEventListener('beforeunload', function () {
    cleanupCountdown();
});

// ------------------------------------------------------------------
// Moon Phase Section Logic
// ------------------------------------------------------------------

initializeMoonPhase();

// ------------------------------------------------------------------
// Calendar Section Logic with Auto-Update
// ------------------------------------------------------------------

// Initial Calendar render
renderCalendar();

//Start the calendar auto-update system
startAutoUpdate();
