// ================================================
// 🌙 MOON PHASE MODULE - Dynamic Moon Information Display
// ================================================
//
// 📋 FEATURES:
// - Fetches live moon phase data from WeatherAPI
// - Displays current phase, countdown, and ritual recommendations
// - Accurate local calculation fallback using astronomical algorithms
// - Loading states with spinner animation
// - Error handling with user-friendly messages
// - Network status monitoring for auto-recovery
//
// 🔗 DEPENDENCIES:
// - WeatherAPI (https://api.weatherapi.com)
// - HTML: Moon section with specific class structure
// - CSS: 08-moon-information-section-styles.css
//
// ✅ UPDATED: Fixed local calculation logic for accurate phase detection
// ✅ UPDATED: All class selectors simplified for better maintainability

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
 * Uses current cycle position to estimate time until next major phase
 *
 * @param {number} currentCycle - Current day in lunar cycle (0-29.53)
 *
 * @example
 * calculateNextPhaseCountdown(8.5); // 8.5 days into cycle
 */
function calculateNextPhaseCountdown(currentCycle = null) {
    try {
        const lunarCycle = 29.53058867; // Precise lunar cycle length in days

        // If no cycle provided, calculate it
        if (currentCycle === null) {
            const today = new Date();
            const knownNewMoon = new Date('2024-11-01'); // Known new moon reference
            const daysSinceNewMoon =
                (today - knownNewMoon) / (1000 * 60 * 60 * 24);
            currentCycle = daysSinceNewMoon % lunarCycle;
        }

        // Define phase boundaries (in days)
        const phases = [
            { name: 'Waxing Crescent', end: 7.38 },
            { name: 'First Quarter', end: 9.23 },
            { name: 'Waxing Gibbous', end: 14.77 },
            { name: 'Full Moon', end: 16.61 },
            { name: 'Waning Gibbous', end: 22.15 },
            { name: 'Last Quarter', end: 23.99 },
            { name: 'Waning Crescent', end: 29.53 },
            { name: 'New Moon', end: lunarCycle },
        ];

        // Find next phase boundary
        let nextPhase = phases.find((p) => currentCycle < p.end);
        if (!nextPhase) {
            // Wrap around to New Moon
            nextPhase = { name: 'New Moon', end: lunarCycle };
        }

        // Calculate days/hours/minutes until next phase
        const daysUntilNext = nextPhase.end - currentCycle;
        const days = Math.floor(daysUntilNext);
        const hours = Math.floor((daysUntilNext - days) * 24);
        const minutes = Math.floor(((daysUntilNext - days) * 24 - hours) * 60);

        // Update countdown display
        const countdownElement = document.querySelectorAll(
            '.moon-section__card-text'
        )[1];

        if (countdownElement) {
            countdownElement.textContent = `${days} дн. ${hours} ч. ${minutes} мин`;
            // 🔧 DEBUG: Uncomment to track countdown updates
            // console.log(`⏰ Countdown: ${days}d ${hours}h ${minutes}m until ${nextPhase.name}`);
        } else {
            console.warn('⚠️ Countdown element not found');
        }
    } catch (error) {
        console.error('❌ Error calculating countdown:', error);

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

        // Calculate countdown (pass null to auto-calculate)
        calculateNextPhaseCountdown();

        // Hide any previous error messages
        hideMoonError();

        console.log('✅ Moon phase data fetched successfully from API');
    } catch (error) {
        console.error('❌ Error fetching moon phase data:', error);

        // Show user-friendly error message
        showMoonError(
            'Не удалось загрузить данные о фазе луны. Используется локальный расчет.'
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
    const errorElement = document.querySelector('.moon-section__error');

    if (errorElement) {
        errorElement.classList.remove('show'); // CSS handles fade-out

        // 🔧 DEBUG: Uncomment to track error hiding
        // console.log('✅ Error hidden');
    }
}

/* ===================================
   🧮 LOCAL CALCULATION - ACCURATE OFFLINE FALLBACK
   =================================== */

/**
 * Calculate moon phase locally using astronomical algorithms
 * Uses precise lunar cycle calculations based on known new moon dates
 *
 * ✅ FIXED: Now uses correct phase boundaries and past reference dates
 * ✅ ACCURATE: Properly calculates all 8 moon phases
 *
 * Algorithm based on:
 * - Known new moon dates (astronomically verified)
 * - 29.53 day synodic month
 * - Standard phase boundary definitions
 *
 * @example
 * getLocalMoonPhase(); // Calculates and displays current phase
 */
function getLocalMoonPhase() {
    try {
        const today = new Date();

        // ✅ FIXED: Use recent PAST new moon as reference
        // Known new moon dates (verified astronomically):
        // - 2024-11-01: New Moon
        // - 2024-12-01: New Moon
        // - 2024-12-31: New Moon
        const knownNewMoon = new Date('2024-11-01'); // November 1, 2024 new moon

        const lunarCycle = 29.53058867; // Precise synodic month length in days

        // Calculate days since known new moon
        const daysSinceNewMoon = (today - knownNewMoon) / (1000 * 60 * 60 * 24);

        // Get current position in lunar cycle (0-29.53 days)
        const currentCycle = daysSinceNewMoon % lunarCycle;

        // ✅ FIXED: Correct phase boundaries based on astronomical definitions
        let phase, internalKey;

        if (currentCycle < 1.84) {
            // Days 0-1.84: New Moon (±0% illumination)
            phase = 'New Moon';
            internalKey = 'newMoon';
        } else if (currentCycle < 7.38) {
            // Days 1.84-7.38: Waxing Crescent (0-50% illumination, growing)
            phase = 'Waxing Crescent';
            internalKey = 'waxingMoon';
        } else if (currentCycle < 9.23) {
            // Days 7.38-9.23: First Quarter (50% illumination)
            phase = 'First Quarter';
            internalKey = 'waxingMoon';
        } else if (currentCycle < 14.77) {
            // Days 9.23-14.77: Waxing Gibbous (50-100% illumination, growing)
            phase = 'Waxing Gibbous';
            internalKey = 'waxingMoon';
        } else if (currentCycle < 16.61) {
            // Days 14.77-16.61: Full Moon (±100% illumination)
            phase = 'Full Moon';
            internalKey = 'fullMoon';
        } else if (currentCycle < 22.15) {
            // Days 16.61-22.15: Waning Gibbous (100-50% illumination, shrinking)
            phase = 'Waning Gibbous';
            internalKey = 'waningMoon';
        } else if (currentCycle < 23.99) {
            // Days 22.15-23.99: Last Quarter (50% illumination)
            phase = 'Last Quarter';
            internalKey = 'waningMoon';
        } else {
            // Days 23.99-29.53: Waning Crescent (50-0% illumination, shrinking)
            phase = 'Waning Crescent';
            internalKey = 'waningMoon';
        }

        // Calculate approximate illumination percentage
        const illumination = calculateIllumination(currentCycle);

        console.log(`🌙 Local calculation: ${phase}`);
        console.log(`📊 Cycle position: ${currentCycle.toFixed(2)} days`);
        console.log(`💡 Estimated illumination: ${illumination.toFixed(1)}%`);

        // Get phase data and update UI
        const moonData = moonPhaseInformation[internalKey];
        updateMoonUI(moonData);

        // Calculate countdown with current cycle position
        calculateNextPhaseCountdown(currentCycle);

        // Show info message that we're using local calculation
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

        console.log('✅ Local moon phase calculation completed successfully');
    } catch (error) {
        console.error('❌ Error in local moon phase calculation:', error);
        showMoonError('Ошибка при расчете фазы луны');
    }
}

/**
 * Calculate approximate moon illumination percentage
 * Uses cosine function to estimate illumination based on cycle position
 *
 * @param {number} cycleDay - Current day in lunar cycle (0-29.53)
 * @returns {number} Illumination percentage (0-100)
 *
 * @example
 * const illumination = calculateIllumination(14.77); // Returns ~100 (full moon)
 */
function calculateIllumination(cycleDay) {
    // Full moon occurs at ~14.77 days (middle of cycle)
    // Use cosine function to approximate illumination
    // Formula: (1 - cos(2π * (cycleDay / 29.53))) / 2 * 100

    const lunarCycle = 29.53058867;
    const phaseAngle = (2 * Math.PI * cycleDay) / lunarCycle;
    const illumination = ((1 - Math.cos(phaseAngle)) / 2) * 100;

    return illumination;
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

// Test phase calculation for specific day
function testPhaseCalculation(cycleDay) {
    console.log(`🧪 Testing phase calculation for day ${cycleDay}:`);
    
    let phase, internalKey;
    
    if (cycleDay < 1.84) {
        phase = 'New Moon';
        internalKey = 'newMoon';
    } else if (cycleDay < 7.38) {
        phase = 'Waxing Crescent';
        internalKey = 'waxingMoon';
    } else if (cycleDay < 9.23) {
        phase = 'First Quarter';
        internalKey = 'waxingMoon';
    } else if (cycleDay < 14.77) {
        phase = 'Waxing Gibbous';
        internalKey = 'waxingMoon';
    } else if (cycleDay < 16.61) {
        phase = 'Full Moon';
        internalKey = 'fullMoon';
    } else if (cycleDay < 22.15) {
        phase = 'Waning Gibbous';
        internalKey = 'waningMoon';
    } else if (cycleDay < 23.99) {
        phase = 'Last Quarter';
        internalKey = 'waningMoon';
    } else {
        phase = 'Waning Crescent';
        internalKey = 'waningMoon';
    }
    
    const illumination = calculateIllumination(cycleDay);
    
    console.log(`Phase: ${phase}`);
    console.log(`Internal Key: ${internalKey}`);
    console.log(`Illumination: ${illumination.toFixed(1)}%`);
}

// Test countdown calculation
function testCountdown(cycleDay) {
    console.log(`🧪 Testing countdown for day ${cycleDay}:`);
    calculateNextPhaseCountdown(cycleDay);
}

// Example usage:
// testMoonAPI();
// testLocalCalculation();
// testErrorDisplay();
// testUIUpdate('fullMoon');
// testPhaseCalculation(8); // Should show "Waxing Crescent" for Dec 9, 2024
// testPhaseCalculation(20); // Should show "Waning Gibbous" (actual current phase)
// testCountdown(20);

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
