import express from 'express';
import { register, login, getMe, verifyCourseAccess } from '../controllers/authController.js';
import { authenticate, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user account (defaults strictly to 'free' subscription)
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate existing user & return JWT token
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /api/auth/me
 * @desc    Get currently authenticated user profile and subscription status
 * @access  Private (Requires Bearer JWT)
 */
router.get('/me', authenticate, getMe);

/**
 * @route   GET /api/auth/verify-access/:courseId
 * @desc    Check access entitlement for a course based on backend subscription
 * @access  Public / Optional Auth
 */
router.get('/verify-access/:courseId', optionalAuth, verifyCourseAccess);

export default router;
