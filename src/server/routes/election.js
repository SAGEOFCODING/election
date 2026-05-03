const express = require('express');
const router = express.Router();
const { buildTimeline } = require('../services/electionData');
const { getCollection } = require('../services/firestore');

/**
 * @route GET /api/election/timeline
 * @desc Get the interactive election timeline
 * @access Public
 */
router.get('/timeline', async (req, res, next) => {
  try {
    const data = await buildTimeline();
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
    const quizzes = await getCollection('quizzes');
    res.status(200).json({ quizzes });
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
