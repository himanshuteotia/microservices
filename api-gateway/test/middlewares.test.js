import { setupMiddlewares } from "../middlewares.js";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";

jest.mock("express-rate-limit");
jest.mock("express-slow-down");
jest.mock("../logger.js", () => ({
  info: jest.fn(),
}));
