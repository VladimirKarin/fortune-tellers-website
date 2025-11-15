// ------------------------------------------------------------------
// Utility functions (centralized date logic)
// ------------------------------------------------------------------
export function getCurrentDate() {
    const currentDate = new Date();
    const currentDateISO = currentDate.toISOString().split('T')[0];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const dayOfTheWeek = currentDate.getDay();
    const dayOfTheMonth = currentDate.getDate();
    const weekdayName = currentDate.toLocaleDateString('ru-RU', {
        weekday: 'long',
    });
    // Build local ISO string to reflect local date, not UTC
    const monthPadded = String(month).padStart(2, '0');
    const dayPadded = String(dayOfTheMonth).padStart(2, '0');
    const currentDateISOPadded = `${year}-${monthPadded}-${dayPadded}`;

    return {
        currentDate,
        currentDateISO,
        year,
        month,
        dayOfTheWeek,
        dayOfTheMonth,
        weekdayName,
        isWeekend: isWeekend(dayOfTheWeek),
    };
}

// Initial date info and viewed state
let todayDateInfo = getCurrentDate();
let viewedYear = todayDateInfo.year;
let viewedMonth = todayDateInfo.month;

// Auto-update system variables
let autoUpdateInterval;
const UPDATE_INTERVAL = 6 * 60 * 60 * 1000; // 6 hours

// Trip dates for highlighting
const tripDates = {
    cityRussian: 'Вильнюс',
    start: '2025-11-18',
    end: '2025-12-01',
};

// ------------------------------------------------------------------
// Helper functions
// ------------------------------------------------------------------
function isWeekend(dayOfWeek) {
    return dayOfWeek === 6 || dayOfWeek === 0;
}

// function isToday(day) {
//     return day.toISOString().split('T')[0] === todayDateInfo.currentDateISO;
// }

function isToday(day) {
    // Compare local dates rather than UTC
    return (
        day.getFullYear() === todayDateInfo.year &&
        day.getMonth() + 1 === todayDateInfo.month &&
        day.getDate() === todayDateInfo.dayOfTheMonth
    );
}

function isTrip(day) {
    const formatted = day.toISOString().split('T')[0];
    return formatted >= tripDates.start && formatted <= tripDates.end;
}

function isViewedMonth(day, year, month) {
    return day.getMonth() === month - 1 && day.getFullYear() === year;
}

function formatDateISO(date) {
    return date.toISOString().split('T')[0];
}

function shouldUpdateCalendar() {
    const newInfo = getCurrentDate();
    return (
        newInfo.month !== todayDateInfo.month ||
        newInfo.year !== todayDateInfo.year
    );
}

function updateToCurrentMonth() {
    if (shouldUpdateCalendar()) {
        todayDateInfo = getCurrentDate();
        viewedYear = todayDateInfo.year;
        viewedMonth = todayDateInfo.month;
        renderCalendar();
    }
}

// Start auto-update
export function startAutoUpdate() {
    if (autoUpdateInterval) clearInterval(autoUpdateInterval);
    autoUpdateInterval = setInterval(updateToCurrentMonth, UPDATE_INTERVAL);
}

// Stop auto-update
export function stopAutoUpdate() {
    if (autoUpdateInterval) {
        clearInterval(autoUpdateInterval);
        autoUpdateInterval = null;
    }
}

// Manual update trigger
export function forceUpdateCalendar() {
    updateToCurrentMonth();
}

// Month and weekday translations
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
};
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
};

// ------------------------------------------------------------------
// Render Calendar
// ------------------------------------------------------------------
export function renderCalendar() {
    const weekContainer = document.querySelector('.calendar-weekdays');
    const dayContainer = document.querySelector('.calendar-days');
    weekContainer.innerHTML = '';
    dayContainer.innerHTML = '';

    // Render weekdays
    weekdays.russian.forEach((wd) => {
        const el = document.createElement('div');
        el.className = 'calendar-weekday';
        el.textContent = wd;
        weekContainer.appendChild(el);
    });

    // Calculate days for 6-week view
    const first = new Date(viewedYear, viewedMonth - 1, 1).getDay();
    const startIndex = first === 0 ? 6 : first - 1;
    const daysInMonth = new Date(viewedYear, viewedMonth, 0).getDate();
    const days = [];

    // Previous month's tail
    for (let i = startIndex - 1; i >= 0; i--) {
        days.push(new Date(viewedYear, viewedMonth - 1, -i));
    }
    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(viewedYear, viewedMonth - 1, i));
    }
    // Next month's head
    const fillCount = 42 - days.length;
    for (let i = 1; i <= fillCount; i++) {
        days.push(new Date(viewedYear, viewedMonth, i));
    }

    // Render each day
    days.forEach((dt) => {
        const formatted = formatDateISO(dt);
        const isTodayFlag = isToday(dt);
        const isTripFlag = isTrip(dt);
        const cell = document.createElement('div');
        cell.className = 'calendar-day';
        cell.setAttribute('role', 'gridcell');
        cell.setAttribute('tabindex', '0');
        cell.setAttribute(
            'aria-selected',
            (isTodayFlag || isTripFlag).toString()
        );

        // Apply classes
        if (isWeekend(dt.getDay())) cell.classList.add('calendar-day--weekend');
        if (isTodayFlag) cell.classList.add('calendar-day--today');
        if (isTripFlag) cell.classList.add('calendar-day--travel');
        if (!isViewedMonth(dt, viewedYear, viewedMonth))
            cell.classList.add('calendar-day--other-month');

        // Number label
        const num = document.createElement('div');
        num.className = 'calendar-day__number';
        num.textContent = dt.getDate();
        cell.appendChild(num);

        // Trip city label
        if (isTripFlag) {
            const city = document.createElement('div');
            city.className = 'calendar-day__city';
            city.textContent = tripDates.cityRussian;
            cell.appendChild(city);
        }

        dayContainer.appendChild(cell);
    });

    // Update header labels
    document.querySelector('.month-name').textContent =
        months.russian[viewedMonth - 1];
    document.querySelector('.month-year').textContent = viewedYear;
}

// ------------------------------------------------------------------
// Navigation & Page Visibility
// ------------------------------------------------------------------
const prevBtn = document.querySelector('.calendar-button--previous');
const nextBtn = document.querySelector('.calendar-button--next');
prevBtn.addEventListener('click', () => {
    viewedMonth--;
    if (viewedMonth < 1) {
        viewedMonth = 12;
        viewedYear--;
    }
    renderCalendar();
});
nextBtn.addEventListener('click', () => {
    viewedMonth++;
    if (viewedMonth > 12) {
        viewedMonth = 1;
        viewedYear++;
    }
    renderCalendar();
});
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) setTimeout(updateToCurrentMonth, 1000);
});

// Initialize calendar on load
renderCalendar();
startAutoUpdate();

// Optional debug API
// window.calendarDebug = { forceUpdate: forceUpdateCalendar, stopAutoUpdate, startAutoUpdate };
