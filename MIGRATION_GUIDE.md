# Migration Guide: TMWEASY → PromptPay QR + SCB

## Overview

คู่มือนี้จะแนะนำการอัปเดตจาก TMWEASY API ไปเป็นระบบ PromptPay QR + SCB (Partners API) Slip Verify

## What Changed?

### ✅ New System Benefits

-   ✨ ไม่ต้องพึ่งพา third-party API (TMWEASY)
-   ✨ ใช้ PromptPay standard ที่ทุกธนาคารรองรับ
-   ✨ ยืนยันด้วย KBank API อย่างเป็นทางการ
-   ✨ เสถียรและปลอดภัยกว่า
-   ✨ ไม่มีค่าใช้จ่ายจาก TMWEASY

### ❌ What was Removed

-   TMWEASY API integration
-   Auto-polling payment confirmation
-   ref1 field (replaced with paymentId)

## Step-by-Step Migration

### 1. Update Environment Variables

#### Backend .env

**Before (TMWEASY):**

```bash
TMW_USER=peeratus0912
TMW_PASSWORD=hoZkow-nudwyk-seqwu1
TMW_CON_ID=109165
TMW_PROMPTPAY_ID=0984979878
TMW_TYPE=01
TMW_ACCODE=your-accode
TMW_ACCOUNT_NO=0000000000
```

**After (PromptPay + SCB):**

```bash
# PromptPay Payment System
PROMPTPAY_ID=0984979878

# SCB Partners API (Slip Verify)
SCB_API_KEY=your-scb-api-key
SCB_CLIENT_ID=your-scb-client-id
```

### 2. Install New Dependencies

```bash
cd backend
npm install promptpay-qr qrcode
```

Both packages are already installed in the project.

### 3. API Endpoint Changes

#### Payment Creation

**Before:**

```javascript
POST /api/payment/session
{
  "amount": 99,
  "ref1": "my-reference",
  "grantType": "pro"
}

Response:
{
  "id_pay": "12345",
  "ref1": "u:userId;t:pro;i:-;r:my-reference",
  "amount": 99,
  "qr_image_base64": "...",
  "time_out": 900
}
```

**After:**

```javascript
POST /api/payment/create
{
  "amount": 99,
  "grantType": "pro"
}

Response:
{
  "paymentId": "1234567890-userId",
  "ref": "u:userId;t:pro;i:-;id:1234567890-userId",
  "amount": 99,
  "qr_image_base64": "...",
  "qr_data_url": "data:image/png;base64,...",
  "expires_at": "2024-01-01T12:15:00.000Z"
}
```

#### Payment Verification

**Before:**

```javascript
POST /api/payment/confirm
{
  "id_pay": "12345"
}

Response:
{
  "ok": true,
  "amount": 99,
  "date_pay": "2024-01-01 10:30:00",
  "granted": { ... }
}
```

**After:**

```javascript
POST /api/payment/verify
{
  "paymentId": "1234567890-userId",
  "transactionId": "ABC123456789",
  "amount": 99
}

Response:
{
  "ok": true,
  "verified": true,
  "granted": { ... },
  "transaction": { ... }
}
```

### 4. Frontend Changes

#### QrPayModal Component Props

**Before:**

```jsx
<QrPayModal
    open={modalOpen}
    onClose={() => setModalOpen(false)}
    qrBase64={session?.qr_image_base64}
    amount={session?.amount}
    ref1={session?.ref1}
    timeOut={session?.time_out}
    onConfirm={confirmPayment}
    confirming={confirming}
    status={confirmStatus}
/>
```

**After:**

```jsx
<QrPayModal
    open={modalOpen}
    onClose={() => setModalOpen(false)}
    qrBase64={session?.qr_image_base64}
    amount={session?.amount}
    paymentId={session?.paymentId}
    expiresAt={session?.expires_at}
    onVerify={verifyPayment}
    verifying={verifying}
    status={verifyStatus}
    transactionId={transactionId}
    onTransactionIdChange={setTransactionId}
/>
```

### 5. User Flow Changes

#### Old Flow (TMWEASY)

1. User clicks "Pay" → Create QR with TMWEASY
2. User scans QR and pays
3. User clicks "I paid" → Backend polls TMWEASY
4. If payment found → Grant access

#### New Flow (PromptPay + KBank)

1. User clicks "Pay" → Generate PromptPay QR locally
2. User scans QR and pays (any bank app)
3. User enters Transaction ID from slip
4. User clicks "Verify" → Backend checks with KBank API
5. If valid → Grant access

## Testing the New System

### 1. Start Backend

```bash
cd backend
npm install
npm start
```

### 2. Create Payment

```bash
curl -X POST http://localhost:5001/api/payment/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount": 1, "grantType": "pro"}'
```

### 3. Test with Sandbox

Use KBank Sandbox test transaction IDs:

-   `TEST001` - Success
-   `TEST002` - Success with different amount
-   `FAIL001` - Failed transaction

### 4. Verify Payment

```bash
curl -X POST http://localhost:5001/api/payment/verify \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentId": "PAYMENT_ID_FROM_CREATE_RESPONSE",
    "transactionId": "TEST001",
    "amount": 1
  }'
```

## Rollback Plan (If Needed)

If you need to rollback to TMWEASY:

1. **Revert backend/src/routes/payment.js**

    ```bash
    git checkout HEAD~1 backend/src/routes/payment.js
    ```

2. **Revert environment variables**

    - Restore TMW\_\* variables
    - Remove KBANK_API_KEY

3. **Revert frontend files**

    ```bash
    git checkout HEAD~1 frontend/app/pay/page.jsx
    git checkout HEAD~1 frontend/components/QrPayModal.jsx
    ```

4. **Uninstall new packages** (optional)
    ```bash
    cd backend
    npm uninstall promptpay-qr qrcode
    ```

## Common Issues

### Issue: "Missing KBANK_API_KEY"

**Solution:**

1. Get API key from https://developer.kasikornbank.com/
2. Add to `.env`: `KBANK_API_KEY=your-key`
3. Restart backend

### Issue: "Transaction not found"

**Solution:**

-   For testing, use Sandbox test IDs: `TEST001`, `TEST002`
-   For production, wait 1-2 minutes after payment
-   Check if transaction ID is correct

### Issue: QR Code not displaying

**Solution:**

1. Check PROMPTPAY_ID is valid (10-13 digits)
2. Check browser console for errors
3. Verify qr_image_base64 in response

## Support

If you encounter issues:

1. Check logs in terminal/console
2. Review documentation in `PAYMENT_SYSTEM.md`
3. Check KBank API status: https://developer.kasikornbank.com/status
4. Refer to `KBANK_SETUP.md` for detailed setup

## Completion Checklist

-   [ ] Installed `promptpay-qr` and `qrcode` packages
-   [ ] Updated backend `.env` with PROMPTPAY_ID and KBANK_API_KEY
-   [ ] Removed all TMW\_\* environment variables
-   [ ] Updated `backend/src/routes/payment.js`
-   [ ] Updated `frontend/app/pay/page.jsx`
-   [ ] Updated `frontend/components/QrPayModal.jsx`
-   [ ] Tested QR code generation
-   [ ] Tested payment verification with sandbox
-   [ ] Updated documentation
-   [ ] Committed changes to git
