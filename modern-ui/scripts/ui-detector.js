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
            
            return 'modern';
        }
    }

    // Detect which UI we're currently in
    detectCurrentUI() {
        const path = window.location.pathname;
        const href = window.location.href;
        
        
        
        
        // Check for modern UI
        if (path.includes('modern-ui') || href.includes('modern-ui')) {
            
            return 'modern';
        }
        
        // Check for classic UI
        if (path.includes('src/renderer') || path.includes('dist/renderer') || href.includes('src/renderer') || href.includes('dist/renderer')) {
            
            return 'classic';
        }
        
        
        return 'unknown';
    }

    // Initialize UI detection and redirection
    init() {
        
        
        
        
        // Add a small delay to ensure the page is fully loaded
        setTimeout(() => {
            // Only redirect if we're not already in the preferred UI
            if (this.preferredUI !== this.currentUI && this.currentUI !== 'unknown') {
                
                this.redirectToPreferredUI();
            } else {
                
            }
        }, 100);
    }

    // Redirect to the preferred UI
    redirectToPreferredUI() {
        
        
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
                
                
                window.location.href = redirectUrl;
            } catch (error) {
                
                // Fallback: try to reload the page
                window.location.reload();
            }
        }, 800); // Reduced from 1000ms to 800ms for faster experience
    }

    // Show modern loading message during redirect - Flow Chart Modal Style
    showLoadingMessage() {
        // Create modern loading overlay - matching Flow Chart modal
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(135deg,
                rgba(147, 51, 234, 0.25) 0%,
                rgba(79, 70, 229, 0.25) 50%,
                rgba(6, 182, 212, 0.2) 100%),
                rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            opacity: 0;
            transition: opacity 0.3s ease;
            color: white;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        // Create modern loading container - matching Flow Chart modal
        const container = document.createElement('div');
        container.style.cssText = `
            width: 100%;
            max-width: 500px;
            max-height: calc(100vh - 2rem);
            background: linear-gradient(135deg,
                rgba(255, 255, 255, 0.12) 0%,
                rgba(255, 255, 255, 0.05) 50%,
                rgba(255, 255, 255, 0.08) 100%);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 24px;
            box-shadow:
                0 25px 50px rgba(0, 0, 0, 0.25),
                0 0 100px rgba(147, 51, 234, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(24px) saturate(200%);
            -webkit-backdrop-filter: blur(24px) saturate(200%);
            display: flex;
            flex-direction: column;
            transform: scale(0.9) translateY(20px);
            transition: transform 0.4s cubic-bezier(0.32, 1.0, 0.68, 1.0);
            text-align: center;
            position: relative;
            z-index: 2;
        `;

        // Create header section - matching Flow Chart modal
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            background: linear-gradient(135deg,
                rgba(255, 255, 255, 0.08) 0%,
                rgba(255, 255, 255, 0.02) 100%);
            flex-shrink: 0;
            border-radius: 24px 24px 0 0;
        `;

        const brandSection = document.createElement('div');
        brandSection.style.cssText = `
            display: flex;
            align-items: center;
            gap: 1rem;
        `;

        const brandIcon = document.createElement('div');
        brandIcon.style.cssText = `
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, 
                rgba(147, 51, 234, 0.2) 0%, 
                rgba(79, 70, 229, 0.2) 50%, 
                rgba(6, 182, 212, 0.2) 100%);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            animation: iconPulse 2s ease-in-out infinite;
        `;

        const icon = document.createElement('i');
        icon.className = 'ri-refresh-line';
        icon.style.cssText = `
            font-size: 2rem;
            color: #ffffff;
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
            animation: iconSpin 1.5s linear infinite;
        `;

        const brandText = document.createElement('div');
        brandText.style.cssText = `
            text-align: left;
        `;

        const appTitle = document.createElement('div');
        appTitle.style.cssText = `
            font-size: 1.5rem;
            font-weight: 700;
            color: #ffffff;
            background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 0.25rem;
            animation: titleGlow 2s ease-in-out infinite alternate;
        `;
        appTitle.textContent = `Switching to ${this.preferredUI === 'modern' ? 'Modern' : 'Classic'} UI`;

        const versionInfo = document.createElement('div');
        versionInfo.style.cssText = `
            font-size: 0.875rem;
            color: rgba(255, 255, 255, 0.7);
            font-weight: 400;
        `;
        versionInfo.textContent = 'Preparing your enhanced experience...';

        // Create content section
        const content = document.createElement('div');
        content.style.cssText = `
            padding: 2rem 1.5rem;
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        `;

        // Create progress bar
        const progressContainer = document.createElement('div');
        progressContainer.style.cssText = `
            width: 100%;
            max-width: 300px;
            height: 6px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
            overflow: hidden;
            margin: 0 auto 1.5rem;
            position: relative;
            border: 1px solid rgba(255, 255, 255, 0.1);
        `;

        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            height: 100%;
            background: linear-gradient(90deg, 
                rgba(147, 51, 234, 0.8) 0%, 
                rgba(79, 70, 229, 0.8) 50%, 
                rgba(6, 182, 212, 0.8) 100%);
            border-radius: 3px;
            width: 0%;
            transition: width 0.3s ease-out;
            position: relative;
            overflow: hidden;
            box-shadow: 0 0 10px rgba(147, 51, 234, 0.3);
        `;

        // Create progress percentage
        const percentage = document.createElement('div');
        percentage.style.cssText = `
            font-size: 1.1rem;
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 1rem;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        `;
        percentage.textContent = '0%';

        // Create status text
        const status = document.createElement('div');
        status.style.cssText = `
            font-size: 0.9rem;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 2rem;
            min-height: 1.2rem;
            text-align: center;
        `;
        status.textContent = 'Initializing...';

        // Create steps
        const steps = document.createElement('div');
        steps.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 0.75rem;
            margin-bottom: 2rem;
        `;

        // Create step indicators
        for (let i = 0; i < 5; i++) {
            const step = document.createElement('div');
            step.style.cssText = `
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.1);
                transition: all 0.3s ease;
            `;
            steps.appendChild(step);
        }

        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
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
            
            @keyframes titleGlow {
                0% {
                    filter: brightness(1);
                }
                100% {
                    filter: brightness(1.2);
                }
            }
            
            @keyframes progressFill {
                to {
                    width: 100%;
                }
            }
        `;
        document.head.appendChild(style);

        // Assemble the components
        brandIcon.appendChild(icon);
        brandText.appendChild(appTitle);
        brandText.appendChild(versionInfo);
        brandSection.appendChild(brandIcon);
        brandSection.appendChild(brandText);
        header.appendChild(brandSection);

        progressContainer.appendChild(progressBar);
        content.appendChild(progressContainer);
        content.appendChild(percentage);
        content.appendChild(status);
        content.appendChild(steps);

        container.appendChild(header);
        container.appendChild(content);
        overlay.appendChild(container);
        document.body.appendChild(overlay);

        // Show with animation
        setTimeout(() => {
            overlay.style.opacity = '1';
            container.style.transform = 'scale(1) translateY(0)';
            
            // Animate progress
            setTimeout(() => {
                progressBar.style.width = '100%';
                percentage.textContent = '100%';
                status.textContent = 'Redirecting...';
                
                // Animate steps
                const stepElements = steps.querySelectorAll('div');
                stepElements.forEach((step, index) => {
                    setTimeout(() => {
                        step.style.background = 'rgba(147, 51, 234, 0.8)';
                        step.style.borderColor = 'rgba(147, 51, 234, 0.6)';
                        step.style.transform = 'scale(1.3)';
                        step.style.boxShadow = '0 0 15px rgba(147, 51, 234, 0.4)';
                    }, index * 100);
                });
            }, 200);
        }, 100);
    }

    // Method to change UI preference
    setPreferredUI(ui) {
        try {
            localStorage.setItem('preferredUI', ui);
            this.preferredUI = ui;
            
        } catch (error) {
            
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
