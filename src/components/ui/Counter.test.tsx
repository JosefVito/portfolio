import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Counter } from "@/components/ui/Counter";

describe("Counter", () => {
  it("ends on the target value with suffix and label", async () => {
    render(<Counter value={5} suffix="+" label="production projects" />);
    await waitFor(() => expect(screen.getByTestId("counter-value").textContent).toBe("5"), { timeout: 3000 });
    expect(screen.getByText("+")).toBeInTheDocument();
    expect(screen.getByText("production projects")).toBeInTheDocument();
  });
});
