import { test, expect } from "@playwright/test";

test("sitemap lists home and the four case studies", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  for (const p of ["/", "/work/k-station", "/work/little-legend", "/work/dinecta", "/work/macdevelop"]) expect(xml).toContain(`<loc>http://localhost:3000${p}</loc>`);
});

test("robots allows crawling and points at the sitemap", async ({ request }) => {
  const txt = await (await request.get("/robots.txt")).text();
  expect(txt).toMatch(/Allow: \//);
  expect(txt).toContain("sitemap.xml");
});

test("home and a case study serve an OG image", async ({ page, request }) => {
  await page.goto("/work/dinecta");
  const og = await page.locator('meta[property="og:image"]').first().getAttribute("content");
  expect(og).toMatch(/opengraph-image/);
  const res = await request.get(og!);
  expect(res.ok()).toBe(true);
  expect(res.headers()["content-type"]).toContain("image/png");
});
