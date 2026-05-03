const { isValidState, isValidDate, sanitizeInput, isValidSearchQuery } = require('../../src/server/utils/validators');

describe('Validators', () => {
  test('isValidState returns true for valid states', () => {
    expect(isValidState('CA')).toBe(true);
    expect(isValidState('ny')).toBe(true);
  });

  test('isValidState returns false for invalid states', () => {
    expect(isValidState('XX')).toBe(false);
    expect(isValidState('')).toBe(false);
    expect(isValidState(null)).toBe(false);
  });

  test('isValidDate returns true for valid YYYY-MM-DD', () => {
    expect(isValidDate('2024-11-05')).toBe(true);
  });

  test('isValidDate returns false for invalid dates', () => {
    expect(isValidDate('11-05-2024')).toBe(false);
    expect(isValidDate('invalid')).toBe(false);
  });

  test('sanitizeInput escapes HTML', () => {
    expect(sanitizeInput('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
  });

  test('isValidSearchQuery limits length', () => {
    expect(isValidSearchQuery('voting')).toBe(true);
    expect(isValidSearchQuery('')).toBe(false);
    expect(isValidSearchQuery('a'.repeat(101))).toBe(false);
  });
});
