import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Stack } from "@/components/sections/Stack";

describe("Stack", () => {
  it("renders four groups with all sixteen tools and a one-line note each", () => {
    render(<Stack />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(4);
    expect(screen.getAllByRole("listitem").filter(li => li.hasAttribute("data-tool"))).toHaveLength(16);
    expect(screen.getByText("Carts, orders, payments")).toBeInTheDocument();
  });
  it("outlines the four main tools and gives logos to those with official marks", () => {
    render(<Stack />);
    const next = screen.getByText("Next.js").closest("[data-tool]") as HTMLElement;
    expect(next).toHaveAttribute("data-hot", "true");
    expect(next.querySelector("svg")).not.toBeNull();
    expect(screen.getByText("React").closest("[data-tool]")).toHaveAttribute("data-hot", "false");
    const pw = screen.getByText("Playwright").closest("[data-tool]") as HTMLElement;
    expect(pw.querySelector("svg")).toBeNull();
    expect(within(pw).getByText("Pw")).toBeInTheDocument();
  });
});
