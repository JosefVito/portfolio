import { test, expect } from "@playwright/test";

test("form validates, then sends in dry-run mode", async ({ page }) => {
  await page.goto("/#contact");
  await page.getByRole("button", { name: /send message/i }).click();
  await expect(page.locator("form [role=alert]")).toBeVisible(); // Next's route announcer is also role=alert
  await page.getByLabel("Name").fill("Ana");
  await page.getByLabel("Email").fill("ana@example.com");
  await page.getByLabel("Message").fill("We need a Medusa storefront for our shop by December.");
  await page.getByRole("button", { name: /send message/i }).click();
  await expect(page.getByRole("status")).toContainText("Sent");
});

test("WhatsApp CTA carries the prefilled text", async ({ page }) => {
  await page.goto("/");
  const href = await page.getByRole("link", { name: /chat on whatsapp/i }).first().getAttribute("href");
  expect(href).toMatch(/^https:\/\/wa\.me\/\d{8,15}\?text=/);
});
