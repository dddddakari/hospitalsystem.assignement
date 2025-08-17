import request from 'supertest';
import app from '../backend/app';
import { TestDatabase, AuthHelper, TestReporter } from './pms.test.js';

describe('Input Validation Tests', () => {
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

  // TC069: Patient name too long
  test('TC069: Add patient with name longer than 50 characters', async () => {
    const response = await request(app)
      .post('/api/patients')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'A'.repeat(51),
        dob: '1980-01-01',
        medicalHistory: 'N/A'
      });

    const passed = response.status === 400;
    testReporter.recordResult('TC069', 'Name exceeds character limit', passed ? 'passed' : 'failed');

    expect(response.status).toBe(400);
  });

  // TC070: Emoji in name
  test('TC070: Use emoji in patient name', async () => {
    const response = await request(app)
      .post('/api/patients')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: '😀 Emoji Name',
        dob: '1980-01-01',
        medicalHistory: ''
      });

    const passed = response.status === 400;
    testReporter.recordResult('TC070', 'Emoji in name', passed ? 'passed' : 'failed');

    expect(response.status).toBe(400);
  });

  // TC071: DOB in the future
  test('TC071: DOB in future', async () => {
    const response = await request(app)
      .post('/api/patients')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Future Child',
        dob: '2099-01-01',
        medicalHistory: ''
      });

    const passed = response.status === 400;
    testReporter.recordResult('TC071', 'DOB in the future', passed ? 'passed' : 'failed');

    expect(response.status).toBe(400);
  });

  // TC073: Negative billing amount
  test('TC073: Add billing with negative amount', async () => {
    const response = await request(app)
      .post('/api/billing')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        patientId: 'dummyID',
        services: [{ name: 'Refund?', price: -50 }]
      });

    const passed = response.status === 400;
    testReporter.recordResult('TC073', 'Negative billing amount', passed ? 'passed' : 'failed');

    expect(response.status).toBe(400);
  });

  // TC064: XSS in name field
  test('TC064: Attempt XSS via name input', async () => {
    const response = await request(app)
      .post('/api/patients')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: '<script>alert("XSS")</script>',
        dob: '1990-01-01',
        medicalHistory: ''
      });

    const passed = response.status === 400;
    testReporter.recordResult('TC064', 'XSS in name input', passed ? 'passed' : 'failed');

    expect(response.status).toBe(400);
  });
});
