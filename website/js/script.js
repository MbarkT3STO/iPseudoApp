// ===== iPseudo IDE Website - Interactive Script =====

// ===== THEME TOGGLE =====
// Load saved theme on page load
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

// Update theme toggle icons based on current theme
function updateThemeIcons(theme) {
    const lightIcon = document.getElementById('lightIcon');
    const darkIcon = document.getElementById('darkIcon');
    
    if (lightIcon && darkIcon) {
        if (theme === 'light') {
            lightIcon.classList.add('hidden');
            lightIcon.classList.remove('visible');
            darkIcon.classList.remove('hidden');
            darkIcon.classList.add('visible');
        } else {
            lightIcon.classList.remove('hidden');
            lightIcon.classList.add('visible');
            darkIcon.classList.add('hidden');
            darkIcon.classList.remove('visible');
        }
    }
}

// Initialize theme icons
updateThemeIcons(savedTheme);

// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Add rotation animation class
        themeToggle.classList.add('theme-changing');
        
        // Update theme
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcons(newTheme);
        
        // Remove animation class after animation completes
        setTimeout(() => {
            themeToggle.classList.remove('theme-changing');
        }, 600);
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 60px rgba(147, 51, 234, 0.2)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Syntax tabs
const syntaxTabs = document.querySelectorAll('.syntax-tab');
const syntaxExamples = document.querySelectorAll('.syntax-example-box');

syntaxTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const exampleName = tab.getAttribute('data-example');
        
        // Remove active class from all tabs and examples
        syntaxTabs.forEach(t => t.classList.remove('active'));
        syntaxExamples.forEach(e => e.classList.remove('active'));
        
        // Add active class to clicked tab
        tab.classList.add('active');
        
        // Show corresponding example
        const activeExample = document.querySelector(`.syntax-example-box[data-example="${exampleName}"]`);
        if (activeExample) {
            activeExample.classList.add('active');
        }
    });
});

// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navMenu.classList.toggle('mobile-active');
        const icon = mobileMenuBtn.querySelector('i');
        
        if (navMenu.classList.contains('mobile-active')) {
            icon.className = 'ri-close-line';
        } else {
            icon.className = 'ri-menu-line';
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            navMenu.classList.remove('mobile-active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.className = 'ri-menu-line';
        }
    });
    
    // Close menu when clicking a nav link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('mobile-active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.className = 'ri-menu-line';
        });
    });
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) {
                navMenu.classList.remove('mobile-active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.className = 'ri-menu-line';
            }
        }, 250);
    });
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-card, .download-card, .doc-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Parallax effect for hero elements
window.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;
    
    const orbs = document.querySelectorAll('.gradient-orb');
    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 0.05;
        const x = mouseX * speed * 100;
        const y = mouseY * speed * 100;
        orb.style.transform = `translate(${x}px, ${y}px)`;
        orb.style.transition = 'transform 0.3s ease-out';
    });
});

// Download button handlers (only for direct download links, not dropdown toggles)
document.querySelectorAll('.btn-download:not(.btn-dropdown-toggle)').forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Add visual feedback
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 200);
        
        // Log download attempt
        console.log('Direct download button clicked:', btn.href);
    });
});

// Add typing effect to code preview
function typeCode() {
    const codePreview = document.querySelector('.code-preview');
    if (!codePreview) return;
    
    const originalText = codePreview.innerHTML;
    codePreview.innerHTML = '';
    
    let i = 0;
    const typeInterval = setInterval(() => {
        if (i < originalText.length) {
            codePreview.innerHTML += originalText.charAt(i);
            i++;
        } else {
            clearInterval(typeInterval);
        }
    }, 30);
}

// Trigger typing effect on load (optional)
// setTimeout(typeCode, 1000);

// Add glow effect on hover to feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.boxShadow = `
            0 16px 40px rgba(0, 0, 0, 0.25),
            0 0 60px rgba(147, 51, 234, 0.4),
            0 0 90px rgba(139, 92, 246, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.3)
        `;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.boxShadow = '';
    });
});

// Animated counter for stats (if visible)
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(progress * target);
        element.textContent = current + '+';
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Trigger counter animation when stats come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            const value = entry.target.querySelector('.stat-value');
            if (value && value.textContent.includes('+')) {
                const target = parseInt(value.textContent);
                if (!isNaN(target)) {
                    animateCounter(value, target);
                    entry.target.dataset.animated = 'true';
                }
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(stat => {
    statsObserver.observe(stat);
});

// Add particle effect on click
document.addEventListener('click', (e) => {
    createRipple(e.clientX, e.clientY);
});

function createRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(147, 51, 234, 0.6), transparent);
        pointer-events: none;
        z-index: 9999;
        left: ${x}px;
        top: ${y}px;
        transform: translate(-50%, -50%) scale(0);
        animation: rippleExpand 0.6s ease-out forwards;
    `;
    
    document.body.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleExpand {
        to {
            transform: translate(-50%, -50%) scale(20);
            opacity: 0;
        }
    }
    
    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        right: 0;
        background: rgba(10, 10, 15, 0.95);
        padding: var(--space-lg);
        border-radius: var(--radius-lg);
        border: 1px solid rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(24px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    }
`;
document.head.appendChild(style);

// Console welcome message
console.log('%c✨ Welcome to iPseudo IDE Website! ✨', 
    'font-size: 20px; font-weight: bold; background: linear-gradient(135deg, rgb(147, 51, 234), rgb(59, 130, 246)); -webkit-background-clip: text; color: transparent;'
);
console.log('%cBuilt with ❤️ using Glass Morphism Design',
    'font-size: 14px; color: rgb(147, 51, 234);'
);

// ===== LIGHTBOX FUNCTIONALITY =====
function openLightbox(imageSrc, caption) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    
    lightboxImage.src = imageSrc;
    lightboxCaption.textContent = caption;
    lightbox.classList.add('active');
    
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    
    // Restore body scroll
    document.body.style.overflow = '';
}

// Close lightbox on background click
document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
});

// Close lightbox with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const lightbox = document.getElementById('lightbox');
        if (lightbox && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    }
});

// ===== DOWNLOAD DROPDOWN FUNCTIONALITY =====
function initDownloadDropdowns() {
    // Find all dropdown cards
    const dropdownCards = document.querySelectorAll('.download-card-dropdown');
    
    dropdownCards.forEach(card => {
        const toggleButton = card.querySelector('.btn-dropdown-toggle');
        const dropdownMenu = card.querySelector('.dropdown-menu');
        
        if (toggleButton && dropdownMenu) {
            // Add click event to toggle button
            toggleButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Close all other dropdowns
                dropdownCards.forEach(otherCard => {
                    if (otherCard !== card) {
                        otherCard.classList.remove('active');
                    }
                });
                
                // Toggle current dropdown
                card.classList.toggle('active');
            });
            
            // Add click events to dropdown items
            const dropdownItems = dropdownMenu.querySelectorAll('.dropdown-item');
            dropdownItems.forEach(item => {
                item.addEventListener('click', function() {
                    // Close dropdown after selection
                    card.classList.remove('active');
                });
            });
        }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.download-card-dropdown')) {
            dropdownCards.forEach(card => {
                card.classList.remove('active');
            });
        }
    });
    
    // Close dropdowns with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            dropdownCards.forEach(card => {
                card.classList.remove('active');
            });
        }
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDownloadDropdowns);
} else {
    initDownloadDropdowns();
}

