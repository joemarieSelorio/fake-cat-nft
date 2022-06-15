require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();
const {v4: uuidv4} = require('uuid');

const {
  createNewVote,
  getVoteByUuid,
} = require('src/components/votes/votesRepository');

const {
  getUserByEmail,
} = require('src/components/users/usersRepository');
const HttpSuccess = require('src/responses/httpSuccess');
const HttpError = require('src/responses/httpError');
const logger = require('src/utilities/loggerUtil');


const TAG = '[offersController]';

/**
 * Controller for request to create user gallery
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next function to execute
 */
async function createVote(req, res, next) {
  const METHOD = '[createAsset]';

  logger.info(`${TAG} ${METHOD}`);
  /**
   *  should check first if asset and user exist
   */

  /**
   *  should check first the wallet of user
   *  since it will deduct some amout to vote
   */
  const {
    voterEmail,
    comments,
    assetId,
  } = req.body;

  const uuid = uuidv4();

  try {
    const {id: userId} = await getUserByEmail(voterEmail);

    await createNewVote(
        uuid,
        comments,
        userId,
        assetId,
    );

    const vote = await getVoteByUuid(uuid);

    res.locals.respObj = new HttpSuccess(
        200,
        'Successfully created vote for fake cat nft',
        {vote},
    );

    next();
  } catch (err) {
    logger.error(`${TAG} ${METHOD} ${err}`);
    next(new HttpError('Failed to create vote for fake nft cat'));
  }
}


module.exports = {
  createVote,
};

