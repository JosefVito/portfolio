"use client";
import Image from "next/image";
import { useState } from "react";

export function Screenshots({ items }: { items: { src: string; alt: string }[] }) {
  const [big, setBig] = useState<number | null>(null);
  return (
    <ul className="mt-6 grid gap-4 sm:grid-cols-2">
      {items.map((s, i) => (
        <li key={s.src} className={big === i ? "sm:col-span-2" : ""}>
          <button type="button" onClick={() => setBig(big === i ? null : i)} aria-label={big === i ? `Shrink: ${s.alt}` : `Enlarge: ${s.alt}`} className="card block w-full overflow-hidden p-1.5 text-left">
            <Image src={s.src} alt={s.alt} width={1600} height={1000} sizes="(min-width: 640px) 50vw, 92vw" className="aspect-[16/10] w-full rounded-md object-cover" />
          </button>
          <p className="label mt-2 text-muted">{s.alt}</p>
        </li>
      ))}
    </ul>
  );
}
