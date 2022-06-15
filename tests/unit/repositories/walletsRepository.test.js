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
    knexStub.resetBehavior();
    insertStub.reset();
    intoStub.reset();
    whereStub.reset();
    firstStub.reset();
    fromStub.reset();
    updateStub.reset();
  });

  describe.only('#createNewWallet', () => {
    knexStub.returns({insert: insertStub});
    insertStub.returns({into: intoStub});

    const usersRepositoryProxy = proxyquire(
        'src/components/wallets/walletsRepository', {
          'knex': knexStub,
        });

    it('should create new wallet if'+
    ' provided with valid arguments', async () => {
      intoStub.resolves(fixture.createWalletResponse);

      const result = await usersRepositoryProxy.createNewWallet(
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
      await expect(usersRepositoryProxy.createNewUser(
          null,
          fixture.email,
          fixture.firstName,
          fixture.lastName,
          fixture.password,
      )).to.eventually.rejectedWith(/invalid uuid/);
    });
  });
});

