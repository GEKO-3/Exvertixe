#!/bin/bash
# Exvertixe - Quick Commands Reference

# ============================================
# LOCAL DEVELOPMENT
# ============================================

# Start local server (Python)
python3 -m http.server 8000
# Then open: http://localhost:8000

# Start local server (Node.js - if http-server installed)
# npm install -g http-server
# http-server -p 8000

# Start local server (PHP)
# php -S localhost:8000

# ============================================
# PROJECT NAVIGATION
# ============================================

# Open project in VS Code
code /Users/ahmedjazlaanshareef/Dev/Exvertixe

# Navigate to project
cd /Users/ahmedjazlaanshareef/Dev/Exvertixe

# List all files
find . -type f -not -path "./src/*"

# Count files
find . -type f -not -path "./src/*" | wc -l

# ============================================
# GIT COMMANDS
# ============================================

# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Exvertixe website complete"

# Add remote (replace with your repo URL)
# git remote add origin https://github.com/yourusername/exvertixe.git

# Push to GitHub
# git push -u origin main

# ============================================
# FILE OPERATIONS
# ============================================

# View main pages
open index.html
open dashboard.html
open admin.html
open setup.html

# Edit configuration files
code js/firebase-config.js
code js/cloudinary.js

# View documentation
open README.md
open QUICKSTART.md
open CONFIG.md

# ============================================
# BROWSER TESTING
# ============================================

# Open in default browser
open http://localhost:8000/index.html

# Open specific pages
open http://localhost:8000/setup.html
open http://localhost:8000/admin.html
open http://localhost:8000/dashboard.html

# ============================================
# FIREBASE COMMANDS (if using Firebase CLI)
# ============================================

# Install Firebase CLI
# npm install -g firebase-tools

# Login to Firebase
# firebase login

# Initialize Firebase
# firebase init

# Deploy to Firebase Hosting
# firebase deploy

# ============================================
# USEFUL SHORTCUTS
# ============================================

# Quick setup view
open setup.html

# Open in browser and start server
python3 -m http.server 8000 & open http://localhost:8000

# View logs (if server is running)
# Check terminal output

# ============================================
# BACKUP
# ============================================

# Create backup of project
# tar -czf exvertixe-backup-$(date +%Y%m%d).tar.gz /Users/ahmedjazlaanshareef/Dev/Exvertixe

# ============================================
# DOCUMENTATION QUICK ACCESS
# ============================================

# 5-minute setup
cat QUICKSTART.md

# Configuration help
cat CONFIG.md

# Full documentation
cat README.md

# Project summary
cat PROJECT-SUMMARY.md

# File structure
cat FILE-TREE.txt

# ============================================
# TESTING URLS (when server is running on port 8000)
# ============================================

# Home page
# http://localhost:8000/index.html

# Login
# http://localhost:8000/login.html

# Signup
# http://localhost:8000/signup.html

# Dashboard (requires login)
# http://localhost:8000/dashboard.html

# Admin panel (requires admin role)
# http://localhost:8000/admin.html

# Setup guide
# http://localhost:8000/setup.html

# ============================================
# PACKAGE MANAGEMENT (if using npm)
# ============================================

# Initialize package.json (if needed)
# npm init -y

# Install dev dependencies (optional)
# npm install --save-dev live-server

# Run with live-server (if installed)
# npx live-server

# ============================================
# COMMON TASKS
# ============================================

# Search for specific text in files
grep -r "YOUR_API_KEY" .

# Find configuration files
find . -name "*config*.js"

# Check file sizes
du -sh css/* js/*

# List HTML pages
ls -1 *.html

# ============================================
# DEPLOYMENT COMMANDS
# ============================================

# Build for production (if using build tools)
# npm run build

# Deploy to Netlify (if using Netlify CLI)
# netlify deploy --prod

# Deploy to Vercel (if using Vercel CLI)
# vercel --prod

# ============================================
# MAINTENANCE
# ============================================

# Check for TODO comments
grep -r "TODO" js/*.js

# Validate HTML (if using validator)
# html5validator --root .

# Check JavaScript syntax
# npx eslint js/

# ============================================
# MONITORING
# ============================================

# Watch files for changes (requires fswatch or similar)
# fswatch -o . | xargs -n1 -I{} echo "Files changed at $(date)"

# ============================================
# NOTES
# ============================================

# Before first use:
# 1. Update js/firebase-config.js with your Firebase credentials
# 2. Update js/cloudinary.js with your Cloudinary credentials
# 3. Start local server
# 4. Create admin user (see CONFIG.md)

# For help:
# - Read QUICKSTART.md for 5-minute setup
# - Open setup.html for visual guide
# - Read README.md for complete documentation

# Project location:
# /Users/ahmedjazlaanshareef/Dev/Exvertixe

# ============================================
# QUICK START (Copy-paste these commands)
# ============================================

cd /Users/ahmedjazlaanshareef/Dev/Exvertixe
python3 -m http.server 8000
# Then open http://localhost:8000/setup.html in your browser

# ============================================
