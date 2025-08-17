import request from 'supertest';
import mongoose from 'mongoose';
import app from '../backend/app';
import Patient from '../backend/models/patient';
import User from '../backend/models/user';
import { TestDatabase, AuthHelper, TestReporter } from './pms.test.js';

describe(' Appointment Management Tests', () => {
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

  // TC003: Schedule Appointment
  test('TC003: Schedule Appointment', async () => {
    const [patient] = await Patient.find().limit(1);
    const [doctor] = await User.find({ role: 'admin' }).limit(1);

    const appointmentData = {
      patientId: patient._id,
      doctorId: doctor._id,
      date: new Date(Date.now() + 86400000),
      time: '10:00',
      notes: 'Routine checkup'
    };

    const response = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${authToken}`)
      .send(appointmentData);

    const passed = response.status === 201;
    testReporter.recordResult('TC003', 'Schedule Appointment', passed ? 'passed' : 'failed');

    expect(response.status).toBe(201);
  });

  // TC006: Appointment Conflict Detection
  test('TC006: Appointment Conflict Detection', async () => {
    const [patient] = await Patient.find().limit(1);
    const [doctor] = await User.find({ role: 'admin' }).limit(1);

    const conflictData = {
      patientId: patient._id,
      doctorId: doctor._id,
      date: new Date(Date.now() + 86400000),
      time: '10:00',
      notes: 'Possible conflict'
    };

    const response = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${authToken}`)
      .send(conflictData);

    const passed = response.status === 400;
    testReporter.recordResult('TC006', 'Appointment Conflict Detection', passed ? 'passed' : 'failed');

    expect([400, 409]).toContain(response.status);
  });

  // TC007: Get All Appointments
  test('TC007: Get All Appointments', async () => {
    const response = await request(app)
      .get('/api/appointments')
      .set('Authorization', `Bearer ${authToken}`);

    const passed = response.status === 200 && Array.isArray(response.body);
    testReporter.recordResult('TC007', 'Get All Appointments', passed ? 'passed' : 'failed');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
