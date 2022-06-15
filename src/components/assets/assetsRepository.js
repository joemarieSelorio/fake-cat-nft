require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();

const {map, isEmpty, isString, isNumber} = require('lodash');
const knex = require('knex')(require('knexfile'));

const logger = require('src/utilities/loggerUtil');

const {ASSETS_TABLE} = process.env;
const TAG = '[assetsRepository]';

/**
 * Creates fake nft cats for user
 * @param {string} uuid - asset's uuid
 * @param {string} name - asset's  name
 * @param {string} imgUrl - asset's  name
 * @param {string} userId - asset's  name
 * @param {number} amount - asset's  amount
 */
async function createNewAsset(
    uuid,
    name,
    imgUrl,
    userId,
    amount,
) {
  const METHOD = '[createNewAsset]';
  logger.info(`${TAG} ${METHOD}`);

  if (!isString(uuid)) throw new Error('invalid uuid');
  if (!isString(name)) throw new Error('invalid name');
  if (!isString(imgUrl)) throw new Error('invalid image url');
  if (!isString(userId)) throw new Error('invalid user id');
  if (!isNumber(amount)) throw new Error('invalid amount');

  const newAsset = {
    uuid,
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

  if (!isString(uuid)) throw new Error('invalid uuid');

  const asset = await knex.where({uuid}).from(ASSETS_TABLE).first();

  if (asset) {
    return {
      id: asset.uuid,
      name: asset.name,
      ownerId: asset.user_id,
      imgUrl: asset.img_url,
      auctioned: asset.auctioned,
    };
  }

  return false;
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

  if (!isString(uuid)) throw new Error('invalid uuid');
  if (Object.keys(dataToUpdate).length === 0) {
    throw new Error('invalid properties');
  }

  return await knex
      .where({
        uuid,
      })
      .update(dataToUpdate)
      .from(ASSETS_TABLE);
}


/**
 * Fetch all assets using user id
 * @param {string} userId - User's email
 */
async function getAllUserAssets(
    userId,
) {
  const METHOD = '[getAllUserAssets]';
  logger.info(`${TAG} ${METHOD}`);

  if (!isString(userId)) throw new Error('invalid user id');

  const assets = await knex
      .where({user_id: userId})
      .from(ASSETS_TABLE);

  if (!isEmpty(assets)) {
    return map(assets, (asset) => {
      return {
        id: asset.uuid,
        name: asset.name,
        imgUrl: asset.img_url,
        auctioned: asset.auctioned,
        initialAmount: asset.initial_amount,
        currentAmount: asset.current_amount,
        createdAt: asset.created_at,
        lastUpdatedAt: asset.lastUpdated_at,
      };
    });
  }

  return false;
}

/**
 * Fetch specific asset using user ID and asset ID
 * @param {string} userId - User's email
 * @param {string} assetId - User's email
 */
async function getUserAsset(
    userId,
    assetId,
) {
  const METHOD = '[getUserAsset]';
  logger.info(`${TAG} ${METHOD}`);

  if (!isString(userId)) throw new Error('invalid user id');
  if (!isString(assetId)) throw new Error('invalid asset id');

  const asset = await knex
      .where({user_id: userId, uuid: assetId})
      .from(ASSETS_TABLE)
      .first();

  if (asset) {
    return {
      id: asset.uuid,
      name: asset.name,
      imgUrl: asset.img_url,
      auctioned: asset.auctioned,
      initialAmount: asset.initial_amount,
      currentAmount: asset.current_amount,
      createdAt: asset.created_at,
      lastUpdatedAt: asset.lastUpdated_at,
    };
  }

  return false;
}


module.exports = {
  createNewAsset,
  getAssetByUuid,
  updateAssetStatus,
  getUserAsset,
  getAllUserAssets,
};
