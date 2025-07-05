// ------------------------------------------------------------------
// Utility functions (moved up for better organization)
// ------------------------------------------------------------------

// Get structured date details (centralized date logic)
export function getCurrentDate() {
    const currentDate = new Date();
    const currentDateISO = currentDate.toISOString().split('T')[0];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Convert 0-based to 1-based
    const dayOfTheWeek = currentDate.getDay();
    const dayOfTheMonth = currentDate.getDate();
    const localeDate = currentDate.toLocaleDateString();
    const weekdayName = currentDate.toLocaleDateString('ru-RU', {
        weekday: 'long',
    });

    return {
        currentDate,
        currentDateISO,
        year,
        month,
        dayOfTheWeek,
        dayOfTheMonth,
        localeDate,
        weekdayName,
        isWeekend: isWeekend(dayOfTheWeek),
    };
}

//Using getCurrentDate() as the single source of truth
let todayDateInfo = getCurrentDate();

// Initialize state: these will change when navigating months
let viewedYear = todayDateInfo.year;
let viewedMonth = todayDateInfo.month;

// Auto-update system variables
let autoUpdateInterval;
const UPDATE_INTERVAL = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
// Alternative options:
// const UPDATE_INTERVAL = 1 * 60 * 60 * 1000; // 1 hour
// const UPDATE_INTERVAL = 12 * 60 * 60 * 1000; // 12 hours

// ------------------------------------------------------------------
// Trip data (used in highlight travel dates)
// ------------------------------------------------------------------

const tripDates = {
    cityRussian: 'Вильнюс',
    cityLithuanian: 'Vilnius',
    start: '2025-07-25',
    end: '2025-08-01',
};

// ------------------------------------------------------------------
// Utility functions
// ------------------------------------------------------------------

// Check if a day is Saturday (6) or Sunday (0)
function isWeekend(dayOfWeek) {
    return dayOfWeek === 6 || dayOfWeek === 0;
}

// Using todayDateInfo.currentDateISO instead of recalculating
function isToday(day) {
    return day.toISOString().split('T')[0] === todayDateInfo.currentDateISO;
}

// Check if a day is within trip period
function isTrip(day) {
    const formatted = day.toISOString().split('T')[0];
    return formatted >= tripDates.start && formatted <= tripDates.end;
}

// Check if the day is in the viewed month/year (to fade others)
function isViewedMonth(day, year, month) {
    return day.getMonth() === month - 1 && day.getFullYear() === year;
}

// Added helper function to format date consistently
function formatDateISO(date) {
    return date.toISOString().split('T')[0];
}

//Check if we need to update the calendar
function shouldUpdateCalendar() {
    const newDateInfo = getCurrentDate();

    // Check if month or year has changed
    const monthChanged = newDateInfo.month !== todayDateInfo.month;
    const yearChanged = newDateInfo.year !== todayDateInfo.year;

    return monthChanged || yearChanged;
}

//Update calendar to current month/year
function updateToCurrentMonth() {
    console.log('🔄 Checking for calendar updates...');

    if (shouldUpdateCalendar()) {
        console.log('📅 Date changed! Updating calendar...');

        // Update our stored date info
        todayDateInfo = getCurrentDate();

        // Reset viewed month/year to current
        viewedYear = todayDateInfo.year;
        viewedMonth = todayDateInfo.month;

        // Re-render calendar
        renderCalendar();

        console.log(
            `✅ Calendar updated to ${
                months.russian[todayDateInfo.month - 1]
            } ${todayDateInfo.year}`
        );
    } else {
        console.log('✅ Calendar is up to date');
    }
}

//Start auto-update system
export function startAutoUpdate() {
    // Clear any existing interval
    if (autoUpdateInterval) {
        clearInterval(autoUpdateInterval);
    }

    // Set up new interval
    autoUpdateInterval = setInterval(() => {
        updateToCurrentMonth();
    }, UPDATE_INTERVAL);

    console.log(
        `🚀 Auto-update started (checking every ${
            UPDATE_INTERVAL / (60 * 60 * 1000)
        } hours)`
    );
}

//Stop auto-update system (useful for cleanup)
export function stopAutoUpdate() {
    if (autoUpdateInterval) {
        clearInterval(autoUpdateInterval);
        autoUpdateInterval = null;
        console.log('⏹️ Auto-update stopped');
    }
}

//Manual update function (for testing or user-triggered updates)
export function forceUpdateCalendar() {
    updateToCurrentMonth();
}

// ------------------------------------------------------------------
// Month and Weekday Translations
// ------------------------------------------------------------------

// Translated month names
const months = {
    russian: [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь',
    ],
    lithuanian: [
        'Sausis',
        'Vasaris',
        'Kovas',
        'Balandis',
        'Gegužė',
        'Birželis',
        'Liepa',
        'Rugpjūtis',
        'Rugsėjis',
        'Spalis',
        'Lapkritis',
        'Gruodis',
    ],
};

// Translated weekday names
const weekdays = {
    russian: [
        'Понедельник',
        'Вторник',
        'Среда',
        'Четверг',
        'Пятница',
        'Суббота',
        'Воскресенье',
    ],
    lithuanian: [
        'Pirmadienis',
        'Antradienis',
        'Treciadienis',
        'Ketvirtadienis',
        'Penktadienis',
        'Sestadienis',
        'Sekmadienis',
    ],
};

// ------------------------------------------------------------------
// Rendering Calendar UI
// ------------------------------------------------------------------

export function renderCalendar() {
    const calendarWeekdays = document.querySelector('.calendar-weekdays');
    const calendarDays = document.querySelector('.calendar-days');

    calendarWeekdays.innerHTML = '';
    calendarDays.innerHTML = '';

    // Render weekday labels in Russian
    weekdays.russian.forEach((weekday) => {
        const weekdayElement = document.createElement('div');
        weekdayElement.className = 'calendar-weekday';
        weekdayElement.textContent = weekday;
        calendarWeekdays.appendChild(weekdayElement);
    });

    // ----------- Date Grid Calculation -----------

    const firstDayOfMonth = new Date(viewedYear, viewedMonth - 1, 1).getDay();

    // Shift so that Monday is 0, Sunday is 6
    const correctedStartWeekday =
        firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const daysInMonth = new Date(viewedYear, viewedMonth, 0).getDate();

    const days = [];

    // Step 1: Fill in previous month's days (if month doesn't start on Monday)
    for (let i = correctedStartWeekday - 1; i >= 0; i--) {
        days.push(new Date(viewedYear, viewedMonth - 1, 0 - i));
    }

    // Step 2: Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(viewedYear, viewedMonth - 1, i));
    }

    // Step 3: Fill up to 42 days total (6 weeks)
    const nextMonthDays = 42 - days.length;
    for (let i = 1; i <= nextMonthDays; i++) {
        days.push(new Date(viewedYear, viewedMonth, i));
    }

    // ----------- Create Metadata for Each Day -----------
    const modifiedDays = days.map((day) => {
        const formatted = formatDateISO(day);

        return {
            date: formatted,
            day: day.getDate(),
            weekend: isWeekend(day.getDay()) ? 'calendar-day--weekend' : '',
            today: isToday(day) ? 'calendar-day--today' : '',
            trip: isTrip(day) ? 'calendar-day--travel' : '',
            tripCity: isTrip(day) ? tripDates.cityRussian : '',
            otherMonth: !isViewedMonth(day, viewedYear, viewedMonth)
                ? 'calendar-day--other-month'
                : '',
        };
    });

    // ----------- Render Calendar Cells -----------

    modifiedDays.forEach((day) => {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';

        // Add modifiers
        if (day.today) dayElement.classList.add(day.today);
        if (day.weekend) dayElement.classList.add(day.weekend);
        if (day.trip) dayElement.classList.add(day.trip);
        if (day.otherMonth) dayElement.classList.add(day.otherMonth);

        // Add date number
        const dayNumber = document.createElement('div');
        dayNumber.className = 'calendar-day__number';
        dayNumber.textContent = day.day;
        dayElement.appendChild(dayNumber);

        // Add city label if it's a trip day
        if (day.trip) {
            const cityLabel = document.createElement('div');
            cityLabel.className = 'calendar-day__city';
            cityLabel.textContent = day.tripCity;
            dayElement.appendChild(cityLabel);
        }

        calendarDays.appendChild(dayElement);
    });

    // Update calendar header
    document.querySelector('.month-name').textContent =
        months.russian[viewedMonth - 1];
    document.querySelector('.month-year').textContent = viewedYear;
}

// ------------------------------------------------------------------
// Calendar Navigation Buttons
// ------------------------------------------------------------------

const previousButton = document.querySelector('.calendar-button--previous');
const nextButton = document.querySelector('.calendar-button--next');

// Previous month
previousButton.addEventListener('click', () => {
    viewedMonth--;
    if (viewedMonth < 1) {
        viewedMonth = 12;
        viewedYear--;
    }
    renderCalendar();
});

// Next month
nextButton.addEventListener('click', () => {
    viewedMonth++;
    if (viewedMonth > 12) {
        viewedMonth = 1;
        viewedYear++;
    }
    renderCalendar();
});

// ------------------------------------------------------------------
//Page Visibility API for smart updates
// ------------------------------------------------------------------

// Update when user returns to the tab (in addition to timer)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Page became visible - check for updates
        setTimeout(() => {
            updateToCurrentMonth();
        }, 1000); // Small delay to ensure page is fully loaded
    }
});

// ------------------------------------------------------------------
// Initialization
// ------------------------------------------------------------------

// ------------------------------------------------------------------
//  Global functions for debugging/manual control
// ------------------------------------------------------------------
// window.calendarDebug = {
//     forceUpdate: forceUpdateCalendar,
//     shouldUpdate: shouldUpdateCalendar,
//     currentInfo: () => todayDateInfo,
//     stopAutoUpdate: stopAutoUpdate,
//     startAutoUpdate: startAutoUpdate,
// };

// console.log('📅 Calendar initialized with auto-update system');
// console.log('🛠️ Debug functions available: window.calendarDebug');
