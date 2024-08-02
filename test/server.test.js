const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app/server');

const should = chai.should();
chai.use(chaiHttp);

// Importing the data from JSON files
const users = require('../initial-data/users.json');
const brands = require('../initial-data/brands.json');
const products = require('../initial-data/products.json');

// Tests for the server
describe('Home', () => {
  describe('GETS home page', () => {
    it('it should .....', (done) => {
      chai.request(server)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});

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
  describe('GETS all product names by brand', () => {
    it('it should return names of all products by brand', (done) => {
      const productName = 'Oakley';
      chai.request(server)
        .get(`/brands/${productName}`)
        .end((err, res) =>{
          res.should.have.status(200);
          res.body.should.be.an('array');
          done();
        });
    });
  });
});

describe('Products', () => {
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
  describe('GETS product details by product name', () => {
    it('it should return product details by product name, including sample product [0] detail price "150"', (done) => {
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

describe('Login', () => {
  describe('POST username and password from client-side server', () => {
    it(`it should return "Let's shop!"`, (done) => {
      chai.request(server)
        .get('/login')
        .end((err, res) => {
          res.should.have.status(200);
          res.text.should.equal(`Let's shop!`);
          done();
        });
      });
   });
});

describe('Users', () =>{
  describe('GETS names of users', () => {
    it('it should return names of users', (done) => {
       chai.request(server)
        .get('/users')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body.should.assert(users.length, '3');
          done();
        });
    });
  });
});

// Only allow authorized useres to access this
describe('Cart', () => {
  describe('GETS cart of existing users', () => {
    it('it should return cart of existing users', (done) => {
      chai.request(server)
        .get('/susanna')
        .end((err, res)=> {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('items');
          res.body.should.have.property('total');
          done();
        });
    });
  });
  describe('POST cart of existing users', () => {
    it('it should return updated cart of existing users', (done) => {

      chai.request(server)
        .post('/susanna')
        .send({
            items: [{
            product: 'glas',
            quantitty: 1,
            price: 50
          }],
          total: 50
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('items');
          res.body.should.have.property('total');
          done();
        });
    });
  });
  describe('DELETE cart of existing users', () => {
    it('it should return with item deleted from cart of existing users', (done) => {

      chai.request(server)
        .delete('/susanna')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          done();
      });
    });
  });
});