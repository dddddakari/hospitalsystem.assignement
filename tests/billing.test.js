import request from 'supertest';
import app from '../backend/app';
import Patient from '../backend/models/patient';
import { TestDatabase, AuthHelper, TestReporter } from './pms.test.js';

describe('Billing Tests', () => {
  let authToken;
  let testReporter;
  let patientId;

  beforeAll(async () => {
    testReporter = new TestReporter();
    await TestDatabase.setup();
    authToken = await AuthHelper.getAuthToken();

    // Ensure a patient exists
    const patient = await Patient.create({
      name: 'Billing Test Patient',
      dob: '1980-01-01',
      medicalHistory: 'N/A'
    });

    patientId = patient._id;
  });

  afterAll(async () => {
    await TestDatabase.teardown();
    testReporter.generateReport();
  });

  // TC074: Bill for single service
  test('TC074: Bill for service costing $50', async () => {
    const payload = {
      patientId,
      services: [{ name: 'Consultation', price: 50 }]
    };

    const response = await request(app)
      .post('/api/billing')
      .set('Authorization', `Bearer ${authToken}`)
      .send(payload);

    const passed = response.status === 201 && response.body.total === 50;
    testReporter.recordResult('TC074', 'Bill for service costing $50', passed ? 'passed' : 'failed');

    expect(response.status).toBe(201);
    expect(response.body.total).toBe(50);
  });

  // TC075: Bill multiple services
  test('TC075: Bill multiple services totaling $80', async () => {
    const payload = {
      patientId,
      services: [
        { name: 'X-Ray', price: 50 },
        { name: 'Blood Test', price: 30 }
      ]
    };

    const response = await request(app)
      .post('/api/billing')
      .set('Authorization', `Bearer ${authToken}`)
      .send(payload);

    const passed = response.status === 201 && response.body.total === 80;
    testReporter.recordResult('TC075', 'Bill multiple services', passed ? 'passed' : 'failed');

    expect(response.body.total).toBe(80);
  });

  // TC076: Tax calculation
  test('TC076: Add tax to bill', async () => {
    const payload = {
      patientId,
      services: [{ name: 'Ultrasound', price: 100 }],
      tax: 10
    };

    const response = await request(app)
      .post('/api/billing')
      .set('Authorization', `Bearer ${authToken}`)
      .send(payload);

    const passed = response.status === 201 && response.body.total === 110;
    testReporter.recordResult('TC076', 'Add tax to bill', passed ? 'passed' : 'failed');

    expect(response.body.total).toBe(110);
  });

  // TC077: Apply discount
  test('TC077: Apply discount to bill', async () => {
    const payload = {
      patientId,
      services: [{ name: 'ECG', price: 100 }],
      discount: 20
    };

    const response = await request(app)
      .post('/api/billing')
      .set('Authorization', `Bearer ${authToken}`)
      .send(payload);

    const passed = response.status === 201 && response.body.total === 80;
    testReporter.recordResult('TC077', 'Apply discount to bill', passed ? 'passed' : 'failed');

    expect(response.body.total).toBe(80);
  });

  // TC078: Round total to 2 decimal places
  test('TC078: Round to two decimal places', async () => {
    const payload = {
      patientId,
      services: [{ name: 'Test', price: 50.999 }]
    };

    const response = await request(app)
      .post('/api/billing')
      .set('Authorization', `Bearer ${authToken}`)
      .send(payload);

    const passed = response.status === 201 && response.body.total === 51.00;
    testReporter.recordResult('TC078', 'Round to two decimal places', passed ? 'passed' : 'failed');

    expect(response.body.total).toBeCloseTo(51.00, 2);
  });
});
