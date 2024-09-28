import { test, expect } from "@playwright/test";

test("Service One route should require authentication", async ({ request }) => {
  const response = await request.get("http://localhost:3000/service-one");
  expect(response.status()).toBe(401);
});

test("Service Two route should be accessible without authentication", async ({
  request,
}) => {
  const response = await request.get("http://localhost:3000/service-two");
  expect(response.ok()).toBeTruthy();
});
