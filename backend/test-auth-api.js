/**
 * Automated test suite for Aptivella Phase 3A Authentication & Authorization API
 */

const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('=== Starting Phase 3A Auth API Verification ===\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. GET /api/health
  console.log('Test 1: GET /api/health');
  const healthRes = await fetch(`${BASE_URL}/api/health`);
  const healthData = await healthRes.json();
  assert(healthRes.status === 200, 'Health endpoint responds with HTTP 200');
  assert(healthData.status === 'ok', 'Health status is "ok"');
  assert(typeof healthData.uptime === 'number', 'Uptime is returned as a number');

  // 2. POST /api/auth/register - Input Validation
  console.log('\nTest 2: Input Validation on Registration');
  const badRegRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'A', email: 'invalid-email', password: '123' }),
  });
  const badRegData = await badRegRes.json();
  assert(badRegRes.status === 400, 'Rejects invalid input with HTTP 400');
  assert(!!badRegData.message, 'Returns informative validation error message');

  // 3. POST /api/auth/register - Successful Registration & Default Free Status
  console.log('\nTest 3: Valid Registration & Client Privilege Escalation Prevention');
  const testUser = {
    name: 'Ananya Roy',
    email: `ananya_${Date.now()}@aptivella.io`,
    password: 'SecurePassword123!',
    subscription: { status: 'pro' }, // Attempting client privilege escalation!
  };

  const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testUser),
  });
  const regData = await regRes.json();
  assert(regRes.status === 201, 'Successfully registers with HTTP 201');
  assert(typeof regData.token === 'string', 'Returns JWT access token string');
  assert(regData.user.name === 'Ananya Roy', 'Returned user name matches');
  assert(regData.user.email === testUser.email.toLowerCase(), 'Normalized email stored');
  assert(regData.user.password === undefined, 'Plaintext password or hash is NEVER returned');
  assert(regData.user.subscription.status === 'free', 'Subscription status strictly defaulted to "free" (client override ignored)');

  const userToken = regData.token;

  // 4. POST /api/auth/register - Duplicate Email Rejection
  console.log('\nTest 4: Duplicate Email Rejection');
  const dupRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Duplicate Attempt',
      email: testUser.email.toUpperCase(), // Case insensitive duplicate check
      password: 'AnotherPassword456!',
    }),
  });
  const dupData = await dupRes.json();
  assert(dupRes.status === 409, 'Rejects duplicate email with HTTP 409 Conflict');
  assert(dupData.message.includes('already exists'), 'Safe error message stating email already exists');

  // 5. POST /api/auth/login - Invalid Credentials
  console.log('\nTest 5: Login with Invalid Credentials');
  const badLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testUser.email, password: 'WrongPassword999' }),
  });
  const badLoginData = await badLoginRes.json();
  assert(badLoginRes.status === 401, 'Rejects wrong password with HTTP 401 Unauthorized');
  assert(badLoginData.message === 'Invalid email address or password', 'Safe error message does not leak field details');

  // 6. POST /api/auth/login - Successful Authentication
  console.log('\nTest 6: Successful Login');
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testUser.email, password: testUser.password }),
  });
  const loginData = await loginRes.json();
  assert(loginRes.status === 200, 'Logs in successfully with HTTP 200');
  assert(typeof loginData.token === 'string', 'Returns new JWT token');
  assert(loginData.user.subscription.status === 'free', 'User subscription is "free"');

  // 7. GET /api/auth/me - Authenticated Profile Retrieval
  console.log('\nTest 7: Authenticated Profile Retrieval (GET /api/auth/me)');
  const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  const meData = await meRes.json();
  assert(meRes.status === 200, 'Responds with HTTP 200 for authenticated user');
  assert(meData.user.name === 'Ananya Roy', 'Returns profile name');
  assert(meData.user.subscription.status === 'free', 'Returns actual DB subscription status');

  // 8. GET /api/auth/me - Unauthorized Access
  console.log('\nTest 8: Unauthorized Access Rejection');
  const noAuthRes = await fetch(`${BASE_URL}/api/auth/me`);
  assert(noAuthRes.status === 401, 'Rejects request without Authorization header with HTTP 401');

  const badTokenRes = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Authorization: 'Bearer this.is.an.invalid.token' },
  });
  assert(badTokenRes.status === 401, 'Rejects invalid token with HTTP 401');

  // 9. Course Access Entitlement Verification
  console.log('\nTest 9: Backend Course Access Entitlement');
  const freeCourseRes = await fetch(`${BASE_URL}/api/auth/verify-access/react-for-beginners`);
  const freeCourseData = await freeCourseRes.json();
  assert(freeCourseData.accessible === true, 'Free course is accessible to guests');

  const proCourseGuestRes = await fetch(`${BASE_URL}/api/auth/verify-access/mongodb-atlas`);
  const proCourseGuestData = await proCourseGuestRes.json();
  assert(proCourseGuestData.accessible === false, 'Pro course is locked for unauthenticated guests');

  const proCourseUserRes = await fetch(`${BASE_URL}/api/auth/verify-access/mongodb-atlas`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  const proCourseUserData = await proCourseUserRes.json();
  assert(proCourseUserData.accessible === false, 'Pro course is locked for Free subscription user');
  assert(proCourseUserData.currentStatus === 'free', 'Current subscription status returned as "free"');

  console.log(`\n===========================================`);
  console.log(`Total tests run: ${passed + failed}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`===========================================`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
