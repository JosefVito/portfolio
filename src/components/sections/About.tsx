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
