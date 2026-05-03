const { getCollection } = require('./firestore');
const logger = require('../utils/logger');

/**
 * Helper to format date strings for display
 * @param {string} dateStr 
 * @returns {string}
 */
const formatDate = (dateStr) => {
  if (!dateStr || dateStr.toLowerCase().includes('ongoing')) return dateStr;
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
};

/**
 * Builds the interactive election timeline
 * @returns {Promise<Object>} timeline data
 */
const buildTimeline = async () => {
  try {
    const timeline = [
      {
        id: 'registration',
        date: 'Ongoing 2024',
        title: 'Voter Registration',
        description: 'The first step to participating in the election. Deadlines vary by state, typically 15-30 days before election day.',
        status: 'active'
      },
      {
        id: 'primaries',
        date: '2024-01-15',
        title: 'Primary Elections & Caucuses',
        description: 'States and parties select their nominees for the general election through various voting methods.',
        status: 'completed'
      },
      {
        id: 'conventions',
        date: '2024-07-15',
        title: 'National Conventions',
        description: 'Parties officially nominate their presidential and vice-presidential candidates and approve the party platform.',
        status: 'completed'
      },
      {
        id: 'debates',
        date: '2024-09-10',
        title: 'Presidential Debates',
        description: 'Candidates face off in televised debates to discuss key issues and policy positions.',
        status: 'completed'
      },
      {
        id: 'general',
        date: '2024-11-05',
        title: 'General Election Day',
        description: 'Voters across the nation cast their ballots for President, Congress, and local offices.',
        status: 'upcoming'
      },
      {
        id: 'electoral',
        date: '2024-12-17',
        title: 'Electoral College Voting',
        description: 'Electors in each state meet to cast their official votes for President and Vice President.',
        status: 'upcoming'
      },
      {
        id: 'certification',
        date: '2025-01-06',
        title: 'Congressional Certification',
        description: 'Congress meets in a joint session to count the electoral votes and officially certify the winner.',
        status: 'upcoming'
      },
      {
        id: 'inauguration',
        date: '2025-01-20',
        title: 'Inauguration Day',
        description: 'The President-elect is sworn into office, marking the beginning of a new four-year term.',
        status: 'upcoming'
      }
    ];

    return {
      lastUpdated: new Date().toISOString(),
      events: timeline.map(e => ({
        ...e,
        formattedDate: e.date.includes('202') ? new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : e.date
      }))
    };
  } catch (error) {
    logger.error('Error building timeline:', error);
    return { events: [] };
  }
};

module.exports = {
  buildTimeline
};
