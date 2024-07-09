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

// Starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});


app.get('/brands', (req, res) => {
	res.json(brands);
});

app.get('/products', (req, res) => {
	res.json(products);
	res.json(products.name);
});

app.get('/products/:name', (req, res) => {
	const productName = req.params.name;
	const product = products.find(p => p.name === productName);

	if (prodcut) {
		res.json(product)
	} else {
		res.status(404).send('Product not found');
	};
});

app.get('/users', (req, res) => {
	res.json(users);
});

module.exports = app;
