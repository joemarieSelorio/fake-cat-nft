require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();

const {v4: uuidv4} = require('uuid');
const {render} = require('ejs');

const {
  createNewAsset,
  getAssetByUuid,
  updateAssetStatus,
  getUserAsset,
} = require('src/components/assets/assetsRepository');
const {
  createNewOffer,
  getAssetOffer,
  getAllAssetOffers,
} = require('src/components/offers/offersRepository');
const {sendNotification} = require('src/services/emailService');
const {
  getUserByUuid,
} = require('src/components/users/usersRepository');
const {
  getGalleryByUserId,
} = require('src/components/galleries/galleriesRepository');
const {
  updateWalletByUserId,
  getWalletByUserId,
} = require('src/components/wallets/walletsRepository');
const {
  updateOffer,
} = require('src/components/offers/offersRepository');
const offerNotif = require('src/components/emails/offerNotif');
const acceptedOfferNotif = require('src/components/emails/acceptedOfferNotif');
const {createFakeCatNFT} = require('src/utilities/fakeNFTCatsUtil');
const HttpSuccess = require('src/responses/httpSuccess');
const UnauthorizedError = require('src/responses/unauthorizedError');
const BadRequestError = require('src/responses/badRequestError');
const HttpError = require('src/responses/httpError');
const logger = require('src/utilities/loggerUtil');

const TAG = '[assetsController]';

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
        Number(initialAmount),
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

    if (!user) {
      return next(new UnauthorizedError('Unauthorized'));
    }

    const gallery = await getGalleryByUserId(user.id);


    if (!gallery) {
      return next(new BadRequestError('user has no gallery'));
    }

    const asset = await getUserAsset(user.id, assetId);

    if (!asset) {
      return next(new BadRequestError('asset not found'));
    }

    await updateAssetStatus(
        assetId,
        {
          gallery_id: gallery.id,
          auctioned: status,
        },
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

    const wallet = await getWalletByUserId(user.id);


    if (!wallet) {
      return next(new BadRequestError('user has no wallet'));
    }

    const asset = await getAssetByUuid(assetId);

    if (!asset) {
      return next(new BadRequestError('asset not found'));
    }

    const owner = await getUserByUuid(asset.ownerId);

    if (!owner) {
      return next(new BadRequestError('asset owner not found'));
    }

    if (asset.currentAmount > wallet.amount) {
      return next(new BadRequestError('insufficient funds'));
    }

    await createNewOffer(
        uuid,
        asset.id,
        user.id,
        Number(offeredAmount),
    );

    const subject = offerNotif.subject;
    const body = render(offerNotif.body, {name: owner.firstName});

    await sendNotification(
        owner.email,
        subject,
        body,
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

    const offerer = await getUserByUuid(offer.offerOwner);

    const [offerOwnerWallet, assetOwnerWallet] = await Promise.all([
      getWalletByUserId(offer.offerOwner),
      getWalletByUserId(user.id)],
    );

    const newOfferOwnerAmount = offerOwnerWallet.amount - offer.amountOffer;
    const newAssetOwnerAmount = assetOwnerWallet.amount + offer.amountOffer;

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
          user_id: offer.offerOwner,
          auctioned: false,
          gallery_id: null,
          current_amount: offer.amountOffered,
        },
    );

    const subject = acceptedOfferNotif.subject;
    const body = render(acceptedOfferNotif.body, {
      name: offerer.firstName,
      asset: asset.name,
    });

    await sendNotification(
        offerer.email,
        subject,
        body,
    );

    res.locals.respObj = new HttpSuccess(
        200,
        'Successfully accepted offer',
    );

    next();
  } catch (err) {
    logger.error(`${TAG} ${METHOD} ${err}`);
    next(new HttpError('Failed to accept offers'));
  }
}


module.exports = {
  createAsset,
  updateAsset,
  createOffer,
  getOffers,
  acceptOffer,
};

