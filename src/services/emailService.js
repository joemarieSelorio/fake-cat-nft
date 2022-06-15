require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();

const nodemailer = require('nodemailser');
const aws = require('aws-sdk');
const logger = require('src/utilities/loggerUtil');
const {REGION, UBX_SITE_EMAIL} = process.env;


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
    const {
      accessKeyId,
      secretAccessKey,
    } = config;

    const {
      subject,
      body,
    } = content;

    if (accessKeyId.trim() === '' || secretAccessKey.trim() === '') {
      throw new Error('Email config is invalid');
    }

    if (recipients.length === 0) {
      throw new Error('Email recipient not found');
    }

    if (subject.trim() === '' || body.trim() === '') {
      throw new Error('Email content is invalid');
    }

    const ses = new aws.SES({
      region: REGION,
      apiVersion: '2010-12-01',
      accessKeyId,
      secretAccessKey,
    });

    const transporter = nodemailer.createTransport({
      SES: {ses, aws},
    });

    await transporter.sendMail({
      from: UBX_SITE_EMAIL,
      to: recipients,
      subject: content.subject,
      html: content.body,
    });

    return true;
  } catch ({message}) {
    logger.error(`${TAG} ${METHOD} - ${message}`);
  }

  return false;
}

module.exports = {
  sendEmail,
};


