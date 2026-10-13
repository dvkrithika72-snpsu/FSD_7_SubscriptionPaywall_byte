# APTIVELLA — Premium Skill-Development SaaS Platform

APTIVELLA is a modern skill-development SaaS platform architected for developer learning, structured roadmaps, expert mentorship, and verified credentials. It features an obsidian and gold design system, secure JWT authentication with password hashing, MongoDB database persistence, and end-to-end Razorpay test-mode subscription payment processing with cryptographic HMAC SHA256 signature verification.

---

## 🏗️ Architecture & Project Structure

The project is structured with strict separation of concerns between client and server:

```text
Aptivella/
├── backend/                             # Express REST API (Node.js)
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                    # MongoDB connection (Mongoose + in-memory fallback)
│   │   │   ├── env.js                   # Central environment variable loader
│   │   │   └── plans.js                 # Server-authoritative subscription plan definitions
│   │   ├── controllers/
│   │   │   ├── authController.js        # Registration, login, profile (/me)
│   │   │   └── paymentController.js     # Create order, verify signature, webhooks, test simulation
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js        # JWT authentication & requirePro entitlement checks
│   │   │   └── validation.js            # Input validation schemas
│   │   ├── models/
│   │   │   ├── User.js                  # User schema with subscription status ('free' | 'pro')
│   │   │   ├── Payment.js               # Payment audit ledger & order reconciliation records
│   │   │   └── WebhookEvent.js          # Webhook event log for strict idempotency enforcement
│   │   ├── routes/
│   │   │   ├── healthRoutes.js          # GET /api/health
│   │   │   ├── authRoutes.js            # POST /api/auth/register, login, me, verify-access
│   │   │   ├── paymentRoutes.js         # /api/payment/config, create-order, verify, webhook
│   │   │   └── premiumRoutes.js         # /api/premium/* (Protected pro-only routes)
│   │   ├── services/
│   │   │   └── razorpayService.js       # Razorpay SDK client, HMAC verification, webhook verification
│   │   ├── app.js                       # Express setup, raw-body buffer capture for webhooks
│   │   └── server.js                    # HTTP server entry point & graceful shutdown
│   ├── test-payment-api.js              # Automated integration tests for Razorpay payment API (49 tests)
│   ├── test-auth-api.js                 # Automated tests for auth and entitlements (27 tests)
│   ├── .env                             # Local backend environment variables (gitignored)
│   ├── .env.example                     # Environment template with placeholders
│   └── package.json                     # Express, Mongoose, Razorpay, JsonWebToken, Bcrypt
│
├── frontend/                            # React SPA (Vite)
│   ├── src/
│   │   ├── components/                  # Modular UI components
│   │   │   ├── Navbar.jsx               # Header with user avatar, Pro badge, live API health
│   │   │   ├── Hero.jsx                 # Hero section & CTA
│   │   │   ├── CourseCatalogue.jsx      # Course grid with free vs pro badge indicators
│   │   │   ├── CourseDetails.jsx        # Syllabus, curriculum, locked pro modules
│   │   │   ├── StudentDashboard.jsx     # Learning stats, projects, enrolled courses, pro badge
│   │   │   ├── PricingModal.jsx         # Monthly/Quarterly/Yearly plans, Razorpay test checkout
│   │   │   ├── AuthModal.jsx            # Tabbed Login & Registration modal
│   │   │   ├── HealthModal.jsx          # Live API health & latency diagnostics
│   │   │   └── Footer.jsx               # Footer
│   │   ├── services/
│   │   │   └── api.js                   # Client API methods (auth, payments, premium content)
│   │   ├── App.jsx                      # Root container, router state, auth & payment callbacks
│   │   └── index.css                    # Obsidian & gold design system (Vanilla CSS)
│   ├── .env                             # Local frontend environment variables
│   ├── .env.example                     # Frontend template placeholders
│   └── package.json                     # React, Vite
│
├── package.json                         # Root runner scripts
└── README.md                            # Complete setup and security documentation
```

---

## 💳 Razorpay Test-Mode Integration (Phase 3B)

APTIVELLA integrates **Razorpay in test mode only**. Live transactions and real payment credentials are strictly disallowed.

### 1. Subscription Plans & Server Authority
All prices are calculated and enforced exclusively by the backend in `backend/src/config/plans.js`. Any client-supplied amount is ignored to eliminate price tampering:

| Plan Identifier | Display Name | Duration | Price (INR) | Price (Paise) | Discount |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `monthly` | Monthly Pro | 30 days | ₹399 | 39,900 paise | Standard |
| `quarterly` | Quarterly Pro | 90 days | ₹999 | 99,900 paise | Save 17% (Most Popular) |
| `yearly` | Yearly Pro | 365 days | ₹2,999 | 299,900 paise | Save 40% (Best Value) |

### 2. Security & Anti-Fraud Guarantees
- **No Client Privilege Escalation**: Frontend callbacks, redirects, or browser success messages **never** alter the database subscription status.
- **Cryptographic Signature Verification**: The backend verifies Razorpay payment signatures using HMAC SHA256 (`crypto.createHmac('sha256', secret).update(order_id + '|' + payment_id).digest('hex')`) with `crypto.timingSafeEqual` to prevent timing attacks.
- **Reconciliation & Audit Trail**: Every checkout order and payment ID is recorded in MongoDB (`Payment` collection) with `orderId`, `paymentId`, `amount`, `status`, and `expiresAt`. Orders cannot be claimed across different user accounts.
- **Protected Premium Routes**: Premium endpoints (`/api/premium/verify-entitlement`, `/api/premium/courses/:courseId/content`, `/api/premium/resources`) query the user's active subscription status in MongoDB via `requirePro` middleware. Free users are blocked with `403 Forbidden`.

### 3. Webhook Architecture & Idempotency
- **Endpoint**: `POST /api/payment/webhook`
- **Raw-Body Verification**: The raw request body buffer is captured during JSON parsing (`express.json({ verify: (req, res, buf) => { req.rawBody = buf; } })`) so HMAC SHA256 signature verification matches `x-razorpay-signature` exactly.
- **Payload Validation**: Webhook payloads for `payment.captured` and `order.paid` are checked against stored order amounts. Tampered amounts are rejected.
- **Idempotency**: Webhook events are logged in the `WebhookEvent` MongoDB collection. Duplicate deliveries return `200 OK` without double-crediting access.

---

## ⚙️ Environment Configuration

Store Razorpay credentials and webhook secrets **only in `backend/.env`**. Never expose secrets in frontend environment variables or commit them to Git.

### Backend (`backend/.env`)
```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database & Authentication
MONGODB_URI=mongodb://localhost:27017/aptivella
JWT_SECRET=aptivella_jwt_secret_dev_key_2026

# Razorpay Test Mode Credentials (NEVER USE LIVE KEYS)
RAZORPAY_KEY_ID=rzp_test_aptivella_dev_key
RAZORPAY_KEY_SECRET=aptivella_secret_test_key_secure_2026
RAZORPAY_WEBHOOK_SECRET=aptivella_webhook_secret_dev_2026
```

### Template (`backend/.env.example`)
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/aptivella
JWT_SECRET=your_jwt_secret_here
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_secret_here
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🚀 Running the Platform

### Terminal 1 — Start the Backend API:
```bash
cd backend
npm run dev
# Or: node src/server.js
```
- Server running at `http://localhost:5000`
- If a local MongoDB instance is not available, the backend automatically provisions an in-memory MongoDB replica for seamless development.

### Terminal 2 — Start the Frontend Dev Server:
```bash
cd frontend
npm run dev
```
- Vite dev server running at `http://localhost:5173`

---

## 🧪 Automated Testing

The platform includes comprehensive automated test suites covering authentication, access control, Razorpay payment flows, signature tampering, and webhook security.

### Run Payment Test Suite (49 tests):
```bash
node backend/test-payment-api.js
```
Covers:
1. Public payment config endpoint (ensures zero secrets leaked).
2. Order creation access control (401 for unauthenticated requests).
3. Server-authoritative plan calculation & client amount tampering rejection.
4. Parameter validation for payment verification.
5. Cryptographic HMAC SHA256 signature tampering detection (rejection with 400).
6. Cross-account order claim prevention (rejection with 403).
7. Verified payment signature processing & MongoDB subscription activation.
8. Payment replay idempotency (duplicate verification requests handled safely).
9. Protected premium route middleware (`/api/premium/*` blocks free, permits pro).
10. Webhook signature verification and forged signature rejection.
11. Webhook payload amount tampering rejection.
12. Webhook idempotent event processing (duplicate event delivery skipped).
13. Developer sandbox test payment simulation & verified upgrade pipeline.

### Run Auth & Health Test Suite (27 tests):
```bash
node backend/test-auth-api.js
```
Covers:
1. `/api/health` system diagnostics.
2. Input validation on registration and login.
3. Password hashing via bcrypt and normalized email uniqueness.
4. JWT token generation and validation.
5. Client privilege escalation prevention (defaulting to free plan).
6. Course access entitlement checks.

**Total automated tests passing:** **76 / 76**

---

## 🌐 Razorpay Webhook Configuration & Local Testing

### Setting Up Webhooks in Razorpay Dashboard
1. Log into your [Razorpay Dashboard](https://dashboard.razorpay.com/) and switch to **Test Mode**.
2. Navigate to **Settings** > **Webhooks** > **Add New Webhook**.
3. Set the **Webhook URL**:
   - Production: `https://your-domain.com/api/payment/webhook`
   - Local testing: Use a tunnel URL such as `https://<tunnel-id>.ngrok-free.app/api/payment/webhook`
4. Set the **Secret**: Value matching `RAZORPAY_WEBHOOK_SECRET` in `backend/.env`.
5. Select the following **Active Events**:
   - `payment.captured`
   - `order.paid`
6. Click **Save**.

### Local Webhook Testing via Tunnel
To forward real webhook events to your local machine:
```bash
# Using ngrok
ngrok http 5000

# Copy the forwarded URL and register in Razorpay Test Webhook settings:
# https://xxxx.ngrok-free.app/api/payment/webhook
```

### Local Webhook Testing via cURL
You can also simulate a signed webhook event locally using Node:
```bash
node -e "
const crypto = require('crypto');
const secret = 'aptivella_webhook_secret_dev_2026';
const payload = JSON.stringify({
  event: 'payment.captured',
  payload: {
    payment: {
      entity: {
        id: 'pay_test_local_123',
        order_id: '<ORDER_ID>',
        amount: 99900,
        status: 'captured'
      }
    }
  }
});
const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex');
fetch('http://localhost:5000/api/payment/webhook', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'x-razorpay-signature': sig },
  body: payload
}).then(r => r.json()).then(console.log);
"
```

---

## 🚢 Deployment Requirements

1. **Node.js Environment**: Node.js 18+ LTS.
2. **MongoDB**: A production MongoDB replica set or MongoDB Atlas URI (`MONGODB_URI`).
3. **Environment Secrets**: Configure environment variables securely in your hosting platform (Render, Railway, Fly.io, AWS, Vercel). Never commit `.env`.
4. **CORS Configuration**: Set `CLIENT_URL` to your production frontend domain (e.g. `https://aptivella.io`).
5. **HTTPS Enforcement**: Razorpay Checkout and webhooks require HTTPS in production.
6. **Webhook Endpoint URL**: Ensure `/api/payment/webhook` is reachable from Razorpay servers and not blocked by restrictive firewalls or CSRF middleware.
