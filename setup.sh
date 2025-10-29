#!/bin/bash

# HackerRank Heatmap Setup Script

echo "🚀 HackerRank Heatmap Setup"
echo "============================"
echo ""

# Check if HackerRank username is provided
if [ -z "$1" ]; then
    echo "❌ Error: Please provide your HackerRank username"
    echo "Usage: ./setup.sh <your_hackerrank_username>"
    echo ""
    echo "Example: ./setup.sh john_doe"
    exit 1
fi

USERNAME=$1

echo "📦 Installing Node.js dependencies..."
npm install

echo ""
echo "🐍 Installing Python dependencies..."
pip install -r requirements.txt

echo ""
echo "📊 Fetching your HackerRank data..."
python fetch_hackerrank_data.py "$USERNAME"

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Copy hackerrank_data.json to test locally:"
echo "   cp hackerrank_data.json public/"
echo ""
echo "2. Start development server:"
echo "   npm run dev"
echo ""
echo "3. Or build for production:"
echo "   npm run build"
echo ""
echo "4. To deploy to GitHub Pages:"
echo "   - Update vite.config.js with your repo name"
echo "   - Add HACKERRANK_USERNAME secret to GitHub"
echo "   - Enable GitHub Pages in repository settings"
echo "   - Push to main branch"
echo ""
echo "🌟 Visit https://github.com/YOUR-USERNAME/hackerrank-heatmap for more info"
