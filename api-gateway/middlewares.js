import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import logger from "./logger.js";

export function setupMiddlewares(app) {
  // Rate Limiting Middleware setup
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        message: "Too many requests, please try again later.",
      });
    },
  });

  // Speed limiting middleware
  const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000,
    delayAfter: 50,
    delayMs: () => 500,
  });

  app.use(limiter);
  app.use(speedLimiter);

  // Middleware to log requests
  app.use((req, res, next) => {
    logger.info(`Request: ${req.method} ${req.url}`);
    next();
  });
}
