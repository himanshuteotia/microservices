import { setupRoutes } from "../routes.js";
import { createProxyMiddleware } from "http-proxy-middleware";
import { dynamicProxy } from "../proxyUtils.js";
import { authMiddleware } from "../authMiddleware.js";

jest.mock("http-proxy-middleware");
jest.mock("../proxyUtils.js");
jest.mock("../authMiddleware.js");
