require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config({path: 'test.env'});

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const fixture = require('tests/unit/services/' +
  'fixtures/emailServiceConfig');

const {stub} = sinon;
chai.use(chaiAsPromised);

const {EMAIL_SENDER} = process.env;

describe('sendNotification', () => {
  const sendMailStub = stub();
  const createTransportStub = function() {
    return {
      sendMail: sendMailStub,
    };
  };
  const nodemailerStub = {
    createTransport: createTransportStub,
  };

  afterEach(() => {
    sendMailStub.reset();
  });

  describe('#sendEmail', () => {
    const emailServiceProxy = proxyquire(
        'src/services/emailService', {
          nodemailer: nodemailerStub,
        });

    it('should send an email if provided with valid arguments', async () => {
      sendMailStub.resolves(fixture.sendEmailResponse);

      await emailServiceProxy.sendNotification(
          fixture.recipients,
          fixture.subject,
          fixture.body,
      );

      expect(sendMailStub.calledOnceWithExactly({
        from: EMAIL_SENDER,
        to: fixture.recipients,
        subject: fixture.subject,
        html: fixture.body,
      })).to.be.true;
    });
    it('should throw an error if'+
    ' provided with invalid recipients ', async () => {
      await expect(emailServiceProxy.sendNotification(
          null,
          fixture.subject,
          fixture.body,
      )).to.eventually.rejectedWith(/invalid recipients/);
    });
    it('should throw an error if'+
    ' provided with invalid subject ', async () => {
      await expect(emailServiceProxy.sendNotification(
          fixture.recipients,
          null,
          fixture.body,
      )).to.eventually.rejectedWith(/invalid subject/);
    });
    it('should throw an error if'+
    ' provided with invalid body ', async () => {
      await expect(emailServiceProxy.sendNotification(
          fixture.recipients,
          fixture.subject,
          null,
      )).to.eventually.rejectedWith(/invalid body/);
    });
  });
});

