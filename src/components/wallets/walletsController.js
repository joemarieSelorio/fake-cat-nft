require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();
const {v4: uuidv4} = require('uuid');

const {
  createNewWallet,
  getWalletByUuid,
} = require('src/components/wallets/walletsRepository');
const {
  getUserByEmail,
} = require('src/components/users/usersRepository');
const HttpSuccess = require('src/responses/httpSuccess');
const HttpError = require('src/responses/httpError');
const logger = require('src/utilities/loggerUtil');


const TAG = '[walletsController]';

/**
 * Controller for request to create new wallet
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next function to execute
 */
async function createWallet(req, res, next) {
  const METHOD = '[sendEmail]';

  logger.info(`${TAG} ${METHOD}`);

  const {
    email,
    amount,
  } = req.body;

  const uuid = uuidv4();

  try {
    const {id: userId} = await getUserByEmail(email);

    await createNewWallet(
        uuid,
        userId,
        amount,
    );

    const wallet = await getWalletByUuid(uuid);

    res.locals.respObj = new HttpSuccess(
        200,
        'Successfully create wallet',
        {wallet},
    );

    next();
  } catch (err) {
    logger.error(`${TAG} ${METHOD} ${err}`);
    next(new HttpError('Failed to create wallet'));
  }
}


module.exports = {
  createWallet,
};

