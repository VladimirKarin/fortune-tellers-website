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
export default Carousel;
