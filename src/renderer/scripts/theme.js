// Theme management
document.addEventListener('DOMContentLoaded', () => {
    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.add(savedTheme === 'dark' ? 'theme-dark' : 'theme-light');

    // Wire existing theme toggle button if present
    const btn = document.getElementById('btnThemeToggle');
    const settings = document.getElementById('btnSettings');

    function applyTheme(isDark) {
        if (isDark) {
            document.body.classList.remove('theme-light');
            document.body.classList.add('theme-dark');
            localStorage.setItem('theme','dark');
            if (btn) btn.setAttribute('aria-pressed','false');
            try { if (window.monaco && monaco && monaco.editor) monaco.editor.setTheme('pseudoTheme'); } catch(e){}
        } else {
            document.body.classList.remove('theme-dark');
            document.body.classList.add('theme-light');
            localStorage.setItem('theme','light');
            if (btn) btn.setAttribute('aria-pressed','true');
            try { if (window.monaco && monaco && monaco.editor) monaco.editor.setTheme('vs'); } catch(e){}
        }
    }

    // initial apply
    applyTheme(savedTheme === 'dark');

    if (btn) {
        btn.addEventListener('click', () => {
            const pressed = btn.getAttribute('aria-pressed') === 'true';
            const nextIsLight = !pressed;
            applyTheme(!nextIsLight ? true : false); // invert because aria-pressed true means light
        });
    }

    if (settings) {
        settings.addEventListener('click', () => {
            try { const out = document.getElementById('output'); if (out) out.textContent += 'Settings clicked\n'; } catch(e){}
        });
    }
});
