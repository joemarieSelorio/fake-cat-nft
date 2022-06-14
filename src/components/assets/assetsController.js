require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();
const {v4: uuidv4} = require('uuid');

const {
  createNewAsset,
  getAssetByUuid,
} = require('src/components/assets/assetsRepository');
const {createFakeCatNFT} = require('src/utilities/fakeNFTCatsUtil');
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
  try {
    const {
      name,
      initialAmount,
    } = req.body;
    const {fakeNFT} = req.files;
    const user = req.user;
    const uuid = uuidv4();


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


module.exports = {
  createAsset,
};

