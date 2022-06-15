require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();

const knex = require('knex')(require('knexfile'));
const {isString, isNumber} = require('lodash');

const logger = require('src/utilities/loggerUtil');

const {WALLETS_TABLE} = process.env;
const TAG = '[walletRepository]';

/**
 * Creates new User
 * @param {string} id - Wallet's uuid
 * @param {string} userId - User's email
 * @param {number} amount - Initial amount
 */
async function createNewWallet(
    id,
    userId,
    amount,
) {
  const METHOD = '[createNewWallet]';
  logger.info(`${TAG} ${METHOD}`);

  if (!isString(id)) throw new Error('invalid uuid');
  if (!isString(userId)) throw new Error('invalid user id');
  if (!isNumber(amount)) throw new Error('invalid amount');

  const newWallet = {
    uuid: id,
    user_id: userId,
    amount,
  };

  return await knex.insert(newWallet).into(WALLETS_TABLE);
}

/**
 * Get user details
 * @param {string} uuid - User's unique identification
 */
async function getWalletByUuid(
    uuid,
) {
  const METHOD = '[getWalletByUuid]';
  logger.info(`${TAG} ${METHOD}`);

  if (!isString(uuid)) throw new Error('invalid uuid');

  const wallet = await knex.where({uuid}).from(WALLETS_TABLE).first();

  if (wallet) {
    return {
      uuid: wallet.uuid,
      amount: wallet.amount,
      userId: wallet.user_id,
      createdAt: wallet.created_at,
      lastUpdatedAt: wallet.last_updated_at,
    };
  }

  return false;
}

/**
 * Get user's wallet
 * @param {string} userId - User's email
 */
async function getWalletByUserId(
    userId,
) {
  const METHOD = '[getWalletByUserId]';
  logger.info(`${TAG} ${METHOD}`);

  if (!isString(userId)) throw new Error('invalid uuid');

  const wallet = await knex
      .where({user_id: userId})
      .from(WALLETS_TABLE)
      .first();

  if (wallet) {
    return {
      uuid: wallet.uuid,
      amount: wallet.amount,
      userId: wallet.user_id,
      createdAt: wallet.created_at,
      lastUpdatedAt: wallet.last_updated_at,
    };
  }

  return false;
}

/**
 * Update fake nft details
 * @param {string} userId - Wallet's owner unique identification
 * @param {Object} dataToUpdate - Key value pair of fields to be updated
 * @param {boolean} value - New value
 */
async function updateWalletByUserId(
    userId,
    dataToUpdate,
) {
  const METHOD = '[updateWalletByUserId]';
  logger.info(`${TAG} ${METHOD}`);

  if (!isString(userId)) throw new Error('invalid uuid');
  if (Object.keys(dataToUpdate).length === 0) {
    throw new Error('invalid properties');
  }


  const wallet = await knex
      .where({user_id: userId})
      .update(dataToUpdate)
      .from(WALLETS_TABLE);

  if (wallet) {
    return {
      uuid: wallet.uuid,
      amount: wallet.amount,
    };
  }

  return false;
}

module.exports = {
  createNewWallet,
  getWalletByUuid,
  updateWalletByUserId,
  getWalletByUserId,
};

