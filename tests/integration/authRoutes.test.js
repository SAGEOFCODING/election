const request = require('supertest');
const app = require('../../src/server/index');

describe('Auth Routes', () => {
  test('POST /api/auth/verify without token returns 401', async () => {
    const res = await request(app).post('/api/auth/verify');
    expect(res.statusCode).toEqual(401);
  });

  test('POST /api/auth/verify with bad token returns 401', async () => {
    const res = await request(app)
      .post('/api/auth/verify')
      .set('Authorization', 'Bearer bad-token');
    expect(res.statusCode).toEqual(401);
  });

  test('POST /api/auth/verify with good mock token returns 200', async () => {
    const res = await request(app)
      .post('/api/auth/verify')
      .set('Authorization', 'Bearer mock-valid-token');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });
});
