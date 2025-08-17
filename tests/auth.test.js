import request from 'supertest';
import app from '../backend/app';
import { TestDatabase, AuthHelper, TestReporter } from './pms.test.js';

describe(' Authentication & Authorization Tests', () => {
  let testReporter;

  beforeAll(async () => {
    testReporter = new TestReporter();
    await TestDatabase.setup();
  });

  afterAll(async () => {
    await TestDatabase.teardown();
    testReporter.generateReport();
  });

  // TC008: Unauthorized Access Prevention
  test('TC008: Unauthorized Access Prevention', async () => {
    const response = await request(app).get('/api/patients');
    const passed = response.status === 401;
    testReporter.recordResult('TC008', 'Unauthorized Access Prevention', passed ? 'passed' : 'failed');
    expect(response.status).toBe(401);
  });

  // TC009: Valid User Login
  test('TC009: Valid User Login', async () => {
    const login = await request(app).post('/api/users/login').send({
      username: 'doctor1',
      password: 'password123'
    });

    const passed = login.status === 200 && login.body.token;
    testReporter.recordResult('TC009', 'Valid User Login', passed ? 'passed' : 'failed');

    expect(login.status).toBe(200);
    expect(login.body.token).toBeDefined();
  });

  // TC010: Invalid Login Credentials
  test('TC010: Invalid Login Credentials', async () => {
    const login = await request(app).post('/api/users/login').send({
      username: 'wronguser',
      password: 'wrongpass'
    });

    const passed = login.status === 400;
    testReporter.recordResult('TC010', 'Invalid Login Credentials', passed ? 'passed' : 'failed');

    expect(login.status).toBe(400);
  });
});
