// ------------------ Moon Phase Localized Data ------------------

const moonPhaseInformation = {
    newMoon: {
        moonPhaseNameRussian: 'Новолуние',
        moonPhaseNameLithuanian: 'Jaunatis',
        moonPhaseImage: './img/05-moon-section/moon-phase-1-new-moon.png',
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
        moonPhaseImage: './img/05-moon-section/moon-phase-2-waxing-moon.png',
        moonPhaseRitualsRussian: ['Рост', 'Развитие', 'Привлечение'],
        moonPhaseRitualsLithuanian: ['Augimas', 'Plėtra', 'Patraukimas'],
    },
    fullMoon: {
        moonPhaseNameRussian: 'Полная луна',
        moonPhaseNameLithuanian: 'Pilnatis',
        moonPhaseImage: './img/05-moon-section/moon-phase-4-full-moon.png',
        moonPhaseRitualsRussian: ['Завершение', 'Благодарность', 'Энергия'],
        moonPhaseRitualsLithuanian: ['Užbaigimas', 'Padėka', 'Energija'],
    },
    waningMoon: {
        moonPhaseNameRussian: 'Убывающая луна',
        moonPhaseNameLithuanian: 'Delčia',
        moonPhaseImage: './img/05-moon-section/moon-phase-3-waning-moon.png',
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

// ------------------ Loading State Management ------------------

function setLoadingState(isLoading) {
    const moonSection = document.querySelector(
        '.moon-information-section__component'
    );
    const moonPhaseName = document.querySelector('.moon-section__card-text');
    const moonRituals = document.querySelector('.moon-section__card-text');
    const moonCountdown = document.querySelector('.moon-section__card-text');

    if (isLoading) {
        moonSection?.classList.add('loading');
        if (moonPhaseName) moonPhaseName.textContent = 'Загрузка...';
        if (moonRituals) moonRituals.textContent = 'Загрузка...';
        if (moonCountdown) moonCountdown.textContent = 'Загрузка...';
    } else {
        moonSection?.classList.remove('loading');
    }
}

// ------------------ Update UI Function ------------------

function updateMoonUI(moonData) {
    try {
        // Update moon phase image
        const moonImage = document.querySelector('.moon-section__image');
        if (moonImage) {
            moonImage.src = moonData.moonPhaseImage;
            moonImage.alt = `Picture of ${moonData.moonPhaseNameRussian}`;
            // Add loading transition
            moonImage.style.opacity = '0';
            moonImage.onload = () => {
                moonImage.style.opacity = '1';
            };
        }

        // Update moon phase name
        const moonPhaseName = document.querySelector(
            '.moon-section__card-text'
        );
        if (moonPhaseName) {
            moonPhaseName.textContent = moonData.moonPhaseNameRussian;
        }

        // Update rituals list
        const moonRituals = document.querySelector('.moon-section__card-text');
        if (moonRituals) {
            moonRituals.textContent =
                moonData.moonPhaseRitualsRussian.join(', ');
        }

        console.log(`✅ Moon UI updated successfully`);
    } catch (error) {
        console.error('Error updating moon UI:', error);
        showMoonError('Ошибка при обновлении интерфейса');
    }
}

// ------------------ Calculate Next Phase (Enhanced) ------------------

function calculateNextPhaseCountdown() {
    try {
        // This is a simplified calculation - for more accuracy, you'd need a proper lunar calendar library
        const lunarCycle = 29.53; // days
        const phaseLength = lunarCycle / 4; // ~7.38 days per phase

        // This is placeholder logic - replace with actual calculation
        const randomDays = Math.floor(Math.random() * 7) + 1;
        const randomHours = Math.floor(Math.random() * 24);
        const randomMinutes = Math.floor(Math.random() * 60);

        const countdownElement = document.querySelector(
            '.moon-section__card-text'
        );
        if (countdownElement) {
            countdownElement.textContent = `${randomDays} дн. ${randomHours} ч. ${randomMinutes} мин`;
        }
    } catch (error) {
        console.error('Error calculating countdown:', error);
        const countdownElement = document.querySelector(
            '.moon-section__card-text'
        );
        if (countdownElement) {
            countdownElement.textContent = 'Недоступно';
        }
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
        setLoadingState(true);

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
            throw new Error(`Unknown moon phase: "${moonPhase}"`);
        }

        const moonData = moonPhaseInformation[internalKey];
        updateMoonUI(moonData);
        calculateNextPhaseCountdown();

        // Hide any previous error messages
        hideMoonError();
    } catch (error) {
        console.error('Error fetching moon phase data:', error);
        showMoonError(
            'Не удалось загрузить данные о фазе луны. Попробуйте позже.'
        );
        // Try fallback
        getLocalMoonPhase();
    } finally {
        setLoadingState(false);
    }
}

// ------------------ Error Handling ------------------

function showMoonError(message) {
    const errorElement = document.querySelector('.moon-section__error');

    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');

        // Auto-hide after 5 seconds
        setTimeout(() => {
            hideMoonError();
        }, 5000);
    }
}

function hideMoonError() {
    const errorElement = document.querySelector('.moon-section__error');
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

// ------------------ Alternative: Local Moon Phase Calculation ------------------

function getLocalMoonPhase() {
    try {
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

        // Show info that we're using local calculation
        const errorElement = document.querySelector('.moon-section__error');
        if (errorElement) {
            errorElement.textContent =
                'Используется локальный расчет фазы луны';
            errorElement.style.background = '#e7f3ff';
            errorElement.style.color = '#0066cc';
            errorElement.style.borderColor = '#99ccff';
            errorElement.classList.add('show');

            setTimeout(() => {
                hideMoonError();
            }, 3000);
        }
    } catch (error) {
        console.error('Error in local moon phase calculation:', error);
        showMoonError('Ошибка при расчете фазы луны');
    }
}

// ------------------ Main Function with Enhanced Error Handling ------------------

async function initializeMoonPhase() {
    try {
        // Check if we're online
        if (!navigator.onLine) {
            console.log('Offline detected, using local calculation');
            getLocalMoonPhase();
            return;
        }

        await fetchMoonPhase();
    } catch (error) {
        console.log('API failed, using local calculation as fallback');
        getLocalMoonPhase();
    }
}

// ------------------ Network Status Monitoring ------------------

function setupNetworkMonitoring() {
    window.addEventListener('online', () => {
        console.log('Connection restored, refreshing moon data');
        initializeMoonPhase();
    });

    window.addEventListener('offline', () => {
        console.log('Connection lost, using local calculation');
        getLocalMoonPhase();
    });
}

// ------------------ Initialize when DOM is ready ------------------

document.addEventListener('DOMContentLoaded', () => {
    initializeMoonPhase();
    setupNetworkMonitoring();
});

// Export for module usage
export { initializeMoonPhase, getLocalMoonPhase, updateMoonUI };
