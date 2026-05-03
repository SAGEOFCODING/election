const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const { createCalendarEvent } = require('../services/googleCalendar');

/**
 * @route POST /api/calendar/event
 * @desc Create a calendar event for the user
 * @access Private
 */
router.post('/event', requireAuth, async (req, res, next) => {
  try {
    const { summary, description, start, end } = req.body;
    
    if (!summary || !start || !end) {
      const error = new Error('Missing required fields');
      error.status = 400;
      throw error;
    }

    // In a real app, you'd retrieve the user's Google OAuth access token from DB or frontend.
    // For this demonstration, we simulate using a mock token.
    const userToken = req.headers['x-google-oauth'] || 'mock-valid-token';

    const result = await createCalendarEvent(userToken, { summary, description, start, end });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
