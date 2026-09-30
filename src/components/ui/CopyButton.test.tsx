import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CopyButton } from "@/components/ui/CopyButton";

describe("CopyButton", () => {
  it("copies and shows Copied", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    render(<CopyButton text="hi@example.com" />);
    fireEvent.click(screen.getByRole("button", { name: /copy/i }));
    expect(writeText).toHaveBeenCalledWith("hi@example.com");
    await waitFor(() => expect(screen.getByText("Copied")).toBeInTheDocument());
  });
});
