const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

const authRoutes = require('./routes/auth');
const electionRoutes = require('./routes/election');
const calendarRoutes = require('./routes/calendar');
const searchRoutes = require('./routes/search');
const chatRoutes = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com", "https://apis.google.com", "https://maps.googleapis.com", "https://www.gstatic.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://maps.gstatic.com", "https://maps.googleapis.com", "https://*.googleusercontent.com"],
      connectSrc: ["'self'", "https://*.googleapis.com", "https://*.firebaseio.com", "https://identitytoolkit.googleapis.com", "https://securetoken.googleapis.com"]
    }
  }
}));

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL : 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Public config endpoint for client-side Firebase initialization
app.get('/api/config/firebase', (req, res) => {
  res.json({
    apiKey: process.env.FIREBASE_API_KEY || '',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.FIREBASE_APP_ID || '',
    googleClientId: process.env.GOOGLE_CLIENT_ID || ''
  });
});

// API Routes with Rate Limiting
app.use('/api/', apiLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/election', electionRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/chat', chatRoutes);

// Static Client Files
app.use(express.static(path.join(__dirname, '../client')));

// Catch-all for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Central Error Handling
app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
}

module.exports = app;
