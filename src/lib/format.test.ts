import { describe, expect, it } from "vitest";
import { formatStat } from "@/lib/format";

describe("formatStat", () => {
  it("keeps one decimal when the target has one", () => {
    expect(formatStat(1.26, 2.5)).toBe("1.3");
    expect(formatStat(2.5, 2.5)).toBe("2.5");
  });
  it("rounds to integers when the target is whole", () => {
    expect(formatStat(4.6, 5)).toBe("5");
    expect(formatStat(0, 3)).toBe("0");
  });
});
