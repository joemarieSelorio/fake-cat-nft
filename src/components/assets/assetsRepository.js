require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();

const knex = require('knex')(require('knexfile'));


const logger = require('src/utilities/loggerUtil');

const {ASSETS_TABLE} = process.env;
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
  };
}


// should create get vote via asset id to retrieve asset's vote

module.exports = {
  createNewAsset,
  getAssetByUuid,
};
