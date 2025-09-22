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
        this.setupCuteAnimations();
        this.setupLoadingSequence();
        this.startProgressAnimation();
        this.setupStepAnimations();
    }

    detectAndApplyTheme() {
        if (this.debug) console.log('Detecting theme for splash screen...');
        
        // Default to dark mode for splash screen (optimized for dark)
        let theme = 'dark';
        
        try {
            // Check if we can access localStorage
            if (typeof Storage !== 'undefined' && localStorage) {
                const savedTheme = localStorage.getItem('theme');
                if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
                    theme = savedTheme;
                    if (this.debug) console.log(`Found theme in localStorage: ${theme}`);
                } else {
                    if (this.debug) console.log('No theme in localStorage, using dark default');
                }
            } else {
                if (this.debug) console.log('localStorage not available, using dark default');
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

    setupCuteAnimations() {
        // Add floating hearts animation
        this.createFloatingHearts();
        
        // Add mouse follow effect for particles
        this.setupMouseFollowEffect();
        
        // Add cute completion celebration
        this.setupCelebrationEffects();
    }

    createFloatingHearts() {
        const hearts = ['💖', '💕', '💗', '💝', '💘', '💞'];
        const container = document.querySelector('.splash-background');
        
        if (!container) return;
        
        // Create floating hearts every 2 seconds
        setInterval(() => {
            if (this.isComplete) return;
            
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.cssText = `
                position: absolute;
                font-size: 20px;
                pointer-events: none;
                z-index: 5;
                left: ${Math.random() * 100}%;
                top: 100%;
                animation: floatUp 4s ease-out forwards;
                opacity: 0.8;
            `;
            
            container.appendChild(heart);
            
            // Remove heart after animation
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.parentNode.removeChild(heart);
                }
            }, 4000);
        }, 2000);
    }

    setupMouseFollowEffect() {
        const container = document.querySelector('.splash-container');
        if (!container) return;
        
        container.addEventListener('mousemove', (e) => {
            const particles = document.querySelectorAll('.particle');
            particles.forEach((particle, index) => {
                const rect = container.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Create subtle follow effect
                const delay = index * 100;
                setTimeout(() => {
                    particle.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.2)`;
                    particle.style.transition = 'transform 0.3s ease';
                }, delay);
            });
        });
        
        container.addEventListener('mouseleave', () => {
            const particles = document.querySelectorAll('.particle');
            particles.forEach(particle => {
                particle.style.transform = '';
                particle.style.transition = 'transform 0.5s ease';
            });
        });
    }

    setupCelebrationEffects() {
        // Add celebration when loading completes
        this.celebrationElements = [];
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
        const logo = document.querySelector('.logo-icon');
        if (logo) {
            logo.style.animation = 'logoPulse 1s ease-in-out infinite, logoGlow 2s ease-in-out infinite';
        }
        
        // Add cute celebration effects
        this.createCelebrationBurst();
        this.addSuccessMessage();
    }

    createCelebrationBurst() {
        const container = document.querySelector('.splash-container');
        if (!container) return;
        
        const celebrationEmojis = ['🎉', '✨', '🌟', '💫', '🎊', '⭐', '💖', '🎈'];
        
        // Create burst of celebration emojis
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const emoji = document.createElement('div');
                emoji.textContent = celebrationEmojis[Math.floor(Math.random() * celebrationEmojis.length)];
                emoji.style.cssText = `
                    position: absolute;
                    font-size: 24px;
                    pointer-events: none;
                    z-index: 1000;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    animation: celebrationBurst 2s ease-out forwards;
                `;
                
                // Random direction for burst effect
                const angle = (i / 20) * 360;
                const distance = 200 + Math.random() * 100;
                const x = Math.cos(angle * Math.PI / 180) * distance;
                const y = Math.sin(angle * Math.PI / 180) * distance;
                
                emoji.style.setProperty('--burst-x', `${x}px`);
                emoji.style.setProperty('--burst-y', `${y}px`);
                
                container.appendChild(emoji);
                
                // Remove after animation
                setTimeout(() => {
                    if (emoji.parentNode) {
                        emoji.parentNode.removeChild(emoji);
                    }
                }, 2000);
            }, i * 50);
        }
    }

    addSuccessMessage() {
        const container = document.querySelector('.splash-content');
        if (!container) return;
        
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <div class="success-icon">🎉</div>
            <div class="success-text">Ready to code!</div>
        `;
        successMessage.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            z-index: 1000;
            animation: successMessage 1s ease-out 0.5s both;
        `;
        
        container.appendChild(successMessage);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (successMessage.parentNode) {
                successMessage.parentNode.removeChild(successMessage);
            }
        }, 3000);
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
