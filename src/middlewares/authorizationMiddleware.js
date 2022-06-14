require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();

const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');

const {
  getUserByUuid,
} = require('src/components/users/usersRepository');
const HttpError = require('src/responses/httpError');
const logger = require('src/utilities/loggerUtil');

const {API_SECRET} = process.env;

const TAG = '[authorizationMiddleware]';

/**
 * Controller for request to create new user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next function to execute
 */
async function authorize(req, res, next) {
  const METHOD = '[authorize]';

  logger.info(`${TAG} ${METHOD}`);

  try {
    if (req.headers &&
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer') {
      const accessToken = req.headers.authorization.split(' ')[1];
      const decoded = await jwt.verify(accessToken, API_SECRET);

      console.log(decoded);
      const user = await getUserByUuid(decoded.id);

      user ? req.user = user : req.user = undefined;
    }
    next();
  } catch (err) {
    logger.error(`${TAG} ${METHOD} ${err}`);
    next(new HttpError(err));
  }
}

module.exports = {
  authorize,
};

