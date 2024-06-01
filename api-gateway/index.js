import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = 3000;

// Example service URLs
const SERVICE_ONE_URL = 'http://localhost:4000';
const SERVICE_TWO_URL = 'http://localhost:5000';

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  next();
});

// Proxy requests to Service A
app.use('/service-one', createProxyMiddleware({
  target: SERVICE_ONE_URL,
  changeOrigin: true,
  pathRewrite: { '^/service-one': '' }
}));

// Proxy requests to Service B
app.use('/service-two', createProxyMiddleware({
  target: SERVICE_TWO_URL,
  changeOrigin: true,
  pathRewrite: { '^/service-two': '' }
}));

app.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
});

