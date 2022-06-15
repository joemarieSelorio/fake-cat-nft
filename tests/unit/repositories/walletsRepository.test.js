require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config({path: 'test.env'});

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const fixture = require('tests/unit/repositories/' +
  'fixtures/walletsRepositoryConfig');

const {stub} = sinon;
chai.use(chaiAsPromised);

const {WALLETS_TABLE} = process.env;

describe('walletsRepository', () => {
  const knexStub = stub();
  const insertStub = stub();
  const fromStub = stub();
  const intoStub = stub();
  const whereStub = stub();
  const firstStub = stub();
  const updateStub = stub();

  afterEach(() => {
    knexStub.reset();
    insertStub.reset();
    intoStub.reset();
    whereStub.reset();
    firstStub.reset();
    fromStub.reset();
    updateStub.reset();
  });

  describe('#createNewWallet', () => {
    knexStub.returns({insert: insertStub});
    insertStub.returns({into: intoStub});

    const walletRepositoryProxy = proxyquire(
        'src/components/wallets/walletsRepository', {
          'knex': knexStub,
        });

    it('should create new wallet if'+
    ' provided with valid arguments', async () => {
      intoStub.resolves(fixture.createWalletResponse);

      const result = await walletRepositoryProxy.createNewWallet(
          fixture.id,
          fixture.userId,
          fixture.amount,
      );
      const newWallet = {
        uuid: fixture.id,
        user_id: fixture.userId,
        amount: fixture.amount,
      };

      expect(insertStub.calledOnceWithExactly(newWallet)).to.be.true;
      expect(intoStub.calledOnceWithExactly(WALLETS_TABLE)).to.be.true;
      expect(result).to.deep.equal(fixture.createWalletResponse);
    });
    it('should throw an if provided with invalid uuid', async () => {
      await expect(walletRepositoryProxy.createNewWallet(
          null,
          fixture.userId,
          fixture.amount,
      )).to.eventually.rejectedWith(/invalid uuid/);
    });
    it('should throw an if provided with invalid user id', async () => {
      await expect(walletRepositoryProxy.createNewWallet(
          fixture.id,
          null,
          fixture.amount,
      )).to.eventually.rejectedWith(/invalid user id/);
    });
    it('should throw an if provided with invalid user id', async () => {
      await expect(walletRepositoryProxy.createNewWallet(
          fixture.id,
          fixture.userId,
          null,
      )).to.eventually.rejectedWith(/invalid amount/);
    });
  });

  describe('#getWalletByUuid', () => {
    knexStub.returns({where: whereStub});

    beforeEach(() => {
      whereStub.returns({from: fromStub});
      fromStub.returns({first: firstStub});
    });

    const walletRepositoryProxy = proxyquire(
        'src/components/wallets/walletsRepository', {
          'knex': knexStub,
        });

    it('should retrieve wallet details if'+
    ' provided with valid arguments', async () => {
      firstStub.resolves(fixture.getWalletDetailsResponse);

      const result = await walletRepositoryProxy.getWalletByUuid(
          fixture.id,
      );
      const wallet = {
        uuid: fixture.getWalletDetailsResponse.uuid,
        amount: fixture.getWalletDetailsResponse.amount,
        userId: fixture.getWalletDetailsResponse.user_id,
        createdAt: fixture.getWalletDetailsResponse.created_at,
        lastUpdatedAt: fixture.getWalletDetailsResponse.last_updated_at,
      };

      expect(whereStub.calledOnceWithExactly({
        uuid: fixture.id})).to.be.true;
      expect(fromStub.calledOnceWithExactly(WALLETS_TABLE)).to.be.true;
      expect(result).to.deep.equal(wallet);
    });

    it('should return false if wallet is not found', async () => {
      firstStub.resolves(undefined);

      const result = await walletRepositoryProxy.getWalletByUuid(
          fixture.id,
      );

      expect(result).to.be.false;
    });
    it('should throw an if provided with invalid uuid', async () => {
      await expect(walletRepositoryProxy.getWalletByUuid(
          null,
      )).to.eventually.rejectedWith(/invalid uuid/);
    });
  });

  describe('#getWalletByUserId', () => {
    knexStub.returns({where: whereStub});

    beforeEach(() => {
      whereStub.returns({from: fromStub});
      fromStub.returns({first: firstStub});
    });

    const walletRepositoryProxy = proxyquire(
        'src/components/wallets/walletsRepository', {
          'knex': knexStub,
        });

    it('should retrieve wallet details if'+
    ' provided with valid arguments', async () => {
      firstStub.resolves(fixture.getWalletDetailsResponse);

      const result = await walletRepositoryProxy.getWalletByUserId(
          fixture.userId,
      );
      const wallet = {
        uuid: fixture.getWalletDetailsResponse.uuid,
        amount: fixture.getWalletDetailsResponse.amount,
        userId: fixture.getWalletDetailsResponse.user_id,
        createdAt: fixture.getWalletDetailsResponse.created_at,
        lastUpdatedAt: fixture.getWalletDetailsResponse.last_updated_at,
      };

      expect(whereStub.calledOnceWithExactly({
        user_id: fixture.userId})).to.be.true;
      expect(fromStub.calledOnceWithExactly(WALLETS_TABLE)).to.be.true;
      expect(result).to.deep.equal(wallet);
    });
    it('should return false if wallet is not found', async () => {
      firstStub.resolves(undefined);

      const result = await walletRepositoryProxy.getWalletByUserId(
          fixture.userId,
      );

      expect(result).to.be.false;
    });
    it('should throw an if provided with invalid uuid', async () => {
      await expect(walletRepositoryProxy.getWalletByUserId(
          null,
      )).to.eventually.rejectedWith(/invalid uuid/);
    });
  });

  describe('#updateWalletByUserId', () => {
    knexStub.returns({where: whereStub});

    beforeEach(() => {
      whereStub.returns({update: updateStub});
      updateStub.returns({from: fromStub});
    });

    const walletRepositoryProxy = proxyquire(
        'src/components/wallets/walletsRepository', {
          'knex': knexStub,
        });

    it('should update wallet details if'+
    ' provided with valid arguments', async () => {
      fromStub.resolves(fixture.updateWalletResponse);

      const result = await walletRepositoryProxy.updateWalletByUserId(
          fixture.userId,
          {
            amount: 3000,
          },
      );

      expect(whereStub.calledOnceWithExactly({
        user_id: fixture.userId})).to.be.true;
      expect(updateStub.calledOnceWithExactly( {
        amount: 3000,
      })).to.be.true;
      expect(fromStub.calledOnceWithExactly(WALLETS_TABLE)).to.be.true;
      expect(result).to.deep.equal(fixture.updateWalletResponse);
    });
    it('should return false if no wallet found', async () => {
      fromStub.resolves(undefined);

      const result = await walletRepositoryProxy.updateWalletByUserId(
          fixture.userId,
          {
            amount: 3000,
          },
      );

      expect(result).to.be.false;
    });
    it('should throw an if provided with invalid uuid', async () => {
      await expect(walletRepositoryProxy.updateWalletByUserId(
          null,
          {
            amount: 3000,
          },
      )).to.eventually.rejectedWith(/invalid uuid/);
    });
    it('should throw an if provided with invalid uuid', async () => {
      await expect(walletRepositoryProxy.updateWalletByUserId(
          fixture.userId,
          {

          },
      )).to.eventually.rejectedWith(/invalid properties/);
    });
  });
});

