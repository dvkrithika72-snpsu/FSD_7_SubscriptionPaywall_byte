import crypto from 'crypto';
import { config } from '../config/env.js';
import { SUBSCRIPTION_PLANS, isValidPlan, getPlan } from '../config/plans.js';
import Payment from '../models/Payment.js';
import WebhookEvent from '../models/WebhookEvent.js';
import User from '../models/User.js';
import {
  createRazorpayOrder,
  verifyPaymentSignature,
  verifyWebhookSignature,
  generatePaymentSignature,
  getRazorpayConfigStatus,
  isRealRazorpayConfigured,
  fetchRazorpayPayment,
} from '../services/razorpayService.js';

/**
 * GET /api/payment/config
 * Expose public checkout configuration (Key ID only - NEVER secrets)
 * Includes credential health status and test simulation status
 */
export async function getPaymentConfig(req, res) {
  try {
    const status = getRazorpayConfigStatus();
    return res.status(200).json({
      ok: true,
      keyId: status.keyId,
      currency: 'INR',
      testMode: true,
      isConfigured: status.isConfigured,
      credentialsStatus: status.status,
      allowTestSimulation: status.allowTestSimulation,
      message: status.message,
      plans: SUBSCRIPTION_PLANS,
    });
  } catch (error) {
    console.error('getPaymentConfig error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve payment configuration',
    });
  }
}


/**
 * POST /api/payment/create-order
 * Create server-side Razorpay order for authenticated user.
 * Strictly calculates price on backend; client cannot supply custom amount.
 */
export async function createOrder(req, res) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'You must be logged in to purchase a subscription',
      });
    }

    const { planId } = req.body;

    if (!isValidPlan(planId)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: `Invalid subscription plan "${planId}". Valid plans are: ${Object.keys(SUBSCRIPTION_PLANS).join(', ')}`,
      });
    }

    const plan = getPlan(planId);

    // Unique order receipt identifier
    const receipt = `rcpt_${user._id.toString().slice(-6)}_${Date.now()}`;

    // Create order using Razorpay service with server-calculated amount
    const order = await createRazorpayOrder({
      amount: plan.amountPaise,
      currency: plan.currency,
      receipt,
      notes: {
        userId: user._id.toString(),
        planId: plan.id,
        userEmail: user.email,
        userName: user.name,
      },
    });

    // Record order in MongoDB for reconciliation & fraud prevention
    const paymentRecord = await Payment.create({
      userId: user._id,
      orderId: order.id,
      planId: plan.id,
      amount: plan.amountPaise,
      currency: plan.currency,
      status: 'created',
      receipt,
      notes: {
        planName: plan.name,
        userEmail: user.email,
      },
    });

    return res.status(201).json({
      ok: true,
      orderId: order.id,
      amount: plan.amountPaise,
      amountINR: plan.priceINR,
      currency: plan.currency,
      keyId: config.razorpayKeyId,
      planId: plan.id,
      planName: plan.name,
      planDescription: plan.description,
      receipt: paymentRecord.receipt,
      isGenuineRazorpayOrder: Boolean(order.isGenuineRazorpayOrder),
      isConfigured: isRealRazorpayConfigured(),
    });
  } catch (error) {
    console.error('createOrder error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Failed to create payment order',
    });
  }
}

/**
 * POST /api/payment/verify
 * Cryptographically verify payment signature returned by Razorpay Checkout.
 * Only grants Pro status when HMAC SHA256 signature is verified with server secret.
 */
export async function verifyPayment(req, res) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required to verify payment',
      });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing required payment verification fields (order ID, payment ID, or signature)',
      });
    }

    // Lookup corresponding order in database
    const payment = await Payment.findOne({ orderId: razorpay_order_id });

    if (!payment) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Order record not found in system. Unauthorized verification attempt.',
      });
    }

    // Ensure order belongs to current authenticated user
    if (payment.userId.toString() !== user._id.toString()) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'This order does not belong to your account',
      });
    }

    // Idempotent: If already verified and marked paid, return current status
    if (payment.status === 'paid' && payment.paymentId === razorpay_payment_id) {
      const refreshedUser = await User.findById(user._id);
      return res.status(200).json({
        ok: true,
        message: 'Payment has already been verified and subscription is active',
        user: refreshedUser.toJSON(),
        isAlreadyProcessed: true,
      });
    }

    // Cryptographically verify Razorpay signature with server secret
    const isValidSignature = verifyPaymentSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!isValidSignature) {
      payment.status = 'failed';
      await payment.save();

      return res.status(400).json({
        error: 'Invalid Signature',
        message: 'Cryptographic signature verification failed. Pro access cannot be granted.',
      });
    }

    // When genuine Razorpay credentials are used, confirm payment details from Razorpay API
    if (isRealRazorpayConfigured()) {
      const razorpayPayment = await fetchRazorpayPayment(razorpay_payment_id);
      if (razorpayPayment) {
        if (razorpayPayment.order_id && razorpayPayment.order_id !== razorpay_order_id) {
          return res.status(400).json({
            error: 'Order Mismatch',
            message: 'Payment entity order ID does not match requested order ID',
          });
        }
        if (razorpayPayment.amount && razorpayPayment.amount !== payment.amount) {
          return res.status(400).json({
            error: 'Amount Mismatch',
            message: 'Payment amount mismatch detected with Razorpay records',
          });
        }
        if (razorpayPayment.currency && razorpayPayment.currency !== payment.currency) {
          return res.status(400).json({
            error: 'Currency Mismatch',
            message: 'Payment currency mismatch detected with Razorpay records',
          });
        }
        if (razorpayPayment.status !== 'captured' && razorpayPayment.status !== 'authorized') {
          return res.status(400).json({
            error: 'Invalid Payment Status',
            message: `Payment status (${razorpayPayment.status}) is not in an authorized or captured state`,
          });
        }
      }
    }

    // Signature verified! Calculate plan expiration and activate Pro
    const plan = getPlan(payment.planId);
    const now = new Date();

    // Consistent renewal logic: If user already has an active unexpired Pro pass, extend from current expiry date
    let baseDate = now;
    if (
      user.subscription?.status === 'pro' &&
      user.subscription?.expiresAt &&
      new Date(user.subscription.expiresAt).getTime() > now.getTime()
    ) {
      baseDate = new Date(user.subscription.expiresAt);
    }
    const expiresAt = new Date(baseDate.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);

    // Update payment record
    payment.status = 'paid';
    payment.paymentId = razorpay_payment_id;
    payment.signature = razorpay_signature;
    payment.verifiedAt = now;
    payment.activatedAt = now;
    payment.expiresAt = expiresAt;
    await payment.save();


    // Update user subscription in MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        'subscription.status': 'pro',
        'subscription.plan': payment.planId,
        'subscription.activatedAt': now,
        'subscription.expiresAt': expiresAt,
        'subscription.lastPaymentId': razorpay_payment_id,
        'subscription.lastOrderId': razorpay_order_id,
      },
      { new: true }
    );

    return res.status(200).json({
      ok: true,
      message: `Pro subscription (${plan.name}) successfully verified and activated!`,
      user: updatedUser.toJSON(),
      payment: {
        orderId: payment.orderId,
        paymentId: payment.paymentId,
        status: payment.status,
        planId: payment.planId,
        expiresAt: payment.expiresAt,
      },
    });
  } catch (error) {
    console.error('verifyPayment error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to complete payment verification',
    });
  }
}

/**
 * POST /api/payment/webhook
 * Razorpay Webhook receiver with HMAC SHA256 raw-body verification and idempotency.
 */
export async function handleWebhook(req, res) {
  try {
    const signature = req.headers['x-razorpay-signature'];

    if (!signature) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing x-razorpay-signature header',
      });
    }

    const rawBody = req.rawBody;
    if (!rawBody) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Raw request body not preserved for webhook verification',
      });
    }

    // Verify webhook signature with server webhook secret
    const isValidSignature = verifyWebhookSignature({ rawBody, signature });

    if (!isValidSignature) {
      console.warn('Webhook signature mismatch detected!');
      return res.status(400).json({
        error: 'Invalid Signature',
        message: 'Webhook signature verification failed',
      });
    }

    const event = req.body;
    const eventType = event.event;

    // Determine unique event ID for idempotency tracking
    const eventId =
      req.headers['x-razorpay-event-id'] ||
      event.event_id ||
      `${eventType}_${event.payload?.payment?.entity?.id || event.payload?.order?.entity?.id || Date.now()}`;

    // Idempotency check: Ignore duplicate events
    const existingEvent = await WebhookEvent.findOne({ eventId });
    if (existingEvent) {
      return res.status(200).json({
        status: 'ok',
        message: 'Webhook event already processed (idempotent)',
        eventId,
      });
    }

    // Process payment events: payment.captured or order.paid
    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      const paymentEntity = event.payload?.payment?.entity;
      const orderEntity = event.payload?.order?.entity;

      const orderId = paymentEntity?.order_id || orderEntity?.id;
      const paymentId = paymentEntity?.id;

      if (orderId) {
        const paymentRecord = await Payment.findOne({ orderId });

        if (paymentRecord) {
          // Validate amount to prevent tampered webhook payloads
          const incomingAmount = paymentEntity?.amount || orderEntity?.amount;
          if (incomingAmount && incomingAmount !== paymentRecord.amount) {
            console.error(`Webhook amount mismatch: expected ${paymentRecord.amount}, received ${incomingAmount}`);
            return res.status(400).json({
              error: 'Bad Request',
              message: 'Payment amount mismatch detected in webhook payload',
            });
          }

          // If not already marked paid, activate subscription
          if (paymentRecord.status !== 'paid') {
            const plan = getPlan(paymentRecord.planId);
            const now = new Date();
            const expiresAt = new Date(now.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);

            paymentRecord.status = 'paid';
            if (paymentId) paymentRecord.paymentId = paymentId;
            paymentRecord.verifiedAt = now;
            paymentRecord.activatedAt = now;
            paymentRecord.expiresAt = expiresAt;

            // Activate user in DB
            await User.findByIdAndUpdate(paymentRecord.userId, {
              'subscription.status': 'pro',
              'subscription.plan': paymentRecord.planId,
              'subscription.activatedAt': now,
              'subscription.expiresAt': expiresAt,
              'subscription.lastPaymentId': paymentId || 'webhook_verified',
              'subscription.lastOrderId': orderId,
            });
          }

          // Record event in payment audit history
          paymentRecord.webhookEvents.push({
            eventId,
            eventType,
            receivedAt: new Date(),
          });
          await paymentRecord.save();
        }
      }
    } else if (eventType === 'payment.failed') {
      const paymentEntity = event.payload?.payment?.entity;
      const orderId = paymentEntity?.order_id;
      const paymentId = paymentEntity?.id;

      if (orderId) {
        const paymentRecord = await Payment.findOne({ orderId });

        if (paymentRecord) {
          // Update status to failed only if not already marked paid
          if (paymentRecord.status !== 'paid') {
            paymentRecord.status = 'failed';
            if (paymentId) paymentRecord.paymentId = paymentId;
          }

          // Append failure event to audit trail using existing schema format
          paymentRecord.webhookEvents.push({
            eventId,
            eventType,
            receivedAt: new Date(),
          });
          await paymentRecord.save();
        }
      }
    }

    // Save event record in WebhookEvent collection to enforce idempotency
    await WebhookEvent.create({
      eventId,
      eventType,
      orderId: event.payload?.payment?.entity?.order_id || event.payload?.order?.entity?.id || null,
      paymentId: event.payload?.payment?.entity?.id || null,
      processed: true,
      payloadSummary: {
        event: eventType,
        createdAt: event.created_at,
      },
    });

    return res.status(200).json({
      status: 'ok',
      message: 'Webhook event processed successfully',
      eventId,
    });
  } catch (error) {
    console.error('handleWebhook error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Webhook handler encountered an error',
    });
  }
}

/**
 * POST /api/payment/test-simulate-payment
 * Razorpay Test-Mode / Sandbox helper for local development and test environments.
 * Returns valid HMAC SHA256 payment signature calculated with server secret.
 * CRITICAL SECURITY GUARANTEE: Does NOT grant Pro status or mutate subscription in MongoDB.
 * The client MUST still send this payload to POST /api/payment/verify to be verified.
 */
export async function simulateTestPayment(req, res) {
  try {
    // Strictly disable outside explicitly enabled local test environment
    if (!config.allowTestSimulation) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Test payment simulation is strictly disabled outside an explicitly enabled local test environment. Genuine Razorpay checkout is required.',
      });
    }

    const user = req.user;
    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required for test payment simulation',
      });
    }


    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'orderId is required',
      });
    }

    const payment = await Payment.findOne({ orderId });
    if (!payment) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Order record not found in system',
      });
    }

    if (payment.userId.toString() !== user._id.toString()) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Order does not belong to your account',
      });
    }

    const randomSuffix = crypto.randomBytes(6).toString('hex');
    const paymentId = `pay_test_${randomSuffix}`;
    const signature = generatePaymentSignature({ orderId, paymentId });

    return res.status(200).json({
      ok: true,
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
      planId: payment.planId,
      amount: payment.amount,
      currency: payment.currency,
      message: 'Simulated Razorpay test payment signature generated. Must be verified via POST /api/payment/verify.',
    });
  } catch (error) {
    console.error('simulateTestPayment error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Failed to simulate test payment',
    });
  }
}

