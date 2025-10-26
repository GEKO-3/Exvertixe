# FMSC 2025 - Separate PWA Installation Guide

## 📱 How to Install Each App Separately

The FMSC 2025 tournament system now consists of **two separate PWA applications** that can be installed independently:

### 🏗️ Architecture Overview

```
FMSC 2025 Tournament Suite
├── 📋 Match Management PWA
│   ├── View all tournament matches
│   ├── Tournament overview & progress
│   ├── Match scheduling
│   └── Score tracking across matches
│
└── ⚽ Match Detail PWA
    ├── Record live match events
    ├── Track goals, cards, substitutions
    ├── Man of the match selection
    └── Referee management
```

---

## 🚀 Installation Methods

### Method 1: Using the Launcher Page
1. **Open**: `launcher.html` in your browser
2. **Choose**: Which app you want to use
3. **Install**: Browser will prompt to "Add to Home Screen"
4. **Repeat**: For the second app if needed

### Method 2: Direct Installation
1. **Match Management**: Navigate to `match-management.html`
2. **Match Detail**: Navigate to `match-detail.html`
3. **Install**: Each will prompt separately for installation

---

## 📱 Per-Device Instructions

### **Android (Chrome/Edge)**
1. Open the app URL
2. Tap the **menu (⋮)** button
3. Select **"Add to Home screen"**
4. Confirm installation
5. App icon appears on home screen

### **iOS (Safari)**
1. Open the app URL
2. Tap the **Share button** (□↑)
3. Select **"Add to Home Screen"**
4. Customize name if desired
5. Tap **"Add"**

### **Desktop (Chrome/Edge)**
1. Open the app URL
2. Look for **install icon** (⊕) in address bar
3. Click **"Install"**
4. App opens in standalone window

---

## 🔧 Technical Details

### **Files Created:**
- `match-management-manifest.json` - Match Management PWA config
- `match-detail-manifest.json` - Match Detail PWA config  
- `match-management-sw.js` - Match Management service worker
- `match-detail-sw.js` - Match Detail service worker
- `launcher.html` - PWA selection interface

### **Features:**
- ✅ **Independent installation** - Install one or both apps
- ✅ **Separate caching** - Each app caches its own resources
- ✅ **Dedicated shortcuts** - App-specific shortcuts and icons
- ✅ **Optimized performance** - Smaller cache sizes per app
- ✅ **Better UX** - Focused experience per use case

### **Benefits:**
- **Match Managers**: Install only Match Management for overview
- **Referees/Officials**: Install only Match Detail for live recording  
- **Tournament Directors**: Install both for complete control
- **Reduced storage**: Only cache what you need
- **Faster loading**: Smaller, focused apps load quicker

---

## 🎯 Use Cases

### **Match Management PWA** 📋
**Who uses it**: Tournament organizers, coordinators
**When to use**: 
- Before matches (scheduling, setup)
- Between matches (checking progress)
- After tournament (reviewing results)

### **Match Detail PWA** ⚽  
**Who uses it**: Referees, match officials, live scorers
**When to use**:
- During live matches
- Recording real-time events
- Managing match-specific data

---

## 🔄 Migration Notes

### **Existing Users:**
- Previous `manifest.json` now points to launcher
- Old installations will continue to work
- Recommended to reinstall using new system

### **Data Compatibility:**
- ✅ All Firebase data remains compatible
- ✅ No data migration needed
- ✅ Both apps share same database

---

## 🆘 Troubleshooting

### **Installation Issues:**
1. **Clear browser cache** and try again
2. **Check HTTPS** - PWAs require secure connection
3. **Try incognito mode** to test fresh installation
4. **Update browser** to latest version

### **App Not Showing Install Prompt:**
1. Check if already installed
2. Verify manifest.json loads correctly
3. Ensure service worker registers successfully
4. Try different browser/device

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify network connectivity  
3. Clear app cache and reinstall
4. Contact tournament technical support

---

**🏆 FMSC 2025 - Powered by Modern Web Technology**