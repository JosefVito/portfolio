import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ExperienceList } from "@/components/sections/ExperienceList";
import { experience } from "@/data/experience";

describe("ExperienceList", () => {
  it("starts with the first stop active and switches on hover", async () => {
    render(<ExperienceList stops={experience} />);
    const card = screen.getByTestId("detail-card");
    expect(card).toHaveTextContent("MacDevelop");
    expect(card).toHaveTextContent("01 / 04");
    fireEvent.mouseEnter(screen.getByRole("button", { name: /Owner & General Manager/ }));
    // mode="wait" crossfade: the swap lands after the 0.3s exit animation
    await waitFor(() => expect(card).toHaveTextContent("Vito Cafe"));
    expect(card).toHaveTextContent("04 / 04");
  });
  it("expands a stop inline on click (phone accordion)", () => {
    render(<ExperienceList stops={experience} />);
    fireEvent.click(screen.getByRole("button", { name: /Cafe & Community Manager/ }));
    expect(screen.getByRole("button", { name: /Cafe & Community Manager/ })).toHaveAttribute("aria-expanded", "true");
  });
});
