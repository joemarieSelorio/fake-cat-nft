/**
 * Http Exception Object
 * @param {number} code - Http code
 * @param {string} message - Response message
 * @param {array} data - Response errors
 * @return {undefined}
 */
function HttpException(
    code,
    message,
    data = [],
) {
  this.name = 'HttpException';
  this.code = code;
  this.message = message;
  this.data = data;
}

module.exports = HttpException;
