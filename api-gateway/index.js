import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import axios from 'axios';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';

const app = express();
const PORT = 3000;
// URL of your service registry
const REGISTRY_URL = 'http://localhost:6000'; 

// Function to dynamically get service URL from the registry
async function getServiceUrl(serviceName) {
  try {
    const response = await axios.get(`${REGISTRY_URL}/services/${serviceName}`);
    console.log(JSON.stringify(response.data))
    const serviceUrl = response.data;
    return serviceUrl;
  } catch (error) {
    console.error(`Failed to get the URL for ${serviceName} from the registry`, error);
    return null;
  }
}

// Rate Limiting Middleware setup
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res, /*next*/) => { // Custom handler for when rate limit is exceeded
    res.status(429).json({
      message: "Too many requests, please try again later."
    });
  }
});

// Speed limiting middleware
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // allow 50 requests per 15 minutes, then...
  delayMs: 500 // begin adding 500ms of delay per request above 50
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

// Apply the speed limiting middleware to all requests
app.use(speedLimiter);

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  next();
});

// Dynamic proxy middleware
const dynamicProxy = (serviceName) => {
  return async (req, res, next) => {
    const url = await getServiceUrl(serviceName);
    if (!url) {
      return res.status(502).send('Service unavailable');
    }

    const proxy = createProxyMiddleware({
      target: url,
      changeOrigin: true,
      pathRewrite: { [`^/${serviceName}`]: '' }
    });

    return proxy(req, res, next);
  };
};

// Function to create middleware for authentication and authorization
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).send('Authorization header not found or invalid');
  }

  const token = authHeader.split(' ')[1]; 
  // Determine action based on HTTP method
  const action = req.method; 

  axios.post('http://localhost:9000/authorize', { token, action })
      .then(response => {
          if (response.status === 200) {
              next(); // Proceed if authorized
          } else {
              res.status(403).send('Access Denied');
          }
      })
      .catch(error => {
          if (error.response) {
              res.status(error.response.status).send(error.response.data);
          } else {
              res.status(500).send('Internal Server Error');
          }
      });
}

// Proxy requests to Service One
app.use('/service-one', authMiddleware,  dynamicProxy('service-one'));

// Proxy requests to Service Two
app.use('/service-two', dynamicProxy('service-two'));

// Proxy requests to Auth Service
app.use('/auth-service', createProxyMiddleware({
  target: 'http://localhost:9000',
  changeOrigin: true,
  pathRewrite: { [`^/auth-service`]: '' }
}));

app.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
});
