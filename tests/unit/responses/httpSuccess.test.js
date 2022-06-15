require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config({path: 'test.env'});

const HttpSuccess = require('src/responses/httpSuccess');
const fixtures =
  require('tests/unit/responses/fixtures/httpSuccessConfig');
const {expect} = require('chai');

describe('#HttpSuccess', () => {
  describe('#constructor', (done) => {
    it('should return an instance of HttpSuccess ' +
    'with default status, message and no additionalData', (done) => {
      const successObj = new HttpSuccess();
      expect(successObj).to.haveOwnProperty('timestamp');
      expect(successObj).to.haveOwnProperty('status');
      expect(successObj).to.haveOwnProperty('message');
      expect(successObj).to.not.haveOwnProperty('key');
      expect(successObj.timestamp).to.be.instanceOf(Date);
      expect(successObj.status).to.be.equal(fixtures.defaultStatus);
      expect(successObj.message).to.be.equal(fixtures.defaultMessage);
      done();
    });
    it('should return an instance of HttpSuccess ' +
    'with default status, message and with additionalData', (done) => {
      const successObj = new HttpSuccess(undefined,
          undefined, fixtures.validAdditionalData);
      expect(successObj).to.haveOwnProperty('timestamp');
      expect(successObj).to.haveOwnProperty('status');
      expect(successObj).to.haveOwnProperty('message');
      expect(successObj).to.haveOwnProperty('key');
      expect(successObj.timestamp).to.be.instanceOf(Date);
      expect(successObj.status).to.be.equal(fixtures.defaultStatus);
      expect(successObj.message).to.be.equal(fixtures.defaultMessage);
      expect(successObj.key).to.be.equal(fixtures.validAdditionalData.key);
      done();
    });
    it('should return an instance of HttpSuccess ' +
    'with custom status, default message', (done) => {
      const customStatus = 100;
      const successObj = new HttpSuccess(customStatus);
      expect(successObj).to.haveOwnProperty('timestamp');
      expect(successObj).to.haveOwnProperty('status');
      expect(successObj).to.haveOwnProperty('message');
      expect(successObj.timestamp).to.be.instanceOf(Date);
      expect(successObj.status).to.be.equal(customStatus);
      expect(successObj.message).to.be.equal(fixtures.defaultMessage);
      done();
    });
    it('should return an instance of HttpSuccess ' +
    'with default status, custom message', (done) => {
      const customMessage = 'This is a custom message';
      const successObj = new HttpSuccess(undefined, customMessage);
      expect(successObj).to.haveOwnProperty('timestamp');
      expect(successObj).to.haveOwnProperty('status');
      expect(successObj).to.haveOwnProperty('message');
      expect(successObj.timestamp).to.be.instanceOf(Date);
      expect(successObj.status).to.be.equal(fixtures.defaultStatus);
      expect(successObj.message).to.be.equal(customMessage);
      done();
    });
  });
});
