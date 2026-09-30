# Josef Vito portfolio — design spec

Date: 2026-09-30
Status: awaiting owner review
Wireframes (approved): https://claude.ai/artifact/T2cUbXHBMDZ8BoWikx46oL
Reference for feel only: https://zaidkhalid.dev (not copied; no 3D avatar, no preloader, no custom cursor)

## 1. Purpose

A one-page, dark, animated portfolio with four case-study pages that turns visitors
into **freelance leads on WhatsApp**. Secondary job: a link that fits on the CV and
LinkedIn. It showcases the exact stack Josef sells (Next.js, TypeScript, Medusa,
Strapi), so the site itself is proof of work.

Success looks like: a stranger lands from LinkedIn on a phone, understands within
five seconds what Josef builds, scrolls through real case studies, and taps
"Chat on WhatsApp" with a prefilled message.

## 2. Decisions of record

| Topic | Decision |
| --- | --- |
| Audience | Freelance clients. Tone: direct, confident, no agency-speak. |
| Lead channel | WhatsApp first (`wa.me` link with prefilled text), form second (emails Josef via Resend). |
| Sections (home) | Nav, Hero, About + core stack, Experience, Selected work, Services, Contact + footer. No preloader, no skills grid. |
| Hero visual | Portrait card with mouse tilt and scroll parallax, kinetic typography around it. |
| Identity | Dark only. One accent: **mint `#45F0B4`**. Clash Display headings, Satoshi body, JetBrains Mono labels. |
| Name treatment | Line 1 "Josef Vito" in mint, line 2 "Evangelista" in off-white, lighter weight. |
| About headline | "Built like an operator, shipped like **an engineer**." (accent on the last two words) |
| Experience | Four stops: MacDevelop Full Stack Engineer, MacDevelop trainee, Coco Cafe & CocoSpace, Vito Cafe. Air Force OJT omitted. |
| Case studies | K-Station, Little Legend, Dinecta, MacDevelop site (from design renders, labelled "In progress"). Each has its own page. Blurr and Valoteka listed as "Also built". |
| Services | Six rows, wording aligned with LinkedIn and CV. |
| Flourishes kept | Magnetic buttons, outlined marquee words, section counters + mono labels, card tilt. |
| Flourishes dropped | Custom cursor, live-preview pane, 3D, preloader. |
| Stack | Next.js App Router (latest stable), TypeScript, Tailwind v4, Motion, Lenis, `@next/mdx`, one Route Handler + Resend, Zod. Content in TS data files and MDX. No CMS. |
| Release | Build everything, launch once. Vercel free tier at `josefvito.vercel.app`. Custom domain later. |
| Repo | `github.com/JosefVito/portfolio`, public. Local: `~/Desktop/josefvito-portfolio`. |
| Stats | "5+ production projects", "3 client projects shipped", "2.5 yrs running businesses". |

## 3. Information architecture

```
/                      home, six sections + footer
/work/k-station        case study
/work/little-legend    case study
/work/dinecta          case study
/work/macdevelop       case study, "In progress" chip, no live link
/not-found             styled 404
/api/contact           POST only, Route Handler
/sitemap.xml, /robots.txt, /opengraph-image (per route)
```

Home nav anchors: `#work`, `#about`, `#services`, `#contact`. Order on the page is
Hero → About → Experience → Work → Services → Contact; the nav lists Work first
because it is what clients want.

## 4. Visual identity

### 4.1 Tokens (single dark theme, `color-scheme: dark`)

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#0A0A0B` | page ground |
| `--fg` | `#F2F1EC` | headings, primary text |
| `--muted` | `#8D8B84` | body copy, secondary text |
| `--line` | `rgba(255,255,255,.08)` | borders, dividers |
| `--surface` | `rgba(255,255,255,.03)` | card fill |
| `--surface-hover` | `rgba(255,255,255,.06)` | card hover |
| `--accent` | `#45F0B4` | status dot, primary button, one highlighted phrase per headline, active timeline node, progress bar |
| `--accent-ink` | `#0A0A0B` | text on accent |
| `--accent-glow` | `rgba(69,240,180,.35)` | portrait and primary-button glow |
| `--outline` | `rgba(255,255,255,.45)` | outlined display text stroke |

Accent discipline: the accent appears on at most one phrase per headline and never
as a large fill except the primary button.

### 4.2 Type

| Role | Face | Source | Sizes |
| --- | --- | --- | --- |
| Display | Clash Display 600/700 | Fontshare, self-hosted via `next/font/local` | hero name `clamp(48px, 8vw, 112px)`; section h2 `clamp(32px, 4.5vw, 56px)`; card h3 `24px` |
| Body | Satoshi 400/500/700 | Fontshare, self-hosted | 16px / 1.6; small 14px |
| Label | JetBrains Mono 400/500 | `next/font/google` | 11px, uppercase, `letter-spacing: .14em` |

Headings get `text-wrap: balance`; display sizes get `letter-spacing: -0.02em`,
`line-height: 0.95`.

### 4.3 Surfaces and spacing

- Cards: 1px `--line` border, `--surface` fill, 16px radius (20px for the portrait). No
  shadows except the accent glow under the portrait and primary button.
- Section rhythm: `padding-block: clamp(96px, 12vw, 160px)`; container `max-width: 1440px`,
  side gutter `clamp(20px, 5vw, 80px)`.
- Breakpoints: `sm 640`, `md 768`, `lg 1024`, `xl 1280`. Everything single-column at `< md`.
- Logo mark: "JV" wordmark preceded by a mint dot. Same mark renders the favicon and
  the OG image corner.

## 5. Home page, section by section

Each section: eyebrow (mono, accent, with the counter `0N / 06`), h2 with one accent
phrase, optional right-aligned stat. A huge outlined marquee word sits behind About,
Work and Contact only.

### 5.1 Navigation

- Floating pill, centred, 24px from top, `backdrop-filter: blur(12px)`, `--line` border.
  Contents: logo mark, Work, About, Services, Contact, "Hire me" (accent, magnetic,
  anchors to `#contact`).
- Hides on scroll down, returns on scroll up (Lenis direction). Active link shows
  the mint dot when its section is ≥ 50% in view (IntersectionObserver).
- `< md`: logo + burger. Burger opens a full-screen overlay: the four links in display
  type, the WhatsApp button, socials. Body scroll locked while open. Escape closes.
- On case-study pages the pill gains "← All work" as its first link.

### 5.2 Hero

Three columns on `≥ lg` (1.1fr / 1fr / 1.1fr), stacked on smaller screens in the order:
badge, name, subtitle line, portrait, CTAs, socials, location line.

Left column:
- Status badge: pulsing mint dot + "Available for new projects". Text comes from
  `profile.availability`.
- Eyebrow "— I'm".
- Name: "Josef Vito" (mint) / "Evangelista" (off-white, weight 600).
- CTAs: "Chat on WhatsApp" (accent, magnetic) and "View work" (ghost, magnetic,
  anchors to `#work`).
- Social icons: LinkedIn, GitHub. Round ghost buttons.
- Mono line: "Philippines · Remote · EU hours".

Centre column:
- Portrait card 3:4, 20px radius, mint glow beneath. Mouse tilt ±6°, scroll parallax
  20px. `next/image`, `priority`, `sizes="(min-width:1024px) 30vw, 80vw"`.

Right column (right-aligned):
- "Full-Stack" solid + "Developer" outlined (fills solid on hover).
- Mono accent line: "Headless commerce · Next.js · Medusa · Strapi".
- One sentence: "I design and ship production web apps end to end, with the ownership
  boundaries that keep them correct after launch."
- Bottom: "Scroll ↓ 01 / 06" with a bobbing arrow.

Load sequence (once, ~1.2s): nav → badge → name words → portrait scale from 0.94 →
title → CTAs → the rest.

### 5.3 About + core stack

Two columns `1.3fr / 1fr` on `≥ lg`.

- Marquee "ABOUT" behind, outlined, slow loop, speed follows Lenis velocity.
- Eyebrow "— About me · 02 / 06".
- h2 "Built like an operator, shipped like **an engineer**."
- Bio, ~70 words, drafted from LinkedIn (owner approves):
  "Full-stack developer focused on headless commerce and content platforms. I ran a
  cafe and a coworking space before writing software for a Dutch agency, so I build
  for the messy real world: data integrity, service boundaries, and delivery you can
  rely on."
- Three counters (count up from 0 when 40% visible, once): 5+ production projects ·
  3 client projects shipped · 2.5 yrs running businesses.
- Core-stack strip: mono chips from `profile.stack`, 30ms stagger:
  TypeScript, Next.js, React, Tailwind CSS, Medusa v2, Strapi 5, Node.js, PostgreSQL,
  Redis, Stripe, Docker, Playwright, GitHub Actions.
- Right: second photo (casual) in a card with slight parallax; badges "Available for
  work" (bottom-left) and "Siargao, PH · GMT+8" (top-right).

### 5.4 Experience

- Eyebrow "— Experience · 03 / 06"; h2 "From running a cafe to shipping **commerce
  platforms**."; right stat "04 stops · 2023 → now".
- Left: vertical timeline, four stops, newest first. The line draws downward with
  scroll (`pathLength` from `useScroll`). Hovering or scrolling past a stop makes it
  active: mint node with glow.
- Right: sticky detail card (`position: sticky; top: 120px`). Shows dates + location,
  counter `01 / 04`, role, company, one-line summary, 3 highlights, stack chips.
  Content crossfades on active change (`AnimatePresence`).
- `< lg`: the sticky card is replaced by an accordion; the active stop expands in
  place with the same content.

Stops (from CV and LinkedIn; wording mirrors them):

| Dates | Role | Company | Type |
| --- | --- | --- | --- |
| Feb 2026 – now | Full Stack Engineer | MacDevelop, Netherlands · remote | full-time |
| Jul 2025 – Feb 2026 | Full Stack Development Trainee | MacDevelop Traineeships · remote | internship |
| Jan 2025 – Feb 2026 | Cafe & Community Manager | Coco Cafe & CocoSpace, Siargao | full-time |
| Sep 2023 – May 2025 | Owner & General Manager | Vito Cafe, Lipa | founder |

### 5.5 Selected work

- Marquee "WORK" behind, bottom-anchored.
- Eyebrow "— Selected work · 04 / 06"; h2 "Case **studies**."; right stat "04
  projects · ↔ drag · click".
- Horizontal track of four cards, 200–420px wide depending on viewport, `scroll-snap`.
  Drag on pointer, wheel scrolls the track while the section is in view, arrows and
  ←/→ keys work. Progress bar + counter `01 / 04` follow the track.
- Card: screenshot 16:10 in a frame with "View case study →" pill (accent) and a type
  chip; row `0N / 04` · year; h3; one-line blurb; three stack chips. Whole card is a
  link to `/work/[slug]`. Hover: 4° tilt, image slides 12px, pill lifts.
- MacDevelop card shows an "In progress" chip (accent outline) over the render.
- Below the track: "Also built" row with two chips: "Blurr · Strapi CMS site · client",
  "Valoteka · landing page · client". No links.
- `< md`: track becomes swipe with 78vw cards, snap, counter below.

Card copy (drafts, owner approves):

| Slug | Title | Year | Blurb | Chips |
| --- | --- | --- | --- | --- |
| k-station | K-Station | 2026 | Three-service commerce, content and booking platform for a K-pop venue in the Netherlands. | Next.js · Medusa · Strapi |
| little-legend | Little Legend | 2026 | Personalised AI storybooks: memory capture, generation pipeline, Medusa checkout. | Next.js · Medusa · AI |
| dinecta | Dinecta | 2026 | QR ordering, table management and GCash/Maya payments for PH restaurants. | Next.js · PostgreSQL · Payments |
| macdevelop | MacDevelop | 2026 | Agency website designed and built solo, from Figma to Next.js + Strapi. | Next.js · Strapi · Motion |

### 5.6 Services

- Eyebrow "— What I do · 05 / 06"; h2 "Services that **ship**."; right stat "06
  capabilities · design → deploy".
- Accordion, one row open at a time, first open by default. Closed row: counter,
  title, two mono tags, "+" icon. Open row: accent border, description, three chips,
  "Includes" list (3 bullets), "Timeline" range. Height animates; body fades in.
- Rows reveal on enter with an 80ms stagger. Hover on closed rows shifts the title
  6px right.

| # | Title | Tags | Description (draft) | Timeline |
| --- | --- | --- | --- | --- |
| 01 | Headless commerce storefronts | Next.js · Medusa | Next.js storefronts on Medusa v2: catalogue, cart, checkout, payments, search, accounts. | 3–8 wks |
| 02 | CMS-driven websites | Strapi · Next.js | Strapi content models and dynamic zones with a Next.js front end editors can update without touching layout or animation. | 2–5 wks |
| 03 | Landing pages that convert | Design → code | Figma to production: responsive, fast, SEO basics, forms wired, deployed on Vercel. | 1–2 wks |
| 04 | Booking & ordering systems | QR · reservations | Request booking, QR ordering, table management, payment links, with PostgreSQL-level concurrency protection. | 3–6 wks |
| 05 | AI-enabled product features | Pipelines · review loops | Generation pipelines with structured prompts, review steps and cost controls, wired into your product. | 2–4 wks |
| 06 | Maintenance & iteration | Retainer | Features, fixes, upgrades and deploys on a monthly retainer, with tests and CI kept green. | ongoing |

"Includes" bullets per row live in `services.ts`; owner reviews wording.

### 5.7 Contact + footer

- Marquee "REACH" behind, top-anchored.
- Eyebrow "— Get in touch · 06 / 06"; h2 "Let's build **something**."; right: badge
  "Available · Q4 2026" + "~24h reply · GMT+8, EU overlap".
- Left card (accent border): "Fastest reply" label, h3 "Chat on WhatsApp", one line,
  primary button opening `https://wa.me/<E.164 number>?text=<encoded prefill>`. Below:
  "Or email" + address as selectable text with a copy button; LinkedIn and GitHub.
- Right card: subject chips ("A storefront", "A CMS website", "Booking / ordering",
  "Something else"), Name, Email, Message, "Send message ↵". Inline success ("Sent.
  I'll reply within a day.") and error ("Couldn't send. Email me directly at …")
  states. Mono note "Sent via Resend · no newsletter, ever".
- Footer: logo, anchor links, "© 2026 Josef Vito Evangelista · Siargao, PH · Built with
  Next.js", local-time clock (Asia/Manila), "↑ Top" (Lenis scrollTo).

## 6. Case-study page template (`/work/[slug]`)

1. Nav pill with "← All work".
2. Hero: eyebrow "Case study · 0N / 04 · year", h1 title (per-word reveal), one-line
   summary, meta grid (Role, Timeline, Stack, Live link or "In progress").
3. Hero screenshot 16:9 inside a browser-frame chrome, slight parallax. The home card
   image morphs into it on navigation (`view-transition-name` per slug).
4. Body: two columns on `≥ lg`: sticky mini table of contents (Context, What I built,
   Architecture, Outcome) + MDX content. Screenshots in a 2-up grid, `next/image`,
   click toggles a larger inline view (no lightbox library).
5. Footer link: "Next project → <title>" card with hover tilt; last loops to first.

MDX per project lives in `src/content/work/<slug>.mdx`; structured fields (title,
year, blurb, chips, role, timeline, stack, live URL, status, cover, screenshots) live
in `src/data/projects.ts`. K-Station's architecture section carries the exclusive-
ownership diagram (storefront reads Medusa and Strapi; the two never talk).

MacDevelop page: same template, renders as images, "In progress, design complete"
chip in the meta grid, no live link, no next-project morph from a missing screenshot.

## 7. Content model

```
src/data/profile.ts       name, headline, bio, availability, location, stack[], socials, whatsapp, email, stats[]
src/data/experience.ts    stops[] { dates, role, company, location, type, summary, highlights[], stack[] }
src/data/projects.ts      projects[] { slug, title, year, blurb, chips[], role, timeline, stack[], live?, status, cover, screenshots[], og }
src/data/services.ts      services[] { n, title, tags[], description, chips[], includes[], timeline }
src/content/work/*.mdx    case-study bodies (Context, What I built, Architecture, Outcome)
public/images/**          portrait.jpg, about.jpg, work/<slug>/cover.jpg + shots
public/fonts/**           ClashDisplay-*.woff2, Satoshi-*.woff2
```

Every array is typed; a `zod` schema validates `projects.ts` and `profile.ts` in a
unit test so a missing cover or malformed WhatsApp number fails CI, not production.

Placeholder policy: the build starts with placeholder images (solid surfaces with
the project name) and the bio draft. Each real asset replaces its placeholder by
file name, no code change.

## 8. Technical architecture

- **Framework**: Next.js App Router, latest stable at kickoff (verify with context7),
  TypeScript strict, `src/` layout, React Server Components by default; client
  components only where motion or state needs them.
- **Styling**: Tailwind v4 with the tokens above declared in `@theme`. No component
  library.
- **Motion**: `motion` (Motion for React) for reveals, hover, drag, springs, layout
  animations. `lenis` for smooth scroll, provided once in the root layout, disabled on
  touch devices. One `src/lib/motion.ts` exports shared variants (`fadeUp`, `stagger`,
  `wordReveal`) and a `useReducedMotion` gate so every effect honours
  `prefers-reduced-motion`. Pointer effects (tilt, magnetic) mount only when
  `(hover: hover) and (pointer: fine)` matches.
- **Fonts**: `next/font/local` for Clash Display and Satoshi (woff2 from Fontshare,
  ITF Free Font License), `next/font/google` for JetBrains Mono. `display: swap`.
- **Images**: `next/image` everywhere, AVIF/WebP, explicit `sizes`. Covers 1600×1000,
  portrait 1200×1600.
- **MDX**: `@next/mdx` + `@mdx-js/loader`; `/work/[slug]/page.tsx` does
  a dynamic `import()` of `@/content/work/<slug>.mdx` with `generateStaticParams` from
  `projects.ts`. Unknown slug → `notFound()`.
- **Contact API**: `POST /api/contact`. Body `{ name, email, subject, message, website }`
  where `website` is the honeypot (must be empty). Zod-validated; `message` 20–2000
  chars. Sends via Resend from `onboarding@resend.dev` until a domain exists, to
  `CONTACT_TO`. Reply-To set to the sender. In-memory rate limit: 5 requests per IP per
  10 minutes (`// ponytail: per-instance map, resets on cold start; move to Upstash if
  spam shows up`). Responses: `200 {ok:true}`, `400 {error}`, `429`, `500`. Never echoes
  the message back.
- **SEO**: `metadata` per route, `opengraph-image.tsx` per route via `next/og` (dark
  card, mint mark, title), `sitemap.ts`, `robots.ts`, JSON-LD `Person` on home. Semantic
  landmarks, one `h1` per page, skip link, visible focus rings, contrast ≥ 4.5:1 for
  body text (muted `#8D8B84` on `#0A0A0B` is about 5.8:1).
- **Analytics**: Vercel Web Analytics (free), no cookies, no consent banner needed.
- **Env**: `RESEND_API_KEY`, `CONTACT_TO`, `NEXT_PUBLIC_WHATSAPP` (E.164, digits only),
  `NEXT_PUBLIC_SITE_URL`. `.env.example` committed; `.env.local` ignored.

### Performance targets

Lighthouse mobile ≥ 90 on every category; LCP ≤ 2.5s on a throttled 4G run of the
home page; total JS ≤ 180KB gzipped on the home page; no layout shift from fonts or
images. Motion and Lenis are loaded once; Three.js and GSAP are not used.

## 9. Testing and the gate

| Layer | Tool | Covers |
| --- | --- | --- |
| Unit | Vitest | data schemas (`projects`, `profile`), contact validation, rate limiter, WhatsApp URL builder |
| Component | Vitest + Testing Library | Services accordion (one open), Experience active-stop logic, contact form states |
| E2E smoke | Playwright, Chromium only | home renders all six sections, nav anchors scroll, work cards link to four pages, form shows validation and success (Resend mocked by env), 404 page, reduced-motion run has no `opacity:0` leftovers |
| Static | ESLint, `tsc --noEmit`, `next build` | everything |

Gate, run before any "done" claim and in CI:

```
npm run lint && npm run typecheck && npm test && npm run build && npm run e2e
```

## 10. Repo, CI, deploy

- GitHub: `JosefVito/portfolio`, public, default branch `main`. Work on short-lived
  branches, merge by PR so CI runs; solo, so self-merge after green.
- CI: one workflow, `ci.yml`, on PR and push to `main`: install (npm cache),
  lint, typecheck, unit tests, build, Playwright smoke against the built app.
  `permissions: contents: read`, `timeout-minutes: 15`.
- Vercel: project `josefvito` linked to the repo, production from `main`, preview per
  PR. Env vars set in Vercel, never committed. Domain added later without code change
  (`NEXT_PUBLIC_SITE_URL` updates).
- `gh` on this machine has no `JosefVito` login yet; `gh auth login` for that account
  is a plan step. The `git` identity in this repo is already set to Josef's name and
  email.

## 11. Pause and resume

`HANDOFF.md` at the repo root is the single source of truth for state. It holds:
current phase, what is done (with commit hashes), what is next, blocked items with
who unblocks them, and the content still missing. Every work session ends by updating
it and committing. Any new session starts by reading it, running `git fetch` and the
gate, and continuing from "next". The implementation plan is phased so each phase
ends at a buildable, deployable commit even though public launch happens once.

## 12. Out of scope (deliberately)

CMS or admin UI; blog; i18n; light theme toggle; preloader; custom cursor; 3D;
testimonials (none exist yet; add a section when two real quotes exist); pricing;
newsletter; cookie banner (nothing needs consent); Storybook.

## 13. Content the owner supplies

- Hero portrait (plain background, ≥ 1600px tall, 3:4) and a casual second photo.
- WhatsApp number (E.164) and the inbox for form leads.
- Approval of the bio, About headline, service descriptions and card blurbs drafted here.
- Per case study: problem, 3–4 highlights, outcome, 3–6 screenshots. K-Station is
  drafted from the repo; Little Legend and Dinecta from their live sites plus owner input.
- MacDevelop design renders (PNG/JPG).
- Written OK that K-Station's client name and URL may appear publicly.
- CV updated to `github.com/JosefVito` (the SeptheLegend link 404s).
