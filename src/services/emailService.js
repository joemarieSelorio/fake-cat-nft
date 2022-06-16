require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();

const nodemailer = require('nodemailer');
const {isString} = require('lodash');

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
 * @param {string} recipients - List of email recipients
 * @param {string} subject - Email subject
 * @param {string} body - Email body
 * @return {Promise<boolean>}
 */
async function sendNotification(
    recipients,
    subject,
    body,
) {
  const METHOD = '[sendNotification]';
  logger.info(`${TAG} ${METHOD}`);

  if (!isString(recipients)) throw new Error('invalid recipients');
  if (!isString(subject)) throw new Error('invalid subject');
  if (!isString(body)) throw new Error('invalid body');

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

    await transporter.sendMail({
      from: EMAIL_SENDER,
      to: recipients,
      subject,
      html: body,
    });
  } catch (error) {
    logger.error(`${TAG} ${METHOD} ${error}`);
    throw new Error('Failed to send notification');
  }
}

module.exports = {
  sendNotification,
};


