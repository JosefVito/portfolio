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
  it("colours words from accentFrom with the accent class", () => {
    render(<WordReveal text="shipped like an engineer." accentFrom={2} />);
    expect(screen.getByText("an")).toHaveClass("text-accent");
    expect(screen.getByText("shipped")).not.toHaveClass("text-accent");
  });
});
