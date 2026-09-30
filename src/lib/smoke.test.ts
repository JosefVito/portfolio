import { describe, expect, it } from "vitest";

describe("toolchain", () => {
  it("runs tests with the @ alias resolving", async () => {
    const mod = await import("@/lib/smoke.test");
    expect(mod).toBeTruthy();
  });
});
