# Exvertixe - Marketing Services Website

A modern, sleek website for Exvertixe marketing services with customer account management, subscription handling, and admin panel.

## Features

- **Modern Design**: Clean, responsive design with custom brand colors
- **Customer Accounts**: User registration, login, and dashboard
- **Subscription Management**: Monthly packages with 6-month minimum commitment
- **Dynamic Content**: Add/edit packages and promotions through admin panel
- **Image Uploads**: Cloudinary integration for image management
- **Firebase Backend**: Authentication and Firestore database
- **Admin Panel**: Comprehensive admin interface for content management

## Brand Colors

- Primary: `#AF73EF` (Purple)
- Secondary: `#3F8FEF` (Blue)
- Header Text: `#2776C6` (Dark Blue)

## Project Structure

```
Exvertixe/
├── index.html              # Main landing page
├── login.html              # User login page
├── signup.html             # User registration page
├── dashboard.html          # Customer dashboard
├── admin.html              # Admin panel
├── css/
│   ├── styles.css          # Main stylesheet
│   ├── auth.css            # Authentication & dashboard styles
│   └── admin.css           # Admin panel styles
├── js/
│   ├── main.js             # Main functionality
│   ├── packages.js         # Package display logic
│   ├── promotions.js       # Promotions display logic
│   ├── auth.js             # Authentication handlers
│   ├── dashboard.js        # Customer dashboard logic
│   ├── admin.js            # Admin panel logic
│   ├── firebase-config.js  # Firebase configuration
│   └── cloudinary.js       # Cloudinary integration
└── README.md              # This file
```

## Setup Instructions

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable **Authentication**:
   - Go to Authentication > Sign-in method
   - Enable "Email/Password" authentication
4. Create **Firestore Database**:
   - Go to Firestore Database
   - Create database in production mode
   - Set up security rules (see below)
5. Get your Firebase config:
   - Go to Project Settings > General
   - Scroll down to "Your apps" and add a web app
   - Copy the configuration object

6. Update `js/firebase-config.js`:
   ```javascript
   const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_PROJECT_ID.appspot.com",
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
       appId: "YOUR_APP_ID"
   };
   ```

### 2. Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Packages collection
    match /packages/{packageId} {
      allow read: if true;
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Promotions collection
    match /promotions/{promotionId} {
      allow read: if true;
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Subscriptions collection
    match /subscriptions/{subscriptionId} {
      allow read: if request.auth != null && 
                    (resource.data.userId == request.auth.uid || 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
                      (resource.data.userId == request.auth.uid || 
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Contacts collection
    match /contacts/{contactId} {
      allow read: if request.auth != null && 
                    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow create: if true;
    }
  }
}
```

### 3. Cloudinary Setup

1. Go to [Cloudinary](https://cloudinary.com/)
2. Create a free account
3. Get your Cloud Name from the dashboard
4. Create an upload preset:
   - Go to Settings > Upload
   - Scroll to "Upload presets"
   - Click "Add upload preset"
   - Set signing mode to "Unsigned"
   - Configure other settings as needed
   - Copy the preset name

5. Update `js/cloudinary.js`:
   ```javascript
   const CLOUDINARY_CONFIG = {
       cloudName: 'YOUR_CLOUD_NAME',
       uploadPreset: 'YOUR_UPLOAD_PRESET'
   };
   ```

### 4. Create Admin User

After setting up Firebase:

1. Sign up through the website normally
2. Go to Firebase Console > Firestore Database
3. Find your user document in the `users` collection
4. Edit the document and add a field:
   - Field: `role`
   - Value: `admin`
5. Now you can access the admin panel at `/admin.html`

### 5. Firestore Database Structure

The application uses the following collections:

#### users
```javascript
{
  email: "user@example.com",
  displayName: "John Doe",
  role: "customer", // or "admin"
  subscriptions: [],
  createdAt: timestamp
}
```

#### packages
```javascript
{
  name: "Professional Package",
  price: 999,
  description: "Comprehensive marketing solution",
  features: ["Feature 1", "Feature 2"],
  imageUrl: "https://cloudinary.com/...",
  featured: true,
  active: true,
  createdAt: timestamp
}
```

#### promotions
```javascript
{
  title: "New Year Special",
  description: "Get 20% off",
  discount: "20% OFF",
  originalPrice: 999,
  discountedPrice: 799,
  validUntil: "2025-12-31",
  imageUrl: "https://cloudinary.com/...",
  active: true,
  createdAt: timestamp
}
```

#### subscriptions
```javascript
{
  userId: "user_id",
  packageId: "package_id",
  promotionId: "promo_id", // optional
  status: "active", // or "cancelled"
  startDate: timestamp,
  endDate: null,
  minimumMonths: 6,
  monthsCompleted: 0,
  autoRenew: true,
  createdAt: timestamp
}
```

#### contacts
```javascript
{
  name: "John Doe",
  email: "john@example.com",
  company: "Company Name",
  message: "Message text",
  status: "new", // or "read"
  createdAt: timestamp
}
```

## Running the Website

### Option 1: Local Development Server

1. Install a local server (e.g., Live Server for VS Code)
2. Open `index.html` with the server
3. The website will run at `http://localhost:5500` or similar

### Option 2: Python Simple Server

```bash
# Navigate to project directory
cd /path/to/Exvertixe

# Python 3
python3 -m http.server 8000

# Then visit http://localhost:8000
```

### Option 3: Node.js http-server

```bash
# Install globally
npm install -g http-server

# Navigate to project directory
cd /path/to/Exvertixe

# Run server
http-server

# Visit http://localhost:8080
```

## Features Breakdown

### Customer Features
- Browse packages and promotions
- Create account and login
- Subscribe to packages
- Manage subscriptions in dashboard
- View subscription history
- Toggle auto-renew
- Cancel subscriptions (after 6 months)
- Update account settings

### Admin Features
- Add/edit/delete packages
- Add/edit/delete promotions
- Upload images via Cloudinary
- View all subscriptions
- View contact form submissions
- Toggle package/promotion active status

## Customization

### Colors
Update CSS variables in `css/styles.css`:
```css
:root {
    --primary-color: #AF73EF;
    --secondary-color: #3F8FEF;
    --header-color: #2776C6;
}
```

### Minimum Commitment Period
Update in `js/firebase-config.js` in the `createSubscription` function:
```javascript
minimumMonths: 6, // Change this value
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Security Notes

1. Never commit Firebase config with real credentials to public repositories
2. Use environment variables for production
3. Implement proper Firestore security rules
4. Use HTTPS in production
5. Validate all user inputs server-side
6. Implement rate limiting for contact forms

## Future Enhancements

- Payment integration (Stripe/PayPal)
- Email notifications
- Invoice generation
- Usage analytics dashboard
- Customer support chat
- Multi-language support
- Dark mode toggle

## Support

For questions or issues, contact: support@exvertixe.com

## License

Copyright © 2025 Exvertixe. All rights reserved.
