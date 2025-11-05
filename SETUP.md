# 🚀 Setup Guide - Vectr Portfolio Builder

## การติดตั้งและรันโปรเจค

### 1. ติดตั้ง Backend

```bash
cd backend
npm install
```

ไฟล์ `.env` ถูกสร้างไว้แล้วที่:
- PORT: 5001
- MONGODB_URI: mongodb://localhost:27017/vectr
- JWT_SECRET: your-super-secret-jwt-key-change-this-in-production
- CORS_ORIGIN: http://localhost:3000,http://localhost:3001

**เริ่ม Backend Server:**
```bash
npm start
# หรือ npm run dev (ถ้ามี nodemon)
```

Backend จะรันที่: `http://localhost:5001`

### 2. ติดตั้ง Frontend

```bash
cd frontend
npm install
```

ไฟล์ `.env.local` ถูกสร้างไว้แล้วที่:
- NEXT_PUBLIC_API_BASE_URL: http://localhost:5001/api

**เริ่ม Frontend Server:**
```bash
npm run dev
```

Frontend จะรันที่: `http://localhost:3000`

### 3. ทดสอบระบบ

1. เปิด `http://localhost:3000`
2. คลิก "สมัครฟรี" สร้างบัญชี
3. Login เข้าสู่ระบบ
4. ไปที่ "แก้ไขโปรไฟล์" 
5. เพิ่ม/แก้ไขข้อมูล
6. บันทึกและดูที่ `/u/your-username`

## ✅ การเปลี่ยนแปลงทั้งหมด

### ไฟล์ที่สร้างใหม่
1. `frontend/contexts/AuthContext.jsx` - จัดการ authentication
2. `frontend/app/edit/page.jsx` - หน้าแก้ไขโปรไฟล์ (ใช้งานจริง)
3. `frontend/.env.local` - Environment variables
4. `backend/.env` - Environment variables
5. `INTEGRATION_GUIDE.md` - คู่มือเชื่อมต่อระบบ
6. `SETUP.md` - คู่มือนี้

### ไฟล์ที่แก้ไข
1. `frontend/app/layout.jsx` - เพิ่ม AuthProvider
2. `frontend/app/u/[username]/page.jsx` - ปรับ data types ให้ตรงกับ backend
3. `frontend/components/Navbar.jsx` - เพิ่ม dynamic menu ตาม login status

### ไฟล์ที่สำรองไว้
1. `frontend/app/edit/page.jsx.backup` - Test page เดิม (สำรอง)

## 🔑 Features ที่ใช้งานได้

### Authentication (✅ พร้อมใช้)
- สมัครสมาชิก
- Login/Logout
- JWT token authentication
- Protected routes

### Profile Management (✅ พร้อมใช้)
- สร้าง/แก้ไขโปรไฟล์
- ข้อมูลพื้นฐาน (ชื่อ, รูป, bio, slug)
- ตั้งค่าธีมสี (primary, accent, background)
- จัดการ blocks (text, link, image, video)
- Public/Private profile

### Pages
- `/` - หน้าแรก
- `/login` - Login
- `/register` - สมัครสมาชิก
- `/edit` - แก้ไขโปรไฟล์ (ต้อง login)
- `/u/[username]` - โปรไฟล์สาธารณะ
- `/test` - Test page (เก็บไว้สำหรับ dev)

## 🎨 Data Structure

### Profile Model (Backend)
```javascript
{
  userId: ObjectId,
  username: String,        // จาก User
  slug: String,           // Custom URL (optional)
  displayName: String,    // ชื่อแสดง
  avatarUrl: String,      // URL รูปโปรไฟล์
  bio: String,           // คำอธิบาย
  theme: {
    mode: "dark",
    primary: "#7c3aed",
    accent: "#22d3ee",
    background: "#0b1020",
    borderRadius: "12px"
  },
  blocks: [{
    id: String,          // UUID
    type: String,        // "text", "link", "image", "video"
    props: Object        // ตาม type
  }],
  isPublic: Boolean
}
```

## 🔧 Troubleshooting

### MongoDB ไม่รัน
```bash
# macOS - Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

### Port ถูกใช้แล้ว
```bash
# เช็ค port 5001
lsof -i :5001

# Kill process
kill -9 <PID>
```

### ล้าง cache
```bash
# Frontend
cd frontend
rm -rf .next node_modules
npm install

# Backend
cd backend
rm -rf node_modules
npm install
```

## 📞 Next Steps

อ่านเพิ่มเติมใน:
- `INTEGRATION_GUIDE.md` - รายละเอียดการเชื่อมต่อ
- `README.md` - ภาพรวมโปรเจค

---

✨ **พร้อมใช้งาน!** Frontend และ Backend เชื่อมต่อกันเรียบร้อย
