require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();
const {v4: uuidv4} = require('uuid');

const {
  createNewWallet,
  getWalletByUuid,
} = require('src/components/wallets/walletsRepository');
const HttpSuccess = require('src/responses/httpSuccess');
const HttpError = require('src/responses/httpError');
const UnauthorizedError = require('src/responses/unauthorizedError');
const logger = require('src/utilities/loggerUtil');


const TAG = '[walletsController]';

/**
 * Controller for request to create new wallet
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next function to execute
 */
async function createWallet(req, res, next) {
  const METHOD = '[createWallet]';

  logger.info(`${TAG} ${METHOD}`);

  try {
    const {
      amount,
    } = req.body;
    const user = req.user;
    const uuid = uuidv4();

    if (!req.user) {
      return next(new UnauthorizedError('Unauthorized'));
    }

    await createNewWallet(
        uuid,
        user.id,
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
    return next(new HttpError('Failed to create new wallet'));
  }
}


module.exports = {
  createWallet,
};

