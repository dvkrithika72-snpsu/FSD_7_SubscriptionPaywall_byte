import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import premiumRoutes from './routes/premiumRoutes.js';
import progressRoutes from './routes/progressRoutes.js';

const app = express();

// Configure CORS for frontend communication during development and production
app.use(cors({
  origin: config.clientUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-razorpay-signature', 'x-razorpay-event-id']
}));

// Express middleware for JSON body parsing, preserving raw buffer for cryptographic webhook signature verification
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true }));

// Root informational endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'APTIVELLA API',
    description: 'Backend services for APTIVELLA Skill-Development SaaS Platform',
    status: 'online',
    healthCheck: '/api/health'
  });
});

// Mount modular API routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/premium', premiumRoutes);
app.use('/api/progress', progressRoutes);

// Catch-all 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: config.nodeEnv === 'development' ? err.message : 'Something went wrong'
  });
});

export default app;
