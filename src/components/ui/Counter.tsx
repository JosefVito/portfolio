"use client";
import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { formatStat } from "@/lib/format";

export function Counter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  const [animated, setText] = useState("0");
  const text = reduce ? formatStat(value, value) : animated;

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, value, { duration: 1.2, ease: "easeOut", onUpdate: v => setText(formatStat(v, value)) });
    return () => controls.stop();
  }, [inView, reduce, value]);

  return (
    <div ref={ref}>
      <div className="display text-[clamp(32px,4vw,48px)] font-bold tabular-nums">
        <span data-testid="counter-value">{text}</span>
        {suffix && <span className="text-accent">{suffix}</span>}
      </div>
      <div className="label text-muted mt-1">{label}</div>
    </div>
  );
}
