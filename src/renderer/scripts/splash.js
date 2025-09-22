// ===== MODERN SPLASH SCREEN SCRIPT =====
// Beautiful, modern splash screen with advanced animations and progress tracking

class ModernSplashScreen {
    constructor() {
        this.progressFill = document.querySelector('.progress-fill');
        this.progressGlow = document.querySelector('.progress-glow');
        this.progressPercentage = document.querySelector('.progress-percentage');
        this.progressStatus = document.querySelector('.progress-status');
        this.loadingSteps = document.querySelectorAll('.step');
        this.currentStep = 0;
        this.progress = 0;
        this.isComplete = false;
        this.debug = true; // Enable debug logging
        
        this.init();
    }

    init() {
        this.detectAndApplyTheme();
        this.setupLoadingSequence();
        this.startProgressAnimation();
        this.setupStepAnimations();
    }

    detectAndApplyTheme() {
        if (this.debug) console.log('Detecting theme for splash screen...');
        
        // Try to read theme from localStorage first (same as main app)
        let theme = 'dark'; // Default to dark theme like main app
        
        try {
            // Check if we can access localStorage
            if (typeof Storage !== 'undefined' && localStorage) {
                const savedTheme = localStorage.getItem('theme');
                if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
                    theme = savedTheme;
                    if (this.debug) console.log(`Found theme in localStorage: ${theme}`);
                } else {
                    if (this.debug) console.log('No theme in localStorage, using default');
                }
            } else {
                if (this.debug) console.log('localStorage not available, using default');
            }
        } catch (error) {
            if (this.debug) console.log('Error reading localStorage:', error);
        }
        
        // Apply the theme immediately
        this.applyTheme(theme);
        if (this.debug) console.log(`Applied theme: ${theme}`);
        
        // Also try to get theme from main process as backup
        try {
            if (window.electron && window.electron.ipcRenderer) {
                if (this.debug) console.log('Requesting theme from main process as backup...');
                
                const themePromise = window.electron.ipcRenderer.invoke('get-theme');
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Theme request timeout')), 1000)
                );
                
                Promise.race([themePromise, timeoutPromise])
                    .then((appTheme) => {
                        if (this.debug) console.log('Received theme from main process:', appTheme);
                        // Only apply if different from what we already have
                        if (appTheme && appTheme !== theme) {
                            this.applyTheme(appTheme);
                            if (this.debug) console.log(`Updated theme to: ${appTheme}`);
                        }
                    })
                    .catch((error) => {
                        if (this.debug) console.log('Theme request failed, keeping current theme:', error);
                    });
            }
        } catch (error) {
            if (this.debug) console.log('Theme detection error:', error);
        }
    }

    detectSystemTheme() {
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    applyTheme(theme) {
        const html = document.documentElement;
        
        // Remove existing theme classes
        html.classList.remove('theme-light', 'theme-dark');
        
        // Apply new theme
        html.classList.add(`theme-${theme}`);
        
        console.log(`Splash screen theme applied: ${theme}`);
    }

    setupLoadingSequence() {
        const loadingSteps = [
            { progress: 15, status: 'Initializing core systems...', step: 0, delay: 300 },
            { progress: 30, status: 'Loading Monaco Editor...', step: 0, delay: 800 },
            { progress: 45, status: 'Setting up code execution engine...', step: 1, delay: 600 },
            { progress: 60, status: 'Initializing console system...', step: 1, delay: 500 },
            { progress: 75, status: 'Loading user preferences...', step: 2, delay: 400 },
            { progress: 85, status: 'Preparing interface components...', step: 2, delay: 300 },
            { progress: 95, status: 'Finalizing setup...', step: 3, delay: 200 },
            { progress: 100, status: 'Ready to launch!', step: 3, delay: 500 }
        ];

        let currentIndex = 0;

        const updateProgress = () => {
            if (currentIndex < loadingSteps.length && !this.isComplete) {
                const step = loadingSteps[currentIndex];
                
                this.updateProgressBar(step.progress);
                this.updateStatus(step.status);
                this.updateStep(step.step);
                
                currentIndex++;
                setTimeout(updateProgress, step.delay);
            } else if (!this.isComplete) {
                // Add a small delay before completing to ensure smooth transition
                setTimeout(() => {
                    this.completeLoading();
                }, 500);
            }
        };

        // Start progress updates after initial delay
        setTimeout(updateProgress, 1000);
    }

    updateProgressBar(progress) {
        this.progress = progress;
        
        if (this.progressFill) {
            this.progressFill.style.width = `${progress}%`;
        }
        
        if (this.progressGlow) {
            this.progressGlow.style.width = `${progress}%`;
        }
        
        if (this.progressPercentage) {
            this.progressPercentage.textContent = `${progress}%`;
        }
    }

    updateStatus(status) {
        if (this.progressStatus) {
            this.progressStatus.textContent = status;
        }
    }

    updateStep(stepIndex) {
        // Mark previous steps as completed
        for (let i = 0; i < stepIndex; i++) {
            if (this.loadingSteps[i]) {
                this.loadingSteps[i].classList.remove('active');
                this.loadingSteps[i].classList.add('completed');
            }
        }
        
        // Mark current step as active
        if (this.loadingSteps[stepIndex]) {
            this.loadingSteps[stepIndex].classList.add('active');
        }
        
        this.currentStep = stepIndex;
    }

    setupStepAnimations() {
        this.loadingSteps.forEach((step, index) => {
            step.addEventListener('animationend', () => {
                if (step.classList.contains('active')) {
                    step.style.animation = 'none';
                    step.offsetHeight; // Trigger reflow
                    step.style.animation = 'stepPulse 0.6s ease-in-out';
                }
            });
        });
    }

    startProgressAnimation() {
        // Add CSS animation for step pulsing
        const style = document.createElement('style');
        style.textContent = `
            @keyframes stepPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.15); }
            }
        `;
        document.head.appendChild(style);
    }

    completeLoading() {
        if (this.debug) console.log('Completing splash screen loading...');
        
        this.isComplete = true;
        
        // Mark all steps as completed
        this.loadingSteps.forEach(step => {
            step.classList.remove('active');
            step.classList.add('completed');
        });
        
        // Add completion animation
        this.addCompletionEffects();
        
        // Show confetti
        this.showConfetti();
        
        // Notify main process that splash is complete
        this.notifyMainProcess();
    }

    addCompletionEffects() {
        // Add a subtle completion animation
        const container = document.querySelector('.splash-container');
        if (container) {
            container.style.animation = 'splashBreathe 2s ease-in-out infinite, fadeInUp 0.5s ease-out';
        }
        
        // Add a success checkmark animation
        const logo = document.querySelector('.logo-svg');
        if (logo) {
            logo.style.animation = 'logoSvgPulse 1s ease-in-out infinite, logoGlow 2s ease-in-out infinite';
        }
    }

    createConfetti() {
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'confetti-container';
        confettiContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1000;
        `;
        
        document.body.appendChild(confettiContainer);
        
        // Create confetti pieces
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                this.createConfettiPiece(confettiContainer);
            }, i * 50);
        }
        
        // Remove confetti after animation
        setTimeout(() => {
            if (confettiContainer.parentNode) {
                confettiContainer.parentNode.removeChild(confettiContainer);
            }
        }, 3000);
    }

    createConfettiPiece(container) {
        const piece = document.createElement('div');
        const colors = ['#667eea', '#764ba2', '#f093fb', '#0ea5e9', '#3b82f6'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        piece.style.cssText = `
            position: absolute;
            width: 8px;
            height: 8px;
            background: ${color};
            top: -10px;
            left: ${Math.random() * 100}%;
            border-radius: 2px;
            animation: confettiFall 3s ease-out forwards;
        `;
        
        container.appendChild(piece);
        
        // Add CSS animation
        if (!document.querySelector('#confetti-styles')) {
            const style = document.createElement('style');
            style.id = 'confetti-styles';
            style.textContent = `
                @keyframes confettiFall {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(720deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    notifyMainProcess() {
        console.log('Notifying main process of splash completion...');
        
        try {
            if (window.electron && window.electron.ipcRenderer) {
                // Add timeout to prevent hanging
                const notifyPromise = window.electron.ipcRenderer.invoke('splash-complete');
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Notification timeout')), 3000)
                );
                
                Promise.race([notifyPromise, timeoutPromise])
                    .then((response) => {
                        console.log('Splash completion notified to main process:', response);
                    })
                    .catch((error) => {
                        console.error('Failed to notify main process:', error);
                        // Fallback: try to close splash window directly
                        console.log('Attempting to close splash window directly...');
                        window.close();
                    });
            } else if (window.require) {
                // Fallback for development
                const { ipcRenderer } = window.require('electron');
                ipcRenderer.invoke('splash-complete').then(() => {
                    console.log('Splash screen completed, main window should be showing');
                }).catch((error) => {
                    console.error('Failed to notify main process:', error);
                    window.close();
                });
            } else {
                console.log('No IPC available, closing splash window directly');
                window.close();
            }
        } catch (error) {
            console.error('Error notifying main process:', error);
            console.log('Attempting to close splash window directly...');
            window.close();
        }
    }
}

// Initialize splash screen when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Splash screen DOM loaded, initializing...');
    splashInstance = new ModernSplashScreen();
    console.log('Splash screen initialized');
});

// Handle window close
window.addEventListener('beforeunload', () => {
    // Clean up any ongoing animations
    document.querySelectorAll('.particle, .shape, .orb').forEach(el => {
        el.style.animation = 'none';
    });
});

// Add some interactive effects
document.addEventListener('mousemove', (e) => {
    const particles = document.querySelectorAll('.particle');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    particles.forEach((particle, index) => {
        const speed = (index + 1) * 0.5;
        const x = (mouseX - 0.5) * speed * 20;
        const y = (mouseY - 0.5) * speed * 20;
        
        particle.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Add keyboard shortcuts for testing
let splashInstance = null;

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Skip splash screen (for development)
        console.log('Escape pressed - skipping splash screen');
        if (splashInstance) {
            splashInstance.completeLoading();
        }
    }
    if (e.key === 'Enter' || e.key === ' ') {
        // Complete splash screen immediately
        console.log('Enter/Space pressed - completing splash screen');
        if (splashInstance) {
            splashInstance.completeLoading();
        }
    }
});
