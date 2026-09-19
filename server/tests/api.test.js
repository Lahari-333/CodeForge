const request = require('supertest');
const app = require('../src/app');
const { pool } = require('../src/config/db');

describe('CodeForge API Integration Tests', () => {
  let demoToken = '';
  let adminToken = '';
  const testUser = {
    name: 'Test Runner',
    username: `testuser_${Date.now()}`,
    email: `testuser_${Date.now()}@codeforge.dev`,
    password: 'TestPassword@123',
    confirmPassword: 'TestPassword@123'
  };

  afterAll(async () => {
    // Clean up test user if created
    if (testUser.username) {
      await pool.query('DELETE FROM users WHERE username = ?', [testUser.username]);
    }
    await pool.end();
  });

  // 1. Health Check
  test('GET /api/health returns health status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.services.database).toBe('connected');
  });

  // 2. Authentication & Validation
  test('POST /api/auth/register fails on password mismatch', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Mismatch User',
        username: 'mismatch_user',
        email: 'mismatch@example.com',
        password: 'Password123',
        confirmPassword: 'DifferentPassword'
      });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/auth/register creates a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.username).toBe(testUser.username);
    expect(res.body.data.token).toBeDefined();
  });

  test('POST /api/auth/register rejects duplicate registration', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/auth/login rejects incorrect password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        identifier: testUser.username,
        password: 'WrongPassword'
      });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/auth/login logs in regular demo user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        identifier: 'demouser',
        password: 'DemoPassword@123'
      });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.role).toBe('USER');
    demoToken = res.body.data.token;
  });

  test('POST /api/auth/login logs in admin user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        identifier: 'admin',
        password: 'AdminPassword@123'
      });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.role).toBe('ADMIN');
    adminToken = res.body.data.token;
  });

  // 3. Protected Routes
  test('GET /api/auth/me rejects unauthenticated request', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  test('GET /api/auth/me accepts authenticated request with token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${demoToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.user.username).toBe('demouser');
  });

  // 4. Problems API & Hidden Test Cases Security
  test('GET /api/problems lists seeded coding problems', async () => {
    const res = await request(app).get('/api/problems');
    expect(res.status).toBe(200);
    expect(res.body.data.problems.length).toBeGreaterThanOrEqual(10);
    expect(res.body.data.pagination.total).toBeGreaterThanOrEqual(10);
  });

  test('GET /api/problems/two-sum returns problem and ONLY sample test cases', async () => {
    const res = await request(app).get('/api/problems/two-sum');
    expect(res.status).toBe(200);
    expect(res.body.data.problem.title).toBe('Two Sum');
    expect(res.body.data.problem.sampleTestCases).toBeDefined();
    // Verify that all returned test cases have is_sample === 1
    const cases = res.body.data.problem.sampleTestCases;
    expect(cases.length).toBeGreaterThan(0);
    cases.forEach(c => {
      expect(c.is_sample).toBeTruthy();
    });
  });

  // 5. Authorization: Admin vs Regular User
  test('POST /api/problems rejects non-admin user (403 Forbidden)', async () => {
    const res = await request(app)
      .post('/api/problems')
      .set('Authorization', `Bearer ${demoToken}`)
      .send({
        title: 'Unauthorized Problem',
        description: 'Should fail',
        difficulty: 'Easy',
        category: 'Algorithms',
        test_cases: [{ input: '1', expected_output: '1', is_sample: true }, { input: '2', expected_output: '2', is_sample: false }]
      });
    expect(res.status).toBe(403);
  });

  test('POST /api/problems allows ADMIN user (201 Created)', async () => {
    const newProbTitle = `Admin Problem ${Date.now()}`;
    const res = await request(app)
      .post('/api/problems')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: newProbTitle,
        description: 'Created by admin in automated test.',
        difficulty: 'Medium',
        category: 'Testing',
        constraints: '1 <= N <= 100',
        input_format: 'Single integer',
        output_format: 'Single integer',
        examples: [{ input: '5', output: '5', explanation: 'Echo' }],
        test_cases: [
          { input: '5', expected_output: '5', is_sample: true },
          { input: '10', expected_output: '10', is_sample: false }
        ]
      });
    expect(res.status).toBe(201);
    expect(res.body.data.problem.title).toBe(newProbTitle);

    // Clean up created problem
    if (res.body.data.problem.id) {
      await pool.query('DELETE FROM problems WHERE id = ?', [res.body.data.problem.id]);
    }
  });

  // 6. Code Execution API Validation
  test('POST /api/execute rejects invalid language', async () => {
    const res = await request(app)
      .post('/api/execute')
      .send({
        language: 'ruby',
        code: 'puts "hello"'
      });
    expect(res.status).toBe(400);
    expect(res.body.errors.language).toBeDefined();
  });

  test('POST /api/execute rejects empty source code', async () => {
    const res = await request(app)
      .post('/api/execute')
      .send({
        language: 'python',
        code: ''
      });
    expect(res.status).toBe(400);
    expect(res.body.errors.code).toBeDefined();
  });

  // 7. Dashboard and User Profile
  test('GET /api/users/profile returns user profile with statistics', async () => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${demoToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.user.username).toBe('demouser');
    expect(res.body.data.stats).toBeDefined();
    expect(res.body.data.stats.totalProblems).toBeGreaterThanOrEqual(10);
  });

  test('GET /api/users/dashboard returns dashboard data', async () => {
    const res = await request(app)
      .get('/api/users/dashboard')
      .set('Authorization', `Bearer ${demoToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.stats).toBeDefined();
    expect(res.body.data.recommendedProblems).toBeDefined();
  });
});
