require('app-module-path').addPath(require('app-root-path').toString());

const HttpError = require('src/responses/httpError');

/**
 * Class to provide uniform instance/formatting for unauthorized error responses
 * @module UnauthorizedError
 */
class UnauthorizedError extends HttpError {
  /**
   * @constructor
   * @param {string} message - Custom error message
   */
  constructor(message = 'Unauthorized Error') {
    super(new Date(), 401, 9996, message);
  }
}

module.exports = UnauthorizedError;
