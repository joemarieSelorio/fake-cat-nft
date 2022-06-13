require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();

const knex = require('knex')(require('knexfile'));


const logger = require('src/utilities/loggerUtil');

const {GALLERIES_TABLE} = process.env;
const TAG = '[galleriesRepository]';

/**
 * Creates gallery of the user
 * @param {string} id - Gallery's uuid
 * @param {string} name - Gallery's  name
 * @param {string} userId - Owner's unique Identification
 */
async function createNewGallery(
    id,
    name,
    userId,
) {
  const METHOD = '[createNewGallery]';
  logger.info(`${TAG} ${METHOD}`);

  const newGallery = {
    uuid: id,
    name,
    user_id: userId,
  };

  return await knex.insert(newGallery).into(GALLERIES_TABLE);
}

/**
 * Get user details
 * @param {string} uuid - User's unique identification
 */
async function getGalleryByUuid(
    uuid,
) {
  const METHOD = '[getGalleryByUuid]';
  logger.info(`${TAG} ${METHOD}`);

  const gallery = await knex(GALLERIES_TABLE).where({uuid}).first();

  return {
    id: gallery.uuid,
    name: gallery.name,
  };
}

module.exports = {
  createNewGallery,
  getGalleryByUuid,
};
