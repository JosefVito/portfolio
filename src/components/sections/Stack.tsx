import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { stackGroups } from "@/data/stack";
import type { StackTool } from "@/data/schemas";

function Tile({ t }: { t: StackTool }) {
  return (
    <li
      data-tool
      data-hot={t.hot}
      style={{ "--brand": t.brand } as React.CSSProperties}
      className={`group flex flex-col gap-1 rounded-2xl border bg-surface p-5 transition-colors hover:bg-surface-hover md:p-6 ${t.hot ? "border-accent" : "border-line"}`}
    >
      {t.path ? (
        <svg viewBox="0 0 24 24" aria-hidden className="mb-3 size-8 fill-current text-fg/70 transition-colors duration-300 group-hover:text-[color:var(--brand)]"><path d={t.path} /></svg>
      ) : (
        <span aria-hidden className="mb-3 grid size-8 place-items-center rounded-md border border-line font-mono text-xs text-fg/70">{t.letters}</span>
      )}
      <span className="display text-base font-bold">{t.name}</span>
      <span className="text-sm text-muted">{t.note}</span>
    </li>
  );
}

export function Stack() {
  return (
    <section id="stack" className="section">
      <div className="container-x">
        <Eyebrow text="Stack" n={3} />
        <SectionHeading lead="The tools I" accent="ship with." />
        <div className="mt-14 grid gap-12">
          {stackGroups.map(g => (
            <Reveal key={g.title}>
              <h3 className="label text-muted">{g.title}</h3>
              <ul className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {g.tools.map(t => <Tile key={t.name} t={t} />)}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
