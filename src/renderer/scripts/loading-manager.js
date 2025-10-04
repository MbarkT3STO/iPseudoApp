// ===== MODERN LOADING MANAGER =====
// Comprehensive loading system that waits for all UI components to finish loading

class ModernLoadingManager {
    constructor() {
        this.loadingStates = new Map();
        this.loadingPromises = new Map();
        this.isInitialized = false;
        this.loadingScreen = null;
        this.startTime = Date.now();
        
        // Define all components that need to be loaded
        this.components = {
            'monaco-editor': { required: true, timeout: 10000 },
            'theme-system': { required: true, timeout: 5000 },
            'settings-manager': { required: true, timeout: 5000 },
            'tab-system': { required: true, timeout: 5000 },
            'console-system': { required: true, timeout: 5000 },
            'ui-components': { required: true, timeout: 5000 },
            'syntax-highlighting': { required: true, timeout: 8000 },
            'pseudocode-parser': { required: true, timeout: 8000 },
            'file-manager': { required: false, timeout: 3000 },
            'keyboard-shortcuts': { required: false, timeout: 2000 },
            'tooltips': { required: false, timeout: 2000 },
            'animations': { required: false, timeout: 2000 }
        };
        
        this.init();
        
        // Add fallback timeout to ensure loading screen doesn't stay forever
        setTimeout(() => {
            if (!this.isInitialized) {
                
                this.completeLoading();
            }
        }, 10000); // 10 seconds fallback
    }
    
    init() {
        this.setupLoadingScreen();
        this.setupComponentDetection();
        this.setupTimeoutHandlers();
        this.startLoadingSequence();
    }
    
    setupLoadingScreen() {
        // Create loading screen if it doesn't exist
        if (!document.getElementById('loadingScreen')) {
            this.createLoadingScreen();
        }
        
        this.loadingScreen = document.getElementById('loadingScreen');
    }
    
    createLoadingScreen() {
        const loadingHTML = `
            <div id="loadingScreen" class="loading-screen">
                <div class="loading-container">
                    <!-- Loading Header Section - Matching Flow Chart Modal -->
                    <div class="loading-header">
                        <div class="loading-brand-section">
                            <div class="loading-brand-icon">
                                <i class="ri-code-s-slash-line"></i>
                            </div>
                            <div class="loading-brand-text">
                                <div class="loading-app-title">iPseudo IDE</div>
                                <div class="loading-version-info">Modern Pseudocode Development Environment</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Loading Content Section -->
                    <div class="loading-content">
                        <div class="loading-progress">
                            <div class="loading-progress-fill" id="progressFill"></div>
                        </div>
                        
                        <div class="loading-percentage" id="progressPercentage">0%</div>
                        <div class="loading-status" id="loadingStatus">Initializing...</div>
                        
                        <div class="loading-steps">
                            <div class="loading-step" id="step1"></div>
                            <div class="loading-step" id="step2"></div>
                            <div class="loading-step" id="step3"></div>
                            <div class="loading-step" id="step4"></div>
                            <div class="loading-step" id="step5"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add to body
        document.body.insertAdjacentHTML('afterbegin', loadingHTML);
        
        // Load loading screen CSS
        this.loadLoadingScreenCSS();
        
        // Show loading screen with animation
        setTimeout(() => {
            if (this.loadingScreen) {
                this.loadingScreen.classList.add('show');
                const container = this.loadingScreen.querySelector('.loading-container');
                if (container) {
                    container.classList.add('show');
                }
            }
        }, 100);
    }
    
    loadLoadingScreenCSS() {
        // Check if CSS is already loaded
        if (document.getElementById('loadingScreenCSS')) return;
        
        const link = document.createElement('link');
        link.id = 'loadingScreenCSS';
        link.rel = 'stylesheet';
        link.href = 'styles/loading-screen.css';
        document.head.appendChild(link);
    }
    
    setupComponentDetection() {
        // Detect when components are loaded
        this.detectMonacoEditor();
        this.detectThemeSystem();
        this.detectSettingsManager();
        this.detectTabSystem();
        this.detectConsoleSystem();
        this.detectUIComponents();
        this.detectSyntaxHighlighting();
        this.detectPseudocodeParser();
        this.detectFileManager();
        this.detectKeyboardShortcuts();
        this.detectTooltips();
        this.detectAnimations();
    }
    
    detectMonacoEditor() {
        const checkMonaco = () => {
            if (window.monaco && window.editor) {
                this.markComponentLoaded('monaco-editor');
                return true;
            }
            return false;
        };
        
        if (!checkMonaco()) {
            const interval = setInterval(() => {
                if (checkMonaco()) {
                    clearInterval(interval);
                }
            }, 100);
            
            // Timeout after 10 seconds
            setTimeout(() => {
                clearInterval(interval);
                if (!this.loadingStates.get('monaco-editor')) {
                    
                    this.markComponentLoaded('monaco-editor', false);
                }
            }, 10000);
        }
    }
    
    detectThemeSystem() {
        const checkTheme = () => {
            if (document.documentElement.classList.contains('theme-dark') || 
                document.documentElement.classList.contains('theme-light')) {
                this.markComponentLoaded('theme-system');
                return true;
            }
            return false;
        };
        
        if (!checkTheme()) {
            const interval = setInterval(() => {
                if (checkTheme()) {
                    clearInterval(interval);
                }
            }, 100);
            
            setTimeout(() => {
                clearInterval(interval);
                if (!this.loadingStates.get('theme-system')) {
                    this.markComponentLoaded('theme-system', false);
                }
            }, 5000);
        }
    }
    
    detectSettingsManager() {
        const checkSettings = () => {
            if (window.SettingsManager || window.modernApp?.settings) {
                this.markComponentLoaded('settings-manager');
                return true;
            }
            return false;
        };
        
        if (!checkSettings()) {
            const interval = setInterval(() => {
                if (checkSettings()) {
                    clearInterval(interval);
                }
            }, 100);
            
            setTimeout(() => {
                clearInterval(interval);
                if (!this.loadingStates.get('settings-manager')) {
                    this.markComponentLoaded('settings-manager', false);
                }
            }, 5000);
        }
    }
    
    detectTabSystem() {
        const checkTabs = () => {
            if (document.querySelector('.modern-tab-system') || 
                document.querySelector('.tab-nav') ||
                window.modernApp?.tabs) {
                this.markComponentLoaded('tab-system');
                return true;
            }
            return false;
        };
        
        if (!checkTabs()) {
            const interval = setInterval(() => {
                if (checkTabs()) {
                    clearInterval(interval);
                }
            }, 100);
            
            setTimeout(() => {
                clearInterval(interval);
                if (!this.loadingStates.get('tab-system')) {
                    this.markComponentLoaded('tab-system', false);
                }
            }, 5000);
        }
    }
    
    detectConsoleSystem() {
        const checkConsole = () => {
            if (document.querySelector('.console-output') || 
                document.querySelector('.modern-console-container') ||
                window.modernApp?.console) {
                this.markComponentLoaded('console-system');
                return true;
            }
            return false;
        };
        
        if (!checkConsole()) {
            const interval = setInterval(() => {
                if (checkConsole()) {
                    clearInterval(interval);
                }
            }, 100);
            
            setTimeout(() => {
                clearInterval(interval);
                if (!this.loadingStates.get('console-system')) {
                    this.markComponentLoaded('console-system', false);
                }
            }, 5000);
        }
    }
    
    detectUIComponents() {
        const checkUI = () => {
            if (document.querySelector('.modern-btn') && 
                document.querySelector('.modern-panel') &&
                document.querySelector('.modern-top-nav')) {
                this.markComponentLoaded('ui-components');
                return true;
            }
            return false;
        };
        
        if (!checkUI()) {
            const interval = setInterval(() => {
                if (checkUI()) {
                    clearInterval(interval);
                }
            }, 100);
            
            setTimeout(() => {
                clearInterval(interval);
                if (!this.loadingStates.get('ui-components')) {
                    this.markComponentLoaded('ui-components', false);
                }
            }, 5000);
        }
    }
    
    detectSyntaxHighlighting() {
        const checkSyntax = () => {
            if (window.monaco?.languages?.register || 
                document.querySelector('.syntax-highlighted') ||
                window.modernApp?.syntax) {
                this.markComponentLoaded('syntax-highlighting');
                return true;
            }
            return false;
        };
        
        if (!checkSyntax()) {
            const interval = setInterval(() => {
                if (checkSyntax()) {
                    clearInterval(interval);
                }
            }, 100);
            
            setTimeout(() => {
                clearInterval(interval);
                if (!this.loadingStates.get('syntax-highlighting')) {
                    this.markComponentLoaded('syntax-highlighting', false);
                }
            }, 8000);
        }
    }
    
    detectPseudocodeParser() {
        const checkParser = () => {
            if (window.pseudocodeParser || 
                window.modernApp?.parser ||
                document.querySelector('.pseudo-output-container')) {
                this.markComponentLoaded('pseudocode-parser');
                return true;
            }
            return false;
        };
        
        if (!checkParser()) {
            const interval = setInterval(() => {
                if (checkParser()) {
                    clearInterval(interval);
                }
            }, 100);
            
            setTimeout(() => {
                clearInterval(interval);
                if (!this.loadingStates.get('pseudocode-parser')) {
                    this.markComponentLoaded('pseudocode-parser', false);
                }
            }, 8000);
        }
    }
    
    detectFileManager() {
        const checkFiles = () => {
            if (window.openFiles || 
                window.modernApp?.files ||
                document.querySelector('.file-manager')) {
                this.markComponentLoaded('file-manager');
                return true;
            }
            return false;
        };
        
        if (!checkFiles()) {
            const interval = setInterval(() => {
                if (checkFiles()) {
                    clearInterval(interval);
                }
            }, 100);
            
            setTimeout(() => {
                clearInterval(interval);
                if (!this.loadingStates.get('file-manager')) {
                    this.markComponentLoaded('file-manager', false);
                }
            }, 3000);
        }
    }
    
    detectKeyboardShortcuts() {
        const checkShortcuts = () => {
            if (window.modernApp?.shortcuts || 
                document.querySelector('[data-shortcut]')) {
                this.markComponentLoaded('keyboard-shortcuts');
                return true;
            }
            return false;
        };
        
        if (!checkShortcuts()) {
            const interval = setInterval(() => {
                if (checkShortcuts()) {
                    clearInterval(interval);
                }
            }, 100);
            
            setTimeout(() => {
                clearInterval(interval);
                if (!this.loadingStates.get('keyboard-shortcuts')) {
                    this.markComponentLoaded('keyboard-shortcuts', false);
                }
            }, 2000);
        }
    }
    
    detectTooltips() {
        const checkTooltips = () => {
            if (window.modernTooltip || 
                window.simpleTooltip ||
                document.querySelector('.tooltip')) {
                this.markComponentLoaded('tooltips');
                return true;
            }
            return false;
        };
        
        if (!checkTooltips()) {
            const interval = setInterval(() => {
                if (checkTooltips()) {
                    clearInterval(interval);
                }
            }, 100);
            
            setTimeout(() => {
                clearInterval(interval);
                if (!this.loadingStates.get('tooltips')) {
                    this.markComponentLoaded('tooltips', false);
                }
            }, 2000);
        }
    }
    
    detectAnimations() {
        const checkAnimations = () => {
            if (document.querySelector('.animate-spin') || 
                document.querySelector('.animate-pulse') ||
                window.modernApp?.animations) {
                this.markComponentLoaded('animations');
                return true;
            }
            return false;
        };
        
        if (!checkAnimations()) {
            const interval = setInterval(() => {
                if (checkAnimations()) {
                    clearInterval(interval);
                }
            }, 100);
            
            setTimeout(() => {
                clearInterval(interval);
                if (!this.loadingStates.get('animations')) {
                    this.markComponentLoaded('animations', false);
                }
            }, 2000);
        }
    }
    
    markComponentLoaded(componentName, success = true) {
        if (this.loadingStates.has(componentName)) return;
        
        this.loadingStates.set(componentName, {
            loaded: success,
            timestamp: Date.now(),
            required: this.components[componentName]?.required || false
        });
        
        
        
        this.updateProgress();
        this.checkCompletion();
    }
    
    updateProgress() {
        const totalComponents = Object.keys(this.components).length;
        const loadedComponents = this.loadingStates.size;
        const progress = Math.round((loadedComponents / totalComponents) * 100);
        
        this.updateProgressBar(progress);
        this.updateStatus();
    }
    
    updateProgressBar(progress) {
        const progressFill = document.getElementById('progressFill');
        const progressPercentage = document.getElementById('progressPercentage');
        
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
        
        if (progressPercentage) {
            progressPercentage.textContent = `${progress}%`;
        }
    }
    
    updateStatus() {
        const loadingStatus = document.getElementById('loadingStatus');
        if (!loadingStatus) return;
        
        const loadedCount = this.loadingStates.size;
        const totalCount = Object.keys(this.components).length;
        
        if (loadedCount < totalCount) {
            const remainingComponents = Object.keys(this.components).filter(
                name => !this.loadingStates.has(name)
            );
            
            if (remainingComponents.length > 0) {
                const nextComponent = remainingComponents[0];
                const componentNames = {
                    'monaco-editor': 'Monaco Editor',
                    'theme-system': 'Theme System',
                    'settings-manager': 'Settings Manager',
                    'tab-system': 'Tab System',
                    'console-system': 'Console System',
                    'ui-components': 'UI Components',
                    'syntax-highlighting': 'Syntax Highlighting',
                    'pseudocode-parser': 'Pseudocode Parser',
                    'file-manager': 'File Manager',
                    'keyboard-shortcuts': 'Keyboard Shortcuts',
                    'tooltips': 'Tooltips',
                    'animations': 'Animations'
                };
                
                loadingStatus.textContent = `Loading ${componentNames[nextComponent] || nextComponent}...`;
            }
        } else {
            loadingStatus.textContent = 'Finalizing setup...';
        }
    }
    
    checkCompletion() {
        const requiredComponents = Object.keys(this.components).filter(
            name => this.components[name].required
        );
        
        const loadedRequiredComponents = requiredComponents.filter(
            name => this.loadingStates.has(name) && this.loadingStates.get(name).loaded
        );
        
        // Check if all required components are loaded
        if (loadedRequiredComponents.length === requiredComponents.length) {
            this.completeLoading();
        }
    }
    
    completeLoading() {
        if (this.isInitialized) return;
        
        this.isInitialized = true;
        const loadTime = Date.now() - this.startTime;
        
        
        
        // Update final status
        this.updateProgressBar(100);
        this.updateStatus();
        
        // Add completion effects
        this.addCompletionEffects();
        
        // Hide loading screen after delay (reduced for faster transition)
        setTimeout(() => {
            this.hideLoadingScreen();
        }, 1000);
    }
    
    addCompletionEffects() {
        // Add pulse effect to logo
        const logo = document.querySelector('.loading-logo');
        if (logo) {
            logo.style.animation = 'logoFloat 0.5s ease-in-out infinite, titleGlow 1s ease-in-out infinite';
        }
        
        // Mark all steps as completed
        const steps = document.querySelectorAll('.loading-step');
        steps.forEach(step => {
            step.classList.remove('active');
            step.classList.add('completed');
        });
        
        // Add celebration effect
        this.createCelebrationEffect();
    }
    
    createCelebrationEffect() {
        const celebrationEmojis = ['🎉', '✨', '🌟', '💫', '🎊', '⭐', '💖', '🚀', '💻', '⚡'];
        
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
                
                this.loadingScreen.appendChild(emoji);
                
                // Remove after animation
                setTimeout(() => {
                    if (emoji.parentNode) {
                        emoji.parentNode.removeChild(emoji);
                    }
                }, 2000);
            }, i * 50);
        }
    }
    
    hideLoadingScreen() {
        if (this.loadingScreen) {
            this.loadingScreen.classList.add('hidden');
            
            // Remove from DOM after animation
            setTimeout(() => {
                if (this.loadingScreen && this.loadingScreen.parentNode) {
                    this.loadingScreen.parentNode.removeChild(this.loadingScreen);
                }
            }, 800);
        }
    }
    
    setupTimeoutHandlers() {
        // Set up timeout handlers for each component
        Object.keys(this.components).forEach(componentName => {
            const component = this.components[componentName];
            
            setTimeout(() => {
                if (!this.loadingStates.has(componentName)) {
                    
                    this.markComponentLoaded(componentName, false);
                }
            }, component.timeout);
        });
    }
    
    startLoadingSequence() {
        // Start the loading sequence
        this.updateStatus();
        
        // Optional: Add keyboard shortcuts for development (commented out for automatic loading)
        // document.addEventListener('keydown', (e) => {
        //     if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        //         e.preventDefault();
        //         this.completeLoading();
        //     }
        // });
        
        // Optional: Add click to skip (commented out for automatic loading)
        // if (this.loadingScreen) {
        //     this.loadingScreen.addEventListener('click', () => {
        //         this.completeLoading();
        //     });
        // }
    }
}

// Initialize loading manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.loadingManager = new ModernLoadingManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModernLoadingManager;
}
