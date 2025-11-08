## Setting up SCB (Siam Commercial Bank) Partners API for Payment Verification

## Prerequisites

คุณต้องมีบัญชีผู้ใช้งาน SCB Developer (Partners) และลงทะเบียนแอปพลิเคชันเพื่อเข้าถึง Slip Verification API

## Steps to Get SCB Credentials

### 1. สมัครใช้งาน SCB Developer Portal

1. ไปที่ https://developer.scb/ หรือ https://partners.scb/
2. สมัครสมาชิกและยืนยันอีเมล

### 2. สร้าง Application / ลงทะเบียนบริการ

1. สร้างแอปพลิเคชันใหม่ใน Dashboard
2. เลือก API ที่ต้องการ: **Payment / Bill Payment / Slip Verification** (ชื่อ API อาจต่างตาม portal)
3. กรอกข้อมูลแอปพลิเคชันและ callback URL ตามที่ต้องการ

### 3. รับ API Credentials

หลังจากสร้างแอป คุณจะได้ค่าที่สำคัญ เช่น:

-   **Client ID**
-   **Client Secret**
-   **API Key / Access Token** (ขึ้นกับวิธีการที่ SCB ให้ใช้)

เก็บข้อมูลเหล่านี้ไว้อย่างปลอดภัยและอย่า commit ลงใน repo

### 4. สร้าง Access Token (Production / OAuth flow)

SCB Partners อาจต้องให้สร้าง access token ด้วย client credentials

```bash
curl -X POST https://api.partners.scb/partners/oauth/token \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "grant_type=client_credentials" \
    -d "client_id=YOUR_CLIENT_ID" \
    -d "client_secret=YOUR_CLIENT_SECRET"
```

Response ตัวอย่าง:

```json
{
    "access_token": "eyJhbGciOi...",
    "token_type": "Bearer",
    "expires_in": 3600
}
```

### 5. ตั้งค่า Environment Variables

เพิ่มใน `backend/.env`:

```bash
# SCB Partners API
SCB_API_KEY=your-scb-api-key-or-access-token
SCB_CLIENT_ID=your-scb-client-id
SCB_CLIENT_SECRET=your-scb-client-secret
```

## Testing with Sandbox

SCB มี sandbox / partners environment สำหรับทดสอบ (URL ของ sandbox จะขึ้นกับเอกสารของ SCB)

ตัวอย่างการเรียกทดสอบ:

```bash
curl -X POST http://localhost:5001/api/payment/verify \
    -H "Authorization: Bearer YOUR_JWT_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "paymentId": "1234567890-userId",
        "transactionId": "TEST001",
        "amount": 99
    }'
```

## API Documentation (ตัวอย่าง)

### Slip Verification Endpoint

#### POST /v1/payment/billpayment/transactions

**Request:**

```json
{
    "transactionId": "ABC123456789",
    "amount": 99.0
}
```

**Response (ตัวอย่าง Success):**

```json
{
    "status": "success",
    "data": {
        "transactionId": "ABC123456789",
        "amount": 99.0,
        "transactionDate": "2024-01-01T10:30:00Z",
        "senderAccount": "xxx-x-xxxxx-x",
        "receiverAccount": "xxx-x-xxxxx-x"
    }
}
```

## Troubleshooting & Tips

-   ตรวจสอบว่าใช้ `SCB_API_KEY` หรือ access token ที่ยังไม่หมดอายุ
-   หากใช้ client credentials ให้สร้าง token ก่อนแล้วส่งใน header `Authorization: Bearer {token}`
-   SCB ใช้ header `resourceOwnerId` สำหรับระบุ client id ในบาง endpoint (ดูเอกสาร SCB)

## Support

-   SCB Developer Portal / Partners: https://developer.scb/ or https://partners.scb/
-   หากต้องการความช่วยเหลือ ให้ติดต่อทีม support ของ SCB
