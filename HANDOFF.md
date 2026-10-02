# HANDOFF — read first, update last

**Current phase:** 4 — Content, quality pass, launch
**Next task:** Task 22 (real content, Lighthouse, production launch; needs owner)
**Last green gate:** lint + typecheck + unit tests (67) + build + e2e (92 passed, 56 project-scoped skips; run against the dev server on :3000) after the real-content pass (2026-10-02)

## Done
- Tasks 1–4: scaffold, tokens/fonts, typed data, placeholder images
- Task 5 (local part): Playwright config, smoke spec, CI workflow
- Tasks 6–10: motion primitives, nav/smooth scroll, footer and UI primitives
- Tasks 19–21: MDX case studies, 404, OG images/sitemap/robots/icon, full e2e (reduced motion, 360px, contact)
- Tasks 11–18: hero, about, experience, work track, services, contact API + form, assembled home page with JSON-LD and manifest

## Polish round (owner review, 2026-09-30)
Done: spaces between animated words, bigger header, aligned hamburger, About word swap + cursor spotlight, Work rising cards + hover spotlight, Contact "SAY HELLO" faint slow crawl, new Stack section with official logos (seven sections now), Experience follows scroll with pinned card, case-study track no longer grabs the wheel, spacing/type scale up, name-first phone hero. Local-only: still not pushed.

## Socials (done)
One data source `src/data/socials.ts` feeds the icon row in the footer, hero and phone menu (Gmail, GitHub, LinkedIn, Instagram, Facebook, WhatsApp). Scroll hint, section step counters, "Sent via Resend" line and the footer location/clock/built-with line are removed.

## Vercel env vars (set for Production AND Preview)
`RESEND_API_KEY`, `CONTACT_TO` (must be the Resend account email until a domain is verified), `NEXT_PUBLIC_WHATSAPP` = `639150623492` (PH number, 63 + 10 digits, no plus), `NEXT_PUBLIC_SITE_URL`. A production build now fails if the site URL cannot be resolved; contact failures are logged with a `[contact]` prefix.

## Blocked / waiting on owner
- Task 5 owner steps: `gh auth login` as JosefVito, create repo and push, branch protection, create Vercel project + env vars, enable Analytics. Nothing has been pushed yet.

## Real content (2026-10-02)
Done: hero portrait (owner selfie; WiFi password and house-rules sign blurred, do not re-crop), About photo, all 12 project images (1600x1000 JPEG: live-site captures for K-Station, Little Legend, Dinecta; Figma exports for MacDevelop, file CQ1Z1aiGzjfK7Z8aUKTgrc), K-Station live link now https://k-station-nine.vercel.app/nl until it has a domain. Owner OKs publishing K-Station's name and screenshots.
Photo-fit fixes: hero type smaller at lg so the portrait column isn't starved; case-study cover box 16:10 to match images; card overlay chips get a dark backing; the work track owns the rise trigger (off-screen cards no longer leave the track vertically scrollable).
Gotcha: after replacing a file in public/images, clear `.next/cache/images` and `.next/dev/cache/images` or the optimizer keeps serving the old picture locally.

## Content still missing (see spec §13)
- Case-study wording review, CV link (unclear if wanted). WhatsApp number and lead inbox are already set (see env vars).
