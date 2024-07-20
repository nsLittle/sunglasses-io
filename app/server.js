const http = require('http');

const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml'); // REPLACE WITH NEW ONE './swagger.yaml' with the path to your Swagger file
const app = express();
const path = require('path');
const uid = require('rand-token').uid;

app.use(bodyParser.json());

// Importing the data from JSON files
const users = require('../initial-data/users.json');
const brands = require('../initial-data/brands.json');
const products = require('../initial-data/products.json');

// Access tokens
const newAccessToken = uid(12);
let accessTokens = [];

// Error handling
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// Route for root path
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Sunglasses.io</title>
      </head>
      <body>
        <h1>Let's shop for SUPA sunglasses!!!</h1>
        <div id="password-box">
          <input type="text" placeholder="username"></input>
          <input type="password" placeholder="password"></input>
          <button type="submit">Login</button>
          </br>
        </div>
        <img src="/SunglassesWireframe.png" alt="Sunglasses Wireframeeeee">
      </body>
    </html>
  `);
});

// Routes for /brands, /products, and /users
app.get('/brands', (req, res) => {
  const brandNames = brands.map(brand => brand.name);
  res.json(brandNames);
});

app.get('/brands/:name', (req, res) => {
  // NO SYMBOLS & NO SPACE
  const brandName = req.params.name.toLowerCase(); //Oakley
  const brand = brands.find(brand => brand.name.toLowerCase() === brandName); //Oakley
  const brandId = brand.id; // 1
  const product = products.filter(product => product.categoryId === brandId);
  if (brand) {
    res.json(product);
  } else {
    res.status(404).send('Products by brand not found');
  };
});

app.get('/products', (req, res) => {
	const productNames = products.map(product => product.name);
	res.json(productNames);
});

app.get('/products/:name', (req, res) => {
  // NO SYMBOLS & NO SPACE
  const productName = req.params.name.toLowerCase();
  const product = products.find(product => product.name.toLowerCase() === productName);
  if (product) {
    const productDetails = {
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrls: product.imageUrls
    };
    res.json(productDetails);
  } else {
    res.status(404).json({ error: 'Product not found'});
  };
});

// ONLY AUTHENTICATED STORE PERSONNEL
app.get('/users', (req, res) => {
  const userNames = users.map(user => user.name.first);
  res.json(userNames);
});

// ONLY AUTHENTICATED USERS
app.get('/:name', (req, res) => {
  // set route /:name
  const userName = req.params.name.toLowerCase();
  // if /:name === user.name.first
  const user = users.find(user => user.name.first.toLowerCase() === userName);
    
  // if user exists, return user.cart
  if (user) {
    const userCart = user.cart;
    res.json(userCart);
  // else return error
  } else {
    res.writeHead(400, 'Incorrect login username and password');
    return response.end();
  }; 
});


app.post('/users/:name', (req, res) => {
  // UPDATE CART
});

app.delete('/users/:name', (req, res) => {
  // DELETE CART
});

// Starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

module.exports = app;