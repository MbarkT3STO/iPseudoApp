"use strict";
// Theme management - Updated to work with main app settings
document.addEventListener('DOMContentLoaded', () => {
    // Just ensure we have a valid theme class to prevent flash
    if (!document.documentElement.classList.contains('theme-dark') && 
        !document.documentElement.classList.contains('theme-light')) {
        document.documentElement.classList.add('theme-dark');
        document.body.classList.add('theme-dark');
    }
    
    // Wait for the next frame to ensure the initial theme is applied
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });
    
    // Initialize theme toggle button - Let main app handle the click events
    function initThemeToggle() {
        const btn = document.getElementById('btnThemeToggle');
        if (btn) {
            // Add ARIA attributes for accessibility
            btn.setAttribute('role', 'button');
            btn.setAttribute('aria-label', 'Toggle theme');
        }
    }
    
    // Initialize everything
    initThemeToggle();
});
if (typeof module !== 'undefined' && module.exports) {
    const themeModule = {
        applyTheme: (isDark) => {
            const theme = isDark ? 'dark' : 'light';
            document.documentElement.className = 'theme-' + theme;
            document.documentElement.setAttribute('data-theme', theme);
            // Use main app's settings system
            try {
                const settings = JSON.parse(localStorage.getItem('iPseudoSettings') || '{}');
                settings.theme = theme;
                localStorage.setItem('iPseudoSettings', JSON.stringify(settings));
            } catch (e) {
                localStorage.setItem('theme', theme);
            }
        }
    };
    module.exports = themeModule;
}
//# sourceMappingURL=theme.js.map