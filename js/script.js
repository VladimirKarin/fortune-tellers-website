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
const modifiedCurrentDate = currentDate.toISOString().split('T')[0];

// Extract the current year
const currentYear = currentDate.getFullYear();

// Extract the current month (add +1 because getMonth() is zero-based)
const currentMonth = currentDate.getMonth() + 1;

// Get the current day of the week (0 = Sunday, 6 = Saturday)
const currentDayOfTheWeek = currentDate.getDay();

// Get the current day of the month (1–31)
const currentDayOfTheMonth = currentDate.getDate();

// Define the viewed year and month — can be changed when navigating the calendar
let viewedYear = currentYear;
let viewedMonth = currentMonth;

// Get the weekday of the first day of the viewed month
const firstDayOfMonth = new Date(viewedYear, viewedMonth - 1, 1).getDay();

// Get the total number of days in the viewed month
const lastDayOfMonth = new Date(viewedYear, viewedMonth, 0).getDate();

// Save the starting weekday for calendar alignment
let startWeekday = firstDayOfMonth;

// Adjust so that Monday = 0, Sunday = 6 (ISO-like)
const correctedStartWeekday = startWeekday === 0 ? 6 : startWeekday - 1;

// Store the number of days in the viewed month
const daysInMonth = new Date(viewedYear, viewedMonth, 0).getDate();

// Utility: Check if a given date falls on a weekend (Saturday or Sunday)
function isWeekend(dayOfTheWeek) {
    return dayOfTheWeek === 6 || dayOfTheWeek === 0;
}

// Utility: Check if a given date is today
function isToday(day) {
    return day.toISOString().split('T')[0] === modifiedCurrentDate;
}

// Utility: Check if a given date is within the trip period
function isTrip(day) {
    const formatted = day.toISOString().split('T')[0];
    return formatted >= tripDates.start && formatted <= tripDates.end;
}

// Define trip information (used to highlight travel dates)
const tripDates = {
    city: 'Vilnius',
    start: '2025-06-21',
    end: '2025-06-24',
};

// Array to hold all Date objects (including previous/next month padding)
let days = [];

// Step 1: Add trailing days from the previous month to align the calendar grid
for (let i = correctedStartWeekday - 1; i >= 0; i--) {
    days.push(new Date(viewedYear, viewedMonth - 1, 0 - i));
}

// Step 2: Add all days of the current month
for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(viewedYear, viewedMonth - 1, i));
}

// Step 3: Add days from the next month to complete 6 rows (42 days total)
let nextMonthDays = 42 - days.length;
for (let i = 1; i <= nextMonthDays; i++) {
    days.push(new Date(viewedYear, viewedMonth, i));
}

// Map all Date objects to structured data for rendering (with extra metadata)
const modifiedDays = days.map((day) => {
    const formatted = day.toISOString().split('T')[0];
    return {
        date: formatted, // formatted date string (YYYY-MM-DD)
        day: day.getDate(), // day number for display
        weekend: isWeekend(day.getDay()) ? 'calendar-day--weekend' : '', // CSS class for weekend
        today: isToday(day) ? 'calendar-day--today' : '', // CSS class for today
        trip: isTrip(day) ? 'calendar-day--travel' : '', // CSS class for trip days
    };
});

// Optional: Uncomment to preview a specific day’s metadata
console.log(modifiedDays[28]);

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

const calendarWeekdays = document.querySelectorAll('.calendar-weekdays');

weekdaysRus.map((weekday) => {
    const weekdayElement = document.createElement('div');
    weekdayElement.className = 'calendar-weekday';
    weekdayElement.textContent = weekday;
    calendarWeekdays.appendChild(weekdayElement);
});
