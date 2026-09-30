import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WordReveal } from "@/components/ui/WordReveal";

describe("WordReveal", () => {
  it("renders each word in its own span and keeps the full text readable", () => {
    render(<WordReveal text="Built like an operator" />);
    expect(screen.getByText("Built")).toBeInTheDocument();
    expect(screen.getAllByTestId("word")).toHaveLength(4);
    expect(screen.getByLabelText("Built like an operator")).toBeInTheDocument();
  });
  it("keeps the space between words outside the clipped word boxes", () => {
    const { container } = render(<WordReveal text="Built like an" />);
    const root = container.firstElementChild as HTMLElement;
    const gaps = [...root.childNodes].filter(n => n.nodeType === Node.TEXT_NODE).map(n => n.textContent);
    expect(gaps).toEqual([" ", " "]);
    root.querySelectorAll("[data-testid=word]").forEach(w => expect(w.parentElement?.textContent).toBe(w.textContent));
  });
  it("colours words from accentFrom with the accent class", () => {
    render(<WordReveal text="shipped like an engineer." accentFrom={2} />);
    expect(screen.getByText("an")).toHaveClass("text-accent");
    expect(screen.getByText("shipped")).not.toHaveClass("text-accent");
  });
});
