const {forEach} = require('lodash');

/**
 * Class to provide uniform instance/formatting for HTTP success responses
 * @module HttpSuccess
 */
class HttpSuccess {
  /**
   * @constructor
   * @param {number} status - HTTP status code
   * @param {string} message - Error description
   * @param {object} additionalData - Other data to be added in response
   */
  constructor(status = 200,
      message = 'Operation completed successfully',
      additionalData) {
    this.timestamp = new Date();
    this.status = status;
    this.message = message;

    forEach(additionalData, (value, key) => {
      this[key] = value;
    });
  }
}

module.exports = HttpSuccess;
