// ===== SETTINGS MANAGER =====
// Modern settings management with neumorphic UI

class SettingsManager {
    constructor() {
        this.settings = this.loadSettings();
        this.currentSection = 'appearance';
        this.init();
    }

    // Initialize settings manager
    init() {
        this.setupNavigation();
        this.setupFormControls();
        this.setupEventListeners();
        this.applySettings();
        this.updateUI();
        
        // Apply UI visibility settings immediately
        this.forceApplyUIVisibility();
    }

    // Setup navigation between settings sections
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const panels = document.querySelectorAll('.settings-panel');

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                this.switchSection(section);
            });
        });
    }

    // Switch to a specific settings section
    switchSection(section) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        const navItem = document.querySelector(`[data-section="${section}"]`);
        if (navItem) {
            navItem.classList.add('active');
        }

        // Update panels
        document.querySelectorAll('.settings-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        const panel = document.getElementById(section);
        if (panel) {
            panel.classList.add('active');
        }

        this.currentSection = section;
    }

    // Setup form controls and their event listeners
    setupFormControls() {
        // Theme selector
        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) {
            themeSelect.value = this.settings.theme || 'light';
            themeSelect.addEventListener('change', (e) => {
                this.updateSetting('theme', e.target.value);
                this.applyTheme(e.target.value);
            });
        }

        // Accent color picker
        const accentColor = document.getElementById('accentColor');
        if (accentColor) {
            accentColor.value = this.settings.accentColor || '#0ea5e9';
            accentColor.addEventListener('change', (e) => {
                this.updateSetting('accentColor', e.target.value);
                this.applyAccentColor(e.target.value);
            });
        }

        // Color presets
        document.querySelectorAll('.color-preset').forEach(preset => {
            preset.addEventListener('click', (e) => {
                const color = e.target.dataset.color;
                this.updateSetting('accentColor', color);
                this.applyAccentColor(color);
                accentColor.value = color;
                this.updateColorPresets(color);
            });
        });

        // Toggle switches
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            const settingName = checkbox.id;
            checkbox.checked = this.settings[settingName] !== false;
            
            checkbox.addEventListener('change', (e) => {
                this.updateSetting(settingName, e.target.checked);
                this.applySetting(settingName, e.target.checked);
            });
        });

        // Range sliders
        document.querySelectorAll('input[type="range"]').forEach(range => {
            const settingName = range.id;
            const value = this.settings[settingName] || parseInt(range.value);
            range.value = value;
            
            // Update display value
            const valueDisplay = range.parentElement.querySelector('.range-value');
            if (valueDisplay) {
                this.updateRangeValue(range, valueDisplay);
            }

            range.addEventListener('input', (e) => {
                const value = e.target.value;
                this.updateSetting(settingName, value);
                this.applySetting(settingName, value);
                this.updateRangeValue(e.target, valueDisplay);
            });
        });

        // Select dropdowns
        document.querySelectorAll('select').forEach(select => {
            const settingName = select.id;
            if (this.settings[settingName]) {
                select.value = this.settings[settingName];
            }
            
            select.addEventListener('change', (e) => {
                this.updateSetting(settingName, e.target.value);
                this.applySetting(settingName, e.target.value);
            });
        });
    }

    // Setup additional event listeners
    setupEventListeners() {
        // Apply settings button
        const applyButton = document.getElementById('btnApplySettings');
        if (applyButton) {
            applyButton.addEventListener('click', () => {
                this.forceApplyAllSettings();
                this.showNotification('Settings applied successfully!', 'success');
            });
        }

        // Reset settings button
        const resetButton = document.getElementById('btnResetSettings');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                this.resetSettings();
            });
        }

        // Back button
        const backButton = document.getElementById('btnBack');
        if (backButton) {
            backButton.addEventListener('click', () => {
                this.goBack();
            });
        }

        // Theme toggle in header
        const themeToggle = document.getElementById('btnThemeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // UI Visibility Controls
        this.setupUIVisibilityListeners();
        
        // Scroll to top button
        this.setupScrollToTop();
    }

    // Setup UI visibility control listeners
    setupUIVisibilityListeners() {
        // Top Navigation Controls
        const showFileActions = document.getElementById('showFileActions');
        if (showFileActions) {
            showFileActions.addEventListener('change', (e) => {
                this.updateSetting('showFileActions', e.target.checked);
                this.applyShowFileActions(e.target.checked);
            });
        }

        const showRunButton = document.getElementById('showRunButton');
        if (showRunButton) {
            showRunButton.addEventListener('change', (e) => {
                this.updateSetting('showRunButton', e.target.checked);
                this.applyShowRunButton(e.target.checked);
            });
        }

        const showThemeToggle = document.getElementById('showThemeToggle');
        if (showThemeToggle) {
            showThemeToggle.addEventListener('change', (e) => {
                this.updateSetting('showThemeToggle', e.target.checked);
                this.applyShowThemeToggle(e.target.checked);
            });
        }

        const showLayoutToggle = document.getElementById('showLayoutToggle');
        if (showLayoutToggle) {
            showLayoutToggle.addEventListener('change', (e) => {
                this.updateSetting('showLayoutToggle', e.target.checked);
                this.applyShowLayoutToggle(e.target.checked);
            });
        }

        const showSettingsButton = document.getElementById('showSettingsButton');
        if (showSettingsButton) {
            showSettingsButton.addEventListener('change', (e) => {
                this.updateSetting('showSettingsButton', e.target.checked);
                this.applyShowSettingsButton(e.target.checked);
            });
        }

        // Editor Controls
        const showEditorActions = document.getElementById('showEditorActions');
        if (showEditorActions) {
            showEditorActions.addEventListener('change', (e) => {
                this.updateSetting('showEditorActions', e.target.checked);
                this.applyShowEditorActions(e.target.checked);
            });
        }

        const showEditorTitle = document.getElementById('showEditorTitle');
        if (showEditorTitle) {
            showEditorTitle.addEventListener('change', (e) => {
                this.updateSetting('showEditorTitle', e.target.checked);
                this.applyShowEditorTitle(e.target.checked);
            });
        }

        // Console Controls
        const showConsoleActions = document.getElementById('showConsoleActions');
        if (showConsoleActions) {
            showConsoleActions.addEventListener('change', (e) => {
                this.updateSetting('showConsoleActions', e.target.checked);
                this.applyShowConsoleActions(e.target.checked);
            });
        }

        const showConsoleStats = document.getElementById('showConsoleStats');
        if (showConsoleStats) {
            showConsoleStats.addEventListener('change', (e) => {
                this.updateSetting('showConsoleStats', e.target.checked);
                this.applyShowConsoleStats(e.target.checked);
            });
        }

        const showConsoleTitle = document.getElementById('showConsoleTitle');
        if (showConsoleTitle) {
            showConsoleTitle.addEventListener('change', (e) => {
                this.updateSetting('showConsoleTitle', e.target.checked);
                this.applyShowConsoleTitle(e.target.checked);
            });
        }

        // Tab Controls
        const showTabCounter = document.getElementById('showTabCounter');
        if (showTabCounter) {
            showTabCounter.addEventListener('change', (e) => {
                this.updateSetting('showTabCounter', e.target.checked);
                this.applyShowTabCounter(e.target.checked);
            });
        }

        const showNewTabButton = document.getElementById('showNewTabButton');
        if (showNewTabButton) {
            showNewTabButton.addEventListener('change', (e) => {
                this.updateSetting('showNewTabButton', e.target.checked);
                this.applyShowNewTabButton(e.target.checked);
            });
        }
    }

    // Setup scroll to top button
    setupScrollToTop() {
        const scrollToTopBtn = document.getElementById('scrollToTop');
        if (!scrollToTopBtn) return;

        // Show/hide button based on scroll position
        const toggleScrollButton = () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        };

        // Add scroll event listener
        window.addEventListener('scroll', toggleScrollButton);

        // Add click event listener
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Update a specific setting
    updateSetting(key, value) {
        this.settings[key] = value;
        this.saveSettings();
        
        // Show notification for important settings
        if (['theme', 'accentColor', 'animationsEnabled', 'glassEffects', 'particleEffects'].includes(key)) {
            this.showNotification(`${key} setting updated`, 'info');
        }
    }

    // Apply a specific setting
    applySetting(key, value) {
        switch (key) {
            case 'animationsEnabled':
                this.toggleAnimations(value);
                break;
            case 'glassEffects':
                this.toggleGlassEffects(value);
                break;
            case 'particleEffects':
                this.toggleParticleEffects(value);
                break;
            case 'wordWrap':
                this.applyWordWrap(value);
                break;
            case 'minimap':
                this.applyMinimap(value);
                break;
            case 'autoSave':
                this.applyAutoSave(value);
                break;
            case 'tabSize':
                this.applyTabSize(value);
                break;
            case 'fontSize':
                this.applyFontSize(value);
                break;
            case 'fontFamily':
                this.applyFontFamily(value);
                break;
            case 'lineHeight':
                this.applyLineHeight(value);
                break;
            case 'consoleHeight':
                this.applyConsoleHeight(value);
                break;
            case 'consoleFontSize':
                this.applyConsoleFontSize(value);
                break;
            case 'consoleFontFamily':
                this.applyConsoleFontFamily(value);
                break;
            case 'maxMessages':
                this.applyMaxMessages(value);
                break;
            case 'autoScroll':
                this.applyAutoScroll(value);
                break;
            case 'showTimestamps':
                this.applyShowTimestamps(value);
                break;
            case 'showIcons':
                this.applyShowIcons(value);
                break;
            case 'hardwareAcceleration':
                this.applyHardwareAcceleration(value);
                break;
            case 'reducedMotion':
                this.applyReducedMotion(value);
                break;
            case 'maxTabs':
                this.applyMaxTabs(value);
                break;
            case 'autoCloseTabs':
                this.applyAutoCloseTabs(value);
                break;
            // UI Visibility Settings
            case 'showFileActions':
                this.applyShowFileActions(value);
                break;
            case 'showRunButton':
                this.applyShowRunButton(value);
                break;
            case 'showThemeToggle':
                this.applyShowThemeToggle(value);
                break;
            case 'showLayoutToggle':
                this.applyShowLayoutToggle(value);
                break;
            case 'showSettingsButton':
                this.applyShowSettingsButton(value);
                break;
            case 'showEditorActions':
                this.applyShowEditorActions(value);
                break;
            case 'showEditorTitle':
                this.applyShowEditorTitle(value);
                break;
            case 'showConsoleActions':
                this.applyShowConsoleActions(value);
                break;
            case 'showConsoleStats':
                this.applyShowConsoleStats(value);
                break;
            case 'showConsoleTitle':
                this.applyShowConsoleTitle(value);
                break;
            case 'showTabCounter':
                this.applyShowTabCounter(value);
                break;
            case 'showNewTabButton':
                this.applyShowNewTabButton(value);
                break;
        }
    }

    // Apply all settings
    applySettings() {
        // Apply theme
        this.applyTheme(this.settings.theme || 'light');
        
        // Apply accent color
        this.applyAccentColor(this.settings.accentColor || '#0ea5e9');
        
        // Apply all other settings
        Object.keys(this.settings).forEach(key => {
            if (key !== 'theme' && key !== 'accentColor') {
                this.applySetting(key, this.settings[key]);
            }
        });
    }

    // Force apply all settings (for Apply button)
    forceApplyAllSettings() {
        // Apply theme
        this.applyTheme(this.settings.theme || 'light');
        
        // Apply accent color
        this.applyAccentColor(this.settings.accentColor || '#0ea5e9');
        
        // Apply all other settings
        Object.keys(this.settings).forEach(key => {
            if (key !== 'theme' && key !== 'accentColor') {
                this.applySetting(key, this.settings[key]);
            }
        });

        // Force apply glass and particle effects
        this.forceApplyEffects();
        
        // Force apply UI visibility settings
        this.forceApplyUIVisibility();
    }

    // Force apply visual effects
    forceApplyEffects() {
        // Apply glass effects
        const glassElements = document.querySelectorAll('.glass-morphism, .floating-particles');
        if (!this.settings.glassEffects) {
            glassElements.forEach(el => el.classList.add('no-glass'));
        } else {
            glassElements.forEach(el => el.classList.remove('no-glass'));
        }

        // Apply particle effects
        const particleElements = document.querySelectorAll('.floating-particles');
        if (!this.settings.particleEffects) {
            particleElements.forEach(el => el.classList.add('no-particles'));
        } else {
            particleElements.forEach(el => el.classList.remove('no-particles'));
        }

        // Apply animations
        if (!this.settings.animationsEnabled) {
            document.body.classList.add('reduced-motion');
        } else {
            document.body.classList.remove('reduced-motion');
        }
    }

    // Check if we're on the main editor page
    isOnMainPage() {
        return window.location.pathname.endsWith('index.html') || 
               window.location.pathname.endsWith('/') || 
               window.location.pathname === '' ||
               window.location.pathname.endsWith('dist/renderer/index.html');
    }

    // Apply theme
    applyTheme(theme) {
        const body = document.body;
        body.classList.remove('theme-light', 'theme-dark');
        
        if (theme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            body.classList.add(prefersDark ? 'theme-dark' : 'theme-light');
        } else {
            body.classList.add(`theme-${theme}`);
        }
    }

    // Apply accent color
    applyAccentColor(color) {
        document.documentElement.style.setProperty('--accent-soft-primary', color);
        document.documentElement.style.setProperty('--primary-500', color);
        document.documentElement.style.setProperty('--primary-600', this.darkenColor(color, 0.1));
        this.updateColorPresets(color);
    }

    // Toggle animations
    toggleAnimations(enabled) {
        const body = document.body;
        if (enabled) {
            body.classList.remove('reduced-motion');
        } else {
            body.classList.add('reduced-motion');
        }
    }

    // Toggle glass effects
    toggleGlassEffects(enabled) {
        const elements = document.querySelectorAll('.glass-morphism, .floating-particles');
        elements.forEach(el => {
            if (enabled) {
                el.classList.remove('no-glass');
            } else {
                el.classList.add('no-glass');
            }
        });
        
        // Also apply to settings page
        if (!this.isOnMainPage()) {
            const settingsElements = document.querySelectorAll('.glass-morphism, .floating-particles');
            settingsElements.forEach(el => {
                if (enabled) {
                    el.classList.remove('no-glass');
                } else {
                    el.classList.add('no-glass');
                }
            });
        }
    }

    // Toggle particle effects
    toggleParticleEffects(enabled) {
        const elements = document.querySelectorAll('.floating-particles');
        elements.forEach(el => {
            if (enabled) {
                el.classList.remove('no-particles');
            } else {
                el.classList.add('no-particles');
            }
        });
        
        // Also apply to settings page
        if (!this.isOnMainPage()) {
            const settingsElements = document.querySelectorAll('.floating-particles');
            settingsElements.forEach(el => {
                if (enabled) {
                    el.classList.remove('no-particles');
                } else {
                    el.classList.add('no-particles');
                }
            });
        }
    }

    // Apply word wrap
    applyWordWrap(enabled) {
        if (this.isOnMainPage() && window.editor && typeof window.editor.updateOptions === 'function') {
            window.editor.updateOptions({
                wordWrap: enabled ? 'on' : 'off'
            });
        }
    }

    // Apply minimap
    applyMinimap(enabled) {
        if (this.isOnMainPage() && window.editor && typeof window.editor.updateOptions === 'function') {
            window.editor.updateOptions({
                minimap: { enabled: enabled }
            });
        }
    }

    // Apply auto save
    applyAutoSave(enabled) {
        // This would be implemented in the main app
        window.autoSaveEnabled = enabled;
    }

    // Apply tab size
    applyTabSize(size) {
        if (this.isOnMainPage() && window.editor && typeof window.editor.updateOptions === 'function') {
            window.editor.updateOptions({
                tabSize: parseInt(size)
            });
        }
    }

    // Apply font size
    applyFontSize(size) {
        if (this.isOnMainPage() && window.editor && typeof window.editor.updateOptions === 'function') {
            try {
                window.editor.updateOptions({
                    fontSize: parseInt(size)
                });
                window.editor.layout(); // Force layout update
                console.log('Applied font size:', size);
            } catch (error) {
                console.error('Error applying font size:', error);
            }
        }
    }

    // Apply font family
    applyFontFamily(family) {
        if (this.isOnMainPage() && window.editor && typeof window.editor.updateOptions === 'function') {
            try {
                window.editor.updateOptions({
                    fontFamily: family
                });
                window.editor.layout(); // Force layout update
                console.log('Applied font family:', family);
            } catch (error) {
                console.error('Error applying font family:', error);
            }
        }
    }

    // Apply line height
    applyLineHeight(height) {
        if (this.isOnMainPage() && window.editor && typeof window.editor.updateOptions === 'function') {
            try {
                window.editor.updateOptions({
                    lineHeight: parseFloat(height)
                });
                window.editor.layout(); // Force layout update
                console.log('Applied line height:', height);
            } catch (error) {
                console.error('Error applying line height:', error);
            }
        }
    }

    // Apply console height
    applyConsoleHeight(height) {
        if (this.isOnMainPage()) {
            const consoleContent = document.querySelector('.console-content');
            if (consoleContent) {
                consoleContent.style.height = `${height}px`;
            }
        }
    }

    // Apply console font size
    applyConsoleFontSize(size) {
        if (this.isOnMainPage()) {
            const consoleOutput = document.querySelector('.console-output');
            if (consoleOutput) {
                consoleOutput.style.fontSize = `${size}px`;
            }
        }
    }

    // Apply console font family
    applyConsoleFontFamily(family) {
        if (this.isOnMainPage()) {
            const consoleOutput = document.querySelector('.console-output');
            if (consoleOutput) {
                consoleOutput.style.fontFamily = family;
            }
        }
    }

    // Apply max messages
    applyMaxMessages(max) {
        window.maxConsoleMessages = parseInt(max);
    }

    // Apply auto scroll
    applyAutoScroll(enabled) {
        window.autoScrollEnabled = enabled;
    }

    // Apply show timestamps
    applyShowTimestamps(enabled) {
        window.showTimestamps = enabled;
    }

    // Apply show icons
    applyShowIcons(enabled) {
        window.showIcons = enabled;
    }

    // Apply hardware acceleration
    applyHardwareAcceleration(enabled) {
        // This would be implemented in the main process
        window.hardwareAcceleration = enabled;
    }

    // Apply reduced motion
    applyReducedMotion(enabled) {
        this.toggleAnimations(!enabled);
    }

    // Apply max tabs
    applyMaxTabs(max) {
        window.maxTabs = parseInt(max);
    }

    // Apply auto close tabs
    applyAutoCloseTabs(enabled) {
        window.autoCloseTabs = enabled;
    }

    // UI Visibility Methods
    applyShowFileActions(enabled) {
        if (this.isOnMainPage()) {
            const fileActions = document.querySelector('.file-actions');
            if (fileActions) {
                fileActions.style.display = enabled ? 'flex' : 'none';
            }
        }
    }

    applyShowRunButton(enabled) {
        if (this.isOnMainPage()) {
            const runButton = document.getElementById('btnRun');
            const stopButton = document.getElementById('btnStop');
            if (runButton) runButton.style.display = enabled ? 'flex' : 'none';
            if (stopButton) stopButton.style.display = enabled ? 'flex' : 'none';
        }
    }

    applyShowThemeToggle(enabled) {
        if (this.isOnMainPage()) {
            const themeToggle = document.getElementById('btnThemeToggle');
            if (themeToggle) themeToggle.style.display = enabled ? 'flex' : 'none';
        }
    }

    applyShowLayoutToggle(enabled) {
        if (this.isOnMainPage()) {
            const layoutToggle = document.getElementById('layoutToggle');
            if (layoutToggle) layoutToggle.style.display = enabled ? 'flex' : 'none';
        }
    }

    applyShowSettingsButton(enabled) {
        if (this.isOnMainPage()) {
            const settingsButton = document.getElementById('btnSettings');
            if (settingsButton) settingsButton.style.display = enabled ? 'flex' : 'none';
        }
    }

    applyShowEditorActions(enabled) {
        if (this.isOnMainPage()) {
            const editorActions = document.querySelector('.editor-actions');
            if (editorActions) editorActions.style.display = enabled ? 'flex' : 'none';
        }
    }

    applyShowEditorTitle(enabled) {
        if (this.isOnMainPage()) {
            const editorTitle = document.querySelector('.editor-title');
            if (editorTitle) editorTitle.style.display = enabled ? 'flex' : 'none';
        }
    }

    applyShowConsoleActions(enabled) {
        if (this.isOnMainPage()) {
            const consoleControls = document.querySelector('.console-controls');
            if (consoleControls) consoleControls.style.display = enabled ? 'flex' : 'none';
        }
    }

    applyShowConsoleStats(enabled) {
        if (this.isOnMainPage()) {
            const consoleStats = document.querySelector('.console-stats');
            if (consoleStats) consoleStats.style.display = enabled ? 'flex' : 'none';
        }
    }

    applyShowConsoleTitle(enabled) {
        if (this.isOnMainPage()) {
            const consoleTitle = document.querySelector('.console-title');
            if (consoleTitle) consoleTitle.style.display = enabled ? 'flex' : 'none';
        }
    }

    applyShowTabCounter(enabled) {
        if (this.isOnMainPage()) {
            const tabCounter = document.getElementById('tabCounter');
            if (tabCounter) tabCounter.style.display = enabled ? 'block' : 'none';
        }
    }

    applyShowNewTabButton(enabled) {
        if (this.isOnMainPage()) {
            const newTabButton = document.getElementById('btnNewTab');
            if (newTabButton) newTabButton.style.display = enabled ? 'flex' : 'none';
        }
    }

    // Force apply UI visibility settings
    forceApplyUIVisibility() {
        // Apply all UI visibility settings
        this.applyShowFileActions(this.settings.showFileActions);
        this.applyShowRunButton(this.settings.showRunButton);
        this.applyShowThemeToggle(this.settings.showThemeToggle);
        this.applyShowLayoutToggle(this.settings.showLayoutToggle);
        this.applyShowSettingsButton(this.settings.showSettingsButton);
        this.applyShowEditorActions(this.settings.showEditorActions);
        this.applyShowEditorTitle(this.settings.showEditorTitle);
        this.applyShowConsoleActions(this.settings.showConsoleActions);
        this.applyShowConsoleStats(this.settings.showConsoleStats);
        this.applyShowConsoleTitle(this.settings.showConsoleTitle);
        this.applyShowTabCounter(this.settings.showTabCounter);
        this.applyShowNewTabButton(this.settings.showNewTabButton);
    }

    // Update range value display
    updateRangeValue(range, display) {
        if (display) {
            const value = range.value;
            const unit = range.id.includes('Height') ? 'px' : 
                        range.id.includes('Size') ? '' : 
                        range.id.includes('Height') ? '' : '';
            display.textContent = value + unit;
        }
    }

    // Update color presets
    updateColorPresets(selectedColor) {
        document.querySelectorAll('.color-preset').forEach(preset => {
            preset.classList.remove('active');
            if (preset.dataset.color === selectedColor) {
                preset.classList.add('active');
            }
        });
    }

    // Toggle theme
    toggleTheme() {
        const body = document.body;
        const isDark = body.classList.contains('theme-dark');
        const newTheme = isDark ? 'light' : 'dark';
        this.updateSetting('theme', newTheme);
        this.applyTheme(newTheme);
        
        // Update theme selector
        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) {
            themeSelect.value = newTheme;
        }
    }

    // Update UI based on current settings
    updateUI() {
        // Update theme selector
        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) {
            themeSelect.value = this.settings.theme || 'light';
        }

        // Update accent color
        const accentColor = document.getElementById('accentColor');
        if (accentColor) {
            accentColor.value = this.settings.accentColor || '#0ea5e9';
        }

        // Update color presets
        this.updateColorPresets(this.settings.accentColor || '#0ea5e9');

        // Update all form controls
        Object.keys(this.settings).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = this.settings[key] !== false;
                } else if (element.type === 'range') {
                    element.value = this.settings[key];
                    const valueDisplay = element.parentElement.querySelector('.range-value');
                    if (valueDisplay) {
                        this.updateRangeValue(element, valueDisplay);
                    }
                } else {
                    element.value = this.settings[key];
                }
            }
        });
    }

    // Reset settings to defaults
    resetSettings() {
        if (confirm('Are you sure you want to reset all settings to their default values?')) {
            this.settings = this.getDefaultSettings();
            this.saveSettings();
            this.applySettings();
            this.updateUI();
            this.showNotification('Settings reset to defaults', 'success');
        }
    }

    // Go back to main app
    goBack() {
        window.history.back();
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `toast toast-${type}`;
        notification.innerHTML = `
            <i class="ri-${type === 'success' ? 'check-line' : type === 'error' ? 'error-warning-line' : 'information-line'}"></i>
            <span>${message}</span>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="ri-close-line"></i>
            </button>
        `;

        // Add to page
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        container.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 3000);
    }

    // Get default settings
    getDefaultSettings() {
        return {
            theme: 'light',
            accentColor: '#0ea5e9',
            animationsEnabled: true,
            glassEffects: true,
            particleEffects: true,
            wordWrap: false,
            minimap: true,
            autoSave: true,
            tabSize: 4,
            fontSize: 14,
            fontFamily: 'JetBrains Mono',
            lineHeight: 1.5,
            lineNumbers: true,
            autoComplete: true,
            syntaxHighlighting: true,
            consoleHeight: 300,
            consoleFontSize: 14,
            consoleFontFamily: 'JetBrains Mono',
            maxMessages: 200,
            autoScroll: true,
            showTimestamps: true,
            showIcons: true,
            hardwareAcceleration: true,
            reducedMotion: false,
            maxTabs: 3,
            autoCloseTabs: false,
            confirmClose: true,
            autoSaveInterval: 60,
            debugMode: false,
            showPerformance: false,
            executionTimeout: 30,
            // UI Visibility Settings
            showFileActions: true,
            showRunButton: true,
            showThemeToggle: true,
            showLayoutToggle: true,
            showSettingsButton: true,
            showEditorActions: true,
            showEditorTitle: true,
            showConsoleActions: true,
            showConsoleStats: true,
            showConsoleTitle: true,
            showTabCounter: true,
            showNewTabButton: true
        };
    }

    // Load settings from localStorage
    loadSettings() {
        try {
            const saved = localStorage.getItem('iPseudoSettings');
            if (saved) {
                const parsed = JSON.parse(saved);
                return { ...this.getDefaultSettings(), ...parsed };
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
        return this.getDefaultSettings();
    }

    // Save settings to localStorage
    saveSettings() {
        try {
            localStorage.setItem('iPseudoSettings', JSON.stringify(this.settings));
            // Trigger storage event to notify other windows/tabs
            window.dispatchEvent(new StorageEvent('storage', {
                key: 'iPseudoSettings',
                newValue: JSON.stringify(this.settings),
                oldValue: localStorage.getItem('iPseudoSettings'),
                storageArea: localStorage
            }));
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    // Darken a color
    darkenColor(color, amount) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * amount * 100);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }
}

// Initialize settings manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.SettingsManager = new SettingsManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SettingsManager;
}
