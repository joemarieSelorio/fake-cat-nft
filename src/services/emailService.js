require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();

const nodemailer = require('nodemailer');
const logger = require('src/utilities/loggerUtil');
const {
  EMAIL_SENDER,
  EMAIL_PASSWORD,
  EMAIL_CLIENT_ID,
  EMAIL_CLIENT_SECRET,
  REFRESH_TOKEN,
} = process.env;


const TAG = '[emailService]';

/**
 * Send email to recipients
 * @param {object} config - Email config
 * @param {string} config.accessKeyId - Email access key id
 * @param {string} config.secretAccessKey - Email secret access key
 * @param {string[]} recipients - List of email recipients
 * @param {object} content - Email content
 * @param {string} content.subject - Email subject
 * @param {string} content.body - Email body
 * @param {string[]} attachments - List of attachments
 * @return {Promise<boolean>}
 */
async function sendEmail(
    config,
    recipients,
    content,
) {
  const METHOD = '[sendEmail]';

  logger.info(`${TAG} ${METHOD}`);

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: EMAIL_SENDER,
        pass: EMAIL_PASSWORD,
        clientId: EMAIL_CLIENT_ID,
        clientSecret: EMAIL_CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
      },
    });

    const {
      subject,
      body,
    } = content;


    const result = await transporter.sendMail({
      from: EMAIL_SENDER,
      to: recipients,
      subject,
      html: body,
    });
    console.log(result);
    return true;
  } catch ({message}) {
    logger.error(`${TAG} ${METHOD} - ${message}`);
  }

  return false;
}

module.exports = {
  sendEmail,
};


