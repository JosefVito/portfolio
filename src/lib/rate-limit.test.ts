import { beforeEach, describe, expect, it } from "vitest";
import { rateLimit, _resetRateLimit } from "@/lib/rate-limit";

describe("rateLimit", () => {
  beforeEach(() => _resetRateLimit());
  it("allows 5 in a window and blocks the 6th", () => {
    const t = 1_000_000;
    for (let i = 0; i < 5; i++) expect(rateLimit("1.1.1.1", 5, 600_000, t + i)).toBe(true);
    expect(rateLimit("1.1.1.1", 5, 600_000, t + 5)).toBe(false);
  });
  it("allows again once the window has passed", () => {
    const t = 1_000_000;
    for (let i = 0; i < 5; i++) rateLimit("2.2.2.2", 5, 600_000, t);
    expect(rateLimit("2.2.2.2", 5, 600_000, t + 600_001)).toBe(true);
  });
  it("keys are independent", () => {
    for (let i = 0; i < 5; i++) rateLimit("a", 5, 600_000, 0);
    expect(rateLimit("b", 5, 600_000, 0)).toBe(true);
  });
});
