/**
 * Reading Controls for Tutorial Hub lessons
 * Provides text size, line height, width, and focus mode controls
 */

class ReadingControls {
    constructor() {
        this.fontSize = parseInt(localStorage.getItem('lesson-font-size')) || 16;
        this.lineHeight = parseFloat(localStorage.getItem('lesson-line-height')) || 1.8;
        this.contentWidth = localStorage.getItem('lesson-content-width') || 'medium';
        this.focusMode = false;
        
        this.init();
    }

    init() {
        this.createControlPanel();
        this.applySettings();
        this.attachEventListeners();
    }

    createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'reading-controls';
        panel.className = 'reading-controls';
        panel.innerHTML = `
            <button class="control-toggle" id="controlToggle" title="Reading Controls">
                <i class="ri-settings-3-line"></i>
            </button>
            
            <div class="control-panel" id="controlPanel">
                <div class="control-header">
                    <span>Reading Controls</span>
                    <button class="control-close" id="controlClose">
                        <i class="ri-close-line"></i>
                    </button>
                </div>
                
                <div class="control-section">
                    <label class="control-label">
                        <i class="ri-font-size-2"></i>
                        Text Size
                    </label>
                    <div class="control-buttons">
                        <button class="control-btn" id="decreaseFontSize" title="Decrease">
                            <i class="ri-subtract-line"></i>
                        </button>
                        <span class="control-value" id="fontSizeValue">${this.fontSize}px</span>
                        <button class="control-btn" id="increaseFontSize" title="Increase">
                            <i class="ri-add-line"></i>
                        </button>
                        <button class="control-btn control-reset" id="resetFontSize" title="Reset">
                            <i class="ri-restart-line"></i>
                        </button>
                    </div>
                </div>

                <div class="control-section">
                    <label class="control-label">
                        <i class="ri-line-height"></i>
                        Line Height
                    </label>
                    <div class="control-buttons">
                        <button class="control-btn" id="decreaseLineHeight" title="Decrease">
                            <i class="ri-subtract-line"></i>
                        </button>
                        <span class="control-value" id="lineHeightValue">${this.lineHeight}</span>
                        <button class="control-btn" id="increaseLineHeight" title="Increase">
                            <i class="ri-add-line"></i>
                        </button>
                        <button class="control-btn control-reset" id="resetLineHeight" title="Reset">
                            <i class="ri-restart-line"></i>
                        </button>
                    </div>
                </div>

                <div class="control-section">
                    <label class="control-label">
                        <i class="ri-layout-column-line"></i>
                        Content Width
                    </label>
                    <div class="control-buttons width-buttons">
                        <button class="control-btn width-btn ${this.contentWidth === 'narrow' ? 'active' : ''}" data-width="narrow">
                            Narrow
                        </button>
                        <button class="control-btn width-btn ${this.contentWidth === 'medium' ? 'active' : ''}" data-width="medium">
                            Medium
                        </button>
                        <button class="control-btn width-btn ${this.contentWidth === 'wide' ? 'active' : ''}" data-width="wide">
                            Wide
                        </button>
                    </div>
                </div>

                <div class="control-section">
                    <label class="control-label">
                        <i class="ri-focus-3-line"></i>
                        View Mode
                    </label>
                    <div class="control-buttons">
                        <button class="control-btn action-btn" id="focusMode">
                            <i class="ri-focus-3-line"></i>
                            Focus Mode
                        </button>
                        <button class="control-btn action-btn" id="printLesson">
                            <i class="ri-printer-line"></i>
                            Print
                        </button>
                    </div>
                </div>

                <div class="control-footer">
                    <button class="control-btn reset-all" id="resetAll">
                        <i class="ri-refresh-line"></i>
                        Reset All
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
    }

    attachEventListeners() {
        // Toggle panel
        document.getElementById('controlToggle').addEventListener('click', () => {
            document.getElementById('controlPanel').classList.toggle('active');
        });

        document.getElementById('controlClose').addEventListener('click', () => {
            document.getElementById('controlPanel').classList.remove('active');
        });

        // Font size controls
        document.getElementById('decreaseFontSize').addEventListener('click', () => {
            this.changeFontSize(-1);
        });

        document.getElementById('increaseFontSize').addEventListener('click', () => {
            this.changeFontSize(1);
        });

        document.getElementById('resetFontSize').addEventListener('click', () => {
            this.fontSize = 16;
            this.applySettings();
            this.saveSettings();
        });

        // Line height controls
        document.getElementById('decreaseLineHeight').addEventListener('click', () => {
            this.changeLineHeight(-0.1);
        });

        document.getElementById('increaseLineHeight').addEventListener('click', () => {
            this.changeLineHeight(0.1);
        });

        document.getElementById('resetLineHeight').addEventListener('click', () => {
            this.lineHeight = 1.8;
            this.applySettings();
            this.saveSettings();
        });

        // Width controls
        document.querySelectorAll('.width-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const width = e.target.closest('.width-btn').dataset.width;
                this.changeContentWidth(width);
            });
        });

        // Focus mode
        document.getElementById('focusMode').addEventListener('click', () => {
            this.toggleFocusMode();
        });

        // Print
        document.getElementById('printLesson').addEventListener('click', () => {
            window.print();
        });

        // Reset all
        document.getElementById('resetAll').addEventListener('click', () => {
            this.resetAll();
        });

        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            const panel = document.getElementById('controlPanel');
            const toggle = document.getElementById('controlToggle');
            if (!panel.contains(e.target) && !toggle.contains(e.target)) {
                panel.classList.remove('active');
            }
        });
    }

    changeFontSize(delta) {
        this.fontSize = Math.max(12, Math.min(24, this.fontSize + delta));
        this.applySettings();
        this.saveSettings();
    }

    changeLineHeight(delta) {
        this.lineHeight = Math.max(1.2, Math.min(2.5, parseFloat((this.lineHeight + delta).toFixed(1))));
        this.applySettings();
        this.saveSettings();
    }

    changeContentWidth(width) {
        this.contentWidth = width;
        document.querySelectorAll('.width-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.width === width);
        });
        this.applySettings();
        this.saveSettings();
    }

    toggleFocusMode() {
        this.focusMode = !this.focusMode;
        const navbar = document.querySelector('nav');
        const footer = document.querySelector('footer');
        const body = document.body;
        
        if (this.focusMode) {
            navbar?.classList.add('hidden-focus');
            footer?.classList.add('hidden-focus');
            body.classList.add('focus-mode-active');
            document.getElementById('focusMode').innerHTML = '<i class="ri-close-circle-line"></i> Exit Focus';
        } else {
            navbar?.classList.remove('hidden-focus');
            footer?.classList.remove('hidden-focus');
            body.classList.remove('focus-mode-active');
            document.getElementById('focusMode').innerHTML = '<i class="ri-focus-3-line"></i> Focus Mode';
        }
    }

    applySettings() {
        const content = document.querySelector('.tutorial-body');
        if (content) {
            content.style.fontSize = `${this.fontSize}px`;
            content.style.lineHeight = this.lineHeight;
        }

        const container = document.querySelector('.tutorial-container');
        if (container) {
            container.classList.remove('width-narrow', 'width-medium', 'width-wide');
            container.classList.add(`width-${this.contentWidth}`);
        }

        // Update display values
        document.getElementById('fontSizeValue').textContent = `${this.fontSize}px`;
        document.getElementById('lineHeightValue').textContent = this.lineHeight.toFixed(1);
    }

    saveSettings() {
        localStorage.setItem('lesson-font-size', this.fontSize);
        localStorage.setItem('lesson-line-height', this.lineHeight);
        localStorage.setItem('lesson-content-width', this.contentWidth);
    }

    resetAll() {
        this.fontSize = 16;
        this.lineHeight = 1.8;
        this.contentWidth = 'medium';
        this.applySettings();
        this.saveSettings();
        
        document.querySelectorAll('.width-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.width === 'medium');
        });
    }
}

// Initialize reading controls when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ReadingControls();
    });
} else {
    new ReadingControls();
}
