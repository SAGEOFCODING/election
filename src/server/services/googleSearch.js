const axios = require('axios');
const logger = require('../utils/logger');
require('dotenv').config();

const API_KEY = process.env.GOOGLE_API_KEY;
const CX = process.env.GOOGLE_SEARCH_ENGINE_ID;
const mockMode = !API_KEY || !CX;

/**
 * Performs a custom search using Google Custom Search JSON API.
 * @param {string} query 
 * @returns {Promise<Array>} array of search results
 */
const performSearch = async (query) => {
  if (mockMode) {
    logger.info(`Mock searching for: ${query}`);
    return [
      {
        title: `Mock News for ${query}`,
        snippet: `This is a mocked news snippet about ${query}. Add GOOGLE_API_KEY to see real results.`,
        source: 'Mock Source',
        link: 'https://example.com'
      }
    ];
  }

  try {
    const url = `https://customsearch.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${encodeURIComponent(query)}`;
    const response = await axios.get(url);
    
    return response.data.items.map(item => ({
      title: item.title,
      snippet: item.snippet,
      source: item.displayLink,
      link: item.link,
      thumbnail: item.pagemap?.cse_thumbnail?.[0]?.src || null
    }));
  } catch (error) {
    logger.error('Error performing Google Search', { error: error.message });
    throw new Error('Search failed');
  }
};

module.exports = { performSearch };
