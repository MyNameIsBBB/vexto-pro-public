# 🚀 Vexto - Vercel Deployment Checklist

## Pre-Deployment Checklist

### 1. Code Preparation

-   [x] `.gitignore` created
-   [x] `vercel.json` configured
-   [x] Next.js config updated for Vercel
-   [x] Backend API serverless function created (`backend/api/index.js`)
-   [x] Environment variable examples created

### 2. Database Setup

-   [ ] MongoDB Atlas account created
-   [ ] Database cluster created (free tier available)
-   [ ] Database user created with password
-   [ ] Network access configured (allow 0.0.0.0/0 for Vercel)
-   [ ] Connection string copied

### 3. Payment Gateway

-   [ ] TMWEASY account credentials ready
-   [ ] PromptPay ID configured
-   [ ] Bank account details ready (for confirmation)

### 4. Admin Configuration

-   [ ] Admin email addresses identified
-   [ ] Admin user IDs noted (if using ID-based auth)

## Deployment Steps

### Option A: Vercel CLI (Recommended)

-   [ ] Install Vercel CLI: `npm i -g vercel`
-   [ ] Login: `vercel login`
-   [ ] Deploy: `vercel` from project root
-   [ ] Configure environment variables in Vercel Dashboard
-   [ ] Production deploy: `vercel --prod`

### Option B: GitHub + Vercel

-   [ ] Push code to GitHub
-   [ ] Connect repository to Vercel
-   [ ] Configure root directory as `frontend`
-   [ ] Set environment variables
-   [ ] Deploy

## Post-Deployment Configuration

### Environment Variables (Vercel Dashboard)

Add all variables from `.env.production.example`:

#### Frontend

-   [ ] `NEXT_PUBLIC_API_BASE_URL`

#### Backend

-   [ ] `MONGODB_URI`
-   [ ] `JWT_SECRET`
-   [ ] `CORS_ORIGIN`
-   [ ] `TMW_USER`
-   [ ] `TMW_PASSWORD`
-   [ ] `TMW_CON_ID`
-   [ ] `TMW_PROMPTPAY_ID`
-   [ ] `TMW_TYPE`
-   [ ] `TMW_ACCODE` (optional)
-   [ ] `TMW_ACCOUNT_NO` (optional)
-   [ ] `ADMIN_EMAILS`

### Testing

-   [ ] Visit homepage: `https://your-project.vercel.app`
-   [ ] Test health endpoint: `https://your-project.vercel.app/api/health`
-   [ ] Test user registration
-   [ ] Test user login
-   [ ] Test profile creation
-   [ ] Test Pro upgrade flow
-   [ ] Test payment QR generation
-   [ ] Create test admin user
-   [ ] Test admin panel access

### DNS Configuration (Optional)

-   [ ] Add custom domain in Vercel
-   [ ] Configure DNS records
-   [ ] Verify SSL certificate
-   [ ] Update `CORS_ORIGIN` with custom domain
-   [ ] Update `NEXT_PUBLIC_API_BASE_URL` with custom domain

## Monitoring Setup

-   [ ] Enable Vercel Analytics
-   [ ] Set up MongoDB Atlas monitoring alerts
-   [ ] Configure error tracking
-   [ ] Set up uptime monitoring

## Security Checklist

-   [ ] Strong JWT_SECRET generated (32+ characters)
-   [ ] Environment variables properly set (not in code)
-   [ ] CORS configured correctly
-   [ ] Rate limiting enabled
-   [ ] Helmet.js security headers configured
-   [ ] MongoDB connection from trusted sources only

## Performance Optimization

-   [ ] Next.js images optimized
-   [ ] Static assets configured
-   [ ] API response caching considered
-   [ ] Database indexes created
-   [ ] MongoDB connection pooling configured

## Documentation

-   [ ] README.md updated with deployment URL
-   [ ] API documentation accessible
-   [ ] Admin guide created
-   [ ] User guide available

## Rollback Plan

-   [ ] Previous deployment saved in Vercel
-   [ ] Database backup strategy in place
-   [ ] Rollback procedure documented

---

## Quick Commands Reference

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy preview
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]
```

## Helpful Links

-   [Vercel Dashboard](https://vercel.com/dashboard)
-   [MongoDB Atlas](https://cloud.mongodb.com)
-   [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
-   [Vercel CLI Docs](https://vercel.com/docs/cli)

---

**Status:** Ready for deployment ✅
