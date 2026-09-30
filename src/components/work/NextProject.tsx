import Image from "next/image";
import Link from "next/link";
import { TiltCard } from "@/components/ui/TiltCard";
import type { Project } from "@/data/schemas";

export function NextProject({ p }: { p: Project }) {
  return (
    <div className="container-x mt-24 border-t border-line pt-12">
      <p className="label text-muted">Next project</p>
      <TiltCard max={3} className="mt-4">
        <Link href={`/work/${p.slug}`} aria-label={`Next project: ${p.title}`} className="card group flex items-center gap-6 p-4 transition-colors hover:bg-surface-hover">
          <Image src={p.cover} alt="" width={320} height={200} sizes="160px" className="aspect-[16/10] w-40 rounded-lg object-cover" />
          <span className="display text-[clamp(24px,4vw,48px)] font-bold">{p.title} <span className="text-accent transition-transform group-hover:translate-x-1 inline-block">→</span></span>
        </Link>
      </TiltCard>
    </div>
  );
}
