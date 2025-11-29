# 🚀 Deployment Guide - Vexto

Complete guide for deploying Vexto to production environments.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Vercel Deployment (Recommended)](#vercel-deployment)
3. [Docker VPS Deployment](#docker-vps-deployment)
4. [Environment Variables](#environment-variables)
5. [Database Setup](#database-setup)
6. [Payment Configuration](#payment-configuration)
7. [Post-Deployment](#post-deployment)

---

## Prerequisites

Before deploying, ensure you have:

- [ ] MongoDB Atlas account (or self-hosted MongoDB)
- [ ] Domain name *(optional but recommended)*
- [ ] Payment processor accounts (TMWEASY/Stripe)
- [ ] OAuth app credentials (Discord/Google)
- [ ] Git repository with latest code

---

## Vercel Deployment

**Best for:** Serverless, automatic scaling, zero DevOps

### Step 1: Prepare MongoDB Atlas

1. Create account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create free M0 cluster
3. **Database Access**: Create user with read/write permissions
4. **Network Access**: Allow access from anywhere (`0.0.0.0/0`) for Vercel
5. Copy connection string:
   ```
   mongodb+srv://user:password@cluster.mongodb.net/vexto?retryWrites=true&w=majority
   ```

### Step 2: Deploy Frontend

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy from frontend directory
cd frontend
vercel

# For production:
vercel --prod
```

### Step 3: Deploy Backend (Serverless)

Backend auto-deploys as Vercel Functions via `api/index.js`:

```bash
# Deploy from root (backend uses api/ folder)
vercel --prod
```

### Step 4: Configure Environment Variables

**Vercel Dashboard** → Your Project → Settings → Environment Variables

Add all variables from section below, then redeploy:
```bash
vercel --prod
```

### Step 5: Custom Domain *(Optional)*

1. Vercel Dashboard → Domains → Add
2. Update DNS records:
   - Type: `CNAME`
   - Name: `@` or `www`
   - Value: `cname.vercel-dns.com`
3. Wait for propagation (up to 48h)

---

## Docker VPS Deployment

**Best for:** Full control, self-hosted, dedicated resources

### Step 1: Prepare VPS

Requirements:
- Ubuntu 20.04+ / Debian 11+
- 2GB RAM minimum
- Docker & Docker Compose installed

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose

# Enable Docker on startup
sudo systemctl enable docker
```

### Step 2: Transfer Files

```bash
# From local machine
scp -r . user@your-server-ip:/opt/vexto

# Or clone from GitHub
ssh user@your-server-ip
cd /opt
git clone https://github.com/MyNameIsBBB/vexto-pro-public.git vexto
cd vexto
```

### Step 3: Configure Environment

```bash
# Copy example files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Edit with production values
nano backend/.env
nano frontend/.env.local
```

### Step 4: Deploy with Docker

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Stop everything
docker-compose down
```

### Step 5: Setup Nginx Reverse Proxy *(Recommended)*

```bash
sudo apt install nginx certbot python3-certbot-nginx

# Create config
sudo nano /etc/nginx/sites-available/vexto
```

**Nginx config:**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/vexto /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Environment Variables

### Backend (`backend/.env`)

```bash
# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/vexto
# OR for local: mongodb://localhost:27017/vexto

# Security
JWT_SECRET=<generate-with-openssl-rand-base64-32>
PORT=5001

# URLs
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://yourdomain.com/api

# OAuth - Discord
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_secret

# OAuth - Google
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_secret

# Payment - PromptPay (TMWEASY)
TMWEASY_MERCHANT_ID=your_merchant_id
TMWEASY_SECRET_KEY=your_secret_key
TMWEASY_CALLBACK_URL=https://yourdomain.com/api/payment/webhook

# Payment - Stripe (optional)
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Node Environment
NODE_ENV=production
```

### Frontend (`frontend/.env.local` or Vercel env vars)

```bash
NEXT_PUBLIC_API_BASE_URL=https://yourdomain.com/api
# OR for Vercel: https://your-backend.vercel.app/api
```

---

## Database Setup

### MongoDB Atlas (Cloud)

1. **Create Cluster**: Free M0 tier available
2. **Create Database User**:
   - Database Access → Add New User
   - Username: `vexto-app`
   - Password: Generate secure password
   - Role: `Atlas admin` or `Read and write to any database`

3. **Network Access**:
   - For Vercel: `0.0.0.0/0` (allow all)
   - For VPS: Add your server IP

4. **Connection String**:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/vexto?retryWrites=true&w=majority
   ```

### Self-Hosted MongoDB (VPS)

```bash
# Install MongoDB
sudo apt install mongodb-org

# Enable authentication
sudo nano /etc/mongod.conf
# Add: security.authorization: enabled

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Create admin user
mongosh
use admin
db.createUser({
  user: "admin",
  pwd: "secure-password",
  roles: ["root"]
})

# Create app user
use vexto
db.createUser({
  user: "vexto-app",
  pwd: "app-password",
  roles: ["readWrite"]
})
```

Connection string:
```
mongodb://vexto-app:app-password@localhost:27017/vexto
```

---

## Payment Configuration

### PromptPay (TMWEASY)

1. **Register**: [tmweasy.com](https://www.tmweasy.com/)
2. **Get Credentials**:
   - Login → API Settings
   - Copy: Merchant ID, Secret Key
3. **Configure Callback**:
   - Callback URL: `https://yourdomain.com/api/payment/webhook`
4. **Test**: Use test mode first, then switch to production

### Stripe

1. **Create Account**: [stripe.com](https://stripe.com/)
2. **Get API Keys**:
   - Dashboard → Developers → API Keys
   - Copy: Secret Key (starts with `sk_`)
3. **Setup Webhook** *(if using subscriptions)*:
   - Dashboard → Webhooks → Add Endpoint
   - URL: `https://yourdomain.com/api/payment/stripe-webhook`
   - Events: `checkout.session.completed`, `invoice.payment_succeeded`

---

## Post-Deployment

### 1. Verify Deployment

```bash
# Check frontend
curl https://yourdomain.com

# Check backend API
curl https://yourdomain.com/api/profiles/test-user

# Check health endpoint (if you added one)
curl https://yourdomain.com/api/health
```

### 2. Create Admin User

**Method A:** Register first user (auto-admin)
```bash
# First registered user becomes admin
curl -X POST https://yourdomain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"secure-pass","username":"admin"}'
```

**Method B:** Manual MongoDB update
```bash
mongosh "your-connection-string"
use vexto
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "admin" } }
)
```

### 3. Test Core Features

- [ ] User registration works
- [ ] Login with email/password
- [ ] OAuth (Discord/Google) redirects correctly
- [ ] Profile creation and editing
- [ ] Theme customization applies
- [ ] Payment QR generation
- [ ] Public profile viewing
- [ ] Admin panel accessible

### 4. Monitor & Logs

**Vercel:**
- Dashboard → Your Project → Logs
- Real-time function logs
- Build logs

**Docker VPS:**
```bash
# View logs
docker-compose logs -f

# Check specific service
docker-compose logs frontend
docker-compose logs backend

# Check disk usage
docker system df
```

### 5. Backup Strategy

**MongoDB Atlas:** Auto-backups included in free tier

**Self-Hosted:**
```bash
# Create backup script
nano /opt/backup-mongo.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="mongodb://user:pass@localhost/vexto" --out=/backup/mongo_$DATE
# Compress
tar -czf /backup/mongo_$DATE.tar.gz /backup/mongo_$DATE
rm -rf /backup/mongo_$DATE
# Keep only last 7 days
find /backup -name "mongo_*.tar.gz" -mtime +7 -delete
```

```bash
chmod +x /opt/backup-mongo.sh
# Add to crontab (daily at 2 AM)
crontab -e
0 2 * * * /opt/backup-mongo.sh
```

---

## Troubleshooting

### Issue: "Cannot connect to MongoDB"
- Check connection string format
- Verify network access (IP whitelist)
- Test with mongosh manually
- Check user permissions

### Issue: "OAuth redirect mismatch"
- Verify `FRONTEND_URL` in `.env`
- Check OAuth app settings (callback URLs)
- Ensure HTTPS in production
- Clear browser cache

### Issue: "Payment webhook not working"
- Check callback URL in payment provider
- Verify endpoint is publicly accessible
- Check backend logs for errors
- Test with provider's test mode

### Issue: "Vercel function timeout"
- Optimize database queries
- Add indexes to MongoDB collections
- Enable connection pooling
- Consider upgrading Vercel plan

### Issue: "502 Bad Gateway" (VPS)
- Check if containers are running: `docker ps`
- View logs: `docker-compose logs`
- Restart: `docker-compose restart`
- Check Nginx config: `sudo nginx -t`

---

## Performance Optimization

### Database Indexes
```javascript
// In MongoDB shell
db.users.createIndex({ email: 1 })
db.users.createIndex({ username: 1 })
db.profiles.createIndex({ username: 1 })
db.profiles.createIndex({ isPro: 1 })
```

### Next.js Optimization
```javascript
// next.config.mjs
export default {
  images: {
    domains: ['yourdomain.com', 'images.unsplash.com'],
  },
  compress: true,
  poweredByHeader: false,
}
```

### Nginx Caching
```nginx
# Add to server block
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 7d;
    add_header Cache-Control "public, immutable";
}
```

---

## Security Checklist

- [ ] Use HTTPS (SSL certificate via Certbot)
- [ ] Set strong JWT_SECRET (32+ characters)
- [ ] Enable MongoDB authentication
- [ ] Whitelist IPs for database access
- [ ] Use environment variables (never hardcode secrets)
- [ ] Rate limit API endpoints
- [ ] Set up firewall (ufw/iptables)
- [ ] Regular security updates
- [ ] Monitor logs for suspicious activity
- [ ] Backup database regularly

---

## Scaling Considerations

### Horizontal Scaling (Vercel)
- Automatic scaling included
- No configuration needed
- Pay-per-use pricing

### Horizontal Scaling (VPS)
- Use load balancer (Nginx/HAProxy)
- Multiple Docker instances
- Shared MongoDB (Atlas or replica set)
- Redis for session management

### Database Scaling
- MongoDB Atlas: Upgrade to M10+ for replication
- Self-hosted: Set up replica set
- Add read replicas for heavy read workloads

---

**Need help?** Open an issue on [GitHub](https://github.com/MyNameIsBBB/vexto-pro-public/issues)
