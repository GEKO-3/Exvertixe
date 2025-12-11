// Admin Panel Functionality

let currentUser = null;
let packageImageWidget = null;
let promotionImageWidget = null;

// Check authentication and admin role
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (typeof auth !== 'undefined') {
            auth.onAuthStateChanged(async (user) => {
                if (user) {
                    // Check if user is admin
                    const isAdmin = await checkAdminRole(user.uid);
                    if (isAdmin) {
                        currentUser = user;
                        await initializeAdmin();
                    } else {
                        alert('Access denied. Admin privileges required.');
                        window.location.href = 'dashboard.html';
                    }
                } else {
                    window.location.href = 'login.html';
                }
            });
        }
    }, 500);
});

// Check if user has admin role
async function checkAdminRole(userId) {
    try {
        const userDoc = await db.collection('users').doc(userId).get();
        const userData = userDoc.data();
        return userData && userData.role === 'admin';
    } catch (error) {
        console.error('Error checking admin role:', error);
        return false;
    }
}

// Initialize admin panel
async function initializeAdmin() {
    setupTabs();
    setupModals();
    await loadPackages();
    await loadPromotions();
    
    // Logout
    document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);
}

// Setup tab navigation
function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(tabName)?.classList.add('active');
            
            // Load data for the tab
            if (tabName === 'subscriptions') {
                loadAllSubscriptions();
            } else if (tabName === 'contacts') {
                loadContactMessages();
            }
        });
    });
}

// Setup modals
function setupModals() {
    // Package modal
    const packageModal = document.getElementById('packageModal');
    const addPackageBtn = document.getElementById('addPackageBtn');
    const closePackageModal = document.getElementById('closePackageModal');
    const cancelPackageBtn = document.getElementById('cancelPackageBtn');
    
    addPackageBtn?.addEventListener('click', () => {
        openPackageModal();
    });
    
    closePackageModal?.addEventListener('click', () => {
        packageModal.classList.remove('show');
    });
    
    cancelPackageBtn?.addEventListener('click', () => {
        packageModal.classList.remove('show');
    });
    
    // Package form submit
    document.getElementById('packageForm')?.addEventListener('submit', handlePackageSubmit);
    
    // Promotion modal
    const promotionModal = document.getElementById('promotionModal');
    const addPromotionBtn = document.getElementById('addPromotionBtn');
    const closePromotionModal = document.getElementById('closePromotionModal');
    const cancelPromotionBtn = document.getElementById('cancelPromotionBtn');
    
    addPromotionBtn?.addEventListener('click', () => {
        openPromotionModal();
    });
    
    closePromotionModal?.addEventListener('click', () => {
        promotionModal.classList.remove('show');
    });
    
    cancelPromotionBtn?.addEventListener('click', () => {
        promotionModal.classList.remove('show');
    });
    
    // Promotion form submit
    document.getElementById('promotionForm')?.addEventListener('submit', handlePromotionSubmit);
}

// Load packages
async function loadPackages() {
    const container = document.getElementById('packagesListContainer');
    if (!container) return;
    
    container.innerHTML = '<p>Loading packages...</p>';
    
    try {
        const snapshot = await db.collection('packages').orderBy('price', 'asc').get();
        const packages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        container.innerHTML = '';
        
        if (packages.length === 0) {
            container.innerHTML = '<p>No packages found. Add your first package!</p>';
            return;
        }
        
        packages.forEach(pkg => {
            const item = createPackageItem(pkg);
            container.appendChild(item);
        });
    } catch (error) {
        console.error('Error loading packages:', error);
        container.innerHTML = '<p>Error loading packages.</p>';
    }
}

// Create package item
function createPackageItem(pkg) {
    const item = document.createElement('div');
    item.className = 'admin-item';
    
    const imageHTML = pkg.imageUrl 
        ? `<img src="${pkg.imageUrl}" alt="${pkg.name}" class="admin-item-image">`
        : `<div class="admin-item-image"></div>`;
    
    const featuresHTML = pkg.features 
        ? `<ul class="features-list">${pkg.features.map(f => `<li>${f}</li>`).join('')}</ul>`
        : '';
    
    item.innerHTML = `
        ${imageHTML}
        <div class="admin-item-content">
            <div class="admin-item-header">
                <div>
                    <h3 class="admin-item-title">${pkg.name}</h3>
                    <div class="admin-item-meta">
                        <span><strong>$${pkg.price}/month</strong></span>
                        ${pkg.featured ? '<span class="badge">Featured</span>' : ''}
                        <span>
                            <span class="status-indicator ${pkg.active ? 'active' : 'inactive'}"></span>
                            ${pkg.active ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>
            </div>
            <p class="admin-item-description">${pkg.description || ''}</p>
            ${featuresHTML}
            <div class="admin-item-actions">
                <button class="btn btn-small btn-edit" onclick="editPackage('${pkg.id}')">Edit</button>
                <button class="btn btn-small btn-toggle ${pkg.active ? 'active' : ''}" onclick="togglePackageStatus('${pkg.id}', ${!pkg.active})">
                    ${pkg.active ? 'Deactivate' : 'Activate'}
                </button>
                <button class="btn btn-small btn-delete" onclick="deletePackage('${pkg.id}')">Delete</button>
            </div>
        </div>
    `;
    
    return item;
}

// Open package modal
function openPackageModal(packageData = null) {
    const modal = document.getElementById('packageModal');
    const form = document.getElementById('packageForm');
    const title = document.getElementById('packageModalTitle');
    
    form.reset();
    
    if (packageData) {
        title.textContent = 'Edit Package';
        document.getElementById('packageId').value = packageData.id;
        document.getElementById('packageName').value = packageData.name;
        document.getElementById('packagePrice').value = packageData.price;
        document.getElementById('packageDescription').value = packageData.description || '';
        document.getElementById('packageFeatured').checked = packageData.featured || false;
        document.getElementById('packageFeatures').value = packageData.features?.join('\n') || '';
    } else {
        title.textContent = 'Add New Package';
        document.getElementById('packageId').value = '';
    }
    
    // Setup image upload widget
    const uploadContainer = document.getElementById('packageImageUpload');
    uploadContainer.innerHTML = '';
    packageImageWidget = createImageUploadWidget('packageImageUpload', (url) => {
        console.log('Package image uploaded:', url);
    });
    
    if (packageData?.imageUrl) {
        packageImageWidget.setImage(packageData.imageUrl);
    }
    
    modal.classList.add('show');
}

// Handle package form submit
async function handlePackageSubmit(e) {
    e.preventDefault();
    
    const packageId = document.getElementById('packageId').value;
    const packageData = {
        name: document.getElementById('packageName').value,
        price: parseFloat(document.getElementById('packagePrice').value),
        description: document.getElementById('packageDescription').value,
        featured: document.getElementById('packageFeatured').checked,
        features: document.getElementById('packageFeatures').value.split('\n').filter(f => f.trim()),
        imageUrl: packageImageWidget?.getImageUrl() || null,
        active: true
    };
    
    try {
        if (packageId) {
            // Update existing package
            await updatePackage(packageId, packageData);
            alert('Package updated successfully!');
        } else {
            // Add new package
            await addPackage(packageData);
            alert('Package added successfully!');
        }
        
        document.getElementById('packageModal').classList.remove('show');
        await loadPackages();
    } catch (error) {
        console.error('Error saving package:', error);
        alert('Error saving package: ' + error.message);
    }
}

// Edit package
async function editPackage(packageId) {
    try {
        const doc = await db.collection('packages').doc(packageId).get();
        if (doc.exists) {
            const packageData = { id: doc.id, ...doc.data() };
            openPackageModal(packageData);
        }
    } catch (error) {
        console.error('Error loading package:', error);
        alert('Error loading package.');
    }
}

// Toggle package status
async function togglePackageStatus(packageId, newStatus) {
    try {
        await db.collection('packages').doc(packageId).update({ active: newStatus });
        await loadPackages();
    } catch (error) {
        console.error('Error toggling package status:', error);
        alert('Error updating package status.');
    }
}

// Delete package
async function deletePackage(packageId) {
    if (!confirm('Are you sure you want to delete this package?')) return;
    
    try {
        await db.collection('packages').doc(packageId).delete();
        alert('Package deleted successfully!');
        await loadPackages();
    } catch (error) {
        console.error('Error deleting package:', error);
        alert('Error deleting package.');
    }
}

// Load promotions
async function loadPromotions() {
    const container = document.getElementById('promotionsListContainer');
    if (!container) return;
    
    container.innerHTML = '<p>Loading promotions...</p>';
    
    try {
        const snapshot = await db.collection('promotions').orderBy('createdAt', 'desc').get();
        const promotions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        container.innerHTML = '';
        
        if (promotions.length === 0) {
            container.innerHTML = '<p>No promotions found. Add your first promotion!</p>';
            return;
        }
        
        promotions.forEach(promo => {
            const item = createPromotionItem(promo);
            container.appendChild(item);
        });
    } catch (error) {
        console.error('Error loading promotions:', error);
        container.innerHTML = '<p>Error loading promotions.</p>';
    }
}

// Create promotion item
function createPromotionItem(promo) {
    const item = document.createElement('div');
    item.className = 'admin-item';
    
    const imageHTML = promo.imageUrl 
        ? `<img src="${promo.imageUrl}" alt="${promo.title}" class="admin-item-image">`
        : `<div class="admin-item-image"></div>`;
    
    const priceInfo = promo.originalPrice && promo.discountedPrice
        ? `<span>$${promo.discountedPrice} <del>$${promo.originalPrice}</del></span>`
        : '';
    
    item.innerHTML = `
        ${imageHTML}
        <div class="admin-item-content">
            <div class="admin-item-header">
                <div>
                    <h3 class="admin-item-title">${promo.title}</h3>
                    <div class="admin-item-meta">
                        <span><strong>${promo.discount}</strong></span>
                        ${priceInfo}
                        <span>Valid until: ${new Date(promo.validUntil).toLocaleDateString()}</span>
                        <span>
                            <span class="status-indicator ${promo.active ? 'active' : 'inactive'}"></span>
                            ${promo.active ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>
            </div>
            <p class="admin-item-description">${promo.description || ''}</p>
            <div class="admin-item-actions">
                <button class="btn btn-small btn-edit" onclick="editPromotion('${promo.id}')">Edit</button>
                <button class="btn btn-small btn-toggle ${promo.active ? 'active' : ''}" onclick="togglePromotionStatus('${promo.id}', ${!promo.active})">
                    ${promo.active ? 'Deactivate' : 'Activate'}
                </button>
                <button class="btn btn-small btn-delete" onclick="deletePromotion('${promo.id}')">Delete</button>
            </div>
        </div>
    `;
    
    return item;
}

// Open promotion modal
function openPromotionModal(promotionData = null) {
    const modal = document.getElementById('promotionModal');
    const form = document.getElementById('promotionForm');
    const title = document.getElementById('promotionModalTitle');
    
    form.reset();
    
    if (promotionData) {
        title.textContent = 'Edit Promotion';
        document.getElementById('promotionId').value = promotionData.id;
        document.getElementById('promotionTitle').value = promotionData.title;
        document.getElementById('promotionDescription').value = promotionData.description || '';
        document.getElementById('promotionDiscount').value = promotionData.discount;
        document.getElementById('promotionValidUntil').value = promotionData.validUntil.split('T')[0];
        document.getElementById('promotionOriginalPrice').value = promotionData.originalPrice || '';
        document.getElementById('promotionDiscountedPrice').value = promotionData.discountedPrice || '';
        document.getElementById('promotionActive').checked = promotionData.active;
    } else {
        title.textContent = 'Add New Promotion';
        document.getElementById('promotionId').value = '';
        document.getElementById('promotionActive').checked = true;
    }
    
    // Setup image upload widget
    const uploadContainer = document.getElementById('promotionImageUpload');
    uploadContainer.innerHTML = '';
    promotionImageWidget = createImageUploadWidget('promotionImageUpload', (url) => {
        console.log('Promotion image uploaded:', url);
    });
    
    if (promotionData?.imageUrl) {
        promotionImageWidget.setImage(promotionData.imageUrl);
    }
    
    modal.classList.add('show');
}

// Handle promotion form submit
async function handlePromotionSubmit(e) {
    e.preventDefault();
    
    const promotionId = document.getElementById('promotionId').value;
    const originalPrice = document.getElementById('promotionOriginalPrice').value;
    const discountedPrice = document.getElementById('promotionDiscountedPrice').value;
    
    const promotionData = {
        title: document.getElementById('promotionTitle').value,
        description: document.getElementById('promotionDescription').value,
        discount: document.getElementById('promotionDiscount').value,
        validUntil: document.getElementById('promotionValidUntil').value,
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        discountedPrice: discountedPrice ? parseFloat(discountedPrice) : null,
        imageUrl: promotionImageWidget?.getImageUrl() || null,
        active: document.getElementById('promotionActive').checked
    };
    
    try {
        if (promotionId) {
            // Update existing promotion
            await db.collection('promotions').doc(promotionId).update({
                ...promotionData,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            alert('Promotion updated successfully!');
        } else {
            // Add new promotion
            await addPromotion(promotionData);
            alert('Promotion added successfully!');
        }
        
        document.getElementById('promotionModal').classList.remove('show');
        await loadPromotions();
    } catch (error) {
        console.error('Error saving promotion:', error);
        alert('Error saving promotion: ' + error.message);
    }
}

// Edit promotion
async function editPromotion(promotionId) {
    try {
        const doc = await db.collection('promotions').doc(promotionId).get();
        if (doc.exists) {
            const promotionData = { id: doc.id, ...doc.data() };
            openPromotionModal(promotionData);
        }
    } catch (error) {
        console.error('Error loading promotion:', error);
        alert('Error loading promotion.');
    }
}

// Toggle promotion status
async function togglePromotionStatus(promotionId, newStatus) {
    try {
        await db.collection('promotions').doc(promotionId).update({ active: newStatus });
        await loadPromotions();
    } catch (error) {
        console.error('Error toggling promotion status:', error);
        alert('Error updating promotion status.');
    }
}

// Delete promotion
async function deletePromotion(promotionId) {
    if (!confirm('Are you sure you want to delete this promotion?')) return;
    
    try {
        await db.collection('promotions').doc(promotionId).delete();
        alert('Promotion deleted successfully!');
        await loadPromotions();
    } catch (error) {
        console.error('Error deleting promotion:', error);
        alert('Error deleting promotion.');
    }
}

// Load all subscriptions
async function loadAllSubscriptions() {
    const container = document.getElementById('subscriptionsListContainer');
    if (!container) return;
    
    container.innerHTML = '<p>Loading subscriptions...</p>';
    
    try {
        const snapshot = await db.collection('subscriptions')
            .orderBy('createdAt', 'desc')
            .limit(50)
            .get();
        
        container.innerHTML = '';
        
        if (snapshot.empty) {
            container.innerHTML = '<p>No subscriptions found.</p>';
            return;
        }
        
        for (const doc of snapshot.docs) {
            const sub = { id: doc.id, ...doc.data() };
            
            // Get user info
            const userDoc = await db.collection('users').doc(sub.userId).get();
            const user = userDoc.data();
            
            // Get package info
            const pkgDoc = await db.collection('packages').doc(sub.packageId).get();
            const pkg = pkgDoc.data();
            
            const card = createSubscriptionCard(sub, user, pkg);
            container.appendChild(card);
        }
    } catch (error) {
        console.error('Error loading subscriptions:', error);
        container.innerHTML = '<p>Error loading subscriptions.</p>';
    }
}

// Create subscription card for admin
function createSubscriptionCard(sub, user, pkg) {
    const card = document.createElement('div');
    card.className = 'subscription-card';
    
    const startDate = sub.startDate?.toDate ? sub.startDate.toDate().toLocaleDateString() : 'N/A';
    
    card.innerHTML = `
        <div class="subscription-header">
            <div>
                <h4>${user?.displayName || user?.email || 'Unknown User'}</h4>
                <p style="color: var(--text-light); font-size: 0.9rem;">${user?.email || ''}</p>
            </div>
            <span class="subscription-status ${sub.status}">${sub.status.toUpperCase()}</span>
        </div>
        <div class="subscription-details">
            <div class="detail-item">
                <label>Package</label>
                <div class="value">${pkg?.name || 'N/A'}</div>
            </div>
            <div class="detail-item">
                <label>Price</label>
                <div class="value">$${pkg?.price || 'N/A'}/mo</div>
            </div>
            <div class="detail-item">
                <label>Start Date</label>
                <div class="value">${startDate}</div>
            </div>
            <div class="detail-item">
                <label>Months Completed</label>
                <div class="value">${sub.monthsCompleted || 0} / ${sub.minimumMonths}</div>
            </div>
        </div>
    `;
    
    return card;
}

// Load contact messages
async function loadContactMessages() {
    const container = document.getElementById('contactsListContainer');
    if (!container) return;
    
    container.innerHTML = '<p>Loading messages...</p>';
    
    try {
        const snapshot = await db.collection('contacts')
            .orderBy('createdAt', 'desc')
            .limit(50)
            .get();
        
        container.innerHTML = '';
        
        if (snapshot.empty) {
            container.innerHTML = '<p>No contact messages found.</p>';
            return;
        }
        
        snapshot.forEach(doc => {
            const contact = { id: doc.id, ...doc.data() };
            const card = createContactCard(contact);
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading contacts:', error);
        container.innerHTML = '<p>Error loading messages.</p>';
    }
}

// Create contact card
function createContactCard(contact) {
    const card = document.createElement('div');
    card.className = `contact-card ${contact.status === 'new' ? 'unread' : ''}`;
    
    const date = contact.createdAt?.toDate ? contact.createdAt.toDate().toLocaleString() : 'N/A';
    
    card.innerHTML = `
        <div class="contact-header">
            <div class="contact-info">
                <h4>${contact.name}</h4>
                <p>${contact.email} ${contact.company ? `• ${contact.company}` : ''}</p>
            </div>
            <div class="contact-date">${date}</div>
        </div>
        <div class="contact-message">${contact.message}</div>
        <div class="contact-actions">
            ${contact.status === 'new' ? `
                <button class="btn btn-small btn-primary" onclick="markAsRead('${contact.id}')">Mark as Read</button>
            ` : ''}
            <button class="btn btn-small btn-delete" onclick="deleteContact('${contact.id}')">Delete</button>
        </div>
    `;
    
    return card;
}

// Mark contact as read
async function markAsRead(contactId) {
    try {
        await db.collection('contacts').doc(contactId).update({ status: 'read' });
        await loadContactMessages();
    } catch (error) {
        console.error('Error marking as read:', error);
    }
}

// Delete contact
async function deleteContact(contactId) {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    try {
        await db.collection('contacts').doc(contactId).delete();
        await loadContactMessages();
    } catch (error) {
        console.error('Error deleting contact:', error);
        alert('Error deleting message.');
    }
}
