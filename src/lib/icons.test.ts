import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const app = (f: string) => path.join(process.cwd(), "src/app", f);

describe("site icons", () => {
  it("does not ship the create-next-app favicon", () => {
    expect(existsSync(app("favicon.ico"))).toBe(false);
  });
  it("has PNG icons for Safari and iOS next to the SVG", () => {
    expect(existsSync(app("icon.svg"))).toBe(true);
    expect(existsSync(app("icon.png"))).toBe(true);
    expect(existsSync(app("apple-icon.png"))).toBe(true);
  });
});
