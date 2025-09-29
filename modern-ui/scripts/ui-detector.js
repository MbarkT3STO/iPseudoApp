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
        
        // Redirect after showing the loading message (reduced delay for faster experience)
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
        }, 800); // Reduced from 1000ms to 800ms for faster experience
    }

    // Show modern loading message during redirect
    showLoadingMessage() {
        // Create modern loading overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
                radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 70% 80%, rgba(139, 92, 246, 0.12) 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.8) 100%);
            backdrop-filter: blur(24px) saturate(200%) brightness(0.9);
            -webkit-backdrop-filter: blur(24px) saturate(200%) brightness(0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            color: white;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            animation: overlayPulse 3s ease-in-out infinite alternate;
        `;

        // Create modern loading card
        const card = document.createElement('div');
        card.style.cssText = `
            background: 
                linear-gradient(135deg, 
                    rgba(255, 255, 255, 0.25) 0%, 
                    rgba(255, 255, 255, 0.1) 50%,
                    rgba(255, 255, 255, 0.15) 100%);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 24px;
            padding: 3rem 2.5rem;
            text-align: center;
            max-width: 400px;
            width: 90%;
            position: relative;
            overflow: hidden;
            backdrop-filter: blur(32px) saturate(200%) brightness(1.1);
            -webkit-backdrop-filter: blur(32px) saturate(200%) brightness(1.1);
            box-shadow: 
                0 40px 80px rgba(0, 0, 0, 0.5),
                0 20px 40px rgba(0, 0, 0, 0.3),
                0 10px 20px rgba(0, 0, 0, 0.2),
                inset 0 2px 0 rgba(255, 255, 255, 0.3),
                inset 0 -2px 0 rgba(0, 0, 0, 0.1);
            transform: scale(0.9) translateY(20px);
            opacity: 0;
            animation: cardEntrance 0.6s ease-out forwards, cardFloat 4s ease-in-out infinite 0.6s;
        `;

        // Add animated background
        const background = document.createElement('div');
        background.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
                radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 60%),
                radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.12) 0%, transparent 60%),
                radial-gradient(circle at 50% 10%, rgba(16, 185, 129, 0.08) 0%, transparent 50%);
            pointer-events: none;
            z-index: 0;
            animation: backgroundGlow 3s ease-in-out infinite alternate;
        `;

        // Create modern icon container
        const iconContainer = document.createElement('div');
        iconContainer.style.cssText = `
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: 
                linear-gradient(135deg, 
                    rgba(59, 130, 246, 0.3) 0%, 
                    rgba(139, 92, 246, 0.2) 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem auto;
            position: relative;
            z-index: 1;
            animation: iconPulse 2s ease-in-out infinite;
        `;

        const icon = document.createElement('div');
        icon.style.cssText = `
            font-size: 2rem;
            color: #3b82f6;
            animation: iconSpin 1.5s linear infinite;
        `;
        icon.innerHTML = '⚡';

        // Create title
        const title = document.createElement('div');
        title.style.cssText = `
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            background: linear-gradient(135deg, #ffffff 0%, #3b82f6 50%, #8b5cf6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            position: relative;
            z-index: 1;
        `;
        title.textContent = `Switching to ${this.preferredUI === 'modern' ? 'Modern' : 'Classic'} UI`;

        // Create subtitle
        const subtitle = document.createElement('div');
        subtitle.style.cssText = `
            font-size: 1rem;
            opacity: 0.8;
            line-height: 1.5;
            position: relative;
            z-index: 1;
        `;
        subtitle.textContent = 'Preparing your enhanced experience...';

        // Create progress bar
        const progressContainer = document.createElement('div');
        progressContainer.style.cssText = `
            width: 100%;
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
            margin-top: 1.5rem;
            overflow: hidden;
            position: relative;
            z-index: 1;
        `;

        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            height: 100%;
            background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #10b981 100%);
            border-radius: 2px;
            width: 0%;
            animation: progressFill 1s ease-out forwards;
        `;

        // Add all CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes overlayPulse {
                0% {
                    background: 
                        radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
                        radial-gradient(circle at 70% 80%, rgba(139, 92, 246, 0.12) 0%, transparent 50%),
                        radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.8) 100%);
                }
                100% {
                    background: 
                        radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
                        radial-gradient(circle at 70% 80%, rgba(139, 92, 246, 0.18) 0%, transparent 50%),
                        radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.85) 100%);
                }
            }
            
            @keyframes cardEntrance {
                to {
                    transform: scale(1) translateY(0);
                    opacity: 1;
                }
            }
            
            @keyframes cardFloat {
                0%, 100% {
                    transform: translateY(0px);
                }
                50% {
                    transform: translateY(-5px);
                }
            }
            
            @keyframes backgroundGlow {
                0% {
                    opacity: 0.6;
                }
                100% {
                    opacity: 1;
                }
            }
            
            @keyframes iconPulse {
                0%, 100% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.05);
                }
            }
            
            @keyframes iconSpin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            
            @keyframes progressFill {
                to {
                    width: 100%;
                }
            }
        `;
        document.head.appendChild(style);

        // Assemble the card
        iconContainer.appendChild(icon);
        progressContainer.appendChild(progressBar);
        
        card.appendChild(background);
        card.appendChild(iconContainer);
        card.appendChild(title);
        card.appendChild(subtitle);
        card.appendChild(progressContainer);
        
        overlay.appendChild(card);
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
