const admin = require('firebase-admin');
const logger = require('../utils/logger');
require('dotenv').config();

let db;
let mockMode = false;

// Initialize Firebase Admin
try {
  const hasCredentials = process.env.FIREBASE_PRIVATE_KEY && 
                        process.env.FIREBASE_PROJECT_ID && 
                        process.env.FIREBASE_CLIENT_EMAIL;

  if (hasCredentials) {
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
 * Mock data for development when Firebase is not configured
 * @type {Object}
 */
const MOCK_DATA = {
  quizzes: [
    { id: 'q1', question: 'How many electors are in the Electoral College?', options: ['270', '435', '538', '100'], answer: '538' },
    { id: 'q2', question: 'Which amendment gave women the right to vote?', options: ['15th', '19th', '21st', '26th'], answer: '19th' },
    { id: 'q3', question: 'How many U.S. Senators represent each state?', options: ['1', '2', '4', 'Varies by population'], answer: '2' },
    { id: 'q4', question: 'What is the minimum age to vote in federal elections?', options: ['16', '17', '18', '21'], answer: '18' },
    { id: 'q5', question: 'How many electoral votes does a candidate need to win the presidency?', options: ['200', '270', '300', '538'], answer: '270' }
  ],
  glossary: [
    { id: 'g1', term: 'Absentee Ballot', definition: 'A ballot cast by a voter who cannot be present at their polling place on Election Day.' },
    { id: 'g2', term: 'Caucus', definition: 'A meeting of party members at the local level to select delegates.' },
    { id: 'g3', term: 'Electoral College', definition: 'The system by which the President is elected. 538 electors total.' }
  ]
};

/**
 * Verify Firebase ID Token
 * @param {string} token - The ID token from the client
 * @returns {Promise<Object>} Decoded token
 */
const verifyToken = async (token) => {
  if (mockMode) {
    if (token === 'mock-valid-token') {
      return { uid: 'mock-user-123', email: 'test@example.com', name: 'Test User' };
    }
    throw new Error('Invalid mock token');
  }
  return admin.auth().verifyIdToken(token);
};

/**
 * Save user profile to Firestore
 * @param {Object} user - User object with uid
 * @returns {Promise<Object>} Status object
 */
const saveUser = async (user) => {
  if (mockMode) {
    return { success: true };
  }
  await db.collection('users').doc(user.uid).set(user, { merge: true });
  return { success: true };
};

/**
 * Get all documents from a collection
 * @param {string} collectionName - Name of the Firestore collection
 * @returns {Promise<Array>} List of documents
 */
const getCollection = async (collectionName) => {
  if (mockMode) {
    return MOCK_DATA[collectionName] || [];
  }
  const snapshot = await db.collection(collectionName).get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

/**
 * Add document to a collection
 * @param {string} collectionName - Name of the collection
 * @param {Object} data - Document data
 * @returns {Promise<Object>} The added document with generated ID
 */
const addDocument = async (collectionName, data) => {
  if (mockMode) {
    return { id: 'mock-doc-id', ...data };
  }
  const docRef = await db.collection(collectionName).add(data);
  return { id: docRef.id, ...data };
};

module.exports = {
  verifyToken,
  saveUser,
  getCollection,
  addDocument,
  isMockMode: () => mockMode
};
