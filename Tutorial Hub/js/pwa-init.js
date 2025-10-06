/**
 * PWA Initialization
 * Registers service worker and handles PWA installation
 */

// Register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('✅ Service Worker registered:', registration.scope);
                
                // Check for updates periodically
                setInterval(() => {
                    registration.update();
                }, 60000); // Check every minute
                
                // Handle updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New version available
                            showUpdateNotification(newWorker);
                        }
                    });
                });
            })
            .catch(error => {
                console.log('❌ Service Worker registration failed:', error);
            });
    });
}

// Handle install prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing
    e.preventDefault();
    
    // Store the event for later use
    deferredPrompt = e;
    
    // Show custom install button
    showInstallButton();
});

window.addEventListener('appinstalled', () => {
    console.log('✅ PWA installed successfully!');
    deferredPrompt = null;
    hideInstallButton();
    
    // Track installation
    if (typeof gtag !== 'undefined') {
        gtag('event', 'pwa_install', {
            event_category: 'engagement',
            event_label: 'PWA Installed'
        });
    }
});

function showInstallButton() {
    // Create install button if it doesn't exist
    if (document.getElementById('pwaInstallBtn')) return;
    
    const installBtn = document.createElement('button');
    installBtn.id = 'pwaInstallBtn';
    installBtn.innerHTML = `
        <i class="ri-download-line"></i>
        <span>Install App</span>
    `;
    installBtn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        padding: 1rem 1.5rem;
        background: linear-gradient(135deg, var(--color-purple-500), var(--color-blue-500));
        border: none;
        border-radius: var(--radius-md);
        color: white;
        font-weight: 600;
        font-size: 1rem;
        cursor: pointer;
        box-shadow: 0 8px 24px rgba(147, 51, 234, 0.4);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.3s;
        animation: slideUp 0.5s;
    `;
    
    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        
        // Show the install prompt
        deferredPrompt.prompt();
        
        // Wait for the user's response
        const { outcome } = await deferredPrompt.userChoice;
        
        console.log(`User response: ${outcome}`);
        
        // Clear the deferred prompt
        deferredPrompt = null;
        
        // Hide the install button
        hideInstallButton();
    });
    
    installBtn.addEventListener('mouseenter', () => {
        installBtn.style.transform = 'translateY(-4px)';
        installBtn.style.boxShadow = '0 12px 32px rgba(147, 51, 234, 0.5)';
    });
    
    installBtn.addEventListener('mouseleave', () => {
        installBtn.style.transform = 'translateY(0)';
        installBtn.style.boxShadow = '0 8px 24px rgba(147, 51, 234, 0.4)';
    });
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '<i class="ri-close-line"></i>';
    closeBtn.style.cssText = `
        position: absolute;
        top: -8px;
        right: -8px;
        width: 24px;
        height: 24px;
        padding: 0;
        background: var(--color-red-500);
        border: 2px solid white;
        border-radius: 50%;
        color: white;
        font-size: 0.875rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        hideInstallButton();
    });
    
    installBtn.style.position = 'relative';
    installBtn.appendChild(closeBtn);
    
    document.body.appendChild(installBtn);
}

function hideInstallButton() {
    const installBtn = document.getElementById('pwaInstallBtn');
    if (installBtn) {
        installBtn.style.animation = 'slideDown 0.3s';
        setTimeout(() => installBtn.remove(), 300);
    }
}

function showUpdateNotification(newWorker) {
    const notification = document.createElement('div');
    notification.id = 'updateNotification';
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: var(--space-md);">
            <i class="ri-refresh-line" style="font-size: 1.5rem; color: var(--color-blue-500);"></i>
            <div style="flex: 1;">
                <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem;">Update Available</div>
                <div style="font-size: 0.875rem; color: var(--text-secondary);">A new version is ready to install</div>
            </div>
            <button id="updateBtn" style="padding: 0.5rem 1rem; background: var(--color-blue-500); border: none; border-radius: var(--radius-sm); color: white; font-weight: 600; cursor: pointer;">
                Update
            </button>
            <button id="dismissUpdateBtn" style="padding: 0.5rem; background: transparent; border: none; color: var(--text-secondary); cursor: pointer;">
                <i class="ri-close-line" style="font-size: 1.25rem;"></i>
            </button>
        </div>
    `;
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        left: 50%;
        transform: translateX(-50%);
        width: 90%;
        max-width: 500px;
        padding: var(--space-lg);
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-lg);
        backdrop-filter: blur(20px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideDown 0.3s;
    `;
    
    document.body.appendChild(notification);
    
    document.getElementById('updateBtn').addEventListener('click', () => {
        newWorker.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
    });
    
    document.getElementById('dismissUpdateBtn').addEventListener('click', () => {
        notification.remove();
    });
}

// Add CSS animations
const pwaStyle = document.createElement('style');
pwaStyle.textContent = `
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideDown {
        from {
            opacity: 1;
            transform: translateY(0) translateX(-50%);
        }
        to {
            opacity: 0;
            transform: translateY(-20px) translateX(-50%);
        }
    }
`;
document.head.appendChild(pwaStyle);

