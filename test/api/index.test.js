const chai = require('chai');
const chaiHttp = require('chai-http');
const Should = chai.Should();

const server = require('../../app');

chai.use(chaiHttp);


describe('Node Server', () => {
   it('(SYSTEM CHECK)', (done) => {
       chai.request(server).get('/').end((err, res) => {
           res.should.have.status(200);
           done();
       });
   });
});