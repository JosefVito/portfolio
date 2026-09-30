# Socials and text cleanup plan

**Goal:** remove three bits of small print, and replace the footer's location/clock/"Built with" line with six brand icons that open the real profiles.

## 1. Removals
| Where | Remove |
|---|---|
| `Hero.tsx:70` | `Scroll ↓ · 01 / 07` |
| Section eyebrows (About, Stack, Experience, Work, Services, Contact) | the `· 02 / 07` step counters. `Eyebrow` loses its `n`/`total` props. The eyebrow label stays. |
| `ContactForm.tsx:54` | `Sent via Resend · no newsletter, ever` |
| `Footer.tsx:21` | `Siargao, PH · 16:33 · Built with Next.js` (the `©` name and year stay) |

Left alone: the `01 / 04` project counter in the Work track and the `02 / 04` card in Experience, because those are real counters. Say if "every step" should include them.

Cleanup: `LocalTime` and `lib/time.ts` become unused, so both files and their tests are deleted.

## 2. Social icons
- One data file `src/data/socials.ts`: gmail (`mailto:` from `profile.email`), github, linkedin, instagram, facebook, whatsapp (existing `whatsappHref()`). Instagram and Facebook URLs are new `profile.socials` fields, validated by the schema.
- One component `SocialIcons` (server component): a row of round icon links, each `target=_blank`, `rel=noreferrer`, with an `aria-label` and hover to white. Logo paths are inlined from Simple Icons (Gmail, GitHub, Instagram, Facebook, WhatsApp). Simple Icons no longer ships LinkedIn, so it reuses the LinkedIn mark already in the hero.
- Footer shows `SocialIcons` in place of the removed line. The hero's two icons and the mobile menu's text links can reuse the same component so there is a single source of links (optional, say if you want it).

## 3. Tests (written first, watched failing)
- Unit: `socials.test.ts` (six entries, every URL valid, order); `SocialIcons.test.tsx` (six links with correct hrefs and labels, external links safe); Footer test (icons present, no clock text).
- Unit: Hero and eyebrow tests assert the removed strings are gone.
- E2E: footer has six social links; page contains none of the removed strings.

## 4. What I need from you
Your real links: Instagram, Facebook, and confirm GitHub `github.com/JosefVito`, LinkedIn `linkedin.com/in/josefvitoevangelista`, and the WhatsApp number (`NEXT_PUBLIC_WHATSAPP`). Gmail uses `josefvitomangalino@gmail.com` unless you want another.

Until the Instagram and Facebook links arrive I will build with clearly marked placeholder URLs and fail the unit test on them, so they cannot ship by accident.
