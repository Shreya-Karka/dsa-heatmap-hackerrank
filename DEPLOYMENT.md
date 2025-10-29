# 📦 Deployment Guide

This guide will walk you through deploying your HackerRank heatmap to GitHub Pages step-by-step.

## Prerequisites

- GitHub account
- Your HackerRank username
- Git installed on your computer (optional, can use GitHub web interface)

## Method 1: Quick Deploy (Using GitHub Web Interface)

### Step 1: Create Repository

1. Go to https://github.com/new
2. Repository name: `hackerrank-heatmap` (or any name you prefer)
3. Set to **Public**
4. ✅ Check "Add a README file"
5. Click **Create repository**

### Step 2: Upload Files

1. Click **Add file** → **Upload files**
2. Drag and drop all files from this project
3. Commit message: "Initial commit"
4. Click **Commit changes**

### Step 3: Configure Secrets

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `HACKERRANK_USERNAME`
4. Value: Your HackerRank username (e.g., `john_doe`)
5. Click **Add secret**

### Step 4: Update Configuration

1. Click on `vite.config.js` file
2. Click the **Edit** (pencil) icon
3. Change line 4:
   ```javascript
   base: '/your-repo-name/', // Change this to your actual repo name
   ```
   Example: If your repo is `hackerrank-heatmap`:
   ```javascript
   base: '/hackerrank-heatmap/',
   ```
4. Commit changes

### Step 5: Enable GitHub Pages

1. Go to **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Click **Save**

### Step 6: Initial Data Fetch

1. Go to **Actions** tab
2. Click **Update HackerRank Data** workflow
3. Click **Run workflow** → **Run workflow**
4. Wait for green checkmark (usually takes 1-2 minutes)

### Step 7: Deploy

1. The deployment should start automatically
2. If not, go to **Actions** → **Deploy to GitHub Pages** → **Run workflow**
3. Wait for green checkmark

### Step 8: View Your Heatmap! 🎉

Your heatmap is now live at:
```
https://YOUR-USERNAME.github.io/your-repo-name/
```

Example: `https://johndoe.github.io/hackerrank-heatmap/`

---

## Method 2: Advanced Deploy (Using Git CLI)

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/hackerrank-heatmap.git
cd hackerrank-heatmap
```

### Step 2: Configure Repository

Edit `vite.config.js`:
```javascript
base: '/hackerrank-heatmap/', // Match your repo name
```

### Step 3: Initial Setup

```bash
# Make setup script executable
chmod +x setup.sh

# Run setup (replace with your HackerRank username)
./setup.sh your_username
```

### Step 4: Test Locally (Optional)

```bash
# Copy data for local testing
mkdir -p public
cp hackerrank_data.json public/

# Start dev server
npm run dev
```

Visit http://localhost:5173 to preview.

### Step 5: Push to GitHub

```bash
git add .
git commit -m "Initial setup"
git push origin main
```

### Step 6: Configure GitHub Settings

Follow Steps 3-5 from Method 1 above.

---

## 🔄 Automatic Updates

Your heatmap will automatically update daily at midnight UTC. You can also manually trigger updates:

1. Go to **Actions** tab
2. Select **Update HackerRank Data**
3. Click **Run workflow**

---

## 🎨 Customization

### Change Repository Name After Creation

If you rename your repository:

1. Update `vite.config.js`:
   ```javascript
   base: '/new-repo-name/',
   ```

2. Commit and push:
   ```bash
   git add vite.config.js
   git commit -m "Update base path"
   git push
   ```

### Custom Domain

To use a custom domain (e.g., `heatmap.yourdomain.com`):

1. Add a `CNAME` file to the repository root:
   ```
   heatmap.yourdomain.com
   ```

2. Update `vite.config.js`:
   ```javascript
   base: '/', // Root path for custom domain
   ```

3. Configure DNS with your domain provider:
   - Type: CNAME
   - Name: heatmap (or subdomain you want)
   - Value: YOUR-USERNAME.github.io

4. In GitHub: **Settings** → **Pages** → **Custom domain**
   - Enter your domain
   - ✅ Enforce HTTPS

---

## 🐛 Common Issues

### "404 Not Found" After Deployment

**Cause**: Base path mismatch

**Fix**: Verify `vite.config.js` base matches your repo name exactly:
```javascript
base: '/hackerrank-heatmap/', // Must match repo name with slashes
```

### Workflow Fails with "Permission Denied"

**Cause**: Missing workflow permissions

**Fix**:
1. Go to **Settings** → **Actions** → **General**
2. Under **Workflow permissions**
3. Select **Read and write permissions**
4. Click **Save**

### No Data Showing

**Cause**: Data fetch failed or `HACKERRANK_USERNAME` secret incorrect

**Fix**:
1. Check **Actions** logs for errors
2. Verify secret is set correctly
3. Manually run "Update HackerRank Data" workflow
4. Check if `hackerrank_data.json` exists in repo

### Deployment Works But Shows Old Code

**Cause**: Browser cache

**Fix**: 
- Hard refresh: `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac)
- Or clear browser cache

---

## 📊 Monitoring

### Check Workflow Status

1. Go to **Actions** tab
2. Green checkmark = success
3. Red X = failure (click to see logs)

### View Deployment Status

Recent deployments appear in:
1. **Actions** tab (workflow runs)
2. **Deployments** section on repo home page

### Check Data Freshness

The `lastUpdated` timestamp in `hackerrank_data.json` shows when data was last fetched.

---

## 🔐 Security Best Practices

1. **Never commit API keys** or tokens (not needed for this project)
2. **Keep dependencies updated**: Run `npm audit fix` regularly
3. **Review workflow logs** for unusual activity
4. **Use branch protection** for production deployments

---

## 🆘 Getting Help

Still stuck? Try these resources:

1. **Check the main README**: Comprehensive troubleshooting section
2. **Search Issues**: https://github.com/YOUR-USERNAME/hackerrank-heatmap/issues
3. **GitHub Pages Docs**: https://docs.github.com/en/pages
4. **Vite Docs**: https://vitejs.dev/guide/

---

## ✅ Post-Deployment Checklist

- [ ] Site loads at `https://YOUR-USERNAME.github.io/repo-name/`
- [ ] Heatmap displays with correct data
- [ ] Username shows in header
- [ ] Date range selector works
- [ ] Hover tooltips show submission counts
- [ ] Mobile responsive (test on phone)
- [ ] Data updates daily (check tomorrow)

---

**Congratulations!** 🎉 Your HackerRank heatmap is now live and will update automatically!

Share your heatmap URL in your resume, LinkedIn, or portfolio! ⭐
