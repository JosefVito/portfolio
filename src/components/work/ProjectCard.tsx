import Image from "next/image";
import Link from "next/link";
import { Chip } from "@/components/ui/Chip";
import { TiltCard } from "@/components/ui/TiltCard";
import type { Project } from "@/data/schemas";

export function ProjectCard({ project: p, total }: { project: Project; total: number }) {
  return (
    <li className="w-[78vw] shrink-0 snap-start sm:w-[420px]">
      <TiltCard max={4} className="h-full">
        <Link href={`/work/${p.slug}`} className="group card block h-full p-3 transition-colors hover:bg-surface-hover">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[10px]">
            <Image src={p.cover} alt={`${p.title} cover`} fill sizes="(min-width: 640px) 420px, 78vw" className="object-cover transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-3 group-hover:scale-[1.03]" />
            {p.status === "in-progress" && <span className="absolute left-3 top-3"><Chip accent>In progress</Chip></span>}
            <span className="absolute bottom-3 left-3 rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-accent-ink transition-transform group-hover:-translate-y-1">View case study →</span>
            <span className="absolute bottom-3 right-3"><Chip>{p.type}</Chip></span>
          </div>
          <div className="flex justify-between label mt-4 text-muted"><span>{String(p.n).padStart(2, "0")} / {String(total).padStart(2, "0")}</span><span>{p.year}</span></div>
          <h3 className="display mt-2 text-2xl font-bold">{p.title}</h3>
          <p className="mt-2 text-sm text-muted">{p.blurb}</p>
          <ul className="mt-4 flex flex-wrap gap-2">{p.chips.map(c => <li key={c}><Chip>{c}</Chip></li>)}</ul>
        </Link>
      </TiltCard>
    </li>
  );
}
