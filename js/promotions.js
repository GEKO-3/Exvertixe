// Sample data structure for promotions (will be replaced with Firebase)
let promotionsData = [
    {
        id: 'promo1',
        title: 'New Year Special',
        description: 'Get 20% off any package for your first 3 months',
        discount: '20% OFF',
        originalPrice: 9999,
        discountedPrice: 7999,
        validUntil: '2025-12-31',
        imageUrl: null,
        active: true
    },
    {
        id: 'promo2',
        title: 'Annual Commitment Bonus',
        description: 'Sign up for 12 months and get 2 months free',
        discount: '2 Months Free',
        originalPrice: null,
        discountedPrice: null,
        validUntil: '2025-12-31',
        imageUrl: null,
        active: true
    }
];

// Load and display promotions
function loadPromotions() {
    const promotionsContainer = document.getElementById('promotions-container');
    if (!promotionsContainer) return;

    promotionsContainer.innerHTML = '';

    const activePromotions = promotionsData.filter(promo => promo.active);

    if (activePromotions.length === 0) {
        promotionsContainer.innerHTML = '<p style="text-align: center; color: var(--text-light);">No active promotions at the moment. Check back soon!</p>';
        return;
    }

    activePromotions.forEach(promo => {
        const promotionCard = createPromotionCard(promo);
        promotionsContainer.appendChild(promotionCard);
    });
}

// Create promotion card element
function createPromotionCard(promo) {
    const card = document.createElement('div');
    card.className = 'promotion-card';
    card.dataset.promotionId = promo.id;

    let imageHTML = '';
    if (promo.imageUrl) {
        imageHTML = `<img src="${promo.imageUrl}" alt="${promo.title}" class="promotion-image">`;
    } else {
        imageHTML = `<div class="promotion-image"></div>`;
    }

    let priceHTML = '';
    if (promo.originalPrice && promo.discountedPrice) {
        priceHTML = `
            <div class="promotion-details">
                <div>
                    <div class="promotion-price">${promo.discountedPrice.toLocaleString()} MVR/mo</div>
                    <div class="promotion-original-price">${promo.originalPrice.toLocaleString()} MVR/mo</div>
                </div>
                <div class="promotion-validity">Valid until ${formatDate(promo.validUntil)}</div>
            </div>
        `;
    } else {
        priceHTML = `
            <div class="promotion-validity">Valid until ${formatDate(promo.validUntil)}</div>
        `;
    }

    card.innerHTML = `
        <div class="promotion-badge">${promo.discount}</div>
        ${imageHTML}
        <div class="promotion-content">
            <h3 class="promotion-title">${promo.title}</h3>
            <p class="promotion-description">${promo.description}</p>
            ${priceHTML}
            <button class="btn btn-primary claim-promo-btn" data-promo-id="${promo.id}">Claim Offer</button>
        </div>
    `;

    // Add click handler for claim button
    const claimBtn = card.querySelector('.claim-promo-btn');
    claimBtn.addEventListener('click', () => {
        handleClaimPromotion(promo.id);
    });

    return card;
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Handle promotion claim
function handleClaimPromotion(promoId) {
    const isLoggedIn = false; // TODO: Check Firebase Auth state

    if (isLoggedIn) {
        window.location.href = `dashboard.html?promo=${promoId}`;
    } else {
        window.location.href = `signup.html?promo=${promoId}`;
    }
}

// Initialize promotions on page load
document.addEventListener('DOMContentLoaded', () => {
    loadPromotions();
});

// Function to fetch promotions from Firebase (to be implemented)
async function fetchPromotionsFromFirebase() {
    try {
        // TODO: Implement Firebase fetch
        // const db = firebase.firestore();
        // const snapshot = await db.collection('promotions')
        //     .where('active', '==', true)
        //     .where('validUntil', '>=', new Date().toISOString())
        //     .get();
        // promotionsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // loadPromotions();
    } catch (error) {
        console.error('Error fetching promotions:', error);
    }
}
