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
        this.nightMode = localStorage.getItem('night-reading-mode') === 'true';
        
        this.init();
    }

    init() {
        this.createControlPanel();
        this.applySettings();
        this.attachEventListeners();
        this.applyNightMode();
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
                        <button class="control-btn action-btn" id="nightMode">
                            <i class="ri-moon-clear-line"></i>
                            Night Mode
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

        // Night mode
        document.getElementById('nightMode').addEventListener('click', () => {
            this.toggleNightMode();
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
        // Apply font size and line height to all content elements
        const content = document.querySelector('.tutorial-body');
        if (content) {
            content.style.fontSize = `${this.fontSize}px`;
            content.style.lineHeight = this.lineHeight;
        }

        // Apply to paragraphs
        document.querySelectorAll('.tutorial-body p').forEach(p => {
            p.style.fontSize = `${this.fontSize}px`;
            p.style.lineHeight = this.lineHeight;
        });

        // Apply to list items
        document.querySelectorAll('.tutorial-body li').forEach(li => {
            li.style.fontSize = `${this.fontSize}px`;
            li.style.lineHeight = this.lineHeight;
        });

        // Apply to headings with relative sizing
        document.querySelectorAll('.tutorial-body h2').forEach(h => {
            h.style.fontSize = `${this.fontSize * 1.875}px`; // 2rem equivalent
        });

        document.querySelectorAll('.tutorial-body h3').forEach(h => {
            h.style.fontSize = `${this.fontSize * 1.5}px`; // 1.5rem equivalent
        });

        document.querySelectorAll('.tutorial-body h4').forEach(h => {
            h.style.fontSize = `${this.fontSize * 1.25}px`; // 1.25rem equivalent
        });

        // Apply to note boxes
        document.querySelectorAll('.note-box-content').forEach(note => {
            note.style.fontSize = `${this.fontSize}px`;
            note.style.lineHeight = this.lineHeight;
        });

        // Apply to example boxes
        document.querySelectorAll('.example-box p, .example-box li').forEach(el => {
            el.style.fontSize = `${this.fontSize}px`;
            el.style.lineHeight = this.lineHeight;
        });

        // Apply to exercise items
        document.querySelectorAll('.exercise-item-description').forEach(desc => {
            desc.style.fontSize = `${this.fontSize}px`;
            desc.style.lineHeight = this.lineHeight;
        });

        // Apply to tutorial meta description
        const tutorialMeta = document.querySelector('.level-description');
        if (tutorialMeta) {
            tutorialMeta.style.fontSize = `${this.fontSize * 1.125}px`; // Slightly larger
            tutorialMeta.style.lineHeight = this.lineHeight;
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

    toggleNightMode() {
        this.nightMode = !this.nightMode;
        localStorage.setItem('night-reading-mode', this.nightMode);
        this.applyNightMode();
        
        const btn = document.getElementById('nightMode');
        if (this.nightMode) {
            btn.innerHTML = '<i class="ri-moon-clear-fill"></i> Night Mode';
            btn.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))';
            btn.style.borderColor = 'rgba(59, 130, 246, 0.4)';
        } else {
            btn.innerHTML = '<i class="ri-moon-clear-line"></i> Night Mode';
            btn.style.background = '';
            btn.style.borderColor = '';
        }
    }

    applyNightMode() {
        if (this.nightMode) {
            document.documentElement.setAttribute('data-reading-mode', 'night');
        } else {
            document.documentElement.removeAttribute('data-reading-mode');
        }
    }

    resetAll() {
        this.fontSize = 16;
        this.lineHeight = 1.8;
        this.contentWidth = 'medium';
        this.nightMode = false;
        this.applySettings();
        this.applyNightMode();
        this.saveSettings();
        localStorage.setItem('night-reading-mode', 'false');
        
        document.querySelectorAll('.width-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.width === 'medium');
        });
        
        const nightBtn = document.getElementById('nightMode');
        if (nightBtn) {
            nightBtn.innerHTML = '<i class="ri-moon-clear-line"></i> Night Mode';
            nightBtn.style.background = '';
            nightBtn.style.borderColor = '';
        }
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
