require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config({path: 'test.env'});

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const fixture = require('tests/unit/repositories/' +
  'fixtures/assetsRepositoryConfig');

const {stub} = sinon;
chai.use(chaiAsPromised);

const {ASSETS_TABLE} = process.env;

describe('assetsRepository', () => {
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

  describe('#createNewAsset', () => {
    knexStub.returns({insert: insertStub});
    insertStub.returns({into: intoStub});

    const assetsRepositoryProxy = proxyquire(
        'src/components/assets/assetsRepository', {
          'knex': knexStub,
        });

    it('should create new asset if'+
    ' provided with valid arguments', async () => {
      intoStub.resolves(fixture.createAssetResponse);

      const result = await assetsRepositoryProxy.createNewAsset(
          fixture.uuid,
          fixture.name,
          fixture.imgUrl,
          fixture.userId,
          fixture.amount,
      );

      const newAsset = {
        uuid: fixture.uuid,
        name: fixture.name,
        img_url: fixture.imgUrl,
        user_id: fixture.userId,
        initial_amount: fixture.amount,
        current_amount: fixture.amount,
      };

      expect(insertStub.calledOnceWithExactly(newAsset)).to.be.true;
      expect(intoStub.calledOnceWithExactly(ASSETS_TABLE)).to.be.true;
      expect(result).to.deep.equal(fixture.createAssetResponse);
    });
    it('should throw an if provided with invalid uuid', async () => {
      await expect(assetsRepositoryProxy.createNewAsset(
          fixture.uuid,
          null,
          fixture.imgUrl,
          fixture.userId,
          fixture.amount,
      )).to.eventually.rejectedWith(/invalid name/);
    });
    it('should throw an if provided with invalid image url', async () => {
      await expect(assetsRepositoryProxy.createNewAsset(
          fixture.uuid,
          fixture.name,
          null,
          fixture.userId,
          fixture.amount,
      )).to.eventually.rejectedWith(/invalid image url/);
    });
    it('should throw an if provided with invalid user id', async () => {
      await expect(assetsRepositoryProxy.createNewAsset(
          fixture.uuid,
          fixture.name,
          fixture.imgUrl,
          null,
          fixture.amount,
      )).to.eventually.rejectedWith(/invalid user id/);
    });
    it('should throw an if provided with invalid user id', async () => {
      await expect(assetsRepositoryProxy.createNewAsset(
          fixture.uuid,
          fixture.name,
          fixture.imgUrl,
          fixture.userId,
          null,
      )).to.eventually.rejectedWith(/invalid amount/);
    });
  });

  describe('#getAssetByUuid', () => {
    knexStub.returns({where: whereStub});

    beforeEach(() => {
      whereStub.returns({from: fromStub});
      fromStub.returns({first: firstStub});
    });

    const assetsRepositoryProxy = proxyquire(
        'src/components/assets/assetsRepository', {
          'knex': knexStub,
        });

    it('should return user details if provided with valid uuid', async () => {
      firstStub.resolves(fixture.getAssetResponse);

      const response = {
        id: fixture.getAssetResponse.uuid,
        name: fixture.getAssetResponse.name,
        ownerId: fixture.getAssetResponse.user_id,
        imgUrl: fixture.getAssetResponse.img_url,
        auctioned: fixture.getAssetResponse.auctioned,
      };

      const result = await assetsRepositoryProxy.getAssetByUuid(
          fixture.uuid,
      );

      expect(whereStub.calledOnceWithExactly({uuid: fixture.uuid})).to.be.true;
      expect(fromStub.calledOnceWithExactly(ASSETS_TABLE)).to.be.true;
      expect(result).to.deep.equal(response);
    });

    it('should return false if no asset found', async () => {
      firstStub.resolves(undefined);

      const result = await assetsRepositoryProxy.getAssetByUuid(
          fixture.uuid,
      );

      expect(result).to.be.false;
    });

    it('should throw an error if provided with invalid uuid', async () => {
      await expect(assetsRepositoryProxy.getAssetByUuid(
          null,
      )).to.eventually.rejectedWith(/invalid uuid/);
    });
  });

  describe('#updateAssetStatus', () => {
    knexStub.returns({where: whereStub});

    before(() => {
      whereStub.returns({update: updateStub});
      updateStub.returns({from: fromStub});
    });

    const assetsRepositoryProxy = proxyquire(
        'src/components/assets/assetsRepository', {
          'knex': knexStub,
        });

    it('should update asset details if'+
    ' provided with valid arguments', async () => {
      fromStub.resolves(fixture.updateAssetResponse);

      const result = await assetsRepositoryProxy.updateAssetStatus(
          fixture.uuid,
          {
            name: 'Updated name',
          },
      );

      expect(whereStub.calledOnceWithExactly({
        uuid: fixture.uuid})).to.be.true;
      expect(updateStub.calledOnceWithExactly({
        name: 'Updated name',
      })).to.be.true;
      expect(fromStub.calledOnceWithExactly(ASSETS_TABLE)).to.be.true;
      expect(result).to.deep.equal(fixture.updateAssetResponse);
    });

    it('should throw an error if provided with invalid uuid', async () => {
      await expect(assetsRepositoryProxy.updateAssetStatus(
          null,
          {
            name: 'Updated name',
          },
      )).to.eventually.rejectedWith(/invalid uuid/);
    });
    it('should throw an error if provided with invalid uuid', async () => {
      await expect(assetsRepositoryProxy.updateAssetStatus(
          fixture.uuid,
          {},
      )).to.eventually.rejectedWith(/invalid properties/);
    });
  });

  describe('#getAllUserAssets', () => {
    knexStub.returns({where: whereStub});

    beforeEach(() => {
      whereStub.returns({from: fromStub});
    });

    const assetsRepositoryProxy = proxyquire(
        'src/components/assets/assetsRepository', {
          'knex': knexStub,
        });

    it('should retrieve all user\'s asset'+
    ' if provided with valid arguments', async () => {
      fromStub.resolves(fixture.getUserAssetsResponse);

      const result = await assetsRepositoryProxy.getAllUserAssets(
          fixture.userId,
      );

      const response = fixture.getUserAssetsResponse.map((asset) => {
        return {
          id: asset.uuid,
          name: asset.name,
          imgUrl: asset.img_url,
          auctioned: asset.auctioned,
          initialAmount: asset.initial_amount,
          currentAmount: asset.current_amount,
          createdAt: asset.created_at,
          lastUpdatedAt: asset.last_updated_at,
        };
      });

      expect(whereStub.calledOnceWithExactly({
        user_id: fixture.userId})).to.be.true;
      expect(fromStub.calledOnceWithExactly(ASSETS_TABLE)).to.be.true;
      expect(result).to.deep.equal(response);
    });

    it('should return false if no asset found', async () => {
      fromStub.resolves(undefined);

      const result = await assetsRepositoryProxy.getAllUserAssets(
          fixture.userId,
      );
      expect(result).to.be.false;
    });

    it('should throw an error if provided with invalid uuid', async () => {
      await expect(assetsRepositoryProxy.getAllUserAssets(
          null,
      )).to.eventually.rejectedWith(/invalid user id/);
    });
  });

  describe('#getUserAsset', () => {
    knexStub.returns({where: whereStub});

    beforeEach(() => {
      whereStub.returns({from: fromStub});
      fromStub.returns({first: firstStub});
    });

    const assetsRepositoryProxy = proxyquire(
        'src/components/assets/assetsRepository', {
          'knex': knexStub,
        });

    it('should retrieve all user\'s asset'+
    ' if provided with valid arguments', async () => {
      firstStub.resolves(fixture.getUserAssetResponse);

      const result = await assetsRepositoryProxy.getUserAsset(
          fixture.userId,
          fixture.uuid,
      );

      expect(whereStub.calledOnceWithExactly(
          {
            user_id: fixture.userId,
            uuid: fixture.uuid,
          })).to.be.true;
      expect(fromStub.calledOnceWithExactly(ASSETS_TABLE)).to.be.true;

      const response = {
        id: fixture.getUserAssetResponse.uuid,
        name: fixture.getUserAssetResponse.name,
        imgUrl: fixture.getUserAssetResponse.img_url,
        auctioned: fixture.getUserAssetResponse.auctioned,
        initialAmount: fixture.getUserAssetResponse.initial_amount,
        currentAmount: fixture.getUserAssetResponse.current_amount,
        createdAt: fixture.getUserAssetResponse.created_at,
        lastUpdatedAt: fixture.getUserAssetResponse.last_updated_at,
      };
      expect(result).to.deep.equal(response);
    });

    it('should return false if no asset found', async () => {
      firstStub.resolves(undefined);

      const result = await assetsRepositoryProxy.getUserAsset(
          fixture.userId,
          fixture.uuid,
      );
      expect(result).to.be.false;
    });

    it('should throw an error if provided with invalid uuid', async () => {
      await expect(assetsRepositoryProxy.getUserAsset(
          null,
          fixture.assetId,
      )).to.eventually.rejectedWith(/invalid user id/);
    });
    it('should throw an error if provided with invalid uuid', async () => {
      await expect(assetsRepositoryProxy.getUserAsset(
          fixture.userId,
          null,
      )).to.eventually.rejectedWith(/invalid asset id/);
    });
  });
});

