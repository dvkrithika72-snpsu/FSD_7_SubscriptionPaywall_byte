import { verifyToken } from '../utils/token.js';
import User from '../models/User.js';

/**
 * Authentication middleware
 * Verifies JWT from Bearer token and attaches user document to req.user
 */
export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication token missing or invalid format',
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication token is empty',
      });
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: err.name === 'TokenExpiredError'
          ? 'Authentication token has expired. Please log in again.'
          : 'Invalid authentication token',
      });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User associated with this token no longer exists',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to process authentication',
    });
  }
}

/**
 * Role/Entitlement middleware: require 'pro' subscription status
 * Strictly enforces subscription expiry: an expired Pro account is treated as Free
 */
export async function requirePro(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required',
    });
  }

  const isPro = req.user.subscription?.status === 'pro';
  const expiresAt = req.user.subscription?.expiresAt;
  const isExpired = isPro && expiresAt && new Date(expiresAt).getTime() <= Date.now();

  if (!isPro || isExpired) {
    // Lazily sync database record if subscription expired
    if (isPro && isExpired) {
      await User.findByIdAndUpdate(req.user._id, {
        'subscription.status': 'free',
      });
      req.user.subscription.status = 'free';
    }

    return res.status(403).json({
      error: 'Forbidden',
      message: isExpired
        ? 'Your Pro subscription has expired. Please renew your subscription to access premium resources.'
        : 'This premium resource requires an active Pro subscription',
      subscriptionStatus: 'free',
      isExpired: Boolean(isExpired),
      requiresUpgrade: true,
    });
  }

  next();
}


/**
 * Optional authentication middleware for routes accessible to both guests and members
 */
export async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        const decoded = verifyToken(token);
        const user = await User.findById(decoded.id);
        if (user) {
          req.user = user;
        }
      }
    }
  } catch {
    // Ignore error for optional auth
  }
  next();
}
