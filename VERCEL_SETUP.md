# ขั้นตอนตั้งค่า Vercel Environment Variables

## 1. เข้า Vercel Dashboard

-   ไป: https://vercel.com/dashboard
-   เลือก project: **vexto.pro**

## 2. ตั้งค่า Environment Variables

-   คลิก: **Settings** → **Environment Variables**
-   คลิก: **Add New**

### Variable ที่ต้องเพิ่ม:

#### 1. NEXT_PUBLIC_API_BASE_URL

```
Name: NEXT_PUBLIC_API_BASE_URL
Value: https://api.vexto.pro/api
Environment: Production (เลือก)
```

#### 2. NEXT_PUBLIC_GOOGLE_CLIENT_ID

```
Name: NEXT_PUBLIC_GOOGLE_CLIENT_ID
Value: 305368722326-9sa333ctpovhdk4h2npat5uk50psv8oe.apps.googleusercontent.com
Environment: Production (เลือก)
```

## 3. Redeploy

-   ไป: **Deployments** tab
-   คลิกจุด 3 จุด (...) ที่ deployment ล่าสุด
-   เลือก: **Redeploy**
-   รอ deploy เสร็จ (~2-3 นาที)

## 4. ทดสอบ

-   เปิด https://vexto.pro/login
-   ทดสอบ Discord และ Google OAuth
-   ควรจะไม่ขึ้น "OAuth not configured" อีกแล้ว

## 5. อัพเดท OAuth Redirect URLs (ถ้ายังไม่ได้ทำ)

### Discord

-   ไป: https://discord.com/developers/applications/1435829670275710976/oauth2
-   เพิ่ม Redirect: `https://vexto.pro/auth/discord/callback`

### Google

-   ไป: https://console.cloud.google.com/apis/credentials
-   เลือก Client ID: `305368722326-9sa333ctpovhdk4h2npat5uk50psv8oe`
-   เพิ่ม Authorized redirect URI: `https://vexto.pro/auth/google/callback`

---

## สรุป

✅ Backend SSL ใช้งานได้แล้ว (api.vexto.pro)  
⏳ ตั้งค่า Vercel env variables  
⏳ อัพเดท OAuth redirect URLs  
⏳ Redeploy และทดสอบ
