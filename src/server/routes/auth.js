const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const { saveUser } = require('../services/firestore');
const logger = require('../utils/logger');

/**
 * @route POST /api/auth/verify
 * @desc Verify ID token and save user to Firestore
 * @access Private
 */
router.post('/verify', requireAuth, async (req, res, next) => {
  try {
    const user = req.user;
    await saveUser({
      uid: user.uid,
      email: user.email,
      name: user.name,
      picture: user.picture,
      lastLogin: new Date().toISOString()
    });
    
    res.status(200).json({ success: true, user: { uid: user.uid, name: user.name } });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
