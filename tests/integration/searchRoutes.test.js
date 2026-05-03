const request = require('supertest');
const app = require('../../src/server/index');

describe('GET /api/search - comprehensive', () => {
  test('returns 400 for query shorter than 2 chars', async () => {
    const res = await request(app).get('/api/search?q=a');
    expect(res.status).toBe(400);
  });

  test('returns 400 when q param missing', async () => {
    const res = await request(app).get('/api/search');
    expect(res.status).toBe(400);
  });

  test('returns cached result on second identical request', async () => {
    // First call — miss
    const res1 = await request(app).get('/api/search?q=voting&filter=all');
    expect(res1.status).toBe(200);
    expect(res1.headers['x-cache']).toBe('MISS');

    // Second call — hit
    const res2 = await request(app).get('/api/search?q=voting&filter=all');
    expect(res2.status).toBe(200);
    expect(res2.headers['x-cache']).toBe('HIT');
  });

  test('response shape has items array', async () => {
    const res = await request(app).get('/api/search?q=election');
    expect(res.body).toHaveProperty('items');
    expect(Array.isArray(res.body.items)).toBe(true);
  });
});
