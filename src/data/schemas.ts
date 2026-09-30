import { z } from "zod";

export const SUBJECTS = ["A storefront", "A CMS website", "Booking / ordering", "Something else"] as const;

export const ProfileSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  title: z.string().min(1),
  titleOutline: z.string().min(1),
  tagline: z.string().min(1),
  intro: z.string().min(20),
  availability: z.string().min(1),
  availabilityWindow: z.string().min(1),
  location: z.string().min(1),
  city: z.string().min(1),
  timeZone: z.string().min(1),
  bio: z.string().min(60),
  aboutHeadline: z.object({ lead: z.string(), accent: z.string() }),
  stats: z.array(z.object({ value: z.number().positive(), suffix: z.string(), label: z.string() })).length(3),
  stack: z.array(z.string()).min(8),
  email: z.email(),
  socials: z.object({ linkedin: z.url(), github: z.url() }),
  whatsappPrefill: z.string().min(5),
});
export type Profile = z.infer<typeof ProfileSchema>;

export const StopSchema = z.object({
  id: z.string(),
  yearLabel: z.string(),
  dates: z.string(),
  role: z.string(),
  company: z.string(),
  location: z.string(),
  type: z.enum(["full-time", "internship", "founder"]),
  summary: z.string().min(20),
  highlights: z.array(z.string()).min(2).max(4),
  stack: z.array(z.string()).min(1),
});
export type Stop = z.infer<typeof StopSchema>;

export const ProjectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  n: z.number().int().min(1),
  title: z.string().min(1),
  year: z.string().length(4),
  type: z.string().min(1),
  blurb: z.string().min(20).max(160),
  chips: z.array(z.string()).length(3),
  role: z.string(),
  timeline: z.string(),
  stack: z.array(z.string()).min(2),
  live: z.url().optional(),
  status: z.enum(["live", "in-progress"]),
  cover: z.string().startsWith("/images/"),
  screenshots: z.array(z.object({ src: z.string().startsWith("/images/"), alt: z.string().min(3) })),
  summary: z.string().min(40),
});
export type Project = z.infer<typeof ProjectSchema>;

export const ServiceSchema = z.object({
  n: z.number().int().min(1).max(6),
  title: z.string(),
  tags: z.array(z.string()).length(2),
  description: z.string().min(30),
  chips: z.array(z.string()).length(3),
  includes: z.array(z.string()).length(3),
  timeline: z.string(),
});
export type Service = z.infer<typeof ServiceSchema>;
