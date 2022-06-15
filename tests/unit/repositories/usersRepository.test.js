require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config({path: 'test.env'});

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const fixture = require('tests/unit/repositories/' +
  'fixtures/usersRepositoryConfig');

const {stub} = sinon;
chai.use(chaiAsPromised);

const {USERS_TABLE} = process.env;

describe('usersRepository', () => {
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

  describe('#createNewUser', () => {
    knexStub.returns({insert: insertStub});
    insertStub.returns({into: intoStub});

    const usersRepositoryProxy = proxyquire(
        'src/components/users/usersRepository', {
          'knex': knexStub,
        });

    it('should create new user if'+
    ' provided with valid arguments', async () => {
      intoStub.resolves(fixture.createUserResponse);

      const result = await usersRepositoryProxy.createNewUser(
          fixture.id,
          fixture.email,
          fixture.firstName,
          fixture.lastName,
          fixture.password,
      );

      const newUser = {
        uuid: fixture.id,
        email_address: fixture.email,
        first_name: fixture.firstName,
        last_name: fixture.lastName,
        password: fixture.password,
      };

      expect(insertStub.calledOnceWithExactly(newUser)).to.be.true;
      expect(intoStub.calledOnceWithExactly(USERS_TABLE)).to.be.true;
      expect(result).to.deep.equal(fixture.createUserResponse);
    });
    it('should throw an if provided with invalid uuid', async () => {
      await expect(usersRepositoryProxy.createNewUser(
          null,
          fixture.email,
          fixture.firstName,
          fixture.lastName,
          fixture.password,
      )).to.eventually.rejectedWith(/invalid uuid/);
    });
    it('should throw an if provided with invalid email', async () => {
      await expect(usersRepositoryProxy.createNewUser(
          fixture.id,
          null,
          fixture.firstName,
          fixture.lastName,
          fixture.password,
      )).to.eventually.rejectedWith(/invalid email/);
    });
    it('should throw an if provided with invalid firstname', async () => {
      await expect(usersRepositoryProxy.createNewUser(
          fixture.id,
          fixture.email,
          null,
          fixture.lastName,
          fixture.password,
      )).to.eventually.rejectedWith(/invalid firstname/);
    });
    it('should throw an if provided with invalid lastname', async () => {
      await expect(usersRepositoryProxy.createNewUser(
          fixture.id,
          fixture.email,
          fixture.firstName,
          null,
          fixture.password,
      )).to.eventually.rejectedWith(/invalid lastname/);
    });
    it('should throw an if provided with invalid password', async () => {
      await expect(usersRepositoryProxy.createNewUser(
          fixture.id,
          fixture.email,
          fixture.firstName,
          fixture.lastName,
          null,
      )).to.eventually.rejectedWith(/invalid password/);
    });
  });

  describe('#getUserByUuid', () => {
    knexStub.returns({where: whereStub});

    before(() => {
      whereStub.returns({from: fromStub});
      fromStub.returns({first: firstStub});
    });

    const usersRepositoryProxy = proxyquire(
        'src/components/users/usersRepository', {
          'knex': knexStub,
        });

    it('should return user details if provided with valid uuid', async () => {
      firstStub.resolves(fixture.getUserResponse);

      const response = {
        id: fixture.getUserResponse.uuid,
        firstName: fixture.getUserResponse.first_name,
        lastName: fixture.getUserResponse.last_name,
        email: fixture.getUserResponse.email_address,
        createdAt: fixture.getUserResponse.created_at,
        lastUpdatedAt: fixture.getUserResponse.last_updated_at,
      };

      const result = await usersRepositoryProxy.getUserByUuid(
          fixture.id,
      );

      expect(whereStub.calledOnceWithExactly({uuid: fixture.id})).to.be.true;
      expect(fromStub.calledOnceWithExactly(USERS_TABLE)).to.be.true;
      expect(result).to.deep.equal(response);
    });

    it('should throw an error if provided with invalid uuid', async () => {
      await expect(usersRepositoryProxy.getUserByUuid(
          null,
      )).to.eventually.rejectedWith(/invalid uuid/);
    });
  });

  describe('#getUserByEmail', () => {
    knexStub.returns({where: whereStub});

    before(() => {
      whereStub.returns({from: fromStub});
      fromStub.returns({first: firstStub});
    });

    const usersRepositoryProxy = proxyquire(
        'src/components/users/usersRepository', {
          'knex': knexStub,
        });

    it('should return user details if'+
    ' provided with valid email address', async () => {
      firstStub.resolves(fixture.getUserResponse);

      const response = {
        id: fixture.getUserResponse.uuid,
        firstName: fixture.getUserResponse.first_name,
        lastName: fixture.getUserResponse.last_name,
        createdAt: fixture.getUserResponse.created_at,
        password: fixture.getUserResponse.password,
        lastUpdatedAt: fixture.getUserResponse.last_updated_at,
      };

      const result = await usersRepositoryProxy.getUserByEmail(
          fixture.email,
      );

      expect(whereStub.calledOnceWithExactly({
        email_address: fixture.email})).to.be.true;
      expect(fromStub.calledOnceWithExactly(USERS_TABLE)).to.be.true;
      expect(result).to.deep.equal(response);
    });

    it('should throw an error if provided with invalid email', async () => {
      await expect(usersRepositoryProxy.getUserByEmail(
          null,
      )).to.eventually.rejectedWith(/invalid email/);
    });
  });
});

