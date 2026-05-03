const logger = require('../utils/logger');

/**
 * Central error handler middleware for Express.
 * @param {Error} err - The error object.
 * @param {Object} req - Express request.
 * @param {Object} res - Express response.
 * @param {Function} next - Express next function.
 * @returns {void}
 */
const errorHandler = (err, req, res, _next) => {
  const status = err.status || 500;
  const message = status === 500 ? 'Internal Server Error' : err.message;

  logger.error(`[${req.method}] ${req.url} - ${status}`, {
    error: err.message,
    stack: status === 500 ? err.stack : undefined
  });
  
  res.status(status).json({
    error: message,
    status: 'error',
    timestamp: new Date().toISOString()
  });
};

module.exports = errorHandler;
