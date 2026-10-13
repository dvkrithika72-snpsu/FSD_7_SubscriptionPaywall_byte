import crypto from 'crypto';
import Razorpay from 'razorpay';
import { config } from '../config/env.js';

let razorpayClient = null;

/**
 * Check if genuine test Razorpay API credentials are configured
 * (vs local mock/placeholder credentials used for automated tests and offline development)
 */
export function isRealRazorpayConfigured() {
  const keyId = config.razorpayKeyId || '';
  const keySecret = config.razorpayKeySecret || '';

  const isPlaceholder =
    !keyId ||
    !keySecret ||
    keyId.includes('mock') ||
    keyId.includes('placeholder') ||
    keyId.includes('your_key') ||
    keyId.includes('your_test_key') ||
    keyId.includes('dev_key') ||
    keySecret.includes('placeholder') ||
    keySecret.includes('your_test_key');

  return Boolean(
    !isPlaceholder &&
    keyId.startsWith('rzp_test_') &&
    keySecret.length >= 10
  );
}

/**
 * Get detailed Razorpay configuration status
 */
export function getRazorpayConfigStatus() {
  const isConfigured = isRealRazorpayConfigured();
  return {
    isConfigured,
    keyId: isConfigured ? config.razorpayKeyId : (config.allowTestSimulation ? config.razorpayKeyId : null),
    allowTestSimulation: Boolean(config.allowTestSimulation),
    mode: 'test',
    status: isConfigured
      ? 'genuine_test_credentials'
      : (config.allowTestSimulation ? 'sandbox_mock_credentials' : 'missing_or_placeholder'),
    message: isConfigured
      ? 'Genuine Razorpay Test Mode credentials configured.'
      : (config.allowTestSimulation
          ? 'Running in local developer sandbox mode with test payment simulation enabled.'
          : 'Genuine Razorpay Test Mode credentials are missing or are placeholder values. Add genuine test keys from dashboard.razorpay.com to backend/.env.'),
  };
}

/**
 * Get or initialize Razorpay SDK instance
 */
export function getRazorpayClient() {
  if (!razorpayClient && isRealRazorpayConfigured()) {
    razorpayClient = new Razorpay({
      key_id: config.razorpayKeyId,
      key_secret: config.razorpayKeySecret,
    });
  }
  return razorpayClient;
}

/**
 * Fetch payment entity from Razorpay API via SDK (if genuine credentials configured)
 * @param {string} paymentId
 * @returns {Promise<object|null>}
 */
export async function fetchRazorpayPayment(paymentId) {
  const client = getRazorpayClient();
  if (!client) return null;

  try {
    const payment = await client.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.warn(`Unable to fetch payment ${paymentId} from Razorpay SDK:`, error.message);
    return null;
  }
}

/**
 * Create a new Razorpay order
 * @param {object} orderOptions - { amount, currency, receipt, notes }
 * @returns {Promise<object>} Razorpay order object
 */
export async function createRazorpayOrder({ amount, currency = 'INR', receipt, notes = {} }) {
  const client = getRazorpayClient();

  if (client) {
    try {
      const order = await client.orders.create({
        amount,
        currency,
        receipt,
        notes,
      });
      return {
        ...order,
        isGenuineRazorpayOrder: true,
      };
    } catch (error) {
      console.error('Razorpay SDK orders.create error:', error);
      throw new Error(
        error.error?.description ||
        error.description ||
        error.message ||
        'Razorpay SDK rejected order creation. Please verify RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend/.env.'
      );
    }
  }

  // Developer sandbox fallback: only permitted when allowTestSimulation is true
  if (config.allowTestSimulation) {
    const randomHex = crypto.randomBytes(8).toString('hex');
    const mockOrder = {
      id: `order_test_${randomHex}`,
      entity: 'order',
      amount,
      amount_paid: 0,
      amount_due: amount,
      currency,
      receipt,
      status: 'created',
      attempts: 0,
      notes,
      created_at: Math.floor(Date.now() / 1000),
      isGenuineRazorpayOrder: false,
      isSandboxMock: true,
    };

    return mockOrder;
  }

  // Refuse order creation if genuine test credentials are missing and simulation is disabled
  throw new Error(
    'Genuine Razorpay Test Mode credentials are missing or are placeholder values. ' +
    'Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend/.env with genuine test keys from dashboard.razorpay.com, ' +
    'or set ENABLE_TEST_PAYMENT_SIMULATION=true in backend/.env for local offline testing.'
  );
}


/**
 * Verify Razorpay payment signature according to official Razorpay documentation:
 * HMAC SHA256 of `order_id + "|" + payment_id` using server-side key_secret
 * @param {object} params - { orderId, paymentId, signature }
 * @returns {boolean}
 */
export function verifyPaymentSignature({ orderId, paymentId, signature }) {
  if (!orderId || !paymentId || !signature) {
    return false;
  }

  const payload = `${orderId}|${paymentId}`;
  const secret = config.razorpayKeySecret;

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  // Perform constant-time string comparison to prevent timing attacks
  const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
  const actualBuffer = Buffer.from(signature, 'utf8');

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
}

/**
 * Generate valid payment signature for test fixtures and mock flows
 * @param {object} params - { orderId, paymentId }
 * @returns {string}
 */
export function generatePaymentSignature({ orderId, paymentId }) {
  const payload = `${orderId}|${paymentId}`;
  return crypto
    .createHmac('sha256', config.razorpayKeySecret)
    .update(payload)
    .digest('hex');
}

/**
 * Verify Razorpay webhook signature according to official Razorpay documentation:
 * HMAC SHA256 of raw request body using server-side webhook_secret
 * @param {object} params - { rawBody, signature }
 * @returns {boolean}
 */
export function verifyWebhookSignature({ rawBody, signature }) {
  if (!rawBody || !signature) {
    return false;
  }

  const secret = config.razorpayWebhookSecret;
  const bodyString = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8');

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(bodyString)
    .digest('hex');

  const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
  const actualBuffer = Buffer.from(signature, 'utf8');

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
}

/**
 * Generate valid webhook signature for test fixtures
 * @param {object} params - { rawBody }
 * @returns {string}
 */
export function generateWebhookSignature({ rawBody }) {
  const secret = config.razorpayWebhookSecret;
  const bodyString = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8');
  return crypto
    .createHmac('sha256', secret)
    .update(bodyString)
    .digest('hex');
}
