import User from '../models/User.js';
import { generateToken } from '../utils/token.js';

/**
 * Normalize and validate email address
 */
function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return typeof email === 'string' && emailRegex.test(email.trim());
}

/**
 * Register a new user account
 * POST /api/auth/register
 */
export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    // 1. Input Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Name is required and must be at least 2 characters long',
      });
    }

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'A valid email address is required',
      });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Password is required and must be at least 6 characters long',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 2. Duplicate Account Check
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'An account with this email address already exists',
      });
    }

    // 3. Create User with enforced 'free' subscription default
    // Deliberately ignoring any client-sent subscription field to prevent privilege escalation
    const newUser = new User({
      name: name.trim(),
      email: normalizedEmail,
      password, // Hashed by User model pre-save hook
      subscription: {
        status: 'free',
        plan: 'free',
        activatedAt: null,
        expiresAt: null,
      },
    });

    await newUser.save();

    // 4. Generate JWT
    const token = generateToken(newUser._id);

    return res.status(201).json({
      message: 'Account registered successfully',
      token,
      user: newUser.toJSON(),
    });
  } catch (error) {
    console.error('Registration Error:', error);

    if (error.code === 11000) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'An account with this email address already exists',
      });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        error: 'Validation Error',
        message: messages.join('. '),
      });
    }

    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred during registration',
    });
  }
}

/**
 * Log in an existing user
 * POST /api/auth/login
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Email and password are required',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Explicitly select password hash for authentication
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email address or password',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email address or password',
      });
    }

    // Generate JWT
    const token = generateToken(user._id);

    return res.status(200).json({
      message: 'Logged in successfully',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred during login',
    });
  }
}

/**
 * Get current authenticated user profile and subscription status
 * GET /api/auth/me
 */
export async function getMe(req, res) {
  try {
    // Check if subscription has expired
    if (
      req.user.subscription?.status === 'pro' &&
      req.user.subscription?.expiresAt &&
      new Date(req.user.subscription.expiresAt).getTime() <= Date.now()
    ) {
      await User.findByIdAndUpdate(req.user._id, {
        'subscription.status': 'free',
      });
      req.user.subscription.status = 'free';
    }

    return res.status(200).json({
      user: req.user.toJSON(),
    });
  } catch (error) {
    console.error('GetMe Error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve user profile',
    });
  }
}

/**
 * Verify access to a specific course based on backend entitlement
 * GET /api/auth/verify-access/:courseId
 */
export async function verifyCourseAccess(req, res) {
  try {
    const { courseId } = req.params;

    // Define pro-locked courses on backend (matches data rules)
    const proLockedCourseIds = [
      'mongodb-atlas',
      'typescript-essentials',
      'mern-stack-project',
      'nextjs-fullstack-mastery',
      'ai-langchain-engineering',
      'docker-kubernetes-devops',
      'system-design-distributed-systems',
      'cybersecurity-ethical-hacking'
    ];
    const isProRequired = proLockedCourseIds.includes(courseId);

    // Free courses are accessible to everyone (guests and logged-in users)
    if (!isProRequired) {
      return res.status(200).json({
        courseId,
        accessible: true,
        reason: 'free_course',
        requiresPro: false,
      });
    }

    // Pro-locked courses require authenticated user with active unexpired subscription
    if (!req.user) {
      return res.status(200).json({
        courseId,
        accessible: false,
        reason: 'authentication_and_pro_required',
        requiresPro: true,
        message: 'Pro subscription required to access this premium course',
      });
    }

    const hasProStatus = req.user.subscription?.status === 'pro';
    const expiresAt = req.user.subscription?.expiresAt;
    const isExpired = hasProStatus && expiresAt && new Date(expiresAt).getTime() <= Date.now();
    const isPro = hasProStatus && !isExpired;

    return res.status(200).json({
      courseId,
      accessible: isPro,
      reason: isPro ? 'pro_subscription_active' : (isExpired ? 'pro_subscription_expired' : 'pro_subscription_required'),
      requiresPro: true,
      currentStatus: isPro ? 'pro' : 'free',
      isExpired: Boolean(isExpired),
      message: isPro
        ? 'Full course access granted'
        : (isExpired ? 'Your Pro subscription has expired. Please renew to access this course.' : 'Pro subscription required to access this premium course'),
    });

  } catch (error) {
    console.error('Verify Access Error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to verify course access entitlement',
    });
  }
}
