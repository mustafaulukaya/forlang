const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const server = require('../../../app');

chai.use(chaiHttp);

describe('Visa Operations', () => {
    it('User Register', (done) => {

        const user = {
            firstname: 'test',
            lastname: 'test',
            phonenumber: '000000000',
            email : (Math.random()* Number.MAX_SAFE_INTEGER).toString(),
            password : '12345'
        };

        chai.request(server).post('/user/register').send(user).end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('id');
            res.body.should.have.property('message');
            res.body.should.have.property('firstname');
            res.body.should.have.property('lastname');
            res.body.should.have.property('phonenumber');
            res.body.should.have.property('email');
            done();
        });
    });


    it('User Login', (done) => {

        const credentials = {
            email: 'testemail',
            password: '12345'
        };

        chai.request(server).post('/user/login').send(credentials).end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message');
            res.body.should.have.property('token');
            done();
        });
    });

    //user silme testi yaz

    //user info testi yaz
});