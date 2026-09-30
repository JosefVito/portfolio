import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Magnetic } from "@/components/ui/Magnetic";

describe("Magnetic on a coarse pointer (jsdom matchMedia is false)", () => {
  it("renders the child and does not move it", () => {
    render(<Magnetic><button>Hire me</button></Magnetic>);
    const wrap = screen.getByText("Hire me").parentElement as HTMLElement;
    fireEvent.mouseMove(wrap, { clientX: 40, clientY: 10 });
    expect(wrap.style.transform === "" || wrap.style.transform === "none").toBe(true);
  });
});
