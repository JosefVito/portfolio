import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Reveal } from "@/components/ui/Reveal";

describe("Reveal delay", () => {
  it("is still hidden shortly after mount when a long delay is set", async () => {
    render(<Reveal delay={5}><p>Later</p></Reveal>);
    await new Promise(r => setTimeout(r, 250));
    const el = screen.getByText("Later").parentElement as HTMLElement;
    expect(Number(el.style.opacity)).toBeLessThan(0.05);
  });
});
