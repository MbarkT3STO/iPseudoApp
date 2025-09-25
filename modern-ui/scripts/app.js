"use strict";
// Minimal clean app.ts - renderer wiring for runner.worker.js and ErrorManager
document.addEventListener('DOMContentLoaded', () => {
    const outputConsole = document.getElementById('output');
    const consoleContent = document.querySelector('.console-container');
    const runButton = document.getElementById('btnRun');
    const stopButton = document.getElementById('btnStop');
    const clearButton = document.getElementById('clearConsole');
    const runStatus = document.getElementById('runStatus');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    // Enhanced console elements
    const consoleStatus = document.getElementById('consoleStatus');
    const consoleStatusBadge = document.getElementById('consoleStatusBadge');
    const messageCount = document.getElementById('messageCount');
    const executionTime = document.getElementById('executionTime');
    const copyButton = document.getElementById('btnCopyOutput');
    const consoleSaveButton = document.getElementById('btnSaveOutput');
    const appShell = document.querySelector('.app-shell');
    const activityBar = document.querySelector('.activity-bar');
    // Track open files and their content
    const openFiles = new Map();
    let activeFilePath = '';
    // Global tab counter
    let tabCounter = 0;
    // Auto save functionality
    let autoSaveInterval = null;
    let lastSaveTime = new Map(); // Track last save time for each file
    // Function to get maximum tabs from settings
    function getMaxTabs() {
        const settings = loadSettings();
        return settings.maxTabs || 3;
    }
    // Auto save functions
    function startAutoSave() {
        const settings = loadSettings();
        if (!settings.autoSave)
            return;
        const intervalSeconds = settings.autoSaveInterval || 60;
        const intervalMs = intervalSeconds * 1000;
        // Clear existing interval
        if (autoSaveInterval) {
            clearInterval(autoSaveInterval);
        }
        autoSaveInterval = setInterval(() => {
            performAutoSave();
        }, intervalMs);
    }
    function stopAutoSave() {
        if (autoSaveInterval) {
            clearInterval(autoSaveInterval);
            autoSaveInterval = null;
        }
    }
    // Simple Debug Mode Implementation - Global Functions
    function toggleDebugMode(enabled) {
        if (enabled) {
            console.log('Debug mode enabled');
            showDebugPanel();
        }
        else {
            console.log('Debug mode disabled');
            hideDebugPanel();
        }
    }
    function showDebugPanel() {
        // Remove existing panel if any
        hideDebugPanel();
        // Create debug panel with modern floating design
        const panel = document.createElement('div');
        panel.id = 'debug-panel';
        panel.innerHTML = `
            <div class="debug-floating-container">
                <div class="debug-indicator" id="debug-indicator">
                    <div class="debug-dot"></div>
                    <span class="debug-label-text">Debug</span>
                </div>
                <div class="debug-panel-content" id="debug-panel-content">
                    <div class="debug-header">
                        <div class="debug-title">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                            <span>Debug Console</span>
                        </div>
                        <button class="debug-close" id="debug-close-btn">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                        </button>
                    </div>
                    <div class="debug-content" id="debug-content">
                        <div class="debug-grid">
                            <div class="debug-card">
                                <div class="debug-card-header">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                                    </svg>
                                    <span>Active File</span>
                                </div>
                                <div class="debug-card-value" id="debug-file">None</div>
                            </div>
                            <div class="debug-card">
                                <div class="debug-card-header">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V7H5V5H19M5,19V9H19V19H5M7,11H9V17H7V11M11,11H13V17H11V11M15,11H17V17H15V11Z"/>
                                    </svg>
                                    <span>Open Tabs</span>
                                </div>
                                <div class="debug-card-value" id="debug-tabs">0</div>
                            </div>
                            <div class="debug-card">
                                <div class="debug-card-header">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3M19,19H5V5H16.17L19,7.83V19M12,12A3,3 0 0,0 9,15A3,3 0 0,0 12,18A3,3 0 0,0 15,15A3,3 0 0,0 12,12M6,6H15V10H6V6Z"/>
                                    </svg>
                                    <span>Auto Save</span>
                                </div>
                                <div class="debug-card-value" id="debug-autosave">Off</div>
                            </div>
                            <div class="debug-card">
                                <div class="debug-card-header">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
                                    </svg>
                                    <span>Memory</span>
                                </div>
                                <div class="debug-card-value" id="debug-memory">-</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        // Style the panel with modern floating design
        panel.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 13px;
            pointer-events: none;
        `;
        // Add CSS styles for the modern floating debug panel
        const style = document.createElement('style');
        style.textContent = `
            /* Modern Floating Debug Panel */
            .debug-floating-container {
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: 12px;
            }
            
            .debug-indicator {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 12px;
                background: var(--debug-indicator-bg, rgba(0, 123, 255, 0.9));
                backdrop-filter: blur(20px);
                border-radius: 20px;
                border: 1px solid var(--debug-indicator-border, rgba(255, 255, 255, 0.2));
                box-shadow: var(--debug-indicator-shadow, 0 4px 20px rgba(0, 123, 255, 0.3));
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                pointer-events: auto;
                user-select: none;
            }
            
            .debug-indicator:hover {
                transform: translateY(-2px);
                box-shadow: var(--debug-indicator-hover-shadow, 0 8px 30px rgba(0, 123, 255, 0.4));
            }
            
            .debug-dot {
                width: 8px;
                height: 8px;
                background: var(--debug-dot-color, #ffffff);
                border-radius: 50%;
                animation: debug-pulse 2s infinite;
            }
            
            @keyframes debug-pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
            
            .debug-label-text {
                font-size: 12px;
                font-weight: 600;
                color: var(--debug-indicator-text, #ffffff);
                letter-spacing: 0.5px;
            }
            
            .debug-panel-content {
                background: var(--debug-panel-bg, rgba(255, 255, 255, 0.95));
                backdrop-filter: blur(20px);
                border: 1px solid var(--debug-panel-border, rgba(0, 0, 0, 0.1));
                border-radius: 16px;
                box-shadow: var(--debug-panel-shadow, 0 20px 60px rgba(0, 0, 0, 0.15));
                overflow: hidden;
                transform: translateY(-10px);
                opacity: 0;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                pointer-events: auto;
                min-width: 280px;
                max-width: 320px;
            }
            
            .debug-panel-content.show {
                transform: translateY(0);
                opacity: 1;
            }
            
            .debug-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 16px 20px;
                background: var(--debug-header-bg, rgba(0, 0, 0, 0.02));
                border-bottom: 1px solid var(--debug-header-border, rgba(0, 0, 0, 0.05));
            }
            
            .debug-title {
                display: flex;
                align-items: center;
                gap: 10px;
                font-weight: 600;
                color: var(--debug-title-color, #1a1a1a);
                font-size: 15px;
            }
            
            .debug-close {
                background: none;
                border: none;
                color: var(--debug-close-color, rgba(0, 0, 0, 0.5));
                cursor: pointer;
                padding: 6px;
                border-radius: 8px;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .debug-close:hover {
                background: var(--debug-close-hover-bg, rgba(0, 0, 0, 0.05));
                color: var(--debug-close-hover-color, #1a1a1a);
            }
            
            .debug-content {
                padding: 20px;
            }
            
            .debug-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
            }
            
            .debug-card {
                background: var(--debug-card-bg, rgba(0, 0, 0, 0.02));
                border: 1px solid var(--debug-card-border, rgba(0, 0, 0, 0.05));
                border-radius: 12px;
                padding: 12px;
                transition: all 0.2s ease;
            }
            
            .debug-card:hover {
                background: var(--debug-card-hover-bg, rgba(0, 0, 0, 0.04));
                transform: translateY(-1px);
            }
            
            .debug-card-header {
                display: flex;
                align-items: center;
                gap: 6px;
                margin-bottom: 8px;
                font-size: 11px;
                font-weight: 500;
                color: var(--debug-card-label-color, rgba(0, 0, 0, 0.6));
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .debug-card-value {
                font-size: 13px;
                font-weight: 600;
                color: var(--debug-card-value-color, #1a1a1a);
                font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
                word-break: break-all;
            }
            
            /* Light Mode Styles */
            [data-theme="light"] #debug-panel {
                --debug-indicator-bg: rgba(0, 123, 255, 0.9);
                --debug-indicator-border: rgba(255, 255, 255, 0.3);
                --debug-indicator-shadow: 0 4px 20px rgba(0, 123, 255, 0.3);
                --debug-indicator-hover-shadow: 0 8px 30px rgba(0, 123, 255, 0.4);
                --debug-dot-color: #ffffff;
                --debug-indicator-text: #ffffff;
                --debug-panel-bg: rgba(255, 255, 255, 0.95);
                --debug-panel-border: rgba(0, 0, 0, 0.1);
                --debug-panel-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
                --debug-header-bg: rgba(0, 0, 0, 0.02);
                --debug-header-border: rgba(0, 0, 0, 0.05);
                --debug-title-color: #1a1a1a;
                --debug-close-color: rgba(0, 0, 0, 0.5);
                --debug-close-hover-bg: rgba(0, 0, 0, 0.05);
                --debug-close-hover-color: #1a1a1a;
                --debug-card-bg: rgba(0, 0, 0, 0.02);
                --debug-card-border: rgba(0, 0, 0, 0.05);
                --debug-card-hover-bg: rgba(0, 0, 0, 0.04);
                --debug-card-label-color: rgba(0, 0, 0, 0.6);
                --debug-card-value-color: #1a1a1a;
            }
            
            /* Dark Mode Styles */
            [data-theme="dark"] #debug-panel {
                --debug-indicator-bg: rgba(0, 123, 255, 0.9);
                --debug-indicator-border: rgba(255, 255, 255, 0.2);
                --debug-indicator-shadow: 0 4px 20px rgba(0, 123, 255, 0.4);
                --debug-indicator-hover-shadow: 0 8px 30px rgba(0, 123, 255, 0.5);
                --debug-dot-color: #ffffff;
                --debug-indicator-text: #ffffff;
                --debug-panel-bg: rgba(30, 30, 30, 0.95);
                --debug-panel-border: rgba(255, 255, 255, 0.1);
                --debug-panel-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
                --debug-header-bg: rgba(255, 255, 255, 0.02);
                --debug-header-border: rgba(255, 255, 255, 0.05);
                --debug-title-color: #ffffff;
                --debug-close-color: rgba(255, 255, 255, 0.5);
                --debug-close-hover-bg: rgba(255, 255, 255, 0.05);
                --debug-close-hover-color: #ffffff;
                --debug-card-bg: rgba(255, 255, 255, 0.02);
                --debug-card-border: rgba(255, 255, 255, 0.05);
                --debug-card-hover-bg: rgba(255, 255, 255, 0.04);
                --debug-card-label-color: rgba(255, 255, 255, 0.6);
                --debug-card-value-color: #ffffff;
            }
            
            /* Auto-detect theme based on system preference */
            @media (prefers-color-scheme: light) {
                #debug-panel:not([data-theme]) {
                    --debug-indicator-bg: rgba(0, 123, 255, 0.9);
                    --debug-indicator-border: rgba(255, 255, 255, 0.3);
                    --debug-indicator-shadow: 0 4px 20px rgba(0, 123, 255, 0.3);
                    --debug-indicator-hover-shadow: 0 8px 30px rgba(0, 123, 255, 0.4);
                    --debug-dot-color: #ffffff;
                    --debug-indicator-text: #ffffff;
                    --debug-panel-bg: rgba(255, 255, 255, 0.95);
                    --debug-panel-border: rgba(0, 0, 0, 0.1);
                    --debug-panel-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
                    --debug-header-bg: rgba(0, 0, 0, 0.02);
                    --debug-header-border: rgba(0, 0, 0, 0.05);
                    --debug-title-color: #1a1a1a;
                    --debug-close-color: rgba(0, 0, 0, 0.5);
                    --debug-close-hover-bg: rgba(0, 0, 0, 0.05);
                    --debug-close-hover-color: #1a1a1a;
                    --debug-card-bg: rgba(0, 0, 0, 0.02);
                    --debug-card-border: rgba(0, 0, 0, 0.05);
                    --debug-card-hover-bg: rgba(0, 0, 0, 0.04);
                    --debug-card-label-color: rgba(0, 0, 0, 0.6);
                    --debug-card-value-color: #1a1a1a;
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(panel);
        // Apply current theme to debug panel
        const settings = loadSettings();
        panel.setAttribute('data-theme', settings.theme);
        // Add interactive functionality
        const indicator = panel.querySelector('#debug-indicator');
        const panelContent = panel.querySelector('#debug-panel-content');
        const closeBtn = panel.querySelector('#debug-close-btn');
        let isPanelOpen = false;
        // Toggle panel on indicator click
        indicator?.addEventListener('click', () => {
            isPanelOpen = !isPanelOpen;
            if (isPanelOpen) {
                panelContent.classList.add('show');
            }
            else {
                panelContent.classList.remove('show');
            }
        });
        // Close panel on close button click
        closeBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            isPanelOpen = false;
            panelContent.classList.remove('show');
        });
        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            if (isPanelOpen && !panel.contains(e.target)) {
                isPanelOpen = false;
                panelContent.classList.remove('show');
            }
        });
        // Update debug info every second
        updateDebugInfo();
        setInterval(updateDebugInfo, 1000);
    }
    function hideDebugPanel() {
        const panel = document.getElementById('debug-panel');
        if (panel) {
            panel.remove();
        }
    }
    function updateDebugInfo() {
        const fileSpan = document.getElementById('debug-file');
        const tabsSpan = document.getElementById('debug-tabs');
        const autosaveSpan = document.getElementById('debug-autosave');
        const memorySpan = document.getElementById('debug-memory');
        const debugPanel = document.getElementById('debug-panel');
        if (fileSpan) {
            const fileName = activeFilePath ? activeFilePath.split('/').pop() || activeFilePath : 'None';
            fileSpan.textContent = fileName;
        }
        if (tabsSpan) {
            tabsSpan.textContent = document.querySelectorAll('.modern-tab').length.toString();
        }
        if (autosaveSpan) {
            const settings = loadSettings();
            autosaveSpan.textContent = settings.autoSave ? 'On' : 'Off';
            // Update theme if it changed
            if (debugPanel) {
                debugPanel.setAttribute('data-theme', settings.theme);
            }
        }
        if (memorySpan && window.performance.memory) {
            const mem = window.performance.memory;
            memorySpan.textContent = `${Math.round(mem.usedJSHeapSize / 1024 / 1024)}MB`;
        }
    }
    // FPS calculation for performance stats
    let frameCount = 0;
    let lastTime = window.performance.now();
    function getFPS() {
        frameCount++;
        const now = window.performance.now();
        if (now - lastTime >= 1000) {
            const fps = Math.round((frameCount * 1000) / (now - lastTime));
            frameCount = 0;
            lastTime = now;
            return fps;
        }
        return 0;
    }
    // Performance stats functionality - Global Functions
    function applyPerformanceStats(enabled) {
        const performanceStats = document.getElementById('performance-stats');
        if (enabled) {
            if (!performanceStats) {
                addPerformanceStats();
            }
        }
        else {
            if (performanceStats) {
                performanceStats.remove();
            }
        }
    }
    function addPerformanceStats() {
        const statsPanel = document.createElement('div');
        statsPanel.id = 'performance-stats';
        statsPanel.innerHTML = `
            <div class="performance-header">
                <h4>Performance Stats</h4>
            </div>
            <div class="performance-content">
                <div class="stat-item">
                    <span class="stat-label">Memory:</span>
                    <span id="memory-usage" class="stat-value">-</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">FPS:</span>
                    <span id="fps-counter" class="stat-value">-</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Tabs:</span>
                    <span id="tab-count" class="stat-value">-</span>
                </div>
            </div>
        `;
        // Add styles
        statsPanel.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--glass-bg);
            backdrop-filter: var(--glass-blur);
            border: 1px solid var(--glass-border);
            border-radius: 8px;
            padding: 12px;
            z-index: 1000;
            font-size: 11px;
            color: var(--text-primary);
            box-shadow: var(--glass-shadow);
            min-width: 150px;
        `;
        document.body.appendChild(statsPanel);
        // Update stats periodically
        updatePerformanceStats();
        setInterval(updatePerformanceStats, 1000);
    }
    function updatePerformanceStats() {
        const memoryUsage = document.getElementById('memory-usage');
        const fpsCounter = document.getElementById('fps-counter');
        const tabCount = document.getElementById('tab-count');
        if (memoryUsage && window.performance.memory) {
            const mem = window.performance.memory;
            memoryUsage.textContent = `${Math.round(mem.usedJSHeapSize / 1024 / 1024)}MB`;
        }
        if (fpsCounter) {
            fpsCounter.textContent = getFPS().toString();
        }
        if (tabCount) {
            tabCount.textContent = document.querySelectorAll('.modern-tab').length.toString();
        }
    }
    function performAutoSave() {
        const settings = loadSettings();
        if (!settings.autoSave)
            return;
        const activeTab = document.querySelector('.modern-tab.active');
        if (!activeTab)
            return;
        const filePath = activeTab.dataset.path || '';
        // Only auto save file-based tabs
        if (!isFileBased(filePath))
            return;
        // Check if there are unsaved changes
        const fileData = openFiles.get(filePath);
        if (!fileData || !fileData.dirty)
            return;
        // Get current content from editor
        const currentContent = window.editor?.getValue() || '';
        if (!currentContent.trim())
            return;
        // Check if enough time has passed since last save
        const now = Date.now();
        const lastSave = lastSaveTime.get(filePath) || 0;
        const timeSinceLastSave = now - lastSave;
        const minInterval = (settings.autoSaveInterval || 60) * 1000;
        if (timeSinceLastSave < minInterval)
            return;
        // Perform auto save
        saveFileDirectly(filePath, currentContent)
            .then(() => {
            lastSaveTime.set(filePath, now);
            // Update dirty state
            if (fileData) {
                fileData.dirty = false;
                fileData.content = currentContent;
                openFiles.set(filePath, fileData);
            }
            // Update tab visual state
            activeTab.classList.remove('dirty');
            const dirtyIndicator = activeTab.querySelector('.dirty-indicator');
            if (dirtyIndicator) {
                dirtyIndicator.style.display = 'none';
            }
            // Auto save completed silently
        })
            .catch((error) => {
            console.error('Auto save failed:', error);
        });
    }
    // Function to check if we can create a new tab
    function canCreateNewTab() {
        const currentTabs = document.querySelectorAll('.modern-tab');
        return currentTabs.length < getMaxTabs();
    }
    // Function to get current tab count
    function getCurrentTabCount() {
        return document.querySelectorAll('.modern-tab').length;
    }
    // Function to update tab counter display
    function updateTabCounter() {
        const tabCount = getCurrentTabCount();
        const maxTabs = getMaxTabs();
        // Update any tab counter display if it exists
        const tabCounterElement = document.getElementById('tabCounter');
        if (tabCounterElement) {
            tabCounterElement.textContent = `${tabCount}/${maxTabs}`;
            // Update counter styling based on limit
            tabCounterElement.classList.remove('warning', 'limit-reached');
            if (tabCount >= maxTabs) {
                tabCounterElement.classList.add('limit-reached');
            }
            else if (tabCount >= maxTabs - 1) {
                tabCounterElement.classList.add('warning');
            }
        }
        // Add visual indicator when approaching limit
        const tabsContainer = document.getElementById('tabsContainer');
        if (tabsContainer) {
            if (tabCount >= maxTabs) {
                tabsContainer.classList.add('tab-limit-reached');
            }
            else if (tabCount >= maxTabs - 1) {
                tabsContainer.classList.add('tab-limit-warning');
            }
            else {
                tabsContainer.classList.remove('tab-limit-reached', 'tab-limit-warning');
            }
        }
    }
    // Function to update all tab-related UI elements
    function updateAllTabUI() {
        updateTabCounter();
        // Update new file button state
        const newButton = document.getElementById('btnNew');
        if (newButton) {
            const canCreate = canCreateNewTab();
            newButton.disabled = !canCreate;
            // Title removed - using aria-label for tooltip
            if (!canCreate) {
                newButton.classList.add('disabled');
            }
            else {
                newButton.classList.remove('disabled');
            }
        }
        // Update new tab button state
        const newTabButton = document.getElementById('btnNewTab');
        if (newTabButton) {
            const canCreate = canCreateNewTab();
            newTabButton.disabled = !canCreate;
            // Title removed - using aria-label for tooltip
            if (!canCreate) {
                newTabButton.classList.add('disabled');
            }
            else {
                newTabButton.classList.remove('disabled');
            }
        }
    }
    // Enhanced console state
    let consoleMessageCount = 0;
    let consoleStats = {
        messages: 0,
        errors: 0,
        warnings: 0,
        info: 0,
        executionTime: 0
    };
    // Performance optimization settings
    const MAX_CONSOLE_MESSAGES = 1000; // Limit to prevent performance issues
    let messageCleanupInterval = null;
    // Hardware acceleration monitoring
    function enableHardwareAcceleration() {
        const settings = loadSettings();
        if (!settings.hardwareAcceleration) {
            console.log('Hardware acceleration disabled in settings');
            return;
        }
        // Force hardware acceleration on key elements
        const elements = [
            '.main-content',
            '.print-output-container',
            '.print-output-content',
            '.console-container',
            '.editor-container',
            'body',
            'html'
        ];
        elements.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.transform = 'translateZ(0)';
                element.style.webkitTransform = 'translateZ(0)';
                element.style.webkitBackfaceVisibility = 'hidden';
                element.style.webkitPerspective = '1000px';
                element.style.willChange = 'transform';
                element.style.contain = 'layout style paint';
            }
        });
        console.log('Hardware acceleration enabled for all key elements');
    }
    // Disable hardware acceleration
    function disableHardwareAcceleration() {
        const elements = [
            '.main-content',
            '.print-output-container',
            '.print-output-content',
            '.console-container',
            '.editor-container',
            'body',
            'html'
        ];
        elements.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.transform = '';
                element.style.webkitTransform = '';
                element.style.webkitBackfaceVisibility = '';
                element.style.webkitPerspective = '';
                element.style.willChange = '';
                element.style.contain = '';
            }
        });
        console.log('Hardware acceleration disabled for all key elements');
    }
    // Toggle hardware acceleration based on settings
    function toggleHardwareAcceleration() {
        const settings = loadSettings();
        if (settings.hardwareAcceleration) {
            enableHardwareAcceleration();
            // Remove the no-hardware-acceleration class
            document.documentElement.classList.remove('no-hardware-acceleration');
        }
        else {
            disableHardwareAcceleration();
            // Add the no-hardware-acceleration class
            document.documentElement.classList.add('no-hardware-acceleration');
        }
    }
    // Performance monitoring
    function monitorPerformance() {
        if ('performance' in window) {
            const perfData = performance.getEntriesByType('measure');
            console.log('Performance metrics:', perfData);
        }
    }
    // Function to clean up old console messages for performance
    function cleanupOldMessages() {
        const printContent = document.querySelector('.print-output-content');
        if (!printContent)
            return;
        const messages = printContent.querySelectorAll('.print-output-line, .done-message, .suggestion-message, .console-message');
        if (messages.length > MAX_CONSOLE_MESSAGES) {
            const messagesToRemove = messages.length - MAX_CONSOLE_MESSAGES;
            console.log(`Cleaning up ${messagesToRemove} old messages for performance`);
            // Remove oldest messages (keep the most recent ones)
            for (let i = 0; i < messagesToRemove; i++) {
                if (messages[i] && !messages[i].classList.contains('console-welcome')) {
                    messages[i].remove();
                }
            }
        }
    }
    // Function to start message cleanup interval
    function startMessageCleanup() {
        if (messageCleanupInterval) {
            clearInterval(messageCleanupInterval);
        }
        messageCleanupInterval = setInterval(() => {
            cleanupOldMessages();
        }, 5000); // Clean up every 5 seconds
    }
    // Function to stop message cleanup
    function stopMessageCleanup() {
        if (messageCleanupInterval) {
            clearInterval(messageCleanupInterval);
            messageCleanupInterval = null;
        }
    }
    // Execution state management
    let isExecuting = false;
    let executionStopped = false;
    let executionStartTime = 0;
    let longRunningDetected = false;
    let longRunningTimeout = null;
    let criticalTimeout = null;
    let stopButtonPulseInterval = null;
    // Make these globally available
    window.openFiles = openFiles;
    window.activeFilePath = activeFilePath || '';
    // Tab-specific status and console management
    function getCurrentTabData() {
        if (!activeFilePath || !openFiles.has(activeFilePath)) {
            return null;
        }
        return openFiles.get(activeFilePath);
    }
    function updateTabStatus(isExecuting, executionStopped = false) {
        const tabData = getCurrentTabData();
        if (tabData) {
            tabData.isExecuting = isExecuting;
            tabData.executionStopped = executionStopped;
            openFiles.set(activeFilePath, tabData);
        }
    }
    function updateTabConsoleStats(stats) {
        const tabData = getCurrentTabData();
        if (tabData) {
            tabData.consoleStats = { ...stats };
            openFiles.set(activeFilePath, tabData);
        }
    }
    function updateTabConsoleOutput(output) {
        const tabData = getCurrentTabData();
        if (tabData) {
            tabData.consoleOutput = output;
            openFiles.set(activeFilePath, tabData);
        }
    }
    function getTabStatus() {
        const tabData = getCurrentTabData();
        if (!tabData)
            return 'ready';
        if (tabData.isExecuting) {
            return 'running';
        }
        else if (tabData.consoleStats && tabData.consoleStats.errors > 0) {
            return 'error';
        }
        else {
            return 'ready';
        }
    }
    // Comprehensive pseudocode formatting function
    function formatPseudocode() {
        if (!window.editor)
            return;
        const content = window.editor.getValue();
        if (!content.trim()) {
            out('Nothing to format', 'warning');
            return;
        }
        // Add loading state to format button
        const formatButton = document.getElementById('btnFormat');
        if (formatButton) {
            formatButton.disabled = true;
            formatButton.innerHTML = '<i class="ri-loader-4-line animate-spin"></i><span class="sm:block">Formatting...</span>';
        }
        try {
            const lines = content.split('\n');
            const formattedLines = [];
            let indentLevel = 0;
            const indentSize = 4; // 4 spaces per indent level
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                const trimmedLine = line.trim();
                // Skip empty lines but preserve them
                if (!trimmedLine) {
                    formattedLines.push('');
                    continue;
                }
                // Handle closing blocks (reduce indent before processing)
                if (trimmedLine.match(/^(endfor|endwhile|endif|endfunction|else|elseif)\b/i)) {
                    indentLevel = Math.max(0, indentLevel - 1);
                }
                // Add proper indentation
                const indent = ' '.repeat(indentLevel * indentSize);
                const formattedLine = indent + trimmedLine;
                formattedLines.push(formattedLine);
                // Handle opening blocks (increase indent after processing)
                if (trimmedLine.match(/^(if|for|while|function)\b/i)) {
                    indentLevel++;
                }
                // Handle else/elseif (special case - same level as if)
                if (trimmedLine.match(/^(else|elseif)\b/i)) {
                    indentLevel++;
                }
            }
            const formatted = formattedLines.join('\n');
            window.editor.setValue(formatted);
            // Mark file as dirty
            if (activeFilePath && openFiles.has(activeFilePath)) {
                const fileData = openFiles.get(activeFilePath);
                fileData.dirty = true;
                fileData.content = formatted;
                openFiles.set(activeFilePath, fileData);
                updateTabDirtyState(activeFilePath, true);
            }
            out('Code formatted successfully', 'success');
        }
        catch (error) {
            out(`Formatting error: ${error.message}`, 'error');
        }
        finally {
            // Restore format button
            if (formatButton) {
                formatButton.disabled = false;
                formatButton.innerHTML = '<i class="ri-code-s-slash-line"></i><span class="sm:block">Format</span>';
            }
        }
    }
    function restoreTabStatusAndConsole() {
        const tabData = getCurrentTabData();
        if (!tabData)
            return;
        // Restore console stats
        if (tabData.consoleStats) {
            consoleStats = {
                messages: tabData.consoleStats.messages || 0,
                errors: tabData.consoleStats.errors || 0,
                warnings: tabData.consoleStats.warnings || 0,
                info: tabData.consoleStats.info || 0,
                executionTime: tabData.consoleStats.executionTime || 0
            };
            consoleMessageCount = tabData.consoleStats.messages || 0;
        }
        else {
            consoleStats = { messages: 0, errors: 0, warnings: 0, info: 0, executionTime: 0 };
            consoleMessageCount = 0;
        }
        // Restore console output
        if (tabData.consoleOutput && outputConsole) {
            outputConsole.innerHTML = tabData.consoleOutput;
        }
        else if (outputConsole) {
            // Show welcome message if no output
            outputConsole.innerHTML = `
                <div class="console-welcome">
                    <div class="welcome-icon">
                        <i class="ri-code-s-slash-line"></i>
                    </div>
                    <div class="welcome-content">
                        <h4>Welcome to iPseudo IDE</h4>
                    </div>
                </div>
            `;
        }
        // Update UI elements
        if (messageCount) {
            messageCount.textContent = consoleMessageCount.toString();
        }
        // Update status indicator
        updateConsoleUI();
    }
    // Setup MutationObserver for automatic scrolling
    let autoScrollEnabled = true;
    let mutationObserver = null;
    let scrollTimeout = null;
    // Keyboard shortcuts
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Only handle shortcuts when not in input fields
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }
            // Ctrl/Cmd + S - Save
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                const saveButton = document.getElementById('btnSave');
                if (saveButton)
                    saveButton.click();
            }
            // Ctrl/Cmd + N - New file
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                const newButton = document.getElementById('btnNew');
                if (newButton)
                    newButton.click();
            }
            // Ctrl/Cmd + O - Open file
            if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
                e.preventDefault();
                const openButton = document.getElementById('btnOpen');
                if (openButton)
                    openButton.click();
            }
            // Ctrl/Cmd + Shift + F - Format code
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
                e.preventDefault();
                formatPseudocode();
            }
            // Ctrl/Cmd + K - Clear console
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                clearConsole();
            }
            // F5 - Run code
            if (e.key === 'F5') {
                e.preventDefault();
                const runButton = document.getElementById('btnRun');
                if (runButton && !runButton.disabled)
                    runButton.click();
            }
            // Escape - Stop execution
            if (e.key === 'Escape') {
                const stopButton = document.getElementById('btnStop');
                if (stopButton && stopButton.style.display !== 'none') {
                    stopButton.click();
                }
            }
        });
    }
    // Enhanced tooltip system
    function setupTooltips() {
        const tooltipElements = document.querySelectorAll('[title]');
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', showTooltip);
            element.addEventListener('mouseleave', hideTooltip);
        });
    }
    function showTooltip(e) {
        const element = e.target;
        const title = element.getAttribute('title');
        if (!title)
            return;
        // Remove existing tooltip
        hideTooltip();
        // Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.className = 'custom-tooltip';
        tooltip.textContent = title;
        tooltip.id = 'custom-tooltip';
        // Position tooltip
        const rect = element.getBoundingClientRect();
        tooltip.style.position = 'fixed';
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - 10}px`;
        tooltip.style.transform = 'translateX(-50%) translateY(-100%)';
        tooltip.style.zIndex = '10000';
        document.body.appendChild(tooltip);
        // Remove original title to prevent default tooltip
        element.setAttribute('data-original-title', title);
        element.removeAttribute('title');
    }
    function hideTooltip() {
        const tooltip = document.getElementById('custom-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
        // Restore original titles
        const elements = document.querySelectorAll('[data-original-title]');
        elements.forEach(element => {
            const originalTitle = element.getAttribute('data-original-title');
            if (originalTitle) {
                element.setAttribute('title', originalTitle);
                element.removeAttribute('data-original-title');
            }
        });
    }
    // Settings management
    function initializeSettings() {
        // Load settings from localStorage
        const settings = loadSettings();
        // Apply theme
        applyTheme(settings.theme || 'system');
        // Apply accent color
        applyAccentColor(settings.accentColor || '#0ea5e9');
        // Apply other settings
        applyAppSettings(settings);
        // Apply UI visibility settings with additional delay to ensure DOM is ready
        setTimeout(() => {
            console.log('Applying UI visibility on app startup');
            applyUIVisibilitySettings(settings);
        }, 500);
        // Initialize local variables from settings
        autoScrollEnabled = settings.autoScroll !== false;
    }
    // Initialize settings modal
    function initializeSettingsModal() {
        const settingsModal = document.getElementById('settingsModal');
        const closeSettingsModal = document.getElementById('closeSettingsModal');
        if (!settingsModal || !closeSettingsModal)
            return;
        // Close settings modal
        closeSettingsModal.addEventListener('click', () => {
            settingsModal.style.display = 'none';
        });
        // Close on overlay click
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) {
                settingsModal.style.display = 'none';
            }
        });
        // Setup tab functionality
        setupSettingsTabs();
        // Load settings into UI
        loadSettingsToUI();
        // Setup settings event listeners
        setupSettingsEventListeners();
        // Setup search functionality
        setupSettingsSearch();
        // Apply current UI visibility settings when modal opens
        const currentSettings = loadSettings();
        console.log('Settings when modal opens:', currentSettings);
        console.log('showRunButton when modal opens:', currentSettings.showRunButton);
        applyUIVisibilitySettings(currentSettings);
        // Update theme toggle button to reflect current settings
        updateThemeToggleButtonFromSettings();
    }
    // Setup settings tabs
    function setupSettingsTabs() {
        const tabs = document.querySelectorAll('.settings-tab');
        const tabContents = document.querySelectorAll('.settings-tab-content');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-tab');
                // Remove active class from all tabs and contents
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                // Add active class to clicked tab and corresponding content
                tab.classList.add('active');
                const targetContent = document.getElementById(`${targetTab}-tab`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }
    // Load settings into UI
    function loadSettingsToUI() {
        const settings = loadSettings();
        console.log('Loading settings to UI:', settings);
        console.log('showRunButton in loadSettingsToUI:', settings.showRunButton);
        // Theme
        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) {
            const theme = settings.theme || 'system';
            themeSelect.value = theme;
            console.log('Theme select set to:', theme);
        }
        // Accent color
        const accentColor = document.getElementById('accentColor');
        if (accentColor) {
            accentColor.value = settings.accentColor || '#0ea5e9';
            updateAccentColorPreview();
        }
        // Editor settings
        const fontSize = document.getElementById('fontSize');
        if (fontSize) {
            fontSize.value = (settings.fontSize || 14).toString();
            updateRangeValue('fontSize', 'fontSizeValue', 'px');
        }
        const tabSize = document.getElementById('tabSize');
        if (tabSize) {
            tabSize.value = (settings.tabSize || 4).toString();
            updateRangeValue('tabSize', 'tabSizeValue', ' spaces');
        }
        // Toggle settings
        setToggleValue('wordWrap', settings.wordWrap || false);
        setToggleValue('minimap', settings.minimap !== false);
        setToggleValue('lineNumbers', settings.lineNumbers !== false);
        setToggleValue('autoComplete', settings.autoComplete !== false);
        setToggleValue('syntaxHighlighting', settings.syntaxHighlighting !== false);
        setToggleValue('autoScroll', settings.autoScroll !== false);
        setToggleValue('showTimestamps', settings.showTimestamps !== false);
        setToggleValue('autoSave', settings.autoSave || false);
        setToggleValue('confirmClose', settings.confirmClose !== false);
        setToggleValue('debugMode', settings.debugMode || false);
        setToggleValue('showPerformance', settings.showPerformance || false);
        setToggleValue('animationsEnabled', settings.animationsEnabled !== false);
        setToggleValue('glassEffects', settings.glassEffects !== false);
        setToggleValue('hardwareAcceleration', settings.hardwareAcceleration !== false);
        // Console settings
        const consoleFontSize = document.getElementById('consoleFontSize');
        if (consoleFontSize) {
            consoleFontSize.value = (settings.consoleFontSize || 13).toString();
            updateRangeValue('consoleFontSize', 'consoleFontSizeValue', 'px');
        }
        const maxOutputLines = document.getElementById('maxOutputLines');
        if (maxOutputLines)
            maxOutputLines.value = (settings.maxMessages || 1000).toString();
        // App settings
        const maxTabs = document.getElementById('maxTabs');
        if (maxTabs) {
            maxTabs.value = (settings.maxTabs || 3).toString();
            updateRangeValue('maxTabs', 'maxTabsValue', ' tabs');
        }
        const autoSaveInterval = document.getElementById('autoSaveInterval');
        if (autoSaveInterval) {
            autoSaveInterval.value = (settings.autoSaveInterval || 60).toString();
            updateRangeValue('autoSaveInterval', 'autoSaveIntervalValue', 's');
            autoSaveInterval.disabled = !settings.autoSave;
        }
        // Advanced settings
        const executionTimeout = document.getElementById('executionTimeout');
        if (executionTimeout) {
            executionTimeout.value = (settings.executionTimeout || 30).toString();
            updateRangeValue('executionTimeout', 'executionTimeoutValue', 's');
        }
        // UI visibility settings - use explicit boolean values
        setToggleValue('showFileActions', settings.showFileActions === true);
        setToggleValue('showRunButton', settings.showRunButton === true);
        setToggleValue('showThemeToggle', settings.showThemeToggle === true);
        setToggleValue('showLayoutToggle', settings.showLayoutToggle === true);
        setToggleValue('showSettingsButton', settings.showSettingsButton === true);
        setToggleValue('showEditorActions', settings.showEditorActions === true);
        setToggleValue('showConsoleStats', settings.showConsoleStats === true);
        setToggleValue('showTabCounter', settings.showTabCounter === true);
    }
    // Setup settings event listeners
    function setupSettingsEventListeners() {
        // Theme change
        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) {
            themeSelect.addEventListener('change', (e) => {
                const theme = e.target.value;
                console.log('Theme changed to:', theme);
                // Apply theme immediately
                applyTheme(theme);
                // Save setting
                const updatedSettings = saveSetting('theme', theme);
                console.log('Theme setting saved:', updatedSettings.theme);
                // If system theme is selected, listen for system theme changes
                if (theme === 'system') {
                    setupSystemThemeListener();
                }
                else {
                    removeSystemThemeListener();
                }
            });
        }
        // Setup system theme listener for initial load
        const currentTheme = loadSettings().theme;
        if (currentTheme === 'system') {
            setupSystemThemeListener();
        }
        // Accent color change
        const accentColor = document.getElementById('accentColor');
        if (accentColor) {
            accentColor.addEventListener('input', (e) => {
                const color = e.target.value;
                applyAccentColor(color);
                updateAccentColorPreview();
                saveSetting('accentColor', color);
            });
        }
        // Range inputs
        setupRangeInput('fontSize', 'fontSizeValue', 'px', (value) => {
            saveSetting('fontSize', value);
            const settings = loadSettings();
            settings.fontSize = value;
            applyEditorSettings(settings);
        });
        setupRangeInput('tabSize', 'tabSizeValue', ' spaces', (value) => {
            saveSetting('tabSize', value);
            const settings = loadSettings();
            settings.tabSize = value;
            applyEditorSettings(settings);
        });
        setupRangeInput('consoleFontSize', 'consoleFontSizeValue', 'px', (value) => {
            console.log('=== CONSOLE FONT SIZE CHANGED ===');
            console.log('New value:', value);
            const updatedSettings = saveSetting('consoleFontSize', value);
            console.log('Updated settings:', updatedSettings);
            // Apply immediately with multiple methods
            applyConsoleFontSizeImmediately(value);
            applyAppSettings(updatedSettings);
        });
        setupRangeInput('maxTabs', 'maxTabsValue', ' tabs', (value) => {
            const updatedSettings = saveSetting('maxTabs', value);
            applyAppSettings(updatedSettings);
            applyUIVisibilitySettings(updatedSettings);
            // Update tab UI immediately when maxTabs setting changes
            updateAllTabUI();
        });
        setupRangeInput('autoSaveInterval', 'autoSaveIntervalValue', 's', (value) => {
            saveSetting('autoSaveInterval', value);
            // Restart auto save with new interval if it's currently running
            const settings = loadSettings();
            if (settings.autoSave) {
                stopAutoSave();
                startAutoSave();
            }
        });
        setupRangeInput('executionTimeout', 'executionTimeoutValue', 's', (value) => {
            saveSetting('executionTimeout', value);
        });
        // Toggle inputs
        setupToggleInput('wordWrap', (value) => {
            saveSetting('wordWrap', value);
            const settings = loadSettings();
            settings.wordWrap = value;
            applyEditorSettings(settings);
        });
        setupToggleInput('minimap', (value) => {
            saveSetting('minimap', value);
            const settings = loadSettings();
            settings.minimap = value;
            applyEditorSettings(settings);
        });
        setupToggleInput('lineNumbers', (value) => {
            saveSetting('lineNumbers', value);
            const settings = loadSettings();
            settings.lineNumbers = value;
            applyEditorSettings(settings);
        });
        setupToggleInput('autoComplete', (value) => {
            saveSetting('autoComplete', value);
            const settings = loadSettings();
            settings.autoComplete = value;
            applyEditorSettings(settings);
        });
        setupToggleInput('syntaxHighlighting', (value) => {
            saveSetting('syntaxHighlighting', value);
            const settings = loadSettings();
            settings.syntaxHighlighting = value;
            applyEditorSettings(settings);
        });
        setupToggleInput('autoScroll', (value) => {
            console.log('Auto scroll setting changed to:', value);
            const updatedSettings = saveSetting('autoScroll', value);
            applyAppSettings(updatedSettings);
            // Update the local variable
            autoScrollEnabled = value;
            console.log('Local autoScrollEnabled set to:', autoScrollEnabled);
            console.log('Global autoScrollEnabled set to:', window.autoScrollEnabled);
        });
        setupToggleInput('showTimestamps', (value) => {
            const updatedSettings = saveSetting('showTimestamps', value);
            applyAppSettings(updatedSettings);
        });
        setupToggleInput('autoSave', (value) => {
            saveSetting('autoSave', value);
            const autoSaveInterval = document.getElementById('autoSaveInterval');
            if (autoSaveInterval) {
                autoSaveInterval.disabled = !value;
            }
            const updatedSettings = loadSettings();
            applyAppSettings(updatedSettings);
            applyUIVisibilitySettings(updatedSettings);
            // Start or stop auto save based on setting
            if (value) {
                startAutoSave();
            }
            else {
                stopAutoSave();
            }
        });
        setupToggleInput('confirmClose', (value) => {
            saveSetting('confirmClose', value);
        });
        setupToggleInput('debugMode', (value) => {
            saveSetting('debugMode', value);
            toggleDebugMode(value);
        });
        setupToggleInput('showPerformance', (value) => {
            saveSetting('showPerformance', value);
            applyPerformanceStats(value);
        });
        setupToggleInput('animationsEnabled', (value) => {
            const updatedSettings = saveSetting('animationsEnabled', value);
            applyAppSettings(updatedSettings);
            applyUIVisibilitySettings(updatedSettings);
        });
        setupToggleInput('glassEffects', (value) => {
            const updatedSettings = saveSetting('glassEffects', value);
            applyAppSettings(updatedSettings);
            applyUIVisibilitySettings(updatedSettings);
        });
        setupToggleInput('hardwareAcceleration', (value) => {
            const updatedSettings = saveSetting('hardwareAcceleration', value);
            console.log('Hardware acceleration setting changed to:', value);
            toggleHardwareAcceleration();
        });
        // UI visibility toggles
        setupToggleInput('showFileActions', (value) => {
            const updatedSettings = saveSetting('showFileActions', value);
            console.log('Updated settings for showFileActions:', updatedSettings.showFileActions);
            applyUIVisibilitySettings(updatedSettings);
        });
        setupToggleInput('showRunButton', (value) => {
            const updatedSettings = saveSetting('showRunButton', value);
            console.log('Updated settings for showRunButton:', updatedSettings.showRunButton);
            applyUIVisibilitySettings(updatedSettings);
        });
        setupToggleInput('showThemeToggle', (value) => {
            saveSetting('showThemeToggle', value);
            applyUIVisibilitySettings(loadSettings());
        });
        setupToggleInput('showLayoutToggle', (value) => {
            saveSetting('showLayoutToggle', value);
            applyUIVisibilitySettings(loadSettings());
        });
        setupToggleInput('showSettingsButton', (value) => {
            saveSetting('showSettingsButton', value);
            applyUIVisibilitySettings(loadSettings());
        });
        setupToggleInput('showEditorActions', (value) => {
            saveSetting('showEditorActions', value);
            applyUIVisibilitySettings(loadSettings());
        });
        setupToggleInput('showConsoleStats', (value) => {
            saveSetting('showConsoleStats', value);
            applyUIVisibilitySettings(loadSettings());
        });
        setupToggleInput('showTabCounter', (value) => {
            saveSetting('showTabCounter', value);
            applyUIVisibilitySettings(loadSettings());
        });
        // Number inputs
        const maxOutputLines = document.getElementById('maxOutputLines');
        if (maxOutputLines) {
            maxOutputLines.addEventListener('change', (e) => {
                const updatedSettings = saveSetting('maxMessages', parseInt(e.target.value));
                applyAppSettings(updatedSettings);
            });
        }
        // Settings actions
        const resetSettings = document.getElementById('resetSettings');
        if (resetSettings) {
            resetSettings.addEventListener('click', () => {
                resetSettingsToDefaults();
            });
        }
        const exportSettings = document.getElementById('exportSettings');
        if (exportSettings) {
            exportSettings.addEventListener('click', () => {
                exportSettingsToFile();
            });
        }
        const importSettings = document.getElementById('importSettings');
        if (importSettings) {
            importSettings.addEventListener('click', () => {
                importSettingsFromFile();
            });
        }
    }
    // Helper functions for settings UI
    function setupRangeInput(id, valueId, suffix, callback) {
        const input = document.getElementById(id);
        const valueDisplay = document.getElementById(valueId);
        if (input && valueDisplay) {
            input.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                updateRangeValue(id, valueId, suffix);
                callback(value);
            });
        }
    }
    function setupToggleInput(id, callback) {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('change', (e) => {
                const value = e.target.checked;
                callback(value);
            });
        }
    }
    function updateRangeValue(inputId, valueId, suffix) {
        const input = document.getElementById(inputId);
        const valueDisplay = document.getElementById(valueId);
        if (input && valueDisplay) {
            valueDisplay.textContent = input.value + suffix;
        }
    }
    function setToggleValue(id, value) {
        const input = document.getElementById(id);
        if (input) {
            input.checked = value;
        }
    }
    function updateAccentColorPreview() {
        const accentColor = document.getElementById('accentColor');
        const preview = document.getElementById('accentColorPreview');
        if (accentColor && preview) {
            preview.style.background = accentColor.value;
        }
    }
    function saveSetting(key, value) {
        try {
            console.log(`Saving setting: ${key} = ${value}`);
            const settings = loadSettings();
            settings[key] = value;
            console.log('Updated settings before saving:', settings);
            localStorage.setItem('iPseudoSettings', JSON.stringify(settings));
            console.log('Settings saved to localStorage');
            showSettingsNotification('Setting saved');
            return settings; // Return the updated settings
        }
        catch (error) {
            console.error('Failed to save setting:', error);
            return loadSettings(); // Return current settings on error
        }
    }
    function resetSettingsToDefaults() {
        const defaults = getDefaultSettings();
        localStorage.setItem('iPseudoSettings', JSON.stringify(defaults));
        loadSettingsToUI();
        applyAppSettings(defaults);
        showSettingsNotification('Settings reset to defaults');
    }
    function exportSettingsToFile() {
        try {
            const settings = loadSettings();
            const settingsJson = JSON.stringify(settings, null, 2);
            const blob = new Blob([settingsJson], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'iPseudo-settings.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showSettingsNotification('Settings exported successfully');
        }
        catch (error) {
            showSettingsNotification('Failed to export settings');
        }
    }
    function importSettingsFromFile() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.addEventListener('change', (e) => {
            const file = e.target.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const imported = JSON.parse(e.target?.result);
                        const defaults = getDefaultSettings();
                        const mergedSettings = { ...defaults, ...imported };
                        localStorage.setItem('iPseudoSettings', JSON.stringify(mergedSettings));
                        loadSettingsToUI();
                        applyAppSettings(mergedSettings);
                        showSettingsNotification('Settings imported successfully');
                    }
                    catch (error) {
                        showSettingsNotification('Failed to import settings: Invalid file format');
                    }
                };
                reader.readAsText(file);
            }
        });
        input.click();
    }
    // Setup settings search functionality
    function setupSettingsSearch() {
        const searchInput = document.getElementById('settingsSearch');
        const clearButton = document.getElementById('clearSearch');
        const settingsSections = document.querySelectorAll('.settings-section');
        if (!searchInput || !clearButton)
            return;
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (query) {
                clearButton.style.display = 'flex';
                filterSettings(query, settingsSections);
            }
            else {
                clearButton.style.display = 'none';
                showAllSettings(settingsSections);
            }
        });
        clearButton.addEventListener('click', () => {
            searchInput.value = '';
            clearButton.style.display = 'none';
            showAllSettings(settingsSections);
            searchInput.focus();
        });
    }
    // Filter settings based on search query
    function filterSettings(query, sections) {
        sections.forEach(section => {
            const sectionTitle = section.querySelector('h3')?.textContent?.toLowerCase() || '';
            const settingItems = section.querySelectorAll('.setting-item');
            let hasVisibleItems = false;
            settingItems.forEach(item => {
                const label = item.querySelector('label')?.textContent?.toLowerCase() || '';
                const isVisible = sectionTitle.includes(query) || label.includes(query);
                item.style.display = isVisible ? 'flex' : 'none';
                if (isVisible)
                    hasVisibleItems = true;
            });
            section.style.display = hasVisibleItems ? 'block' : 'none';
        });
    }
    // Show all settings
    function showAllSettings(sections) {
        sections.forEach(section => {
            section.style.display = 'block';
            const settingItems = section.querySelectorAll('.setting-item');
            settingItems.forEach(item => {
                item.style.display = 'flex';
            });
        });
    }
    function clearProblematicUISettings() {
        try {
            const saved = localStorage.getItem('iPseudoSettings');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Check if any UI visibility settings are false (which would hide elements)
                const uiVisibilityKeys = [
                    'showFileActions', 'showRunButton', 'showThemeToggle', 'showLayoutToggle',
                    'showSettingsButton', 'showEditorActions', 'showEditorTitle',
                    'showConsoleActions', 'showConsoleStats', 'showConsoleTitle',
                    'showTabCounter', 'showNewTabButton'
                ];
                let hasHiddenElements = false;
                uiVisibilityKeys.forEach(key => {
                    if (parsed[key] === false) {
                        hasHiddenElements = true;
                        parsed[key] = true; // Reset to visible
                    }
                });
                if (hasHiddenElements) {
                    console.log('Found hidden UI elements, resetting to visible...');
                    localStorage.setItem('iPseudoSettings', JSON.stringify(parsed));
                }
            }
        }
        catch (error) {
            console.error('Error clearing problematic UI settings:', error);
        }
    }
    function loadSettings() {
        try {
            const saved = localStorage.getItem('iPseudoSettings');
            console.log('Loading settings from localStorage:', saved);
            if (saved) {
                const parsed = JSON.parse(saved);
                console.log('Parsed settings:', parsed);
                // Check if UI visibility settings are missing and add defaults
                const defaults = getDefaultSettings();
                const mergedSettings = { ...defaults, ...parsed };
                // Only add UI visibility defaults for missing settings (don't override existing values)
                const uiVisibilityDefaults = {
                    showFileActions: mergedSettings.showFileActions !== undefined ? mergedSettings.showFileActions : true,
                    showRunButton: mergedSettings.showRunButton !== undefined ? mergedSettings.showRunButton : true,
                    showThemeToggle: mergedSettings.showThemeToggle !== undefined ? mergedSettings.showThemeToggle : true,
                    showLayoutToggle: mergedSettings.showLayoutToggle !== undefined ? mergedSettings.showLayoutToggle : true,
                    showSettingsButton: mergedSettings.showSettingsButton !== undefined ? mergedSettings.showSettingsButton : true,
                    showEditorActions: mergedSettings.showEditorActions !== undefined ? mergedSettings.showEditorActions : true,
                    showEditorTitle: mergedSettings.showEditorTitle !== undefined ? mergedSettings.showEditorTitle : true,
                    showConsoleActions: mergedSettings.showConsoleActions !== undefined ? mergedSettings.showConsoleActions : true,
                    showConsoleStats: mergedSettings.showConsoleStats !== undefined ? mergedSettings.showConsoleStats : true,
                    showConsoleTitle: mergedSettings.showConsoleTitle !== undefined ? mergedSettings.showConsoleTitle : true,
                    showTabCounter: mergedSettings.showTabCounter !== undefined ? mergedSettings.showTabCounter : true,
                    showNewTabButton: mergedSettings.showNewTabButton !== undefined ? mergedSettings.showNewTabButton : true
                };
                const finalSettings = { ...mergedSettings, ...uiVisibilityDefaults };
                console.log('Final settings with UI defaults:', finalSettings);
                return finalSettings;
            }
        }
        catch (error) {
            console.error('Error loading settings:', error);
        }
        const defaults = getDefaultSettings();
        console.log('Using default settings:', defaults);
        return defaults;
    }
    function getDefaultSettings() {
        return {
            theme: 'system',
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
    function applyTheme(theme) {
        console.log('Applying theme:', theme);
        const body = document.body;
        const html = document.documentElement;
        // Remove existing theme classes
        body.classList.remove('theme-light', 'theme-dark');
        html.classList.remove('theme-light', 'theme-dark');
        html.removeAttribute('data-theme');
        let actualTheme = theme;
        // Handle system/auto theme
        if (theme === 'auto' || theme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            actualTheme = prefersDark ? 'dark' : 'light';
            console.log('System theme detected:', actualTheme);
        }
        // Apply the theme
        const themeClass = `theme-${actualTheme}`;
        body.classList.add(themeClass);
        html.classList.add(themeClass);
        html.setAttribute('data-theme', actualTheme);
        console.log('Theme applied:', themeClass);
        // Update Monaco editor theme if available
        if (typeof window.monaco !== 'undefined' && window.monaco.editor) {
            try {
                window.monaco.editor.setTheme(actualTheme === 'dark' ? 'vs-dark' : 'vs');
                console.log('Monaco editor theme updated to:', actualTheme === 'dark' ? 'vs-dark' : 'vs');
            }
            catch (error) {
                console.error('Error updating Monaco theme:', error);
            }
        }
        // Update theme toggle button if it exists
        updateThemeToggleButton(actualTheme === 'dark');
        updateThemeToggleButtonFromSettings();
    }
    function updateThemeToggleButton(isDark) {
        const themeToggle = document.getElementById('btnThemeToggle');
        if (themeToggle) {
            themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = isDark ? 'ri-moon-line' : 'ri-sun-line';
            }
        }
    }
    function updateThemeToggleButtonFromSettings() {
        const settings = loadSettings();
        const themeToggle = document.getElementById('btnThemeToggle');
        const icon = themeToggle?.querySelector('i');
        if (!themeToggle || !icon)
            return;
        // Update icon and tooltip based on current theme setting
        if (settings.theme === 'system') {
            icon.className = 'ri-contrast-2-line';
            themeToggle.title = 'Toggle Theme (System)';
        }
        else if (settings.theme === 'dark') {
            icon.className = 'ri-moon-line';
            themeToggle.title = 'Toggle Theme (Dark)';
        }
        else if (settings.theme === 'light') {
            icon.className = 'ri-sun-line';
            themeToggle.title = 'Toggle Theme (Light)';
        }
        console.log('Theme toggle button updated for theme:', settings.theme);
    }
    let systemThemeListener = null;
    function setupSystemThemeListener() {
        if (systemThemeListener)
            return; // Already set up
        systemThemeListener = (e) => {
            console.log('System theme changed:', e.matches ? 'dark' : 'light');
            const settings = loadSettings();
            if (settings.theme === 'system') {
                applyTheme('system');
            }
        };
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', systemThemeListener);
        console.log('System theme listener set up');
    }
    function removeSystemThemeListener() {
        if (systemThemeListener) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.removeEventListener('change', systemThemeListener);
            systemThemeListener = null;
            console.log('System theme listener removed');
        }
    }
    function applyAccentColor(color) {
        document.documentElement.style.setProperty('--accent-soft-primary', color);
        document.documentElement.style.setProperty('--primary-500', color);
        document.documentElement.style.setProperty('--primary-600', darkenColor(color, 0.1));
    }
    function darkenColor(color, amount) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * amount * 100);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }
    function applyAppSettings(settings) {
        // Apply animations
        if (!settings.animationsEnabled) {
            document.body.classList.add('reduced-motion');
        }
        else {
            document.body.classList.remove('reduced-motion');
        }
        // Apply glass effects - wait for elements to be available
        const applyGlassEffects = () => {
            const glassElements = document.querySelectorAll('.glass-morphism, .floating-particles');
            if (glassElements.length > 0) {
                if (!settings.glassEffects) {
                    glassElements.forEach(el => el.classList.add('no-glass'));
                }
                else {
                    glassElements.forEach(el => el.classList.remove('no-glass'));
                }
            }
            else {
                // Retry if elements not found yet
                setTimeout(applyGlassEffects, 100);
            }
        };
        applyGlassEffects();
        // Apply particle effects - wait for elements to be available
        const applyParticleEffects = () => {
            const particleElements = document.querySelectorAll('.floating-particles');
            if (particleElements.length > 0) {
                if (!settings.particleEffects) {
                    particleElements.forEach(el => el.classList.add('no-particles'));
                }
                else {
                    particleElements.forEach(el => el.classList.remove('no-particles'));
                }
            }
            else {
                // Retry if elements not found yet
                setTimeout(applyParticleEffects, 100);
            }
        };
        applyParticleEffects();
        // Apply console height
        const consoleContent = document.querySelector('.console-container');
        console.log('Console content element found:', !!consoleContent);
        if (consoleContent && settings.consoleHeight) {
            consoleContent.style.setProperty('height', `${settings.consoleHeight}px`, 'important');
            console.log('Applied console height:', settings.consoleHeight);
        }
        // Enable hardware acceleration for Monaco editor
        if (window.editor && settings.hardwareAcceleration) {
            try {
                // Force hardware acceleration for Monaco editor
                const editorElement = window.editor.getDomNode();
                if (editorElement) {
                    editorElement.style.transform = 'translateZ(0)';
                    editorElement.style.webkitTransform = 'translateZ(0)';
                    editorElement.style.webkitBackfaceVisibility = 'hidden';
                    editorElement.style.webkitPerspective = '1000px';
                    editorElement.style.willChange = 'transform';
                    editorElement.style.contain = 'layout style paint';
                }
            }
            catch (e) {
                console.log('Could not apply hardware acceleration to Monaco editor:', e);
            }
        }
        else if (window.editor && !settings.hardwareAcceleration) {
            try {
                // Disable hardware acceleration for Monaco editor
                const editorElement = window.editor.getDomNode();
                if (editorElement) {
                    editorElement.style.transform = '';
                    editorElement.style.webkitTransform = '';
                    editorElement.style.webkitBackfaceVisibility = '';
                    editorElement.style.webkitPerspective = '';
                    editorElement.style.willChange = '';
                    editorElement.style.contain = '';
                }
            }
            catch (e) {
                console.log('Could not disable hardware acceleration for Monaco editor:', e);
            }
        }
        // Apply console font settings using multiple approaches
        const applyConsoleFontSettings = () => {
            console.log('=== APPLYING CONSOLE FONT SETTINGS ===');
            console.log('Settings object:', settings);
            console.log('consoleFontSize:', settings.consoleFontSize);
            // Method 1: Set CSS custom properties on the document root
            if (settings.consoleFontSize) {
                document.documentElement.style.setProperty('--console-font-size', `${settings.consoleFontSize}px`);
                console.log('Set CSS custom property --console-font-size to:', `${settings.consoleFontSize}px`);
            }
            if (settings.consoleFontFamily) {
                document.documentElement.style.setProperty('--console-font-family', settings.consoleFontFamily);
                console.log('Set CSS custom property --console-font-family to:', settings.consoleFontFamily);
            }
            // Method 2: Create or update a style element with high specificity
            let consoleStyleElement = document.getElementById('console-custom-styles');
            if (!consoleStyleElement) {
                consoleStyleElement = document.createElement('style');
                consoleStyleElement.id = 'console-custom-styles';
                document.head.appendChild(consoleStyleElement);
            }
            if (settings.consoleFontSize || settings.consoleFontFamily) {
                let css = '.print-output-content, .console-output {';
                if (settings.consoleFontSize) {
                    css += `font-size: ${settings.consoleFontSize}px !important;`;
                }
                if (settings.consoleFontFamily) {
                    css += `font-family: ${settings.consoleFontFamily} !important;`;
                }
                css += '}';
                consoleStyleElement.textContent = css;
                console.log('Created custom CSS:', css);
            }
            // Method 3: Direct styling as backup - try both old and new selectors
            let consoleOutput = document.querySelector('.print-output-content');
            if (!consoleOutput) {
                consoleOutput = document.querySelector('.console-output');
            }
            if (consoleOutput) {
                console.log('Console output element found:', !!consoleOutput);
                if (settings.consoleFontSize) {
                    consoleOutput.style.setProperty('font-size', `${settings.consoleFontSize}px`, 'important');
                    console.log('Applied console font size:', settings.consoleFontSize);
                }
                if (settings.consoleFontFamily) {
                    consoleOutput.style.setProperty('font-family', settings.consoleFontFamily, 'important');
                    console.log('Applied console font family:', settings.consoleFontFamily);
                }
            }
            else {
                console.log('Console output element not found - skipping direct styling');
            }
        };
        applyConsoleFontSettings();
        // Set global variables for other parts of the app
        window.autoSaveEnabled = settings.autoSave;
        window.maxConsoleMessages = settings.maxMessages;
        window.autoScrollEnabled = settings.autoScroll;
        window.showTimestamps = settings.showTimestamps;
        // Toggle hardware acceleration based on settings
        toggleHardwareAcceleration();
        // Monitor performance periodically
        setInterval(monitorPerformance, 30000); // Every 30 seconds
        window.showIcons = settings.showIcons;
        window.maxTabs = settings.maxTabs;
        window.autoCloseTabs = settings.autoCloseTabs;
        window.debugMode = settings.debugMode;
        window.showPerformance = settings.showPerformance;
        // Start auto save if enabled
        if (settings.autoSave) {
            startAutoSave();
        }
        // Apply debug mode and performance stats
        toggleDebugMode(settings.debugMode);
        applyPerformanceStats(settings.showPerformance);
        // Apply editor settings only during initial load
        if (!window.editorSettingsApplied) {
            applyEditorSettings(settings);
            window.editorSettingsApplied = true;
        }
        // Note: UI visibility settings are now handled separately
        // to avoid conflicts with immediate settings changes
    }
    function showSettingsNotification(message) {
        // Create a simple notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-500);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            font-size: 14px;
            font-weight: 500;
            animation: slideInRight 0.3s ease-out;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    // Debounced editor settings update
    let editorSettingsTimeout = null;
    function applyEditorSettings(settings) {
        // Clear any pending update
        if (editorSettingsTimeout) {
            clearTimeout(editorSettingsTimeout);
        }
        // Debounce the update to prevent rapid changes
        editorSettingsTimeout = setTimeout(() => {
            applyEditorSettingsImmediate(settings);
        }, 100);
    }
    function applyEditorSettingsImmediate(settings) {
        // Apply editor settings when editor is ready
        const applyWhenReady = () => {
            if (window.editor && typeof window.editor.updateOptions === 'function') {
                try {
                    // Check if editor is in a stable state
                    const editor = window.editor;
                    if (!editor.getModel() || !editor.getDomNode()) {
                        console.warn('Editor not in stable state, retrying...');
                        setTimeout(applyWhenReady, 100);
                        return;
                    }
                    // Only apply valid editor options
                    const editorOptions = {};
                    if (settings.wordWrap !== undefined) {
                        editorOptions.wordWrap = settings.wordWrap ? 'on' : 'off';
                    }
                    if (settings.minimap !== undefined) {
                        editorOptions.minimap = { enabled: settings.minimap };
                    }
                    if (settings.tabSize !== undefined) {
                        const tabSize = parseInt(settings.tabSize);
                        if (!isNaN(tabSize) && tabSize > 0) {
                            editorOptions.tabSize = tabSize;
                        }
                    }
                    if (settings.fontSize !== undefined) {
                        const fontSize = parseInt(settings.fontSize);
                        if (!isNaN(fontSize) && fontSize > 0) {
                            editorOptions.fontSize = fontSize;
                        }
                    }
                    if (settings.fontFamily !== undefined) {
                        editorOptions.fontFamily = settings.fontFamily;
                    }
                    if (settings.lineHeight !== undefined) {
                        const lineHeight = parseFloat(settings.lineHeight);
                        if (!isNaN(lineHeight) && lineHeight > 0) {
                            editorOptions.lineHeight = lineHeight;
                        }
                    }
                    if (settings.lineNumbers !== undefined) {
                        editorOptions.lineNumbers = settings.lineNumbers ? 'on' : 'off';
                    }
                    if (settings.autoComplete !== undefined) {
                        editorOptions.quickSuggestions = {
                            other: settings.autoComplete,
                            comments: false,
                            strings: false
                        };
                    }
                    // Only update if we have valid options
                    if (Object.keys(editorOptions).length > 0) {
                        console.log('Applying editor settings:', editorOptions);
                        editor.updateOptions(editorOptions);
                        // Force a layout update after a short delay to ensure the editor is stable
                        setTimeout(() => {
                            try {
                                if (editor && editor.layout) {
                                    editor.layout();
                                }
                            }
                            catch (layoutError) {
                                console.warn('Layout update failed:', layoutError);
                            }
                        }, 100);
                    }
                }
                catch (error) {
                    console.error('Error applying editor settings:', error);
                }
            }
            else {
                // Retry after a short delay if editor is not ready
                setTimeout(applyWhenReady, 100);
            }
        };
        applyWhenReady();
    }
    function applyUIVisibilitySettings(settings) {
        console.log('=== APPLYING UI VISIBILITY SETTINGS ===');
        console.log('Settings object:', settings);
        console.log('showFileActions:', settings.showFileActions);
        console.log('showRunButton:', settings.showRunButton);
        // Top Navigation - File Actions
        const fileActions = document.querySelector('.file-actions');
        console.log('File actions element found:', !!fileActions);
        if (fileActions) {
            fileActions.style.display = settings.showFileActions ? 'flex' : 'none';
            console.log('File actions visibility set to:', fileActions.style.display);
        }
        // Run and Stop buttons
        const runButton = document.getElementById('btnRun');
        const stopButton = document.getElementById('btnStop');
        console.log('Run button element found:', !!runButton);
        console.log('Stop button element found:', !!stopButton);
        if (runButton) {
            console.log('Run button before change:');
            console.log('- Computed style display:', window.getComputedStyle(runButton).display);
            console.log('- Inline style display:', runButton.style.display);
            console.log('- Visible:', runButton.offsetParent !== null);
            if (settings.showRunButton) {
                runButton.style.display = 'flex';
                runButton.style.visibility = 'visible';
                runButton.style.opacity = '1';
            }
            else {
                runButton.style.display = 'none';
                runButton.style.visibility = 'hidden';
                runButton.style.opacity = '0';
            }
            console.log('Run button visibility set to:', runButton.style.display);
            console.log('Run button after change:');
            console.log('- Computed style display:', window.getComputedStyle(runButton).display);
            console.log('- Inline style display:', runButton.style.display);
            console.log('- Visible:', runButton.offsetParent !== null);
            console.log('- Element visible in viewport:', runButton.offsetWidth > 0 && runButton.offsetHeight > 0);
        }
        if (stopButton) {
            stopButton.style.display = settings.showRunButton ? 'flex' : 'none';
            console.log('Stop button visibility set to:', stopButton.style.display);
        }
        // Theme toggle button
        const themeToggle = document.getElementById('btnThemeToggle');
        if (themeToggle) {
            themeToggle.style.display = settings.showThemeToggle ? 'flex' : 'none';
            console.log('Theme toggle visibility:', settings.showThemeToggle);
        }
        // Layout toggle button
        const layoutToggle = document.getElementById('layoutToggle');
        if (layoutToggle) {
            layoutToggle.style.display = settings.showLayoutToggle ? 'flex' : 'none';
            console.log('Layout toggle visibility:', settings.showLayoutToggle);
        }
        // Settings button
        const settingsButton = document.getElementById('btnSettings');
        if (settingsButton) {
            settingsButton.style.display = settings.showSettingsButton ? 'flex' : 'none';
            console.log('Settings button visibility:', settings.showSettingsButton);
        }
        // Editor Controls
        const editorActions = document.querySelector('.editor-actions');
        if (editorActions) {
            editorActions.style.display = settings.showEditorActions ? 'flex' : 'none';
            console.log('Editor actions visibility:', settings.showEditorActions);
        }
        const editorTitle = document.querySelector('.editor-title');
        if (editorTitle) {
            editorTitle.style.display = settings.showEditorTitle ? 'flex' : 'none';
            console.log('Editor title visibility:', settings.showEditorTitle);
        }
        // Console Controls
        const consoleControls = document.querySelector('.console-controls');
        if (consoleControls) {
            consoleControls.style.display = settings.showConsoleActions ? 'flex' : 'none';
            console.log('Console controls visibility:', settings.showConsoleActions);
        }
        const consoleStats = document.querySelector('.console-stats');
        if (consoleStats) {
            consoleStats.style.display = settings.showConsoleStats ? 'flex' : 'none';
            console.log('Console stats visibility:', settings.showConsoleStats);
        }
        const consoleTitle = document.querySelector('.console-title');
        if (consoleTitle) {
            consoleTitle.style.display = settings.showConsoleTitle ? 'flex' : 'none';
            console.log('Console title visibility:', settings.showConsoleTitle);
        }
        // Tab Controls
        const tabCounter = document.getElementById('tabCounter');
        if (tabCounter) {
            tabCounter.style.display = settings.showTabCounter ? 'block' : 'none';
            console.log('Tab counter visibility:', settings.showTabCounter);
        }
        const newTabButton = document.getElementById('btnNewTab');
        if (newTabButton) {
            newTabButton.style.display = settings.showNewTabButton ? 'flex' : 'none';
            console.log('New tab button visibility:', settings.showNewTabButton);
        }
        // Additional UI elements that might exist
        const formatButton = document.getElementById('btnFormat');
        if (formatButton) {
            formatButton.style.display = settings.showEditorActions ? 'flex' : 'none';
        }
        const clearButton = document.getElementById('btnClear');
        if (clearButton) {
            clearButton.style.display = settings.showConsoleActions ? 'flex' : 'none';
        }
        const copyButton = document.getElementById('btnCopy');
        if (copyButton) {
            copyButton.style.display = settings.showConsoleActions ? 'flex' : 'none';
        }
        const saveButton = document.getElementById('btnSave');
        if (saveButton) {
            saveButton.style.display = settings.showFileActions ? 'flex' : 'none';
        }
        const openButton = document.getElementById('btnOpen');
        if (openButton) {
            openButton.style.display = settings.showFileActions ? 'flex' : 'none';
        }
        const newButton = document.getElementById('btnNew');
        if (newButton) {
            newButton.style.display = settings.showFileActions ? 'flex' : 'none';
        }
    }
    // Quick actions system
    function setupQuickActions() {
        // Add right-click context menu for editor
        const editorContainer = document.querySelector('.editor-container');
        if (editorContainer) {
            editorContainer.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                showEditorContextMenu(e);
            });
        }
        // Note: Removed auto-selection functionality as it was interfering with normal typing
    }
    function showEditorContextMenu(e) {
        // Remove existing context menu
        const existingMenu = document.getElementById('editor-context-menu');
        if (existingMenu) {
            existingMenu.remove();
        }
        const menu = document.createElement('div');
        menu.id = 'editor-context-menu';
        menu.className = 'context-menu';
        menu.innerHTML = `
            <div class="context-menu-item" data-action="cut">
                <i class="ri-scissors-line"></i>
                <span>Cut</span>
                <span class="shortcut">Ctrl+X</span>
            </div>
            <div class="context-menu-item" data-action="copy">
                <i class="ri-file-copy-line"></i>
                <span>Copy</span>
                <span class="shortcut">Ctrl+C</span>
            </div>
            <div class="context-menu-item" data-action="paste">
                <i class="ri-clipboard-line"></i>
                <span>Paste</span>
                <span class="shortcut">Ctrl+V</span>
            </div>
            <div class="context-menu-separator"></div>
            <div class="context-menu-item" data-action="run">
                <i class="ri-play-line"></i>
                <span>Run Code</span>
                <span class="shortcut">F5</span>
            </div>
        `;
        // Position menu
        menu.style.position = 'fixed';
        menu.style.left = `${e.clientX}px`;
        menu.style.top = `${e.clientY}px`;
        menu.style.zIndex = '10000';
        document.body.appendChild(menu);
        // Handle menu actions
        menu.addEventListener('click', (e) => {
            const action = e.target.closest('.context-menu-item')?.getAttribute('data-action');
            if (action) {
                handleEditorContextAction(action);
                menu.remove();
            }
        });
        // Close menu on outside click
        setTimeout(() => {
            document.addEventListener('click', () => {
                menu.remove();
            }, { once: true });
        }, 100);
    }
    function handleEditorContextAction(action) {
        if (!window.editor)
            return;
        // Use manual implementation directly since Monaco commands are not available
        switch (action) {
            case 'cut':
                handleClipboardActionFallback('cut');
                break;
            case 'copy':
                handleClipboardActionFallback('copy');
                break;
            case 'paste':
                handleClipboardActionFallback('paste');
                break;
            case 'run':
                // Trigger the run button click
                const runButton = document.getElementById('btnRun');
                if (runButton && !runButton.disabled) {
                    runButton.click();
                }
                break;
        }
    }
    // Fallback clipboard actions for app.ts context menu
    function handleClipboardActionFallback(action) {
        if (!window.editor)
            return;
        const selection = window.editor.getSelection();
        if (!selection)
            return;
        const model = window.editor.getModel();
        if (!model)
            return;
        try {
            switch (action) {
                case 'cut':
                    if (!selection.isEmpty()) {
                        const selectedText = model.getValueInRange(selection);
                        navigator.clipboard.writeText(selectedText).then(() => {
                            window.editor.executeEdits('cut', [{
                                    range: selection,
                                    text: ''
                                }]);
                        });
                    }
                    break;
                case 'copy':
                    if (!selection.isEmpty()) {
                        const selectedText = model.getValueInRange(selection);
                        navigator.clipboard.writeText(selectedText);
                    }
                    break;
                case 'paste':
                    navigator.clipboard.readText().then(text => {
                        window.editor.executeEdits('paste', [{
                                range: selection,
                                text: text
                            }]);
                    });
                    break;
            }
        }
        catch (error) {
            console.error('Clipboard action fallback failed:', action, error);
        }
    }
    let isContentBeingAdded = false;
    let isInLoopContext = false;
    let loopScrollTimeout = null;
    function setupAutoScrollObserver() {
        if (!outputConsole || !consoleContent || mutationObserver)
            return;
        mutationObserver = new MutationObserver((mutations) => {
            console.log('MutationObserver triggered, autoScrollEnabled:', autoScrollEnabled);
            if (!autoScrollEnabled) {
                console.log('Auto scroll disabled, skipping scroll');
                return;
            }
            let shouldScroll = false;
            let isPrintStatement = false;
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldScroll = true;
                    // Check if this is a print statement (loop context detection)
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const element = node;
                            if (element.classList.contains('console-print') ||
                                element.classList.contains('console-info') ||
                                element.classList.contains('console-success')) {
                                isPrintStatement = true;
                            }
                        }
                    });
                }
            });
            if (shouldScroll) {
                // Mark that content is being added
                isContentBeingAdded = true;
                // If this is a print statement, enable immediate loop scrolling
                if (isPrintStatement) {
                    isInLoopContext = true;
                    // Clear any existing loop timeout
                    if (loopScrollTimeout) {
                        clearTimeout(loopScrollTimeout);
                    }
                    // Set a timeout to detect when loop context ends
                    loopScrollTimeout = window.setTimeout(() => {
                        isInLoopContext = false;
                        console.log('Loop context ended - switching back to debounced scroll');
                    }, 200); // If no print statements for 200ms, assume loop ended
                    // Immediate scroll for loop context
                    console.log('Loop context detected - immediate scroll');
                    performImmediateScroll();
                }
                else {
                    // Regular debounced scrolling for non-loop content
                    if (scrollTimeout) {
                        clearTimeout(scrollTimeout);
                    }
                    scrollTimeout = window.setTimeout(() => {
                        isContentBeingAdded = false;
                        performDebouncedScroll();
                    }, 100);
                }
            }
        });
        mutationObserver.observe(outputConsole, {
            childList: true,
            subtree: true
        });
    }
    // Debounced scroll function that waits for content addition to complete
    function performDebouncedScroll() {
        if (!autoScrollEnabled)
            return;
        console.log('Performing debounced scroll - content addition has stopped');
        // Use the enhanced scroll function for better handling of long content
        scrollToVeryBottom();
        // Also use the original function as backup
        setTimeout(() => {
            scrollOutputToBottom();
        }, 50);
        // Final attempt with last element scroll
        setTimeout(() => {
            scrollLastElementIntoView();
        }, 150);
    }
    // Force immediate scroll (for cases where we need immediate feedback)
    function forceImmediateScroll() {
        if (!autoScrollEnabled)
            return;
        console.log('Forcing immediate scroll');
        // Clear any pending debounced scroll
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
            scrollTimeout = null;
        }
        // Perform immediate scroll
        scrollToVeryBottom();
    }
    // Immediate scroll for loop context (no debouncing)
    function performImmediateScroll() {
        if (!autoScrollEnabled)
            return;
        console.log('Performing immediate scroll for loop context');
        // Try multiple potential scrollable elements
        const scrollableElements = [
            consoleContent,
            outputConsole,
            document.querySelector('.console-container'),
            document.querySelector('.main-content')
        ].filter(el => el !== null);
        scrollableElements.forEach((element, index) => {
            if (!element)
                return;
            const scrollHeight = element.scrollHeight;
            const clientHeight = element.clientHeight;
            const maxScroll = scrollHeight - clientHeight;
            // Only scroll if this element can actually scroll
            if (scrollHeight > clientHeight) {
                // Immediate scroll to bottom
                element.scrollTop = maxScroll;
                // Quick follow-up to handle any content growth
                setTimeout(() => {
                    const newScrollHeight = element.scrollHeight;
                    const newClientHeight = element.clientHeight;
                    const newMaxScroll = newScrollHeight - newClientHeight;
                    if (newScrollHeight > scrollHeight) {
                        element.scrollTop = newMaxScroll;
                    }
                }, 10); // Very short delay for immediate feedback
            }
        });
    }
    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, c => {
            const escapeMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
            return escapeMap[c] || c;
        });
    }
    // Function to scroll output console to bottom
    function scrollOutputToBottom() {
        if (!autoScrollEnabled) {
            console.log('Auto scroll disabled, skipping scrollOutputToBottom');
            return;
        }
        if (!consoleContent) {
            console.warn('Console content element not found');
            return;
        }
        // Enhanced scrolling function that ensures we reach the absolute bottom
        const scrollToAbsoluteBottom = () => {
            // Get the actual scrollable height
            const scrollHeight = consoleContent.scrollHeight;
            const clientHeight = consoleContent.clientHeight;
            const maxScroll = scrollHeight - clientHeight;
            console.log('Scroll details:', {
                scrollHeight,
                clientHeight,
                maxScroll,
                currentScrollTop: consoleContent.scrollTop
            });
            // Method 1: Use scrollTo with exact positioning
            try {
                consoleContent.scrollTo({
                    top: scrollHeight,
                    behavior: 'smooth'
                });
            }
            catch (e) {
                // Fallback: direct assignment
                consoleContent.scrollTop = scrollHeight;
            }
            // Method 2: Force scroll to absolute bottom with multiple attempts
            setTimeout(() => {
                consoleContent.scrollTop = scrollHeight;
                // Add extra padding to ensure we're at the very bottom
                consoleContent.scrollTop = consoleContent.scrollHeight + 100;
                // Then set to exact bottom
                consoleContent.scrollTop = consoleContent.scrollHeight;
            }, 10);
            // Method 3: Final verification and correction
            setTimeout(() => {
                const finalScrollTop = consoleContent.scrollTop;
                const finalScrollHeight = consoleContent.scrollHeight;
                const finalClientHeight = consoleContent.clientHeight;
                const shouldBeAt = finalScrollHeight - finalClientHeight;
                console.log('Final scroll check:', {
                    current: finalScrollTop,
                    shouldBe: shouldBeAt,
                    difference: Math.abs(finalScrollTop - shouldBeAt)
                });
                // If we're not at the bottom, force it
                if (Math.abs(finalScrollTop - shouldBeAt) > 1) {
                    consoleContent.scrollTop = finalScrollHeight;
                    console.log('Corrected scroll position');
                }
            }, 50);
        };
        // Use multiple timing approaches to ensure scrolling works
        requestAnimationFrame(() => {
            scrollToAbsoluteBottom();
            // Additional attempts with different timings
            setTimeout(scrollToAbsoluteBottom, 20);
            setTimeout(scrollToAbsoluteBottom, 100);
            setTimeout(scrollToAbsoluteBottom, 200);
        });
    }
    // Enhanced function to scroll to the very bottom with better handling of long content
    function scrollToVeryBottom() {
        if (!autoScrollEnabled) {
            console.log('Auto scroll disabled, skipping scrollToVeryBottom');
            return;
        }
        // Try multiple potential scrollable elements
        const scrollableElements = [
            consoleContent,
            outputConsole,
            document.querySelector('.console-container'),
            document.querySelector('.main-content')
        ].filter(el => el !== null);
        console.log('Attempting to scroll with elements:', scrollableElements.map(el => el?.className || el?.id));
        // Wait for the next frame to ensure DOM is fully updated
        requestAnimationFrame(() => {
            scrollableElements.forEach((element, index) => {
                if (!element)
                    return;
                const scrollHeight = element.scrollHeight;
                const clientHeight = element.clientHeight;
                const maxScroll = scrollHeight - clientHeight;
                console.log(`Element ${index} (${element.className || element.id}):`, {
                    scrollHeight,
                    clientHeight,
                    maxScroll,
                    currentScrollTop: element.scrollTop,
                    canScroll: scrollHeight > clientHeight
                });
                // Only scroll if this element can actually scroll
                if (scrollHeight > clientHeight) {
                    // First attempt: scroll to calculated bottom
                    element.scrollTop = maxScroll;
                    // Wait a bit and check if content has grown
                    setTimeout(() => {
                        const newScrollHeight = element.scrollHeight;
                        const newClientHeight = element.clientHeight;
                        const newMaxScroll = newScrollHeight - newClientHeight;
                        console.log(`Element ${index} second attempt:`, {
                            newScrollHeight,
                            newClientHeight,
                            newMaxScroll,
                            currentScrollTop: element.scrollTop
                        });
                        // If content has grown, scroll to the new bottom
                        if (newScrollHeight > scrollHeight) {
                            element.scrollTop = newMaxScroll;
                            console.log(`Element ${index} content grew, scrolled to new bottom`);
                        }
                        // Final verification after a longer delay
                        setTimeout(() => {
                            const finalScrollHeight = element.scrollHeight;
                            const finalClientHeight = element.clientHeight;
                            const finalMaxScroll = finalScrollHeight - finalClientHeight;
                            const currentScrollTop = element.scrollTop;
                            console.log(`Element ${index} final verification:`, {
                                finalScrollHeight,
                                finalClientHeight,
                                finalMaxScroll,
                                currentScrollTop,
                                isAtBottom: Math.abs(currentScrollTop - finalMaxScroll) <= 1
                            });
                            // Force scroll to absolute bottom if not already there
                            if (Math.abs(currentScrollTop - finalMaxScroll) > 1) {
                                element.scrollTop = finalScrollHeight;
                                console.log(`Element ${index} forced scroll to absolute bottom`);
                            }
                        }, 100);
                    }, 50);
                }
            });
        });
    }
    // Function to scroll the last element into view
    function scrollLastElementIntoView() {
        if (!autoScrollEnabled) {
            console.log('Auto scroll disabled, skipping scrollLastElementIntoView');
            return;
        }
        if (!outputConsole || !consoleContent)
            return;
        // Find the last child element
        const children = outputConsole.children;
        if (children.length > 0) {
            const lastElement = children[children.length - 1];
            console.log('Scrolling last element into view:', lastElement);
            try {
                // Use scrollIntoView to ensure the last element is visible
                lastElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'end',
                    inline: 'nearest'
                });
            }
            catch (e) {
                // Fallback: manually calculate and scroll
                const elementRect = lastElement.getBoundingClientRect();
                const containerRect = consoleContent.getBoundingClientRect();
                const relativeTop = elementRect.top - containerRect.top + consoleContent.scrollTop;
                consoleContent.scrollTo({
                    top: relativeTop,
                    behavior: 'smooth'
                });
            }
        }
    }
    // out: by default include timestamp; for type 'stdout' and 'print' show raw text only
    function out(text, type = 'info') {
        if (!outputConsole)
            return;
        if (type === 'stdout' || type === 'print') {
            // Don't escape HTML for print output since we want to add HTML tags
            const safe = String(text);
            // Remove welcome message if it exists
            const welcomeMessage = outputConsole.querySelector('.console-welcome');
            if (welcomeMessage) {
                welcomeMessage.remove();
            }
            // The print-output-container is now the main container, so we just need to get the content area
            let printContent = outputConsole.querySelector('.print-output-content');
            if (!printContent) {
                // If no content area exists, create it
                printContent = document.createElement('div');
                printContent.className = 'print-output-content';
                outputConsole.appendChild(printContent);
            }
            const line = document.createElement('div');
            line.className = 'print-output-line';
            // Apply current font size setting
            const settings = loadSettings();
            if (settings.consoleFontSize) {
                line.style.fontSize = `${settings.consoleFontSize}px`;
            }
            // Add line number
            const lineCount = printContent.children.length + 1;
            line.setAttribute('data-line-number', lineCount.toString());
            // Use textContent to avoid any HTML processing
            line.textContent = safe;
            printContent.appendChild(line);
            updateConsoleStats('info');
            // Performance optimization: batch DOM updates
            if (consoleMessageCount % 10 === 0) {
                // Clean up old messages every 10 new messages
                cleanupOldMessages();
            }
            // Add animation only for recent messages
            if (consoleMessageCount < 50) {
                requestAnimationFrame(() => {
                    line.style.opacity = '1';
                    line.style.transform = 'translateY(0)';
                });
            }
            // Update side-by-side console if in side-by-side layout
            if (!isTabLayout) {
                updateSideBySideConsole();
            }
        }
        else {
            // Escape HTML for other message types
            const safe = escapeHtml(String(text));
            // Use the enhanced console message system
            addConsoleMessage(safe, type);
        }
        // Auto-scroll to bottom after adding new content
        // Use multiple approaches to ensure scrolling works
        setTimeout(() => {
            scrollOutputToBottom();
            // Also try scrolling the last element into view
            scrollLastElementIntoView();
        }, 0);
        // Also scroll immediately
        scrollOutputToBottom();
    }
    if (clearButton)
        clearButton.addEventListener('click', clearConsole);
    // Console toggle functionality removed - now using tab-based layout
    // Initialize side-by-side editor
    function initializeSideBySideEditor() {
        const editorSide = document.getElementById('editorSide');
        if (!editorSide || window.sideBySideEditor)
            return; // Already initialized
        try {
            // Create Monaco editor for side-by-side layout
            window.sideBySideEditor = window.monaco.editor.create(editorSide, {
                value: window.editor ? window.editor.getValue() : '',
                language: 'pseudocode',
                theme: document.documentElement.classList.contains('theme-dark') ? 'vs-dark' : 'vs',
                fontSize: 14,
                lineNumbers: 'on',
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                wordWrap: 'off',
                tabSize: 4,
                insertSpaces: true,
                renderWhitespace: 'selection',
                cursorBlinking: 'blink',
                cursorSmoothCaretAnimation: 'on',
                smoothScrolling: true,
                mouseWheelZoom: true,
                contextmenu: true,
                selectOnLineNumbers: true,
                roundedSelection: false,
                readOnly: false,
                scrollbar: {
                    alwaysConsumeMouseWheel: true,
                    vertical: 'auto',
                    horizontal: 'auto'
                }
            });
            // Sync content between main editor and side-by-side editor
            if (window.editor) {
                // Copy content from main editor to side-by-side editor
                window.sideBySideEditor.setValue(window.editor.getValue());
                // Set up bidirectional sync
                window.editor.onDidChangeModelContent(() => {
                    if (window.sideBySideEditor && !window.syncingEditors) {
                        window.syncingEditors = true;
                        window.sideBySideEditor.setValue(window.editor.getValue());
                        setTimeout(() => { window.syncingEditors = false; }, 100);
                    }
                });
                window.sideBySideEditor.onDidChangeModelContent(() => {
                    if (window.editor && !window.syncingEditors) {
                        window.syncingEditors = true;
                        window.editor.setValue(window.sideBySideEditor.getValue());
                        setTimeout(() => { window.syncingEditors = false; }, 100);
                    }
                });
            }
            // Set up side-by-side editor actions
            setupSideBySideEditorActions();
        }
        catch (error) {
            console.error('Error initializing side-by-side editor:', error);
        }
    }
    // Setup side-by-side editor actions
    function setupSideBySideEditorActions() {
        // Format button
        const formatButtonSide = document.getElementById('btnFormatSide');
        if (formatButtonSide) {
            formatButtonSide.addEventListener('click', () => {
                if (window.sideBySideEditor) {
                    // Temporarily switch to side-by-side editor for formatting
                    const originalEditor = window.editor;
                    window.editor = window.sideBySideEditor;
                    formatPseudocode();
                    window.editor = originalEditor;
                }
            });
        }
        // Minimap button
        const minimapButtonSide = document.getElementById('btnMinimapSide');
        if (minimapButtonSide) {
            minimapButtonSide.addEventListener('click', () => {
                if (window.sideBySideEditor) {
                    try {
                        const currentMinimap = window.sideBySideEditor.getOption(window.monaco.editor.EditorOption.minimap);
                        const newValue = !currentMinimap.enabled;
                        window.sideBySideEditor.updateOptions({ minimap: { enabled: newValue } });
                        minimapButtonSide.classList.toggle('active', newValue);
                        addSystemMessage(`Minimap ${newValue ? 'enabled' : 'disabled'}`);
                        // Save the setting
                        saveSetting('minimap', newValue);
                    }
                    catch (error) {
                        console.error('Error toggling side-by-side minimap:', error);
                        // Fallback approach
                        const currentMinimap = window.sideBySideEditor.getOption('minimap');
                        const newValue = !currentMinimap.enabled;
                        window.sideBySideEditor.updateOptions({ minimap: { enabled: newValue } });
                        minimapButtonSide.classList.toggle('active', newValue);
                        addSystemMessage(`Minimap ${newValue ? 'enabled' : 'disabled'}`);
                        // Save the setting
                        saveSetting('minimap', newValue);
                    }
                }
            });
        }
        // Word wrap button
        const wordWrapButtonSide = document.getElementById('btnWordWrapSide');
        if (wordWrapButtonSide) {
            wordWrapButtonSide.addEventListener('click', () => {
                if (window.sideBySideEditor) {
                    const currentWrap = window.sideBySideEditor.getOption(window.monaco.editor.EditorOption.wordWrap);
                    window.sideBySideEditor.updateOptions({ wordWrap: currentWrap === 'off' ? 'on' : 'off' });
                }
            });
        }
        // Console actions for side-by-side layout
        const clearConsoleSide = document.getElementById('clearConsoleSide');
        if (clearConsoleSide) {
            clearConsoleSide.addEventListener('click', () => {
                clearConsole();
                // Side-by-side console will update automatically via updateSideBySideConsole()
            });
        }
        const copyOutputSide = document.getElementById('btnCopyOutputSide');
        if (copyOutputSide) {
            copyOutputSide.addEventListener('click', copyConsoleOutput);
        }
        const saveOutputSide = document.getElementById('btnSaveOutputSide');
        if (saveOutputSide) {
            saveOutputSide.addEventListener('click', saveConsoleOutput);
        }
    }
    // Console functions now work with tab-specific consoles
    // Each tab maintains its own console state
    // Console functions are now tab-specific - no sharing between layouts
    // Update side-by-side console with current tab's console content
    function updateSideBySideConsole() {
        const outputSide = document.getElementById('outputSide');
        if (outputSide && outputConsole) {
            outputSide.innerHTML = outputConsole.innerHTML;
        }
        // Update side-by-side console stats
        const messageCountSide = document.getElementById('messageCountSide');
        const executionTimeSide = document.getElementById('executionTimeSide');
        const consoleStatusSide = document.getElementById('consoleStatusSide');
        if (messageCountSide) {
            messageCountSide.textContent = consoleStats.messages.toString();
        }
        if (executionTimeSide) {
            executionTimeSide.textContent = consoleStats.executionTime ? `${consoleStats.executionTime}ms` : '0ms';
        }
        if (consoleStatusSide) {
            const statusBadge = consoleStatusSide.querySelector('#consoleStatusBadgeSide');
            if (statusBadge) {
                statusBadge.textContent = isExecuting ? 'Running' : 'Ready';
                statusBadge.className = `badge ${isExecuting ? 'badge-running' : 'badge-ready'}`;
            }
        }
    }
    // Focus console function
    function focusConsole() {
        // Switch to console tab if in tab layout
        if (isTabLayout) {
        const consoleTab = document.getElementById('consoleTab');
        const editorTab = document.getElementById('editorTab');
        const consoleContent = document.getElementById('consoleContent');
        const editorContent = document.getElementById('editorContent');
        if (consoleTab && editorTab && consoleContent && editorContent) {
            // Remove active class from all tab nav items and panels
            document.querySelectorAll('.tab-nav-item').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
            
            // Add active class to console tab and panel
            consoleTab.classList.add('active');
            consoleContent.classList.add('active');
            
            // Hide console badge
            const consoleBadge = document.getElementById('consoleBadge');
            if (consoleBadge) {
                consoleBadge.style.display = 'none';
            }
        }
        }
        // Scroll to bottom of console
        scrollOutputToBottom();
    }
    // Enhanced console functionality
    function clearConsole() {
        if (!outputConsole)
            return;
        // Clear the print-output-content area
        const printContent = outputConsole.querySelector('.print-output-content');
        if (printContent) {
            const welcomeMessage = `
                <div class="console-welcome">
                    <div class="welcome-icon">
                        <i class="ri-code-s-slash-line"></i>
                    </div>
                    <div class="welcome-content">
                        <h4>Welcome to iPseudo IDE</h4>
                        <p>Ready to execute your pseudocode. Click "Run" to start!</p>
                    </div>
                </div>
            `;
            printContent.innerHTML = welcomeMessage;
        }
        else {
            // Fallback if structure is different
            const welcomeMessage = `
                <div class="console-welcome">
                    <div class="welcome-icon">
                        <i class="ri-code-s-slash-line"></i>
                    </div>
                    <div class="welcome-content">
                        <h4>Welcome to iPseudo IDE</h4>
                        <p>Ready to execute your pseudocode. Click "Run" to start!</p>
                    </div>
                </div>
            `;
            outputConsole.innerHTML = welcomeMessage;
        }
        consoleMessageCount = 0;
        consoleStats = { messages: 0, errors: 0, warnings: 0, info: 0, executionTime: 0 };
        // Reset execution state if not currently executing
        if (!isExecuting) {
            isExecuting = false;
            executionStopped = false;
        }
        // Update tab-specific data
        updateTabConsoleStats(consoleStats);
        updateTabConsoleOutput(outputConsole.innerHTML);
        updateTabStatus(false, false);
        updateConsoleUI();
        // Update side-by-side console if in side-by-side layout
        if (!isTabLayout) {
            updateSideBySideConsole();
        }
    }
    function addConsoleMessage(message, type = 'info') {
        if (!outputConsole)
            return;
        // Remove welcome message if it exists
        const welcomeMessage = outputConsole.querySelector('.console-welcome');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }
        const messageElement = document.createElement('div');
        messageElement.className = `console-message console-${type}`;
        // Apply current font size setting
        const settings = loadSettings();
        if (settings.consoleFontSize) {
            messageElement.style.fontSize = `${settings.consoleFontSize}px`;
        }
        const icon = getMessageIcon(type);
        const showTimestamps = window.showTimestamps !== false;
        const timestamp = showTimestamps ? new Date().toLocaleTimeString() : '';
        // Enhanced message formatting with syntax highlighting
        const formattedMessage = formatConsoleMessage(message, type);
        messageElement.innerHTML = `
            <i class="${icon}"></i>
            <span class="message-content">
                <span class="message-text">${formattedMessage}</span>
                ${showTimestamps ? `<span class="message-timestamp">${timestamp}</span>` : ''}
            </span>
        `;
        // Add message with animation
        outputConsole.appendChild(messageElement);
        // Trigger animation
        requestAnimationFrame(() => {
            messageElement.style.opacity = '1';
            messageElement.style.transform = 'translateY(0)';
        });
        updateConsoleStats(type);
        updateTabConsoleStats(consoleStats);
        updateTabConsoleOutput(outputConsole.innerHTML);
        updateConsoleUI();
        scrollOutputToBottom();
        // Update side-by-side console if in side-by-side layout
        if (!isTabLayout) {
            updateSideBySideConsole();
        }
        // Show badge on console tab if console is not active
        const consoleTab = document.getElementById('consoleTab');
        const consoleBadge = document.getElementById('consoleBadge');
        const consoleTabContent = document.getElementById('consoleContent');
        if (consoleTab && consoleBadge && consoleTabContent && !consoleTabContent.classList.contains('active')) {
            consoleBadge.style.display = 'flex';
            const currentCount = parseInt(consoleBadge.textContent || '0');
            consoleBadge.textContent = (currentCount + 1).toString();
        }
    }
    function getMessageIcon(type) {
        const icons = {
            success: 'ri-check-line',
            error: 'ri-error-warning-line',
            warning: 'ri-alert-line',
            info: 'ri-information-line',
            debug: 'ri-bug-line',
            system: 'ri-settings-3-line'
        };
        return icons[type] || 'ri-information-line';
    }
    function formatConsoleMessage(message, type) {
        // Escape HTML first
        let formatted = escapeHtml(message);
        // Apply syntax highlighting based on message type
        switch (type) {
            case 'error':
                // Highlight error patterns
                formatted = formatted
                    .replace(/(Error|Exception|Failed|Cannot|Unable)/gi, '<span class="error-keyword">$1</span>')
                    .replace(/(at line \d+|line \d+)/gi, '<span class="error-location">$1</span>')
                    .replace(/(\d+)/g, '<span class="error-number">$1</span>');
                break;
            case 'warning':
                // Highlight warning patterns
                formatted = formatted
                    .replace(/(Warning|Caution|Deprecated|Notice)/gi, '<span class="warning-keyword">$1</span>')
                    .replace(/(\d+)/g, '<span class="warning-number">$1</span>');
                break;
            case 'success':
                // Highlight success patterns
                formatted = formatted
                    .replace(/(Success|Completed|Done|Finished)/gi, '<span class="success-keyword">$1</span>')
                    .replace(/(\d+)/g, '<span class="success-number">$1</span>');
                break;
            case 'info':
                // Highlight info patterns
                formatted = formatted
                    .replace(/(Info|Information|Note|Tip)/gi, '<span class="info-keyword">$1</span>')
                    .replace(/(\d+)/g, '<span class="info-number">$1</span>');
                break;
            case 'debug':
                // Highlight debug patterns
                formatted = formatted
                    .replace(/(Debug|Trace|Log)/gi, '<span class="debug-keyword">$1</span>')
                    .replace(/(\d+)/g, '<span class="debug-number">$1</span>');
                break;
        }
        // Highlight common patterns for all types
        formatted = formatted
            .replace(/(https?:\/\/[^\s]+)/g, '<span class="console-url">$1</span>')
            .replace(/(\b[A-Z_][A-Z0-9_]*\b)/g, '<span class="console-constant">$1</span>')
            .replace(/(\b\w+\(\))/g, '<span class="console-function">$1</span>')
            .replace(/(["'][^"']*["'])/g, '<span class="console-string">$1</span>')
            .replace(/(\b\d+\.\d+\b)/g, '<span class="console-number">$1</span>')
            .replace(/(\b\d+\b)/g, '<span class="console-number">$1</span>');
        return formatted;
    }
    function formatPrintOutput(text) {
        // Just return the text as-is, no syntax highlighting
        return text;
    }
    function showConsoleLoadingState() {
        if (!outputConsole)
            return;
        // Remove existing loading state
        const existingLoading = outputConsole.querySelector('.console-loading');
        if (existingLoading)
            return;
        const loadingElement = document.createElement('div');
        loadingElement.className = 'console-loading';
        loadingElement.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner-dot"></div>
                <div class="spinner-dot"></div>
                <div class="spinner-dot"></div>
            </div>
            <span class="loading-text">Executing code...</span>
        `;
        outputConsole.appendChild(loadingElement);
    }
    function hideConsoleLoadingState() {
        if (!outputConsole)
            return;
        const loadingElement = outputConsole.querySelector('.console-loading');
        if (loadingElement) {
            loadingElement.remove();
        }
    }
    function addSystemMessage(message) {
        if (!outputConsole)
            return;
        // Remove welcome message if it exists
        const welcomeMessage = outputConsole.querySelector('.console-welcome');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }
        // Get the print-output-content area
        let printContent = outputConsole.querySelector('.print-output-content');
        if (!printContent) {
            printContent = outputConsole;
        }
        const messageElement = document.createElement('div');
        // Check if it's a Done or Suggestion message for enhanced styling
        if (message === 'Done') {
            messageElement.className = 'done-message';
            messageElement.innerHTML = `
                <i class="ri-check-line done-icon"></i>
                <span class="done-text">${message}</span>
            `;
        }
        else if (message.startsWith('Suggestion:')) {
            messageElement.className = 'suggestion-message';
            const suggestionText = message.replace('Suggestion:', '').trim();
            messageElement.innerHTML = `
                <i class="ri-lightbulb-line suggestion-icon"></i>
                <div class="suggestion-content">
                    <span class="suggestion-label">Suggestion</span>
                    <span class="suggestion-text">${suggestionText}</span>
                </div>
            `;
        }
        else {
            // Default system message styling
            messageElement.className = 'console-message console-system';
            const showTimestamps = window.showTimestamps !== false;
            const timestamp = showTimestamps ? new Date().toLocaleTimeString() : '';
            messageElement.innerHTML = `
                <i class="ri-settings-3-line"></i>
                <span class="message-content">
                    <span class="message-text">${message}</span>
                    ${showTimestamps ? `<span class="message-timestamp">${timestamp}</span>` : ''}
                </span>
            `;
        }
        // Apply current font size setting
        const settings = loadSettings();
        if (settings.consoleFontSize) {
            messageElement.style.fontSize = `${settings.consoleFontSize}px`;
        }
        printContent.appendChild(messageElement);
        updateConsoleStats('info');
        updateTabConsoleStats(consoleStats);
        updateTabConsoleOutput(outputConsole.innerHTML);
        updateConsoleUI();
        scrollOutputToBottom();
        // Update side-by-side console if in side-by-side layout
        if (!isTabLayout) {
            updateSideBySideConsole();
        }
    }
    function updateConsoleStats(type) {
        consoleMessageCount++;
        consoleStats.messages++;
        if (type === 'error')
            consoleStats.errors++;
        else if (type === 'warning')
            consoleStats.warnings++;
        else if (type === 'info')
            consoleStats.info++;
        if (messageCount) {
            messageCount.textContent = consoleMessageCount.toString();
        }
    }
    function updateConsoleUI() {
        if (consoleStatusBadge) {
            const tabStatus = getTabStatus();
            if (tabStatus === 'running') {
                consoleStatusBadge.textContent = 'Running';
                consoleStatusBadge.className = 'badge badge-running';
                showConsoleLoadingState();
            }
            else if (tabStatus === 'error') {
                consoleStatusBadge.textContent = 'Error';
                consoleStatusBadge.className = 'badge badge-error';
                hideConsoleLoadingState();
            }
            else {
                consoleStatusBadge.textContent = 'Ready';
                consoleStatusBadge.className = 'badge badge-ready';
                hideConsoleLoadingState();
            }
        }
        if (executionTime && executionStartTime > 0) {
            const elapsed = Date.now() - executionStartTime;
            executionTime.textContent = `${elapsed}ms`;
        }
        // Debug logging for status changes
        const tabData = getCurrentTabData();
        console.log('Console status updated for tab:', {
            tabPath: activeFilePath,
            tabStatus: getTabStatus(),
            tabExecuting: tabData?.isExecuting,
            tabErrors: tabData?.consoleStats?.errors,
            status: consoleStatusBadge?.textContent
        });
    }
    function copyConsoleOutput() {
        if (!outputConsole)
            return;
        const messages = outputConsole.querySelectorAll('.console-message .message-text');
        const output = Array.from(messages).map(msg => msg.textContent).join('\n');
        navigator.clipboard.writeText(output).then(() => {
            addConsoleMessage('Console output copied to clipboard', 'success');
        }).catch(() => {
            addConsoleMessage('Failed to copy console output', 'error');
        });
    }
    function saveConsoleOutput() {
        if (!outputConsole)
            return;
        const messages = outputConsole.querySelectorAll('.console-message .message-text');
        const output = Array.from(messages).map(msg => msg.textContent).join('\n');
        const blob = new Blob([output], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `console-output-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        addConsoleMessage('Console output saved to file', 'success');
    }
    // Add event listeners for new console buttons
    if (copyButton)
        copyButton.addEventListener('click', copyConsoleOutput);
    if (consoleSaveButton)
        consoleSaveButton.addEventListener('click', saveConsoleOutput);
    const ErrorManagerCtor = window.ErrorManager || null;
    const errorManager = ErrorManagerCtor ? new ErrorManagerCtor() : null;
    let runnerWorker = null;
    function cleanupWorker() {
        if (runnerWorker) {
            try {
                runnerWorker.onmessage = null;
                runnerWorker.onerror = null;
                runnerWorker.terminate();
            }
            catch (e) {
                console.error(e);
            }
            runnerWorker = null;
        }
        // Reset execution state
        isExecuting = false;
        executionStopped = false;
        // Update tab-specific status
        updateTabStatus(false, false);
        // Stop execution monitoring
        stopExecutionMonitoring();
        // Stop message cleanup when execution ends
        stopMessageCleanup();
        // Update UI state
        if (runButton) {
            runButton.disabled = false;
            runButton.style.display = 'flex';
        }
        if (stopButton) {
            stopButton.style.display = 'none';
            stopButton.disabled = true;
            updateStopButtonState('hidden');
        }
        if (runStatus)
            runStatus.title = 'Idle';
        // Update console status after cleanup
        updateConsoleUI();
    }
    // Function to just terminate the worker without resetting execution state
    function terminateWorker() {
        if (runnerWorker) {
            try {
                runnerWorker.onmessage = null;
                runnerWorker.onerror = null;
                runnerWorker.terminate();
            }
            catch (e) {
                console.error(e);
            }
            runnerWorker = null;
        }
    }
    function stopExecution() {
        if (isExecuting && runnerWorker) {
            executionStopped = true;
            // Send stop message to worker
            try {
                runnerWorker.postMessage({ type: 'stop' });
            }
            catch (e) {
                console.error('Error sending stop message to worker:', e);
            }
            // Force cleanup after a short delay
            setTimeout(() => {
                cleanupWorker();
                out('Execution stopped by user', 'warning');
                // Status will be updated by cleanupWorker
            }, 100);
        }
    }
    // Enhanced stop button state management
    function updateStopButtonState(state) {
        if (!stopButton)
            return;
        // Remove all state classes
        stopButton.classList.remove('hidden', 'normal', 'long-running', 'critical');
        // Add the new state class
        stopButton.classList.add(state);
        // Update title based on state
        switch (state) {
            case 'hidden':
                stopButton.title = 'Stop Execution';
                break;
            case 'normal':
                stopButton.title = 'Stop Execution';
                break;
            case 'long-running':
                stopButton.title = 'Stop Long Running Execution (Click to force stop)';
                break;
            case 'critical':
                stopButton.title = 'Force Stop Stuck Execution (Click immediately)';
                break;
        }
        console.log(`Stop button state updated to: ${state}`);
    }
    // Monitor execution time and update stop button state
    function startExecutionMonitoring() {
        executionStartTime = Date.now();
        longRunningDetected = false;
        // Clear any existing timeouts
        if (longRunningTimeout) {
            clearTimeout(longRunningTimeout);
            longRunningTimeout = null;
        }
        if (criticalTimeout) {
            clearTimeout(criticalTimeout);
            criticalTimeout = null;
        }
        console.log('Starting execution monitoring...');
        // Set timeout for long running detection (5 seconds)
        longRunningTimeout = window.setTimeout(() => {
            if (isExecuting && !longRunningDetected) {
                longRunningDetected = true;
                updateStopButtonState('long-running');
                console.log('Long running execution detected - stop button updated to warning state');
            }
        }, 5000);
        // Set timeout for critical state (15 seconds)
        criticalTimeout = window.setTimeout(() => {
            if (isExecuting) {
                updateStopButtonState('critical');
                console.log('Critical execution state - stop button updated to critical state');
            }
        }, 15000);
    }
    // Stop execution monitoring
    function stopExecutionMonitoring() {
        if (longRunningTimeout) {
            clearTimeout(longRunningTimeout);
            longRunningTimeout = null;
        }
        if (criticalTimeout) {
            clearTimeout(criticalTimeout);
            criticalTimeout = null;
        }
        if (stopButtonPulseInterval) {
            clearInterval(stopButtonPulseInterval);
            stopButtonPulseInterval = null;
        }
        longRunningDetected = false;
    }
    function handleError(err, src) {
        // Check if this is a pre-formatted error message from the worker
        if (err.formatted) {
            // Split the message into lines and handle each line appropriately
            const lines = (err.message || '').split('\n');
            // Display the main error message (first line) with proper styling
            if (lines.length > 0) {
                const mainError = lines[0];
                outputConsole.innerHTML += `<div class="error-message">${mainError}</div>`;
            }
            // Display the rest of the error message with context
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line)
                    continue;
                // Style different parts of the error message
                if (line.startsWith('At line')) {
                    outputConsole.innerHTML += `<div class="error-location">${line}</div>`;
                }
                else if (line.startsWith('  ') && line.trim() !== '^') {
                    // This is a line of code with the error
                    outputConsole.innerHTML += `<div class="error-code"><pre>${line}</pre></div>`;
                }
                else if (line.trim() === '^') {
                    // This is the pointer to the error location
                    outputConsole.innerHTML += `<div class="error-pointer">${line}</div>`;
                }
                else if (line.startsWith('Previous line')) {
                    outputConsole.innerHTML += `<div class="error-context">${line}</div>`;
                }
                else if (line.startsWith('💡')) {
                    // This is a tip/suggestion
                    outputConsole.innerHTML += `<div class="error-tip">${line}</div>`;
                }
                else {
                    // Default styling for other lines
                    outputConsole.innerHTML += `<div>${line}</div>`;
                }
            }
            // Add a separator after the error
            outputConsole.innerHTML += '<div class="error-separator"></div>';
            // Scroll to the bottom to show the error
            scrollOutputToBottom();
            return;
        }
        // Handle pseudo-code validation errors
        if (err.issues && Array.isArray(err.issues)) {
            err.issues.forEach((issue) => {
                out(`Error at line ${issue.line}: ${issue.message}`, 'error');
                out(`  ${issue.text.trim()}`, 'error');
                // Try to highlight the error in the editor if possible
                if (errorManager && window.editor && typeof window.editor.getModel === 'function') {
                    try {
                        const model = window.editor.getModel();
                        const decoration = {
                            message: issue.message,
                            line: issue.line,
                            originalText: issue.text.trim()
                        };
                        if (typeof errorManager.updateDecorations === 'function') {
                            errorManager.updateDecorations(window.editor, [decoration]);
                        }
                    }
                    catch (e) {
                        console.warn('Failed to update error decorations', e);
                    }
                }
            });
            return;
        }
        // Handle single error object
        try {
            let errorMessage = err.message || String(err);
            const lineNum = err.line || 'unknown';
            const originalText = err.originalText || '';
            const errorType = err.name || 'Error';
            const phase = err.phase ? ` (${err.phase})` : '';
            // Format the error message based on the error type and phase
            if (errorType === 'PseudoCodeError' || phase.includes('validation')) {
                // For pseudo-code validation errors
                out(`Pseudo-code Error${phase}: ${errorMessage}`, 'error');
                if (originalText) {
                    out(`Line ${lineNum}: ${originalText}`, 'error');
                }
            }
            else if (errorType === 'SyntaxError' && phase === 'execution') {
                // For syntax errors during execution
                out(`Syntax Error: ${errorMessage}`, 'error');
                if (originalText) {
                    out(`Line ${lineNum}: ${originalText}`, 'error');
                }
            }
            else if (errorType === 'TimeoutError') {
                // For timeout errors
                out(`Timeout: ${errorMessage}`, 'error');
                out('Your code took too long to execute. There might be an infinite loop or inefficient code.', 'error');
            }
            else {
                // For all other errors
                out(`${errorType}${phase}: ${errorMessage}`, 'error');
                if (originalText) {
                    out(`Line ${lineNum}: ${originalText}`, 'error');
                }
            }
            // Try to highlight the error in the editor if possible
            if (errorManager && window.editor && typeof window.editor.getModel === 'function') {
                try {
                    const model = window.editor.getModel();
                    const decoration = {
                        message: errorMessage,
                        line: lineNum,
                        originalText: originalText,
                        type: errorType,
                        phase: phase
                    };
                    // Add suggestions for common errors
                    if (errorType === 'ReferenceError' && errorMessage.includes('is not defined')) {
                        const varName = errorMessage.split(' ')[0];
                        decoration.suggestion = `Did you forget to declare '${varName}' with 'var'?`;
                    }
                    else if (errorType === 'TypeError' && errorMessage.includes('undefined is not a function')) {
                        decoration.suggestion = 'Check if the function name is spelled correctly and exists in the current scope.';
                    }
                    else if (errorType === 'SyntaxError' && errorMessage.includes('Unexpected token')) {
                        decoration.suggestion = 'Check for missing or extra characters like ;, {}, (), or []';
                    }
                    if (typeof errorManager.updateDecorations === 'function') {
                        errorManager.updateDecorations(window.editor, [decoration]);
                    }
                    // If we have a suggestion, display it
                    if (decoration.suggestion) {
                        addSystemMessage(`Suggestion: ${decoration.suggestion}`);
                    }
                    // Scroll to the error line in the editor
                    if (lineNum !== 'unknown') {
                        window.editor.revealLineInCenter(parseInt(lineNum, 10));
                        window.editor.setPosition({ lineNumber: parseInt(lineNum, 10), column: 1 });
                        window.editor.focus();
                    }
                }
                catch (e) {
                    console.warn('Failed to update error decorations', e);
                }
            }
        }
        catch (e) {
            console.error('Error handling error:', e);
            out(`Error: ${String(err)}`, 'error');
        }
    }
    function execute(code) {
        if (!code || !code.trim()) {
            out('Nothing to run', 'warning');
            return;
        }
        try {
            // Set execution state
            isExecuting = true;
            executionStopped = false;
            // Update tab-specific status
            updateTabStatus(true, false);
            // Reset error count for new execution
            consoleStats.errors = 0;
            updateTabConsoleStats(consoleStats);
            // Start execution monitoring
            startExecutionMonitoring();
            // Start message cleanup for performance
            startMessageCleanup();
            // Update console status to Running
            updateConsoleUI();
            // Terminate any existing worker first (without resetting execution state)
            terminateWorker();
            // Update UI state
            if (runButton) {
                runButton.disabled = true;
                runButton.style.display = 'none';
            }
            if (stopButton) {
                stopButton.style.display = 'flex';
                stopButton.disabled = false;
                updateStopButtonState('normal');
            }
            if (runStatus)
                runStatus.title = 'Running';
            // Create new worker
            runnerWorker = new Worker('./scripts/runner.worker.js');
            // If the code looks like pseudocode, send a slightly longer timeout.
            const isPseudo = /\bprint\b|\bvar\b|\bfor\b|\bendfor\b/i.test(code);
            const timeout = isPseudo ? 8000 : 5000;
            runnerWorker.onerror = (e) => {
                out('Worker error: ' + (e && e.message ? e.message : JSON.stringify(e)), 'error');
                cleanupWorker();
            };
            runnerWorker.onmessage = (ev) => {
                const m = ev.data;
                if (!m)
                    return;
                // Check if execution was stopped
                if (executionStopped) {
                    cleanupWorker();
                    return;
                }
                try {
                    if (m.type === 'stdout') {
                        (m.text || '').split('\n').forEach((l) => {
                            if (l.trim())
                                out(l, 'stdout');
                        });
                    }
                    else if (m.type === 'stderr') {
                        out(m.text || 'stderr', 'error');
                        // Update tab-specific console stats
                        updateTabConsoleStats(consoleStats);
                        // Update status to Error when stderr is received
                        updateConsoleUI();
                    }
                    else if (m.type === 'error') {
                        const eobj = m.error || { message: m.message || m.text || 'error' };
                        const e = new Error(eobj.message);
                        e.name = eobj.name || 'Error';
                        e.stack = eobj.stack || '';
                        handleError(e, code);
                        // Update tab-specific console stats
                        updateTabConsoleStats(consoleStats);
                        // Update status to Error immediately
                        updateConsoleUI();
                        cleanupWorker();
                    }
                    else if (m.type === 'input-request') {
                        const val = window.prompt(m.prompt || 'Input:') || '';
                        runnerWorker.postMessage({ type: 'input-response', id: m.id, value: val });
                    }
                    else if (m.type === 'done') {
                        if (!executionStopped) {
                            addSystemMessage('Done');
                        }
                        cleanupWorker();
                        // Update status after execution completes
                        updateConsoleUI();
                    }
                    else {
                        console.warn('unknown message', m);
                    }
                }
                catch (err) {
                    out('Message handler error: ' + err.message, 'error');
                    cleanupWorker();
                }
            };
            runnerWorker.postMessage({ code, timeout });
        }
        catch (err) {
            handleError(err, code);
            cleanupWorker();
        }
    }
    if (runButton)
        runButton.addEventListener('click', async () => {
            // Add running state
            runButton.classList.add('running');
            runButton.disabled = true;
            // Update status indicator
            if (runStatus) {
                runStatus.title = 'Status: Running...';
                const statusDot = runStatus.querySelector('.status-dot');
                if (statusDot)
                    statusDot.style.backgroundColor = 'var(--status-running)';
            }
            // Get the code and clear console
            const code = window.editor && typeof window.editor.getValue === 'function' ? window.editor.getValue() : '';
            if (outputConsole) {
                outputConsole.innerHTML = '';
                scrollOutputToBottom();
            }
            // Focus/switch to console tab
            focusConsole();
            try {
                // Execute the code
                await execute(code);
                // Update status to success if execution completes without errors
                if (runStatus) {
                    runStatus.title = 'Status: Execution completed';
                    const statusDot = runStatus.querySelector('.status-dot');
                    if (statusDot)
                        statusDot.style.backgroundColor = 'var(--status-success)';
                }
            }
            catch (error) {
                // Error handling is done in the execute function
                if (runStatus) {
                    runStatus.title = 'Status: Error occurred';
                    const statusDot = runStatus.querySelector('.status-dot');
                    if (statusDot)
                        statusDot.style.backgroundColor = 'var(--status-error)';
                }
            }
            finally {
                // Reset button state after a short delay to show completion
                setTimeout(() => {
                    runButton.classList.remove('running');
                    runButton.disabled = false;
                }, 300);
            }
        });
    // Stop button event listener
    if (stopButton) {
        stopButton.addEventListener('click', () => {
            stopExecution();
            // Focus console after stopping
            focusConsole();
        });
    }
    // Function to show confirmation modal
    function showConfirmationModal(title, message, buttons) {
        // Remove any existing modal
        const existingModal = document.querySelector('.confirmation-modal-overlay');
        if (existingModal) {
            existingModal.remove();
        }
        // Create modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'confirmation-modal-overlay';
        modalOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(4px);
        `;
        // Create modal content
        const modal = document.createElement('div');
        modal.className = 'confirmation-modal';
        modal.style.cssText = `
            background: var(--bg-soft-elevated);
            border-radius: var(--radius-soft-lg);
            padding: var(--space-soft-6);
            max-width: 400px;
            width: 90%;
            box-shadow: var(--shadow-soft-floating);
            border: 1px solid var(--border-soft-light);
        `;
        modal.innerHTML = `
            <div style="margin-bottom: var(--space-soft-4);">
                <h3 style="margin: 0 0 var(--space-soft-2) 0; color: var(--text-soft-primary); font-size: var(--font-size-soft-lg); font-weight: var(--font-weight-soft-semibold);">${title}</h3>
                <p style="margin: 0; color: var(--text-soft-secondary); font-size: var(--font-size-soft-sm); line-height: 1.4;">${message}</p>
            </div>
            <div style="display: flex; gap: var(--space-soft-3); justify-content: flex-end;">
                ${buttons.map((btn, index) => `
                    <button class="confirmation-btn ${btn.primary ? 'primary' : 'secondary'}" data-action="${index}" style="
                        padding: var(--space-soft-2) var(--space-soft-4);
                        border: none;
                        border-radius: var(--radius-soft-sm);
                        font-size: var(--font-size-soft-sm);
                        font-weight: var(--font-weight-soft-medium);
                        cursor: pointer;
                        transition: all var(--duration-soft-normal) var(--ease-soft-out);
                        ${btn.primary ?
            'background: var(--text-soft-accent); color: var(--text-soft-inverse);' :
            'background: var(--bg-soft-secondary); color: var(--text-soft-primary); border: 1px solid var(--border-soft-light);'}
                    ">${btn.text}</button>
                `).join('')}
            </div>
        `;
        modalOverlay.appendChild(modal);
        document.body.appendChild(modalOverlay);
        // Add event listeners
        modal.addEventListener('click', (e) => {
            const target = e.target;
            if (target.classList.contains('confirmation-btn')) {
                const actionIndex = parseInt(target.dataset.action || '0');
                buttons[actionIndex].action();
                modalOverlay.remove();
            }
        });
        // Close on overlay click
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.remove();
            }
        });
        // Focus first button
        const firstButton = modal.querySelector('.confirmation-btn');
        if (firstButton) {
            firstButton.focus();
        }
    }
    // Function to save the current editor state
    function saveEditorState() {
        if (!window.editor || !activeFilePath || !window.editor.getModel)
            return;
        try {
            const content = window.editor.getValue();
            const position = window.editor.getPosition();
            const scrollTop = window.editor.getScrollTop ? window.editor.getScrollTop() : 0;
            if (openFiles.has(activeFilePath)) {
                const file = openFiles.get(activeFilePath);
                file.content = content;
                file.cursorPosition = position || { lineNumber: 1, column: 1 };
                file.scrollPosition = scrollTop;
                file.dirty = content !== (file.originalContent || '');
                updateTabDirtyState(activeFilePath, file.dirty);
            }
        }
        catch (e) {
            console.error('Error saving editor state:', e);
        }
    }
    // Function to refresh editor content for the current tab
    function refreshEditorForCurrentTab() {
        if (!window.editor || !activeFilePath || !window.editor.getModel) {
            // If editor isn't ready, try again shortly
            if (activeFilePath && !window.editor) {
                setTimeout(refreshEditorForCurrentTab, 100);
            }
            return;
        }
        const file = openFiles.get(activeFilePath);
        if (!file) {
            console.warn('No file data found for:', activeFilePath);
            return;
        }
        try {
            const model = window.editor.getModel();
            if (!model)
                return;
            // Update editor content
            const currentContent = model.getValue();
            if (currentContent !== file.content) {
                model.setValue(file.content || '');
            }
            // Restore cursor position
            if (file.cursorPosition) {
                window.editor.setPosition(file.cursorPosition);
                window.editor.revealPositionInCenter(file.cursorPosition);
            }
            // Restore scroll position
            if (file.scrollPosition !== undefined && window.editor.setScrollTop) {
                window.editor.setScrollTop(file.scrollPosition);
            }
            // Update window title
            const fileName = activeFilePath.split('/').pop();
            document.title = `${fileName}${file.dirty ? ' *' : ''} - iPseudo IDE`;
            // Focus the editor
            window.editor.focus();
        }
        catch (e) {
            console.error('Error refreshing editor:', e);
        }
    }
    // Function to open a file in a new tab
    async function openFile(filePath, content) {
        try {
            // Store file content
            openFiles.set(filePath, {
                content,
                dirty: false,
                originalContent: content,
                cursorPosition: { lineNumber: 1, column: 1 },
                scrollPosition: 0
            });
            // Track last save time for auto save (file was just loaded, so it's "saved")
            lastSaveTime.set(filePath, Date.now());
            // Create new tab or switch to existing one
            createOrSwitchToTab(filePath, content);
            // Update window title
            document.title = `${filePath.split('/').pop()} - iPseudo IDE`;
        }
        catch (error) {
            console.error('Error opening file:', error);
            handleError({ message: `Failed to open file: ${error.message}` });
        }
    }
    // Function to create or switch to a tab
    function createOrSwitchToTab(filePath, initialContent = '') {
        const tabBar = document.getElementById('tabsTrack');
        if (!tabBar) {
            console.error('Tab track not found');
            return;
        }
        // Check if tab already exists
        const existingTab = tabBar.querySelector(`.modern-tab[data-tab-id="${filePath}"]`);
        if (existingTab) {
            switchToTab(existingTab);
            return;
        }
        // Save current editor state before switching (only if there's an active file)
        if (activeFilePath && window.editor) {
            saveEditorState();
        }
        // Generate a unique tab ID
        const tabId = `tab-${Date.now()}-${++tabCounter}`;
        // Create new tab
        const tab = document.createElement('div');
        tab.className = 'modern-tab active';
        tab.dataset.path = filePath;
        tab.dataset.tabId = tabId;
        tab.style.animation = 'tabSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        const fileName = filePath.split(/[\\/]/).pop();
        tab.innerHTML = `
            <span class="tab-label">${fileName}</span>
            <span class="dirty-indicator" aria-hidden="true"></span>
            <button class="modern-btn modern-btn-icon modern-tab-close" data-tab-id="${tabId}" aria-label="Close">
                <i class="ri-close-line"></i>
            </button>
        `;
        // Insert the new tab at the end of the tabs track
        tabBar.appendChild(tab);
        // Update active tab state
        document.querySelectorAll('.modern-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        // Add to open files if not already there
        if (!openFiles.has(filePath)) {
            openFiles.set(filePath, {
                content: initialContent,
                originalContent: initialContent,
                dirty: false,
                cursorPosition: { lineNumber: 1, column: 1 },
                scrollPosition: 0,
                tabId: tabId
            });
        }
        else {
            // Update existing file data with tab ID
            const fileData = openFiles.get(filePath);
            if (fileData) {
                fileData.tabId = tabId;
                openFiles.set(filePath, fileData);
            }
        }
        // Update active file path BEFORE setting editor content
        activeFilePath = filePath;
        window.activeFilePath = activeFilePath || '';
        // Initialize editor with content
        if (window.editor) {
            // Set the content and update the file data
            window.editor.setValue(initialContent);
            // Update the file data with the initial content
            if (openFiles.has(filePath)) {
                const fileData = openFiles.get(filePath);
                fileData.content = initialContent;
                fileData.originalContent = initialContent;
                fileData.dirty = false;
                openFiles.set(filePath, fileData);
            }
            window.editor.focus();
        }
        // Restore tab-specific status and console
        restoreTabStatusAndConsole();
        // Update document title
        document.title = `${fileName} - iPseudo IDE`;
        // Update tab counter
        updateTabCounter();
        return tab;
    }
    // Function to switch tabs
    function switchToTab(tab) {
        if (!tab)
            return;
        const filePath = tab.dataset.path;
        if (!filePath)
            return;
        // Save current editor state before switching
        saveEditorState();
        // Update active tab - remove active from all tabs first
        document.querySelectorAll('.modern-tab').forEach(t => {
            t.classList.remove('active');
        });
        // Add active class to clicked tab
        tab.classList.add('active');
        // Add bounce animation
        tab.style.animation = 'tabBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        setTimeout(() => {
            tab.style.animation = '';
        }, 600);
        // Update active file path
        activeFilePath = filePath;
        window.activeFilePath = activeFilePath || '';
        // Refresh editor content for the new tab
        refreshEditorForCurrentTab();
        // Restore tab-specific status and console
        restoreTabStatusAndConsole();
        // Update side-by-side console if in side-by-side layout
        if (!isTabLayout) {
            updateSideBySideConsole();
        }
        // Focus the editor
        if (window.editor) {
            window.editor.focus();
        }
    }
    // Function to check if tab is file-based (has a real file path)
    function isFileBased(filePath) {
        return !!(filePath && filePath !== 'untitled.pseudo' && filePath.includes('/') && !filePath.startsWith('Untitled-'));
    }
    // Function to save file directly (for file-based tabs)
    async function saveFileDirectly(filePath, content) {
        try {
            const result = await window.electron.saveFile({
                filePath: filePath,
                content: content
            });
            if (!result.canceled) {
                // Update file data
                const fileData = openFiles.get(filePath);
                if (fileData) {
                    fileData.content = content;
                    fileData.originalContent = content;
                    fileData.dirty = false;
                    openFiles.set(filePath, fileData);
                    updateTabDirtyState(filePath, false);
                    out(`File saved: ${filePath}`, 'success');
                }
                // Track last save time for auto save
                lastSaveTime.set(filePath, Date.now());
            }
        }
        catch (error) {
            console.error('Error saving file:', error);
            throw error;
        }
    }
    // Function to show save dialog (for new files)
    async function showSaveDialog(content) {
        try {
            const result = await window.electron.saveFile({
                filePath: undefined, // This will trigger the save dialog
                content: content
            });
            if (!result.canceled && result.filePath) {
                // Update the active tab with the new file path
                const activeTab = document.querySelector('.modern-tab.active');
                if (activeTab) {
                    const oldPath = activeTab.dataset.path;
                    const newPath = result.filePath;
                    // Update tab data
                    activeTab.dataset.path = newPath;
                    const fileName = newPath.split(/[\\/]/).pop();
                    const tabLabel = activeTab.querySelector('.tab-label');
                    if (tabLabel)
                        tabLabel.textContent = fileName || '';
                    // Update file data
                    const fileData = openFiles.get(oldPath || '');
                    if (fileData) {
                        fileData.content = content;
                        fileData.originalContent = content;
                        fileData.dirty = false;
                        openFiles.set(newPath, fileData);
                        if (oldPath)
                            openFiles.delete(oldPath);
                        updateTabDirtyState(newPath, false);
                    }
                    // Update active file path
                    activeFilePath = newPath;
                    window.activeFilePath = activeFilePath || '';
                    // Track last save time for auto save
                    lastSaveTime.set(newPath, Date.now());
                    out(`File saved: ${newPath}`, 'success');
                    return true;
                }
            }
            return false;
        }
        catch (error) {
            console.error('Error showing save dialog:', error);
            return false;
        }
    }
    // Function to close a tab by its DOM element
    async function closeTabElement(tabElement) {
        if (!tabElement)
            return;
        const tabId = tabElement.dataset.tabId;
        let filePath = tabElement.dataset.path || '';
        const isNewFile = !filePath || filePath === 'untitled.pseudo' || !filePath.includes('/');
        const isFileBasedTab = isFileBased(filePath);
        // Get current content from editor if this is the active tab
        let currentContent = '';
        const isActiveTab = tabElement.classList.contains('active');
        if (isActiveTab && window.editor) {
            currentContent = window.editor.getValue();
        }
        else {
            // If not active, get content from openFiles
            const fileData = openFiles.get(filePath);
            currentContent = fileData?.content || '';
        }
        const fileData = openFiles.get(filePath);
        const isEmpty = currentContent.trim() === '';
        const isModified = fileData?.dirty || false;
        // Check if confirm before closing is enabled
        const settings = loadSettings();
        const confirmClose = settings.confirmClose !== false; // Default to true if not set
        // If confirmClose is disabled, close immediately regardless of content or changes
        if (!confirmClose) {
            performTabClose(tabElement);
            return;
        }
        // If confirmClose is enabled, check for unsaved changes
        if (isModified) {
            // Has unsaved changes - show save confirmation
            const title = isFileBasedTab ? 'Save Changes?' : 'Save Before Closing?';
            const fileName = isFileBasedTab ? filePath.split('/').pop() : 'this tab';
            const message = isFileBasedTab
                ? `The file "${fileName}" has unsaved changes. Do you want to save them?`
                : 'This tab has unsaved content. Do you want to save it before closing?';
            // Show save confirmation dialog
            showConfirmationModal(title, message, [
                {
                    text: 'Yes',
                    primary: true,
                    action: async () => {
                        try {
                            if (isFileBasedTab) {
                                // Save to existing file
                                await saveFileDirectly(filePath, currentContent);
                            }
                            else {
                                // Show save dialog for new file
                                const saved = await showSaveDialog(currentContent);
                                if (!saved) {
                                    return; // Don't close if save was cancelled
                                }
                            }
                            performTabClose(tabElement);
                        }
                        catch (error) {
                            console.error('Error saving file:', error);
                            // Still close the tab even if save fails
                            performTabClose(tabElement);
                        }
                    }
                },
                {
                    text: 'No',
                    action: () => {
                        performTabClose(tabElement);
                    }
                }
            ]);
        }
        else {
            // No unsaved changes but confirmClose is enabled - show simple confirmation
            const title = 'Close Tab?';
            const fileName = isFileBasedTab ? filePath.split('/').pop() : 'this tab';
            const message = `Are you sure you want to close "${fileName}"?`;
            // Show simple close confirmation dialog
            showConfirmationModal(title, message, [
                {
                    text: 'Yes',
                    primary: true,
                    action: () => {
                        performTabClose(tabElement);
                    }
                },
                {
                    text: 'No',
                    action: () => {
                        // Do nothing - just close the dialog
                    }
                }
            ]);
        }
    }
    // Function to perform the actual tab close
    function performTabClose(tabElement) {
        const filePath = tabElement.dataset.path || '';
        const wasActive = tabElement.classList.contains('active');
        // Add slide-out animation
        tabElement.style.animation = 'tabSlideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => {
            tabElement.remove();
            // Update tab counter after removal
            updateTabCounter();
        }, 300);
        // Clean up openFiles if this was the last tab with this path
        if (filePath) {
            const isPathUsed = Array.from(document.querySelectorAll('.modern-tab')).some(t => t.dataset.path === filePath);
            if (!isPathUsed) {
                openFiles.delete(filePath);
            }
        }
        // If this was the active tab, switch to another tab
        if (wasActive) {
            const remainingTabs = document.querySelectorAll('.modern-tab');
            if (remainingTabs.length > 0) {
                // Find the best tab to switch to
                let targetTab = null;
                // First, try to find the next tab
                targetTab = tabElement.nextElementSibling;
                // If no next tab, try the previous tab
                if (!targetTab) {
                    targetTab = tabElement.previousElementSibling;
                }
                if (targetTab) {
                    switchToTab(targetTab);
                }
            }
            else {
                // No tabs left, create a new one
                createNewTab();
            }
        }
    }
    // Update the tab click handler
    document.getElementById('tabsContainer')?.addEventListener('click', (e) => {
        const closeButton = e.target.closest('.modern-tab-close');
        if (closeButton) {
            e.preventDefault();
            e.stopPropagation();
            const tab = closeButton.closest('.modern-tab');
            if (tab) {
                closeTabElement(tab);
            }
            return;
        }
        const tab = e.target.closest('.modern-tab');
        if (tab) {
            e.preventDefault();
            e.stopPropagation();
            switchToTab(tab);
        }
    });
    // Add right-click context menu for tabs
    document.getElementById('tabsContainer')?.addEventListener('contextmenu', (e) => {
        const tab = e.target.closest('.modern-tab');
        if (tab) {
            e.preventDefault();
            e.stopPropagation();
            // Create context menu
            const contextMenu = document.createElement('div');
            contextMenu.className = 'tab-context-menu';
            contextMenu.innerHTML = `
                <div class="context-menu-item" data-action="close">
                    <i class="ri-close-line"></i>
                    <span>Close Tab</span>
                </div>
                <div class="context-menu-item" data-action="close-others">
                    <i class="ri-close-circle-line"></i>
                    <span>Close Other Tabs</span>
                </div>
                <div class="context-menu-item" data-action="close-all">
                    <i class="ri-close-circle-fill"></i>
                    <span>Close All Tabs</span>
                </div>
                <div class="context-menu-separator"></div>
                <div class="context-menu-item" data-action="duplicate">
                    <i class="ri-file-copy-line"></i>
                    <span>Duplicate Tab</span>
                </div>
            `;
            // Position the context menu with smart positioning
            contextMenu.style.position = 'fixed';
            contextMenu.style.zIndex = '10000';
            // Smart positioning to avoid going off-screen
            const menuWidth = 180; // min-width from CSS
            const menuHeight = 200; // estimated height
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            let left = e.clientX;
            let top = e.clientY;
            // Adjust horizontal position if menu would go off-screen
            if (left + menuWidth > viewportWidth) {
                left = viewportWidth - menuWidth - 10;
            }
            // Adjust vertical position if menu would go off-screen
            if (top + menuHeight > viewportHeight) {
                top = viewportHeight - menuHeight - 10;
            }
            // Ensure menu doesn't go off the left or top edges
            left = Math.max(10, left);
            top = Math.max(10, top);
            contextMenu.style.left = left + 'px';
            contextMenu.style.top = top + 'px';
            document.body.appendChild(contextMenu);
            // Handle context menu actions
            contextMenu.addEventListener('click', (e) => {
                const action = e.target.closest('.context-menu-item')?.getAttribute('data-action');
                if (action) {
                    switch (action) {
                        case 'close':
                            closeTabElement(tab);
                            break;
                        case 'close-others':
                            closeOtherTabs(tab);
                            break;
                        case 'close-all':
                            closeAllTabs();
                            break;
                        case 'duplicate':
                            duplicateTab(tab);
                            break;
                    }
                }
                contextMenu.remove();
            });
            // Remove context menu when clicking outside
            const removeContextMenu = (e) => {
                if (!contextMenu.contains(e.target)) {
                    contextMenu.remove();
                    document.removeEventListener('click', removeContextMenu);
                }
            };
            setTimeout(() => {
                document.addEventListener('click', removeContextMenu);
            }, 100);
        }
    });
    // Function to update the dirty state of a tab
    function updateTabDirtyState(filePath, isDirty) {
        const tab = document.querySelector(`.modern-tab[data-path="${filePath}"]`);
        if (tab) {
            const dirtyIndicator = tab.querySelector('.dirty-indicator');
            if (dirtyIndicator) {
                dirtyIndicator.style.display = isDirty ? 'inline-block' : 'none';
            }
            tab.classList.toggle('dirty', isDirty);
        }
    }
    // Make updateTabDirtyState globally available
    window.updateTabDirtyState = updateTabDirtyState;
    function getNextUntitledNumber() {
        const untitledRegex = /^Untitled-(\d+)\.pseudo$/;
        const existingNumbers = [];
        for (const filePath of openFiles.keys()) {
            const match = filePath.match(untitledRegex);
            if (match && match[1]) {
                existingNumbers.push(parseInt(match[1], 10));
            }
        }
        let nextNumber = 1;
        while (existingNumbers.includes(nextNumber)) {
            nextNumber++;
        }
        return nextNumber;
    }
    function createNewTab() {
        // Check if we can create a new tab
        if (!canCreateNewTab()) {
            out(`Maximum of ${getMaxTabs()} tabs allowed. Close a tab first.`, 'warning');
            return;
        }
        const newTabId = `Untitled-${getNextUntitledNumber()}.pseudo`;
        // Add to open files first
        openFiles.set(newTabId, {
            content: '',
            originalContent: '',
            dirty: false,
            cursorPosition: { lineNumber: 1, column: 1 },
            scrollPosition: 0
        });
        // Create the tab (this will handle saving current state)
        createOrSwitchToTab(newTabId, '');
        // Update document title
        document.title = `${newTabId} - iPseudo IDE`;
        // Update tab counter
        updateTabCounter();
    }
    // Helper functions for context menu
    function closeOtherTabs(keepTab) {
        const allTabs = document.querySelectorAll('.modern-tab');
        const otherTabs = Array.from(allTabs).filter(tab => tab !== keepTab);
        if (otherTabs.length === 0)
            return;
        // Check if confirm before closing is enabled
        const settings = loadSettings();
        const confirmClose = settings.confirmClose !== false;
        if (confirmClose) {
            showConfirmationModal('Close Other Tabs?', `Are you sure you want to close ${otherTabs.length} other tab${otherTabs.length > 1 ? 's' : ''}?`, [
                {
                    text: 'Yes',
                    primary: true,
                    action: () => {
                        otherTabs.forEach(tab => {
                            closeTabElement(tab);
                        });
                    }
                },
                {
                    text: 'No',
                    action: () => {
                        // Do nothing - just close the dialog
                    }
                }
            ]);
        }
        else {
            // Close immediately without confirmation - bypass individual tab confirmations
            otherTabs.forEach(tab => {
                performTabClose(tab);
            });
        }
    }
    function closeAllTabs() {
        const allTabs = document.querySelectorAll('.modern-tab');
        if (allTabs.length === 0)
            return;
        // Check if confirm before closing is enabled
        const settings = loadSettings();
        const confirmClose = settings.confirmClose !== false;
        if (confirmClose) {
            showConfirmationModal('Close All Tabs?', `Are you sure you want to close all ${allTabs.length} tab${allTabs.length > 1 ? 's' : ''}?`, [
                {
                    text: 'Yes',
                    primary: true,
                    action: () => {
                        allTabs.forEach(tab => {
                            closeTabElement(tab);
                        });
                    }
                },
                {
                    text: 'No',
                    action: () => {
                        // Do nothing - just close the dialog
                    }
                }
            ]);
        }
        else {
            // Close immediately without confirmation - bypass individual tab confirmations
            allTabs.forEach(tab => {
                performTabClose(tab);
            });
        }
    }
    function duplicateTab(tab) {
        const filePath = tab.dataset.path;
        if (!filePath)
            return;
        const file = openFiles.get(filePath);
        if (file) {
            const newTabId = `Untitled-${getNextUntitledNumber()}.pseudo`;
            openFiles.set(newTabId, {
                content: file.content,
                originalContent: file.content,
                dirty: true,
                cursorPosition: { lineNumber: 1, column: 1 },
                scrollPosition: 0
            });
            createOrSwitchToTab(newTabId, file.content);
        }
    }
    // Add event listener for the save button
    const saveButton = document.getElementById('btnSave');
    if (saveButton) {
        saveButton.addEventListener('click', async () => {
            if (!window.editor)
                return;
            const content = window.editor.getValue();
            const activeTab = document.querySelector('.modern-tab.active');
            if (!activeTab)
                return;
            const currentPath = activeTab.dataset.path || '';
            const tabId = activeTab.dataset.tabId;
            // Check if this is a new/unsaved file
            const isNewFile = !currentPath || currentPath === 'untitled.pseudo' || !currentPath.includes('/');
            try {
                if (isNewFile) {
                    // For new files, show save dialog
                    const result = await window.electron.saveFile({
                        filePath: undefined, // This will trigger the save dialog
                        content: content
                    });
                    if (!result.canceled && result.filePath) {
                        const newPath = result.filePath; // Update filePath with the new saved path
                        activeTab.dataset.path = newPath;
                        const fileName = newPath.split(/[\\/]/).pop();
                        // Update the tab's label
                        const tabLabel = activeTab.querySelector('.tab-label');
                        if (tabLabel)
                            tabLabel.textContent = fileName || '';
                        // Get or create file data
                        let fileData = openFiles.get(currentPath) || {
                            content: content,
                            originalContent: content,
                            dirty: false,
                            cursorPosition: window.editor.getPosition(),
                            scrollPosition: window.editor.getScrollTop(),
                            tabId: tabId
                        };
                        // Update file data
                        fileData.content = content;
                        fileData.originalContent = content;
                        fileData.dirty = false;
                        // Save with new path
                        openFiles.set(newPath, fileData);
                        // Remove old entry if it exists and is different
                        if (currentPath && currentPath !== newPath) {
                            openFiles.delete(currentPath);
                        }
                        // Update active file path
                        activeFilePath = newPath;
                        // Update the tab's dirty state
                        updateTabDirtyState(newPath, false);
                        out(`File saved: ${newPath}`, 'success');
                    }
                }
                else {
                    // For existing files, save directly
                    const result = await window.electron.saveFile({
                        filePath: currentPath,
                        content: content
                    });
                    if (!result.canceled) {
                        // Update file data
                        const fileData = openFiles.get(currentPath);
                        if (fileData) {
                            fileData.content = content;
                            fileData.originalContent = content;
                            fileData.dirty = false;
                            openFiles.set(currentPath, fileData);
                            updateTabDirtyState(currentPath, false);
                            out(`File saved: ${currentPath}`, 'success');
                        }
                    }
                }
            }
            catch (error) {
                console.error('Error saving file:', error);
                out(`Error saving file: ${error.message}`, 'error');
            }
        });
    }
    // Add event listener for the new button
    const newButton = document.getElementById('btnNew');
    if (newButton) {
        newButton.addEventListener('click', () => {
            createNewTab();
        });
        // Update button state based on tab limit
        function updateNewButtonState() {
            if (newButton) {
                const canCreate = canCreateNewTab();
                newButton.disabled = !canCreate;
                // Title removed - using aria-label for tooltip
                if (!canCreate) {
                    newButton.classList.add('disabled');
                }
                else {
                    newButton.classList.remove('disabled');
                }
            }
        }
        // Initial state
        updateNewButtonState();
        // Update state when tabs change
        const observer = new MutationObserver(updateNewButtonState);
        observer.observe(document.getElementById('tabsContainer'), {
            childList: true,
            subtree: true
        });
    }
    // Add event listener for the new tab button
    const newTabButton = document.getElementById('btnNewTab');
    if (newTabButton) {
        newTabButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            createNewTab();
        });
        // Update button state based on tab limit
        function updateNewTabButtonState() {
            if (newTabButton) {
                const canCreate = canCreateNewTab();
                newTabButton.disabled = !canCreate;
                // Title removed - using aria-label for tooltip
                if (!canCreate) {
                    newTabButton.classList.add('disabled');
                }
                else {
                    newTabButton.classList.remove('disabled');
                }
            }
        }
        // Initial state
        updateNewTabButtonState();
        // Update state when tabs change
        const observer = new MutationObserver(updateNewTabButtonState);
        observer.observe(document.getElementById('tabsContainer'), {
            childList: true,
            subtree: true
        });
    }
    else {
        console.error('New tab button not found');
    }
    // Add event listeners for new action buttons
    const formatButton = document.getElementById('btnFormat');
    if (formatButton) {
        formatButton.addEventListener('click', () => {
            if (window.editor) {
                formatPseudocode();
            }
        });
    }
    const minimapButton = document.getElementById('btnMinimap');
    if (minimapButton) {
        // Set initial button state based on current setting
        const settings = loadSettings();
        const isMinimapEnabled = settings.minimap !== undefined ? settings.minimap : true;
        minimapButton.classList.toggle('active', isMinimapEnabled);
        minimapButton.addEventListener('click', () => {
            if (window.editor) {
                try {
                    const currentValue = window.editor.getOption(window.monaco.editor.EditorOption.minimap);
                    const newValue = !currentValue.enabled;
                    window.editor.updateOptions({ minimap: { enabled: newValue } });
                    minimapButton.classList.toggle('active', newValue);
                    addSystemMessage(`Minimap ${newValue ? 'enabled' : 'disabled'}`);
                    // Save the setting
                    saveSetting('minimap', newValue);
                }
                catch (error) {
                    console.error('Error toggling minimap:', error);
                    // Fallback approach
                    const currentValue = window.editor.getOption('minimap');
                    const newValue = !currentValue.enabled;
                    window.editor.updateOptions({ minimap: { enabled: newValue } });
                    minimapButton.classList.toggle('active', newValue);
                    addSystemMessage(`Minimap ${newValue ? 'enabled' : 'disabled'}`);
                    // Save the setting
                    saveSetting('minimap', newValue);
                }
            }
        });
    }
    const wordWrapButton = document.getElementById('btnWordWrap');
    if (wordWrapButton) {
        wordWrapButton.addEventListener('click', () => {
            if (window.editor) {
                const currentValue = window.editor.getOption('wordWrap');
                window.editor.updateOptions({ wordWrap: currentValue === 'on' ? 'off' : 'on' });
                wordWrapButton.classList.toggle('active', currentValue !== 'on');
                addSystemMessage(`Word wrap ${currentValue === 'on' ? 'disabled' : 'enabled'}`);
            }
        });
    }
    const copyOutputButton = document.getElementById('btnCopyOutput');
    if (copyOutputButton) {
        copyOutputButton.addEventListener('click', () => {
            if (outputConsole) {
                const text = outputConsole.innerText;
                navigator.clipboard.writeText(text).then(() => {
                    out('Output copied to clipboard', 'success');
                }).catch(() => {
                    out('Failed to copy output', 'error');
                });
            }
        });
    }
    // Layout toggle functionality
    const layoutToggleButton = document.getElementById('layoutToggle');
    const layoutIcon = document.getElementById('layoutIcon');
    const tabLayout = document.getElementById('tabLayout');
    const sideBySideLayout = document.getElementById('sideBySideLayout');
    let isTabLayout = true; // Start with tab layout
    // Ensure tab layout is visible on startup
    if (tabLayout) {
        tabLayout.style.display = 'flex';
    }
    if (sideBySideLayout) {
        sideBySideLayout.style.display = 'none';
    }
    // Ensure main editor is properly initialized
    setTimeout(() => {
        if (window.editor) {
            window.editor.layout();
            console.log('Main editor layout refreshed');
        }
        else {
            console.warn('Main editor not found - this might cause issues with tab layout');
        }
        // Debug tab layout visibility
        const editorContent = document.getElementById('editorContent');
        const consoleContent = document.getElementById('consoleContent');
        console.log('Editor content element:', editorContent);
        console.log('Console content element:', consoleContent);
        console.log('Editor content classes:', editorContent?.className);
        console.log('Console content classes:', consoleContent?.className);
        // Console content is tab-specific
    }, 500);
    if (layoutToggleButton && layoutIcon && tabLayout && sideBySideLayout) {
        layoutToggleButton.addEventListener('click', () => {
            if (isTabLayout) {
                // Switch to side-by-side layout
                tabLayout.style.display = 'none';
                sideBySideLayout.style.display = 'flex';
                layoutIcon.className = 'ri-layout-column-line';
                isTabLayout = false;
                addSystemMessage('Switched to side-by-side layout');
                // Initialize side-by-side editor if not already done
                initializeSideBySideEditor();
                // Update side-by-side console with current tab's console content
                updateSideBySideConsole();
            }
            else {
                // Switch to tab layout
                tabLayout.style.display = 'flex';
                sideBySideLayout.style.display = 'none';
                layoutIcon.className = 'ri-layout-row-line';
                isTabLayout = true;
                addSystemMessage('Switched to tab layout');
                // Ensure main editor is properly resized
                if (window.editor) {
                    setTimeout(() => {
                        window.editor.layout();
                    }, 100);
                }
                // Tab layout restored
            }
        });
    }
    // Initialize modern tab system
    const editorTab = document.getElementById('editorTab');
    const consoleTab = document.getElementById('consoleTab');
    const editorContent = document.getElementById('editorContent');
    const consoleTabContent = document.getElementById('consoleContent');
    
    if (editorTab && consoleTab && editorContent && consoleTabContent) {
        // Editor tab click handler
        editorTab.addEventListener('click', () => {
            // Remove active class from all tab nav items and panels
            document.querySelectorAll('.tab-nav-item').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
            
            // Add active class to editor tab and panel
            editorTab.classList.add('active');
            editorContent.classList.add('active');
            
            // Update console badge visibility
            const consoleBadge = document.getElementById('consoleBadge');
            if (consoleBadge) {
                consoleBadge.style.display = 'none';
            }
        });
        
        // Console tab click handler
        consoleTab.addEventListener('click', () => {
            // Remove active class from all tab nav items and panels
            document.querySelectorAll('.tab-nav-item').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
            
            // Add active class to console tab and panel
            consoleTab.classList.add('active');
            consoleTabContent.classList.add('active');
            
            // Hide console badge when console is active
            const consoleBadge = document.getElementById('consoleBadge');
            if (consoleBadge) {
                consoleBadge.style.display = 'none';
            }
        });
    }
    const exportOutputButton = document.getElementById('btnExportOutput');
    if (exportOutputButton) {
        exportOutputButton.addEventListener('click', () => {
            if (outputConsole) {
                const text = outputConsole.innerText;
                const blob = new Blob([text], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `output-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                out('Output exported', 'success');
            }
        });
    }
    // Add event listener for the open button
    const openButton = document.getElementById('btnOpen');
    if (openButton) {
        openButton.addEventListener('click', async () => {
            try {
                // Use IPC to show file open dialog and get file content
                const result = await window.electron.openFile();
                if (!result.canceled && result.filePath && result.content !== undefined) {
                    await openFile(result.filePath, result.content);
                }
            }
            catch (error) {
                console.error('Error in file open dialog:', error);
                handleError({ message: `Failed to open file dialog: ${error.message}` });
            }
        });
    }
    // Settings button event listener
    const settingsButton = document.getElementById('btnSettings');
    if (settingsButton) {
        settingsButton.addEventListener('click', () => {
            // Open settings modal
            const settingsModal = document.getElementById('settingsModal');
            if (settingsModal) {
                settingsModal.style.display = 'flex';
                initializeSettingsModal();
            }
        });
    }
    // Listen for settings changes when returning from settings page
    window.addEventListener('focus', () => {
        // Check if we just returned from settings page
        if (window.location.pathname.includes('index.html') || window.location.pathname === '' || window.location.pathname === '/') {
            const settings = loadSettings();
            applyAppSettings(settings);
        }
    });
    // Also listen for storage changes (in case settings are changed in another tab)
    window.addEventListener('storage', (e) => {
        if (e.key === 'iPseudoSettings') {
            const settings = loadSettings();
            applyAppSettings(settings);
        }
    });
    // Sidebar and Activity Bar Interactivity
    if (sidebarToggle && appShell) {
        sidebarToggle.addEventListener('click', () => {
            appShell.classList.toggle('sidebar-collapsed');
        });
    }
    if (activityBar) {
        activityBar.addEventListener('click', (e) => {
            const target = e.target.closest('.activity-bar-item');
            if (!target || !target.dataset.view)
                return;
            const viewId = target.dataset.view;
            // Update active button in activity bar
            document.querySelectorAll('.activity-bar-item').forEach(item => item.classList.remove('active'));
            target.classList.add('active');
            // Update visible view in sidebar
            document.querySelectorAll('.sidebar-view').forEach(view => view.classList.remove('active'));
            const activeView = document.getElementById(`view-${viewId}`);
            if (activeView) {
                activeView.classList.add('active');
            }
        });
    }
    // Initialize the first tab when the DOM is loaded
    // Wait for the editor to be ready
    function initializeFirstTab() {
        if (!window.editor || !window.editor.getModel) {
            setTimeout(initializeFirstTab, 100);
            return;
        }
        // Only create a new tab if there are no existing tabs
        const existingTabs = document.querySelectorAll('.modern-tab');
        if (existingTabs.length === 0) {
            // Get the current editor content (the default content)
            const currentContent = window.editor.getValue();
            // Create a new tab with the current editor content
            const newTabId = `Untitled-${getNextUntitledNumber()}.pseudo`;
            // Add to open files with the current editor content
            openFiles.set(newTabId, {
                content: currentContent,
                originalContent: currentContent,
                dirty: false,
                cursorPosition: { lineNumber: 1, column: 1 },
                scrollPosition: 0
            });
            // Create the tab with the current content
            createOrSwitchToTab(newTabId, currentContent);
            // Update document title
            document.title = `${newTabId} - iPseudo IDE`;
        }
    }
    // Initialize UI state
    function initializeUI() {
        // Set initial button states
        if (runButton) {
            runButton.style.display = 'flex';
        }
        if (stopButton) {
            stopButton.style.display = 'none';
            stopButton.disabled = true;
        }
        // Setup auto-scroll observer
        setupAutoScrollObserver();
    }
    // Function to toggle auto-scroll (for debugging)
    function toggleAutoScroll() {
        autoScrollEnabled = !autoScrollEnabled;
        console.log('Auto-scroll', autoScrollEnabled ? 'enabled' : 'disabled');
    }
    // Test function to add multiple lines and verify auto-scroll
    function testAutoScroll() {
        console.log('Testing auto-scroll with console content:', consoleContent);
        console.log('Console element details:', {
            id: consoleContent?.className,
            className: consoleContent?.className,
            scrollHeight: consoleContent?.scrollHeight,
            clientHeight: consoleContent?.clientHeight
        });
        for (let i = 1; i <= 10; i++) {
            setTimeout(() => {
                out(`Test line ${i} - This should auto-scroll to show the latest content`, 'info');
            }, i * 500); // Add a line every 500ms
        }
    }
    // Test function for very long content
    function testLongContentScroll() {
        console.log('Testing auto-scroll with very long content');
        // Create a very long string
        let longContent = 'This is a very long line of content that should test the auto-scroll functionality. ';
        for (let i = 0; i < 50; i++) {
            longContent += `Line ${i + 1}: This is a very long line of content that should test the auto-scroll functionality. `;
        }
        out(longContent, 'info');
        // Add another long content after a delay
        setTimeout(() => {
            let anotherLongContent = 'Another very long content block: ';
            for (let i = 0; i < 30; i++) {
                anotherLongContent += `Another line ${i + 1} with lots of text to test scrolling. `;
            }
            out(anotherLongContent, 'success');
        }, 1000);
    }
    // Test function for loop-like content (simulating a big loop)
    function testLoopScroll() {
        console.log('Testing auto-scroll with loop-like content (simulating for i = 1 to 100)');
        // Simulate a loop that prints numbers 1 to 100
        for (let i = 1; i <= 100; i++) {
            setTimeout(() => {
                out(`${i}`, 'print'); // Use 'print' type to simulate print statements
            }, i * 10); // Small delay between each print
        }
        // Add a final message after the loop
        setTimeout(() => {
            out('Loop completed! This should be the last visible item.', 'success');
        }, 1100); // After all the loop iterations
    }
    // Test function for immediate live scrolling during loop execution
    function testLiveLoopScroll() {
        console.log('Testing LIVE auto-scroll during loop execution (simulating for i = 1 to 50)');
        // Simulate a faster loop that prints numbers 1 to 50 with immediate scrolling
        for (let i = 1; i <= 50; i++) {
            setTimeout(() => {
                out(`Loop iteration ${i}`, 'print'); // Use 'print' type to trigger immediate scroll
            }, i * 50); // 50ms delay between each print for visible live scrolling
        }
        // Add a final message after the loop
        setTimeout(() => {
            out('Live loop completed! You should have seen each iteration scroll immediately.', 'success');
        }, 2600); // After all the loop iterations
    }
    // Test function for stop button states
    function testStopButtonStates() {
        console.log('Testing stop button states...');
        // Test hidden state
        updateStopButtonState('hidden');
        setTimeout(() => {
            console.log('Testing normal state...');
            updateStopButtonState('normal');
        }, 1000);
        setTimeout(() => {
            console.log('Testing long-running state...');
            updateStopButtonState('long-running');
        }, 2000);
        setTimeout(() => {
            console.log('Testing critical state...');
            updateStopButtonState('critical');
        }, 3000);
        setTimeout(() => {
            console.log('Resetting to hidden state...');
            updateStopButtonState('hidden');
        }, 4000);
    }
    // Test function for long running execution simulation
    function testLongRunningExecution() {
        console.log('Testing long running execution detection...');
        // Simulate execution start
        isExecuting = true;
        startExecutionMonitoring();
        // Simulate a long running operation
        setTimeout(() => {
            console.log('Simulating execution completion...');
            isExecuting = false;
            stopExecutionMonitoring();
            updateStopButtonState('hidden');
        }, 6000); // 6 seconds to trigger long-running state
    }
    // Debug function to analyze scrollable elements
    function debugScrollElements() {
        console.log('=== SCROLL DEBUG ANALYSIS ===');
        // Check all potential scrollable elements
        const elements = [
            { name: 'outputConsole (output)', element: outputConsole },
            { name: 'consoleContent (.console-container)', element: consoleContent },
            { name: 'console-container', element: document.querySelector('.console-container') },
            { name: 'console-output', element: document.querySelector('.console-output') },
            { name: 'main-content', element: document.querySelector('.main-content') }
        ];
        elements.forEach(({ name, element }) => {
            if (element) {
                const computedStyle = window.getComputedStyle(element);
                const scrollHeight = element.scrollHeight;
                const clientHeight = element.clientHeight;
                const scrollTop = element.scrollTop;
                const maxScroll = scrollHeight - clientHeight;
                console.log(`\n--- ${name} ---`);
                console.log('Element:', element);
                console.log('scrollHeight:', scrollHeight);
                console.log('clientHeight:', clientHeight);
                console.log('scrollTop:', scrollTop);
                console.log('maxScroll:', maxScroll);
                console.log('overflow-y:', computedStyle.overflowY);
                console.log('overflow-x:', computedStyle.overflowX);
                console.log('position:', computedStyle.position);
                console.log('Can scroll:', scrollHeight > clientHeight);
                console.log('Is at bottom:', Math.abs(scrollTop - maxScroll) <= 1);
            }
            else {
                console.log(`\n--- ${name} ---`);
                console.log('Element not found!');
            }
        });
        // Check which element actually has scrollable content
        console.log('\n=== SCROLLABLE ELEMENT ANALYSIS ===');
        const scrollableElements = elements.filter(({ element }) => {
            if (!element)
                return false;
            return element.scrollHeight > element.clientHeight;
        });
        console.log('Scrollable elements found:', scrollableElements.length);
        scrollableElements.forEach(({ name, element }) => {
            if (element) {
                console.log(`- ${name}: scrollHeight=${element.scrollHeight}, clientHeight=${element.clientHeight}`);
            }
        });
        // Find the element with the most content
        const elementWithMostContent = elements.reduce((max, current) => {
            if (!current.element)
                return max;
            if (!max.element)
                return current;
            return current.element.scrollHeight > max.element.scrollHeight ? current : max;
        }, { name: 'none', element: null });
        console.log('\nElement with most content:', elementWithMostContent.name);
        if (elementWithMostContent.element) {
            console.log('This should be our scroll target!');
        }
    }
    // Make functions globally available for debugging
    window.toggleAutoScroll = toggleAutoScroll;
    window.scrollOutputToBottom = scrollOutputToBottom;
    window.scrollLastElementIntoView = scrollLastElementIntoView;
    window.testAutoScroll = testAutoScroll;
    window.testLongContentScroll = testLongContentScroll;
    window.testLoopScroll = testLoopScroll;
    window.testLiveLoopScroll = testLiveLoopScroll;
    window.testStopButtonStates = testStopButtonStates;
    window.testLongRunningExecution = testLongRunningExecution;
    window.scrollToVeryBottom = scrollToVeryBottom;
    window.forceImmediateScroll = forceImmediateScroll;
    window.performDebouncedScroll = performDebouncedScroll;
    window.performImmediateScroll = performImmediateScroll;
    window.debugScrollElements = debugScrollElements;
    window.updateStopButtonState = updateStopButtonState;
    window.startExecutionMonitoring = startExecutionMonitoring;
    window.stopExecutionMonitoring = stopExecutionMonitoring;
    window.applyUIVisibilitySettings = applyUIVisibilitySettings;
    window.loadSettings = loadSettings;
    window.saveSetting = saveSetting;
    window.applyTheme = applyTheme;
    window.updateThemeToggleButtonFromSettings = updateThemeToggleButtonFromSettings;
    window.formatPseudocode = formatPseudocode;
    // Test function for UI visibility settings
    window.testUIVisibility = function () {
        console.log('=== TESTING UI VISIBILITY ===');
        const settings = loadSettings();
        console.log('Current settings:', settings);
        // Test hiding run button
        settings.showRunButton = false;
        console.log('Setting showRunButton to false');
        applyUIVisibilitySettings(settings);
        // Test hiding file actions
        settings.showFileActions = false;
        console.log('Setting showFileActions to false');
        applyUIVisibilitySettings(settings);
    };
    // Test function to show all UI elements
    window.showAllUI = function () {
        console.log('=== SHOWING ALL UI ELEMENTS ===');
        const settings = loadSettings();
        settings.showFileActions = true;
        settings.showRunButton = true;
        settings.showThemeToggle = true;
        settings.showLayoutToggle = true;
        settings.showSettingsButton = true;
        settings.showEditorActions = true;
        settings.showEditorTitle = true;
        settings.showConsoleActions = true;
        settings.showConsoleStats = true;
        settings.showConsoleTitle = true;
        settings.showTabCounter = true;
        settings.showNewTabButton = true;
        applyUIVisibilitySettings(settings);
    };
    // Debug function to check CSS rules
    window.debugCSS = function (elementId) {
        const element = document.getElementById(elementId);
        if (!element) {
            console.log(`Element ${elementId} not found`);
            return;
        }
        console.log(`=== CSS DEBUG FOR ${elementId} ===`);
        console.log('Element:', element);
        console.log('Inline styles:', element.style.cssText);
        console.log('Computed styles:', window.getComputedStyle(element));
        console.log('Display:', window.getComputedStyle(element).display);
        console.log('Visibility:', window.getComputedStyle(element).visibility);
        console.log('Opacity:', window.getComputedStyle(element).opacity);
        console.log('Position:', window.getComputedStyle(element).position);
        console.log('Z-index:', window.getComputedStyle(element).zIndex);
        console.log('Transform:', window.getComputedStyle(element).transform);
        console.log('Is visible:', element.offsetParent !== null);
        console.log('Dimensions:', {
            width: element.offsetWidth,
            height: element.offsetHeight,
            clientWidth: element.clientWidth,
            clientHeight: element.clientHeight
        });
    };
    // Debug function to check current UI state
    window.checkUIState = function () {
        console.log('=== CURRENT UI STATE ===');
        const runButton = document.getElementById('btnRun');
        const fileActions = document.querySelector('.file-actions');
        console.log('Run button:');
        console.log('- Element found:', !!runButton);
        if (runButton) {
            console.log('- Display:', runButton.style.display);
            console.log('- Computed display:', window.getComputedStyle(runButton).display);
            console.log('- Visible:', runButton.offsetParent !== null);
        }
        console.log('File actions:');
        console.log('- Element found:', !!fileActions);
        if (fileActions) {
            console.log('- Display:', fileActions.style.display);
            console.log('- Computed display:', window.getComputedStyle(fileActions).display);
            console.log('- Visible:', fileActions.offsetParent !== null);
        }
        console.log('Current settings:', loadSettings());
    };
    // Function to apply console font size immediately
    function applyConsoleFontSizeImmediately(fontSize) {
        console.log('=== APPLYING CONSOLE FONT SIZE IMMEDIATELY ===');
        console.log('Font size to apply:', fontSize);
        // Method 1: Update CSS custom property
        document.documentElement.style.setProperty('--console-font-size', `${fontSize}px`);
        console.log('Set CSS custom property to:', `${fontSize}px`);
        // Method 2: Update or create style element
        let consoleStyleElement = document.getElementById('console-custom-styles');
        if (!consoleStyleElement) {
            consoleStyleElement = document.createElement('style');
            consoleStyleElement.id = 'console-custom-styles';
            document.head.appendChild(consoleStyleElement);
            console.log('Created new style element');
        }
        const css = `.console-output { font-size: ${fontSize}px !important; }`;
        consoleStyleElement.textContent = css;
        console.log('Updated style element with:', css);
        // Method 3: Apply to all existing console output elements
        const consoleOutputs = document.querySelectorAll('.console-output');
        console.log('Found console output elements:', consoleOutputs.length);
        consoleOutputs.forEach((element, index) => {
            const htmlElement = element;
            htmlElement.style.setProperty('font-size', `${fontSize}px`, 'important');
            console.log(`Applied to element ${index}:`, {
                element: htmlElement,
                inlineStyle: htmlElement.style.fontSize,
                computedStyle: window.getComputedStyle(htmlElement).fontSize
            });
        });
        // Method 3b: Apply to all existing console messages
        const consoleMessages = document.querySelectorAll('.console-message');
        console.log('Found console message elements:', consoleMessages.length);
        consoleMessages.forEach((element, index) => {
            const htmlElement = element;
            htmlElement.style.setProperty('font-size', `${fontSize}px`, 'important');
            console.log(`Applied to message ${index}:`, {
                element: htmlElement,
                inlineStyle: htmlElement.style.fontSize,
                computedStyle: window.getComputedStyle(htmlElement).fontSize
            });
        });
        // Method 4: Apply to console content as well
        const consoleContent = document.querySelector('.console-container');
        if (consoleContent) {
            consoleContent.style.setProperty('font-size', `${fontSize}px`, 'important');
            console.log('Applied to console content:', {
                inlineStyle: consoleContent.style.fontSize,
                computedStyle: window.getComputedStyle(consoleContent).fontSize
            });
        }
        // Method 5: Force a reflow to ensure styles are applied
        document.body.offsetHeight; // Force reflow
        console.log('Font size application completed');
    }
    // Debug function to test console settings
    window.testConsoleSettings = function () {
        console.log('=== TESTING CONSOLE SETTINGS ===');
        const consoleOutput = document.querySelector('.console-output');
        const consoleContent = document.querySelector('.console-container');
        console.log('Console output element:', consoleOutput);
        console.log('Console content element:', consoleContent);
        if (consoleOutput) {
            console.log('Current font size:', window.getComputedStyle(consoleOutput).fontSize);
            console.log('Current font family:', window.getComputedStyle(consoleOutput).fontFamily);
            console.log('Inline font size:', consoleOutput.style.fontSize);
            console.log('Inline font family:', consoleOutput.style.fontFamily);
            // Test setting font size
            consoleOutput.style.setProperty('font-size', '20px', 'important');
            console.log('Set font size to 20px, computed:', window.getComputedStyle(consoleOutput).fontSize);
        }
        console.log('Auto scroll enabled:', autoScrollEnabled);
        console.log('Global auto scroll enabled:', window.autoScrollEnabled);
    };
    // Test function to manually apply font size
    window.testFontSize = function (size) {
        console.log(`Testing font size: ${size}px`);
        applyConsoleFontSizeImmediately(size);
    };
    // Set up observer to watch for new console elements
    function setupConsoleFontObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const element = node;
                            if (element.classList.contains('console-output') ||
                                element.querySelector('.console-output')) {
                                console.log('New console element detected, applying font size');
                                const settings = loadSettings();
                                if (settings.consoleFontSize) {
                                    applyConsoleFontSizeImmediately(settings.consoleFontSize);
                                }
                            }
                        }
                    });
                }
            });
        });
        const consoleContainer = document.querySelector('.console-container');
        if (consoleContainer) {
            observer.observe(consoleContainer, {
                childList: true,
                subtree: true
            });
            console.log('Console font observer set up');
        }
    }
    // Initialize the observer
    setupConsoleFontObserver();
    // Start the initialization
    initializeUI();
    initializeFirstTab();
    setupKeyboardShortcuts();
    setupTooltips();
    setupQuickActions();
    // Setup theme toggle button
    function setupThemeToggleButton() {
        const themeToggle = document.getElementById('btnThemeToggle');
        if (!themeToggle) {
            console.log('Theme toggle button not found');
            return;
        }
        console.log('Setting up theme toggle button');
        themeToggle.addEventListener('click', () => {
            // Get current settings
            const currentSettings = loadSettings();
            const currentTheme = currentSettings.theme;
            console.log('Theme toggle clicked. Current theme:', currentTheme);
            // Determine next theme based on current theme
            let nextTheme;
            if (currentTheme === 'system') {
                // If system, toggle to light
                nextTheme = 'light';
            }
            else if (currentTheme === 'light') {
                // If light, toggle to dark
                nextTheme = 'dark';
            }
            else if (currentTheme === 'dark') {
                // If dark, toggle to system
                nextTheme = 'system';
            }
            else {
                // Fallback: toggle between light and dark
                const isDark = document.body.classList.contains('theme-dark');
                nextTheme = isDark ? 'light' : 'dark';
            }
            console.log('Switching to theme:', nextTheme);
            // Apply the new theme
            applyTheme(nextTheme);
            // Save the setting
            const updatedSettings = saveSetting('theme', nextTheme);
            console.log('Theme setting saved:', updatedSettings.theme);
            // Update the theme select in settings if it exists
            const themeSelect = document.getElementById('themeSelect');
            if (themeSelect) {
                themeSelect.value = nextTheme;
                console.log('Theme select updated to:', nextTheme);
            }
            // Update theme info
            const themeInfo = document.getElementById('themeInfo');
            if (themeInfo) {
                const displayTheme = nextTheme === 'system' ? 'System Theme' :
                    nextTheme === 'dark' ? 'Dark Theme' : 'Light Theme';
                themeInfo.textContent = displayTheme;
            }
            // Update theme toggle button appearance
            updateThemeToggleButtonFromSettings();
        });
        console.log('Theme toggle button setup complete');
    }
    // Initialize settings manager immediately when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        initializeSettings();
        setupThemeToggleButton();
    });
    // Also initialize after a delay as backup
    setTimeout(() => {
        initializeSettings();
        setupThemeToggleButton();
    }, 1000);
    // Add keyboard shortcuts for tab navigation
    document.addEventListener('keydown', (e) => {
        // Ctrl+Tab or Ctrl+PageDown - Next tab
        if ((e.ctrlKey && e.key === 'Tab') || (e.ctrlKey && e.key === 'PageDown')) {
            e.preventDefault();
            const tabs = Array.from(document.querySelectorAll('.modern-tab'));
            const activeTab = document.querySelector('.modern-tab.active');
            if (activeTab && tabs.length > 1) {
                const currentIndex = tabs.indexOf(activeTab);
                const nextIndex = (currentIndex + 1) % tabs.length;
                switchToTab(tabs[nextIndex]);
            }
        }
        // Ctrl+Shift+Tab or Ctrl+PageUp - Previous tab
        if ((e.ctrlKey && e.shiftKey && e.key === 'Tab') || (e.ctrlKey && e.key === 'PageUp')) {
            e.preventDefault();
            const tabs = Array.from(document.querySelectorAll('.modern-tab'));
            const activeTab = document.querySelector('.modern-tab.active');
            if (activeTab && tabs.length > 1) {
                const currentIndex = tabs.indexOf(activeTab);
                const prevIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
                switchToTab(tabs[prevIndex]);
            }
        }
        // Ctrl+W - Close current tab
        if (e.ctrlKey && e.key === 'w') {
            e.preventDefault();
            const activeTab = document.querySelector('.modern-tab.active');
            if (activeTab) {
                closeTabElement(activeTab);
            }
        }
        // Ctrl+T - New tab
        if (e.ctrlKey && e.key === 't') {
            e.preventDefault();
            createNewTab();
        }
        // Ctrl+C or Escape - Stop execution
        if (isExecuting && ((e.ctrlKey && e.key === 'c') || e.key === 'Escape')) {
            e.preventDefault();
            stopExecution();
        }
    });
});
//# sourceMappingURL=app.js.map