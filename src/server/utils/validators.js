const validator = require('validator');

/**
 * Validates a state code.
 * @param {string} state - The 2-letter state code.
 * @returns {boolean} True if valid.
 */
const isValidState = (state) => {
  if (!state || typeof state !== 'string') return false;
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
  if (!dateStr || typeof dateStr !== 'string') return false;
  return validator.isDate(dateStr, { format: 'YYYY-MM-DD', strictMode: true });
};

/**
 * Sanitizes input string to prevent XSS.
 * @param {string} input - The input string.
 * @returns {string} Sanitized string.
 */
const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') return '';
  return validator.escape(input.trim());
};

/**
 * Validates search query string.
 * @param {string} query - The search query.
 * @returns {boolean} True if valid.
 */
const isValidSearchQuery = (query) => {
  if (!query || typeof query !== 'string') return false;
  return query.trim().length > 0 && query.trim().length <= 100;
};

module.exports = {
  isValidState,
  isValidDate,
  sanitizeInput,
  isValidSearchQuery
};
