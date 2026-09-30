import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));
import { Footer } from "@/components/layout/Footer";

describe("Footer", () => {
  it("shows the social icons and no location, clock or built-with line", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "Instagram" })).toHaveAttribute("href", "https://www.instagram.com/jsfvnglst/");
    expect(screen.getByRole("link", { name: "WhatsApp" })).toBeInTheDocument();
    expect(screen.queryByText(/Built with Next/i)).toBeNull();
    expect(screen.queryByText(/Siargao/i)).toBeNull();
    expect(screen.queryByTestId("local-time")).toBeNull();
    expect(screen.getByText(/Josef Vito Evangelista/)).toBeInTheDocument();
  });
});
