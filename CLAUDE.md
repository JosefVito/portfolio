# josefvito-portfolio — workspace rules

Dark, animated, single-page freelance portfolio + four case-study pages. Next.js 16 App
Router, Tailwind 4, Motion, Lenis, MDX, Resend. Spec: `docs/superpowers/specs/`. Plan:
`docs/superpowers/plans/`. State: `HANDOFF.md` (read first, update last, every session).

@AGENTS.md

## Rules
- Content lives in `src/data/*.ts` and `src/content/work/*.mdx`. No CMS, no database.
- Server components by default; `"use client"` only for motion or state.
- Every animation honours `prefers-reduced-motion`. Pointer effects only on `(hover: hover) and (pointer: fine)`.
- Accent `#45F0B4` only on: status dot, primary button, one phrase per headline, active timeline node, progress bar, outline of the four main Stack tools, and the cursor-lit dots in About (owner approved these two extras).
- Never name a utility `text-outline`: Tailwind reads it as the outline colour token and fills letters grey. Use `stroke-text` / `stroke-faint`.
- No new dependency for what a few lines do. Mark shortcuts with `// ponytail:`.
- TDD: failing test → minimal code → green → commit.

## Verification (the gate)
`npm run lint && npm run typecheck && npm test && npm run build && npm run e2e`
(`e2e` needs a prior `npm run build`; it starts `next start` with `CONTACT_DRY_RUN=1`.)

## Deploy
GitHub `JosefVito/portfolio` → Vercel project `josefvito`, production from `main`, preview per PR.
Env vars live in Vercel, never in git.
