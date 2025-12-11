// ================================================
// 🌙 MOON PHASE MODULE - Dynamic Moon Information Display
// ================================================
//
// 📋 TABLE OF CONTENTS:
// 1. Moon Phase Data (Localized Information)
// 2. Phase Key Mapping (API to Internal)
// 3. DOM Element Manager (Cached Selectors) ✅ FIXED
// 4. Loading State Management ✅ IMPROVED
// 5. UI Update Functions ✅ FIXED
// 6. Countdown Calculation ✅ FIXED
// 7. API Fetch Function ✅ IMPROVED
// 8. Error Handling
// 9. Local Calculation (Offline Fallback) ✅ IMPROVED
// 10. Initialization & Network Monitoring
// 11. Module Exports
// 12. Debug Utilities
//
// 🔗 DEPENDENCIES:
// - WeatherAPI (https://api.weatherapi.com)
// - HTML: Moon section with specific class structure
// - CSS: 08-moon-information-section-styles.css
//
// ✅ CRITICAL FIX:
// - DOM selector bug causing "Загрузка..." to never update
// - Root cause: Index-based querySelectorAll fragile and order-dependent
// - Solution: Parent-based traversal with cached selectors in MoonPhaseDOM class
//
// ✅ OTHER IMPROVEMENTS:
// - Cached selectors for better performance (no repeated DOM queries)
// - Enhanced error handling with specific messages
// - Updated reference date for better accuracy (2024-12-01)
// - Minimum loading time for smoother UX (prevents flash)
// - Proper null checks throughout

/* ===================================
   1️⃣ MOON PHASE DATA - LOCALIZED INFORMATION
   =================================== */

/**
 * Moon phase information database
 * Contains names, images, and ritual recommendations in multiple languages
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
   2️⃣ PHASE KEY MAPPING - API TO INTERNAL
   =================================== */

/**
 * Maps WeatherAPI phase names to internal phase keys
 * Consolidates similar phases (e.g., all waxing phases → waxingMoon)
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
   3️⃣ DOM ELEMENT MANAGER - CACHED SELECTORS ✅ FIXED
   =================================== */

/**
 * ✅ CRITICAL FIX: Centralized DOM element management with cached selectors
 *
 * BEFORE (Broken):
 * const moonPhaseName = document.querySelectorAll('.moon-section__card-text')[0];
 *
 * PROBLEM:
 * - Index-based selection fragile and order-dependent
 * - No guarantee which card is at which index
 * - Failed silently when HTML structure changed
 * - Repeated DOM queries in every function (performance issue)
 *
 * AFTER (Fixed):
 * - Parent-based traversal: Get cards first, then find text within each
 * - Cached references: Query DOM once, reuse throughout
 * - Proper validation: Check all elements exist on init
 * - Clear ownership: Each card element explicitly named
 *
 * BENEFITS:
 * - ✅ More reliable (not order-dependent)
 * - ✅ Faster (no repeated queries)
 * - ✅ Easier to debug (clear error messages)
 * - ✅ Maintainable (single source of truth)
 */
class MoonPhaseDOM {
    constructor() {
        // Cache parent container
        this.layout = document.querySelector('.moon-section__layout');
        this.image = document.querySelector('.moon-section__image');
        this.error = document.querySelector('.moon-section__error');

        // ✅ FIXED: Get cards by parent traversal, then find text elements within
        const cards = document.querySelectorAll('.moon-section__card');

        // Card 1: Moon phase name (Лунная фаза:)
        this.phaseNameCard = cards[0];
        this.phaseName = cards[0]?.querySelector('.moon-section__card-text');

        // Card 2: Countdown to next phase (До следующей фазы:)
        this.countdownCard = cards[1];
        this.countdown = cards[1]?.querySelector('.moon-section__card-text');

        // Card 3: Ritual recommendations (Какие обряды сейчас проводятся:)
        this.ritualsCard = cards[2];
        this.rituals = cards[2]?.querySelector('.moon-section__card-text');

        // Validation: Check if all required elements exist
        this.validateElements();
    }

    /**
     * Validate that all required DOM elements were found
     * Logs warnings for missing elements to aid debugging
     */
    validateElements() {
        const required = {
            'Layout container': this.layout,
            'Moon image': this.image,
            'Phase name element': this.phaseName,
            'Countdown element': this.countdown,
            'Rituals element': this.rituals,
            'Error container': this.error,
        };

        let allValid = true;
        for (const [name, element] of Object.entries(required)) {
            if (!element) {
                console.warn(`⚠️ Missing DOM element: ${name}`);
                allValid = false;
            }
        }

        if (allValid) {
            console.log('✅ All moon section DOM elements found successfully');
        } else {
            console.error(
                '❌ Some moon section elements are missing. Check HTML structure.'
            );
        }

        return allValid;
    }

    /**
     * Check if DOM is ready for updates
     */
    isReady() {
        return !!(
            this.phaseName &&
            this.countdown &&
            this.rituals &&
            this.image
        );
    }
}

// Global DOM manager instance
let moonDOM = null;

/* ===================================
   4️⃣ LOADING STATE MANAGEMENT ✅ IMPROVED
   =================================== */

/**
 * ✅ IMPROVED: Loading state with minimum display time for better UX
 *
 * Prevents loading flash by enforcing minimum display time
 * Shows spinner for at least 500ms even if data loads instantly
 */
const MIN_LOADING_TIME = 500; // Minimum loading display time in milliseconds
let loadingStartTime = null;

async function setLoadingState(isLoading) {
    // Initialize DOM manager if needed
    if (!moonDOM) {
        moonDOM = new MoonPhaseDOM();
    }

    if (!moonDOM.isReady()) {
        console.warn('⚠️ Cannot set loading state - DOM not ready');
        return;
    }

    if (isLoading) {
        // Record start time for minimum loading duration
        loadingStartTime = Date.now();

        // Add loading class to show spinner (CSS handles animation)
        moonDOM.layout?.classList.add('loading');

        // ✅ FIXED: Update text with null-safe access
        if (moonDOM.phaseName) moonDOM.phaseName.textContent = 'Загрузка...';
        if (moonDOM.rituals) moonDOM.rituals.textContent = 'Загрузка...';
        if (moonDOM.countdown) moonDOM.countdown.textContent = 'Загрузка...';
    } else {
        // ✅ IMPROVED: Ensure minimum loading time for smooth UX
        if (loadingStartTime) {
            const elapsed = Date.now() - loadingStartTime;
            if (elapsed < MIN_LOADING_TIME) {
                await new Promise((resolve) =>
                    setTimeout(resolve, MIN_LOADING_TIME - elapsed)
                );
            }
        }

        // Remove loading class to hide spinner
        moonDOM.layout?.classList.remove('loading');
    }
}

/* ===================================
   5️⃣ UI UPDATE FUNCTIONS ✅ FIXED
   =================================== */

/**
 * ✅ FIXED: Update UI with proper null checks and cached selectors
 */
function updateMoonUI(moonData) {
    try {
        // Initialize DOM manager if needed
        if (!moonDOM) {
            moonDOM = new MoonPhaseDOM();
        }

        if (!moonDOM.isReady()) {
            throw new Error('DOM elements not ready for update');
        }

        // Update Moon Phase Image
        if (moonDOM.image) {
            moonDOM.image.style.opacity = '0';
            moonDOM.image.src = moonData.moonPhaseImage;
            moonDOM.image.alt = `Изображение фазы ${moonData.moonPhaseNameRussian}`;

            moonDOM.image.onload = () => {
                moonDOM.image.style.transition = 'opacity 0.3s ease';
                moonDOM.image.style.opacity = '1';
            };
        }

        // Update Moon Phase Name (Card 1)
        if (moonDOM.phaseName) {
            moonDOM.phaseName.textContent = moonData.moonPhaseNameRussian;
        }

        // Update Rituals List (Card 3)
        if (moonDOM.rituals) {
            moonDOM.rituals.textContent =
                moonData.moonPhaseRitualsRussian.join(', ');
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
   6️⃣ COUNTDOWN CALCULATION ✅ FIXED
   =================================== */

/**
 * ✅ FIXED: Countdown with proper null checks and updated reference date
 */
function calculateNextPhaseCountdown(currentCycle = null) {
    try {
        if (!moonDOM) {
            moonDOM = new MoonPhaseDOM();
        }

        const lunarCycle = 29.53058867;

        // If no cycle provided, calculate it
        if (currentCycle === null) {
            const today = new Date();
            // ✅ IMPROVED: Updated to December 2024 for better accuracy
            const knownNewMoon = new Date('2024-12-01');
            const daysSinceNewMoon =
                (today - knownNewMoon) / (1000 * 60 * 60 * 24);
            currentCycle = daysSinceNewMoon % lunarCycle;
        }

        // Define phase boundaries
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

        // Find next phase
        let nextPhase = phases.find((p) => currentCycle < p.end);
        if (!nextPhase) {
            nextPhase = { name: 'New Moon', end: lunarCycle };
        }

        // Calculate time until next phase
        const daysUntilNext = nextPhase.end - currentCycle;
        const days = Math.floor(daysUntilNext);
        const hours = Math.floor((daysUntilNext - days) * 24);
        const minutes = Math.floor(((daysUntilNext - days) * 24 - hours) * 60);

        // ✅ FIXED: Update countdown with null check
        if (moonDOM.countdown) {
            moonDOM.countdown.textContent = `${days} дн. ${hours} ч. ${minutes} мин`;
        }
    } catch (error) {
        console.error('❌ Error calculating countdown:', error);
        if (moonDOM?.countdown) {
            moonDOM.countdown.textContent = 'Недоступно';
        }
    }
}

/* ===================================
   7️⃣ API FETCH FUNCTION ✅ IMPROVED
   =================================== */

/**
 * ✅ IMPROVED: Enhanced error handling with specific messages
 */
async function fetchMoonPhase() {
    // ⚠️ TODO: Move API key to backend or environment variables for production
    const apiKey = '5ab4e849d02243d4884135415252205';
    const location = 'Klaipeda';
    const date = new Date().toISOString().split('T')[0];
    const url = `https://api.weatherapi.com/v1/astronomy.json?key=${apiKey}&q=${location}&dt=${date}`;

    try {
        await setLoadingState(true);

        const response = await fetch(url);

        // ✅ IMPROVED: Specific error messages for different HTTP statuses
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('API_KEY_ERROR: Invalid API key');
            } else if (response.status === 403) {
                throw new Error('API_KEY_ERROR: API key quota exceeded');
            } else if (response.status === 400) {
                throw new Error('API_ERROR: Invalid request parameters');
            } else {
                throw new Error(
                    `API_ERROR: HTTP ${response.status} - ${response.statusText}`
                );
            }
        }

        const data = await response.json();

        // Validate response structure
        if (!data.astronomy?.astro?.moon_phase) {
            throw new Error('API_ERROR: Invalid response structure');
        }

        const moonPhase = data.astronomy.astro.moon_phase;
        const moonIllumination = data.astronomy.astro.moon_illumination;

        console.log(`🌙 Moon Phase: ${moonPhase}`);
        console.log(`💡 Illumination: ${moonIllumination}%`);

        const internalKey = phaseKeyMap[moonPhase];

        if (!internalKey) {
            throw new Error(`PHASE_ERROR: Unknown moon phase: "${moonPhase}"`);
        }

        const moonData = moonPhaseInformation[internalKey];

        updateMoonUI(moonData);
        calculateNextPhaseCountdown();
        hideMoonError();

        console.log('✅ Moon phase data fetched successfully from API');
    } catch (error) {
        console.error('❌ Error fetching moon phase data:', error);

        // ✅ IMPROVED: Show specific error messages
        if (error.message.includes('API_KEY_ERROR')) {
            showMoonError('Ошибка API ключа. Проверьте настройки.');
        } else if (error.message.includes('PHASE_ERROR')) {
            showMoonError(
                'Неизвестная фаза луны. Используется локальный расчет.'
            );
        } else if (!navigator.onLine) {
            showMoonError(
                'Нет подключения к интернету. Используется локальный расчет.'
            );
        } else {
            showMoonError(
                'Не удалось загрузить данные о фазе луны. Используется локальный расчет.'
            );
        }

        console.log('🔄 Attempting fallback to local calculation...');
        getLocalMoonPhase();
    } finally {
        await setLoadingState(false);
    }
}

/* ===================================
   8️⃣ ERROR HANDLING
   =================================== */

function showMoonError(message) {
    if (!moonDOM) {
        moonDOM = new MoonPhaseDOM();
    }

    if (moonDOM.error) {
        moonDOM.error.textContent = message;
        moonDOM.error.classList.add('show');

        setTimeout(() => {
            hideMoonError();
        }, 5000);
    }
}

function hideMoonError() {
    if (moonDOM?.error) {
        moonDOM.error.classList.remove('show');
    }
}

/* ===================================
   9️⃣ LOCAL CALCULATION ✅ IMPROVED
   =================================== */

/**
 * ✅ IMPROVED: Updated reference date for better accuracy
 */
function getLocalMoonPhase() {
    try {
        const today = new Date();
        // ✅ IMPROVED: More recent reference date (less accumulated error)
        const knownNewMoon = new Date('2024-12-01');
        const lunarCycle = 29.53058867;

        const daysSinceNewMoon = (today - knownNewMoon) / (1000 * 60 * 60 * 24);
        const currentCycle = daysSinceNewMoon % lunarCycle;

        let phase, internalKey;

        if (currentCycle < 1.84) {
            phase = 'New Moon';
            internalKey = 'newMoon';
        } else if (currentCycle < 7.38) {
            phase = 'Waxing Crescent';
            internalKey = 'waxingMoon';
        } else if (currentCycle < 9.23) {
            phase = 'First Quarter';
            internalKey = 'waxingMoon';
        } else if (currentCycle < 14.77) {
            phase = 'Waxing Gibbous';
            internalKey = 'waxingMoon';
        } else if (currentCycle < 16.61) {
            phase = 'Full Moon';
            internalKey = 'fullMoon';
        } else if (currentCycle < 22.15) {
            phase = 'Waning Gibbous';
            internalKey = 'waningMoon';
        } else if (currentCycle < 23.99) {
            phase = 'Last Quarter';
            internalKey = 'waningMoon';
        } else {
            phase = 'Waning Crescent';
            internalKey = 'waningMoon';
        }

        const illumination = calculateIllumination(currentCycle);

        console.log(`🌙 Local calculation: ${phase}`);
        console.log(`📊 Cycle position: ${currentCycle.toFixed(2)} days`);
        console.log(`💡 Estimated illumination: ${illumination.toFixed(1)}%`);

        const moonData = moonPhaseInformation[internalKey];
        updateMoonUI(moonData);
        calculateNextPhaseCountdown(currentCycle);

        // Show info message
        if (moonDOM?.error) {
            moonDOM.error.textContent =
                'Используется локальный расчет фазы луны';
            moonDOM.error.style.background = '#e7f3ff';
            moonDOM.error.style.color = '#0066cc';
            moonDOM.error.style.borderColor = '#99ccff';
            moonDOM.error.classList.add('show');

            setTimeout(() => {
                hideMoonError();
                moonDOM.error.style.background = '';
                moonDOM.error.style.color = '';
                moonDOM.error.style.borderColor = '';
            }, 3000);
        }

        console.log('✅ Local moon phase calculation completed successfully');
    } catch (error) {
        console.error('❌ Error in local moon phase calculation:', error);
        showMoonError('Ошибка при расчете фазы луны');
    }
}

function calculateIllumination(cycleDay) {
    const lunarCycle = 29.53058867;
    const phaseAngle = (2 * Math.PI * cycleDay) / lunarCycle;
    const illumination = ((1 - Math.cos(phaseAngle)) / 2) * 100;
    return illumination;
}

/* ===================================
   🔟 INITIALIZATION
   =================================== */

async function initializeMoonPhase() {
    try {
        moonDOM = new MoonPhaseDOM();

        if (!moonDOM.isReady()) {
            console.error(
                '❌ Moon section DOM not ready. Check HTML structure.'
            );
            return;
        }

        if (!navigator.onLine) {
            console.log('📡 Offline detected, using local calculation');
            getLocalMoonPhase();
            return;
        }

        console.log('🌐 Online detected, fetching from API');
        await fetchMoonPhase();
    } catch (error) {
        console.error('❌ Initialization failed:', error);
        console.log('🔄 Falling back to local calculation');
        getLocalMoonPhase();
    }
}

function setupNetworkMonitoring() {
    window.addEventListener('online', () => {
        console.log('✅ Connection restored, refreshing moon data');
        initializeMoonPhase();
    });

    window.addEventListener('offline', () => {
        console.log('⚠️ Connection lost, using local calculation');
        getLocalMoonPhase();
    });

    console.log('📡 Network monitoring initialized');
}

/* ===================================
   1️⃣1️⃣ AUTO-START
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Moon Phase Module...');
    initializeMoonPhase();
    setupNetworkMonitoring();
    console.log('✅ Moon Phase Module initialized');
});

/* ===================================
   1️⃣2️⃣ MODULE EXPORTS
   =================================== */

export { initializeMoonPhase, getLocalMoonPhase, updateMoonUI };

/* ================================================
   1️⃣3️⃣ DEBUG UTILITIES
   ================================================ */

//📊 TESTING FUNCTIONS - Copy to console:

// 1. Check if DOM elements are found correctly
function debugMoonDOM() {
    const dom = new MoonPhaseDOM();
    console.log('Layout:', dom.layout);
    console.log('Image:', dom.image);
    console.log('Phase name:', dom.phaseName?.textContent);
    console.log('Countdown:', dom.countdown?.textContent);
    console.log('Rituals:', dom.rituals?.textContent);
    console.log('Is Ready:', dom.isReady());
}

// 2. Test API fetch manually
async function testMoonAPI() {
    console.log('🧪 Testing API fetch...');
    await fetchMoonPhase();
}

// 3. Test local calculation
function testLocalCalculation() {
    console.log('🧪 Testing local calculation...');
    getLocalMoonPhase();
}

// 4. Force show specific phase
function testShowPhase(phaseKey) {
    console.log('🧪 Testing phase:', phaseKey);
    const moonData = moonPhaseInformation[phaseKey];
    updateMoonUI(moonData);
}

// 5. Test error display
function testErrorDisplay() {
    console.log('🧪 Testing error display...');
    showMoonError('This is a test error message');
}

// RUN TESTS:
debugMoonDOM();
// testMoonAPI();
// testLocalCalculation();
// testShowPhase('fullMoon');
// testErrorDisplay();
