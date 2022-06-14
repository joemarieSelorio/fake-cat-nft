require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();

const {map} = require('lodash');
const knex = require('knex')(require('knexfile'));


const logger = require('src/utilities/loggerUtil');

const {USERS_TABLE, WALLETS_TABLE, ASSETS_TABLE} = process.env;
const TAG = '[usersRepository]';

/**
 * Creates new User
 * @param {string} id - User's uuid
 * @param {string} email - User's email
 * @param {string} firstName - User's first name
 * @param {string} lastName - User's last name
 * @param {string} password - User's password
 */
async function createNewUser(
    id,
    email,
    firstName,
    lastName,
    password,
) {
  const METHOD = '[createUser]';
  logger.info(`${TAG} ${METHOD}`);

  // use bcrypt salt for password

  const newUser = {
    uuid: id,
    email_address: email,
    first_name: firstName,
    last_name: lastName,
    password,
  };

  return await knex.insert(newUser).into(USERS_TABLE);
}

/**
 * Get user details
 * @param {string} uuid - User's unique identification
 */
async function getUserByUuid(
    uuid,
) {
  const METHOD = '[getUserByUuid]';
  logger.info(`${TAG} ${METHOD}`);

  const user = await knex.where({uuid}).from(USERS_TABLE).first();

  return {
    id: user.uuid,
    firstName: user.first_name,
    lastName: user.last_name,
    createdAt: user.created_at,
    lastUpdatedAt: user.last_updated_at,
  };
}

/**
 * Get user details
 * @param {string} email - User's unique identification
 */
async function getUserByEmail(
    email,
) {
  const METHOD = '[getUserByUuid]';
  logger.info(`${TAG} ${METHOD}`);

  const user = await knex
      .where({email_address: email})
      .from(USERS_TABLE)
      .first();

  return {
    id: user.uuid,
    firstName: user.first_name,
    lastName: user.last_name,
    createdAt: user.created_at,
    lastUpdatedAt: user.last_updated_at,
  };
}

/**
 * Get user's wallet
 * @param {string} userId - User's email
 */
async function getUserWalletByUserId(
    userId,
) {
  const METHOD = '[getUserWalletByUserId]';
  logger.info(`${TAG} ${METHOD}`);

  const wallet = await knex
      .where({user_id: userId})
      .from(WALLETS_TABLE)
      .first();

  return {
    userId: wallet.user_id,
    amount: wallet.amount,
  };
}

/**
 * Fetch all user's asset
 * @param {string} userId - User's email
 */
async function getUserAssets(
    userId,
) {
  const METHOD = '[getUserAssets]';
  logger.info(`${TAG} ${METHOD}`);

  const assets = await knex
      .where({user_id: userId})
      .from(ASSETS_TABLE)
      .first();

  return map(assets, (asset) => {
    return {
      id: asset.id,
      name: asset.name,
      initialAmount: asset.initialAmount,
      currentAmount: asset.current_amount,
      createdAt: asset.created_at,
      lastUpdatedAt: asset.lastUpdated_at,
    };
  });
}


module.exports = {
  createNewUser,
  getUserByEmail,
  getUserByUuid,
  getUserWalletByUserId,
  getUserAssets,
};
