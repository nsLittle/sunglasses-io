const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app/server'); // Adjust the path as needed

const should = chai.should();
chai.use(chaiHttp);

// TODO: Write tests for the server
describe('Brands', () => {
  describe('GETS all brand names', () => {
    it('it should return all brand names', (done) => {
      chai.request(server)
        .get('/brands')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          done();
        });
    });
  });
  describe('GETS all product names', () => {
    it('it should return all product names', (done) => {
      chai.request(server)
        .get('/products')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          done();
        });
    });
  });
  describe('GETS details for specified product', () => {
    it('it should return all details for specified product', (done) => {
      const productName = 'Sunglasses';
      chai.request(server)
        .get('/products/${productName}')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          done();
        });
    });
  });
});

describe('Login', () => {});

  // Reconfigure to AUTHENTICATE instead of just returning first names of users
describe('Cart', () => {
  describe('GETS autentication something something', () => {
    it('it should return authenticated users', (done) => {
       chai.request(server)
        .get('/users')
        .end((err,res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          done();
        });
    });
  });

  // Reconfigure to GET cart from specified user rather than the whole json
  describe('GETS cart from specified user', () => {
    it('it should return cart array of specified user', (done) => {
      const userName = "natalia";
      chai.request(server)
        .get('/users/${userName}')
        .end((err,res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          done();
        });
    });
  });
});