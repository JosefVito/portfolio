import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContactForm } from "@/components/contact/ContactForm";

afterEach(() => vi.restoreAllMocks());

function fill() {
  fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Ana" } });
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ana@example.com" } });
  fireEvent.change(screen.getByLabelText("Message"), { target: { value: "We need a Medusa storefront for our shop by December." } });
}

describe("ContactForm", () => {
  it("has no sent-via or newsletter small print", () => {
    render(<ContactForm />);
    expect(screen.queryByText(/Resend|newsletter/i)).toBeNull();
  });
  it("shows a validation error without calling the API", async () => {
    const f = vi.spyOn(global, "fetch");
    render(<ContactForm />);
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/name/i);
    expect(f).not.toHaveBeenCalled();
  });
  it("posts the chosen subject and shows the sent state", async () => {
    const f = vi.spyOn(global, "fetch").mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    render(<ContactForm />);
    fireEvent.click(screen.getByRole("radio", { name: "Booking / ordering" }));
    fill();
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent(/Sent/));
    expect(JSON.parse(String(f.mock.calls[0][1]?.body)).subject).toBe("Booking / ordering");
  });
  it("shows the server error on a 500", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(new Response(JSON.stringify({ error: "Couldn't send right now." }), { status: 500 }));
    render(<ContactForm />);
    fill();
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/Couldn't send/);
  });
});
