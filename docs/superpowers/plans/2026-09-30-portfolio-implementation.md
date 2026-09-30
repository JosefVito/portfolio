# Josef Vito Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and launch a dark, animated, single-page freelance portfolio with four case-study pages at `josefvito.vercel.app`, from an empty folder to production.

**Architecture:** Next.js App Router with React Server Components for every section and small `"use client"` islands for motion and state. Content lives in typed TS data files (validated by Zod in unit tests) and one MDX file per case study. One Route Handler sends contact-form email through Resend. No CMS, no database.

**Tech Stack:** Next.js 16.3, React 19, TypeScript strict, Tailwind CSS 4.3 (`@theme` tokens), Motion 13 (`motion/react`), Lenis 1.3 (`lenis/react`), `@next/mdx` + `rehype-slug`, Zod 4, Resend 6, Vitest 5 + Testing Library, Playwright 1.63, GitHub Actions, Vercel.

**Spec:** `docs/superpowers/specs/2026-09-30-portfolio-design.md` (read it first; this plan argues from it).

## How to execute this plan (read before Task 1)

1. Open `~/Desktop/josefvito-portfolio` in its own Cursor window. Start Claude Code from a terminal **in that folder**, never from the K-Station terminal: Claude only sees the folder it was launched in, and subagents inherit that folder.
2. First message in the new session: "Execute `docs/superpowers/plans/2026-09-30-portfolio-implementation.md` with superpowers:subagent-driven-development, starting at the task named in `HANDOFF.md`."
3. Every session ends by updating `HANDOFF.md` (Task 1 creates it) and committing. Any session can stop after any task; every task ends at a buildable commit.
4. Owner-only steps are marked **OWNER**. They need a browser login or a secret and are done by Josef in the terminal with the `!` prefix or in a dashboard. The executor stops and asks when it reaches one.

## Global Constraints

- Node 22, npm. Lockfile committed. Pin exact versions in `package.json` (`npm i -E`).
- Next.js `16.3.x`, Tailwind `4.3.x`, `motion` `13.x`, `lenis` `1.3.x`, `zod` `4.x`, `resend` `6.x`. Verify any API you are unsure of with context7 before writing it.
- Single dark theme. Tokens exactly as in spec §4.1: `--bg #0A0A0B`, `--fg #F2F1EC`, `--muted #8D8B84`, `--accent #45F0B4`, `--accent-ink #0A0A0B`, `--line rgba(255,255,255,.08)`, `--surface rgba(255,255,255,.03)`, `--surface-hover rgba(255,255,255,.06)`, `--accent-glow rgba(69,240,180,.35)`, `--outline rgba(255,255,255,.45)`.
- Accent appears on: status dot, primary button, one phrase per headline, active timeline node, progress bar. Nowhere else.
- Fonts: Clash Display 600/700 and Satoshi 400/500/700 self-hosted from Fontshare (ITF Free Font License); JetBrains Mono via `next/font/google`. `display: "swap"`.
- Copy: name renders as "Josef Vito" (accent) over "Evangelista". About headline: "Built like an operator, shipped like **an engineer**." Six sections in this order: Hero, About, Experience, Work, Services, Contact. Nav order: Work, About, Services, Contact.
- Every animation honours `prefers-reduced-motion` (instant reveals, no marquee motion, no tilt, no magnetism). Tilt and magnetic mount only when `(hover: hover) and (pointer: fine)`.
- No new dependency for what a few lines do. Mark deliberate shortcuts with a `// ponytail:` comment naming the ceiling and the upgrade path.
- Gate before any "done" claim: `npm run lint && npm run typecheck && npm test && npm run build && npm run e2e`. Show the output.
- Commit after every task with a conventional-commit message. Never commit `.env.local`.
- Nothing in this plan touches `~/Desktop/k-station`.

## Review Focus

Inputs the spec implies but no feature test would naturally exercise. Each has a test pinned to its owning task.

1. **Non-JSON or empty body to `POST /api/contact`** must return 400 with a readable error, never a 500 stack trace. → Task 16.
2. **Rate-limit window expiry**: the 6th message from one IP inside 10 minutes gets 429, and the same IP is allowed again once the window passes. → Task 16.
3. **Honeypot filled**: respond `200 {ok:true}` and send nothing, so bots learn nothing. → Task 16.
4. **Reduced motion**: with `prefers-reduced-motion: reduce`, no element on the home page is left at `opacity: 0` after load. → Task 21.
5. **360px-wide phone**: the home page and every case-study page never scroll horizontally; long chips and titles wrap. → Task 21.

---

## Phase 0 — Kickoff (Tasks 1–5)

Ends with: scaffolded app, tokens and fonts wired, typed data with tests, placeholder images, repo on GitHub with CI green, Vercel preview deploying.

### Task 1: Scaffold the app, tooling, CLAUDE.md, HANDOFF.md

**Files:**
- Create (via create-next-app): `package.json`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `.gitignore`
- Create: `vitest.config.ts`, `vitest.setup.ts`, `.env.example`, `CLAUDE.md`, `HANDOFF.md`, `README.md`, `src/lib/smoke.test.ts`

**Interfaces:**
- Produces: npm scripts `dev`, `build`, `start`, `lint`, `typecheck`, `test`, `test:watch`, `e2e`; path alias `@/*` → `src/*`; Vitest with jsdom and Testing Library.

- [ ] **Step 1: Scaffold Next.js in the existing folder**

The folder already holds `.git` and `docs/`; both are on create-next-app's allow-list.

```bash
cd ~/Desktop/josefvito-portfolio
npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes
git status --short | head
```

Expected: `src/app/`, `package.json`, `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs` exist; `next` is `16.3.x` in `package.json`.

- [ ] **Step 2: Install test tooling and pin versions**

```bash
npm i -E motion lenis zod resend @next/mdx @mdx-js/loader @mdx-js/react @types/mdx rehype-slug
npm i -D -E vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test sharp
```

- [ ] **Step 3: Set scripts**

Edit `package.json` `"scripts"` to exactly:

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint .",
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "test:watch": "vitest",
  "e2e": "playwright test",
  "placeholders": "node scripts/placeholders.mjs"
}
```

- [ ] **Step 4: Vitest config and setup**

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    css: false,
  },
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
});
```

Create `vitest.setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => cleanup());

// whatsappHref() reads this at render time; components that call it would throw without it.
process.env.NEXT_PUBLIC_WHATSAPP = "15550000000";

// jsdom has no IntersectionObserver or matchMedia; motion and our hooks need both.
class IO {
  constructor(private cb: IntersectionObserverCallback) {}
  observe(el: Element) {
    this.cb([{ isIntersecting: true, target: el } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
  }
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
  root = null; rootMargin = ""; thresholds = [];
}
vi.stubGlobal("IntersectionObserver", IO);
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false, media: query, onchange: null,
    addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent() { return false; },
  }),
});
```

- [ ] **Step 5: Write a smoke test and run it**

Create `src/lib/smoke.test.ts`:

```ts
import { describe, expect, it } from "vitest";

describe("toolchain", () => {
  it("runs tests with the @ alias resolving", async () => {
    const mod = await import("@/lib/smoke.test");
    expect(mod).toBeTruthy();
  });
});
```

Run: `npm test`
Expected: `1 passed`.

- [ ] **Step 6: Env example, CLAUDE.md, HANDOFF.md, README**

Create `.env.example`:

```bash
# Server only
RESEND_API_KEY=re_xxxxxxxxx
CONTACT_TO=you@example.com
# Public
NEXT_PUBLIC_WHATSAPP=639150000000      # E.164 digits, no plus sign
NEXT_PUBLIC_SITE_URL=http://localhost:3000
# Set to 1 in tests to skip Resend
CONTACT_DRY_RUN=
```

Create `CLAUDE.md`:

```markdown
# josefvito-portfolio — workspace rules

Dark, animated, single-page freelance portfolio + four case-study pages. Next.js 16 App
Router, Tailwind 4, Motion, Lenis, MDX, Resend. Spec: `docs/superpowers/specs/`. Plan:
`docs/superpowers/plans/`. State: `HANDOFF.md` (read first, update last, every session).

## Rules
- Content lives in `src/data/*.ts` and `src/content/work/*.mdx`. No CMS, no database.
- Server components by default; `"use client"` only for motion or state.
- Every animation honours `prefers-reduced-motion`. Pointer effects only on `(hover: hover) and (pointer: fine)`.
- Accent `#45F0B4` only on: status dot, primary button, one phrase per headline, active timeline node, progress bar.
- No new dependency for what a few lines do. Mark shortcuts with `// ponytail:`.
- TDD: failing test → minimal code → green → commit.

## Verification (the gate)
`npm run lint && npm run typecheck && npm test && npm run build && npm run e2e`
(`e2e` needs a prior `npm run build`; it starts `next start` with `CONTACT_DRY_RUN=1`.)

## Deploy
GitHub `JosefVito/portfolio` → Vercel project `josefvito`, production from `main`, preview per PR.
Env vars live in Vercel, never in git.
```

Create `HANDOFF.md`:

```markdown
# HANDOFF — read first, update last

**Current phase:** 0 — Kickoff
**Next task:** Task 2 (fonts + tokens)
**Last green gate:** not yet run

## Done
- Task 1: scaffold, tooling, CLAUDE.md, HANDOFF.md — commit <hash>

## Blocked / waiting on owner
- (none yet)

## Content still missing (see spec §13)
- Hero portrait, About photo, WhatsApp number, lead inbox, case-study screenshots, MacDevelop renders, public OK for K-Station name, CV link fix.
```

Create `README.md`:

```markdown
# Josef Vito — portfolio

Freelance portfolio. Next.js 16, Tailwind 4, Motion, Lenis, MDX, Resend. Live: https://josefvito.vercel.app

```bash
cp .env.example .env.local   # fill in values
npm install
npm run dev                  # http://localhost:3000
npm run lint && npm run typecheck && npm test && npm run build && npm run e2e
```

Content: `src/data/*.ts`, `src/content/work/*.mdx`, images in `public/images/`.
```

- [ ] **Step 7: Lint, typecheck, commit**

```bash
npm run lint && npm run typecheck && npm test
git add -A
git commit -m "chore: scaffold Next.js 16 app with vitest, playwright, workspace docs"
```

Expected: all three green; one commit on `main`.

### Task 2: Fonts and design tokens

**Files:**
- Create: `src/fonts/ClashDisplay-Semibold.woff2`, `src/fonts/ClashDisplay-Bold.woff2`, `src/fonts/Satoshi-Regular.woff2`, `src/fonts/Satoshi-Medium.woff2`, `src/fonts/Satoshi-Bold.woff2`, `src/lib/fonts.ts`, `scripts/fetch-fonts.mjs`
- Modify: `src/app/globals.css` (replace), `src/app/layout.tsx` (replace), `src/app/page.tsx` (replace)

**Interfaces:**
- Produces: CSS variables `--font-clash`, `--font-satoshi`, `--font-jetbrains` on `<html>`; Tailwind tokens `bg-bg text-fg text-muted border-line bg-surface bg-surface-hover text-accent bg-accent text-accent-ink`, `font-display font-body font-mono`; utility classes `.container-x`, `.section`, `.label`, `.display`, `.text-outline`, `.marquee-track`.

- [ ] **Step 1: Fetch the Fontshare woff2 files**

Create `scripts/fetch-fonts.mjs`:

```js
// Downloads Clash Display and Satoshi woff2 from Fontshare's CSS API.
// License: ITF Free Font License (free for personal and commercial use, self-hosting allowed).
import { mkdir, writeFile } from "node:fs/promises";

const css = await fetch("https://api.fontshare.com/v2/css?f[]=clash-display@600,700&f[]=satoshi@400,500,700").then(r => r.text());
const blocks = css.split("@font-face").slice(1);
await mkdir("src/fonts", { recursive: true });
for (const b of blocks) {
  const family = /font-family:\s*'?([^;']+)'?;/.exec(b)?.[1]?.replace(/\s/g, "");
  const weight = /font-weight:\s*(\d+)/.exec(b)?.[1];
  const url = /url\(([^)]+\.woff2)\)/.exec(b)?.[1];
  if (!family || !weight || !url) continue;
  const name = { 400: "Regular", 500: "Medium", 600: "Semibold", 700: "Bold" }[weight];
  const buf = Buffer.from(await fetch(url).then(r => r.arrayBuffer()));
  await writeFile(`src/fonts/${family}-${name}.woff2`, buf);
  console.log("saved", `src/fonts/${family}-${name}.woff2`, buf.length);
}
```

Run: `node scripts/fetch-fonts.mjs && ls -la src/fonts`
Expected: five `.woff2` files, each larger than 20 KB.

If the API returns nothing, download manually from https://www.fontshare.com/fonts/clash-display and https://www.fontshare.com/fonts/satoshi, unzip, copy `Fonts/WEB/fonts/*.woff2` for the five weights into `src/fonts/` with the names above.

- [ ] **Step 2: Font loader module**

Create `src/lib/fonts.ts`:

```ts
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";

export const clash = localFont({
  src: [
    { path: "../fonts/ClashDisplay-Semibold.woff2", weight: "600", style: "normal" },
    { path: "../fonts/ClashDisplay-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-clash",
  display: "swap",
});

export const satoshi = localFont({
  src: [
    { path: "../fonts/Satoshi-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Satoshi-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/Satoshi-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

export const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const fontClass = `${clash.variable} ${satoshi.variable} ${jetbrains.variable}`;
```

- [ ] **Step 3: Replace globals.css with the token system**

Replace `src/app/globals.css` entirely:

```css
@import "tailwindcss";
@import "lenis/dist/lenis.css";

@theme {
  --color-bg: #0a0a0b;
  --color-fg: #f2f1ec;
  --color-muted: #8d8b84;
  --color-line: rgba(255, 255, 255, 0.08);
  --color-surface: rgba(255, 255, 255, 0.03);
  --color-surface-hover: rgba(255, 255, 255, 0.06);
  --color-accent: #45f0b4;
  --color-accent-ink: #0a0a0b;
  --color-accent-glow: rgba(69, 240, 180, 0.35);
  --color-outline: rgba(255, 255, 255, 0.45);

  --font-display: var(--font-clash), "Helvetica Neue", Arial, sans-serif;
  --font-body: var(--font-satoshi), "Segoe UI", Helvetica, Arial, sans-serif;
  --font-mono: var(--font-jetbrains), ui-monospace, Menlo, monospace;

  --ease-out-expo: cubic-bezier(0.22, 1, 0.36, 1);
}

:root { color-scheme: dark; }
html { background: var(--color-bg); color: var(--color-fg); }
body { font-family: var(--font-body); font-size: 16px; line-height: 1.6; -webkit-font-smoothing: antialiased; }
::selection { background: var(--color-accent); color: var(--color-accent-ink); }
:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 3px; }

@utility container-x { max-width: 1440px; margin-inline: auto; padding-inline: clamp(20px, 5vw, 80px); }
@utility section { padding-block: clamp(96px, 12vw, 160px); position: relative; }
@utility label { font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.14em; }
@utility display { font-family: var(--font-display); letter-spacing: -0.02em; line-height: 0.95; text-wrap: balance; }
@utility text-outline { color: transparent; -webkit-text-stroke: 1px var(--color-outline); }
@utility card { border: 1px solid var(--color-line); background: var(--color-surface); border-radius: 16px; }

.marquee-track { display: flex; white-space: nowrap; will-change: transform; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
```

- [ ] **Step 4: Replace layout.tsx and page.tsx**

Replace `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";
import { fontClass } from "@/lib/fonts";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Josef Vito — Full-Stack Developer", template: "%s — Josef Vito" },
  description: "Full-stack developer for headless commerce and content platforms. Next.js, Medusa, Strapi. Available for freelance projects.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontClass}>
      <body className="bg-bg text-fg font-body">{children}</body>
    </html>
  );
}
```

Replace `src/app/page.tsx` with a token smoke page (temporary; Task 18 replaces it):

```tsx
export default function Home() {
  return (
    <main className="container-x section">
      <p className="label text-accent">— Tokens</p>
      <h1 className="display text-[clamp(48px,8vw,112px)] font-bold">
        <span className="text-accent">Josef Vito</span><br />
        <span className="font-semibold">Evangelista</span>
      </h1>
      <p className="display text-outline text-6xl mt-6">Developer</p>
      <p className="text-muted mt-6 max-w-[65ch]">Body copy in Satoshi. Muted grey on near-black at about 5.8:1 contrast.</p>
      <p className="font-mono text-sm mt-4">JetBrains Mono 01 / 06</p>
      <div className="card p-6 mt-8">A card surface.</div>
    </main>
  );
}
```

- [ ] **Step 5: Build, look once, commit**

```bash
npm run build && npm run dev
```

Open http://localhost:3000. Expected: dark page, name in mint over off-white, outlined "Developer", mono label, card with faint border. Fonts are not Arial (check DevTools → Computed → font-family shows Clash Display / Satoshi). Stop the dev server.

```bash
npm run lint && npm run typecheck && git add -A && git commit -m "feat: design tokens, self-hosted Clash Display and Satoshi, JetBrains Mono"
```

### Task 3: Typed content data with Zod validation

**Files:**
- Create: `src/data/schemas.ts`, `src/data/profile.ts`, `src/data/experience.ts`, `src/data/projects.ts`, `src/data/services.ts`, `src/data/schemas.test.ts`, `src/lib/whatsapp.ts`, `src/lib/whatsapp.test.ts`
- Delete: `src/lib/smoke.test.ts`

**Interfaces:**
- Produces: `profile: Profile`, `experience: Stop[]`, `projects: Project[]`, `getProject(slug): Project | undefined`, `nextProject(slug): Project`, `services: Service[]`, `SUBJECTS` tuple, `whatsappUrl(number, text): string`, `whatsappHref(): string`.

- [ ] **Step 1: Write the failing schema tests**

Create `src/data/schemas.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { ProfileSchema, StopSchema, ProjectSchema, ServiceSchema } from "@/data/schemas";
import { profile } from "@/data/profile";
import { experience } from "@/data/experience";
import { projects, getProject, nextProject } from "@/data/projects";
import { services } from "@/data/services";

describe("content data", () => {
  it("profile is valid", () => expect(ProfileSchema.safeParse(profile).success).toBe(true));
  it("has four experience stops, newest first", () => {
    expect(experience).toHaveLength(4);
    experience.forEach(s => expect(StopSchema.safeParse(s).success).toBe(true));
    expect(experience[0].company).toBe("MacDevelop");
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
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test`
Expected: FAIL, cannot resolve `@/data/schemas`.

- [ ] **Step 3: Schemas**

Create `src/data/schemas.ts`:

```ts
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
```

- [ ] **Step 4: Profile data**

Create `src/data/profile.ts` (email and prefill are the owner's to confirm; the email is the one on the CV):

```ts
import type { Profile } from "@/data/schemas";

export const profile: Profile = {
  firstName: "Josef Vito",
  lastName: "Evangelista",
  title: "Full-Stack",
  titleOutline: "Developer",
  tagline: "Headless commerce · Next.js · Medusa · Strapi",
  intro: "I design and ship production web apps end to end, with the ownership boundaries that keep them correct after launch.",
  availability: "Available for new projects",
  availabilityWindow: "Available · Q4 2026",
  location: "Philippines · Remote · EU hours",
  city: "Siargao, PH · GMT+8",
  timeZone: "Asia/Manila",
  bio: "Full-stack developer focused on headless commerce and content platforms. I ran a cafe and a coworking space before writing software for a Dutch agency, so I build for the messy real world: data integrity, service boundaries, and delivery you can rely on.",
  aboutHeadline: { lead: "Built like an operator, shipped like", accent: "an engineer." },
  stats: [
    { value: 5, suffix: "+", label: "production projects" },
    { value: 3, suffix: "", label: "client projects shipped" },
    { value: 2.5, suffix: "", label: "yrs running businesses" },
  ],
  stack: ["TypeScript", "Next.js", "React", "Tailwind CSS", "Medusa v2", "Strapi 5", "Node.js", "PostgreSQL", "Redis", "Stripe", "Docker", "Playwright", "GitHub Actions"],
  email: "josefvitomangalino@gmail.com",
  socials: {
    linkedin: "https://www.linkedin.com/in/josefvitoevangelista/",
    github: "https://github.com/JosefVito",
  },
  whatsappPrefill: "Hi Josef, I found your portfolio and I'd like to talk about a project.",
};
```

- [ ] **Step 5: Experience data**

Create `src/data/experience.ts` (wording mirrors LinkedIn and the CV):

```ts
import type { Stop } from "@/data/schemas";

export const experience: Stop[] = [
  {
    id: "macdevelop-engineer",
    yearLabel: "2026",
    dates: "Feb 2026 — present",
    role: "Full Stack Engineer",
    company: "MacDevelop",
    location: "Netherlands · remote",
    type: "full-time",
    summary: "Design, build and maintain production web apps across frontend, backend, data, infrastructure and delivery.",
    highlights: [
      "Multi-service architectures with clear ownership between commerce, content and application layers",
      "Headless commerce with Medusa and content platforms with Strapi, wired through Next.js storefronts",
      "PostgreSQL-backed systems built for data integrity and concurrency; payments, email and search integrated",
      "Unit, integration and end-to-end tests with GitHub Actions CI and documented architecture decisions",
    ],
    stack: ["Next.js", "TypeScript", "Medusa", "Strapi", "PostgreSQL", "Redis", "Docker", "GitHub Actions"],
  },
  {
    id: "macdevelop-trainee",
    yearLabel: "2025",
    dates: "Jul 2025 — Feb 2026",
    role: "Full Stack Development Trainee",
    company: "MacDevelop Traineeships",
    location: "Netherlands · remote",
    type: "internship",
    summary: "Hands-on training on production client work: responsive UIs, Strapi content models, REST integration, Git workflows.",
    highlights: [
      "Next.js and TypeScript front ends with Tailwind CSS and component-based design",
      "Strapi as headless CMS with RESTful API integration",
      "Promoted to engineer after proving delivery on client projects",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Strapi", "Git"],
  },
  {
    id: "coco-cafe",
    yearLabel: "2025",
    dates: "Jan 2025 — Feb 2026",
    role: "Cafe & Community Manager",
    company: "Coco Cafe & CocoSpace",
    location: "Siargao, Philippines",
    type: "full-time",
    summary: "Ran day-to-day operations of a cafe and coworking space for remote workers, across finance, inventory, suppliers, staffing and service.",
    highlights: [
      "Team of 8 kept to consistent service standards through peak tourist seasons",
      "Grew the coworking community to 60+ active members within six months",
      "Marketing across digital platforms and in-house promotions",
    ],
    stack: ["Operations", "Finance", "Community", "Marketing"],
  },
  {
    id: "vito-cafe",
    yearLabel: "2023",
    dates: "Sep 2023 — May 2025",
    role: "Owner & General Manager",
    company: "Vito Cafe",
    location: "Lipa, Batangas",
    type: "founder",
    summary: "Founded and operated a cafe end to end: customer experience, hiring, marketing, cash flow and daily execution.",
    highlights: [
      "Team of 6 serving about 120 customers a day at peak",
      "Menu, recipes and seasonal specials designed and costed",
      "Operator habits that transfer to software: prioritisation, fast iteration, accountability",
    ],
    stack: ["Operations", "Hiring", "Budgeting", "Marketing"],
  },
];
```

- [ ] **Step 6: Projects data**

Create `src/data/projects.ts`:

```ts
import type { Project } from "@/data/schemas";

export const projects: Project[] = [
  {
    slug: "k-station",
    n: 1,
    title: "K-Station",
    year: "2026",
    type: "Full-stack",
    blurb: "Three-service commerce, content and booking platform for a K-pop venue in the Netherlands.",
    chips: ["Next.js", "Medusa", "Strapi"],
    role: "Sole engineer",
    timeline: "Jul 2025 → now",
    stack: ["Next.js 16", "TypeScript", "Medusa v2", "Strapi 5", "PostgreSQL", "Redis", "Stripe", "MeiliSearch", "Docker", "Playwright", "GitHub Actions"],
    live: "https://kstationeurope.com",
    status: "live",
    cover: "/images/work/k-station/cover.jpg",
    screenshots: [
      { src: "/images/work/k-station/shot-1.jpg", alt: "K-Station homepage with event listings" },
      { src: "/images/work/k-station/shot-2.jpg", alt: "K-Station checkout flow" },
    ],
    summary: "A commerce, content and booking platform built as three services with exclusive ownership: Medusa owns commerce, Strapi owns content, Next.js is the only place they meet.",
  },
  {
    slug: "little-legend",
    n: 2,
    title: "Little Legend",
    year: "2026",
    type: "Product",
    blurb: "Personalised AI storybooks: memory capture, generation pipeline, Medusa checkout.",
    chips: ["Next.js", "Medusa", "AI"],
    role: "Founder & engineer",
    timeline: "2025 → 2026",
    stack: ["Next.js", "TypeScript", "Medusa", "AI story & image generation", "Stripe"],
    live: "https://littlelegend.online",
    status: "live",
    cover: "/images/work/little-legend/cover.jpg",
    screenshots: [
      { src: "/images/work/little-legend/shot-1.jpg", alt: "Little Legend storefront hero" },
      { src: "/images/work/little-legend/shot-2.jpg", alt: "Personalising a storybook" },
    ],
    summary: "An independent product where families turn memories into illustrated storybooks. The generation pipeline produces a book preview in about 30 seconds end to end.",
  },
  {
    slug: "dinecta",
    n: 3,
    title: "Dinecta",
    year: "2026",
    type: "SaaS",
    blurb: "QR ordering, table management and GCash/Maya payments for PH restaurants.",
    chips: ["Next.js", "PostgreSQL", "Payments"],
    role: "Founder & engineer",
    timeline: "2026",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "GCash / Maya", "Vercel"],
    live: "https://www.dinecta.com",
    status: "live",
    cover: "/images/work/dinecta/cover.jpg",
    screenshots: [
      { src: "/images/work/dinecta/shot-1.jpg", alt: "Dinecta marketing homepage" },
      { src: "/images/work/dinecta/shot-2.jpg", alt: "Dinecta QR ordering flow" },
    ],
    summary: "An all-in-one restaurant platform for the Philippines: QR ordering, table management, reservations, payments and a branded site, built to launch in Siargao.",
  },
  {
    slug: "macdevelop",
    n: 4,
    title: "MacDevelop",
    year: "2026",
    type: "Agency site",
    blurb: "Agency website designed and built solo, from Figma to Next.js + Strapi.",
    chips: ["Next.js", "Strapi", "Motion"],
    role: "Designer & engineer",
    timeline: "Design complete · build in progress",
    stack: ["Next.js", "TypeScript", "Strapi 5", "Motion", "Tailwind CSS"],
    status: "in-progress",
    cover: "/images/work/macdevelop/cover.jpg",
    screenshots: [
      { src: "/images/work/macdevelop/shot-1.jpg", alt: "MacDevelop homepage design" },
      { src: "/images/work/macdevelop/shot-2.jpg", alt: "MacDevelop services page design" },
    ],
    summary: "The agency's own website, designed in Figma and being built on the same Next.js + Strapi stack the agency ships for clients.",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find(p => p.slug === slug);
}

export function nextProject(slug: string): Project {
  const i = projects.findIndex(p => p.slug === slug);
  return projects[(i + 1) % projects.length];
}
```

- [ ] **Step 7: Services data**

Create `src/data/services.ts`:

```ts
import type { Service } from "@/data/schemas";

export const services: Service[] = [
  { n: 1, title: "Headless commerce storefronts", tags: ["Next.js", "Medusa"],
    description: "Next.js storefronts on Medusa v2: catalogue, cart, checkout, payments, search and customer accounts, with commerce data owned in one place.",
    chips: ["Next.js", "Medusa v2", "Stripe"],
    includes: ["Storefront, cart and checkout", "Payments, search and accounts", "Deploy, monitoring and handover"],
    timeline: "3–8 weeks" },
  { n: 2, title: "CMS-driven websites", tags: ["Strapi", "Next.js"],
    description: "Strapi content models and dynamic zones with a Next.js front end editors can update the same day, without touching layout or animation.",
    chips: ["Strapi 5", "Next.js", "Dynamic zones"],
    includes: ["Content modelling and editor roles", "Reusable, animated component system", "SEO metadata and previews"],
    timeline: "2–5 weeks" },
  { n: 3, title: "Landing pages that convert", tags: ["Design → code", "Vercel"],
    description: "Figma to production: responsive, fast, SEO basics in place, forms wired to your inbox, deployed on Vercel with analytics.",
    chips: ["Next.js", "Tailwind CSS", "Motion"],
    includes: ["Pixel-faithful build from your design", "Forms, analytics and Open Graph", "Lighthouse 90+ on mobile"],
    timeline: "1–2 weeks" },
  { n: 4, title: "Booking & ordering systems", tags: ["QR", "Reservations"],
    description: "Request booking, QR ordering, table management and payment links, with database-level protection against double bookings.",
    chips: ["PostgreSQL", "Next.js", "Payments"],
    includes: ["Booking or ordering flow and admin view", "Concurrency-safe data model", "Payment and notification integration"],
    timeline: "3–6 weeks" },
  { n: 5, title: "AI-enabled product features", tags: ["Pipelines", "Review loops"],
    description: "Generation pipelines with structured prompts, review steps and cost controls, wired into your product rather than bolted on.",
    chips: ["Node.js", "LLM APIs", "Queues"],
    includes: ["Prompt and output structure", "Review, retry and cost limits", "Product UI for the feature"],
    timeline: "2–4 weeks" },
  { n: 6, title: "Maintenance & iteration", tags: ["Retainer", "CI kept green"],
    description: "Features, fixes, upgrades and deploys on a monthly retainer, with tests and CI kept green so changes stay safe.",
    chips: ["GitHub Actions", "Playwright", "Vercel"],
    includes: ["Monthly feature and fix budget", "Dependency and framework upgrades", "Uptime, backups and incident response"],
    timeline: "ongoing" },
];
```

- [ ] **Step 8: WhatsApp URL builder with tests**

Create `src/lib/whatsapp.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { whatsappUrl } from "@/lib/whatsapp";

describe("whatsappUrl", () => {
  it("builds a wa.me link with encoded text", () => {
    expect(whatsappUrl("+63 915 000 0000", "Hi Josef, let's talk")).toBe("https://wa.me/639150000000?text=Hi%20Josef%2C%20let's%20talk");
  });
  it("rejects numbers outside 8–15 digits", () => {
    expect(() => whatsappUrl("123", "x")).toThrow(/8–15 digits/);
    expect(() => whatsappUrl("", "x")).toThrow();
  });
});
```

Create `src/lib/whatsapp.ts`:

```ts
import { profile } from "@/data/profile";

export function whatsappUrl(number: string, text: string): string {
  const digits = number.replace(/\D/g, "");
  if (!/^\d{8,15}$/.test(digits)) throw new Error("NEXT_PUBLIC_WHATSAPP must be 8–15 digits in E.164 form without the plus sign");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

/** Reads the public env at build time; a missing number fails the build on purpose. */
export function whatsappHref(): string {
  return whatsappUrl(process.env.NEXT_PUBLIC_WHATSAPP ?? "", profile.whatsappPrefill);
}
```

- [ ] **Step 9: Run tests, delete the smoke test, commit**

```bash
rm src/lib/smoke.test.ts
npm test && npm run lint && npm run typecheck
git add -A && git commit -m "feat: typed content data (profile, experience, projects, services) with zod tests"
```

Expected: `schemas.test.ts` 6 passed, `whatsapp.test.ts` 2 passed.

### Task 4: Placeholder images and image config

**Files:**
- Create: `scripts/placeholders.mjs`, `public/images/portrait.jpg`, `public/images/about.jpg`, `public/images/work/<slug>/cover.jpg`, `public/images/work/<slug>/shot-1.jpg`, `public/images/work/<slug>/shot-2.jpg` (four slugs)
- Modify: `next.config.ts`

**Interfaces:**
- Produces: every path referenced in `projects.ts` and `portrait.jpg`/`about.jpg` exists on disk; real assets later replace files by name with no code change.

- [ ] **Step 1: Placeholder generator**

Create `scripts/placeholders.mjs`:

```js
// Generates labelled dark JPEG placeholders for every image the data files reference.
// Real photos and screenshots replace these files by name. Safe to re-run: skips existing files.
import sharp from "sharp";
import { mkdir, access } from "node:fs/promises";
import { dirname } from "node:path";

const items = [
  ["public/images/portrait.jpg", 1200, 1600, "Portrait 3:4"],
  ["public/images/about.jpg", 1200, 1200, "About photo"],
  ...["k-station", "little-legend", "dinecta", "macdevelop"].flatMap(s => [
    [`public/images/work/${s}/cover.jpg`, 1600, 1000, `${s} cover`],
    [`public/images/work/${s}/shot-1.jpg`, 1600, 1000, `${s} shot 1`],
    [`public/images/work/${s}/shot-2.jpg`, 1600, 1000, `${s} shot 2`],
  ]),
];

for (const [file, w, h, label] of items) {
  try { await access(file); console.log("exists", file); continue; } catch {}
  await mkdir(dirname(file), { recursive: true });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <rect width="100%" height="100%" fill="#141416"/>
    <rect x="3%" y="3%" width="94%" height="94%" fill="none" stroke="#2a2a2e" stroke-width="6"/>
    <text x="50%" y="50%" fill="#45F0B4" font-family="Helvetica, Arial, sans-serif" font-size="${Math.round(w / 18)}" text-anchor="middle" dominant-baseline="middle">${label}</text>
  </svg>`;
  await sharp(Buffer.from(svg)).jpeg({ quality: 80 }).toFile(file);
  console.log("wrote", file);
}
```

Run: `npm run placeholders && find public/images -name '*.jpg' | wc -l`
Expected: `14`.

- [ ] **Step 2: Image config**

Replace `next.config.ts`:

```ts
import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  images: { formats: ["image/avif", "image/webp"] },
};

const withMDX = createMDX({ options: { rehypePlugins: ["rehype-slug"] } });

export default withMDX(nextConfig);
```

Create `src/mdx-components.tsx` (required by `@next/mdx`; Task 19 fills it):

```tsx
import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {};

export function useMDXComponents(): MDXComponents {
  return components;
}
```

- [ ] **Step 3: Assert every referenced image exists (test)**

Append to `src/data/schemas.test.ts`:

```ts
import { existsSync } from "node:fs";
import path from "node:path";

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
```

- [ ] **Step 4: Test, build, commit**

```bash
npm test && npm run build
git add -A && git commit -m "feat: placeholder images, image formats, MDX config"
```

### Task 5: GitHub repo, CI workflow, Vercel project (OWNER steps inside)

**Files:**
- Create: `.github/workflows/ci.yml`, `playwright.config.ts`, `e2e/home.spec.ts`

**Interfaces:**
- Produces: `origin` = `github.com/JosefVito/portfolio`; CI job `ci` required on PRs; Vercel preview URL per PR.

- [ ] **Step 1: Playwright config and a first smoke spec**

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL: "http://localhost:3000", trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "phone", use: { ...devices["Pixel 7"] } },
    { name: "reduced-motion", use: { ...devices["Desktop Chrome"], contextOptions: { reducedMotion: "reduce" } } },
  ],
  webServer: {
    command: "npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    env: { CONTACT_DRY_RUN: "1" },
  },
});
```

Create `e2e/home.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("home renders the name", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("Josef Vito");
});
```

Run: `npx playwright install chromium && npm run build && npm run e2e`
Expected: 3 passed (one per project).

- [ ] **Step 2: CI workflow**

Create `.github/workflows/ci.yml`:

```yaml
name: ci
on:
  pull_request:
  push:
    branches: [main]
permissions:
  contents: read
concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true
jobs:
  ci:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    env:
      NEXT_PUBLIC_WHATSAPP: "15550000000"
      NEXT_PUBLIC_SITE_URL: "http://localhost:3000"
      CONTACT_DRY_RUN: "1"
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test
      - run: npm run build
      - run: npx playwright install --with-deps chromium
      - run: npm run e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with: { name: playwright-report, path: playwright-report, retention-days: 7 }
```

Add to `.gitignore`: `playwright-report/`, `test-results/`, `.env.local`.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "ci: lint, typecheck, unit, build and playwright smoke on every PR"
```

- [ ] **Step 4: OWNER — log the CLI into the JosefVito account and create the repo**

In the terminal (the `!` prefix runs it in the Claude session):

```bash
! gh auth login --hostname github.com --web        # choose the JosefVito account in the browser
! gh auth switch --user JosefVito
gh repo create JosefVito/portfolio --public --source . --remote origin --push --description "Freelance portfolio — Next.js, Motion, MDX"
gh run watch --exit-status
```

Expected: repo exists, `main` pushed, first CI run green.

- [ ] **Step 5: OWNER — protect main with the `ci` check**

```bash
gh api -X PUT repos/JosefVito/portfolio/branches/main/protection \
  -f required_status_checks.strict=true -f 'required_status_checks.contexts[]=ci' \
  -F enforce_admins=false -F required_pull_request_reviews=null -F restrictions=null
```

If the API refuses (free plan on a public repo allows this; a private repo would not), skip and rely on the CI badge.

- [ ] **Step 6: OWNER — create the Vercel project**

In the Vercel dashboard: Add New → Project → import `JosefVito/portfolio` → project name `josefvito` → Framework Next.js (auto) → add environment variables for Production and Preview: `RESEND_API_KEY`, `CONTACT_TO`, `NEXT_PUBLIC_WHATSAPP`, `NEXT_PUBLIC_SITE_URL=https://josefvito.vercel.app` → Deploy. Then Analytics → Enable Web Analytics.

Expected: https://josefvito.vercel.app shows the token smoke page.

- [ ] **Step 7: Update HANDOFF.md and commit**

Set `Current phase: 1 — Shell`, `Next task: Task 6`, list Tasks 1–5 with hashes.

```bash
git add HANDOFF.md && git commit -m "docs: handoff after phase 0" && git push
```

---

## Phase 1 — Shell and motion primitives (Tasks 6–10)

Ends with: Lenis smooth scroll, nav with mobile menu, footer, and every reusable animation primitive the sections need, each unit-tested.

### Task 6: Motion variants, `Reveal`, `WordReveal`

**Files:**
- Create: `src/lib/motion.ts`, `src/components/ui/Reveal.tsx`, `src/components/ui/WordReveal.tsx`, `src/components/ui/Reveal.test.tsx`, `src/components/ui/WordReveal.test.tsx`

**Interfaces:**
- Produces: `fadeUp`, `stagger(delay)`, `wordReveal`, `viewportOnce`, `EASE` from `@/lib/motion`; `<Reveal delay? className? as?>` (fade+rise once in view); `<WordReveal text className? delay? accentFrom?>` (per-word clip reveal, words from index `accentFrom` get `text-accent`).

- [ ] **Step 1: Failing tests**

Create `src/components/ui/WordReveal.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WordReveal } from "@/components/ui/WordReveal";

describe("WordReveal", () => {
  it("renders each word in its own span and keeps the full text readable", () => {
    render(<WordReveal text="Built like an operator" />);
    expect(screen.getByText("Built")).toBeInTheDocument();
    expect(screen.getAllByTestId("word")).toHaveLength(4);
    expect(screen.getByLabelText("Built like an operator")).toBeInTheDocument();
  });
  it("colours words from accentFrom with the accent class", () => {
    render(<WordReveal text="shipped like an engineer." accentFrom={2} />);
    expect(screen.getByText("an")).toHaveClass("text-accent");
    expect(screen.getByText("shipped")).not.toHaveClass("text-accent");
  });
});
```

Create `src/components/ui/Reveal.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("motion/react", async (orig) => {
  const m = await orig<typeof import("motion/react")>();
  return { ...m, useReducedMotion: () => true };
});
import { Reveal } from "@/components/ui/Reveal";

describe("Reveal with reduced motion", () => {
  it("renders children visible immediately (no initial hidden state)", () => {
    render(<Reveal><p>Hello</p></Reveal>);
    const el = screen.getByText("Hello").parentElement as HTMLElement;
    expect(el.style.opacity === "" || el.style.opacity === "1").toBe(true);
  });
});
```

Run: `npm test`
Expected: FAIL, modules not found.

- [ ] **Step 2: Variants**

Create `src/lib/motion.ts`:

```ts
import type { Variants } from "motion/react";

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export const stagger = (delay = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: delay, delayChildren } },
});

export const wordReveal: Variants = {
  hidden: { y: "110%" },
  visible: { y: "0%", transition: { duration: 0.8, ease: EASE } },
};

export const viewportOnce = { once: true, amount: 0.3 } as const;
```

- [ ] **Step 3: Reveal**

Create `src/components/ui/Reveal.tsx`:

```tsx
"use client";
import { motion, useReducedMotion } from "motion/react";
import { fadeUp, viewportOnce } from "@/lib/motion";

type Props = { children: React.ReactNode; className?: string; delay?: number; as?: "div" | "section" | "li" | "p" };

export function Reveal({ children, className, delay = 0, as = "div" }: Props) {
  const reduce = useReducedMotion();
  const M = motion[as];
  return (
    <M
      className={className}
      variants={fadeUp}
      initial={reduce ? false : "hidden"}
      whileInView="visible"
      viewport={viewportOnce}
      transition={{ delay }}
    >
      {children}
    </M>
  );
}
```

- [ ] **Step 4: WordReveal**

Create `src/components/ui/WordReveal.tsx`:

```tsx
"use client";
import { motion, useReducedMotion } from "motion/react";
import { stagger, viewportOnce, wordReveal } from "@/lib/motion";

type Props = { text: string; className?: string; delay?: number; accentFrom?: number; as?: "h1" | "h2" | "h3" | "p" | "span" };

export function WordReveal({ text, className, delay = 0, accentFrom, as = "span" }: Props) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const M = motion[as];
  return (
    <M
      aria-label={text}
      className={className}
      variants={stagger(0.06, delay)}
      initial={reduce ? false : "hidden"}
      whileInView="visible"
      viewport={viewportOnce}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom" aria-hidden>
          <motion.span
            data-testid="word"
            variants={wordReveal}
            className={`inline-block will-change-transform${accentFrom !== undefined && i >= accentFrom ? " text-accent" : ""}`}
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </M>
  );
}
```

- [ ] **Step 5: Run, commit**

Run: `npm test`
Expected: 3 new tests pass.

```bash
git add -A && git commit -m "feat: motion variants, Reveal and WordReveal primitives"
```

### Task 7: Pointer-fine gate, `Magnetic`, `TiltCard`

**Files:**
- Create: `src/lib/use-pointer-fine.ts`, `src/components/ui/Magnetic.tsx`, `src/components/ui/TiltCard.tsx`, `src/components/ui/Magnetic.test.tsx`

**Interfaces:**
- Produces: `usePointerFine(): boolean` (true only when `(hover: hover) and (pointer: fine)` and no reduced motion); `<Magnetic strength=6>` wraps one child; `<TiltCard max=6 className>` wraps content and tilts on pointer.

- [ ] **Step 1: Failing test**

Create `src/components/ui/Magnetic.test.tsx`:

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Magnetic } from "@/components/ui/Magnetic";

describe("Magnetic on a coarse pointer (jsdom matchMedia is false)", () => {
  it("renders the child and does not move it", () => {
    render(<Magnetic><button>Hire me</button></Magnetic>);
    const wrap = screen.getByText("Hire me").parentElement as HTMLElement;
    fireEvent.mouseMove(wrap, { clientX: 40, clientY: 10 });
    expect(wrap.style.transform === "" || wrap.style.transform === "none").toBe(true);
  });
});
```

Run: `npm test -- Magnetic`
Expected: FAIL, module not found.

- [ ] **Step 2: Pointer gate hook**

Create `src/lib/use-pointer-fine.ts`:

```ts
"use client";
import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

export function usePointerFine(): boolean {
  const reduce = useReducedMotion();
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return fine && !reduce;
}
```

- [ ] **Step 3: Magnetic**

Create `src/components/ui/Magnetic.tsx`:

```tsx
"use client";
import { motion, useMotionValue, useSpring } from "motion/react";
import { usePointerFine } from "@/lib/use-pointer-fine";

export function Magnetic({ children, strength = 6, className }: { children: React.ReactNode; strength?: number; className?: string }) {
  const fine = usePointerFine();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 300, damping: 20, mass: 0.4 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!fine) return;
    const r = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    x.set(Math.max(-1, Math.min(1, dx)) * strength);
    y.set(Math.max(-1, Math.min(1, dy)) * strength);
  }
  function onLeave() { x.set(0); y.set(0); }

  return (
    <motion.div className={`inline-block ${className ?? ""}`} style={fine ? { x: sx, y: sy } : undefined} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 4: TiltCard**

Create `src/components/ui/TiltCard.tsx`:

```tsx
"use client";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { usePointerFine } from "@/lib/use-pointer-fine";

export function TiltCard({ children, max = 6, className }: { children: React.ReactNode; max?: number; className?: string }) {
  const fine = usePointerFine();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 200, damping: 20 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!fine) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  }
  function onLeave() { px.set(0.5); py.set(0.5); }

  return (
    <motion.div
      className={className}
      style={fine ? { rotateX: rx, rotateY: ry, transformPerspective: 900, transformStyle: "preserve-3d" } : undefined}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 5: Run, commit**

Run: `npm test`
Expected: Magnetic test passes.

```bash
git add -A && git commit -m "feat: pointer-fine gate, Magnetic and TiltCard primitives"
```

### Task 8: `Marquee` and `Counter`

**Files:**
- Create: `src/components/ui/Marquee.tsx`, `src/components/ui/Counter.tsx`, `src/components/ui/Counter.test.tsx`, `src/lib/format.ts`, `src/lib/format.test.ts`

**Interfaces:**
- Produces: `<Marquee word="ABOUT" className? position="top|bottom">` outlined background loop; `<Counter value suffix label>`; `formatStat(v: number, target: number): string` (`2.5` → one decimal, integers → no decimal).

- [ ] **Step 1: Failing tests**

Create `src/lib/format.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { formatStat } from "@/lib/format";

describe("formatStat", () => {
  it("keeps one decimal when the target has one", () => {
    expect(formatStat(1.26, 2.5)).toBe("1.3");
    expect(formatStat(2.5, 2.5)).toBe("2.5");
  });
  it("rounds to integers when the target is whole", () => {
    expect(formatStat(4.6, 5)).toBe("5");
    expect(formatStat(0, 3)).toBe("0");
  });
});
```

Create `src/components/ui/Counter.test.tsx`:

```tsx
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
```

Run: `npm test`
Expected: FAIL, modules not found.

- [ ] **Step 2: format helper**

Create `src/lib/format.ts`:

```ts
export function formatStat(v: number, target: number): string {
  return Number.isInteger(target) ? String(Math.round(v)) : v.toFixed(1);
}
```

- [ ] **Step 3: Counter**

Create `src/components/ui/Counter.tsx`:

```tsx
"use client";
import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { formatStat } from "@/lib/format";

export function Counter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  const [text, setText] = useState(reduce ? formatStat(value, value) : "0");

  useEffect(() => {
    if (!inView) return;
    if (reduce) { setText(formatStat(value, value)); return; }
    const controls = animate(0, value, { duration: 1.2, ease: "easeOut", onUpdate: v => setText(formatStat(v, value)) });
    return () => controls.stop();
  }, [inView, reduce, value]);

  return (
    <div ref={ref}>
      <div className="display text-[clamp(32px,4vw,48px)] font-bold tabular-nums">
        <span data-testid="counter-value">{text}</span>
        {suffix && <span className="text-accent">{suffix}</span>}
      </div>
      <div className="label text-muted mt-1">{label}</div>
    </div>
  );
}
```

- [ ] **Step 4: Marquee**

Create `src/components/ui/Marquee.tsx` (speed follows Lenis velocity; falls back to constant speed when Lenis is absent, for example on touch):

```tsx
"use client";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useLenis } from "lenis/react";
import { useRef } from "react";

export function Marquee({ word, position = "top", className = "" }: { word: string; position?: "top" | "bottom"; className?: string }) {
  const reduce = useReducedMotion();
  const base = useMotionValue(0);
  const velocity = useRef(0);
  useLenis(l => { velocity.current = l.velocity; });

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const speed = 40 + Math.min(Math.abs(velocity.current), 40) * 4; // px per second
    base.set((base.get() - (speed * delta) / 1000) % 10000);
  });
  const x = useTransform(base, v => `${v % 50}%`); // ponytail: two copies of the word row; wrap at half width

  const row = Array.from({ length: 4 }, () => word).join(" ");
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-x-0 overflow-hidden select-none ${position === "top" ? "top-[10%]" : "bottom-[-4%]"} ${className}`}>
      <motion.div className="marquee-track display text-outline text-[clamp(120px,22vw,320px)] font-bold" style={{ x }}>
        <span className="pr-[1em]">{row}</span>
        <span className="pr-[1em]">{row}</span>
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 5: Run, commit**

Run: `npm test`
Expected: format 2 passed, Counter 1 passed.

```bash
git add -A && git commit -m "feat: Marquee (Lenis-velocity aware) and Counter primitives"
```

### Task 9: Smooth scroll provider, Nav, mobile menu

**Files:**
- Create: `src/components/layout/SmoothScroll.tsx`, `src/components/layout/Nav.tsx`, `src/components/layout/MobileMenu.tsx`, `src/components/layout/nav-links.ts`, `src/components/layout/Nav.test.tsx`, `src/components/ui/Logo.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Produces: `NAV_LINKS`, `hrefFor(link, pathname)` (prefixes `/` off the home page); `<Nav />` (client, floating pill, hide-on-scroll-down, active section dot, burger under `md`); `<SmoothScroll />` mounted once in the root layout; `<Logo />`.

- [ ] **Step 1: Failing tests**

Create `src/components/layout/Nav.test.tsx`:

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({ usePathname: () => "/work/k-station" }));
import { Nav } from "@/components/layout/Nav";
import { hrefFor, NAV_LINKS } from "@/components/layout/nav-links";

describe("nav links", () => {
  it("anchors stay bare on the home page and get a slash elsewhere", () => {
    expect(hrefFor(NAV_LINKS[0], "/")).toBe("#work");
    expect(hrefFor(NAV_LINKS[0], "/work/k-station")).toBe("/#work");
  });
});

describe("Nav on a case-study page", () => {
  it("shows All work, opens and closes the mobile menu with Escape, and restores body scroll", () => {
    render(<Nav />);
    expect(screen.getByText("All work")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Open menu"));
    expect(document.body.style.overflow).toBe("hidden");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(document.body.style.overflow).toBe("");
  });
});
```

Run: `npm test -- Nav`
Expected: FAIL, modules not found.

- [ ] **Step 2: Links helper and Logo**

Create `src/components/layout/nav-links.ts`:

```ts
export type NavLink = { href: `#${string}`; label: string };
export const NAV_LINKS: NavLink[] = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact" },
];
export function hrefFor(link: NavLink, pathname: string): string {
  return pathname === "/" ? link.href : `/${link.href}`;
}
```

Create `src/components/ui/Logo.tsx`:

```tsx
import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" aria-label="Josef Vito — home" className={`display inline-flex items-center gap-2 text-[15px] font-bold tracking-tight ${className}`}>
      <span className="size-2 rounded-full bg-accent shadow-[0_0_10px_var(--color-accent-glow)]" aria-hidden />
      JV
    </Link>
  );
}
```

- [ ] **Step 3: SmoothScroll**

Create `src/components/layout/SmoothScroll.tsx`:

```tsx
"use client";
import { ReactLenis } from "lenis/react";

// Touch falls through to native scrolling (syncTouch is off by default). Anchors offset for the floating nav.
export function SmoothScroll() {
  return <ReactLenis root options={{ duration: 1.1, anchors: { offset: -96 } }} />;
}
```

- [ ] **Step 4: MobileMenu**

Create `src/components/layout/MobileMenu.tsx`:

```tsx
"use client";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect } from "react";
import { hrefFor, NAV_LINKS } from "@/components/layout/nav-links";
import { EASE } from "@/lib/motion";
import { profile } from "@/data/profile";
import { whatsappHref } from "@/lib/whatsapp";

export function MobileMenu({ open, onClose, pathname }: { open: boolean; onClose: () => void; pathname: string }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener("keydown", onKey); };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog" aria-modal="true" aria-label="Menu"
          className="fixed inset-0 z-40 flex flex-col justify-between bg-bg/95 px-6 pb-8 pt-24 backdrop-blur-md"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25, ease: EASE }}
        >
          <ul className="flex flex-col gap-2">
            {NAV_LINKS.map((l, i) => (
              <motion.li key={l.href} initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 * i, ease: EASE }}>
                <Link href={hrefFor(l, pathname)} onClick={onClose} className="display block py-3 text-[clamp(40px,10vw,64px)] font-bold">{l.label}</Link>
              </motion.li>
            ))}
          </ul>
          <div className="flex flex-col gap-4">
            <a href={whatsappHref()} target="_blank" rel="noreferrer" className="rounded-full bg-accent px-6 py-4 text-center font-medium text-accent-ink">Chat on WhatsApp</a>
            <div className="flex gap-6 label text-muted">
              <a href={profile.socials.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
              <a href={profile.socials.github} target="_blank" rel="noreferrer">GitHub</a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 5: Nav**

Create `src/components/layout/Nav.tsx`:

```tsx
"use client";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { hrefFor, NAV_LINKS } from "@/components/layout/nav-links";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Logo } from "@/components/ui/Logo";
import { Magnetic } from "@/components/ui/Magnetic";
import { EASE } from "@/lib/motion";

export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > last && y > 80 && !open);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  useEffect(() => {
    if (!isHome) return;
    const sections = NAV_LINKS.map(l => document.getElementById(l.href.slice(1))).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(`#${e.target.id}`); });
    }, { threshold: 0.5 });
    sections.forEach(s => io.observe(s));
    return () => io.disconnect();
  }, [isHome]);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-6 z-50 flex justify-center px-4"
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: hidden ? -96 : 0, opacity: hidden ? 0 : 1 }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <nav aria-label="Primary" className="flex items-center gap-1 rounded-full border border-line bg-bg/70 py-1.5 pl-4 pr-1.5 backdrop-blur-md">
          <Logo className="mr-3" />
          {!isHome && <Link href="/#work" className="hidden md:inline px-3 py-1.5 text-sm text-muted hover:text-fg">All work</Link>}
          <ul className="hidden md:flex items-center">
            {NAV_LINKS.map(l => (
              <li key={l.href}>
                <Link href={hrefFor(l, pathname)} className="relative px-3 py-1.5 text-sm text-muted transition-colors hover:text-fg" aria-current={active === l.href ? "location" : undefined}>
                  {active === l.href && <span aria-hidden className="absolute left-0.5 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-accent" />}
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Magnetic className="hidden md:inline-block ml-1">
            <Link href={isHome ? "#contact" : "/#contact"} className="inline-flex rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-ink shadow-[0_8px_24px_-8px_var(--color-accent-glow)]">Hire me</Link>
          </Magnetic>
          <button type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(o => !o)} className="md:hidden ml-1 inline-flex size-9 items-center justify-center rounded-full border border-line">
            <span aria-hidden className="relative block h-[2px] w-4 bg-fg before:absolute before:-top-1.5 before:h-[2px] before:w-4 before:bg-fg after:absolute after:top-1.5 after:h-[2px] after:w-4 after:bg-fg" />
          </button>
        </nav>
      </motion.header>
      <MobileMenu open={open} onClose={close} pathname={pathname} />
    </>
  );
}
```

- [ ] **Step 6: Mount in layout**

Modify `src/app/layout.tsx` body to:

```tsx
<body className="bg-bg text-fg font-body">
  <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink">Skip to content</a>
  <SmoothScroll />
  <Nav />
  {children}
</body>
```

with imports `import { SmoothScroll } from "@/components/layout/SmoothScroll"; import { Nav } from "@/components/layout/Nav";`. Give the `<main>` in `page.tsx` `id="main"` and `className="container-x section pt-40"` so content clears the nav.

- [ ] **Step 7: Run, look, commit**

Run: `npm test && npm run build && npm run dev`
Open http://localhost:3000, resize under 768px, open the menu, press Escape. Expected: pill nav floats, hides on scroll down, burger menu works. Stop the server.

```bash
git add -A && git commit -m "feat: Lenis smooth scroll, floating nav with active dot and mobile menu"
```

### Task 10: Footer and small UI primitives

**Files:**
- Create: `src/components/layout/Footer.tsx`, `src/components/ui/LocalTime.tsx`, `src/components/ui/CopyButton.tsx`, `src/components/ui/Eyebrow.tsx`, `src/components/ui/SectionHeading.tsx`, `src/components/ui/Chip.tsx`, `src/components/ui/Button.tsx`, `src/components/ui/CopyButton.test.tsx`, `src/components/ui/LocalTime.test.tsx`, `src/lib/time.ts`, `src/lib/time.test.ts`

**Interfaces:**
- Produces: `<Footer />`; `<LocalTime timeZone />`; `formatLocalTime(date, timeZone): string` ("14:05"); `<CopyButton text label?>`; `<Eyebrow n? text>` (mono accent "— text · 0n / 06"); `<SectionHeading lead accent as?>`; `<Chip>`; `<Button variant="primary|ghost" href>` (magnetic on fine pointers).

- [ ] **Step 1: Failing tests**

Create `src/lib/time.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { formatLocalTime } from "@/lib/time";

describe("formatLocalTime", () => {
  it("formats HH:mm in the given zone", () => {
    expect(formatLocalTime(new Date("2026-09-30T06:05:00Z"), "Asia/Manila")).toBe("14:05");
  });
});
```

Create `src/components/ui/CopyButton.test.tsx`:

```tsx
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
```

Create `src/components/ui/LocalTime.test.tsx`:

```tsx
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LocalTime } from "@/components/ui/LocalTime";

describe("LocalTime", () => {
  it("renders a HH:mm clock after mount", async () => {
    render(<LocalTime timeZone="Asia/Manila" />);
    await waitFor(() => expect(screen.getByTestId("local-time").textContent).toMatch(/^\d{2}:\d{2}$/));
  });
});
```

Run: `npm test`
Expected: FAIL, modules not found.

- [ ] **Step 2: Implement time, LocalTime, CopyButton**

Create `src/lib/time.ts`:

```ts
export function formatLocalTime(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", hour12: false }).format(date);
}
```

Create `src/components/ui/LocalTime.tsx`:

```tsx
"use client";
import { useEffect, useState } from "react";
import { formatLocalTime } from "@/lib/time";

export function LocalTime({ timeZone }: { timeZone: string }) {
  const [t, setT] = useState<string>("");
  useEffect(() => {
    const tick = () => setT(formatLocalTime(new Date(), timeZone));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [timeZone]);
  return <span data-testid="local-time" className="tabular-nums">{t}</span>;
}
```

Create `src/components/ui/CopyButton.tsx`:

```tsx
"use client";
import { useState } from "react";

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  async function copy() {
    try { await navigator.clipboard.writeText(text); } catch { window.getSelection()?.selectAllChildren(document.body); }
    setDone(true);
    setTimeout(() => setDone(false), 1500);
  }
  return (
    <button type="button" onClick={copy} className="label rounded-md border border-line px-2 py-1 text-muted hover:text-fg" aria-live="polite">
      {done ? "Copied" : label}
    </button>
  );
}
```

- [ ] **Step 3: Eyebrow, SectionHeading, Chip, Button**

Create `src/components/ui/Eyebrow.tsx`:

```tsx
export function Eyebrow({ text, n, total = 6, className = "" }: { text: string; n?: number; total?: number; className?: string }) {
  return (
    <p className={`label text-accent ${className}`}>
      <span aria-hidden className="mr-3 inline-block h-px w-6 bg-accent align-middle" />
      {text}{n !== undefined && <span className="text-muted"> · {String(n).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>}
    </p>
  );
}
```

Create `src/components/ui/SectionHeading.tsx`:

```tsx
import { WordReveal } from "@/components/ui/WordReveal";

export function SectionHeading({ lead, accent, className = "" }: { lead: string; accent: string; className?: string }) {
  const leadWords = lead.split(" ").length;
  return (
    <WordReveal as="h2" text={`${lead} ${accent}`} accentFrom={leadWords} className={`display mt-4 text-[clamp(32px,4.5vw,56px)] font-bold ${className}`} />
  );
}
```

Create `src/components/ui/Chip.tsx`:

```tsx
export function Chip({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span className={`label inline-block rounded-md border px-2 py-1 text-[10px] tracking-[0.08em] ${accent ? "border-accent text-accent" : "border-line text-muted"}`}>
      {children}
    </span>
  );
}
```

Create `src/components/ui/Button.tsx`:

```tsx
import Link from "next/link";
import { Magnetic } from "@/components/ui/Magnetic";

type Props = { href: string; children: React.ReactNode; variant?: "primary" | "ghost"; external?: boolean; className?: string };

export function Button({ href, children, variant = "primary", external, className = "" }: Props) {
  const base = "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium transition-colors";
  const look = variant === "primary"
    ? "bg-accent text-accent-ink shadow-[0_12px_32px_-12px_var(--color-accent-glow)] hover:brightness-110"
    : "border border-line text-fg hover:bg-surface-hover";
  const cls = `${base} ${look} ${className}`;
  const el = external
    ? <a href={href} target="_blank" rel="noreferrer" className={cls}>{children}</a>
    : <Link href={href} className={cls}>{children}</Link>;
  return <Magnetic>{el}</Magnetic>;
}
```

- [ ] **Step 4: Footer**

Create `src/components/layout/Footer.tsx`:

```tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import { hrefFor, NAV_LINKS } from "@/components/layout/nav-links";
import { Logo } from "@/components/ui/Logo";
import { LocalTime } from "@/components/ui/LocalTime";
import { profile } from "@/data/profile";

export function Footer() {
  const pathname = usePathname();
  const lenis = useLenis();
  return (
    <footer className="container-x border-t border-line py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Logo />
        <ul className="flex flex-wrap gap-4 label text-muted">
          {NAV_LINKS.map(l => <li key={l.href}><Link href={hrefFor(l, pathname)} className="hover:text-fg">{l.label}</Link></li>)}
        </ul>
        <p className="label text-muted">
          © {new Date().getFullYear()} {profile.firstName} {profile.lastName} · {profile.city.split(" · ")[0]} · <LocalTime timeZone={profile.timeZone} /> · Built with Next.js
        </p>
        <button type="button" onClick={() => (lenis ? lenis.scrollTo(0) : window.scrollTo({ top: 0 }))} className="label rounded-full border border-line px-3 py-2 text-muted hover:text-fg">↑ Top</button>
      </div>
    </footer>
  );
}
```

- [ ] **Step 5: Run, commit**

Run: `npm test && npm run lint && npm run typecheck`
Expected: all green.

```bash
git add -A && git commit -m "feat: footer, local time, copy button, eyebrow, heading, chip, button primitives"
```

Update `HANDOFF.md`: phase 2, next Task 11. Commit and push.

---

## Phase 2 — Home sections (Tasks 11–18)

Ends with: the complete home page assembled and smoke-tested, contact form sending email.

### Task 11: Hero

**Files:**
- Create: `src/components/sections/Hero.tsx`, `src/components/sections/Hero.test.tsx`

**Interfaces:**
- Consumes: `profile`, `whatsappHref()`, `WordReveal`, `Button`, `TiltCard`, `EASE`.
- Produces: `<Hero />` server component with client islands; `id="hero"`.

- [ ] **Step 1: Failing test**

Create `src/components/sections/Hero.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import { Hero } from "@/components/sections/Hero";

beforeAll(() => { process.env.NEXT_PUBLIC_WHATSAPP = "15550000000"; });

describe("Hero", () => {
  it("shows the name, both CTAs and the WhatsApp link", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveAccessibleName(/Josef Vito Evangelista/);
    expect(screen.getByRole("link", { name: /chat on whatsapp/i })).toHaveAttribute("href", expect.stringContaining("wa.me/15550000000"));
    expect(screen.getByRole("link", { name: /view work/i })).toHaveAttribute("href", "#work");
    expect(screen.getByAltText(/Josef Vito/)).toBeInTheDocument();
  });
});
```

Run: `npm test -- Hero`
Expected: FAIL, module not found.

- [ ] **Step 2: Hero**

Create `src/components/sections/Hero.tsx`:

```tsx
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { TiltCard } from "@/components/ui/TiltCard";
import { WordReveal } from "@/components/ui/WordReveal";
import { Reveal } from "@/components/ui/Reveal";
import { profile } from "@/data/profile";
import { whatsappHref } from "@/lib/whatsapp";

function Social({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" aria-label={label} className="inline-flex size-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-fg hover:text-fg">
      {children}
    </a>
  );
}

export function Hero() {
  return (
    <section id="hero" className="container-x relative min-h-[100svh] pt-32 pb-16 lg:pt-40">
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr_1.1fr]">
        <div className="order-2 lg:order-1">
          <Reveal delay={0.1}>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-sm">
              <span aria-hidden className="size-2 rounded-full bg-accent shadow-[0_0_10px_var(--color-accent-glow)] motion-safe:animate-pulse" />
              {profile.availability}
            </span>
          </Reveal>
          <p className="label mt-8 text-muted">— I'm</p>
          <h1 aria-label={`${profile.firstName} ${profile.lastName}`} className="display mt-2 text-[clamp(48px,8vw,112px)] font-bold">
            <WordReveal text={profile.firstName} accentFrom={0} delay={0.2} className="block" />
            <WordReveal text={profile.lastName} delay={0.35} className="block font-semibold" />
          </h1>
          <Reveal delay={0.7} className="mt-8 flex flex-wrap gap-3">
            <Button href={whatsappHref()} external>Chat on WhatsApp</Button>
            <Button href="#work" variant="ghost">View work</Button>
          </Reveal>
          <Reveal delay={0.85} className="mt-6 flex gap-3">
            <Social href={profile.socials.linkedin} label="LinkedIn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.2 8h4.6v14H.2V8zm7.6 0h4.4v1.9h.1c.6-1.1 2.1-2.3 4.3-2.3 4.6 0 5.4 3 5.4 6.9V22h-4.6v-6.7c0-1.6 0-3.7-2.2-3.7s-2.6 1.7-2.6 3.6V22H7.8V8z"/></svg>
            </Social>
            <Social href={profile.socials.github} label="GitHub">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2.9-.3 1.9-.4 2.9-.4s2 .1 2.9.4c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z"/></svg>
            </Social>
          </Reveal>
          <p className="label mt-8 text-muted">{profile.location}</p>
        </div>

        <div className="order-1 lg:order-2">
          <Reveal delay={0.3}>
            <TiltCard className="relative mx-auto aspect-[3/4] w-full max-w-[420px]">
              <div aria-hidden className="absolute inset-x-8 -bottom-6 h-24 rounded-full bg-accent-glow blur-3xl" />
              <Image
                src="/images/portrait.jpg"
                alt={`${profile.firstName} ${profile.lastName}, full-stack developer`}
                width={1200} height={1600} priority
                sizes="(min-width: 1024px) 30vw, 80vw"
                className="relative h-full w-full rounded-[20px] object-cover"
              />
            </TiltCard>
          </Reveal>
        </div>

        <div className="order-3 lg:text-right">
          <h2 className="display text-[clamp(36px,5.5vw,80px)] font-bold">
            <WordReveal text={profile.title} delay={0.5} className="block" />
            <span className="text-outline block transition-colors hover:text-fg">{profile.titleOutline}</span>
          </h2>
          <p className="label mt-4 text-accent">{profile.tagline}</p>
          <Reveal delay={0.9}><p className="mt-4 max-w-[36ch] text-muted lg:ml-auto">{profile.intro}</p></Reveal>
          <p className="label mt-12 text-muted motion-safe:animate-bounce lg:mt-24">Scroll ↓ · 01 / 06</p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Run, commit**

Run: `npm test -- Hero`
Expected: PASS.

```bash
git add -A && git commit -m "feat(home): hero with word reveal, tilt portrait and magnetic CTAs"
```

### Task 12: About

**Files:**
- Create: `src/components/sections/About.tsx`, `src/components/sections/About.test.tsx`

**Interfaces:**
- Consumes: `profile`, `Marquee`, `Eyebrow`, `SectionHeading`, `Counter`, `Chip`, `Reveal`.
- Produces: `<About />` with `id="about"`.

- [ ] **Step 1: Failing test**

Create `src/components/sections/About.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { About } from "@/components/sections/About";

describe("About", () => {
  it("renders headline, three stats and the core stack", () => {
    render(<About />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveAccessibleName("Built like an operator, shipped like an engineer.");
    expect(screen.getByText("production projects")).toBeInTheDocument();
    expect(screen.getByText("yrs running businesses")).toBeInTheDocument();
    expect(screen.getByText("Medusa v2")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: About**

Create `src/components/sections/About.tsx`:

```tsx
import Image from "next/image";
import { Chip } from "@/components/ui/Chip";
import { Counter } from "@/components/ui/Counter";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { profile } from "@/data/profile";

export function About() {
  return (
    <section id="about" className="section overflow-hidden">
      <Marquee word="ABOUT" position="top" />
      <div className="container-x relative grid items-center gap-12 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <Eyebrow text="About me" n={2} />
          <SectionHeading lead={profile.aboutHeadline.lead} accent={profile.aboutHeadline.accent} />
          <Reveal delay={0.2}><p className="mt-6 max-w-[60ch] text-muted">{profile.bio}</p></Reveal>
          <div className="mt-10 grid grid-cols-3 gap-6 max-w-[520px]">
            {profile.stats.map(s => <Counter key={s.label} value={s.value} suffix={s.suffix} label={s.label} />)}
          </div>
          <Reveal delay={0.3} className="mt-10">
            <p className="label text-muted mb-3">Core stack</p>
            <ul className="flex flex-wrap gap-2">
              {profile.stack.map(t => <li key={t}><Chip>{t}</Chip></li>)}
            </ul>
          </Reveal>
        </div>
        <Reveal delay={0.2} className="relative mx-auto w-full max-w-[420px]">
          <Image src="/images/about.jpg" alt={`${profile.firstName} at work`} width={1200} height={1200} sizes="(min-width: 1024px) 28vw, 80vw" className="aspect-square w-full rounded-[20px] object-cover" />
          <span className="absolute left-4 bottom-4 inline-flex items-center gap-2 rounded-full border border-line bg-bg/80 px-3 py-1.5 text-xs backdrop-blur"><span aria-hidden className="size-1.5 rounded-full bg-accent" />Available for work</span>
          <span className="absolute right-4 top-4 rounded-full border border-line bg-bg/80 px-3 py-1.5 text-xs backdrop-blur">{profile.city}</span>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Run, commit**

Run: `npm test -- About` → PASS.

```bash
git add -A && git commit -m "feat(home): about section with counters, core stack and marquee"
```

### Task 13: Experience timeline

**Files:**
- Create: `src/components/sections/Experience.tsx`, `src/components/sections/ExperienceList.tsx`, `src/components/sections/Experience.test.tsx`

**Interfaces:**
- Consumes: `experience`, `Eyebrow`, `SectionHeading`, `Chip`, `EASE`.
- Produces: `<Experience />` with `id="experience"`; `<ExperienceList stops>` client island holding active state.

- [ ] **Step 1: Failing test**

Create `src/components/sections/Experience.test.tsx`:

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ExperienceList } from "@/components/sections/ExperienceList";
import { experience } from "@/data/experience";

describe("ExperienceList", () => {
  it("starts with the first stop active and switches on hover", () => {
    render(<ExperienceList stops={experience} />);
    const card = screen.getByTestId("detail-card");
    expect(card).toHaveTextContent("MacDevelop");
    expect(card).toHaveTextContent("01 / 04");
    fireEvent.mouseEnter(screen.getByRole("button", { name: /Owner & General Manager/ }));
    expect(card).toHaveTextContent("Vito Cafe");
    expect(card).toHaveTextContent("04 / 04");
  });
  it("expands a stop inline on click (phone accordion)", () => {
    render(<ExperienceList stops={experience} />);
    fireEvent.click(screen.getByRole("button", { name: /Cafe & Community Manager/ }));
    expect(screen.getByRole("button", { name: /Cafe & Community Manager/ })).toHaveAttribute("aria-expanded", "true");
  });
});
```

Run: `npm test -- Experience` → FAIL.

- [ ] **Step 2: ExperienceList (client)**

Create `src/components/sections/ExperienceList.tsx`:

```tsx
"use client";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { Chip } from "@/components/ui/Chip";
import type { Stop } from "@/data/schemas";
import { EASE } from "@/lib/motion";

function Detail({ s, i, total }: { s: Stop; i: number; total: number }) {
  return (
    <>
      <div className="flex justify-between label text-muted">
        <span>{s.dates} · {s.location}</span>
        <span className="text-accent">{String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
      </div>
      <p className="label mt-6 text-muted">{s.role}</p>
      <p className="display mt-1 text-[clamp(24px,3vw,36px)] font-bold">{s.company}</p>
      <p className="mt-3 text-muted">{s.summary}</p>
      <p className="label mt-6 text-muted">Highlights</p>
      <ul className="mt-2 space-y-2 text-sm">
        {s.highlights.map(h => <li key={h} className="flex gap-3"><span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />{h}</li>)}
      </ul>
      <ul className="mt-6 flex flex-wrap gap-2">{s.stack.map(t => <li key={t}><Chip>{t}</Chip></li>)}</ul>
    </>
  );
}

export function ExperienceList({ stops }: { stops: Stop[] }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 80%", "end 60%"] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
      <ol ref={listRef} className="relative">
        <motion.span aria-hidden className="absolute left-[76px] top-2 bottom-2 w-px origin-top bg-accent/60" style={{ scaleY }} />
        <span aria-hidden className="absolute left-[76px] top-2 bottom-2 w-px bg-line" />
        {stops.map((s, i) => {
          const isActive = active === i;
          const isOpen = open === i;
          return (
            <li key={s.id} className="grid grid-cols-[60px_1fr] gap-x-6">
              <span className="label pt-3 text-right text-muted">{s.yearLabel}</span>
              <div className="relative pb-8 pl-8">
                <span aria-hidden className={`absolute left-[-3px] top-4 size-[7px] rounded-full transition-all ${isActive ? "bg-accent shadow-[0_0_10px_var(--color-accent-glow)]" : "bg-line"}`} />
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`stop-${s.id}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => { setActive(i); setOpen(isOpen ? null : i); }}
                  className="block w-full text-left"
                >
                  <span className={`display block text-lg font-bold transition-transform ${isActive ? "translate-x-1" : ""}`}>{s.role}</span>
                  <span className="block text-sm text-muted">{s.company} · {s.location}</span>
                  <Chip>{s.type}</Chip>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div id={`stop-${s.id}`} className="overflow-hidden lg:hidden" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: EASE }}>
                      <div className="card mt-4 p-5"><Detail s={s} i={i} total={stops.length} /></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </li>
          );
        })}
      </ol>
      <div className="hidden lg:block">
        <div data-testid="detail-card" className="card sticky top-32 p-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={stops[active].id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, ease: EASE }}>
              <Detail s={stops[active]} i={active} total={stops.length} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Experience section wrapper**

Create `src/components/sections/Experience.tsx`:

```tsx
import { ExperienceList } from "@/components/sections/ExperienceList";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { experience } from "@/data/experience";

export function Experience() {
  return (
    <section id="experience" className="section">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow text="Experience" n={3} />
            <SectionHeading lead="From running a cafe to shipping" accent="commerce platforms." />
          </div>
          <div className="text-right">
            <p className="display text-2xl font-bold">{String(experience.length).padStart(2, "0")} <span className="label text-muted">stops</span></p>
            <p className="label text-muted">2023 → now</p>
          </div>
        </div>
        <div className="mt-14"><ExperienceList stops={experience} /></div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run, commit**

Run: `npm test -- Experience` → 2 passed.

```bash
git add -A && git commit -m "feat(home): experience timeline with sticky detail card and phone accordion"
```

### Task 14: Selected work track

**Files:**
- Create: `src/components/work/ProjectCard.tsx`, `src/components/work/ProjectTrack.tsx`, `src/components/sections/Work.tsx`, `src/lib/track.ts`, `src/lib/track.test.ts`

**Interfaces:**
- Consumes: `projects`, `TiltCard`, `Chip`, `Marquee`, `Eyebrow`, `SectionHeading`.
- Produces: `trackProgress(scrollLeft, scrollWidth, clientWidth, count): { ratio: number; index: number }`; `<ProjectCard project>`; `<ProjectTrack projects>` (client); `<Work />` with `id="work"`.

- [ ] **Step 1: Failing test**

Create `src/lib/track.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { trackProgress } from "@/lib/track";

describe("trackProgress", () => {
  it("maps scroll position to a 0..1 ratio and a card index", () => {
    expect(trackProgress(0, 2000, 800, 4)).toEqual({ ratio: 0, index: 0 });
    expect(trackProgress(1200, 2000, 800, 4)).toEqual({ ratio: 1, index: 3 });
    expect(trackProgress(400, 2000, 800, 4)).toEqual({ ratio: 1 / 3, index: 1 });
  });
  it("never divides by zero when everything fits", () => {
    expect(trackProgress(0, 800, 800, 4)).toEqual({ ratio: 0, index: 0 });
  });
});
```

Run: `npm test -- track` → FAIL.

- [ ] **Step 2: track helper**

Create `src/lib/track.ts`:

```ts
export function trackProgress(scrollLeft: number, scrollWidth: number, clientWidth: number, count: number) {
  const max = scrollWidth - clientWidth;
  const ratio = max <= 0 ? 0 : Math.min(1, Math.max(0, scrollLeft / max));
  const index = Math.round(ratio * (count - 1));
  return { ratio, index };
}
```

- [ ] **Step 3: ProjectCard**

Create `src/components/work/ProjectCard.tsx`:

```tsx
import Image from "next/image";
import Link from "next/link";
import { Chip } from "@/components/ui/Chip";
import { TiltCard } from "@/components/ui/TiltCard";
import type { Project } from "@/data/schemas";

export function ProjectCard({ project: p, total }: { project: Project; total: number }) {
  return (
    <li className="w-[78vw] shrink-0 snap-start sm:w-[420px]">
      <TiltCard max={4} className="h-full">
        <Link href={`/work/${p.slug}`} className="group card block h-full p-3 transition-colors hover:bg-surface-hover">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[10px]">
            <Image src={p.cover} alt={`${p.title} cover`} fill sizes="(min-width: 640px) 420px, 78vw" className="object-cover transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-3 group-hover:scale-[1.03]" />
            {p.status === "in-progress" && <span className="absolute left-3 top-3"><Chip accent>In progress</Chip></span>}
            <span className="absolute bottom-3 left-3 rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-accent-ink transition-transform group-hover:-translate-y-1">View case study →</span>
            <span className="absolute bottom-3 right-3"><Chip>{p.type}</Chip></span>
          </div>
          <div className="flex justify-between label mt-4 text-muted"><span>{String(p.n).padStart(2, "0")} / {String(total).padStart(2, "0")}</span><span>{p.year}</span></div>
          <h3 className="display mt-2 text-2xl font-bold">{p.title}</h3>
          <p className="mt-2 text-sm text-muted">{p.blurb}</p>
          <ul className="mt-4 flex flex-wrap gap-2">{p.chips.map(c => <li key={c}><Chip>{c}</Chip></li>)}</ul>
        </Link>
      </TiltCard>
    </li>
  );
}
```

- [ ] **Step 4: ProjectTrack (client)**

Create `src/components/work/ProjectTrack.tsx`:

```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { ProjectCard } from "@/components/work/ProjectCard";
import type { Project } from "@/data/schemas";
import { trackProgress } from "@/lib/track";

export function ProjectTrack({ projects }: { projects: Project[] }) {
  const ref = useRef<HTMLUListElement>(null);
  const [{ ratio, index }, setP] = useState({ ratio: 0, index: 0 });

  useEffect(() => {
    const el = ref.current!;
    const update = () => setP(trackProgress(el.scrollLeft, el.scrollWidth, el.clientWidth, projects.length));
    el.addEventListener("scroll", update, { passive: true });
    // Wheel over the track scrolls it horizontally until it hits an end, then the page takes over.
    const onWheel = (e: WheelEvent) => {
      const atStart = el.scrollLeft <= 0 && e.deltaY < 0;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1 && e.deltaY > 0;
      if (atStart || atEnd || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => { el.removeEventListener("scroll", update); el.removeEventListener("wheel", onWheel); };
  }, [projects.length]);

  const step = (dir: 1 | -1) => {
    const el = ref.current!;
    const card = el.querySelector("li")?.getBoundingClientRect().width ?? 420;
    el.scrollBy({ left: dir * (card + 16), behavior: "smooth" });
  };

  return (
    <div>
      <ul
        ref={ref}
        data-lenis-prevent
        aria-label="Case studies"
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onKeyDown={e => { if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); }}
      >
        {projects.map(p => <ProjectCard key={p.slug} project={p} total={projects.length} />)}
      </ul>
      <div className="mt-6 flex items-center gap-4">
        <button type="button" aria-label="Previous project" onClick={() => step(-1)} className="inline-flex size-9 items-center justify-center rounded-full border border-line text-muted hover:text-fg">←</button>
        <button type="button" aria-label="Next project" onClick={() => step(1)} className="inline-flex size-9 items-center justify-center rounded-full border border-line text-muted hover:text-fg">→</button>
        <div className="relative h-px flex-1 bg-line"><div className="absolute inset-y-0 left-0 bg-accent transition-[width] duration-200" style={{ width: `${ratio * 100}%` }} /></div>
        <p className="display text-lg font-bold tabular-nums" aria-live="polite">{String(index + 1).padStart(2, "0")} <span className="label text-muted">/ {String(projects.length).padStart(2, "0")}</span></p>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Work section**

Create `src/components/sections/Work.tsx`:

```tsx
import { Chip } from "@/components/ui/Chip";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Marquee } from "@/components/ui/Marquee";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectTrack } from "@/components/work/ProjectTrack";
import { projects } from "@/data/projects";

const ALSO_BUILT = ["Blurr · Strapi CMS site · client", "Valoteka · landing page · client"];

export function Work() {
  return (
    <section id="work" className="section overflow-hidden">
      <Marquee word="WORK" position="bottom" />
      <div className="container-x relative">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow text="Selected work" n={4} />
            <SectionHeading lead="Case" accent="studies." />
          </div>
          <div className="text-right">
            <p className="display text-2xl font-bold">{String(projects.length).padStart(2, "0")} <span className="label text-muted">projects</span></p>
            <p className="label text-muted">↔ drag · click</p>
          </div>
        </div>
        <div className="mt-12"><ProjectTrack projects={projects} /></div>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <span className="label text-muted">Also built</span>
          {ALSO_BUILT.map(t => <Chip key={t}>{t}</Chip>)}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Run, commit**

Run: `npm test -- track` → 2 passed. `npm run typecheck` → clean.

```bash
git add -A && git commit -m "feat(home): horizontal case-study track with progress, tilt cards and also-built row"
```

### Task 15: Services accordion

**Files:**
- Create: `src/components/sections/Services.tsx`, `src/components/sections/ServicesList.tsx`, `src/components/sections/Services.test.tsx`

**Interfaces:**
- Consumes: `services`, `Chip`, `Eyebrow`, `SectionHeading`, `EASE`.
- Produces: `<Services />` with `id="services"`; `<ServicesList items>` client island.

- [ ] **Step 1: Failing test**

Create `src/components/sections/Services.test.tsx`:

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ServicesList } from "@/components/sections/ServicesList";
import { services } from "@/data/services";

describe("ServicesList", () => {
  it("opens the first row by default and only one row at a time", () => {
    render(<ServicesList items={services} />);
    const rows = screen.getAllByRole("button", { expanded: true });
    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveTextContent("Headless commerce storefronts");
    fireEvent.click(screen.getByRole("button", { name: /CMS-driven websites/ }));
    expect(screen.getAllByRole("button", { expanded: true })).toHaveLength(1);
    expect(screen.getByRole("button", { name: /CMS-driven websites/ })).toHaveAttribute("aria-expanded", "true");
  });
});
```

Run: `npm test -- Services` → FAIL.

- [ ] **Step 2: ServicesList (client)**

Create `src/components/sections/ServicesList.tsx`:

```tsx
"use client";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Chip } from "@/components/ui/Chip";
import type { Service } from "@/data/schemas";
import { EASE } from "@/lib/motion";

export function ServicesList({ items }: { items: Service[] }) {
  const [open, setOpen] = useState(0);
  return (
    <ul className="mt-12 border-t border-line">
      {items.map((s, i) => {
        const isOpen = open === i;
        return (
          <li key={s.n} className={`border-b border-line transition-colors ${isOpen ? "border-b-accent/60" : ""}`}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`service-${s.n}`}
              onClick={() => setOpen(i)}
              className="group grid w-full grid-cols-[48px_1fr_auto] items-center gap-4 py-5 text-left md:grid-cols-[64px_1fr_auto_32px]"
            >
              <span className={`label ${isOpen ? "text-accent" : "text-muted"}`}>{String(s.n).padStart(2, "0")} / 06</span>
              <span className={`display text-[clamp(20px,2.4vw,30px)] font-bold transition-transform ${isOpen ? "" : "group-hover:translate-x-1.5"}`}>{s.title}</span>
              <span className="label hidden text-muted md:inline">{s.tags.join(" · ")}</span>
              <span aria-hidden className="label text-right text-muted">{isOpen ? "—" : "+"}</span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div id={`service-${s.n}`} className="overflow-hidden" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: EASE }}>
                  <div className="grid gap-8 pb-8 md:grid-cols-[64px_1fr_1fr] md:gap-4">
                    <span className="hidden md:block" />
                    <div>
                      <p className="max-w-[52ch] text-muted">{s.description}</p>
                      <ul className="mt-4 flex flex-wrap gap-2">{s.chips.map(c => <li key={c}><Chip>{c}</Chip></li>)}</ul>
                    </div>
                    <div>
                      <p className="label text-muted">Includes</p>
                      <ul className="mt-2 space-y-1.5 text-sm">{s.includes.map(x => <li key={x} className="flex gap-3"><span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />{x}</li>)}</ul>
                      <p className="label mt-5 text-muted">Timeline</p>
                      <p className="mt-1 text-sm">{s.timeline}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
```

- [ ] **Step 3: Services section**

Create `src/components/sections/Services.tsx`:

```tsx
import { ServicesList } from "@/components/sections/ServicesList";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { services } from "@/data/services";

export function Services() {
  return (
    <section id="services" className="section">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow text="What I do" n={5} />
            <SectionHeading lead="Services that" accent="ship." />
          </div>
          <div className="text-right">
            <p className="display text-2xl font-bold">06 <span className="label text-muted">capabilities</span></p>
            <p className="label text-muted">design → deploy</p>
          </div>
        </div>
        <ServicesList items={services} />
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run, commit**

Run: `npm test -- Services` → PASS.

```bash
git add -A && git commit -m "feat(home): services accordion, one row open at a time"
```

### Task 16: Contact API (schema, rate limit, route)

**Files:**
- Create: `src/lib/contact-schema.ts`, `src/lib/contact-schema.test.ts`, `src/lib/rate-limit.ts`, `src/lib/rate-limit.test.ts`, `src/app/api/contact/route.ts`, `src/app/api/contact/route.test.ts`

**Interfaces:**
- Produces: `contactSchema` (Zod) and `ContactInput`; `rateLimit(key, limit=5, windowMs=600000, now=Date.now()): boolean`; `_resetRateLimit()`; `POST /api/contact` → `200 {ok:true}` | `400 {error}` | `429 {error}` | `500 {error}`.

- [ ] **Step 1: Failing tests**

Create `src/lib/contact-schema.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { contactSchema } from "@/lib/contact-schema";

const good = { name: "Ana", email: "ana@example.com", subject: "A storefront", message: "We need a Medusa storefront for our shop by December.", website: "" };

describe("contactSchema", () => {
  it("accepts a good message", () => expect(contactSchema.safeParse(good).success).toBe(true));
  it("rejects a short message, bad email, unknown subject", () => {
    expect(contactSchema.safeParse({ ...good, message: "hi" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...good, email: "nope" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...good, subject: "Spam" }).success).toBe(false);
  });
  it("trims whitespace", () => {
    expect(contactSchema.parse({ ...good, name: "  Ana  " }).name).toBe("Ana");
  });
});
```

Create `src/lib/rate-limit.test.ts`:

```ts
import { beforeEach, describe, expect, it } from "vitest";
import { rateLimit, _resetRateLimit } from "@/lib/rate-limit";

describe("rateLimit", () => {
  beforeEach(() => _resetRateLimit());
  it("allows 5 in a window and blocks the 6th", () => {
    const t = 1_000_000;
    for (let i = 0; i < 5; i++) expect(rateLimit("1.1.1.1", 5, 600_000, t + i)).toBe(true);
    expect(rateLimit("1.1.1.1", 5, 600_000, t + 5)).toBe(false);
  });
  it("allows again once the window has passed", () => {
    const t = 1_000_000;
    for (let i = 0; i < 5; i++) rateLimit("2.2.2.2", 5, 600_000, t);
    expect(rateLimit("2.2.2.2", 5, 600_000, t + 600_001)).toBe(true);
  });
  it("keys are independent", () => {
    for (let i = 0; i < 5; i++) rateLimit("a", 5, 600_000, 0);
    expect(rateLimit("b", 5, 600_000, 0)).toBe(true);
  });
});
```

Create `src/app/api/contact/route.test.ts`:

```ts
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
```

Run: `npm test` → FAIL, modules not found.

- [ ] **Step 2: Schema**

Create `src/lib/contact-schema.ts`:

```ts
import { z } from "zod";
import { SUBJECTS } from "@/data/schemas";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name needs at least 2 characters").max(80),
  email: z.email("Enter a valid email").max(120),
  subject: z.enum(SUBJECTS),
  message: z.string().trim().min(20, "Tell me a bit more (20+ characters)").max(2000),
  website: z.string().max(0).optional().default(""), // honeypot: humans never see this field
});
export type ContactInput = z.infer<typeof contactSchema>;
export const CONTACT_ERROR = "Check the form: name (2+ characters), a valid email, and a message of 20–2000 characters.";
```

- [ ] **Step 3: Rate limiter**

Create `src/lib/rate-limit.ts`:

```ts
// ponytail: per-instance in-memory map; resets on cold start and is not shared across
// serverless instances. Enough for a portfolio. Move to Upstash Ratelimit if spam shows up.
const hits = new Map<string, number[]>();

export function rateLimit(key: string, limit = 5, windowMs = 10 * 60_000, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter(t => now - t < windowMs);
  if (recent.length >= limit) { hits.set(key, recent); return false; }
  recent.push(now);
  hits.set(key, recent);
  return true;
}

export function _resetRateLimit() { hits.clear(); }
```

- [ ] **Step 4: Route handler**

Create `src/app/api/contact/route.ts`:

```ts
import { Resend } from "resend";
import { contactSchema, CONTACT_ERROR } from "@/lib/contact-schema";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(ip)) return Response.json({ error: "Too many messages from this connection. Try again in a few minutes, or use WhatsApp." }, { status: 429 });

  const json = await req.json().catch(() => null);
  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) return Response.json({ error: CONTACT_ERROR }, { status: 400 });

  const { name, email, subject, message, website } = parsed.data;
  if (website) return Response.json({ ok: true }); // bot filled the honeypot; pretend it worked
  if (process.env.CONTACT_DRY_RUN === "1") return Response.json({ ok: true });

  const to = process.env.CONTACT_TO;
  if (!to || !process.env.RESEND_API_KEY) return Response.json({ error: "Contact form is not configured. Email me directly." }, { status: 500 });

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: "Portfolio <onboarding@resend.dev>", // ponytail: sandbox sender until a domain is verified in Resend
    to: [to],
    replyTo: email,
    subject: `[Portfolio] ${subject} — ${name}`,
    text: `${message}\n\n— ${name} <${email}>\nSubject: ${subject}\nIP: ${ip}`,
  });
  if (error) return Response.json({ error: "Couldn't send right now. Email me directly or use WhatsApp." }, { status: 500 });
  return Response.json({ ok: true });
}
```

- [ ] **Step 5: Run, commit**

Run: `npm test` → contact-schema 3, rate-limit 3, route 7 passed.

```bash
git add -A && git commit -m "feat(api): contact route with zod validation, honeypot, rate limit and Resend"
```

### Task 17: Contact section and form

**Files:**
- Create: `src/components/contact/ContactForm.tsx`, `src/components/contact/ContactForm.test.tsx`, `src/components/sections/Contact.tsx`

**Interfaces:**
- Consumes: `contactSchema`, `SUBJECTS`, `profile`, `whatsappHref()`, `Button`, `CopyButton`, `Eyebrow`, `SectionHeading`, `Marquee`, `Footer`.
- Produces: `<ContactForm />` (client) posting to `/api/contact`; `<Contact />` with `id="contact"`.

- [ ] **Step 1: Failing test**

Create `src/components/contact/ContactForm.test.tsx`:

```tsx
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
```

Run: `npm test -- ContactForm` → FAIL.

- [ ] **Step 2: ContactForm**

Create `src/components/contact/ContactForm.tsx`:

```tsx
"use client";
import { useState } from "react";
import { SUBJECTS } from "@/data/schemas";
import { contactSchema } from "@/lib/contact-schema";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

const field = "w-full rounded-lg border border-line bg-surface px-4 py-3 text-sm placeholder:text-muted/70 focus:border-accent focus:outline-none";

export function ContactForm() {
  const [subject, setSubject] = useState<(typeof SUBJECTS)[number]>(SUBJECTS[0]);
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const parsed = contactSchema.safeParse({ name: form.get("name"), email: form.get("email"), subject, message: form.get("message"), website: form.get("website") ?? "" });
    if (!parsed.success) { setState({ kind: "error", message: parsed.error.issues[0]?.message ?? "Check the form." }); return; }
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(parsed.data) });
      if (res.ok) { setState({ kind: "sent" }); e.currentTarget.reset(); return; }
      const j = await res.json().catch(() => ({}));
      setState({ kind: "error", message: j.error ?? "Couldn't send. Email me directly." });
    } catch {
      setState({ kind: "error", message: "Network error. Email me directly or use WhatsApp." });
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="card p-6 md:p-8">
      <fieldset>
        <legend className="label text-muted">I'd like to talk about…</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {SUBJECTS.map(s => (
            <label key={s} className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm transition-colors ${subject === s ? "border-accent text-fg" : "border-line text-muted hover:text-fg"}`}>
              <input type="radio" name="subject" value={s} checked={subject === s} onChange={() => setSubject(s)} className="sr-only" />
              {s}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div><label htmlFor="name" className="label text-muted">Name</label><input id="name" name="name" autoComplete="name" required className={`${field} mt-2`} placeholder="Your name" /></div>
        <div><label htmlFor="email" className="label text-muted">Email</label><input id="email" name="email" type="email" autoComplete="email" required className={`${field} mt-2`} placeholder="you@company.com" /></div>
      </div>
      <div className="mt-4"><label htmlFor="message" className="label text-muted">Message</label><textarea id="message" name="message" rows={5} required className={`${field} mt-2`} placeholder="What are you building, when do you need it, and what does success look like?" /></div>
      <div className="absolute -left-[9999px]" aria-hidden><label htmlFor="website">Website</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <button type="submit" disabled={state.kind === "sending"} className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-accent-ink shadow-[0_12px_32px_-12px_var(--color-accent-glow)] disabled:opacity-60">
          {state.kind === "sending" ? "Sending…" : state.kind === "sent" ? "Sent ✓" : "Send message ↵"}
        </button>
        <p className="label text-muted">Sent via Resend · no newsletter, ever</p>
      </div>
      {state.kind === "error" && <p role="alert" className="mt-4 text-sm text-fg">{state.message}</p>}
      {state.kind === "sent" && <p role="status" className="mt-4 text-sm text-fg">Sent. I'll reply within a day.</p>}
    </form>
  );
}
```

Give the `<form>` `className="card relative p-6 md:p-8"` so the honeypot's absolute position is contained.

- [ ] **Step 3: Contact section**

Create `src/components/sections/Contact.tsx`:

```tsx
import { ContactForm } from "@/components/contact/ContactForm";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { profile } from "@/data/profile";
import { whatsappHref } from "@/lib/whatsapp";

export function Contact() {
  return (
    <section id="contact" className="section overflow-hidden">
      <Marquee word="REACH" position="top" />
      <div className="container-x relative">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow text="Get in touch" n={6} />
            <SectionHeading lead="Let's build" accent="something." />
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-sm"><span aria-hidden className="size-2 rounded-full bg-accent" />{profile.availabilityWindow}</span>
            <p className="label mt-2 text-muted">~24h reply · GMT+8, EU overlap</p>
          </div>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <Reveal className="card border-accent/60 p-6 md:p-8">
            <p className="label text-accent">Fastest reply</p>
            <h3 className="display mt-3 text-3xl font-bold">Chat on WhatsApp</h3>
            <p className="mt-3 text-muted">Tell me what you're building. I reply within a day, usually much faster.</p>
            <div className="mt-6"><Button href={whatsappHref()} external>Open WhatsApp →</Button></div>
            <p className="label mt-8 text-muted">Or email</p>
            <p className="mt-2 flex flex-wrap items-center gap-3 font-mono text-sm"><span className="select-all">{profile.email}</span><CopyButton text={profile.email} /></p>
            <div className="mt-6 flex gap-4 label text-muted">
              <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-fg">LinkedIn</a>
              <a href={profile.socials.github} target="_blank" rel="noreferrer" className="hover:text-fg">GitHub</a>
            </div>
          </Reveal>
          <Reveal delay={0.1}><ContactForm /></Reveal>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run, commit**

Run: `npm test -- ContactForm` → 3 passed.

```bash
git add -A && git commit -m "feat(home): contact section with WhatsApp card and validated form"
```

### Task 18: Assemble the home page with metadata and JSON-LD

**Files:**
- Modify: `src/app/page.tsx` (replace), `src/app/layout.tsx` (add Footer)
- Create: `e2e/home.spec.ts` (replace), `src/app/manifest.ts`

**Interfaces:**
- Produces: `/` rendering Hero, About, Experience, Work, Services, Contact, Footer; `Person` JSON-LD; e2e smoke covering six sections and nav anchors.

- [ ] **Step 1: Page**

Replace `src/app/page.tsx`:

```tsx
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Work } from "@/components/sections/Work";
import { profile } from "@/data/profile";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: `${profile.firstName} ${profile.lastName}`,
    jobTitle: "Full-Stack Developer",
    url: siteUrl,
    email: `mailto:${profile.email}`,
    sameAs: [profile.socials.linkedin, profile.socials.github],
    address: { "@type": "PostalAddress", addressCountry: "PH" },
    knowsAbout: profile.stack,
  };
  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      <About />
      <Experience />
      <Work />
      <Services />
      <Contact />
    </main>
  );
}
```

Add `<Footer />` after `{children}` in `src/app/layout.tsx` (`import { Footer } from "@/components/layout/Footer"`).

Vercel Web Analytics needs its component in Next.js apps:

```bash
npm i -E @vercel/analytics
```

Then in `src/app/layout.tsx` add `import { Analytics } from "@vercel/analytics/next";` and render `<Analytics />` as the last child of `<body>`. It is a no-op locally and in CI.

Create `src/app/manifest.ts`:

```ts
import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return { name: "Josef Vito — Full-Stack Developer", short_name: "Josef Vito", start_url: "/", display: "browser", background_color: "#0a0a0b", theme_color: "#0a0a0b" };
}
```

- [ ] **Step 2: E2E smoke for the home page**

Replace `e2e/home.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

const SECTIONS = ["hero", "about", "experience", "work", "services", "contact"];

test("home renders all six sections in order", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("Josef Vito");
  const ids = await page.locator("main > section").evaluateAll(els => els.map(e => e.id));
  expect(ids).toEqual(SECTIONS);
});

test("nav anchors reach their sections and the work cards link to four case studies", async ({ page, isMobile }) => {
  await page.goto("/");
  if (isMobile) { await page.getByRole("button", { name: "Open menu" }).click(); }
  await page.getByRole("link", { name: "Services", exact: true }).first().click();
  await expect(page).toHaveURL(/#services$/);
  const hrefs = await page.locator("#work a[href^='/work/']").evaluateAll(as => as.map(a => a.getAttribute("href")));
  expect(hrefs).toEqual(["/work/k-station", "/work/little-legend", "/work/dinecta", "/work/macdevelop"]);
});

test("services accordion keeps one row open", async ({ page }) => {
  await page.goto("/#services");
  await page.getByRole("button", { name: /CMS-driven websites/ }).click();
  await expect(page.locator("#services button[aria-expanded='true']")).toHaveCount(1);
});
```

- [ ] **Step 3: Full gate, look, commit**

```bash
npm run lint && npm run typecheck && npm test && npm run build && npm run e2e
```

Expected: all green. Then `npm run dev`, walk the page top to bottom on desktop and at 375px in DevTools: load sequence plays, marquees move, timeline card switches on hover, track drags and wheels, accordion animates, form validates. Stop the server.

```bash
git add -A && git commit -m "feat(home): assemble sections, JSON-LD, manifest, e2e smoke"
```

Update `HANDOFF.md`: phase 3, next Task 19. Commit and push. Open a PR from a branch if you worked on one; otherwise push `main` and confirm CI is green with `gh run watch --exit-status`.

---

## Phase 3 — Case-study pages and SEO (Tasks 19–21)

Ends with: four `/work/[slug]` pages from MDX, per-route Open Graph images, sitemap, robots, styled 404, and the full e2e suite including reduced-motion and 360px checks.

### Task 19: MDX case-study template and four drafts

**Files:**
- Modify: `src/mdx-components.tsx`
- Create: `src/app/work/[slug]/page.tsx`, `src/components/work/CaseStudyHero.tsx`, `src/components/work/CaseStudyToc.tsx`, `src/components/work/Screenshots.tsx`, `src/components/work/NextProject.tsx`, `src/content/work/k-station.mdx`, `src/content/work/little-legend.mdx`, `src/content/work/dinecta.mdx`, `src/content/work/macdevelop.mdx`, `e2e/work.spec.ts`

**Interfaces:**
- Consumes: `projects`, `getProject`, `nextProject`, `Chip`, `TiltCard`, `WordReveal`, `Reveal`.
- Produces: `/work/[slug]` static pages; `<Screenshots items>`; `<CaseStudyToc>`; MDX headings `## Context`, `## What I built`, `## Architecture`, `## Outcome` get ids via `rehype-slug` (`context`, `what-i-built`, `architecture`, `outcome`).

- [ ] **Step 1: Failing e2e**

Create `e2e/work.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

const SLUGS = ["k-station", "little-legend", "dinecta", "macdevelop"];

for (const slug of SLUGS) {
  test(`/work/${slug} renders title, four sections and a next link`, async ({ page }) => {
    await page.goto(`/work/${slug}`);
    await expect(page.locator("h1")).toBeVisible();
    for (const id of ["context", "what-i-built", "architecture", "outcome"]) await expect(page.locator(`#${id}`)).toHaveCount(1);
    await expect(page.getByRole("link", { name: /Next project/ })).toBeVisible();
  });
}

test("unknown slug is a 404", async ({ page }) => {
  const res = await page.goto("/work/nope");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("link", { name: /Back home/ })).toBeVisible();
});

test("macdevelop shows the in-progress state and no live link", async ({ page }) => {
  await page.goto("/work/macdevelop");
  await expect(page.getByText("In progress")).toBeVisible();
  await expect(page.getByRole("link", { name: /Visit live site/ })).toHaveCount(0);
});
```

Run: `npm run build && npm run e2e -- work` → FAIL (routes missing).

- [ ] **Step 2: MDX components**

Replace `src/mdx-components.tsx`:

```tsx
import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {
  h2: props => <h2 {...props} className="display mt-14 scroll-mt-32 text-[clamp(24px,3vw,36px)] font-bold first:mt-0" />,
  h3: props => <h3 {...props} className="display mt-8 text-xl font-bold" />,
  p: props => <p {...props} className="mt-4 max-w-[65ch] text-muted" />,
  ul: props => <ul {...props} className="mt-4 space-y-2 text-muted" />,
  li: props => <li {...props} className="flex gap-3 before:mt-2.5 before:size-1.5 before:shrink-0 before:rounded-full before:bg-accent before:content-['']" />,
  strong: props => <strong {...props} className="font-medium text-fg" />,
  a: props => <a {...props} className="text-accent underline-offset-4 hover:underline" target={props.href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer" />,
  code: props => <code {...props} className="rounded bg-surface px-1.5 py-0.5 font-mono text-[0.9em] text-fg" />,
  pre: props => <pre {...props} className="mt-4 overflow-x-auto rounded-lg border border-line bg-surface p-4 text-sm" />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
```

- [ ] **Step 3: Case-study components**

Create `src/components/work/CaseStudyHero.tsx`:

```tsx
import Image from "next/image";
import { Chip } from "@/components/ui/Chip";
import { Reveal } from "@/components/ui/Reveal";
import { WordReveal } from "@/components/ui/WordReveal";
import type { Project } from "@/data/schemas";

export function CaseStudyHero({ p, total }: { p: Project; total: number }) {
  return (
    <header className="container-x pt-36 lg:pt-44">
      <div className="grid items-end gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="label text-accent">Case study · {String(p.n).padStart(2, "0")} / {String(total).padStart(2, "0")} · {p.year}</p>
          <WordReveal as="h1" text={p.title} className="display mt-4 text-[clamp(40px,7vw,96px)] font-bold" />
          <Reveal delay={0.2}><p className="mt-6 max-w-[48ch] text-lg text-muted">{p.summary}</p></Reveal>
        </div>
        <Reveal delay={0.3} className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
          <div><p className="label text-muted">Role</p><p className="mt-1">{p.role}</p></div>
          <div><p className="label text-muted">Timeline</p><p className="mt-1">{p.timeline}</p></div>
          <div className="col-span-2"><p className="label text-muted">Stack</p><p className="mt-1">{p.stack.join(" · ")}</p></div>
          <div className="col-span-2">
            <p className="label text-muted">{p.status === "live" ? "Live" : "Status"}</p>
            {p.live ? <a href={p.live} target="_blank" rel="noreferrer" className="mt-1 inline-block text-accent hover:underline">Visit live site ↗</a> : <span className="mt-1 inline-block"><Chip accent>In progress</Chip> <span className="text-muted">design complete, build under way</span></span>}
          </div>
        </Reveal>
      </div>
      <Reveal delay={0.4} className="mt-12">
        <div className="card overflow-hidden p-2">
          <div className="flex gap-1.5 px-2 py-2"><span className="size-2 rounded-full bg-line" /><span className="size-2 rounded-full bg-line" /><span className="size-2 rounded-full bg-line" /></div>
          <Image src={p.cover} alt={`${p.title} cover`} width={1600} height={1000} priority sizes="(min-width: 1440px) 1280px, 92vw" className="aspect-[16/9] w-full rounded-lg object-cover" />
        </div>
      </Reveal>
    </header>
  );
}
```

Create `src/components/work/CaseStudyToc.tsx`:

```tsx
"use client";
import { useEffect, useState } from "react";

const ITEMS = [["context", "Context"], ["what-i-built", "What I built"], ["architecture", "Architecture"], ["outcome", "Outcome"]] as const;

export function CaseStudyToc() {
  const [active, setActive] = useState("context");
  useEffect(() => {
    const els = ITEMS.map(([id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }), { rootMargin: "-20% 0px -70% 0px" });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <nav aria-label="On this page" className="sticky top-32 hidden lg:block">
      <p className="label text-muted">On this page</p>
      <ul className="mt-3 space-y-2">
        {ITEMS.map(([id, label]) => <li key={id}><a href={`#${id}`} className={`label transition-colors ${active === id ? "text-accent" : "text-muted hover:text-fg"}`}>{label}</a></li>)}
      </ul>
    </nav>
  );
}
```

Create `src/components/work/Screenshots.tsx`:

```tsx
"use client";
import Image from "next/image";
import { useState } from "react";

export function Screenshots({ items }: { items: { src: string; alt: string }[] }) {
  const [big, setBig] = useState<number | null>(null);
  return (
    <ul className="mt-6 grid gap-4 sm:grid-cols-2">
      {items.map((s, i) => (
        <li key={s.src} className={big === i ? "sm:col-span-2" : ""}>
          <button type="button" onClick={() => setBig(big === i ? null : i)} aria-label={big === i ? `Shrink: ${s.alt}` : `Enlarge: ${s.alt}`} className="card block w-full overflow-hidden p-1.5 text-left">
            <Image src={s.src} alt={s.alt} width={1600} height={1000} sizes="(min-width: 640px) 50vw, 92vw" className="aspect-[16/10] w-full rounded-md object-cover" />
          </button>
          <p className="label mt-2 text-muted">{s.alt}</p>
        </li>
      ))}
    </ul>
  );
}
```

Create `src/components/work/NextProject.tsx`:

```tsx
import Image from "next/image";
import Link from "next/link";
import { TiltCard } from "@/components/ui/TiltCard";
import type { Project } from "@/data/schemas";

export function NextProject({ p }: { p: Project }) {
  return (
    <div className="container-x mt-24 border-t border-line pt-12">
      <p className="label text-muted">Next project</p>
      <TiltCard max={3} className="mt-4">
        <Link href={`/work/${p.slug}`} aria-label={`Next project: ${p.title}`} className="card group flex items-center gap-6 p-4 transition-colors hover:bg-surface-hover">
          <Image src={p.cover} alt="" width={320} height={200} sizes="160px" className="aspect-[16/10] w-40 rounded-lg object-cover" />
          <span className="display text-[clamp(24px,4vw,48px)] font-bold">{p.title} <span className="text-accent transition-transform group-hover:translate-x-1 inline-block">→</span></span>
        </Link>
      </TiltCard>
    </div>
  );
}
```

- [ ] **Step 4: The route**

Create `src/app/work/[slug]/page.tsx`:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyHero } from "@/components/work/CaseStudyHero";
import { CaseStudyToc } from "@/components/work/CaseStudyToc";
import { NextProject } from "@/components/work/NextProject";
import { Screenshots } from "@/components/work/Screenshots";
import { getProject, nextProject, projects } from "@/data/projects";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map(p => ({ slug: p.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return { title: `${p.title} case study`, description: p.blurb, openGraph: { title: `${p.title} — case study`, description: p.blurb } };
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const { default: Body } = await import(`@/content/work/${slug}.mdx`);
  return (
    <main id="main" className="pb-24">
      <CaseStudyHero p={p} total={projects.length} />
      <div className="container-x mt-16 grid gap-12 lg:grid-cols-[200px_1fr]">
        <CaseStudyToc />
        <article className="min-w-0">
          <Body />
          <h2 className="display mt-14 text-[clamp(24px,3vw,36px)] font-bold">Screens</h2>
          <Screenshots items={p.screenshots} />
        </article>
      </div>
      <NextProject p={nextProject(slug)} />
    </main>
  );
}
```

- [ ] **Step 5: MDX drafts (owner reviews wording; K-Station facts come from that repo's README and ADRs)**

Create `src/content/work/k-station.mdx`:

```mdx
## Context

K-Station is a K-pop events and merchandise venue in the Netherlands. The client needed one website that sells products, publishes events and pages editors can change themselves, and takes bookings for the venue, without three separate logins and three sources of truth.

## What I built

- A three-service platform: **Medusa v2** for commerce (products, prices, stock, carts, orders, payments), **Strapi 5** for content (site chrome, homepage, events, marketing pages), and a **Next.js 16** storefront that is the only place the two meet.
- A request-booking flow with **PostgreSQL-level concurrency protection**, so two people cannot take the same slot even under retry storms.
- Stripe checkout, transactional email through Resend, MeiliSearch product search, Redis-backed workflows, all wired through one typed data seam in the storefront.
- Unit, integration and Playwright end-to-end journeys, a path-filtered GitHub Actions pipeline, and branch protection on a three-tier `develop → staging → main` flow.

## Architecture

**Ownership is exclusive.** Commerce data lives in Medusa, content lives in Strapi, and nothing is managed in both. Member state (interests, followed groups, preferences) belongs to Medusa so no personal data enters the CMS. The storefront reads both through one seam module each, and the two back ends never talk to each other. The reasoning is written down as architecture decision records, so future changes have a place to start.

## Outcome

Live in production on Railway and Vercel with post-deploy smoke checks, an operator runbook, and a documented release rung from develop to staging to main. The client edits content and runs commerce without a developer in the loop; every change ships through CI.
```

Create `src/content/work/little-legend.mdx`:

```mdx
## Context

Parents want a keepsake, not another app. Little Legend turns a few family details and memories into a personalised, illustrated storybook: preview today, PDF tonight, hardcover for years.

## What I built

- The full product flow: memory capture, story structure, generation hand-off and a polished storefront on **Next.js**.
- Commerce and order logic in **Medusa**, so books, previews and hardcovers are real products with real checkout.
- An AI story-and-image generation pipeline with structured prompts and review steps; end-to-end story generation runs in about 30 seconds.

## Architecture

Next.js owns presentation and the personalisation wizard. Medusa owns catalogue, cart and orders. The generation pipeline is a separate, queue-driven step so a slow model never blocks checkout, and every generated asset is reviewed and stored before it is shown to a family.

## Outcome

An independent product, live at littlelegend.online, built and shipped solo. It is the reference for how I approach AI features: as product plumbing with limits and review, not as a demo.
```

Create `src/content/work/dinecta.mdx`:

```mdx
## Context

Restaurants in the Philippines juggle separate tools for orders, tables, payments and reservations. Staff switch screens, service slows, owners lose visibility. Dinecta puts QR ordering, table management, GCash/Maya payments, reservations and a branded site in one place, built for launch in Siargao.

## What I built

- QR-code ordering with a live kitchen and table view.
- Table management and reservations backed by **PostgreSQL** with concurrency-safe status changes.
- GCash and Maya payment integration, analytics, and a marketing site with a self-serve onboarding flow.

## Architecture

A single Next.js application with server components for the operator views and a lean client for the guest ordering flow, so a phone on café Wi-Fi stays fast. Money and state changes happen in the database with constraints, not in the browser.

## Outcome

Live at dinecta.com and in pilot with local venues. Designed by someone who has run two cafés, which shows in the defaults: fewer screens, faster service, clear numbers for the owner.
```

Create `src/content/work/macdevelop.mdx`:

```mdx
## Context

MacDevelop is the Dutch agency I ship client work for. Its own site needed the same standard it sells: a fast, content-managed, animated marketing site.

## What I built

- The complete visual design in Figma: home, services, work and contact, with a motion plan for each section.
- A build plan on **Next.js + Strapi 5** using the atomic component system and animation architecture proven on client projects.

## Architecture

Strapi dynamic zones for every marketing section so the team can reorder and rewrite pages without a developer, a Next.js front end with Motion for reveals, and Vercel previews on every pull request.

## Outcome

Design complete and approved; the build is in progress. This page will switch from renders to screenshots when it ships.
```

- [ ] **Step 6: Styled 404**

Create `src/app/not-found.tsx`:

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="container-x flex min-h-[70svh] flex-col items-start justify-center pt-32">
      <p className="label text-accent">404</p>
      <h1 className="display mt-4 text-[clamp(40px,7vw,96px)] font-bold">Nothing <span className="text-outline">here.</span></h1>
      <p className="mt-6 max-w-[48ch] text-muted">The page moved or never existed. The work is one click away.</p>
      <Link href="/" className="mt-8 inline-flex rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-accent-ink">Back home →</Link>
    </main>
  );
}
```

- [ ] **Step 7: Run, commit**

```bash
npm run typecheck && npm run build && npm run e2e -- work
```

Expected: 6 e2e tests pass per project.

```bash
git add -A && git commit -m "feat(work): MDX case-study pages, toc, screenshots, next-project link, 404"
```

### Task 20: Open Graph images, sitemap, robots, icon

**Files:**
- Create: `src/app/opengraph-image.tsx`, `src/app/work/[slug]/opengraph-image.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/icon.svg`, `src/lib/og.tsx`, `e2e/seo.spec.ts`

**Interfaces:**
- Produces: `/opengraph-image`, `/work/<slug>/opengraph-image`, `/sitemap.xml`, `/robots.txt`, `/icon.svg`; `ogCard({ eyebrow, title, sub })` shared JSX for both OG routes.

- [ ] **Step 1: Failing e2e**

Create `e2e/seo.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("sitemap lists home and the four case studies", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  for (const p of ["/", "/work/k-station", "/work/little-legend", "/work/dinecta", "/work/macdevelop"]) expect(xml).toContain(`<loc>http://localhost:3000${p}</loc>`);
});

test("robots allows crawling and points at the sitemap", async ({ request }) => {
  const txt = await (await request.get("/robots.txt")).text();
  expect(txt).toMatch(/Allow: \//);
  expect(txt).toContain("sitemap.xml");
});

test("home and a case study serve an OG image", async ({ page, request }) => {
  await page.goto("/work/dinecta");
  const og = await page.locator('meta[property="og:image"]').first().getAttribute("content");
  expect(og).toMatch(/opengraph-image/);
  const res = await request.get(og!);
  expect(res.ok()).toBe(true);
  expect(res.headers()["content-type"]).toContain("image/png");
});
```

- [ ] **Step 2: Shared OG card**

Create `src/lib/og.tsx`:

```tsx
export const OG_SIZE = { width: 1200, height: 630 };

export function OgCard({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, background: "#0a0a0b", color: "#f2f1ec", fontFamily: "Helvetica, Arial, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 28, fontWeight: 700 }}>
        <div style={{ width: 14, height: 14, borderRadius: 999, background: "#45f0b4" }} />JV
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 24, letterSpacing: 4, color: "#45f0b4", textTransform: "uppercase" }}>{eyebrow}</div>
        <div style={{ fontSize: 88, fontWeight: 700, lineHeight: 1, marginTop: 16, letterSpacing: -2 }}>{title}</div>
        <div style={{ fontSize: 30, color: "#8d8b84", marginTop: 20 }}>{sub}</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: OG routes**

Create `src/app/opengraph-image.tsx`:

```tsx
import { ImageResponse } from "next/og";
import { OG_SIZE, OgCard } from "@/lib/og";
import { profile } from "@/data/profile";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Josef Vito — Full-Stack Developer";

export default function Image() {
  return new ImageResponse(<OgCard eyebrow="Full-stack developer · freelance" title={`${profile.firstName} ${profile.lastName}`} sub={profile.tagline} />, size);
}
```

Create `src/app/work/[slug]/opengraph-image.tsx`:

```tsx
import { ImageResponse } from "next/og";
import { OG_SIZE, OgCard } from "@/lib/og";
import { getProject, projects } from "@/data/projects";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Case study";

export function generateStaticParams() {
  return projects.map(p => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  return new ImageResponse(<OgCard eyebrow={`Case study · ${p?.year ?? ""}`} title={p?.title ?? "Work"} sub={p?.blurb ?? ""} />, size);
}
```

- [ ] **Step 4: Sitemap, robots, icon**

Create `src/app/sitemap.ts`:

```ts
import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    ...projects.map(p => ({ url: `${base}/work/${p.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
```

Create `src/app/robots.ts`:

```ts
import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: "/api/" }, sitemap: `${base}/sitemap.xml` };
}
```

Create `src/app/icon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0a0a0b"/><circle cx="16" cy="32" r="5" fill="#45f0b4"/><text x="27" y="41" font-family="Helvetica, Arial, sans-serif" font-size="26" font-weight="700" fill="#f2f1ec">JV</text></svg>
```

- [ ] **Step 5: Run, commit**

```bash
npm run typecheck && npm run build && npm run e2e -- seo
git add -A && git commit -m "feat(seo): open graph images, sitemap, robots, icon"
```

### Task 21: Full e2e suite (reduced motion, 360px, contact flow) and CI e2e

**Files:**
- Create: `e2e/a11y-motion.spec.ts`, `e2e/contact.spec.ts`
- Modify: `playwright.config.ts` (add a 360px project)

**Interfaces:**
- Produces: the complete `npm run e2e` suite that CI runs.

- [ ] **Step 1: 360px project**

In `playwright.config.ts` `projects`, add:

```ts
{ name: "narrow", use: { ...devices["Desktop Chrome"], viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true } },
```

- [ ] **Step 2: Reduced-motion and overflow specs**

Create `e2e/a11y-motion.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

const PAGES = ["/", "/work/k-station", "/work/macdevelop"];

test.describe("reduced motion", () => {
  test.skip(({ }, info) => info.project.name !== "reduced-motion", "only in the reduced-motion project");
  test("nothing is left invisible after load", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(500);
    const hidden = await page.locator("main [style*='opacity']").evaluateAll(els => els.filter(e => getComputedStyle(e).opacity === "0").map(e => e.outerHTML.slice(0, 80)));
    expect(hidden).toEqual([]);
  });
});

test.describe("no horizontal overflow", () => {
  test.skip(({ }, info) => info.project.name !== "narrow", "only at 360px");
  for (const p of PAGES) {
    test(`${p} fits the viewport`, async ({ page }) => {
      await page.goto(p);
      await page.waitForTimeout(300);
      const { sw, cw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
      expect(sw).toBeLessThanOrEqual(cw);
    });
  }
});

test("every page has one h1, a skip link and landmark main", async ({ page }) => {
  for (const p of PAGES) {
    await page.goto(p);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main#main")).toHaveCount(1);
    await expect(page.getByRole("link", { name: "Skip to content" })).toHaveCount(1);
  }
});
```

- [ ] **Step 3: Contact flow (dry run)**

Create `e2e/contact.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("form validates, then sends in dry-run mode", async ({ page }) => {
  await page.goto("/#contact");
  await page.getByRole("button", { name: /send message/i }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await page.getByLabel("Name").fill("Ana");
  await page.getByLabel("Email").fill("ana@example.com");
  await page.getByLabel("Message").fill("We need a Medusa storefront for our shop by December.");
  await page.getByRole("button", { name: /send message/i }).click();
  await expect(page.getByRole("status")).toContainText("Sent");
});

test("WhatsApp CTA carries the prefilled text", async ({ page }) => {
  await page.goto("/");
  const href = await page.getByRole("link", { name: /chat on whatsapp/i }).first().getAttribute("href");
  expect(href).toMatch(/^https:\/\/wa\.me\/\d{8,15}\?text=/);
});
```

- [ ] **Step 4: Run the whole gate, commit, push, watch CI**

```bash
npm run lint && npm run typecheck && npm test && npm run build && npm run e2e
git add -A && git commit -m "test(e2e): reduced motion, 360px overflow, a11y landmarks, contact dry run"
git push && gh run watch --exit-status
```

Expected: green locally and in CI. Update `HANDOFF.md`: phase 4, next Task 22. Commit and push.

---

## Phase 4 — Content, quality pass, launch (Task 22)

### Task 22: Real content, Lighthouse pass, production launch

**Files:**
- Modify: `public/images/**` (replace placeholders), `src/data/profile.ts`, `src/content/work/*.mdx` (owner edits), `HANDOFF.md`, `README.md`

**Interfaces:**
- Consumes: everything above.
- Produces: https://josefvito.vercel.app live with real content; HANDOFF marked launched.

- [ ] **Step 1: OWNER — supply content (checklist from spec §13)**

Drop files in place; names are fixed so no code changes:

```
public/images/portrait.jpg              plain background, ≥1600px tall, 3:4 crop
public/images/about.jpg                 casual, square
public/images/work/k-station/cover.jpg + shot-1.jpg + shot-2.jpg      1600×1000 JPEG
public/images/work/little-legend/…      same
public/images/work/dinecta/…            same
public/images/work/macdevelop/…         design renders exported as JPEG
```

Then in Vercel set `NEXT_PUBLIC_WHATSAPP` (real number, digits only) and `CONTACT_TO` (lead inbox), `RESEND_API_KEY` (from resend.com, free tier). Confirm in writing that K-Station's name and URL may be public; if not, change `title`, `blurb`, `live` and the MDX to the anonymised wording in the spec.

- [ ] **Step 2: Screenshots you can capture yourself**

For the three live sites, capture 1600×1000 screenshots with Playwright instead of by hand:

```bash
node -e '
const { chromium } = require("@playwright/test");
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
  for (const [slug, url] of [["k-station","https://kstationeurope.com"],["little-legend","https://littlelegend.online"],["dinecta","https://www.dinecta.com"]]) {
    await p.goto(url, { waitUntil: "networkidle" }); await p.waitForTimeout(1500);
    await p.screenshot({ path: `public/images/work/${slug}/cover.jpg`, type: "jpeg", quality: 85 });
  }
  await b.close();
})();'
```

Review each image; retake any that caught a cookie banner or a loading state.

- [ ] **Step 3: Copy review**

Open `src/data/profile.ts`, `src/data/services.ts`, `src/data/experience.ts`, `src/content/work/*.mdx`. Owner reads every sentence and edits in place. Run `npm test` after edits: the schemas enforce lengths and counts, so a blurb over 160 characters or a fourth chip fails the test with the field name.

- [ ] **Step 4: Lighthouse on the production preview**

Push a branch, open the PR, wait for the Vercel preview URL, then:

```bash
npx lighthouse "<preview-url>" --preset=perf --form-factor=mobile --screenEmulation.mobile --output=json --output-path=./lh.json --chrome-flags="--headless=new" --quiet
node -e 'const r=require("./lh.json").categories;console.log(Object.fromEntries(Object.entries(r).map(([k,v])=>[k,Math.round(v.score*100)])))'
npx lighthouse "<preview-url>" --only-categories=accessibility,best-practices,seo --form-factor=mobile --screenEmulation.mobile --output=json --output-path=./lh2.json --chrome-flags="--headless=new" --quiet
```

Targets from spec §8: every category ≥ 90, LCP ≤ 2.5 s. If performance is under 90, work this list in order and re-measure after each: (1) portrait `priority` and `sizes` correct, (2) covers ≤ 200 KB after Next optimisation, (3) `Marquee` and `ProjectTrack` loaded only where used (they already are), (4) fonts: only the five weights listed, (5) remove any `motion` import from server components. Add `lh*.json` to `.gitignore`.

- [ ] **Step 5: Final gate, merge, verify production**

```bash
npm run lint && npm run typecheck && npm test && npm run build && npm run e2e
gh pr create --fill --base main && gh pr checks --watch
gh pr merge --merge --delete-branch
```

Wait for the Vercel production deploy, then:

```bash
curl -sI https://josefvito.vercel.app | head -1
curl -s https://josefvito.vercel.app/sitemap.xml | grep -c '<loc>'
curl -s -o /dev/null -w '%{http_code}\n' https://josefvito.vercel.app/work/k-station
```

Expected: `200`, `5`, `200`. Send one real message through the form and confirm it lands in `CONTACT_TO` with the sender as Reply-To. Tap the WhatsApp button on a phone and confirm the prefilled text.

- [ ] **Step 6: Close out**

- Update the CV: GitHub link to `github.com/JosefVito`, add the portfolio URL.
- Add the portfolio URL to the LinkedIn profile.
- `HANDOFF.md`: phase "Launched 2026-xx-xx", next: "buy domain → set `NEXT_PUBLIC_SITE_URL`, add domain in Vercel, verify domain in Resend and change `from` in `route.ts`".
- Commit and push.

```bash
git add -A && git commit -m "docs: launched; handoff lists post-launch domain steps" && git push
```

---

## Deferred on purpose (not in this plan)

- Home-card-to-case-study image morph (View Transitions). Page-enter animation only; add when Next.js marks `viewTransition` stable.
- Testimonials section: add when two real client quotes exist.
- Upstash rate limiting: only if spam appears.
- Custom domain and verified Resend sender: post-launch, tracked in `HANDOFF.md`.
