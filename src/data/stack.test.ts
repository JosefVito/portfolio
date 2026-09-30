import { describe, expect, it } from "vitest";
import { StackGroupSchema } from "@/data/schemas";
import { stackGroups } from "@/data/stack";

describe("stack data", () => {
  it("has four valid groups of four tools", () => {
    expect(stackGroups).toHaveLength(4);
    stackGroups.forEach(g => {
      expect(StackGroupSchema.safeParse(g).success).toBe(true);
      expect(g.tools).toHaveLength(4);
    });
  });
  it("marks exactly the four tools you sell most", () => {
    const hot = stackGroups.flatMap(g => g.tools).filter(t => t.hot).map(t => t.name);
    expect(hot.sort()).toEqual(["Medusa v2", "Next.js", "PostgreSQL", "Strapi 5"]);
  });
  it("gives every tool an official mark or a one-letter fallback, never nothing", () => {
    stackGroups.flatMap(g => g.tools).forEach(t => expect(t.path || t.letters, t.name).toBeTruthy());
  });
});
