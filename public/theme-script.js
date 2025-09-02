;(function () {
    'use strict'

    const STORAGE_KEY = 'vite-ui-theme'
    const THEME_ATTR = 'data-theme'

    function getSystemTheme() {
        if (typeof window !== 'undefined' && window.matchMedia) {
            return window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light'
        }
        return 'light'
    }

    function getStoredTheme() {
        try {
            return localStorage.getItem(STORAGE_KEY)
        } catch {
            return null
        }
    }

    function setTheme(theme) {
        const resolvedTheme = theme === 'system' ? getSystemTheme() : theme
        document.documentElement.setAttribute(THEME_ATTR, resolvedTheme)
        document.documentElement.classList.remove('light', 'dark')
        document.documentElement.classList.add(resolvedTheme)

        // Set CSS custom properties immediately to prevent flash
        if (resolvedTheme === 'dark') {
            document.documentElement.style.setProperty('color-scheme', 'dark')
        } else {
            document.documentElement.style.setProperty('color-scheme', 'light')
        }
    }

    // Apply theme immediately before React hydration
    const storedTheme = getStoredTheme()
    const initialTheme = storedTheme || 'system'
    setTheme(initialTheme)

    // Listen for system theme changes if using system theme
    if (
        typeof window !== 'undefined' &&
        window.matchMedia &&
        (!storedTheme || storedTheme === 'system')
    ) {
        window
            .matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', () => {
                if (!getStoredTheme() || getStoredTheme() === 'system') {
                    setTheme('system')
                }
            })
    }

    // Export for use by React components
    window.__themeScript = {
        setTheme,
        getStoredTheme,
        getSystemTheme,
        STORAGE_KEY
    }
})()
