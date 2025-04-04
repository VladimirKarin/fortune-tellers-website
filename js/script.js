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
// SERVICES SECTION POPUP FUNCTIONALITY
// ------------------------------------------------------------------

// Add click events to all service card buttons
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

// Function to create and display a popup with content
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

// ------------------------------------------------------------------
// CAROUSEL AND POPUP FUNCTIONALITY
// ------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function () {
    // Initialize Carousel
    initCarousel();

    // Initialize Popup System
    initPopup();

    // Initialize Indicators
    updateIndicators();
});

// ------------------------------------------------------------------
// CAROUSEL FUNCTIONALITY
// ------------------------------------------------------------------

function initCarousel() {
    // Select the carousel elements
    const galleryContainer = document.querySelector('.gallery-container');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const prevButton = document.querySelector('.gallery-controls-previous');
    const nextButton = document.querySelector('.gallery-controls-next');
    const indicators = document.querySelectorAll('.gallery-indicator');

    // Convert NodeList to Array
    const itemsArray = Array.from(galleryItems);
    let currentIndex = 0; // Track the center item's index

    // Function to update the gallery display
    function updateGallery() {
        itemsArray.forEach((item, index) => {
            // Remove all position classes
            item.classList.remove(
                'gallery-item-1',
                'gallery-item-2',
                'gallery-item-3',
                'gallery-item-4',
                'gallery-item-5'
            );

            // Calculate position based on relative index to the current center
            let position =
                (index - currentIndex + itemsArray.length) % itemsArray.length;

            // Only show 5 items
            if (position < 5) {
                item.classList.add(`gallery-item-${position + 1}`);
                item.style.opacity = ''; // Reset to CSS value
            } else {
                item.style.opacity = '0';
            }
        });

        // Update indicators
        updateIndicators();
    }

    // Function to move to next slide
    function moveToNextSlide() {
        currentIndex =
            (currentIndex - 1 + itemsArray.length) % itemsArray.length;
        updateGallery();
    }

    // Function to move to previous slide
    function moveToPrevSlide() {
        currentIndex = (currentIndex + 1) % itemsArray.length;
        updateGallery();
    }

    // Function to move to specific slide
    function moveToSlide(index) {
        currentIndex = index;
        updateGallery();
    }

    // Add listeners for previous and next buttons
    if (prevButton) {
        prevButton.addEventListener('click', function (e) {
            e.preventDefault();
            moveToPrevSlide();
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', function (e) {
            e.preventDefault();
            moveToNextSlide();
        });
    }

    // Add listeners for indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function () {
            moveToSlide(index);
        });
    });

    // Add touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    galleryContainer.addEventListener(
        'touchstart',
        function (e) {
            touchStartX = e.changedTouches[0].screenX;
        },
        false
    );

    galleryContainer.addEventListener(
        'touchend',
        function (e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        },
        false
    );

    function handleSwipe() {
        const minSwipeDistance = 50;
        if (touchEndX < touchStartX - minSwipeDistance) {
            // Swipe left, go to next slide
            moveToNextSlide();
        } else if (touchEndX > touchStartX + minSwipeDistance) {
            // Swipe right, go to previous slide
            moveToPrevSlide();
        }
    }

    // Add keyboard navigation
    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') {
            moveToPrevSlide();
        } else if (e.key === 'ArrowRight') {
            moveToNextSlide();
        }
    });

    // Initialize the gallery
    updateGallery();
}

// Update indicator dots to show active slide
function updateIndicators() {
    const indicators = document.querySelectorAll('.gallery-indicator');
    const activeItem = document.querySelector('.gallery-item-3');

    if (activeItem && indicators.length > 0) {
        const activeIndex = activeItem.getAttribute('data-index');

        indicators.forEach((indicator) => {
            indicator.classList.remove('active');
            if (indicator.getAttribute('data-index') === activeIndex) {
                indicator.classList.add('active');
            }
        });
    }
}

// ------------------------------------------------------------------
// POPUP FUNCTIONALITY
// ------------------------------------------------------------------

function initPopup() {
    // Select popup elements
    const popupOverlay = document.querySelector('.popup-overlay');
    const popupContent = document.querySelector('.popup-content');
    const popupTitle = document.querySelector('.popup-title');
    const popupText = document.querySelector('.popup-text');
    const popupClose = document.querySelector('.popup-close');

    // Add click event to all service card buttons
    document.querySelectorAll('.gallery-item-button').forEach((button) => {
        button.addEventListener('click', function (e) {
            e.preventDefault();

            // Get content from data attributes
            const title = this.getAttribute('data-title');
            const content = this.getAttribute('data-content');

            // Populate and show popup
            popupTitle.textContent = title;
            popupText.innerHTML = content;
            popupOverlay.classList.add('active');

            // Prevent body scrolling when popup is open
            document.body.style.overflow = 'hidden';
        });
    });

    // Close popup when X is clicked
    if (popupClose) {
        popupClose.addEventListener('click', closePopup);
    }

    // Close popup when clicking outside content
    if (popupOverlay) {
        popupOverlay.addEventListener('click', function (e) {
            if (e.target === popupOverlay) {
                closePopup();
            }
        });
    }

    // Close popup with Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && popupOverlay.classList.contains('active')) {
            closePopup();
        }
    });

    // Function to close popup
    function closePopup() {
        popupOverlay.classList.remove('active');

        // Re-enable body scrolling
        document.body.style.overflow = '';

        // Clear content after animation completes
        setTimeout(() => {
            popupTitle.textContent = '';
            popupText.innerHTML = '';
        }, 300);
    }
}
