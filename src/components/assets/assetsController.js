require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();

const {v4: uuidv4} = require('uuid');

const {
  createNewAsset,
  getAssetByUuid,
  updateAssetStatus,
  createAssetOffer,
  getAllAssetOffers,
  getAssetOffer,
} = require('src/components/assets/assetsRepository');
const {
  getUserAsset,
  getUserGalleryById,
  getUserWalletByUserId,
} = require('src/components/users/usersRepository');
const {
  updateWalletByUserId,
} = require('src/components/wallets/walletsRepository');
const {
  updateOffer,
} = require('src/components/offers/offersRepository');
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


/**
 * Controller for request to create user gallery
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next function to execute
 */
async function createOffer(req, res, next) {
  const METHOD = '[createOffer]';

  logger.info(`${TAG} ${METHOD}`);
  try {
    const {assetId} = req.params;
    const {offeredAmount} = req.body;
    const uuid = uuidv4();
    const user = req.user;

    if (!user) {
      return next(new UnauthorizedError('Unauthorized'));
    }

    const wallet = await getUserWalletByUserId(user.id);


    if (!wallet) {
      return next(new BadRequestError('user has no wallet'));
    }

    const asset = await getUserAsset(user.id, assetId);

    if (!asset) {
      return next(new BadRequestError('asset not found'));
    }

    if (asset.currentAmount > wallet.amount) {
      return next(new BadRequestError('insufficient funds'));
    }

    await createAssetOffer(
        uuid,
        asset.id,
        user.id,
        offeredAmount,
    );

    res.locals.respObj = new HttpSuccess(
        200,
        'Successfully sent offer',
    );

    next();
  } catch (err) {
    logger.error(`${TAG} ${METHOD} ${err}`);
    next(new HttpError('Failed to send offer'));
  }
}

/**
 * Controller for request to fetch asset's offer
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next function to execute
 */
async function getOffers(req, res, next) {
  const METHOD = '[getOffers]';

  logger.info(`${TAG} ${METHOD}`);
  try {
    const {assetId} = req.params;
    const user = req.user;

    if (!user) {
      return next(new UnauthorizedError('Unauthorized'));
    }

    const asset = await getUserAsset(user.id, assetId);

    if (!asset) {
      return next(new BadRequestError('asset not found'));
    }

    const offers = await getAllAssetOffers(
        assetId,
    );

    res.locals.respObj = new HttpSuccess(
        200,
        'Successfully retrieved offers',
        {offers},
    );

    next();
  } catch (err) {
    logger.error(`${TAG} ${METHOD} ${err}`);
    next(new HttpError('Failed to retrieve offers'));
  }
}

/**
 * Controller for request to accept offer
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next function to execute
 */
async function acceptOffer(req, res, next) {
  const METHOD = '[acceptOffer]';

  logger.info(`${TAG} ${METHOD}`);
  try {
    const {assetId, offerId} = req.params;
    const user = req.user;

    if (!user) {
      return next(new UnauthorizedError('Unauthorized'));
    }

    const asset = await getUserAsset(user.id, assetId);

    if (!asset) {
      return next(new BadRequestError('asset not found'));
    }

    const offer = await getAssetOffer(asset.id, offerId);

    if (!offer) {
      return next(new BadRequestError('offer not found'));
    }

    const [offerOwnerWallet, assetOwnerWallet] = Promise.all(
        getUserWalletByUserId(offer.offerOwner),
        getUserWalletByUserId(user.id),
    );

    const newOfferOwnerAmount = offerOwnerWallet.amount - offer.amount;
    const newAssetOwnerAmount = assetOwnerWallet.amount + offer.amount;


    await updateWalletByUserId(offer.offerOwner, {
      amount: newOfferOwnerAmount,
    });

    await updateWalletByUserId(user.id, {
      amount: newAssetOwnerAmount,
    });

    await updateOffer(offer.id, {
      accepted: true,
    });


    await updateAssetStatus(
        asset.id,
        {
          owner_id: offer.offerOwner,
          auctioned: false,
          gallery_id: null,
          current_amount: offer.amountOffered,
        },
    );

    res.locals.respObj = new HttpSuccess(
        200,
        'Successfully accepted offer',
    );

    next();
  } catch (err) {
    logger.error(`${TAG} ${METHOD} ${err}`);
    next(new HttpError('Failed to retrieve offers'));
  }
}


module.exports = {
  createAsset,
  updateAsset,
  createOffer,
  getOffers,
  acceptOffer,
};

