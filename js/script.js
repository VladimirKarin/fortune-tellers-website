import { timer } from './countdown-clock.js';
import { initializeMoonPhase } from './moon-phase.js';
import Carousel from './carousel.js';

// ------------------------------------------------------------------
// MOBILE NAVIGATION FUNCTIONALITY
// ------------------------------------------------------------------

// Toggle mobile navigation menu visibility
const toggleMobileNav = () => {
    const headerElement = document.querySelector('header');
    headerElement.classList.toggle('nav-open');
};

// Add click event to the mobile navigation button
const navigationButtonElement = document.querySelector('.btn-mobile-nav');
navigationButtonElement.addEventListener('click', toggleMobileNav);

// Show/hide mobile navigation and toggle between open/close icons
document
    .querySelector('.btn-mobile-nav')
    .addEventListener('click', function () {
        const nav = document.querySelector('.main-nav');
        const openIcon = document.querySelector(
            ".icon-mobile-nav[name='color-wand']"
        );
        const closeIcon = document.querySelector(
            ".icon-mobile-nav[name='close']"
        );

        if (nav.style.display === 'block') {
            nav.style.display = 'none';
            openIcon.style.display = 'block';
            closeIcon.style.display = 'none';
        } else {
            nav.style.display = 'block';
            openIcon.style.display = 'none';
            closeIcon.style.display = 'block';
        }
    });

// ------------------------------------------------------------------
// UNIFIED POPUP FUNCTIONALITY
// ------------------------------------------------------------------

class PopupManager {
    constructor() {
        this.createPopupElements();
        this.initializeEventListeners();
    }

    createPopupElements() {
        // Create main popup elements
        this.overlay = document.createElement('div');
        this.overlay.className = 'popup-overlay';

        this.content = document.createElement('div');
        this.content.className = 'popup-content';

        this.title = document.createElement('h2');
        this.title.className = 'popup-title';

        this.closeBtn = document.createElement('span');
        this.closeBtn.className = 'popup-close';
        this.closeBtn.innerHTML = '&times;';

        this.text = document.createElement('div');
        this.text.className = 'popup-text';

        // Assemble popup structure
        this.content.appendChild(this.closeBtn);
        this.content.appendChild(this.title);
        this.content.appendChild(this.text);
        this.overlay.appendChild(this.content);
        document.body.appendChild(this.overlay);
    }

    initializeEventListeners() {
        // Close button click
        this.closeBtn.addEventListener('click', () => this.close());

        // Click outside content
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.close();
        });

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (
                e.key === 'Escape' &&
                this.overlay.classList.contains('active')
            ) {
                this.close();
            }
        });

        // Service card buttons
        document
            .querySelectorAll('.services__card_button')
            .forEach((button) => {
                button.addEventListener('click', () => {
                    const card = button.closest('.services__card');
                    const paragraph = card.querySelector(
                        '.services__card__text'
                    );
                    const content = paragraph.textContent;
                    this.show('Service Details', content);
                });
            });

        // Gallery item buttons
        document.querySelectorAll('.gallery-item-button').forEach((button) => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const card = button.closest('.gallery-item');
                const title = card.querySelector(
                    '.gallery-item-title'
                ).textContent;
                const content =
                    card.querySelector('.gallery-item-text').innerHTML;
                this.show(title, content);
            });
        });
    }

    show(title, content) {
        this.title.textContent = title;
        this.text.innerHTML = content;
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            this.title.textContent = '';
            this.text.innerHTML = '';
        }, 300);
    }
}

// ------------------------------------------------------------------
// CAROUSEL FUNCTIONALITY
// ------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    new Carousel();
});

// ------------------------------------------------------------------
// INITIALIZATION
// ------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function () {
    const popupManager = new PopupManager();
    const carousel = new Carousel();
});

// ------------------------------------------------------------------
// Countdown clock
// ------------------------------------------------------------------

window.onload = function () {
    timer();
    setInterval(timer, 1000);
};

// ------------------------------------------------------------------
// Moon Phase Section Logic
// ------------------------------------------------------------------

initializeMoonPhase();

// ------------------------------------------------------------------
// Calendar Section Logic
// ------------------------------------------------------------------

// Get today's date
const currentDate = new Date();

// Format today's date to 'YYYY-MM-DD' (used to check if a given day is "today")
const modifiedCurrentDate = currentDate.toISOString().split('T')[0];

// Extract parts of today's date
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth() + 1; // +1 to convert from 0-based index
const currentDayOfTheWeek = currentDate.getDay(); // Sunday = 0
const currentDayOfTheMonth = currentDate.getDate(); // 1–31

// Initialize state: these will change when navigating months
let viewedYear = currentYear;
let viewedMonth = currentMonth;

// -------------------------
// Trip data (used in highlight)
// -------------------------

const tripDates = {
    cityRussian: 'Вильнюс',
    cityLithuanian: 'Vilnius',
    start: '2025-06-01',
    end: '2025-06-13',
};

// -------------------------
// Utility functions
// -------------------------

function isWeekend(dayOfWeek) {
    return dayOfWeek === 6 || dayOfWeek === 0; // Saturday or Sunday
}

function isToday(day) {
    return day.toISOString().split('T')[0] === modifiedCurrentDate;
}

function isTrip(day) {
    const formatted = day.toISOString().split('T')[0];
    return formatted >= tripDates.start && formatted <= tripDates.end;
}

function isViewedMonth(day, year, month) {
    return day.getMonth() === month - 1 && day.getFullYear() === year;
}

// 🆕 Provide translations for month names
const months = {
    russian: [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
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
        'Gegužė',
        'Birželis',
        'Liepa',
        'Rugpjūtis',
        'Rugsėjis',
        'Spalis',
        'Lapkritis',
        'Gruodis',
    ],
};

// -------------------------
// Weekday labels in two languages
// -------------------------

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

function renderCalendar() {
    const calendarWeekdays = document.querySelector('.calendar-weekdays');
    const calendarDays = document.querySelector('.calendar-days');

    calendarWeekdays.innerHTML = '';
    calendarDays.innerHTML = '';

    // 🆕 Render weekday labels (can switch language here)
    weekdays.russian.forEach((weekday) => {
        const weekdayElement = document.createElement('div');
        weekdayElement.className = 'calendar-weekday';
        weekdayElement.textContent = weekday;
        calendarWeekdays.appendChild(weekdayElement);
    });

    // ----------- Date Grid Calculation Logic -----------

    const firstDayOfMonth = new Date(viewedYear, viewedMonth - 1, 1).getDay();

    // 🆕 Adjust so Monday is 0, Sunday is 6
    const correctedStartWeekday =
        firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const daysInMonth = new Date(viewedYear, viewedMonth, 0).getDate();

    // Step 1: Previous month's tail days
    const days = [];
    for (let i = correctedStartWeekday - 1; i >= 0; i--) {
        days.push(new Date(viewedYear, viewedMonth - 1, 0 - i));
    }

    // Step 2: Current month days
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(viewedYear, viewedMonth - 1, i));
    }

    // Step 3: Next month filler to complete 6 weeks (max 42 cells)
    let nextMonthDays = 42 - days.length;
    for (let i = 1; i <= nextMonthDays; i++) {
        days.push(new Date(viewedYear, viewedMonth, i));
    }

    // ----------- Add Metadata to Each Day -----------

    const modifiedDays = days.map((day) => {
        const formatted = day.toISOString().split('T')[0];

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

    // ----------- Render Each Day -----------

    modifiedDays.forEach((day) => {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';

        // 🆕 Apply class names conditionally
        if (day.today) dayElement.classList.add(day.today);
        if (day.weekend) dayElement.classList.add(day.weekend);
        if (day.trip) dayElement.classList.add(day.trip);
        if (day.otherMonth) dayElement.classList.add(day.otherMonth);

        // dayElement.textContent = day.day;
        // calendarDays.appendChild(dayElement);

        // Add main number
        const dayNumber = document.createElement('div');
        dayNumber.className = 'calendar-day__number';
        dayNumber.textContent = day.day;
        dayElement.appendChild(dayNumber);

        // 🆕 Add city label if it's a travel day
        if (day.trip) {
            const cityLabel = document.createElement('div');
            cityLabel.className = 'calendar-day__city';
            cityLabel.textContent = day.tripCity;
            dayElement.appendChild(cityLabel);
        }

        calendarDays.appendChild(dayElement);
    });

    // 🆕 Set header labels
    const calendarMonth = document.querySelector('.month-name');
    calendarMonth.textContent = months.russian[viewedMonth - 1];

    const calendarYear = document.querySelector('.month-year');
    calendarYear.textContent = viewedYear;
}

// ------------------------------------------------------------------
// Calendar Navigation Buttons
// ------------------------------------------------------------------

const previousButton = document.querySelector('.calendar-button--previous');
const nextButton = document.querySelector('.calendar-button--next');

// 🆕 Navigate to previous month
previousButton.addEventListener('click', () => {
    viewedMonth--;
    if (viewedMonth < 1) {
        viewedMonth = 12;
        viewedYear--;
    }
    renderCalendar(); // regenerate everything based on new month
});

// 🆕 Navigate to next month
nextButton.addEventListener('click', () => {
    viewedMonth++;
    if (viewedMonth > 12) {
        viewedMonth = 1;
        viewedYear++;
    }
    renderCalendar(); // regenerate everything based on new month
});

// 🆕 Initial rendering
renderCalendar();
