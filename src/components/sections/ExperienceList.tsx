"use client";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Chip } from "@/components/ui/Chip";
import type { Stop } from "@/data/schemas";
import { EASE } from "@/lib/motion";

function Detail({ s, i, total }: { s: Stop; i: number; total: number }) {
  return (
    <>
      <div className="flex justify-between label text-muted">
        <span>{s.dates} · {s.location}</span>
        <span className="text-accent">{String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
      </div>
      <p className="label mt-6 text-muted">{s.role}</p>
      <p className="display mt-1 text-[clamp(24px,3vw,36px)] font-bold">{s.company}</p>
      <p className="mt-3 text-muted">{s.summary}</p>
      <p className="label mt-6 text-muted">Highlights</p>
      <ul className="mt-2 space-y-2 text-sm">
        {s.highlights.map(h => <li key={h} className="flex gap-3"><span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />{h}</li>)}
      </ul>
      <ul className="mt-6 flex flex-wrap gap-2">{s.stack.map(t => <li key={t}><Chip>{t}</Chip></li>)}</ul>
    </>
  );
}

export function ExperienceList({ stops }: { stops: Stop[] }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 80%", "end 60%"] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Desktop only (that is where the pinned card lives): the stop crossing the middle of the screen becomes active.
  useEffect(() => {
    const list = listRef.current;
    if (!list || !window.matchMedia("(min-width: 1024px)").matches) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index)); });
    }, { rootMargin: "-45% 0px -45% 0px" });
    list.querySelectorAll<HTMLElement>(":scope > li").forEach(li => io.observe(li));
    return () => io.disconnect();
  }, []);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
      <ol ref={listRef} className="relative">
        {/* line x = 60px year column + 24px gap = 84px, the same x as the node centres */}
        <motion.span aria-hidden className="absolute left-[84px] top-2 bottom-2 w-px origin-top bg-accent/60" style={{ scaleY }} />
        <span aria-hidden className="absolute left-[84px] top-2 bottom-2 w-px bg-line" />
        {stops.map((s, i) => {
          const isActive = active === i;
          const isOpen = open === i;
          return (
            <li key={s.id} data-index={i} className="grid grid-cols-[60px_1fr] gap-x-6">
              <span className="label pt-3 text-right text-muted">{s.yearLabel}</span>
              <div className="relative pb-10 pl-10 lg:pb-32">
                <span aria-hidden className={`absolute left-[-3px] top-4 size-[7px] rounded-full transition-all ${isActive ? "bg-accent shadow-[0_0_10px_var(--color-accent-glow)]" : "bg-line"}`} />
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`stop-${s.id}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => { setActive(i); setOpen(isOpen ? null : i); }}
                  className="block w-full text-left"
                >
                  <span className={`display block text-lg font-bold transition-transform ${isActive ? "translate-x-1" : ""}`}>{s.role}</span>
                  <span className="block text-sm text-muted">{s.company} · {s.location}</span>
                  <Chip>{s.type}</Chip>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div id={`stop-${s.id}`} className="overflow-hidden lg:hidden" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: EASE }}>
                      <div className="card mt-4 p-6"><Detail s={s} i={i} total={stops.length} /></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </li>
          );
        })}
      </ol>
      <div className="hidden lg:block">
        <div data-testid="detail-card" className="card sticky top-36 p-10">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={stops[active].id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, ease: EASE }}>
              <Detail s={stops[active]} i={active} total={stops.length} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
