import { test, expect } from "@playwright/test";

const SLUGS = ["k-station", "little-legend", "dinecta", "macdevelop"];

for (const slug of SLUGS) {
  test(`/work/${slug} renders title, four sections and a next link`, async ({ page }) => {
    await page.goto(`/work/${slug}`);
    await expect(page.locator("h1")).toBeVisible();
    for (const id of ["context", "what-i-built", "architecture", "outcome"]) await expect(page.locator(`#${id}`)).toHaveCount(1);
    await expect(page.getByRole("link", { name: /Next project/ })).toBeVisible();
  });
}

test("unknown slug is a 404", async ({ page }) => {
  const res = await page.goto("/work/nope");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("link", { name: /Back home/ })).toBeVisible();
});

test("macdevelop shows the in-progress state and no live link", async ({ page }) => {
  await page.goto("/work/macdevelop");
  await expect(page.getByText("In progress", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: /Visit live site/ })).toHaveCount(0);
});
