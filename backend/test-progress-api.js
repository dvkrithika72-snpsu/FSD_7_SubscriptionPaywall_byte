/**
 * Automated test suite for Aptivella Course Reading Progress & Bookmarks API
 */

const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('=== Starting Course Notes Progress & Bookmarks API Verification ===\n');
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

  // 1. Unauthenticated request to /api/progress/react-for-beginners should return 401
  console.log('Test 1: Unauthenticated Guard on Progress Route');
  const unauthRes = await fetch(`${BASE_URL}/api/progress/react-for-beginners`);
  assert(unauthRes.status === 401, 'Rejects unauthenticated request with HTTP 401');

  // 2. Register/Login a test user to test progress endpoints
  const testEmail = `reader_${Date.now()}@example.com`;
  console.log(`\nTest 2: Create Test Student (${testEmail})`);
  const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Reading Student',
      email: testEmail,
      password: 'Password123!',
    }),
  });
  const regData = await regRes.json();
  assert(regRes.status === 201, 'Student registered successfully');
  const token = regData.token;
  assert(!!token, 'Auth token received');

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  // 3. GET /api/progress/:courseId for a fresh course
  console.log('\nTest 3: Fetch Initial Progress for Course');
  const initRes = await fetch(`${BASE_URL}/api/progress/react-for-beginners`, { headers });
  const initData = await initRes.json();
  assert(initRes.status === 200, 'Returns HTTP 200 for initial progress query');
  assert(initData.ok === true, 'Response ok flag is true');
  assert(Array.isArray(initData.completedTopics) && initData.completedTopics.length === 0, 'completedTopics is empty array');
  assert(Array.isArray(initData.bookmarks) && initData.bookmarks.length === 0, 'bookmarks is empty array');
  assert(initData.percentComplete === 0, 'percentComplete is 0');

  // 4. POST /api/progress/:courseId/toggle-complete
  console.log('\nTest 4: Toggle Topic Completion Status');
  const comp1Res = await fetch(`${BASE_URL}/api/progress/react-for-beginners/toggle-complete`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ topicKey: 'm0_t0', totalTopicsCount: 4 }),
  });
  const comp1Data = await comp1Res.json();
  assert(comp1Res.status === 200, 'Toggles completion with HTTP 200');
  assert(comp1Data.isCompleted === true, 'Topic m0_t0 marked completed');
  assert(comp1Data.completedTopics.includes('m0_t0'), 'completedTopics includes m0_t0');
  assert(comp1Data.percentComplete === 25, 'Progress percent calculated (1/4 = 25%)');

  // 5. Mark second topic complete
  console.log('\nTest 5: Mark Second Topic Complete & Check Percent');
  const comp2Res = await fetch(`${BASE_URL}/api/progress/react-for-beginners/toggle-complete`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ topicKey: 'm0_t1', totalTopicsCount: 4 }),
  });
  const comp2Data = await comp2Res.json();
  assert(comp2Data.completedTopics.length === 2, '2 topics now completed');
  assert(comp2Data.percentComplete === 50, 'Progress percent is now 50%');

  // 6. Untoggle first topic
  console.log('\nTest 6: Untoggle Topic Completion');
  const uncompRes = await fetch(`${BASE_URL}/api/progress/react-for-beginners/toggle-complete`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ topicKey: 'm0_t0', totalTopicsCount: 4 }),
  });
  const uncompData = await uncompRes.json();
  assert(uncompData.isCompleted === false, 'Topic m0_t0 uncompleted');
  assert(!uncompData.completedTopics.includes('m0_t0'), 'completedTopics no longer contains m0_t0');
  assert(uncompData.percentComplete === 25, 'Progress percent reduced to 25%');

  // 7. POST /api/progress/:courseId/toggle-bookmark
  console.log('\nTest 7: Toggle Bookmarks');
  const bm1Res = await fetch(`${BASE_URL}/api/progress/react-for-beginners/toggle-bookmark`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ topicKey: 'm0_t2' }),
  });
  const bm1Data = await bm1Res.json();
  assert(bm1Res.status === 200, 'Bookmark toggled with HTTP 200');
  assert(bm1Data.isBookmarked === true, 'Topic m0_t2 is bookmarked');
  assert(bm1Data.bookmarks.includes('m0_t2'), 'bookmarks array includes m0_t2');

  // 8. POST /api/progress/:courseId/last-read
  console.log('\nTest 8: Set Last Read Topic');
  const lrRes = await fetch(`${BASE_URL}/api/progress/react-for-beginners/last-read`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ topicKey: 'm0_t3' }),
  });
  const lrData = await lrRes.json();
  assert(lrRes.status === 200, 'Last read set with HTTP 200');
  assert(lrData.lastReadTopic === 'm0_t3', 'Last read recorded as m0_t3');

  // 9. Fetch persisted progress to confirm DB persistence
  console.log('\nTest 9: Verify Persisted State in Database');
  const finalRes = await fetch(`${BASE_URL}/api/progress/react-for-beginners`, { headers });
  const finalData = await finalRes.json();
  assert(finalData.completedTopics.includes('m0_t1'), 'Persisted completed topic m0_t1');
  assert(finalData.bookmarks.includes('m0_t2'), 'Persisted bookmarked topic m0_t2');
  assert(finalData.lastReadTopic === 'm0_t3', 'Persisted last read topic m0_t3');
  assert(finalData.percentComplete === 25, 'Persisted percentComplete');

  console.log(`\n=== Progress API Verification Summary ===`);
  console.log(`Total: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test suite execution failed:', err);
  process.exit(1);
});
