require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config({path: 'test.env'});

const UnauthorizedError = require('src/responses/unauthorizedError');
const fixtures =
  require('tests/unit/responses/fixtures/unauthorizedErrorConfig');
const {expect} = require('chai');

describe('#UnauthorizedError', () => {
  describe('#constructor', (done) => {
    it('should return an instance of UnauthorizedError ' +
    'with default status, code and message', (done) => {
      const errorObj = new UnauthorizedError();
      expect(errorObj).to.haveOwnProperty('timestamp');
      expect(errorObj).to.haveOwnProperty('status');
      expect(errorObj).to.haveOwnProperty('code');
      expect(errorObj).to.haveOwnProperty('message');
      expect(errorObj.timestamp).to.be.instanceOf(Date);
      expect(errorObj.status).to.be.equal(fixtures.defaultStatus);
      expect(errorObj.code).to.be.equal(fixtures.defaultCode);
      expect(errorObj.message).to.be.equal(fixtures.defaultMessage);
      done();
    });
    it('should return an instance of UnauthorizedError ' +
    'with default status, code and custom message', (done) => {
      const customMessage = 'This is a custom message';
      const errorObj = new UnauthorizedError(customMessage);
      expect(errorObj).to.haveOwnProperty('timestamp');
      expect(errorObj).to.haveOwnProperty('status');
      expect(errorObj).to.haveOwnProperty('code');
      expect(errorObj).to.haveOwnProperty('message');
      expect(errorObj.timestamp).to.be.instanceOf(Date);
      expect(errorObj.status).to.be.equal(fixtures.defaultStatus);
      expect(errorObj.code).to.be.equal(fixtures.defaultCode);
      expect(errorObj.message).to.be.equal(customMessage);
      done();
    });
  });
});
