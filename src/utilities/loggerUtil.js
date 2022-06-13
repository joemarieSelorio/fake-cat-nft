require('dotenv').config();
const {createLogger, format, transports} = require('winston');

const {
  LOG_LEVEL,
  LOG_COLORIZE,
} = process.env;
const {combine, timestamp, printf, colorize} = format;

/**
 * Convert value to JSON, otherwise return undefined
 * @param {*} value - The value to convert
 * @return {object} JSON object equivalent of value passed
 */
function _toJson(value) {
  if (value && typeof value === 'object') {
    return value;
  }

  try {
    const result = JSON.parse(value);
    if (result && typeof result === 'object') {
      return result;
    }
  } catch (ParseError) {
    return;
  }
}

const consoleCustomFormat = printf((info) => {
  const message = (_toJson(info.message)) ?
    JSON.stringify(info.message) : info.message;
  return `${info.timestamp} [${info.level}]: ${message}`;
});

const logger = createLogger({
  levels: {
    event: 0,
    error: 1,
    warn: 2,
    info: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
  },
  transports: [
    new transports.Console({
      level: LOG_LEVEL || 'error',
      colorize: LOG_COLORIZE === 'true',
      timestamp: true,
      format: combine(
          timestamp(),
          colorize(),
          consoleCustomFormat,
      ),
    }),
  ],
});

module.exports = logger;
