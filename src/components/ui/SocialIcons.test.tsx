import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SocialIcons } from "@/components/ui/SocialIcons";

describe("SocialIcons", () => {
  it("renders six labelled links; web profiles open in a new safe tab", () => {
    render(<SocialIcons />);
    const names = ["Gmail", "GitHub", "LinkedIn", "Instagram", "Facebook", "WhatsApp"];
    names.forEach(n => expect(screen.getByRole("link", { name: n })).toBeInTheDocument());
    expect(screen.getAllByRole("link")).toHaveLength(6);
    const ig = screen.getByRole("link", { name: "Instagram" });
    expect(ig).toHaveAttribute("target", "_blank");
    expect(ig.getAttribute("rel")).toContain("noreferrer");
    expect(screen.getByRole("link", { name: "Gmail" })).not.toHaveAttribute("target");
  });
});
