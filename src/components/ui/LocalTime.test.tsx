import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LocalTime } from "@/components/ui/LocalTime";

describe("LocalTime", () => {
  it("renders a HH:mm clock after mount", async () => {
    render(<LocalTime timeZone="Asia/Manila" />);
    await waitFor(() => expect(screen.getByTestId("local-time").textContent).toMatch(/^\d{2}:\d{2}$/));
  });
});
