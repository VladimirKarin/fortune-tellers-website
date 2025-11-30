// src/js/nav.js
// NAV MODULE (init / destroy)
// RU: Модуль реализует безопасный initNav() и destroyNav() для мобильного меню.
// EN: Provides initNav() / destroyNav() which attach/detach handlers and manage a11y & focus-trap.

let state = {
    initialized: false,
    headerEl: null,
    toggleBtn: null,
    navList: null,
    previouslyFocused: null,
    onKeyDownHandler: null,
};

const focusableSelectors =
    'a[href], button:not([disabled]), textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])';

function getFocusableNodes(container) {
    if (!container) return [];
    return Array.from(container.querySelectorAll(focusableSelectors)).filter(
        (el) =>
            el.offsetWidth > 0 ||
            el.offsetHeight > 0 ||
            el === document.activeElement
    );
}

function lockBodyScroll() {
    document.documentElement.classList.add('u-no-scroll');
}
function unlockBodyScroll() {
    document.documentElement.classList.remove('u-no-scroll');
}

function openMenu() {
    if (!state.headerEl || !state.toggleBtn || !state.navList) return;
    state.previouslyFocused = document.activeElement;
    state.headerEl.classList.add('nav-open');
    state.toggleBtn.setAttribute('aria-expanded', 'true');
    state.navList.setAttribute('aria-hidden', 'false');
    lockBodyScroll();

    const nodes = getFocusableNodes(state.navList);
    if (nodes.length) nodes[0].focus();
    else {
        state.navList.setAttribute('tabindex', '-1');
        state.navList.focus();
    }

    state.onKeyDownHandler = function (e) {
        if (e.key === 'Escape') {
            e.preventDefault();
            closeMenu();
            return;
        }
        if (e.key === 'Tab') {
            const nodes = getFocusableNodes(state.navList);
            if (nodes.length === 0) {
                e.preventDefault();
                return;
            }
            const first = nodes[0],
                last = nodes[nodes.length - 1];
            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        }
    };

    document.addEventListener('keydown', state.onKeyDownHandler);
}

function closeMenu() {
    if (!state.headerEl || !state.toggleBtn || !state.navList) return;
    state.headerEl.classList.remove('nav-open');
    state.toggleBtn.setAttribute('aria-expanded', 'false');
    state.navList.setAttribute('aria-hidden', 'true');
    unlockBodyScroll();

    if (state.navList.hasAttribute('tabindex'))
        state.navList.removeAttribute('tabindex');

    if (
        state.previouslyFocused &&
        typeof state.previouslyFocused.focus === 'function'
    ) {
        state.previouslyFocused.focus();
    } else {
        state.toggleBtn.focus();
    }

    if (state.onKeyDownHandler) {
        document.removeEventListener('keydown', state.onKeyDownHandler);
        state.onKeyDownHandler = null;
    }
}

function toggleMenu() {
    if (!state.toggleBtn) return;
    const isExpanded = state.toggleBtn.getAttribute('aria-expanded') === 'true';
    if (isExpanded) closeMenu();
    else openMenu();
}

function onLinkClick() {
    if (state.headerEl && state.headerEl.classList.contains('nav-open')) {
        closeMenu();
    }
}

function initNav(opts = {}) {
    if (state.initialized) return; // idempotent
    state.headerEl = document.querySelector('.header');
    state.toggleBtn = document.querySelector('.btn-mobile-nav');
    state.navList = document.querySelector('.nav-list');

    if (!state.headerEl || !state.toggleBtn || !state.navList) {
        // elements missing -> do nothing
        // console.warn('nav.js: missing header/toggle/navList — init aborted');
        return;
    }

    // set ARIA defaults if absent
    if (!state.toggleBtn.hasAttribute('aria-expanded'))
        state.toggleBtn.setAttribute('aria-expanded', 'false');
    if (!state.navList.hasAttribute('aria-hidden'))
        state.navList.setAttribute('aria-hidden', 'true');

    // attach handlers
    state._onToggle = toggleMenu.bind(null);
    state.toggleBtn.addEventListener('click', state._onToggle);

    state._onLinkClick = onLinkClick.bind(null);
    state.navList.querySelectorAll('a[href]').forEach((a) => {
        a.addEventListener('click', state._onLinkClick);
    });

    // close on resize to prevent stuck open after rotate
    state._onResize = () => {
        if (
            window.innerWidth >= (opts.desktopBreakpoint || 992) &&
            state.headerEl.classList.contains('nav-open')
        ) {
            closeMenu();
        }
    };
    window.addEventListener('resize', state._onResize);

    state.initialized = true;
}

function destroyNav() {
    if (!state.initialized) return;
    // Remove event listeners added
    if (state.toggleBtn && state._onToggle)
        state.toggleBtn.removeEventListener('click', state._onToggle);

    if (state.navList && state._onLinkClick) {
        state.navList.querySelectorAll('a[href]').forEach((a) => {
            a.removeEventListener('click', state._onLinkClick);
        });
    }

    if (state._onResize) window.removeEventListener('resize', state._onResize);

    // ensure menu closed & cleanup keydown
    closeMenu();

    // reset state
    state = {
        initialized: false,
        headerEl: null,
        toggleBtn: null,
        navList: null,
        previouslyFocused: null,
        onKeyDownHandler: null,
    };
}

export { initNav, destroyNav };
