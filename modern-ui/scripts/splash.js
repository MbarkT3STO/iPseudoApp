// ===== MODERN EDITOR-THEMED SPLASH SCREEN =====
// Beautiful, modern splash screen with code editor aesthetics and pseudocode animations

class ModernEditorSplashScreen {
    constructor() {
        this.progressFill = document.querySelector('.progress-fill');
        this.progressShimmer = document.querySelector('.progress-shimmer');
        this.progressPercentage = document.querySelector('.progress-percentage');
        this.progressStatus = document.querySelector('.progress-status');
        this.loadingSteps = document.querySelectorAll('.step');
        this.currentStep = 0;
        this.progress = 0;
        this.isComplete = false;
        this.debug = true;
        
        // Animation state
        this.animations = {
            isRunning: false,
            startTime: null,
            duration: 5000 // 5 seconds total for editor loading
        };
        
        // Code animation elements
        this.codeLines = document.querySelectorAll('.code-line');
        this.syntaxElements = document.querySelectorAll('.syntax-element');
        this.cursor = document.querySelector('.typing-cursor');
        
        this.init();
    }

    init() {
        this.detectAndApplyTheme();
        this.setupEditorAnimations();
        this.setupCodeTypingEffect();
        this.setupLoadingSequence();
        this.setupInteractions();
        this.startProgressAnimation();
    }

    detectAndApplyTheme() {
        if (this.debug) console.log('🎨 Detecting theme for splash screen...');
        
        // Default to dark mode for splash screen
        let theme = 'dark';
        
        try {
            if (typeof Storage !== 'undefined' && localStorage) {
                const savedTheme = localStorage.getItem('theme');
                if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
                    theme = savedTheme;
                    if (this.debug) console.log(`✅ Found theme in localStorage: ${theme}`);
                }
            }
        } catch (error) {
            if (this.debug) console.log('⚠️ Error reading localStorage:', error);
        }
        
        this.applyTheme(theme);
        
        // Try to get theme from main process as backup
        this.requestThemeFromMainProcess();
    }

    async requestThemeFromMainProcess() {
        try {
            if (window.electron?.ipcRenderer) {
                const themePromise = window.electron.ipcRenderer.invoke('get-theme');
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Theme request timeout')), 1000)
                );
                
                const appTheme = await Promise.race([themePromise, timeoutPromise]);
                if (appTheme && appTheme !== document.documentElement.className.replace('theme-', '')) {
                    this.applyTheme(appTheme);
                    if (this.debug) console.log(`🔄 Updated theme to: ${appTheme}`);
                }
            }
        } catch (error) {
            if (this.debug) console.log('ℹ️ Theme request failed, keeping current theme');
        }
    }

    applyTheme(theme) {
        const html = document.documentElement;
        html.classList.remove('theme-light', 'theme-dark');
        html.classList.add(`theme-${theme}`);
        
        if (this.debug) console.log(`🎨 Applied theme: ${theme}`);
    }

    setupEditorAnimations() {
        // Add floating code elements animation
        this.animateCodeElements();
        
        // Add syntax highlighting animation
        this.animateSyntaxHighlighting();
        
        // Add cursor blinking effect
        this.setupCursorAnimation();
        
        // Add mouse interaction effects
        this.setupMouseEffects();
        
        // Add keyboard shortcuts for development
        this.setupKeyboardShortcuts();
        
        // Add completion celebration
        this.setupCelebrationEffects();
    }

    animateCodeElements() {
        this.codeLines.forEach((line, index) => {
            // Add random movement
            setInterval(() => {
                if (this.isComplete) return;
                
                const randomX = (Math.random() - 0.5) * 15;
                const randomY = (Math.random() - 0.5) * 15;
                const randomRotation = (Math.random() - 0.5) * 5;
                
                line.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotation}deg)`;
                line.style.transition = 'transform 3s ease-in-out';
            }, 4000 + index * 600);
        });
    }

    animateSyntaxHighlighting() {
        this.syntaxElements.forEach((element, index) => {
            // Add random movement and color changes
            setInterval(() => {
                if (this.isComplete) return;
                
                const randomX = (Math.random() - 0.5) * 30;
                const randomY = (Math.random() - 0.5) * 30;
                const randomRotation = (Math.random() - 0.5) * 15;
                
                element.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotation}deg)`;
                element.style.transition = 'transform 2s ease-in-out';
                
                // Random color changes
                const colors = ['#ff7b72', '#a5d6ff', '#d2a8ff', '#79c0ff', '#f2cc60'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                element.style.color = randomColor;
            }, 3000 + index * 400);
        });
    }

    setupCursorAnimation() {
        if (!this.cursor) return;
        
        // Add typing effect to cursor
        setInterval(() => {
            if (this.isComplete) return;
            
            this.cursor.style.animation = 'none';
            setTimeout(() => {
                this.cursor.style.animation = 'cursorBlink 1s ease-in-out infinite';
            }, 10);
        }, 2000);
    }

    setupCodeTypingEffect() {
        // Simulate typing effect on code lines
        this.codeLines.forEach((line, index) => {
            const codeContent = line.querySelector('.code-content');
            if (!codeContent) return;
            
            const originalText = codeContent.textContent;
            codeContent.textContent = '';
            
            setTimeout(() => {
                this.typeText(codeContent, originalText, 50);
            }, 1000 + index * 200);
        });
    }

    typeText(element, text, speed) {
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
    }

    setupMouseEffects() {
        const container = document.querySelector('.splash-container');
        if (!container) return;
        
        let mouseX = 0;
        let mouseY = 0;
        
        container.addEventListener('mousemove', (e) => {
            mouseX = e.clientX / window.innerWidth;
            mouseY = e.clientY / window.innerHeight;
            
            // Move code elements based on mouse position
            this.updateCodeElementParallax(mouseX, mouseY);
            
            // Add subtle parallax to syntax elements
            this.updateSyntaxElementParallax(mouseX, mouseY);
        });
        
        container.addEventListener('mouseleave', () => {
            // Reset positions
            this.resetCodeElementPositions();
            this.resetSyntaxElementPositions();
        });
    }

    updateCodeElementParallax(mouseX, mouseY) {
        this.codeLines.forEach((element, index) => {
            const speed = (index + 1) * 0.05;
            const x = (mouseX - 0.5) * speed * 20;
            const y = (mouseY - 0.5) * speed * 20;
            
            element.style.transform = `translate(${x}px, ${y}px)`;
            element.style.transition = 'transform 0.3s ease-out';
        });
    }

    updateSyntaxElementParallax(mouseX, mouseY) {
        this.syntaxElements.forEach((element, index) => {
            const speed = (index + 1) * 0.08;
            const x = (mouseX - 0.5) * speed * 25;
            const y = (mouseY - 0.5) * speed * 25;
            
            element.style.transform = `translate(${x}px, ${y}px)`;
            element.style.transition = 'transform 0.2s ease-out';
        });
    }

    resetCodeElementPositions() {
        this.codeLines.forEach(element => {
            element.style.transform = '';
            element.style.transition = 'transform 0.5s ease-out';
        });
    }

    resetSyntaxElementPositions() {
        this.syntaxElements.forEach(element => {
            element.style.transform = '';
            element.style.transition = 'transform 0.5s ease-out';
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                console.log('⌨️ Escape pressed - skipping splash screen');
                this.completeLoading();
            }
            if (e.key === 'Enter' || e.key === ' ') {
                console.log('⌨️ Enter/Space pressed - completing splash screen');
                this.completeLoading();
            }
        });
    }

    setupCelebrationEffects() {
        this.celebrationElements = [];
    }

    setupLoadingSequence() {
        const loadingSteps = [
            { progress: 15, status: 'Initializing syntax engine...', step: 0, delay: 600 },
            { progress: 30, status: 'Loading pseudocode parser...', step: 0, delay: 500 },
            { progress: 45, status: 'Setting up execution environment...', step: 1, delay: 600 },
            { progress: 60, status: 'Initializing runtime engine...', step: 1, delay: 500 },
            { progress: 75, status: 'Loading theme system...', step: 2, delay: 400 },
            { progress: 85, status: 'Preparing editor components...', step: 2, delay: 400 },
            { progress: 95, status: 'Finalizing IDE setup...', step: 3, delay: 300 },
            { progress: 100, status: 'Ready to code!', step: 3, delay: 500 }
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
                setTimeout(() => {
                    this.completeLoading();
                }, 500);
            }
        };

        // Start progress updates after initial delay
        setTimeout(updateProgress, 1500);
    }

    updateProgressBar(progress) {
        this.progress = progress;
        
        if (this.progressFill) {
            this.progressFill.style.width = `${progress}%`;
        }
        
        if (this.progressPercentage) {
            this.progressPercentage.textContent = `${progress}%`;
        }
        
        // Add progress glow effect
        this.addProgressGlow(progress);
    }

    addProgressGlow(progress) {
        if (this.progressFill) {
            const intensity = progress / 100;
            this.progressFill.style.boxShadow = `0 0 ${20 + intensity * 20}px rgba(59, 130, 246, ${0.3 + intensity * 0.3})`;
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
            
            // Add step completion animation
            this.animateStepCompletion(this.loadingSteps[stepIndex]);
        }
        
        this.currentStep = stepIndex;
    }

    animateStepCompletion(step) {
        const icon = step.querySelector('.step-icon');
        if (icon) {
            icon.style.animation = 'stepPulse 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            
            setTimeout(() => {
                icon.style.animation = '';
            }, 600);
        }
    }

    startProgressAnimation() {
        // Add CSS animation for step pulsing
        const style = document.createElement('style');
        style.textContent = `
            @keyframes stepPulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.3); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }

    setupInteractions() {
        // Add click interaction to logo
        const logo = document.querySelector('.logo-icon');
        if (logo) {
            logo.addEventListener('click', () => {
                this.addLogoClickEffect();
            });
        }
        
        // Add hover effects to steps
        this.loadingSteps.forEach(step => {
            step.addEventListener('mouseenter', () => {
                this.addStepHoverEffect(step);
            });
            
            step.addEventListener('mouseleave', () => {
                this.removeStepHoverEffect(step);
            });
        });
    }

    addLogoClickEffect() {
        const logo = document.querySelector('.logo-icon');
        if (logo) {
            logo.style.animation = 'logoPulse 0.3s ease-in-out';
            setTimeout(() => {
                logo.style.animation = '';
            }, 300);
        }
    }

    addStepHoverEffect(step) {
        if (!step.classList.contains('active') && !step.classList.contains('completed')) {
            step.style.transform = 'scale(1.05)';
            step.style.transition = 'transform 0.2s ease-out';
        }
    }

    removeStepHoverEffect(step) {
        if (!step.classList.contains('active') && !step.classList.contains('completed')) {
            step.style.transform = 'scale(0.95)';
        }
    }

    completeLoading() {
        if (this.debug) console.log('🎉 Completing splash screen loading...');
        
        this.isComplete = true;
        
        // Mark all steps as completed
        this.loadingSteps.forEach(step => {
            step.classList.remove('active');
            step.classList.add('completed');
        });
        
        // Add completion effects
        this.addCompletionEffects();
        
        // Show confetti
        this.showConfetti();
        
        // Notify main process
        this.notifyMainProcess();
    }

    addCompletionEffects() {
        // Add completion animation to logo
        const logo = document.querySelector('.logo-icon');
        if (logo) {
            logo.style.animation = 'logoPulse 1s ease-in-out infinite, logoGlow 2s ease-in-out infinite';
        }
        
        // Add success message
        this.addSuccessMessage();
        
        // Add celebration burst
        this.createCelebrationBurst();
    }

    addSuccessMessage() {
        const container = document.querySelector('.splash-content');
        if (!container) return;
        
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <div class="success-icon">🚀</div>
            <div class="success-text">Ready to code!</div>
        `;
        successMessage.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            z-index: 1000;
            background: var(--glass-bg);
            backdrop-filter: var(--glass-blur);
            border: 1px solid var(--glass-border);
            border-radius: 12px;
            padding: 2rem;
            box-shadow: var(--glass-shadow);
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

    createCelebrationBurst() {
        const container = document.querySelector('.splash-container');
        if (!container) return;
        
        const celebrationEmojis = ['🎉', '✨', '🌟', '💫', '🎊', '⭐', '💖', '🚀', '💻', '⚡'];
        
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
                const distance = 150 + Math.random() * 100;
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

    showConfetti() {
        const canvas = document.getElementById('confettiCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const confettiPieces = [];
        const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];
        
        // Create confetti pieces
        for (let i = 0; i < 60; i++) {
            confettiPieces.push({
                x: Math.random() * canvas.width,
                y: -10,
                vx: (Math.random() - 0.5) * 2,
                vy: Math.random() * 3 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 4 + 2,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10
            });
        }
        
        // Animate confetti
        const animateConfetti = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            confettiPieces.forEach((piece, index) => {
                piece.x += piece.vx;
                piece.y += piece.vy;
                piece.rotation += piece.rotationSpeed;
                
                ctx.save();
                ctx.translate(piece.x, piece.y);
                ctx.rotate(piece.rotation * Math.PI / 180);
                ctx.fillStyle = piece.color;
                ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
                ctx.restore();
                
                // Remove pieces that are off screen
                if (piece.y > canvas.height + 10) {
                    confettiPieces.splice(index, 1);
                }
            });
            
            if (confettiPieces.length > 0) {
                requestAnimationFrame(animateConfetti);
            }
        };
        
        animateConfetti();
    }

    async notifyMainProcess() {
        console.log('📡 Notifying main process of splash completion...');
        
        try {
            if (window.electron?.ipcRenderer) {
                const notifyPromise = window.electron.ipcRenderer.invoke('splash-complete');
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Notification timeout')), 3000)
                );
                
                await Promise.race([notifyPromise, timeoutPromise]);
                console.log('✅ Splash completion notified to main process');
            } else if (window.require) {
                const { ipcRenderer } = window.require('electron');
                await ipcRenderer.invoke('splash-complete');
                console.log('✅ Splash screen completed, main window should be showing');
            } else {
                console.log('ℹ️ No IPC available, closing splash window directly');
                window.close();
            }
        } catch (error) {
            console.error('❌ Error notifying main process:', error);
            console.log('🔄 Attempting to close splash window directly...');
            window.close();
        }
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes celebrationBurst {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.5) rotate(0deg);
        }
        50% {
            opacity: 1;
            transform: translate(calc(-50% + var(--burst-x)), calc(-50% + var(--burst-y))) scale(1.2) rotate(180deg);
        }
        100% {
            opacity: 0;
            transform: translate(calc(-50% + var(--burst-x)), calc(-50% + var(--burst-y))) scale(0.5) rotate(360deg);
        }
    }
    
    @keyframes successMessage {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
        }
        50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.1);
        }
        100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }
    
    @keyframes logoGlow {
        0%, 100% { 
            filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.3));
        }
        50% { 
            filter: drop-shadow(0 0 40px rgba(59, 130, 246, 0.6));
        }
    }
`;
document.head.appendChild(style);

// Initialize splash screen when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Editor splash screen DOM loaded, initializing...');
    window.splashInstance = new ModernEditorSplashScreen();
    console.log('✅ Editor splash screen initialized');
});

// Handle window close
window.addEventListener('beforeunload', () => {
    // Clean up any ongoing animations
    document.querySelectorAll('.code-line, .syntax-element, .cursor-line').forEach(el => {
        el.style.animation = 'none';
    });
});

// Export for global access
window.ModernEditorSplashScreen = ModernEditorSplashScreen;