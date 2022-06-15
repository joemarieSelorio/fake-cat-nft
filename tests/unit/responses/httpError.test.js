require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config({path: 'test.env'});

const HttpError = require('src/responses/httpError');
const fixtures = require('tests/unit/responses/fixtures/httpErrorConfig.json');
const {expect} = require('chai');

describe('#HttpError', () => {
  describe('#constructor', (done) => {
    it('should return an instance of HttpError ' +
    'with default values', (done) => {
      const errorObj = new HttpError();
      expect(errorObj).to.haveOwnProperty('timestamp');
      expect(errorObj).to.haveOwnProperty('code');
      expect(errorObj).to.haveOwnProperty('message');
      expect(errorObj).to.haveOwnProperty('status');
      expect(errorObj.timestamp).to.be.instanceOf(Date);
      expect(errorObj.code).to.be.equal(fixtures.defaultCode);
      expect(errorObj.status).to.be.equal(fixtures.defaultStatus);
      expect(errorObj.message).to.be.equal(fixtures.defaultMessage);
      done();
    });
    it('should return an instance of HttpError ' +
    'with custom timestamp, default code, status and message', (done) => {
      const customTimestamp = new Date('2019-01-10');
      const errorObj = new HttpError(customTimestamp);
      expect(errorObj).to.haveOwnProperty('timestamp');
      expect(errorObj).to.haveOwnProperty('code');
      expect(errorObj).to.haveOwnProperty('message');
      expect(errorObj).to.haveOwnProperty('status');
      expect(errorObj.timestamp).to.be.equal(customTimestamp);
      expect(errorObj.code).to.be.equal(fixtures.defaultCode);
      expect(errorObj.status).to.be.equal(fixtures.defaultStatus);
      expect(errorObj.message).to.be.equal(fixtures.defaultMessage);
      done();
    });
    it('should return an instance of HttpError ' +
    'with default timestamp, code, custom status and default message',
    (done) => {
      const customStatus = 100;
      const errorObj = new HttpError(undefined, customStatus);
      expect(errorObj).to.haveOwnProperty('timestamp');
      expect(errorObj).to.haveOwnProperty('code');
      expect(errorObj).to.haveOwnProperty('message');
      expect(errorObj).to.haveOwnProperty('status');
      expect(errorObj.timestamp).to.be.instanceOf(Date);
      expect(errorObj.code).to.be.equal(fixtures.defaultCode);
      expect(errorObj.status).to.be.equal(customStatus);
      expect(errorObj.message).to.be.equal(fixtures.defaultMessage);
      done();
    });
    it('should return an instance of HttpError ' +
    'with default timestamp, custom code, default status and message',
    (done) => {
      const customCode = 1111;
      const errorObj = new HttpError(undefined, undefined, customCode);
      expect(errorObj).to.haveOwnProperty('timestamp');
      expect(errorObj).to.haveOwnProperty('code');
      expect(errorObj).to.haveOwnProperty('message');
      expect(errorObj).to.haveOwnProperty('status');
      expect(errorObj.timestamp).to.be.instanceOf(Date);
      expect(errorObj.code).to.be.equal(customCode);
      expect(errorObj.status).to.be.equal(fixtures.defaultStatus);
      expect(errorObj.message).to.be.equal(fixtures.defaultMessage);
      done();
    });
    it('should return an instance of HttpError ' +
    'with default timestamp, custom code, status and custom message',
    (done) => {
      const customMessage = 'This is a custom message';
      const errorObj = new HttpError(undefined, undefined,
          undefined, customMessage);
      expect(errorObj).to.haveOwnProperty('timestamp');
      expect(errorObj).to.haveOwnProperty('code');
      expect(errorObj).to.haveOwnProperty('message');
      expect(errorObj).to.haveOwnProperty('status');
      expect(errorObj.timestamp).to.be.instanceOf(Date);
      expect(errorObj.code).to.be.equal(fixtures.defaultCode);
      expect(errorObj.status).to.be.equal(fixtures.defaultStatus);
      expect(errorObj.message).to.be.equal(customMessage);
      done();
    });
  });
});
