require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config({path: 'test.env'});

const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiAsPromised = require('chai-as-promised');
const app = require('app');

chai.use(chaiAsPromised);
chai.use(chaiHttp);


describe('usersRepository', () => {
  describe('#createNewUser', () => {
    it('should create new user if'+
    ' provided with valid arguments', (done) => {
      chai
          .request(app)
          .post('/users')
          .send({
            'email': 'seloriojoemarie@gmail.com',
            'firstName': 'joemarie',
            'lastName': 'selorio',
            'password': '@Password12345',
          })
          .end((err, res) => {
            console.log(res);
          });
      done();
    });
  });
});
