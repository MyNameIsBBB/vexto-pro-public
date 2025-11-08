# SCB QR Payment API Integration

## Overview

อัปเดตระบบชำระเงินของ Vexto ให้ใช้ **SCB QR Payment API** แบบ official แทนการสร้าง PromptPay QR เอง

## API Changes

### 1. QR Code Creation

**Endpoint**: `POST /api/payment/create`

**SCB API Used**: `/partners/sandbox/v1/payment/qrcode/create`

**Request to SCB**:

```json
{
    "qrType": "PP",
    "ppType": "BILLERID",
    "ppId": "0984979878",
    "amount": "99",
    "ref1": "u:userId;t:pro;i:-",
    "ref2": "paymentId",
    "ref3": "VEXTO1234567890"
}
```

**Response from Backend**:

```json
{
    "paymentId": "1731052800000-userId",
    "billerId": "VEXTO0000000000",
    "ref1": "u:userId;t:pro;i:-",
    "ref2": "1731052800000-userId",
    "amount": 99,
    "qr_image_base64": "iVBORw0KGgoAAAANSUhEUgAA...",
    "qr_raw_data": "00020101021230818...",
    "expires_at": "2024-01-01T12:15:00.000Z",
    "scb_transaction_id": "SCB123456789"
}
```

### 2. Payment Verification

**Endpoint**: `POST /api/payment/verify`

**SCB API Used**: `/partners/sandbox/v1/payment/billpayment/inquiry`

**Request to Backend**:

```json
{
    "billerId": "VEXTO1234567890",
    "paymentId": "1731052800000-userId",
    "transactionId": "optional-ref-from-slip"
}
```

**Request to SCB**:

```json
{
    "billerId": "VEXTO1234567890",
    "transactionId": "optional-ref-from-slip"
}
```

**Response from Backend** (Success):

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
        "billerId": "VEXTO1234567890",
        "amount": "99.00",
        "paidAmount": "99.00",
        "paymentStatus": "PAID",
        "paymentDate": "2024-01-01T10:30:00Z",
        "ref1": "u:userId;t:pro;i:-",
        "ref2": "1731052800000-userId",
        "ref3": "VEXTO1234567890"
    }
}
```

## Environment Variables

### Required

```bash
# SCB API Credentials
SCB_API_KEY=l73dda1f1b2a35408f8d2d6904b78d21db
SCB_CLIENT_SECRET=aabf0dc96e584176b1480bd6447600d9

# PromptPay ID (for QR generation)
PROMPTPAY_ID=0984979878
```

## Key Features

### 1. **Automatic Payment Detection**

-   ใช้ `billerId` (VEXTO + paymentId) เป็น unique identifier
-   SCB API จะตรวจสอบการชำระเงินอัตโนมัติ
-   ไม่จำเป็นต้องกรอก Transaction ID จากสลิป

### 2. **Official SCB QR Codes**

-   QR Code สร้างโดย SCB API โดยตรง
-   รองรับ PromptPay standard
-   มี QR Image (base64) และ Raw Data

### 3. **Payment Status Tracking**

-   `paymentStatus`: "PENDING", "PAID", "EXPIRED", "CANCELLED"
-   `paidAmount`: จำนวนเงินที่ชำระจริง
-   `paymentDate`: วันที่ชำระเงิน

### 4. **Flexible Verification**

-   ตรวจสอบด้วย `billerId` อย่างเดียว
-   หรือใช้ `transactionId` เพิ่มเติม (optional)
-   Real-time inquiry ผ่าน SCB API

## Headers Required

```javascript
{
  "Content-Type": "application/json",
  "authorization": "Bearer {SCB_API_KEY}",
  "accept-language": "EN",
  "requestUId": "{timestamp}-{randomId}"
}
```

## Error Handling

### SCB API Errors

```json
{
    "status": {
        "code": "1001",
        "description": "Invalid request format"
    }
}
```

### Success Response

```json
{
  "status": {
    "code": "1000",
    "description": "Success"
  },
  "data": { ... }
}
```

## Testing

### 1. Create QR Code

```bash
curl -X POST http://localhost:5001/api/payment/create \
  -H "Authorization: Bearer JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount": 1, "grantType": "pro"}'
```

### 2. Verify Payment

```bash
curl -X POST http://localhost:5001/api/payment/verify \
  -H "Authorization: Bearer JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "billerId": "VEXTO1234567890",
    "paymentId": "1731052800000-userId"
  }'
```

## Benefits

### ✅ **Advantages**

-   **Official API**: ใช้ SCB API จริง ไม่ต้องพึ่งพา third-party
-   **Real-time**: ตรวจสอบการชำระเงินได้ทันที
-   **No Manual Input**: ไม่ต้องกรอก Transaction ID
-   **Reliable**: ข้อมูลจาก SCB โดยตรง
-   **Flexible**: รองรับหลายวิธีการตรวจสอบ

### 📝 **Next Steps**

1. ทดสอบกับ SCB Sandbox Environment
2. ตรวจสอบ API Rate Limits
3. เพิ่ม Webhook สำหรับ real-time notifications (ถ้า SCB รองรับ)
4. เพิ่ม Payment History logging
5. Switch to Production API เมื่อพร้อม

## Files Modified

### Backend

-   `backend/src/routes/payment.js` - SCB API integration
-   `backend/.env.example` - SCB credentials

### Frontend

-   `frontend/app/pay/page.jsx` - Updated verification flow
-   `frontend/components/QrPayModal.jsx` - Optional transaction ID input

ระบบพร้อมใช้งานกับ SCB Official API! 🚀
