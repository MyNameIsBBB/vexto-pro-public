# 🚀 Vexto - Profile Builder Platform

A modern, customizable profile link platform with premium templates, payment integration, and full theme customization.

## ✅ Features

-   🔐 **Authentication** - JWT-based login/register with Discord OAuth
-   👤 **Profile Builder** - Drag & drop blocks with real-time preview
-   🎨 **Customization** - Themes, fonts, avatar frames, colors
-   👑 **Premium System** - Free & Pro tiers with exclusive templates
-   💳 **Payment Integration** - PromptPay QR code payments via TMWEASY
-   📱 **Social Icons** - 20+ platforms (TikTok, Instagram, X, etc.)
-   🎯 **Premium Templates** - Testimonials, pricing, team, stats, timeline
-   🛡️ **Admin Panel** - Creator submission management
-   📊 **Analytics Ready** - Built for tracking and insights
-   🐳 **Docker Support** - Containerized for easy deployment

---

## 🚀 Deploy to Vercel (Production)

### Quick Deploy

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Run deployment script
./deploy.sh

# Or manually:
vercel login
vercel
# Then set environment variables in Vercel Dashboard
vercel --prod
```

### 📋 What You Need

1. **MongoDB Atlas** - Free tier available
2. **TMWEASY Account** - For payment processing
3. **Environment Variables** - See `.env.production.example`

**📖 Full deployment guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)  
**✅ Deployment checklist:** [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

---

## 🐳 Quick Start with Docker (Development)

```bash
# Start all services
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

**Access:**

-   Frontend: http://localhost:3000
-   Backend API: http://localhost:5001
-   MongoDB: localhost:27017

**Stop:**

```bash
docker-compose down
```

---

## 💻 Local Development

### Prerequisites

-   Node.js 18+
-   MongoDB
-   npm or yarn

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
npm install
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.local.example .env.local
# Edit .env.local with backend URL
npm install
npm run dev
```

---

## 🏗️ Project Structure

```
vexto/
├── frontend/           # Next.js 14 app
│   ├── app/           # App router pages
│   ├── components/    # React components
│   ├── contexts/      # Auth context
│   └── lib/           # API utilities
├── backend/           # Express API
│   ├── src/
│   │   ├── routes/    # API endpoints
│   │   ├── models/    # MongoDB models
│   │   └── middleware/# Auth & admin middleware
│   └── api/           # Vercel serverless entry
├── vercel.json        # Vercel configuration
├── docker-compose.yml # Docker setup
└── deploy.sh          # Deployment helper
```

---

## 📱 Supported Social Platforms

Instagram • TikTok • X (Twitter) • Facebook • YouTube • Line • Discord • Twitch • GitHub • LinkedIn • Threads • Snapchat • Pinterest • Medium • Behance • Dribbble • Spotify • Apple Music • SoundCloud • Custom Links

---

## 🎨 Premium Features

-   **Premium Templates:** Testimonials, Pricing Tables, Team Profiles, Statistics, Timeline
-   **Avatar Frames:** Glow effects, gradient borders
-   **Custom Themes:** Pre-built color schemes with full customization
-   **Font Options:** Multiple typography choices
-   **Border Radius:** Customize component roundness

---

## 📚 Documentation

-   📖 [DEPLOYMENT.md](./DEPLOYMENT.md) - Complete Vercel deployment guide
-   ✅ [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Pre-deployment checklist
-   🚀 [DEPLOY_QUICK.md](./DEPLOY_QUICK.md) - Quick deployment steps
-   🐳 [DOCKER_SETUP.md](./DOCKER_SETUP.md) - Docker guide
-   🔌 [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) - Backend integration
-   ⚙️ [SETUP.md](./SETUP.md) - Local setup instructions

---

## 🔒 Environment Variables

### Frontend

```env
NEXT_PUBLIC_API_BASE_URL=https://your-project.vercel.app/api
```

### Backend

```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
TMW_USER=your-tmweasy-username
TMW_PASSWORD=your-password
TMW_CON_ID=your-con-id
TMW_PROMPTPAY_ID=your-promptpay-id
TMW_TYPE=01
ADMIN_EMAILS=admin@example.com
```

See `.env.production.example` for complete list.

---

## 🛠️ Tech Stack

**Frontend:**

-   Next.js 14 (App Router)
-   React 18
-   TailwindCSS
-   React Icons
-   DnD Kit (drag & drop)

**Backend:**

-   Node.js / Express
-   MongoDB / Mongoose
-   JWT Authentication
-   TMWEASY Payment API
-   Helmet.js (security)

**Deployment:**

-   Vercel (serverless)
-   MongoDB Atlas
-   Docker (optional)

---

## 📊 API Endpoints

```
POST   /api/auth/register       - User registration
POST   /api/auth/login          - User login
GET    /api/auth/check-username - Check availability
GET    /api/profile/:username   - Get profile
PUT    /api/profile             - Update profile
POST   /api/payment/qrcode      - Generate payment QR
POST   /api/feedback            - Submit feedback
GET    /api/shop/creator-items  - Get creator items
POST   /api/creators/submit     - Submit creator work
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

This project is private and proprietary.

---

## 🆘 Support

For deployment issues:

-   Check [DEPLOYMENT.md](./DEPLOYMENT.md)
-   Review [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
-   Verify environment variables
-   Check Vercel function logs

---

**Ready for Production & Deployment! 🎉**

Made with ❤️ in Thailand
