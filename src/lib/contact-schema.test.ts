import { describe, expect, it } from "vitest";
import { contactSchema } from "@/lib/contact-schema";

const good = { name: "Ana", email: "ana@example.com", subject: "A storefront", message: "We need a Medusa storefront for our shop by December.", website: "" };

describe("contactSchema", () => {
  it("accepts a good message", () => expect(contactSchema.safeParse(good).success).toBe(true));
  it("rejects a short message, bad email, unknown subject", () => {
    expect(contactSchema.safeParse({ ...good, message: "hi" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...good, email: "nope" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...good, subject: "Spam" }).success).toBe(false);
  });
  it("trims whitespace", () => {
    expect(contactSchema.parse({ ...good, name: "  Ana  " }).name).toBe("Ana");
  });
});
