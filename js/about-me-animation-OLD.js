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
