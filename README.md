# Fortune Teller Website 🌌

A premium, localized (RU/LT) website for professional fortune-telling services, featuring moon phase tracking, event calendars, and interactive service galleries.

---

## 🏗️ Project Architecture

The project follows a modular Vanilla JS/CSS architecture designed for high performance and maintainability.

### File Structure
```text
├── index.html          # Splash / Language selection page
├── home.html           # Main application page
├── translations.json   # Centralized translation data
├── css/
│   ├── style.css       # Master import file
│   ├── 00-general.css  # CSS Variables, Reset & Global System
│   └── 01-10-*.css     # Section-specific modular styles
├── js/
│   ├── i18n.js         # Internationalization engine
│   ├── script.js       # Main runtime logic
│   └── modules/        # Section-specific JS logic (countdown, moon, etc.)
└── img/                # Optimized asset storage
```

---

## 🎨 CSS System (The Modular Approach)

The website uses a **Numbered Modular CSS System**. This ensures that styles are organized by section and dependencies are easily managed.

### 1. The Master Entry Point
All styles are aggregated in [`css/style.css`](file:///c:/Users/Professional/Documents/Programming/fortune-tellers-website/css/style.css) using `@import`. When adding a new section, create a new file and register it here.

### 2. The Global System ([`00-general.css`](file:///c:/Users/Professional/Documents/Programming/fortune-tellers-website/css/00-general.css))
This is the "Brain" of the design system. It contains:
- **HSL Color System**: Defined via `--hsl-*` and `--color-*` variables for easy theme swapping.
- **Glassmorphism**: Reusable `--glass-*` variables for premium UI effects.
- **Spacing & Typography**: Standardized scales (XS to HUGE) using `rem` units (1rem = 10px).
- **Animation Library**: Pre-defined keyframes like `shimmerGold`, `levitate`, and `mysticPulse`.

### 3. Responsive Design
Breakpoints are handled within each modular file using variables from the general system. The layout automatically transitions from a complex grid on desktop to a single-column stack on mobile.

---

## 🌍 Internationalization (i18n)

The site features a robust client-side translation system powered by [`js/i18n.js`](file:///c:/Users/Professional/Documents/Programming/fortune-tellers-website/js/i18n.js).

### How to Translate Elements
Simply use the following data attributes in your HTML:
- `data-i18n="key"`: Replaces element text content.
- `data-i18n-attr="attr:key"`: Translates a specific attribute (e.g., `aria-label:nav.home`).
- `data-i18n-html`: Use this if the translation string contains HTML tags.

### Adding New Strings
1. Open [`translations.json`](file:///c:/Users/Professional/Documents/Programming/fortune-tellers-website/translations.json).
2. Add your key-value pair under both `"ru"` and `"lt"` objects.
3. The system will automatically update the UI when the language is switched.

---

## ⚙️ JavaScript Modules

Each complex component has its own dedicated logic file in the `js/` directory:
- **`countdown-clock.js`**: Calculates time remaining for events.
- **`moon-phase.js`**: Fetches and displays current lunar data.
- **`calendar.js`**: Manages the travel schedule calendar.
- **`i18n.js`**: Dispatches a `languageChanged` custom event whenever the language toggles, allowing other modules to re-render dynamic content.

---

## 🚀 Future Updates Guide

### Adding a New Section
1. **HTML**: Add the section to `home.html` using semantic tags. Add `data-i18n` attributes for all text.
2. **CSS**: Create `css/XX-new-section.css`, import it in `style.css`, and use existing variables for consistency.
3. **JS**: If interactive, create `js/new-section.js` and import it as a module in `home.html`.
4. **I18n**: Add the keys to `translations.json`.

---


## 📜 License
This project is licensed under the MIT License.
