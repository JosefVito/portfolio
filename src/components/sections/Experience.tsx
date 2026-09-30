import { ExperienceList } from "@/components/sections/ExperienceList";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { experience } from "@/data/experience";

export function Experience() {
  return (
    <section id="experience" className="section">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow text="Experience" n={3} />
            <SectionHeading lead="From running a cafe to shipping" accent="commerce platforms." />
          </div>
          <div className="text-right">
            <p className="display text-2xl font-bold">{String(experience.length).padStart(2, "0")} <span className="label text-muted">stops</span></p>
            <p className="label text-muted">2023 → now</p>
          </div>
        </div>
        <div className="mt-14"><ExperienceList stops={experience} /></div>
      </div>
    </section>
  );
}
