// Dashboard functionality

let currentUser = null;

// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    // Wait for Firebase to initialize
    setTimeout(() => {
        if (typeof auth !== 'undefined') {
            auth.onAuthStateChanged(async (user) => {
                if (user) {
                    currentUser = user;
                    await initializeDashboard(user);
                } else {
                    // Redirect to login if not authenticated
                    window.location.href = 'login.html';
                }
            });
        }
    }, 500);
});

// Initialize dashboard with user data
async function initializeDashboard(user) {
    // Update user name
    const userName = document.getElementById('userName');
    if (userName) {
        userName.textContent = user.displayName || user.email.split('@')[0];
    }
    
    // Load subscriptions
    await loadUserSubscriptions(user.uid);
    
    // Load packages for browsing
    await loadBrowsePackages();
    
    // Setup tabs
    setupTabs();
    
    // Setup logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Setup settings form
    setupSettingsForm(user);
    
    // Check for subscription or promo in URL
    checkURLParameters();
}

// Setup tab navigation
function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            
            // Remove active class from all tabs
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            btn.classList.add('active');
            const content = document.getElementById(tabName);
            if (content) {
                content.classList.add('active');
            }
        });
    });
}

// Load user's subscriptions
async function loadUserSubscriptions(userId) {
    const container = document.getElementById('subscriptionsContainer');
    if (!container) return;
    
    container.innerHTML = '<p style="text-align: center;">Loading subscriptions...</p>';
    
    const subscriptions = await getUserSubscriptions(userId);
    
    if (subscriptions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📦</div>
                <h3>No Active Subscriptions</h3>
                <p>You don't have any subscriptions yet. Browse our packages to get started!</p>
                <button class="btn btn-primary" onclick="switchToTab('browse')">Browse Packages</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    subscriptions.forEach(sub => {
        const card = createSubscriptionCard(sub);
        container.appendChild(card);
    });
}

// Create subscription card
function createSubscriptionCard(subscription) {
    const card = document.createElement('div');
    card.className = 'subscription-card';
    
    const pkg = subscription.package;
    const statusClass = subscription.status === 'active' ? 'active' : 'cancelled';
    const startDate = subscription.startDate?.toDate ? subscription.startDate.toDate().toLocaleDateString() : 'N/A';
    
    card.innerHTML = `
        <div class="subscription-header">
            <div class="subscription-info">
                <h3>${pkg ? pkg.name : 'Package'}</h3>
                <p style="color: var(--text-light);">Subscription ID: ${subscription.id}</p>
            </div>
            <span class="status-badge ${statusClass}">${subscription.status.toUpperCase()}</span>
        </div>
        
        <div class="subscription-details">
            <div class="detail-item">
                <label>Monthly Price</label>
                <div class="value">$${pkg ? pkg.price : 'N/A'}</div>
            </div>
            <div class="detail-item">
                <label>Start Date</label>
                <div class="value">${startDate}</div>
            </div>
            <div class="detail-item">
                <label>Months Completed</label>
                <div class="value">${subscription.monthsCompleted || 0} / ${subscription.minimumMonths}</div>
            </div>
            <div class="detail-item">
                <label>Auto-Renew</label>
                <div class="value">${subscription.autoRenew ? 'Yes' : 'No'}</div>
            </div>
        </div>
        
        ${subscription.status === 'active' ? `
            <div class="subscription-actions">
                <button class="btn btn-outline" onclick="viewSubscriptionDetails('${subscription.id}')">
                    View Details
                </button>
                <button class="btn btn-outline" onclick="toggleAutoRenew('${subscription.id}', ${!subscription.autoRenew})">
                    ${subscription.autoRenew ? 'Disable' : 'Enable'} Auto-Renew
                </button>
                ${subscription.monthsCompleted >= subscription.minimumMonths ? `
                    <button class="btn btn-danger" onclick="cancelSubscriptionConfirm('${subscription.id}')">
                        Cancel Subscription
                    </button>
                ` : `
                    <button class="btn btn-outline" disabled title="Minimum commitment not met">
                        Cancel (Available after 6 months)
                    </button>
                `}
            </div>
        ` : ''}
    `;
    
    return card;
}

// Load packages for browsing
async function loadBrowsePackages() {
    const container = document.getElementById('browsePackagesContainer');
    if (!container) return;
    
    // Reuse the packages loading from packages.js
    const packages = await getPackages();
    
    if (packages.length === 0) {
        packagesData.forEach(pkg => {
            const card = createDashboardPackageCard(pkg);
            container.appendChild(card);
        });
    } else {
        packages.forEach(pkg => {
            const card = createDashboardPackageCard(pkg);
            container.appendChild(card);
        });
    }
}

// Create package card for dashboard
function createDashboardPackageCard(pkg) {
    const card = document.createElement('div');
    card.className = 'package-card';
    
    let imageHTML = '';
    if (pkg.imageUrl) {
        imageHTML = `<img src="${pkg.imageUrl}" alt="${pkg.name}" class="package-image">`;
    } else {
        imageHTML = `<div class="package-image"></div>`;
    }
    
    const featuredBadge = pkg.featured ? '<span class="badge">Most Popular</span>' : '';
    
    card.innerHTML = `
        ${imageHTML}
        <div class="package-content">
            ${featuredBadge}
            <h3 class="package-name">${pkg.name}</h3>
            <div class="package-price">$${pkg.price}<span>/month</span></div>
            <p class="package-description">${pkg.description}</p>
            <ul class="package-features">
                ${pkg.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
            <button class="btn btn-primary subscribe-dashboard-btn" data-package-id="${pkg.id}">
                Subscribe Now
            </button>
        </div>
    `;
    
    const subscribeBtn = card.querySelector('.subscribe-dashboard-btn');
    subscribeBtn.addEventListener('click', () => {
        handleDashboardSubscribe(pkg.id);
    });
    
    return card;
}

// Handle subscription from dashboard
async function handleDashboardSubscribe(packageId) {
    if (!currentUser) return;
    
    const result = await createSubscription(currentUser.uid, packageId);
    
    if (result.success) {
        alert('Subscription created successfully!');
        await loadUserSubscriptions(currentUser.uid);
        switchToTab('subscriptions');
    } else {
        alert('Error creating subscription: ' + result.error);
    }
}

// Switch to a specific tab
function switchToTab(tabName) {
    const tabBtn = document.querySelector(`[data-tab="${tabName}"]`);
    if (tabBtn) {
        tabBtn.click();
    }
}

// Cancel subscription with confirmation
function cancelSubscriptionConfirm(subscriptionId) {
    if (confirm('Are you sure you want to cancel this subscription? This action cannot be undone.')) {
        handleCancelSubscription(subscriptionId);
    }
}

// Handle subscription cancellation
async function handleCancelSubscription(subscriptionId) {
    const result = await cancelSubscription(subscriptionId);
    
    if (result.success) {
        alert('Subscription cancelled successfully.');
        await loadUserSubscriptions(currentUser.uid);
    } else {
        alert('Error cancelling subscription: ' + result.error);
    }
}

// Toggle auto-renew
async function toggleAutoRenew(subscriptionId, newValue) {
    try {
        await db.collection('subscriptions').doc(subscriptionId).update({
            autoRenew: newValue
        });
        
        alert(`Auto-renew ${newValue ? 'enabled' : 'disabled'} successfully.`);
        await loadUserSubscriptions(currentUser.uid);
    } catch (error) {
        console.error('Error updating auto-renew:', error);
        alert('Error updating auto-renew setting.');
    }
}

// View subscription details
function viewSubscriptionDetails(subscriptionId) {
    alert('Subscription details view - to be implemented');
    // TODO: Show modal or navigate to detailed view
}

// Setup settings form
function setupSettingsForm(user) {
    const settingsForm = document.getElementById('settingsForm');
    const displayNameInput = document.getElementById('displayName');
    const emailDisplay = document.getElementById('emailDisplay');
    
    if (displayNameInput) displayNameInput.value = user.displayName || '';
    if (emailDisplay) emailDisplay.value = user.email;
    
    if (settingsForm) {
        settingsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const newDisplayName = displayNameInput.value;
            const newPassword = document.getElementById('newPassword').value;
            
            try {
                // Update display name
                if (newDisplayName !== user.displayName) {
                    await user.updateProfile({ displayName: newDisplayName });
                }
                
                // Update password if provided
                if (newPassword) {
                    await user.updatePassword(newPassword);
                }
                
                showSettingsSuccess('Settings updated successfully!');
                document.getElementById('newPassword').value = '';
            } catch (error) {
                console.error('Error updating settings:', error);
                showSettingsError('Error updating settings: ' + error.message);
            }
        });
    }
}

// Show settings success message
function showSettingsSuccess(message) {
    const successMsg = document.getElementById('settingsMessage');
    if (successMsg) {
        successMsg.textContent = message;
        successMsg.classList.add('show');
        setTimeout(() => successMsg.classList.remove('show'), 5000);
    }
}

// Show settings error message
function showSettingsError(message) {
    const errorMsg = document.getElementById('settingsError');
    if (errorMsg) {
        errorMsg.textContent = message;
        errorMsg.classList.add('show');
        setTimeout(() => errorMsg.classList.remove('show'), 5000);
    }
}

// Check URL parameters for subscription/promo
function checkURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const subscribeParam = urlParams.get('subscribe');
    const promoParam = urlParams.get('promo');
    
    if (subscribeParam || promoParam) {
        // Switch to browse tab and highlight the relevant package
        switchToTab('browse');
        // TODO: Auto-scroll or highlight specific package
    }
}
