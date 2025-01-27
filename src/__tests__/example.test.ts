import request from 'supertest';
import { app } from '../app';

describe('Example Test Suite', () => {
  it('should pass a simple test', () => {
    expect(true).toBe(true);
  });

  // Example of an API test
  it('should return 404 for non-existent route', async () => {
    const response = await request(app).get('/non-existent-route');
    expect(response.status).toBe(404);
  });
});