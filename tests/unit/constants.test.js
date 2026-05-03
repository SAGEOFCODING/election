const constants = require('../../src/server/utils/constants');

describe('constants', () => {
  test('MAX_CHAT_MESSAGES is a positive integer', () => {
    expect(Number.isInteger(constants.MAX_CHAT_MESSAGES)).toBe(true);
    expect(constants.MAX_CHAT_MESSAGES).toBeGreaterThan(0);
  });
  test('MAX_MESSAGE_LENGTH is a positive integer', () => {
    expect(Number.isInteger(constants.MAX_MESSAGE_LENGTH)).toBe(true);
    expect(constants.MAX_MESSAGE_LENGTH).toBeGreaterThan(0);
  });
  test('SEARCH_CACHE_TTL_MS equals 1 hour in ms', () => {
    expect(constants.SEARCH_CACHE_TTL_MS).toBe(3600000);
  });
  test('QUIZ_TIMER_SECONDS is 30', () => {
    expect(constants.QUIZ_TIMER_SECONDS).toBe(30);
  });
  test('LEADERBOARD_LIMIT is 10', () => {
    expect(constants.LEADERBOARD_LIMIT).toBe(10);
  });
  test('all exports are defined', () => {
    Object.values(constants).forEach((val) => {
      expect(val).toBeDefined();
    });
  });
});
