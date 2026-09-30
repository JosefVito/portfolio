// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { _resetRateLimit } from "@/lib/rate-limit";

const { send } = vi.hoisted(() => ({ send: vi.fn() }));
vi.mock("resend", () => ({ Resend: class { emails = { send }; } }));

import { POST } from "@/app/api/contact/route";

const body = { name: "Ana", email: "ana@example.com", subject: "A storefront", message: "We need a Medusa storefront for our shop by December.", website: "" };
const req = (b: unknown, ip = "9.9.9.9", raw = false) =>
  new Request("http://localhost/api/contact", { method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": ip }, body: raw ? (b as string) : JSON.stringify(b) });

describe("POST /api/contact", () => {
  beforeEach(() => { _resetRateLimit(); send.mockReset(); send.mockResolvedValue({ data: { id: "1" }, error: null }); process.env.CONTACT_TO = "me@example.com"; process.env.RESEND_API_KEY = "re_test"; delete process.env.CONTACT_DRY_RUN; });

  it("sends and returns ok", async () => {
    const res = await POST(req(body));
    expect(res.status).toBe(200);
    expect(send).toHaveBeenCalledWith(expect.objectContaining({ to: ["me@example.com"], replyTo: "ana@example.com", subject: "[Portfolio] A storefront — Ana" }));
  });
  it("returns 400 on invalid fields", async () => {
    expect((await POST(req({ ...body, message: "hi" }))).status).toBe(400);
  });
  it("returns 400 on a non-JSON body, not 500", async () => {
    const res = await POST(req("not json", "9.9.9.9", true));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/form/i);
  });
  it("honeypot filled: 200 and nothing sent", async () => {
    const res = await POST(req({ ...body, website: "http://spam" }));
    expect(res.status).toBe(200);
    expect(send).not.toHaveBeenCalled();
  });
  it("rate limits the 6th request from one IP with 429", async () => {
    for (let i = 0; i < 5; i++) await POST(req(body, "5.5.5.5"));
    expect((await POST(req(body, "5.5.5.5"))).status).toBe(429);
  });
  it("returns 500 with a readable error when Resend fails", async () => {
    send.mockResolvedValue({ data: null, error: { message: "boom", name: "x" } });
    const res = await POST(req(body));
    expect(res.status).toBe(500);
    expect((await res.json()).error).toMatch(/email me/i);
  });
  it("dry run skips Resend", async () => {
    process.env.CONTACT_DRY_RUN = "1";
    expect((await POST(req(body))).status).toBe(200);
    expect(send).not.toHaveBeenCalled();
  });
});
