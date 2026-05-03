/** @module constants */

/** Maximum messages to keep in chat history */
const MAX_CHAT_MESSAGES = 10;

/** Maximum character length per chat message */
const MAX_MESSAGE_LENGTH = 500;

/** Search cache TTL in milliseconds (1 hour) */
const SEARCH_CACHE_TTL_MS = 60 * 60 * 1000;

/** Timeline cache TTL in milliseconds (24 hours) */
const TIMELINE_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

/** Quiz cache TTL in milliseconds (24 hours) */
const QUIZ_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

/** Rate limit window in milliseconds (15 minutes) */
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

/** Maximum requests per window for general API */
const RATE_LIMIT_MAX_GENERAL = 100;

/** Maximum requests per window for chat API */
const RATE_LIMIT_MAX_CHAT = 20;

/** Quiz timer duration in seconds */
const QUIZ_TIMER_SECONDS = 30;

/** Number of leaderboard entries to display */
const LEADERBOARD_LIMIT = 10;

/** Timeline phases count */
const TIMELINE_PHASES_COUNT = 7;

module.exports = {
  MAX_CHAT_MESSAGES,
  MAX_MESSAGE_LENGTH,
  SEARCH_CACHE_TTL_MS,
  TIMELINE_CACHE_TTL_MS,
  QUIZ_CACHE_TTL_MS,
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX_GENERAL,
  RATE_LIMIT_MAX_CHAT,
  QUIZ_TIMER_SECONDS,
  LEADERBOARD_LIMIT,
  TIMELINE_PHASES_COUNT
};
