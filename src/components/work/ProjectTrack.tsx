"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ProjectCard } from "@/components/work/ProjectCard";
import type { Project } from "@/data/schemas";
import { trackProgress } from "@/lib/track";
import { viewportOnce } from "@/lib/motion";

export function ProjectTrack({ projects }: { projects: Project[] }) {
  const ref = useRef<HTMLUListElement>(null);
  const [{ ratio, index }, setP] = useState({ ratio: 0, index: 0 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current!;
    const update = () => setP(trackProgress(el.scrollLeft, el.scrollWidth, el.clientWidth, projects.length));
    el.addEventListener("scroll", update, { passive: true });
    // No wheel handler on purpose: capturing vertical wheel here froze the page whenever the pointer was over a card.
    // Cards move by drag/swipe, sideways trackpad swipe, the arrow buttons and the arrow keys.
    return () => el.removeEventListener("scroll", update);
  }, [projects.length]);

  const step = (dir: 1 | -1) => {
    const el = ref.current!;
    const card = el.querySelector("li")?.getBoundingClientRect().width ?? 420;
    el.scrollBy({ left: dir * (card + 24), behavior: "smooth" });
  };

  return (
    <div>
      <motion.ul
        ref={ref}
        initial={reduce ? false : "hidden"}
        whileInView="visible"
        viewport={viewportOnce}
        aria-label="Case studies"
        className="track flex snap-x snap-mandatory gap-6 overflow-x-auto overflow-y-hidden py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onKeyDown={e => { if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); }}
      >
        {projects.map(p => <ProjectCard key={p.slug} project={p} total={projects.length} />)}
      </motion.ul>
      <div className="mt-8 flex items-center gap-4">
        <button type="button" aria-label="Previous project" onClick={() => step(-1)} className="inline-flex size-11 items-center justify-center rounded-full border border-line text-muted hover:text-fg">←</button>
        <button type="button" aria-label="Next project" onClick={() => step(1)} className="inline-flex size-11 items-center justify-center rounded-full border border-line text-muted hover:text-fg">→</button>
        <div className="relative h-px flex-1 bg-line"><div className="absolute inset-y-0 left-0 bg-accent transition-[width] duration-200" style={{ width: `${ratio * 100}%` }} /></div>
        <p className="display text-lg font-bold tabular-nums" aria-live="polite">{String(index + 1).padStart(2, "0")} <span className="label text-muted">/ {String(projects.length).padStart(2, "0")}</span></p>
      </div>
    </div>
  );
}
