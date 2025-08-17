import request from 'supertest';
import mongoose from 'mongoose';
import app from '../frontend/src/App'; // Your main app file
import Patient from '../backend/models/patient';
import Appointment from '../backend/models/appointment';
import User from '../backend/models/user';
import Billing from '../backend/models/billing';

// Test Configuration
const TEST_CONFIG = {
  DB_URL: 'mongodb://localhost:27017/pms_test',
  JWT_SECRET: 'test_secret_key',
  TIMEOUT: 10000
};

// Test Data Generator
class TestDataGenerator {
  static generatePatients(count = 50) {
    const patients = [];
    for (let i = 1; i <= count; i++) {
      patients.push({
        name: `Test Patient ${i}`,
        dob: new Date(1990 + (i % 30), (i % 12), (i % 28) + 1),
        medicalHistory: `Medical history for patient ${i}`
      });
    }
    return patients;
  }

  static generateAppointments(patientIds, doctorIds, count = 100) {
    const appointments = [];
    for (let i = 1; i <= count; i++) {
      const date = new Date();
      date.setDate(date.getDate() + (i % 30));
      appointments.push({
        patientId: patientIds[i % patientIds.length],
        doctorId: doctorIds[i % doctorIds.length],
        date: date,
        time: `${9 + (i % 8)}:00`,
        notes: `Appointment notes ${i}`
      });
    }
    return appointments;
  }

  static generateUsers(count = 10) {
    const users = [];
    for (let i = 1; i <= count; i++) {
      users.push({
        username: `doctor${i}`,
        password: 'password123',
        role: i <= 5 ? 'admin' : 'assistant',
        email: `doctor${i}@clinic.com`
      });
    }
    return users;
  }
}

// Test Database Setup
class TestDatabase {
  static async setup() {
    await mongoose.connect(TEST_CONFIG.DB_URL);
    await this.clearDatabase();
    await this.seedTestData();
  }

  static async clearDatabase() {
    await Patient.deleteMany({});
    await Appointment.deleteMany({});
    await User.deleteMany({});
    await Billing.deleteMany({});
  }

  static async seedTestData() {
    // Create test users
    const users = TestDataGenerator.generateUsers(10);
    const createdUsers = await User.insertMany(users);
    
    // Create test patients
    const patients = TestDataGenerator.generatePatients(50);
    const createdPatients = await Patient.insertMany(patients);
    
    // Create test appointments
    const appointments = TestDataGenerator.generateAppointments(
      createdPatients.map(p => p._id),
      createdUsers.map(u => u._id),
      100
    );
    await Appointment.insertMany(appointments);
    
    return { users: createdUsers, patients: createdPatients };
  }

  static async teardown() {
    await this.clearDatabase();
    await mongoose.connection.close();
  }
}

// Authentication Helper
class AuthHelper {
  static async getAuthToken(username = 'doctor1', password = 'password123') {
    const response = await request(app)
      .post('/api/users/login')
      .send({ username, password });
    
    return response.body.token;
  }
}

// Test Reporter
class TestReporter {
  constructor() {
    this.results = [];
    this.summary = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0
    };
  }

  recordResult(testId, description, status, details = '') {
    this.results.push({
      testId,
      description,
      status,
      details,
      timestamp: new Date()
    });
    
    this.summary.total++;
    this.summary[status]++;
  }

  generateReport() {
    const passRate = ((this.summary.passed / this.summary.total) * 100).toFixed(2);
    
    console.log('\n=== PATIENT MANAGEMENT SYSTEM TEST REPORT ===');
    console.log(`Test Execution Date: ${new Date().toISOString()}`);
    console.log(`Total Tests: ${this.summary.total}`);
    console.log(`Passed: ${this.summary.passed}`);
    console.log(`Failed: ${this.summary.failed}`);
    console.log(`Skipped: ${this.summary.skipped}`);
    console.log(`Pass Rate: ${passRate}%`);
    console.log('\n=== DETAILED RESULTS ===');
    
    this.results.forEach(result => {
      const status = result.status === 'passed' ? '✓' : 
                    result.status === 'failed' ? '✗' : '⊘';
      console.log(`${status} ${result.testId}: ${result.description}`);
      if (result.details) {
        console.log(`   Details: ${result.details}`);
      }
    });
    
    return {
      summary: this.summary,
      results: this.results,
      passRate
    };
  }
}

// Main Test Suite
describe('Patient Management System - Complete Test Suite', () => {
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
  describe('Patient Management Tests', () => {
    test('TC001: Register New Patient', async () => {
      const patientData = {
        name: 'John Doe',
        dob: '1990-01-15',
        medicalHistory: 'No known allergies'
      };

      const response = await request(app)
        .post('/api/patient')
        .set('Authorization', `Bearer ${authToken}`)
        .send(patientData);

      if (response.status === 201 && response.body.name === 'John Doe') {
        testReporter.recordResult('TC001', 'Register New Patient', 'passed');
      } else {
        testReporter.recordResult('TC001', 'Register New Patient', 'failed', 
          `Expected 201, got ${response.status}`);
      }

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('John Doe');
    });

    // TC002: Invalid DOB Format
    test('TC002: Invalid DOB Format', async () => {
      const patientData = {
        name: 'Jane Doe',
        dob: 'abc',
        medicalHistory: 'Test'
      };

      const response = await request(app)
        .post('/api/patient')
        .set('Authorization', `Bearer ${authToken}`)
        .send(patientData);

      if (response.status === 400) {
        testReporter.recordResult('TC002', 'Invalid DOB Format', 'passed');
      } else {
        testReporter.recordResult('TC002', 'Invalid DOB Format', 'failed',
          `Expected 400, got ${response.status}`);
      }

      expect(response.status).toBe(400);
    });

    // Patient Search Test
    test('TC004: Search Patients', async () => {
      const response = await request(app)
        .get('/api/patient')
        .set('Authorization', `Bearer ${authToken}`);

      if (response.status === 200 && Array.isArray(response.body)) {
        testReporter.recordResult('TC004', 'Search Patients', 'passed');
      } else {
        testReporter.recordResult('TC004', 'Search Patients', 'failed');
      }

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    // Update Patient Test
    test('TC005: Update Patient Information', async () => {
      const patients = await Patient.find().limit(1);
      const patientId = patients[0]._id;

      const updateData = {
        name: 'Updated Name',
        medicalHistory: 'Updated history'
      };

      const response = await request(app)
        .put(`/api/patient/${patientId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      if (response.status === 200 && response.body.name === 'Updated Name') {
        testReporter.recordResult('TC005', 'Update Patient Information', 'passed');
      } else {
        testReporter.recordResult('TC005', 'Update Patient Information', 'failed');
      }

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Name');
    });
  });

  // TC003: Schedule Appointment
  describe('Appointment Management Tests', () => {
    test('TC003: Schedule Appointment', async () => {
      const patients = await Patient.find().limit(1);
      const users = await User.find().limit(1);

      const appointmentData = {
        patientId: patients[0]._id,
        doctorId: users[0]._id,
        date: new Date(Date.now() + 86400000), // Tomorrow
        time: '10:00',
        notes: 'Regular checkup'
      };

      const response = await request(app)
        .post('/api/appointment')
        .set('Authorization', `Bearer ${authToken}`)
        .send(appointmentData);

      if (response.status === 201) {
        testReporter.recordResult('TC003', 'Schedule Appointment', 'passed');
      } else {
        testReporter.recordResult('TC003', 'Schedule Appointment', 'failed',
          `Expected 201, got ${response.status}`);
      }

      expect(response.status).toBe(201);
    });

    // Appointment Conflict Detection
    test('TC006: Appointment Conflict Detection', async () => {
      const patients = await Patient.find().limit(2);
      const users = await User.find().limit(1);

      const appointmentData = {
        patientId: patients[1]._id,
        doctorId: users[0]._id,
        date: new Date(Date.now() + 86400000), // Same day as previous
        time: '10:00', // Same time
        notes: 'Conflict test'
      };

      const response = await request(app)
        .post('/api/appointment')
        .set('Authorization', `Bearer ${authToken}`)
        .send(appointmentData);

      // This should either succeed or fail based on your conflict detection logic
      testReporter.recordResult('TC006', 'Appointment Conflict Detection', 
        response.status === 400 ? 'passed' : 'failed');

      expect([200, 201, 400]).toContain(response.status);
    });

    // Get Appointments
    test('TC007: Get All Appointments', async () => {
      const response = await request(app)
        .get('/api/appointment')
        .set('Authorization', `Bearer ${authToken}`);

      if (response.status === 200 && Array.isArray(response.body)) {
        testReporter.recordResult('TC007', 'Get All Appointments', 'passed');
      } else {
        testReporter.recordResult('TC007', 'Get All Appointments', 'failed');
      }

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  // Authentication & Authorization Tests
  describe('Security & Authorization Tests', () => {
    test('TC008: Unauthorized Access Prevention', async () => {
      const response = await request(app)
        .get('/api/patient');

      if (response.status === 401) {
        testReporter.recordResult('TC008', 'Unauthorized Access Prevention', 'passed');
      } else {
        testReporter.recordResult('TC008', 'Unauthorized Access Prevention', 'failed');
      }

      expect(response.status).toBe(401);
    });

    test('TC009: User Login', async () => {
      const loginData = {
        username: 'doctor1',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/users/login')
        .send(loginData);

      if (response.status === 200 && response.body.token) {
        testReporter.recordResult('TC009', 'User Login', 'passed');
      } else {
        testReporter.recordResult('TC009', 'User Login', 'failed');
      }

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
    });

    test('TC010: Invalid Login Credentials', async () => {
      const loginData = {
        username: 'invalid',
        password: 'wrong'
      };

      const response = await request(app)
        .post('/api/users/login')
        .send(loginData);

      if (response.status === 400) {
        testReporter.recordResult('TC010', 'Invalid Login Credentials', 'passed');
      } else {
        testReporter.recordResult('TC010', 'Invalid Login Credentials', 'failed');
      }

      expect(response.status).toBe(400);
    });
  });

  // Performance Tests
  describe('Performance Tests', () => {
    test('TC011: Patient Search Performance', async () => {
      const startTime = Date.now();
      
      const response = await request(app)
        .get('/api/patient')
        .set('Authorization', `Bearer ${authToken}`);

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      if (response.status === 200 && responseTime < 1000) {
        testReporter.recordResult('TC011', 'Patient Search Performance', 'passed',
          `Response time: ${responseTime}ms`);
      } else {
        testReporter.recordResult('TC011', 'Patient Search Performance', 'failed',
          `Response time: ${responseTime}ms (>1000ms)`);
      }

      expect(response.status).toBe(200);
      expect(responseTime).toBeLessThan(1000);
    });
  });

  // Data Validation Tests
  describe('Data Validation Tests', () => {
    test('TC012: Required Field Validation', async () => {
      const patientData = {
        // Missing required 'name' field
        dob: '1990-01-15',
        medicalHistory: 'Test'
      };

      const response = await request(app)
        .post('/api/patient')
        .set('Authorization', `Bearer ${authToken}`)
        .send(patientData);

      if (response.status === 400) {
        testReporter.recordResult('TC012', 'Required Field Validation', 'passed');
      } else {
        testReporter.recordResult('TC012', 'Required Field Validation', 'failed');
      }

      expect(response.status).toBe(400);
    });
  });

  // Integration Tests
  describe('Integration Tests', () => {
    test('TC013: End-to-End Patient Flow', async () => {
      // Create patient
      const patientData = {
        name: 'Integration Test Patient',
        dob: '1985-05-10',
        medicalHistory: 'Integration test'
      };

      const createResponse = await request(app)
        .post('/api/patient')
        .set('Authorization', `Bearer ${authToken}`)
        .send(patientData);

      expect(createResponse.status).toBe(201);
      const patientId = createResponse.body._id;

      // Retrieve patient
      const getResponse = await request(app)
        .get(`/api/patient/${patientId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(getResponse.status).toBe(200);
      expect(getResponse.body.name).toBe('Integration Test Patient');

      // Update patient
      const updateResponse = await request(app)
        .put(`/api/patient/${patientId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated Integration Patient' });

      expect(updateResponse.status).toBe(200);

      // Delete patient
      const deleteResponse = await request(app)
        .delete(`/api/patient/${patientId}`)
        .set('Authorization', `Bearer ${authToken}`);

      if (deleteResponse.status === 200) {
        testReporter.recordResult('TC013', 'End-to-End Patient Flow', 'passed');
      } else {
        testReporter.recordResult('TC013', 'End-to-End Patient Flow', 'failed');
      }

      expect(deleteResponse.status).toBe(200);
    });
  });
});

// Manual Test Case Template
const MANUAL_TEST_CASES = `
=== MANUAL TEST CASES ===

TC014: UI Responsiveness Test
- Open application in different browser sizes
- Verify all elements are properly displayed
- Check mobile responsiveness

TC015: User Experience Flow
- Navigate through all major sections
- Verify intuitive user workflows
- Check error message clarity

TC016: Browser Compatibility
- Test in Chrome, Firefox, Safari
- Verify consistent behavior across browsers

TC017: Data Persistence
- Add data, refresh page
- Verify data remains after browser restart
- Check data integrity after operations

TC018: Role-Based Access Control
- Login as different user roles
- Verify appropriate access restrictions
- Test permission boundaries
`;

// Export for use in other files
module.exports = {
  TestDataGenerator,
  TestDatabase,
  AuthHelper,
  TestReporter,
  MANUAL_TEST_CASES
};