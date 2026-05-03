const NodeCache = require('node-cache');
const { SEARCH_CACHE_TTL_MS } = require('../utils/constants');

/**
 * In-memory cache for API responses
 * Reduces external API calls and improves response times
 */
const cache = new NodeCache({ 
  stdTTL: SEARCH_CACHE_TTL_MS / 1000,
  checkperiod: 120,
  useClones: false
});

/**
 * Gets a cached value by key
 * @param {string} key - Cache key
 * @returns {*} Cached value or undefined
 */
const get = (key) => cache.get(key);

/**
 * Sets a value in cache
 * @param {string} key - Cache key
 * @param {*} value - Value to cache
 * @param {number} [ttl] - Optional TTL override in seconds
 * @returns {boolean} Success
 */
const set = (key, value, ttl) => (ttl ? cache.set(key, value, ttl) : cache.set(key, value));

/**
 * Gets cache statistics
 * @returns {Object} Cache stats
 */
const stats = () => cache.getStats();

module.exports = { get, set, stats };
