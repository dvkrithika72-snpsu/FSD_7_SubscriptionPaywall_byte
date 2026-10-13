import fetch from 'node:test'; // using global fetch

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('--- STARTING AUTH & DATA ISOLATION TESTS ---');

  // Test 1: Unauthenticated request to /api/auth/me must return 401
  const resGuestMe = await globalThis.fetch(`${BASE_URL}/auth/me`);
  console.log(`[Test 1] Guest /api/auth/me status: ${resGuestMe.status} (Expected: 401)`);
  if (resGuestMe.status !== 401) throw new Error('Guest was allowed to access /api/auth/me');

  // Test 2: Unauthenticated request to /api/progress/user/achievements must return 401
  const resGuestAch = await globalThis.fetch(`${BASE_URL}/progress/user/achievements`);
  console.log(`[Test 2] Guest /api/progress/user/achievements status: ${resGuestAch.status} (Expected: 401)`);
  if (resGuestAch.status !== 401) throw new Error('Guest was allowed to access /api/progress/user/achievements');

  // Test 3: Register User Alpha
  const alphaEmail = `alpha_${Date.now()}@example.com`;
  const resRegAlpha = await globalThis.fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Alpha Tester', email: alphaEmail, password: 'password123' })
  });
  const dataAlpha = await resRegAlpha.json();
  console.log(`[Test 3] User Alpha registered. Name: "${dataAlpha.user?.name}", Email: "${dataAlpha.user?.email}"`);
  if (dataAlpha.user?.name !== 'Alpha Tester') throw new Error('User Alpha name mismatch');

  // Test 4: Alpha fetches /api/auth/me
  const resMeAlpha = await globalThis.fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${dataAlpha.token}` }
  });
  const meAlpha = await resMeAlpha.json();
  console.log(`[Test 4] Alpha /me response name: "${meAlpha.user?.name}" (Expected: Alpha Tester)`);
  if (meAlpha.user?.name !== 'Alpha Tester') throw new Error('Alpha /me mismatch');

  // Test 5: Alpha submits a quiz result
  const resQuizAlpha = await globalThis.fetch(`${BASE_URL}/progress/react-for-beginners/quiz`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${dataAlpha.token}`
    },
    body: JSON.stringify({ score: 100, totalQuestions: 5, passed: true })
  });
  const quizAlpha = await resQuizAlpha.json();
  console.log(`[Test 5] Alpha quiz passed: ${quizAlpha.quizPassed}, cert: ${quizAlpha.certificateId}`);

  // Test 6: Alpha achievements
  const resAchAlpha = await globalThis.fetch(`${BASE_URL}/progress/user/achievements`, {
    headers: { Authorization: `Bearer ${dataAlpha.token}` }
  });
  const achAlpha = await resAchAlpha.json();
  console.log(`[Test 6] Alpha achievements count: ${achAlpha.achievements?.length} (Expected: 1)`);
  if (achAlpha.achievements?.length !== 1) throw new Error('Alpha achievements should be 1');

  // Test 7: Register User Beta
  const betaEmail = `beta_${Date.now()}@example.com`;
  const resRegBeta = await globalThis.fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Beta Learner', email: betaEmail, password: 'password123' })
  });
  const dataBeta = await resRegBeta.json();
  console.log(`[Test 7] User Beta registered. Name: "${dataBeta.user?.name}", Email: "${dataBeta.user?.email}"`);
  if (dataBeta.user?.name !== 'Beta Learner') throw new Error('User Beta name mismatch');

  // Test 8: Beta fetches /api/auth/me -> Must NOT be Alpha or Krithika
  const resMeBeta = await globalThis.fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${dataBeta.token}` }
  });
  const meBeta = await resMeBeta.json();
  console.log(`[Test 8] Beta /me response name: "${meBeta.user?.name}" (Expected: Beta Learner)`);
  if (meBeta.user?.name !== 'Beta Learner') throw new Error('Beta /me should be Beta Learner');

  // Test 9: Data Isolation: Beta achievements must be 0 (Alpha's quiz result must not leak)
  const resAchBeta = await globalThis.fetch(`${BASE_URL}/progress/user/achievements`, {
    headers: { Authorization: `Bearer ${dataBeta.token}` }
  });
  const achBeta = await resAchBeta.json();
  console.log(`[Test 9] Beta achievements count: ${achBeta.achievements?.length} (Expected: 0 - completely isolated)`);
  if (achBeta.achievements?.length !== 0) throw new Error('Beta saw Alpha achievements! Data leak!');

  console.log('--- ALL BACKEND AUTH & DATA ISOLATION TESTS PASSED! ---');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
