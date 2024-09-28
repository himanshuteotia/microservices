import { dynamicProxy } from "../proxyUtils.js";
import axios from "axios";
import { createProxyMiddleware } from "http-proxy-middleware";

jest.mock("axios");
jest.mock("http-proxy-middleware");
jest.mock("../logger.js", () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

// ... rest of the file remains unchanged ...
