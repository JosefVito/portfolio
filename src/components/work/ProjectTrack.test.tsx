import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectTrack } from "@/components/work/ProjectTrack";
import { projects } from "@/data/projects";

describe("ProjectTrack", () => {
  it("never captures the mouse wheel, so vertical scrolling always reaches the page", () => {
    render(<ProjectTrack projects={projects} />);
    const track = screen.getByLabelText("Case studies");
    const wheel = new WheelEvent("wheel", { deltaY: 100, bubbles: true, cancelable: true });
    track.dispatchEvent(wheel);
    expect(wheel.defaultPrevented).toBe(false);
    expect(track).not.toHaveAttribute("data-lenis-prevent");
  });
  it("marks every card so the hovered one can stay bright", () => {
    const { container } = render(<ProjectTrack projects={projects} />);
    expect(container.querySelectorAll(".track-card")).toHaveLength(4);
    expect(container.querySelector(".track")).not.toBeNull();
  });
});
