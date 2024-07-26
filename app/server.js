const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
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

// CORS
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, X-Authentication, X-Username, X-Password, X-ApiKey"
};

// Middleware stuff...
app.use((req, res, next) => {
  res.set(CORS_HEADERS);
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Created with https://www.uuidgenerator.net/
const VALID_API_KEYS = ["ABC"];

// Authentication middleware
const authenticate = (req, res, next) =>  {
  const username = req.headers['X-Username'];
  const password = req.headers['X-Password'];
  const apiKey =  req.headers['X-ApiKey'];

  const user = users.find((user) => user.login.username === username && user.login.password === password);

  if (!user || apiKey !== VALID_API_KEYS)  {
    return res.status(401).send('You do not belong here!');
  }

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



// ONLY AUTHENTICATED STORE PERSONNEL AND/OR USERS
app.get('/login', (req, res) =>{
  res.status(200).send(`Let's organize the store.`)
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const userName = users.find(user =>user.login.username);
  const passWord = users.find(user => user.login.password);

  if (username === userName && password === passWord) {
    res.status(200).send(`Let's Shop!`);
  } else {
    res.status(401).send(`You are not authrorized to Shop!`)
  }
});

app.get('/users', (req, res) => {
  const userNames = users.map(user => user.name.first);
  res.status(200).json(userNames);
});

app.get('/:name', (req, res) => {
  const userName = req.params.name.toLowerCase();
  const user = users.find(user => user.name.first.toLowerCase() === userName);

  if (user) {
    const userCart = user.cart;
    res.status(200).json(userCart);
  } else {
    res.status(401).send('Unauthorized');
  }; 
});

app.post('/:name', (req, res) => {
  res.status(200).send('Hello shopper!');
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