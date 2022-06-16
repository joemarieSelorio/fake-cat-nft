require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();

const {isString} = require('lodash');
const knex = require('knex')(require('knexfile'));

const logger = require('src/utilities/loggerUtil');

const {
  USERS_TABLE,
} = process.env;
const TAG = '[usersRepository]';

/**
 * Creates new User
 * @param {string} id - User's uuid
 * @param {string} email - User's email
 * @param {string} firstName - User's first name
 * @param {string} lastName - User's last name
 * @param {string} password - User's password
 */
async function createNewUser(
    id,
    email,
    firstName,
    lastName,
    password,
) {
  const METHOD = '[createUser]';
  logger.info(`${TAG} ${METHOD}`);

  if (!isString(id)) throw new Error('invalid uuid');
  if (!isString(email)) throw new Error('invalid email');
  if (!isString(firstName)) throw new Error('invalid firstname');
  if (!isString(lastName)) throw new Error('invalid lastname');
  if (!isString(password)) throw new Error('invalid password');

  const newUser = {
    uuid: id,
    email_address: email,
    first_name: firstName,
    last_name: lastName,
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

  if (!isString(uuid)) throw new Error('invalid uuid');

  const user = await knex.where({uuid}).from(USERS_TABLE).first();

  return {
    id: user.uuid,
    firstName: user.first_name,
    lastName: user.last_name,
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
  const METHOD = '[getUserByEmail]';
  logger.info(`${TAG} ${METHOD}`);

  if (!isString(email)) throw new Error('invalid email');

  const user = await knex
      .where({email_address: email})
      .from(USERS_TABLE)
      .first();

  return {
    id: user.uuid,
    firstName: user.first_name,
    lastName: user.last_name,
    createdAt: user.created_at,
    password: user.password,
    lastUpdatedAt: user.last_updated_at,
  };
}

module.exports = {
  createNewUser,
  getUserByEmail,
  getUserByUuid,
};
