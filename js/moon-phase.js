// ------------------ Moon Phase Localized Data ------------------

const moonPhaseInformation = {
    newMoon: {
        moonPhaseNameRussian: 'Новолуние',
        moonPhaseNameLithuanian: 'Jaunatis',
        moonPhaseImage:
            './img/moon-information-pictures/moon-phase-1-new-moon.png',
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
            './img/moon-information-pictures/moon-phase-2-waxing-moon.png',
        moonPhaseRitualsRussian: ['Рост', 'Развитие', 'Привлечение'],
        moonPhaseRitualsLithuanian: ['Augimas', 'Plėtra', 'Patraukimas'],
    },
    fullMoon: {
        moonPhaseNameRussian: 'Полная луна',
        moonPhaseNameLithuanian: 'Pilnatis',
        moonPhaseImage:
            './img/moon-information-pictures/moon-phase-3-full-moon.png',
        moonPhaseRitualsRussian: ['Завершение', 'Благодарность', 'Энергия'],
        moonPhaseRitualsLithuanian: ['Užbaigimas', 'Padėka', 'Energija'],
    },
    waningMoon: {
        moonPhaseNameRussian: 'Убывающая луна',
        moonPhaseNameLithuanian: 'Delčia',
        moonPhaseImage:
            './img/moon-information-pictures/moon-phase-4-waning-moon.png',
        moonPhaseRitualsRussian: ['Освобождение', 'Очищение', 'Прощение'],
        moonPhaseRitualsLithuanian: ['Išlaisvinimas', 'Valymas', 'Atleidimas'],
    },
};

// ------------------ Phase Key Mapping ------------------

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

// ------------------ Update UI Function ------------------

function updateMoonUI(moonData) {
    try {
        // Update moon phase image
        const moonImage = document.querySelector(
            '.moon-information-section__component__picture__img'
        );
        if (moonImage) {
            moonImage.src = moonData.moonPhaseImage;
            moonImage.alt = `Picture of ${moonData.moonPhaseNameRussian}`;
        }

        // Update moon phase name
        const moonPhaseName = document.querySelector(
            '.moon-information-section__component__information__content__moon-phase'
        );
        if (moonPhaseName) {
            moonPhaseName.textContent = moonData.moonPhaseNameRussian;
        }

        // Update rituals list
        const moonRituals = document.querySelector(
            '.moon-information-section__component__information__content__moon-phase-rituals'
        );
        if (moonRituals) {
            moonRituals.textContent =
                moonData.moonPhaseRitualsRussian.join(', ');
        }

        console.log(`✅ Moon UI updated successfully`);
    } catch (error) {
        console.error('Error updating moon UI:', error);
    }
}

// ------------------ Calculate Next Phase (Optional Enhancement) ------------------

function calculateNextPhaseCountdown() {
    // This is a simplified calculation - for more accuracy, you'd need a proper lunar calendar library
    const lunarCycle = 29.53; // days
    const phaseLength = lunarCycle / 4; // ~7.38 days per phase

    // This is placeholder logic - replace with actual calculation
    const randomDays = Math.floor(Math.random() * 7) + 1;
    const randomHours = Math.floor(Math.random() * 24);
    const randomMinutes = Math.floor(Math.random() * 60);

    const countdownElement = document.querySelector(
        '.moon-information-section__component__information__content__moon-phase-countdown'
    );
    if (countdownElement) {
        countdownElement.textContent = `${randomDays} дн. ${randomHours} ч. ${randomMinutes} мин`;
    }
}

// ------------------ Fetch and Display Moon Data ------------------

async function fetchMoonPhase() {
    // For production, move this to your backend or use environment variables properly
    const apiKey = '5ab4e849d02243d4884135415252205'; // Consider moving to backend
    const location = 'Klaipeda';
    const date = new Date().toISOString().split('T')[0];
    const url = `https://api.weatherapi.com/v1/astronomy.json?key=${apiKey}&q=${location}&dt=${date}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(
                `API request failed with status ${response.status}`
            );
        }

        const data = await response.json();
        const moonPhase = data.astronomy.astro.moon_phase;
        const moonIllumination = data.astronomy.astro.moon_illumination;

        console.log(`🌙 Moon Phase: ${moonPhase}`);
        console.log(`💡 Illumination: ${moonIllumination}%`);

        const internalKey = phaseKeyMap[moonPhase];
        if (!internalKey) {
            console.error(`❌ Unknown moon phase: "${moonPhase}"`);
            showMoonError(`Unknown moon phase: "${moonPhase}"`);
            return;
        }

        const moonData = moonPhaseInformation[internalKey];
        updateMoonUI(moonData);
        calculateNextPhaseCountdown();
    } catch (error) {
        console.error('Error fetching moon phase data:', error);
        showMoonError(
            'Unable to fetch moon phase data. Please try again later.'
        );
    }
}

// ------------------ Error Handling ------------------

function showMoonError(message) {
    // You can either add this element to your HTML or create it dynamically
    let errorElement = document.querySelector('.moon-phase-error');

    if (!errorElement) {
        // Create error element if it doesn't exist
        errorElement = document.createElement('div');
        errorElement.className = 'moon-phase-error';
        errorElement.style.cssText = `
            color: #ff6b6b;
            background: #ffe0e0;
            padding: 10px;
            border-radius: 5px;
            margin: 10px 0;
            text-align: center;
        `;

        const moonSection = document.querySelector(
            '.moon-information-section__component'
        );
        if (moonSection) {
            moonSection.appendChild(errorElement);
        }
    }

    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// ------------------ Alternative: Local Moon Phase Calculation ------------------

function getLocalMoonPhase() {
    // Simple local calculation as fallback (less accurate but works offline)
    const today = new Date();
    const knownNewMoon = new Date('2025-05-27'); // Known new moon date
    const lunarCycle = 29.53058867; // days

    const daysSinceNewMoon = (today - knownNewMoon) / (1000 * 60 * 60 * 24);
    const currentCycle = daysSinceNewMoon % lunarCycle;

    let phase, internalKey;

    if (currentCycle < 1) {
        phase = 'New Moon';
        internalKey = 'newMoon';
    } else if (currentCycle < 7.38) {
        phase = 'Waxing Crescent';
        internalKey = 'waxingMoon';
    } else if (currentCycle < 14.77) {
        phase = 'Full Moon';
        internalKey = 'fullMoon';
    } else if (currentCycle < 22.15) {
        phase = 'Waning Gibbous';
        internalKey = 'waningMoon';
    } else {
        phase = 'Waning Crescent';
        internalKey = 'waningMoon';
    }

    console.log(`🌙 Local Moon Phase: ${phase}`);
    const moonData = moonPhaseInformation[internalKey];
    updateMoonUI(moonData);
    calculateNextPhaseCountdown();
}

// ------------------ Main Function with Fallback ------------------

async function initializeMoonPhase() {
    try {
        await fetchMoonPhase();
    } catch (error) {
        console.log('API failed, using local calculation as fallback');
        getLocalMoonPhase();
    }
}

export { initializeMoonPhase };
