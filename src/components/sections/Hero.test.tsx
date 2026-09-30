import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import { Hero } from "@/components/sections/Hero";

beforeAll(() => { process.env.NEXT_PUBLIC_WHATSAPP = "15550000000"; });

describe("Hero", () => {
  it("shows the name, both CTAs and the WhatsApp link", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveAccessibleName(/Josef Vito Evangelista/);
    expect(screen.getByRole("link", { name: /chat on whatsapp/i })).toHaveAttribute("href", expect.stringContaining("wa.me/15550000000"));
    expect(screen.getByRole("link", { name: /view work/i })).toHaveAttribute("href", "#work");
    expect(screen.getByAltText(/Josef Vito/)).toBeInTheDocument();
  });
});
