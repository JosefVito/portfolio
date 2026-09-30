import { Chip } from "@/components/ui/Chip";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectTrack } from "@/components/work/ProjectTrack";
import { projects } from "@/data/projects";

const ALSO_BUILT = ["Blurr · Strapi CMS site · client", "Valoteka · landing page · client"];

export function Work() {
  return (
    <section id="work" className="section overflow-hidden">
      <div className="container-x relative">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow text="Selected work" n={5} />
            <SectionHeading lead="Case" accent="studies." />
          </div>
          <div className="text-right">
            <p className="display flex items-baseline justify-end gap-2 text-2xl font-bold">{String(projects.length).padStart(2, "0")} <span className="label text-muted">projects</span></p>
            <p className="label text-muted">↔ drag · swipe · arrows</p>
          </div>
        </div>
        <div className="mt-14"><ProjectTrack projects={projects} /></div>
        <div className="mt-12 flex flex-wrap items-center gap-3">
          <span className="label text-muted">Also built</span>
          {ALSO_BUILT.map(t => <Chip key={t}>{t}</Chip>)}
        </div>
      </div>
    </section>
  );
}
