/**
 * APTIVELLA Subscription Plans
 * Strict server-side authority for pricing, amounts, and validity periods.
 * All amounts are defined in the smallest currency unit (INR Paise: 1 INR = 100 Paise).
 * Never trust client-supplied amounts or prices.
 */

export const SUBSCRIPTION_PLANS = {
  monthly: {
    id: 'monthly',
    name: 'Monthly Pro',
    subText: 'Flexible learning, cancel anytime',
    priceINR: 399,
    amountPaise: 39900, // ₹399 in paise
    currency: 'INR',
    durationDays: 30,
    billedText: 'Billed monthly (₹399/mo)',
    description: 'Aptivella Pro - 30 Days Access',
  },
  quarterly: {
    id: 'quarterly',
    name: 'Quarterly Pro',
    subText: 'Best value for focused growth',
    priceINR: 999,
    amountPaise: 99900, // ₹999 in paise
    currency: 'INR',
    durationDays: 90,
    billedText: 'Billed quarterly (₹333/mo)',
    description: 'Aptivella Pro - 90 Days Access',
  },
  yearly: {
    id: 'yearly',
    name: 'Yearly Pro',
    subText: 'Maximum savings & full acceleration',
    priceINR: 2999,
    amountPaise: 299900, // ₹2,999 in paise
    currency: 'INR',
    durationDays: 365,
    billedText: 'Billed annually (₹250/mo)',
    description: 'Aptivella Pro - 365 Days Access',
  },
};

/**
 * Validate plan ID
 * @param {string} planId
 * @returns {boolean}
 */
export function isValidPlan(planId) {
  return Boolean(planId && SUBSCRIPTION_PLANS[planId]);
}

/**
 * Get plan details by ID
 * @param {string} planId
 * @returns {object|null}
 */
export function getPlan(planId) {
  return SUBSCRIPTION_PLANS[planId] || null;
}
