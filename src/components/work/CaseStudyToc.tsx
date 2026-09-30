"use client";
import { useEffect, useState } from "react";

const ITEMS = [["context", "Context"], ["what-i-built", "What I built"], ["architecture", "Architecture"], ["outcome", "Outcome"]] as const;

export function CaseStudyToc() {
  const [active, setActive] = useState("context");
  useEffect(() => {
    const els = ITEMS.map(([id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }), { rootMargin: "-20% 0px -70% 0px" });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <nav aria-label="On this page" className="sticky top-32 hidden lg:block">
      <p className="label text-muted">On this page</p>
      <ul className="mt-3 space-y-2">
        {ITEMS.map(([id, label]) => <li key={id}><a href={`#${id}`} className={`label transition-colors ${active === id ? "text-accent" : "text-muted hover:text-fg"}`}>{label}</a></li>)}
      </ul>
    </nav>
  );
}
