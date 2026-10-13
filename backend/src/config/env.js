import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables reliably from backend/.env regardless of current working directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../backend/.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

export const config = {

  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/aptivella',
  jwtSecret: process.env.JWT_SECRET || 'aptivella_jwt_dev_secret_key_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  // Razorpay Test Mode Credentials
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || '',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || '',
  razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || '',
  // Explicit flag to allow developer test simulation only in non-production environments
  allowTestSimulation:
    (process.env.ENABLE_TEST_PAYMENT_SIMULATION === 'true' || process.env.NODE_ENV === 'test') &&
    process.env.NODE_ENV !== 'production',
};


