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
        <div className="order-1">
          <Reveal delay={0.1}>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-sm">
              <span aria-hidden className="size-2 rounded-full bg-accent shadow-[0_0_10px_var(--color-accent-glow)] motion-safe:animate-pulse" />
              {profile.availability}
            </span>
          </Reveal>
          <p className="label mt-8 text-muted">— I&apos;m</p>
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

        <div className="order-2">
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
            <span className="stroke-text block transition-[-webkit-text-fill-color] hover:[-webkit-text-fill-color:var(--color-fg)]">{profile.titleOutline}</span>
          </h2>
          <p className="label mt-4 text-accent">{profile.tagline}</p>
          <Reveal delay={0.9}><p className="mt-4 max-w-[36ch] text-muted lg:ml-auto">{profile.intro}</p></Reveal>
          <p className="label mt-12 text-muted motion-safe:animate-pulse lg:mt-24">Scroll ↓ · 01 / 07</p>
        </div>
      </div>
    </section>
  );
}
