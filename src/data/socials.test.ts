import { describe, expect, it } from "vitest";
import { getSocials } from "@/data/socials";

describe("socials", () => {
  it("lists the six profiles in order with the real links", () => {
    const s = getSocials();
    expect(s.map(x => x.id)).toEqual(["gmail", "github", "linkedin", "instagram", "facebook", "whatsapp"]);
    const href = (id: string) => s.find(x => x.id === id)!.href;
    expect(href("gmail")).toBe("mailto:josefvitomangalino@gmail.com");
    expect(href("github")).toBe("https://github.com/JosefVito");
    expect(href("linkedin")).toBe("https://www.linkedin.com/in/josefvitoevangelista/");
    expect(href("instagram")).toBe("https://www.instagram.com/jsfvnglst/");
    expect(href("facebook")).toBe("https://www.facebook.com/ttpvnglst");
    expect(href("whatsapp")).toMatch(/^https:\/\/wa\.me\/\d{8,15}\?text=/);
  });
  it("gives every profile a logo and a readable name", () => {
    getSocials().forEach(x => { expect(x.path.length, x.id).toBeGreaterThan(20); expect(x.label).toBeTruthy(); });
  });
});
