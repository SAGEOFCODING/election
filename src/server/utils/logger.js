const winston = require('winston');

/**
 * production-grade logger using Winston
 * Includes timestamp and JSON formatting for cloud logging
 */
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'election-iq' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, service, ...rest }) => {
          const meta = Object.keys(rest).length ? JSON.stringify(rest) : '';
          return `[${timestamp}] ${level} [${service}]: ${message} ${meta}`;
        })
      )
    })
  ]
});

module.exports = logger;
