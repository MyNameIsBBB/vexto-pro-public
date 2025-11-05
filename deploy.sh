#!/bin/bash

# Vexto - Vercel Deployment Script
# This script helps you deploy your application to Vercel

set -e

echo "🚀 Vexto Deployment Helper"
echo "================================"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Vercel CLI not found. Installing..."
    npm install -g vercel
    echo "✅ Vercel CLI installed!"
    echo ""
fi

# Check if logged in
echo "🔐 Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    echo "Please login to Vercel:"
    vercel login
    echo ""
fi

# Confirm deployment
echo "📋 Deployment Checklist:"
echo ""
echo "Before deploying, make sure you have:"
echo "  ✓ MongoDB Atlas connection string"
echo "  ✓ JWT_SECRET generated"
echo "  ✓ TMWEASY API credentials"
echo "  ✓ Admin email addresses"
echo ""
read -p "Have you prepared all environment variables? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "📝 Please prepare your environment variables first."
    echo "   See .env.production.example for the list of required variables."
    echo ""
    echo "   You'll need to add them in Vercel Dashboard after deployment:"
    echo "   Settings → Environment Variables"
    echo ""
    exit 1
fi

# Deploy
echo ""
echo "🚀 Starting deployment..."
echo ""

# First deployment (preview)
vercel

echo ""
echo "✅ Preview deployment complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Go to Vercel Dashboard: https://vercel.com/dashboard"
echo "   2. Select your project"
echo "   3. Go to Settings → Environment Variables"
echo "   4. Add all variables from .env.production.example"
echo "   5. Come back and run: vercel --prod"
echo ""
read -p "Have you set all environment variables in Vercel Dashboard? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 Deploying to production..."
    vercel --prod
    echo ""
    echo "🎉 Production deployment complete!"
    echo ""
    echo "🌐 Your app is now live!"
    echo ""
    echo "📝 Test your deployment:"
    echo "   - Homepage: https://your-project.vercel.app"
    echo "   - Health check: https://your-project.vercel.app/api/health"
    echo ""
else
    echo ""
    echo "⏸️  Production deployment skipped."
    echo "   Run 'vercel --prod' when ready."
    echo ""
fi

echo "✨ Done!"
