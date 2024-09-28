import axios from "axios";
import { createProxyMiddleware } from "http-proxy-middleware";
import logger from "./logger.js";

const REGISTRY_URL = "http://localhost:6000";
const cache = new Map();
const CACHE_TTL = 60 * 1000; // 1 minute in milliseconds

async function getServiceUrl(serviceName) {
  // Check if the URL is in cache and not expired
  const cachedData = cache.get(serviceName);
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
    logger.info(`Cache hit for ${serviceName}`);
    return cachedData.url;
  }

  try {
    const response = await axios.get(`${REGISTRY_URL}/services/${serviceName}`);
    logger.info(JSON.stringify(response.data));

    // Cache the URL with a timestamp
    cache.set(serviceName, { url: response.data, timestamp: Date.now() });

    return response.data;
  } catch (error) {
    logger.error(
      `Failed to get the URL for ${serviceName} from the registry`,
      error
    );
    return null;
  }
}

export const dynamicProxy = (serviceName) => {
  return async (req, res, next) => {
    const url = await getServiceUrl(serviceName);
    if (!url) {
      return res.status(502).send("Service unavailable");
    }

    const proxy = createProxyMiddleware({
      target: url,
      changeOrigin: true,
      pathRewrite: { [`^/${serviceName}`]: "" },
    });

    return proxy(req, res, next);
  };
};
