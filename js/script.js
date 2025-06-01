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

// Get the current date and time
const currentDate = new Date();

// Format the current date as 'YYYY-MM-DD' for consistent comparison
const modifiedCurrentDate = currentDate.toISOString().split('T')[0]; // used in isToday

// Extract parts of the current date
const currentYear = currentDate.getFullYear(); // example: 2025
const currentMonth = currentDate.getMonth() + 1; // 0-based, so +1 gives correct human month
const currentDayOfTheWeek = currentDate.getDay(); // 0 (Sunday) to 6 (Saturday)
const currentDayOfTheMonth = currentDate.getDate(); // 1–31

// Used to determine which month is being viewed — this can change via navigation buttons later
let viewedYear = currentYear;
let viewedMonth = currentMonth;

// First day of viewed month (e.g., if viewedMonth = 6, this returns day index for June 1)
const firstDayOfMonth = new Date(viewedYear, viewedMonth - 1, 1).getDay(); // 0–6

// Total days in the viewed month (e.g., June = 30)
const lastDayOfMonth = new Date(viewedYear, viewedMonth, 0).getDate(); // used only here

// Store this weekday for aligning grid later
let startWeekday = firstDayOfMonth;

// Shift Sunday (0) to 6 and Monday (1) to 0 for ISO-style weeks
const correctedStartWeekday = startWeekday === 0 ? 6 : startWeekday - 1;

// Days in month (same as lastDayOfMonth — maybe consolidate later?)
const daysInMonth = new Date(viewedYear, viewedMonth, 0).getDate(); // <= maybe just reuse lastDayOfMonth

// -------------------------
// Utility functions
// -------------------------

function isWeekend(dayOfTheWeek) {
    return dayOfTheWeek === 6 || dayOfTheWeek === 0;
}

function isToday(day) {
    return day.toISOString().split('T')[0] === modifiedCurrentDate;
}

function isTrip(day) {
    const formatted = day.toISOString().split('T')[0];
    return formatted >= tripDates.start && formatted <= tripDates.end;
}

function isViewedMonth(day) {
    return (
        day.getMonth() === viewedMonth - 1 && day.getFullYear() === viewedYear
    );
}

// -------------------------
// Trip data
// -------------------------

const tripDates = {
    city: 'Vilnius',
    start: '2025-06-21',
    end: '2025-06-24',
};

// -------------------------
// Generate visible days array
// -------------------------

let days = [];

// Step 1: Add days from the previous month to align with correct weekday start
for (let i = correctedStartWeekday - 1; i >= 0; i--) {
    days.push(new Date(viewedYear, viewedMonth - 1, 0 - i)); // go backwards from last day of prev month
}

// Step 2: Add all days of current viewed month
for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(viewedYear, viewedMonth - 1, i));
}

// Step 3: Add extra days from next month to make full 6 weeks (42 calendar squares)
let nextMonthDays = 42 - days.length;
for (let i = 1; i <= nextMonthDays; i++) {
    days.push(new Date(viewedYear, viewedMonth, i));
}

// -------------------------
// Add metadata to each day
// -------------------------

const modifiedDays = days.map((day) => {
    const formatted = day.toISOString().split('T')[0];

    return {
        date: formatted,
        day: day.getDate(),
        weekend: isWeekend(day.getDay()) ? 'calendar-day--weekend' : '',
        today: isToday(day) ? 'calendar-day--today' : '',
        trip: isTrip(day) ? 'calendar-day--travel' : '',
        otherMonth: !isViewedMonth(day) ? 'calendar-day--other-month' : '',
    };
});

// Optional debug
// console.log(modifiedDays[28]); // preview a random day

// ------------------------------------------------------------------
// Rendering Calendar UI
// ------------------------------------------------------------------

// Weekday names (Russian and Lithuanian)
const weekdaysRus = [
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота',
    'Воскресенье',
];

const weekdaysLt = [
    'Pirmadienis',
    'Antradienis',
    'Treciadienis',
    'Ketvirtadienis',
    'Penktadienis',
    'Sestadienis',
    'Sekmadienis',
];

const calendarWeekdays = document.querySelector('.calendar-weekdays');

// Render weekday labels (you’re currently using Russian)
weekdaysRus.forEach((weekday) => {
    const weekdayElement = document.createElement('div');
    weekdayElement.className = 'calendar-weekday';
    weekdayElement.textContent = weekday;
    calendarWeekdays.appendChild(weekdayElement);
});

// Render each day of the calendar
const calendarDays = document.querySelector('.calendar-days');

modifiedDays.forEach((day) => {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';

    // Add classes conditionally
    if (day.today) dayElement.classList.add(day.today); // highlights today
    if (day.weekend) dayElement.classList.add(day.weekend); // Sat/Sun
    if (day.trip) dayElement.classList.add(day.trip); // trip period
    if (day.otherMonth) dayElement.classList.add(day.otherMonth); // padding days

    dayElement.textContent = day.day;
    calendarDays.appendChild(dayElement);
});
