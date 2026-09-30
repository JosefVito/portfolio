import { test, expect } from "@playwright/test";

const PAGES = ["/", "/work/k-station", "/work/macdevelop"];

test.describe("reduced motion", () => {
  test.beforeEach(({}, info) => { test.skip(info.project.name !== "reduced-motion", "only in the reduced-motion project"); });
  test("nothing is left invisible after load", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(500);
    const hidden = await page.locator("main [style*='opacity']").evaluateAll(els => els.filter(e => getComputedStyle(e).opacity === "0").map(e => e.outerHTML.slice(0, 80)));
    expect(hidden).toEqual([]);
  });
});

test.describe("no horizontal overflow", () => {
  test.beforeEach(({}, info) => { test.skip(info.project.name !== "narrow", "only at 360px"); });
  for (const p of PAGES) {
    test(`${p} fits the viewport`, async ({ page }) => {
      await page.goto(p);
      await page.waitForTimeout(300);
      const { sw, cw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
      expect(sw).toBeLessThanOrEqual(cw);
    });
  }
});

test("every page has one h1, a skip link and landmark main", async ({ page }) => {
  for (const p of PAGES) {
    await page.goto(p);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main#main")).toHaveCount(1);
    await expect(page.getByRole("link", { name: "Skip to content" })).toHaveCount(1);
  }
});
