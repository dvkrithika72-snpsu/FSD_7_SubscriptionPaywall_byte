import { Router } from 'express';

const router = Router();

/**
 * @route   GET /api/health
 * @desc    Check health status and metadata of the API service
 * @access  Public
 */
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'APTIVELLA API',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

export default router;
