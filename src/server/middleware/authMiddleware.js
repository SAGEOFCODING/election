const { verifyToken } = require('../services/firestore');
const logger = require('../utils/logger');

/**
 * Express middleware to verify Firebase ID token.
 * @param {Object} req - Express request.
 * @param {Object} res - Express response.
 * @param {Function} next - Express next function.
 * @returns {Promise<void>}
 */
const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('Unauthorized request attempt - No valid header');
    const error = new Error('Unauthorized: No token provided');
    error.status = 401;
    return next(error);
  }

  const token = authHeader.split('Bearer ')[1];
  
  try {
    const decodedToken = await verifyToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    logger.warn(`Unauthorized request attempt - Invalid token: ${error.message}`);
    const err = new Error('Unauthorized: Invalid token');
    err.status = 401;
    next(err);
  }
};

module.exports = { requireAuth };
