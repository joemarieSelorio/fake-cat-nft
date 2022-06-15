require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config({path: 'test.env'});

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const fixture = require('tests/unit/utilities/' +
  'fixtures/fakeNFTCatsConfig');

const {stub} = sinon;
chai.use(chaiAsPromised);

describe('fakeNFTCatsUtil', () => {
  const appendStub = stub();
  const axiosStub = stub();
  const formData = function() {
    this.append = appendStub;
  };


  afterEach(() => {
    axiosStub.reset();
    appendStub.reset();
  });

  describe('#createFakeCatNFT', () => {
    const fakeNFTCatsUtilProxy = proxyquire(
        'src/utilities/fakeNFTCatsUtil', {
          'axios': axiosStub,
          'form-data': formData,
        });

    it('should create a fake NFT cats if'+
    ' provided with valid arguments', async () => {
      axiosStub.resolves(fixture.createfakeNFTCatsResponse);
      const result = await fakeNFTCatsUtilProxy.createFakeCatNFT(
          fixture.fileData,
          fixture.fileName,
          fixture.id,
      );
      expect(result).to.deep.equal(fixture.createfakeNFTCatsResponse.data.url);
    });
    it('should throw an error if axios'+
    ' response is not equal to 201', async () => {
      axiosStub.resolves(fixture.createfakeNFTErrorResponse);
      await expect(fakeNFTCatsUtilProxy.createFakeCatNFT(
          fixture.fileData,
          fixture.fileName,
          fixture.id,
      )).to.eventually.rejectedWith('Failed to create fake NFT cats');
    });
  });
});

