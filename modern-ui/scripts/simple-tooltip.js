/**
 * Simple Tooltip System
 * Shows button text on hover
 */

class SimpleTooltip {
    constructor() {
        this.tooltip = null;
        this.currentTarget = null;
        this.showTimeout = null;
        this.hideTimeout = null;
        
        this.init();
    }

    init() {
        // Create tooltip element
        this.createTooltipElement();
        
        // Bind events
        this.bindEvents();
        
        // Initialize tooltips for existing buttons
        this.initializeTooltips();
    }

    createTooltipElement() {
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'modern-tooltip';
        document.body.appendChild(this.tooltip);
    }

    bindEvents() {
        // Mouse events
        document.addEventListener('mouseover', this.handleMouseOver.bind(this));
        document.addEventListener('mouseout', this.handleMouseOut.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    }

    initializeTooltips() {
        // Find all modern buttons
        const buttons = document.querySelectorAll('.modern-btn');
        
        buttons.forEach(button => {
            // Get button text
            const buttonText = this.getButtonText(button);
            if (buttonText && buttonText.trim()) {
                button.setAttribute('data-tooltip-text', buttonText);
                button.classList.add('tooltip-trigger');
            }
        });
        
        // Watch for dynamically added buttons
        this.observeDynamicElements();
    }
    
    observeDynamicElements() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check if the added node is a modern button
                        if (node.classList && node.classList.contains('modern-btn')) {
                            const buttonText = this.getButtonText(node);
                            if (buttonText && buttonText.trim()) {
                                node.setAttribute('data-tooltip-text', buttonText);
                                node.classList.add('tooltip-trigger');
                            }
                        }
                        
                        // Check for child modern buttons
                        const childButtons = node.querySelectorAll ? node.querySelectorAll('.modern-btn') : [];
                        childButtons.forEach(button => {
                            const buttonText = this.getButtonText(button);
                            if (buttonText && buttonText.trim()) {
                                button.setAttribute('data-tooltip-text', buttonText);
                                button.classList.add('tooltip-trigger');
                            }
                        });
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    getButtonText(button) {
        // Get text from span elements
        const span = button.querySelector('span');
        if (span && span.textContent.trim()) {
            return span.textContent.trim();
        }
        
        // Get text from aria-label (for icon-only buttons)
        const ariaLabel = button.getAttribute('aria-label');
        if (ariaLabel && ariaLabel.trim()) {
            return ariaLabel.trim();
        }
        
        // Get text from button content
        const text = button.textContent.trim();
        if (text) {
            return text;
        }
        
        // Get text from title attribute
        const title = button.getAttribute('title');
        if (title && title.trim()) {
            return title.trim();
        }
        
        return '';
    }

    handleMouseOver(event) {
        const target = event.target.closest('.tooltip-trigger');
        if (!target) return;

        this.currentTarget = target;
        this.showTooltip(target);
    }

    handleMouseOut(event) {
        const target = event.target.closest('.tooltip-trigger');
        if (!target) return;

        this.hideTooltip();
    }

    handleMouseMove(event) {
        if (this.currentTarget) {
            this.updateTooltipPosition(event);
        }
    }

    showTooltip(target) {
        const tooltipText = target.getAttribute('data-tooltip-text');
        if (!tooltipText) return;

        // Clear any existing timeouts
        this.clearTimeouts();

        // Set tooltip content
        this.tooltip.textContent = tooltipText;

        // Position tooltip
        this.positionTooltip(target);

        // Show tooltip with delay
        this.showTimeout = setTimeout(() => {
            this.tooltip.classList.add('show');
        }, 300);
    }

    hideTooltip() {
        this.clearTimeouts();
        
        this.tooltip.classList.remove('show');
        this.currentTarget = null;
    }

    updateTooltipPosition(event) {
        if (!this.currentTarget) return;

        const rect = this.currentTarget.getBoundingClientRect();
        const tooltipRect = this.tooltip.getBoundingClientRect();
        
        let top = rect.top - tooltipRect.height - 10;
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);

        // Ensure tooltip stays within viewport
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        // Adjust horizontal position
        if (left < 10) left = 10;
        if (left + tooltipRect.width > viewport.width - 10) {
            left = viewport.width - tooltipRect.width - 10;
        }

        // Adjust vertical position
        if (top < 10) {
            top = rect.bottom + 10;
        }

        this.tooltip.style.top = `${top}px`;
        this.tooltip.style.left = `${left}px`;
    }

    positionTooltip(target) {
        const rect = target.getBoundingClientRect();
        const tooltipRect = this.tooltip.getBoundingClientRect();
        
        let top = rect.top - tooltipRect.height - 10;
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);

        // Ensure tooltip stays within viewport
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        // Adjust horizontal position
        if (left < 10) left = 10;
        if (left + tooltipRect.width > viewport.width - 10) {
            left = viewport.width - tooltipRect.width - 10;
        }

        // Adjust vertical position
        if (top < 10) {
            top = rect.bottom + 10;
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
}

// Initialize tooltip system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.simpleTooltip = new SimpleTooltip();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SimpleTooltip;
}
