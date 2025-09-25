/**
 * Modern Tooltip System
 * Custom tooltip implementation for the modern UI
 */

class ModernTooltip {
    constructor() {
        this.tooltip = null;
        this.currentTarget = null;
        this.showTimeout = null;
        this.hideTimeout = null;
        this.isVisible = false;
        
        this.init();
    }

    init() {
        // Create tooltip element
        this.createTooltipElement();
        
        // Bind events
        this.bindEvents();
        
        // Initialize tooltips for existing elements
        this.initializeTooltips();
    }

    createTooltipElement() {
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'modern-tooltip';
        this.tooltip.setAttribute('data-position', 'top');
        this.tooltip.setAttribute('data-theme', 'default');
        document.body.appendChild(this.tooltip);
    }

    bindEvents() {
        // Mouse events
        document.addEventListener('mouseover', this.handleMouseOver.bind(this));
        document.addEventListener('mouseout', this.handleMouseOut.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        
        // Focus events for keyboard navigation
        document.addEventListener('focusin', this.handleFocusIn.bind(this));
        document.addEventListener('focusout', this.handleFocusOut.bind(this));
        
        // Prevent tooltip from interfering with clicks
        this.tooltip.addEventListener('click', (e) => e.preventDefault());
    }

    initializeTooltips() {
        // Find all elements with title attributes
        const elementsWithTooltips = document.querySelectorAll('[title]');
        
        elementsWithTooltips.forEach(element => {
            // Store original title
            const originalTitle = element.getAttribute('title');
            if (originalTitle && originalTitle.trim()) {
                element.setAttribute('data-tooltip-text', originalTitle);
                
                // Remove title to prevent native tooltip
                element.removeAttribute('title');
                
                // Add tooltip trigger class
                element.classList.add('tooltip-trigger');
            }
        });
        
        // Also initialize for dynamically created elements
        this.observeDynamicElements();
    }
    
    observeDynamicElements() {
        // Create a MutationObserver to watch for dynamically added elements
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check if the added node has title attribute
                        if (node.hasAttribute && node.hasAttribute('title')) {
                            const originalTitle = node.getAttribute('title');
                            if (originalTitle && originalTitle.trim()) {
                                node.setAttribute('data-tooltip-text', originalTitle);
                                node.removeAttribute('title');
                                node.classList.add('tooltip-trigger');
                            }
                        }
                        
                        // Check for child elements with title attributes
                        const childElements = node.querySelectorAll ? node.querySelectorAll('[title]') : [];
                        childElements.forEach(element => {
                            const originalTitle = element.getAttribute('title');
                            if (originalTitle && originalTitle.trim()) {
                                element.setAttribute('data-tooltip-text', originalTitle);
                                element.removeAttribute('title');
                                element.classList.add('tooltip-trigger');
                            }
                        });
                    }
                });
            });
        });
        
        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    handleMouseOver(event) {
        const target = event.target.closest('.tooltip-trigger, [data-tooltip-text]');
        if (!target) return;

        this.currentTarget = target;
        this.showTooltip(target, event);
    }

    handleMouseOut(event) {
        const target = event.target.closest('.tooltip-trigger, [data-tooltip-text]');
        if (!target) return;

        this.hideTooltip();
    }

    handleMouseMove(event) {
        if (this.isVisible && this.currentTarget) {
            this.updateTooltipPosition(event);
        }
    }

    handleFocusIn(event) {
        const target = event.target.closest('.tooltip-trigger, [data-tooltip-text]');
        if (!target) return;

        this.currentTarget = target;
        this.showTooltip(target, event, 'focus');
    }

    handleFocusOut(event) {
        const target = event.target.closest('.tooltip-trigger, [data-tooltip-text]');
        if (!target) return;

        this.hideTooltip();
    }

    showTooltip(target, event, trigger = 'hover') {
        const tooltipText = target.getAttribute('data-tooltip-text') || target.getAttribute('title');
        if (!tooltipText) return;

        // Clear any existing timeouts
        this.clearTimeouts();

        // Set tooltip content
        this.tooltip.textContent = tooltipText;

        // Determine tooltip theme based on button type
        const theme = this.getTooltipTheme(target);
        this.tooltip.setAttribute('data-theme', theme);

        // Determine tooltip position
        const position = this.getTooltipPosition(target, event);
        this.tooltip.setAttribute('data-position', position);

        // Position tooltip
        this.positionTooltip(target, position);

        // Show tooltip with delay for hover, immediately for focus
        const delay = trigger === 'focus' ? 0 : 500;
        
        this.showTimeout = setTimeout(() => {
            this.tooltip.classList.add('show');
            this.tooltip.classList.add('animate-in');
            this.isVisible = true;
        }, delay);
    }

    hideTooltip() {
        this.clearTimeouts();
        
        if (this.isVisible) {
            this.tooltip.classList.remove('show');
            this.tooltip.classList.remove('animate-in');
            this.tooltip.classList.add('animate-out');
            
            this.hideTimeout = setTimeout(() => {
                this.tooltip.classList.remove('animate-out');
                this.isVisible = false;
                this.currentTarget = null;
            }, 300);
        }
    }

    updateTooltipPosition(event) {
        if (!this.isVisible || !this.currentTarget) return;

        const position = this.getTooltipPosition(this.currentTarget, event);
        this.tooltip.setAttribute('data-position', position);
        this.positionTooltip(this.currentTarget, position);
    }

    getTooltipTheme(target) {
        // Check for custom theme attribute first
        const customTheme = target.getAttribute('data-tooltip-theme');
        if (customTheme) return customTheme;
        
        // Determine theme based on button classes
        if (target.classList.contains('modern-btn-run')) return 'primary';
        if (target.classList.contains('modern-btn-stop')) return 'error';
        if (target.classList.contains('modern-btn-primary')) return 'primary';
        if (target.classList.contains('modern-btn-secondary')) return 'default';
        if (target.classList.contains('modern-btn-icon')) return 'default';
        
        // Check for specific button IDs
        const buttonId = target.id;
        if (buttonId === 'btnRun') return 'primary';
        if (buttonId === 'btnStop') return 'error';
        if (buttonId === 'btnSave') return 'success';
        if (buttonId === 'btnOpen') return 'primary';
        if (buttonId === 'btnNew') return 'primary';
        if (buttonId === 'btnFormat') return 'primary';
        if (buttonId === 'btnMinimap') return 'default';
        if (buttonId === 'btnWordWrap') return 'default';
        if (buttonId === 'clearConsole') return 'warning';
        if (buttonId === 'btnCopyOutput') return 'primary';
        if (buttonId === 'btnSaveOutput') return 'success';
        if (buttonId === 'btnThemeToggle') return 'default';
        if (buttonId === 'layoutToggle') return 'default';
        if (buttonId === 'btnClassicUI') return 'default';
        if (buttonId === 'btnSettings') return 'default';
        if (buttonId === 'btnNewTab') return 'primary';
        
        return 'default';
    }

    getTooltipPosition(target, event) {
        // Check for custom position attribute first
        const customPosition = target.getAttribute('data-tooltip-position');
        if (customPosition) return customPosition;
        
        const rect = target.getBoundingClientRect();
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        // Default to top, but adjust based on available space
        let position = 'top';

        // Check if there's enough space above
        if (rect.top < 100) {
            position = 'bottom';
        }

        // Check if there's enough space on the right
        if (rect.left < 200 && rect.right > viewport.width - 200) {
            position = 'left';
        }

        // Check if there's enough space on the left
        if (rect.right > viewport.width - 200 && rect.left < 200) {
            position = 'right';
        }

        return position;
    }

    positionTooltip(target, position) {
        const rect = target.getBoundingClientRect();
        const tooltipRect = this.tooltip.getBoundingClientRect();
        const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        
        let top, left;

        switch (position) {
            case 'top':
                top = rect.top + scrollY - tooltipRect.height - 8;
                left = rect.left + scrollX + (rect.width / 2) - (tooltipRect.width / 2);
                break;
            case 'bottom':
                top = rect.bottom + scrollY + 8;
                left = rect.left + scrollX + (rect.width / 2) - (tooltipRect.width / 2);
                break;
            case 'left':
                top = rect.top + scrollY + (rect.height / 2) - (tooltipRect.height / 2);
                left = rect.left + scrollX - tooltipRect.width - 8;
                break;
            case 'right':
                top = rect.top + scrollY + (rect.height / 2) - (tooltipRect.height / 2);
                left = rect.right + scrollX + 8;
                break;
        }

        // Ensure tooltip stays within viewport
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        // Adjust horizontal position
        if (left < 8) left = 8;
        if (left + tooltipRect.width > viewport.width - 8) {
            left = viewport.width - tooltipRect.width - 8;
        }

        // Adjust vertical position
        if (top < 8) top = 8;
        if (top + tooltipRect.height > viewport.height - 8) {
            top = viewport.height - tooltipRect.height - 8;
        }

        this.tooltip.style.top = `${top}px`;
        this.tooltip.style.left = `${left}px`;
    }

    clearTimeouts() {
        if (this.showTimeout) {
            clearTimeout(this.showTimeout);
            this.showTimeout = null;
        }
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
    }

    // Public method to manually show tooltip
    show(target, text, options = {}) {
        if (typeof target === 'string') {
            target = document.querySelector(target);
        }
        
        if (!target) return;

        target.setAttribute('data-tooltip-text', text);
        target.classList.add('tooltip-trigger');
        
        this.currentTarget = target;
        this.showTooltip(target, { target }, 'manual');
    }

    // Public method to manually hide tooltip
    hide() {
        this.hideTooltip();
    }

    // Public method to update tooltip text
    update(target, text) {
        if (typeof target === 'string') {
            target = document.querySelector(target);
        }
        
        if (!target) return;

        target.setAttribute('data-tooltip-text', text);
        
        if (this.currentTarget === target && this.isVisible) {
            this.tooltip.textContent = text;
        }
    }

    // Public method to destroy tooltip system
    destroy() {
        this.clearTimeouts();
        
        if (this.tooltip && this.tooltip.parentNode) {
            this.tooltip.parentNode.removeChild(this.tooltip);
        }
        
        // Restore original titles
        const elements = document.querySelectorAll('.tooltip-trigger');
        elements.forEach(element => {
            const tooltipText = element.getAttribute('data-tooltip-text');
            if (tooltipText) {
                element.setAttribute('title', tooltipText);
                element.removeAttribute('data-tooltip-text');
                element.classList.remove('tooltip-trigger');
            }
        });
    }
}

// Initialize tooltip system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.modernTooltip = new ModernTooltip();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModernTooltip;
}
