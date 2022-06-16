require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();

const chai = require('chai');
const chaiHttp = require('chai-http');
const bcrypt = require('bcrypt');
const app = require('app');
const {
  createNewUser,
  getUserByEmail,
} = require('src/components/users/usersRepository');
const {
  createNewWallet,
  getWalletByUuid,
} = require('src/components/wallets/walletsRepository');
const auth = require('src/middlewares/authorizationMiddleware');
const knex = require('knex')(require('knexfile'));
const fixture = require('tests/integration/fixtures/usersConfig');

const expect = chai.expect;
chai.use(chaiHttp);

const {
  USERS_TABLE,
  WALLETS_TABLE,
} = process.env;

describe('users', () => {
  describe('/post/users', () => {
    before(async () => {
      await knex.raw(`SET foreign_key_checks = 0;`);
      await knex.raw(`TRUNCATE TABLE ${USERS_TABLE};`);
    });
    it('should create new user if'+
    ' provided with valid arguments', (done) => {
      chai
          .request(app)
          .post('/users')
          .send(fixture.userRequestBody)
          .end((err, res) => {
            expect(res.status).to.be.equal(200);
            expect(res.body.message).to.be.equal(fixture.successMessage);
          });
      done();
    });
  });

  describe.only('/users/:id/wallets', () => {
    let loginResponse;
    after(async () => {
      await knex.raw(`SET foreign_key_checks = 0;`);
      await knex.raw(`TRUNCATE TABLE ${USERS_TABLE};`);
      await knex.raw(`TRUNCATE TABLE ${WALLETS_TABLE};`);
    });
    before(async ()=> {
      const hashedPassword= await bcrypt.hash(fixture.password, 10);
      await knex.insert({
        uuid: fixture.id,
        email_address: fixture.email,
        first_name: fixture.firstName,
        last_name: fixture.lastName,
        password: hashedPassword,
      }).into(USERS_TABLE);

      await knex.insert({
        uuid: fixture.id,
        user_id: fixture.id,
        amount: 1000,
      }).into(WALLETS_TABLE);

      loginResponse = await chai
          .request(app)
          .post(`/login`)
          .send({
            email: fixture.email,
            password: fixture.password,
          });
    });
    it('should retrieve user wallet', async () => {
      const token = loginResponse.body.token;
      const response = await chai
          .request(app)
          .get(`/users/${fixture.id}/wallets`)
          .set('Authorization', 'Bearer ' + token)
          .send(fixture.userRequestBody);
      expect(response.body.status).to.be.equal(200);
    });
  });
});
