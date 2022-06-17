require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();

const chai = require('chai');
const chaiHttp = require('chai-http');
const bcrypt = require('bcrypt');
const {v4: uuidv4} = require('uuid');
const app = require('app');
const knex = require('knex')(require('knexfile'));
const fixture = require('tests/integration/fixtures/assetConfig');

const expect = chai.expect;
chai.use(chaiHttp);

const {
  USERS_TABLE,
  WALLETS_TABLE,
  GALLERIES_TABLE,
  ASSETS_TABLE,
  OFFERS_TABLE,
} = process.env;

describe('/assets', () => {
  let loginResponse;
  const uuid = uuidv4();

  before(async () => {
    await knex.raw('SET FOREIGN_KEY_CHECKS = 0');
  });

  describe('PATCH: /assets/:assetId/auction', () => {
    after(async () => {
      await knex.raw(`TRUNCATE table ${ASSETS_TABLE}`);
      await knex.raw(`TRUNCATE table ${GALLERIES_TABLE}`);
      await knex.raw(`TRUNCATE table ${USERS_TABLE}`);
    });

    before(async ()=> {
      const hashedPassword= await bcrypt.hash(fixture.password, 10);
      await knex.insert({
        uuid,
        email_address: fixture.email,
        first_name: fixture.firstName,
        last_name: fixture.lastName,
        password: hashedPassword,
      }).into(USERS_TABLE);

      await knex.insert({
        uuid: fixture.galleryId,
        name: fixture.galleryName,
        user_id: uuid,
      }).into(GALLERIES_TABLE);

      await knex.insert({
        uuid: fixture.assetId,
        name: fixture.assetName,
        img_url: fixture.imgUrl,
        user_id: uuid,
        initial_amount: fixture.initialAmount,
        current_amount: fixture.initialAmount,
      }).into(ASSETS_TABLE);

      loginResponse = await chai
          .request(app)
          .post(`/login`)
          .send({
            email: fixture.email,
            password: fixture.password,
          });
    });

    it('should create new user if'+
    ' provided with valid arguments', async () => {
      const token = loginResponse.body.token;
      const response = await chai
          .request(app)
          .patch(`/assets/${fixture.assetId}/auction`)
          .set('Authorization', 'Bearer ' + token)
          .send({status: true});
      expect(response.body.status).to.be.equal(200);
      expect(response.body.message).to.be.equal(fixture.successMessage);
    });
  });

  describe('POST: /assets/:assetId/offers', () => {
    after(async () => {
      await knex.raw(`TRUNCATE table ${ASSETS_TABLE}`);
      await knex.raw(`TRUNCATE table ${WALLETS_TABLE}`);
      await knex.raw(`TRUNCATE table ${OFFERS_TABLE}`);
      await knex.raw(`TRUNCATE table ${USERS_TABLE}`);
    });

    before(async ()=> {
      const hashedPassword= await bcrypt.hash(fixture.password, 10);
      await knex.insert({
        uuid,
        email_address: fixture.email,
        first_name: fixture.firstName,
        last_name: fixture.lastName,
        password: hashedPassword,
      }).into(USERS_TABLE);

      await knex.insert({
        uuid: fixture.walletId,
        user_id: uuid,
        amount: fixture.offeredAmount,
      }).into(WALLETS_TABLE);

      await knex.insert({
        uuid: fixture.assetId,
        name: fixture.assetName,
        img_url: fixture.imgUrl,
        user_id: uuid,
        initial_amount: fixture.initialAmount,
        current_amount: fixture.initialAmount,
      }).into(ASSETS_TABLE);

      loginResponse = await chai
          .request(app)
          .post(`/login`)
          .send({
            email: fixture.email,
            password: fixture.password,
          });
    });

    it('should create new user if'+
    ' provided with valid arguments', async () => {
      const token = loginResponse.body.token;
      const response = await chai
          .request(app)
          .post(`/assets/${fixture.assetId}/offers`)
          .set('Authorization', 'Bearer ' + token)
          .send({offeredAmount: fixture.offeredAmount});
      expect(response.body.status).to.be.equal(200);
      expect(response.body.message).to.be.equal(fixture.successOfferMessage);
    });
  });

  describe('GET: /assets/:assetId/offers', () => {
    after(async () => {
      await knex.raw(`TRUNCATE table ${ASSETS_TABLE}`);
      await knex.raw(`TRUNCATE table ${WALLETS_TABLE}`);
      await knex.raw(`TRUNCATE table ${OFFERS_TABLE}`);
      await knex.raw(`TRUNCATE table ${USERS_TABLE}`);
    });

    before(async ()=> {
      const hashedPassword= await bcrypt.hash(fixture.password, 10);
      await knex.insert({
        uuid,
        email_address: fixture.email,
        first_name: fixture.firstName,
        last_name: fixture.lastName,
        password: hashedPassword,
      }).into(USERS_TABLE);

      await knex.insert({
        uuid: fixture.walletId,
        user_id: uuid,
        amount: fixture.offeredAmount,
      }).into(WALLETS_TABLE);

      await knex.insert({
        uuid: fixture.assetId,
        name: fixture.assetName,
        img_url: fixture.imgUrl,
        user_id: uuid,
        initial_amount: fixture.initialAmount,
        current_amount: fixture.initialAmount,
      }).into(ASSETS_TABLE);

      await knex.insert({
        uuid: fixture.offerId,
        asset_id: fixture.assetId,
        offer_owner: uuid,
        amount_offer: fixture.offeredAmount,
      }).into(OFFERS_TABLE);

      loginResponse = await chai
          .request(app)
          .post(`/login`)
          .send({
            email: fixture.email,
            password: fixture.password,
          });
    });

    it('should create new user if'+
    ' provided with valid arguments', async () => {
      const token = loginResponse.body.token;
      const response = await chai
          .request(app)
          .get(`/assets/${fixture.assetId}/offers`)
          .set('Authorization', 'Bearer ' + token);
      expect(response.body.status).to.be.equal(200);
      expect(response.body.message)
          .to.be.equal(fixture.successGetOffersMessage);
    });
  });

  describe('PATCH: /assets/:assetId/offers/:offerId', () => {
    after(async () => {
      await knex.raw(`TRUNCATE table ${ASSETS_TABLE}`);
      await knex.raw(`TRUNCATE table ${WALLETS_TABLE}`);
      await knex.raw(`TRUNCATE table ${OFFERS_TABLE}`);
      await knex.raw(`TRUNCATE table ${USERS_TABLE}`);
    });

    before(async ()=> {
      const hashedPassword= await bcrypt.hash(fixture.password, 10);
      await knex.insert({
        uuid,
        email_address: fixture.email,
        first_name: fixture.firstName,
        last_name: fixture.lastName,
        password: hashedPassword,
      }).into(USERS_TABLE);

      await knex.insert({
        uuid: fixture.walletId,
        user_id: uuid,
        amount: fixture.offeredAmount,
      }).into(WALLETS_TABLE);

      await knex.insert({
        uuid: fixture.assetId,
        name: fixture.assetName,
        img_url: fixture.imgUrl,
        user_id: uuid,
        initial_amount: fixture.initialAmount,
        current_amount: fixture.initialAmount,
      }).into(ASSETS_TABLE);

      await knex.insert({
        uuid: fixture.offerId,
        asset_id: fixture.assetId,
        offer_owner: uuid,
        amount_offer: fixture.offeredAmount,
      }).into(OFFERS_TABLE);

      loginResponse = await chai
          .request(app)
          .post(`/login`)
          .send({
            email: fixture.email,
            password: fixture.password,
          });
    });

    it('should create new user if'+
    ' provided with valid arguments', async () => {
      const token = loginResponse.body.token;
      const response = await chai
          .request(app)
          .patch(`/assets/${fixture.assetId}/offers/${fixture.offerId}`)
          .set('Authorization', 'Bearer ' + token);
      expect(response.body.status).to.be.equal(200);
      expect(response.body.message)
          .to.be.equal(fixture.successAcceptedOffer);
    });
  });
});
