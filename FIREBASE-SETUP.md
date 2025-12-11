# Firebase Security Rules Setup Guide

## 🔥 Your Firebase Project
**Project ID:** exvertixe-c2c5e
**Region:** Asia Southeast 1

---

## 📋 FIRESTORE DATABASE RULES (Recommended)

### How to Apply:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **exvertixe-c2c5e**
3. Click **Firestore Database** from left menu
4. Click **Rules** tab
5. Copy the content from `firestore-security-rules.rules`
6. Paste and click **Publish**

**File to copy:** `firestore-security-rules.rules`

---

## 📋 REALTIME DATABASE RULES (Alternative)

### How to Apply:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **exvertixe-c2c5e**
3. Click **Realtime Database** from left menu
4. Click **Rules** tab
5. Copy the content from `firebase-realtime-database-rules.json`
6. Paste and click **Publish**

**File to copy:** `firebase-realtime-database-rules.json`

---

## ⚠️ IMPORTANT: Which Database Are You Using?

Your project supports both databases. **You need to choose ONE:**

### Option 1: Firestore (RECOMMENDED for this project)
✅ Better for complex queries
✅ More scalable
✅ Better offline support
✅ **Already configured in the code**

**To use Firestore:**
1. Go to Firebase Console > Firestore Database
2. Click "Create database"
3. Choose "Start in production mode"
4. Select region: asia-southeast1
5. Apply rules from `firestore-security-rules.rules`
6. **No code changes needed - website is already configured for Firestore!**

### Option 2: Realtime Database
⚠️ Requires code changes
⚠️ Different API structure

**To use Realtime Database:**
1. Use the rules from `firebase-realtime-database-rules.json`
2. Need to modify JavaScript files to use Realtime Database API
3. Not recommended unless you have a specific reason

---

## 🚀 QUICK SETUP (Recommended Path)

### Step 1: Enable Firestore
```
1. Firebase Console > Firestore Database
2. Click "Create database"
3. Choose "Production mode"
4. Select region: asia-southeast1
5. Click "Enable"
```

### Step 2: Apply Firestore Rules
```
1. Go to Firestore Database > Rules tab
2. Delete existing rules
3. Copy content from: firestore-security-rules.rules
4. Paste and click "Publish"
```

### Step 3: Enable Authentication
```
1. Firebase Console > Authentication
2. Click "Get started"
3. Click "Sign-in method" tab
4. Click "Email/Password"
5. Toggle "Enable" and save
```

### Step 4: Test Your Website
```bash
cd /Users/ahmedjazlaanshareef/Dev/Exvertixe
python3 -m http.server 8000
# Open http://localhost:8000
```

---

## 📝 Rules Explanation

### Firestore Rules Features:
- ✅ **Users**: Can read/update their own data, admins can access all
- ✅ **Packages**: Public read, admin-only write
- ✅ **Promotions**: Public read, admin-only write
- ✅ **Subscriptions**: Users see their own, admins see all
- ✅ **Contacts**: Public can create, admins can read/manage

### Security Features:
- Role-based access control (customer/admin)
- User can only modify their own data
- Admins have full access to all collections
- Public can view packages and promotions
- Contact forms open for submissions

---

## ✅ Configuration Status

**Firebase Config:** ✅ Updated in `js/firebase-config.js`
- API Key: ✅ Set
- Auth Domain: ✅ Set
- Database URL: ✅ Set
- Project ID: ✅ Set
- Storage Bucket: ✅ Set
- Messaging Sender ID: ✅ Set
- App ID: ✅ Set

**Rules Files Created:**
- ✅ `firestore-security-rules.rules` - For Firestore (RECOMMENDED)
- ✅ `firebase-realtime-database-rules.json` - For Realtime DB (alternative)

---

## 🎯 Next Steps

1. **Enable Firestore Database** in Firebase Console
2. **Copy & paste rules** from `firestore-security-rules.rules`
3. **Enable Authentication** (Email/Password)
4. **Start local server** and test
5. **Create admin user** (sign up, then add role: "admin" in Firestore)

---

## 🆘 Troubleshooting

**Error: "Missing or insufficient permissions"**
→ Make sure you published the Firestore rules

**Error: "No database found"**
→ Create Firestore database first in Firebase Console

**Error: "Authentication failed"**
→ Enable Email/Password authentication in Firebase Console

**Can't access admin panel**
→ Add `role: "admin"` field to your user document in Firestore

---

## 📞 Quick Links

- [Firebase Console](https://console.firebase.google.com/project/exvertixe-c2c5e)
- [Firestore Database](https://console.firebase.google.com/project/exvertixe-c2c5e/firestore)
- [Authentication](https://console.firebase.google.com/project/exvertixe-c2c5e/authentication)
- [Project Settings](https://console.firebase.google.com/project/exvertixe-c2c5e/settings/general)

---

**Your Firebase configuration is complete! 🎉**
**Just apply the rules and you're ready to launch!**
