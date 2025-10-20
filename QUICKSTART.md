# Quick Start Guide - GULL

## 🚀 Get Started in 3 Steps

### 1. Start the Development Server

```bash
npm run dev
```

The app will be available at: **http://localhost:5173**

### 2. Create Your First Project

1. Enter a project name (e.g., "October 2025 Accounting")
2. Select a date
3. Choose entry types:
   - ✅ **Akra** - for 2-digit numbers (00-99)
   - ✅ **Ring** - for 3-digit numbers (000-999)
4. Click **"Create Project"**

### 3. Navigate and Use Your Project

**Dashboard Features:**
- Click on any project card to open the dashboard
- View real-time statistics (FIRST, SECOND, entries, unique numbers)
- See progress bars for Akra and Ring entries
- Review recent activity

**Add Entries:**
1. Click the blue **floating button** (bottom-right) or press `Ctrl+/`
2. Choose **Standard** tab for manual entry:
   - Enter numbers (e.g., `01, 23, 45` or `001, 234, 567`)
   - Enter FIRST and SECOND amounts
   - Add optional notes
   - Click "Add Entry"

3. Or choose **Intelligent** tab for bulk entry:
   - Paste data in format: `01 100 200` (number first second)
   - Supports multiple formats: `01:100:200`, `01 F:100 S:200`
   - Click "Process Data" to preview
   - Click "Add Entries" to confirm

**View History:**
- Click the purple **floating button** (bottom-left) or press `Ctrl+H`
- See all actions with timestamps
- View affected numbers for each action

**Undo/Redo:**
- Press `Ctrl+Z` to undo last action
- Press `Ctrl+Y` to redo
- Or use the undo/redo buttons in the header

**Theme Toggle:**
- Use the moon/sun icon in the top-right to switch between light and dark mode

## 🎯 Current Features (Phase 2)

### ✅ What Works Now
- ✅ Create multiple projects
- ✅ View project list with summaries
- ✅ **Complete Dashboard** with real-time statistics
- ✅ **Add Entries** - Standard and Intelligent modes
- ✅ **Transaction Management** - Full CRUD operations
- ✅ **History Panel** - View all actions with timestamps
- ✅ **Undo/Redo** - Full action history (Ctrl+Z/Ctrl+Y)
- ✅ **Floating Action Buttons** - Quick access to features
- ✅ **Keyboard Shortcuts** - Power user features
- ✅ **Real-time Calculations** - Statistics update instantly
- ✅ Light/dark theme switching
- ✅ Responsive design
- ✅ Data persistence (localStorage)

### 🚧 Coming in Phase 3
- Akra page with 00-99 number grid
- Ring page with 000-999 number grid
- Transaction history modal per number
- Filter & Calculate functionality
- Excel export/import

## 🎯 Project Routes

Currently available:
- **/** - Project Selection (main landing page)
- **/project/:id** - Dashboard (placeholder)
- **/project/:id/akra** - Akra page (placeholder)
- **/project/:id/ring** - Ring page (placeholder)
- **/project/:id/advanced-filter** - Advanced filter (placeholder)

## 🔧 Keyboard Shortcuts

**Active Now:**
- `Ctrl/Cmd + Z` - Undo last action
- `Ctrl/Cmd + Y` - Redo action
- `Ctrl/Cmd + /` - Toggle entry panel
- `Ctrl/Cmd + H` - Toggle history panel
- `Esc` - Close any open panel

**Navigation:**
- Click project tabs to switch between Dashboard, Akra, Ring, and Advanced Filter

## 📊 Testing the App

1. **Create a Project**
   - Name: "Test Project"
   - Date: Today's date
   - Types: Both Akra and Ring
   - Click "Create Project"

2. **Open the Dashboard**
   - Click on the project card
   - See the beautiful dashboard with statistics

3. **Add Some Entries (Standard Mode)**
   - Click the blue floating button (bottom-right)
   - Choose Standard tab
   - Enter numbers: `01, 23, 45`
   - FIRST: `100`
   - SECOND: `200`
   - Click "Add Entry"
   - See statistics update instantly!

4. **Try Intelligent Entry**
   - Click the floating button again
   - Choose Intelligent tab
   - Paste this:
     ```
     12 150 250
     34 200 300
     56 175 225
     ```
   - Click "Process Data"
   - Review the preview
   - Click "Add 3 Entries"

5. **View History**
   - Click the purple floating button (bottom-left)
   - See your "Add entry" actions
   - Note the timestamps and affected numbers

6. **Test Undo/Redo**
   - Press `Ctrl+Z` to undo
   - See the statistics update
   - Press `Ctrl+Y` to redo
   - Watch it come back!

7. **Toggle Theme**
   - Click the theme button in the header
   - Notice the smooth transition
   - Preference is saved automatically

8. **Create Multiple Projects**
   - Go back to home
   - Add 2-3 more projects
   - Each maintains its own data

## 💡 Tips

- Your data is saved locally in your browser
- Theme preference persists across sessions
- Projects are stored even after closing the browser
- The app works offline (PWA features)

## 🐛 Troubleshooting

### App doesn't start?
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
npm run dev
```

### Port 5173 already in use?
Vite will automatically use the next available port (5174, 5175, etc.)

### Styles not loading?
```bash
# Rebuild Tailwind CSS
npm run build
```

### Clear all data and start fresh?
Open browser console (F12) and run:
```javascript
localStorage.clear()
location.reload()
```

## 📱 Mobile Testing

The app is responsive! Test on mobile by:
1. Opening `http://localhost:5173` on your phone (same network)
2. Or use browser dev tools responsive mode (F12 > Toggle device toolbar)

## 🔜 What's Next?

Phase 3 will add:
- ✨ Akra page with 00-99 number grid
- ✨ Ring page with 000-999 number grid
- ✨ Transaction history per number
- ✨ Bar chart visualizations
- ✨ Filter & Calculate tabs
- ✨ Color-coded number boxes (highest/lowest)
- ✨ Search and pattern matching

---

**Ready for more?** Phase 2 complete! 🚀 Phase 3 coming next!

