import { test, expect } from "@playwright/test";

const SECTIONS = ["hero", "about", "experience", "work", "services", "contact"];

test("home renders all six sections in order", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("Josef Vito");
  const ids = await page.locator("main > section").evaluateAll(els => els.map(e => e.id));
  expect(ids).toEqual(SECTIONS);
});

test("nav anchors reach their sections and the work cards link to four case studies", async ({ page, isMobile }) => {
  await page.goto("/");
  if (isMobile) { await page.getByRole("button", { name: "Open menu" }).click(); }
  await page.getByRole("link", { name: "Services", exact: true }).first().click();
  await expect(page).toHaveURL(/#services$/);
  const hrefs = await page.locator("#work a[href^='/work/']").evaluateAll(as => as.map(a => a.getAttribute("href")));
  expect(hrefs).toEqual(["/work/k-station", "/work/little-legend", "/work/dinecta", "/work/macdevelop"]);
});

test("services accordion keeps one row open", async ({ page }) => {
  await page.goto("/#services");
  await page.getByRole("button", { name: /CMS-driven websites/ }).click();
  await expect(page.locator("#services button[aria-expanded='true']")).toHaveCount(1);
});
