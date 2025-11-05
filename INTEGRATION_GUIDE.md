# การเชื่อมต่อ Frontend กับ Backend

## สรุปการเปลี่ยนแปลง

### 1. สร้าง Auth Context (`contexts/AuthContext.jsx`)

-   จัดการ state การ login/logout
-   เก็บข้อมูล user และ profile
-   มี functions: `login()`, `register()`, `logout()`, `updateProfile()`, `loadProfile()`
-   ใช้ `localStorage` เก็บ JWT token

### 2. อัพเดท Root Layout (`app/layout.jsx`)

-   เพิ่ม `<AuthProvider>` ครอบ children
-   ทำให้ auth context ใช้ได้ทั้งแอพ

### 3. แก้ไข User Profile Page (`app/u/[username]/page.jsx`)

-   เปลี่ยน API URL ให้ถูกต้อง: `http://localhost:5001/api/profiles/{username}`
-   ใช้ field names ที่ตรงกับ backend:
    -   `profile.displayName` แทน `profile.name`
    -   `profile.avatarUrl` แทน `profile.avatar`
    -   `profile.theme.primary` แทน `profile.themeColor`
    -   ใช้ `block.id` เป็น key แทน index
-   เพิ่ม loading state และ error handling

### 4. สร้างหน้า Edit Profile (`app/edit/page.jsx`)

-   แทนที่ test page ด้วยระบบจริงที่เชื่อม backend
-   มี 3 tabs: ข้อมูลพื้นฐาน, ธีมสี, บล็อกเนื้อหา
-   บันทึกข้อมูลผ่าน `updateProfile()` API
-   มี real-time preview
-   Redirect ไปหน้าโปรไฟล์หลังบันทึก
-   ป้องกันการเข้าถึงถ้าไม่ได้ login

### 5. อัพเดท Navbar (`components/Navbar.jsx`)

-   แสดง menu ตามสถานะ login:
    -   **ไม่ได้ login**: แสดง "ตัวอย่าง", "สร้างโปรไฟล์", "ล็อกอิน", "สมัครฟรี"
    -   **Login แล้ว**: แสดง "ตัวอย่าง", "แก้ไขโปรไฟล์", "โปรไฟล์ของฉัน", "ออกจากระบบ"
-   ใช้ `useAuth()` hook เช็คสถานะ

### 6. สร้างไฟล์ .env.local

-   กำหนด `NEXT_PUBLIC_API_BASE_URL=http://localhost:5001/api`

## Data Types ที่ใช้ (ตรงกับ Backend)

### Profile Schema

```javascript
{
  userId: ObjectId,           // จาก User model
  username: String,           // จาก User.username (ไม่ซ้ำกัน)
  slug: String,              // URL custom (optional)
  displayName: String,       // ชื่อแสดง
  avatarUrl: String,         // URL รูปโปรไฟล์
  bio: String,               // คำอธิบายตัว
  theme: {
    mode: "light" | "dark",
    primary: String,         // สีหลัก (#7c3aed)
    background: String,      // สีพื้นหลังด้านใน (#0b1020)
    outerBackground: String, // สีพื้นหลังด้านนอก (วงแหวนรอบๆ)
    accent: String,          // สีเสริม (#22d3ee)
    borderRadius: String,    // รัศมีมุม (12px)
    backgroundImage: String, // URL รูปพื้นหลัง
    outerBackgroundImage: String, // URL รูปพื้นหลังด้านนอก
    backgroundScope: "card" | "full"
  },
  blocks: [{
    id: String,              // UUID
    type: String,            // "text" | "link" | "image" | "video" | etc.
    props: Object            // properties ตาม type
  }],
  isPublic: Boolean,         // เผยแพร่หรือไม่
  createdAt: Date,
  updatedAt: Date
}
```

### Block Types Examples

```javascript
// Text Block
{ id: "uuid", type: "text", props: { text: "..." } }

// Link Block
{ id: "uuid", type: "link", props: { label: "...", url: "..." } }

// Image Block
{ id: "uuid", type: "image", props: { src: "...", alt: "..." } }

// Video Block
{ id: "uuid", type: "video", props: { url: "..." } }
```

## API Endpoints ที่ใช้

### Auth

-   `POST /api/auth/register` - สมัครสมาชิก
-   `POST /api/auth/login` - เข้าสู่ระบบ
-   `GET /api/auth/discord/start` - เริ่ม OAuth กับ Discord (redirect)
-   `GET /api/auth/discord/callback` - Callback รับโทเค็นจาก Discord แล้วออก JWT (redirect กลับ frontend พร้อม token)

### Profile

-   `GET /api/profiles/me/info` - ดึงข้อมูลโปรไฟล์ของตัวเอง
-   `PUT /api/profiles/me` - อัพเดทโปรไฟล์ของตัวเอง
-   `GET /api/profiles/:handle` - ดึงโปรไฟล์สาธารณะ (username หรือ slug)

## วิธีทดสอบ

### 1. เริ่ม Backend

```bash
cd backend
npm install
# สร้าง .env จาก .env.example และใส่ค่า
npm start
```

### 1.1 ตั้งค่า Discord OAuth (ถ้าต้องการ)

เพิ่มตัวแปรในไฟล์ `.env` ของ Backend:

```
DISCORD_CLIENT_ID=xxxxxxxxxxxxxxx
DISCORD_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
DISCORD_REDIRECT_URI=http://localhost:5001/api/auth/discord/callback
FRONTEND_BASE_URL=http://localhost:3000
# หรือระบุตรง ๆ
# DISCORD_FRONTEND_REDIRECT=http://localhost:3000/auth/discord/callback
```

และใน Frontend (`.env.local`):

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5001/api
```

### 2. เริ่ม Frontend

```bash
cd frontend
npm install
# .env.local ถูกสร้างไว้แล้ว
npm run dev
```

### 3. ทดสอบการทำงาน

1. ไปที่ `http://localhost:3000`
2. คลิก "สมัครฟรี" เพื่อสร้างบัญชี
3. Login เข้าสู่ระบบ
4. คลิก "แก้ไขโปรไฟล์" เพื่อแก้ไขข้อมูล
5. เพิ่ม/แก้ไข blocks ต่างๆ
6. บันทึกและดูผลลัพธ์ที่ `/u/your-username`

## ไฟล์ที่สำคัญ

### Created

-   `frontend/contexts/AuthContext.jsx` - Auth state management
-   `frontend/.env.local` - Environment variables
-   `frontend/app/edit/page.jsx` - Profile editor (new version)
-   `frontend/app/edit/page.jsx.backup` - Old test page backup

### Modified

-   `frontend/app/layout.jsx` - Added AuthProvider
-   `frontend/app/u/[username]/page.jsx` - Fixed data types
-   `frontend/components/Navbar.jsx` - Dynamic menu based on auth

### Unchanged

-   `frontend/app/test/page.jsx` - Keep for testing
-   `frontend/lib/api.js` - Already correct
-   Backend files - All working as expected

## หมายเหตุ

1. **Authentication**: ใช้ JWT token เก็บใน localStorage
2. **Protected Routes**: หน้า `/edit` จะ redirect ไป `/login` ถ้าไม่ได้ login
3. **API Base URL**: อ่านจาก `NEXT_PUBLIC_API_BASE_URL` environment variable
4. **Error Handling**: ทุก API call มี try-catch และแสดง error message
5. **Preview**: หน้า edit มี live preview ด้านขวา
6. **Slug**: สามารถสร้าง custom URL เช่น `/u/my-name` แทน `/u/username123`

## Next Steps (สิ่งที่ควรทำต่อ)

1. เพิ่ม Social Links block type
2. อัพโหลดรูปผ่าน API (ใช้ cloudinary หรือ S3)
3. เพิ่ม drag-and-drop สำหรับจัดเรียง blocks
4. เพิ่ม block templates มากขึ้น
5. เพิ่ม password reset functionality
6. เพิ่ม email verification
7. เพิ่ม analytics/view counter
8. เพิ่ม share buttons
