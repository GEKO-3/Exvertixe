// Sample data structure for packages (will be replaced with Firebase)
let packagesData = [
    {
        id: 'starter',
        name: 'Starter Package',
        price: 4999,
        description: 'Perfect for small businesses starting their marketing journey',
        features: [
            'Basic Preview Website',
            'Social Media Management (2 platforms)',
            '8 Posts per month',
            'Basic Analytics',
            'Email Support',
            'Monthly Report'
        ],
        imageUrl: null,
        featured: false
    },
    {
        id: 'professional',
        name: 'Professional Package',
        price: 9999,
        description: 'Comprehensive marketing for growing businesses',
        features: [
            'Professional Website',
            'Social Media Management (4 platforms)',
            '16 Posts per month',
            'Advanced Analytics',
            'Ad Campaign Management',
            'SEO Optimization',
            'Priority Support',
            'Bi-weekly Reports'
        ],
        imageUrl: null,
        featured: true
    },
    {
        id: 'enterprise',
        name: 'Enterprise Package',
        price: 19999,
        description: 'Full-service marketing solution for established brands',
        features: [
            'Premium Custom Website',
            'Social Media Management (All platforms)',
            'Unlimited Posts',
            'Comprehensive Analytics Dashboard',
            'Multi-channel Ad Campaigns',
            'Advanced SEO & Content Strategy',
            'Brand Strategy Consultation',
            '24/7 Dedicated Support',
            'Weekly Reports & Strategy Calls'
        ],
        imageUrl: null,
        featured: false
    }
];

// Load and display packages
function loadPackages() {
    const packagesContainer = document.getElementById('packages-container');
    if (!packagesContainer) return;

    packagesContainer.innerHTML = '';

    packagesData.forEach(pkg => {
        const packageCard = createPackageCard(pkg);
        packagesContainer.appendChild(packageCard);
    });
}

// Create package card element
function createPackageCard(pkg) {
    const card = document.createElement('div');
    card.className = 'package-card';
    card.dataset.packageId = pkg.id;

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
            <div class="package-price">${pkg.price.toLocaleString()} MVR<span>/month</span></div>
            <p class="package-description">${pkg.description}</p>
            <ul class="package-features">
                ${pkg.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
            <button class="btn btn-primary subscribe-btn" data-package-id="${pkg.id}">Subscribe Now</button>
        </div>
    `;

    // Add click handler for subscribe button
    const subscribeBtn = card.querySelector('.subscribe-btn');
    subscribeBtn.addEventListener('click', () => {
        handleSubscribe(pkg.id);
    });

    return card;
}

// Handle subscription (redirect to signup or dashboard)
function handleSubscribe(packageId) {
    // Check if user is logged in (will be implemented with Firebase Auth)
    const isLoggedIn = false; // TODO: Check Firebase Auth state

    if (isLoggedIn) {
        // Redirect to dashboard with selected package
        window.location.href = `dashboard.html?subscribe=${packageId}`;
    } else {
        // Redirect to signup with selected package
        window.location.href = `signup.html?package=${packageId}`;
    }
}

// Initialize packages on page load
document.addEventListener('DOMContentLoaded', () => {
    loadPackages();
});

// Function to fetch packages from Firebase (to be implemented)
async function fetchPackagesFromFirebase() {
    try {
        // TODO: Implement Firebase fetch
        // const db = firebase.firestore();
        // const snapshot = await db.collection('packages').where('active', '==', true).get();
        // packagesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // loadPackages();
    } catch (error) {
        console.error('Error fetching packages:', error);
    }
}
