import mongoose from 'mongoose';

const webhookEventSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    eventType: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      default: null,
      index: true,
    },
    paymentId: {
      type: String,
      default: null,
      index: true,
    },
    processed: {
      type: Boolean,
      default: true,
    },
    payloadSummary: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const WebhookEvent = mongoose.model('WebhookEvent', webhookEventSchema);

export default WebhookEvent;
