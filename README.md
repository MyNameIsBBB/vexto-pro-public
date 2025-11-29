# 🚀 Vexto - Professional Digital Presence Platform

> **Enterprise-grade bio-link platform** for businesses, creators, and service providers. Create professional profiles with integrated payments, booking systems, and custom branding.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](package.json)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)

---

## ✨ Key Features

- 🔐 **Authentication** - JWT + OAuth (Discord, Google)
- 👤 **Profile Builder** - Drag & drop content blocks with live preview
- 🎨 **Full Customization** - Themes, fonts, colors, backgrounds
- 💳 **Payment Integration** - PromptPay QR, Stripe, real-time transactions
- 📅 **Service Booking** - Integrated appointment scheduling system
- 👑 **Premium Tiers** - Free and Pro plans with exclusive features
- 📱 **20+ Social Platforms** - Instagram, TikTok, X, YouTube, Discord, etc.
- 🎯 **Pro Blocks** - Testimonials, pricing tables, team, stats, galleries
- 📊 **Analytics Ready** - Track views, clicks, and conversions
- 🐳 **Docker Support** - Fully containerized for easy deployment

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- MongoDB (local or Atlas)
- *(Optional)* Docker & Docker Compose

### 1. Clone & Install

```bash
git clone https://github.com/MyNameIsBBB/vexto-pro-public.git
cd vexto-pro-public

# Install dependencies
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

### 2. Environment Setup

Create `.env` files:

**Backend** (`backend/.env`):
```env
# Database
MONGODB_URI=mongodb://localhost:27017/vexto

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=your-secret-key-here

# OAuth (optional - get from provider dashboards)
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-secret

# Payment (optional - TMWEASY/Stripe)
TMWEASY_MERCHANT_ID=your-merchant-id
TMWEASY_SECRET_KEY=your-secret
STRIPE_SECRET_KEY=sk_test_xxx

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5001
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5001/api
```

### 3. Run Development

**Option A: Docker (Recommended)**
```bash
docker-compose up
```
- Frontend: http://localhost:3000
- Backend: http://localhost:5001
- MongoDB: localhost:27017

**Option B: Manual**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

---

## 📦 Project Structure

```
vexto-pro-public/
├── frontend/           # Next.js 14 app (React 18)
│   ├── app/           # App router pages
│   ├── components/    # Reusable components
│   ├── contexts/      # Auth & Toast contexts
│   └── lib/           # Utilities & API helpers
├── backend/           # Node.js + Express API
│   ├── src/
│   │   ├── models/    # MongoDB schemas
│   │   ├── routes/    # API endpoints
│   │   └── middleware/# Auth, validation, rate limiting
│   └── api/           # Vercel serverless entry
├── docker-compose.yml # Container orchestration
└── BUSINESS_PITCH.md  # Professional pitch deck
```

---

## 🌐 Production Deployment

### Deploy to Vercel (Recommended)

1. **Prepare MongoDB Atlas**
   - Create free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
   - Get connection string
   - Whitelist Vercel IPs (0.0.0.0/0 for serverless)

2. **Deploy**
   ```bash
   npm i -g vercel
   vercel login
   vercel --prod
   ```

3. **Configure Environment**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add all variables from `.env` files
   - Redeploy: `vercel --prod`

4. **Set Custom Domain** *(Optional)*
   - Vercel Dashboard → Domains → Add Domain
   - Update DNS records as instructed

### Alternative: Docker + VPS

```bash
# Build and run in production mode
docker-compose -f docker-compose.yml up -d

# Or deploy to any VPS with Docker installed
scp -r . user@your-server:/app
ssh user@your-server
cd /app && docker-compose up -d
```

---

## 🔧 Configuration Guide

### Payment Integration

**PromptPay QR (Thailand)**
- Register at [TMWEASY](https://www.tmweasy.com/)
- Get Merchant ID and Secret Key
- Add to `backend/.env`: `TMWEASY_MERCHANT_ID` and `TMWEASY_SECRET_KEY`

**Stripe** *(International)*
- Get keys from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
- Add to `backend/.env`: `STRIPE_SECRET_KEY`

### OAuth Setup

**Discord**
1. Create app at [Discord Developer Portal](https://discord.com/developers/applications)
2. OAuth2 → Add redirect: `{FRONTEND_URL}/auth/discord/callback`
3. Copy Client ID and Secret to `.env`

**Google**
1. Create project at [Google Cloud Console](https://console.cloud.google.com/)
2. OAuth consent screen → Credentials → Create OAuth Client ID
3. Authorized redirect URIs: `{FRONTEND_URL}/auth/google/callback`
4. Copy credentials to `.env`

### Admin Access

First registered user is auto-admin. Or manually set in MongoDB:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

Access admin panel: `{FRONTEND_URL}/admin`

---

## 🛠️ Development

### Available Scripts

**Frontend**
```bash
npm run dev          # Development server (localhost:3000)
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint check
```

**Backend**
```bash
npm run dev          # Development (nodemon)
npm start            # Production
npm run build        # Build for Vercel serverless
```

### API Endpoints

**Auth**
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/discord` - OAuth Discord
- `GET /api/auth/google` - OAuth Google

**Profiles**
- `GET /api/profiles/:username` - Get public profile
- `GET /api/profiles/me` - Get own profile (auth)
- `PUT /api/profiles/me` - Update profile (auth)

**Payments**
- `POST /api/payment/create-qr` - Generate PromptPay QR
- `POST /api/payment/webhook` - Payment callback

**Admin** *(Auth + Admin role)*
- `GET /api/admin/creators` - List creator submissions
- `POST /api/admin/creators/:id/approve` - Approve submission
- `POST /api/admin/creators/:id/reject` - Reject submission

---

## 🎨 Customization

### Adding New Content Blocks

1. Create editor component in `frontend/components/block-editors/`
2. Add renderer in `frontend/components/BlockRenderer.jsx`
3. Register in block type enum

### Custom Themes

Themes are stored in profile settings:
```javascript
{
  theme: {
    primary: "#7c3aed",
    accent: "#22d3ee",
    background: "#0a0a0f",
    textColor: "#f3f4f6",
    fontFamily: "prompt",
    borderRadius: "modern",
    backgroundImage: "url(...)",
    // ...
  }
}
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Support & Contact

- **Documentation**: See `BUSINESS_PITCH.md` for business overview
- **Issues**: [GitHub Issues](https://github.com/MyNameIsBBB/vexto-pro-public/issues)
- **Website**: [vexto.pro](https://vexto.pro)
- **Email**: support@vexto.pro

---

## ⚠️ Security Notes for Public Repository

This repository is configured for **public distribution**. Please note:

- ✅ All `.env` files are gitignored
- ✅ Secrets are excluded from commit history
- ✅ Example env files provided (`.env.example`)
- ⚠️ Never commit real API keys, passwords, or tokens
- ⚠️ Regenerate all secrets before production use

**Before deploying:**
1. Generate new JWT secret: `openssl rand -base64 32`
2. Create fresh OAuth credentials
3. Use production API keys (not test keys)
4. Enable MongoDB authentication
5. Review `.gitignore` to ensure no sensitive files leak

---

**Built with ❤️ for businesses, creators, and professionals**
