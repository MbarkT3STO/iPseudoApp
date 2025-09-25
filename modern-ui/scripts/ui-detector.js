// ===== UI DETECTOR =====
// Detects user's preferred UI and redirects accordingly

class UIDetector {
    constructor() {
        this.preferredUI = this.getPreferredUI();
        this.currentUI = this.detectCurrentUI();
        this.init();
    }

    // Get user's preferred UI from localStorage
    getPreferredUI() {
        try {
            const stored = localStorage.getItem('preferredUI');
            return stored || 'modern'; // Default to modern UI
        } catch (error) {
            console.warn('Error reading UI preference:', error);
            return 'modern';
        }
    }

    // Detect which UI we're currently in
    detectCurrentUI() {
        const path = window.location.pathname;
        const href = window.location.href;
        
        console.log('Detecting current UI from path:', path);
        console.log('Full href:', href);
        
        // Check for modern UI
        if (path.includes('modern-ui') || href.includes('modern-ui')) {
            console.log('Detected Modern UI');
            return 'modern';
        }
        
        // Check for classic UI
        if (path.includes('src/renderer') || path.includes('dist/renderer') || href.includes('src/renderer') || href.includes('dist/renderer')) {
            console.log('Detected Classic UI');
            return 'classic';
        }
        
        console.log('UI detection unknown');
        return 'unknown';
    }

    // Initialize UI detection and redirection
    init() {
        console.log('UI Detector initialized');
        console.log('Preferred UI:', this.preferredUI);
        console.log('Current UI:', this.currentUI);
        
        // Add a small delay to ensure the page is fully loaded
        setTimeout(() => {
            // Only redirect if we're not already in the preferred UI
            if (this.preferredUI !== this.currentUI && this.currentUI !== 'unknown') {
                console.log('UI mismatch detected, redirecting...');
                this.redirectToPreferredUI();
            } else {
                console.log('UI matches preference or unknown, no redirect needed');
            }
        }, 100);
    }

    // Redirect to the preferred UI
    redirectToPreferredUI() {
        console.log(`Redirecting from ${this.currentUI} UI to ${this.preferredUI} UI`);
        
        // Show a brief loading message
        this.showLoadingMessage();
        
        // Redirect after a short delay to show the loading message
        setTimeout(() => {
            try {
                let redirectUrl = '';
                
                if (this.preferredUI === 'modern') {
                    // Redirect to modern UI
                    if (window.location.pathname.includes('src/renderer') || window.location.pathname.includes('dist/renderer')) {
                        // From classic UI to modern UI
                        redirectUrl = '../../modern-ui/index.html';
                    } else {
                        // From root to modern UI
                        redirectUrl = 'modern-ui/index.html';
                    }
                } else if (this.preferredUI === 'classic') {
                    // Redirect to classic UI
                    if (window.location.pathname.includes('modern-ui')) {
                        // From modern UI to classic UI
                        redirectUrl = '../src/renderer/index.html';
                    } else {
                        // From root to classic UI
                        redirectUrl = 'src/renderer/index.html';
                    }
                }
                
                console.log('Redirecting to:', redirectUrl);
                window.location.href = redirectUrl;
            } catch (error) {
                console.error('Error during redirect:', error);
                // Fallback: try to reload the page
                window.location.reload();
            }
        }, 1000);
    }

    // Show loading message during redirect
    showLoadingMessage() {
        // Create loading overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        const message = document.createElement('div');
        message.style.cssText = `
            text-align: center;
            padding: 2rem;
        `;

        const icon = document.createElement('div');
        icon.style.cssText = `
            font-size: 3rem;
            margin-bottom: 1rem;
            animation: spin 1s linear infinite;
        `;
        icon.innerHTML = '🔄';

        const text = document.createElement('div');
        text.style.cssText = `
            font-size: 1.2rem;
            font-weight: 500;
            margin-bottom: 0.5rem;
        `;
        text.textContent = `Switching to ${this.preferredUI === 'modern' ? 'Modern' : 'Classic'} UI...`;

        const subtext = document.createElement('div');
        subtext.style.cssText = `
            font-size: 0.9rem;
            opacity: 0.7;
        `;
        subtext.textContent = 'Please wait while we load your preferred interface';

        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        message.appendChild(icon);
        message.appendChild(text);
        message.appendChild(subtext);
        overlay.appendChild(message);
        document.body.appendChild(overlay);
    }

    // Method to change UI preference
    setPreferredUI(ui) {
        try {
            localStorage.setItem('preferredUI', ui);
            this.preferredUI = ui;
            console.log(`UI preference changed to: ${ui}`);
        } catch (error) {
            console.error('Error saving UI preference:', error);
        }
    }

    // Method to get current UI preference
    getCurrentPreference() {
        return this.preferredUI;
    }

    // Method to check if we should redirect
    shouldRedirect() {
        return this.preferredUI !== this.currentUI && this.currentUI !== 'unknown';
    }
}

// Initialize UI detector when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.uiDetector = new UIDetector();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIDetector;
}
