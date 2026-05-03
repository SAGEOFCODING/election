const { createCalendarEvent } = require('../../src/server/services/googleCalendar');

describe('Google Calendar Service', () => {
  test('createCalendarEvent mock success', async () => {
    const event = { summary: 'Vote', description: '', start: '2024-11-05', end: '2024-11-05' };
    const res = await createCalendarEvent('mock-valid-token', event);
    expect(res.status).toBe(201);
    expect(res.data.htmlLink).toBeDefined();
  });
});
