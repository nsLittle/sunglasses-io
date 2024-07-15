const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app/server'); // Adjust the path as needed

const should = chai.should();
chai.use(chaiHttp);

// Importing the data from JSON files
const users = require('../initial-data/users.json');
const brands = require('../initial-data/brands.json');
const products = require('../initial-data/products.json');

// TODO: Write tests for the server
describe('Brands', () => {
  describe('GETS all brand names', () => {
    it('it should return all FIVE brand names, including sample brand name [0] "Oakley"', (done) => {
      chai.request(server)
        .get('/brands')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body.should.assert(brands.length, '5');
          res.body.should.assert(brands[0].name, 'Oakley');
          done();
        });
    });
  });
  describe('GETS all product names', () => {
    it('it should return all ELEVEN product names, including sample product name [0] "Superglasses"', (done) => {
      chai.request(server)
        .get('/products')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body.should.assert(products.length, '11');
          res.body.should.assert(products[0].name, 'Superglasses');
          done();
        });
    });
  });
  describe('GETS details for specified product', () => {
    it('it should return all details for specified product, including sample product [0] detail price "150"', (done) => {
      const productName = "Superglasses";
      chai.request(server)
        .get(`/products/${productName}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('name');
          res.body.should.have.property('description');
          res.body.should.have.property('price');
          res.body.should.have.property('imageUrls');
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
      const userName = 'natalia';
      chai.request(server)
        .get(`/users/${userName}`)
        .end((err,res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          done();
        });
    });
  });
});