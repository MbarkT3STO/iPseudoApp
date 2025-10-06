/**
 * Performance Optimizations
 * Lazy loading, loading skeletons, and performance enhancements
 */

class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.lazyLoadDiagrams();
        this.optimizeAnimations();
        this.addLoadingSkeletons();
        this.preloadCriticalResources();
        this.optimizeScrollPerformance();
        this.reduceLayoutShifts();
    }

    // ===== LAZY LOADING =====
    
    lazyLoadImages() {
        // Use native lazy loading for all images
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Add fade-in animation
            img.addEventListener('load', () => {
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s';
                requestAnimationFrame(() => {
                    img.style.opacity = '1';
                });
            });
        });
    }

    lazyLoadDiagrams() {
        // Lazy load SVG diagrams using Intersection Observer
        const diagrams = document.querySelectorAll('.visual-diagram, .diagram-container, svg');
        
        if (!diagrams.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const diagram = entry.target;
                    
                    // Mark as loaded
                    diagram.classList.add('loaded');
                    diagram.style.opacity = '0';
                    diagram.style.transition = 'opacity 0.5s';
                    
                    // Trigger animation
                    requestAnimationFrame(() => {
                        diagram.style.opacity = '1';
                    });
                    
                    // Stop observing
                    observer.unobserve(diagram);
                }
            });
        }, {
            rootMargin: '50px',
            threshold: 0.1
        });

        diagrams.forEach(diagram => observer.observe(diagram));
    }

    // ===== LOADING SKELETONS =====
    
    addLoadingSkeletons() {
        // Add skeletons for dynamically loaded content
        const contentAreas = document.querySelectorAll('[data-skeleton]');
        
        contentAreas.forEach(area => {
            const skeleton = this.createSkeleton(area.dataset.skeleton);
            area.insertBefore(skeleton, area.firstChild);
            
            // Remove skeleton when content loads
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length > 1) {
                        skeleton.remove();
                        observer.disconnect();
                    }
                });
            });
            
            observer.observe(area, { childList: true });
        });
    }

    createSkeleton(type) {
        const skeleton = document.createElement('div');
        skeleton.className = 'skeleton-loader';
        skeleton.style.cssText = `
            animation: pulse 1.5s ease-in-out infinite;
            background: linear-gradient(90deg, var(--glass-bg) 25%, rgba(255,255,255,0.1) 50%, var(--glass-bg) 75%);
            background-size: 200% 100%;
            border-radius: var(--radius-md);
        `;

        switch (type) {
            case 'card':
                skeleton.style.width = '100%';
                skeleton.style.height = '200px';
                break;
            case 'text':
                skeleton.style.width = '100%';
                skeleton.style.height = '20px';
                break;
            case 'chart':
                skeleton.style.width = '100%';
                skeleton.style.height = '300px';
                break;
            default:
                skeleton.style.width = '100%';
                skeleton.style.height = '100px';
        }

        return skeleton;
    }

    // ===== ANIMATION OPTIMIZATIONS =====
    
    optimizeAnimations() {
        // Use CSS containment for animated elements
        const animatedElements = document.querySelectorAll('[class*="animate"], [style*="animation"]');
        
        animatedElements.forEach(el => {
            el.style.contain = 'layout style paint';
            el.style.willChange = 'transform, opacity';
        });

        // Pause animations when tab is hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                document.body.classList.add('animations-paused');
            } else {
                document.body.classList.remove('animations-paused');
            }
        });

        // Add global animation pause style
        const style = document.createElement('style');
        style.textContent = `
            .animations-paused * {
                animation-play-state: paused !important;
            }
            
            @keyframes pulse {
                0%, 100% {
                    background-position: 200% 0;
                }
                50% {
                    background-position: 0 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ===== RESOURCE PRELOADING =====
    
    preloadCriticalResources() {
        // Preload critical fonts
        const criticalFonts = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
            'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap'
        ];

        criticalFonts.forEach(fontUrl => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = fontUrl;
            document.head.appendChild(link);
        });

        // Prefetch next/previous lesson
        const nextLink = document.querySelector('.tutorial-navigation a[href*=".html"]:last-of-type');
        const prevLink = document.querySelector('.tutorial-navigation a[href*=".html"]:first-of-type');
        
        [nextLink, prevLink].forEach(link => {
            if (link) {
                const prefetchLink = document.createElement('link');
                prefetchLink.rel = 'prefetch';
                prefetchLink.href = link.href;
                document.head.appendChild(prefetchLink);
            }
        });
    }

    // ===== SCROLL PERFORMANCE =====
    
    optimizeScrollPerformance() {
        // Use passive event listeners for scroll
        let scrollTimeout;
        const scrollHandler = () => {
            document.body.classList.add('is-scrolling');
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                document.body.classList.remove('is-scrolling');
            }, 150);
        };

        window.addEventListener('scroll', scrollHandler, { passive: true });

        // Add CSS for scroll optimization
        const style = document.createElement('style');
        style.textContent = `
            .is-scrolling * {
                pointer-events: none;
            }
            
            .is-scrolling {
                pointer-events: auto;
            }
        `;
        document.head.appendChild(style);
    }

    // ===== REDUCE LAYOUT SHIFTS =====
    
    reduceLayoutShifts() {
        // Add aspect ratio containers for images
        const images = document.querySelectorAll('img:not([width]):not([height])');
        
        images.forEach(img => {
            const observer = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    const { width, height } = entry.contentRect;
                    if (width && height) {
                        img.setAttribute('width', width);
                        img.setAttribute('height', height);
                        observer.disconnect();
                    }
                }
            });
            
            observer.observe(img);
        });

        // Reserve space for dynamic content
        const dynamicContainers = document.querySelectorAll('[data-dynamic-height]');
        
        dynamicContainers.forEach(container => {
            const minHeight = container.dataset.dynamicHeight;
            container.style.minHeight = minHeight;
        });
    }

    // ===== PERFORMANCE MONITORING =====
    
    static measurePerformance() {
        if (!window.performance) return;

        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                const connectTime = perfData.responseEnd - perfData.requestStart;
                const renderTime = perfData.domComplete - perfData.domLoading;

                console.log('📊 Performance Metrics:');
                console.log(`  Page Load Time: ${pageLoadTime}ms`);
                console.log(`  Connect Time: ${connectTime}ms`);
                console.log(`  Render Time: ${renderTime}ms`);

                // Store metrics
                localStorage.setItem('performance-metrics', JSON.stringify({
                    pageLoadTime,
                    connectTime,
                    renderTime,
                    timestamp: Date.now()
                }));
            }, 0);
        });
    }

    // ===== CODE SPLITTING =====
    
    static lazyLoadFeatures() {
        // Lazy load heavy features on interaction
        const heavyFeatures = {
            'chart': () => import('https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js'),
            'markdown': () => import('https://cdn.jsdelivr.net/npm/marked/marked.min.js')
        };

        Object.keys(heavyFeatures).forEach(featureName => {
            const triggers = document.querySelectorAll(`[data-lazy="${featureName}"]`);
            
            triggers.forEach(trigger => {
                const loadFeature = () => {
                    heavyFeatures[featureName]().then(() => {
                        console.log(`✅ Loaded: ${featureName}`);
                        trigger.classList.add('feature-loaded');
                    });
                    
                    trigger.removeEventListener('click', loadFeature);
                    trigger.removeEventListener('mouseover', loadFeature);
                };

                trigger.addEventListener('click', loadFeature, { once: true });
                trigger.addEventListener('mouseover', loadFeature, { once: true });
            });
        });
    }

    // ===== MEMORY OPTIMIZATION =====
    
    static optimizeMemory() {
        // Clear old localStorage data
        const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('temp-')) {
                const item = localStorage.getItem(key);
                try {
                    const data = JSON.parse(item);
                    if (data.timestamp && Date.now() - data.timestamp > maxAge) {
                        localStorage.removeItem(key);
                    }
                } catch (e) {
                    // Invalid JSON, skip
                }
            }
        }
    }

    // ===== NETWORK OPTIMIZATION =====
    
    static optimizeNetworkRequests() {
        // Add connection hints
        const connections = [
            { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
            { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
            { rel: 'dns-prefetch', href: '//cdn.jsdelivr.net' },
            { rel: 'preconnect', href: 'https://fonts.googleapis.com', crossorigin: true },
            { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true }
        ];

        connections.forEach(conn => {
            const link = document.createElement('link');
            link.rel = conn.rel;
            link.href = conn.href;
            if (conn.crossorigin) link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }
}

// Initialize performance optimizations
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PerformanceOptimizer();
        PerformanceOptimizer.measurePerformance();
        PerformanceOptimizer.optimizeMemory();
        PerformanceOptimizer.optimizeNetworkRequests();
    });
} else {
    new PerformanceOptimizer();
    PerformanceOptimizer.measurePerformance();
    PerformanceOptimizer.optimizeMemory();
    PerformanceOptimizer.optimizeNetworkRequests();
}

