const logger = require('../utils/logger');

/**
 * Central error handler middleware for Express.
 * @param {Error} err - The error object.
 * @param {Object} req - Express request.
 * @param {Object} res - Express response.
 * @param {Function} next - Express next function.
 * @returns {void}
 */
const errorHandler = (err, req, res, next) => {
  logger.error(`Error processing request ${req.method} ${req.url}`, { error: err.message, stack: err.stack });
  
  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }

  res.status(500).json({ error: 'Internal Server Error' });
};

module.exports = errorHandler;
