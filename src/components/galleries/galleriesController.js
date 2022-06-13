require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();
const {v4: uuidv4} = require('uuid');

const {
  createNewGallery,
  getGalleryByUuid,
} = require('src/components/galleries/galleriesRepository');
const {
  getUserByEmail,
} = require('src/components/users/usersRepository');
const HttpSuccess = require('src/responses/httpSuccess');
const HttpError = require('src/responses/httpError');
const logger = require('src/utilities/loggerUtil');


const TAG = '[galleriesController]';

/**
 * Controller for request to create user gallery
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next function to execute
 */
async function createGallery(req, res, next) {
  const METHOD = '[createGallery]';

  logger.info(`${TAG} ${METHOD}`);

  const {
    email,
    name,
  } = req.body;

  const uuid = uuidv4();

  try {
    const {id: userId} = await getUserByEmail(email);

    await createNewGallery(
        uuid,
        name,
        userId,
    );

    const gallery = await getGalleryByUuid(uuid);

    res.locals.respObj = new HttpSuccess(
        200,
        'Successfully created gallery',
        {gallery},
    );

    next();
  } catch (err) {
    logger.error(`${TAG} ${METHOD} ${err}`);
    next(new HttpError('Failed to create gallery'));
  }
}


module.exports = {
  createGallery,
};

