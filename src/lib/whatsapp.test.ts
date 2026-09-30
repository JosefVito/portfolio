import { describe, expect, it } from "vitest";
import { whatsappUrl } from "@/lib/whatsapp";

describe("whatsappUrl", () => {
  it("builds a wa.me link with encoded text", () => {
    expect(whatsappUrl("+63 915 000 0000", "Hi Josef, let's talk")).toBe("https://wa.me/639150000000?text=Hi%20Josef%2C%20let's%20talk");
  });
  it("rejects numbers outside 8–15 digits", () => {
    expect(() => whatsappUrl("123", "x")).toThrow(/8–15 digits/);
    expect(() => whatsappUrl("", "x")).toThrow();
  });
});
