"use client";
import { useEffect, useRef, useState } from "react";
import { ProjectCard } from "@/components/work/ProjectCard";
import type { Project } from "@/data/schemas";
import { trackProgress } from "@/lib/track";

export function ProjectTrack({ projects }: { projects: Project[] }) {
  const ref = useRef<HTMLUListElement>(null);
  const [{ ratio, index }, setP] = useState({ ratio: 0, index: 0 });

  useEffect(() => {
    const el = ref.current!;
    const update = () => setP(trackProgress(el.scrollLeft, el.scrollWidth, el.clientWidth, projects.length));
    el.addEventListener("scroll", update, { passive: true });
    // Wheel over the track scrolls it horizontally until it hits an end, then the page takes over.
    const onWheel = (e: WheelEvent) => {
      const atStart = el.scrollLeft <= 0 && e.deltaY < 0;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1 && e.deltaY > 0;
      if (atStart || atEnd || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => { el.removeEventListener("scroll", update); el.removeEventListener("wheel", onWheel); };
  }, [projects.length]);

  const step = (dir: 1 | -1) => {
    const el = ref.current!;
    const card = el.querySelector("li")?.getBoundingClientRect().width ?? 420;
    el.scrollBy({ left: dir * (card + 16), behavior: "smooth" });
  };

  return (
    <div>
      <ul
        ref={ref}
        data-lenis-prevent
        aria-label="Case studies"
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onKeyDown={e => { if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); }}
      >
        {projects.map(p => <ProjectCard key={p.slug} project={p} total={projects.length} />)}
      </ul>
      <div className="mt-6 flex items-center gap-4">
        <button type="button" aria-label="Previous project" onClick={() => step(-1)} className="inline-flex size-9 items-center justify-center rounded-full border border-line text-muted hover:text-fg">←</button>
        <button type="button" aria-label="Next project" onClick={() => step(1)} className="inline-flex size-9 items-center justify-center rounded-full border border-line text-muted hover:text-fg">→</button>
        <div className="relative h-px flex-1 bg-line"><div className="absolute inset-y-0 left-0 bg-accent transition-[width] duration-200" style={{ width: `${ratio * 100}%` }} /></div>
        <p className="display text-lg font-bold tabular-nums" aria-live="polite">{String(index + 1).padStart(2, "0")} <span className="label text-muted">/ {String(projects.length).padStart(2, "0")}</span></p>
      </div>
    </div>
  );
}
