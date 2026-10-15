import { describe, expect, it } from "vitest";
import { ProfileSchema, StopSchema, ProjectSchema, ServiceSchema } from "@/data/schemas";
import { profile } from "@/data/profile";
import { experience } from "@/data/experience";
import { projects, getProject, nextProject } from "@/data/projects";
import { services } from "@/data/services";
import { existsSync } from "node:fs";
import path from "node:path";

describe("content data", () => {
  it("profile is valid", () => expect(ProfileSchema.safeParse(profile).success).toBe(true));
  it("has five experience stops, newest first", () => {
    expect(experience).toHaveLength(5);
    experience.forEach(s => expect(StopSchema.safeParse(s).success).toBe(true));
    expect(experience[0].company).toBe("Self-employed");
    expect(experience[1].company).toBe("MacDevelop");
    expect(experience[1].dates).toBe("Feb 2026 — Oct 2026");
  });
  it("K-Station has no public link while it is in progress", () => {
    const k = projects.find(p => p.slug === "k-station")!;
    expect(k.live).toBeUndefined();
    expect(k.status).toBe("in-progress");
  });
  it("has four projects with unique slugs and covers", () => {
    expect(projects).toHaveLength(4);
    projects.forEach(p => expect(ProjectSchema.safeParse(p).success).toBe(true));
    expect(new Set(projects.map(p => p.slug)).size).toBe(4);
  });
  it("has six services numbered 1..6", () => {
    expect(services.map(s => s.n)).toEqual([1, 2, 3, 4, 5, 6]);
    services.forEach(s => expect(ServiceSchema.safeParse(s).success).toBe(true));
  });
  it("getProject finds by slug and nextProject wraps around", () => {
    expect(getProject("k-station")?.title).toBe("K-Station");
    expect(getProject("nope")).toBeUndefined();
    expect(nextProject("macdevelop").slug).toBe("k-station");
    expect(nextProject("k-station").slug).toBe("little-legend");
  });
  it("rejects a project without a cover", () => {
    expect(ProjectSchema.safeParse({ ...projects[0], cover: "" }).success).toBe(false);
  });
});

describe("image files", () => {
  const pub = (p: string) => path.join(process.cwd(), "public", p);
  it("every project cover and screenshot exists on disk", () => {
    for (const p of projects) {
      expect(existsSync(pub(p.cover)), p.cover).toBe(true);
      p.screenshots.forEach(s => expect(existsSync(pub(s.src)), s.src).toBe(true));
    }
    expect(existsSync(pub("/images/portrait.jpg"))).toBe(true);
    expect(existsSync(pub("/images/about.jpg"))).toBe(true);
  });
});
