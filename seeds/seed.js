const { db, isMockMode } = require('../src/server/services/firestore');
const logger = require('../src/server/utils/logger');

const seedData = async () => {
  if (isMockMode()) {
    logger.info('Firestore is in mock mode. Skipping seeding.');
    return;
  }

  logger.info('Seeding Firestore database...');

  const timeline = [
    { phase: 'Voter Registration', date: '2024-10-01', description: 'Ensure you are registered to vote before the deadline.' },
    { phase: 'Early Voting', date: '2024-10-15', description: 'Cast your ballot early to avoid lines.' },
    { phase: 'Election Day', date: '2024-11-05', description: 'The official day to cast your vote.' },
    { phase: 'Results Certification', date: '2024-12-10', description: 'States certify their election results.' },
    { phase: 'Inauguration', date: '2025-01-20', description: 'The newly elected officials take office.' }
  ];

  const glossary = [
    { term: 'Electoral College', definition: 'A body of people representing the states of the US, who formally cast votes for the election of the president and vice president.' },
    { term: 'Swing State', definition: 'A US state where the two major political parties have similar levels of support among voters.' },
    { term: 'Gerrymandering', definition: 'Manipulating the boundaries of an electoral constituency so as to favor one party or class.' }
  ];

  try {
    for (const item of timeline) {
      await db.collection('timeline').add(item);
    }
    for (const item of glossary) {
      await db.collection('glossary').add(item);
    }
    logger.info('Seeding complete.');
  } catch (error) {
    logger.error('Error seeding data', { error: error.message });
  }
};

seedData().then(() => process.exit(0)).catch(() => process.exit(1));
