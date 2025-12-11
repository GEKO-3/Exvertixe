// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCdgr0ByHWs2eZkLyFO0aOu711Omsn0bLw",
    authDomain: "exvertixe-c2c5e.firebaseapp.com",
    databaseURL: "https://exvertixe-c2c5e-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "exvertixe-c2c5e",
    storageBucket: "exvertixe-c2c5e.firebasestorage.app",
    messagingSenderId: "139571559514",
    appId: "1:139571559514:web:f8da7d9fe0b75d42a8ac63"
};

// Initialize Firebase
let app, auth, db;

function initializeFirebase() {
    try {
        app = firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        db = firebase.firestore();
        console.log('Firebase initialized successfully');
        
        // Set up auth state listener
        auth.onAuthStateChanged(onAuthStateChanged);
    } catch (error) {
        console.error('Error initializing Firebase:', error);
    }
}

// Auth state change handler
function onAuthStateChanged(user) {
    if (user) {
        console.log('User is signed in:', user.email);
        updateUIForAuthenticatedUser(user);
    } else {
        console.log('User is signed out');
        updateUIForUnauthenticatedUser();
    }
}

// Update UI based on auth state
function updateUIForAuthenticatedUser(user) {
    const navAuth = document.querySelector('.nav-auth');
    if (navAuth) {
        navAuth.innerHTML = `
            <a href="dashboard.html" class="btn-login">Dashboard</a>
            <button class="btn-signup" id="logoutBtn">Logout</button>
        `;
        
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }
    }
}

function updateUIForUnauthenticatedUser() {
    const navAuth = document.querySelector('.nav-auth');
    if (navAuth) {
        navAuth.innerHTML = `
            <a href="login.html" class="btn-login">Login</a>
            <a href="signup.html" class="btn-signup">Get Started</a>
        `;
    }
}

// Sign up function
async function signUp(email, password, displayName) {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Update profile with display name
        await user.updateProfile({ displayName });
        
        // Send email verification
        await user.sendEmailVerification();
        
        // Create user document in Firestore
        await db.collection('users').doc(user.uid).set({
            email: email,
            displayName: displayName,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            emailVerified: false,
            subscriptions: [],
            role: 'customer'
        });
        
        return { success: true, user, needsVerification: true };
    } catch (error) {
        console.error('Error signing up:', error);
        return { success: false, error: error.message };
    }
}

// Sign in function
async function signIn(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Check if email is verified
        if (!user.emailVerified) {
            return { 
                success: false, 
                error: 'Please verify your email before logging in. Check your inbox for the verification link.',
                needsVerification: true,
                user: user
            };
        }
        
        return { success: true, user };
    } catch (error) {
        console.error('Error signing in:', error);
        return { success: false, error: error.message };
    }
}

// Logout function
async function handleLogout() {
    try {
        await auth.signOut();
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error logging out:', error);
    }
}

// Get current user
function getCurrentUser() {
    return auth.currentUser;
}

// Check if user is authenticated
function isAuthenticated() {
    return !!auth.currentUser;
}

// Firestore Database Functions

// Get all active packages
async function getPackages() {
    try {
        const snapshot = await db.collection('packages')
            .where('active', '==', true)
            .orderBy('price', 'asc')
            .get();
        
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching packages:', error);
        return [];
    }
}

// Get all active promotions
async function getPromotions() {
    try {
        const now = new Date().toISOString();
        const snapshot = await db.collection('promotions')
            .where('active', '==', true)
            .where('validUntil', '>=', now)
            .get();
        
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching promotions:', error);
        return [];
    }
}

// Create a subscription
async function createSubscription(userId, packageId, promotionId = null) {
    try {
        const subscriptionData = {
            userId: userId,
            packageId: packageId,
            promotionId: promotionId,
            status: 'active',
            startDate: firebase.firestore.FieldValue.serverTimestamp(),
            endDate: null,
            minimumMonths: 6,
            monthsCompleted: 0,
            autoRenew: true,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        const docRef = await db.collection('subscriptions').add(subscriptionData);
        
        // Update user's subscriptions array
        await db.collection('users').doc(userId).update({
            subscriptions: firebase.firestore.FieldValue.arrayUnion(docRef.id)
        });
        
        return { success: true, subscriptionId: docRef.id };
    } catch (error) {
        console.error('Error creating subscription:', error);
        return { success: false, error: error.message };
    }
}

// Get user's subscriptions
async function getUserSubscriptions(userId) {
    try {
        const snapshot = await db.collection('subscriptions')
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc')
            .get();
        
        const subscriptions = [];
        for (const doc of snapshot.docs) {
            const subData = { id: doc.id, ...doc.data() };
            
            // Fetch package details
            const packageDoc = await db.collection('packages').doc(subData.packageId).get();
            subData.package = packageDoc.exists ? packageDoc.data() : null;
            
            subscriptions.push(subData);
        }
        
        return subscriptions;
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        return [];
    }
}

// Cancel subscription
async function cancelSubscription(subscriptionId) {
    try {
        await db.collection('subscriptions').doc(subscriptionId).update({
            status: 'cancelled',
            cancelledAt: firebase.firestore.FieldValue.serverTimestamp(),
            autoRenew: false
        });
        
        return { success: true };
    } catch (error) {
        console.error('Error cancelling subscription:', error);
        return { success: false, error: error.message };
    }
}

// Add package (admin function)
async function addPackage(packageData) {
    try {
        const docRef = await db.collection('packages').add({
            ...packageData,
            active: true,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        return { success: true, packageId: docRef.id };
    } catch (error) {
        console.error('Error adding package:', error);
        return { success: false, error: error.message };
    }
}

// Update package (admin function)
async function updatePackage(packageId, packageData) {
    try {
        await db.collection('packages').doc(packageId).update({
            ...packageData,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        return { success: true };
    } catch (error) {
        console.error('Error updating package:', error);
        return { success: false, error: error.message };
    }
}

// Add promotion (admin function)
async function addPromotion(promotionData) {
    try {
        const docRef = await db.collection('promotions').add({
            ...promotionData,
            active: true,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        return { success: true, promotionId: docRef.id };
    } catch (error) {
        console.error('Error adding promotion:', error);
        return { success: false, error: error.message };
    }
}

// Submit contact form
async function submitContactForm(formData) {
    try {
        await db.collection('contacts').add({
            ...formData,
            status: 'new',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        return { success: true };
    } catch (error) {
        console.error('Error submitting contact form:', error);
        return { success: false, error: error.message };
    }
}

// Initialize Firebase when DOM is ready
if (typeof firebase !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initializeFirebase);
} else {
    console.warn('Firebase SDK not loaded. Please include Firebase scripts in your HTML.');
}
