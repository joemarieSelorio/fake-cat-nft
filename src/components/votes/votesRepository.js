require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();

const knex = require('knex')(require('knexfile'));


const logger = require('src/utilities/loggerUtil');

const {VOTES_TABLE} = process.env;
const TAG = '[votesRepository]';

/**
 * Creates new vote
 * @param {string} id - vote's uuid
 * @param {string} comments - voter's  comment
 * @param {string} userId - user's  uuid
 * @param {number} assetId - asset's  id
 */
async function createNewVote(
    id,
    comments,
    userId,
    assetId,
) {
  const METHOD = '[createNewVote]';
  logger.info(`${TAG} ${METHOD}`);

  // should add field if upvote or downvote

  const newVote = {
    uuid: id,
    comments,
    user_id: userId,
    asset_id: assetId,
  };

  return await knex.insert(newVote).into(VOTES_TABLE);
}

/**
 * Get vote details
 * @param {string} uuid - User's unique identification
 */
async function getVoteByUuid(
    uuid,
) {
  const METHOD = '[getAssetByUuid]';
  logger.info(`${TAG} ${METHOD}`);

  const vote = await knex(VOTES_TABLE).where({uuid}).first();

  return {
    id: vote.uuid,
    comments: vote.comments,
    assetId: vote.asset_id,
    userId: vote.user_id,
  };
}


module.exports = {
  createNewVote,
  getVoteByUuid,
};
