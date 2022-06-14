require('app-module-path').addPath(require('app-root-path').toString());

const HttpError = require('src/responses/httpError');

/**
 * Class to provide uniform instance/formatting for forbidden error responses
 * @module BadRequestError
 */
class BadRequestError extends HttpError {
  /**
   * @constructor
   * @param {string} message - Custom error message
   */
  constructor(message = 'Forbidden Error') {
    super(new Date(), 400, 9995, message);
  }
}

module.exports = BadRequestError;
