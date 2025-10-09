## 🏆 FMSC 2025 Firebase Team Names & Logo Mapping Analysis

**Based on your Firebase applications and available logo files, here's the complete analysis:**

### 📊 Available Logo Files in `/logos/` directory:
```
amigos.jpg
best.jpg
brave_generation_sports_club.jpg
foemathi.jpg
foemathi_jr.jpg
goalhians.jpg
goalhi_sports_club.jpg
g_star_sports_club.jpg
kanmathi_fc.jpg
kanmathi_sc.jpg
laamu_blues.jpg
lecrose_sports_club.jpg
maahinna_united.jpg
outreef_sports_club.jpg
youth_academy.jpg
```

### 🎯 OPTIMAL LOGO MAPPING CODE

**Copy this updated logo mapping to replace in ALL your HTML files:**

```javascript
function getTeamLogoFilename(teamName) {
    console.log('Getting logo for team:', teamName);
    
    const logoMap = {
        // Exact Firebase team name matches
        'Amigos': 'amigos',
        'Best': 'best',
        'Brave Generation Sports Club': 'brave_generation_sports_club',
        'Foemathi': 'foemathi',
        'Foemathi Jr': 'foemathi_jr',
        'Goalhians': 'goalhians',  
        'Goalhi Sports Club': 'goalhi_sports_club',
        'G Star Sports Club': 'g_star_sports_club',
        'Kanmathi FC': 'kanmathi_fc',
        'Kanmathi SC': 'kanmathi_sc',
        'Laamu Blues': 'laamu_blues',
        'LeCrose Sports Club': 'lecrose_sports_club',
        'Maahinna United': 'maahinna_united',
        'Outreef Sports Club': 'outreef_sports_club',
        'Youth Academy': 'youth_academy',
        
        // Alternative spellings and variations
        'AMIGOS': 'amigos',
        'Amigos FC': 'amigos',
        'BEST': 'best',
        'Best FC': 'best',
        'FOEMATHI': 'foemathi',
        'Foe Mathi': 'foemathi',
        'GOALHIANS': 'goalhians',
        'Goalhi': 'goalhi_sports_club',
        'G-Star Sports Club': 'g_star_sports_club',
        'G*Star Sports Club': 'g_star_sports_club',
        'G Star': 'g_star_sports_club',
        'Kanmathi': 'kanmathi_fc',
        'LeCrose': 'lecrose_sports_club',
        'Lecrose Sports Club': 'lecrose_sports_club',
        'Maahinna': 'maahinna_united',
        'Outreef': 'outreef_sports_club',
        'Youth': 'youth_academy',
        'Youth FC': 'youth_academy'
    };
    
    // Check for exact match first
    if (logoMap[teamName]) {
        console.log('Found exact match:', logoMap[teamName]);
        return logoMap[teamName];
    }
    
    // Try partial matching for cases with slight variations
    const normalizedName = teamName.toLowerCase().trim();
    for (const [key, value] of Object.entries(logoMap)) {
        if (key.toLowerCase().includes(normalizedName) || normalizedName.includes(key.toLowerCase())) {
            console.log('Found partial match:', key, '->', value);
            return value;
        }
    }
    
    // Fallback to generated filename
    const fallback = teamName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_').toLowerCase();
    console.log('Using fallback filename:', fallback);
    return fallback;
}
```

### 🔧 FILES TO UPDATE

**Replace the `getTeamLogoFilename` function in these files:**

1. `draw-display.html` ✅ (Already updated)
2. `schedule-display.html` ✅ (Already updated)  
3. `draw-control.html` ✅ (Already updated)
4. `team-standings.html` ✅ (Already updated)
5. `top-scorers.html` ✅ (Already updated)
6. `card-penalties.html` ✅ (Already updated)

### 🚀 NEXT STEPS TO FIX BUILD:

1. **Check if all logo files exist and are properly named**
2. **Verify service worker is updated to v12**
3. **Test the Firebase connection in hosted environment**
4. **Check for any console errors in browser developer tools**

### 🔍 TROUBLESHOOTING BUILD ISSUES:

If GitHub Pages build is stuck, try:

```bash
# Force push to trigger new build
git add .
git commit -m "Fix logo mapping and force rebuild"
git push --force-with-lease origin main
```

### 📱 TEST URLS:

Once deployed, test these pages:
- `your-domain.com/draw-display.html`
- `your-domain.com/schedule-display.html`
- `your-domain.com/team-standings.html`

### 🎯 EXPECTED RESULTS:

✅ All 15 teams should display logos correctly  
✅ No broken image icons  
✅ Consistent logo display across all pages  
✅ Proper fallbacks for any team name variations  

---

**The automatic matching should now work for ALL teams in your Firebase database!**