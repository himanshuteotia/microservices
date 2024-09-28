import { test, expect } from "@playwright/test";

test("Auth middleware should reject requests without token", async ({
  request,
}) => {
  const response = await request.get("http://localhost:3000/service-one");
  expect(response.status()).toBe(401);
});

test("Auth middleware should accept requests with valid token", async ({
  request,
}) => {
  // Assume we have a way to get a valid token
  const validToken = "your-valid-token-here";
  const response = await request.get("http://localhost:3000/service-one", {
    headers: {
      Authorization: `Bearer ${validToken}`,
    },
  });
  expect(response.ok()).toBeTruthy();
});
