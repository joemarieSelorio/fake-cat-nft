require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();

const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');


const {
  getUserByEmail,
} = require('src/components/users/usersRepository');
const HttpSuccess = require('src/responses/httpSuccess');
const HttpError = require('src/responses/httpError');
const logger = require('src/utilities/loggerUtil');

const {API_SECRET} = process.env;

const TAG = '[authController]';

/**
 * Controller for request to create new user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next function to execute
 */
async function login(req, res, next) {
  const METHOD = '[login]';

  logger.info(`${TAG} ${METHOD}`);

  try {
    const {
      email,
    } = req.body;
    const user = await getUserByEmail(email);

    const token = jwt.sign({
      id: user.id,
    }, API_SECRET, {
      expiresIn: 86400,
    });

    res.locals.respObj = new HttpSuccess(
        200,
        'Successfully logged in',
        {user, token},
    );

    next();
  } catch (err) {
    logger.error(`${TAG} ${METHOD} ${err}`);
    next(new HttpError('Failed to login'));
  }
}

module.exports = {
  login,
};

