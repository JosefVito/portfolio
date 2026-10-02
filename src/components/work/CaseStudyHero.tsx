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
          <Image src={p.cover} alt={`${p.title} cover`} width={1600} height={1000} priority sizes="(min-width: 1440px) 1280px, 92vw" className="aspect-[16/10] w-full rounded-lg object-cover" />
        </div>
      </Reveal>
    </header>
  );
}
