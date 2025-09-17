// Theme management
document.addEventListener('DOMContentLoaded', () => {
    // Load saved theme preference or default to dark theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const isDark = savedTheme === 'dark';
    
    // Apply the saved theme immediately to prevent flash of default theme
    document.documentElement.classList.add('theme-' + savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Wait for the next frame to ensure the initial theme is applied
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });

    // Function to apply theme
    function applyTheme(useDarkTheme) {
        const theme = useDarkTheme ? 'dark' : 'light';
        
        // Update class on html element
        document.documentElement.classList.remove('theme-light', 'theme-dark');
        document.documentElement.classList.add('theme-' + theme);
        document.documentElement.setAttribute('data-theme', theme);
        
        // Save preference
        localStorage.setItem('theme', theme);
        
        // Update UI elements
        updateThemeToggle(useDarkTheme);
        
        // Update Monaco editor theme if available
        updateMonacoTheme(useDarkTheme);
    }
    
    // Update the theme toggle button state
    function updateThemeToggle(isDark) {
        const btn = document.getElementById('btnThemeToggle');
        if (btn) {
            // aria-pressed reflects the ON state of dark mode
            btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');

            // Update button icon based on theme using Remix Icons
            const icon = btn.querySelector('i') || document.createElement('i');
            icon.className = isDark ? 'ri-moon-line' : 'ri-sun-line';
            if (!btn.contains(icon)) {
                btn.innerHTML = '';
                btn.appendChild(icon);
            }
        }
    }
    
    // Update Monaco editor theme
    function updateMonacoTheme(isDark) {
        try {
            if (window.monaco && monaco.editor) {
                monaco.editor.setTheme(isDark ? 'vs-dark' : 'vs');
            }
        } catch (e) {
            console.error('Error updating Monaco theme:', e);
        }
    }
    
    // Initialize theme toggle button
    function initThemeToggle() {
        const btn = document.getElementById('btnThemeToggle');
        if (btn) {
            // Add ARIA attributes for accessibility
            btn.setAttribute('role', 'button');
            btn.setAttribute('aria-label', 'Toggle theme');
            
            // Add click handler
            btn.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const isDark = currentTheme === 'dark';
                applyTheme(!isDark);
            });
            
            // Initialize button state
            updateThemeToggle(isDark);
        }
    }
    
    // Initialize everything
    initThemeToggle();
    
    // Apply theme on startup
    applyTheme(isDark);
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        applyTheme: (isDark) => {
            const theme = isDark ? 'dark' : 'light';
            document.documentElement.className = 'theme-' + theme;
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        }
    };
}
