import request from 'supertest';
import app from '../backend/app';
import { TestDatabase, AuthHelper, TestReporter } from './pms.test.js';

describe('Performance Tests', () => {
  let authToken;
  let testReporter;

  beforeAll(async () => {
    testReporter = new TestReporter();
    await TestDatabase.setup();
    authToken = await AuthHelper.getAuthToken();
  });

  afterAll(async () => {
    await TestDatabase.teardown();
    testReporter.generateReport();
  });

  async function timedRequest(name, endpoint, method = 'get', payload = null) {
    const start = Date.now();

    let response;
    if (method === 'get') {
      response = await request(app)
        .get(endpoint)
        .set('Authorization', `Bearer ${authToken}`);
    } else if (method === 'post') {
      response = await request(app)
        .post(endpoint)
        .set('Authorization', `Bearer ${authToken}`)
        .send(payload);
    }

    const duration = Date.now() - start;
    const passed = response.status === 200 && duration < 1000;

    testReporter.recordResult(name, `Performance: ${endpoint}`, passed ? 'passed' : 'failed', `Response time: ${duration}ms`);
    expect(duration).toBeLessThan(1000);
  }

  // TC011: Patient Search Performance
  test('TC011: /api/patients should respond < 1000ms', async () => {
    await timedRequest('TC011', '/api/patients');
  });

  test('TC020: /api/appointments should respond < 1000ms', async () => {
    await timedRequest('TC020', '/api/appointments');
  });

  test('TC021: /api/billing should respond < 1000ms', async () => {
    await timedRequest('TC021', '/api/billing');
  });

  test('TC022: /api/users/login should respond < 1000ms', async () => {
    const loginPayload = { username: 'doctor1', password: 'password123' };
    await timedRequest('TC022', '/api/users/login', 'post', loginPayload);
  });
});
