require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();

const knex = require('knex')(require('knexfile'));


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

  const wallet = await knex(WALLETS_TABLE).where({uuid}).first();

  return {
    uuid: wallet.uuid,
    amount: wallet.amount,
    createdAt: wallet.created_at,
    lastUpdatedAt: wallet.last_updated_at,
  };
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

  const wallet = await knex
      .where({user_id: userId})
      .from(WALLETS_TABLE)
      .first();

  if (wallet) {
    return {
      userId: wallet.user_id,
      amount: wallet.amount,
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

  const wallet = await knex
      .where({user_id: userId})
      .update(dataToUpdate)
      .from(WALLETS_TABLE);

  return {
    uuid: wallet.uuid,
    amount: wallet.amount,
  };
}

module.exports = {
  createNewWallet,
  getWalletByUuid,
  updateWalletByUserId,
  getWalletByUserId,
};

