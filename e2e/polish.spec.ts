import { test, expect, type Page } from "@playwright/test";

const only = (names: string[]) => test.beforeEach(({}, info) => { test.skip(!names.includes(info.project.name), `only in ${names.join(", ")}`); });
const goToSelector = (page: Page, sel: string, offset = 0) =>
  page.evaluate(([s, o]) => { const e = document.querySelector(s as string)!; window.scrollTo(0, e.getBoundingClientRect().top + scrollY - (o as number)); }, [sel, offset] as const);

test("words in animated headings have visible gaps", async ({ page }) => {
  await page.goto("/");
  await goToSelector(page, "#about h2", 200);
  await page.waitForTimeout(1500);
  const gaps = await page.locator("#about h2 [data-testid=word]").evaluateAll(els =>
    els.slice(1).map((e, i) => { const a = els[i].getBoundingClientRect(), b = e.getBoundingClientRect(); return Math.abs(a.top - b.top) < 5 ? b.left - a.right : 99; }));
  expect(gaps.length).toBeGreaterThan(3);
  gaps.forEach(g => expect(g).toBeGreaterThan(3));
});

test("outlined text is really an outline, not a grey fill", async ({ page }) => {
  await page.goto("/");
  const color = await page.locator("#hero .stroke-text").first().evaluate(e => getComputedStyle(e).color);
  expect(color).toBe("rgba(0, 0, 0, 0)");
});

test.describe("narrow", () => {
  only(["narrow"]);
  test("hamburger bars share a left edge, width and even spacing", async ({ page }) => {
    await page.goto("/");
    const bars = await page.locator("button[aria-label='Open menu'] [data-bar]").evaluateAll(els => els.map(e => { const r = e.getBoundingClientRect(); return { x: r.x, w: r.width, y: r.y }; }));
    expect(bars).toHaveLength(3);
    expect(Math.abs(bars[0].x - bars[1].x)).toBeLessThan(0.5);
    expect(Math.abs(bars[2].x - bars[1].x)).toBeLessThan(0.5);
    expect(Math.abs(bars[0].w - bars[1].w)).toBeLessThan(0.5);
    expect(Math.abs((bars[1].y - bars[0].y) - (bars[2].y - bars[1].y))).toBeLessThan(0.5);
  });
});

test.describe("phone", () => {
  only(["phone", "narrow"]);
  test("name comes before the portrait on small screens", async ({ page }) => {
    await page.goto("/");
    const h1 = await page.locator("#hero h1").evaluate(e => e.getBoundingClientRect().top);
    const img = await page.locator("#hero img").first().evaluate(e => e.getBoundingClientRect().top);
    expect(h1).toBeLessThan(img);
  });
});

test.describe("desktop", () => {
  only(["desktop"]);

  test("header is comfortably sized", async ({ page }) => {
    await page.goto("/");
    const h = await page.locator("nav[aria-label=Primary]").evaluate(e => e.getBoundingClientRect().height);
    expect(h).toBeGreaterThanOrEqual(60);
  });

  test("Contact background word crawls calmly at about 40px per second", async ({ page }) => {
    await page.goto("/");
    await goToSelector(page, "#contact", 100);
    await page.waitForTimeout(600);
    const x = () => page.locator("#contact .marquee-track").evaluate(e => new DOMMatrix(getComputedStyle(e).transform).m41);
    await expect(page.locator("#contact .marquee-track")).toContainText("SAY HELLO");
    const a = await x(); await page.waitForTimeout(1000); const b = await x();
    const speed = Math.abs(b - a);
    expect(speed).toBeGreaterThan(20);
    expect(speed).toBeLessThan(120);
  });

  test("About has a word swap and a cursor spotlight, Work has no crawling word", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#about [data-swap]")).toContainText("OPERATOR");
    await expect(page.locator("#about [data-swap]")).toContainText("ENGINEER");
    await expect(page.locator("#about .marquee-track")).toHaveCount(0);
    await expect(page.locator("#work .marquee-track")).toHaveCount(0);
    await goToSelector(page, "#about", 0);
    await page.waitForTimeout(500);
    await page.mouse.move(600, 400);
    await page.waitForTimeout(200);
    const mx = await page.locator("#about [data-dots]").evaluate(e => (e as HTMLElement).style.getPropertyValue("--mx"));
    expect(mx).not.toBe("");
  });

  test("Stack section lists sixteen tools", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#stack [data-tool]")).toHaveCount(16);
    await expect(page.locator("#stack [data-tool][data-hot=true]")).toHaveCount(4);
  });

  test("Experience follows scrolling and the detail card stays pinned", async ({ page }) => {
    await page.goto("/");
    const mid = (i: number) => page.evaluate(idx => { const li = document.querySelectorAll("#experience ol > li")[idx]; window.scrollTo(0, li.getBoundingClientRect().top + scrollY - innerHeight / 2 + 40); }, i);
    const card = page.getByTestId("detail-card");
    await mid(1); await page.waitForTimeout(900); // sticky only engages once the list has scrolled past the card's pin point
    await expect(card).toContainText("Full Stack Development Trainee");
    const topA = await card.evaluate(e => e.getBoundingClientRect().top);
    await mid(3); await page.waitForTimeout(1200);
    await expect(card).toContainText("Vito Cafe");
    const topB = await card.evaluate(e => e.getBoundingClientRect().top);
    expect(Math.abs(topA - topB)).toBeLessThan(60);
    expect(topB).toBeGreaterThan(40);
  });

  test("wheel over the case-study cards still scrolls the page", async ({ page }) => {
    await page.goto("/");
    await goToSelector(page, "#work ul[aria-label]", 250);
    await page.waitForTimeout(1200);
    const r = await page.locator("#work ul[aria-label]").evaluate(e => { const b = e.getBoundingClientRect(); return { y: b.top + 150 }; });
    await page.mouse.move(720, r.y);
    const before = await page.evaluate(() => scrollY);
    for (let i = 0; i < 8; i++) { await page.mouse.wheel(0, 100); await page.waitForTimeout(60); }
    await page.waitForTimeout(800);
    expect(await page.evaluate(() => scrollY)).toBeGreaterThan(before + 200);
  });

  test("hovering one case-study card dims the others", async ({ page }) => {
    await page.goto("/");
    await goToSelector(page, "#work ul[aria-label]", 250);
    await page.waitForTimeout(1500);
    const cards = page.locator("#work .track-card");
    await cards.nth(1).hover();
    await expect.poll(() => cards.nth(0).evaluate(e => +getComputedStyle(e).opacity)).toBeLessThan(0.6);
    expect(await cards.nth(1).evaluate(e => +getComputedStyle(e).opacity)).toBe(1);
  });
});
