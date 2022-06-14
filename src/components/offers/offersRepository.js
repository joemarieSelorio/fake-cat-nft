require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();

const knex = require('knex')(require('knexfile'));


const logger = require('src/utilities/loggerUtil');

const {OFFERS_TABLE} = process.env;
const TAG = '[offersRepository]';

/**
 * Get vote details
 * @param {string} uuid - User's unique identification
 */
async function getOfferByUuid(
    uuid,
) {
  const METHOD = '[getOfferByUuid]';
  logger.info(`${TAG} ${METHOD}`);

  const offer = await knex(OFFERS_TABLE).where({uuid}).first();

  return {
    id: offer.uuid,
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

  return await knex
      .where({
        uuid,
      })
      .update(dataToUpdate)
      .from(OFFERS_TABLE);
}


module.exports = {
  getOfferByUuid,
  updateOffer,
};
