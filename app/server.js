const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt= require('bcrypt');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml'); // REPLACED with new one './swagger.yaml' with the path to your Swagger file
const app = express();
const path = require('path');

app.use(bodyParser.json());

// Importing the data from JSON files
const users = require('../initial-data/users.json');
const brands = require('../initial-data/brands.json');
const products = require('../initial-data/products.json');


// ApiKey Generator @ https://www.akto.io/tools/api-key-generator
const VALID_APIKEY = ["kznylgunwckqhpmwofzgqetxzdaxafurgbbnfdcnjevfpkukshksujpfrvhanuftzudvwrmakpxdhznbecuuhckvdilihglyfqonetlnwtizmzbfztkqvpawnbdyvmni"];

// CORS
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Authentication, X-Username, X-Password, X-ApiKey",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
};

// Middleware stuff...
app.use((req, res, next) => {
  res.set(CORS_HEADERS);
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Authentication middleware
const authenticate = (req, res, next) =>  {
 const { username, password } = req.body;

 if (username || password) {
  return res.status(400).send(`Who are you?`);
 };
 next();
};

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
  res.send('../index.html');
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
  const productDetails = {
    name: product.name,
    description: product.description,
    price: product.price,
    imageUrls: product.imageUrls
  };
  if (product) {
    res.json(productDetails);
  } else {
    res.status(404).send('Product not found');
  };
});

// AUTHENTICATED ROUTES
app.post('/login', authenticate, (req, res) => {
  res.status(200).send(`Let's shop!`);
});

app.get('/users', authenticate, (req, res) => {
  const userNames = users.map(user => user.name.first);
  res.status(200).json(userNames);
});

app.get('/:name', authenticate, (req, res) => {
  const userName = req.params.name.toLowerCase();
  const user = users.find(user => user.name.first.toLowerCase() === userName);

  if (user) {
    const userCart = user.cart;
    res.status(200).json(userCart);
  } else {
    res.status(401).send('Unauthorized');
  }; 
});

app.post('/:name', authenticate, (req, res) => {
  res.status(200).send('Your shopping cart is updated');
});

app.delete('/:name', (req, res) => {
  // DELETE CART
  res.status(200).send('You should be ADDING to your cart');
});

// Starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

module.exports = app;