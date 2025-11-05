# 🐳 Docker Setup Guide - Vexto

## 📋 Prerequisites

-   Docker Desktop installed
-   Docker Compose installed
-   Port 3000, 5001, 27017 available

## 🚀 Quick Start

### 1. Clone and Navigate

```bash
cd /path/to/vectr.co
```

### 2. Build and Run with Docker Compose

```bash
docker-compose up --build
```

หรือรันเบื้องหลัง:

```bash
docker-compose up -d --build
```

### 3. Access the Application

-   **Frontend**: http://localhost:3000
-   **Backend API**: http://localhost:5001
-   **MongoDB**: localhost:27017

## 🛠️ Commands

### Start Services

```bash
docker-compose up
```

### Start in Background

```bash
docker-compose up -d
```

### Stop Services

```bash
docker-compose down
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f mongodb
```

### Rebuild Containers

```bash
docker-compose up --build
```

### Remove Everything (including volumes)

```bash
docker-compose down -v
```

## 📦 Services

### Frontend (Next.js)

-   Container: `vectr-frontend`
-   Port: 3000
-   Build Context: ./frontend

### Backend (Node.js + Express)

-   Container: `vectr-backend`
-   Port: 5001
-   Build Context: ./backend

### Database (MongoDB)

-   Container: `vectr-mongodb`
-   Port: 27017
-   Data stored in: `mongodb_data` volume

## ⚙️ Configuration

### Environment Variables

**Backend (.env)**

```env
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb://vectr:vectr_password_change_me@mongodb:27017/vectr?authSource=admin
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CORS_ORIGIN=http://localhost:3000
```

**Frontend (.env.local)**

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5001/api
```

### ⚠️ Security Notes

**Before deploying to production:**

1. Change MongoDB password in `docker-compose.yml`
2. Change JWT_SECRET in backend environment
3. Update CORS_ORIGIN to your production domain
4. Use environment files instead of hardcoded values

## 🔧 Development vs Production

### Development (Current Setup)

```bash
docker-compose up
```

### Production

1. Update `docker-compose.yml` with production values
2. Use `.env` files for sensitive data
3. Set up reverse proxy (nginx/caddy)
4. Enable HTTPS
5. Configure proper backup for MongoDB

## 📊 Health Checks

### Check if services are running

```bash
docker-compose ps
```

### Test Backend API

```bash
curl http://localhost:5001/health
```

### Test Frontend

Open browser: http://localhost:3000

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :3000
lsof -i :5001
lsof -i :27017

# Kill process
kill -9 <PID>
```

### Database Connection Issues

```bash
# Check MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

### Frontend Not Building

```bash
# Rebuild frontend
docker-compose up --build frontend
```

### Clear Everything and Start Fresh

```bash
docker-compose down -v
docker-compose up --build
```

## 📝 Next.js Configuration

Add to `frontend/next.config.js`:

```js
module.exports = {
    output: "standalone",
    // ... other config
};
```

## 🎯 Production Deployment

### Using Docker Compose in Production

```bash
# Pull latest images
docker-compose pull

# Start with production config
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose logs -f
```

### Backup MongoDB

```bash
# Backup
docker exec vectr-mongodb mongodump --out /backup

# Restore
docker exec vectr-mongodb mongorestore /backup
```

## 📚 Additional Resources

-   [Docker Documentation](https://docs.docker.com/)
-   [Docker Compose Documentation](https://docs.docker.com/compose/)
-   [Next.js Docker Guide](https://nextjs.org/docs/deployment#docker-image)

## ✅ Checklist

-   [ ] Docker Desktop running
-   [ ] Ports 3000, 5001, 27017 available
-   [ ] Environment variables configured
-   [ ] `docker-compose up --build` executed
-   [ ] Frontend accessible at http://localhost:3000
-   [ ] Backend API responding at http://localhost:5001
-   [ ] Can register and login
-   [ ] Can create and view profiles

## 🎉 You're Ready!

Your Vexto application is now running in Docker containers!
