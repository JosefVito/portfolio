import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { TiltCard } from "@/components/ui/TiltCard";
import { WordReveal } from "@/components/ui/WordReveal";
import { Reveal } from "@/components/ui/Reveal";
import { SocialIcons } from "@/components/ui/SocialIcons";
import { profile } from "@/data/profile";
import { whatsappHref } from "@/lib/whatsapp";

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
          <h1 aria-label={`${profile.firstName} ${profile.lastName}`} className="display mt-2 text-[clamp(48px,8vw,112px)] font-bold lg:text-[clamp(48px,5.5vw,88px)]">
            <WordReveal text={profile.firstName} accentFrom={0} delay={0.2} className="block" />
            <WordReveal text={profile.lastName} delay={0.35} className="block font-semibold" />
          </h1>
          <Reveal delay={0.7} className="mt-8 flex flex-wrap gap-3">
            <Button href={whatsappHref()} external>Chat on WhatsApp</Button>
            <Button href="#work" variant="ghost">View work</Button>
          </Reveal>
          <Reveal delay={0.85} className="mt-6"><SocialIcons /></Reveal>
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
          <h2 className="display text-[clamp(36px,5.5vw,80px)] font-bold lg:text-[clamp(36px,4.2vw,64px)]">
            <WordReveal text={profile.title} delay={0.5} className="block" />
            <span className="stroke-text block transition-[-webkit-text-fill-color] hover:[-webkit-text-fill-color:var(--color-fg)]">{profile.titleOutline}</span>
          </h2>
          <p className="label mt-4 text-accent">{profile.tagline}</p>
          <Reveal delay={0.9}><p className="mt-4 max-w-[36ch] text-muted lg:ml-auto">{profile.intro}</p></Reveal>        </div>
      </div>
    </section>
  );
}
