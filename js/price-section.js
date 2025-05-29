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
        priceSection.addEventListener('transitionend', function removeHeight() {
            priceSection.style.height = 'auto';
            priceSection.removeEventListener('transitionend', removeHeight);
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
