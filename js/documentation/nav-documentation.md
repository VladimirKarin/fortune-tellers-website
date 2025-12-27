================================================
📝 TECHNICAL DOCUMENTATION
================================================

──────────────────────────────────────────────
FOCUS TRAP IMPLEMENTATION:
──────────────────────────────────────────────

Focus trap keeps keyboard navigation within modal/menu:

Algorithm:

1. Get all focusable elements in menu
2. Identify first and last focusable element
3. On Tab press:
    - If on last element → move focus to first
4. On Shift+Tab press:
    - If on first element → move focus to last

Why trap focus?

-   Prevents tab-cycling outside menu
-   Users don't get lost in background content
-   Required by WCAG 2.1 (Level A)

Implementation details:

-   Listen for 'keydown' (not 'keypress' or 'keyup')
-   Check e.shiftKey for Shift+Tab detection
-   Call e.preventDefault() to stop default tab behavior
-   Manually move focus with element.focus()

Edge case handling:

-   If no focusable elements → focus menu container itself
-   Add tabindex="-1" temporarily to make container focusable
-   Remove tabindex on menu close

──────────────────────────────────────────────
SCROLL LOCKING STRATEGY:
──────────────────────────────────────────────

Why lock scroll?

-   Prevents jarring user experience on mobile
-   Background content shouldn't scroll when menu open
-   Maintains user's scroll position

Implementation:

-   Add class to <html> element (not <body>)
-   CSS: html.u-no-scroll { overflow: hidden; }

Why <html> instead of <body>?

-   More reliable across browsers
-   Body can still have scroll in some browsers
-   Html is the true viewport container

Restoration:

-   Remove class when menu closes
-   Scroll position automatically restored by browser
-   No manual scroll calculation needed

Mobile considerations:

-   iOS Safari: overflow: hidden sometimes ignored
-   Solution: position: fixed with calculated height
-   Or use third-party libraries like body-scroll-lock

──────────────────────────────────────────────
ARIA ATTRIBUTE MANAGEMENT:
──────────────────────────────────────────────

ARIA attributes for screen readers:

aria-expanded (on toggle button):

-   "true": Menu is open
-   "false": Menu is closed
-   Screen readers announce state

aria-hidden (on menu):

-   "true": Menu hidden from screen readers
-   "false": Menu visible to screen readers
-   Prevents accessing closed menu content

aria-controls (optional):

-   Links button to menu it controls
-   Value should be menu's ID
-   Helps screen reader users understand relationship

Why manage ARIA dynamically?

-   Static HTML doesn't reflect current state
-   Screen readers need live state updates
-   Improves navigation experience

──────────────────────────────────────────────
MEMORY LEAK PREVENTION:
──────────────────────────────────────────────

Event listeners can cause memory leaks:

Problem:

1. Add listener to DOM element
2. Remove element from DOM
3. Listener still in memory
4. Element can't be garbage collected
5. Memory usage grows over time

Solution:

1. Store listener references in state object
2. Before element removal, call removeEventListener
3. Pass exact same function reference
4. Set references to null

When to cleanup:

-   Before page navigation (SPAs)
-   Before component unmount (React, Vue, etc.)
-   On beforeunload event
-   When dynamically removing navigation

Why store references?

-   Anonymous functions can't be removed
-   button.addEventListener('click', () => {})
