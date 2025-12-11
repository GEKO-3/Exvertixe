# Exvertixe Configuration Template

## Firebase Configuration
Copy this template and fill in your Firebase credentials in `js/firebase-config.js`

```javascript
const firebaseConfig = {
    apiKey: "AIza...",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
};
```

### How to get Firebase credentials:
1. Go to https://console.firebase.google.com/
2. Select your project
3. Click the gear icon > Project settings
4. Scroll to "Your apps" section
5. If no web app exists, click "Add app" and select web (</>)
6. Copy the configuration object

---

## Cloudinary Configuration
Update in `js/cloudinary.js`

```javascript
const CLOUDINARY_CONFIG = {
    cloudName: 'your-cloud-name',
    uploadPreset: 'your-preset-name'
};
```

### How to get Cloudinary credentials:
1. Go to https://cloudinary.com/
2. Sign up or log in
3. Cloud Name is visible on the dashboard
4. For upload preset:
   - Go to Settings > Upload
   - Click "Add upload preset"
   - Set "Signing Mode" to "Unsigned"
   - Save and copy the preset name

---

## Firestore Security Rules

Copy these rules to Firebase Console > Firestore Database > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Helper function to check if user is authenticated
    function isSignedIn() {
      return request.auth != null;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn();
      allow update: if isSignedIn() && (request.auth.uid == userId || isAdmin());
      allow delete: if isAdmin();
    }
    
    // Packages collection
    match /packages/{packageId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Promotions collection
    match /promotions/{promotionId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Subscriptions collection
    match /subscriptions/{subscriptionId} {
      allow read: if isSignedIn() && 
                    (resource.data.userId == request.auth.uid || isAdmin());
      allow create: if isSignedIn();
      allow update: if isSignedIn() && 
                      (resource.data.userId == request.auth.uid || isAdmin());
      allow delete: if isAdmin();
    }
    
    // Contacts collection
    match /contacts/{contactId} {
      allow read: if isAdmin();
      allow create: if true;
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }
  }
}
```

---

## Initial Database Setup

### Create an Admin User

1. Sign up through the website
2. In Firebase Console > Firestore Database
3. Go to `users` collection
4. Find your user document
5. Click "Edit field"
6. Add new field:
   - Field path: `role`
   - Type: `string`
   - Value: `admin`

---

## Environment Variables (Optional - for production)

Create a `.env` file (DO NOT commit to git):

```
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

---

## Testing Checklist

- [ ] Firebase connected successfully
- [ ] Can create new user account
- [ ] Can log in with created account
- [ ] Can log out
- [ ] Dashboard loads for authenticated users
- [ ] Packages display on home page
- [ ] Promotions display on home page
- [ ] Contact form submits to Firestore
- [ ] Admin can access admin panel
- [ ] Admin can add new packages
- [ ] Admin can upload images via Cloudinary
- [ ] Admin can add promotions
- [ ] Customer can subscribe to packages
- [ ] Customer can view subscriptions in dashboard
- [ ] Customer can manage subscriptions
- [ ] Mobile responsive design works
- [ ] All animations work smoothly

---

## Common Issues & Solutions

### Issue: Firebase not initializing
**Solution**: Check that Firebase scripts are loaded before firebase-config.js in HTML

### Issue: "Permission denied" in Firestore
**Solution**: Check Firestore security rules are properly configured

### Issue: Images not uploading to Cloudinary
**Solution**: Verify upload preset is set to "Unsigned" in Cloudinary settings

### Issue: Admin panel shows access denied
**Solution**: Ensure user document has `role: "admin"` field in Firestore

### Issue: Subscriptions not showing
**Solution**: Check that packages exist in Firestore and are marked as active

---

## Production Deployment Checklist

- [ ] Replace Firebase config with production credentials
- [ ] Set up custom domain
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up proper error logging
- [ ] Implement rate limiting
- [ ] Add email notifications
- [ ] Set up backup system for Firestore
- [ ] Configure CDN for assets
- [ ] Add analytics tracking
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Set up monitoring and alerts
- [ ] Create privacy policy page
- [ ] Create terms of service page
- [ ] Add contact information

---

## Support

For issues or questions:
- Email: support@exvertixe.com
- Check README.md for detailed documentation
- Review setup.html for visual setup guide
