require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();
const {v4: uuidv4} = require('uuid');

const {
  createNewAsset,
  getAssetByUuid,
} = require('src/components/assets/assetsRepository');
const {
  getUserByEmail,
} = require('src/components/users/usersRepository');
const HttpSuccess = require('src/responses/httpSuccess');
const HttpError = require('src/responses/httpError');
const logger = require('src/utilities/loggerUtil');


const TAG = '[assetsRepository]';

/**
 * Controller for request to create user gallery
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next function to execute
 */
async function createAsset(req, res, next) {
  const METHOD = '[createAsset]';

  logger.info(`${TAG} ${METHOD}`);
  // should call cats api and remove imgUrl since we will upload an img
  // should remove galleryId since it should not be required when creating asset
  // should check wallet balance of user first before creating asset
  const {
    email,
    name,
    imgUrl,
    amount,
    galleryId,
  } = req.body;

  const uuid = uuidv4();

  try {
    const {id: userId} = await getUserByEmail(email);

    await createNewAsset(
        uuid,
        name,
        imgUrl,
        userId,
        amount,
        galleryId,
    );

    const asset = await getAssetByUuid(uuid);

    res.locals.respObj = new HttpSuccess(
        200,
        'Successfully created fake cat nft',
        {asset},
    );

    next();
  } catch (err) {
    logger.error(`${TAG} ${METHOD} ${err}`);
    next(new HttpError('Failed to create fake nft cat'));
  }
}


module.exports = {
  createAsset,
};

