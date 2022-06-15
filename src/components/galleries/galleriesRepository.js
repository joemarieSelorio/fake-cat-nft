require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();

const knex = require('knex')(require('knexfile'));
const {isString} = require('lodash');

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

  if (!isString(id)) throw new Error('invalid uuid');
  if (!isString(name)) throw new Error('invalid name');
  if (!isString(userId)) throw new Error('invalid user id');

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

  if (!isString(uuid)) throw new Error('invalid uuid');

  const gallery = await knex.where({uuid}).from(GALLERIES_TABLE).first();

  if (gallery) {
    return {
      id: gallery.uuid,
      name: gallery.name,
      createdAt: gallery.created_at,
      lastUpdatedAt: gallery.last_updated_at,
    };
  }
  return false;
}

/**
 * Get user's wallet
 * @param {string} userId - User's email
 */
async function getGalleryByUserId(
    userId,
) {
  const METHOD = '[getGalleryByUserId]';
  logger.info(`${TAG} ${METHOD}`);

  if (!isString(userId)) throw new Error('invalid user id');

  const gallery = await knex
      .where({user_id: userId})
      .from(GALLERIES_TABLE)
      .first();

  if (gallery) {
    return {
      id: gallery.uuid,
      name: gallery.name,
      createdAt: gallery.created_at,
      lastUpdatedAt: gallery.last_updated_at,
    };
  }

  return false;
}

module.exports = {
  createNewGallery,
  getGalleryByUuid,
  getGalleryByUserId,
};
