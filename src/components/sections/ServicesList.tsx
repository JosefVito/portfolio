"use client";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Chip } from "@/components/ui/Chip";
import type { Service } from "@/data/schemas";
import { EASE } from "@/lib/motion";

export function ServicesList({ items }: { items: Service[] }) {
  const [open, setOpen] = useState(0);
  return (
    <ul className="mt-12 border-t border-line">
      {items.map((s, i) => {
        const isOpen = open === i;
        return (
          <li key={s.n} className={`border-b border-line transition-colors ${isOpen ? "border-b-accent/60" : ""}`}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`service-${s.n}`}
              onClick={() => setOpen(i)}
              className="group grid w-full grid-cols-[48px_1fr_auto] items-center gap-4 py-5 text-left md:grid-cols-[64px_1fr_auto_32px]"
            >
              <span className={`label ${isOpen ? "text-accent" : "text-muted"}`}>{String(s.n).padStart(2, "0")} / 06</span>
              <span className={`display text-[clamp(20px,2.4vw,30px)] font-bold transition-transform ${isOpen ? "" : "group-hover:translate-x-1.5"}`}>{s.title}</span>
              <span className="label hidden text-muted md:inline">{s.tags.join(" · ")}</span>
              <span aria-hidden className="label text-right text-muted">{isOpen ? "—" : "+"}</span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div id={`service-${s.n}`} className="overflow-hidden" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: EASE }}>
                  <div className="grid gap-8 pb-8 md:grid-cols-[64px_1fr_1fr] md:gap-4">
                    <span className="hidden md:block" />
                    <div>
                      <p className="max-w-[52ch] text-muted">{s.description}</p>
                      <ul className="mt-4 flex flex-wrap gap-2">{s.chips.map(c => <li key={c}><Chip>{c}</Chip></li>)}</ul>
                    </div>
                    <div>
                      <p className="label text-muted">Includes</p>
                      <ul className="mt-2 space-y-1.5 text-sm">{s.includes.map(x => <li key={x} className="flex gap-3"><span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />{x}</li>)}</ul>
                      <p className="label mt-5 text-muted">Timeline</p>
                      <p className="mt-1 text-sm">{s.timeline}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
