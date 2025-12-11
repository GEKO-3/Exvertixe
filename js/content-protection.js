// Content Protection System
// Note: This provides deterrence only. Determined users can still capture content.

(function() {
    'use strict';

    // Disable right-click on protected content
    document.addEventListener('contextmenu', function(e) {
        if (e.target.closest('.protected-content')) {
            e.preventDefault();
            showProtectionWarning();
            return false;
        }
    });

    // Disable keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        const target = e.target.closest('.protected-content');
        if (!target) return;

        // Prevent common screenshot/save shortcuts
        const forbidden = [
            (e.ctrlKey || e.metaKey) && e.key === 's', // Save
            (e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 's', // Save As
            (e.ctrlKey || e.metaKey) && e.key === 'p', // Print
            (e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'i' || e.key === 'I'), // DevTools
            (e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'j' || e.key === 'J'), // Console
            (e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U'), // View Source
            e.key === 'F12', // DevTools
            e.key === 'PrintScreen' || e.key === 'Print', // Screenshot
        ];

        if (forbidden.some(condition => condition)) {
            e.preventDefault();
            showProtectionWarning();
            return false;
        }
    });

    // Detect DevTools opening
    let devtoolsOpen = false;
    const element = new Image();
    Object.defineProperty(element, 'id', {
        get: function() {
            devtoolsOpen = true;
            blurProtectedContent();
        }
    });

    setInterval(function() {
        devtoolsOpen = false;
        console.log(element);
        if (devtoolsOpen) {
            blurProtectedContent();
        } else {
            unblurProtectedContent();
        }
    }, 1000);

    // Detect window blur (possible screenshot)
    let blurTimeout;
    window.addEventListener('blur', function() {
        blurTimeout = setTimeout(() => {
            blurProtectedContent();
        }, 100);
    });

    window.addEventListener('focus', function() {
        clearTimeout(blurTimeout);
        setTimeout(() => {
            unblurProtectedContent();
        }, 500);
    });

    // Prevent drag and drop
    document.addEventListener('dragstart', function(e) {
        if (e.target.closest('.protected-content')) {
            e.preventDefault();
            return false;
        }
    });

    // Disable selection
    document.addEventListener('selectstart', function(e) {
        if (e.target.closest('.protected-content')) {
            e.preventDefault();
            return false;
        }
    });

    // Monitor for screenshot attempts via Page Visibility API
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            blurProtectedContent();
        } else {
            setTimeout(() => {
                unblurProtectedContent();
            }, 500);
        }
    });

    // Watermark injection
    function addWatermarks() {
        const protectedItems = document.querySelectorAll('.protected-content');
        protectedItems.forEach(item => {
            if (!item.querySelector('.watermark-overlay')) {
                const overlay = document.createElement('div');
                overlay.className = 'watermark-overlay';
                
                const watermarkText = document.createElement('div');
                watermarkText.className = 'watermark-text';
                watermarkText.textContent = 'EXVERTIXE PREVIEW';
                
                const protectionLayer = document.createElement('div');
                protectionLayer.className = 'protection-layer';
                
                item.style.position = 'relative';
                item.appendChild(overlay);
                item.appendChild(watermarkText);
                item.appendChild(protectionLayer);
            }
        });
    }

    // Blur content
    function blurProtectedContent() {
        const protectedItems = document.querySelectorAll('.protected-content');
        protectedItems.forEach(item => {
            item.classList.add('blur-active');
        });
    }

    // Unblur content
    function unblurProtectedContent() {
        const protectedItems = document.querySelectorAll('.protected-content');
        protectedItems.forEach(item => {
            item.classList.remove('blur-active');
        });
    }

    // Show warning message
    function showProtectionWarning() {
        const existingWarning = document.querySelector('.protection-warning');
        if (existingWarning) return;

        const warning = document.createElement('div');
        warning.className = 'protection-warning';
        warning.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #af73ef, #3f8fef);
            color: white;
            padding: 2rem 3rem;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            text-align: center;
            animation: slideIn 0.3s ease-out;
        `;
        warning.innerHTML = `
            <h3 style="margin: 0 0 1rem 0; font-size: 1.5rem;">⚠️ Content Protected</h3>
            <p style="margin: 0;">This content is protected and cannot be downloaded or copied.</p>
            <p style="margin: 1rem 0 0 0; font-size: 0.9rem;">Contact us to purchase full-resolution files.</p>
        `;

        document.body.appendChild(warning);

        setTimeout(() => {
            warning.style.opacity = '0';
            warning.style.transition = 'opacity 0.3s';
            setTimeout(() => warning.remove(), 300);
        }, 3000);
    }

    // Lazy load high-res images only when authenticated
    function initializeLazyProtectedImages() {
        const images = document.querySelectorAll('.protected-content img[data-high-res]');
        
        images.forEach(img => {
            // Start with low-res version
            img.classList.add('low-res');
            
            // Only load high-res if user is authenticated
            // You can check authentication status here
            const isAuthenticated = false; // Replace with actual auth check
            
            if (isAuthenticated) {
                const highResUrl = img.getAttribute('data-high-res');
                const lowResUrl = img.src;
                
                // Load high-res image
                const highResImage = new Image();
                highResImage.onload = function() {
                    img.src = highResUrl;
                    img.classList.remove('low-res');
                    img.classList.add('high-res');
                };
                highResImage.src = highResUrl;
            }
        });
    }

    // Disable inspect element
    document.addEventListener('contextmenu', function(e) {
        if (e.target.closest('.protected-content')) {
            e.preventDefault();
        }
    }, false);

    // Initialize protection on DOM load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            addWatermarks();
            initializeLazyProtectedImages();
        });
    } else {
        addWatermarks();
        initializeLazyProtectedImages();
    }

    // Re-apply protection on dynamic content
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                addWatermarks();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Prevent console manipulation
    if (typeof console !== 'undefined') {
        const originalLog = console.log;
        console.log = function() {
            // Still allow logging but detect when console is open
            return originalLog.apply(console, arguments);
        };
    }

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translate(-50%, -60%);
            }
            to {
                opacity: 1;
                transform: translate(-50%, -50%);
            }
        }
    `;
    document.head.appendChild(style);

})();

// Export functions if needed
window.ContentProtection = {
    protect: function(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => el.classList.add('protected-content'));
    },
    unprotect: function(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => el.classList.remove('protected-content'));
    }
};
