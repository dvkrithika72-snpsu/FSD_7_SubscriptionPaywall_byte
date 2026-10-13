import express from 'express';
import {
  getPaymentConfig,
  createOrder,
  verifyPayment,
  handleWebhook,
  simulateTestPayment,
} from '../controllers/paymentController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { config } from '../config/env.js';
import User from '../models/User.js';

const router = express.Router();

/**
 * @route   GET /api/payment/config
 * @desc    Get public Razorpay config (keyId, currency, plans)
 * @access  Public
 */
router.get('/config', getPaymentConfig);

/**
 * @route   POST /api/payment/create-order
 * @desc    Create Razorpay order with server-calculated price
 * @access  Private (Requires Bearer JWT)
 */
router.post('/create-order', authenticate, createOrder);

/**
 * @route   POST /api/payment/verify
 * @desc    Verify payment signature and activate Pro subscription
 * @access  Private (Requires Bearer JWT)
 */
router.post('/verify', authenticate, verifyPayment);

/**
 * @route   POST /api/payment/simulate-test-payment
 * @desc    Simulate Razorpay test payment signature generation (Sandbox/Dev helper)
 *          DOES NOT grant Pro status; signature must still be verified via /verify
 * @access  Private (Requires Bearer JWT)
 */
router.post('/simulate-test-payment', authenticate, simulateTestPayment);

/**
 * @route   POST /api/payment/webhook
 * @desc    Receive verified Razorpay webhook events idempotently
 * @access  Public (Signature verified via x-razorpay-signature)
 */
router.post('/webhook', handleWebhook);

// Test fixture route: only available when allowTestSimulation is explicitly enabled in non-production
if (config.allowTestSimulation) {
  router.post('/test-set-expiry', authenticate, async (req, res) => {
    try {
      const { expiresAt } = req.body;
      const updated = await User.findByIdAndUpdate(
        req.user._id,
        {
          'subscription.status': 'pro',
          'subscription.expiresAt': new Date(expiresAt),
        },
        { returnDocument: 'after' }
      );
      return res.status(200).json({ ok: true, user: updated.toJSON() });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });
}


export default router;

