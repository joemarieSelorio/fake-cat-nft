require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();

const chai = require('chai');
const chaiHttp = require('chai-http');
const bcrypt = require('bcrypt');
const {v4: uuidv4} = require('uuid');
const app = require('app');
const knex = require('knex')(require('knexfile'));
const fixture = require('tests/integration/fixtures/walletsConfig');

const expect = chai.expect;
chai.use(chaiHttp);

const {
  WALLETS_TABLE,
  USERS_TABLE,
} = process.env;

describe('/wallets', () => {
  before(async () => {
    await knex.raw('SET FOREIGN_KEY_CHECKS = 0');
  });

  describe('POST: /wallets', () => {
    const uuid = uuidv4();
    let loginResponse;
    let token;

    after(async () => {
      await knex.raw(`TRUNCATE table ${WALLETS_TABLE}`);
      await knex.raw(`TRUNCATE table ${USERS_TABLE}`);
    });

    before(async ()=> {
      const hashedPassword = await bcrypt.hash(fixture.password, 10);
      await knex.insert({
        uuid,
        email_address: fixture.email,
        first_name: fixture.firstName,
        last_name: fixture.lastName,
        password: hashedPassword,
      }).into(USERS_TABLE);

      loginResponse = await chai
          .request(app)
          .post(`/login`)
          .send({
            email: fixture.email,
            password: fixture.password,
          });
    });
    it('should create new gallery if'+
    ' provided with valid arguments', async () => {
      token = loginResponse.body.token;
      const response = await chai
          .request(app)
          .post('/wallets')
          .set('Authorization', 'Bearer ' + token)
          .send({
            amount: 5000,
          });
      expect(response.body.message).to.be.equal(fixture.successMessage);
    });
  });
});
