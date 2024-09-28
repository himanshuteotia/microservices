import { authMiddleware } from "../authMiddleware.js";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

jest.mock("../logger.js", () => ({
  error: jest.fn(),
}));

// ... rest of the file remains unchanged ...
