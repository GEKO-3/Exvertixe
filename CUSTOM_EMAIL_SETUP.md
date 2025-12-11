# Custom Email Setup Instructions

## Prerequisites
- Firebase Blaze (pay-as-you-go) plan
- Email service provider (SendGrid, Mailgun, or Gmail SMTP)

## Setup Steps

### 1. Upgrade to Blaze Plan
```
Visit: https://console.firebase.google.com/project/exvertixe-c2c5e/usage/details
Click "Modify plan" → Select "Blaze"
```

### 2. Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 3. Initialize Firebase Functions
```bash
cd /Users/ahmedjazlaanshareef/Dev/Exvertixe
firebase login
firebase init functions
```

Select:
- JavaScript
- Install dependencies: Yes

### 4. Install Dependencies
```bash
cd functions
npm install nodemailer
```

### 5. Setup Email Service

#### Option A: SendGrid (Recommended)
1. Sign up at https://sendgrid.com
2. Create API key: Settings → API Keys → Create API Key
3. Replace `YOUR_SENDGRID_API_KEY` in functions/index.js
4. Verify sender email in SendGrid

#### Option B: Gmail SMTP
```javascript
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-app-password' // Use App Password, not regular password
    }
});
```

#### Option C: Mailgun
```javascript
const transporter = nodemailer.createTransport({
    host: 'smtp.mailgun.org',
    port: 587,
    auth: {
        user: 'postmaster@yourdomain.mailgun.org',
        pass: 'YOUR_MAILGUN_PASSWORD'
    }
});
```

### 6. Disable Default Verification Email
1. Go to Firebase Console → Authentication → Templates
2. Click on "Email address verification"
3. Toggle OFF "Enable email address verification"

### 7. Deploy Functions
```bash
firebase deploy --only functions
```

### 8. Update firebase-config.js
Remove the `sendEmailVerification()` call since the Cloud Function will handle it automatically.

## Costs
- Firebase Functions: Free tier includes 2M invocations/month
- SendGrid: Free tier includes 100 emails/day
- Typical cost for small business: $0-5/month

## Testing
1. Sign up a test user
2. Check email inbox for custom verification email
3. Check Firebase Functions logs: https://console.firebase.google.com/project/exvertixe-c2c5e/functions/logs

## Alternative: Stay on Free Plan
Keep using Firebase's default verification email. While not customizable, it's:
- Free
- Reliable
- Already working
- Professional enough for most businesses
