require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config({path: 'test.env'});

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const fixture = require('tests/unit/repositories/' +
  'fixtures/galleriesRepositoryConfig');

const {stub} = sinon;
chai.use(chaiAsPromised);

const {GALLERIES_TABLE} = process.env;

describe('galleriesRepository', () => {
  const knexStub = stub();
  const insertStub = stub();
  const intoStub = stub();
  const whereStub = stub();
  const fromStub = stub();
  const firstStub = stub();

  afterEach(() => {
    knexStub.resetBehavior();
    insertStub.reset();
    intoStub.reset();
    whereStub.reset();
    fromStub.reset();
    firstStub.reset();
  });

  describe('#createNewGallery', () => {
    knexStub.returns({insert: insertStub});
    insertStub.returns({into: intoStub});

    const galleriesRepositoryProxy = proxyquire(
        'src/components/galleries/galleriesRepository', {
          'knex': knexStub,
        });

    it('should create new gallery if'+
    ' provided with valid arguments', async () => {
      intoStub.resolves(fixture.createGalleryResponse);

      const result = await galleriesRepositoryProxy.createNewGallery(
          fixture.id,
          fixture.name,
          fixture.userId,
      );

      const newGallery = {
        uuid: fixture.id,
        name: fixture.name,
        user_id: fixture.userId,
      };

      expect(insertStub.calledOnceWithExactly(newGallery)).to.be.true;
      expect(intoStub.calledOnceWithExactly(GALLERIES_TABLE)).to.be.true;
      expect(result).to.deep.equal(fixture.createGalleryResponse);
    });

    it('should throw an error if provided with invalid uuid', async () => {
      await expect(galleriesRepositoryProxy.createNewGallery(
          null,
          fixture.name,
          fixture.userId,
      )).to.eventually.rejectedWith(/invalid uuid/);
    });
    it('should throw an error if provided with invalid name', async () => {
      await expect(galleriesRepositoryProxy.createNewGallery(
          fixture.id,
          null,
          fixture.userId,
      )).to.eventually.rejectedWith(/invalid name/);
    });
    it('should throw an error if provided with invalid name', async () => {
      await expect(galleriesRepositoryProxy.createNewGallery(
          fixture.id,
          fixture.name,
          null,
      )).to.eventually.rejectedWith(/invalid user id/);
    });
  });
  describe('#getGalleryByUuid', () => {
    knexStub.returns({where: whereStub});
    beforeEach(() => {
      whereStub.returns({from: fromStub});
      fromStub.returns({first: firstStub});
    });

    const galleriesRepositoryProxy = proxyquire(
        'src/components/galleries/galleriesRepository', {
          'knex': knexStub,
        });

    it('should create new gallery if'+
    ' provided with valid arguments', async () => {
      firstStub.resolves(fixture.getGalleryResponse);

      const gallery = await galleriesRepositoryProxy.getGalleryByUuid(
          fixture.id,
          fixture.name,
          fixture.userId,
      );


      const response = {
        id: fixture.getGalleryResponse.uuid,
        name: fixture.getGalleryResponse.name,
        createdAt: fixture.getGalleryResponse.created_at,
        lastUpdatedAt: fixture.getGalleryResponse.last_updated_at,
      };

      expect(fromStub.calledOnceWithExactly(GALLERIES_TABLE)).to.be.true;
      expect(gallery).to.deep.equal(response);
    });
    it('should return false if no gallery found', async () => {
      firstStub.resolves(undefined);

      const result = await galleriesRepositoryProxy.getGalleryByUuid(
          fixture.id,
          fixture.name,
          fixture.userId,
      );

      expect(result).to.be.false;
    });
    it('should throw an error if provided with invalid uuid', async () => {
      await expect(galleriesRepositoryProxy.getGalleryByUuid(
          null,
      )).to.eventually.rejectedWith(/invalid uuid/);
    });
  });
  describe('#getGalleryByUserId', () => {
    knexStub.returns({where: whereStub});
    beforeEach(() => {
      whereStub.returns({from: fromStub});
      fromStub.returns({first: firstStub});
    });

    const galleriesRepositoryProxy = proxyquire(
        'src/components/galleries/galleriesRepository', {
          'knex': knexStub,
        });

    it('retrieve gallery details if'+
    ' provided with valid arguments', async () => {
      firstStub.resolves(fixture.getGalleryResponse);

      const gallery = await galleriesRepositoryProxy.getGalleryByUserId(
          fixture.userId,
      );

      const response = {
        id: fixture.getGalleryResponse.uuid,
        name: fixture.getGalleryResponse.name,
        createdAt: fixture.getGalleryResponse.created_at,
        lastUpdatedAt: fixture.getGalleryResponse.last_updated_at,
      };

      expect(whereStub.calledOnceWithExactly({
        user_id: fixture.userId,
      })).to.be.true;
      expect(fromStub.calledOnceWithExactly(GALLERIES_TABLE)).to.be.true;
      expect(gallery).to.deep.equal(response);
    });

    it('should return false if no gallery found', async () => {
      firstStub.resolves(undefined);

      const result = await galleriesRepositoryProxy.getGalleryByUserId(
          fixture.id,
          fixture.name,
          fixture.userId,
      );

      expect(result).to.be.false;
    });

    it('should throw an error if provided with invalid user ID', async () => {
      await expect(galleriesRepositoryProxy.getGalleryByUserId(
          null,
      )).to.eventually.rejectedWith(/invalid user id/);
    });
  });
});

