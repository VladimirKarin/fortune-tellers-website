// ================================================
// LANGUAGE SELECTOR LOGIC
// ================================================

const STORAGE_KEY = 'fortuneTellerLanguage';

/**
 * Generate random stars for background animation
 */
function generateStars() {
    const starsContainer = document.getElementById('stars');
    const numberOfStars = 50;

    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';

        // Random size between 2-4px
        const size = Math.random() * 2 + 2;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        // Random position
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;

        // Random animation delay
        star.style.animationDelay = `${Math.random() * 3}s`;

        starsContainer.appendChild(star);
    }
}

/**
 * Check if user has previously selected a language
 * If yes, auto-redirect to that language
 */
function checkSavedLanguage() {
    try {
        const savedLanguage = localStorage.getItem(STORAGE_KEY);

        if (savedLanguage === 'ru' || savedLanguage === 'lt') {
            console.log('✅ Saved language found:', savedLanguage);

            // Add small delay for smooth transition
            setTimeout(() => {
                window.location.href = `./${savedLanguage}/index.html`;
            }, 500);

            return true;
        }
    } catch (error) {
        console.warn('⚠️ localStorage not available:', error);
    }

    return false;
}

/**
 * Save language choice to localStorage
 */
function saveLanguageChoice(language) {
    try {
        localStorage.setItem(STORAGE_KEY, language);
        console.log('✅ Language saved:', language);
    } catch (error) {
        console.warn('⚠️ Could not save language:', error);
    }
}

/**
 * Handle language button click
 */
function handleLanguageClick(event) {
    const button = event.currentTarget;
    const language = button.dataset.lang;

    // Add loading state
    button.classList.add('loading');

    // Save choice
    saveLanguageChoice(language);

    console.log('🌍 Language selected:', language);

    // Navigate to language page
    // (href is already set, so this will happen automatically)
}

/**
 * Initialize the page
 */
function init() {
    console.log('🚀 Initializing language selector...');

    // Generate background stars
    generateStars();

    // Check for saved language (will auto-redirect if found)
    const hasRedirected = checkSavedLanguage();

    if (!hasRedirected) {
        // Add click handlers to language buttons
        const buttons = document.querySelectorAll('.language-btn');
        buttons.forEach((button) => {
            button.addEventListener('click', handleLanguageClick);
        });

        console.log('✅ Language selector ready');
    }
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
