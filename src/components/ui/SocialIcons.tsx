import { getSocials } from "@/data/socials";

/** Row of round brand-icon links. mailto opens the mail app; the rest open in a new tab. */
export function SocialIcons({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap items-center gap-3 ${className}`}>
      {getSocials().map(s => (
        <li key={s.id}>
          <a
            href={s.href}
            aria-label={s.label}
            title={s.label}
            {...(s.external ? { target: "_blank", rel: "noreferrer" } : {})}
            className="inline-flex size-11 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-fg hover:text-fg"
          >
            <svg viewBox="0 0 24 24" aria-hidden className="size-[18px] fill-current"><path d={s.path} /></svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
