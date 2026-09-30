import { describe, expect, it } from "vitest";
import { trackProgress } from "@/lib/track";

describe("trackProgress", () => {
  it("maps scroll position to a 0..1 ratio and a card index", () => {
    expect(trackProgress(0, 2000, 800, 4)).toEqual({ ratio: 0, index: 0 });
    expect(trackProgress(1200, 2000, 800, 4)).toEqual({ ratio: 1, index: 3 });
    expect(trackProgress(400, 2000, 800, 4)).toEqual({ ratio: 1 / 3, index: 1 });
  });
  it("never divides by zero when everything fits", () => {
    expect(trackProgress(0, 800, 800, 4)).toEqual({ ratio: 0, index: 0 });
  });
});
