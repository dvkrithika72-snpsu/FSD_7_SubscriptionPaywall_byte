import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    paymentId: {
      type: String,
      sparse: true,
      index: true,
      default: null,
    },
    signature: {
      type: String,
      default: null,
    },
    planId: {
      type: String,
      enum: ['monthly', 'quarterly', 'yearly'],
      required: true,
    },
    amount: {
      type: Number,
      required: true, // in paise
    },
    currency: {
      type: String,
      default: 'INR',
    },
    status: {
      type: String,
      enum: ['created', 'paid', 'failed'],
      default: 'created',
      index: true,
    },
    receipt: {
      type: String,
      required: true,
      unique: true,
    },
    method: {
      type: String,
      default: null, // e.g. upi, card, netbanking
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    activatedAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    webhookEvents: [
      {
        eventId: { type: String, required: true },
        eventType: { type: String, required: true },
        receivedAt: { type: Date, default: Date.now },
      },
    ],
    notes: {
      type: Map,
      of: String,
      default: {},
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id ? ret._id.toString() : undefined;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
