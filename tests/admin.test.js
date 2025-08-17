import request from 'supertest';
import app from '../backend/app';
import { TestDatabase, AuthHelper, TestReporter } from './pms.test.js';

describe('Admin Role & Management Tests', () => {
  let authToken;
  let testReporter;

  beforeAll(async () => {
    testReporter = new TestReporter();
    await TestDatabase.setup();
    authToken = await AuthHelper.getAuthToken(); // Should return admin user
  });

  afterAll(async () => {
    await TestDatabase.teardown();
    testReporter.generateReport();
  });

  // TC014: Create another admin account
  test('TC014: Create admin user account', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        username: 'admin2',
        password: 'admin123',
        role: 'admin'
      });

    const passed = response.status === 201 && response.body.role === 'admin';
    testReporter.recordResult('TC014', 'Create admin user account', passed ? 'passed' : 'failed');

    expect(response.status).toBe(201);
    expect(response.body.role).toBe('admin');
  });

  // TC015: Admin can list all users
  test('TC015: Admin can list all users', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${authToken}`);

    const passed = response.status === 200 && Array.isArray(response.body);
    testReporter.recordResult('TC015', 'Admin can list all users', passed ? 'passed' : 'failed');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // TC016: Non-admin cannot list users
  test('TC016: Non-admin cannot list all users', async () => {
    const token = await AuthHelper.getAuthToken({ role: 'user' });
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);

    const passed = response.status === 403;
    testReporter.recordResult('TC016', 'Non-admin blocked from viewing users', passed ? 'passed' : 'failed');

    expect(response.status).toBe(403);
  });

  // TC017: Update a user’s role
  test('TC017: Admin can update user role', async () => {
    const newUser = await request(app)
      .post('/api/users/register')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        username: 'tempuser',
        password: 'pass123',
        role: 'user'
      });

    const userId = newUser.body._id;

    const update = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ role: 'admin' });

    const passed = update.status === 200 && update.body.role === 'admin';
    testReporter.recordResult('TC017', 'Admin can update user role', passed ? 'passed' : 'failed');

    expect(update.status).toBe(200);
    expect(update.body.role).toBe('admin');
  });

  // TC018: Delete a user account
  test('TC018: Admin can delete user', async () => {
    const newUser = await request(app)
      .post('/api/users/register')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        username: 'tobedeleted',
        password: 'delete123',
        role: 'user'
      });

    const userId = newUser.body._id;

    const del = await request(app)
      .delete(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${authToken}`);

    const passed = del.status === 200;
    testReporter.recordResult('TC018', 'Admin can delete user', passed ? 'passed' : 'failed');

    expect(del.status).toBe(200);
  });

  // TC019: Prevent deleting last admin
  test('TC019: Prevent deleting only remaining admin', async () => {
    // Assume `doctor1` is the last admin; block deletion in system logic
    const response = await request(app)
      .delete(`/api/users/doctor1`)
      .set('Authorization', `Bearer ${authToken}`);

    const passed = [400, 403].includes(response.status);
    testReporter.recordResult('TC019', 'Prevent last admin deletion', passed ? 'passed' : 'failed');

    expect(passed).toBe(true);
  });
});
