import request from 'supertest';
import app from '../backend/app';
import Patient from '../backend/models/patient';
import { TestDatabase, AuthHelper, TestReporter } from './pms.test.js';

describe('Patient Search & Filter Tests', () => {
  let authToken;
  let testReporter;

  beforeAll(async () => {
    testReporter = new TestReporter();
    await TestDatabase.setup();
    authToken = await AuthHelper.getAuthToken();

    // Seed multiple patients
    await Patient.insertMany([
      { name: 'Alice Smith', dob: '1990-01-01', medicalHistory: 'Diabetes' },
      { name: 'Bob Jones', dob: '1985-05-10', medicalHistory: 'Hypertension' },
      { name: 'Charlie Brown', dob: '1975-12-12', medicalHistory: 'Asthma' },
    ]);
  });

  afterAll(async () => {
    await TestDatabase.teardown();
    testReporter.generateReport();
  });

  // TC023: Filter by name
  test('TC023: Filter patients by name', async () => {
    const res = await request(app)
      .get('/api/patients?name=alice')
      .set('Authorization', `Bearer ${authToken}`);

    const passed = res.status === 200 && res.body.some(p => p.name.includes('Alice'));
    testReporter.recordResult('TC023', 'Filter by name', passed ? 'passed' : 'failed');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(expect.arrayContaining([expect.objectContaining({ name: 'Alice Smith' })]));
  });

  // TC024: Filter by condition
  test('TC024: Filter by condition (asthma)', async () => {
    const res = await request(app)
      .get('/api/patients?condition=asthma')
      .set('Authorization', `Bearer ${authToken}`);

    const passed = res.status === 200 && res.body.some(p => p.medicalHistory.toLowerCase().includes('asthma'));
    testReporter.recordResult('TC024', 'Filter by condition', passed ? 'passed' : 'failed');

    expect(res.status).toBe(200);
  });

  // TC025: Sort by DOB descending
  test('TC025: Sort patients by DOB descending', async () => {
    const res = await request(app)
      .get('/api/patients?sort=dob_desc')
      .set('Authorization', `Bearer ${authToken}`);

    const dates = res.body.map(p => new Date(p.dob));
    const sorted = [...dates].sort((a, b) => b - a);
    const passed = JSON.stringify(dates) === JSON.stringify(sorted);
    testReporter.recordResult('TC025', 'Sort by DOB descending', passed ? 'passed' : 'failed');

    expect(passed).toBe(true);
  });

  // TC026: Pagination works
  test('TC026: Limit results to 2 per page', async () => {
    const res = await request(app)
      .get('/api/patients?page=1&limit=2')
      .set('Authorization', `Bearer ${authToken}`);

    const passed = res.status === 200 && res.body.length <= 2;
    testReporter.recordResult('TC026', 'Pagination (limit=2)', passed ? 'passed' : 'failed');

    expect(res.status).toBe(200);
    expect(res.body.length).toBeLessThanOrEqual(2);
  });
});
