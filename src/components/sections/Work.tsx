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
