import { test, expect } from "@playwright/test";

test("API Gateway should start and listen on correct port", async ({
  request,
}) => {
  const response = await request.get("http://localhost:3000");
  expect(response.ok()).toBeTruthy();
});

test("API Gateway should handle rate limiting", async ({ request }) => {
  for (let i = 0; i < 101; i++) {
    await request.get("http://localhost:3000");
  }
  const response = await request.get("http://localhost:3000");
  expect(response.status()).toBe(429);
});
