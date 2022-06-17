require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();

const chai = require('chai');
const chaiHttp = require('chai-http');
const bcrypt = require('bcrypt');
const {v4: uuidv4} = require('uuid');
const app = require('app');
const knex = require('knex')(require('knexfile'));
const fixture = require('tests/integration/fixtures/usersConfig');

const expect = chai.expect;
chai.use(chaiHttp);

const {
  USERS_TABLE,
  WALLETS_TABLE,
  ASSETS_TABLE,
} = process.env;

describe('/users', () => {
  before(async () => {
    await knex.raw('SET FOREIGN_KEY_CHECKS = 0');
  });
  describe('POST: /users', () => {
    after(async () => {
      await knex.raw(`TRUNCATE table ${USERS_TABLE}`);
    });
    it('should create new user if'+
    ' provided with valid arguments', async () => {
      const response = await chai
          .request(app)
          .post('/users')
          .send({
            email: fixture.email1,
            firstName: fixture.firstName,
            lastName: fixture.lastName,
            password: fixture.password,
          });
      expect(response.body.message).to.be.equal(fixture.successMessage);
    });
  });

  describe('GET: /users/:id/wallets', () => {
    let loginResponse;
    const uuid = uuidv4();
    after(async () => {
      await knex.raw(`TRUNCATE table ${WALLETS_TABLE}`);
      await knex.raw(`TRUNCATE table ${USERS_TABLE}`);
    });
    before(async ()=> {
      const hashedPassword= await bcrypt.hash(fixture.password, 10);
      await knex.insert({
        uuid: fixture.id,
        email_address: fixture.email2,
        first_name: fixture.firstName,
        last_name: fixture.lastName,
        password: hashedPassword,
      }).into(USERS_TABLE);

      await knex.insert({
        uuid: uuid,
        user_id: fixture.id,
        amount: fixture.amount,
      }).into(WALLETS_TABLE);

      loginResponse = await chai
          .request(app)
          .post(`/login`)
          .send({
            email: fixture.email2,
            password: fixture.password,
          });
    });
    it('should retrieve user wallet', async () => {
      const token = loginResponse.body.token;
      const response = await chai
          .request(app)
          .get(`/users/${fixture.id}/wallets`)
          .set('Authorization', 'Bearer ' + token);
      expect(response.body.status).to.be.equal(200);
    });
  });

  describe('GET: /users/:id/assets', () => {
    const uuid = uuidv4();
    let loginResponse;
    after(async () => {
      await knex.raw(`TRUNCATE table ${ASSETS_TABLE}`);
      await knex.raw(`TRUNCATE table ${USERS_TABLE}`);
    });
    before(async ()=> {
      const hashedPassword= await bcrypt.hash(fixture.password, 10);
      await knex.insert({
        uuid: uuid,
        email_address: fixture.email3,
        first_name: fixture.firstName,
        last_name: fixture.lastName,
        password: hashedPassword,
      }).into(USERS_TABLE);

      await knex.insert({
        uuid,
        name: fixture.assetName,
        img_url: fixture.imgUrl,
        user_id: fixture.id,
        initial_amount: fixture.amount,
        current_amount: fixture.amount,
      }).into(ASSETS_TABLE);

      loginResponse = await chai
          .request(app)
          .post(`/login`)
          .send({
            email: fixture.email3,
            password: fixture.password,
          });
    });
    it('should retrieve user assets', async () => {
      const token = loginResponse.body.token;
      const response = await chai
          .request(app)
          .get(`/users/${uuid}/assets`)
          .set('Authorization', 'Bearer ' + token);
      expect(response.body.status).to.be.equal(200);
    });
  });
});
