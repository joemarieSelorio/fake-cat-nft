require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();

const {map, isString, isNumber} = require('lodash');
const knex = require('knex')(require('knexfile'));


const logger = require('src/utilities/loggerUtil');

const {OFFERS_TABLE} = process.env;
const TAG = '[offersRepository]';

/**
 * Creates offer for the auctioned fake NFT
 * @param {string} uuid - Offer's unique identification
 * @param {string} assetId - Asset's  uuid
 * @param {string} offerOwnerId - Offer owner's uuid
 * @param {number} offeredAmount - Offered amount
 */
async function createNewOffer(
    uuid,
    assetId,
    offerOwnerId,
    offeredAmount,
) {
  const METHOD = '[createNewOffer]';
  logger.info(`${TAG} ${METHOD}`);

  if (!isString(uuid)) throw new Error('invalid uuid');
  if (!isString(assetId)) throw new Error('invalid asset id');
  if (!isString(offerOwnerId)) throw new Error('invalid offer owner id');
  if (!isNumber(offeredAmount)) throw new Error('invalid offer amount');

  const newOffer = {
    uuid,
    asset_id: assetId,
    offer_owner: offerOwnerId,
    amount_offer: offeredAmount,
  };

  return await knex.insert(newOffer).into(OFFERS_TABLE);
}

/**
 * Get vote details
 * @param {string} uuid - User's unique identification
 */
async function getOfferByUuid(
    uuid,
) {
  const METHOD = '[getOfferByUuid]';
  logger.info(`${TAG} ${METHOD}`);

  if (!isString(uuid)) throw new Error('invalid uuid');

  const offer = await knex.where({uuid}).from(OFFERS_TABLE).first();

  return {
    id: offer.uuid,
    offerOwner: offer.offer_owner,
    AmountOffer: offer.amount_offer,
    accepted: Boolean(offer.accepted),
    createdAt: offer.created_at,
    lastUpdatedAt: offer.last_updated_at,
  };
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

  if (!isString(assetId)) throw new Error('invalid asset id');

  const offers = await knex
      .where({asset_id: assetId})
      .from(OFFERS_TABLE);

  return map(offers, (offer) => {
    return {
      id: offer.uuid,
      offerOwner: offer.offer_owner,
      amountOffer: offer.amount_offer,
      accepted: Boolean(offer.accepted),
      createdAt: offer.created_at,
      lastUpdatedAt: offer.last_updated_at,
    };
  });
}

/**
 * Fetch  asset's specific offer
 * @param {string} assetId - Asset's id
 * @param {string} offerId - Asset's id
 */
async function getAssetOffer(
    assetId,
    offerId,
) {
  const METHOD = '[getAssetOffer]';
  logger.info(`${TAG} ${METHOD}`);

  if (!isString(assetId)) throw new Error('invalid asset id');
  if (!isString(offerId)) throw new Error('invalid offer id');

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
    amountOffer: offer.amount_offer,
    accepted: Boolean(offer.accepted),
    createdAt: offer.created_at,
    lastUpdatedAt: offer.last_updated_at,
  };
}


/**
 * Update offer details
 * @param {string} uuid - Offer's unique identification
 * @param {Object} dataToUpdate - Key value pair of fields to be updated
 */
async function updateOffer(
    uuid,
    dataToUpdate,
) {
  const METHOD = '[updateOffer]';
  logger.info(`${TAG} ${METHOD}`);

  if (!isString(uuid)) throw new Error('invalid uuid');

  return await knex
      .where({
        uuid,
      })
      .update(dataToUpdate)
      .from(OFFERS_TABLE);
}


module.exports = {
  createNewOffer,
  getAssetOffer,
  getAllAssetOffers,
  getOfferByUuid,
  updateOffer,
};
