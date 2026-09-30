import { ServicesList } from "@/components/sections/ServicesList";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { services } from "@/data/services";

export function Services() {
  return (
    <section id="services" className="section">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow text="What I do" />
            <SectionHeading lead="Services that" accent="ship." />
          </div>
          <div className="text-right">
            <p className="display flex items-baseline justify-end gap-2 text-2xl font-bold">{String(services.length).padStart(2, "0")} <span className="label text-muted">capabilities</span></p>
            <p className="label text-muted">design → deploy</p>
          </div>
        </div>
        <ServicesList items={services} />
      </div>
    </section>
  );
}
