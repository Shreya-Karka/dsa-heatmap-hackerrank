# ⚡ Quick Start Guide

Get your HackerRank heatmap up and running in 5 minutes!

## 🎯 What You'll Get

A beautiful, auto-updating contribution heatmap like this:

```
┌─────────────────────────────────────────┐
│  HackerRank Activity        [@username] │
│                                         │
│  ▢▢▢▢▢▢▢ ▢▢▢▢▢▢▢ ▢▢▢▢▢▢▢ ▢▢▢▢▢▢▢    │
│  ▢■▢▢■▢▢ ▢▢■▢▢▢▢ ▢■■▢▢▢▢ ▢▢▢■▢▢▢    │
│  ▢▢■▢▢▢▢ ▢▢▢▢■▢▢ ▢▢▢■▢▢▢ ▢■▢▢▢▢▢    │
│  ▢▢▢■▢▢▢ ▢■▢▢▢▢▢ ▢▢▢▢■▢▢ ▢▢▢▢■▢▢    │
│   Oct     Nov     Dec     Jan         │
└─────────────────────────────────────────┘
```

**Features:**

- ✅ Shows all your HackerRank submissions
- ✅ Color intensity based on activity
- ✅ Updates automatically every day
- ✅ Free hosting on GitHub Pages
- ✅ Mobile responsive

---

## 🚀 Option 1: GitHub Web Interface (Easiest!)

### Step 1: Create Repository (2 min)

1. Go to https://github.com/new
2. Name: `dsa-heatmap-hackerrank`
3. Make it **Public**
4. ✅ Check "Add a README file"
5. Click **Create repository**

### Step 2: Upload Files (1 min)

1. Download the project files (link provided separately)
2. Extract the ZIP file
3. In your GitHub repo, click **Add file** → **Upload files**
4. Drag ALL files and folders
5. Commit message: "Initial setup"
6. Click **Commit changes**

### Step 3: Add Your Username (1 min)

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `HACKERRANK_USERNAME`
4. Value: `your_hackerrank_username` (e.g., `john_doe`)
5. Click **Add secret**

### Step 4: Update Config (1 min)

1. Click on `vite.config.js` file
2. Click the pencil icon (Edit)
3. Change line 4:
   ```javascript
   base: '/hackerrank-heatmap/',
   ```
   Make sure this matches your repository name exactly!
4. Commit changes

### Step 5: Enable GitHub Pages (30 sec)

1. Go to **Settings** → **Pages**
2. Source: **GitHub Actions**
3. Save

### Step 6: Fetch Data (30 sec)

1. Go to **Actions** tab
2. Click **Update HackerRank Data**
3. Click **Run workflow** → **Run workflow** (green button)
4. Wait for ✓ green checkmark

### Step 7: 🎉 You're Live!

Visit: `https://YOUR-USERNAME.github.io/hackerrank-heatmap/`

The heatmap will update automatically every day at midnight UTC!

---

## 🖥️ Option 2: Command Line (For Developers)

### Prerequisites

- Git installed
- Node.js 18+ installed
- Python 3.8+ installed

### Quick Setup

```bash
# 1. Clone or create repository
git clone https://github.com/YOUR-USERNAME/hackerrank-heatmap.git
cd hackerrank-heatmap

# 2. Run setup script
chmod +x setup.sh
./setup.sh your_hackerrank_username

# 3. Test locally
npm run dev
# Visit http://localhost:5173

# 4. Push to GitHub
git add .
git commit -m "Initial setup"
git push origin main
```

Then follow Steps 3-5 from Option 1 to enable GitHub Pages.

---

## 🔧 Configuration

### Change Repository Name

If your repo is named something other than `hackerrank-heatmap`:

Edit `vite.config.js`:

```javascript
base: '/your-actual-repo-name/',  // Must match exactly!
```

### Change Update Frequency

Edit `.github/workflows/update-data.yml`:

```yaml
schedule:
  - cron: "0 0 * * *" # Daily at midnight UTC

# Other options:
# - cron: '0 */6 * * *'   # Every 6 hours
# - cron: '0 0 * * 0'     # Weekly (Sundays)
```

### Customize Colors

Edit `src/index.css`:

```css
:root {
  --c0-bg: #4a5164; /* 0 submissions */
  --c1-bg: #0b2447; /* 1 submission */
  --c2-bg: #123165; /* 2-3 submissions */
  --c3-bg: #19407e; /* 4-7 submissions */
  --c4-bg: #21509a; /* 8+ submissions */
}
```

---

## 📊 Understanding Your Data

### Data File: `hackerrank_data.json`

This file is automatically created and contains:

```json
{
  "username": "your_username",
  "lastUpdated": "2025-10-29 12:00:00",
  "metadata": {
    "createdAt": "2024-01-15" // Your account creation date
  },
  "submissions": {
    "2025-10-29": 3, // 3 submissions on Oct 29
    "2025-10-28": 1 // 1 submission on Oct 28
    // etc.
  }
}
```

### Historical Data

- **First run**: Fetches ~100 recent submissions from HackerRank
- **Daily runs**: Adds new submissions while keeping old ones
- **Result**: Complete history over time!

**Important**: Never delete `hackerrank_data.json` or you'll lose your history.

---

## 🎨 Viewing Options

Your heatmap shows multiple date ranges:

- **Last 30 Days** - Recent activity
- **Last 90 Days** - Quarterly view
- **Last 365 Days** - Full year (default)
- **This Year** - Calendar year to date
- **Last Year** - Previous calendar year
- **Anniversary Ranges** - Year-by-year since account creation

Switch ranges using the dropdown in the top-right!

---

## ⚠️ Troubleshooting

### "No data available"

1. Check if workflow ran successfully (Actions tab)
2. Verify `HACKERRANK_USERNAME` secret is correct
3. Look for `hackerrank_data.json` in your repo

### "404 Not Found"

1. Make sure GitHub Pages is enabled (Settings → Pages)
2. Check that `vite.config.js` base matches repo name
3. Try hard refresh: Ctrl+Shift+R

### Workflow fails

1. Check Actions logs for specific error
2. Verify Python dependencies in workflow
3. Make sure HackerRank profile is public

### Data not updating

1. Check last run time in Actions tab
2. Workflow runs at midnight UTC daily
3. Manually trigger with "Run workflow" button

---

## 📱 Sharing Your Heatmap

Add to your:

- **Portfolio Website**: Embed using iframe
- **GitHub Profile README**: Add as image or link
- **LinkedIn**: Link in your bio
- **Resume**: Include the URL

Example markdown for GitHub README:

```markdown
## 🔥 My HackerRank Activity

Check out my problem-solving journey: [HackerRank Heatmap](https://your-username.github.io/hackerrank-heatmap/)
```

---

## 🔄 Manual Update

Want to update immediately instead of waiting for daily run?

1. Go to **Actions** tab
2. Click **Update HackerRank Data**
3. Click **Run workflow**
4. Wait ~1 minute
5. Refresh your heatmap page

---

## ✅ Success Checklist

Before you're done, verify:

- [ ] Site loads at `https://YOUR-USERNAME.github.io/repo-name/`
- [ ] Your username appears in header
- [ ] Heatmap shows colored squares for your submissions
- [ ] Hover over squares shows dates and counts
- [ ] Date range selector works
- [ ] Workflow runs daily (check Actions tab tomorrow)
- [ ] Mobile view works (test on phone)

---

## 🎯 Next Steps

1. **Customize**: Change colors, thresholds, or styling
2. **Share**: Add link to your portfolio/resume
3. **Monitor**: Check Actions tab occasionally
4. **Star the Repo**: Help others discover this tool!

---

## 📚 Additional Resources

- **README.md** - Comprehensive documentation
- **DEPLOYMENT.md** - Detailed deployment guide
- **COMPARISON.md** - How this differs from original code
- **GitHub Pages Docs** - https://docs.github.com/en/pages

---

## 🆘 Need Help?

1. Check the main README.md troubleshooting section
2. Review workflow logs in Actions tab
3. Open an issue on GitHub
4. Verify HackerRank username is correct

---

## 🎉 Congratulations!

You now have a professional HackerRank activity heatmap that:

- Updates automatically
- Tracks your complete history
- Looks great on any device
- Is completely free to host

Keep solving problems and watch your heatmap grow! 🚀

**Pro Tip**: Solve at least one problem daily to maintain your streak! 💪
