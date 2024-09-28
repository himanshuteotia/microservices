import { test, expect } from "@playwright/test";

test("Dynamic proxy should route requests to correct service", async ({
  request,
}) => {
  const response = await request.get(
    "http://localhost:3000/service-one/some-endpoint"
  );
  expect(response.ok()).toBeTruthy();
  // You might want to check the response body to ensure it's from the correct service
});

test("Dynamic proxy should handle unavailable services", async ({
  request,
}) => {
  // Assume service-three is not registered
  const response = await request.get("http://localhost:3000/service-three");
  expect(response.status()).toBe(502);
});
