## 🚀 Quick Deploy to Vercel

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Deploy

```bash
vercel
```

### 3. Set Environment Variables

Go to Vercel Dashboard → Settings → Environment Variables and add:

**Required:**

-   `NEXT_PUBLIC_API_BASE_URL` = `https://your-project.vercel.app/api`
-   `MONGODB_URI` = Your MongoDB Atlas connection string
-   `JWT_SECRET` = Random secret key (32+ characters)
-   `TMW_USER` = Your TMWEASY username
-   `TMW_PASSWORD` = Your TMWEASY password
-   `TMW_CON_ID` = Your TMWEASY con_id
-   `TMW_PROMPTPAY_ID` = Your PromptPay number
-   `TMW_TYPE` = `01` (phone) or `03` (e-wallet)

**Optional:**

-   `CORS_ORIGIN` = Your domain (auto-set by Vercel)
-   `ADMIN_EMAILS` = Admin email addresses
-   `TMW_ACCODE` = Bank account code
-   `TMW_ACCOUNT_NO` = Bank account number

### 4. Redeploy

After setting environment variables:

```bash
vercel --prod
```

### Done! 🎉

Your app will be live at: `https://your-project.vercel.app`

---

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)
