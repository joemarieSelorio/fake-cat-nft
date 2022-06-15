require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config({path: 'test.env'});

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const fixture = require('tests/unit/repositories/' +
  'fixtures/offersRepositoryConfig');

const {stub} = sinon;
chai.use(chaiAsPromised);

const {OFFERS_TABLE} = process.env;

describe('offersRepository', () => {
  const knexStub = stub();
  const insertStub = stub();
  const fromStub = stub();
  const intoStub = stub();
  const whereStub = stub();
  const firstStub = stub();
  const updateStub = stub();

  afterEach(() => {
    knexStub.resetBehavior();
    insertStub.reset();
    intoStub.reset();
    whereStub.reset();
    firstStub.reset();
    fromStub.reset();
    updateStub.reset();
  });

  describe('#createNewOffer', () => {
    knexStub.returns({insert: insertStub});
    insertStub.returns({into: intoStub});

    const offersRepositoryProxy = proxyquire(
        'src/components/offers/offersRepository', {
          'knex': knexStub,
        });

    it('should create new offer if provided with valid arguments', async () => {
      intoStub.resolves(fixture.createOfferResponse);

      const result = await offersRepositoryProxy.createNewOffer(
          fixture.uuid,
          fixture.assetId,
          fixture.offerOwnerId,
          fixture.offerAmount,
      );

      const newOffer = {
        uuid: fixture.uuid,
        asset_id: fixture.assetId,
        offer_owner: fixture.offerOwnerId,
        amount_offer: fixture.offerAmount,
      };

      expect(insertStub.calledOnceWithExactly(newOffer)).to.be.true;
      expect(intoStub.calledOnceWithExactly(OFFERS_TABLE)).to.be.true;
      expect(result).to.deep.equal(fixture.createOfferResponse);
    });
    it('should throw an if provided with invalid uuid', async () => {
      await expect(offersRepositoryProxy.createNewOffer(
          null,
          fixture.assetId,
          fixture.offerOwnerId,
          fixture.offerAmount,
      )).to.eventually.rejectedWith(/invalid uuid/);
    });
    it('should throw an if provided with invalid asset ID', async () => {
      await expect(offersRepositoryProxy.createNewOffer(
          fixture.uuid,
          null,
          fixture.offerOwnerId,
          fixture.offerAmount,
      )).to.eventually.rejectedWith(/invalid asset id/);
    });
    it('should throw an if provided with invalid offer owner id', async () => {
      await expect(offersRepositoryProxy.createNewOffer(
          fixture.uuid,
          fixture.assetId,
          null,
          fixture.offerAmount,
      )).to.eventually.rejectedWith(/invalid offer owner id/);
    });
    it('should throw an if provided with invalid offer amount', async () => {
      await expect(offersRepositoryProxy.createNewOffer(
          fixture.uuid,
          fixture.assetId,
          fixture.offerOwnerId,
          null,
      )).to.eventually.rejectedWith(/invalid offer amount/);
    });
  });

  describe('#getOfferByUuid', () => {
    knexStub.returns({where: whereStub});

    beforeEach(() => {
      whereStub.returns({from: fromStub});
      fromStub.returns({first: firstStub});
    });

    const offersRepositoryProxy = proxyquire(
        'src/components/offers/offersRepository', {
          'knex': knexStub,
        });

    it('should return offer details if provided with valid uuid', async () => {
      firstStub.resolves(fixture.getOfferResponse);

      const response = {
        id: fixture.getOfferResponse.uuid,
        offerOwner: fixture.getOfferResponse.offer_owner,
        AmountOffer: fixture.getOfferResponse.amount_offer,
        accepted: fixture.getOfferResponse.accepted,
        createdAt: fixture.getOfferResponse.created_at,
        lastUpdatedAt: fixture.getOfferResponse.last_updated_at,
      };

      const result = await offersRepositoryProxy.getOfferByUuid(
          fixture.uuid,
      );

      expect(whereStub.calledOnceWithExactly({uuid: fixture.uuid})).to.be.true;
      expect(fromStub.calledOnceWithExactly(OFFERS_TABLE)).to.be.true;
      expect(result).to.deep.equal(response);
    });

    it('should throw an error if provided with invalid uuid', async () => {
      await expect(offersRepositoryProxy.getOfferByUuid(
          null,
      )).to.eventually.rejectedWith(/invalid uuid/);
    });
  });

  describe('#getAllAssetOffers', () => {
    knexStub.returns({where: whereStub});

    beforeEach(() => {
      whereStub.returns({from: fromStub});
    });

    const offersRepositoryProxy = proxyquire(
        'src/components/offers/offersRepository', {
          'knex': knexStub,
        });

    it('should return all asset\'s offers'+
    ' if provided with valid uuid', async () => {
      fromStub.resolves(fixture.getOffersResponse);

      const response = fixture.getOffersResponse.map((offer) => {
        return {
          id: offer.uuid,
          offerOwner: offer.offer_owner,
          amountOffer: offer.amount_offer,
          accepted: offer.accepted,
          createdAt: offer.created_at,
          lastUpdatedAt: offer.last_updated_at,
        };
      });

      const result = await offersRepositoryProxy.getAllAssetOffers(
          fixture.assetId,
      );

      expect(whereStub.calledOnceWithExactly({
        asset_id: fixture.assetId,
      })).to.be.true;
      expect(fromStub.calledOnceWithExactly(OFFERS_TABLE)).to.be.true;
      expect(result).to.deep.equal(response);
    });

    it('should throw an error if provided with invalid uuid', async () => {
      await expect(offersRepositoryProxy.getAllAssetOffers(
          null,
      )).to.eventually.rejectedWith(/invalid asset id/);
    });
  });

  describe('#getAssetOffer', () => {
    knexStub.returns({where: whereStub});

    beforeEach(() => {
      whereStub.returns({from: fromStub});
      fromStub.returns({first: firstStub});
    });

    const offersRepositoryProxy = proxyquire(
        'src/components/offers/offersRepository', {
          'knex': knexStub,
        });

    it('should return asset\'s offer details'+
    ' if provided with valid uuid', async () => {
      firstStub.resolves(fixture.getOfferResponse);

      const response = {
        id: fixture.getOfferResponse.uuid,
        offerOwner: fixture.getOfferResponse.offer_owner,
        amountOffer: fixture.getOfferResponse.amount_offer,
        accepted: fixture.getOfferResponse.accepted,
        createdAt: fixture.getOfferResponse.created_at,
        lastUpdatedAt: fixture.getOfferResponse.last_updated_at,
      };

      const result = await offersRepositoryProxy.getAssetOffer(
          fixture.assetId,
          fixture.uuid,
      );

      expect(whereStub.calledOnceWithExactly({
        uuid: fixture.uuid,
        asset_id: fixture.assetId,
      })).to.be.true;
      expect(fromStub.calledOnceWithExactly(OFFERS_TABLE)).to.be.true;
      expect(result).to.deep.equal(response);
    });

    it('should throw an error if provided with invalid asset id', async () => {
      await expect(offersRepositoryProxy.getAssetOffer(
          null,
          fixture.uuid,
      )).to.eventually.rejectedWith(/invalid asset id/);
    });
    it('should throw an error if provided with invalid uuid', async () => {
      await expect(offersRepositoryProxy.getAssetOffer(
          fixture.uuid,
          null,
      )).to.eventually.rejectedWith(/invalid offer id/);
    });
  });

  describe('#updateOffer', () => {
    knexStub.returns({where: whereStub});

    beforeEach(() => {
      whereStub.returns({update: updateStub});
      updateStub.returns({from: fromStub});
    });

    const offersRepositoryProxy = proxyquire(
        'src/components/offers/offersRepository', {
          'knex': knexStub,
        });

    it('should update offer details if'+
    ' provided with valid arguments', async () => {
      fromStub.resolves(fixture.updateOfferResponse);

      const result = await offersRepositoryProxy.updateOffer(
          fixture.uuid,
          {
            accepted: true,
          },
      );

      expect(whereStub.calledOnceWithExactly({
        uuid: fixture.uuid,
      })).to.be.true;
      expect(updateStub.calledOnceWithExactly({
        accepted: true,
      })).to.be.true;
      expect(fromStub.calledOnceWithExactly(OFFERS_TABLE)).to.be.true;
      expect(result).to.deep.equal(fixture.updateOfferResponse);
    });

    it('should throw an error if provided with invalid uuid', async () => {
      await expect(offersRepositoryProxy.updateOffer(
          null,
      )).to.eventually.rejectedWith(/invalid uuid/);
    });
  });
});

