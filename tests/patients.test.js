import request from 'supertest';
import mongoose from 'mongoose';
import app from '../backend/app'; // Updated app.js (no listen)
import Patient from '../backend/models/patient';
import { TestDatabase, AuthHelper, TestReporter } from './pms.test.js'; // Reuse utility classes

describe('🧪 Patient Management Tests', () => {
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

  // TC001: Register New Patient
  test('TC001: Register New Patient', async () => {
    const patientData = {
      name: 'John Doe',
      dob: '1990-01-15',
      medicalHistory: 'None'
    };

    const response = await request(app)
      .post('/api/patients')
      .set('Authorization', `Bearer ${authToken}`)
      .send(patientData);

    const passed = response.status === 201 && response.body.name === 'John Doe';
    testReporter.recordResult('TC001', 'Register New Patient', passed ? 'passed' : 'failed');

    expect(response.status).toBe(201);
    expect(response.body.name).toBe('John Doe');
  });

  // TC002: Invalid DOB Format
  test('TC002: Invalid DOB Format', async () => {
    const patientData = {
      name: 'Invalid DOB',
      dob: 'abc',
      medicalHistory: 'Invalid'
    };

    const response = await request(app)
      .post('/api/patients')
      .set('Authorization', `Bearer ${authToken}`)
      .send(patientData);

    const passed = response.status === 400;
    testReporter.recordResult('TC002', 'Invalid DOB Format', passed ? 'passed' : 'failed');

    expect(response.status).toBe(400);
  });

  // TC004: Search Patients
  test('TC004: Search Patients', async () => {
    const response = await request(app)
      .get('/api/patients')
      .set('Authorization', `Bearer ${authToken}`);

    const passed = response.status === 200 && Array.isArray(response.body);
    testReporter.recordResult('TC004', 'Search Patients', passed ? 'passed' : 'failed');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // TC005: Update Patient Information
  test('TC005: Update Patient Information', async () => {
    const [patient] = await Patient.find().limit(1);

    const updateData = {
      name: 'Updated Name',
      medicalHistory: 'Updated notes'
    };

    const response = await request(app)
      .put(`/api/patients/${patient._id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateData);

    const passed = response.status === 200 && response.body.name === 'Updated Name';
    testReporter.recordResult('TC005', 'Update Patient Information', passed ? 'passed' : 'failed');

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Updated Name');
  });

  // TC012: Required Field Validation (missing name)
  test('TC012: Required Field Validation', async () => {
    const patientData = {
      dob: '1990-01-15',
      medicalHistory: 'Testing'
    };

    const response = await request(app)
      .post('/api/patients')
      .set('Authorization', `Bearer ${authToken}`)
      .send(patientData);

    const passed = response.status === 400;
    testReporter.recordResult('TC012', 'Required Field Validation', passed ? 'passed' : 'failed');

    expect(response.status).toBe(400);
  });

  // TC013: End-to-End Patient Flow
  test('TC013: End-to-End Patient Flow', async () => {
    const newPatient = {
      name: 'Integration Flow Test',
      dob: '1980-02-10',
      medicalHistory: 'E2E test'
    };

    // Create
    const create = await request(app)
      .post('/api/patients')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newPatient);
    expect(create.status).toBe(201);
    const id = create.body._id;

    // Read
    const get = await request(app)
      .get(`/api/patients/${id}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(get.status).toBe(200);
    expect(get.body.name).toBe('Integration Flow Test');

    // Update
    const update = await request(app)
      .put(`/api/patients/${id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Updated E2E' });
    expect(update.status).toBe(200);

    // Delete
    const del = await request(app)
      .delete(`/api/patients/${id}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(del.status).toBe(200);

    testReporter.recordResult('TC013', 'End-to-End Patient Flow', 'passed');
  });
});
