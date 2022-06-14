require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();

const {v4: uuidv4} = require('uuid');

const {
  createNewAsset,
  getAssetByUuid,
  updateAssetStatus,
} = require('src/components/assets/assetsRepository');
const {
  getUserAsset,
  getUserGalleryById,
} = require('src/components/users/usersRepository');
const {createFakeCatNFT} = require('src/utilities/fakeNFTCatsUtil');
const HttpSuccess = require('src/responses/httpSuccess');
const UnauthorizedError = require('src/responses/unauthorizedError');
const BadRequestError = require('src/responses/badRequestError');
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
  try {
    const {
      name,
      initialAmount,
    } = req.body;
    const {fakeNFT} = req.files;
    const user = req.user;
    const uuid = uuidv4();

    if (!user) {
      return next(new UnauthorizedError('Unauthorized'));
    }


    const imgUrl = await createFakeCatNFT(
        fakeNFT.data,
        fakeNFT.name,
        uuid,
    );

    await createNewAsset(
        uuid,
        name,
        imgUrl,
        user.id,
        initialAmount,
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

/**
 * Controller for request to create user gallery
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next function to execute
 */
async function updateAsset(req, res, next) {
  const METHOD = '[updateAsset]';

  logger.info(`${TAG} ${METHOD}`);
  try {
    const {
      assetId,
    } = req.params;
    const {status} = req.body;
    const user = req.user;

    console.log(user);

    if (!user) {
      return next(new UnauthorizedError('Unauthorized'));
    }

    const gallery = await getUserGalleryById(user.id);


    if (!gallery) {
      return next(new BadRequestError('user has no gallery'));
    }

    const asset = await getUserAsset(user.id, assetId);

    if (!asset) {
      return next(new BadRequestError('asset not found'));
    }

    await updateAssetStatus(
        assetId,
        gallery.id,
        status,
    );

    const result = await getAssetByUuid(
        assetId,
    );

    res.locals.respObj = new HttpSuccess(
        200,
        'Successfully auctioned the asset',
        {asset: result},
    );

    next();
  } catch (err) {
    logger.error(`${TAG} ${METHOD} ${err}`);
    next(new HttpError('Failed to auction the asset'));
  }
}


module.exports = {
  createAsset,
  updateAsset,
};

