const admin = require('firebase-admin');
const logger = require('../utils/logger');
require('dotenv').config();

let db;
let mockMode = false;

// Initialize Firebase Admin
try {
  if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      })
    });
    db = admin.firestore();
    logger.info('Firebase Admin initialized successfully.');
  } else {
    throw new Error('Missing Firebase Admin credentials');
  }
} catch (error) {
  logger.warn(`Running in mock mode for Firestore. Reason: ${error.message}`);
  mockMode = true;
}

/**
 * Verify Firebase ID Token
 * @param {string} token 
 * @returns {Promise<Object>} decoded token
 */
const verifyToken = async (token) => {
  if (mockMode) {
    if (token === 'mock-valid-token') return { uid: 'mock-user-123', email: 'test@example.com', name: 'Test User' };
    throw new Error('Invalid mock token');
  }
  return await admin.auth().verifyIdToken(token);
};

/**
 * Save user profile to Firestore
 * @param {Object} user 
 */
const saveUser = async (user) => {
  if (mockMode) return { success: true };
  await db.collection('users').doc(user.uid).set(user, { merge: true });
  return { success: true };
};

/**
 * Get all documents from a collection
 * @param {string} collectionName 
 */
const getCollection = async (collectionName) => {
  if (mockMode) {
    if (collectionName === 'timeline') return [
      { id: '1', phase: 'Voter Registration Opens', date: '2024-01-01', description: 'States begin accepting new voter registrations. Check your state deadlines at vote.gov. You can register online, by mail, or in person at your local election office.' },
      { id: '2', phase: 'Presidential Primaries Begin', date: '2024-02-03', description: 'Iowa caucuses kick off the presidential primary season. Voters in each state choose their preferred candidates through primaries or caucuses over the following months.' },
      { id: '3', phase: 'Super Tuesday', date: '2024-03-05', description: 'The single biggest day of the primary calendar. Multiple states hold primaries simultaneously, awarding a large share of delegates. Results often clarify the frontrunners.' },
      { id: '4', phase: 'Primary Season Concludes', date: '2024-06-04', description: 'Final state primaries and caucuses wrap up. By this point, presumptive nominees are typically determined based on delegate counts.' },
      { id: '5', phase: 'National Conventions', date: '2024-07-15', description: 'Major parties hold national conventions to formally nominate their presidential and vice-presidential candidates. The party platform is adopted and delegates cast official votes.' },
      { id: '6', phase: 'Presidential Debates', date: '2024-09-16', description: 'Commission-sponsored debates between major-party presidential candidates. These nationally televised events give voters a chance to compare candidates side-by-side on key issues.' },
      { id: '7', phase: 'Voter Registration Deadline', date: '2024-10-07', description: 'Most states have a registration deadline 15-30 days before Election Day. Some states offer same-day registration. Check your specific state deadline immediately.' },
      { id: '8', phase: 'Early Voting Begins', date: '2024-10-19', description: '47 states offer early in-person voting. Visit your local election office or designated early voting location to cast your ballot before Election Day and avoid lines.' },
      { id: '9', phase: 'Mail-In Ballot Deadline', date: '2024-10-29', description: 'Last recommended day to mail absentee and mail-in ballots to ensure they arrive on time. Many states also offer ballot drop boxes as an alternative to mailing.' },
      { id: '10', phase: 'Election Day', date: '2024-11-05', description: 'Polls are open nationwide. Most polling places are open 6-7 AM to 7-8 PM. Bring required ID, know your polling location, and remember: if you are in line when polls close, you have the right to vote.' },
      { id: '11', phase: 'Electoral College Vote', date: '2024-12-17', description: 'Electors in each state formally cast their electoral votes for President and Vice President. Each state certifies its results and submits them to Congress.' },
      { id: '12', phase: 'Congressional Certification', date: '2025-01-06', description: 'Congress meets in joint session to count and certify the electoral votes. The Vice President presides over the ceremony. The winner is formally declared.' },
      { id: '13', phase: 'Inauguration Day', date: '2025-01-20', description: 'The newly elected President takes the oath of office on the steps of the U.S. Capitol. The peaceful transfer of power is a cornerstone of American democracy.' }
    ];
    if (collectionName === 'quizzes') return [
      { id: 'q1', question: 'How many electors are in the Electoral College?', options: ['270', '435', '538', '100'], answer: '538' },
      { id: 'q2', question: 'Which amendment gave women the right to vote?', options: ['15th', '19th', '21st', '26th'], answer: '19th' },
      { id: 'q3', question: 'How many U.S. Senators represent each state?', options: ['1', '2', '4', 'Varies by population'], answer: '2' },
      { id: 'q4', question: 'What is the minimum age to vote in federal elections?', options: ['16', '17', '18', '21'], answer: '18' },
      { id: 'q5', question: 'How many electoral votes does a candidate need to win the presidency?', options: ['200', '270', '300', '538'], answer: '270' },
      { id: 'q6', question: 'How long is a U.S. President\'s term?', options: ['2 years', '4 years', '6 years', '8 years'], answer: '4 years' },
      { id: 'q7', question: 'Which branch of government does the President lead?', options: ['Legislative', 'Judicial', 'Executive', 'Electoral'], answer: 'Executive' },
      { id: 'q8', question: 'How often are all U.S. House seats up for election?', options: ['Every year', 'Every 2 years', 'Every 4 years', 'Every 6 years'], answer: 'Every 2 years' },
      { id: 'q9', question: 'What is a ballot measure?', options: ['A vote for a candidate', 'A law proposed directly by voters', 'A type of election fraud', 'A poll tax'], answer: 'A law proposed directly by voters' },
      { id: 'q10', question: 'Which amendment lowered the voting age from 21 to 18?', options: ['19th', '24th', '25th', '26th'], answer: '26th' }
    ];
    if (collectionName === 'glossary') return [
      { id: 'g1', term: 'Absentee Ballot', definition: 'A ballot cast by a voter who cannot be present at their polling place on Election Day. Absentee ballots are typically mailed in or dropped off before or on Election Day.' },
      { id: 'g2', term: 'Ballot Initiative', definition: 'A process that allows citizens to propose new legislation or constitutional amendments by collecting a required number of voter signatures to place the measure on the ballot.' },
      { id: 'g3', term: 'Caucus', definition: 'A meeting of party members at the local level to select delegates who will represent them at conventions and to express preferences for candidates.' },
      { id: 'g4', term: 'Delegate', definition: 'A person chosen to represent their state or district at a national political convention, where they formally vote to nominate presidential candidates.' },
      { id: 'g5', term: 'Electoral College', definition: 'The system by which the President is elected. It consists of 538 electors; a candidate must win 270 electoral votes to become President.' },
      { id: 'g6', term: 'Filibuster', definition: 'A tactic used in the Senate to delay or block a vote on a bill by extending debate. Ending a filibuster requires 60 votes (cloture).' },
      { id: 'g7', term: 'Gerrymandering', definition: 'The manipulation of electoral district boundaries to give one party an unfair advantage. Named after Governor Elbridge Gerry in 1812.' },
      { id: 'g8', term: 'Incumbent', definition: 'A person currently holding a political office who is running for re-election. Incumbents often have advantages including name recognition and fundraising ability.' },
      { id: 'g9', term: 'Midterm Election', definition: 'Elections held midway through a president\'s four-year term. All 435 House seats, about one-third of Senate seats, and many state offices are on the ballot.' },
      { id: 'g10', term: 'Primary Election', definition: 'An election in which voters choose candidates to represent each party in the general election. Primaries can be open (any voter) or closed (party members only).' },
      { id: 'g11', term: 'Provisional Ballot', definition: 'A ballot cast when a voter\'s eligibility cannot be immediately verified. It is counted after election officials confirm the voter\'s registration.' },
      { id: 'g12', term: 'Redistricting', definition: 'The process of redrawing congressional and state legislative district boundaries, typically after each Census to reflect population changes.' },
      { id: 'g13', term: 'Swing State', definition: 'A state where no single candidate or party has a clear advantage, making it competitive. Campaign resources are often concentrated in these states.' },
      { id: 'g14', term: 'Super PAC', definition: 'An independent political action committee that can raise unlimited funds to support or oppose candidates but cannot coordinate directly with campaigns.' },
      { id: 'g15', term: 'Voter Suppression', definition: 'Tactics used to discourage or prevent certain groups from voting. This includes restrictive ID laws, polling place closures, and voter roll purges.' }
    ];
    return [];
  }
  const snapshot = await db.collection(collectionName).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Add document to a collection
 * @param {string} collectionName 
 * @param {Object} data 
 */
const addDocument = async (collectionName, data) => {
  if (mockMode) return { id: 'mock-doc-id', ...data };
  const docRef = await db.collection(collectionName).add(data);
  return { id: docRef.id, ...data };
};

module.exports = {
  db,
  verifyToken,
  saveUser,
  getCollection,
  addDocument,
  isMockMode: () => mockMode
};
