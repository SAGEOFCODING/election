const { detectCurrentPhase, formatDate } = require('../../src/server/services/electionData');

describe('Election Data Service', () => {
  test('formatDate formats correctly', () => {
    const formatted = formatDate('2024-11-05');
    expect(formatted).toMatch(/November 5, 2024/);
  });

  test('detectCurrentPhase detects past vs future', () => {
    const past = new Date();
    past.setDate(past.getDate() - 10);
    const future = new Date();
    future.setDate(future.getDate() + 10);

    const timeline = [
      { id: '1', date: past.toISOString() },
      { id: '2', date: future.toISOString() }
    ];

    expect(detectCurrentPhase(timeline)).toBe('1');
  });
});
