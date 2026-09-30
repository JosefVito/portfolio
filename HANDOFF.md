# HANDOFF — read first, update last

**Current phase:** 4 — Content, quality pass, launch
**Next task:** Task 22 (real content, Lighthouse, production launch; needs owner)
**Last green gate:** lint + typecheck + unit tests (44) + build + e2e (64 passed, 12 project-scoped skips) green after Task 21 (2026-09-30)

## Done
- Tasks 1–4: scaffold, tokens/fonts, typed data, placeholder images
- Task 5 (local part): Playwright config, smoke spec, CI workflow
- Tasks 6–10: motion primitives, nav/smooth scroll, footer and UI primitives
- Tasks 19–21: MDX case studies, 404, OG images/sitemap/robots/icon, full e2e (reduced motion, 360px, contact)
- Tasks 11–18: hero, about, experience, work track, services, contact API + form, assembled home page with JSON-LD and manifest

## Polish round (owner review, 2026-09-30)
Done: spaces between animated words, bigger header, aligned hamburger, About word swap + cursor spotlight, Work rising cards + hover spotlight, Contact "SAY HELLO" faint slow crawl, new Stack section with official logos (seven sections now), Experience follows scroll with pinned card, case-study track no longer grabs the wheel, spacing/type scale up, name-first phone hero. Local-only: still not pushed.

## Vercel env vars (set for Production AND Preview)
`RESEND_API_KEY`, `CONTACT_TO` (must be the Resend account email until a domain is verified), `NEXT_PUBLIC_WHATSAPP`, `NEXT_PUBLIC_SITE_URL`. A production build now fails if the site URL cannot be resolved; contact failures are logged with a `[contact]` prefix.

## Blocked / waiting on owner
- Task 5 owner steps: `gh auth login` as JosefVito, create repo and push, branch protection, create Vercel project + env vars, enable Analytics. Nothing has been pushed yet.

## Content still missing (see spec §13)
- Hero portrait, About photo, WhatsApp number, lead inbox, case-study screenshots, MacDevelop renders, public OK for K-Station name, CV link fix.
