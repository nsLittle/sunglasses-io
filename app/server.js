const http = require('http');

const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml'); // Replace './swagger.yaml' with the path to your Swagger file
const app = express();

app.use(bodyParser.json());

// Importing the data from JSON files
const users = require('../initial-data/users.json');
const brands = require('../initial-data/brands.json');
const products = require('../initial-data/products.json');

// Error handling
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Route for root path
app.get('/', (req, res) => {
	res.send("Let's shop for sunglasses!");
});

// Routes for /brands, /products, and /users
app.get('/brands', (req, res) => {
  const brandNames = brands.map(brand => brand.name);
  res.json(brandNames);
});

app.get('/products', (req, res) => {
	const productNames = products.map(product => product.name);
	res.json(productNames);
});

app.get('/products/:name', (req, res) => {
	const productName = products.map(product => product.name);
  const productDescription = products.map(product => product.description);
  const productPrice = products.map(product => product.price);
  const productImageUrls = products.map(product => product.imageUrls);
  const productDetails = {
    "name": "productName",
    "description": "productDescription",
    "price": "productPrice",
    "imageUrls": "productImageUrls",
  };
	res.json(productDetails);
});

app.get('/users', (req, res) => {
  const userNames = users.map(user => user.name.first);
  res.json(userNames);
});

app.get('/users/:name', (req, res) => {
  const userName = req.params.name.toLowerCase();
  const user = users.find(user => user.name.first === userName);
  if (user) {
    res.json(user.cart);
  } else {
    res.status(404).json({ error: 'User not found' });
  };
});

// Starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

module.exports = app;
