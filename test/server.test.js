const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app/server');
const expect = chai.expect;

const should = chai.should();
chai.use(chaiHttp);

// IMPORTING DATA FROM JSON FILES
const users = require('../initial-data/users.json');
const brands = require('../initial-data/brands.json');
const products = require('../initial-data/products.json');

// TESTS FOR THE SERVER
describe('Home', () => {
  describe('GET /', () => {
    it('it should return status 200', (done) => {
      chai.request(server)
        .get('/')
        .end((err, res) => {
          if (err) return done(err);
          expect(res).to.have.status(200);
          done();
        });
    });
  });
});

describe('Brands', () => {
  describe('GETS /brands', () => {
    it('it should return all FIVE brand names, including sample brand name [0] "Burberry"', (done) => {
      chai.request(server)
        .get('/brands')
        .end((err, res) => {
          if (err) return done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body['All Brand Names']).to.have.lengthOf(5);
          expect(res.body['All Brand Names'][0]).to.equal('Burberry');
          done();
        });
    });
  });
  describe('GETS /brands/:name', () => {
    it('it should return product names by brand', (done) => {
      const productName = 'Burberry';
      chai.request(server)
        .get(`/brands/${productName}`)
        .end((err, res) =>{
          if (err) return done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('burberry');
          
          const products = res.body['burberry'];

          expect(products).to.be.an('array');

          products.forEach(product => {
            expect(product).to.have.property('id');
          })
          done();
        });
    });
  });
});

describe('Products', () => {
  describe('GETS /products', () => {
    it('it should return all ELEVEN product names', (done) => {
      chai.request(server)
        .get('/products')
        .end((err, res) => {
          if (err) return done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');

          const productNames = res.body['All Product Names'];

          expect(productNames).to.be.an('array');
          expect(productNames).to.have.lengthOf(11);
          expect(productNames[0]).to.equal('Better glasses');
          done();
        });
    });
  });
  describe('GETS /products/:name', () => {
    it('it should return product details by product name', (done) => {
      const productName = "Better glasses";
      chai.request(server)
        .get(`/products/${productName}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');

          const productDetails = res.body['Product Details'];

          expect(productDetails).to.be.an('object');
          expect(productDetails).to.have.property('name');
          expect(productDetails).to.have.property('description');
          expect(productDetails).to.have.property('price');
          expect(productDetails).to.have.property('imageUrls');

          res.body.should.have.property('Product Details');
          res.body['Product Details'].should.have.property['name'];
          res.body['Product Details'].should.have.property('description');
          res.body['Product Details'].should.have.property('price');
          res.body['Product Details'].should.have.property('imageUrls');
          done();
        });
    });
  });
});

describe('Login', () => {
  let authToken = '';

  describe('POST /login', () => {
    it(`it should return authentication token and message`, (done) => {
      const credentials =  Buffer.from('greenlion235:waters').toString('base64');

      chai.request(server)
        .post('/login')
        .set('Authorization', `Basic ${credentials}`)
        .end((err, res) => {
          if (err) return done(err);

          console.log('RSVP: ', res.status);
          console.log('RSVP, encore: ', res.body);

          expect(res).to.have.status(200);
          expect(res.body).to.have.property('token');
          expect(res.body).to.have.property('redirectUrl').that.equals('/natalia');
          authToken = res.body.token;
          console.log('Auth Token:', authToken);
          done();
        });
      });
   });
});

// describe('Users', () =>{
//   describe('GETS names of users', () => {
//     it('it should return names of users', (done) => {
//        chai.request(server)
//         .get('/users')
//         .set('Authorization', `Bearer ${authToken}`)
//         .end((err, res) => {
//           if (err) return done(err);
//           res.should.have.status(200);
//           res.body.should.be.an('array');
//           res.body.should.assert(users.length, '3');
//           done();
//         });
//     });
//   });
// });

// ONLY AUTHORIZED USERS

// describe('Cart', () => {
//   describe('GETS cart of existing users', () => {
//     it('it should return cart of existing users', (done) => {
//       chai.request(server)
//         .get('/susanna')
//         .end((err, res)=> {
//           res.should.have.status(200);
//           res.body.should.be.an('object');
//           res.body.should.have.property('items');
//           res.body.should.have.property('total');
//           done();
//         });
//     });
//   });

  // describe('POST cart of existing users', () => {
  //   it('it should return updated cart of existing users', (done) => {

  //     chai.request(server)
  //       .post('/susanna')
  //       .send({
  //           items: [{
  //           product: 'glas',
  //           quantitty: 1,
  //           price: 50
  //         }],
  //         total: 50
  //       })
  //       .end((err, res) => {
  //         res.should.have.status(200);
  //         res.body.should.be.an('object');
  //         res.body.should.have.property('items');
  //         res.body.should.have.property('total');
  //         done();
  //       });
  //   });
  // });

  // describe('DELETE cart of existing users', () => {
  //   it('it should return with item deleted from cart of existing users', (done) => {

  //     chai.request(server)
  //       .delete('/susanna')
  //       .end((err, res) => {
  //         res.should.have.status(200);
  //         res.body.should.be.an('object');
  //         done();
  //     });
  //   });
  // });
// });