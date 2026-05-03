const { 
  isValidState, 
  isValidDate, 
  validateName, 
  validateDOB, 
  sanitizeInput, 
  isValidSearchQuery 
} = require('../../src/server/utils/validators');

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
    expect(isValidSearchQuery('a')).toBe(false);
    expect(isValidSearchQuery('a'.repeat(101))).toBe(false);
  });

  describe('validateName - edge cases', () => {
    test('single character name fails', () => {
      expect(validateName('A')).toBe(false);
    });
    test('name with numbers fails', () => {
      expect(validateName('John123')).toBe(false);
    });
    test('name with script tag fails (XSS)', () => {
      expect(validateName('<script>')).toBe(false);
    });
    test('name with 201 characters fails', () => {
      expect(validateName('A'.repeat(201))).toBe(false);
    });
    test('valid two-word name passes', () => {
      expect(validateName('Jane Smith')).toBe(true);
    });
    test('null input fails gracefully', () => {
      expect(() => validateName(null)).not.toThrow();
      expect(validateName(null)).toBe(false);
    });
  });

  describe('validateDOB - edge cases', () => {
    test('future date fails', () => {
      expect(validateDOB('2099-01-01')).toBe(false);
    });
    test('date before 1900 fails', () => {
      expect(validateDOB('1899-12-31')).toBe(false);
    });
    test('invalid format fails', () => {
      expect(validateDOB('not-a-date')).toBe(false);
    });
    test('empty string fails', () => {
      expect(validateDOB('')).toBe(false);
    });
    test('valid DOB passes', () => {
      expect(validateDOB('1990-01-01')).toBe(true);
    });
  });

  describe('sanitizeInput', () => {
    test('strips HTML tags', () => {
      const result = sanitizeInput('<p>hello</p>');
      expect(result).not.toContain('<p>');
      expect(result).toContain('&lt;p&gt;');
    });
    test('trims whitespace', () => {
      expect(sanitizeInput('  hello  ')).toBe('hello');
    });
    test('handles empty string', () => {
      expect(sanitizeInput('')).toBe('');
    });
    test('handles null gracefully', () => {
      expect(() => sanitizeInput(null)).not.toThrow();
      expect(sanitizeInput(null)).toBe('');
    });
  });
});
