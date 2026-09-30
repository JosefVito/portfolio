import { describe, expect, it } from "vitest";
import { formatLocalTime } from "@/lib/time";

describe("formatLocalTime", () => {
  it("formats HH:mm in the given zone", () => {
    expect(formatLocalTime(new Date("2026-09-30T06:05:00Z"), "Asia/Manila")).toBe("14:05");
  });
});
