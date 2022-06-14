require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();

const {map} = require('lodash');
const knex = require('knex')(require('knexfile'));

const logger = require('src/utilities/loggerUtil');

const {ASSETS_TABLE, OFFERS_TABLE} = process.env;
const TAG = '[assetsRepository]';

/**
 * Creates fake nft cats for user
 * @param {string} id - asset's uuid
 * @param {string} name - asset's  name
 * @param {string} imgUrl - asset's  name
 * @param {string} userId - asset's  name
 * @param {number} amount - asset's  amount
 * @param {string} galleryId - asset's  name
 */
async function createNewAsset(
    id,
    name,
    imgUrl,
    userId,
    amount,
) {
  const METHOD = '[createNewAsset]';
  logger.info(`${TAG} ${METHOD}`);

  // Should remove gallery id and update it as nullable in schema

  const newAsset = {
    uuid: id,
    name,
    img_url: imgUrl,
    user_id: userId,
    initial_amount: amount,
    current_amount: amount,
  };

  return await knex.insert(newAsset).into(ASSETS_TABLE);
}

/**
 * Get fake nft details
 * @param {string} uuid - User's unique identification
 */
async function getAssetByUuid(
    uuid,
) {
  const METHOD = '[getAssetByUuid]';
  logger.info(`${TAG} ${METHOD}`);

  const asset = await knex(ASSETS_TABLE).where({uuid}).first();

  return {
    id: asset.uuid,
    name: asset.name,
    imgUrl: asset.img_url,
    auctioned: asset.auctioned,
  };
}

/**
 * Get fake nft details
 * @param {string} uuid - Asset's unique identification
 * @param {Object} dataToUpdate - Key value pair of fields to be updated
 * @param {boolean} value - New value
 */
async function updateAssetStatus(
    uuid,
    dataToUpdate,
) {
  const METHOD = '[updateAssetStatus]';
  logger.info(`${TAG} ${METHOD}`);

  return await knex
      .where({
        uuid,
      })
      .update(dataToUpdate)
      .from(ASSETS_TABLE);
}


/**
 * Creates offer for the auctioned fake NFT
 * @param {string} uuid - Offer's unique identification
 * @param {string} assetId - Asset's  uuid
 * @param {string} offerOwnerId - Offer owner's uuid
 * @param {number} offeredAmount - Offered amount
 */
async function createAssetOffer(
    uuid,
    assetId,
    offerOwnerId,
    offeredAmount,
) {
  const METHOD = '[createAssetOffer]';
  logger.info(`${TAG} ${METHOD}`);


  const newOffer = {
    uuid,
    asset_id: assetId,
    offer_owner: offerOwnerId,
    amount_offer: offeredAmount,
  };

  return await knex.insert(newOffer).into(OFFERS_TABLE);
}

/**
 * Fetch all asset's offer
 * @param {string} assetId - Asset's id
 */
async function getAllAssetOffers(
    assetId,
) {
  const METHOD = '[getAssetOffers]';
  logger.info(`${TAG} ${METHOD}`);

  const offers = await knex
      .where({asset_id: assetId})
      .from(OFFERS_TABLE);

  return map(offers, (offer) => {
    return {
      id: offer.uuid,
      offerOwner: offer.offer_owner,
      AmountOffer: offer.amount_offer,
      accepted: Boolean(offer.accepted),
      createdAt: offer.created_at,
      lastUpdatedAt: offer.lastUpdated_at,
    };
  });
}

/**
 * Fetch all asset's offer
 * @param {string} assetId - Asset's id
 * @param {string} offerId - Asset's id
 */
async function getAssetOffer(
    assetId,
    offerId,
) {
  const METHOD = '[getAssetOffer]';
  logger.info(`${TAG} ${METHOD}`);

  const offer = await knex
      .where({
        uuid: offerId,
        asset_id: assetId,
      })
      .from(OFFERS_TABLE)
      .first();

  return {
    id: offer.uuid,
    offerOwner: offer.offer_owner,
    amountOffered: offer.amount_offer,
    accepted: Boolean(offer.accepted),
    createdAt: offer.created_at,
    lastUpdatedAt: offer.lastUpdated_at,
  };
}


module.exports = {
  createNewAsset,
  getAssetByUuid,
  updateAssetStatus,
  createAssetOffer,
  getAllAssetOffers,
  getAssetOffer,
};
