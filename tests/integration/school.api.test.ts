import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app';
import { sequelize } from '../../src/models';

describe('School API Integration Tests', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/v1/schools', () => {
    it('should create a new school', async () => {
      const schoolData = {
        name: 'Test School',
        code: 'TS001',
        address: '123 Test Street',
        phone: '+1234567890',
        email: 'test@school.com'
      };

      const response = await request(app)
        .post('/api/v1/schools')
        .send(schoolData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Test School');
      expect(response.body.data.code).toBe('TS001');
    });

    it('should fail validation for missing required fields', async () => {
      const invalidData = { name: 'Incomplete School' };

      const response = await request(app)
        .post('/api/v1/schools')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should fail for duplicate school code', async () => {
      const schoolData = {
        name: 'Another School',
        code: 'TS001', // Same code as first test
        address: '456 Another St',
        phone: '+0987654321',
        email: 'another@school.com'
      };

      const response = await request(app)
        .post('/api/v1/schools')
        .send(schoolData);

      expect(response.status).toBe(409); // Conflict
    });
  });

  describe('GET /api/v1/schools', () => {
    it('should return list of schools', async () => {
      const response = await request(app).get('/api/v1/schools');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/v1/schools')
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1); // Only one school created
    });
  });

  describe('GET /api/v1/schools/:id', () => {
    it('should return a single school', async () => {
      // First create a school
      const createResponse = await request(app)
        .post('/api/v1/schools')
        .send({
          name: 'Single School',
          code: 'SS001',
          address: '789 Single St',
          phone: '+1111111111',
          email: 'single@school.com'
        });

      const schoolId = createResponse.body.data.id;

      const response = await request(app).get(`/api/v1/schools/${schoolId}`);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(schoolId);
      expect(response.body.data.name).toBe('Single School');
    });

    it('should return 404 for non-existent school', async () => {
      const response = await request(app).get('/api/v1/schools/99999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/v1/schools/:id', () => {
    it('should update a school', async () => {
      const createResponse = await request(app)
        .post('/api/v1/schools')
        .send({
          name: 'Update School',
          code: 'US001',
          address: '321 Update Ave',
          phone: '+2222222222',
          email: 'update@school.com'
        });

      const schoolId = createResponse.body.data.id;

      const updateData = {
        name: 'Updated School Name',
        phone: '+3333333333'
      };

      const response = await request(app)
        .put(`/api/v1/schools/${schoolId}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('Updated School Name');
      expect(response.body.data.phone).toBe('+3333333333');
    });
  });

  describe('DELETE /api/v1/schools/:id', () => {
    it('should delete a school', async () => {
      const createResponse = await request(app)
        .post('/api/v1/schools')
        .send({
          name: 'Delete School',
          code: 'DS001',
          address: '654 Delete Blvd',
          phone: '+4444444444',
          email: 'delete@school.com'
        });

      const schoolId = createResponse.body.data.id;

      const response = await request(app).delete(`/api/v1/schools/${schoolId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify deletion
      const getResponse = await request(app).get(`/api/v1/schools/${schoolId}`);
      expect(getResponse.status).toBe(404);
    });
  });
});
