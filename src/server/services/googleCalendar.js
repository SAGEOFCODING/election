const { google } = require('googleapis');
const logger = require('../utils/logger');
require('dotenv').config();

const mockMode = !process.env.GOOGLE_API_KEY;

/**
 * Creates an event in the user's Google Calendar.
 * Since this requires user's OAuth token in a real scenario, we simulate it
 * or use an API key for public endpoints if applicable.
 * @param {string} userToken - User's OAuth token
 * @param {Object} eventDetails - { summary, description, start, end }
 * @returns {Promise<Object>} event result
 */
const createCalendarEvent = async (userToken, eventDetails) => {
  if (mockMode || userToken === 'mock-valid-token') {
    logger.info('Mock creating calendar event', eventDetails);
    return { 
      status: 201, 
      data: { htmlLink: 'https://calendar.google.com/mock-event' } 
    };
  }

  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: userToken });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: {
        summary: eventDetails.summary,
        description: eventDetails.description,
        start: { date: eventDetails.start },
        end: { date: eventDetails.end },
      },
    });

    return { status: 201, data: response.data };
  } catch (error) {
    logger.error('Error creating calendar event', { error: error.message });
    const err = new Error('Failed to create calendar event');
    err.status = 500;
    throw err;
  }
};

module.exports = { createCalendarEvent };
