# Payment System Documentation

## Overview

Vexto ใช้ระบบชำระเงินผ่าน **PromptPay QR Code** พร้อมกับ **SCB (Siam Commercial Bank) Partners API** สำหรับการยืนยันการชำระเงิน

## Architecture

### Flow การชำระเงิน

1. **ผู้ใช้กดชำระเงิน** → Frontend เรียก `POST /api/payment/create`
2. **Backend สร้าง QR Code** → ใช้ `promptpay-qr` และ `qrcode` library
3. **ผู้ใช้สแกน QR และโอนเงิน** → ผ่านแอพธนาคารใดก็ได้
4. **ผู้ใช้กรอกหมายเลขอ้างอิงจากสลิป** → Transaction ID
5. **Frontend ยืนยันการชำระ** → เรียก `POST /api/payment/verify`
6. **Backend ตรวจสอบกับ SCB Partners API** → ยืนยันว่าจ่ายเงินจริง
7. **Grant สิทธิ์** → อัพเดท User (isPro หรือ purchasedItems)

## API Endpoints

### POST /api/payment/create

สร้าง PromptPay QR Code สำหรับชำระเงิน

**Request Body:**

```json
{
    "amount": 99,
    "grantType": "pro", // หรือ "item"
    "itemId": "glow-frame" // ถ้า grantType เป็น "item"
}
```

**Response:**

```json
{
    "paymentId": "1234567890-userId",
    "ref": "u:userId;t:pro;i:-;id:1234567890-userId",
    "amount": 99,
    "qr_image_base64": "base64_string...",
    "qr_data_url": "data:image/png;base64,...",
    "expires_at": "2024-01-01T12:15:00.000Z"
}
```

### POST /api/payment/verify

ยืนยันการชำระเงินผ่าน SCB Partners Slip Verification API

**Request Body:**

```json
{
    "paymentId": "1234567890-userId",
    "transactionId": "ABC123456789",
    "amount": 99
}
```

**Response (Success):**

```json
{
    "ok": true,
    "verified": true,
    "granted": {
        "userId": "userId",
        "type": "pro",
        "item": null
    },
    "transaction": {
        "status": "success"
    }
}
```

## Environment Variables

### Backend (.env)

```bash
# PromptPay Payment System
PROMPTPAY_ID=0984979878  # เบอร์โทรหรือ Tax ID

# SCB Partners API (Slip Verify)
SCB_API_KEY=your-scb-api-key
SCB_CLIENT_ID=your-scb-client-id
SCB_CLIENT_SECRET=your-scb-client-secret
```

## Dependencies

### Backend

-   `promptpay-qr` - สร้าง PromptPay QR payload
-   `qrcode` - แปลง payload เป็นรูป QR Code (base64)

### Frontend

-   Next.js 14 App Router
-   React Hooks (useState, useEffect)

## Files Modified

### Backend

-   `backend/src/routes/payment.js` - Payment route handlers
-   `backend/.env.example` - Environment variables template

### Frontend

-   `frontend/app/pay/page.jsx` - Payment page
-   `frontend/components/QrPayModal.jsx` - QR code modal with slip verification

## Testing

### 1. สร้าง QR Code

```bash
curl -X POST http://localhost:5001/api/payment/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount": 99, "grantType": "pro"}'
```

### 2. ยืนยันการชำระเงิน

```bash
curl -X POST http://localhost:5001/api/payment/verify \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentId": "PAYMENT_ID_FROM_CREATE",
    "transactionId": "TRANSACTION_ID_FROM_SLIP",
    "amount": 99
  }'
```

## SCB Partners API Integration

### Sandbox URL

```
https://api.partners.scb/partners/sandbox/v1/payment/billpayment/transactions
```

### Production URL (เมื่อ go live)

```
https://api.partners.scb/partners/v1/payment/billpayment/transactions
```

### Headers Required (ตัวอย่าง)

```
Content-Type: application/json
authorization: Bearer {SCB_API_KEY}
resourceOwnerId: {SCB_CLIENT_ID}
```

## Security Considerations

1. **JWT Authentication** - ทุก endpoint ต้องผ่าน auth middleware
2. **User Verification** - ตรวจสอบว่า userId ใน paymentId ตรงกับผู้ request
3. **Amount Validation** - ตรวจสอบจำนวนเงินที่ส่งมา
4. **Transaction ID** - ยืนยันกับ KBank API เท่านั้น ไม่รับค่าเปล่า ๆ

## Future Improvements

1. **Payment History** - เก็บประวัติการชำระเงินใน MongoDB
2. **Webhook** - รับ notification จาก SCB เมื่อมีการโอนเงิน
3. **Refund System** - ระบบคืนเงิน
4. **Receipt Generation** - สร้างใบเสร็จอัตโนมัติ
5. **Multiple Payment Methods** - รองรับวิธีชำระเงินอื่น ๆ

## Migration from TMWEASY

**สิ่งที่เปลี่ยนแปลง:**

-   ❌ ลบ TMWEASY API ทั้งหมด
-   ✅ ใช้ PromptPay QR generation โดยตรง
-   ✅ ใช้ SCB Partners API สำหรับยืนยัน
-   ✅ ง่ายกว่า, เสถียรกว่า, และเป็นทางการกว่า

**API Endpoint Changes:**

-   `/payment/session` → `/payment/create`
-   `/payment/confirm` → `/payment/verify`

**Environment Variables Changes:**

-   ลบ: `TMW_USER`, `TMW_PASSWORD`, `TMW_CON_ID`, `TMW_PROMPTPAY_ID`, `TMW_TYPE`, `TMW_ACCODE`, `TMW_ACCOUNT_NO`
-   เพิ่ม: `PROMPTPAY_ID`, `SCB_API_KEY`, `SCB_CLIENT_ID`, `SCB_CLIENT_SECRET`
