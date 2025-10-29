# HackerRank Activity Heatmap 🔥

A beautiful LeetCode-style heatmap visualization for your HackerRank problem-solving activity, automatically updated daily on GitHub Pages!

![Preview](https://img.shields.io/badge/React-18.2.0-blue) ![Vite](https://img.shields.io/badge/Vite-5.0-purple) ![Auto Update](https://img.shields.io/badge/Auto%20Update-Daily-green)

## ✨ Features

- 📊 **GitHub-style contribution heatmap** for HackerRank submissions
- 🔄 **Automatic daily updates** via GitHub Actions
- 📱 **Responsive design** that works on all devices
- 🎨 **LeetCode-inspired color scheme** with blue gradient
- 📅 **Multiple date range views** (30/90/180/365 days, this year, last year, anniversaries)
- 🚀 **Fast and lightweight** - Built with React + Vite
- 📈 **Historical data tracking** - Shows all your past submissions
- 🔒 **Privacy-focused** - All data stored in your own repository

## 🚀 Quick Start

### 1. Fork/Clone this Repository

```bash
git clone https://github.com/YOUR-USERNAME/hackerrank-heatmap.git
cd hackerrank-heatmap
```

### 2. Set Up Repository Secrets

Go to your repository **Settings → Secrets and variables → Actions**, and add:

- `HACKERRANK_USERNAME` - Your HackerRank username (e.g., `john_doe`)

### 3. Enable GitHub Pages

1. Go to **Settings → Pages**
2. Source: **GitHub Actions**
3. Save

### 4. Configure Repository Base Path

Edit `vite.config.js` and change the base path to match your repository name:

```javascript
export default defineConfig({
  base: "https://github.com/Shreya-Karka/dsa-heatmap-hackerrank", // Change 'hackerrank-heatmap' to YOUR repo name
  // ...
});
```

### 5. Install Dependencies and Run Locally (Optional)

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` to see your heatmap!

### 6. Trigger First Data Fetch

1. Go to **Actions** tab in your repository
2. Click on "Update HackerRank Data" workflow
3. Click "Run workflow" button
4. Wait for it to complete (creates `hackerrank_data.json`)

### 7. Deploy to GitHub Pages

Push any change to trigger deployment, or:

1. Go to **Actions** tab
2. Click on "Deploy to GitHub Pages" workflow
3. Click "Run workflow"

Your heatmap will be live at: `https://YOUR-USERNAME.github.io/hackerrank-heatmap/`

## 📂 Project Structure

```
hackerrank-heatmap/
├── .github/
│   └── workflows/
│       ├── update-data.yml      # Daily data fetching
│       └── deploy.yml           # GitHub Pages deployment
├── src/
│   ├── components/
│   │   ├── Cell.jsx            # Individual heatmap cell
│   │   ├── WeekColumn.jsx      # Vertical week column
│   │   ├── MonthBlock.jsx      # Month grid
│   │   ├── HeatmapYear.jsx     # Year view container
│   │   └── RangeSelect.jsx     # Date range selector
│   ├── App.jsx                 # Main application
│   ├── App.css                 # Application styles
│   ├── index.css               # Global styles
│   └── main.jsx                # React entry point
├── fetch_hackerrank_data.py    # Data scraper
├── hackerrank_data.json        # Generated data file
├── index.html
├── vite.config.js
└── package.json
```

## 🔧 How It Works

### Data Collection

The `fetch_hackerrank_data.py` script:

1. Fetches your submission history from HackerRank's REST API
2. Extracts submission dates and counts
3. Merges with existing historical data
4. Saves everything to `hackerrank_data.json`

### Automatic Updates

GitHub Actions runs the data fetcher daily at 00:00 UTC:

1. Fetches latest submissions from HackerRank
2. Updates `hackerrank_data.json`
3. Commits changes to repository
4. Triggers automatic redeployment

### Visualization

React app reads `hackerrank_data.json` and displays:

- Color-coded cells (darker = more submissions)
- Hover tooltips with exact counts
- Customizable date ranges
- Account creation date tracking

## 🎨 Customization

### Change Color Scheme

Edit `src/index.css` and modify the CSS variables:

```css
:root {
  --c0-bg: #4a5164; /* 0 submissions */
  --c1-bg: #0b2447; /* 1 submission */
  --c2-bg: #123165; /* 2-3 submissions */
  --c3-bg: #19407e; /* 4-7 submissions */
  --c4-bg: #21509a; /* 8+ submissions */
}
```

### Adjust Submission Thresholds

Edit `src/components/Cell.jsx`:

```javascript
function colorClass(count, variant) {
  if (count <= 0) return "cell cell0";
  if (count <= 1) return "cell cell1"; // Change thresholds here
  if (count <= 3) return "cell cell2";
  if (count <= 7) return "cell cell3";
  return "cell cell4";
}
```

### Change Update Frequency

Edit `.github/workflows/update-data.yml`:

```yaml
schedule:
  - cron: "0 0 * * *" # Daily at midnight UTC
  # Examples:
  # - cron: '0 */6 * * *'  # Every 6 hours
  # - cron: '0 0 * * 0'    # Weekly on Sunday
```

## 🐛 Troubleshooting

### "No data available"

1. Check if `hackerrank_data.json` exists in your repository
2. Verify your `HACKERRANK_USERNAME` secret is correct
3. Run "Update HackerRank Data" workflow manually
4. Check workflow logs for errors

### Heatmap not showing on GitHub Pages

1. Ensure GitHub Pages is set to "GitHub Actions" source
2. Verify `vite.config.js` base path matches your repo name
3. Check if both workflows completed successfully
4. Try hard refresh (Ctrl+Shift+R)

### Old data not showing

The scraper can only fetch recent submissions from HackerRank's API (typically last ~100 submissions). To preserve historical data:

1. Run the scraper regularly (it merges with existing data)
2. Never delete `hackerrank_data.json`
3. Manual backups recommended

### Timestamps issue

HackerRank API returns Unix timestamps. The scraper converts them to `YYYY-MM-DD` format automatically. If you see incorrect dates:

1. Check your system timezone
2. Verify timestamp conversion in `fetch_hackerrank_data.py`
3. HackerRank stores times in UTC

## 📊 Data Format

The `hackerrank_data.json` structure:

```json
{
  "username": "your_username",
  "lastUpdated": "2025-10-29 12:34:56",
  "metadata": {
    "createdAt": "2020-01-15",
    "name": "John Doe",
    "country": "US"
  },
  "submissions": {
    "2025-10-29": 3,
    "2025-10-28": 1,
    "2025-10-15": 5
  }
}
```

## 🔒 Privacy & Security

- ✅ All data stays in your GitHub repository
- ✅ No external databases or third-party services
- ✅ Only public HackerRank profile data is accessed
- ✅ No authentication tokens required
- ✅ Open source - audit the code yourself!

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 📝 License

MIT License - feel free to use this for your own portfolio!

## 🙏 Acknowledgments

- Inspired by [GitHub contribution graph](https://github.com/)
- Color scheme inspired by [LeetCode](https://leetcode.com/)
- Built with [React](https://react.dev/) and [Vite](https://vitejs.dev/)

## 📧 Support

If you encounter issues:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Search existing [GitHub Issues](../../issues)
3. Open a new issue with details

---

⭐ **Star this repo** if it helped you showcase your HackerRank journey!

🔗 **Share your heatmap** - Tweet with `#HackerRankHeatmap`
