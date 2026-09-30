import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({ usePathname: () => "/work/k-station" }));
import { Nav } from "@/components/layout/Nav";
import { hrefFor, NAV_LINKS } from "@/components/layout/nav-links";

describe("nav links", () => {
  it("anchors stay bare on the home page and get a slash elsewhere", () => {
    expect(hrefFor(NAV_LINKS[0], "/")).toBe("#work");
    expect(hrefFor(NAV_LINKS[0], "/work/k-station")).toBe("/#work");
  });
});

describe("Nav on a case-study page", () => {
  it("shows All work, opens and closes the mobile menu with Escape, and restores body scroll", () => {
    render(<Nav />);
    expect(screen.getByText("All work")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Open menu"));
    expect(document.body.style.overflow).toBe("hidden");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(document.body.style.overflow).toBe("");
  });
});
