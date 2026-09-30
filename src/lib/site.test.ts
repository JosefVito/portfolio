import { afterEach, describe, expect, it, vi } from "vitest";
import { getSiteUrl } from "@/lib/site";

afterEach(() => vi.unstubAllEnvs());

describe("getSiteUrl", () => {
  it("prefers NEXT_PUBLIC_SITE_URL", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://josefvito.vercel.app");
    expect(getSiteUrl()).toBe("https://josefvito.vercel.app");
  });
  it("falls back to the Vercel production host", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "josefvito.vercel.app");
    expect(getSiteUrl()).toBe("https://josefvito.vercel.app");
  });
  it("uses localhost outside production", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "");
    vi.stubEnv("VERCEL_ENV", "");
    expect(getSiteUrl()).toBe("http://localhost:3000");
  });
  it("throws in Vercel production when nothing is set", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "");
    vi.stubEnv("VERCEL_ENV", "production");
    expect(() => getSiteUrl()).toThrow(/NEXT_PUBLIC_SITE_URL/);
  });
});
