import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ServicesList } from "@/components/sections/ServicesList";
import { services } from "@/data/services";

describe("ServicesList", () => {
  it("opens the first row by default and only one row at a time", () => {
    render(<ServicesList items={services} />);
    const rows = screen.getAllByRole("button", { expanded: true });
    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveTextContent("Headless commerce storefronts");
    fireEvent.click(screen.getByRole("button", { name: /CMS-driven websites/ }));
    expect(screen.getAllByRole("button", { expanded: true })).toHaveLength(1);
    expect(screen.getByRole("button", { name: /CMS-driven websites/ })).toHaveAttribute("aria-expanded", "true");
  });
});
