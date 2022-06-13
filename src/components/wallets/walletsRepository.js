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

module.exports = {
  createNewWallet,
  getWalletByUuid,
};

