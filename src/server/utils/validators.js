const validator = require('validator');

/**
 * Validates a state code.
 * @param {string} state - The 2-letter state code.
 * @returns {boolean} True if valid.
 */
const isValidState = (state) => {
  if (!state || typeof state !== 'string') {
    return false;
  }
  const validStates = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];
  return validStates.includes(state.toUpperCase());
};

/**
 * Validates a date string in YYYY-MM-DD format.
 * @param {string} dateStr - Date string
 * @returns {boolean} True if valid.
 */
const isValidDate = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string') {
    return false;
  }
  return validator.isDate(dateStr, { format: 'YYYY-MM-DD', strictMode: true });
};

/**
 * Validates user name (alphabetic, 2-200 chars)
 * @param {string} name - User full name
 * @returns {boolean} True if valid
 */
const validateName = (name) => {
  if (!name || typeof name !== 'string') {
    return false;
  }
  const trimmed = name.trim();
  // Allow spaces for first/last name
  return validator.isAlpha(trimmed.replace(/\s/g, '')) && 
         trimmed.length >= 2 && 
         trimmed.length <= 200;
};

/**
 * Validates Date of Birth (must be past, after 1900)
 * @param {string} dob - DOB string
 * @returns {boolean} True if valid
 */
const validateDOB = (dob) => {
  if (!isValidDate(dob)) {
    return false;
  }
  const date = new Date(dob);
  const now = new Date();
  const minDate = new Date('1900-01-01');
  return date < now && date > minDate;
};

/**
 * Sanitizes input string to prevent XSS.
 * @param {string} input - The input string.
 * @returns {string} Sanitized string.
 */
const sanitizeInput = (input) => {
  if (input === null || input === undefined) {
    return '';
  }
  if (typeof input !== 'string') {
    return String(input).trim();
  }
  return validator.escape(input.trim());
};

/**
 * Validates search query string.
 * @param {string} query - The search query.
 * @returns {boolean} True if valid.
 */
const isValidSearchQuery = (query) => {
  if (!query || typeof query !== 'string') {
    return false;
  }
  const trimmed = query.trim();
  return trimmed.length >= 2 && trimmed.length <= 100;
};

module.exports = {
  isValidState,
  isValidDate,
  validateName,
  validateDOB,
  sanitizeInput,
  isValidSearchQuery
};
