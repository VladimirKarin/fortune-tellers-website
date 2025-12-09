// ================================================
// 🌙 MOON PHASE MODULE - Dynamic Moon Information Display
// ================================================
//
// 📋 FEATURES:
// - Fetches live moon phase data from WeatherAPI
// - Displays current phase, countdown, and ritual recommendations
// - Fallback to local calculation when offline/API fails
// - Loading states with spinner animation
// - Error handling with user-friendly messages
// - Network status monitoring for auto-recovery
//
// 🔗 DEPENDENCIES:
// - WeatherAPI (https://api.weatherapi.com)
// - HTML: Moon section with specific class structure
// - CSS: 08-moon-information-section-styles.css
//
// ✅ UPDATED: All class selectors simplified for better maintainability
// Old: .moon-information-section__component__information__content__title
// New: .moon-section__card-title

/* ===================================
   📊 MOON PHASE DATA - LOCALIZED INFORMATION
   =================================== */

/**
 * Moon phase information database
 * Contains names, images, and ritual recommendations in multiple languages
 *
 * @typedef {Object} MoonPhaseData
 * @property {string} moonPhaseNameRussian - Phase name in Russian
 * @property {string} moonPhaseNameLithuanian - Phase name in Lithuanian
 * @property {string} moonPhaseImage - Path to phase image
 * @property {string[]} moonPhaseRitualsRussian - Ritual recommendations in Russian
 * @property {string[]} moonPhaseRitualsLithuanian - Ritual recommendations in Lithuanian
 */
const moonPhaseInformation = {
    newMoon: {
        moonPhaseNameRussian: 'Новолуние',
        moonPhaseNameLithuanian: 'Jaunatis',
        moonPhaseImage:
            './img/05-moon-information-section/moon-phase-1-new-moon.png',
        moonPhaseRitualsRussian: [
            'Очищение',
            'Новые начинания',
            'Планирование',
        ],
        moonPhaseRitualsLithuanian: ['Valymas', 'Nauji pradžia', 'Planavimas'],
    },
    waxingMoon: {
        moonPhaseNameRussian: 'Растущая луна',
        moonPhaseNameLithuanian: 'Augantis mėnulis',
        moonPhaseImage:
            './img/05-moon-information-section/moon-phase-2-waxing-moon.png',
        moonPhaseRitualsRussian: ['Рост', 'Развитие', 'Привлечение'],
        moonPhaseRitualsLithuanian: ['Augimas', 'Plėtra', 'Patraukimas'],
    },
    fullMoon: {
        moonPhaseNameRussian: 'Полная луна',
        moonPhaseNameLithuanian: 'Pilnatis',
        moonPhaseImage:
            './img/05-moon-information-section/moon-phase-4-full-moon.png',
        moonPhaseRitualsRussian: ['Завершение', 'Благодарность', 'Энергия'],
        moonPhaseRitualsLithuanian: ['Užbaigimas', 'Padėka', 'Energija'],
    },
    waningMoon: {
        moonPhaseNameRussian: 'Убывающая луна',
        moonPhaseNameLithuanian: 'Delčia',
        moonPhaseImage:
            './img/05-moon-information-section/moon-phase-3-waning-moon.png',
        moonPhaseRitualsRussian: ['Освобождение', 'Очищение', 'Прощение'],
        moonPhaseRitualsLithuanian: ['Išlaisvinimas', 'Valymas', 'Atleidimas'],
    },
};

/* ===================================
   🗺️ PHASE KEY MAPPING - API TO INTERNAL
   =================================== */

/**
 * Maps WeatherAPI phase names to internal phase keys
 * Consolidates similar phases (e.g., all waxing phases → waxingMoon)
 *
 * @type {Object.<string, string>}
 */
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

/* ===================================
   ⏳ LOADING STATE MANAGEMENT
   =================================== */

/**
 * Toggle loading state for moon section
 * Shows/hides loading spinner and updates placeholder text
 *
 * @param {boolean} isLoading - Whether to show loading state
 *
 * @example
 * setLoadingState(true);  // Show loading spinner
 * await fetchData();
 * setLoadingState(false); // Hide loading spinner
 */
function setLoadingState(isLoading) {
    // ✅ UPDATED: Simplified class selectors
    const moonSection = document.querySelector('.moon-section__layout');
    const moonPhaseName = document.querySelector('.moon-section__card-text');
    const moonRituals = document.querySelectorAll(
        '.moon-section__card-text'
    )[2]; // Third card contains rituals
    const moonCountdown = document.querySelectorAll(
        '.moon-section__card-text'
    )[1]; // Second card contains countdown

    if (isLoading) {
        // Add loading class to show spinner (CSS handles animation)
        moonSection?.classList.add('loading');

        // Update text to show loading state
        if (moonPhaseName) moonPhaseName.textContent = 'Загрузка...';
        if (moonRituals) moonRituals.textContent = 'Загрузка...';
        if (moonCountdown) moonCountdown.textContent = 'Загрузка...';
    } else {
        // Remove loading class to hide spinner
        moonSection?.classList.remove('loading');
    }

    // 🔧 DEBUG: Uncomment to track loading state changes
    // console.log(`⏳ Loading state: ${isLoading ? 'ACTIVE' : 'INACTIVE'}`);
}

/* ===================================
   🎨 UI UPDATE FUNCTION - RENDER MOON DATA
   =================================== */

/**
 * Update UI with fetched moon phase data
 * Updates image, phase name, and ritual recommendations
 *
 * @param {MoonPhaseData} moonData - Moon phase data object
 * @throws {Error} If UI elements are not found or update fails
 *
 * @example
 * const moonData = moonPhaseInformation.fullMoon;
 * updateMoonUI(moonData);
 */
function updateMoonUI(moonData) {
    try {
        // ===================================
        // Update Moon Phase Image
        // ===================================
        // ✅ UPDATED: Simplified selector
        const moonImage = document.querySelector('.moon-section__image');

        if (moonImage) {
            moonImage.src = moonData.moonPhaseImage;
            moonImage.alt = `Picture of ${moonData.moonPhaseNameRussian}`;

            // Smooth fade-in transition for image load
            moonImage.style.opacity = '0';
            moonImage.onload = () => {
                moonImage.style.transition = 'opacity 0.3s ease';
                moonImage.style.opacity = '1';
            };

            // 🔧 DEBUG: Uncomment to track image updates
            // console.log('🖼️ Image updated:', moonData.moonPhaseImage);
        } else {
            console.warn('⚠️ Moon image element not found');
        }

        // ===================================
        // Update Moon Phase Name (Card 1)
        // ===================================
        // ✅ UPDATED: Get first card text element
        const moonPhaseName = document.querySelectorAll(
            '.moon-section__card-text'
        )[0];

        if (moonPhaseName) {
            moonPhaseName.textContent = moonData.moonPhaseNameRussian;
            // 🔧 DEBUG: Uncomment to track phase name updates
            // console.log('📝 Phase name updated:', moonData.moonPhaseNameRussian);
        } else {
            console.warn('⚠️ Moon phase name element not found');
        }

        // ===================================
        // Update Rituals List (Card 3)
        // ===================================
        // ✅ UPDATED: Get third card text element (rituals)
        const moonRituals = document.querySelectorAll(
            '.moon-section__card-text'
        )[2];

        if (moonRituals) {
            moonRituals.textContent =
                moonData.moonPhaseRitualsRussian.join(', ');
            // 🔧 DEBUG: Uncomment to track ritual updates
            // console.log('🕯️ Rituals updated:', moonData.moonPhaseRitualsRussian);
        } else {
            console.warn('⚠️ Moon rituals element not found');
        }

        console.log(
            `✅ Moon UI updated successfully: ${moonData.moonPhaseNameRussian}`
        );
    } catch (error) {
        console.error('❌ Error updating moon UI:', error);
        showMoonError('Ошибка при обновлении интерфейса');
    }
}

/* ===================================
   ⏱️ COUNTDOWN CALCULATION - NEXT PHASE TIMER
   =================================== */

/**
 * Calculate and display countdown to next moon phase
 *
 * ⚠️ NOTE: This is a simplified placeholder calculation
 * For production, consider using a proper lunar calendar library
 * like 'suncalc' or 'lunarphase-js' for accurate calculations
 *
 * @example
 * calculateNextPhaseCountdown(); // Updates countdown in Card 2
 */
function calculateNextPhaseCountdown() {
    try {
        // Lunar cycle constants
        const lunarCycle = 29.53; // Average lunar cycle in days
        const phaseLength = lunarCycle / 4; // ~7.38 days per major phase

        // ⚠️ PLACEHOLDER: Replace with actual calculation
        // This generates random values for demonstration
        const randomDays = Math.floor(Math.random() * 7) + 1;
        const randomHours = Math.floor(Math.random() * 24);
        const randomMinutes = Math.floor(Math.random() * 60);

        // ✅ UPDATED: Get second card text element (countdown)
        const countdownElement = document.querySelectorAll(
            '.moon-section__card-text'
        )[1];

        if (countdownElement) {
            countdownElement.textContent = `${randomDays} дн. ${randomHours} ч. ${randomMinutes} мин`;
            // 🔧 DEBUG: Uncomment to track countdown updates
            // console.log(`⏰ Countdown updated: ${randomDays}d ${randomHours}h ${randomMinutes}m`);
        } else {
            console.warn('⚠️ Countdown element not found');
        }
    } catch (error) {
        console.error('❌ Error calculating countdown:', error);

        // ✅ UPDATED: Fallback for countdown element
        const countdownElement = document.querySelectorAll(
            '.moon-section__card-text'
        )[1];
        if (countdownElement) {
            countdownElement.textContent = 'Недоступно';
        }
    }
}

/* ===================================
   🌐 API FETCH FUNCTION - WEATHERAPI INTEGRATION
   =================================== */

/**
 * Fetch current moon phase data from WeatherAPI
 * Makes async request to astronomy endpoint for Klaipeda location
 *
 * @async
 * @throws {Error} If API request fails or response is invalid
 *
 * ⚠️ SECURITY NOTE: API key is exposed client-side
 * For production, consider moving this to a backend endpoint
 *
 * @example
 * await fetchMoonPhase();
 */
async function fetchMoonPhase() {
    // ⚠️ TODO: Move API key to backend or environment variables
    const apiKey = '5ab4e849d02243d4884135415252205';
    const location = 'Klaipeda'; // Default location
    const date = new Date().toISOString().split('T')[0]; // Today's date (YYYY-MM-DD)
    const url = `https://api.weatherapi.com/v1/astronomy.json?key=${apiKey}&q=${location}&dt=${date}`;

    try {
        // Show loading state while fetching
        setLoadingState(true);

        // Make API request
        const response = await fetch(url);

        // Check for HTTP errors
        if (!response.ok) {
            throw new Error(
                `API request failed with status ${response.status}: ${response.statusText}`
            );
        }

        // Parse JSON response
        const data = await response.json();

        // Extract moon phase information
        const moonPhase = data.astronomy.astro.moon_phase;
        const moonIllumination = data.astronomy.astro.moon_illumination;

        // Log API response for debugging
        console.log(`🌙 Moon Phase: ${moonPhase}`);
        console.log(`💡 Illumination: ${moonIllumination}%`);

        // Map API phase name to internal key
        const internalKey = phaseKeyMap[moonPhase];

        if (!internalKey) {
            console.error(`❌ Unknown moon phase: "${moonPhase}"`);
            throw new Error(`Unknown moon phase: "${moonPhase}"`);
        }

        // Get phase data from local database
        const moonData = moonPhaseInformation[internalKey];

        // Update UI with fetched data
        updateMoonUI(moonData);
        calculateNextPhaseCountdown();

        // Hide any previous error messages
        hideMoonError();

        console.log('✅ Moon phase data fetched successfully');
    } catch (error) {
        console.error('❌ Error fetching moon phase data:', error);

        // Show user-friendly error message
        showMoonError(
            'Не удалось загрузить данные о фазе луны. Попробуйте позже.'
        );

        // Fallback to local calculation
        console.log('🔄 Attempting fallback to local calculation...');
        getLocalMoonPhase();
    } finally {
        // Always hide loading state
        setLoadingState(false);
    }
}

/* ===================================
   ❌ ERROR HANDLING - USER FEEDBACK
   =================================== */

/**
 * Display error message to user
 * Shows error container with auto-hide after 5 seconds
 *
 * @param {string} message - Error message to display
 *
 * @example
 * showMoonError('Не удалось загрузить данные');
 */
function showMoonError(message) {
    // ✅ UPDATED: Simplified selector
    const errorElement = document.querySelector('.moon-section__error');

    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show'); // CSS handles fade-in animation

        // Auto-hide after 5 seconds
        setTimeout(() => {
            hideMoonError();
        }, 5000);

        // 🔧 DEBUG: Uncomment to track error display
        // console.log('⚠️ Error shown:', message);
    } else {
        console.warn('⚠️ Error element not found in DOM');
    }
}

/**
 * Hide error message
 * Removes 'show' class to trigger fade-out animation
 *
 * @example
 * hideMoonError();
 */
function hideMoonError() {
    // ✅ UPDATED: Simplified selector
    const errorElement = document.querySelector('.moon-section__error');

    if (errorElement) {
        errorElement.classList.remove('show'); // CSS handles fade-out

        // 🔧 DEBUG: Uncomment to track error hiding
        // console.log('✅ Error hidden');
    }
}

/* ===================================
   🧮 LOCAL CALCULATION - OFFLINE FALLBACK
   =================================== */

/**
 * Calculate moon phase locally without API
 * Uses simplified astronomical calculation based on known new moon date
 *
 * ⚠️ ACCURACY NOTE: Less accurate than API but works offline
 * Provides reasonable approximation for most use cases
 *
 * @example
 * getLocalMoonPhase(); // Calculates and displays phase
 */
function getLocalMoonPhase() {
    try {
        // Known reference point: new moon date
        const today = new Date();
        const knownNewMoon = new Date('2025-05-27'); // Known new moon date
        const lunarCycle = 29.53058867; // Precise lunar cycle length in days

        // Calculate days since known new moon
        const daysSinceNewMoon = (today - knownNewMoon) / (1000 * 60 * 60 * 24);

        // Get current position in lunar cycle
        const currentCycle = daysSinceNewMoon % lunarCycle;

        // Determine current phase based on cycle position
        let phase, internalKey;

        if (currentCycle < 1) {
            // 0-1 day: New Moon
            phase = 'New Moon';
            internalKey = 'newMoon';
        } else if (currentCycle < 7.38) {
            // 1-7.38 days: Waxing Crescent
            phase = 'Waxing Crescent';
            internalKey = 'waxingMoon';
        } else if (currentCycle < 14.77) {
            // 7.38-14.77 days: Full Moon
            phase = 'Full Moon';
            internalKey = 'fullMoon';
        } else if (currentCycle < 22.15) {
            // 14.77-22.15 days: Waning Gibbous
            phase = 'Waning Gibbous';
            internalKey = 'waningMoon';
        } else {
            // 22.15-29.53 days: Waning Crescent
            phase = 'Waning Crescent';
            internalKey = 'waningMoon';
        }

        console.log(
            `🌙 Local Moon Phase: ${phase} (${currentCycle.toFixed(
                2
            )} days in cycle)`
        );

        // Get phase data and update UI
        const moonData = moonPhaseInformation[internalKey];
        updateMoonUI(moonData);
        calculateNextPhaseCountdown();

        // Show info message that we're using local calculation
        // ✅ UPDATED: Simplified selector
        const errorElement = document.querySelector('.moon-section__error');

        if (errorElement) {
            errorElement.textContent =
                'Используется локальный расчет фазы луны';
            errorElement.style.background = '#e7f3ff'; // Light blue background
            errorElement.style.color = '#0066cc'; // Blue text
            errorElement.style.borderColor = '#99ccff'; // Blue border
            errorElement.classList.add('show');

            // Auto-hide info message after 3 seconds
            setTimeout(() => {
                hideMoonError();
            }, 3000);
        }

        console.log('✅ Local moon phase calculation completed');
    } catch (error) {
        console.error('❌ Error in local moon phase calculation:', error);
        showMoonError('Ошибка при расчете фазы луны');
    }
}

/* ===================================
   🚀 INITIALIZATION - MAIN ENTRY POINT
   =================================== */

/**
 * Initialize moon phase display
 * Attempts API fetch first, falls back to local calculation if offline/failed
 *
 * @async
 *
 * @example
 * // Called automatically on DOMContentLoaded
 * await initializeMoonPhase();
 */
async function initializeMoonPhase() {
    try {
        // Check network connectivity
        if (!navigator.onLine) {
            console.log('📡 Offline detected, using local calculation');
            getLocalMoonPhase();
            return;
        }

        // Attempt API fetch
        console.log('🌐 Online detected, fetching from API');
        await fetchMoonPhase();
    } catch (error) {
        console.error('❌ Initialization failed:', error);
        console.log('🔄 Falling back to local calculation');
        getLocalMoonPhase();
    }
}

/* ===================================
   📡 NETWORK MONITORING - AUTO-RECOVERY
   =================================== */

/**
 * Setup network status event listeners
 * Automatically refreshes data when connection is restored
 *
 * @example
 * setupNetworkMonitoring(); // Called automatically on load
 */
function setupNetworkMonitoring() {
    // Listen for connection restoration
    window.addEventListener('online', () => {
        console.log('✅ Connection restored, refreshing moon data');
        initializeMoonPhase(); // Re-fetch from API
    });

    // Listen for connection loss
    window.addEventListener('offline', () => {
        console.log('⚠️ Connection lost, using local calculation');
        getLocalMoonPhase(); // Switch to offline mode
    });

    console.log('📡 Network monitoring initialized');
}

/* ===================================
   🎬 AUTO-START - DOM READY HANDLER
   =================================== */

/**
 * Initialize moon phase system when DOM is ready
 * Sets up both data fetching and network monitoring
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Moon Phase Module...');
    initializeMoonPhase(); // Fetch initial data
    setupNetworkMonitoring(); // Setup auto-recovery
    console.log('✅ Moon Phase Module initialized');
});

/* ===================================
   📤 MODULE EXPORTS
   =================================== */

/**
 * Export functions for use in other modules
 * Allows manual control from external scripts if needed
 */
export { initializeMoonPhase, getLocalMoonPhase, updateMoonUI };

/* ================================================
   🔧 DEBUG UTILITIES
   ================================================
   
   Copy these functions to browser console for testing:
*/

/*
// Test API fetch manually
async function testMoonAPI() {
    console.log('🧪 Testing API fetch...');
    await fetchMoonPhase();
}

// Test local calculation
function testLocalCalculation() {
    console.log('🧪 Testing local calculation...');
    getLocalMoonPhase();
}

// Force show error message
function testErrorDisplay() {
    console.log('🧪 Testing error display...');
    showMoonError('This is a test error message');
}

// Manually update UI with specific phase
function testUIUpdate(phaseKey) {
    console.log('🧪 Testing UI update with phase:', phaseKey);
    const moonData = moonPhaseInformation[phaseKey];
    updateMoonUI(moonData);
}

// Example usage:
// testMoonAPI();
// testLocalCalculation();
// testErrorDisplay();
// testUIUpdate('fullMoon');

// Monitor all DOM mutations in moon section
function debugMoonSection() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            console.log('🔄 DOM changed:', mutation.target.className, '→', mutation.target.textContent);
        });
    });
    
    const moonSection = document.querySelector('.moon-section__layout');
    observer.observe(moonSection, { 
        childList: true, 
        subtree: true, 
        characterData: true 
    });
    
    console.log('👀 Watching moon section for changes...');
}

// debugMoonSection();
*/
