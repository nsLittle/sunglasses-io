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
  describe('GETS all brand naames', () => {
    it('should return all brands', (done) => {
      assert.equal(brands.length, 5);
      done();
    });
  });
});

describe('Products', () => {
  describe('GETS all products', () => {
    it('should return all products', (done) => {
      assert.equal(products.length, 11);
      done();
    });
  });
  describe('GETS specified', () => {
    it('should return specified product', (done) => {
      const product = products.find(p => p.id === "11");
      assert.equal(product.name, "Habanero");
      done();
    });
  });
});

describe('Login', () => {});

describe('Cart', () => {});