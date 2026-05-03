const request = require('supertest');
const app = require('../../src/server/index');

describe('Election Routes', () => {
  test('GET /api/election/timeline returns 200', async () => {
    const res = await request(app).get('/api/election/timeline');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.timeline)).toBe(true);
  });
});
