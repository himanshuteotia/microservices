import express from "express";
import { setupMiddlewares } from "./middlewares.js";
import { setupRoutes } from "./routes.js";
import logger from "./logger.js";

const app = express();
const PORT = 3000;

setupMiddlewares(app);
setupRoutes(app);

app.listen(PORT, () => {
  logger.info(`API Gateway running on http://localhost:${PORT}`);
});

if (process.env.NODE_ENV === "development") {
  import("./cleanupTests.js")
    .then(() => logger.info("Test files cleanup complete"))
    .catch((error) => logger.error("Error during cleanup:", error));
}
