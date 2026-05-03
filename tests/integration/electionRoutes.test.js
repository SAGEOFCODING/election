const request = require('supertest');
const app = require('../../src/server/index');

describe('Election Routes - Integration', () => {
  test('GET /api/election/timeline returns 200 and data', async () => {
    const res = await request(app).get('/api/election/timeline');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('events');
    expect(res.headers['x-cache']).toBeDefined();
  });

  test('GET /api/election/quizzes returns 200 and data', async () => {
    const res = await request(app).get('/api/election/quizzes');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('quizzes');
  });

  test('GET /api/election/glossary returns 200 and data', async () => {
    const res = await request(app).get('/api/election/glossary');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('terms');
  });

  test('caching works for timeline', async () => {
    await request(app).get('/api/election/timeline');
    const res = await request(app).get('/api/election/timeline');
    expect(res.headers['x-cache']).toBe('HIT');
  });
});
