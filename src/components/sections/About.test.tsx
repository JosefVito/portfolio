import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { About } from "@/components/sections/About";

describe("About", () => {
  it("renders headline, three stats and the core stack", () => {
    render(<About />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveAccessibleName("Built like an operator, shipped like an engineer.");
    expect(screen.getByText("production projects")).toBeInTheDocument();
    expect(screen.getByText("yrs running businesses")).toBeInTheDocument();
    expect(screen.getByText("Medusa v2")).toBeInTheDocument();
  });
});
