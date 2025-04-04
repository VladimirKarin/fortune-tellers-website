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
// CAROUSEL FUNCTIONALITY
// ------------------------------------------------------------------

// Initialize the carousel functionality when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Select the carousel elements from the DOM
    const galleryContainer = document.querySelector('.gallery-container'); // Container holding all slides
    const galleryItems = document.querySelectorAll('.gallery-item'); // All individual gallery images
    const prevButton = document.querySelector('.gallery-controls-previous'); // Previous slide button
    const nextButton = document.querySelector('.gallery-controls-next'); // Next slide button

    // Convert NodeList of gallery items to Array for easier manipulation
    // NodeList doesn't have all Array methods, so convert for more flexibility
    const itemsArray = Array.from(galleryItems);

    /**
     * Updates the gallery display by applying the correct classes to each item
     * This sets the position, size, and opacity of each image based on its position in the array
     */
    function updateGallery() {
        // First remove all position classes from all items to start fresh
        itemsArray.forEach((item) => {
            item.classList.remove(
                'gallery-item-1',
                'gallery-item-2',
                'gallery-item-3',
                'gallery-item-4',
                'gallery-item-5'
            );
        });

        // Add the appropriate position class to each of the first 5 items
        // gallery-item-3 is the center/featured item, 1 & 5 are the edges
        for (let i = 0; i < 5 && i < itemsArray.length; i++) {
            itemsArray[i].classList.add(`gallery-item-${i + 1}`);
            itemsArray[i].style.opacity = ''; // Reset to use CSS-defined opacity
        }

        // Hide any items beyond the first 5 (if there are more than 5)
        for (let i = 5; i < itemsArray.length; i++) {
            itemsArray[i].style.opacity = '0';
        }
    }

    /**
     * Moves the carousel to the next slide (right direction)
     * Takes the first item and moves it to the end, shifting everything else left
     */
    function moveToNextSlide() {
        // Remove first element and add it to the end
        const firstItem = itemsArray.shift(); // Remove first item from array
        itemsArray.push(firstItem); // Add it to the end of array
        updateGallery(); // Update the visual display
    }

    /**
     * Moves the carousel to the previous slide (left direction)
     * Takes the last item and moves it to the beginning, shifting everything else right
     */
    function moveToPrevSlide() {
        // Remove last element and add it to the beginning
        const lastItem = itemsArray.pop(); // Remove last item from array
        itemsArray.unshift(lastItem); // Add it to the beginning of array
        updateGallery(); // Update the visual display
    }

    // Add click event listener to the previous button
    if (prevButton) {
        prevButton.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent any default button behavior
            moveToPrevSlide(); // Move to previous slide when clicked
        });
    }

    // Add click event listener to the next button
    if (nextButton) {
        nextButton.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent any default button behavior
            moveToNextSlide(); // Move to next slide when clicked
        });
    }

    // Initialize the gallery on page load to ensure proper display
    updateGallery();
});
