require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();
const {v4: uuidv4} = require('uuid');

const {
  createNewUser,
  getUserByUuid,
} = require('src/components/users/usersRepository');
const HttpSuccess = require('src/responses/httpSuccess');
const HttpError = require('src/responses/httpError');
const logger = require('src/utilities/loggerUtil');

const TAG = '[usersController]';

/**
 * Controller for request to create new user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next function to execute
 */
async function createUser(req, res, next) {
  const METHOD = '[sendEmail]';

  logger.info(`${TAG} ${METHOD}`);

  const {
    firstName,
    lastName,
    username,
    email,
    password,
  } = req.body;

  const uuid = uuidv4();

  try {
    await createNewUser(
        uuid,
        firstName,
        lastName,
        username,
        email,
        password,
    );

    const user = await getUserByUuid(uuid);

    console.log(user);

    res.locals.respObj = new HttpSuccess(
        200,
        'Successfully create user',
        {user},
    );

    next();
  } catch (err) {
    logger.error(`${TAG} ${METHOD} ${err}`);
    next(new HttpError('Failed to create user'));
  }
}


module.exports = {
  createUser,
};

