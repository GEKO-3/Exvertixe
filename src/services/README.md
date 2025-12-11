# Service Images Guide

## 📸 Add Your Service Images

Place your service images in the `src/services/` folder with these filenames:

### Required Images:

1. **social-media.jpg** - Social Media Marketing
   - Recommended: Images of social media platforms, content creation, engagement
   - Dimensions: 800x600px or 1200x800px

2. **advertising.jpg** - Targeted Advertising
   - Recommended: Digital ads, targeting graphics, campaign visuals
   - Dimensions: 800x600px or 1200x800px

3. **analytics.jpg** - Analytics & Reporting
   - Recommended: Charts, graphs, data visualization
   - Dimensions: 800x600px or 1200x800px

4. **content.jpg** - Content Creation
   - Recommended: Writing, design tools, creative process
   - Dimensions: 800x600px or 1200x800px

5. **seo.jpg** - SEO Optimization
   - Recommended: Search engines, keywords, rankings
   - Dimensions: 800x600px or 1200x800px

6. **branding.jpg** - Brand Strategy
   - Recommended: Brand elements, logo design, brand identity
   - Dimensions: 800x600px or 1200x800px

---

## 🎨 Image Guidelines

**Format:** JPG, PNG, or WebP
**Size:** 800x600px minimum (1200x800px recommended)
**File Size:** Under 500KB for best performance
**Style:** Professional, high-quality, on-brand

---

## 💡 Temporary Solution

Until you add your images, the service cards will show:
- Gradient overlays with your brand colors
- Service icons (emoji)
- All functionality works perfectly

---

## 🔧 How Images Are Used

Each service card uses:
```html
<div class="service-image" style="background: gradient + your-image.jpg">
```

The gradient overlay ensures:
- Icons remain visible
- Brand colors are present
- Consistent look across all cards
- Professional appearance

---

## 🚀 After Adding Images

1. Place images in `src/services/` folder
2. Refresh your website
3. Images will automatically appear with gradient overlays
4. Click any service card to see detailed service page

No code changes needed - just add the images!
