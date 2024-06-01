import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import axios from 'axios';

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

// Proxy requests to Service One
app.use('/service-one', dynamicProxy('service-one'));

// Proxy requests to Service Two
app.use('/service-two', dynamicProxy('service-two'));

app.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
});
