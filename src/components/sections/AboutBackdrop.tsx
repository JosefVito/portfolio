"use client";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { usePointerFine } from "@/lib/use-pointer-fine";

const WORD = "font-display display stroke-faint absolute font-bold text-[clamp(64px,13vw,200px)] leading-none whitespace-nowrap";

/** Behind the About section: OPERATOR slides into ENGINEER as you scroll through, over a dot grid the cursor lights up. */
export function AboutBackdrop() {
  const box = useRef<HTMLDivElement>(null);
  const dots = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const fine = usePointerFine();
  const { scrollYProgress: p } = useScroll({ target: box, offset: ["start end", "end start"] });
  const opY = useTransform(p, [0.4, 0.55], ["0%", "-100%"]);
  const opO = useTransform(p, [0.05, 0.2, 0.42, 0.55], [0, 1, 1, 0]);
  const enY = useTransform(p, [0.4, 0.55], ["100%", "0%"]);
  const enO = useTransform(p, [0.4, 0.52, 0.85, 0.98], [0, 1, 1, 0]);

  useEffect(() => {
    const section = box.current?.closest("section");
    if (!fine || !section) return;
    const move = (e: PointerEvent) => {
      const r = dots.current!.getBoundingClientRect();
      dots.current!.style.setProperty("--mx", `${e.clientX - r.left}px`);
      dots.current!.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    section.addEventListener("pointermove", move);
    return () => section.removeEventListener("pointermove", move);
  }, [fine]);

  return (
    <div ref={box} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden select-none">
      <div ref={dots} data-dots className="absolute inset-0">
        <div className="dots-base absolute inset-0" />
        {fine && <div className="dots-lit absolute inset-0" />}
      </div>
      <div data-swap className="absolute inset-0 grid place-items-center">
        {reduce ? (
          <span className={`${WORD} !static text-[clamp(48px,9vw,140px)]`}>OPERATOR ✦ ENGINEER</span>
        ) : (
          <>
            <motion.span className={WORD} style={{ y: opY, opacity: opO }}>OPERATOR</motion.span>
            <motion.span className={WORD} style={{ y: enY, opacity: enO }}>ENGINEER</motion.span>
          </>
        )}
      </div>
    </div>
  );
}
