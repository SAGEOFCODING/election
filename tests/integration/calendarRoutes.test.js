const request = require('supertest');
const app = require('../../src/server/index');

describe('Calendar Routes', () => {
  test('POST /api/calendar/event without token returns 401', async () => {
    const res = await request(app).post('/api/calendar/event').send({
      summary: 'Vote', start: '2024-11-05', end: '2024-11-05'
    });
    expect(res.statusCode).toEqual(401);
  });

  test('POST /api/calendar/event with token returns 201', async () => {
    const res = await request(app)
      .post('/api/calendar/event')
      .set('Authorization', 'Bearer mock-valid-token')
      .send({ summary: 'Vote', start: '2024-11-05', end: '2024-11-05' });
    
    expect(res.statusCode).toEqual(201);
  });
});
