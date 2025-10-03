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
        this.setupSearch();
        this.applySettings();
        this.updateUI();
        
        // Apply UI visibility settings immediately
        this.forceApplyUIVisibility();
    }

    // Setup search functionality
    setupSearch() {
        this.searchInput = document.getElementById('settingsSearch');
        this.searchResults = document.getElementById('searchResults');
        this.searchResultsList = document.getElementById('searchResultsList');
        this.searchClear = document.getElementById('searchClear');
        this.searchClose = document.getElementById('searchClose');
        this.resultsCount = document.querySelector('.results-count');
        
        // Search data structure
        this.searchData = this.buildSearchData();
        
        // Event listeners
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        this.searchClear.addEventListener('click', () => this.clearSearch());
        this.searchClose.addEventListener('click', () => this.hideSearchResults());
        
        // Close search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.hideSearchResults();
            }
        });
    }

    // Build search data from all settings
    buildSearchData() {
        return [
            // Appearance Settings
            {
                id: 'uiDesign',
                title: 'UI Design',
                description: 'Choose between Modern and Classic UI designs',
                section: 'Appearance',
                sectionId: 'appearance',
                icon: 'ri-layout-2-line',
                keywords: ['ui', 'design', 'modern', 'classic', 'interface', 'layout']
            },
            {
                id: 'themeSelect',
                title: 'Color Theme',
                description: 'Choose between light and dark themes',
                section: 'Appearance',
                sectionId: 'appearance',
                icon: 'ri-palette-line',
                keywords: ['theme', 'color', 'light', 'dark', 'appearance', 'visual']
            },
            {
                id: 'accentColor',
                title: 'Accent Color',
                description: 'Choose your preferred accent color',
                section: 'Appearance',
                sectionId: 'appearance',
                icon: 'ri-brush-line',
                keywords: ['accent', 'color', 'theme', 'customize', 'appearance']
            },
            {
                id: 'animationsEnabled',
                title: 'Animations',
                description: 'Enable smooth transitions and animations',
                section: 'Appearance',
                sectionId: 'appearance',
                icon: 'ri-magic-line',
                keywords: ['animation', 'transition', 'smooth', 'effect', 'ui']
            },
            {
                id: 'glassEffects',
                title: 'Glass Effects',
                description: 'Enable glass morphism and blur effects',
                section: 'Appearance',
                sectionId: 'appearance',
                icon: 'ri-gradienter-line',
                keywords: ['glass', 'blur', 'morphism', 'effect', 'visual']
            },
            {
                id: 'particleEffects',
                title: 'Particle Effects',
                description: 'Show floating particles and background effects',
                section: 'Appearance',
                sectionId: 'appearance',
                icon: 'ri-sparkling-line',
                keywords: ['particle', 'effect', 'background', 'visual', 'animation']
            },
            
            // Editor Settings
            {
                id: 'fontSize',
                title: 'Font Size',
                description: 'Adjust the editor font size',
                section: 'Editor',
                sectionId: 'editor',
                icon: 'ri-text',
                keywords: ['font', 'size', 'text', 'editor', 'display']
            },
            {
                id: 'fontFamily',
                title: 'Font Family',
                description: 'Choose the editor font family',
                section: 'Editor',
                sectionId: 'editor',
                icon: 'ri-font-family',
                keywords: ['font', 'family', 'typeface', 'editor', 'text']
            },
            {
                id: 'lineHeight',
                title: 'Line Height',
                description: 'Adjust the spacing between lines',
                section: 'Editor',
                sectionId: 'editor',
                icon: 'ri-text-direction-l',
                keywords: ['line', 'height', 'spacing', 'editor', 'text']
            },
            {
                id: 'wordWrap',
                title: 'Word Wrap',
                description: 'Wrap long lines in the editor',
                section: 'Editor',
                sectionId: 'editor',
                icon: 'ri-text-wrap',
                keywords: ['word', 'wrap', 'line', 'editor', 'text']
            },
            {
                id: 'minimap',
                title: 'Minimap',
                description: 'Show code minimap on the right side',
                section: 'Editor',
                sectionId: 'editor',
                icon: 'ri-map-2-line',
                keywords: ['minimap', 'overview', 'editor', 'navigation']
            },
            {
                id: 'autoSave',
                title: 'Auto Save',
                description: 'Automatically save changes',
                section: 'Editor',
                sectionId: 'editor',
                icon: 'ri-save-line',
                keywords: ['auto', 'save', 'automatic', 'editor', 'file']
            },
            {
                id: 'autoSaveInterval',
                title: 'Auto Save Interval',
                description: 'Time interval for automatic saving',
                section: 'Editor',
                sectionId: 'editor',
                icon: 'ri-time-line',
                keywords: ['auto', 'save', 'interval', 'time', 'editor', 'file']
            },
            {
                id: 'tabSize',
                title: 'Tab Size',
                description: 'Number of spaces for indentation',
                section: 'Editor',
                sectionId: 'editor',
                icon: 'ri-indent-decrease',
                keywords: ['tab', 'size', 'indent', 'spaces', 'editor']
            },
            {
                id: 'lineNumbers',
                title: 'Line Numbers',
                description: 'Show line numbers in the editor',
                section: 'Editor',
                sectionId: 'editor',
                icon: 'ri-numbers-line',
                keywords: ['line', 'numbers', 'editor', 'display', 'gutter']
            },
            {
                id: 'autoComplete',
                title: 'Auto Complete',
                description: 'Enable auto-completion in the editor',
                section: 'Editor',
                sectionId: 'editor',
                icon: 'ri-code-s-slash-line',
                keywords: ['auto', 'complete', 'suggestion', 'editor', 'intellisense']
            },
            {
                id: 'syntaxHighlighting',
                title: 'Syntax Highlighting',
                description: 'Enable syntax highlighting in the editor',
                section: 'Editor',
                sectionId: 'editor',
                icon: 'ri-palette-line',
                keywords: ['syntax', 'highlighting', 'color', 'editor', 'code']
            },
            {
                id: 'executionTimeout',
                title: 'Execution Timeout',
                description: 'Maximum execution time for code',
                section: 'Editor',
                sectionId: 'editor',
                icon: 'ri-timer-line',
                keywords: ['execution', 'timeout', 'time', 'limit', 'code', 'run']
            },
            
            // Console Settings
            {
                id: 'consoleHeight',
                title: 'Console Height',
                description: 'Adjust the height of the console panel',
                section: 'Console',
                sectionId: 'console',
                icon: 'ri-arrows-vertical',
                keywords: ['console', 'height', 'size', 'panel', 'output']
            },
            {
                id: 'consoleFontSize',
                title: 'Console Font Size',
                description: 'Adjust the console font size',
                section: 'Console',
                sectionId: 'console',
                icon: 'ri-text',
                keywords: ['console', 'font', 'size', 'text', 'output']
            },
            {
                id: 'consoleFontFamily',
                title: 'Console Font Family',
                description: 'Choose the console font family',
                section: 'Console',
                sectionId: 'console',
                icon: 'ri-font-family',
                keywords: ['console', 'font', 'family', 'typeface', 'output']
            },
            {
                id: 'maxMessages',
                title: 'Max Messages',
                description: 'Maximum number of messages to keep in console',
                section: 'Console',
                sectionId: 'console',
                icon: 'ri-numbers-line',
                keywords: ['console', 'messages', 'limit', 'max', 'output']
            },
            {
                id: 'autoScroll',
                title: 'Auto Scroll',
                description: 'Automatically scroll to new messages',
                section: 'Console',
                sectionId: 'console',
                icon: 'ri-arrow-down-line',
                keywords: ['console', 'scroll', 'auto', 'messages', 'output']
            },
            {
                id: 'showTimestamps',
                title: 'Show Timestamps',
                description: 'Display timestamps for console messages',
                section: 'Console',
                sectionId: 'console',
                icon: 'ri-time-line',
                keywords: ['console', 'timestamp', 'time', 'messages', 'output']
            },
            {
                id: 'showIcons',
                title: 'Show Icons',
                description: 'Display icons for different message types',
                section: 'Console',
                sectionId: 'console',
                icon: 'ri-image-line',
                keywords: ['console', 'icons', 'images', 'messages', 'output']
            },
            
            // UI Elements Settings
            {
                id: 'showFileActions',
                title: 'File Actions',
                description: 'Show New, Open, Save buttons in the top navigation',
                section: 'UI Elements',
                sectionId: 'ui',
                icon: 'ri-file-line',
                keywords: ['file', 'actions', 'buttons', 'navigation', 'ui']
            },
            {
                id: 'showRunButton',
                title: 'Run Button',
                description: 'Show the Run and Stop buttons',
                section: 'UI Elements',
                sectionId: 'ui',
                icon: 'ri-play-line',
                keywords: ['run', 'button', 'execute', 'code', 'ui']
            },
            {
                id: 'showThemeToggle',
                title: 'Theme Toggle',
                description: 'Show the theme toggle button',
                section: 'UI Elements',
                sectionId: 'ui',
                icon: 'ri-contrast-2-line',
                keywords: ['theme', 'toggle', 'button', 'ui', 'appearance']
            },
            {
                id: 'showLayoutToggle',
                title: 'Layout Toggle',
                description: 'Show the layout toggle button',
                section: 'UI Elements',
                sectionId: 'ui',
                icon: 'ri-layout-line',
                keywords: ['layout', 'toggle', 'button', 'ui', 'arrangement']
            },
            {
                id: 'showSettingsButton',
                title: 'Settings Button',
                description: 'Show the settings button',
                section: 'UI Elements',
                sectionId: 'ui',
                icon: 'ri-settings-3-line',
                keywords: ['settings', 'button', 'ui', 'preferences']
            },
            {
                id: 'showEditorActions',
                title: 'Editor Action Buttons',
                description: 'Show Format, Minimap, and Word Wrap buttons in editor header',
                section: 'UI Elements',
                sectionId: 'ui',
                icon: 'ri-code-s-slash-line',
                keywords: ['editor', 'actions', 'buttons', 'format', 'minimap', 'ui']
            },
            {
                id: 'showEditorTitle',
                title: 'Editor Title',
                description: 'Show the "Code Editor" title and live badge',
                section: 'UI Elements',
                sectionId: 'ui',
                icon: 'ri-text',
                keywords: ['editor', 'title', 'badge', 'ui', 'header']
            },
            {
                id: 'showConsoleActions',
                title: 'Console Action Buttons',
                description: 'Show Clear, Copy, and Save buttons in console header',
                section: 'UI Elements',
                sectionId: 'ui',
                icon: 'ri-terminal-box-line',
                keywords: ['console', 'actions', 'buttons', 'clear', 'copy', 'ui']
            },
            {
                id: 'showConsoleStats',
                title: 'Console Statistics',
                description: 'Show message count and execution time in console header',
                section: 'UI Elements',
                sectionId: 'ui',
                icon: 'ri-bar-chart-line',
                keywords: ['console', 'statistics', 'stats', 'count', 'time', 'ui']
            },
            {
                id: 'showConsoleTitle',
                title: 'Console Title',
                description: 'Show the "Output Console" title and status indicator',
                section: 'UI Elements',
                sectionId: 'ui',
                icon: 'ri-text',
                keywords: ['console', 'title', 'indicator', 'ui', 'header']
            },
            {
                id: 'showTabCounter',
                title: 'Tab Counter',
                description: 'Show the tab counter (e.g., "1/3")',
                section: 'UI Elements',
                sectionId: 'ui',
                icon: 'ri-numbers-line',
                keywords: ['tab', 'counter', 'count', 'ui', 'navigation']
            },
            {
                id: 'showNewTabButton',
                title: 'New Tab Button',
                description: 'Show the new tab button (+)',
                section: 'UI Elements',
                sectionId: 'ui',
                icon: 'ri-add-line',
                keywords: ['tab', 'new', 'button', 'add', 'ui']
            },
            {
                id: 'confirmClose',
                title: 'Confirm Before Closing Tabs',
                description: 'Show confirmation dialog when closing tabs',
                section: 'UI Elements',
                sectionId: 'ui',
                icon: 'ri-question-line',
                keywords: ['confirm', 'close', 'tabs', 'dialog', 'ui']
            },
            
            // Performance Settings
            {
                id: 'hardwareAcceleration',
                title: 'Hardware Acceleration',
                description: 'Use GPU acceleration for better performance',
                section: 'Performance',
                sectionId: 'performance',
                icon: 'ri-cpu-line',
                keywords: ['hardware', 'acceleration', 'gpu', 'performance', 'speed']
            },
            {
                id: 'reducedMotion',
                title: 'Reduced Motion',
                description: 'Disable animations for better performance',
                section: 'Performance',
                sectionId: 'performance',
                icon: 'ri-pause-line',
                keywords: ['motion', 'animation', 'performance', 'accessibility']
            },
            {
                id: 'maxTabs',
                title: 'Maximum Tabs',
                description: 'Limit the number of open tabs',
                section: 'Performance',
                sectionId: 'performance',
                icon: 'ri-window-line',
                keywords: ['tabs', 'maximum', 'limit', 'memory', 'performance']
            },
            {
                id: 'autoCloseTabs',
                title: 'Auto Close Tabs',
                description: 'Automatically close unused tabs',
                section: 'Performance',
                sectionId: 'performance',
                icon: 'ri-close-circle-line',
                keywords: ['tabs', 'auto', 'close', 'unused', 'memory']
            },
            {
                id: 'debugMode',
                title: 'Debug Mode',
                description: 'Enable debug panel and console logging',
                section: 'Performance',
                sectionId: 'performance',
                icon: 'ri-bug-line',
                keywords: ['debug', 'mode', 'panel', 'console', 'logging']
            },
            {
                id: 'showPerformance',
                title: 'Show Performance Stats',
                description: 'Display performance statistics in the UI',
                section: 'Performance',
                sectionId: 'performance',
                icon: 'ri-dashboard-line',
                keywords: ['performance', 'stats', 'statistics', 'display', 'ui']
            }
        ];
    }

    // Handle search input
    handleSearch(query) {
        if (!query.trim()) {
            this.hideSearchResults();
            return;
        }

        const results = this.searchSettings(query);
        this.displaySearchResults(results, query);
    }

    // Search through settings
    searchSettings(query) {
        const searchTerm = query.toLowerCase();
        return this.searchData.filter(item => {
            return item.title.toLowerCase().includes(searchTerm) ||
                   item.description.toLowerCase().includes(searchTerm) ||
                   item.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm));
        });
    }

    // Display search results
    displaySearchResults(results, query) {
        this.resultsCount.textContent = `${results.length} result${results.length !== 1 ? 's' : ''}`;
        
        if (results.length === 0) {
            this.searchResultsList.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">
                        <i class="ri-search-line"></i>
                    </div>
                    <div class="no-results-title">No results found</div>
                    <div class="no-results-description">Try different keywords or check spelling</div>
                </div>
            `;
        } else {
            this.searchResultsList.innerHTML = results.map(item => {
                const highlightedTitle = this.highlightText(item.title, query);
                const highlightedDescription = this.highlightText(item.description, query);
                
                return `
                    <div class="search-result-item" data-section="${item.sectionId}" data-setting="${item.id}">
                        <div class="search-result-icon">
                            <i class="${item.icon}"></i>
                        </div>
                        <div class="search-result-content">
                            <div class="search-result-title">${highlightedTitle}</div>
                            <div class="search-result-description">${highlightedDescription}</div>
                        </div>
                        <div class="search-result-section">${item.section}</div>
                    </div>
                `;
            }).join('');
            
            // Add click handlers to results
            this.searchResultsList.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', () => {
                    const section = item.dataset.section;
                    const settingId = item.dataset.setting;
                    this.navigateToSetting(section, settingId);
                });
            });
        }
        
        this.searchResults.style.display = 'block';
        this.searchClear.style.display = 'block';
    }

    // Highlight search terms in text
    highlightText(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    }

    // Navigate to a specific setting
    navigateToSetting(section, settingId) {
        // Switch to the section
        this.switchSection(section);
        
        // Hide search results
        this.hideSearchResults();
        this.clearSearch();
        
        // Scroll to and highlight the setting
        setTimeout(() => {
            const settingElement = document.getElementById(settingId);
            if (settingElement) {
                settingElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                settingElement.style.animation = 'pulse 1s ease-in-out';
                setTimeout(() => {
                    settingElement.style.animation = '';
                }, 1000);
            }
        }, 100);
    }

    // Clear search
    clearSearch() {
        this.searchInput.value = '';
        this.hideSearchResults();
    }

    // Hide search results
    hideSearchResults() {
        this.searchResults.style.display = 'none';
        this.searchClear.style.display = 'none';
    }

    // Setup navigation between settings sections
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-link');
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
        document.querySelectorAll('.nav-link').forEach(item => {
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
        // UI Design selector
        const uiDesignSelect = document.getElementById('uiDesign');
        if (uiDesignSelect) {
            uiDesignSelect.value = this.settings.uiDesign || 'classic';
            uiDesignSelect.addEventListener('change', (e) => {
                this.updateSetting('uiDesign', e.target.value);
                this.applyUIDesign(e.target.value);
            });
        }

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
            case 'uiDesign':
                this.applyUIDesign(value);
                break;
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

    // Apply UI Design
    applyUIDesign(uiDesign) {
        // Store the UI preference
        localStorage.setItem('preferredUI', uiDesign);
        
        // Show notification
        this.showNotification(`UI switched to ${uiDesign === 'modern' ? 'Modern' : 'Classic'} UI. Please restart the application to see changes.`, 'info');
        
        // If we're in the settings page, we can show a preview or redirect
        if (window.location.pathname.includes('settings.html')) {
            // Show a confirmation dialog
            if (confirm(`Switch to ${uiDesign === 'modern' ? 'Modern' : 'Classic'} UI? The application will restart to apply changes.`)) {
                // Redirect to the appropriate UI
                if (uiDesign === 'modern') {
                    // If we're in classic settings, go to modern UI
                    if (window.location.pathname.includes('src/renderer/settings.html')) {
                        window.location.href = '../../modern-ui/index.html';
                    } else {
                        // We're in modern settings, go to modern UI
                        window.location.href = 'index.html';
                    }
                } else {
                    // If we're in modern settings, go to classic UI
                    if (window.location.pathname.includes('modern-ui/settings.html')) {
                        window.location.href = '../src/renderer/index.html';
                    } else {
                        // We're in classic settings, go to classic UI
                        window.location.href = 'index.html';
                    }
                }
            }
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
        
        // Update minimap buttons state
        const minimapButton = document.getElementById('btnMinimap');
        if (minimapButton) {
            minimapButton.classList.toggle('active', enabled);
        }
        
        const minimapButtonSide = document.getElementById('btnMinimapSide');
        if (minimapButtonSide) {
            minimapButtonSide.classList.toggle('active', enabled);
        }
        
        // Update side-by-side editor if it exists
        if (window.sideBySideEditor && typeof window.sideBySideEditor.updateOptions === 'function') {
            window.sideBySideEditor.updateOptions({
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
                
            } catch (error) {
                
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
                
            } catch (error) {
                
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
                
            } catch (error) {
                
            }
        }
    }

    // Apply console height
    applyConsoleHeight(height) {
        if (this.isOnMainPage()) {
            const consoleContent = document.querySelector('.console-container');
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
            uiDesign: 'classic',
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

// Create SettingsManager class (will be instantiated by HTML)
window.SettingsManager = SettingsManager;

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SettingsManager;
}
