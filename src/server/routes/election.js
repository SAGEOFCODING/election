const express = require('express');
const router = express.Router();
const { buildTimeline } = require('../services/electionData');
const { getCollection } = require('../services/firestore');
const cache = require('../services/cache');
const { TIMELINE_CACHE_TTL_MS, QUIZ_CACHE_TTL_MS } = require('../utils/constants');

/**
 * @route GET /api/election/timeline
 * @desc Get the interactive election timeline
 * @access Public
 */
router.get('/timeline', async (req, res, next) => {
  try {
    const cacheKey = 'timeline';
    const cached = cache.get(cacheKey);
    if (cached) {
      res.set('X-Cache', 'HIT');
      return res.json(cached);
    }

    const data = await buildTimeline();
    cache.set(cacheKey, data, TIMELINE_CACHE_TTL_MS / 1000);
    
    res.set('X-Cache', 'MISS');
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/election/quizzes
 * @desc Get quizzes
 * @access Public
 */
router.get('/quizzes', async (req, res, next) => {
  try {
    const cacheKey = 'quizzes';
    const cached = cache.get(cacheKey);
    if (cached) {
      res.set('X-Cache', 'HIT');
      return res.json(cached);
    }

    const quizzes = await getCollection('quizzes');
    const response = { quizzes };
    
    cache.set(cacheKey, response, QUIZ_CACHE_TTL_MS / 1000);
    res.set('X-Cache', 'MISS');
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/election/glossary
 * @desc Get glossary terms
 * @access Public
 */
router.get('/glossary', async (req, res, next) => {
  try {
    const terms = await getCollection('glossary');
    res.status(200).json({ terms });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
