require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();

const axios = require('axios');
const FormData = require('form-data');

const logger = require('src/utilities/loggerUtil');
const TAG = '[fakeNFTCatsUtil]';

const {
  CAT_URL,
  CAT_API_KEY,
} = process.env;

/**
 * Create new fake cats NFT
 * @param {buffer} fileData - Fake NFT cat image buffer
 * @param {string} fileName - Fake NFT cat image name
 * @param {string} id - Fake NFT identification
 */
async function createFakeCatNFT(fileData, fileName, id) {
  const METHOD = '[fakeNFTCatsUtil]';
  logger.info(`${TAG} ${METHOD}`);

  const form = new FormData();
  form.append('sub_id', id);
  form.append('file', fileData, fileName);

  const options = {
    method: 'POST',
    headers: {
      'x-api-key': CAT_API_KEY,
      'Content-Type': 'multipart/form-data',
    },
    data: form,
    url: `${CAT_URL}/v1/images/upload`,
  };


  const response = await axios(options);

  if (response.status !== 201) {
    throw new Error('Failed to create fake NFT cats');
  }

  return response.data.url;
}


module.exports = {
  createFakeCatNFT,
};
