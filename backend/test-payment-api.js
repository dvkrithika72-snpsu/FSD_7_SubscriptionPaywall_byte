/**
 * APTIVELLA Automated Integration Test Suite: Phase 3B Razorpay Payments
 * Tests:
 * 1. Unauthorized access controls for order creation and verification.
 * 2. Plan identifier validation and server-side price calculation.
 * 3. Client amount tampering rejection.
 * 4. Cryptographic HMAC SHA256 payment signature verification (valid vs invalid/tampered).
 * 5. Database state mutation: Pro subscription activation upon verified payment.
 * 6. Payment replay / duplicate verification idempotency.
 * 7. Webhook signature validation (x-razorpay-signature with raw body).
 * 8. Webhook amount validation and tampered payload rejection.
 * 9. Webhook event processing and idempotency (duplicate events do not re-process).
 * 10. Premium protected routes enforcement (403 for Free, 200 for Pro).
 * 11. Public config endpoint security (no exposed secrets).
 */

import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config();

const API_BASE = 'http://localhost:5000/api';

async function runTests() {
  console.log('===============================================================');
  console.log(' STARTING PHASE 3B: RAZORPAY PAYMENT & SUBSCRIPTION TEST SUITE');
  console.log('===============================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Public Payment Config Endpoint
    // -------------------------------------------------------------------------
    console.log('[1/11] Testing Public Payment Config Endpoint (/api/payment/config)');
    const configRes = await fetch(`${API_BASE}/payment/config`);
    const configData = await configRes.json();
    assert(configRes.status === 200, 'Config endpoint returns 200 OK');
    assert(Boolean(configData.keyId), 'Exposes public Razorpay Key ID');
    assert(!configData.keySecret && !configData.webhookSecret, 'Never exposes server-side secrets');
    assert(Boolean(configData.credentialsStatus), 'Exposes credential configuration status indicator');
    assert(typeof configData.allowTestSimulation === 'boolean', 'Exposes allowTestSimulation flag');
    assert(Boolean(configData.plans?.monthly?.amountPaise === 39900), 'Exposes server-calculated monthly amount (39900 paise)');
    assert(Boolean(configData.plans?.quarterly?.amountPaise === 99900), 'Exposes server-calculated quarterly amount (99900 paise)');
    assert(Boolean(configData.plans?.yearly?.amountPaise === 299900), 'Exposes server-calculated yearly amount (299900 paise)');


    // -------------------------------------------------------------------------
    // SETUP: Register two distinct test users (User A for standard flow, User B for unauthorized cross-account test)
    // -------------------------------------------------------------------------
    const uniqueId = Date.now().toString().slice(-6);
    const userAEmail = `payuser_a_${uniqueId}@aptivella.io`;
    const userBEmail = `payuser_b_${uniqueId}@aptivella.io`;

    const regARes = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Payment User A', email: userAEmail, password: 'password123' }),
    });
    const regAData = await regARes.json();
    const tokenA = regAData.token;
    const userA = regAData.user;

    const regBRes = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Payment User B', email: userBEmail, password: 'password123' }),
    });
    const regBData = await regBRes.json();
    const tokenB = regBData.token;

    assert(Boolean(tokenA && tokenB), 'Setup: Two test users registered and authenticated');
    assert(userA.subscription.status === 'free', 'Setup: User A initially starts with free subscription status');

    // -------------------------------------------------------------------------
    // TEST 2: Order Creation Access Control
    // -------------------------------------------------------------------------
    console.log('\n[2/11] Testing Order Creation Access Control');
    const unauthOrderRes = await fetch(`${API_BASE}/payment/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId: 'quarterly' }),
    });
    assert(unauthOrderRes.status === 401, 'Rejects unauthenticated order creation with 401 Unauthorized');

    // -------------------------------------------------------------------------
    // TEST 3: Order Creation Validation & Price Calculation
    // -------------------------------------------------------------------------
    console.log('\n[3/11] Testing Plan Validation & Backend Price Calculation');
    const invalidPlanRes = await fetch(`${API_BASE}/payment/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenA}` },
      body: JSON.stringify({ planId: 'hacked_lifetime_free' }),
    });
    assert(invalidPlanRes.status === 400, 'Rejects invalid plan ID with 400 Bad Request');

    // Attempt client-side price tampering (e.g. sending amount: 100 instead of 99900)
    const validOrderRes = await fetch(`${API_BASE}/payment/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenA}` },
      body: JSON.stringify({ planId: 'quarterly', amount: 100, currency: 'USD' }),
    });
    const validOrderData = await validOrderRes.json();
    assert(validOrderRes.status === 201, 'Creates order with 201 Created');
    assert(Boolean(validOrderData.orderId), 'Returns Razorpay order ID (e.g. order_test_...)');
    assert(validOrderData.amount === 99900, 'Calculates price strictly on server (99900 paise), ignoring client-supplied amount');
    assert(validOrderData.currency === 'INR', 'Enforces INR currency on server');

    const createdOrderId = validOrderData.orderId;

    // -------------------------------------------------------------------------
    // TEST 4: Payment Verification - Missing or Bad Parameters
    // -------------------------------------------------------------------------
    console.log('\n[4/11] Testing Payment Verification Parameter Validation');
    const missingParamsRes = await fetch(`${API_BASE}/payment/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenA}` },
      body: JSON.stringify({ razorpay_order_id: createdOrderId }),
    });
    assert(missingParamsRes.status === 400, 'Rejects verification with missing parameters with 400 Bad Request');

    // -------------------------------------------------------------------------
    // TEST 5: Payment Verification - Invalid / Tampered Signature
    // -------------------------------------------------------------------------
    console.log('\n[5/11] Testing Cryptographic Signature Tampering Detection');
    const fakePaymentId = `pay_test_${Date.now()}`;
    const forgedSignature = 'f0a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef';

    const tamperedVerifyRes = await fetch(`${API_BASE}/payment/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenA}` },
      body: JSON.stringify({
        razorpay_order_id: createdOrderId,
        razorpay_payment_id: fakePaymentId,
        razorpay_signature: forgedSignature,
      }),
    });
    assert(tamperedVerifyRes.status === 400, 'Rejects forged/invalid signature with 400 Bad Request');
    const tamperedData = await tamperedVerifyRes.json();
    assert(tamperedData.error === 'Invalid Signature', 'Error specifies signature verification failure');

    // Verify user is STILL free in database (Pro not granted!)
    const checkMeRes = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const checkMeData = await checkMeRes.json();
    assert(checkMeData.user.subscription.status === 'free', 'User subscription remains "free" after forged signature attempt');

    // -------------------------------------------------------------------------
    // TEST 6: Payment Verification - Cross-Account Unauthorized Claim
    // -------------------------------------------------------------------------
    console.log('\n[6/11] Testing Cross-Account Order Claim Prevention');
    const secretKey = process.env.RAZORPAY_KEY_SECRET || 'aptivella_rzp_test_secret_key_2026';
    const validSignature = crypto
      .createHmac('sha256', secretKey)
      .update(`${createdOrderId}|${fakePaymentId}`)
      .digest('hex');

    const crossAccountRes = await fetch(`${API_BASE}/payment/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenB}` },
      body: JSON.stringify({
        razorpay_order_id: createdOrderId,
        razorpay_payment_id: fakePaymentId,
        razorpay_signature: validSignature,
      }),
    });
    assert(crossAccountRes.status === 403, 'Rejects attempt by User B to verify User A order with 403 Forbidden');

    // -------------------------------------------------------------------------
    // TEST 7: Payment Verification - Legitimate Verified Payment
    // -------------------------------------------------------------------------
    console.log('\n[7/11] Testing Legitimate Verified Payment Signature');
    const verifiedRes = await fetch(`${API_BASE}/payment/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenA}` },
      body: JSON.stringify({
        razorpay_order_id: createdOrderId,
        razorpay_payment_id: fakePaymentId,
        razorpay_signature: validSignature,
      }),
    });
    const verifiedData = await verifiedRes.json();
    assert(verifiedRes.status === 200, 'Verified payment returns 200 OK');
    assert(verifiedData.ok === true, 'Response indicates ok: true');
    assert(verifiedData.user.subscription.status === 'pro', 'Response reflects upgraded status: "pro"');
    assert(verifiedData.user.subscription.plan === 'quarterly', 'Response reflects plan: "quarterly"');

    // Re-verify directly from database via /api/auth/me
    const verifiedDbRes = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const verifiedDbData = await verifiedDbRes.json();
    assert(verifiedDbData.user.subscription.status === 'pro', 'MongoDB state is updated to Pro subscription');
    assert(Boolean(verifiedDbData.user.subscription.expiresAt), 'MongoDB stores calculated expiration timestamp');
    assert(verifiedDbData.user.subscription.lastPaymentId === fakePaymentId, 'Fix 1: MongoDB persists subscription.lastPaymentId on User');
    assert(verifiedDbData.user.subscription.lastOrderId === createdOrderId, 'Fix 1: MongoDB persists subscription.lastOrderId on User');

    // -------------------------------------------------------------------------
    // TEST 8: Payment Verification Idempotency (Replay Protection)
    // -------------------------------------------------------------------------
    console.log('\n[8/11] Testing Payment Verification Idempotency / Replay Safety');
    const replayRes = await fetch(`${API_BASE}/payment/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenA}` },
      body: JSON.stringify({
        razorpay_order_id: createdOrderId,
        razorpay_payment_id: fakePaymentId,
        razorpay_signature: validSignature,
      }),
    });
    const replayData = await replayRes.json();
    assert(replayRes.status === 200, 'Replay request safely returns 200 OK');
    assert(replayData.isAlreadyProcessed === true, 'Identifies order as already processed without double-crediting');

    // -------------------------------------------------------------------------
    // TEST 9: Protected Premium API Middleware (/api/premium)
    // -------------------------------------------------------------------------
    console.log('\n[9/11] Testing Protected Premium Route Middleware');
    // Free user (User B) attempts to access premium route
    const freeUserPremiumRes = await fetch(`${API_BASE}/premium/verify-entitlement`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    assert(freeUserPremiumRes.status === 403, 'Free user blocked from /api/premium/verify-entitlement with 403 Forbidden');
    const freePremiumData = await freeUserPremiumRes.json();
    assert(freePremiumData.requiresUpgrade === true, 'Free user response indicates requiresUpgrade: true');

    // Pro user (User A) accesses premium route
    const proUserPremiumRes = await fetch(`${API_BASE}/premium/verify-entitlement`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    assert(proUserPremiumRes.status === 200, 'Pro user successfully accesses /api/premium/verify-entitlement with 200 OK');
    const proPremiumData = await proUserPremiumRes.json();
    assert(proPremiumData.entitled === true, 'Pro user response confirms entitled: true');

    // Pro user accesses premium course content
    const proCourseContentRes = await fetch(`${API_BASE}/premium/courses/react-for-beginners/content`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    assert(proCourseContentRes.status === 200, 'Pro user accesses /api/premium/courses/:id/content with 200 OK');

    // Pro user accesses premium resources
    const proResourcesRes = await fetch(`${API_BASE}/premium/resources`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    assert(proResourcesRes.status === 200, 'Pro user accesses /api/premium/resources with 200 OK');

    // Course access verification reflects Pro status
    const courseAccessRes = await fetch(`${API_BASE}/auth/verify-access/fullstack-mern-mastery`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const courseAccessData = await courseAccessRes.json();
    assert(courseAccessData.accessible === true, 'Pro user has backend-verified access to Pro courses');

    // -------------------------------------------------------------------------
    // TEST 10: Razorpay Webhook Signature Verification
    // -------------------------------------------------------------------------
    console.log('\n[10/11] Testing Webhook Signature Verification & Payload Security');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'aptivella_rzp_webhook_secret_2026';

    // Create a new order for User B to test webhook activation
    const orderBRes = await fetch(`${API_BASE}/payment/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenB}` },
      body: JSON.stringify({ planId: 'monthly' }),
    });
    const orderBData = await orderBRes.json();
    const orderBId = orderBData.orderId;
    const paymentBId = `pay_wh_${Date.now()}`;

    const validWebhookPayload = JSON.stringify({
      entity: 'event',
      account_id: 'acc_aptivella_test',
      event: 'payment.captured',
      contains: ['payment'],
      payload: {
        payment: {
          entity: {
            id: paymentBId,
            entity: 'payment',
            amount: 39900,
            currency: 'INR',
            status: 'captured',
            order_id: orderBId,
          },
        },
      },
      created_at: Math.floor(Date.now() / 1000),
    });

    // 10a. Webhook with missing signature
    const noSigRes = await fetch(`${API_BASE}/payment/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: validWebhookPayload,
    });
    assert(noSigRes.status === 400, 'Rejects webhook with missing signature with 400 Bad Request');

    // 10b. Webhook with forged signature
    const forgedSigRes = await fetch(`${API_BASE}/payment/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-razorpay-signature': 'forged_webhook_signature_1234567890abcdef',
      },
      body: validWebhookPayload,
    });
    assert(forgedSigRes.status === 400, 'Rejects webhook with forged signature with 400 Bad Request');

    // 10c. Webhook with tampered amount in payload
    const tamperedWebhookPayload = JSON.stringify({
      entity: 'event',
      account_id: 'acc_aptivella_test',
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: paymentBId,
            amount: 1000, // Tampered amount (₹10 instead of ₹399)
            currency: 'INR',
            order_id: orderBId,
          },
        },
      },
    });
    const tamperedWebhookSig = crypto
      .createHmac('sha256', webhookSecret)
      .update(tamperedWebhookPayload)
      .digest('hex');

    const tamperedAmountRes = await fetch(`${API_BASE}/payment/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-razorpay-signature': tamperedWebhookSig,
      },
      body: tamperedWebhookPayload,
    });
    assert(tamperedAmountRes.status === 400, 'Rejects webhook with tampered amount mismatch with 400 Bad Request');

    // -------------------------------------------------------------------------
    // TEST 11: Valid Webhook Activation & Idempotency
    // -------------------------------------------------------------------------
    console.log('\n[11/11] Testing Valid Webhook Activation & Idempotent Event Handling');
    const validWebhookSig = crypto
      .createHmac('sha256', webhookSecret)
      .update(validWebhookPayload)
      .digest('hex');

    const eventId = `evt_${Date.now()}`;

    // First webhook call: should activate User B
    const validWebhookRes = await fetch(`${API_BASE}/payment/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-razorpay-signature': validWebhookSig,
        'x-razorpay-event-id': eventId,
      },
      body: validWebhookPayload,
    });
    assert(validWebhookRes.status === 200, 'Valid webhook returns 200 OK');

    // Check User B in database: now Pro!
    const userBDbRes = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    const userBDbData = await userBDbRes.json();
    assert(userBDbData.user.subscription.status === 'pro', 'User B upgraded to Pro via verified webhook');
    assert(userBDbData.user.subscription.plan === 'monthly', 'User B subscription plan is "monthly"');

    // Duplicate webhook call: must be idempotent!
    const duplicateWebhookRes = await fetch(`${API_BASE}/payment/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-razorpay-signature': validWebhookSig,
        'x-razorpay-event-id': eventId,
      },
      body: validWebhookPayload,
    });
    const duplicateData = await duplicateWebhookRes.json();
    assert(duplicateWebhookRes.status === 200, 'Duplicate webhook returns 200 OK');
    assert(duplicateData.message?.includes('idempotent'), 'Duplicate webhook identifies idempotency and skips duplicate execution');

    // -------------------------------------------------------------------------
    // TEST 11B: payment.failed Webhook Handling & Ledger Status Update (Fix 2)
    // -------------------------------------------------------------------------
    console.log('\n[11B] Testing payment.failed Webhook Handling & Ledger Status Update');
    const userFailEmail = `payuser_fail_${uniqueId}@aptivella.io`;
    const regFailRes = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Payment Fail User', email: userFailEmail, password: 'password123' }),
    });
    const { token: tokenFail } = await regFailRes.json();

    // Create an order for userFail
    const orderFailRes = await fetch(`${API_BASE}/payment/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenFail}` },
      body: JSON.stringify({ planId: 'monthly' }),
    });
    const { orderId: orderIdFail } = await orderFailRes.json();

    // Construct payment.failed webhook payload
    const failedPaymentId = `pay_failed_${Date.now()}`;
    const failedWebhookPayload = JSON.stringify({
      event: 'payment.failed',
      created_at: Math.floor(Date.now() / 1000),
      payload: {
        payment: {
          entity: {
            id: failedPaymentId,
            order_id: orderIdFail,
            amount: 39900,
            currency: 'INR',
            status: 'failed',
            error_code: 'BAD_REQUEST_ERROR',
            error_description: 'Payment failed due to customer card decline',
          },
        },
      },
    });

    const failedWebhookSig = crypto
      .createHmac('sha256', webhookSecret)
      .update(failedWebhookPayload)
      .digest('hex');

    const failEventId = `evt_fail_${Date.now()}`;

    // Send payment.failed webhook
    const failWebhookRes = await fetch(`${API_BASE}/payment/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-razorpay-signature': failedWebhookSig,
        'x-razorpay-event-id': failEventId,
      },
      body: failedWebhookPayload,
    });
    assert(failWebhookRes.status === 200, 'payment.failed webhook returns 200 OK');

    // Verify user is NOT upgraded and remains free
    const userFailDbRes = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${tokenFail}` },
    });
    const userFailDbData = await userFailDbRes.json();
    assert(userFailDbData.user.subscription.status === 'free', 'Fix 2: User remains on free plan after payment.failed webhook');

    // Duplicate payment.failed webhook: must be idempotent
    const duplicateFailRes = await fetch(`${API_BASE}/payment/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-razorpay-signature': failedWebhookSig,
        'x-razorpay-event-id': failEventId,
      },
      body: failedWebhookPayload,
    });
    const dupFailData = await duplicateFailRes.json();
    assert(duplicateFailRes.status === 200, 'Duplicate payment.failed webhook returns 200 OK');
    assert(dupFailData.message?.includes('idempotent'), 'Duplicate payment.failed webhook is handled idempotently');

    // Safety check: A payment.failed webhook for an already 'paid' order does NOT overwrite 'paid'
    const alreadyPaidFailPayload = JSON.stringify({
      event: 'payment.failed',
      created_at: Math.floor(Date.now() / 1000),
      payload: {
        payment: {
          entity: {
            id: `pay_late_fail_${Date.now()}`,
            order_id: createdOrderId, // createdOrderId was verified and marked paid in Test 7
            amount: 99900,
            currency: 'INR',
            status: 'failed',
          },
        },
      },
    });
    const lateFailSig = crypto
      .createHmac('sha256', webhookSecret)
      .update(alreadyPaidFailPayload)
      .digest('hex');

    const lateFailRes = await fetch(`${API_BASE}/payment/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-razorpay-signature': lateFailSig,
        'x-razorpay-event-id': `evt_late_${Date.now()}`,
      },
      body: alreadyPaidFailPayload,
    });
    assert(lateFailRes.status === 200, 'Late failure webhook for already-paid order returns 200 OK');

    // Verify User A is still Pro!
    const userAStillProRes = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const userAStillProData = await userAStillProRes.json();
    assert(userAStillProData.user.subscription.status === 'pro', 'Fix 2: Already-paid order is not overwritten to failed status and user remains Pro');

    // -------------------------------------------------------------------------
    // TEST 12: Developer Sandbox Test Simulation Helper
    // -------------------------------------------------------------------------
    console.log('\n[12/12] Testing Sandbox Test Simulation & End-to-End Verification');
    const userCEmail = `payuser_c_${uniqueId}@aptivella.io`;
    const regCRes = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Payment User C', email: userCEmail, password: 'password123' }),
    });
    const { token: tokenC } = await regCRes.json();

    // Create yearly plan order
    const orderCRes = await fetch(`${API_BASE}/payment/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenC}` },
      body: JSON.stringify({ planId: 'yearly' }),
    });
    const { orderId: orderIdC } = await orderCRes.json();

    // Simulate test payment security checks
    const unauthSimRes = await fetch(`${API_BASE}/payment/simulate-test-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: orderIdC }),
    });
    assert(unauthSimRes.status === 401, 'Rejects unauthenticated test simulation with 401 Unauthorized');

    const crossSimRes = await fetch(`${API_BASE}/payment/simulate-test-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenB}` },
      body: JSON.stringify({ orderId: orderIdC }),
    });
    assert(crossSimRes.status === 403, 'Rejects cross-account test simulation with 403 Forbidden');

    // Simulate test payment signature with authorized owner
    const simRes = await fetch(`${API_BASE}/payment/simulate-test-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenC}` },
      body: JSON.stringify({ orderId: orderIdC }),
    });
    const simData = await simRes.json();
    assert(simRes.status === 200, 'Sandbox simulation endpoint returns 200 OK');
    assert(Boolean(simData.razorpay_signature), 'Returns valid HMAC SHA256 test signature');


    // Crucial requirement: User C MUST STILL BE FREE before /verify is called!
    const checkCBeforeRes = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${tokenC}` },
    });
    const checkCBeforeData = await checkCBeforeRes.json();
    assert(checkCBeforeData.user.subscription.status === 'free', 'User C remains FREE after simulation (no access granted prematurely)');

    // Now submit to /api/payment/verify
    const verifyCRes = await fetch(`${API_BASE}/payment/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenC}` },
      body: JSON.stringify({
        razorpay_order_id: simData.razorpay_order_id,
        razorpay_payment_id: simData.razorpay_payment_id,
        razorpay_signature: simData.razorpay_signature,
      }),
    });
    const verifyCData = await verifyCRes.json();
    assert(verifyCRes.status === 200, 'Backend cryptographically verifies signature with 200 OK');
    assert(verifyCData.user.subscription.status === 'pro', 'User C is upgraded to Pro only after backend verification');
    assert(verifyCData.user.subscription.plan === 'yearly', 'User C subscription plan recorded as yearly');

    // -------------------------------------------------------------------------
    // TEST 13: Subscription Expiry Enforcement (Audit Requirement 6)
    // -------------------------------------------------------------------------
    console.log('\n[13/14] Testing Subscription Expiry Backend Enforcement');
    // Set User C's expiresAt to 1 hour in the past (expired pro account)
    const pastDate = new Date(Date.now() - 3600000).toISOString();
    const expireSetRes = await fetch(`${API_BASE}/payment/test-set-expiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenC}` },
      body: JSON.stringify({ expiresAt: pastDate }),
    });
    assert(expireSetRes.status === 200, 'Test fixture: sets past expiration timestamp for User C');

    // Attempt to access premium route /api/premium/verify-entitlement with expired subscription
    const expiredEntitlementRes = await fetch(`${API_BASE}/premium/verify-entitlement`, {
      headers: { Authorization: `Bearer ${tokenC}` },
    });
    const expiredEntitlementData = await expiredEntitlementRes.json();
    assert(expiredEntitlementRes.status === 403, 'Expired Pro subscription is blocked with 403 Forbidden on /api/premium/verify-entitlement');
    assert(expiredEntitlementData.isExpired === true, 'Response identifies that the subscription has expired');
    assert(expiredEntitlementData.requiresUpgrade === true, 'Requires renewal / upgrade to regain access');

    // Attempt to access premium course content with expired subscription
    const expiredContentRes = await fetch(`${API_BASE}/premium/courses/mongodb-atlas/content`, {
      headers: { Authorization: `Bearer ${tokenC}` },
    });
    assert(expiredContentRes.status === 403, 'Expired Pro subscription cannot access premium course content (403 Forbidden)');

    // Verify course access endpoint reflects expired status
    const expiredCourseAccessRes = await fetch(`${API_BASE}/auth/verify-access/mongodb-atlas`, {
      headers: { Authorization: `Bearer ${tokenC}` },
    });
    const expiredCourseAccessData = await expiredCourseAccessRes.json();
    assert(expiredCourseAccessData.accessible === false, 'verify-access reports accessible: false for expired Pro user');

    // -------------------------------------------------------------------------
    // TEST 14: Subscription Renewal Cumulative Extension (Audit Requirement 7)
    // -------------------------------------------------------------------------
    console.log('\n[14/14] Testing Subscription Renewal Cumulative Extension');
    // First, set User C to active Pro expiring in 10 days
    const in10Days = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString();
    await fetch(`${API_BASE}/payment/test-set-expiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenC}` },
      body: JSON.stringify({ expiresAt: in10Days }),
    });

    // User C renews with a Monthly plan (30 days)
    const renewalOrderRes = await fetch(`${API_BASE}/payment/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenC}` },
      body: JSON.stringify({ planId: 'monthly' }),
    });
    const { orderId: renewalOrderId } = await renewalOrderRes.json();

    const renewalSimRes = await fetch(`${API_BASE}/payment/simulate-test-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenC}` },
      body: JSON.stringify({ orderId: renewalOrderId }),
    });
    const renewalSimData = await renewalSimRes.json();

    const renewalVerifyRes = await fetch(`${API_BASE}/payment/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenC}` },
      body: JSON.stringify({
        razorpay_order_id: renewalSimData.razorpay_order_id,
        razorpay_payment_id: renewalSimData.razorpay_payment_id,
        razorpay_signature: renewalSimData.razorpay_signature,
      }),
    });
    const renewalVerifyData = await renewalVerifyRes.json();
    assert(renewalVerifyRes.status === 200, 'Renewal verification returns 200 OK');

    const newExpiryTime = new Date(renewalVerifyData.user.subscription.expiresAt).getTime();
    const expectedMinExpiry = new Date(in10Days).getTime() + 29 * 24 * 60 * 60 * 1000;
    assert(newExpiryTime >= expectedMinExpiry, 'Renewal extends existing unexpired subscription cumulatively (10 days + 30 days)');

    // Check existing /api/health endpoint is intact
    const healthRes = await fetch(`${API_BASE}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200 && healthData.status === 'ok', 'System health check (/api/health) is intact');


  } catch (error) {
    console.error('Test execution error:', error);
    failed++;
  }

  console.log('\n===============================================================');
  console.log(` TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('===============================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
