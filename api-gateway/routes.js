import { createProxyMiddleware } from "http-proxy-middleware";
import { dynamicProxy } from "./proxyUtils.js";
import { authMiddleware } from "./authMiddleware.js";

export function setupRoutes(app) {
  // Proxy requests to Service One
  app.use("/service-one", authMiddleware, dynamicProxy("service-one"));

  // Proxy requests to Service Two
  app.use("/service-two", dynamicProxy("service-two"));

  // Proxy requests to Auth Service
  app.use(
    "/auth-service",
    createProxyMiddleware({
      target: "http://localhost:9000",
      changeOrigin: true,
      pathRewrite: { [`^/auth-service`]: "" },
    })
  );
}
