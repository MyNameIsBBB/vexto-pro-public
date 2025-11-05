# Vexto - Deployment Guide

## 🚀 Deploy to Vercel

### Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. MongoDB Atlas account (for production database)
3. TMWEASY API credentials (for payment processing)

### Step 1: Prepare MongoDB

2. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
3. Create a new cluster (free tier available)
4. Get your connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/vexto`)

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel CLI (Recommended)

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Login to Vercel:

```bash
vercel login
```

3. Deploy from project root:

```bash
cd /Users/peeratus-v/Desktop/peeratus-projects/vectr.co
vercel
```

4. Follow the prompts:
    - Set up and deploy? **Y**
    - Which scope? (select your account)
    - Link to existing project? **N**
    - Project name? **vectr-co** (or your preferred name)
    - In which directory is your code located? **./frontend**

#### Option B: Deploy via Vercel Dashboard

1. Push your code to GitHub:

```bash
git init
git add .
git commit -m "Initial commit - ready for deployment"
git remote add origin https://github.com/yourusername/vexto.git
git push -u origin main
```

2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Configure as follows:
    - **Framework Preset:** Next.js
    - **Root Directory:** `frontend`
    - **Build Command:** `npm run build`
    - **Output Directory:** `.next`

### Step 3: Configure Environment Variables

Add these environment variables in Vercel Dashboard (Settings → Environment Variables):

#### Frontend Variables:

```
NEXT_PUBLIC_API_BASE_URL=https://your-project.vercel.app/api
```

#### Backend Variables:

```
PORT=5001
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vexto?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this
CORS_ORIGIN=https://your-project.vercel.app

# TMWEASY Payment Gateway
TMW_USER=your-tmweasy-username
TMW_PASSWORD=your-tmweasy-password
TMW_CON_ID=your-con-id
TMW_PROMPTPAY_ID=0984979878
TMW_TYPE=01
TMW_ACCODE=your-accode
TMW_ACCOUNT_NO=0000000000

# Admin Configuration
ADMIN_EMAILS=your-email@example.com
```

### Step 4: Deploy Backend as Serverless Function

The backend is configured to run as Vercel serverless functions. The `vercel.json` file handles the routing:

-   `/api/*` → Backend serverless functions
-   All other routes → Next.js frontend

### Step 5: Test Deployment

1. After deployment, visit your Vercel URL
2. Test these endpoints:
    - `https://your-project.vercel.app/` - Frontend
    - `https://your-project.vercel.app/api/health` - Backend health check
    - `https://your-project.vercel.app/api/auth/check-username/test` - API test

### Step 6: Set Custom Domain (Optional)

1. Go to your project in Vercel Dashboard
2. Navigate to Settings → Domains
3. Add your custom domain (e.g., vexto.app)
4. Follow DNS configuration instructions

## 🔧 Environment Variables Reference

### Required Variables:

| Variable           | Description               | Example                         |
| ------------------ | ------------------------- | ------------------------------- |
| `MONGODB_URI`      | MongoDB connection string | `mongodb+srv://...`             |
| `JWT_SECRET`       | Secret key for JWT tokens | Random 32+ char string          |
| `TMW_USER`         | TMWEASY username          | Your username                   |
| `TMW_PASSWORD`     | TMWEASY password          | Your password                   |
| `TMW_CON_ID`       | TMWEASY connection ID     | Your con_id                     |
| `TMW_PROMPTPAY_ID` | PromptPay number          | `0984979878`                    |
| `TMW_TYPE`         | PromptPay type            | `01` (phone) or `03` (e-wallet) |

### Optional Variables:

| Variable         | Description           | Default                  |
| ---------------- | --------------------- | ------------------------ |
| `CORS_ORIGIN`    | Allowed origins       | Your Vercel URL          |
| `ADMIN_EMAILS`   | Admin email addresses | Empty                    |
| `TMW_ACCODE`     | Bank account code     | For payment confirmation |
| `TMW_ACCOUNT_NO` | Bank account number   | For payment confirmation |

## 🐛 Troubleshooting

### Build Fails

-   Check that all dependencies are in `package.json`
-   Verify Node.js version compatibility (use Node 18+)

### API Not Working

-   Verify `NEXT_PUBLIC_API_BASE_URL` matches your Vercel URL
-   Check backend environment variables are set
-   Test `/api/health` endpoint

### Database Connection Issues

-   Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
-   Check connection string format
-   Ensure network access is configured in MongoDB Atlas

### Payment Not Working

-   Verify all TMW\_\* environment variables are set correctly
-   Test TMWEASY credentials separately
-   Check payment logs in Vercel Functions logs

## 📊 Monitoring

1. **Function Logs:** Vercel Dashboard → Your Project → Logs
2. **Performance:** Vercel Dashboard → Analytics
3. **Errors:** Check Vercel Function logs for backend errors

## 🔄 Continuous Deployment

Once connected to GitHub:

1. Push to `main` branch
2. Vercel automatically builds and deploys
3. Preview deployments for pull requests

## 💡 Tips

-   Use Vercel's preview deployments to test changes
-   Set up different environments (production, staging)
-   Monitor MongoDB Atlas for database performance
-   Enable Vercel Analytics for usage insights
-   Consider upgrading Vercel plan for increased limits

## 🆘 Support

-   **Vercel Docs:** https://vercel.com/docs
-   **Next.js Docs:** https://nextjs.org/docs
-   **MongoDB Atlas:** https://www.mongodb.com/docs/atlas

---

**Ready to deploy!** 🎉
