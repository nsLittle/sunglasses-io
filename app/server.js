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

// Created with https://www.uuidgenerator.net/
// const VALID_API_KEYS = ["c931d185-2a48-4e70-aabe-4589945771cf","a4873934-98cc-4ae8-a70d-eb5eae7d8b96s"];

// http.createServer(function (request, response) {
//   // Handle CORS Preflight request
//   if (request.method === 'OPTIONS'){
//     response.writeHead(200, CORS_HEADERS);
//     return response.end();
//   }

//   // Verify that a valid API Key exists before we let anyone access our API
//   if (!VALID_API_KEYS.includes(request.headers["x-authentication"])) {
//     response.writeHead(401, "You need to have a valid API key to use this API", CORS_HEADERS);
//     return response.end();
//   }
// });

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
  console.log(brandNames);
});

app.get('/products', (req, res) => {
	const productNames = products.map(product => product.name);
	res.json(productNames);
  console.log(productNames);
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
  console.log(productDetails);
});

app.get('/users/:name/cart', (req, res) => {
  const userCart = users.map(user => user.name.cart);
	res.json(userCart);
});

// Starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

module.exports = app;
