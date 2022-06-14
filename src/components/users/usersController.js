require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();

const {v4: uuidv4} = require('uuid');
const bcrypt = require('bcrypt');

const {
  createNewUser,
  getUserByUuid,
  getUserWalletByUserId,
  getAllUserAssets,
} = require('src/components/users/usersRepository');
const HttpSuccess = require('src/responses/httpSuccess');
const HttpError = require('src/responses/httpError');
const BadRequestError = require('src/responses/badRequestError');
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
    email,
    firstName,
    lastName,
    password,
  } = req.body;

  const uuid = uuidv4();
  const hashedPassword= await bcrypt.hash(password, 10);

  try {
    await createNewUser(
        uuid,
        email,
        firstName,
        lastName,
        hashedPassword,
    );

    const user = await getUserByUuid(uuid);

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

/**
 * Controller for request to create new user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next function to execute
 */
async function getUserWallet(req, res, next) {
  const METHOD = '[sendEmail]';

  logger.info(`${TAG} ${METHOD}`);

  try {
    const {id} = req.params;

    const wallet = await getUserWalletByUserId(id);

    if (!wallet) {
      return next(new BadRequestError('wallet not found'));
    }

    res.locals.respObj = new HttpSuccess(
        200,
        'Successfully retrieved user wallet',
        {wallet},
    );

    next();
  } catch (err) {
    logger.error(`${TAG} ${METHOD} ${err}`);
    next(new HttpError('Failed to retrieve user wallet'));
  }
}

/**
 * Controller for request to create new user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next function to execute
 */
async function getUserAssets(req, res, next) {
  const METHOD = '[getUserAssets]';

  logger.info(`${TAG} ${METHOD}`);

  try {
    const {
      id,
    } = req.params;

    const assets = await getAllUserAssets(id);

    res.locals.respObj = new HttpSuccess(
        200,
        'Successfully retrieved user assets',
        {assets},
    );

    next();
  } catch (err) {
    logger.error(`${TAG} ${METHOD} ${err}`);
    next(new HttpError('Failed to retrieve user assets'));
  }
}

module.exports = {
  createUser,
  getUserWallet,
  getUserAssets,
};

