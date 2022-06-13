require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();

const knex = require('knex')(require('knexfile'));


const logger = require('src/utilities/loggerUtil');

const {USERS_TABLE} = process.env;
const TAG = '[usersRepository]';

/**
 * Creates new User
 * @param {string} id - User's uuid
 * @param {string} firstName - User's first name
 * @param {string} lastName - User's last name
 * @param {string} username - User's username
 * @param {string} email - User's email
 * @param {string} password - User's password
 */
async function createNewUser(
    id,
    firstName,
    lastName,
    username,
    email,
    password,
) {
  const METHOD = '[createUser]';
  logger.info(`${TAG} ${METHOD}`);

  // use bcrypt salt for password

  const newUser = {
    uuid: id,
    first_name: firstName,
    last_name: lastName,
    email_address: email,
    username,
    password,
  };

  return await knex.insert(newUser).into(USERS_TABLE);
}

/**
 * Get user details
 * @param {string} uuid - User's unique identification
 */
async function getUserByUuid(
    uuid,
) {
  const METHOD = '[getUserByUuid]';
  logger.info(`${TAG} ${METHOD}`);

  const user = await knex.where({uuid}).from(USERS_TABLE).first();

  return {
    id: user.uuid,
    firstName: user.first_name,
    lastName: user.last_name,
    username: user.username,
    email: user.email_address,
    createdAt: user.created_at,
    lastUpdatedAt: user.last_updated_at,
  };
}

/**
 * Get user details
 * @param {string} email - User's unique identification
 */
async function getUserByEmail(
    email,
) {
  const METHOD = '[getUserByUuid]';
  logger.info(`${TAG} ${METHOD}`);

  const user = await knex
      .where({email_address: email})
      .from(USERS_TABLE)
      .first();

  return {
    id: user.uuid,
    firstName: user.first_name,
    lastName: user.last_name,
    username: user.username,
    email: user.email_address,
    createdAt: user.created_at,
    lastUpdatedAt: user.last_updated_at,
  };
}

module.exports = {
  createNewUser,
  getUserByEmail,
  getUserByUuid,
};
