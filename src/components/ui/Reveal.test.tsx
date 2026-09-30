import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("motion/react", async (orig) => {
  const m = await orig<typeof import("motion/react")>();
  return { ...m, useReducedMotion: () => true };
});
import { Reveal } from "@/components/ui/Reveal";

describe("Reveal with reduced motion", () => {
  it("renders children visible immediately (no initial hidden state)", () => {
    render(<Reveal><p>Hello</p></Reveal>);
    const el = screen.getByText("Hello").parentElement as HTMLElement;
    expect(el.style.opacity === "" || el.style.opacity === "1").toBe(true);
  });
});
