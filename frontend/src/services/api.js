/**
 * APTIVELLA API Client Service
 * Centralizes all communication between the React frontend and Express backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'aptivella_auth_token';

export function getStoredToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // LocalStorage error fallback
  }
}

export function clearStoredToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('aptivella_user_achievements');
    // Clear any user-specific progress or notes cache
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('aptivella_progress_') || key.startsWith('aptivella_user_') || key.startsWith('aptivella_student_notes_'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  } catch {
    // Ignore error
  }
}

/**
 * Fetch backend health status
 * @returns {Promise<{ ok: boolean, data?: any, error?: string, latencyMs?: number }>}
 */
export async function checkBackendHealth() {
  const startTime = performance.now();
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    const latencyMs = Math.round(performance.now() - startTime);

    if (!response.ok) {
      return {
        ok: false,
        error: `HTTP Error ${response.status}: ${response.statusText}`,
        latencyMs,
      };
    }

    const data = await response.json();
    return {
      ok: true,
      data,
      latencyMs,
    };
  } catch (err) {
    const latencyMs = Math.round(performance.now() - startTime);
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Unable to connect to backend server',
      latencyMs,
    };
  }
}

/**
 * Register a new user
 * @param {{ name: string, email: string, password: string }} credentials
 * @returns {Promise<{ ok: boolean, user?: object, token?: string, error?: string }>}
 */
export async function registerUser({ name, email, password }) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        error: data.message || `Registration failed with status ${response.status}`,
      };
    }

    if (data.token) {
      setStoredToken(data.token);
    }

    return {
      ok: true,
      user: data.user,
      token: data.token,
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Network error during registration',
    };
  }
}

/**
 * Log in an existing user
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ ok: boolean, user?: object, token?: string, error?: string }>}
 */
export async function loginUser({ email, password }) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        error: data.message || `Login failed with status ${response.status}`,
      };
    }

    if (data.token) {
      setStoredToken(data.token);
    }

    return {
      ok: true,
      user: data.user,
      token: data.token,
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Network error during login',
    };
  }
}

/**
 * Fetch authenticated user profile using stored JWT
 * @param {string} [authToken]
 * @returns {Promise<{ ok: boolean, user?: object, error?: string }>}
 */
export async function fetchCurrentUser(authToken) {
  const token = authToken || getStoredToken();
  if (!token) {
    return { ok: false, error: 'No authentication token found' };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // Clear invalid token
      if (response.status === 401) {
        clearStoredToken();
      }
      return {
        ok: false,
        error: data.message || `Failed to fetch profile (Status ${response.status})`,
      };
    }

    return {
      ok: true,
      user: data.user,
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Network error while fetching profile',
    };
  }
}

/**
 * Verify backend course access entitlement
 * @param {string} courseId
 * @param {string} [authToken]
 * @returns {Promise<{ ok: boolean, accessible: boolean, requiresPro: boolean, message?: string }>}
 */
export async function verifyCourseAccess(courseId, authToken) {
  const token = authToken || getStoredToken();
  const headers = { Accept: 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify-access/${courseId}`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();
    return {
      ok: response.ok,
      accessible: !!data.accessible,
      requiresPro: !!data.requiresPro,
      reason: data.reason,
      message: data.message,
    };
  } catch (err) {
    return {
      ok: false,
      accessible: false,
      requiresPro: true,
      message: err instanceof Error ? err.message : 'Failed to verify course access',
    };
  }
}

/**
 * Fetch public payment configuration (Razorpay Key ID, plan details)
 * @returns {Promise<{ ok: boolean, keyId?: string, plans?: object, error?: string }>}
 */
export async function fetchPaymentConfig() {
  try {
    const response = await fetch(`${API_BASE_URL}/payment/config`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    const data = await response.json();
    if (!response.ok) {
      return { ok: false, error: data.message || 'Failed to fetch payment config' };
    }
    return { ok: true, ...data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Network error' };
  }
}

/**
 * Create a backend Razorpay subscription order (requires JWT)
 * @param {string} planId - 'monthly' | 'quarterly' | 'yearly'
 * @returns {Promise<{ ok: boolean, orderId?: string, amount?: number, currency?: string, keyId?: string, planName?: string, error?: string }>}
 */
export async function createPaymentOrder(planId) {
  const token = getStoredToken();
  if (!token) {
    return { ok: false, error: 'Please log in to upgrade to Pro' };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/payment/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify({ planId }),
    });

    const data = await response.json();
    if (!response.ok) {
      return { ok: false, error: data.message || `Order creation failed (${response.status})` };
    }

    return { ok: true, ...data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Network error creating order' };
  }
}

/**
 * Verify Razorpay payment signature on backend and activate Pro subscription
 * @param {{ razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string }} paymentData
 * @returns {Promise<{ ok: boolean, user?: object, message?: string, error?: string }>}
 */
export async function verifyPayment(paymentData) {
  const token = getStoredToken();
  if (!token) {
    return { ok: false, error: 'Authentication required for verification' };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/payment/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    const data = await response.json();
    if (!response.ok) {
      return { ok: false, error: data.message || `Payment verification failed (${response.status})` };
    }

    return { ok: true, ...data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Network error during payment verification' };
  }
}

/**
 * Simulate test payment signature for developer/sandbox testing (Razorpay test mode)
 * Note: Does not grant Pro access; the returned payload must still be verified via verifyPayment()
 * @param {string} orderId
 * @returns {Promise<{ ok: boolean, razorpay_order_id?: string, razorpay_payment_id?: string, razorpay_signature?: string, error?: string }>}
 */
export async function simulateTestPayment(orderId) {
  const token = getStoredToken();
  if (!token) {
    return { ok: false, error: 'Authentication required for test payment simulation' };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/payment/simulate-test-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify({ orderId }),
    });

    const data = await response.json();
    if (!response.ok) {
      return { ok: false, error: data.message || `Test simulation failed (${response.status})` };
    }

    return { ok: true, ...data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Network error during test simulation' };
  }
}


/**
 * Fetch premium course content solutions (Pro only)
 * @param {string} courseId
 * @returns {Promise<{ ok: boolean, premiumAssets?: object, error?: string }>}
 */
export async function fetchPremiumCourseContent(courseId) {
  const token = getStoredToken();
  if (!token) {
    return { ok: false, error: 'Authentication required' };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/premium/courses/${courseId}/content`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    const data = await response.json();
    if (!response.ok) {
      return { ok: false, error: data.message || 'Access denied to premium content' };
    }

    return { ok: true, ...data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Network error' };
  }
}

/**
 * Fetch course reading progress & bookmarks
 * @param {string} courseId
 * @returns {Promise<{ ok: boolean, progress?: object, error?: string }>}
 */
export async function fetchCourseProgress(courseId) {
  const token = getStoredToken();
  if (!token) {
    // Unauthenticated fallback to localStorage
    try {
      const saved = localStorage.getItem(`aptivella_progress_${courseId}`);
      return { ok: true, progress: saved ? JSON.parse(saved) : { completedTopics: [], bookmarks: [], lastReadTopic: null, percentComplete: 0 } };
    } catch {
      return { ok: true, progress: { completedTopics: [], bookmarks: [], lastReadTopic: null, percentComplete: 0 } };
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}/progress/${courseId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    const data = await response.json();
    if (!response.ok) {
      return { ok: false, error: data.message || 'Failed to fetch progress' };
    }
    return { ok: true, progress: data.progress };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Network error' };
  }
}

/**
 * Toggle completion status of a topic in a course
 * @param {string} courseId
 * @param {string} topicKey
 * @param {number} totalTopics
 * @returns {Promise<{ ok: boolean, isCompleted?: boolean, completedTopics?: string[], percentComplete?: number, error?: string }>}
 */
export async function toggleTopicCompleted(courseId, topicKey, totalTopics = 10) {
  const token = getStoredToken();
  if (!token) {
    // Unauthenticated fallback to localStorage
    try {
      const storageKey = `aptivella_progress_${courseId}`;
      const saved = JSON.parse(localStorage.getItem(storageKey) || '{"completedTopics":[],"bookmarks":[]}');
      const idx = saved.completedTopics.indexOf(topicKey);
      let isCompleted = false;
      if (idx > -1) {
        saved.completedTopics.splice(idx, 1);
      } else {
        saved.completedTopics.push(topicKey);
        isCompleted = true;
      }
      const percentComplete = Math.min(100, Math.round((saved.completedTopics.length / Math.max(1, totalTopics)) * 100));
      saved.percentComplete = percentComplete;
      localStorage.setItem(storageKey, JSON.stringify(saved));
      return { ok: true, isCompleted, completedTopics: saved.completedTopics, percentComplete };
    } catch {
      return { ok: false, error: 'Local storage error' };
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}/progress/${courseId}/toggle-complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify({ topicKey, totalTopics }),
    });

    const data = await response.json();
    if (!response.ok) {
      return { ok: false, error: data.message || 'Failed to toggle completion' };
    }
    return { ok: true, ...data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Network error' };
  }
}

/**
 * Toggle bookmark status for a topic in a course
 * @param {string} courseId
 * @param {string} topicKey
 * @returns {Promise<{ ok: boolean, isBookmarked?: boolean, bookmarks?: string[], error?: string }>}
 */
export async function toggleTopicBookmark(courseId, topicKey) {
  const token = getStoredToken();
  if (!token) {
    // Unauthenticated fallback
    try {
      const storageKey = `aptivella_progress_${courseId}`;
      const saved = JSON.parse(localStorage.getItem(storageKey) || '{"completedTopics":[],"bookmarks":[]}');
      const idx = saved.bookmarks.indexOf(topicKey);
      let isBookmarked = false;
      if (idx > -1) {
        saved.bookmarks.splice(idx, 1);
      } else {
        saved.bookmarks.push(topicKey);
        isBookmarked = true;
      }
      localStorage.setItem(storageKey, JSON.stringify(saved));
      return { ok: true, isBookmarked, bookmarks: saved.bookmarks };
    } catch {
      return { ok: false, error: 'Local storage error' };
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}/progress/${courseId}/toggle-bookmark`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify({ topicKey }),
    });

    const data = await response.json();
    if (!response.ok) {
      return { ok: false, error: data.message || 'Failed to toggle bookmark' };
    }
    return { ok: true, ...data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Network error' };
  }
}

/**
 * Record last read topic for resume reading functionality
 * @param {string} courseId
 * @param {string} topicKey
 * @returns {Promise<{ ok: boolean, lastReadTopic?: string, error?: string }>}
 */
export async function setLastReadTopic(courseId, topicKey) {
  const token = getStoredToken();
  if (!token) {
    try {
      const storageKey = `aptivella_progress_${courseId}`;
      const saved = JSON.parse(localStorage.getItem(storageKey) || '{"completedTopics":[],"bookmarks":[]}');
      saved.lastReadTopic = topicKey;
      localStorage.setItem(storageKey, JSON.stringify(saved));
      return { ok: true, lastReadTopic: topicKey };
    } catch {
      return { ok: false, error: 'Local storage error' };
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}/progress/${courseId}/last-read`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify({ topicKey }),
    });

    const data = await response.json();
    if (!response.ok) {
      return { ok: false, error: data.message || 'Failed to save last read topic' };
    }
    return { ok: true, lastReadTopic: data.lastReadTopic };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Network error' };
  }
}

/**
 * Submit quiz result to backend and earn certificate + badge
 * @param {string} courseId
 * @param {{ score: number, totalQuestions: number, passed: boolean }} payload
 * @returns {Promise<{ ok: boolean, quizPassed?: boolean, certificateEarned?: boolean, certificateId?: string, badgeEarned?: boolean, error?: string }>}
 */
export async function submitQuizResult(courseId, { score, totalQuestions = 5, passed }) {
  const token = getStoredToken();
  if (!token) {
    // Unauthenticated localStorage fallback
    try {
      const storageKey = `aptivella_progress_${courseId}`;
      const saved = JSON.parse(localStorage.getItem(storageKey) || '{"completedTopics":[],"bookmarks":[]}');
      saved.quizScore = score;
      saved.quizPassed = passed;
      if (passed) {
        if (!saved.certificateId) {
          const cleanCode = courseId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase();
          saved.certificateId = `APT-2026-${cleanCode}-${Math.floor(10000 + Math.random() * 90000)}`;
          saved.certificateIssuedAt = new Date().toISOString();
        }
        saved.certificateEarned = true;
        saved.badgeEarned = true;
      }
      localStorage.setItem(storageKey, JSON.stringify(saved));

      // Also persist to global achievements storage
      const globalKey = 'aptivella_user_achievements';
      const allAch = JSON.parse(localStorage.getItem(globalKey) || '[]');
      const existingIdx = allAch.findIndex(a => a.courseId === courseId);
      const achRecord = {
        courseId,
        quizScore: score,
        quizPassed: passed,
        certificateEarned: passed,
        certificateId: saved.certificateId,
        certificateIssuedAt: saved.certificateIssuedAt,
        badgeEarned: passed,
      };
      if (existingIdx > -1) {
        allAch[existingIdx] = achRecord;
      } else if (passed) {
        allAch.push(achRecord);
      }
      localStorage.setItem(globalKey, JSON.stringify(allAch));

      return {
        ok: true,
        courseId,
        quizScore: score,
        quizPassed: passed,
        certificateEarned: saved.certificateEarned,
        certificateId: saved.certificateId,
        certificateIssuedAt: saved.certificateIssuedAt,
        badgeEarned: saved.badgeEarned,
      };
    } catch {
      return { ok: false, error: 'Local storage error' };
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}/progress/${courseId}/quiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify({ score, totalQuestions, passed }),
    });

    const data = await response.json();
    if (!response.ok) {
      return { ok: false, error: data.message || 'Failed to submit quiz' };
    }
    return { ok: true, ...data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Network error' };
  }
}

/**
 * Fetch all earned certificates and badges
 * @returns {Promise<{ ok: boolean, achievements?: Array, error?: string }>}
 */
export async function fetchUserAchievements() {
  const token = getStoredToken();
  if (!token) {
    return { ok: true, achievements: [] };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/progress/user/achievements`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    const data = await response.json();
    if (!response.ok) {
      return { ok: false, error: data.message || 'Failed to fetch achievements' };
    }
    return { ok: true, achievements: data.achievements || [] };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Network error' };
  }
}

export { API_BASE_URL };



