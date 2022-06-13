require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config({path: 'test.env'});

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const fixture = require('test/unit/repositories/' +
  'fixtures/usersRepositoryConfig');

const {stub} = sinon;

const {USERS_TABLE} = process.env;

describe('usersRepository', () => {
  const knexStub = stub();
  const insertStub = stub();
  const fromStub = stub();
  const intoStub = stub();
  const whereStub = stub();
  const firstStub = stub();

  afterEach(() => {
    knexStub.resetBehavior();
    insertStub.reset();
    intoStub.reset();
    whereStub.reset();
    firstStub.reset();
    fromStub.reset();
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
          fixture.firstName,
          fixture.lastName,
          fixture.username,
          fixture.email,
          fixture.password,
      );

      const newUser = {
        uuid: fixture.id,
        first_name: fixture.firstName,
        last_name: fixture.lastName,
        email_address: fixture.email,
        username: fixture.username,
        password: fixture.password,
      };

      expect(insertStub.calledOnceWithExactly(newUser)).to.be.true;
      expect(intoStub.calledOnceWithExactly(USERS_TABLE)).to.be.true;
      expect(result).to.deep.equal(fixture.createUserResponse);
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
        username: fixture.getUserResponse.username,
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
        username: fixture.getUserResponse.username,
        email: fixture.getUserResponse.email_address,
        createdAt: fixture.getUserResponse.created_at,
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
  });
});

