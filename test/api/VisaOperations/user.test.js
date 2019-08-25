const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const server = require('../../../app');

chai.use(chaiHttp);

describe('Visa Operations', () => {
    it('User Register', (done) => {

        const user = {
            Name: 'test',
            Surname: 'test',
            Email : (Math.random()* Number.MAX_SAFE_INTEGER).toString(),
            password : '12345'
        };

        chai.request(server).post('/api/v1/visa/register').send(user).end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('id');
            res.body.should.have.property('message');
            res.body.should.have.property('Name');
            res.body.should.have.property('Surname');
            res.body.should.have.property('Email');
            done();
        });
    });


    it('User Login', (done) => {

        const credentials = {
            email: 'system.admin@lileduca.com',
            password: 'bqo7d0u7!9.lil'
        };

        chai.request(server).post('/api/v1/visa/login').send(credentials).end((err, res) => {
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