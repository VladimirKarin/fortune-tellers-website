/**
 * 🌍 INTERNATIONALIZATION (i18n) MODULE
 * Handles language switching, translation loading, and dynamic content updates.
 */

import { CONFIG } from './config.js';

const LANG_KEY = 'fortuneTellerLanguage';
const DEFAULT_LANG = 'ru';
let translations = {};
let currentLang = localStorage.getItem(LANG_KEY) || DEFAULT_LANG;

/**
 * Initialize i18n system
 */
export async function initI18n() {
    try {
        const response = await fetch('../translations.json');
        translations = await response.json();
        
        // Apply initial translation
        translatePage();
        
        // Update global URLs (domain replacement)
        updateGlobalUrls();
        
        // Setup language switcher
        setupLanguageSwitcher();
        
        console.log(`✅ i18n initialized. Language: ${currentLang}`);
        
        // Dispatch event for other modules
        window.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { language: currentLang } 
        }));
        
    } catch (error) {
        console.error('❌ Failed to load translations:', error);
    }
}

/**
 * Switch application language
 * @param {string} lang - Language code ('ru' or 'lt')
 */
export function switchLanguage(lang) {
    if (lang === currentLang) return;
    
    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);
    translatePage();
    
    // Dispatch event for other modules (like script.js for popups)
    window.dispatchEvent(new CustomEvent('languageChanged', { 
        detail: { language: currentLang } 
    }));
}

/**
 * Get current language
 * @returns {string} One of 'ru', 'lt'
 */
export function getCurrentLanguage() {
    return currentLang;
}

/**
 * Get translation for specific key
 * @param {string} key - Dot-notation key (e.g. 'hero.title')
 * @returns {string|Object} Translated string or object
 */
export function getTranslation(key) {
    if (!translations[currentLang]) return key;
    
    return key.split('.').reduce((obj, i) => obj ? obj[i] : null, translations[currentLang]) || key;
}

/**
 * Update all elements with data-i18n attribute
 */
function translatePage() {
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getTranslation(key);
        
        if (translation) {
            // Handle HTML content vs plain text
            if (element.hasAttribute('data-i18n-html')) {
                element.innerHTML = translation;
            } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        }
    });

    // Handle attributes (e.g., aria-label, alt)
    const attrElements = document.querySelectorAll('[data-i18n-attr]');
    attrElements.forEach(element => {
        const key = element.getAttribute('data-i18n-attr');
        // format: "attribute:key"
        const [attr, transKey] = key.split(':');
        const translation = getTranslation(transKey);
        
        if (translation) {
            element.setAttribute(attr, translation);
        }
    });

    // Update active state of switchers
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === currentLang);
    });

    // Update HTML lang attribute
    document.documentElement.lang = currentLang;
}

/**
 * Setup event listeners for language switchers
 * Expects buttons with class .lang-btn and data-lang attribute
 */
function setupLanguageSwitcher() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = btn.getAttribute('data-lang');
            switchLanguage(lang);
        });
    });
}
/**
 * Update global URLs and Schema.org scripts with the domain from CONFIG
 */
function updateGlobalUrls() {
    const domain = CONFIG.DOMAIN.replace(/\/$/, ''); // Remove trailing slash if any
    
    // 1. Update elements with data-domain-replace
    document.querySelectorAll('[data-domain-replace]').forEach(el => {
        const attr = el.getAttribute('data-domain-replace');
        if (attr) {
            // Update specific attribute
            let value = el.getAttribute(attr);
            if (value) {
                value = value.replaceAll('{{DOMAIN}}', domain);
                el.setAttribute(attr, value);
            }
        } else {
            // Update text content
            el.textContent = el.textContent.replaceAll('{{DOMAIN}}', domain);
        }
    });

    // 2. Update canonical link (special case if not marked)
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical && canonical.href.includes('fortunetellers.com')) {
        canonical.href = canonical.href.replace(/https?:\/\/[^\/]+/, domain);
    }
    
    // 3. Update Schema.org scripts
    document.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
        try {
            let content = script.textContent;
            if (content.includes('fortunetellers.com') || content.includes('{{DOMAIN}}')) {
                content = content.replaceAll('https://fortunetellers.com', domain);
                content = content.replaceAll('{{DOMAIN}}', domain);
                script.textContent = content;
            }
        } catch (e) {
            console.warn('❌ Failed to update Schema script:', e);
        }
    });
}
