// Make mobile navigation work
const toggleMobileNav = () => {
    const headerElement = document.querySelector('header');
    headerElement.classList.toggle('nav-open');
};

const navigationButtonElement = document.querySelector('.btn-mobile-nav');
navigationButtonElement.addEventListener('click', toggleMobileNav);

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

//Services Section

document.querySelectorAll('.services__card_button').forEach((button) => {
    button.addEventListener('click', function () {
        // Get the full content from the data attribute
        const card = this.closest('.services__card');
        const paragraph = card.querySelector('.services__card__text');
        const fullContent = paragraph.getAttribute('data-full-content');

        // Create and show popup with the full content
        showPopup(fullContent);
    });
});

function showPopup(content) {
    // Create popup elements
    const popup = document.createElement('div');
    popup.className = 'popup';

    const popupContent = document.createElement('div');
    popupContent.className = 'popup-content';

    const closeBtn = document.createElement('span');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = () => popup.remove();

    const text = document.createElement('p');
    text.innerHTML = content;

    // Assemble and show popup
    popupContent.appendChild(closeBtn);
    popupContent.appendChild(text);
    popup.appendChild(popupContent);
    document.body.appendChild(popup);
}

//Carousel

const galleryContainer = document.querySelector('gallery-container');
const galleryControlsContainer = document.querySelector('.gallery-controls');
const galleryControls = ['previous', 'next'];
const galleryItems = document.querySelectorAll('gallery-item');

class Carousel {
    constructor(container, items, controls) {
        this.carouselContainer = container;
        this.carouselControls = controls;
        this.carouselArray = [...items];
    }

    updateGallery() {
        this.carouselArray.forEach((el) => {
            el.classList.remove('gallery-item-1');
            el.classList.remove('gallery-item-2');
            el.classList.remove('gallery-item-3');
            el.classList.remove('gallery-item-4');
            el.classList.remove('gallery-item-5');
        });

        this.carouselArray.slice(0, 5).forEach(el, (i) => {
            el.classList.add(`gallery-item-${i + 1}`);
        });
    }

    setCurrentState(direction) {
        if (direction.className == 'gallery-controls-previous') {
            this.carouselArray.unshift(this.carouselArray.pop());
        } else {
            this.carouselArray.push(this.carouselArray.shift());
        }

        this.updateGallery();
    }

    setControls() {
        this.carouselControls.forEach((control) => {
            galleryControlsContainer.appendChild(
                document.createElement('button')
            ).className = `gallery-controls-${control}`;
            document.querySelector(`.gallery-controls-${control}`).innerText =
                control;
        });
    }

    useControls() {
        const triggers = [...galleryControlsContainer.childNodes];
        triggers.forEach((control) => {
            control.addEventListener('click', (e) => {
                e.preventDefault();
                this.setCurrentState(control);
            });
        });
    }
}

const exampleCarousel = new Carousel(
    galleryContainer,
    galleryItems,
    galleryControls
);
exampleCarousel.setControls();
exampleCarousel.useControls();
