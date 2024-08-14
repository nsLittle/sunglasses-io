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

app.use(express.json())
app.use(bodyParser.json());

// Importing the data from JSON files
const users = require('../initial-data/users.json');
const brands = require('../initial-data/brands.json');
const products = require('../initial-data/products.json');

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

// Secret key for JWT
// node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
const JWT_SECRET = '9527e3a06a598251710743aa74e29e3681762684a01b184762469005a26afef3';

// Authentication middleware
const authenticateJWT = (req, res, next) =>  {
  console.log(req.headers);
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).send('Invalid token');
      }

      req.user = user;
      next();
    });
  } else {
    res.status(401).send('Authorization header missing');
  }

  // if (user && bcrypt.compareSync(password, user.login.password)) {
  //   req.user = user;
  //   return next();
  // }
  //   return res.status(401).send(`Who are you?`);
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

  if (brand) {
    const brandId = brand.id; // 1
    const product = products.filter(product => product.categoryId === brandId);
    res.json(product);
  } else {
    res.status(401).send('Brand name not found');
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
    res.status(401).send('Product not found');
  };
});

// AUTHENTICATED ROUTES
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(user => user.login.username === username);

  if  (user && bcrypt.compareSync(password, user.login.password)) {
    const token = jwt.sign({ username: user.login.username }, JWT_SECRET, {expiresIn: '1h' });
    res.json( { token });
  } else {
    res.status(401).send('Username or password is incorrect');
  }

  // let currentAccessToken = accessTokens.find(tokenObject => tokenObject.username === username);

  // if (currentAccessToken) {
  //   currentAccessToken.lastUpdated = new Date();
  //   res.status(200).json(currentAccessToken.token);
  // } else {
  //   const newAccessToken = {
  //     username: username,
  //     password: password,
  //     lastUpdated: new Date(),
  //     token: "hznbecuuhckvdilihglyfqonetlnwtizmzbfztkqvpawnbdyvmni",
  //   };
  //   accessTokens.push(newAccessToken);
  //   res.status(200).json(newAccessToken.token);
  // };
});

app.get('/users', authenticateJWT, (req, res) => {
  const userNames = users.map(user => user.name.first);
  res.status(200).json(userNames);
});

app.get('/:name', authenticateJWT, (req, res) => {
  const userName = req.params.name.toLowerCase();
  const user = users.find(user => user.name.first.toLowerCase() === userName);

  if (user) {
    const userCart = user.cart;
    res.status(200).json(userCart);
  } else {
    res.status(401).send('Unauthorized');
  }; 
});

app.post('/:name', authenticateJWT, (req, res) => {
  const userName = req.params.name.toLowerCase();
  const user = users.find(user => user.name.first.toLowerCase() === userName);

  if (!user) {
    return res.status(401).send('User not found.');
  };

  if (!user.cart) {
    user.cart = { items: [], total: 0 };
  };

  const newItem= {
    product: req.body.product || '',
    quantity: req.body.quantity || 0,
    price: req.body.total || 0,
  };

  user.cart.items.push(newItem);
  user.cart.total = user.cart.items.reduce(
    (sum, item) => sum + (item.price * item.quantity), 0
  );

  res.status(200).json(user.cart);
});

app.delete('/:name', authenticateJWT, (req, res) => {
  res.status(200).send('You should be ADDING to your cart');
});

// Starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

module.exports = app;