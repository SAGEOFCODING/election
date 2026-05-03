const request = require('supertest');
const app = require('../../src/server/index');

describe('POST /api/chat - comprehensive', () => {
  test('returns 400 when messages is empty array', async () => {
    const res = await request(app).post('/api/chat').send({ messages: [] });
    expect(res.status).toBe(400);
  });

  test('returns 400 when messages is not array', async () => {
    const res = await request(app).post('/api/chat').send({ messages: 'hello' });
    expect(res.status).toBe(400);
  });

  test('returns 400 when body is empty', async () => {
    const res = await request(app).post('/api/chat').send({});
    expect(res.status).toBe(400);
  });

  test('response has reply field on success', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ messages: [{ role: 'user', content: 'When is election day?' }] });
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('reply');
    expect(typeof res.body.reply).toBe('string');
    expect(res.body.reply).toContain('Tuesday');
  });

  test('handles greetings correctly', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ messages: [{ role: 'user', content: 'Hello assistant' }] });
    
    expect(res.status).toBe(200);
    expect(res.body.reply).toContain('ElectionIQ');
  });
});
