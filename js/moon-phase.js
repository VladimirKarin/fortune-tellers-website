// ================================================
// 🌙 MOON PHASE MODULE - Dynamic Moon Information Display
// ================================================
import { getTranslation, getCurrentLanguage } from './i18n.js';
//
// 📋 MODULE PURPOSE:
// Displays current moon phase information with automatic updates from
// WeatherAPI. Shows phase name, countdown to next phase, ritual
// recommendations, and visual moon phase image. Falls back to local
// calculation if API is unavailable.
//
// 🎬 DATA FLOW:
// 1. Initialize DOM manager and validate elements
// 2. Attempt to fetch data from WeatherAPI
// 3. If successful → display API data
// 4. If failed → fall back to local astronomical calculation
// 5. Update UI with phase info, countdown, and rituals
//
// 🔗 DEPENDENCIES:
// - WeatherAPI (https://api.weatherapi.com)
// - HTML: .moon-section with specific card structure
// - CSS: 08-moon-information-section-styles.css
// - Images: Moon phase images in ../img/05-moon-information-section/
//
// 📦 FEATURES:
// - Real-time moon phase from WeatherAPI
// - Offline-capable with local calculation fallback
// - Countdown timer to next moon phase
// - Localized phase names (Russian/Lithuanian)
// - Ritual recommendations for each phase
// - Network status monitoring (online/offline detection)
// - Loading states with minimum display time
// - Comprehensive error handling
//
// ⚠️ IMPORTANT NOTES:
// - Self-initializing on DOMContentLoaded (no manual init needed)
// - API key should be moved to backend in production
// - Uses parent-based DOM traversal (not index-based)
// - Reference date updated to Dec 2024 for better accuracy

/* ===================================
   📊 MOON PHASE DATA - LOCALIZED INFORMATION
   =================================== */

/**
 * Moon phase information database
 * Contains localized names, images, and ritual recommendations
 *
 * @constant {Object.<string, {
 *   moonPhaseNameRussian: string,
 *   moonPhaseNameLithuanian: string,
 *   moonPhaseImage: string,
 *   moonPhaseRitualsRussian: Array<string>,
 *   moonPhaseRitualsLithuanian: Array<string>
 * }>}
 */
const moonPhaseInformation = {
    newMoon: {
        moonPhaseNameRussian: 'Новолуние',
        moonPhaseNameLithuanian: 'Jaunatis',
        moonPhaseImage:
            '../img/05-moon-information-section/moon-phase-1-new-moon.png',
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
            '../img/05-moon-information-section/moon-phase-2-waxing-moon.png',
        moonPhaseRitualsRussian: ['Рост', 'Развитие', 'Привлечение'],
        moonPhaseRitualsLithuanian: ['Augimas', 'Plėtra', 'Patraukimas'],
    },
    fullMoon: {
        moonPhaseNameRussian: 'Полная луна',
        moonPhaseNameLithuanian: 'Pilnatis',
        moonPhaseImage:
            '../img/05-moon-information-section/moon-phase-4-full-moon.png',
        moonPhaseRitualsRussian: ['Завершение', 'Благодарность', 'Энергия'],
        moonPhaseRitualsLithuanian: ['Užbaigimas', 'Padėka', 'Energija'],
    },
    waningMoon: {
        moonPhaseNameRussian: 'Убывающая луна',
        moonPhaseNameLithuanian: 'Delčia',
        moonPhaseImage:
            '../img/05-moon-information-section/moon-phase-3-waning-moon.png',
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
 * @constant {Object.<string, string>}
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
   🎨 DOM ELEMENT MANAGER - CACHED SELECTORS
   =================================== */

/**
 * Centralized DOM element management with cached selectors
 *
 * Uses parent-based traversal instead of fragile index-based selection.
 * Queries DOM once during initialization and reuses references throughout.
 *
 * Benefits:
 * - More reliable (not order-dependent)
 * - Better performance (no repeated queries)
 * - Easier to debug (clear error messages)
 * - Single source of truth for all DOM elements
 *
 * @class MoonPhaseDOM
 *
 * @example
 * const moonDOM = new MoonPhaseDOM();
 * if (moonDOM.isReady()) {
 *     moonDOM.phaseName.textContent = 'Full Moon';
 * }
 */
class MoonPhaseDOM {
    /**
     * Initialize DOM manager and cache all element references
     */
    constructor() {
        // Cache parent containers
        this.layout = document.querySelector('.moon-section__layout');
        this.image = document.querySelector('.moon-section__image');
        this.error = document.querySelector('.moon-section__error');

        // Get cards by parent traversal
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

        // Validate all elements
        this.validateElements();
    }

    /**
     * Validate that all required DOM elements were found
     * Logs warnings for missing elements to aid debugging
     *
     * @returns {boolean} True if all elements found, false otherwise
     * @private
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
            console.log('✅ All moon section DOM elements found');
        } else {
            console.error(
                '❌ Some moon section elements missing. Check HTML structure.'
            );
        }

        return allValid;
    }

    /**
     * Check if DOM is ready for updates
     *
     * @returns {boolean} True if all critical elements exist
     * @public
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

/**
 * Global DOM manager instance
 * @type {MoonPhaseDOM|null}
 */
let moonDOM = null;

/* ===================================
   ⏳ LOADING STATE MANAGEMENT
   =================================== */

/**
 * Loading state configuration
 * Minimum display time prevents loading flash on fast connections
 *
 * @constant {number}
 */
const MIN_LOADING_TIME = 500; // milliseconds

/**
 * Loading start timestamp
 * @type {number|null}
 */
let loadingStartTime = null;

/**
 * Set or clear loading state with minimum display time enforcement
 *
 * Shows spinner for at least MIN_LOADING_TIME even if data loads instantly.
 * This prevents jarring loading flashes on fast connections.
 *
 * @param {boolean} isLoading - True to show loading, false to hide
 * @returns {Promise<void>}
 *
 * @example
 * await setLoadingState(true);  // Show spinner
 * // ... fetch data ...
 * await setLoadingState(false); // Hide spinner (waits if needed)
 *
 * @private
 */
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

        // Add loading class (CSS handles spinner animation)
        moonDOM.layout?.classList.add('loading');

        // Update text elements
        if (moonDOM.phaseName) moonDOM.phaseName.textContent = 'Загрузка...';
        if (moonDOM.rituals) moonDOM.rituals.textContent = 'Загрузка...';
        if (moonDOM.countdown) moonDOM.countdown.textContent = 'Загрузка...';
    } else {
        // Ensure minimum loading time for smooth UX
        if (loadingStartTime) {
            const elapsed = Date.now() - loadingStartTime;
            if (elapsed < MIN_LOADING_TIME) {
                await new Promise((resolve) =>
                    setTimeout(resolve, MIN_LOADING_TIME - elapsed)
                );
            }
        }

        // Remove loading class
        moonDOM.layout?.classList.remove('loading');
    }
}

/* ===================================
   🎨 UI UPDATE FUNCTIONS
   =================================== */

/**
 * Update moon section UI with new data
 *
 * Updates:
 * - Moon phase image with fade transition
 * - Phase name text
 * - Rituals list
 *
 * Note: Countdown is updated separately via calculateNextPhaseCountdown()
 *
 * @param {Object} moonData - Moon phase data object
 * @param {string} moonData.moonPhaseImage - Path to moon image
 * @param {string} moonData.moonPhaseNameRussian - Phase name in Russian
 * @param {string} moonData.moonPhaseNameLithuanian - Phase name in Lithuanian
 * @param {Array<string>} moonData.moonPhaseRitualsRussian - Ritual recommendations
 * @param {Array<string>} moonData.moonPhaseRitualsLithuanian - Ritual recommendations in Lithuanian
 * @returns {void}
 *
 * @example
 * const moonData = moonPhaseInformation.fullMoon;
 * updateMoonUI(moonData);
 *
 * @private
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

        // Update moon phase image with fade transition
        if (moonDOM.image) {
            const currentLang = getCurrentLanguage();
            const phaseName = currentLang === 'lt' ? moonData.moonPhaseNameLithuanian : moonData.moonPhaseNameRussian;
            const altPrefix = getTranslation('moon.image_alt_prefix');

            moonDOM.image.style.opacity = '0';
            moonDOM.image.src = moonData.moonPhaseImage;
            moonDOM.image.alt = `${altPrefix}${phaseName}`;

            moonDOM.image.onload = () => {
                moonDOM.image.style.transition = 'opacity 0.3s ease';
                moonDOM.image.style.opacity = '1';
            };
        }

        // Update phase name
        if (moonDOM.phaseName) {
            moonDOM.phaseName.textContent = moonData.moonPhaseNameRussian;
        }

        // Update rituals list (comma-separated)
        if (moonDOM.rituals) {
            moonDOM.rituals.textContent =
                moonData.moonPhaseRitualsRussian.join(', ');
        }

        console.log(`✅ Moon UI updated: ${moonData.moonPhaseNameRussian}`);
    } catch (error) {
        console.error('❌ Error updating moon UI:', error);
        showMoonError('Ошибка при обновлении интерфейса');
    }
}

/* ===================================
   ⏰ COUNTDOWN CALCULATION
   =================================== */

/**
 * Calculate and display countdown to next moon phase
 *
 * Uses astronomical calculations based on lunar cycle (29.53 days).
 * Determines which phase is next and calculates time remaining.
 *
 * @param {number|null} [currentCycle=null] - Current position in lunar cycle (0-29.53)
 * @returns {void}
 *
 * @example
 * // Calculate from current date
 * calculateNextPhaseCountdown();
 *
 * @example
 * // Calculate from specific cycle position
 * calculateNextPhaseCountdown(14.5); // Mid-cycle
 *
 * @private
 */
function calculateNextPhaseCountdown(currentCycle = null) {
    try {
        if (!moonDOM) {
            moonDOM = new MoonPhaseDOM();
        }

        // Length of complete lunar cycle
        const lunarCycle = 29.53058867; // days

        // Calculate current cycle position if not provided
        if (currentCycle === null) {
            const today = new Date();
            const knownNewMoon = new Date('2024-12-01'); // Reference new moon
            const daysSinceNewMoon =
                (today - knownNewMoon) / (1000 * 60 * 60 * 24);
            currentCycle = daysSinceNewMoon % lunarCycle;
        }

        // Define phase boundaries (in days since new moon)
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

        // Update countdown display
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
   🌐 API FETCH FUNCTION
   =================================== */

/**
 * Fetch moon phase data from WeatherAPI
 *
 * Retrieves current moon phase and illumination percentage for Klaipeda.
 * Handles various error conditions with specific error messages.
 * Falls back to local calculation on any failure.
 *
 * @returns {Promise<void>}
 *
 * @throws {Error} Various API errors (401, 403, 400, etc.)
 *
 * @example
 * try {
 *     await fetchMoonPhase();
 * } catch (error) {
 *     console.error('API fetch failed:', error);
 * }
 *
 * @private
 */
async function fetchMoonPhase() {
    // ⚠️ TODO: Move API key to backend or environment variables for production
    const apiKey = '5ab4e849d02243d4884135415252205';
    const location = 'Klaipeda';
    const date = new Date().toISOString().split('T')[0];
    const url = `https://api.weatherapi.com/v1/astronomy.json?key=${apiKey}&q=${location}&dt=${date}`;

    try {
        await setLoadingState(true);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        let response;
        try {
            response = await fetch(url, { signal: controller.signal });
        } finally {
            clearTimeout(timeoutId);
        }

        // Handle HTTP errors with specific messages
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

        // Map API phase to internal key
        const internalKey = phaseKeyMap[moonPhase];

        if (!internalKey) {
            throw new Error(`PHASE_ERROR: Unknown moon phase: "${moonPhase}"`);
        }

        const moonData = moonPhaseInformation[internalKey];

        // Update UI with API data
        updateMoonUI(moonData);
        calculateNextPhaseCountdown();
        hideMoonError();

        console.log('✅ Moon phase data fetched from API');
    } catch (error) {
        console.error('❌ Error fetching moon phase:', error);

        // Show specific error messages
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
   ⚠️ ERROR HANDLING
   =================================== */

/**
 * Display error message to user
 *
 * Shows error message with auto-hide after 5 seconds.
 * Styled as error notification.
 *
 * @param {string} message - Error message to display
 * @returns {void}
 *
 * @example
 * showMoonError('Failed to load moon data');
 *
 * @private
 */
function showMoonError(message) {
    if (!moonDOM) {
        moonDOM = new MoonPhaseDOM();
    }

    if (moonDOM.error) {
        moonDOM.error.textContent = message;
        moonDOM.error.classList.add('show');

        // Auto-hide after 5 seconds
        setTimeout(() => {
            hideMoonError();
        }, 5000);
    }
}

/**
 * Hide error message
 *
 * @returns {void}
 * @private
 */
function hideMoonError() {
    if (moonDOM?.error) {
        moonDOM.error.classList.remove('show');
    }
}

/* ===================================
   📐 LOCAL CALCULATION - OFFLINE FALLBACK
   =================================== */

/**
 * Calculate moon phase locally using astronomical formulas
 *
 * Uses a known new moon date as reference and calculates current
 * position in lunar cycle. More recent reference date (Dec 2024)
 * provides better accuracy than older dates.
 *
 * Algorithm:
 * 1. Calculate days since known new moon
 * 2. Find position in current lunar cycle (mod 29.53 days)
 * 3. Determine phase based on cycle position
 * 4. Calculate approximate illumination percentage
 *
 * @returns {void}
 *
 * @example
 * getLocalMoonPhase(); // Calculate and display current phase
 *
 * @private
 */
function getLocalMoonPhase() {
    try {
        const today = new Date();
        const knownNewMoon = new Date('2024-12-01'); // Updated reference date
        const lunarCycle = 29.53058867; // Synodic month in days

        // Calculate position in current cycle
        const daysSinceNewMoon = (today - knownNewMoon) / (1000 * 60 * 60 * 24);
        const currentCycle = daysSinceNewMoon % lunarCycle;

        // Determine phase based on cycle position
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

        // Show info message (styled differently from error)
        if (moonDOM?.error) {
            moonDOM.error.textContent =
                'Используется локальный расчет фазы луны';
            moonDOM.error.style.background = '#e7f3ff';
            moonDOM.error.style.color = '#0066cc';
            moonDOM.error.style.borderColor = '#99ccff';
            moonDOM.error.classList.add('show');

            setTimeout(() => {
                hideMoonError();
                // Reset styles
                moonDOM.error.style.background = '';
                moonDOM.error.style.color = '';
                moonDOM.error.style.borderColor = '';
            }, 3000);
        }

        console.log('✅ Local moon phase calculation completed');
    } catch (error) {
        console.error('❌ Error in local moon phase calculation:', error);
        showMoonError('Ошибка при расчете фазы луны');
    }
}

/**
 * Calculate moon illumination percentage from cycle position
 *
 * Uses cosine function to approximate illumination based on
 * phase angle. 0° (new moon) = 0%, 180° (full moon) = 100%.
 *
 * @param {number} cycleDay - Current day in lunar cycle (0-29.53)
 * @returns {number} Illumination percentage (0-100)
 *
 * @example
 * const illum = calculateIllumination(14.77); // ~100% (full moon)
 * const illum = calculateIllumination(0);     // ~0% (new moon)
 *
 * @private
 */
function calculateIllumination(cycleDay) {
    const lunarCycle = 29.53058867;
    const phaseAngle = (2 * Math.PI * cycleDay) / lunarCycle;
    const illumination = ((1 - Math.cos(phaseAngle)) / 2) * 100;
    return illumination;
}

/* ===================================
   🚀 INITIALIZATION
   =================================== */

/**
 * Initialize moon phase module
 *
 * Initialization sequence:
 * 1. Create DOM manager and validate elements
 * 2. Check network status (online/offline)
 * 3. If online → fetch from API
 * 4. If offline or API fails → use local calculation
 *
 * @returns {Promise<void>}
 * @private
 */
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

/**
 * Setup network status monitoring
 *
 * Listens for online/offline events and refreshes moon data accordingly.
 * When connection is restored, attempts to fetch fresh data from API.
 *
 * @returns {void}
 * @private
 */
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
   🎬 AUTO-START
   =================================== */

/**
 * Start module when DOM is ready
 * Self-initializing - no manual initialization needed
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Moon Phase Module...');
    initializeMoonPhase();
    setupNetworkMonitoring();
    console.log('✅ Moon Phase Module initialized');
});

/* ===================================
   📤 MODULE EXPORTS
   =================================== */

/**
 * Export functions for external use or testing
 */
export { initializeMoonPhase, getLocalMoonPhase, updateMoonUI };
