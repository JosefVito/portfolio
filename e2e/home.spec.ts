import { test, expect } from "@playwright/test";

test("home renders the name", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("Josef Vito");
});
