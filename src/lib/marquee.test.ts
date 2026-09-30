import { describe, expect, it } from "vitest";
import { marqueeSpeed, marqueeX } from "@/lib/marquee";

describe("marquee maths (all values in pixels)", () => {
  it("crawls at 40 px/s at rest and speeds up with scroll velocity, capped", () => {
    expect(marqueeSpeed(0)).toBe(40);
    expect(marqueeSpeed(-20)).toBe(80);
    expect(marqueeSpeed(500)).toBe(120);
  });
  it("wraps the travelled distance to one row width so the loop is seamless", () => {
    expect(marqueeX(0, 500)).toBe(0);
    expect(marqueeX(120, 500)).toBe(-120);
    expect(marqueeX(620, 500)).toBe(-120);
    expect(marqueeX(10, 0)).toBe(0);
  });
});
